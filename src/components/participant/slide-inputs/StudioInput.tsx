'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Slide, StudioContent, StudioLayer, StudioLayerState } from '@/types/slide'
import { Monitor, CheckCircle2, Maximize2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

interface Props {
  slide: Slide
  sessionId: string
  onSubmit: (answer: Record<string, unknown>) => Promise<void>
}

const OPTION_COLORS = [
  'border-primary hover:bg-primary/10 data-[selected=true]:bg-primary/20',
  'border-blue-500 hover:bg-blue-500/10 data-[selected=true]:bg-blue-500/20',
  'border-emerald-500 hover:bg-emerald-500/10 data-[selected=true]:bg-emerald-500/20',
  'border-amber-500 hover:bg-amber-500/10 data-[selected=true]:bg-amber-500/20',
]

export function StudioInput({ slide, sessionId, onSubmit }: Props) {
  const content = slide.content as StudioContent
  const { canvas, layers: initialLayers } = content

  const [layers, setLayers] = useState<StudioLayer[]>(initialLayers)
  const [layerStates, setLayerStates] = useState<Record<string, StudioLayerState>>(() =>
    buildInitialStates(initialLayers)
  )
  const [exerciseEnded, setExerciseEnded] = useState(false)
  const [exerciseStats, setExerciseStats] = useState<{ duration: number; eventsTriggered: number } | null>(null)
  const [sessionSeconds, setSessionSeconds] = useState(0)
  const [isCanvasFullscreen, setIsCanvasFullscreen] = useState(false)
  const [activeVote, setActiveVote] = useState<{
    eventId: string
    question: string
    options: { id: string; label: string }[]
  } | null>(null)
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  const [submittingVote, setSubmittingVote] = useState(false)
  const [voteSubmitted, setVoteSubmitted] = useState(false)
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>['channel']> | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase.channel(`session:${sessionId}:studio:${slide.id}`)

    channel
      .on('broadcast', { event: 'STUDIO_EVENT_TRIGGERED' }, ({ payload }) => {
        if (payload.slide_id === slide.id && payload.layerStates) {
          setLayerStates(payload.layerStates as Record<string, StudioLayerState>)
        }
      })
      .on('broadcast', { event: 'STUDIO_VOTE_STARTED' }, ({ payload }) => {
        if (payload.slide_id === slide.id) {
          setActiveVote({
            eventId: payload.event_id,
            question: payload.question,
            options: payload.options,
          })
          setSelectedOptionId(null)
          setVoteSubmitted(false)
        }
      })
      .on('broadcast', { event: 'STUDIO_VOTE_RESULT' }, ({ payload }) => {
        if (payload.slide_id === slide.id) {
          setActiveVote(null)
          setVoteSubmitted(false)
          setSelectedOptionId(null)
        }
      })
      .on('broadcast', { event: 'STUDIO_LAYER_STATES_UPDATE' }, ({ payload }) => {
        if (payload.slide_id === slide.id && payload.layerStates) {
          setLayerStates(payload.layerStates as Record<string, StudioLayerState>)
        }
      })
      .on('broadcast', { event: 'STUDIO_PLAYBACK_START' }, ({ payload }) => {
        if (payload.slide_id === slide.id) {
          /* Playback started — layers will be updated via STUDIO_LAYER_STATES_UPDATE */
        }
      })
      .on('broadcast', { event: 'STUDIO_PLAYBACK_PAUSE' }, ({ payload }) => {
        if (payload.slide_id === slide.id) {
          /* Playback paused — scene holds current state */
        }
      })
      .on('broadcast', { event: 'STUDIO_LAYER_ADDED' }, ({ payload }) => {
        if (payload.slide_id === slide.id && payload.layer) {
          const newLayer = payload.layer as StudioLayer
          setLayers(prev => [...prev, newLayer])
          setLayerStates(prev => ({
            ...prev,
            [newLayer.id]: {
              visible: newLayer.visible, opacity: newLayer.opacity,
              x: newLayer.x, y: newLayer.y, width: newLayer.width, height: newLayer.height,
              rotation: newLayer.rotation, src: newLayer.src,
            },
          }))
        }
      })
      .on('broadcast', { event: 'STUDIO_LAYER_REMOVED' }, ({ payload }) => {
        if (payload.slide_id === slide.id && payload.layerId) {
          setLayers(prev => prev.filter(l => l.id !== payload.layerId))
          setLayerStates(prev => { const n = { ...prev }; delete n[payload.layerId]; return n })
        }
      })
      .on('broadcast', { event: 'STUDIO_EXERCISE_ENDED' }, ({ payload }) => {
        if (payload.slide_id === slide.id) {
          setExerciseEnded(true)
          setExerciseStats({ duration: payload.duration, eventsTriggered: payload.eventsTriggered })
        }
      })
      .subscribe()

    channelRef.current = channel
    return () => { supabase.removeChannel(channel) }
  }, [sessionId, slide.id])

  // Also listen on main session channel for STUDIO events
  useEffect(() => {
    const supabase = createClient()
    const mainChannel = supabase.channel(`session:${sessionId}`)

    mainChannel
      .on('broadcast', { event: 'STUDIO_EVENT_TRIGGERED' }, ({ payload }) => {
        if (payload.slide_id === slide.id && payload.layerStates) {
          setLayerStates(payload.layerStates as Record<string, StudioLayerState>)
        }
      })
      .on('broadcast', { event: 'STUDIO_VOTE_STARTED' }, ({ payload }) => {
        if (payload.slide_id === slide.id) {
          setActiveVote({
            eventId: payload.event_id,
            question: payload.question,
            options: payload.options,
          })
          setSelectedOptionId(null)
          setVoteSubmitted(false)
        }
      })
      .on('broadcast', { event: 'STUDIO_VOTE_RESULT' }, ({ payload }) => {
        if (payload.slide_id === slide.id) {
          setActiveVote(null)
          setVoteSubmitted(false)
          setSelectedOptionId(null)
        }
      })
      .on('broadcast', { event: 'STUDIO_LAYER_STATES_UPDATE' }, ({ payload }) => {
        if (payload.slide_id === slide.id && payload.layerStates) {
          setLayerStates(payload.layerStates as Record<string, StudioLayerState>)
        }
      })
      .on('broadcast', { event: 'STUDIO_PLAYBACK_START' }, ({ payload }) => {
        if (payload.slide_id === slide.id) {
          /* Playback started — layers will be updated via STUDIO_LAYER_STATES_UPDATE */
        }
      })
      .on('broadcast', { event: 'STUDIO_PLAYBACK_PAUSE' }, ({ payload }) => {
        if (payload.slide_id === slide.id) {
          /* Playback paused — scene holds current state */
        }
      })
      .on('broadcast', { event: 'STUDIO_LAYER_ADDED' }, ({ payload }) => {
        if (payload.slide_id === slide.id && payload.layer) {
          const newLayer = payload.layer as StudioLayer
          setLayers(prev => [...prev, newLayer])
          setLayerStates(prev => ({
            ...prev,
            [newLayer.id]: {
              visible: newLayer.visible, opacity: newLayer.opacity,
              x: newLayer.x, y: newLayer.y, width: newLayer.width, height: newLayer.height,
              rotation: newLayer.rotation, src: newLayer.src,
            },
          }))
        }
      })
      .on('broadcast', { event: 'STUDIO_LAYER_REMOVED' }, ({ payload }) => {
        if (payload.slide_id === slide.id && payload.layerId) {
          setLayers(prev => prev.filter(l => l.id !== payload.layerId))
          setLayerStates(prev => { const n = { ...prev }; delete n[payload.layerId]; return n })
        }
      })
      .on('broadcast', { event: 'STUDIO_EXERCISE_ENDED' }, ({ payload }) => {
        if (payload.slide_id === slide.id) {
          setExerciseEnded(true)
          setExerciseStats({ duration: payload.duration, eventsTriggered: payload.eventsTriggered })
        }
      })
      .subscribe()

    return () => { supabase.removeChannel(mainChannel) }
  }, [sessionId, slide.id])

  useEffect(() => {
    const interval = setInterval(() => setSessionSeconds(s => s + 1), 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handler = () => setIsCanvasFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  async function handleVoteSubmit() {
    if (!selectedOptionId || !activeVote || submittingVote) return
    setSubmittingVote(true)

    // Broadcast vote to presenter so they see live tallies
    channelRef.current?.send({
      type: 'broadcast',
      event: 'STUDIO_VOTE_CAST',
      payload: { slide_id: slide.id, event_id: activeVote.eventId, option_id: selectedOptionId },
    })

    await onSubmit({ studio_vote_option_id: selectedOptionId, studio_event_id: activeVote.eventId })
    setVoteSubmitted(true)
    setSubmittingVote(false)
  }

  // If the exercise has ended, show the ended screen
  if (exerciseEnded) {
    const formatDuration = (s: number) => `${Math.floor(s / 60)}m ${s % 60}s`
    return (
      <div className="text-center py-12 space-y-4 animate-in fade-in zoom-in-95 duration-500">
        <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center mx-auto">
          <svg viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
        </div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-medium">Command 360</p>
        <h2 className="text-xl font-bold">Exercise Complete</h2>
        {exerciseStats && (
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span>Duration: {formatDuration(exerciseStats.duration)}</span>
            <span>Events: {exerciseStats.eventsTriggered}</span>
          </div>
        )}
        <p className="text-sm text-muted-foreground">The presenter has ended this exercise session.</p>
      </div>
    )
  }

  // If there's an active vote, show the vote UI
  if (activeVote) {
    if (voteSubmitted) {
      return (
        <div className="text-center py-8 space-y-3 animate-in fade-in zoom-in-95 duration-300">
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-emerald-500" />
            </div>
          </div>
          <h3 className="text-base font-semibold">Vote submitted!</h3>
          <p className="text-muted-foreground text-sm">Waiting for results...</p>
        </div>
      )
    }

    return (
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
        <div className="text-center">
          <p className="text-base font-semibold">{activeVote.question}</p>
        </div>
        <div className="space-y-3">
          {activeVote.options.map((opt, i) => (
            <button
              key={opt.id}
              data-selected={selectedOptionId === opt.id}
              onClick={() => setSelectedOptionId(opt.id)}
              className={cn(
                'w-full text-left px-5 py-4 rounded-2xl border-2 transition-all duration-200 font-medium',
                selectedOptionId === opt.id
                  ? 'border-primary bg-primary/15 scale-[1.02] shadow-md shadow-primary/10'
                  : 'bg-card border-border hover:border-primary/50',
                OPTION_COLORS[i % OPTION_COLORS.length]
              )}
            >
              <div className="flex items-center justify-between">
                <span>{opt.label}</span>
                {selectedOptionId === opt.id && <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />}
              </div>
            </button>
          ))}
        </div>
        <Button
          onClick={handleVoteSubmit}
          disabled={!selectedOptionId || submittingVote}
          className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-6 rounded-xl text-lg transition-all hover:shadow-lg hover:shadow-red-500/25"
        >
          {submittingVote ? 'Submitting...' : 'Submit vote'}
        </Button>
      </div>
    )
  }

  const formatTimer = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
  }

  const toggleCanvasFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      canvasRef.current?.requestFullscreen()
    }
  }

  // Default watching state — large canvas scene
  return (
    <div className="flex flex-col items-center gap-2 animate-in fade-in duration-300 w-full max-w-5xl mx-auto relative">
      {/* Red gradient glow background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_30%,rgba(220,38,38,0.12),transparent)]" />
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'linear-gradient(rgba(220,38,38,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,0.3) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />
      </div>

      {/* Large scene canvas */}
      <div
        ref={canvasRef}
        className="w-full relative overflow-hidden rounded-xl z-10"
        style={{
          aspectRatio: '16 / 9',
          backgroundColor: canvas.backgroundColor,
        }}
      >
        {layers.map((layer) => {
          const state = layerStates[layer.id]
          if (!state || !state.visible) return null
          return <MiniLayer key={layer.id} layer={layer} state={state} />
        })}
        {/* Fullscreen button */}
        <Tooltip><TooltipTrigger asChild>
        <button
          onClick={toggleCanvasFullscreen}
          className="absolute bottom-2 right-2 z-10 w-8 h-8 rounded-lg bg-black/50 hover:bg-black/70 text-white/50 hover:text-white flex items-center justify-center transition-all backdrop-blur-sm"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
        </TooltipTrigger><TooltipContent>Fullscreen</TooltipContent></Tooltip>
        {/* Red exit button when fullscreen */}
        {isCanvasFullscreen && (
          <Tooltip><TooltipTrigger asChild>
          <button onClick={toggleCanvasFullscreen}
            className="fixed top-4 right-4 z-[9999] w-8 h-8 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
          </TooltipTrigger><TooltipContent>Exit fullscreen</TooltipContent></Tooltip>
        )}
      </div>

      {/* Status indicator */}
      <div className="flex flex-col items-center gap-1.5 z-10">
        <div className="flex items-center justify-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <p className="text-center text-muted-foreground text-xs">Scene in progress</p>
        </div>
        <div className="px-2.5 py-1 rounded-md bg-zinc-900/80 border border-zinc-800 text-[11px] font-mono text-zinc-400 tabular-nums">
          Session: {formatTimer(sessionSeconds)}
        </div>
      </div>
    </div>
  )
}

/* ─── Helpers ─── */

function buildInitialStates(layers: StudioLayer[]): Record<string, StudioLayerState> {
  const map: Record<string, StudioLayerState> = {}
  for (const l of layers) {
    map[l.id] = {
      visible: l.visible,
      opacity: l.opacity,
      x: l.x,
      y: l.y,
      width: l.width,
      height: l.height,
      rotation: l.rotation,
      src: l.src,
    }
  }
  return map
}

/* ─── Mini layer renderer (participant view) ─── */

function MiniLayer({ layer, state }: { layer: StudioLayer; state: StudioLayerState }) {
  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${state.x}%`,
    top: `${state.y}%`,
    width: `${state.width}%`,
    height: `${state.height}%`,
    opacity: state.opacity,
    transform: `rotate(${state.rotation}deg) translateZ(0)`,
    mixBlendMode: layer.blendMode as React.CSSProperties['mixBlendMode'],
    transition: 'left 600ms ease-in-out, top 600ms ease-in-out, width 600ms ease-in-out, height 600ms ease-in-out, opacity 600ms ease-in-out, transform 600ms ease-in-out',
    willChange: 'opacity, transform',
    zIndex: layer.zIndex,
    overflow: 'hidden',
  }

  switch (layer.type) {
    case 'image': {
      const ifp = layer.feather || 0
      const ifStyle = ifp > 0 ? { WebkitMaskImage: `radial-gradient(ellipse at center, black 0%, black calc(100% - ${ifp * 2}px), transparent 100%)`, maskImage: `radial-gradient(ellipse at center, black 0%, black calc(100% - ${ifp * 2}px), transparent 100%)` } : {}
      return (
        <div style={{ ...baseStyle, ...ifStyle } as React.CSSProperties}>
          {(state.src || layer.src) && (
            <img
              src={state.src || layer.src}
              alt={layer.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              draggable={false}
            />
          )}
        </div>
      )
    }
    case 'video':
      return (
        <div style={baseStyle}>
          {layer.youtubeUrl ? (
            <iframe
              src={layer.youtubeUrl}
              className="w-full h-full border-0"
              style={{ width: '100%', height: '100%', display: 'block' }}
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          ) : (state.src || layer.src) && (
            <video
              src={state.src || layer.src}
              autoPlay
              muted
              loop
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          )}
        </div>
      )
    case 'text':
      return (
        <div
          style={{
            ...baseStyle,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: layer.fontSize ? `${layer.fontSize * 0.5}px` : '12px',
            fontWeight: layer.fontWeight || '400',
            color: layer.color || '#ffffff',
            textAlign: 'center',
          }}
        >
          {layer.text}
        </div>
      )
    case 'shape': {
      const dp = layer.distortPoints
      const shapeClip = dp
        ? `polygon(${dp.tl.x}% ${dp.tl.y}%, ${dp.tr.x}% ${dp.tr.y}%, ${dp.br.x}% ${dp.br.y}%, ${dp.bl.x}% ${dp.bl.y}%)`
        : layer.name === 'Triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : undefined
      return (
        <div
          style={{
            ...baseStyle,
            backgroundColor: layer.fillTransparent ? 'transparent' : (layer.color || '#ffffff'),
            borderRadius: layer.name === 'Circle' && !dp ? '50%' : undefined,
            clipPath: shapeClip,
            border: layer.borderWidth ? `${layer.borderWidth}px ${layer.borderStyle || 'solid'} ${layer.borderColor || '#fff'}` : undefined,
            display: layer.maskMode && layer.maskMode !== 'none' ? 'none' : undefined,
            ...(layer.feather ? { WebkitMaskImage: `radial-gradient(ellipse at center, black 0%, black calc(100% - ${layer.feather * 2}px), transparent 100%)`, maskImage: `radial-gradient(ellipse at center, black 0%, black calc(100% - ${layer.feather * 2}px), transparent 100%)` } : {}),
          }}
        />
      )
    }
    default:
      return null
  }
}
