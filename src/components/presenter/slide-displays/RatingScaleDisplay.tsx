'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Slide, RatingScaleContent } from '@/types/slide'

export function RatingScaleDisplay({ slide, sessionId }: { slide: Slide; sessionId: string }) {
  const [ratings, setRatings] = useState<number[]>([])
  const supabase = createClient()
  const content = slide.content as RatingScaleContent

  useEffect(() => {
    fetchResults()
    const channel = supabase.channel(`rating:${slide.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'responses', filter: `slide_id=eq.${slide.id}` }, () => fetchResults())
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [slide.id])

  async function fetchResults() {
    const { data } = await supabase.from('responses').select('answer').eq('slide_id', slide.id).eq('session_id', sessionId)
    if (!data) return
    const values = data
      .map((r) => (r.answer as { rating?: number }).rating)
      .filter((v): v is number => typeof v === 'number')
    setRatings(values)
  }

  const avg = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0

  // Build distribution
  const distribution: Record<number, number> = {}
  for (let v = content.min_value; v <= content.max_value; v += content.step) distribution[v] = 0
  for (const r of ratings) distribution[r] = (distribution[r] || 0) + 1
  const maxCount = Math.max(...Object.values(distribution), 1)

  return (
    <div className="py-4">
      {/* Average display */}
      <div className="text-center mb-8">
        <p className="text-6xl font-bold text-white font-mono tabular-nums transition-all duration-500">
          {ratings.length > 0 ? avg.toFixed(1) : '—'}
        </p>
        <p className="text-white/40 text-sm mt-2">
          {ratings.length > 0
            ? `Average of ${ratings.length} response${ratings.length !== 1 ? 's' : ''}`
            : 'Waiting for responses...'
          }
        </p>
        {ratings.length > 0 && (
          <div className="flex items-center justify-center gap-6 mt-3 text-xs text-white/30">
            <span>{content.min_value} = {content.min_label}</span>
            <span>{content.max_value} = {content.max_label}</span>
          </div>
        )}
      </div>

      {/* Distribution histogram */}
      {ratings.length > 0 && (
        <div className="flex items-end gap-1 justify-center h-32">
          {Object.entries(distribution).map(([val, count]) => {
            const height = maxCount > 0 ? (count / maxCount) * 100 : 0
            const numVal = Number(val)
            const isNearAvg = Math.abs(numVal - avg) < content.step
            return (
              <div key={val} className="flex flex-col items-center gap-1.5 flex-1 max-w-12">
                {count > 0 && (
                  <span className="text-[11px] font-mono text-white/50 tabular-nums">{count}</span>
                )}
                <div className="w-full relative" style={{ height: '80px' }}>
                  <div
                    className={`absolute bottom-0 w-full rounded-none transition-all duration-700 ease-out ${
                      isNearAvg ? 'bg-primary' : 'bg-white/20'
                    }`}
                    style={{ height: `${height}%`, minHeight: count > 0 ? '3px' : '0' }}
                  />
                </div>
                <span className={`text-xs font-mono ${isNearAvg ? 'text-primary font-bold' : 'text-white/40'}`}>
                  {val}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
