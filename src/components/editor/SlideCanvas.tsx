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

const DEVICE_STYLES = {
  desktop: { maxWidth: 840, aspectRatio: '16/9', borderRadius: 20 },
  tablet: { maxWidth: 520, aspectRatio: '3/4', borderRadius: 24 },
  phone: { maxWidth: 320, aspectRatio: '9/16', borderRadius: 32 },
}

const SLIDE_GAP = 80
const CANVAS_PAD_Y = 100
const CANVAS_PAD_X = 60
// Extra space around the slide for the "pasteboard" overflow area
const OVERFLOW_ZONE = 60

export function SlideCanvas({ slide, slides, selectedIndex, devicePreview, onTitleChange, onCanvasElementsChange, selectedElementId, onSelectElement, onRequestAddImage, onSelectSlide, onPrev, onNext }: SlideCanvasProps) {
  const deviceStyle = DEVICE_STYLES[devicePreview]
  const slideCardRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const slideWrapperRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const prevSelectedId = useRef<string | null>(null)

  // Scroll to the selected slide when it changes (from thumbnail click or canvas click)
  useEffect(() => {
    if (!slide) return
    // Only auto-scroll when the selection actually changed (not on re-renders)
    if (prevSelectedId.current === slide.id) return
    prevSelectedId.current = slide.id

    // Use requestAnimationFrame to ensure DOM has updated
    requestAnimationFrame(() => {
      const el = slideWrapperRefs.current.get(slide.id)
      const container = scrollContainerRef.current
      if (!el || !container) return

      // Get the element's position relative to the scroll container
      const containerTop = container.getBoundingClientRect().top
      const elTop = el.getBoundingClientRect().top
      const elHeight = el.getBoundingClientRect().height
      const containerHeight = container.clientHeight

      // Calculate scroll position to center the slide
      const currentScroll = container.scrollTop
      const elRelativeTop = elTop - containerTop + currentScroll
      const targetScroll = elRelativeTop - (containerHeight / 2) + (elHeight / 2)

      container.scrollTo({
        top: Math.max(0, targetScroll),
        behavior: 'smooth',
      })
    })
  }, [slide?.id])

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

  return (
    <div className="flex-1 flex flex-col overflow-hidden editor-canvas-bg">
      {/* Scrollable canvas workspace — PowerPoint/Canva-style pasteboard */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden"
        onClick={(e) => {
          // Click on pasteboard background deselects element
          if (e.target === e.currentTarget && onSelectElement) {
            onSelectElement(null)
          }
        }}
      >
        <div style={{
          padding: `${CANVAS_PAD_Y}px ${CANVAS_PAD_X}px`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: SLIDE_GAP,
          minHeight: '100%',
        }}>
          {slides.map((s, i) => {
            const isSelected = i === selectedIndex
            const SIcon = TYPE_ICONS[s.slide_type] || FileText
            const sColor = TYPE_COLORS[s.slide_type] || '#6b7280'
            const sLabel = TYPE_LABELS[s.slide_type] || s.slide_type

            return (
              <div
                key={s.id}
                ref={(el) => {
                  if (el) slideWrapperRefs.current.set(s.id, el)
                  else slideWrapperRefs.current.delete(s.id)
                }}
                className="relative transition-all duration-200"
                style={{
                  maxWidth: deviceStyle.maxWidth,
                  width: '100%',
                  cursor: isSelected ? 'default' : 'pointer',
                  transform: isSelected ? 'scale(1)' : 'scale(0.92)',
                  opacity: isSelected ? 1 : 0.55,
                }}
                onClick={() => {
                  if (!isSelected && onSelectSlide) {
                    onSelectSlide(s.id)
                  }
                }}
              >
                {/* Slide number + type badge */}
                <div className="flex items-center gap-2 mb-2 px-1">
                  <span className="text-xs font-bold text-muted-foreground/40 tabular-nums">{i + 1}</span>
                  <div className="flex items-center gap-1.5 rounded-md px-2 py-0.5" style={{ background: `${sColor}15` }}>
                    <SIcon style={{ width: 11, height: 11, color: sColor }} />
                    <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: sColor }}>
                      {sLabel}
                    </span>
                  </div>
                </div>

                {/* ─── Pasteboard area (allows element overflow) ─── */}
                <div style={{
                  position: 'relative',
                  padding: OVERFLOW_ZONE,
                }}>
                  {/* Semi-transparent overlay for overflow areas — only for selected slide */}
                  {isSelected && (
                    <>
                      {/* Top overflow */}
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: OVERFLOW_ZONE, background: 'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(128,128,128,0.03) 8px, rgba(128,128,128,0.03) 16px)', borderRadius: '12px 12px 0 0', pointerEvents: 'none' }} />
                      {/* Bottom overflow */}
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: OVERFLOW_ZONE, background: 'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(128,128,128,0.03) 8px, rgba(128,128,128,0.03) 16px)', borderRadius: '0 0 12px 12px', pointerEvents: 'none' }} />
                      {/* Left overflow */}
                      <div style={{ position: 'absolute', top: OVERFLOW_ZONE, bottom: OVERFLOW_ZONE, left: 0, width: OVERFLOW_ZONE, background: 'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(128,128,128,0.03) 8px, rgba(128,128,128,0.03) 16px)', pointerEvents: 'none' }} />
                      {/* Right overflow */}
                      <div style={{ position: 'absolute', top: OVERFLOW_ZONE, bottom: OVERFLOW_ZONE, right: 0, width: OVERFLOW_ZONE, background: 'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(128,128,128,0.03) 8px, rgba(128,128,128,0.03) 16px)', pointerEvents: 'none' }} />
                    </>
                  )}

                  {/* The actual slide card */}
                  <div
                    ref={isSelected ? slideCardRef : undefined}
                    style={{
                      width: '100%',
                      aspectRatio: '16/9',
                      background: '#ffffff',
                      borderRadius: 16,
                      boxShadow: isSelected
                        ? '0 0 0 3px #dc2626, 0 25px 60px -12px rgba(0,0,0,0.25)'
                        : '0 0 0 1px rgba(0,0,0,0.06), 0 4px 16px -4px rgba(0,0,0,0.1)',
                      display: 'flex',
                      flexDirection: 'column',
                      // IMPORTANT: overflow visible so elements can extend beyond the slide
                      overflow: 'visible',
                      color: '#111827',
                      position: 'relative',
                      transition: 'box-shadow 0.2s ease',
                    }}
                  >
                    {/* Clipping layer — clips the slide content but NOT canvas elements */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: 16,
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

                        {/* Title — editable only for selected slide */}
                        {isSelected ? (
                          <InlineTitle
                            value={s.title}
                            onChange={onTitleChange}
                            slideType={s.slide_type}
                            compact={false}
                          />
                        ) : (
                          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#111827', lineHeight: 1.3 }}>
                            {s.title || <span style={{ color: '#9ca3af', fontStyle: 'italic', fontWeight: 400 }}>Untitled slide</span>}
                          </h2>
                        )}
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
                        <SlidePreview slide={s} compact={false} />
                      </div>
                    </div>

                    {/* Canvas elements layer — OUTSIDE the clipping layer so they can overflow */}
                    {isSelected && onCanvasElementsChange && (
                      <CanvasElementsLayer
                        elements={(s.content as Record<string, unknown>)?._canvas_elements as CanvasElement[] || []}
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
          })}
        </div>
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
