'use client'
import { useState } from 'react'
import type { Slide } from '@/types/slide'
import {
  type SlideMaster, newBlankMaster, masterFromSlide, snapshotOf,
} from '@/lib/editor/slide-masters'
import { SlideElementsRaw } from '@/components/slides/SlideElementsView'
import { masterElementsForSlide } from '@/lib/editor/slide-masters'
import { X, Plus, Trash2, Star, Check, Pencil, LayoutTemplate, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface Props {
  masters: SlideMaster[]
  onChange: (masters: SlideMaster[]) => void
  slides: Slide[]
  selectedSlide: Slide | null
  /** Re-stamp a just-edited master onto the slides using it. */
  onMasterEdited: (master: SlideMaster) => void
  persisted: boolean
  onClose: () => void
}

/** Small 16:9 thumbnail of a master's furniture on a white card. */
function MasterThumb({ master }: { master: SlideMaster }) {
  // Reuse the slide renderer by faking a slide that only carries this master's snapshot.
  const fakeSlide = { content: { _masterSnapshot: snapshotOf(master) } } as unknown as Slide
  return (
    <div className="relative w-full bg-white rounded-none border border-border overflow-hidden" style={{ aspectRatio: '16 / 9' }}>
      <SlideElementsRaw elements={masterElementsForSlide(fakeSlide)} />
    </div>
  )
}

export function SlideMastersDialog({ masters, onChange, slides, selectedSlide, onMasterEdited, persisted, onClose }: Props) {
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [draftName, setDraftName] = useState('')

  const commitMasters = (next: SlideMaster[]) => onChange(next)

  const addBlank = () => {
    const m = newBlankMaster(`Master ${masters.length + 1}`)
    commitMasters([...masters, m])
    setRenamingId(m.id); setDraftName(m.name)
  }

  const addFromSlide = () => {
    if (!selectedSlide) { toast.error('Select a slide first'); return }
    const m = masterFromSlide(selectedSlide, `${selectedSlide.title || 'Slide'} master`)
    commitMasters([...masters, m])
    toast.success('Saved current slide as a master')
    setRenamingId(m.id); setDraftName(m.name)
  }

  const updateFromSlide = (id: string) => {
    if (!selectedSlide) { toast.error('Select a slide first'); return }
    const src = masterFromSlide(selectedSlide, '')
    const next = masters.map((m) => m.id === id
      ? { ...m, background: src.background, elements: src.elements, updatedAt: new Date().toISOString() }
      : m)
    commitMasters(next)
    const edited = next.find((m) => m.id === id)!
    onMasterEdited(edited)
    toast.success('Master updated from this slide')
  }

  const setDefault = (id: string) => {
    commitMasters(masters.map((m) => ({ ...m, isDefault: m.id === id })))
  }

  const remove = (id: string) => {
    if (masters.length <= 1) { toast.error('Keep at least one master'); return }
    const wasDefault = masters.find((m) => m.id === id)?.isDefault
    let next = masters.filter((m) => m.id !== id)
    if (wasDefault && next.length) next = next.map((m, i) => ({ ...m, isDefault: i === 0 }))
    commitMasters(next)
  }

  const commitRename = (id: string) => {
    const name = draftName.trim() || 'Untitled master'
    commitMasters(masters.map((m) => (m.id === id ? { ...m, name } : m)))
    setRenamingId(null)
  }

  const fmtDate = (iso: string) => {
    try { return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) }
    catch { return '' }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-card border border-border w-full max-w-3xl max-h-[85vh] flex flex-col rounded-none shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <LayoutTemplate className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Slide Masters</h2>
            <span className="text-xs text-muted-foreground">· branded, reusable layouts</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-none text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-border shrink-0">
          <button onClick={addBlank} className="flex items-center gap-1.5 px-3 py-1.5 rounded-none text-xs font-medium text-foreground border border-border hover:bg-muted transition-colors">
            <Plus className="w-3.5 h-3.5" /> New master
          </button>
          <button onClick={addFromSlide} disabled={!selectedSlide} className="flex items-center gap-1.5 px-3 py-1.5 rounded-none text-xs font-medium text-foreground border border-border hover:bg-muted transition-colors disabled:opacity-40 disabled:pointer-events-none">
            <Copy className="w-3.5 h-3.5" /> Save current slide as master
          </button>
          <span className="ml-auto text-[11px] text-muted-foreground">
            {persisted ? 'Synced to your account' : 'Saved on this device — run the DB migration to sync'}
          </span>
        </div>

        {/* Master grid */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {masters.map((m) => (
            <div key={m.id} className={cn('group border rounded-none overflow-hidden transition-colors', m.isDefault ? 'border-primary' : 'border-border')}>
              <MasterThumb master={m} />
              <div className="p-2.5 space-y-1.5 bg-background/40">
                {renamingId === m.id ? (
                  <input
                    autoFocus
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                    onBlur={() => commitRename(m.id)}
                    onKeyDown={(e) => { if (e.key === 'Enter') commitRename(m.id); if (e.key === 'Escape') setRenamingId(null) }}
                    className="w-full h-7 px-2 text-xs bg-background border border-border rounded-none text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                ) : (
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-medium text-foreground truncate flex-1">{m.name}</p>
                    {m.isDefault && <span className="text-[9px] font-semibold uppercase tracking-wide text-primary bg-primary/10 px-1.5 py-0.5">Default</span>}
                  </div>
                )}
                <p className="text-[10px] text-muted-foreground">Created {fmtDate(m.createdAt)}</p>
                <div className="flex items-center gap-1 pt-0.5">
                  <IconBtn title="Set as default" onClick={() => setDefault(m.id)} active={m.isDefault}><Star className="w-3 h-3" /></IconBtn>
                  <IconBtn title="Rename" onClick={() => { setRenamingId(m.id); setDraftName(m.name) }}><Pencil className="w-3 h-3" /></IconBtn>
                  <IconBtn title="Update from current slide" onClick={() => updateFromSlide(m.id)} disabled={!selectedSlide}><Check className="w-3 h-3" /></IconBtn>
                  <IconBtn title="Delete" onClick={() => remove(m.id)} danger><Trash2 className="w-3 h-3" /></IconBtn>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="px-5 py-2.5 border-t border-border shrink-0 text-[11px] text-muted-foreground">
          Design a slide the way you like it, then <span className="text-foreground font-medium">Save current slide as master</span>. Apply a master to any slide from its <span className="text-foreground font-medium">Slide Settings → Slide master</span> picker.
        </div>
      </div>
    </div>
  )
}

function IconBtn({ children, title, onClick, active, danger, disabled }: {
  children: React.ReactNode; title: string; onClick: () => void; active?: boolean; danger?: boolean; disabled?: boolean
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'p-1.5 rounded-none transition-colors',
        active ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted',
        danger && 'hover:text-destructive hover:bg-destructive/10',
        disabled && 'opacity-40 pointer-events-none',
      )}
    >
      {children}
    </button>
  )
}
