'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import type { Slide, StudioContent, StudioLayer, StudioLayerState, StudioEvent, StudioEventCategory } from '@/types/slide'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { Play, RotateCcw, ChevronRight, ChevronDown, Square, Clock, Radio, Zap } from 'lucide-react'
import { playEvent, type EventPlaybackController } from '@/lib/studio/event-playback'
import { PushPanel } from '@/components/studio/PushPanel'

export interface ExerciseStats {
  duration: number
  eventsTriggered: number
  assetsAdded: number
  presenterName: string
  sceneName: string
  startTime: string
  endTime: string
}

interface Props {
  slide: Slide
  session: { id: string; room_code: string }
  channelRef: React.RefObject<RealtimeChannel | null>
  presenterName: string
  onEndExercise: (stats: ExerciseStats) => void
}

function buildInitialStates(layers: StudioLayer[]): Record<string, StudioLayerState> {
  const map: Record<string, StudioLayerState> = {}
  for (const l of layers) {
    map[l.id] = { visible: l.visible, opacity: l.opacity, x: l.x, y: l.y, width: l.width, height: l.height, rotation: l.rotation, src: l.src, volume: l.volume }
  }
  return map
}

export function LiveDirectorView({ slide, session, channelRef, presenterName, onEndExercise }: Props) {
  const [activeContent] = useState<StudioContent>(() => JSON.parse(JSON.stringify(slide.content)))
  const { canvas, layers: initialLayers, events, eventCategories } = activeContent

  const [layers, setLayers] = useState(initialLayers)
  const [layerStates, setLayerStates] = useState(() => buildInitialStates(initialLayers))
  const [triggeredEvents, setTriggeredEvents] = useState<Set<string>>(new Set())
  const [animatingEventId, setAnimatingEventId] = useState<string | null>(null)
  const [sessionSeconds, setSessionSeconds] = useState(0)
  const [showEndConfirm, setShowEndConfirm] = useState(false)
  const [pendingLayers, setPendingLayers] = useState<StudioLayer[]>([])
  const [assetsAdded, setAssetsAdded] = useState(0)
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set())
  const eventControllerRef = useRef<EventPlaybackController | null>(null)
  const startTimeRef = useRef(new Date().toISOString())

  useEffect(() => {
    const interval = setInterval(() => setSessionSeconds(s => s + 1), 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    return () => { eventControllerRef.current?.cancel() }
  }, [])

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

  const triggerEvent = useCallback((event: StudioEvent) => {
    eventControllerRef.current?.cancel()
    setAnimatingEventId(event.id)
    const controller = playEvent(event, layers, (overrides) => {
      setLayerStates(prev => {
        const next = { ...prev }
        for (const [layerId, props] of Object.entries(overrides)) {
          if (next[layerId]) next[layerId] = { ...next[layerId], ...props }
        }
        return next
      })
    }, () => {
      setAnimatingEventId(null)
      setTriggeredEvents(prev => new Set(prev).add(event.id))
      channelRef.current?.send({ type: 'broadcast', event: 'STUDIO_EVENT_TRIGGERED', payload: { slide_id: slide.id, event_id: event.id, layerStates } })
    })
    eventControllerRef.current = controller
  }, [layers, layerStates, slide.id, channelRef])

  const redoEvent = useCallback((eventId: string) => {
    setTriggeredEvents(prev => { const n = new Set(prev); n.delete(eventId); return n })
  }, [])

  const handlePush = useCallback((pushLayers: StudioLayer[], transition: 'fade' | 'instant') => {
    for (const layer of pushLayers) {
      setLayers(prev => [...prev, layer])
      setLayerStates(prev => ({
        ...prev,
        [layer.id]: { visible: true, opacity: transition === 'fade' ? 0 : layer.opacity, x: layer.x, y: layer.y, width: layer.width, height: layer.height, rotation: layer.rotation, src: layer.src }
      }))
      channelRef.current?.send({ type: 'broadcast', event: 'STUDIO_LAYER_ADDED', payload: { slide_id: slide.id, layer } })
      if (transition === 'fade') {
        setTimeout(() => {
          setLayerStates(prev => ({ ...prev, [layer.id]: { ...prev[layer.id], opacity: layer.opacity } }))
          channelRef.current?.send({ type: 'broadcast', event: 'STUDIO_LAYER_STATES_UPDATE', payload: { slide_id: slide.id, layerStates: { [layer.id]: { opacity: layer.opacity } } } })
        }, 50)
      }
    }
    setAssetsAdded(prev => prev + pushLayers.length)
    setPendingLayers([])
  }, [slide.id, channelRef])

  const handleEndExercise = useCallback(async () => {
    eventControllerRef.current?.cancel()
    const endTime = new Date().toISOString()
    channelRef.current?.send({ type: 'broadcast', event: 'STUDIO_EXERCISE_ENDED', payload: { slide_id: slide.id, duration: sessionSeconds, eventsTriggered: triggeredEvents.size } })
    try {
      await fetch('/api/studio/exercise', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ session_id: session.id, duration: sessionSeconds, events_triggered: triggeredEvents.size, assets_added: assetsAdded, presenter_name: presenterName, scene_name: slide.title || 'Untitled Scene', start_time: startTimeRef.current, end_time: endTime }) })
    } catch { /* silent */ }
    onEndExercise({ duration: sessionSeconds, eventsTriggered: triggeredEvents.size, assetsAdded, presenterName, sceneName: slide.title || 'Untitled Scene', startTime: startTimeRef.current, endTime })
  }, [sessionSeconds, triggeredEvents, assetsAdded, presenterName, slide, session, channelRef, onEndExercise])

  const grouped = useMemo(() => {
    const uncategorized: StudioEvent[] = []
    const byCategory = new Map<string, StudioEvent[]>()
    for (const evt of events) {
      if (evt.categoryId) { const l = byCategory.get(evt.categoryId) || []; l.push(evt); byCategory.set(evt.categoryId, l) }
      else uncategorized.push(evt)
    }
    return { uncategorized, byCategory }
  }, [events])

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#0a0a0b]" style={{ border: '3px solid #dc2626' }}>
      <div className="h-10 bg-[#1a1a1c] border-b border-red-500/30 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" /><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" /></span>
            <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider">Active Mode</span>
          </div>
          <div className="h-4 w-px bg-zinc-700" />
          <div className="flex items-center gap-1.5 text-zinc-400"><Clock className="w-3.5 h-3.5" /><span className="text-[12px] font-mono tabular-nums">{formatTime(sessionSeconds)}</span></div>
          {presenterName && <><div className="h-4 w-px bg-zinc-700" /><span className="text-[10px] text-zinc-500">{presenterName}</span></>}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500"><Radio className="w-3 h-3" />Code: <span className="font-mono font-bold text-white">{session.room_code}</span></div>
          <button onClick={() => setShowEndConfirm(true)} className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white text-[11px] font-medium transition-colors flex items-center gap-1.5"><Square className="w-3 h-3" /> End Exercise</button>
        </div>
      </div>

      <div className="flex-1 flex min-h-0">
        <div className="w-56 shrink-0 bg-[#1e1f22] border-r border-[#2b2d31] overflow-y-auto p-2">
          <h3 className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-2 px-1">Events</h3>
          {events.length === 0 && <p className="text-[10px] text-zinc-600 text-center py-4">No events defined</p>}
          {grouped.uncategorized.map(evt => <EventBtn key={evt.id} event={evt} triggered={triggeredEvents.has(evt.id)} animating={animatingEventId === evt.id} onTrigger={() => triggerEvent(evt)} onRedo={() => redoEvent(evt.id)} />)}
          {(eventCategories || []).map(cat => {
            const catEvents = grouped.byCategory.get(cat.id) || []
            if (!catEvents.length) return null
            const collapsed = collapsedCategories.has(cat.id)
            return (
              <div key={cat.id} className="mt-2">
                <button onClick={() => setCollapsedCategories(prev => { const n = new Set(prev); collapsed ? n.delete(cat.id) : n.add(cat.id); return n })} className="flex items-center gap-1 w-full text-[8px] font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-300 py-1 px-1">
                  {collapsed ? <ChevronRight className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />}
                  <span style={{ color: cat.color }}>{cat.name}</span><span className="text-zinc-600 ml-auto">{catEvents.length}</span>
                </button>
                {!collapsed && catEvents.map(evt => <EventBtn key={evt.id} event={evt} triggered={triggeredEvents.has(evt.id)} animating={animatingEventId === evt.id} onTrigger={() => triggerEvent(evt)} onRedo={() => redoEvent(evt.id)} />)}
              </div>
            )
          })}
        </div>

        <div className="flex-1 flex items-center justify-center bg-[#111113] min-w-0 p-4">
          <div className="w-full relative overflow-hidden rounded-lg" style={{ maxWidth: 'min(56rem, calc((100vh - 6rem) * 16 / 9))', aspectRatio: '16/9', backgroundColor: canvas.backgroundColor }}>
            {layers.map(layer => {
              const state = layerStates[layer.id]
              if (!state || !state.visible) return null
              const src = state.src ?? layer.src
              if (!src && layer.type !== 'text' && layer.type !== 'shape') return null
              const style: React.CSSProperties = { position: 'absolute', left: `${state.x}%`, top: `${state.y}%`, width: `${state.width}%`, height: `${state.height}%`, opacity: state.opacity, transform: `rotate(${state.rotation}deg)`, transformOrigin: 'center', transition: 'all 0.6s ease-out', zIndex: layer.zIndex }
              if (layer.type === 'image') return <img key={layer.id} src={src!} alt="" className="pointer-events-none" style={{ ...style, objectFit: 'contain' }} />
              if (layer.type === 'video') return <video key={layer.id} src={src!} autoPlay loop muted playsInline className="pointer-events-none" style={{ ...style, objectFit: 'contain' }} />
              if (layer.type === 'text') return <div key={layer.id} style={{ ...style, color: layer.color || '#fff', fontSize: `${(layer.fontSize || 24) * 0.5}px` }}>{layer.text}</div>
              if (layer.type === 'shape') return <div key={layer.id} style={{ ...style, backgroundColor: layer.color || '#666' }} />
              return null
            })}
          </div>
        </div>

        <PushPanel layers={layers} pendingLayers={pendingLayers} onAddPendingLayer={l => setPendingLayers(prev => [...prev, l])} onRemovePendingLayer={id => setPendingLayers(prev => prev.filter(l => l.id !== id))} onPush={handlePush} onClear={() => setPendingLayers([])} />
      </div>

      {showEndConfirm && (
        <div className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-[#1e1f22] border border-[#3f4147] rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-sm font-semibold text-white mb-2">End this exercise?</h3>
            <p className="text-[11px] text-zinc-400 mb-4">All participants will see the exercise has ended. Session data will be saved for reporting.</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowEndConfirm(false)} className="px-3 py-1.5 text-[11px] font-medium rounded-lg bg-[#2b2d31] text-zinc-300 hover:bg-[#35363c] transition-colors">Cancel</button>
              <button onClick={handleEndExercise} className="px-3 py-1.5 text-[11px] font-medium rounded-lg bg-red-600 text-white hover:bg-red-500 transition-colors">End Exercise</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function EventBtn({ event, triggered, animating, onTrigger, onRedo }: { event: StudioEvent; triggered: boolean; animating: boolean; onTrigger: () => void; onRedo: () => void }) {
  return (
    <div className={`flex items-center gap-1 rounded-md px-2 py-1.5 text-[10px] mb-0.5 transition-all ${animating ? 'bg-amber-500/20 text-amber-300' : triggered ? 'bg-zinc-800/50 text-zinc-500' : 'bg-[#2b2d31] text-zinc-300 hover:bg-[#35363c]'}`}>
      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: event.color || '#6366f1' }} />
      <span className="flex-1 truncate">{event.name}</span>
      {event.actions.length > 0 && <span className="text-[8px] bg-zinc-700/50 text-zinc-500 px-1 rounded">{event.actions.length}</span>}
      {triggered && <button onClick={e => { e.stopPropagation(); onRedo() }} className="p-0.5 text-zinc-600 hover:text-amber-400 transition-colors"><RotateCcw className="w-2.5 h-2.5" /></button>}
      <button onClick={onTrigger} disabled={animating} className="p-0.5 text-zinc-600 hover:text-emerald-400 disabled:opacity-30 transition-colors"><Play className="w-2.5 h-2.5 fill-current" /></button>
    </div>
  )
}
