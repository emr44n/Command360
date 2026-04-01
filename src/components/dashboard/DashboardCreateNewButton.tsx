'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Loader2, Presentation, Clapperboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

export function DashboardCreateNewButton() {
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
      <Button
        onClick={() => setShowDialog(true)}
        disabled={creating}
        className="rounded-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
        Create New
      </Button>

      <Dialog open={showDialog} onOpenChange={(open) => { setShowDialog(open); if (!open) { setSelectedType(null); setNewTitle('') } }}>
        <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle className="text-lg font-semibold">Create New</DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">Choose what you want to create</p>
          </DialogHeader>
          <div className="px-6 pb-6 grid gap-3">
            <div className={cn(
              'rounded-xl border bg-card transition-all duration-200 text-left overflow-hidden',
              selectedType === 'presentation' ? 'border-primary/40 bg-primary/[0.04]' : 'border-border hover:border-primary/30 hover:bg-primary/[0.04]'
            )}>
              <button
                onClick={() => { setSelectedType('presentation'); setNewTitle('') }}
                className="group flex items-start gap-4 p-4 w-full text-left"
              >
                <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/[0.15] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200">
                  <Presentation className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">Command Classroom</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
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
                    className="flex-1 h-9 px-3 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <button
                    onClick={() => createPresentation('presentation', newTitle)}
                    disabled={creating}
                    className="h-9 px-4 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-500 transition-colors disabled:opacity-70"
                  >
                    {creating ? 'Creating...' : 'Create Session'}
                  </button>
                </div>
              )}
            </div>
            <div className={cn(
              'rounded-xl border bg-card transition-all duration-200 text-left overflow-hidden',
              selectedType === 'command_studio' ? 'border-primary/40 bg-primary/[0.04]' : 'border-border hover:border-primary/30 hover:bg-primary/[0.04]'
            )}>
              <button
                onClick={() => { setSelectedType('command_studio'); setNewTitle('') }}
                className="group flex items-start gap-4 p-4 w-full text-left"
              >
                <div className="w-11 h-11 rounded-xl bg-violet-500/10 border border-violet-500/[0.15] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200">
                  <Clapperboard className="w-5 h-5 text-violet-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">Command Studio</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
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
                    className="flex-1 h-9 px-3 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <button
                    onClick={() => createPresentation('command_studio', newTitle)}
                    disabled={creating}
                    className="h-9 px-4 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-500 transition-colors disabled:opacity-70"
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
