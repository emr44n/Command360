'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import type {
  Slide, PollContent, WordCloudContent, QuizContent, SurveyContent,
  ContentSlideContent, RatingScaleContent, OpenTextContent, CanvasElement,
} from '@/types/slide'
import {
  BarChart2, Cloud, HelpCircle, MessageCircle, ClipboardList,
  FileText, Star, AlignLeft,
} from 'lucide-react'
import { CanvasElementsLayer } from './CanvasElementsLayer'

interface SlideCanvasProps {
  slide: Slide | null
  slides: Slide[]
  selectedIndex: number
  devicePreview: 'desktop' | 'tablet' | 'phone'
  onTitleChange?: (title: string) => void
  onCanvasElementsChange?: (elements: CanvasElement[]) => void
  selectedElementId?: string | null
  onSelectElement?: (id: string | null) => void
  onRequestAddImage?: () => void
  onSelectSlide?: (id: string) => void
  onPrev: () => void
  onNext: () => void
}

const TYPE_ICONS: Record<string, React.ElementType> = {
  poll: BarChart2, word_cloud: Cloud, quiz: HelpCircle, qna: MessageCircle,
  survey: ClipboardList, content: FileText, rating_scale: Star, open_text: AlignLeft,
}

const TYPE_LABELS: Record<string, string> = {
  poll: 'Poll', word_cloud: 'Word Cloud', quiz: 'Quiz', qna: 'Q&A',
  survey: 'Survey', content: 'Content', rating_scale: 'Rating Scale', open_text: 'Open Text',
}

const TYPE_COLORS: Record<string, string> = {
  poll: '#dc2626', word_cloud: '#3b82f6', quiz: '#10b981', qna: '#f59e0b',
  survey: '#ec4899', content: '#6b7280', rating_scale: '#f97316', open_text: '#14b8a6',
}

export function SlideCanvas({ slide, slides, selectedIndex, devicePreview, onTitleChange, onCanvasElementsChange, selectedElementId, onSelectElement, onRequestAddImage, onSelectSlide, onPrev, onNext }: SlideCanvasProps) {
  const slideCardRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Mouse wheel to navigate between slides (like PowerPoint)
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    function onWheel(e: WheelEvent) {
      // Don't intercept if user is scrolling inside a text element
      const target = e.target as HTMLElement
      if (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT') return

      e.preventDefault()
      if (e.deltaY > 0) {
        onNext()
      } else if (e.deltaY < 0) {
        onPrev()
      }
    }

    container.addEventListener('wheel', onWheel, { passive: false })
    return () => container.removeEventListener('wheel', onWheel)
  }, [onNext, onPrev])

  if (!slide) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ background: '#2a2a2e' }}>
        <div className="text-center text-muted-foreground">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <FileText className="w-7 h-7 opacity-40" />
          </div>
          <p className="text-sm font-medium">Select a slide to preview</p>
          <p className="text-xs opacity-50 mt-1">Or add a new slide to get started</p>
        </div>
      </div>
    )
  }

  const SIcon = TYPE_ICONS[slide.slide_type] || FileText
  const sColor = TYPE_COLORS[slide.slide_type] || '#6b7280'
  const sLabel = TYPE_LABELS[slide.slide_type] || slide.slide_type

  return (
    <div
      ref={containerRef}
      className="flex-1 flex flex-col items-center justify-center overflow-hidden relative"
      style={{
        // Neutral grey pasteboard with subtle dot pattern (like PowerPoint)
        backgroundColor: '#2a2a2e',
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }}
      onClick={(e) => {
        // Click on pasteboard deselects element
        if (e.target === e.currentTarget && onSelectElement) {
          onSelectElement(null)
        }
      }}
    >
      {/* Slide number + type badge — top-left */}
      <div className="absolute top-4 left-5 flex items-center gap-2 z-10">
        <span className="text-xs font-bold tabular-nums" style={{ color: 'rgba(255,255,255,0.3)' }}>
          {selectedIndex + 1} / {slides.length}
        </span>
        <div className="flex items-center gap-1.5 rounded-md px-2 py-0.5" style={{ background: `${sColor}20` }}>
          <SIcon style={{ width: 11, height: 11, color: sColor }} />
          <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: sColor }}>
            {sLabel}
          </span>
        </div>
      </div>

      {/* The single slide — centered and fitted to fill available space */}
      <div
        style={{
          width: '90%',
          maxWidth: 1100,
          padding: '0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          ref={slideCardRef}
          style={{
            width: '100%',
            aspectRatio: '16/9',
            background: '#ffffff',
            borderRadius: 12,
            boxShadow: '0 0 0 1px rgba(0,0,0,0.1), 0 20px 60px -15px rgba(0,0,0,0.4)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'visible',
            color: '#111827',
            position: 'relative',
          }}
        >
          {/* Clipping layer for slide content */}
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 12,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {/* Slide header */}
            <div style={{ padding: '24px 32px 12px', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  background: `${sColor}12`, borderRadius: 6, padding: '3px 8px',
                }}>
                  <SIcon style={{ width: 12, height: 12, color: sColor }} />
                  <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: sColor }}>
                    {sLabel}
                  </span>
                </div>
              </div>

              <InlineTitle
                value={slide.title}
                onChange={onTitleChange}
                slideType={slide.slide_type}
              />
            </div>

            {/* Content */}
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 32px 24px',
              overflow: 'hidden',
            }}>
              <SlidePreview slide={slide} />
            </div>
          </div>

          {/* Canvas elements layer — outside clipping so they can overflow */}
          {onCanvasElementsChange && (
            <CanvasElementsLayer
              elements={(slide.content as Record<string, unknown>)?._canvas_elements as CanvasElement[] || []}
              onChange={onCanvasElementsChange}
              containerRef={slideCardRef}
              selectedElementId={selectedElementId}
              onSelectElement={onSelectElement}
              onRequestAddImage={onRequestAddImage}
            />
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── Inline Title ─────────────────────────────────────────────────────────── */

function InlineTitle({ value, onChange, slideType }: {
  value: string; onChange?: (v: string) => void; slideType: string
}) {
  const [editing, setEditing] = useState(false)
  const [localValue, setLocalValue] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { setLocalValue(value) }, [value])
  useEffect(() => {
    if (editing && inputRef.current) { inputRef.current.focus(); inputRef.current.select() }
  }, [editing])

  const commit = useCallback(() => {
    setEditing(false)
    if (onChange && localValue !== value) onChange(localValue)
  }, [localValue, value, onChange])

  const placeholders: Record<string, string> = {
    poll: 'What do you want to ask?',
    word_cloud: 'Enter your prompt...',
    quiz: 'Enter your question...',
    qna: 'Q&A Session Title...',
    survey: 'Survey title...',
    content: 'Slide title...',
    rating_scale: 'What should they rate?',
    open_text: 'What should they write about?',
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setLocalValue(value); setEditing(false) } }}
        placeholder={placeholders[slideType] || 'Untitled slide'}
        style={{
          fontSize: 24, fontWeight: 700, color: '#111827', background: 'transparent',
          border: 'none', outline: 'none', width: '100%', lineHeight: 1.3,
        }}
      />
    )
  }

  return (
    <h2
      onClick={() => setEditing(true)}
      style={{
        fontSize: 24, fontWeight: 700, color: '#111827', cursor: 'text', lineHeight: 1.3,
        minHeight: '1.3em', borderRadius: 8, padding: '2px 4px', margin: '-2px -4px',
        transition: 'background 0.15s',
      }}
      onMouseEnter={(e) => { (e.target as HTMLElement).style.background = '#f3f4f6' }}
      onMouseLeave={(e) => { (e.target as HTMLElement).style.background = 'transparent' }}
    >
      {value || <span style={{ color: '#9ca3af', fontStyle: 'italic', fontWeight: 400 }}>{placeholders[slideType] || 'Untitled slide'}</span>}
    </h2>
  )
}

/* ─── Slide Preview ────────────────────────────────────────────────────────── */

function SlidePreview({ slide }: { slide: Slide }) {
  const gap = 10
  const fontSize = 14
  const pad = '12px 20px'

  switch (slide.slide_type) {
    case 'poll': {
      const c = slide.content as PollContent
      return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap }}>
          {(c.options || []).map((o, i) => (
            <div key={i} style={{
              background: '#f3f4f6', borderRadius: 12, padding: pad,
              fontSize, fontWeight: 500, color: '#374151',
              cursor: 'default',
            }}>
              {o.text || `Option ${i + 1}`}
            </div>
          ))}
          {(c.options || []).length === 0 && (
            <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: 13, padding: 20 }}>
              Add options in the settings panel
            </div>
          )}
        </div>
      )
    }
    case 'word_cloud': {
      const c = slide.content as WordCloudContent
      return (
        <div style={{ textAlign: 'center', color: '#9ca3af' }}>
          <Cloud style={{ width: 52, height: 52, margin: '0 auto 10px', opacity: 0.25 }} />
          <p style={{ fontSize }}>{c.prompt || 'Participants type words here'}</p>
        </div>
      )
    }
    case 'quiz': {
      const c = slide.content as QuizContent
      return (
        <div style={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap }}>
          {(c.options || []).map((o, i) => (
            <div key={i} style={{
              background: o.is_correct ? '#dcfce7' : '#f3f4f6',
              border: o.is_correct ? '2px solid #22c55e' : '2px solid transparent',
              borderRadius: 12, padding: pad,
              fontSize: 13, fontWeight: 500,
              color: o.is_correct ? '#166534' : '#374151',
              textAlign: 'center',
            }}>
              {o.text || `Option ${i + 1}`}
              {o.is_correct && <span style={{ marginLeft: 4, color: '#22c55e' }}>&#10003;</span>}
            </div>
          ))}
        </div>
      )
    }
    case 'rating_scale': {
      const c = slide.content as RatingScaleContent
      const min = c.min_value ?? 1
      const max = c.max_value ?? 10
      const count = Math.min(max - min + 1, 10)
      return (
        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 8 }}>
            {Array.from({ length: count }, (_, i) => (
              <div key={i} style={{
                width: 40, height: 40, borderRadius: 10,
                background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 600, color: '#374151',
              }}>
                {min + i}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#9ca3af', padding: '0 4px' }}>
            <span>{c.min_label || 'Low'}</span>
            <span>{c.max_label || 'High'}</span>
          </div>
        </div>
      )
    }
    case 'open_text': {
      const c = slide.content as OpenTextContent
      return (
        <div style={{ width: '100%' }}>
          <div style={{
            border: '2px dashed #d1d5db', borderRadius: 12,
            padding: '16px 20px',
            color: '#9ca3af', fontSize,
          }}>
            {c.placeholder || 'Type your response here...'}
          </div>
          {c.max_length > 0 && (
            <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 6, textAlign: 'center' }}>
              Max {c.max_length} characters
            </p>
          )}
        </div>
      )
    }
    case 'content': {
      const c = slide.content as ContentSlideContent
      return (
        <div style={{
          fontSize: 16, whiteSpace: 'pre-wrap', lineHeight: 1.7,
          textAlign: 'center', maxWidth: 500, color: '#374151',
        }}>
          {c.body || <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>No content yet</span>}
        </div>
      )
    }
    case 'survey': {
      const c = slide.content as SurveyContent
      return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap }}>
          {(c.questions || []).slice(0, 3).map((q, i) => (
            <div key={i} style={{ background: '#f3f4f6', borderRadius: 10, padding: pad, fontSize, color: '#374151' }}>
              {i + 1}. {q.text || `Question ${i + 1}`}
            </div>
          ))}
          {(c.questions || []).length > 3 && (
            <p style={{ fontSize: 11, color: '#9ca3af', textAlign: 'center' }}>+{(c.questions || []).length - 3} more</p>
          )}
        </div>
      )
    }
    case 'qna':
      return (
        <div style={{ textAlign: 'center', color: '#9ca3af' }}>
          <MessageCircle style={{ width: 48, height: 48, margin: '0 auto 10px', opacity: 0.25 }} />
          <p style={{ fontSize }}>Audience submits questions here</p>
          <p style={{ fontSize: 11, marginTop: 4, opacity: 0.6 }}>Upvote and moderate in real time</p>
        </div>
      )
    default:
      return null
  }
}
