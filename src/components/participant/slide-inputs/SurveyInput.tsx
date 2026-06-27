'use client'
import { useState } from 'react'
import type { Slide, SurveyContent, SurveyQuestion } from '@/types/slide'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface SurveyInputProps {
  slide: Slide
  onSubmit: (answer: Record<string, unknown>) => Promise<void>
  disabled?: boolean
}

interface SurveyAnswers {
  [questionId: string]: string | number
}

export function SurveyInput({ slide, onSubmit, disabled }: SurveyInputProps) {
  const content = slide.content as SurveyContent
  const [answers, setAnswers] = useState<SurveyAnswers>({})
  const [submitting, setSubmitting] = useState(false)

  function setAnswer(qId: string, value: string | number) {
    setAnswers((prev) => ({ ...prev, [qId]: value }))
  }

  const allRequired = (content.questions || [])
    .filter((q) => q.required)
    .every((q) => answers[q.id] !== undefined && answers[q.id] !== '')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!allRequired || submitting) return
    setSubmitting(true)
    const formatted = Object.entries(answers).map(([question_id, value]) => ({ question_id, value }))
    await onSubmit({ answers: formatted })
    setSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {(content.questions || []).map((q, i) => (
        <div key={q.id} className="bg-card rounded-none p-4 border border-border space-y-3">
          <label className="block text-foreground text-sm font-medium">
            {i + 1}. {q.text}
            {q.required && <span className="text-[#C9241A] ml-1">*</span>}
          </label>
          {q.type === 'text' && (
            <Textarea
              value={String(answers[q.id] || '')}
              onChange={(e) => setAnswer(q.id, e.target.value)}
              placeholder="Your answer..."
              disabled={disabled}
              rows={3}
              className="bg-background border-border text-foreground placeholder:text-muted-foreground rounded-none resize-none focus-visible:ring-primary"
            />
          )}
          {q.type === 'rating' && (
            <RatingInput
              value={Number(answers[q.id]) || 0}
              max={q.rating_max || 5}
              onChange={(v) => setAnswer(q.id, v)}
              disabled={disabled}
            />
          )}
          {(q.type === 'single_choice' || q.type === 'multiple_choice') && (
            <div className="space-y-2">
              {(q.options || []).map((opt) => {
                const isMulti = q.type === 'multiple_choice'
                const currentVal = answers[q.id]
                const multiSelected = isMulti
                  ? (String(currentVal || '')).split(',').filter(Boolean)
                  : []
                const isSelected = isMulti
                  ? multiSelected.includes(opt.id)
                  : currentVal === opt.id

                function toggle() {
                  if (isMulti) {
                    const next = isSelected
                      ? multiSelected.filter((x) => x !== opt.id)
                      : [...multiSelected, opt.id]
                    setAnswer(q.id, next.join(','))
                  } else {
                    setAnswer(q.id, opt.id)
                  }
                }

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={toggle}
                    disabled={disabled}
                    className={cn(
                      'w-full text-left px-4 py-3 rounded-none border-2 transition-all text-sm font-medium',
                      isSelected
                        ? 'border-primary bg-primary/15 text-foreground'
                        : 'border-border bg-muted/30 text-foreground hover:border-primary/50'
                    )}
                  >
                    {opt.text}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      ))}
      <Button
        type="submit"
        disabled={!allRequired || submitting || disabled}
        className="w-full bg-[#C9241A] hover:bg-[#a81d15] text-white font-semibold py-6 rounded-none text-lg transition-all hover:shadow-lg hover:shadow-[#C9241A]/25"
      >
        {submitting ? 'Submitting...' : 'Submit Survey'}
      </Button>
    </form>
  )
}

function RatingInput({ value, max, onChange, disabled }: { value: number; max: number; onChange: (v: number) => void; disabled?: boolean }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          disabled={disabled}
          className={cn(
            'w-12 h-12 rounded-none border-2 font-bold text-lg transition-all',
            value === n
              ? 'border-primary bg-primary/15 text-primary scale-110'
              : 'border-border bg-muted/30 text-muted-foreground hover:border-primary/50'
          )}
        >
          {n}
        </button>
      ))}
    </div>
  )
}
