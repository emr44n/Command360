'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  BarChart2, Cloud, HelpCircle, MessageCircle, ClipboardList, FileText,
  Loader2, Plus, Star, AlignLeft,
} from 'lucide-react'
import { toast } from 'sonner'

const SLIDE_TYPES = [
  { type: 'poll', label: 'Poll', icon: BarChart2, color: 'text-blue-500', bg: 'bg-blue-500/10 hover:bg-blue-500/20', glowColor: 'hover:shadow-blue-500/20' },
  { type: 'quiz', label: 'Quiz', icon: HelpCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10 hover:bg-emerald-500/20', glowColor: 'hover:shadow-emerald-500/20' },
  { type: 'word_cloud', label: 'Word Cloud', icon: Cloud, color: 'text-cyan-500', bg: 'bg-cyan-500/10 hover:bg-cyan-500/20', glowColor: 'hover:shadow-cyan-500/20' },
  { type: 'rating_scale', label: 'Rating', icon: Star, color: 'text-orange-500', bg: 'bg-orange-500/10 hover:bg-orange-500/20', glowColor: 'hover:shadow-orange-500/20' },
  { type: 'open_text', label: 'Open Text', icon: AlignLeft, color: 'text-teal-500', bg: 'bg-teal-500/10 hover:bg-teal-500/20', glowColor: 'hover:shadow-teal-500/20' },
  { type: 'qna', label: 'Q&A', icon: MessageCircle, color: 'text-amber-500', bg: 'bg-amber-500/10 hover:bg-amber-500/20', glowColor: 'hover:shadow-amber-500/20' },
  { type: 'survey', label: 'Survey', icon: ClipboardList, color: 'text-pink-500', bg: 'bg-pink-500/10 hover:bg-pink-500/20', glowColor: 'hover:shadow-pink-500/20' },
  { type: 'content', label: 'Content', icon: FileText, color: 'text-violet-500', bg: 'bg-violet-500/10 hover:bg-violet-500/20', glowColor: 'hover:shadow-violet-500/20' },
]

export function QuickCreate() {
  const router = useRouter()
  const [creating, setCreating] = useState<string | null>(null)

  async function handleQuickCreate(slideType: string, label: string) {
    if (creating) return
    setCreating(slideType)

    try {
      const presRes = await fetch('/api/presentations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: `New ${label}`, description: '' }),
      })
      if (!presRes.ok) throw new Error('Failed to create presentation')
      const presData = await presRes.json()

      const slideRes = await fetch('/api/slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          presentation_id: presData.presentation.id,
          slide_type: slideType,
          position: 0,
          title: '',
        }),
      })
      if (!slideRes.ok) throw new Error('Failed to create slide')

      toast.success(`${label} deck created!`)
      router.push(`/presentations/${presData.presentation.id}/edit`)
    } catch {
      toast.error('Failed to create deck')
      setCreating(null)
    }
  }

  return (
    <div>
      <h2 className="text-[10px] uppercase tracking-[0.15em] font-semibold text-muted-foreground mb-3">Quick Create by Type</h2>
      <div className="flex items-center gap-2 flex-wrap">
        {SLIDE_TYPES.map((item) => {
          const isCreating = creating === item.type
          return (
            <button
              key={item.type}
              onClick={() => handleQuickCreate(item.type, item.label)}
              disabled={!!creating}
              className={`
                group/btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                border border-border transition-all duration-200
                hover:shadow-md ${item.glowColor}
                hover:-translate-y-0.5
                ${item.bg}
                ${isCreating ? 'opacity-70' : ''}
                ${creating && !isCreating ? 'opacity-40' : ''}
              `}
            >
              {isCreating ? (
                <Loader2 className={`w-3.5 h-3.5 ${item.color} animate-spin`} />
              ) : (
                <item.icon className={`w-3.5 h-3.5 ${item.color} group-hover/btn:scale-110 transition-transform duration-200`} />
              )}
              {item.label}
            </button>
          )
        })}
        <button
          onClick={() => router.push('/dashboard/templates')}
          className="group/btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-dashed border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200"
        >
          <Plus className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform duration-200" />
          Template
        </button>
      </div>
    </div>
  )
}
