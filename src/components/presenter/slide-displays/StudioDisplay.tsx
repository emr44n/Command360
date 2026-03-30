'use client'
import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import type { Slide, StudioContent, StudioLayer, StudioLayerState, StudioEvent } from '@/types/slide'
import type { Session } from '@/types/session'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { Zap, Vote, QrCode, Play, ChevronRight, ChevronDown, RotateCcw, Maximize2, Minimize2, Monitor, Check } from 'lucide-react'
import { playEvent, type EventPlaybackController } from '@/lib/studio/event-playback'

interface Props {
  slide: Slide
  session: Session
  channelRef?: React.RefObject<RealtimeChannel | null>
  allSlides?: Slide[]
}

export function StudioDisplay({ slide, session, channelRef, allSlides }: Props) {
  const content = slide.content as StudioContent
  const { canvas, layers, events, eventCategories, timelineEvents } = content

  // CCTV layout — render grid of scene previews instead of normal canvas
  if (content.cctvLayout && allSlides) {
    return (
      <CctvDisplayView
        content={content}
        allSlides={allSlides}
        session={session}
        events={[...events, ...(timelineEvents?.map(te => ({
          id: te.id, name: te.name, categoryId: te.categoryId, icon: te.icon, color: te.color,
          trigger: te.trigger, voteQuestion: te.voteQuestion, voteOptions: te.voteOptions, actions: [],
        })) || [])]}
        eventCategories={eventCategories}
        channelRef={channelRef}
      />
    )
  }

  // Initialize layer states from layer defaults
  const [layerStates, setLayerStates] = useState<Record<string, StudioLayerState>>(() =>
    buildInitialStates(layers)
  )
  const [activeVote, setActiveVote] = useState<{ eventId: string; question: string; options: { id: string; label: string }[] } | null>(null)
  const [voteResults, setVoteResults] = useState<Record<string, number>>({})
  const [triggeredEvents, setTriggeredEvents] = useState<Set<string>>(new Set())
  const [animatingEventId, setAnimatingEventId] = useState<string | null>(null)
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set())
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showEventsPanel, setShowEventsPanel] = useState(true)

  // Escape key exits fullscreen preview
  useEffect(() => {
    if (!isFullscreen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsFullscreen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isFullscreen])
  const canvasRef = useRef<HTMLDivElement>(null)
  const eventControllerRef = useRef<EventPlaybackController | null>(null)
  const initialStatesRef = useRef<Record<string, StudioLayerState>>(buildInitialStates(layers))

  // Reset states when slide changes
  useEffect(() => {
    const initial = buildInitialStates(layers)
    initialStatesRef.current = initial
    setLayerStates(initial)
    setActiveVote(null)
    setVoteResults({})
    setTriggeredEvents(new Set())
    setAnimatingEventId(null)
    eventControllerRef.current?.cancel()
    eventControllerRef.current = null
  }, [slide.id])

  // Listen for incoming STUDIO_VOTE_CAST messages from participants
  useEffect(() => {
    const channel = channelRef?.current
    if (!channel) return

    const handler = ({ payload }: { payload: { slide_id: string; event_id: string; option_id: string } }) => {
      if (payload.slide_id !== slide.id) return
      setVoteResults((prev) => ({
        ...prev,
        [payload.option_id]: (prev[payload.option_id] || 0) + 1,
      }))
    }

    channel.on('broadcast', { event: 'STUDIO_VOTE_CAST' }, handler)

    // Supabase doesn't provide a per-event unsubscribe, so cleanup happens on slide change via the reset above
  }, [channelRef?.current, slide.id])

  const triggerEvent = useCallback((event: StudioEvent) => {
    // Cancel any running animation
    eventControllerRef.current?.cancel()

    if (event.actions.length === 0) {
      setTriggeredEvents((prev) => new Set(prev).add(event.id))
      return
    }

    setAnimatingEventId(event.id)

    const controller = playEvent(
      event,
      layers,
      (overrides) => {
        // Merge overrides with current base layer states
        setLayerStates((prev) => {
          const next = { ...prev }
          for (const [layerId, props] of Object.entries(overrides)) {
            if (next[layerId]) {
              next[layerId] = { ...next[layerId], ...props }
            }
          }
          return next
        })
      },
      () => {
        // Animation complete
        setAnimatingEventId(null)
        setTriggeredEvents((prev) => new Set(prev).add(event.id))
        eventControllerRef.current = null

        // Broadcast final state to participants
        setLayerStates((current) => {
          channelRef?.current?.send({
            type: 'broadcast',
            event: 'STUDIO_EVENT_TRIGGERED',
            payload: { slide_id: slide.id, event_id: event.id, layerStates: current },
          })
          return current
        })
      }
    )

    eventControllerRef.current = controller
  }, [layers, channelRef, slide.id])

  // Cleanup on unmount
  useEffect(() => {
    return () => { eventControllerRef.current?.cancel() }
  }, [])

  const handleResetAll = useCallback(() => {
    eventControllerRef.current?.cancel()
    eventControllerRef.current = null
    setAnimatingEventId(null)
    setLayerStates(buildInitialStates(layers))
    setTriggeredEvents(new Set())
    initialStatesRef.current = buildInitialStates(layers)
  }, [layers])

  // Merge v1 events and v2 timelineEvents into a single list
  const allEvents: StudioEvent[] = useMemo(() => {
    const merged: StudioEvent[] = [...events]

    // Add v2 timelineEvents (they lack actions, so provide an empty array)
    if (timelineEvents?.length) {
      for (const te of timelineEvents) {
        // Skip if an event with the same id already exists in v1
        if (events.some((e) => e.id === te.id)) continue
        merged.push({
          id: te.id,
          name: te.name,
          categoryId: te.categoryId,
          icon: te.icon,
          color: te.color,
          trigger: te.trigger,
          voteQuestion: te.voteQuestion,
          voteOptions: te.voteOptions,
          actions: [],
        })
      }
    }

    return merged
  }, [events, timelineEvents])

  function handleTriggerManual(event: StudioEvent) {
    triggerEvent(event)
  }

  function handleTriggerVote(event: StudioEvent) {
    if (!event.voteQuestion || !event.voteOptions?.length) return
    const votePayload = {
      eventId: event.id,
      question: event.voteQuestion,
      options: event.voteOptions.map((o) => ({ id: o.id, label: o.label })),
    }
    setActiveVote(votePayload)
    setVoteResults({})

    channelRef?.current?.send({
      type: 'broadcast',
      event: 'STUDIO_VOTE_STARTED',
      payload: { slide_id: slide.id, event_id: event.id, question: event.voteQuestion, options: votePayload.options },
    })
  }

  function closeVote() {
    if (!activeVote) return
    // Find winning option
    let maxVotes = 0
    let winningId = ''
    for (const [optId, count] of Object.entries(voteResults)) {
      if (count > maxVotes) { maxVotes = count; winningId = optId }
    }

    // Broadcast result
    channelRef?.current?.send({
      type: 'broadcast',
      event: 'STUDIO_VOTE_RESULT',
      payload: { slide_id: slide.id, event_id: activeVote.eventId, winning_option_id: winningId, results: voteResults },
    })

    // If winning option triggers an event, fire it
    const evt = allEvents.find((e) => e.id === activeVote.eventId)
    if (evt) {
      const winningOpt = evt.voteOptions?.find((o) => o.id === winningId)
      if (winningOpt?.triggersEventId) {
        const targetEvent = allEvents.find((e) => e.id === winningOpt.triggersEventId)
        if (targetEvent) triggerEvent(targetEvent)
      } else {
        triggerEvent(evt)
      }
    }

    setActiveVote(null)
  }

  // Group events by category
  const groupedEvents = useMemo(() => {
    const uncategorized: StudioEvent[] = []
    const byCategory = new Map<string, StudioEvent[]>()

    for (const evt of allEvents) {
      if (evt.categoryId) {
        const list = byCategory.get(evt.categoryId) || []
        list.push(evt)
        byCategory.set(evt.categoryId, list)
      } else {
        uncategorized.push(evt)
      }
    }

    return { uncategorized, byCategory }
  }, [allEvents])

  const joinUrl = 'command360.co.uk/join'

  return (
    <div className={`w-full h-full flex gap-4 ${isFullscreen ? 'fixed inset-0 z-[200] bg-black p-0' : ''}`}>
      {/* Main canvas area */}
      <div className={`flex flex-col min-w-0 ${isFullscreen ? 'flex-1' : 'flex-1'}`}>
        <div
          ref={canvasRef}
          className={`w-full relative overflow-hidden flex-1 ${isFullscreen ? 'rounded-none' : 'rounded-lg'}`}
          style={{
            aspectRatio: isFullscreen ? undefined : '16 / 9',
            backgroundColor: canvas.backgroundColor,
          }}
        >
          {/* Fullscreen toggle button (full preview mode) */}
          <button
            onClick={() => setIsFullscreen(v => !v)}
            className="absolute top-2 right-2 z-10 w-8 h-8 rounded-lg bg-black/50 hover:bg-black/70 text-white/60 hover:text-white flex items-center justify-center transition-all backdrop-blur-sm"
            title={isFullscreen ? 'Exit fullscreen (Esc)' : 'Fullscreen preview'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          {/* Canvas-only fullscreen button (native Fullscreen API) */}
          <button
            onClick={() => canvasRef.current?.requestFullscreen()}
            className="absolute bottom-2 right-2 z-10 w-7 h-7 rounded-md bg-black/40 hover:bg-black/60 text-white/50 hover:text-white flex items-center justify-center transition-all backdrop-blur-sm"
            title="Canvas fullscreen"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          {layers.map((layer) => {
            const state = layerStates[layer.id]
            if (!state || !state.visible) return null
            return (
              <DomLayer
                key={layer.id}
                layer={layer}
                state={state}
              />
            )
          })}
        </div>

        {/* Join URL bar below canvas */}
        <div className="flex items-center justify-center gap-3 mt-2 py-1.5 bg-muted/30 rounded-lg">
          <QrCode className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-mono font-semibold text-foreground tracking-wide">{joinUrl}</span>
          <span className="text-xs text-muted-foreground">|</span>
          <span className="text-xs text-muted-foreground">Code: <span className="font-mono font-bold text-foreground">{session.room_code}</span></span>
        </div>
      </div>

      {/* Events panel toggle button */}
      {!isFullscreen && (
        <button
          onClick={() => setShowEventsPanel(v => !v)}
          className="shrink-0 w-5 flex items-center justify-center bg-[#1e1f22] hover:bg-[#2b2d31] text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer border-l border-[#1e1f22]"
          title={showEventsPanel ? 'Hide events' : 'Show events'}
        >
          <ChevronRight className={`w-3 h-3 transition-transform ${showEventsPanel ? '' : 'rotate-180'}`} />
        </button>
      )}

      {/* Events panel (right side) — hidden in fullscreen or when toggled off */}
      <div className={`w-56 shrink-0 flex flex-col overflow-hidden transition-all duration-200 ${isFullscreen || !showEventsPanel ? 'w-0 opacity-0 overflow-hidden' : ''}`}>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Events</h3>
          {triggeredEvents.size > 0 && (
            <button
              onClick={handleResetAll}
              className="flex items-center gap-1 text-[9px] font-medium text-muted-foreground hover:text-foreground transition-colors px-1.5 py-0.5 rounded hover:bg-muted"
              title="Reset all events"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              Reset
            </button>
          )}
        </div>

        {/* Active vote banner */}
        {activeVote && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 mb-2">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <Vote className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-xs font-semibold text-amber-600 truncate">{activeVote.question}</span>
              </div>
              <button
                onClick={closeVote}
                className="text-[10px] font-medium text-amber-600 hover:text-amber-700 bg-amber-500/20 px-2 py-0.5 rounded-full transition-colors shrink-0"
              >
                Close
              </button>
            </div>
            <div className="grid grid-cols-1 gap-1">
              {activeVote.options.map((opt) => (
                <div key={opt.id} className="flex items-center justify-between bg-white/60 dark:bg-white/10 rounded px-2 py-1 text-[11px]">
                  <span className="font-medium truncate">{opt.label}</span>
                  <span className="text-muted-foreground font-mono ml-2">{voteResults[opt.id] || 0}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-2">
          {/* Uncategorized events */}
          {groupedEvents.uncategorized.map((evt) => (
            <EventButton
              key={evt.id}
              event={evt}
              triggered={triggeredEvents.has(evt.id)}
              animating={animatingEventId === evt.id}
              disabled={!!activeVote || animatingEventId === evt.id}
              onTrigger={() =>
                evt.trigger === 'vote' ? handleTriggerVote(evt) : handleTriggerManual(evt)
              }
              layers={layers}
            />
          ))}

          {/* Categorized events */}
          {eventCategories.map((cat) => {
            const catEvents = groupedEvents.byCategory.get(cat.id)
            if (!catEvents?.length) return null
            const isCollapsed = collapsedCategories.has(cat.id)
            return (
              <div key={cat.id}>
                <button
                  onClick={() => setCollapsedCategories((prev) => {
                    const next = new Set(prev)
                    if (next.has(cat.id)) next.delete(cat.id)
                    else next.add(cat.id)
                    return next
                  })}
                  className="w-full flex items-center gap-1 mb-1 group/cat"
                >
                  <ChevronRight
                    className={`w-3 h-3 text-muted-foreground transition-transform ${isCollapsed ? '' : 'rotate-90'}`}
                  />
                  <span className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: cat.color || '#9ca3af' }}>
                    {cat.name}
                  </span>
                  <span className="text-[8px] text-muted-foreground/60 ml-auto">{catEvents.length}</span>
                </button>
                {!isCollapsed && catEvents.map((evt) => (
                  <EventButton
                    key={evt.id}
                    event={evt}
                    triggered={triggeredEvents.has(evt.id)}
                    animating={animatingEventId === evt.id}
                    disabled={!!activeVote || animatingEventId === evt.id}
                    onTrigger={() =>
                      evt.trigger === 'vote' ? handleTriggerVote(evt) : handleTriggerManual(evt)
                    }
                    layers={layers}
                  />
                ))}
              </div>
            )
          })}

          {allEvents.length === 0 && (
            <p className="text-[11px] text-muted-foreground/50 text-center py-4 italic">No events</p>
          )}
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

/* ─── DOM Layer Renderer ─── */

function DomLayer({ layer, state }: { layer: StudioLayer; state: StudioLayerState }) {
  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${state.x}%`,
    top: `${state.y}%`,
    width: `${state.width}%`,
    height: `${state.height}%`,
    opacity: state.opacity,
    transform: `rotate(${state.rotation}deg)`,
    mixBlendMode: layer.blendMode as React.CSSProperties['mixBlendMode'],
    zIndex: layer.zIndex,
    overflow: 'hidden',
  }

  switch (layer.type) {
    case 'image':
      return (
        <div style={baseStyle}>
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

    case 'video':
      return (
        <div style={baseStyle}>
          {(state.src || layer.src) && (
            <video
              src={state.src || layer.src}
              autoPlay={layer.autoplay ?? true}
              muted={layer.muted ?? true}
              loop={layer.loop ?? true}
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
            fontSize: layer.fontSize ? `${layer.fontSize}px` : '24px',
            fontWeight: layer.fontWeight || '400',
            color: layer.color || '#ffffff',
            textAlign: 'center',
            wordBreak: 'break-word',
          }}
        >
          {layer.text}
        </div>
      )

    case 'shape':
      return (
        <div
          style={{
            ...baseStyle,
            backgroundColor: layer.color || '#ffffff',
            borderRadius: 4,
          }}
        />
      )

    default:
      return null
  }
}

/* ─── Event Button ─── */

function EventButton({
  event,
  triggered,
  animating,
  disabled,
  onTrigger,
  layers,
}: {
  event: StudioEvent
  triggered: boolean
  animating: boolean
  disabled: boolean
  onTrigger: () => void
  layers?: StudioLayer[]
}) {
  const [detailsOpen, setDetailsOpen] = useState(false)
  const isVote = event.trigger === 'vote'
  const actionCount = event.actions.length
  const hasActions = actionCount > 0

  return (
    <div className="mb-1">
      <button
        onClick={onTrigger}
        disabled={disabled}
        className={`w-full flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all text-left ${
          animating
            ? 'bg-amber-500/15 text-amber-600 border border-amber-500/40 animate-pulse'
            : triggered
              ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/30'
              : 'bg-muted hover:bg-muted/80 text-foreground border border-border hover:border-primary/30'
        } disabled:opacity-40 disabled:cursor-not-allowed`}
        style={event.color && !triggered && !animating ? { borderColor: `${event.color}40`, color: event.color } : undefined}
      >
        {event.icon && <span>{event.icon}</span>}
        {isVote ? <Vote className="w-3 h-3 shrink-0" /> : <Zap className="w-3 h-3 shrink-0" />}
        <span className="truncate">{event.name}</span>
        {hasActions && (
          <span className="text-[9px] bg-foreground/10 px-1 py-0.5 rounded-full leading-none">{actionCount}</span>
        )}
        {animating ? (
          <span className="w-2.5 h-2.5 ml-auto shrink-0 rounded-full bg-amber-500 animate-ping" />
        ) : (
          <Play className="w-2.5 h-2.5 ml-auto shrink-0 opacity-40" />
        )}
      </button>

      {/* Action details — shown after event is triggered */}
      {triggered && hasActions && (
        <div className="ml-2 mt-0.5">
          <button
            onClick={() => setDetailsOpen(v => !v)}
            className="flex items-center gap-0.5 text-[9px] text-muted-foreground hover:text-foreground transition-colors py-0.5"
          >
            {detailsOpen ? <ChevronDown className="w-2.5 h-2.5" /> : <ChevronRight className="w-2.5 h-2.5" />}
            <span>{actionCount} action{actionCount !== 1 ? 's' : ''}</span>
          </button>
          {detailsOpen && (
            <div className="ml-3 space-y-0.5 pb-1">
              {event.actions.map((action) => {
                const layerName = layers?.find(l => l.id === action.layerId)?.name || action.layerId.slice(0, 6)
                return (
                  <div key={action.id} className="flex items-start gap-1 text-[9px] text-muted-foreground leading-tight">
                    <Check className="w-2.5 h-2.5 text-emerald-500 shrink-0 mt-px" />
                    <span>
                      <span className="font-medium text-foreground/70">{layerName}</span>
                      {' '}
                      <span className="opacity-70">{action.property}</span>
                      {' '}
                      <span className="opacity-50">{formatValue(action.fromValue)}</span>
                      <span className="opacity-40">{' \u2192 '}</span>
                      <span className="opacity-70">{formatValue(action.toValue)}</span>
                      {action.duration > 0 && (
                        <span className="opacity-40 ml-0.5">({action.duration}ms)</span>
                      )}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ─── CCTV Display View ─── */

type CctvLayout = '1' | '2' | '3' | '4' | '6' | '8'

function CctvDisplayView({
  content,
  allSlides,
  session,
  events: _events,
  eventCategories: _eventCategories,
  channelRef: _channelRef,
}: {
  content: StudioContent
  allSlides: Slide[]
  session: Session
  events: StudioEvent[]
  eventCategories: { id: string; name: string; color?: string }[]
  channelRef?: React.RefObject<RealtimeChannel | null>
}) {
  const layout = content.cctvLayout as CctvLayout
  const slots = content.cctvSlots || []
  const slotCount = parseInt(layout, 10)
  const joinUrl = 'command360.co.uk/join'

  // Build the grid cells
  const cells = Array.from({ length: slotCount }, (_, i) => {
    const slideId = slots[i]
    const assignedSlide = slideId ? allSlides.find(s => s.id === slideId) : null
    const assignedContent = assignedSlide ? (assignedSlide.content as StudioContent) : null
    const slideIndex = assignedSlide ? allSlides.findIndex(s => s.id === assignedSlide.id) : -1
    const label = assignedSlide
      ? (assignedSlide.title || `Scene ${slideIndex + 1}`)
      : null

    return (
      <div
        key={i}
        className="relative overflow-hidden bg-black"
        style={{ border: '1px solid #333' }}
      >
        {assignedContent && assignedContent.layers ? (
          <>
            {/* Mini scene render */}
            <div
              className="absolute inset-0"
              style={{ backgroundColor: assignedContent.canvas?.backgroundColor || '#000' }}
            >
              {assignedContent.layers.map((layer) => {
                if (!layer.visible) return null
                return <DomLayer key={layer.id} layer={layer} state={{
                  visible: layer.visible,
                  opacity: layer.opacity,
                  x: layer.x,
                  y: layer.y,
                  width: layer.width,
                  height: layer.height,
                  rotation: layer.rotation,
                  src: layer.src,
                }} />
              })}
            </div>
            {/* Scene label */}
            {label && (
              <div className="absolute top-1 left-1 z-10 px-1.5 py-0.5 bg-black/70 rounded text-[10px] font-semibold text-white/80 backdrop-blur-sm">
                {label}
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900">
            <Monitor className="w-6 h-6 text-zinc-700 mb-1" />
            <span className="text-[11px] font-mono text-zinc-600 uppercase tracking-wider">No Signal</span>
          </div>
        )}
      </div>
    )
  })

  // CSS grid layout based on cctvLayout
  const gridStyle = (): React.CSSProperties => {
    switch (layout) {
      case '1':
        return { display: 'grid', gridTemplateColumns: '1fr', gridTemplateRows: '1fr' }
      case '2':
        return { display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr' }
      case '3':
        return { display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr' }
      case '4':
        return { display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr' }
      case '6':
        return { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr 1fr' }
      case '8':
        return { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gridTemplateRows: '1fr 1fr' }
      default:
        return { display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr' }
    }
  }

  // For layout '3', the first cell spans 2 rows
  const renderCells = () => {
    if (layout === '3') {
      return (
        <>
          <div className="relative overflow-hidden bg-black row-span-2" style={{ border: '1px solid #333' }}>
            {cells[0]?.props?.children}
          </div>
          {cells[1]}
          {cells[2]}
        </>
      )
    }
    return cells
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div
        className="flex-1 relative overflow-hidden rounded-lg"
        style={{
          aspectRatio: '16 / 9',
          ...gridStyle(),
          gap: '2px',
          backgroundColor: '#111',
        }}
      >
        {layout === '3' ? (
          <>
            {/* Slot 0: spans 2 rows on the left */}
            <div className="relative overflow-hidden bg-black" style={{ border: '1px solid #333', gridRow: 'span 2' }}>
              {(() => {
                const slideId = slots[0]
                const assignedSlide = slideId ? allSlides.find(s => s.id === slideId) : null
                const assignedContent = assignedSlide ? (assignedSlide.content as StudioContent) : null
                const slideIndex = assignedSlide ? allSlides.findIndex(s => s.id === assignedSlide.id) : -1
                const label = assignedSlide ? (assignedSlide.title || `Scene ${slideIndex + 1}`) : null
                if (assignedContent?.layers) {
                  return (
                    <>
                      <div className="absolute inset-0" style={{ backgroundColor: assignedContent.canvas?.backgroundColor || '#000' }}>
                        {assignedContent.layers.map(layer => {
                          if (!layer.visible) return null
                          return <DomLayer key={layer.id} layer={layer} state={{
                            visible: layer.visible, opacity: layer.opacity, x: layer.x, y: layer.y,
                            width: layer.width, height: layer.height, rotation: layer.rotation, src: layer.src,
                          }} />
                        })}
                      </div>
                      {label && (
                        <div className="absolute top-1 left-1 z-10 px-1.5 py-0.5 bg-black/70 rounded text-[10px] font-semibold text-white/80 backdrop-blur-sm">{label}</div>
                      )}
                    </>
                  )
                }
                return (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900">
                    <Monitor className="w-6 h-6 text-zinc-700 mb-1" />
                    <span className="text-[11px] font-mono text-zinc-600 uppercase tracking-wider">No Signal</span>
                  </div>
                )
              })()}
            </div>
            {/* Slots 1 and 2 stacked on the right */}
            {[1, 2].map(i => cells[i])}
          </>
        ) : (
          cells
        )}
      </div>
      {/* Join URL bar */}
      <div className="flex items-center justify-center gap-3 mt-2 py-1.5 bg-muted/30 rounded-lg">
        <QrCode className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-xs font-mono font-semibold text-foreground tracking-wide">{joinUrl}</span>
        <span className="text-xs text-muted-foreground">|</span>
        <span className="text-xs text-muted-foreground">Code: <span className="font-mono font-bold text-foreground">{session.room_code}</span></span>
      </div>
    </div>
  )
}

function formatValue(v: number | boolean | string | undefined): string {
  if (v === undefined) return '?'
  if (typeof v === 'boolean') return v ? 'on' : 'off'
  if (typeof v === 'number') return Number.isInteger(v) ? String(v) : v.toFixed(1)
  return String(v)
}
