'use client'
import { useState, useEffect, useRef } from 'react'
import type { Slide, QuizContent } from '@/types/slide'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { Timer } from 'lucide-react'

interface QuizInputProps {
  slide: Slide
  onSubmit: (answer: Record<string, unknown>) => Promise<void>
  disabled?: boolean
}

export function QuizInput({ slide, onSubmit, disabled }: QuizInputProps) {
  const content = slide.content as QuizContent
  const timeLimit = content.time_limit_seconds || 30
  const [selected, setSelected] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [timeLeft, setTimeLeft] = useState(timeLimit)
  const [timedOut, setTimedOut] = useState(false)
  const startTimeRef = useRef(Date.now())
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (disabled) return
    startTimeRef.current = Date.now()
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          setTimedOut(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [disabled])

  async function handleSelect(optionId: string) {
    if (selected || submitting || timedOut || disabled) return
    clearInterval(timerRef.current!)
    setSelected(optionId)
    setSubmitting(true)
    const timeTakenMs = Date.now() - startTimeRef.current
    await onSubmit({ selected_option_id: optionId, time_taken_ms: timeTakenMs })
    setSubmitting(false)
  }

  const pct = (timeLeft / timeLimit) * 100
  const isUrgent = timeLeft <= 5

  return (
    <div className="space-y-5">
      {!disabled && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className={cn('flex items-center gap-1.5', isUrgent ? 'text-red-500' : 'text-muted-foreground')}>
              <Timer className="w-4 h-4" />
              <span className={cn('font-mono font-bold text-lg', isUrgent && 'animate-pulse')}>{timeLeft}s</span>
            </div>
            <span className="text-muted-foreground text-xs">{content.points || 1000} pts</span>
          </div>
          <Progress value={pct} className={cn('h-2', isUrgent ? '[&>div]:bg-red-500' : '[&>div]:bg-primary')} />
        </div>
      )}

      {timedOut && !selected && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center text-red-600 dark:text-red-400">
          Time&apos;s up! You didn&apos;t answer in time.
        </div>
      )}

      <div className="grid grid-cols-1 gap-3">
        {(content.options || []).map((opt, i) => {
          const letters = ['A', 'B', 'C', 'D', 'E', 'F']
          const colors = [
            'border-primary data-[selected=true]:bg-primary/20',
            'border-blue-500 data-[selected=true]:bg-blue-500/20',
            'border-emerald-500 data-[selected=true]:bg-emerald-500/20',
            'border-amber-500 data-[selected=true]:bg-amber-500/20',
          ]
          return (
            <button
              key={opt.id}
              data-selected={selected === opt.id}
              onClick={() => handleSelect(opt.id)}
              disabled={!!selected || timedOut || disabled}
              className={cn(
                'w-full text-left px-5 py-4 rounded-2xl border-2 transition-all duration-200',
                'disabled:cursor-not-allowed',
                selected === opt.id
                  ? 'border-primary bg-primary/15 scale-[1.02] shadow-md shadow-primary/10'
                  : 'bg-card border-border',
                !selected && !timedOut && !disabled ? 'hover:border-primary/50 hover:bg-muted/50' : '',
                colors[i % colors.length]
              )}
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground shrink-0">
                  {letters[i] || String(i + 1)}
                </span>
                <span className="font-medium">{opt.text}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
