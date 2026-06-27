'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Session } from '@/types/session'
import type { Slide } from '@/types/slide'
import { Button } from '@/components/ui/button'
import { PresenterSlideDisplay } from './PresenterSlideDisplay'
import { QRCodeDisplay } from './QRCodeDisplay'
import {
  ChevronLeft, ChevronRight, Users, Play, Square, X,
  QrCode, BarChart2, Sparkles, Maximize, Minimize,
  Eye, EyeOff, Keyboard, StickyNote, Monitor, Copy, Check, OctagonX,
} from 'lucide-react'
import { toast } from 'sonner'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface PresenterViewProps {
  session: Session & { presentations: { title: string } }
  slides: Slide[]
}

export function PresenterView({ session: initialSession, slides }: PresenterViewProps) {
  const [session, setSession] = useState(initialSession)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [participantCount, setParticipantCount] = useState(0)
  const [responseCount, setResponseCount] = useState(0)
  const [showQR, setShowQR] = useState(true)
  const [showSummary, setShowSummary] = useState(false)
  const [summaryText, setSummaryText] = useState('')
  const [isLoadingSummary, setIsLoadingSummary] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showHotkeys, setShowHotkeys] = useState(false)
  const [showResults, setShowResults] = useState(true)
  const [showNotes, setShowNotes] = useState(false)
  const [showEndConfirm, setShowEndConfirm] = useState(false)
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next')
  const [slideKey, setSlideKey] = useState(0)
  const [votingPulse, setVotingPulse] = useState(false)
  const [codeCopied, setCodeCopied] = useState(false)
  const [urlCopied, setUrlCopied] = useState(false)
  const [closingQR, setClosingQR] = useState(false)
  const [closingSummary, setClosingSummary] = useState(false)
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>['channel']> | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const currentSlide = slides[currentSlideIndex]
  const joinUrl = typeof window !== 'undefined' ? `${window.location.origin}/join` : '/join'

  // Log analytics event
  const logAnalytics = useCallback(async (eventType: string, data: Record<string, unknown>) => {
    try {
      await fetch('/api/studio/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: session.id, event_type: eventType, event_data: data }),
      })
    } catch {} // Silent fail
  }, [session.id])

  useEffect(() => {
    if (responseCount > 0) {
      setVotingPulse(true)
      const t = setTimeout(() => setVotingPulse(false), 500)
      return () => clearTimeout(t)
    }
  }, [responseCount])

  const copyCode = useCallback(async () => {
    await navigator.clipboard.writeText(session.room_code)
    setCodeCopied(true)
    setTimeout(() => setCodeCopied(false), 2000)
    toast.success('Code copied!', { duration: 2000 })
  }, [session.room_code])

  const copyUrl = useCallback(async () => {
    await navigator.clipboard.writeText(joinUrl)
    setUrlCopied(true)
    setTimeout(() => setUrlCopied(false), 2000)
    toast.success('URL copied!', { duration: 2000 })
  }, [joinUrl])

  const handleCloseQR = useCallback(() => {
    setClosingQR(true)
    setTimeout(() => { setShowQR(false); setClosingQR(false) }, 250)
  }, [])

  const handleCloseSummary = useCallback(() => {
    setClosingSummary(true)
    setTimeout(() => { setShowSummary(false); setClosingSummary(false) }, 250)
  }, [])

  useEffect(() => {
    const channel = supabase.channel(`session:${session.id}`, {
      config: { presence: { key: 'presenter' } },
    })
    channel
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        const parts = (newPresences as unknown as Array<{ role: string }>).filter((p) => p.role === 'participant')
        if (parts.length > 0) setParticipantCount((c) => c + parts.length)
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        const parts = (leftPresences as unknown as Array<{ role: string }>).filter((p) => p.role === 'participant')
        if (parts.length > 0) setParticipantCount((c) => Math.max(0, c - parts.length))
      })
      .on('broadcast', { event: 'RESPONSE_SUBMITTED' }, () => {
        setResponseCount((c) => c + 1)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ role: 'presenter', session_id: session.id })
          logAnalytics('session_start', {})
        }
      })
    channelRef.current = channel
    supabase
      .from('participants')
      .select('id', { count: 'exact' })
      .eq('session_id', session.id)
      .then(({ count }) => setParticipantCount(count || 0))
    return () => { supabase.removeChannel(channel) }
  }, [session.id, logAnalytics])

  const broadcastSlideChange = useCallback(async (slideId: string, index: number, votingOpen: boolean) => {
    await channelRef.current?.send({
      type: 'broadcast',
      event: 'SLIDE_CHANGED',
      payload: { slide_id: slideId, slide_index: index, voting_open: votingOpen },
    })
  }, [])

  const handleNavigate = useCallback(async (direction: 'next' | 'prev') => {
    setSlideDirection(direction)
    const res = await fetch(`/api/sessions/${session.id}/next-slide`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ direction }),
    })
    if (res.ok) {
      const data = await res.json()
      setCurrentSlideIndex(data.slide_index)
      setSlideKey((k) => k + 1)
      setResponseCount(0)
      setSession((s) => ({ ...s, voting_open: false }))
      await broadcastSlideChange(data.slide_id, data.slide_index, false)
      logAnalytics('slide_change', { slide_id: data.slide_id, slide_index: data.slide_index })
    }
  }, [session.id, broadcastSlideChange, logAnalytics])

  const handleToggleVoting = useCallback(async () => {
    const newOpen = !session.voting_open
    const res = await fetch(`/api/sessions/${session.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ voting_open: newOpen }),
    })
    if (res.ok) {
      setSession((s) => ({ ...s, voting_open: newOpen }))
      await channelRef.current?.send({
        type: 'broadcast',
        event: newOpen ? 'VOTING_OPENED' : 'VOTING_CLOSED',
        payload: { session_id: session.id },
      })
      toast(newOpen ? 'Voting opened' : 'Voting closed', { duration: 2000 })
    }
  }, [session.id, session.voting_open])

  const handleEndSession = useCallback(async () => {
    setShowEndConfirm(true)
  }, [])

  const confirmEndSession = useCallback(async () => {
    setShowEndConfirm(false)
    await channelRef.current?.send({
      type: 'broadcast',
      event: 'SESSION_ENDED',
      payload: { session_id: session.id },
    })
    await fetch(`/api/sessions/${session.id}/end`, { method: 'POST' })
    toast.success('Session ended', { duration: 2000 })
    router.push(`/presentations/${session.presentation_id}/edit`)
  }, [session.id, session.presentation_id, router])

  const handleGetSummary = useCallback(async () => {
    setShowSummary(true)
    setClosingSummary(false)
    setIsLoadingSummary(true)
    setSummaryText('')
    const res = await fetch(`/api/sessions/${session.id}/summary`)
    if (!res.body) return
    setIsLoadingSummary(false)
    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      setSummaryText((prev) => prev + decoder.decode(value))
    }
  }, [session.id])

  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      await document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onFsChange)
    return () => document.removeEventListener('fullscreenchange', onFsChange)
  }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') handleNavigate('next')
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') handleNavigate('prev')
      if (e.key === 'f' || e.key === 'F') toggleFullscreen()
      if (e.key === 'c' || e.key === 'C') handleToggleVoting()
      if (e.key === 'h' || e.key === 'H') setShowResults((v) => !v)
      if (e.key === 'l' || e.key === 'L') { showQR ? handleCloseQR() : setShowQR(true) }
      if (e.key === 'n' || e.key === 'N') setShowNotes((v) => !v)
      if (e.key === '?' || e.key === '/') { e.preventDefault(); setShowHotkeys((v) => !v) }
      if (e.key === 'Escape') { setShowHotkeys(false); if (showSummary) handleCloseSummary() }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleNavigate, toggleFullscreen, handleToggleVoting, showQR, showSummary, handleCloseQR, handleCloseSummary])

  const formattedCode = session.room_code.length >= 6
    ? `${session.room_code.slice(0, 3)} ${session.room_code.slice(3)}`
    : session.room_code

  return (
    <div className="h-screen flex flex-col bg-background text-foreground select-none overflow-hidden">
      <style>{`
        @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideOutRight { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
        @keyframes slideInUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes fadeInScale { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideContentNext { from { transform: translateX(40px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideContentPrev { from { transform: translateX(-40px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes votingPulse { 0% { transform: scale(1); } 50% { transform: scale(1.15); } 100% { transform: scale(1); } }
        .panel-slide-in { animation: slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .panel-slide-out { animation: slideOutRight 0.25s cubic-bezier(0.7, 0, 0.84, 0) forwards; }
        .slide-in-up { animation: slideInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .fade-in-scale { animation: fadeInScale 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .fade-in { animation: fadeIn 0.25s ease-out forwards; }
        .slide-next { animation: slideContentNext 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .slide-prev { animation: slideContentPrev 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .voting-pulse { animation: votingPulse 0.5s ease-out; }
      `}</style>

      {/* Join banner */}
      <div className="h-10 bg-card flex items-center px-4 shrink-0 border-b border-border">
        {/* Logo left */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-5 h-5 rounded-none bg-primary flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          </div>
          <span className="text-xs font-semibold text-muted-foreground tracking-tight hidden md:inline">Command 360</span>
        </div>
        {/* Current slide title */}
        {currentSlide && (
          currentSlide.title ? (
            <Tooltip><TooltipTrigger asChild>
            <span className="text-sm font-semibold text-foreground truncate max-w-[200px] ml-4">
              {currentSlide.title}
            </span>
            </TooltipTrigger><TooltipContent>{currentSlide.title}</TooltipContent></Tooltip>
          ) : (
            <span className="text-sm font-semibold text-foreground truncate max-w-[200px] ml-4">
              {`Slide ${currentSlideIndex + 1}`}
            </span>
          )
        )}
        {/* Center join info */}
        <div className="flex-1 flex items-center justify-center gap-4">
        <span className="text-muted-foreground text-sm">
          Join at <span className="text-foreground font-medium">{joinUrl.replace(/^https?:\/\//, '')}</span>
        </span>
        <span className="text-border">|</span>
        <button onClick={copyCode} className="inline-flex items-center gap-1.5 text-sm hover:bg-muted px-2 py-0.5 rounded-none transition-colors">
          <span className="text-muted-foreground">code</span>
          <span className="text-foreground font-mono font-bold tracking-wider">{formattedCode}</span>
          {codeCopied ? <Check className="w-3 h-3 text-[#2E9E63]" /> : <Copy className="w-3 h-3 text-muted-foreground/50" />}
        </button>
        <div className="flex items-center gap-1.5 ml-4 text-muted-foreground">
          <Users className="w-3.5 h-3.5" />
          <span className={cn('text-xs font-medium tabular-nums', participantCount > 0 && 'text-foreground')}>{participantCount}</span>
        </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-10 min-h-0 min-w-0 transition-all duration-300">
          <div key={slideKey} className={`w-full mx-auto ${slideDirection === 'next' ? 'slide-next' : 'slide-prev'}`}
            style={{ maxWidth: 'min(64rem, calc((100vh - 12rem) * 16 / 9))' }}>
            {currentSlide ? (
              <PresenterSlideDisplay slide={currentSlide} session={session} responseCount={responseCount} channelRef={channelRef} allSlides={slides} mode="present" />
            ) : (
              <div className="text-center text-muted-foreground py-20 fade-in">
                <Monitor className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p>No slides in this session</p>
              </div>
            )}
          </div>
          {showNotes && currentSlide && (
            <div className="w-full max-w-4xl mt-4 bg-muted/40 rounded-none p-5 border border-border slide-in-up" style={{ minHeight: 100 }}>
              <div className="flex items-center gap-2 mb-3">
                <StickyNote className="w-4 h-4 text-[#c98a2a]" />
                <span className="text-xs font-semibold text-[#c98a2a] uppercase tracking-wider">Speaker Notes</span>
              </div>
              {currentSlide.speaker_notes ? (
                <p className="text-foreground/80 text-sm leading-relaxed whitespace-pre-wrap">{currentSlide.speaker_notes}</p>
              ) : (
                <p className="text-muted-foreground/50 text-sm italic">No notes for this slide. Add notes in the editor to see them here.</p>
              )}
            </div>
          )}
        </div>

        {showQR && (
          <div className={cn('w-72 bg-card border-l border-border flex flex-col items-center justify-center p-6 gap-4 shrink-0 rounded-none', closingQR ? 'panel-slide-out' : 'panel-slide-in')}>
            <button onClick={handleCloseQR} className="self-end text-muted-foreground hover:text-foreground mb-2 transition-all duration-200 hover:rotate-90 transform">
              <X className="w-4 h-4" />
            </button>
            <QRCodeDisplay roomCode={session.room_code} />
            {/* Join URL below QR */}
            <div className="w-full flex flex-col items-center gap-2 mt-1">
              <Tooltip><TooltipTrigger asChild>
              <button
                onClick={copyUrl}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted px-3 py-1.5 rounded-none transition-colors font-mono"
              >
                <span className="truncate">{joinUrl.replace(/^https?:\/\//, '')}</span>
                {urlCopied ? <Check className="w-3 h-3 text-[#2E9E63] shrink-0" /> : <Copy className="w-3 h-3 shrink-0 opacity-50" />}
              </button>
              </TooltipTrigger><TooltipContent>Copy join URL</TooltipContent></Tooltip>
              <Tooltip><TooltipTrigger asChild>
              <button
                onClick={copyCode}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted px-3 py-1.5 rounded-none transition-colors"
              >
                <span className="text-muted-foreground">Code:</span>
                <span className="font-mono font-bold text-foreground tracking-wider">{formattedCode}</span>
                {codeCopied ? <Check className="w-3 h-3 text-[#2E9E63] shrink-0" /> : <Copy className="w-3 h-3 shrink-0 opacity-50" />}
              </button>
              </TooltipTrigger><TooltipContent>Copy room code</TooltipContent></Tooltip>
            </div>
            <p className="text-muted-foreground/60 text-xs text-center mt-1">
              {participantCount > 0 ? `${participantCount} participant${participantCount !== 1 ? 's' : ''} joined` : 'Waiting for participants'}
            </p>
          </div>
        )}

        {showSummary && (
          <div className={cn('w-80 bg-card border-l border-border flex flex-col p-4 gap-3 shrink-0 rounded-none', closingSummary ? 'panel-slide-out' : 'panel-slide-in')}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Sparkles className="w-4 h-4 text-primary" />AI Summary
              </div>
              <button onClick={handleCloseSummary} className="text-muted-foreground hover:text-foreground transition-all duration-200 hover:rotate-90 transform">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-auto text-sm text-muted-foreground leading-relaxed">
              {isLoadingSummary ? (
                <div className="flex items-center gap-2 fade-in">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  Generating summary...
                </div>
              ) : (
                <div className="whitespace-pre-wrap text-foreground/80 fade-in">{summaryText}</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-muted shrink-0">
        <div className="h-full bg-primary transition-all duration-500 ease-out" style={{ width: `${slides.length > 0 ? ((currentSlideIndex + 1) / slides.length) * 100 : 0}%` }} />
      </div>

      {/* Bottom toolbar */}
      <div className="h-14 backdrop-blur-xl bg-white/5 border-t border-white/10 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={() => handleNavigate('prev')} disabled={currentSlideIndex === 0}
            className="text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-20 h-9 w-9 p-0 rounded-xl">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <span className="text-sm text-muted-foreground font-mono min-w-[60px] text-center tabular-nums">{currentSlideIndex + 1} / {slides.length}</span>
          <Button size="sm" variant="ghost" onClick={() => handleNavigate('next')} disabled={currentSlideIndex === slides.length - 1}
            className="text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-20 h-9 w-9 p-0 rounded-xl">
            <ChevronRight className="w-5 h-5" />
          </Button>
          {currentSlideIndex < slides.length - 1 && (
            <span className="text-xs text-muted-foreground/50 ml-2 hidden md:inline truncate max-w-[200px]">
              Next: {slides[currentSlideIndex + 1]?.title || 'Untitled'}
            </span>
          )}
        </div>
        <div className="flex items-center gap-0.5 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-1">
          <ToolbarBtn icon={isFullscreen ? Minimize : Maximize} label="Fullscreen" shortcut="F" onClick={toggleFullscreen} />
          <ToolbarBtn icon={session.voting_open ? Square : Play} label={session.voting_open ? 'Close voting' : 'Open voting'} shortcut="C" onClick={handleToggleVoting} active={session.voting_open} activeColor="text-emerald-500" />
          <ToolbarBtn icon={showResults ? Eye : EyeOff} label="Results" shortcut="H" onClick={() => setShowResults((v) => !v)} active={showResults} />
          <ToolbarBtn icon={QrCode} label="QR code" shortcut="L" onClick={() => { showQR ? handleCloseQR() : setShowQR(true) }} active={showQR} />
          {currentSlide?.slide_type !== 'studio' && (
            <>
              <ToolbarBtn icon={StickyNote} label="Notes" shortcut="N" onClick={() => setShowNotes((v) => !v)} active={showNotes} />
              <ToolbarBtn icon={Sparkles} label="AI Summary" onClick={handleGetSummary} />
            </>
          )}
          <ToolbarBtn icon={Keyboard} label="Shortcuts" shortcut="?" onClick={() => setShowHotkeys((v) => !v)} />
        </div>
        <div className="flex items-center gap-3">
          {session.voting_open && (
            <div className={cn('flex items-center gap-1.5 text-xs text-emerald-500 fade-in', votingPulse && 'voting-pulse')}>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <BarChart2 className="w-3.5 h-3.5" /><span className="tabular-nums font-medium">{responseCount}</span>
            </div>
          )}
          <button onClick={handleEndSession}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-red-600 text-white hover:bg-red-500 text-xs font-medium transition-all">
            <OctagonX className="w-3.5 h-3.5" />End session
          </button>
        </div>
      </div>

      {/* Hotkeys modal */}
      {showHotkeys && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 fade-in" onClick={() => setShowHotkeys(false)}>
          <div className="bg-card rounded-2xl border border-border p-6 w-full max-w-lg shadow-2xl fade-in-scale" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                <Keyboard className="w-4 h-4 text-primary" />Keyboard Shortcuts
              </h2>
              <button onClick={() => setShowHotkeys(false)} className="text-muted-foreground hover:text-foreground transition-all p-1 rounded-lg hover:bg-muted">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-0.5">
              <HotkeySection title="Navigation">
                <HotkeyRow keys="→ / Space" action="Next slide" />
                <HotkeyRow keys="← / Backspace" action="Previous slide" />
                <HotkeyRow keys="Home" action="First slide" />
                <HotkeyRow keys="End" action="Last slide" />
              </HotkeySection>
              <HotkeySection title="View">
                <HotkeyRow keys="F" action="Fullscreen" />
                <HotkeyRow keys="G" action="Grid overview" />
                <HotkeyRow keys="N" action="Toggle notes" />
                <HotkeyRow keys="Esc" action="Exit preview" />
              </HotkeySection>
              <HotkeySection title="Shortcuts">
                <HotkeyRow keys="?" action="Shortcuts" />
              </HotkeySection>
            </div>
          </div>
        </div>
      )}

      {/* End session confirmation modal */}
      {showEndConfirm && (
        <div className="fixed inset-0 z-[300] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e1f22] border border-[#3f4147] rounded-xl p-5 max-w-xs w-full shadow-2xl">
            <h3 className="text-sm font-semibold text-white mb-2">End this session?</h3>
            <p className="text-[11px] text-zinc-400 mb-4">All participants will be disconnected. This cannot be undone.</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowEndConfirm(false)} className="px-3 py-1.5 text-[11px] font-medium rounded-lg bg-[#2b2d31] text-zinc-300 hover:bg-[#35363c] transition-colors">
                Cancel
              </button>
              <button onClick={confirmEndSession} className="px-3 py-1.5 text-[11px] font-medium rounded-lg bg-red-600 text-white hover:bg-red-500 transition-colors">
                End Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ToolbarBtn({ icon: Icon, label, shortcut, onClick, active, activeColor }: {
  icon: React.ElementType; label: string; shortcut?: string; onClick: () => void; active?: boolean; activeColor?: string
}) {
  const [showTooltip, setShowTooltip] = useState(false)
  return (
    <div className="relative">
      <button onClick={onClick} onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}
        className={cn('w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95',
          active ? `${activeColor || 'text-primary'} bg-muted` : 'text-muted-foreground hover:text-foreground hover:bg-muted')}>
        <Icon className="w-4 h-4" />
      </button>
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-popover text-popover-foreground text-[10px] font-medium rounded-lg whitespace-nowrap shadow-lg border border-border z-10 pointer-events-none"
          style={{ animation: 'fadeIn 0.15s ease-out forwards' }}>
          {label}{shortcut && <span className="ml-1.5 opacity-50">({shortcut})</span>}
        </div>
      )}
    </div>
  )
}

function HotkeySection({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="mb-4"><p className="text-xs font-medium text-primary uppercase tracking-widest mb-2">{title}</p><div className="space-y-1.5">{children}</div></div>
}

function HotkeyRow({ keys, action }: { keys: string; action: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{action}</span>
      <kbd className="bg-muted rounded px-2 py-0.5 text-xs font-mono text-muted-foreground border border-border">{keys}</kbd>
    </div>
  )
}
