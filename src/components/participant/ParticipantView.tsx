'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Session } from '@/types/session'
import type { Slide } from '@/types/slide'
import { useParticipantStore } from '@/stores/participantStore'
import { WaitingScreen } from './WaitingScreen'
import { PollInput } from './slide-inputs/PollInput'
import { WordCloudInput } from './slide-inputs/WordCloudInput'
import { QuizInput } from './slide-inputs/QuizInput'
import { QnAInput } from './slide-inputs/QnAInput'
import { SurveyInput } from './slide-inputs/SurveyInput'
import { RatingScaleInput } from './slide-inputs/RatingScaleInput'
import { OpenTextInput } from './slide-inputs/OpenTextInput'
import { StudioInput } from './slide-inputs/StudioInput'
import { CheckCircle2, Trophy, ShieldAlert } from 'lucide-react'
import { toast } from 'sonner'

interface ParticipantViewProps {
  session: Session
  slides: Slide[]
  participantId: string
  clientToken: string
  displayName: string
}

export function ParticipantView({ session: initialSession, slides, participantId, clientToken, displayName }: ParticipantViewProps) {
  const [session, setSession] = useState(initialSession)
  const [currentSlide, setCurrentSlide] = useState<Slide | null>(
    slides.find((s) => s.id === initialSession.current_slide_id) || slides[0] || null
  )
  const [hasResponded, setHasResponded] = useState(false)
  const [sessionEnded, setSessionEnded] = useState(false)
  const [score, setScore] = useState(0)
  const [slideTransition, setSlideTransition] = useState(false)
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>['channel']> | null>(null)
  const supabase = createClient()

  const setStore = useParticipantStore((s) => s.setParticipant)

  useEffect(() => {
    setStore({ participantId, clientToken, displayName, sessionId: session.id })
  }, [])

  useEffect(() => {
    const channel = supabase.channel(`session:${session.id}`)
    channel
      .on('broadcast', { event: 'SLIDE_CHANGED' }, ({ payload }) => {
        // Animate slide transition
        setSlideTransition(true)
        setTimeout(() => {
          const newSlide = slides.find((s) => s.id === payload.slide_id) || null
          setCurrentSlide(newSlide)
          setHasResponded(false)
          setSession((prev) => ({ ...prev, voting_open: payload.voting_open, current_slide_id: payload.slide_id }))
          setSlideTransition(false)
        }, 200)
      })
      .on('broadcast', { event: 'VOTING_OPENED' }, () => {
        setSession((prev) => ({ ...prev, voting_open: true }))
        toast.info('Voting is now open!')
      })
      .on('broadcast', { event: 'VOTING_CLOSED' }, () => {
        setSession((prev) => ({ ...prev, voting_open: false }))
      })
      .on('broadcast', { event: 'SESSION_ENDED' }, () => {
        setSessionEnded(true)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ role: 'participant', participant_id: participantId, display_name: displayName })
        }
      })
    channelRef.current = channel
    return () => { supabase.removeChannel(channel) }
  }, [session.id])

  const submitResponse = useCallback(async (answer: Record<string, unknown>) => {
    if (!currentSlide) return
    const res = await fetch('/api/responses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: session.id,
        slide_id: currentSlide.id,
        participant_id: participantId,
        client_token: clientToken,
        answer,
      }),
    })
    if (res.ok) {
      const data = await res.json()
      setHasResponded(true)
      if (data.points_earned) {
        setScore((prev) => prev + data.points_earned)
        toast.success(`+${data.points_earned} points!`, { icon: '🏆' })
      } else {
        toast.success('Response submitted!')
      }
      await channelRef.current?.send({
        type: 'broadcast',
        event: 'RESPONSE_SUBMITTED',
        payload: { participant_id: participantId },
      })
    } else {
      const err = await res.json()
      toast.error(err.error || 'Failed to submit response')
    }
  }, [currentSlide, session.id, participantId, clientToken])

  // Check if the last slide was a studio type (hide score for studio sessions)
  const isStudioSession = currentSlide?.slide_type === 'studio'

  // Session ended screen
  if (sessionEnded) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center relative">
        {/* Red gradient glow background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_30%,rgba(220,38,38,0.12),transparent)]" />
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: 'linear-gradient(rgba(220,38,38,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,0.3) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }} />
        </div>
        <div className="text-center space-y-8 px-6 animate-in fade-in zoom-in-95 duration-500 relative z-10">
          {/* Branding */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
              <ShieldAlert className="w-8 h-8 text-primary-foreground" />
            </div>
            <span className="text-sm font-bold text-zinc-400 tracking-widest uppercase">Command 360</span>
          </div>

          {/* Heading */}
          <div>
            <h1 className="text-3xl font-bold text-white">This session has ended</h1>
            <p className="text-zinc-400 mt-2 text-base">Thank you for participating</p>
          </div>

          {/* Score — only for non-studio sessions */}
          {!isStudioSession && score > 0 && (
            <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl px-8 py-6 inline-block animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">Final score</span>
              </div>
              <p className="text-5xl font-bold text-white font-mono">{score}</p>
            </div>
          )}

          <div className="pt-2">
            <div className="w-12 h-px bg-zinc-800 mx-auto" />
          </div>
        </div>
      </div>
    )
  }

  if (!currentSlide) {
    return <WaitingScreen message="Waiting for presentation to start..." />
  }

  if (!session.voting_open && currentSlide?.slide_type !== 'studio') {
    return (
      <WaitingScreen
        message="Voting is closed"
        subMessage="Wait for the presenter to open voting"
      />
    )
  }

  // Current slide position
  const slideIndex = slides.findIndex((s) => s.id === currentSlide.id)
  const totalSlides = slides.length
  const isStudio = currentSlide.slide_type === 'studio'

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      {isStudio ? (
        /* Thin header for studio — scene title centered */
        <div className="bg-card/80 backdrop-blur-sm border-b border-border px-4 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 bg-primary rounded-md flex items-center justify-center">
              <ShieldAlert className="w-3 h-3 text-primary-foreground" />
            </div>
          </div>
          <span className="text-sm font-semibold text-foreground truncate">{currentSlide.title}</span>
          <div className="w-5" />
        </div>
      ) : (
        /* Standard header for other slide types */
        <div className="bg-card/80 backdrop-blur-sm border-b border-border px-4 py-3 space-y-2">
          {/* Top row: Logo */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                <ShieldAlert className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-sm font-bold text-foreground tracking-tight">Command 360</span>
            </div>
            {score > 0 && (
              <div className="flex items-center gap-1.5 text-primary font-mono font-bold text-sm bg-primary/10 px-3 py-1 rounded-full">
                <Trophy className="w-3.5 h-3.5" />
                {score}
              </div>
            )}
          </div>
          {/* Bottom row: participant info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-medium text-foreground">{displayName}</span>
              </div>
              {totalSlides > 0 && (
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {slideIndex + 1}/{totalSlides}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Progress bar — hide for studio */}
      {!isStudio && totalSlides > 1 && (
        <div className="h-0.5 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${((slideIndex + 1) / totalSlides) * 100}%` }}
          />
        </div>
      )}

      {/* Slide content */}
      <div
        className={`${isStudio ? 'flex-1 flex items-center justify-center px-2 py-2' : 'max-w-lg mx-auto px-4 py-6 space-y-6'} transition-all duration-300 ease-out ${
          slideTransition ? 'opacity-0 translate-y-3 scale-[0.98]' : 'opacity-100 translate-y-0 scale-100'
        }`}
      >
        {!isStudio && (
          <div className="space-y-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <span className="text-xs font-medium text-primary uppercase tracking-wide">
              {currentSlide.slide_type.replace('_', ' ')}
            </span>
            <h1 className="text-xl font-bold leading-tight">{currentSlide.title}</h1>
          </div>
        )}

        {hasResponded ? (
          <RespondedScreen slideType={currentSlide.slide_type} />
        ) : (
          <div className={`${isStudio ? 'w-full' : ''} animate-in fade-in slide-in-from-bottom-3 duration-400 delay-100`}>
            <SlideInput
              slide={currentSlide}
              sessionId={session.id}
              onSubmit={submitResponse}
            />
          </div>
        )}
      </div>
    </div>
  )
}

function RespondedScreen({ slideType }: { slideType: string }) {
  if (slideType === 'qna') return null
  return (
    <div className="text-center py-12 space-y-4 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center animate-in zoom-in duration-300">
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
        </div>
      </div>
      <h2 className="text-lg font-semibold">Response submitted!</h2>
      <p className="text-muted-foreground text-sm">Waiting for the presenter to advance...</p>
      <div className="flex gap-1.5 justify-center">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  )
}

function SlideInput({ slide, sessionId, onSubmit }: { slide: Slide; sessionId: string; onSubmit: (a: Record<string, unknown>) => Promise<void> }) {
  switch (slide.slide_type) {
    case 'poll': return <PollInput slide={slide} onSubmit={onSubmit} />
    case 'word_cloud': return <WordCloudInput slide={slide} onSubmit={onSubmit} />
    case 'quiz': return <QuizInput slide={slide} onSubmit={onSubmit} />
    case 'qna': return <QnAInput slide={slide} sessionId={sessionId} />
    case 'survey': return <SurveyInput slide={slide} onSubmit={onSubmit} />
    case 'content': return <ContentDisplay slide={slide} />
    case 'rating_scale': return <RatingScaleInput slide={slide} onSubmit={onSubmit} />
    case 'open_text': return <OpenTextInput slide={slide} onSubmit={onSubmit} />
    case 'studio': return <StudioInput slide={slide} sessionId={sessionId} onSubmit={onSubmit} />
    default: return null
  }
}

function ContentDisplay({ slide }: { slide: Slide }) {
  const content = slide.content as { body: string }
  return (
    <div className="bg-card border border-border rounded-2xl p-6 transition-all duration-200">
      <div className="text-foreground text-base leading-relaxed whitespace-pre-wrap">{content.body}</div>
    </div>
  )
}
