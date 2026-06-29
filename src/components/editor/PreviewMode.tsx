'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type {
  Slide, PollContent, WordCloudContent, QuizContent, ContentSlideContent,
  SurveyContent, RatingScaleContent, OpenTextContent,
  StudioContent, StudioLayer, StudioLayerState, StudioEvent,
} from '@/types/slide'
import {
  ArrowLeft, ArrowRight, X, BarChart2, Cloud, HelpCircle,
  MessageCircle, ClipboardList, FileText, Star, AlignLeft, Monitor,
  Smartphone, Grid3X3, StickyNote, Timer, Maximize, Minimize,
  ChevronLeft, ChevronRight, Keyboard, Pause, Play, QrCode, Wifi,
  Zap, Vote,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { BrandMark } from '@/components/site/BrandMark'
import { buildEdgeFadeMasks, type EdgeFade } from '@/lib/editor/edge-fade'

interface Props {
  presentation: { id: string; title: string }
  slides: Slide[]
  startSlide?: number // index of the slide to start from
}

const TYPE_ICONS: Record<string, React.ElementType> = {
  poll: BarChart2, word_cloud: Cloud, quiz: HelpCircle, qna: MessageCircle,
  survey: ClipboardList, content: FileText, rating_scale: Star, open_text: AlignLeft,
  studio: Monitor,
}

const TYPE_COLORS: Record<string, string> = {
  poll: '#dc2626', word_cloud: '#3b82f6', quiz: '#10b981', qna: '#f59e0b',
  survey: '#ec4899', content: '#6b7280', rating_scale: '#f97316', open_text: '#14b8a6',
  studio: '#8b5cf6',
}

const TYPE_LABELS: Record<string, string> = {
  poll: 'Poll', word_cloud: 'Word Cloud', quiz: 'Quiz', qna: 'Q&A',
  survey: 'Survey', content: 'Content', rating_scale: 'Rating Scale', open_text: 'Open Text',
  studio: 'Studio',
}

export function PreviewMode({ presentation, slides, startSlide = 0 }: Props) {
  const router = useRouter()
  const [current, setCurrent] = useState(startSlide)
  const [animClass, setAnimClass] = useState('preview-slide-in')
  const [showNotes, setShowNotes] = useState(false)
  const [showGrid, setShowGrid] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const slide = slides[current] || null
  const progress = slides.length > 0 ? ((current + 1) / slides.length) * 100 : 0

  // Fullscreen tracking
  useEffect(() => {
    const handleFS = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handleFS)
    return () => document.removeEventListener('fullscreenchange', handleFS)
  }, [])

  const navigateTo = useCallback((index: number) => {
    if (index < 0 || index >= slides.length || index === current) return
    const dir = index > current ? 'preview-slide-in' : 'preview-slide-in-reverse'
    setAnimClass('preview-slide-out')
    setTimeout(() => {
      setCurrent(index)
      setAnimClass(dir)
    }, 150)
  }, [current, slides.length])

  const goNext = useCallback(() => navigateTo(current + 1), [current, navigateTo])
  const goPrev = useCallback(() => navigateTo(current - 1), [current, navigateTo])

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return
    if (document.fullscreenElement) document.exitFullscreen()
    else containerRef.current.requestFullscreen()
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (showGrid || showShortcuts) {
        if (e.key === 'Escape') { setShowGrid(false); setShowShortcuts(false) }
        if (showGrid && e.key >= '1' && e.key <= '9') {
          const idx = parseInt(e.key) - 1
          if (idx < slides.length) { setCurrent(idx); setShowGrid(false) }
        }
        return
      }
      switch (e.key) {
        case 'ArrowRight': case ' ': case 'PageDown': e.preventDefault(); goNext(); break
        case 'ArrowLeft': case 'PageUp': e.preventDefault(); goPrev(); break
        case 'Escape': router.push(`/presentations/${presentation.id}/edit`); break
        case 'Home': e.preventDefault(); navigateTo(0); break
        case 'End': e.preventDefault(); navigateTo(slides.length - 1); break
        case 'g': case 'G': setShowGrid(true); break
        case 'n': case 'N': setShowNotes(v => !v); break
        case 'f': case 'F': toggleFullscreen(); break
        case '?': setShowShortcuts(v => !v); break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNext, goPrev, router, presentation.id, navigateTo, slides.length, showGrid, showShortcuts, toggleFullscreen])

  if (slides.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <Monitor className="w-12 h-12 opacity-30 mx-auto mb-4" />
          <p className="text-muted-foreground">No slides to preview</p>
          <button
            onClick={() => router.push(`/presentations/${presentation.id}/edit`)}
            className="mt-4 px-5 py-2 rounded-none bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Back to editor
          </button>
        </div>
      </div>
    )
  }

  const Icon = TYPE_ICONS[slide?.slide_type || 'content'] || FileText
  const typeColor = TYPE_COLORS[slide?.slide_type || 'content'] || '#6b7280'

  return (
    <div ref={containerRef} className="h-screen flex flex-col bg-background text-foreground select-none overflow-hidden">
      {/* Inline keyframes */}
      <style>{`
        .preview-slide-in { animation: prevSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .preview-slide-in-reverse { animation: prevSlideInReverse 0.3s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .preview-slide-out { animation: prevSlideOut 0.15s ease-in both; }
        .preview-grid-in { animation: prevGridIn 0.2s ease-out both; }
        @keyframes prevSlideIn { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes prevSlideInReverse { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes prevSlideOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes prevGridIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>

      {/* Progress bar */}
      <div className="h-[3px] bg-muted shrink-0">
        <div
          className="h-full bg-primary shadow-[0_0_8px_rgba(220,38,38,0.4)]"
          style={{ width: `${progress}%`, transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}
        />
      </div>

      {/* Top bar */}
      <div className="h-11 flex items-center justify-between px-3 bg-card/80 backdrop-blur shrink-0 border-b border-border relative">
        <div className="flex items-center gap-2">
          <TBtn icon={X} title="Back to editor (Esc)" onClick={() => router.push(`/presentations/${presentation.id}/edit`)} />
          <span className="text-[13px] text-muted-foreground font-medium">{presentation.title}</span>
        </div>
        {/* Center logo */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5">
          <BrandMark size={20} />
          <span className="text-xs font-semibold text-muted-foreground tracking-tight">Command 360</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="px-2.5 py-1 rounded-none bg-muted text-xs text-muted-foreground font-semibold">
            {current + 1} / {slides.length}
          </div>
          <TBtn icon={Grid3X3} title="Grid overview (G)" onClick={() => setShowGrid(true)} />
          <TBtn icon={StickyNote} title="Speaker notes (N)" onClick={() => setShowNotes(v => !v)} active={showNotes} />
          <TBtn icon={isFullscreen ? Minimize : Maximize} title="Fullscreen (F)" onClick={toggleFullscreen} />
          <TBtn icon={Keyboard} title="Shortcuts (?)" onClick={() => setShowShortcuts(v => !v)} />
        </div>
      </div>

      {/* DUAL VIEW: Presenter + Audience Phone (or Studio View) */}
      <div className="flex-1 flex overflow-hidden">
        {slide?.slide_type === 'studio' ? (
          <StudioPreviewContent slide={slide} animClass={animClass} allSlides={slides} />
        ) : (<>
        {/* Main content area (presenter + phone centered together) */}
        <div className="flex-1 flex items-center justify-center gap-8 p-5 overflow-hidden min-h-0">
          {/* Left: Presenter Screen with nav arrows */}
          <div className="relative flex flex-col items-center max-w-[900px] flex-[1_1_900px]">
            {/* Label */}
            <div className="flex items-center gap-1.5 mb-2.5">
              <Monitor className="w-[13px] h-[13px] text-muted-foreground/50" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground/50">
                Presenter Screen
              </span>
            </div>

            {/* Nav arrow LEFT */}
            <button
              onClick={goPrev} disabled={current === 0}
              className={cn(
                'absolute left-[-44px] top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-none transition-all',
                current === 0
                  ? 'text-muted-foreground/15 cursor-default'
                  : 'bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer'
              )}
            >
              <ChevronLeft className="w-[18px] h-[18px]" />
            </button>

            {/* Nav arrow RIGHT */}
            <button
              onClick={goNext} disabled={current === slides.length - 1}
              className={cn(
                'absolute right-[-44px] top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-none transition-all',
                current === slides.length - 1
                  ? 'text-muted-foreground/15 cursor-default'
                  : 'bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer'
              )}
            >
              <ChevronRight className="w-[18px] h-[18px]" />
            </button>

            {/* Presenter slide card — always white background for the slide itself */}
            {slide && (
              <div
                className={animClass}
                style={{
                  width: '100%', aspectRatio: '16/9',
                  background: '#ffffff', borderRadius: 14,
                  padding: '28px 36px', display: 'flex', flexDirection: 'column',
                  color: '#111827', overflow: 'hidden', position: 'relative',
                  boxShadow: '0 20px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
                }}
              >
                {/* Type badge + room code */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    background: `${typeColor}14`, borderRadius: 6, padding: '3px 10px',
                  }}>
                    <Icon style={{ width: 12, height: 12, color: typeColor }} />
                    <span style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: typeColor }}>
                      {TYPE_LABELS[slide.slide_type]}
                    </span>
                  </div>
                  <div style={{
                    marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5,
                    background: '#f3f4f6', borderRadius: 6, padding: '3px 10px',
                  }}>
                    <QrCode style={{ width: 9, height: 9, color: '#6b7280' }} />
                    <span style={{ fontSize: 9, fontWeight: 700, fontFamily: 'monospace', color: '#374151', letterSpacing: '0.08em' }}>
                      command360.co.uk/join
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111827', marginBottom: 16, lineHeight: 1.2 }}>
                  {slide.title || 'Untitled slide'}
                </h2>

                {/* Canvas elements (text/images) */}
                {(() => {
                  const canvasEls = (slide.content as Record<string, unknown>)?._canvas_elements as Array<{
                    id: string; type: string; x: number; y: number; width: number; height: number;
                    content: string; style?: Record<string, unknown>; rotation?: number;
                  }> | undefined
                  if (!canvasEls || canvasEls.length === 0) return null
                  return (
                    <div key={slide.id} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }}>
                      <style>{`
                        @keyframes c360FadeIn{0%{opacity:0}33%{opacity:var(--c360-el-op,1)}100%{opacity:var(--c360-el-op,1)}}
                        @keyframes c360FadeOut{0%{opacity:var(--c360-el-op,1)}66%{opacity:var(--c360-el-op,1)}100%{opacity:0}}
                        @keyframes c360FadeBoth{0%{opacity:0}25%{opacity:var(--c360-el-op,1)}75%{opacity:var(--c360-el-op,1)}100%{opacity:0}}
                      `}</style>
                      {canvasEls.map(el => {
                        const st = el.style || {}
                        const radius = st.borderRadiusPct != null ? `${st.borderRadiusPct as number}%` : `${(st.borderRadius as number) || 0}px`
                        const borderW = (st.borderWidth as number) || 0
                        const { vMask, hMask } = buildEdgeFadeMasks(st.edgeFade as EdgeFade | undefined)
                        const imgTransform = `translate(${(st.imagePanX as number) || 0}%, ${(st.imagePanY as number) || 0}%) scale(${(st.imageScale as number) || 1})`
                        const anim = (st.anim as { fadeIn?: boolean; fadeOut?: boolean; speed?: number }) || {}
                        const elOpacity = (st.opacity as number) ?? 1
                        const speed = anim.speed || 600
                        // loop the configured fade in preview so it's visible + tunable
                        const animCss = anim.fadeIn && anim.fadeOut
                          ? `c360FadeBoth ${speed * 4}ms ease-in-out infinite`
                          : anim.fadeIn ? `c360FadeIn ${speed * 3}ms ease-in-out infinite`
                          : anim.fadeOut ? `c360FadeOut ${speed * 3}ms ease-in-out infinite`
                          : undefined
                        return (
                          <div key={el.id} style={{
                            position: 'absolute',
                            left: `${el.x}%`, top: `${el.y}%`,
                            width: `${el.width}%`, height: `${el.height}%`,
                            borderRadius: radius,
                            border: borderW > 0 ? `${borderW}px solid ${(st.borderColor as string) || '#ffffff'}` : undefined,
                            boxSizing: 'border-box',
                            opacity: elOpacity,
                            transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
                            ...(animCss ? { ['--c360-el-op' as string]: elOpacity, animation: animCss } : {}),
                          }}>
                            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: radius, WebkitMaskImage: vMask, maskImage: vMask }}>
                              <div style={{ width: '100%', height: '100%', WebkitMaskImage: hMask, maskImage: hMask }}>
                                {el.type === 'text' && (
                                  <div style={{
                                    width: '100%', height: '100%',
                                    color: (st.color as string) || '#374151',
                                    fontSize: (st.fontSize as number) || 16,
                                    fontWeight: (st.fontWeight as string) || 'normal',
                                    fontStyle: (st.fontStyle as string) || 'normal',
                                    textAlign: (st.textAlign as 'left' | 'center' | 'right') || 'left',
                                    padding: '4px 6px', lineHeight: 1.4, whiteSpace: 'pre-wrap',
                                    backgroundColor: (st.backgroundColor as string) || 'transparent',
                                  }}>
                                    {el.content}
                                  </div>
                                )}
                                {el.type === 'image' && (
                                  <img src={el.content} alt="" style={{
                                    width: '100%', height: '100%',
                                    objectFit: ((st.objectFit as string) || 'cover') as React.CSSProperties['objectFit'],
                                    transform: imgTransform, transformOrigin: 'center',
                                  }} />
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )
                })()}

                {/* Content */}
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <PresenterSlideContent slide={slide} />
                </div>
              </div>
            )}
          </div>

          {/* Right: Audience Phone (iPhone-style) */}
          <div className="flex flex-col items-center shrink-0">
            {/* Label */}
            <div className="flex items-center gap-1.5 mb-2.5">
              <Smartphone className="w-[13px] h-[13px] text-muted-foreground/50" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground/50">
                Audience View
              </span>
            </div>

            {/* iPhone frame */}
            <div style={{
              width: 185,
              height: 390,
              background: '#1c1c1c',
              borderRadius: 36,
              padding: 5,
              boxShadow: '0 20px 60px -12px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.08)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
            }}>
              {/* Side buttons (decorative) */}
              <div style={{ position: 'absolute', right: -2.5, top: 76, width: 3, height: 36, background: '#2a2a2a', borderRadius: '0 2px 2px 0' }} />
              <div style={{ position: 'absolute', left: -2.5, top: 56, width: 3, height: 16, background: '#2a2a2a', borderRadius: '2px 0 0 2px' }} />
              <div style={{ position: 'absolute', left: -2.5, top: 82, width: 3, height: 28, background: '#2a2a2a', borderRadius: '2px 0 0 2px' }} />
              <div style={{ position: 'absolute', left: -2.5, top: 116, width: 3, height: 28, background: '#2a2a2a', borderRadius: '2px 0 0 2px' }} />

              {/* Screen */}
              <div style={{
                flex: 1, background: '#ffffff', borderRadius: 31,
                overflow: 'hidden', display: 'flex', flexDirection: 'column',
              }}>
                {/* Status bar + Dynamic Island */}
                <div style={{
                  padding: '6px 14px 0', flexShrink: 0, display: 'flex',
                  alignItems: 'flex-start', justifyContent: 'space-between',
                  position: 'relative', height: 32,
                }}>
                  <span style={{ fontSize: 8, fontWeight: 700, color: '#1a1a1a', marginTop: 1 }}>9:41</span>
                  <div style={{
                    width: 56, height: 14, background: '#000', borderRadius: 10,
                    position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: 5,
                  }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginTop: 1 }}>
                    <Wifi style={{ width: 7, height: 7, color: '#1a1a1a' }} />
                    <div style={{ width: 14, height: 7, borderRadius: 2, border: '1px solid #1a1a1a', position: 'relative' }}>
                      <div style={{ position: 'absolute', inset: 1, background: '#1a1a1a', borderRadius: 1 }} />
                    </div>
                  </div>
                </div>

                {/* Logo bar */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, padding: '5px 14px 4px', flexShrink: 0, borderBottom: '1px solid #f0f0f0' }}>
                  <BrandMark size={12} />
                  <span style={{ fontSize: 8, fontWeight: 700, color: '#374151', letterSpacing: '-0.01em' }}>Command 360</span>
                </div>

                {/* Phone header */}
                <div style={{ padding: '8px 14px 8px', flexShrink: 0, borderBottom: '1px solid #f0f0f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                    <Icon style={{ width: 9, height: 9, color: typeColor }} />
                    <span style={{ fontSize: 7, fontWeight: 600, textTransform: 'uppercase', color: typeColor, letterSpacing: '0.05em' }}>
                      {TYPE_LABELS[slide?.slide_type || 'content']}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>
                    {slide?.title || 'Untitled'}
                  </p>
                </div>

                {/* Phone content */}
                <div style={{ flex: 1, padding: '10px 12px', overflowY: 'auto', overflowX: 'hidden' }}>
                  {slide && <AudienceSlideContent slide={slide} />}
                </div>

                {/* Phone footer */}
                <div style={{
                  padding: '6px 14px 4px', flexShrink: 0,
                  borderTop: '1px solid #f0f0f0', textAlign: 'center',
                }}>
                  <span style={{ fontSize: 7, color: '#b0b0b0', fontWeight: 500, letterSpacing: '0.04em' }}>
                    command360.co.uk
                  </span>
                </div>

                {/* Home indicator */}
                <div style={{
                  width: 60, height: 3, borderRadius: 2, background: '#d4d4d4',
                  margin: '2px auto 4px',
                }} />
              </div>
            </div>
          </div>
        </div>

        {/* Speaker notes panel */}
        <div
          className={cn(
            'bg-card border-l border-border shrink-0 overflow-hidden transition-all duration-300',
            showNotes ? 'w-[300px]' : 'w-0'
          )}
        >
          <div className="p-4 w-[300px]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                Speaker Notes
              </h3>
              <button onClick={() => setShowNotes(false)}
                className="p-1 rounded-none text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="text-[13px] leading-[1.7] text-muted-foreground whitespace-pre-wrap max-h-[calc(100vh-240px)] overflow-y-auto">
              {slide?.speaker_notes || (
                <span className="text-muted-foreground/40 italic">No speaker notes for this slide.</span>
              )}
            </div>
            {current < slides.length - 1 && (
              <div className="mt-5 border-t border-border pt-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/60 mb-2">
                  Next slide
                </p>
                <div className="bg-muted rounded-none px-3 py-2 text-xs text-muted-foreground">
                  <p className="font-semibold">{slides[current + 1].title || 'Untitled'}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        </>)}
      </div>

      {/* Bottom bar */}
      <div className="h-11 flex items-center justify-center gap-3 bg-card/80 backdrop-blur shrink-0 border-t border-border">
        <button onClick={goPrev} disabled={current === 0}
          className={cn('p-1.5 rounded-none transition-colors', current === 0 ? 'text-muted-foreground/20 cursor-default' : 'text-foreground hover:bg-muted cursor-pointer')}>
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-1">
          {slides.map((_, i) => (
            <button key={i} onClick={() => navigateTo(i)}
              className="border-none cursor-pointer p-0 transition-all duration-300"
              style={{
                width: i === current ? 20 : 6, height: 6, borderRadius: 3,
                background: i === current ? '#dc2626' : i < current ? 'rgba(220,38,38,0.4)' : 'var(--muted-foreground)',
                opacity: i === current ? 1 : i < current ? 1 : 0.3,
              }}
            />
          ))}
        </div>
        <button onClick={goNext} disabled={current === slides.length - 1}
          className={cn('p-1.5 rounded-none transition-colors', current === slides.length - 1 ? 'text-muted-foreground/20 cursor-default' : 'text-foreground hover:bg-muted cursor-pointer')}>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Grid overlay */}
      {showGrid && (
        <div className="fixed inset-0 bg-background/[0.97] z-[100] flex flex-col"
          onClick={() => setShowGrid(false)}>
          <div className="h-12 flex items-center justify-between px-5 shrink-0">
            <h3 className="text-sm font-semibold text-muted-foreground">All Slides</h3>
            <button onClick={() => setShowGrid(false)}
              className="p-1.5 rounded-none bg-muted text-foreground hover:bg-muted/80 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-5 pt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 content-start">
            {slides.map((s, i) => {
              const GridIcon = TYPE_ICONS[s.slide_type] || FileText
              const gridColor = TYPE_COLORS[s.slide_type] || '#6b7280'
              return (
                <button key={s.id} className="preview-grid-in bg-transparent border-none p-0 cursor-pointer text-left"
                  style={{ animationDelay: `${i * 30}ms` }}
                  onClick={(e) => { e.stopPropagation(); setCurrent(i); setShowGrid(false) }}>
                  <div style={{
                    background: '#ffffff', borderRadius: 12, overflow: 'hidden',
                    border: i === current ? '2px solid #dc2626' : '2px solid var(--border)',
                    aspectRatio: '16/9', display: 'flex', flexDirection: 'column', padding: '12px 14px',
                    transition: 'all 0.2s',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
                      <GridIcon style={{ width: 10, height: 10, color: gridColor }} />
                      <span style={{ fontSize: 8, fontWeight: 600, textTransform: 'uppercase', color: gridColor }}>{TYPE_LABELS[s.slide_type]}</span>
                    </div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {s.title || 'Untitled'}
                    </p>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1 text-center font-semibold">{i + 1}</p>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Shortcuts overlay — fixed to viewport, high z-index */}
      {showShortcuts && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[300] flex items-center justify-center p-4"
          onClick={() => setShowShortcuts(false)}>
          <div className="bg-[#1e1f22] dash-light:bg-white rounded-none p-5 max-w-sm w-full border border-[#3f4147] dash-light:border-black/10 shadow-2xl"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white dash-light:text-[#16191E]">Keyboard Shortcuts</h3>
              <button onClick={() => setShowShortcuts(false)}
                className="p-1 rounded-none text-zinc-500 dash-light:text-[#5B6169] hover:text-white hover:bg-white/10 dash-light:hover:bg-black/[0.05] transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex flex-col gap-1.5">
              {[
                ['→ / Space', 'Next slide'], ['← / Backspace', 'Previous slide'],
                ['Home', 'First slide'], ['End', 'Last slide'],
                ['G', 'Grid overview'], ['N', 'Toggle notes'],
                ['F', 'Fullscreen'], ['Esc', 'Exit preview'], ['?', 'Shortcuts'],
              ].map(([key, desc]) => (
                <div key={key} className="flex items-center justify-between py-0.5">
                  <span className="text-[11px] text-zinc-400 dash-light:text-[#5B6169]">{desc}</span>
                  <kbd className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded-none bg-[#2b2d31] dash-light:bg-[#EAE6DD] text-zinc-300 dash-light:text-[#5B6169] border border-[#3f4147] dash-light:border-black/10">{key}</kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* Toolbar Button — theme aware */
function TBtn({ icon: Icon, title, onClick, active }: { icon: React.ElementType; title: string; onClick: () => void; active?: boolean }) {
  return (
    <Tooltip><TooltipTrigger asChild>
    <button onClick={onClick}
      className={cn(
        'p-[5px] rounded-none transition-all',
        active
          ? 'bg-primary/20 text-primary'
          : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
      )}
    >
      <Icon className="w-[15px] h-[15px]" />
    </button>
    </TooltipTrigger><TooltipContent>{title}</TooltipContent></Tooltip>
  )
}

/* Presenter Slide Content — always on white background */
function PresenterSlideContent({ slide }: { slide: Slide }) {
  switch (slide.slide_type) {
    case 'poll': {
      const c = slide.content as PollContent
      return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {(c.options || []).map((o, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 24, height: 24, borderRadius: 6, background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#6b7280', flexShrink: 0 }}>
                {String.fromCharCode(65 + i)}
              </span>
              <div style={{ flex: 1, background: '#f3f4f6', borderRadius: 8, padding: '8px 14px', fontSize: 13, fontWeight: 500, color: '#374151' }}>
                {o.text || `Option ${i + 1}`}
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#9ca3af', minWidth: 24, textAlign: 'right' }}>0</span>
            </div>
          ))}
        </div>
      )
    }
    case 'quiz': {
      const c = slide.content as QuizContent
      return (
        <div style={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
          {(c.options || []).map((o, i) => (
            <div key={i} style={{
              background: o.is_correct ? '#dcfce7' : '#f3f4f6',
              border: o.is_correct ? '2px solid #22c55e' : '2px solid transparent',
              borderRadius: 10, padding: '10px 14px', fontSize: 12, fontWeight: 500,
              color: o.is_correct ? '#166534' : '#374151', textAlign: 'center',
            }}>
              {o.text || `Option ${i + 1}`}
            </div>
          ))}
        </div>
      )
    }
    case 'word_cloud':
      return (
        <div style={{ textAlign: 'center', color: '#9ca3af' }}>
          <Cloud style={{ width: 48, height: 48, margin: '0 auto 10px', opacity: 0.25 }} />
          <p style={{ fontSize: 13 }}>Word cloud will appear here</p>
        </div>
      )
    case 'qna':
      return (
        <div style={{ textAlign: 'center', color: '#9ca3af' }}>
          <MessageCircle style={{ width: 48, height: 48, margin: '0 auto 10px', opacity: 0.25 }} />
          <p style={{ fontSize: 13 }}>Questions will appear here</p>
        </div>
      )
    case 'content': {
      const c = slide.content as ContentSlideContent
      if (c.body && c.body.startsWith('<')) {
        return <div style={{ fontSize: 14, lineHeight: 1.6, color: '#374151', maxWidth: 500 }} dangerouslySetInnerHTML={{ __html: c.body }} />
      }
      return (
        <div style={{ fontSize: 14, whiteSpace: 'pre-wrap', lineHeight: 1.6, textAlign: 'center', maxWidth: 500, color: '#374151' }}>
          {c.body || 'No content'}
        </div>
      )
    }
    case 'rating_scale': {
      const c = slide.content as RatingScaleContent
      const min = c.min_value ?? 1, max = c.max_value ?? 10
      return (
        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 8 }}>
            {Array.from({ length: Math.min(max - min + 1, 10) }, (_, i) => (
              <div key={i} style={{ width: 36, height: 36, borderRadius: 8, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, color: '#374151' }}>
                {min + i}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af' }}>
            <span>{c.min_label || 'Low'}</span><span>{c.max_label || 'High'}</span>
          </div>
        </div>
      )
    }
    case 'open_text': {
      const c = slide.content as OpenTextContent
      return (
        <div style={{ width: '100%' }}>
          <div style={{ border: '2px dashed #d1d5db', borderRadius: 10, padding: '12px 16px', color: '#9ca3af', fontSize: 13 }}>
            {c.placeholder || 'Responses will appear here'}
          </div>
        </div>
      )
    }
    case 'survey': {
      const c = slide.content as SurveyContent
      return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {(c.questions || []).slice(0, 3).map((q, i) => (
            <div key={i} style={{ background: '#f3f4f6', borderRadius: 8, padding: '8px 14px', fontSize: 12, color: '#374151' }}>
              {i + 1}. {q.text || `Question ${i + 1}`}
            </div>
          ))}
        </div>
      )
    }
    case 'studio': {
      const c = slide.content as StudioContent
      return (
        <div style={{ width: '100%', position: 'relative', aspectRatio: '16/9', backgroundColor: c.canvas.backgroundColor, borderRadius: 8, overflow: 'hidden' }}>
          {c.layers.filter(l => l.visible).map((layer) => (
            <div key={layer.id} style={{
              position: 'absolute', left: `${layer.x}%`, top: `${layer.y}%`,
              width: `${layer.width}%`, height: `${layer.height}%`,
              opacity: layer.opacity, transform: `rotate(${layer.rotation}deg)`,
              zIndex: layer.zIndex, overflow: 'hidden',
            }}>
              {layer.type === 'image' && layer.src && (
                <img src={layer.src} alt={layer.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
              {layer.type === 'text' && (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: layer.fontSize ? `${layer.fontSize * 0.6}px` : '14px', fontWeight: layer.fontWeight || '400',
                  color: layer.color || '#ffffff', textAlign: 'center' }}>{layer.text}</div>
              )}
              {layer.type === 'shape' && (
                <div style={{ width: '100%', height: '100%', backgroundColor: layer.color || '#ffffff', borderRadius: 4 }} />
              )}
            </div>
          ))}
        </div>
      )
    }
    default:
      return <div style={{ color: '#9ca3af', fontSize: 13 }}>Interactive slide</div>
  }
}

/* Audience Slide Content — always on white phone screen */
function AudienceSlideContent({ slide }: { slide: Slide }) {
  switch (slide.slide_type) {
    case 'poll': {
      const c = slide.content as PollContent
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {(c.options || []).map((o, i) => (
            <button key={i} style={{
              width: '100%', padding: '8px 10px', borderRadius: 8,
              background: '#f3f4f6', border: '2px solid transparent',
              fontSize: 11, fontWeight: 500, color: '#374151', textAlign: 'left',
              cursor: 'pointer', transition: 'all 0.15s',
            }}>
              {o.text || `Option ${i + 1}`}
            </button>
          ))}
          <button style={{
            width: '100%', padding: '8px', borderRadius: 8,
            background: '#dc2626', border: 'none', color: '#fff',
            fontSize: 11, fontWeight: 600, cursor: 'default', marginTop: 2,
          }}>
            Submit Vote
          </button>
        </div>
      )
    }
    case 'quiz': {
      const c = slide.content as QuizContent
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {(c.options || []).map((o, i) => (
            <button key={i} style={{
              width: '100%', padding: '8px 10px', borderRadius: 8,
              background: '#f3f4f6', border: '2px solid transparent',
              fontSize: 11, fontWeight: 500, color: '#374151', textAlign: 'left', cursor: 'pointer',
            }}>
              <span style={{ fontWeight: 700, marginRight: 4, color: '#6b7280' }}>{String.fromCharCode(65 + i)}</span>
              {o.text || `Option ${i + 1}`}
            </button>
          ))}
          {c.time_limit_seconds > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, fontSize: 10, color: '#9ca3af', marginTop: 2 }}>
              <Timer style={{ width: 9, height: 9 }} />
              {c.time_limit_seconds}s
            </div>
          )}
        </div>
      )
    }
    case 'word_cloud': {
      const c = slide.content as WordCloudContent
      return (
        <div>
          <p style={{ fontSize: 10, color: '#6b7280', marginBottom: 6 }}>{c.prompt || 'Enter a word or phrase'}</p>
          <div style={{ border: '1.5px solid #d1d5db', borderRadius: 8, padding: '8px 10px', fontSize: 11, color: '#9ca3af', marginBottom: 6 }}>
            Type your word here...
          </div>
          <button style={{
            width: '100%', padding: '7px', borderRadius: 8,
            background: '#dc2626', border: 'none', color: '#fff',
            fontSize: 10, fontWeight: 600, cursor: 'default',
          }}>
            Submit
          </button>
        </div>
      )
    }
    case 'qna':
      return (
        <div>
          <div style={{ border: '1.5px solid #d1d5db', borderRadius: 8, padding: '8px 10px', fontSize: 11, color: '#9ca3af', marginBottom: 6, minHeight: 50 }}>
            Ask a question...
          </div>
          <button style={{
            width: '100%', padding: '7px', borderRadius: 8,
            background: '#dc2626', border: 'none', color: '#fff',
            fontSize: 10, fontWeight: 600, cursor: 'default',
          }}>
            Submit Question
          </button>
        </div>
      )
    case 'content': {
      const c = slide.content as ContentSlideContent
      if (c.body && c.body.startsWith('<')) {
        return <div style={{ fontSize: 11, lineHeight: 1.4, color: '#374151' }} dangerouslySetInnerHTML={{ __html: c.body }} />
      }
      return (
        <div style={{ fontSize: 11, whiteSpace: 'pre-wrap', lineHeight: 1.4, color: '#374151' }}>
          {c.body || 'Content slide'}
        </div>
      )
    }
    case 'rating_scale': {
      const c = slide.content as RatingScaleContent
      const min = c.min_value ?? 1, max = c.max_value ?? 5
      return (
        <div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap', marginBottom: 4 }}>
            {Array.from({ length: Math.min(max - min + 1, 10) }, (_, i) => (
              <button key={i} style={{
                width: 24, height: 24, borderRadius: 5, background: '#f3f4f6',
                border: '1.5px solid transparent', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 600, color: '#374151', cursor: 'pointer',
              }}>
                {min + i}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 8, color: '#9ca3af', padding: '0 2px' }}>
            <span>{c.min_label || 'Low'}</span><span>{c.max_label || 'High'}</span>
          </div>
          <button style={{
            width: '100%', padding: '7px', borderRadius: 8, marginTop: 6,
            background: '#dc2626', border: 'none', color: '#fff',
            fontSize: 10, fontWeight: 600, cursor: 'default',
          }}>
            Submit
          </button>
        </div>
      )
    }
    case 'open_text': {
      const c = slide.content as OpenTextContent
      return (
        <div>
          <div style={{ border: '1.5px solid #d1d5db', borderRadius: 8, padding: '8px 10px', fontSize: 11, color: '#9ca3af', marginBottom: 6, minHeight: 60 }}>
            {c.placeholder || 'Type your response...'}
          </div>
          {c.max_length > 0 && (
            <p style={{ fontSize: 8, color: '#9ca3af', textAlign: 'right', marginBottom: 3 }}>0/{c.max_length}</p>
          )}
          <button style={{
            width: '100%', padding: '7px', borderRadius: 8,
            background: '#dc2626', border: 'none', color: '#fff',
            fontSize: 10, fontWeight: 600, cursor: 'default',
          }}>
            Submit
          </button>
        </div>
      )
    }
    case 'survey': {
      const c = slide.content as SurveyContent
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {(c.questions || []).slice(0, 3).map((q, i) => (
            <div key={i}>
              <p style={{ fontSize: 10, fontWeight: 600, color: '#374151', marginBottom: 3 }}>{i + 1}. {q.text}</p>
              <div style={{ border: '1.5px solid #d1d5db', borderRadius: 6, padding: '5px 8px', fontSize: 10, color: '#9ca3af' }}>
                Answer here...
              </div>
            </div>
          ))}
        </div>
      )
    }
    case 'studio': {
      const c = slide.content as StudioContent
      return (
        <div>
          <div style={{ width: '100%', position: 'relative', aspectRatio: '16/9', backgroundColor: c.canvas.backgroundColor, borderRadius: 6, overflow: 'hidden', marginBottom: 6 }}>
            {c.layers.filter(l => l.visible).map((layer) => (
              <div key={layer.id} style={{
                position: 'absolute', left: `${layer.x}%`, top: `${layer.y}%`,
                width: `${layer.width}%`, height: `${layer.height}%`,
                opacity: layer.opacity, zIndex: layer.zIndex, overflow: 'hidden',
              }}>
                {layer.type === 'image' && layer.src && (
                  <img src={layer.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
                {layer.type === 'text' && (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: layer.fontSize ? `${layer.fontSize * 0.3}px` : '8px', color: layer.color || '#ffffff', textAlign: 'center' }}>{layer.text}</div>
                )}
              </div>
            ))}
          </div>
          <p style={{ fontSize: 8, color: '#9ca3af', textAlign: 'center' }}>Scenario in progress</p>
        </div>
      )
    }
    default:
      return <div style={{ color: '#9ca3af', fontSize: 10, textAlign: 'center' }}>Interactive content</div>
  }
}

/* ─── Studio Preview Content ─── */

function StudioPreviewContent({ slide, animClass, allSlides = [] }: { slide: Slide; animClass: string; allSlides?: Slide[] }) {
  const content = slide.content as StudioContent
  const { canvas, layers, events, eventCategories } = content
  const isCctv = !!content.cctvLayout
  const canvasRef = useRef<HTMLDivElement>(null)
  const [isCanvasFullscreen, setIsCanvasFullscreen] = useState(false)

  useEffect(() => {
    const handler = () => setIsCanvasFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  const toggleCanvasFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      canvasRef.current?.requestFullscreen()
    }
  }, [])

  const [layerStates, setLayerStates] = useState<Record<string, StudioLayerState>>(() =>
    buildStudioInitialStates(layers)
  )
  const [triggeredEvents, setTriggeredEvents] = useState<Set<string>>(new Set())

  useEffect(() => {
    setLayerStates(buildStudioInitialStates(layers))
    setTriggeredEvents(new Set())
  }, [slide.id])

  function handleTrigger(event: StudioEvent) {
    const newStates = { ...layerStates }
    for (const action of event.actions) {
      const current = newStates[action.layerId]
      if (!current) continue
      const prop = action.property
      if (prop === 'src') {
        newStates[action.layerId] = { ...current, src: action.toValue as string }
      } else if (prop === 'visible') {
        newStates[action.layerId] = { ...current, visible: action.toValue as boolean }
      } else {
        newStates[action.layerId] = { ...current, [prop]: action.toValue as number }
      }
    }
    setLayerStates(newStates)
    setTriggeredEvents((prev) => new Set(prev).add(event.id))
  }

  // Group events by category
  const groupedEvents = (() => {
    const uncategorized: StudioEvent[] = []
    const byCategory = new Map<string, StudioEvent[]>()
    for (const evt of events) {
      if (evt.categoryId) {
        const list = byCategory.get(evt.categoryId) || []
        list.push(evt)
        byCategory.set(evt.categoryId, list)
      } else {
        uncategorized.push(evt)
      }
    }
    return { uncategorized, byCategory }
  })()

  // CCTV mode — show grid preview, NO events panel
  if (isCctv) {
    const cctvLayout = content.cctvLayout || '4'
    const cctvSlots = content.cctvSlots || []
    const count = parseInt(cctvLayout, 10)
    const gridStyle: React.CSSProperties = (() => {
      switch (cctvLayout) {
        case '1': return { gridTemplateColumns: '1fr', gridTemplateRows: '1fr' }
        case '2': return { gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr' }
        case '3': return { gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr' }
        case '4': return { gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr' }
        case '6': return { gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr 1fr' }
        case '8': return { gridTemplateColumns: '1fr 1fr 1fr 1fr', gridTemplateRows: '1fr 1fr' }
        default: return { gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr' }
      }
    })()

    return (
      <div className="flex-1 flex items-center justify-center p-6 min-h-0 bg-black relative">
        {/* Canvas fullscreen button */}
        <Tooltip><TooltipTrigger asChild>
        <button
          onClick={toggleCanvasFullscreen}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-none bg-white/10 hover:bg-white/20 text-white/60 hover:text-white flex items-center justify-center transition-all"
        >
          <Maximize className="w-4 h-4" />
        </button>
        </TooltipTrigger><TooltipContent>Fullscreen canvas</TooltipContent></Tooltip>
        {/* Red exit button when fullscreen */}
        {isCanvasFullscreen && (
          <Tooltip><TooltipTrigger asChild>
          <button onClick={toggleCanvasFullscreen}
            className="fixed top-4 right-4 z-[9999] w-8 h-8 rounded-none bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
          </TooltipTrigger><TooltipContent>Exit fullscreen</TooltipContent></Tooltip>
        )}
        <div ref={canvasRef} className="w-full max-w-5xl" style={{ maxWidth: 'min(64rem, calc((100vh - 10rem) * 16 / 9))' }}>
          <div className="w-full overflow-hidden rounded-none shadow-2xl" style={{ aspectRatio: '16 / 9', display: 'grid', gap: '2px', background: '#000', ...gridStyle }}>
            {Array.from({ length: count }, (_, i) => {
              const slideId = cctvSlots[i]
              const scene = slideId ? allSlides.find(s => s.id === slideId) : null
              const sc = scene?.content as StudioContent | undefined
              const sceneLayers = sc?.layers || []
              const canvasBg = sc?.canvas?.backgroundColor || '#111'
              return (
                <div key={i} className="relative overflow-hidden" style={{ backgroundColor: canvasBg, gridRow: cctvLayout === '3' && i === 0 ? 'span 2' : undefined }}>
                  <div className="absolute top-1 left-1 z-10 px-1.5 py-0.5 rounded-none bg-black/60 text-[8px] text-white/70 font-medium">
                    {scene ? (scene.title || `Scene ${allSlides.indexOf(scene) + 1}`) : `View ${i + 1}`}
                  </div>
                  {scene && sceneLayers.length > 0 ? sceneLayers.map(layer => {
                    if (!layer.visible || !layer.src) return null
                    return layer.type === 'video' ? (
                      <video key={layer.id} src={layer.src} className="absolute object-contain pointer-events-none" style={{ left: `${layer.x}%`, top: `${layer.y}%`, width: `${layer.width}%`, height: `${layer.height}%`, opacity: layer.opacity, transform: `rotate(${layer.rotation}deg)`, transformOrigin: 'center' }} autoPlay loop muted playsInline />
                    ) : (
                      <img key={layer.id} src={layer.src} alt={layer.name} className="absolute object-contain pointer-events-none" style={{ left: `${layer.x}%`, top: `${layer.y}%`, width: `${layer.width}%`, height: `${layer.height}%`, opacity: layer.opacity, transform: `rotate(${layer.rotation}deg)`, transformOrigin: 'center' }} />
                    )
                  }) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-[9px] text-zinc-600 uppercase tracking-wider">No Signal</p>
                    </div>
                  )}
                  {scene && <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex overflow-hidden min-h-0">
      {/* Main canvas area */}
      <div className={cn('flex-1 flex items-center justify-center p-6 min-h-0', animClass)}>
        <div className="w-full relative" style={{ maxWidth: 'min(56rem, calc((100vh - 10rem) * 16 / 9))' }}>
          {/* Canvas fullscreen button */}
          <Tooltip><TooltipTrigger asChild>
          <button
            onClick={toggleCanvasFullscreen}
            className="absolute top-2 right-2 z-20 w-7 h-7 rounded-none bg-black/40 hover:bg-black/60 text-white/50 hover:text-white flex items-center justify-center transition-all"
          >
            <Maximize className="w-3.5 h-3.5" />
          </button>
          </TooltipTrigger><TooltipContent>Fullscreen canvas</TooltipContent></Tooltip>
          {/* Red exit button when fullscreen */}
          {isCanvasFullscreen && (
            <Tooltip><TooltipTrigger asChild>
            <button onClick={toggleCanvasFullscreen}
              className="fixed top-4 right-4 z-[9999] w-8 h-8 rounded-none bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg transition-colors">
              <X className="w-4 h-4" />
            </button>
            </TooltipTrigger><TooltipContent>Exit fullscreen</TooltipContent></Tooltip>
          )}
          <div
            ref={canvasRef}
            className="w-full relative overflow-hidden rounded-none shadow-2xl"
            style={{ aspectRatio: '16 / 9', backgroundColor: canvas.backgroundColor }}
          >
            {layers.map((layer) => {
              const state = layerStates[layer.id]
              if (!state || !state.visible) return null
              return <StudioPreviewLayer key={layer.id} layer={layer} state={state} />
            })}
          </div>
        </div>
      </div>

      {/* Events panel (right side) */}
      <div className="w-56 shrink-0 bg-card border-l border-border flex flex-col overflow-hidden">
        <div className="px-3 py-2.5 border-b border-border">
          <h3 className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">Events</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {groupedEvents.uncategorized.map((evt) => (
            <button
              key={evt.id}
              onClick={() => handleTrigger(evt)}
              className={cn(
                'w-full flex items-center gap-2 px-2.5 py-2 rounded-none text-xs font-medium transition-all text-left',
                triggeredEvents.has(evt.id)
                  ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/30'
                  : 'bg-muted hover:bg-muted/80 text-foreground border border-border hover:border-primary/30'
              )}
            >
              {evt.trigger === 'vote' ? <Vote className="w-3 h-3 shrink-0" /> : <Zap className="w-3 h-3 shrink-0" />}
              <span className="truncate">{evt.name}</span>
              <Play className="w-2.5 h-2.5 ml-auto shrink-0 opacity-40" />
            </button>
          ))}
          {eventCategories.map((cat) => {
            const catEvents = groupedEvents.byCategory.get(cat.id)
            if (!catEvents?.length) return null
            return (
              <div key={cat.id}>
                <p className="text-[9px] font-semibold uppercase tracking-wider mb-1 px-1" style={{ color: cat.color || '#9ca3af' }}>
                  {cat.name}
                </p>
                {catEvents.map((evt) => (
                  <button
                    key={evt.id}
                    onClick={() => handleTrigger(evt)}
                    className={cn(
                      'w-full flex items-center gap-2 px-2.5 py-2 rounded-none text-xs font-medium transition-all text-left mb-1',
                      triggeredEvents.has(evt.id)
                        ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/30'
                        : 'bg-muted hover:bg-muted/80 text-foreground border border-border hover:border-primary/30'
                    )}
                  >
                    {evt.trigger === 'vote' ? <Vote className="w-3 h-3 shrink-0" /> : <Zap className="w-3 h-3 shrink-0" />}
                    <span className="truncate">{evt.name}</span>
                    <Play className="w-2.5 h-2.5 ml-auto shrink-0 opacity-40" />
                  </button>
                ))}
              </div>
            )
          })}
          {events.length === 0 && (
            <p className="text-[11px] text-muted-foreground/50 text-center py-4 italic">No events defined</p>
          )}
        </div>
      </div>
    </div>
  )
}

function buildStudioInitialStates(layers: StudioLayer[]): Record<string, StudioLayerState> {
  const map: Record<string, StudioLayerState> = {}
  for (const l of layers) {
    map[l.id] = { visible: l.visible, opacity: l.opacity, x: l.x, y: l.y, width: l.width, height: l.height, rotation: l.rotation, src: l.src }
  }
  return map
}

function StudioPreviewLayer({ layer, state, small }: { layer: StudioLayer; state: StudioLayerState; small?: boolean }) {
  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${state.x}%`, top: `${state.y}%`,
    width: `${state.width}%`, height: `${state.height}%`,
    opacity: state.opacity,
    transform: `rotate(${state.rotation}deg)`,
    mixBlendMode: layer.blendMode as React.CSSProperties['mixBlendMode'],
    transition: 'all 500ms ease-in-out',
    zIndex: layer.zIndex, overflow: 'hidden',
  }

  switch (layer.type) {
    case 'image':
      return (
        <div style={baseStyle}>
          {(state.src || layer.src) && (
            <img src={state.src || layer.src} alt={layer.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} draggable={false} />
          )}
        </div>
      )
    case 'video':
      return (
        <div style={baseStyle}>
          {(state.src || layer.src) && (
            <video src={state.src || layer.src} autoPlay muted loop playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          )}
        </div>
      )
    case 'text':
      return (
        <div style={{
          ...baseStyle, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: small ? (layer.fontSize ? `${layer.fontSize * 0.4}px` : '10px') : (layer.fontSize ? `${layer.fontSize}px` : '24px'),
          fontWeight: layer.fontWeight || '400', color: layer.color || '#ffffff', textAlign: 'center', wordBreak: 'break-word',
        }}>
          {layer.text}
        </div>
      )
    case 'shape':
      return <div style={{ ...baseStyle, backgroundColor: layer.color || '#ffffff', borderRadius: 4 }} />
    default:
      return null
  }
}
