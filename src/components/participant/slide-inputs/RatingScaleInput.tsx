'use client'
import { useState } from 'react'
import type { Slide, RatingScaleContent } from '@/types/slide'
import { Button } from '@/components/ui/button'

interface Props {
  slide: Slide
  onSubmit: (answer: Record<string, unknown>) => Promise<void>
  disabled?: boolean
}

export function RatingScaleInput({ slide, onSubmit, disabled }: Props) {
  const content = slide.content as RatingScaleContent
  const [selected, setSelected] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const values: number[] = []
  for (let v = content.min_value; v <= content.max_value; v += content.step) {
    values.push(v)
  }

  async function handleSubmit() {
    if (selected === null || submitting) return
    setSubmitting(true)
    await onSubmit({ rating: selected })
    setSubmitting(false)
  }

  return (
    <div className="space-y-6">
      {/* Scale labels */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{content.min_label}</span>
        <span>{content.max_label}</span>
      </div>

      {/* Number buttons */}
      <div className="flex flex-wrap justify-center gap-2">
        {values.map((v) => (
          <button
            key={v}
            onClick={() => !disabled && setSelected(v)}
            disabled={disabled}
            className={`
              w-12 h-12 rounded-xl text-lg font-bold transition-all duration-200 border-2
              ${selected === v
                ? 'bg-primary text-primary-foreground border-primary scale-110 shadow-lg shadow-primary/25'
                : selected !== null && v <= selected
                  ? 'bg-primary/15 text-primary border-primary/30'
                  : 'bg-card text-foreground border-border hover:border-primary/40 hover:bg-primary/5'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}
            `}
          >
            {v}
          </button>
        ))}
      </div>

      {/* Selected indicator */}
      {selected !== null && (
        <p className="text-center text-sm text-primary font-medium animate-in fade-in slide-in-from-bottom-2 duration-200">
          You selected {selected}
        </p>
      )}

      <Button
        onClick={handleSubmit}
        disabled={selected === null || submitting || disabled}
        className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-6 rounded-xl text-lg transition-all hover:shadow-lg hover:shadow-red-500/25"
      >
        {submitting ? 'Submitting...' : 'Submit'}
      </Button>
    </div>
  )
}
