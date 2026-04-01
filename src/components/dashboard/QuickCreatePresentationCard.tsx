'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Loader2 } from 'lucide-react'

export function QuickCreatePresentationCard() {
  const router = useRouter()
  const [creating, setCreating] = useState(false)

  async function handleClick() {
    if (creating) return
    setCreating(true)
    try {
      const res = await fetch('/api/presentations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Untitled Session', description: '' }),
      })
      const data = await res.json()
      if (res.ok) {
        router.push(`/presentations/${data.presentation.id}/edit`)
      }
    } catch {
      // ignore
    } finally {
      setCreating(false)
    }
  }

  return (
    <button onClick={handleClick} disabled={creating} className="group text-left w-full">
      <div className="relative bg-primary/5 border border-primary/20 rounded-2xl p-5 hover:bg-primary/10 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden dark:[box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.03)_inset]">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
          {creating ? (
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
          ) : (
            <Plus className="w-5 h-5 text-primary" />
          )}
        </div>
        <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Create New</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Start from scratch</p>
      </div>
    </button>
  )
}
