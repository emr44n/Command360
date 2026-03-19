'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Slide, PollContent } from '@/types/slide'
import { BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer, LabelList } from 'recharts'

interface PollResult { option_id: string; text: string; count: number; percentage: number }
const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#ec4899', '#14b8a6']

export function PollResultsDisplay({ slide, sessionId }: { slide: Slide; sessionId: string }) {
  const [results, setResults] = useState<PollResult[]>([])
  const [totalVotes, setTotalVotes] = useState(0)
  const supabase = createClient()
  const content = slide.content as PollContent

  useEffect(() => {
    fetchResults()
    const channel = supabase.channel(`poll:${slide.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'responses', filter: `slide_id=eq.${slide.id}` }, () => fetchResults())
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [slide.id])

  async function fetchResults() {
    const { data } = await supabase.from('responses').select('answer').eq('slide_id', slide.id).eq('session_id', sessionId)
    if (!data) return
    const tally: Record<string, number> = {}
    content.options?.forEach((opt) => (tally[opt.id] = 0))
    data.forEach((r) => {
      const ids: string[] = (r.answer as { selected_option_ids?: string[] }).selected_option_ids || []
      ids.forEach((id) => { if (tally[id] !== undefined) tally[id]++ })
    })
    const total = data.length
    setTotalVotes(total)
    setResults((content.options || []).map((opt) => ({
      option_id: opt.id, text: opt.text || '(empty)',
      count: tally[opt.id] || 0,
      percentage: total > 0 ? Math.round(((tally[opt.id] || 0) / total) * 100) : 0,
    })))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-muted-foreground text-sm">{totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}</span>
      </div>
      {results.length === 0 ? (
        <p className="text-muted-foreground text-sm">Waiting for votes...</p>
      ) : (
        <ResponsiveContainer width="100%" height={Math.max(160, results.length * 52)}>
          <BarChart data={results} layout="vertical" margin={{ left: 8, right: 50, top: 4, bottom: 4 }}>
            <XAxis type="number" hide domain={[0, 'dataMax']} />
            <YAxis type="category" dataKey="text" width={140} tick={{ fill: '#d1d5db', fontSize: 13 }} />
            <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={40} isAnimationActive={true} animationDuration={600}>
              {results.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              <LabelList dataKey="percentage" position="right" formatter={(v: unknown) => `${v}%`} style={{ fill: '#9ca3af', fontSize: 13 }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
