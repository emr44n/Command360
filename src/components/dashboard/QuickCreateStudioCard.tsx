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
    <button onClick={handleClick} disabled={creating} className="group text-left w-full h-full">
      <div className="v5-pop relative h-full bg-[#16191E] dash-light:bg-white dash-card-elev border border-white/12 dash-light:border-black/10 p-5 hover:border-[#C9241A]/50 cursor-pointer overflow-hidden">
        {/* Square colour accent */}
        <div className="w-10 h-10 bg-[#C9241A]/15 flex items-center justify-center mb-3">
          {creating ? (
            <Loader2 className="w-5 h-5 text-[#C9241A] animate-spin" />
          ) : (
            <Monitor className="w-5 h-5 text-[#C9241A]" />
          )}
        </div>
        <h3 className="ff-display text-sm font-semibold text-white dash-light:text-[#16191E] group-hover:text-[#C9241A] transition-colors">Command Studio</h3>
        <p className="ff-mono text-[11px] uppercase tracking-[0.1em] text-[#9aa0a8] dash-light:text-[#5B6169] mt-1">Interactive scenario</p>
      </div>
    </button>
  )
}
