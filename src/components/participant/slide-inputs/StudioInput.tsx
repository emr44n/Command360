'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Slide, StudioContent, StudioLayer, StudioLayerState } from '@/types/slide'
import { Monitor, CheckCircle2, Maximize2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { BrandMark } from '@/components/site/BrandMark'
import { STUDIO_DEFAULT_BG } from '@/lib/studio/default-canvas'

interface Props {
  slide: Slide
  sessionId: string
  onSubmit: (answer: Record<string, unknown>) => Promise<void>
}


const OPTION_COLORS = [
  'border-primary hover:bg-primary/10 data-[selected=true]:bg-primary/20',
  'border-[#3E6DC4] hover:bg-[#3E6DC4]/10 data-[selected=true]:bg-[#3E6DC4]/20',
  'border-[#2E9E63] hover:bg-[#2E9E63]/10 data-[selected=true]:bg-[#2E9E63]/20',
  'border-[#c98a2a] hover:bg-[#c98a2a]/10 data-[selected=true]:bg-[#c98a2a]/20',
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

  // Add a layer idempotently — replace if it already exists, else append. This
  // stops a layer being duplicated when it arrives via both the auto-push on
  // drop and a follow-up sync/heartbeat.
  const applyLayerAdded = useCallback((newLayer: StudioLayer) => {
    setLayers(prev => (prev.some(l => l.id === newLayer.id) ? prev.map(l => (l.id === newLayer.id ? newLayer : l)) : [...prev, newLayer]))
    setLayerStates(prev => ({
      ...prev,
      [newLayer.id]: {
        visible: newLayer.visible, opacity: newLayer.opacity,
        x: newLayer.x, y: newLayer.y, width: newLayer.width, height: newLayer.height,
        rotation: newLayer.rotation, src: newLayer.src, volume: newLayer.volume,
      },
    }))
  }, [])

  // Apply a full-state sync from the presenter (late-join catch-up + heartbeat):
  // replace the layer list (so added layers appear) and the live layer states.
  const applySyncState = useCallback((payload: { layers?: StudioLayer[]; layerStates?: Record<string, StudioLayerState> }) => {
    if (Array.isArray(payload.layers)) setLayers(payload.layers)
    if (payload.layerStates) setLayerStates(payload.layerStates)
  }, [])

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
          applyLayerAdded(payload.layer as StudioLayer)
        }
      })
      .on('broadcast', { event: 'STUDIO_SYNC_STATE' }, ({ payload }) => {
        if (payload.slide_id === slide.id) applySyncState(payload)
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
      .subscribe((status) => {
        // ask the presenter to replay the current live state for late joiners
        if (status === 'SUBSCRIBED') {
          channel.send({ type: 'broadcast', event: 'STUDIO_STATE_REQUEST', payload: { slide_id: slide.id } })
        }
      })

    channelRef.current = channel
    return () => { supabase.removeChannel(channel) }
  }, [sessionId, slide.id, applyLayerAdded, applySyncState])

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
          applyLayerAdded(payload.layer as StudioLayer)
        }
      })
      .on('broadcast', { event: 'STUDIO_SYNC_STATE' }, ({ payload }) => {
        if (payload.slide_id === slide.id) applySyncState(payload)
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
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          mainChannel.send({ type: 'broadcast', event: 'STUDIO_STATE_REQUEST', payload: { slide_id: slide.id } })
        }
      })

    return () => { supabase.removeChannel(mainChannel) }
  }, [sessionId, slide.id, applyLayerAdded, applySyncState])

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
        <div className="mx-auto w-fit">
          <BrandMark size={56} />
        </div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#9aa0a8] font-medium">Command 360</p>
        <h2 className="text-xl font-bold">Exercise Ended</h2>
        {exerciseStats && (
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span>Duration: {formatDuration(exerciseStats.duration)}</span>
            <span>Events: {exerciseStats.eventsTriggered}</span>
          </div>
        )}
        <p className="text-sm text-muted-foreground">The presenter has ended this exercise session.</p>
        <button onClick={() => { try { window.close() } catch { /* can't close */ } }} className="mt-2 px-4 py-2 rounded-none bg-[#C9241A] hover:bg-[#a81d15] text-white text-sm font-medium transition-colors">Close Window</button>
      </div>
    )
  }

  // If there's an active vote, show the vote UI
  if (activeVote) {
    if (voteSubmitted) {
      return (
        <div className="text-center py-8 space-y-3 animate-in fade-in zoom-in-95 duration-300">
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-full bg-[#2E9E63]/10 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-[#2E9E63]" />
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
                'w-full text-left px-5 py-4 rounded-none border-2 transition-all duration-200 font-medium',
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
          className="w-full bg-[#C9241A] hover:bg-[#a81d15] text-white font-semibold py-6 rounded-none text-lg transition-all hover:shadow-lg hover:shadow-[#C9241A]/25"
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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_30%,rgba(201,36,26,0.12),transparent)]" />
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'linear-gradient(rgba(201,36,26,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(201,36,26,0.3) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />
      </div>

      {/* SVG feather filter definitions */}
      <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
        <defs>
          {layers.filter(l => l.feather && l.feather > 0).map(l => (
            <filter key={l.id} id={`pf-${l.id}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation={l.feather!} />
            </filter>
          ))}
        </defs>
      </svg>

      {/* Large scene canvas */}
      <div
        ref={canvasRef}
        className="w-full relative overflow-hidden rounded-none z-10"
        style={{
          aspectRatio: '16 / 9',
          backgroundColor: canvas.backgroundColor || STUDIO_DEFAULT_BG,
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
          className="absolute bottom-2 right-2 z-10 w-8 h-8 rounded-none bg-black/50 hover:bg-black/70 text-white/50 hover:text-white flex items-center justify-center transition-all backdrop-blur-sm"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
        </TooltipTrigger><TooltipContent>Fullscreen</TooltipContent></Tooltip>
        {/* Red exit button when fullscreen */}
        {isCanvasFullscreen && (
          <Tooltip><TooltipTrigger asChild>
          <button onClick={toggleCanvasFullscreen}
            className="fixed top-4 right-4 z-[9999] w-8 h-8 rounded-full bg-[#C9241A] hover:bg-[#a81d15] text-white flex items-center justify-center shadow-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
          </TooltipTrigger><TooltipContent>Exit fullscreen</TooltipContent></Tooltip>
        )}
      </div>

      {/* Status indicator */}
      <div className="flex flex-col items-center gap-1.5 z-10">
        <div className="flex items-center justify-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#2E9E63] animate-pulse" />
          <p className="text-center text-muted-foreground text-xs">Scene in progress</p>
        </div>
        <div className="px-2.5 py-1 rounded-none bg-[#16191E] border border-white/14 text-[11px] font-mono text-[#9aa0a8] tabular-nums">
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
      return (
        <div style={{ ...baseStyle, filter: layer.feather ? `url(#pf-${layer.id})` : undefined } as React.CSSProperties}>
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
      const pp = layer.polygonPoints
      const shapeClip = pp
        ? `polygon(${pp.map(p => `${p.x}% ${p.y}%`).join(', ')})`
        : dp ? `polygon(${dp.tl.x}% ${dp.tl.y}%, ${dp.tr.x}% ${dp.tr.y}%, ${dp.br.x}% ${dp.br.y}%, ${dp.bl.x}% ${dp.bl.y}%)`
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
            filter: layer.feather ? `url(#pf-${layer.id})` : undefined,
          }}
        />
      )
    }
    default:
      return null
  }
}
