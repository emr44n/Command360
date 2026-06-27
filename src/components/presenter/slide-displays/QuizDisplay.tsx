'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Slide, QuizContent } from '@/types/slide'
import { BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer, LabelList } from 'recharts'
import { Trophy } from 'lucide-react'

interface QuizResult { option_id: string; text: string; count: number; is_correct: boolean }
interface LeaderboardEntry { display_name: string; score: number }
const COLORS = ['#C9241A', '#3E6DC4', '#2E9E63', '#c98a2a', '#6a5ea8', '#2592a3', '#D94B3D', '#8a7d3a']

export function QuizDisplay({ slide, sessionId }: { slide: Slide; sessionId: string }) {
  const [results, setResults] = useState<QuizResult[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [totalResponses, setTotalResponses] = useState(0)
  const supabase = createClient()
  const content = slide.content as QuizContent

  useEffect(() => {
    fetchResults()
    fetchLeaderboard()
    const channel = supabase.channel(`quiz:${slide.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'responses', filter: `slide_id=eq.${slide.id}` }, () => {
        fetchResults()
        fetchLeaderboard()
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [slide.id])

  async function fetchResults() {
    const { data } = await supabase.from('responses').select('answer').eq('slide_id', slide.id).eq('session_id', sessionId)
    if (!data) return
    const tally: Record<string, number> = {}
    content.options?.forEach((opt) => (tally[opt.id] = 0))
    data.forEach((r) => {
      const id = (r.answer as { selected_option_id?: string }).selected_option_id
      if (id && tally[id] !== undefined) tally[id]++
    })
    setTotalResponses(data.length)
    setResults((content.options || []).map((opt) => ({
      option_id: opt.id,
      text: opt.text || '(empty)',
      count: tally[opt.id] || 0,
      is_correct: opt.is_correct || false,
    })))
  }

  async function fetchLeaderboard() {
    const { data } = await supabase
      .from('participants')
      .select('display_name, score')
      .eq('session_id', sessionId)
      .gt('score', 0)
      .order('score', { ascending: false })
      .limit(5)
    if (data) setLeaderboard(data as LeaderboardEntry[])
  }

  return (
    <div className="space-y-4">
      {results.length === 0 ? (
        <p className="text-muted-foreground text-sm">Waiting for answers...</p>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={Math.max(160, results.length * 52)}>
            <BarChart data={results} layout="vertical" margin={{ left: 8, right: 60, top: 4, bottom: 4 }}>
              <XAxis type="number" hide domain={[0, 'dataMax']} />
              <YAxis type="category" dataKey="text" width={140} tick={{ fill: '#9aa0a8', fontSize: 13 }} />
              <Bar dataKey="count" radius={[0, 0, 0, 0]} maxBarSize={40} isAnimationActive={true} animationDuration={600}>
                {results.map((r, i) => (
                  <Cell key={i} fill={r.is_correct ? '#2E9E63' : COLORS[i % COLORS.length]} />
                ))}
                <LabelList dataKey="count" position="right" style={{ fill: '#9aa0a8', fontSize: 13 }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-muted-foreground text-sm">{totalResponses} {totalResponses === 1 ? 'response' : 'responses'}</p>
          {content.explanation && (
            <div className="bg-[#2E9E63]/10 border border-[#2E9E63]/30 rounded-none p-3 text-sm text-[#2E9E63]">
              {content.explanation}
            </div>
          )}
          {leaderboard.length > 0 && (
            <div className="bg-muted/50 rounded-none p-4">
              <div className="flex items-center gap-2 mb-3 text-sm font-medium text-[#c98a2a]">
                <Trophy className="w-4 h-4" />
                Leaderboard
              </div>
              <div className="space-y-2">
                {leaderboard.map((entry, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground w-5">{i + 1}.</span>
                      <span className="text-foreground">{entry.display_name}</span>
                    </div>
                    <span className="text-primary font-mono font-medium">{entry.score} pts</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
