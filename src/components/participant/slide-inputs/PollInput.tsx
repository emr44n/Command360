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
  'border-[#3E6DC4] hover:bg-[#3E6DC4]/10 data-[selected=true]:bg-[#3E6DC4]/20',
  'border-[#2E9E63] hover:bg-[#2E9E63]/10 data-[selected=true]:bg-[#2E9E63]/20',
  'border-[#c98a2a] hover:bg-[#c98a2a]/10 data-[selected=true]:bg-[#c98a2a]/20',
  'border-[#C9241A] hover:bg-[#C9241A]/10 data-[selected=true]:bg-[#C9241A]/20',
  'border-[#6a5ea8] hover:bg-[#6a5ea8]/10 data-[selected=true]:bg-[#6a5ea8]/20',
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
              'w-full text-left px-5 py-4 rounded-none border-2 transition-all duration-200 font-medium',
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
        className="w-full bg-[#C9241A] hover:bg-[#a81d15] text-white font-semibold py-6 rounded-none text-lg transition-all hover:shadow-lg hover:shadow-[#C9241A]/25"
      >
        {submitting ? 'Submitting...' : 'Submit'}
      </Button>
    </div>
  )
}
