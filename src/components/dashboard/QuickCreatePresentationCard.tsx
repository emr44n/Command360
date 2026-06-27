'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Loader2, Presentation, Clapperboard } from 'lucide-react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

export function QuickCreatePresentationCard() {
  const router = useRouter()
  const [showDialog, setShowDialog] = useState(false)
  const [selectedType, setSelectedType] = useState<'presentation' | 'command_studio' | null>(null)
  const [newTitle, setNewTitle] = useState('')
  const [creating, setCreating] = useState(false)

  async function createPresentation(type: 'presentation' | 'command_studio', title?: string) {
    if (creating) return
    setCreating(true)
    setShowDialog(false)
    setSelectedType(null)
    setNewTitle('')
    try {
      const finalTitle = title?.trim() || (type === 'command_studio' ? 'Untitled Scene' : 'Untitled Session')
      const res = await fetch('/api/presentations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: finalTitle, description: '' }),
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem('c360_onboard_presentation', 'true')
        if (type === 'command_studio') {
          await fetch('/api/slides', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              presentation_id: data.presentation.id,
              slide_type: 'studio',
              position: 0,
              title: 'Scene 1',
            }),
          })
          router.push(`/presentations/${data.presentation.id}/edit`)
        } else {
          router.push(`/presentations/${data.presentation.id}/edit`)
        }
      }
    } catch {} finally {
      setCreating(false)
    }
  }

  return (
    <>
      <button onClick={() => setShowDialog(true)} disabled={creating} className="group text-left w-full h-full">
        <div className="v5-pop relative h-full bg-[#16191E] border border-white/12 p-5 hover:border-[#C9241A]/50 cursor-pointer overflow-hidden">
          {/* Square colour accent */}
          <div className="w-10 h-10 bg-[#C9241A]/15 flex items-center justify-center mb-3">
            {creating ? (
              <Loader2 className="w-5 h-5 text-[#C9241A] animate-spin" />
            ) : (
              <Plus className="w-5 h-5 text-[#C9241A]" />
            )}
          </div>
          <h3 className="ff-display text-sm font-semibold text-white group-hover:text-[#C9241A] transition-colors">Create New</h3>
          <p className="ff-mono text-[11px] uppercase tracking-[0.1em] text-[#9aa0a8] mt-1">Classroom or Studio</p>
        </div>
      </button>

      <Dialog open={showDialog} onOpenChange={(open) => { setShowDialog(open); if (!open) { setSelectedType(null); setNewTitle('') } }}>
        <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle className="text-lg font-semibold">Create New</DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">Choose what you want to create</p>
          </DialogHeader>
          <div className="px-6 pb-6 grid gap-3">
            <div className={cn(
              'border bg-[#16191E] transition-colors duration-200 text-left overflow-hidden',
              selectedType === 'presentation' ? 'border-[#C9241A]/50 bg-[#C9241A]/[0.06]' : 'border-white/12 hover:border-white/25'
            )}>
              <button
                onClick={() => { setSelectedType('presentation'); setNewTitle('') }}
                className="group flex items-start gap-4 p-4 w-full text-left"
              >
                <div className="w-11 h-11 bg-[#3E6DC4]/10 border border-[#3E6DC4]/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200">
                  <Presentation className="w-5 h-5 text-[#3E6DC4]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="ff-display text-sm font-semibold text-white">Command Classroom</p>
                  <p className="ff-body text-xs text-[#9aa0a8] mt-0.5">
                    Interactive sessions with polls, quizzes, word clouds, and live audience participation
                  </p>
                </div>
              </button>
              {selectedType === 'presentation' && (
                <div className="px-4 pb-4 flex gap-2">
                  <input
                    type="text"
                    autoFocus
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') createPresentation('presentation', newTitle) }}
                    placeholder="Untitled Session"
                    className="flex-1 h-9 px-3 border border-white/12 bg-[#0F1216] text-sm text-white placeholder:text-[#9aa0a8] focus:outline-none focus:border-[#C9241A]/50"
                  />
                  <button
                    onClick={() => createPresentation('presentation', newTitle)}
                    disabled={creating}
                    className="h-9 px-4 bg-[#C9241A] text-white text-sm font-semibold hover:bg-[#e02d22] transition-colors disabled:opacity-70"
                  >
                    {creating ? 'Creating...' : 'Create Session'}
                  </button>
                </div>
              )}
            </div>
            <div className={cn(
              'border bg-[#16191E] transition-colors duration-200 text-left overflow-hidden',
              selectedType === 'command_studio' ? 'border-[#C9241A]/50 bg-[#C9241A]/[0.06]' : 'border-white/12 hover:border-white/25'
            )}>
              <button
                onClick={() => { setSelectedType('command_studio'); setNewTitle('') }}
                className="group flex items-start gap-4 p-4 w-full text-left"
              >
                <div className="w-11 h-11 bg-[#6a5ea8]/10 border border-[#6a5ea8]/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200">
                  <Clapperboard className="w-5 h-5 text-[#6a5ea8]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="ff-display text-sm font-semibold text-white">Command Studio</p>
                  <p className="ff-body text-xs text-[#9aa0a8] mt-0.5">
                    Scene-based editor with canvas, timeline, layers, and timed events
                  </p>
                </div>
              </button>
              {selectedType === 'command_studio' && (
                <div className="px-4 pb-4 flex gap-2">
                  <input
                    type="text"
                    autoFocus
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') createPresentation('command_studio', newTitle) }}
                    placeholder="Untitled Scene"
                    className="flex-1 h-9 px-3 border border-white/12 bg-[#0F1216] text-sm text-white placeholder:text-[#9aa0a8] focus:outline-none focus:border-[#C9241A]/50"
                  />
                  <button
                    onClick={() => createPresentation('command_studio', newTitle)}
                    disabled={creating}
                    className="h-9 px-4 bg-[#C9241A] text-white text-sm font-semibold hover:bg-[#e02d22] transition-colors disabled:opacity-70"
                  >
                    {creating ? 'Creating...' : 'Create Scene'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
