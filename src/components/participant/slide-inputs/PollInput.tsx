'use client'
import { useState } from 'react'
import type { Slide, PollContent } from '@/types/slide'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PollInputProps {
  slide: Slide
  onSubmit: (answer: Record<string, unknown>) => Promise<void>
  disabled?: boolean
}

const OPTION_COLORS = [
  'border-primary hover:bg-primary/10 data-[selected=true]:bg-primary/20',
  'border-blue-500 hover:bg-blue-500/10 data-[selected=true]:bg-blue-500/20',
  'border-emerald-500 hover:bg-emerald-500/10 data-[selected=true]:bg-emerald-500/20',
  'border-amber-500 hover:bg-amber-500/10 data-[selected=true]:bg-amber-500/20',
  'border-red-500 hover:bg-red-500/10 data-[selected=true]:bg-red-500/20',
  'border-pink-500 hover:bg-pink-500/10 data-[selected=true]:bg-pink-500/20',
]

export function PollInput({ slide, onSubmit, disabled }: PollInputProps) {
  const content = slide.content as PollContent
  const [selected, setSelected] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)

  function toggleOption(id: string) {
    if (disabled) return
    if (content.allow_multiple) {
      setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
    } else {
      setSelected([id])
    }
  }

  async function handleSubmit() {
    if (!selected.length || submitting) return
    setSubmitting(true)
    await onSubmit({ selected_option_ids: selected })
    setSubmitting(false)
  }

  return (
    <div className="space-y-4">
      {content.allow_multiple && (
        <p className="text-muted-foreground text-sm text-center">Select all that apply</p>
      )}
      <div className="space-y-3">
        {(content.options || []).map((opt, i) => (
          <button
            key={opt.id}
            data-selected={selected.includes(opt.id)}
            onClick={() => toggleOption(opt.id)}
            disabled={disabled}
            className={cn(
              'w-full text-left px-5 py-4 rounded-2xl border-2 transition-all duration-200 font-medium',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              selected.includes(opt.id)
                ? 'border-primary bg-primary/15 scale-[1.02] shadow-md shadow-primary/10'
                : 'bg-card border-border hover:border-primary/50',
              OPTION_COLORS[i % OPTION_COLORS.length]
            )}
          >
            <div className="flex items-center justify-between">
              <span>{opt.text}</span>
              {selected.includes(opt.id) && <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />}
            </div>
          </button>
        ))}
      </div>
      <Button
        onClick={handleSubmit}
        disabled={!selected.length || submitting || disabled}
        className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-6 rounded-xl text-lg transition-all hover:shadow-lg hover:shadow-red-500/25"
      >
        {submitting ? 'Submitting...' : 'Submit'}
      </Button>
    </div>
  )
}
