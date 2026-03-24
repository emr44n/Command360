'use client'
import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import type { Slide, StudioContent, StudioLayer, StudioLayerState, StudioEvent } from '@/types/slide'
import type { Session } from '@/types/session'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { Zap, Vote, Loader2 } from 'lucide-react'

interface Props {
  slide: Slide
  session: Session
  channelRef?: React.RefObject<RealtimeChannel | null>
}

export function StudioDisplay({ slide, session, channelRef }: Props) {
  const content = slide.content as StudioContent
  const { canvas, layers, events, eventCategories } = content

  // Initialize layer states from layer defaults
  const [layerStates, setLayerStates] = useState<Record<string, StudioLayerState>>(() =>
    buildInitialStates(layers)
  )
  const [activeVote, setActiveVote] = useState<{ eventId: string; question: string; options: { id: string; label: string }[] } | null>(null)
  const [voteResults, setVoteResults] = useState<Record<string, number>>({})
  const [triggeredEvents, setTriggeredEvents] = useState<Set<string>>(new Set())

  // Reset states when slide changes
  useEffect(() => {
    setLayerStates(buildInitialStates(layers))
    setActiveVote(null)
    setVoteResults({})
    setTriggeredEvents(new Set())
  }, [slide.id])

  const applyActions = useCallback((event: StudioEvent) => {
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

    // Broadcast to participants
    channelRef?.current?.send({
      type: 'broadcast',
      event: 'STUDIO_EVENT_TRIGGERED',
      payload: { slide_id: slide.id, event_id: event.id, layerStates: newStates },
    })
  }, [layerStates, channelRef, slide.id])

  function handleTriggerManual(event: StudioEvent) {
    applyActions(event)
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
    const evt = events.find((e) => e.id === activeVote.eventId)
    if (evt) {
      const winningOpt = evt.voteOptions?.find((o) => o.id === winningId)
      if (winningOpt?.triggersEventId) {
        const targetEvent = events.find((e) => e.id === winningOpt.triggersEventId)
        if (targetEvent) applyActions(targetEvent)
      } else {
        applyActions(evt)
      }
    }

    setActiveVote(null)
  }

  // Group events by category
  const groupedEvents = useMemo(() => {
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
  }, [events])

  return (
    <div className="w-full h-full flex flex-col">
      {/* Scene canvas */}
      <div
        className="w-full relative overflow-hidden rounded-lg"
        style={{
          aspectRatio: '16 / 9',
          backgroundColor: canvas.backgroundColor,
        }}
      >
        {layers.map((layer) => {
          const state = layerStates[layer.id]
          if (!state || !state.visible) return null
          return (
            <DomLayer
              key={layer.id}
              layer={layer}
              state={state}
              maxDuration={getMaxDuration(events)}
            />
          )
        })}
      </div>

      {/* Event controls */}
      <div className="mt-4 space-y-3 max-h-48 overflow-y-auto">
        {/* Active vote banner */}
        {activeVote && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Vote className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-semibold text-amber-600">{activeVote.question}</span>
              </div>
              <button
                onClick={closeVote}
                className="text-xs font-medium text-amber-600 hover:text-amber-700 bg-amber-500/20 px-3 py-1 rounded-full transition-colors"
              >
                Close vote
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {activeVote.options.map((opt) => (
                <div key={opt.id} className="flex items-center justify-between bg-white/60 dark:bg-white/10 rounded-lg px-3 py-1.5 text-xs">
                  <span className="font-medium">{opt.label}</span>
                  <span className="text-muted-foreground font-mono">{voteResults[opt.id] || 0}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Uncategorized events */}
        {groupedEvents.uncategorized.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {groupedEvents.uncategorized.map((evt) => (
              <EventButton
                key={evt.id}
                event={evt}
                triggered={triggeredEvents.has(evt.id)}
                disabled={!!activeVote}
                onTrigger={() =>
                  evt.trigger === 'vote' ? handleTriggerVote(evt) : handleTriggerManual(evt)
                }
              />
            ))}
          </div>
        )}

        {/* Categorized events */}
        {eventCategories.map((cat) => {
          const catEvents = groupedEvents.byCategory.get(cat.id)
          if (!catEvents?.length) return null
          return (
            <div key={cat.id}>
              <p className="text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: cat.color || '#9ca3af' }}>
                {cat.name}
              </p>
              <div className="flex flex-wrap gap-2">
                {catEvents.map((evt) => (
                  <EventButton
                    key={evt.id}
                    event={evt}
                    triggered={triggeredEvents.has(evt.id)}
                    disabled={!!activeVote}
                    onTrigger={() =>
                      evt.trigger === 'vote' ? handleTriggerVote(evt) : handleTriggerManual(evt)
                    }
                  />
                ))}
              </div>
            </div>
          )
        })}
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

function getMaxDuration(events: StudioEvent[]): number {
  let max = 500
  for (const e of events) {
    for (const a of e.actions) {
      if (a.delay + a.duration > max) max = a.delay + a.duration
    }
  }
  return max
}

/* ─── DOM Layer Renderer ─── */

function DomLayer({ layer, state, maxDuration }: { layer: StudioLayer; state: StudioLayerState; maxDuration: number }) {
  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${state.x}%`,
    top: `${state.y}%`,
    width: `${state.width}%`,
    height: `${state.height}%`,
    opacity: state.opacity,
    transform: `rotate(${state.rotation}deg)`,
    mixBlendMode: layer.blendMode as React.CSSProperties['mixBlendMode'],
    transition: `all ${maxDuration}ms ease-in-out`,
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
  disabled,
  onTrigger,
}: {
  event: StudioEvent
  triggered: boolean
  disabled: boolean
  onTrigger: () => void
}) {
  const isVote = event.trigger === 'vote'
  return (
    <button
      onClick={onTrigger}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
        triggered
          ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/30'
          : 'bg-muted hover:bg-muted/80 text-foreground border border-border hover:border-primary/30'
      } disabled:opacity-40 disabled:cursor-not-allowed`}
      style={event.color && !triggered ? { borderColor: `${event.color}40`, color: event.color } : undefined}
    >
      {event.icon && <span>{event.icon}</span>}
      {isVote ? <Vote className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
      {event.name}
    </button>
  )
}
