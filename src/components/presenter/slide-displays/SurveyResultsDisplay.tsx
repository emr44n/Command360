'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Slide, SurveyContent, SurveyQuestion } from '@/types/slide'

interface QuestionResult {
  question: SurveyQuestion
  textResponses: string[]
  ratingAvg: number | null
  ratingCount: number
  optionCounts: Record<string, number>
}

export function SurveyResultsDisplay({ slide, sessionId }: { slide: Slide; sessionId: string }) {
  const [results, setResults] = useState<QuestionResult[]>([])
  const [totalResponses, setTotalResponses] = useState(0)
  const supabase = createClient()
  const content = slide.content as SurveyContent

  useEffect(() => {
    fetchResults()
    const channel = supabase.channel(`survey:${slide.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'responses', filter: `slide_id=eq.${slide.id}` }, fetchResults)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [slide.id])

  async function fetchResults() {
    const { data } = await supabase.from('responses').select('answer').eq('slide_id', slide.id).eq('session_id', sessionId)
    if (!data || !content.questions) return
    setTotalResponses(data.length)

    const qResults = content.questions.map((q) => {
      const textResponses: string[] = []
      const optionCounts: Record<string, number> = {}
      const ratings: number[] = []

      data.forEach((r) => {
        const answers = (r.answer as { answers?: Array<{ question_id: string; value: string | number }> }).answers || []
        const ans = answers.find((a) => a.question_id === q.id)
        if (!ans) return
        if (q.type === 'text') textResponses.push(String(ans.value))
        else if (q.type === 'rating') ratings.push(Number(ans.value))
        else {
          const val = String(ans.value)
          optionCounts[val] = (optionCounts[val] || 0) + 1
        }
      })

      return {
        question: q,
        textResponses,
        ratingAvg: ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null,
        ratingCount: ratings.length,
        optionCounts,
      }
    })
    setResults(qResults)
  }

  if (totalResponses === 0) {
    return <p className="text-muted-foreground text-sm">Waiting for survey responses...</p>
  }

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
      <p className="text-muted-foreground text-sm">{totalResponses} {totalResponses === 1 ? 'response' : 'responses'}</p>
      {results.map((r, i) => (
        <div key={i} className="bg-muted/50 rounded-xl p-4 border border-border">
          <p className="text-foreground text-sm font-medium mb-3">{r.question.text}</p>
          {r.question.type === 'text' && (
            <div className="space-y-1.5 max-h-32 overflow-y-auto">
              {r.textResponses.length === 0 ? (
                <p className="text-muted-foreground text-xs">No text responses</p>
              ) : r.textResponses.map((t, j) => (
                <p key={j} className="text-foreground/80 text-xs bg-muted rounded px-2 py-1">"{t}"</p>
              ))}
            </div>
          )}
          {r.question.type === 'rating' && r.ratingAvg !== null && (
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-primary">{r.ratingAvg.toFixed(1)}</span>
              <span className="text-muted-foreground text-sm">/ {r.question.rating_max || 5} avg from {r.ratingCount} responses</span>
            </div>
          )}
          {(r.question.type === 'single_choice' || r.question.type === 'multiple_choice') && (
            <div className="space-y-2">
              {(r.question.options || []).map((opt) => {
                const count = r.optionCounts[opt.id] || 0
                const pct = totalResponses > 0 ? Math.round((count / totalResponses) * 100) : 0
                return (
                  <div key={opt.id} className="flex items-center gap-3">
                    <span className="text-foreground/80 text-xs w-24 truncate">{opt.text}</span>
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-muted-foreground text-xs w-10 text-right">{pct}%</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
