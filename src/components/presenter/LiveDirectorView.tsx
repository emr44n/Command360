'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import type { Slide, StudioContent, StudioLayer, StudioLayerState, StudioEvent } from '@/types/slide'
import type { RealtimeChannel } from '@supabase/supabase-js'
import {
  Play, RotateCcw, ChevronRight, ChevronDown, Square, Clock, Radio, Trash2,
  ImageIcon, VideoIcon, Upload, Loader2, Plus, Maximize2, ZoomIn, ZoomOut, Type,
  Volume2, GripVertical, Eye, EyeOff, Zap, Lock, Unlock, Shield, ShieldOff,
} from 'lucide-react'
import { playEvent, type EventPlaybackController } from '@/lib/studio/event-playback'
import { STUDIO_DEFAULT_BG } from '@/lib/studio/default-canvas'
import { PushPanel, type PushQueueItem } from '@/components/studio/PushPanel'
import { LiveScenesPanel } from '@/components/presenter/LiveScenesPanel'
import { StudioProperties } from '@/components/studio/StudioProperties'
import { generateLayerId } from '@/lib/utils/studio-utils'
import { QRCodeSVG } from 'qrcode.react'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

export interface ExerciseStats {
  duration: number; eventsTriggered: number; assetsAdded: number
  presenterName: string; sceneName: string; startTime: string; endTime: string
}

interface Props {
  slide: Slide
  session: { id: string; room_code: string }
  channelRef: React.RefObject<RealtimeChannel | null>
  presenterName: string
  onEndExercise: (stats: ExerciseStats) => void
  /** all studio scenes in the scenario (for the live-scene selector) */
  scenes?: { id: string; title: string }[]
  initialLiveSceneIds?: string[]
  /** switch which scene the presenter is driving (Phase 4) */
  onDriveScene?: (sceneId: string) => void
}

interface AssetItem { id: string; name: string; url: string; type: 'image' | 'video' | 'audio' }

/* ─── Upload helper ─── */
async function uploadAssetFile(file: File, onProgress?: (pct: number) => void): Promise<{ url: string; name: string }> {
  // Use fetch for reliability with Next.js API routes (cookies auto-sent)
  const fd = new FormData()
  fd.append('file', file)
  if (onProgress) onProgress(50) // Approximate progress since fetch doesn't support upload progress
  const res = await fetch('/api/studio/assets', { method: 'POST', body: fd })
  if (onProgress) onProgress(100)
  if (!res.ok) {
    const errText = await res.text().catch(() => 'Unknown error')
    throw new Error(`Upload failed (${res.status}): ${errText}`)
  }
  const data = await res.json()
  if (!data.url) throw new Error('Upload succeeded but no URL returned')
  return { url: data.url, name: data.name || file.name }
}

function buildInitialStates(layers: StudioLayer[]): Record<string, StudioLayerState> {
  const m: Record<string, StudioLayerState> = {}
  for (const l of layers) m[l.id] = { visible: l.visible, opacity: l.opacity, x: l.x, y: l.y, width: l.width, height: l.height, rotation: l.rotation, src: l.src, volume: l.volume }
  return m
}

/* ─── Shape presets ─── */
const SHAPE_PRESETS = [
  { name: 'Rectangle', w: 20, h: 12, color: '#4a5568' },
  { name: 'Circle', w: 15, h: 15, color: '#4a5568' },
  { name: 'Triangle', w: 15, h: 15, color: '#4a5568' },
  { name: 'Line', w: 30, h: 0.5, color: '#4a5568' },
  { name: 'Polygon', w: 15, h: 15, color: '#4a5568' },
]

export function LiveDirectorView({ slide, session, channelRef, presenterName, onEndExercise, scenes, initialLiveSceneIds, onDriveScene }: Props) {
  const [activeContent] = useState<StudioContent>(() => JSON.parse(JSON.stringify(slide.content)))
  const { canvas, layers: initialLayers, events, eventCategories } = activeContent

  // ─── Core state ───
  const [layers, setLayers] = useState(initialLayers)
  const [layerStates, setLayerStates] = useState(() => buildInitialStates(initialLayers))
  const [triggeredEvents, setTriggeredEvents] = useState<Set<string>>(new Set())
  const [animatingEventId, setAnimatingEventId] = useState<string | null>(null)
  const [sessionSeconds, setSessionSeconds] = useState(0)
  const [showEndConfirm, setShowEndConfirm] = useState(false)
  const [assetsAdded, setAssetsAdded] = useState(0)
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set())

  // ─── Canvas interaction ───
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [canvasZoom, setCanvasZoom] = useState(125)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [distortMode, setDistortMode] = useState<string | null>(null) // layer ID in distort mode
  const [polygonDrawing, setPolygonDrawing] = useState(false)
  const [polygonPoints, setPolygonPoints] = useState<{ x: number; y: number }[]>([])
  const [showYoutubeInput, setShowYoutubeInput] = useState(false)
  const [youtubeUrl, setYoutubeUrl] = useState('')

  // ─── Left panel ───
  const [leftTab, setLeftTab] = useState<'events' | 'assets' | 'layers'>('events')
  const [assetSub, setAssetSub] = useState<'images' | 'videos' | 'audio' | 'text' | 'shapes'>('images')
  const [images, setImages] = useState<AssetItem[]>([])
  const [videos, setVideos] = useState<AssetItem[]>([])
  const [audios, setAudios] = useState<AssetItem[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const audioInputRef = useRef<HTMLInputElement>(null)

  // ─── Right panel ───
  const [rightTab, setRightTab] = useState<'push' | 'details' | 'scenes'>('push')
  const [pushQueue, setPushQueue] = useState<PushQueueItem[]>([])
  const [globalTransition, setGlobalTransition] = useState<'fade' | 'instant'>('fade')

  // ─── Refs ───
  const eventControllerRef = useRef<EventPlaybackController | null>(null)
  const startTimeRef = useRef(new Date().toISOString())
  const canvasRef = useRef<HTMLDivElement>(null)
  const canvasWrapperRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ layerId: string; startMX: number; startMY: number; startX: number; startY: number } | null>(null)
  const resizeRef = useRef<{ layerId: string; handle: string; startMX: number; startMY: number; startX: number; startY: number; startW: number; startH: number } | null>(null)
  const lastBroadcastRef = useRef(0)
  const pendingBroadcastRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dragLayerIdxRef = useRef<number | null>(null)

  // ─── Extract assets from scene layers ───
  useEffect(() => {
    const seen = new Set<string>()
    const imgs: AssetItem[] = [], vids: AssetItem[] = [], auds: AssetItem[] = []
    for (const l of initialLayers) {
      if (l.src && !seen.has(l.src)) {
        seen.add(l.src)
        if (l.type === 'image') imgs.push({ id: l.id, name: l.name, url: l.src, type: 'image' })
        if (l.type === 'video') vids.push({ id: l.id, name: l.name, url: l.src, type: 'video' })
        if (l.type === 'audio') auds.push({ id: l.id, name: l.name, url: l.src, type: 'audio' })
      }
    }
    setImages(imgs); setVideos(vids); setAudios(auds)
  }, [initialLayers])

  useEffect(() => { const i = setInterval(() => setSessionSeconds(s => s + 1), 1000); return () => clearInterval(i) }, [])
  useEffect(() => { return () => { eventControllerRef.current?.cancel() } }, [])

  // Preload images
  useEffect(() => { for (const l of initialLayers) { if (l.src && l.type === 'image') { const i = new window.Image(); i.src = l.src } } }, [initialLayers])

  // Canvas zoom via Ctrl+wheel
  useEffect(() => {
    const el = canvasWrapperRef.current; if (!el) return
    const h = (e: WheelEvent) => { if (e.ctrlKey || e.metaKey) { e.preventDefault(); setCanvasZoom(p => Math.max(25, Math.min(200, p + (e.deltaY > 0 ? -10 : 10)))) } }
    el.addEventListener('wheel', h, { passive: false }); return () => el.removeEventListener('wheel', h)
  }, [])

  // Auto-show details when layer selected
  useEffect(() => { if (selectedLayerId) setRightTab('details'); }, [selectedLayerId])

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

  // ─── Throttled broadcast ───
  const broadcastLayerStates = useCallback((states: Record<string, Partial<StudioLayerState>>) => {
    const now = Date.now()
    const send = () => { channelRef.current?.send({ type: 'broadcast', event: 'STUDIO_LAYER_STATES_UPDATE', payload: { slide_id: slide.id, layerStates: states } }); lastBroadcastRef.current = Date.now() }
    if (pendingBroadcastRef.current) clearTimeout(pendingBroadcastRef.current)
    if (now - lastBroadcastRef.current >= 100) send(); else pendingBroadcastRef.current = setTimeout(send, 100 - (now - lastBroadcastRef.current))
  }, [slide.id, channelRef])

  // ─── Layer CRUD ───
  const deleteLayer = useCallback((layerId: string) => {
    setLayers(prev => prev.filter(l => l.id !== layerId))
    setLayerStates(prev => { const n = { ...prev }; delete n[layerId]; return n })
    setPushQueue(prev => prev.filter(q => q.layer.id !== layerId))
    setSelectedLayerId(null)
    channelRef.current?.send({ type: 'broadcast', event: 'STUDIO_LAYER_REMOVED', payload: { slide_id: slide.id, layerId } })
  }, [slide.id, channelRef])

  const updateLayer = useCallback((id: string, updates: Partial<StudioLayer>) => {
    setLayers(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l))
    // Also update layerStates for visual properties
    const stateUpdates: Partial<StudioLayerState> = {}
    if (updates.x !== undefined) stateUpdates.x = updates.x
    if (updates.y !== undefined) stateUpdates.y = updates.y
    if (updates.width !== undefined) stateUpdates.width = updates.width
    if (updates.height !== undefined) stateUpdates.height = updates.height
    if (updates.rotation !== undefined) stateUpdates.rotation = updates.rotation
    if (updates.opacity !== undefined) stateUpdates.opacity = updates.opacity
    if (updates.visible !== undefined) stateUpdates.visible = updates.visible
    if (updates.src !== undefined) stateUpdates.src = updates.src
    if (updates.volume !== undefined) stateUpdates.volume = updates.volume
    if (Object.keys(stateUpdates).length > 0) {
      setLayerStates(prev => ({ ...prev, [id]: { ...prev[id], ...stateUpdates } }))
    }
  }, [])

  const duplicateLayer = useCallback((id: string) => {
    const layer = layers.find(l => l.id === id)
    if (!layer) return
    const newLayer = { ...layer, id: generateLayerId(), name: `${layer.name} copy`, x: layer.x + 2, y: layer.y + 2, zIndex: layers.length }
    setLayers(prev => [...prev, newLayer])
    setLayerStates(prev => ({ ...prev, [newLayer.id]: { visible: newLayer.visible, opacity: newLayer.opacity, x: newLayer.x, y: newLayer.y, width: newLayer.width, height: newLayer.height, rotation: newLayer.rotation, src: newLayer.src, volume: newLayer.volume } }))
    setSelectedLayerId(newLayer.id)
  }, [layers])

  // Keyboard Delete
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedLayerId) {
        if ((e.target as HTMLElement)?.tagName === 'INPUT' || (e.target as HTMLElement)?.tagName === 'TEXTAREA') return
        e.preventDefault(); setConfirmDeleteId(selectedLayerId)
      }
    }
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h)
  }, [selectedLayerId, deleteLayer])

  // ─── Event triggering (auto-push) ───
  const triggerEvent = useCallback((event: StudioEvent) => {
    eventControllerRef.current?.cancel()
    setAnimatingEventId(event.id)
    const controller = playEvent(event, layers, (overrides) => {
      setLayerStates(prev => { const next = { ...prev }; for (const [lid, props] of Object.entries(overrides)) { if (next[lid]) next[lid] = { ...next[lid], ...props } }; return next })
    }, () => {
      setAnimatingEventId(null)
      setTriggeredEvents(prev => new Set(prev).add(event.id))
      channelRef.current?.send({ type: 'broadcast', event: 'STUDIO_EVENT_TRIGGERED', payload: { slide_id: slide.id, event_id: event.id, layerStates } })
    })
    eventControllerRef.current = controller
  }, [layers, layerStates, slide.id, channelRef])

  const redoEvent = useCallback((eventId: string) => { setTriggeredEvents(prev => { const n = new Set(prev); n.delete(eventId); return n }) }, [])

  // ─── Broadcast a single layer live (used by auto-push on drop + manual push) ───
  const broadcastLayerAdded = useCallback((layer: StudioLayer, state: StudioLayerState, transition: 'fade' | 'instant') => {
    const layerToSend = { ...layer, ...state }
    channelRef.current?.send({ type: 'broadcast', event: 'STUDIO_LAYER_ADDED', payload: { slide_id: slide.id, layer: layerToSend } })
    if (transition === 'fade') {
      channelRef.current?.send({ type: 'broadcast', event: 'STUDIO_LAYER_STATES_UPDATE', payload: { slide_id: slide.id, layerStates: { [layerToSend.id]: { opacity: 0 } } } })
      setTimeout(() => { channelRef.current?.send({ type: 'broadcast', event: 'STUDIO_LAYER_STATES_UPDATE', payload: { slide_id: slide.id, layerStates: { [layerToSend.id]: { opacity: state.opacity } } } }) }, 50)
    }
  }, [slide.id, channelRef])

  // ─── Add layer to canvas — goes LIVE on drop (dynamic), no separate push step ───
  const addLayerToCanvasAndQueue = useCallback((layer: StudioLayer) => {
    const state: StudioLayerState = { visible: layer.visible, opacity: layer.opacity, x: layer.x, y: layer.y, width: layer.width, height: layer.height, rotation: layer.rotation, src: layer.src, volume: layer.volume }
    setLayers(prev => [...prev, layer])
    setLayerStates(prev => ({ ...prev, [layer.id]: state }))
    setSelectedLayerId(layer.id)
    // auto-push so the dropped asset reaches participants immediately
    broadcastLayerAdded(layer, state, globalTransition)
    setAssetsAdded(prev => prev + 1)
  }, [broadcastLayerAdded, globalTransition])

  // ─── Push handlers ───
  const pushItem = useCallback((layerId: string) => {
    const qItem = pushQueue.find(q => q.layer.id === layerId)
    if (!qItem) return
    const state = layerStates[qItem.layer.id]
    const currentLayer = layers.find(l => l.id === qItem.layer.id)
    if (!currentLayer || !state) return
    const layerToSend = { ...currentLayer, ...state }
    channelRef.current?.send({ type: 'broadcast', event: 'STUDIO_LAYER_ADDED', payload: { slide_id: slide.id, layer: layerToSend } })
    if (qItem.transition === 'fade') {
      // Send with 0 opacity then fade in
      channelRef.current?.send({ type: 'broadcast', event: 'STUDIO_LAYER_STATES_UPDATE', payload: { slide_id: slide.id, layerStates: { [layerToSend.id]: { opacity: 0 } } } })
      setTimeout(() => { channelRef.current?.send({ type: 'broadcast', event: 'STUDIO_LAYER_STATES_UPDATE', payload: { slide_id: slide.id, layerStates: { [layerToSend.id]: { opacity: state.opacity } } } }) }, 50)
    }
    setPushQueue(prev => prev.filter(q => q.layer.id !== layerId))
    setAssetsAdded(prev => prev + 1)
  }, [pushQueue, layerStates, layers, slide.id, channelRef])

  const pushAll = useCallback(() => {
    for (const qItem of pushQueue) pushItem(qItem.layer.id)
  }, [pushQueue, pushItem])

  const removeFromQueue = useCallback((layerId: string) => {
    setPushQueue(prev => prev.filter(q => q.layer.id !== layerId))
    // Also remove from canvas
    setLayers(prev => prev.filter(l => l.id !== layerId))
    setLayerStates(prev => { const n = { ...prev }; delete n[layerId]; return n })
    if (selectedLayerId === layerId) setSelectedLayerId(null)
  }, [selectedLayerId])

  const updateQueueTransition = useCallback((layerId: string, transition: 'fade' | 'instant') => {
    setPushQueue(prev => prev.map(q => q.layer.id === layerId ? { ...q, transition } : q))
  }, [])

  // ─── End exercise ───
  const handleEndExercise = useCallback(async () => {
    eventControllerRef.current?.cancel()
    const endTime = new Date().toISOString()
    channelRef.current?.send({ type: 'broadcast', event: 'STUDIO_EXERCISE_ENDED', payload: { slide_id: slide.id, duration: sessionSeconds, eventsTriggered: triggeredEvents.size } })
    try { await fetch('/api/studio/exercise', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ session_id: session.id, duration: sessionSeconds, events_triggered: triggeredEvents.size, assets_added: assetsAdded, presenter_name: presenterName, scene_name: slide.title || 'Untitled Scene', start_time: startTimeRef.current, end_time: endTime }) }) } catch { /* silent */ }
    onEndExercise({ duration: sessionSeconds, eventsTriggered: triggeredEvents.size, assetsAdded, presenterName, sceneName: slide.title || 'Untitled Scene', startTime: startTimeRef.current, endTime })
  }, [sessionSeconds, triggeredEvents, assetsAdded, presenterName, slide, session, channelRef, onEndExercise])

  // ─── Canvas mouse: move ───
  // Use ref for layerStates to avoid stale closures during drag
  const layerStatesRef = useRef(layerStates)
  layerStatesRef.current = layerStates
  const layersRef = useRef(layers)
  layersRef.current = layers

  // ─── Sync heartbeat ───
  // Re-broadcast the full live scene every 2s so participants who join (or
  // re-mount) mid-exercise catch up to the current layers + states, rather
  // than being stuck on the scene's initial content.
  useEffect(() => {
    const send = () => channelRef.current?.send({
      type: 'broadcast', event: 'STUDIO_SYNC_STATE',
      payload: { slide_id: slide.id, layers: layersRef.current, layerStates: layerStatesRef.current },
    })
    const i = setInterval(send, 2000)
    return () => clearInterval(i)
  }, [slide.id, channelRef])

  const handleLayerMouseDown = useCallback((e: React.MouseEvent, layerId: string) => {
    e.stopPropagation(); e.preventDefault()
    const state = layerStatesRef.current[layerId]; if (!state) return
    dragRef.current = { layerId, startMX: e.clientX, startMY: e.clientY, startX: state.x, startY: state.y }
    // Set selection AFTER capturing drag start state
    setSelectedLayerId(layerId)
    const move = (ev: MouseEvent) => {
      if (!dragRef.current || !canvasRef.current) return
      const r = canvasRef.current.getBoundingClientRect()
      const dx = ((ev.clientX - dragRef.current.startMX) / r.width) * 100
      const dy = ((ev.clientY - dragRef.current.startMY) / r.height) * 100
      const newX = dragRef.current.startX + dx, newY = dragRef.current.startY + dy
      setLayerStates(prev => ({ ...prev, [dragRef.current!.layerId]: { ...prev[dragRef.current!.layerId], x: newX, y: newY } }))
      broadcastLayerStates({ [dragRef.current.layerId]: { x: newX, y: newY } })
    }
    const up = () => {
      dragRef.current = null
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseup', up)
      if (pendingBroadcastRef.current) { clearTimeout(pendingBroadcastRef.current); pendingBroadcastRef.current = null }
    }
    window.addEventListener('mousemove', move); window.addEventListener('mouseup', up)
  }, [broadcastLayerStates])

  // ─── Canvas mouse: resize ───
  const handleResizeMouseDown = useCallback((e: React.MouseEvent, layerId: string, handle: string) => {
    e.stopPropagation(); e.preventDefault()
    const state = layerStates[layerId]; if (!state) return
    resizeRef.current = { layerId, handle, startMX: e.clientX, startMY: e.clientY, startX: state.x, startY: state.y, startW: state.width, startH: state.height }
    const move = (ev: MouseEvent) => {
      if (!resizeRef.current || !canvasRef.current) return
      const r = canvasRef.current.getBoundingClientRect()
      const dx = ((ev.clientX - resizeRef.current.startMX) / r.width) * 100
      const dy = ((ev.clientY - resizeRef.current.startMY) / r.height) * 100
      const s = resizeRef.current; let { startX: x, startY: y, startW: w, startH: h } = s
      if (s.handle.includes('r')) w = Math.max(3, s.startW + dx)
      if (s.handle.includes('l')) { w = Math.max(3, s.startW - dx); x = s.startX + dx }
      if (s.handle.includes('b')) h = Math.max(3, s.startH + dy)
      if (s.handle.includes('t')) { h = Math.max(3, s.startH - dy); y = s.startY + dy }
      setLayerStates(prev => ({ ...prev, [s.layerId]: { ...prev[s.layerId], x, y, width: w, height: h } }))
      broadcastLayerStates({ [s.layerId]: { x, y, width: w, height: h } })
    }
    const up = () => { resizeRef.current = null; window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); if (pendingBroadcastRef.current) { clearTimeout(pendingBroadcastRef.current); pendingBroadcastRef.current = null }; broadcastLayerStates(layerStates) }
    window.addEventListener('mousemove', move); window.addEventListener('mouseup', up)
  }, [layerStates, broadcastLayerStates])

  // ─── Drop handler (adds to canvas + queue, NOT broadcast) ───
  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; setIsDragOver(true) }, [])
  const handleDragLeave = useCallback(() => setIsDragOver(false), [])
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragOver(false)
    const type = e.dataTransfer.getData('studio/asset-type') as StudioLayer['type']
    const src = e.dataTransfer.getData('studio/asset-src')
    const name = e.dataTransfer.getData('studio/asset-name') || 'Dropped Asset'
    if (!type || !canvasRef.current) return
    const r = canvasRef.current.getBoundingClientRect()
    const xPct = ((e.clientX - r.left) / r.width) * 100
    const yPct = ((e.clientY - r.top) / r.height) * 100
    const layer: StudioLayer = {
      id: generateLayerId(), name, type, src: src || undefined,
      x: Math.max(0, xPct - 15), y: Math.max(0, yPct - 15),
      width: type === 'video' ? 40 : type === 'audio' ? 0 : type === 'text' ? 20 : 15,
      height: type === 'video' ? 22.5 : type === 'audio' ? 0 : type === 'text' ? 10 : 15,
      rotation: 0, zIndex: layers.length + 1, opacity: 1,
      blendMode: 'normal', visible: true, locked: false,
      ...(type === 'video' ? { loop: true, autoplay: true, muted: true } : {}),
      ...(type === 'text' ? { text: 'Text', fontSize: 24, color: '#ffffff' } : {}),
      ...(type === 'shape' ? { color: '#4a5568' } : {}),
      ...(type === 'audio' ? { volume: 1, audioLoop: false } : {}),
    }
    addLayerToCanvasAndQueue(layer)
  }, [layers, addLayerToCanvasAndQueue])

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target !== canvasRef.current) return
    // Polygon drawing mode: add point on canvas click
    if (polygonDrawing && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      const xPct = ((e.clientX - rect.left) / rect.width) * 100
      const yPct = ((e.clientY - rect.top) / rect.height) * 100
      // Check if clicking near the first point to close
      if (polygonPoints.length >= 3) {
        const first = polygonPoints[0]
        const dist = Math.sqrt((xPct - first.x) ** 2 + (yPct - first.y) ** 2)
        if (dist < 3) {
          // Close polygon — create shape layer
          const minX = Math.min(...polygonPoints.map(p => p.x))
          const minY = Math.min(...polygonPoints.map(p => p.y))
          const maxX = Math.max(...polygonPoints.map(p => p.x))
          const maxY = Math.max(...polygonPoints.map(p => p.y))
          const layer: StudioLayer = {
            id: generateLayerId(), name: 'Polygon', type: 'shape',
            x: minX, y: minY, width: maxX - minX, height: maxY - minY,
            rotation: 0, zIndex: layers.length + 1, opacity: 1,
            blendMode: 'normal', visible: true, locked: false, color: '#4a5568',
            polygonPoints: polygonPoints.map(p => ({ x: ((p.x - minX) / (maxX - minX)) * 100, y: ((p.y - minY) / (maxY - minY)) * 100 })),
          }
          addLayerToCanvasAndQueue(layer)
          setPolygonDrawing(false); setPolygonPoints([])
          return
        }
      }
      setPolygonPoints(prev => [...prev, { x: xPct, y: yPct }])
      return
    }
    setSelectedLayerId(null); setRightTab('push'); setDistortMode(null)
  }, [polygonDrawing, polygonPoints, layers, addLayerToCanvasAndQueue])
  const toggleFullscreen = useCallback(() => { if (document.fullscreenElement) document.exitFullscreen(); else canvasWrapperRef.current?.requestFullscreen() }, [])

  // ─── Asset handlers ───
  const doUpload = useCallback(async (files: FileList, type: 'image' | 'video' | 'audio', setter: React.Dispatch<React.SetStateAction<AssetItem[]>>) => {
    setUploading(true); setUploadProgress(0); setUploadError(null)
    for (const file of Array.from(files)) {
      try {
        const { url, name } = await uploadAssetFile(file, p => setUploadProgress(p))
        if (url) setter(prev => [...prev, { id: generateLayerId(), name, url, type }])
        else throw new Error('No URL returned')
      } catch (err) {
        console.error('Upload attempt 1 failed:', err)
        try {
          const { url, name } = await uploadAssetFile(file, p => setUploadProgress(p))
          if (url) setter(prev => [...prev, { id: generateLayerId(), name, url, type }])
          else throw new Error('No URL returned')
        } catch (err2) {
          console.error('Upload attempt 2 failed:', err2)
          setUploadError(`Failed to upload "${file.name}". ${err2 instanceof Error ? err2.message : 'Check connection.'}`)
        }
      }
    }
    setUploading(false); setUploadProgress(0)
  }, [])

  const handleAssetDragStart = useCallback((e: React.DragEvent<HTMLElement>, asset: AssetItem) => {
    e.dataTransfer.setData('studio/asset-type', asset.type); e.dataTransfer.setData('studio/asset-src', asset.url); e.dataTransfer.setData('studio/asset-name', asset.name); e.dataTransfer.effectAllowed = 'copy'
  }, [])

  const addAssetToCanvas = useCallback((asset: AssetItem) => {
    const off = nextOffset()
    const layer: StudioLayer = {
      id: generateLayerId(), name: asset.name, type: asset.type, src: asset.url,
      x: off.x, y: off.y, width: asset.type === 'video' ? 40 : asset.type === 'audio' ? 0 : 30, height: asset.type === 'video' ? 22.5 : asset.type === 'audio' ? 0 : 30,
      rotation: 0, zIndex: layers.length + 1, opacity: 1, blendMode: 'normal', visible: true, locked: false,
      ...(asset.type === 'video' ? { loop: true, autoplay: true, muted: true } : {}),
      ...(asset.type === 'audio' ? { volume: 1, audioLoop: false } : {}),
    }
    addLayerToCanvasAndQueue(layer)
  }, [layers, addLayerToCanvasAndQueue])

  // Offset so new layers don't stack
  const nextOffset = useCallback(() => {
    const count = layers.length
    return { x: 10 + (count % 8) * 3, y: 10 + (count % 8) * 3 }
  }, [layers.length])

  const addTextLayer = useCallback(() => {
    const off = nextOffset()
    const layer: StudioLayer = {
      id: generateLayerId(), name: 'Text', type: 'text', x: off.x, y: off.y, width: 20, height: 10,
      rotation: 0, zIndex: layers.length + 1, opacity: 1, blendMode: 'normal', visible: true, locked: false,
      text: 'Text', fontSize: 24, color: '#ffffff',
    }
    addLayerToCanvasAndQueue(layer)
  }, [layers, addLayerToCanvasAndQueue])

  const addShapeLayer = useCallback((preset: typeof SHAPE_PRESETS[0]) => {
    const off = nextOffset()
    const layer: StudioLayer = {
      id: generateLayerId(), name: preset.name, type: 'shape', x: off.x, y: off.y, width: preset.w, height: preset.h,
      rotation: 0, zIndex: layers.length + 1, opacity: 1, blendMode: 'normal', visible: true, locked: false,
      color: preset.color,
    }
    addLayerToCanvasAndQueue(layer)
  }, [layers, addLayerToCanvasAndQueue])

  // ─── Layer reorder (visual indices — 0 = top of list = highest zIndex) ───
  const reorderLayers = useCallback((fromVisual: number, toVisual: number) => {
    setLayers(prev => {
      // Work on a reversed copy (visual order: index 0 = top layer)
      const visual = [...prev].reverse()
      const [moved] = visual.splice(fromVisual, 1)
      visual.splice(toVisual, 0, moved)
      // Reverse back and assign zIndex (0 = bottom, length-1 = top)
      const result = visual.reverse()
      return result.map((l, i) => ({ ...l, zIndex: i }))
    })
    setLayerStates(prev => ({ ...prev }))
  }, [])

  // ─── YouTube helper ───
  const extractYoutubeId = useCallback((url: string): string | null => {
    const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
    return m ? m[1] : null
  }, [])

  const addYoutubeVideo = useCallback(() => {
    const id = extractYoutubeId(youtubeUrl)
    if (!id) return
    const thumb = `https://img.youtube.com/vi/${id}/hqdefault.jpg`
    const off = nextOffset()
    const layer: StudioLayer = {
      id: generateLayerId(), name: `YouTube: ${id}`, type: 'video',
      youtubeUrl: `https://www.youtube.com/embed/${id}?autoplay=1&mute=1`,
      src: thumb, x: off.x, y: off.y, width: 40, height: 22.5,
      rotation: 0, zIndex: layers.length + 1, opacity: 1,
      blendMode: 'normal', visible: true, locked: false,
      loop: false, autoplay: true, muted: true,
    }
    // Add to videos gallery
    setVideos(prev => [...prev, { id: layer.id, name: layer.name, url: thumb, type: 'video' }])
    addLayerToCanvasAndQueue(layer)
    setYoutubeUrl('')
    setShowYoutubeInput(false)
  }, [youtubeUrl, layers, nextOffset, extractYoutubeId, addLayerToCanvasAndQueue])

  // ─── Distort mode ───
  const handleDistortPointDrag = useCallback((layerId: string, corner: 'tl' | 'tr' | 'bl' | 'br', dx: number, dy: number) => {
    setLayers(prev => prev.map(l => {
      if (l.id !== layerId) return l
      const pts = l.distortPoints || { tl: { x: 0, y: 0 }, tr: { x: 100, y: 0 }, bl: { x: 0, y: 100 }, br: { x: 100, y: 100 } }
      return { ...l, distortPoints: { ...pts, [corner]: { x: pts[corner].x + dx, y: pts[corner].y + dy } } }
    }))
  }, [])

  // Escape exits distort mode
  useEffect(() => {
    if (!distortMode) return
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') setDistortMode(null) }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [distortMode])

  // ─── Mask clip computation ───
  // Mask computation: creates SVG clipPath IDs for inverted masking
  // CSS clip-path: polygon() doesn't support evenodd fill rule
  // Instead we generate SVG <clipPath> elements with clip-rule="evenodd" and reference them via url()
  const maskSvgDefs = useMemo(() => {
    const defs: { id: string; path: string; innerPath: string; feather: number }[] = []
    const assignments: Record<string, string> = {}
    const sortedLayers = [...layers].sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0))

    for (let i = 0; i < sortedLayers.length; i++) {
      const ml = sortedLayers[i]
      if (ml.type !== 'shape' || !ml.maskMode || ml.maskMode === 'none') continue
      const ms = layerStates[ml.id]
      if (!ms) continue

      // Build SVG path: outer rect (clockwise) + inner shape (counterclockwise) = hole with evenodd
      const mx = ms.x / 100, my = ms.y / 100, mw = ms.width / 100, mh = ms.height / 100
      let innerPath = ''

      if (ml.name === 'Circle') {
        // SVG ellipse approximation using 4 arcs
        const cx = mx + mw / 2, cy = my + mh / 2, rx = mw / 2, ry = mh / 2
        innerPath = `M${cx + rx},${cy} A${rx},${ry} 0 1,0 ${cx - rx},${cy} A${rx},${ry} 0 1,0 ${cx + rx},${cy}Z`
      } else if (ml.name === 'Triangle') {
        innerPath = `M${mx + mw / 2},${my} L${mx + mw},${my + mh} L${mx},${my + mh}Z`
      } else {
        innerPath = `M${mx},${my} L${mx + mw},${my} L${mx + mw},${my + mh} L${mx},${my + mh}Z`
      }

      // Apply to layers below — convert mask coords to each target's local space
      const targets = ml.maskMode === 'mask'
        ? [sortedLayers.slice(i + 1).find(t => t.type !== 'shape' || !t.maskMode || t.maskMode === 'none')].filter(Boolean)
        : sortedLayers.slice(i + 1).filter(t => t.type !== 'shape' || !t.maskMode || t.maskMode === 'none')

      for (const target of targets) {
        if (!target || target.maskImmune) continue
        const ts = layerStates[target.id]
        if (!ts) continue
        // Convert mask position from canvas space to target's local bounding box space
        const tx = ts.x / 100, ty = ts.y / 100, tw = ts.width / 100, th = ts.height / 100
        const localMx = (mx - tx) / tw, localMy = (my - ty) / th
        const localMw = mw / tw, localMh = mh / th

        let localInnerPath = ''
        if (ml.name === 'Circle') {
          const lcx = localMx + localMw / 2, lcy = localMy + localMh / 2, lrx = localMw / 2, lry = localMh / 2
          localInnerPath = `M${lcx + lrx},${lcy} A${lrx},${lry} 0 1,0 ${lcx - lrx},${lcy} A${lrx},${lry} 0 1,0 ${lcx + lrx},${lcy}Z`
        } else if (ml.name === 'Triangle') {
          localInnerPath = `M${localMx + localMw / 2},${localMy} L${localMx + localMw},${localMy + localMh} L${localMx},${localMy + localMh}Z`
        } else {
          localInnerPath = `M${localMx},${localMy} L${localMx + localMw},${localMy} L${localMx + localMw},${localMy + localMh} L${localMx},${localMy + localMh}Z`
        }
        const targetClipId = `mask-clip-${ml.id}-${target.id}`
        const targetPath = `M0,0 L1,0 L1,1 L0,1Z ${localInnerPath}`
        defs.push({ id: targetClipId, path: targetPath, innerPath: localInnerPath, feather: ml.feather || 0 })
        assignments[target.id] = `url(#${targetClipId})`
      }
    }
    return { defs, assignments }
  }, [layers, layerStates])

  const maskClips = maskSvgDefs.assignments

  const grouped = useMemo(() => {
    const uncategorized: StudioEvent[] = [], byCategory = new Map<string, StudioEvent[]>()
    for (const evt of events) { if (evt.categoryId) { const l = byCategory.get(evt.categoryId) || []; l.push(evt); byCategory.set(evt.categoryId, l) } else uncategorized.push(evt) }
    return { uncategorized, byCategory }
  }, [events])

  const selectedLayer = layers.find(l => l.id === selectedLayerId) || null
  const joinUrl = typeof window !== 'undefined' ? `${window.location.origin}/join/${session.room_code}` : ''

  /* ═══════════════════════ RENDER ═══════════════════════ */
  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#0a0a0b]" style={{ border: '3px solid #C9241A' }}>
      {/* ─── Top Bar ─── */}
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
          <button onClick={() => setShowEndConfirm(true)} className="px-3 py-1 rounded-none bg-[#C9241A] hover:bg-[#a81d15] text-white text-[11px] font-medium transition-colors flex items-center gap-1.5"><Square className="w-3 h-3" /> End Exercise</button>
        </div>
      </div>

      <div className="flex-1 flex min-h-0">
        {/* ═══ LEFT PANEL ═══ */}
        <div className="w-60 shrink-0 bg-[#1e1f22] border-r border-[#2b2d31] flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-[#2b2d31] shrink-0">
            {(['events', 'assets', 'layers'] as const).map(t => (
              <button key={t} onClick={() => setLeftTab(t)} className={`flex-1 py-2 text-[8px] font-bold uppercase tracking-wider transition-colors ${leftTab === t ? 'text-red-400 border-b-2 border-red-500 bg-red-500/5' : 'text-zinc-500 hover:text-zinc-300'}`}>{t}</button>
            ))}
          </div>

          {/* ── EVENTS TAB ── */}
          {leftTab === 'events' && (
            <div className="flex-1 overflow-y-auto p-2">
              {events.length === 0 && <p className="text-[10px] text-zinc-600 text-center py-4">No events defined</p>}
              {grouped.uncategorized.map(evt => <EventBtn key={evt.id} event={evt} triggered={triggeredEvents.has(evt.id)} animating={animatingEventId === evt.id} onTrigger={() => triggerEvent(evt)} onRedo={() => redoEvent(evt.id)} />)}
              {(eventCategories || []).map(cat => {
                const catEvts = grouped.byCategory.get(cat.id) || []; if (!catEvts.length) return null
                const collapsed = collapsedCategories.has(cat.id)
                return (<div key={cat.id} className="mt-2">
                  <button onClick={() => setCollapsedCategories(prev => { const n = new Set(prev); collapsed ? n.delete(cat.id) : n.add(cat.id); return n })} className="flex items-center gap-1 w-full text-[8px] font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-300 py-1 px-1">
                    {collapsed ? <ChevronRight className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />}
                    <span style={{ color: cat.color }}>{cat.name}</span><span className="text-zinc-600 ml-auto">{catEvts.length}</span>
                  </button>
                  {!collapsed && catEvts.map(evt => <EventBtn key={evt.id} event={evt} triggered={triggeredEvents.has(evt.id)} animating={animatingEventId === evt.id} onTrigger={() => triggerEvent(evt)} onRedo={() => redoEvent(evt.id)} />)}
                </div>)
              })}
            </div>
          )}

          {/* ── ASSETS TAB ── */}
          {leftTab === 'assets' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Sub-tabs — icons, evenly spaced */}
              <div className="flex border-b border-[#2b2d31] shrink-0">
                {([
                  { key: 'images' as const, icon: <ImageIcon className="w-4 h-4" />, label: 'Images' },
                  { key: 'videos' as const, icon: <VideoIcon className="w-4 h-4" />, label: 'Videos' },
                  { key: 'audio' as const, icon: <Volume2 className="w-4 h-4" />, label: 'Audio' },
                  { key: 'text' as const, icon: <Type className="w-4 h-4" />, label: 'Text' },
                  { key: 'shapes' as const, icon: <Square className="w-4 h-4" />, label: 'Shapes' },
                ]).map(t => (
                  <Tooltip key={t.key}><TooltipTrigger asChild>
                    <button onClick={() => setAssetSub(t.key)} className={`flex-1 flex items-center justify-center py-2 transition-colors ${assetSub === t.key ? 'text-white bg-[#2b2d31]' : 'text-zinc-500 hover:text-zinc-300'}`}>{t.icon}</button>
                  </TooltipTrigger><TooltipContent>{t.label}</TooltipContent></Tooltip>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto p-2">
                {/* IMAGES */}
                {assetSub === 'images' && (<>
                  <input ref={imageInputRef} type="file" accept="image/*" multiple className="hidden" onChange={e => { if (e.target.files) doUpload(e.target.files, 'image', setImages); e.target.value = '' }} />
                  <button onClick={() => imageInputRef.current?.click()} disabled={uploading} className="w-full flex items-center justify-center gap-1 py-1.5 text-[9px] font-medium rounded-none border border-dashed border-zinc-600 bg-[#2b2d31] text-zinc-300 hover:bg-[#35363c] disabled:opacity-50 transition-colors mb-2">
                    {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />} {uploading ? `${uploadProgress}%` : 'Upload Image'}
                  </button>
                  {uploading && <div className="h-0.5 w-full rounded-none bg-zinc-800 overflow-hidden mb-2"><div className="h-0.5 bg-[#C9241A] rounded-none transition-all" style={{ width: `${uploadProgress}%` }} /></div>}
                  {uploadError && <p className="text-[8px] text-red-400 mb-2">{uploadError}</p>}
                  {images.length === 0 ? <p className="text-[9px] text-zinc-600 text-center py-4">No images yet</p> : (
                    <div className="grid grid-cols-2 gap-1">{images.map(a => <AssetThumb key={a.id} asset={a} onDragStart={handleAssetDragStart} onClick={() => addAssetToCanvas(a)} />)}</div>
                  )}
                </>)}

                {/* VIDEOS */}
                {assetSub === 'videos' && (<>
                  <input ref={videoInputRef} type="file" accept="video/mp4,video/webm" multiple className="hidden" onChange={e => { if (e.target.files) doUpload(e.target.files, 'video', setVideos); e.target.value = '' }} />
                  <div className="flex gap-1 mb-2">
                    <button onClick={() => videoInputRef.current?.click()} disabled={uploading} className="flex-1 flex items-center justify-center gap-1 py-1.5 text-[9px] font-medium rounded-none border border-dashed border-zinc-600 bg-[#2b2d31] text-zinc-300 hover:bg-[#35363c] disabled:opacity-50 transition-colors">
                      {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />} {uploading ? `${uploadProgress}%` : 'Upload'}
                    </button>
                    <button onClick={() => setShowYoutubeInput(v => !v)} className={`flex items-center justify-center gap-1 px-2 py-1.5 text-[9px] font-medium rounded-none border transition-colors ${showYoutubeInput ? 'border-red-500 bg-red-500/10 text-red-400' : 'border-dashed border-zinc-600 bg-[#2b2d31] text-zinc-300 hover:bg-[#35363c]'}`}>
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 00.5 6.2 31.5 31.5 0 000 12a31.5 31.5 0 00.5 5.8 3 3 0 002.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 002.1-2.1A31.5 31.5 0 0024 12a31.5 31.5 0 00-.5-5.8zM9.5 15.6V8.4l6.3 3.6-6.3 3.6z"/></svg>
                      YT
                    </button>
                  </div>
                  {/* YouTube URL input */}
                  {showYoutubeInput && (
                    <div className="mb-2 animate-in slide-in-from-top-1 duration-200">
                      <div className="flex gap-1">
                        <input type="text" value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') addYoutubeVideo() }} placeholder="Paste YouTube URL..." className="flex-1 h-7 px-2 text-[9px] rounded-none border border-zinc-600 bg-[#1e1f22] text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-red-500" />
                        <button onClick={addYoutubeVideo} disabled={!extractYoutubeId(youtubeUrl)} className="h-7 px-2 text-[8px] font-bold rounded-none bg-[#C9241A] hover:bg-[#a81d15] disabled:opacity-30 text-white transition-colors">Add</button>
                      </div>
                    </div>
                  )}
                  {videos.length === 0 ? <p className="text-[9px] text-zinc-600 text-center py-4">No videos yet</p> : (
                    <div className="grid grid-cols-2 gap-1">{videos.map(a => (
                      <div key={a.id} className="relative">
                        <AssetThumb asset={a} onDragStart={handleAssetDragStart} onClick={() => addAssetToCanvas(a)} />
                        {/* YouTube overlay icon */}
                        {a.url.includes('img.youtube.com') && (
                          <div className="absolute top-1 left-1 bg-[#C9241A] rounded-none px-1 py-0.5 text-[6px] font-bold text-white pointer-events-none">YT</div>
                        )}
                      </div>
                    ))}</div>
                  )}
                </>)}

                {/* AUDIO */}
                {assetSub === 'audio' && (<>
                  <input ref={audioInputRef} type="file" accept="audio/*" multiple className="hidden" onChange={e => { if (e.target.files) doUpload(e.target.files, 'audio', setAudios); e.target.value = '' }} />
                  <button onClick={() => audioInputRef.current?.click()} disabled={uploading} className="w-full flex items-center justify-center gap-1 py-1.5 text-[9px] font-medium rounded-none border border-dashed border-zinc-600 bg-[#2b2d31] text-zinc-300 hover:bg-[#35363c] disabled:opacity-50 transition-colors mb-2">
                    {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />} {uploading ? `${uploadProgress}%` : 'Upload Audio'}
                  </button>
                  {audios.length === 0 ? <p className="text-[9px] text-zinc-600 text-center py-4">No audio yet</p> : (
                    <div className="space-y-0.5">{audios.map(a => (
                      <div key={a.id} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[#35363c] cursor-pointer transition-colors" onClick={() => addAssetToCanvas(a)} draggable onDragStart={e => handleAssetDragStart(e, a)}>
                        <Volume2 className="w-3 h-3 text-[#2E9E63] shrink-0" /><span className="text-[9px] text-zinc-300 truncate flex-1">{a.name}</span><Plus className="w-3 h-3 text-zinc-600" />
                      </div>
                    ))}</div>
                  )}
                </>)}

                {/* TEXT */}
                {assetSub === 'text' && (
                  <div>
                    <button onClick={addTextLayer} className="w-full flex items-center justify-center gap-1.5 py-2.5 text-[10px] font-medium rounded-none border border-dashed border-zinc-600 bg-[#2b2d31] text-zinc-300 hover:bg-[#35363c] transition-colors">
                      <Plus className="w-3.5 h-3.5" /> Add Text
                    </button>
                    {/* List of text layers */}
                    {layers.filter(l => l.type === 'text').length > 0 && (
                      <div className="mt-2 space-y-0.5">
                        <p className="text-[7px] text-zinc-600 uppercase tracking-wider px-1 mb-1">Text Layers</p>
                        {layers.filter(l => l.type === 'text').map(l => (
                          <div key={l.id} className={`flex items-center gap-1.5 px-2 py-1 rounded-none cursor-pointer transition-colors ${selectedLayerId === l.id ? 'bg-red-500/15 text-white' : 'text-zinc-300 hover:bg-[#35363c]'}`} onClick={() => setSelectedLayerId(l.id)}>
                            <Type className="w-3 h-3 text-zinc-400 shrink-0" />
                            <span className="flex-1 text-[9px] truncate">{l.text || l.name}</span>
                            <button onClick={e => { e.stopPropagation(); deleteLayer(l.id) }} className="p-0.5 text-zinc-600 hover:text-red-400 transition-colors"><Trash2 className="w-2.5 h-2.5" /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* SHAPES */}
                {assetSub === 'shapes' && (
                  <div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {SHAPE_PRESETS.map(p => (
                        <button key={p.name} onClick={() => { if (p.name === 'Polygon') { setPolygonDrawing(true); setPolygonPoints([]) } else addShapeLayer(p) }}
                          className="flex flex-col items-center gap-1.5 py-3 rounded-none border border-[#3f4147] bg-[#2b2d31] hover:bg-[#35363c] hover:border-zinc-500 transition-colors"
                          draggable onDragStart={e => { e.dataTransfer.setData('studio/asset-type', 'shape'); e.dataTransfer.setData('studio/asset-name', p.name); e.dataTransfer.effectAllowed = 'copy' }}
                        >
                          <div className="w-6 h-6 bg-zinc-500" style={{ borderRadius: p.name === 'Circle' ? '50%' : 2, width: p.name === 'Line' ? 24 : p.name === 'Rectangle' ? 28 : undefined, height: p.name === 'Line' ? 2 : p.name === 'Rectangle' ? 16 : undefined, clipPath: p.name === 'Triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : p.name === 'Polygon' ? 'polygon(30% 0%, 70% 0%, 100% 40%, 80% 100%, 20% 100%, 0% 40%)' : undefined }} />
                          <span className="text-[8px] text-zinc-400">{p.name}</span>
                        </button>
                      ))}
                    </div>
                    {/* List of placed shapes */}
                    {layers.filter(l => l.type === 'shape').length > 0 && (
                      <div className="mt-3 space-y-0.5">
                        <p className="text-[7px] text-zinc-600 uppercase tracking-wider px-1 mb-1">Placed Shapes</p>
                        {layers.filter(l => l.type === 'shape').map(l => (
                          <div key={l.id} className={`flex items-center gap-1.5 px-2 py-1 rounded-none cursor-pointer transition-colors ${selectedLayerId === l.id ? 'bg-red-500/15 text-white' : 'text-zinc-300 hover:bg-[#35363c]'}`} onClick={() => setSelectedLayerId(l.id)}>
                            <div className="w-3 h-3 rounded-none shrink-0" style={{ backgroundColor: l.color || '#666', borderRadius: l.name === 'Circle' ? '50%' : 2 }} />
                            <span className="flex-1 text-[9px] truncate">{l.name}{l.maskMode && l.maskMode !== 'none' ? ` (${l.maskMode === 'mask' ? 'Mask' : 'Multi-Mask'})` : ''}</span>
                            <button onClick={e => { e.stopPropagation(); deleteLayer(l.id) }} className="p-0.5 text-zinc-600 hover:text-red-400 transition-colors"><Trash2 className="w-2.5 h-2.5" /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <p className="text-[7px] text-zinc-600 text-center py-1 border-t border-[#2b2d31] shrink-0">Click to add • Drag onto canvas</p>
            </div>
          )}

          {/* ── LAYERS TAB ── */}
          {leftTab === 'layers' && (
            <div className="flex-1 overflow-y-auto p-2">
              {layers.length === 0 ? <p className="text-[10px] text-zinc-600 text-center py-4">No layers on canvas</p> : (
                <div className="space-y-0.5">
                  {[...layers].reverse().map((layer, vi) => {
                    const state = layerStates[layer.id]
                    const isSelected = selectedLayerId === layer.id
                    return (
                      <div key={layer.id}
                        className={`flex items-center gap-1.5 px-1.5 py-1 rounded-none text-[9px] cursor-pointer transition-all ${isSelected ? 'bg-red-500/15 text-white' : 'text-zinc-300 hover:bg-[#35363c]'}`}
                        onClick={() => setSelectedLayerId(layer.id)}
                        draggable
                        onDragStart={() => { dragLayerIdxRef.current = vi }}
                        onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = 'move' }}
                        onDrop={() => { if (dragLayerIdxRef.current !== null) { reorderLayers(dragLayerIdxRef.current, vi); dragLayerIdxRef.current = null } }}
                      >
                        <GripVertical className="w-2.5 h-2.5 text-zinc-600 shrink-0 cursor-grab" />
                        {layer.type === 'image' && <ImageIcon className="w-3 h-3 text-[#3E6DC4] shrink-0" />}
                        {layer.type === 'video' && <VideoIcon className="w-3 h-3 text-[#6a5ea8] shrink-0" />}
                        {layer.type === 'text' && <Type className="w-3 h-3 text-white shrink-0" />}
                        {layer.type === 'shape' && <Square className="w-3 h-3 text-zinc-400 shrink-0" />}
                        {layer.type === 'audio' && <Volume2 className="w-3 h-3 text-[#2E9E63] shrink-0" />}
                        <span className="flex-1 truncate">{layer.name}</span>
                        <button onClick={e => { e.stopPropagation(); updateLayer(layer.id, { visible: !state?.visible }) }}
                          className="p-0.5 text-zinc-600 hover:text-white transition-colors" title="Toggle visibility">
                          {state?.visible ? <Eye className="w-2.5 h-2.5" /> : <EyeOff className="w-2.5 h-2.5" />}
                        </button>
                        <button onClick={e => { e.stopPropagation(); updateLayer(layer.id, { locked: !layer.locked }) }}
                          className={`p-0.5 transition-colors ${layer.locked ? 'text-[#c98a2a]' : 'text-zinc-600 hover:text-white'}`} title="Lock/unlock">
                          {layer.locked ? <Lock className="w-2.5 h-2.5" /> : <Unlock className="w-2.5 h-2.5" />}
                        </button>
                        <button onClick={e => { e.stopPropagation(); updateLayer(layer.id, { maskImmune: !layer.maskImmune }) }}
                          className={`p-0.5 transition-colors ${layer.maskImmune ? 'text-[#3E6DC4]' : 'text-zinc-600 hover:text-white'}`} title="Mask immune">
                          {layer.maskImmune ? <Shield className="w-2.5 h-2.5" /> : <ShieldOff className="w-2.5 h-2.5" />}
                        </button>
                        <button onClick={e => { e.stopPropagation(); deleteLayer(layer.id) }}
                          className="p-0.5 text-zinc-600 hover:text-red-400 transition-colors" title="Delete">
                          <Trash2 className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ═══ CENTER: CANVAS ═══ */}
        <div className="flex-1 flex flex-col min-w-0">
          <div ref={canvasWrapperRef} className="flex-1 flex items-center justify-center bg-[#111113] min-w-0 p-2 overflow-auto relative">
            {/* SVG feather + mask definitions */}
            <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
              <defs>
                {layers.filter(l => l.feather && l.feather > 0).map(l => (
                  <filter key={l.id} id={`feather-${l.id}`} x="-200%" y="-200%" width="500%" height="500%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation={l.feather!} />
                  </filter>
                ))}
                {maskSvgDefs.defs.map(d => (
                  <React.Fragment key={d.id}>
                    {/* Blur filter for feathered masks */}
                    {d.feather > 0 && (
                      <filter id={`mask-blur-${d.id}`} x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation={d.feather * 0.01} />
                      </filter>
                    )}
                    {/* SVG mask: white background (visible) with black shape (hole) + optional blur */}
                    <mask id={d.id} maskContentUnits="objectBoundingBox">
                      <rect x="0" y="0" width="1" height="1" fill="white" />
                      <path d={d.innerPath} fill="black" filter={d.feather > 0 ? `url(#mask-blur-${d.id})` : undefined} />
                    </mask>
                  </React.Fragment>
                ))}
              </defs>
            </svg>
            <div ref={canvasRef}
              className={`relative overflow-hidden rounded-none ${isDragOver ? 'ring-2 ring-[#C9241A] ring-offset-2 ring-offset-[#111113]' : ''}`}
              style={{ width: 'min(72rem, calc((100vh - 8rem) * 16 / 9))', aspectRatio: '16/9', backgroundColor: canvas.backgroundColor || STUDIO_DEFAULT_BG, transform: `scale(${canvasZoom / 100})`, transformOrigin: 'center center', transition: 'transform 0.15s ease-out' }}
              onClick={handleCanvasClick} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
            >
              {layers.map(layer => {
                const state = layerStates[layer.id]; if (!state || !state.visible) return null
                const src = state.src ?? layer.src; if (!src && layer.type !== 'text' && layer.type !== 'shape') return null
                const isSel = selectedLayerId === layer.id
                return (
                  <div key={layer.id} style={{ position: 'absolute', left: `${state.x}%`, top: `${state.y}%`, width: `${state.width}%`, height: `${state.height}%`, opacity: state.opacity, zIndex: layer.zIndex, transition: dragRef.current?.layerId === layer.id || resizeRef.current?.layerId === layer.id ? 'none' : 'all 0.6s ease-out', cursor: 'move', WebkitMask: maskClips[layer.id] || undefined, mask: maskClips[layer.id] || undefined } as React.CSSProperties}
                    onMouseDown={e => handleLayerMouseDown(e, layer.id)} onClick={e => { e.stopPropagation(); setSelectedLayerId(layer.id) }}
                    onDoubleClick={e => { e.stopPropagation(); if (layer.type === 'shape' && (layer.name === 'Rectangle' || layer.name === 'Triangle')) setDistortMode(layer.id) }}>
                    {/* Image with feather */}
                    {layer.type === 'image' && (
                      <div className="w-full h-full pointer-events-none" style={{ transform: `rotate(${state.rotation}deg)`, filter: layer.feather ? `url(#feather-${layer.id})` : undefined }}>
                        <img src={src!} alt="" className="w-full h-full object-contain" />
                      </div>
                    )}
                    {/* Video — YouTube iframe or native */}
                    {layer.type === 'video' && (
                      layer.youtubeUrl ? (
                        <iframe src={layer.youtubeUrl} className="w-full h-full pointer-events-none border-0" style={{ transform: `rotate(${state.rotation}deg)` }} allow="autoplay; encrypted-media" allowFullScreen />
                      ) : (
                        <video src={src!} autoPlay loop muted playsInline className="w-full h-full object-contain pointer-events-none" style={{ transform: `rotate(${state.rotation}deg)` }} />
                      )
                    )}
                    {/* Text */}
                    {layer.type === 'text' && <div className="w-full h-full flex items-center justify-center pointer-events-none" style={{ color: layer.color || '#fff', fontSize: `${(layer.fontSize || 24) * 0.5}px`, fontWeight: layer.fontWeight || '400', transform: `rotate(${state.rotation}deg)` }}>{layer.text}</div>}
                    {/* Shape with feather + distort + border */}
                    {layer.type === 'shape' && (() => {
                      const dp = layer.distortPoints
                      const pp = layer.polygonPoints
                      const shapeClip = pp
                        ? `polygon(${pp.map(p => `${p.x}% ${p.y}%`).join(', ')})`
                        : dp ? `polygon(${dp.tl.x}% ${dp.tl.y}%, ${dp.tr.x}% ${dp.tr.y}%, ${dp.br.x}% ${dp.br.y}%, ${dp.bl.x}% ${dp.bl.y}%)`
                        : layer.name === 'Triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : undefined
                      const featherPx = layer.feather || 0
                      const isMaskShape = layer.maskMode && layer.maskMode !== 'none'
                      return <div className="w-full h-full pointer-events-none" style={{
                        // Mask shapes: hidden in Active Mode (the SVG clipPath on targets creates the hole)
                        display: isMaskShape ? 'none' : undefined,
                        backgroundColor: layer.fillTransparent ? 'transparent' : (layer.color || '#4a5568'),
                        borderRadius: layer.name === 'Circle' && !dp ? '50%' : undefined,
                        clipPath: shapeClip,
                        border: layer.borderWidth ? `${layer.borderWidth}px ${layer.borderStyle || 'solid'} ${layer.borderColor || '#fff'}` : undefined,
                        transform: `rotate(${state.rotation}deg)`,
                        filter: featherPx > 0 ? `url(#feather-${layer.id})` : undefined,
                      }} />
                    })()}
                    {/* Distort mode corner handles */}
                    {distortMode === layer.id && layer.type === 'shape' && (() => {
                      const dp = layer.distortPoints || { tl: { x: 0, y: 0 }, tr: { x: 100, y: 0 }, bl: { x: 0, y: 100 }, br: { x: 100, y: 100 } }
                      return Object.entries(dp).map(([corner, pt]) => (
                        <div key={corner} className="absolute w-3 h-3 bg-[#c98a2a] border-2 border-[#8a7d3a] rounded-full z-30 cursor-move"
                          style={{ left: `${pt.x}%`, top: `${pt.y}%`, transform: 'translate(-50%,-50%)' }}
                          onMouseDown={e => {
                            e.stopPropagation(); e.preventDefault()
                            const startX = e.clientX, startY = e.clientY
                            const move = (ev: MouseEvent) => {
                              if (!canvasRef.current) return
                              const r = canvasRef.current.getBoundingClientRect()
                              const dx = ((ev.clientX - startX) / r.width) * 100
                              const dy = ((ev.clientY - startY) / r.height) * 100
                              handleDistortPointDrag(layer.id, corner as 'tl'|'tr'|'bl'|'br', dx, dy)
                            }
                            const up = () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up) }
                            window.addEventListener('mousemove', move); window.addEventListener('mouseup', up)
                          }}
                        />
                      ))
                    })()}
                    {isSel && (<>
                      <div className="absolute inset-0 border-2 border-[#3E6DC4] border-dashed pointer-events-none rounded-none" />
                      {['tl', 'tr', 'bl', 'br'].map(h => (<div key={h} className="absolute w-2.5 h-2.5 bg-white border-2 border-[#3E6DC4] rounded-none z-10" style={{ top: h.includes('t') ? -5 : undefined, bottom: h.includes('b') ? -5 : undefined, left: h.includes('l') ? -5 : undefined, right: h.includes('r') ? -5 : undefined, cursor: h === 'tl' || h === 'br' ? 'nwse-resize' : 'nesw-resize' }} onMouseDown={e => handleResizeMouseDown(e, layer.id, h)} />))}
                      <button className="absolute -top-3 -right-3 z-20 w-5 h-5 bg-[#C9241A] hover:bg-[#a81d15] rounded-full flex items-center justify-center shadow-lg transition-colors" onClick={e => { e.stopPropagation(); deleteLayer(layer.id) }}><Trash2 className="w-2.5 h-2.5 text-white" /></button>
                    </>)}
                  </div>
                )
              })}
              {isDragOver && <div className="absolute inset-0 flex items-center justify-center bg-[#C9241A]/10 pointer-events-none z-50"><div className="px-4 py-2 bg-[#C9241A] rounded-none text-white text-xs font-bold uppercase tracking-wider">Drop to add</div></div>}
              {/* Polygon drawing mode */}
              {polygonDrawing && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-40">
                  {polygonPoints.map((p, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && <line x1={`${polygonPoints[i - 1].x}%`} y1={`${polygonPoints[i - 1].y}%`} x2={`${p.x}%`} y2={`${p.y}%`} stroke="#C9241A" strokeWidth="2" strokeDasharray="4" />}
                      <circle cx={`${p.x}%`} cy={`${p.y}%`} r={i === 0 && polygonPoints.length >= 3 ? '6' : '4'} fill={i === 0 && polygonPoints.length >= 3 ? '#C9241A' : '#ffffff'} stroke="#C9241A" strokeWidth="2" />
                    </React.Fragment>
                  ))}
                </svg>
              )}
              {polygonDrawing && <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 px-3 py-1 bg-[#C9241A] rounded-none text-[10px] text-white font-bold">Click to add points • Click first point to close</div>}
            </div>
            {/* Zoom controls */}
            <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-[#1e1f22] border border-[#3f4147] rounded-none px-1.5 py-1 shadow-xl z-10">
              <button onClick={() => setCanvasZoom(p => Math.max(25, p - 25))} className="p-1 text-zinc-400 hover:text-white transition-colors"><ZoomOut className="w-3.5 h-3.5" /></button>
              <button onClick={() => setCanvasZoom(100)} className="px-1.5 text-[10px] font-mono text-zinc-300 hover:text-white transition-colors min-w-[36px] text-center">{canvasZoom}%</button>
              <button onClick={() => setCanvasZoom(p => Math.min(200, p + 25))} className="p-1 text-zinc-400 hover:text-white transition-colors"><ZoomIn className="w-3.5 h-3.5" /></button>
              <div className="w-px h-4 bg-zinc-700 mx-0.5" />
              <button onClick={toggleFullscreen} className="p-1 text-zinc-400 hover:text-white transition-colors"><Maximize2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
          {/* QR bar */}
          <div className="h-11 bg-[#1a1a1c] border-t border-[#2b2d31] flex items-center justify-center gap-6 px-4 shrink-0">
            <div className="bg-white p-0.5 rounded"><QRCodeSVG value={joinUrl} size={28} /></div>
            <div className="flex items-center gap-2"><span className="text-[9px] text-zinc-500">Join at</span><span className="text-[10px] text-zinc-300 font-mono">{typeof window !== 'undefined' ? window.location.origin : ''}/join</span></div>
            <div className="h-4 w-px bg-zinc-700" />
            <div className="flex items-center gap-2"><span className="text-[9px] text-zinc-500">Code:</span><span className="text-lg font-mono font-bold text-white tracking-[0.15em]">{session.room_code}</span></div>
          </div>
        </div>

        {/* ═══ RIGHT PANEL ═══ */}
        <div className="w-56 shrink-0 bg-[#1e1f22] border-l border-[#2b2d31] flex flex-col overflow-hidden">
          {/* Tab switcher */}
          <div className="flex border-b border-[#2b2d31] shrink-0">
            <button onClick={() => setRightTab('scenes')} className={`flex-1 py-2 text-[8px] font-bold uppercase tracking-wider transition-colors ${rightTab === 'scenes' ? 'text-red-400 border-b-2 border-red-500' : 'text-zinc-500 hover:text-zinc-300'}`}>Scenes</button>
            <button onClick={() => setRightTab('push')} className={`flex-1 py-2 text-[8px] font-bold uppercase tracking-wider transition-colors ${rightTab === 'push' ? 'text-red-400 border-b-2 border-red-500' : 'text-zinc-500 hover:text-zinc-300'}`}>Push</button>
            <button onClick={() => setRightTab('details')} className={`flex-1 py-2 text-[8px] font-bold uppercase tracking-wider transition-colors ${rightTab === 'details' ? 'text-red-400 border-b-2 border-red-500' : 'text-zinc-500 hover:text-zinc-300'}`}>Details</button>
          </div>
          {rightTab === 'scenes' && (
            <div className="flex-1 overflow-y-auto p-2.5">
              <LiveScenesPanel
                session={session}
                channelRef={channelRef}
                scenes={scenes ?? [{ id: slide.id, title: slide.title || 'Scene 1' }]}
                initialLiveSceneIds={initialLiveSceneIds ?? [slide.id]}
                currentSceneId={slide.id}
                onDrive={onDriveScene}
              />
            </div>
          )}
          {rightTab === 'push' && (
            <PushPanel queue={pushQueue} onUpdateTransition={updateQueueTransition} onPushItem={pushItem} onPushAll={pushAll} onRemoveItem={removeFromQueue} globalTransition={globalTransition} onSetGlobalTransition={setGlobalTransition} />
          )}
          {rightTab === 'details' && (
            <div className="flex-1 overflow-y-auto">
              {selectedLayer ? (
                <StudioProperties
                  layer={selectedLayer}
                  onUpdate={(updates) => { if (selectedLayerId) updateLayer(selectedLayerId, updates) }}
                  onDelete={deleteLayer}
                  onDuplicate={duplicateLayer}
                />
              ) : (
                <div className="text-center py-8">
                  <p className="text-[10px] text-zinc-600">Select a layer on the canvas to edit its properties</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ─── End Confirm ─── */}
      {showEndConfirm && (
        <div className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-[#1e1f22] border border-[#3f4147] rounded-none p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-sm font-semibold text-white mb-2">End this exercise?</h3>
            <p className="text-[11px] text-zinc-400 mb-4">All participants will see the exercise has ended. Session data will be saved for reporting.</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowEndConfirm(false)} className="px-3 py-1.5 text-[11px] font-medium rounded-none bg-[#2b2d31] text-zinc-300 hover:bg-[#35363c] transition-colors">Cancel</button>
              <button onClick={handleEndExercise} className="px-3 py-1.5 text-[11px] font-medium rounded-none bg-[#C9241A] text-white hover:bg-[#a81d15] transition-colors">End Exercise</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete layer confirmation */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center" onClick={() => setConfirmDeleteId(null)}>
          <div className="bg-[#1e1f22] border border-[#3f4147] rounded-none p-5 max-w-xs w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-sm font-semibold text-white mb-2">Delete this layer?</h3>
            <p className="text-[11px] text-zinc-400 mb-4">This will remove the layer from the canvas. This cannot be undone.</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setConfirmDeleteId(null)} className="px-3 py-1.5 text-[11px] font-medium rounded-none bg-[#2b2d31] text-zinc-300 hover:bg-[#35363c] transition-colors">Cancel</button>
              <button onClick={() => { deleteLayer(confirmDeleteId); setConfirmDeleteId(null) }} className="px-3 py-1.5 text-[11px] font-medium rounded-none bg-[#C9241A] text-white hover:bg-[#a81d15] transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Sub-components ─── */

function AssetThumb({ asset, onDragStart, onClick }: { asset: AssetItem; onDragStart: (e: React.DragEvent<HTMLElement>, a: AssetItem) => void; onClick: () => void }) {
  return (
    <div className="group relative aspect-video overflow-hidden rounded-none border border-[#3f4147] bg-[#383a40] hover:border-[#C9241A]/50 cursor-grab active:cursor-grabbing transition-colors"
      draggable onDragStart={e => onDragStart(e, asset)} onClick={onClick}>
      {asset.type === 'image' ? <img src={asset.url} alt={asset.name} className="h-full w-full object-cover pointer-events-none" />
        : <video src={asset.url} className="h-full w-full object-cover pointer-events-none" muted preload="metadata" />}
      <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"><Plus className="w-5 h-5 text-white" /></div>
      <span className="absolute bottom-0 left-0 right-0 truncate bg-black/60 px-1 py-0.5 text-[8px] text-zinc-300">{asset.name}</span>
    </div>
  )
}

function EventBtn({ event, triggered, animating, onTrigger, onRedo }: { event: import('@/types/slide').StudioEvent; triggered: boolean; animating: boolean; onTrigger: () => void; onRedo: () => void }) {
  return (
    <div className={`flex items-center gap-1 rounded-none px-2 py-1.5 text-[10px] mb-0.5 transition-all ${animating ? 'bg-[#c98a2a]/20 text-[#c98a2a]' : triggered ? 'bg-zinc-800/50 text-zinc-500' : 'bg-[#2b2d31] text-zinc-300 hover:bg-[#35363c]'}`}>
      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: event.color || '#6a5ea8' }} />
      <span className="flex-1 truncate">{event.name}</span>
      {event.actions.length > 0 && <span className="text-[8px] bg-zinc-700/50 text-zinc-500 px-1 rounded">{event.actions.length}</span>}
      {triggered && <button onClick={e => { e.stopPropagation(); onRedo() }} className="p-0.5 text-zinc-600 hover:text-[#c98a2a] transition-colors"><RotateCcw className="w-2.5 h-2.5" /></button>}
      <button onClick={onTrigger} disabled={animating} className="p-0.5 text-zinc-600 hover:text-[#2E9E63] disabled:opacity-30 transition-colors"><Play className="w-2.5 h-2.5 fill-current" /></button>
    </div>
  )
}
