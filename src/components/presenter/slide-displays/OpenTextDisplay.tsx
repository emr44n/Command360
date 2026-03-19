'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Slide, OpenTextContent } from '@/types/slide'

interface TextResponse {
  text: string
  time: string
}

export function OpenTextDisplay({ slide, sessionId }: { slide: Slide; sessionId: string }) {
  const [responses, setResponses] = useState<TextResponse[]>([])
  const supabase = createClient()
  const content = slide.content as OpenTextContent

  useEffect(() => {
    fetchResults()
    const channel = supabase.channel(`opentext:${slide.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'responses', filter: `slide_id=eq.${slide.id}` }, () => fetchResults())
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [slide.id])

  async function fetchResults() {
    const { data } = await supabase
      .from('responses')
      .select('answer, created_at')
      .eq('slide_id', slide.id)
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })

    if (!data) return
    setResponses(
      data
        .map((r) => ({
          text: (r.answer as { text?: string }).text || '',
          time: r.created_at,
        }))
        .filter((r) => r.text)
    )
  }

  return (
    <div className="py-2">
      <div className="flex items-center justify-between mb-4">
        <span className="text-white/40 text-sm">
          {responses.length} response{responses.length !== 1 ? 's' : ''}
        </span>
        {content.show_responses_live && (
          <span className="text-xs text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live
          </span>
        )}
      </div>

      {responses.length === 0 ? (
        <p className="text-white/30 text-sm text-center py-8">Waiting for responses...</p>
      ) : content.show_responses_live ? (
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {responses.map((r, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3"
              style={{ animation: i === 0 ? 'fadeInScale 0.3s ease-out forwards' : undefined }}
            >
              <p className="text-white/80 text-sm whitespace-pre-wrap leading-relaxed">{r.text}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-white/50 text-sm">
            {responses.length} response{responses.length !== 1 ? 's' : ''} collected
          </p>
          <p className="text-white/30 text-xs mt-1">Responses hidden during session</p>
        </div>
      )}
    </div>
  )
}
