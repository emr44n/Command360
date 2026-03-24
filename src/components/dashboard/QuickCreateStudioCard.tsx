'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Monitor, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export function QuickCreateStudioCard() {
  const router = useRouter()
  const [creating, setCreating] = useState(false)

  async function handleClick() {
    if (creating) return
    setCreating(true)

    try {
      // Create a new presentation
      const presRes = await fetch('/api/presentations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Command Studio', description: '' }),
      })
      if (!presRes.ok) throw new Error('Failed to create presentation')
      const presData = await presRes.json()

      // Create a studio slide
      const slideRes = await fetch('/api/slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          presentation_id: presData.presentation.id,
          slide_type: 'studio',
          position: 0,
          title: '',
        }),
      })
      if (!slideRes.ok) {
        const slideErr = await slideRes.json().catch(() => ({}))
        if (slideErr.migration_needed) {
          toast.error('Database migration needed for Command Studio. Run the SQL migration in Supabase.', { duration: 8000 })
          // Still redirect — the presentation was created, user can add studio slide after migration
          router.push(`/presentations/${presData.presentation.id}/edit`)
          return
        }
        throw new Error('Failed to create slide')
      }

      toast.success('Command Studio presentation created!')
      router.push(`/presentations/${presData.presentation.id}/edit`)
    } catch {
      toast.error('Failed to create presentation')
      setCreating(false)
    }
  }

  return (
    <button onClick={handleClick} disabled={creating} className="group text-left w-full">
      <div className="relative bg-red-500/5 border border-red-500/20 rounded-2xl p-5 hover:bg-red-500/10 hover:border-red-500/30 hover:shadow-lg hover:shadow-red-500/5 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden dark:[box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.03)_inset]">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
        <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
          {creating ? (
            <Loader2 className="w-5 h-5 text-red-500 animate-spin" />
          ) : (
            <Monitor className="w-5 h-5 text-red-500" />
          )}
        </div>
        <h3 className="text-sm font-semibold text-foreground group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">Command Studio</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Interactive scenario</p>
      </div>
    </button>
  )
}
