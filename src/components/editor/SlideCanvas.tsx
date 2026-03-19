'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import type {
  Slide, PollContent, WordCloudContent, QuizContent, SurveyContent,
  ContentSlideContent, RatingScaleContent, OpenTextContent, CanvasElement,
} from '@/types/slide'
import {
  BarChart2, Cloud, HelpCircle, MessageCircle, ClipboardList,
  FileText, Star, AlignLeft, ChevronLeft, ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
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

const DEVICE_STYLES = {
  desktop: { maxWidth: 840, aspectRatio: '16/9', borderRadius: 20 },
  tablet: { maxWidth: 520, aspectRatio: '3/4', borderRadius: 24 },
  phone: { maxWidth: 320, aspectRatio: '9/16', borderRadius: 32 },
}

export function SlideCanvas({ slide, slides, selectedIndex, devicePreview, onTitleChange, onCanvasElementsChange, selectedElementId, onSelectElement, onRequestAddImage, onPrev, onNext }: SlideCanvasProps) {
  const deviceStyle = DEVICE_STYLES[devicePreview]
  const slideCardRef = useRef<HTMLDivElement>(null)

  if (!slide) {
    return (
      <div className="flex-1 flex items-center justify-center editor-canvas-bg">
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

  const Icon = TYPE_ICONS[slide.slide_type] || FileText
  const typeColor = TYPE_COLORS[slide.slide_type] || '#6b7280'
  const typeLabel = TYPE_LABELS[slide.slide_type] || slide.slide_type

  return (
    <div className="flex-1 flex flex-col overflow-hidden editor-canvas-bg">
      {/* Canvas area */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        {/* Prev/Next arrows */}
        {selectedIndex > 0 && (
          <button
            onClick={onPrev}
            className="absolute left-4 z-10 p-2 rounded-full transition-all hover:scale-110 bg-muted/60 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        {selectedIndex < slides.length - 1 && (
          <button
            onClick={onNext}
            className="absolute right-4 z-10 p-2 rounded-full transition-all hover:scale-110 bg-muted/60 text-muted-foreground hover:text-foreground"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Device frame */}
        <div
          className="relative transition-all duration-300 ease-out"
          style={{
            width: '100%',
            maxWidth: deviceStyle.maxWidth,
            aspectRatio: deviceStyle.aspectRatio,
            maxHeight: '100%',
          }}
        >
          {/* Phone notch */}
          {devicePreview === 'phone' && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 rounded-xl bg-background z-10" />
          )}

          {/* Slide card */}
          <div
            ref={slideCardRef}
            style={{
              width: '100%',
              height: '100%',
              background: '#ffffff',
              borderRadius: deviceStyle.borderRadius,
              boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 25px 60px -12px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              color: '#111827',
              position: 'relative',
            }}
          >
            {/* Canvas elements layer (text + images) */}
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
            {/* Slide header area */}
            <div style={{
              padding: devicePreview === 'phone' ? '40px 20px 12px' : '32px 40px 16px',
              flexShrink: 0,
            }}>
              {/* Type badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  background: `${typeColor}12`, borderRadius: 6, padding: '3px 8px',
                }}>
                  <Icon style={{ width: 12, height: 12, color: typeColor }} />
                  <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: typeColor }}>
                    {typeLabel}
                  </span>
                </div>
              </div>

              {/* Inline editable title */}
              <InlineTitle
                value={slide.title}
                onChange={onTitleChange}
                slideType={slide.slide_type}
                compact={devicePreview === 'phone'}
              />
            </div>

            {/* Content area */}
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: devicePreview === 'phone' ? '0 20px 20px' : '0 40px 32px',
              overflow: 'hidden',
            }}>
              <SlidePreview slide={slide} compact={devicePreview === 'phone'} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="h-10 flex items-center justify-center gap-1 shrink-0 bg-muted/50 border-t border-border">
        {slides.map((s, i) => (
          <div
            key={s.id}
            className={cn(
              'h-1.5 rounded-full transition-all duration-250',
              i === selectedIndex ? 'w-5 bg-primary' : 'w-1.5 bg-muted-foreground/25'
            )}
          />
        ))}
        <span className="text-[11px] text-muted-foreground/50 ml-2 tabular-nums">
          {selectedIndex + 1} / {slides.length}
        </span>
      </div>
    </div>
  )
}

/* ─── Inline Title ─────────────────────────────────────────────────────────── */

function InlineTitle({ value, onChange, slideType, compact }: {
  value: string; onChange?: (v: string) => void; slideType: string; compact?: boolean
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

  const fontSize = compact ? 18 : 24

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
          fontSize, fontWeight: 700, color: '#111827', background: 'transparent',
          border: 'none', outline: 'none', width: '100%', lineHeight: 1.3,
        }}
      />
    )
  }

  return (
    <h2
      onClick={() => setEditing(true)}
      style={{
        fontSize, fontWeight: 700, color: '#111827', cursor: 'text', lineHeight: 1.3,
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

function SlidePreview({ slide, compact }: { slide: Slide; compact?: boolean }) {
  const gap = compact ? 6 : 10
  const fontSize = compact ? 12 : 14
  const pad = compact ? '8px 12px' : '12px 20px'

  switch (slide.slide_type) {
    case 'poll': {
      const c = slide.content as PollContent
      return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap }}>
          {(c.options || []).map((o, i) => (
            <div key={i} style={{
              background: '#f3f4f6', borderRadius: 12, padding: pad,
              fontSize, fontWeight: 500, color: '#374151',
              transition: 'background 0.15s',
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
          <Cloud style={{ width: compact ? 40 : 52, height: compact ? 40 : 52, margin: '0 auto 10px', opacity: 0.25 }} />
          <p style={{ fontSize }}>{c.prompt || 'Participants type words here'}</p>
        </div>
      )
    }
    case 'quiz': {
      const c = slide.content as QuizContent
      return (
        <div style={{ width: '100%', display: 'grid', gridTemplateColumns: compact ? '1fr' : 'repeat(2, 1fr)', gap }}>
          {(c.options || []).map((o, i) => (
            <div key={i} style={{
              background: o.is_correct ? '#dcfce7' : '#f3f4f6',
              border: o.is_correct ? '2px solid #22c55e' : '2px solid transparent',
              borderRadius: 12, padding: pad,
              fontSize: compact ? 11 : 13, fontWeight: 500,
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
      const size = compact ? 28 : 40
      return (
        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: compact ? 3 : 6, marginBottom: 8 }}>
            {Array.from({ length: count }, (_, i) => (
              <div key={i} style={{
                width: size, height: size, borderRadius: size / 4,
                background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: compact ? 11 : 14, fontWeight: 600, color: '#374151',
              }}>
                {min + i}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: compact ? 10 : 12, color: '#9ca3af', padding: '0 4px' }}>
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
            padding: compact ? '10px 14px' : '16px 20px',
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
          fontSize: compact ? 13 : 16, whiteSpace: 'pre-wrap', lineHeight: 1.7,
          textAlign: 'center', maxWidth: 500, color: '#374151',
        }}>
          {c.body || <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>No content yet</span>}
        </div>
      )
    }
    case 'survey': {
      const c = slide.content as SurveyContent
      const maxShow = compact ? 2 : 3
      return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap }}>
          {(c.questions || []).slice(0, maxShow).map((q, i) => (
            <div key={i} style={{ background: '#f3f4f6', borderRadius: 10, padding: pad, fontSize, color: '#374151' }}>
              {i + 1}. {q.text || `Question ${i + 1}`}
            </div>
          ))}
          {(c.questions || []).length > maxShow && (
            <p style={{ fontSize: 11, color: '#9ca3af', textAlign: 'center' }}>+{(c.questions || []).length - maxShow} more</p>
          )}
        </div>
      )
    }
    case 'qna':
      return (
        <div style={{ textAlign: 'center', color: '#9ca3af' }}>
          <MessageCircle style={{ width: compact ? 36 : 48, height: compact ? 36 : 48, margin: '0 auto 10px', opacity: 0.25 }} />
          <p style={{ fontSize }}>Audience submits questions here</p>
          <p style={{ fontSize: 11, marginTop: 4, opacity: 0.6 }}>Upvote and moderate in real time</p>
        </div>
      )
    default:
      return null
  }
}
