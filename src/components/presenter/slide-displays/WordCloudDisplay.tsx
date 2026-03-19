'use client'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase/client'
import type { Slide } from '@/types/slide'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'

const WordCloud = dynamic(() => import('react-d3-cloud').then((m) => m.default), {
  ssr: false,
  loading: () => <div className="h-64 flex items-center justify-center text-gray-500">Loading cloud...</div>,
})

interface WordData { text: string; value: number }

export function WordCloudDisplay({ slide, sessionId }: { slide: Slide; sessionId: string }) {
  const [words, setWords] = useState<WordData[]>([])
  const [analysis, setAnalysis] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    fetchWords()
    const channel = supabase.channel(`wordcloud:${slide.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'responses', filter: `slide_id=eq.${slide.id}` }, () => fetchWords())
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [slide.id])

  async function fetchWords() {
    const { data } = await supabase.from('responses').select('answer').eq('slide_id', slide.id).eq('session_id', sessionId)
    if (!data) return
    const counts: Record<string, number> = {}
    data.forEach((r) => {
      const word = ((r.answer as { word?: string }).word || '').toLowerCase().trim()
      if (word) counts[word] = (counts[word] || 0) + 1
    })
    setWords(Object.entries(counts).map(([text, value]) => ({ text, value })))
  }

  async function analyzeWords() {
    if (!words.length) return
    setAnalyzing(true)
    const content = slide.content as { prompt?: string }
    const res = await fetch('/api/ai/analyze-words', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ words: words.map((w) => w.text), prompt: content.prompt }),
    })
    const data = await res.json()
    setAnalysis(data.analysis || '')
    setAnalyzing(false)
  }

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#ec4899', '#14b8a6']

  return (
    <div className="space-y-4">
      {words.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-muted-foreground">Waiting for responses...</div>
      ) : (
        <>
          <div className="bg-muted rounded-xl overflow-hidden">
            <WordCloud data={words} width={680} height={280} font="Inter"
              fontSize={(word) => Math.log2(word.value + 1) * 20}
              rotate={0} fill={(_: unknown, i: number) => COLORS[i % COLORS.length]} padding={6} />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground text-sm">{words.reduce((s, w) => s + w.value, 0)} total · {words.length} unique</span>
            <Button size="sm" variant="ghost" onClick={analyzeWords} disabled={analyzing}
              className="gap-2 text-primary hover:text-primary/80 ml-auto">
              <Sparkles className="w-3.5 h-3.5" />{analyzing ? 'Analyzing...' : 'AI Analysis'}
            </Button>
          </div>
          {analysis && (
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-sm text-foreground">{analysis}</div>
          )}
        </>
      )}
    </div>
  )
}
