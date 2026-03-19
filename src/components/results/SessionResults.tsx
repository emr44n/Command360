'use client'
import { useState } from 'react'
import type { Slide } from '@/types/slide'
import type { PollContent, QuizContent, RatingScaleContent } from '@/types/slide'
import { BarChart2, PieChart, Users, MessageCircle, Star, AlignLeft, FileText, Cloud, HelpCircle, ClipboardList } from 'lucide-react'

interface Response {
  id: string
  slide_id: string
  participant_id: string
  answer: Record<string, unknown>
  created_at: string
}

interface SessionResultsProps {
  slides: Slide[]
  responses: Response[]
  participantCount: number
}

const SLIDE_ICONS: Record<string, React.ElementType> = {
  poll: BarChart2, word_cloud: Cloud, quiz: HelpCircle, qna: MessageCircle,
  survey: ClipboardList, content: FileText, rating_scale: Star, open_text: AlignLeft,
}

const BAR_COLORS = [
  'bg-primary', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500',
  'bg-pink-500', 'bg-violet-500', 'bg-cyan-500', 'bg-orange-500',
]

export function SessionResults({ slides, responses, participantCount }: SessionResultsProps) {
  const [chartMode, setChartMode] = useState<'bar' | 'horizontal'>('horizontal')

  // Group responses by slide
  const responsesBySlide: Record<string, Response[]> = {}
  for (const r of responses) {
    if (!responsesBySlide[r.slide_id]) responsesBySlide[r.slide_id] = []
    responsesBySlide[r.slide_id].push(r)
  }

  // Filter to interactive slides only
  const interactiveSlides = slides.filter((s) => s.slide_type !== 'content')

  return (
    <div className="space-y-6">
      {/* Chart mode toggle */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Chart style:</span>
        <button
          onClick={() => setChartMode('horizontal')}
          className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
            chartMode === 'horizontal' ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:text-foreground'
          }`}
        >
          Horizontal bars
        </button>
        <button
          onClick={() => setChartMode('bar')}
          className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
            chartMode === 'bar' ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:text-foreground'
          }`}
        >
          Vertical bars
        </button>
      </div>

      {interactiveSlides.length === 0 ? (
        <div className="text-center py-12">
          <BarChart2 className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No interactive slides in this deck</p>
        </div>
      ) : (
        interactiveSlides.map((slide, idx) => {
          const slideResponses = responsesBySlide[slide.id] || []
          const Icon = SLIDE_ICONS[slide.slide_type] || FileText

          return (
            <div key={slide.id} className="bg-card border border-border rounded-2xl overflow-hidden">
              {/* Slide header */}
              <div className="px-5 py-4 border-b border-border flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{slide.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {slideResponses.length} response{slideResponses.length !== 1 ? 's' : ''} &middot; Slide {idx + 1}
                  </p>
                </div>
                <span className="text-[10px] uppercase tracking-wide text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {slide.slide_type.replace('_', ' ')}
                </span>
              </div>

              {/* Slide results */}
              <div className="p-5">
                {slideResponses.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">No responses</p>
                ) : (
                  <SlideResult slide={slide} responses={slideResponses} chartMode={chartMode} />
                )}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

function SlideResult({ slide, responses, chartMode }: { slide: Slide; responses: Response[]; chartMode: 'bar' | 'horizontal' }) {
  switch (slide.slide_type) {
    case 'poll': return <PollResult slide={slide} responses={responses} chartMode={chartMode} />
    case 'quiz': return <QuizResult slide={slide} responses={responses} chartMode={chartMode} />
    case 'word_cloud': return <WordCloudResult responses={responses} />
    case 'rating_scale': return <RatingScaleResult slide={slide} responses={responses} />
    case 'open_text': return <OpenTextResult responses={responses} />
    case 'qna': return <QnAResult responses={responses} />
    case 'survey': return <SurveyResult responses={responses} />
    default: return null
  }
}

// ─── Poll results ─────────────────────────────────────────────────────────

function PollResult({ slide, responses, chartMode }: { slide: Slide; responses: Response[]; chartMode: 'bar' | 'horizontal' }) {
  const content = slide.content as PollContent
  const counts: Record<string, number> = {}
  for (const r of responses) {
    const ids = (r.answer as { selected_option_ids?: string[] }).selected_option_ids || []
    for (const id of ids) counts[id] = (counts[id] || 0) + 1
  }
  const maxCount = Math.max(...Object.values(counts), 1)

  if (chartMode === 'bar') {
    return (
      <div className="flex items-end gap-2 justify-center h-48">
        {content.options.map((opt, i) => {
          const count = counts[opt.id] || 0
          const height = maxCount > 0 ? (count / maxCount) * 100 : 0
          return (
            <div key={opt.id} className="flex flex-col items-center gap-1 flex-1 max-w-20">
              <span className="text-xs font-mono font-bold text-foreground">{count}</span>
              <div className="w-full relative" style={{ height: '140px' }}>
                <div
                  className={`absolute bottom-0 w-full rounded-t-lg transition-all duration-500 ${BAR_COLORS[i % BAR_COLORS.length]}`}
                  style={{ height: `${height}%`, minHeight: count > 0 ? '4px' : '0' }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground text-center truncate w-full">{opt.text}</span>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {content.options.map((opt, i) => {
        const count = counts[opt.id] || 0
        const pct = responses.length > 0 ? Math.round((count / responses.length) * 100) : 0
        return (
          <div key={opt.id}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-foreground">{opt.text}</span>
              <span className="text-xs font-mono text-muted-foreground">{count} ({pct}%)</span>
            </div>
            <div className="h-6 bg-muted rounded-lg overflow-hidden">
              <div
                className={`h-full rounded-lg transition-all duration-700 ease-out ${BAR_COLORS[i % BAR_COLORS.length]}`}
                style={{ width: `${maxCount > 0 ? (count / maxCount) * 100 : 0}%`, minWidth: count > 0 ? '8px' : '0' }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Quiz results ─────────────────────────────────────────────────────────

function QuizResult({ slide, responses, chartMode }: { slide: Slide; responses: Response[]; chartMode: 'bar' | 'horizontal' }) {
  const content = slide.content as QuizContent
  const correctOptionId = content.options.find((o) => o.is_correct)?.id
  const counts: Record<string, number> = {}
  for (const r of responses) {
    const id = (r.answer as { selected_option_id?: string }).selected_option_id
    if (id) counts[id] = (counts[id] || 0) + 1
  }
  const correctCount = correctOptionId ? (counts[correctOptionId] || 0) : 0
  const correctPct = responses.length > 0 ? Math.round((correctCount / responses.length) * 100) : 0
  const maxCount = Math.max(...Object.values(counts), 1)

  return (
    <div className="space-y-4">
      {/* Correct answer summary */}
      <div className="flex items-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
          <span className="text-lg font-bold text-emerald-600">{correctPct}%</span>
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">answered correctly</p>
          <p className="text-xs text-muted-foreground">{correctCount} of {responses.length} responses</p>
        </div>
      </div>

      {/* Option breakdown */}
      <div className="space-y-2">
        {content.options.map((opt, i) => {
          const count = counts[opt.id] || 0
          const isCorrect = opt.is_correct
          return (
            <div key={opt.id}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-foreground">{opt.text}</span>
                  {isCorrect && <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-medium">Correct</span>}
                </div>
                <span className="text-xs font-mono text-muted-foreground">{count}</span>
              </div>
              <div className="h-4 bg-muted rounded-lg overflow-hidden">
                <div
                  className={`h-full rounded-lg transition-all duration-700 ease-out ${isCorrect ? 'bg-emerald-500' : BAR_COLORS[i % BAR_COLORS.length]}`}
                  style={{ width: `${maxCount > 0 ? (count / maxCount) * 100 : 0}%`, minWidth: count > 0 ? '4px' : '0' }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Word cloud results ───────────────────────────────────────────────────

function WordCloudResult({ responses }: { responses: Response[] }) {
  const wordCounts: Record<string, number> = {}
  for (const r of responses) {
    const word = ((r.answer as { word?: string }).word || '').toLowerCase().trim()
    if (word) wordCounts[word] = (wordCounts[word] || 0) + 1
  }

  const sorted = Object.entries(wordCounts).sort((a, b) => b[1] - a[1])
  const maxCount = sorted[0]?.[1] || 1

  if (sorted.length === 0) return <p className="text-sm text-muted-foreground text-center">No words submitted</p>

  return (
    <div className="flex flex-wrap gap-2 justify-center py-4">
      {sorted.map(([word, count]) => {
        const scale = 0.7 + (count / maxCount) * 1.3
        const opacity = 0.5 + (count / maxCount) * 0.5
        return (
          <span
            key={word}
            className="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium transition-transform hover:scale-110"
            style={{ fontSize: `${scale}rem`, opacity }}
            title={`${word}: ${count} time${count !== 1 ? 's' : ''}`}
          >
            {word}
            {count > 1 && <sup className="ml-0.5 text-[0.6em] text-primary/60">{count}</sup>}
          </span>
        )
      })}
    </div>
  )
}

// ─── Rating scale results ─────────────────────────────────────────────────

function RatingScaleResult({ slide, responses }: { slide: Slide; responses: Response[] }) {
  const content = slide.content as RatingScaleContent
  const ratings = responses.map((r) => (r.answer as { rating?: number }).rating).filter((v): v is number => typeof v === 'number')
  const avg = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0

  // Distribution
  const distribution: Record<number, number> = {}
  for (let v = content.min_value; v <= content.max_value; v += content.step) distribution[v] = 0
  for (const r of ratings) distribution[r] = (distribution[r] || 0) + 1
  const maxCount = Math.max(...Object.values(distribution), 1)

  return (
    <div className="space-y-4">
      {/* Average */}
      <div className="flex items-center justify-center gap-4 py-4">
        <div className="text-center">
          <p className="text-4xl font-bold text-primary font-mono">{avg.toFixed(1)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Average of {ratings.length} rating{ratings.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="text-xs text-muted-foreground text-left space-y-0.5">
          <p>{content.min_value} = {content.min_label}</p>
          <p>{content.max_value} = {content.max_label}</p>
        </div>
      </div>

      {/* Distribution bars */}
      <div className="flex items-end gap-1 justify-center h-24">
        {Object.entries(distribution).map(([val, count]) => {
          const height = maxCount > 0 ? (count / maxCount) * 100 : 0
          return (
            <div key={val} className="flex flex-col items-center gap-1 flex-1 max-w-10">
              {count > 0 && <span className="text-[10px] font-mono text-muted-foreground">{count}</span>}
              <div className="w-full relative" style={{ height: '60px' }}>
                <div
                  className="absolute bottom-0 w-full rounded-t bg-primary/70 transition-all duration-500"
                  style={{ height: `${height}%`, minHeight: count > 0 ? '2px' : '0' }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground">{val}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Open text results ────────────────────────────────────────────────────

function OpenTextResult({ responses }: { responses: Response[] }) {
  const texts = responses
    .map((r) => ({ text: (r.answer as { text?: string }).text || '', time: r.created_at }))
    .filter((t) => t.text)

  if (texts.length === 0) return <p className="text-sm text-muted-foreground text-center">No responses</p>

  return (
    <div className="space-y-2 max-h-80 overflow-y-auto">
      {texts.map((t, i) => (
        <div key={i} className="bg-muted/50 rounded-lg px-4 py-3">
          <p className="text-sm text-foreground whitespace-pre-wrap">{t.text}</p>
        </div>
      ))}
    </div>
  )
}

// ─── Q&A results ──────────────────────────────────────────────────────────

function QnAResult({ responses }: { responses: Response[] }) {
  return (
    <p className="text-sm text-muted-foreground text-center py-4">
      Q&A responses are shown in real-time during the session. {responses.length} interaction{responses.length !== 1 ? 's' : ''} recorded.
    </p>
  )
}

// ─── Survey results ───────────────────────────────────────────────────────

function SurveyResult({ responses }: { responses: Response[] }) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        {responses.length} survey response{responses.length !== 1 ? 's' : ''} collected.
      </p>
      <p className="text-xs text-muted-foreground">
        Export to CSV for detailed survey analysis.
      </p>
    </div>
  )
}
