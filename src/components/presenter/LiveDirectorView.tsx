'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import type { Slide, StudioContent, StudioLayer, StudioLayerState, StudioEvent, StudioEventCategory } from '@/types/slide'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { Play, RotateCcw, ChevronRight, ChevronDown, Square, Clock, Radio, Trash2, ImageIcon, VideoIcon, Upload, Loader2, Plus, Maximize2, ZoomIn, ZoomOut, Minus } from 'lucide-react'
import { playEvent, type EventPlaybackController } from '@/lib/studio/event-playback'
import { PushPanel } from '@/components/studio/PushPanel'
import { generateLayerId } from '@/lib/utils/studio-utils'
import { QRCodeSVG } from 'qrcode.react'

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

interface AssetItem { id: string; name: string; url: string; type: 'image' | 'video' }

/* ─── Upload helper ─── */
function uploadAssetFile(file: File, onProgress?: (pct: number) => void): Promise<{ url: string; name: string }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    const formData = new FormData()
    formData.append('file', file)
    xhr.upload.addEventListener('progress', (e) => { if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100)) })
    xhr.addEventListener('load', () => { if (xhr.status >= 200 && xhr.status < 300) { try { resolve(JSON.parse(xhr.responseText)) } catch { reject(new Error('Invalid response')) } } else { reject(new Error('Upload failed')) } })
    xhr.addEventListener('error', () => reject(new Error('Upload failed')))
    xhr.open('POST', '/api/studio/assets')
    xhr.send(formData)
  })
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

  // Canvas interaction state
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [canvasZoom, setCanvasZoom] = useState(100)

  // Left panel tab: 'events' or 'assets'
  const [leftTab, setLeftTab] = useState<'events' | 'assets'>('events')

  // Asset gallery state
  const [assetTab, setAssetTab] = useState<'images' | 'videos'>('images')
  const [images, setImages] = useState<AssetItem[]>([])
  const [videos, setVideos] = useState<AssetItem[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  const eventControllerRef = useRef<EventPlaybackController | null>(null)
  const startTimeRef = useRef(new Date().toISOString())
  const canvasRef = useRef<HTMLDivElement>(null)
  const canvasWrapperRef = useRef<HTMLDivElement>(null)

  // Drag state refs
  const dragRef = useRef<{ layerId: string; startMX: number; startMY: number; startX: number; startY: number } | null>(null)
  const resizeRef = useRef<{ layerId: string; handle: string; startMX: number; startMY: number; startX: number; startY: number; startW: number; startH: number } | null>(null)

  // Broadcast throttling
  const lastBroadcastRef = useRef(0)
  const pendingBroadcastRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ─── Extract assets from scene layers ───
  useEffect(() => {
    const seen = new Set<string>()
    const imgs: AssetItem[] = []
    const vids: AssetItem[] = []
    for (const l of initialLayers) {
      if (l.src && !seen.has(l.src)) {
        seen.add(l.src)
        if (l.type === 'image') imgs.push({ id: l.id, name: l.name, url: l.src, type: 'image' })
        if (l.type === 'video') vids.push({ id: l.id, name: l.name, url: l.src, type: 'video' })
      }
    }
    setImages(imgs)
    setVideos(vids)
  }, [initialLayers])

  // ─── Session timer ───
  useEffect(() => {
    const interval = setInterval(() => setSessionSeconds(s => s + 1), 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    return () => { eventControllerRef.current?.cancel() }
  }, [])

  // ─── Asset Preloading ───
  useEffect(() => {
    for (const layer of initialLayers) {
      if (layer.src && layer.type === 'image') {
        const img = new window.Image()
        img.src = layer.src
      }
    }
  }, [initialLayers])

  // ─── Canvas zoom via scroll wheel ───
  useEffect(() => {
    const el = canvasWrapperRef.current
    if (!el) return
    const handler = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        setCanvasZoom(prev => Math.max(25, Math.min(200, prev + (e.deltaY > 0 ? -10 : 10))))
      }
    }
    el.addEventListener('wheel', handler, { passive: false })
    return () => el.removeEventListener('wheel', handler)
  }, [])

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

  // ─── Throttled broadcast ───
  const broadcastLayerStates = useCallback((states: Record<string, Partial<StudioLayerState>>) => {
    const now = Date.now()
    const send = () => {
      channelRef.current?.send({ type: 'broadcast', event: 'STUDIO_LAYER_STATES_UPDATE', payload: { slide_id: slide.id, layerStates: states } })
      lastBroadcastRef.current = Date.now()
    }
    if (pendingBroadcastRef.current) clearTimeout(pendingBroadcastRef.current)
    if (now - lastBroadcastRef.current >= 100) { send() } else { pendingBroadcastRef.current = setTimeout(send, 100 - (now - lastBroadcastRef.current)) }
  }, [slide.id, channelRef])

  // ─── Layer deletion ───
  const deleteLayer = useCallback((layerId: string) => {
    setLayers(prev => prev.filter(l => l.id !== layerId))
    setLayerStates(prev => { const n = { ...prev }; delete n[layerId]; return n })
    setSelectedLayerId(null)
    channelRef.current?.send({ type: 'broadcast', event: 'STUDIO_LAYER_REMOVED', payload: { slide_id: slide.id, layerId } })
  }, [slide.id, channelRef])

  // ─── Keyboard handler (Delete/Backspace) ───
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedLayerId) {
        if ((e.target as HTMLElement)?.tagName === 'INPUT' || (e.target as HTMLElement)?.tagName === 'TEXTAREA') return
        e.preventDefault()
        deleteLayer(selectedLayerId)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [selectedLayerId, deleteLayer])

  // ─── Event triggering ───
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

  // ─── Push handler ───
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

  // ─── End exercise ───
  const handleEndExercise = useCallback(async () => {
    eventControllerRef.current?.cancel()
    const endTime = new Date().toISOString()
    channelRef.current?.send({ type: 'broadcast', event: 'STUDIO_EXERCISE_ENDED', payload: { slide_id: slide.id, duration: sessionSeconds, eventsTriggered: triggeredEvents.size } })
    try {
      await fetch('/api/studio/exercise', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ session_id: session.id, duration: sessionSeconds, events_triggered: triggeredEvents.size, assets_added: assetsAdded, presenter_name: presenterName, scene_name: slide.title || 'Untitled Scene', start_time: startTimeRef.current, end_time: endTime }) })
    } catch { /* silent */ }
    onEndExercise({ duration: sessionSeconds, eventsTriggered: triggeredEvents.size, assetsAdded, presenterName, sceneName: slide.title || 'Untitled Scene', startTime: startTimeRef.current, endTime })
  }, [sessionSeconds, triggeredEvents, assetsAdded, presenterName, slide, session, channelRef, onEndExercise])

  // ─── Canvas layer move ───
  const handleLayerMouseDown = useCallback((e: React.MouseEvent, layerId: string) => {
    e.stopPropagation()
    e.preventDefault()
    setSelectedLayerId(layerId)
    const state = layerStates[layerId]
    if (!state) return
    dragRef.current = { layerId, startMX: e.clientX, startMY: e.clientY, startX: state.x, startY: state.y }
    const handleMouseMove = (ev: MouseEvent) => {
      if (!dragRef.current || !canvasRef.current) return
      const rect = canvasRef.current.getBoundingClientRect()
      const dx = ((ev.clientX - dragRef.current.startMX) / rect.width) * 100
      const dy = ((ev.clientY - dragRef.current.startMY) / rect.height) * 100
      const newX = dragRef.current.startX + dx
      const newY = dragRef.current.startY + dy
      setLayerStates(prev => ({ ...prev, [dragRef.current!.layerId]: { ...prev[dragRef.current!.layerId], x: newX, y: newY } }))
      broadcastLayerStates({ [dragRef.current.layerId]: { x: newX, y: newY } })
    }
    const handleMouseUp = () => {
      dragRef.current = null
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      if (pendingBroadcastRef.current) { clearTimeout(pendingBroadcastRef.current); pendingBroadcastRef.current = null }
      broadcastLayerStates(layerStates)
    }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }, [layerStates, broadcastLayerStates])

  // ─── Resize handlers ───
  const handleResizeMouseDown = useCallback((e: React.MouseEvent, layerId: string, handle: string) => {
    e.stopPropagation()
    e.preventDefault()
    const state = layerStates[layerId]
    if (!state) return
    resizeRef.current = { layerId, handle, startMX: e.clientX, startMY: e.clientY, startX: state.x, startY: state.y, startW: state.width, startH: state.height }
    const handleMouseMove = (ev: MouseEvent) => {
      if (!resizeRef.current || !canvasRef.current) return
      const rect = canvasRef.current.getBoundingClientRect()
      const dx = ((ev.clientX - resizeRef.current.startMX) / rect.width) * 100
      const dy = ((ev.clientY - resizeRef.current.startMY) / rect.height) * 100
      const r = resizeRef.current
      let { startX: x, startY: y, startW: w, startH: h } = r
      if (r.handle.includes('r')) w = Math.max(3, r.startW + dx)
      if (r.handle.includes('l')) { w = Math.max(3, r.startW - dx); x = r.startX + dx }
      if (r.handle.includes('b')) h = Math.max(3, r.startH + dy)
      if (r.handle.includes('t')) { h = Math.max(3, r.startH - dy); y = r.startY + dy }
      setLayerStates(prev => ({ ...prev, [r.layerId]: { ...prev[r.layerId], x, y, width: w, height: h } }))
      broadcastLayerStates({ [r.layerId]: { x, y, width: w, height: h } })
    }
    const handleMouseUp = () => {
      resizeRef.current = null
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      if (pendingBroadcastRef.current) { clearTimeout(pendingBroadcastRef.current); pendingBroadcastRef.current = null }
      broadcastLayerStates(layerStates)
    }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }, [layerStates, broadcastLayerStates])

  // ─── Drop handler ───
  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; setIsDragOver(true) }, [])
  const handleDragLeave = useCallback(() => setIsDragOver(false), [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const assetType = e.dataTransfer.getData('studio/asset-type') as 'image' | 'video'
    const assetSrc = e.dataTransfer.getData('studio/asset-src')
    const assetName = e.dataTransfer.getData('studio/asset-name') || 'Dropped Asset'
    if (!assetType || !assetSrc || !canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const xPct = ((e.clientX - rect.left) / rect.width) * 100
    const yPct = ((e.clientY - rect.top) / rect.height) * 100
    const layer: StudioLayer = {
      id: generateLayerId(), name: assetName, type: assetType, src: assetSrc,
      x: Math.max(0, xPct - 15), y: Math.max(0, yPct - 15),
      width: assetType === 'video' ? 40 : 30, height: assetType === 'video' ? 22.5 : 30,
      rotation: 0, zIndex: layers.length + 1, opacity: 1,
      blendMode: 'normal', visible: true, locked: false,
      ...(assetType === 'video' ? { loop: true, autoplay: true, muted: true } : {}),
    }
    setLayers(prev => [...prev, layer])
    setLayerStates(prev => ({ ...prev, [layer.id]: { visible: true, opacity: 1, x: layer.x, y: layer.y, width: layer.width, height: layer.height, rotation: 0, src: layer.src } }))
    channelRef.current?.send({ type: 'broadcast', event: 'STUDIO_LAYER_ADDED', payload: { slide_id: slide.id, layer } })
    setAssetsAdded(prev => prev + 1)
    setSelectedLayerId(layer.id)
  }, [layers, slide.id, channelRef])

  const handleCanvasClick = useCallback((e: React.MouseEvent) => { if (e.target === canvasRef.current) setSelectedLayerId(null) }, [])

  // ─── Fullscreen ───
  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) { document.exitFullscreen() } else { canvasWrapperRef.current?.requestFullscreen() }
  }, [])

  // ─── Asset upload handlers ───
  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    setUploading(true); setUploadProgress(0)
    for (const file of Array.from(files)) {
      try {
        const { url, name } = await uploadAssetFile(file, (pct) => setUploadProgress(pct))
        setImages(prev => [...prev, { id: generateLayerId(), name, url, type: 'image' }])
      } catch {
        try { const { url, name } = await uploadAssetFile(file, (pct) => setUploadProgress(pct)); setImages(prev => [...prev, { id: generateLayerId(), name, url, type: 'image' }]) } catch { /* silent */ }
      }
    }
    setUploading(false); setUploadProgress(0); e.target.value = ''
  }, [])

  const handleVideoUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    setUploading(true); setUploadProgress(0)
    for (const file of Array.from(files)) {
      try {
        const { url, name } = await uploadAssetFile(file, (pct) => setUploadProgress(pct))
        setVideos(prev => [...prev, { id: generateLayerId(), name, url, type: 'video' }])
      } catch {
        try { const { url, name } = await uploadAssetFile(file, (pct) => setUploadProgress(pct)); setVideos(prev => [...prev, { id: generateLayerId(), name, url, type: 'video' }]) } catch { /* silent */ }
      }
    }
    setUploading(false); setUploadProgress(0); e.target.value = ''
  }, [])

  const handleAssetDragStart = useCallback((e: React.DragEvent<HTMLElement>, asset: AssetItem) => {
    e.dataTransfer.setData('studio/asset-type', asset.type)
    e.dataTransfer.setData('studio/asset-src', asset.url)
    e.dataTransfer.setData('studio/asset-name', asset.name)
    e.dataTransfer.effectAllowed = 'copy'
  }, [])

  // Add asset directly to canvas (click)
  const addAssetToCanvas = useCallback((asset: AssetItem) => {
    const layer: StudioLayer = {
      id: generateLayerId(), name: asset.name, type: asset.type, src: asset.url,
      x: 10, y: 10, width: asset.type === 'video' ? 40 : 30, height: asset.type === 'video' ? 22.5 : 30,
      rotation: 0, zIndex: layers.length + 1, opacity: 1,
      blendMode: 'normal', visible: true, locked: false,
      ...(asset.type === 'video' ? { loop: true, autoplay: true, muted: true } : {}),
    }
    setLayers(prev => [...prev, layer])
    setLayerStates(prev => ({ ...prev, [layer.id]: { visible: true, opacity: 1, x: layer.x, y: layer.y, width: layer.width, height: layer.height, rotation: 0, src: layer.src } }))
    channelRef.current?.send({ type: 'broadcast', event: 'STUDIO_LAYER_ADDED', payload: { slide_id: slide.id, layer } })
    setAssetsAdded(prev => prev + 1)
    setSelectedLayerId(layer.id)
  }, [layers, slide.id, channelRef])

  // ─── Event grouping ───
  const grouped = useMemo(() => {
    const uncategorized: StudioEvent[] = []
    const byCategory = new Map<string, StudioEvent[]>()
    for (const evt of events) {
      if (evt.categoryId) { const l = byCategory.get(evt.categoryId) || []; l.push(evt); byCategory.set(evt.categoryId, l) }
      else uncategorized.push(evt)
    }
    return { uncategorized, byCategory }
  }, [events])

  const joinUrl = typeof window !== 'undefined' ? `${window.location.origin}/join/${session.room_code}` : ''
  const currentAssets = assetTab === 'images' ? images : videos

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#0a0a0b]" style={{ border: '3px solid #dc2626' }}>
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
          <button onClick={() => setShowEndConfirm(true)} className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white text-[11px] font-medium transition-colors flex items-center gap-1.5"><Square className="w-3 h-3" /> End Exercise</button>
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <div className="flex-1 flex min-h-0">
        {/* ─── Left Panel: Events + Assets Tabs ─── */}
        <div className="w-60 shrink-0 bg-[#1e1f22] border-r border-[#2b2d31] flex flex-col overflow-hidden">
          {/* Tab switcher */}
          <div className="flex border-b border-[#2b2d31] shrink-0">
            <button onClick={() => setLeftTab('events')} className={`flex-1 py-2 text-[9px] font-bold uppercase tracking-wider transition-colors ${leftTab === 'events' ? 'text-red-400 border-b-2 border-red-500 bg-red-500/5' : 'text-zinc-500 hover:text-zinc-300'}`}>Events</button>
            <button onClick={() => setLeftTab('assets')} className={`flex-1 py-2 text-[9px] font-bold uppercase tracking-wider transition-colors ${leftTab === 'assets' ? 'text-red-400 border-b-2 border-red-500 bg-red-500/5' : 'text-zinc-500 hover:text-zinc-300'}`}>Assets</button>
          </div>

          {/* Events content */}
          {leftTab === 'events' && (
            <div className="flex-1 overflow-y-auto p-2">
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
          )}

          {/* Assets content */}
          {leftTab === 'assets' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Image / Video sub-tabs */}
              <div className="flex border-b border-[#2b2d31] shrink-0">
                <button onClick={() => setAssetTab('images')} className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-[8px] font-bold uppercase tracking-wider transition-colors ${assetTab === 'images' ? 'text-white bg-[#2b2d31]' : 'text-zinc-500 hover:text-zinc-300'}`}>
                  <ImageIcon className="w-2.5 h-2.5" /> Images ({images.length})
                </button>
                <button onClick={() => setAssetTab('videos')} className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-[8px] font-bold uppercase tracking-wider transition-colors ${assetTab === 'videos' ? 'text-white bg-[#2b2d31]' : 'text-zinc-500 hover:text-zinc-300'}`}>
                  <VideoIcon className="w-2.5 h-2.5" /> Videos ({videos.length})
                </button>
              </div>

              {/* Upload */}
              <div className="px-2 pt-2 shrink-0">
                <input ref={imageInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                <input ref={videoInputRef} type="file" accept="video/mp4,video/webm" multiple className="hidden" onChange={handleVideoUpload} />
                <button
                  onClick={() => assetTab === 'images' ? imageInputRef.current?.click() : videoInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full flex items-center justify-center gap-1 py-1.5 text-[9px] font-medium rounded-md border border-dashed border-zinc-600 bg-[#2b2d31] text-zinc-300 hover:bg-[#35363c] disabled:opacity-50 transition-colors"
                >
                  {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                  {uploading ? `${uploadProgress}%` : `Upload ${assetTab === 'images' ? 'Image' : 'Video'}`}
                </button>
                {uploading && (
                  <div className="mt-1 h-0.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                    <div className="h-0.5 bg-red-500 rounded-full transition-all duration-150" style={{ width: `${uploadProgress}%` }} />
                  </div>
                )}
              </div>

              {/* Asset grid */}
              <div className="flex-1 overflow-y-auto p-2">
                {currentAssets.length === 0 ? (
                  <p className="text-[9px] text-zinc-600 text-center py-4">No {assetTab} yet. Upload or they&apos;ll appear from your scene.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-1">
                    {currentAssets.map(asset => (
                      <div
                        key={asset.id}
                        className="group relative aspect-video overflow-hidden rounded border border-[#3f4147] bg-[#383a40] hover:border-red-500/50 cursor-grab active:cursor-grabbing transition-colors"
                        draggable
                        onDragStart={(e) => handleAssetDragStart(e, asset)}
                        onClick={() => addAssetToCanvas(asset)}
                      >
                        {asset.type === 'image' ? (
                          <img src={asset.url} alt={asset.name} className="h-full w-full object-cover pointer-events-none" />
                        ) : (
                          <video src={asset.url} className="h-full w-full object-cover pointer-events-none" muted preload="metadata" />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                          <Plus className="w-5 h-5 text-white" />
                        </div>
                        <span className="absolute bottom-0 left-0 right-0 truncate bg-black/60 px-1 py-0.5 text-[8px] text-zinc-300">{asset.name}</span>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-[8px] text-zinc-600 text-center mt-2">Click to add live • Drag onto canvas</p>
              </div>
            </div>
          )}
        </div>

        {/* ─── Live Canvas (Center) ─── */}
        <div className="flex-1 flex flex-col min-w-0">
          <div ref={canvasWrapperRef} className="flex-1 flex items-center justify-center bg-[#111113] min-w-0 p-4 overflow-auto relative">
            <div
              ref={canvasRef}
              className={`relative overflow-hidden rounded-lg ${isDragOver ? 'ring-2 ring-red-500 ring-offset-2 ring-offset-[#111113]' : ''}`}
              style={{
                width: `min(56rem, calc((100vh - 10rem) * 16 / 9))`,
                aspectRatio: '16/9',
                backgroundColor: canvas.backgroundColor,
                transform: `scale(${canvasZoom / 100})`,
                transformOrigin: 'center center',
                transition: 'transform 0.15s ease-out',
              }}
              onClick={handleCanvasClick}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {layers.map(layer => {
                const state = layerStates[layer.id]
                if (!state || !state.visible) return null
                const src = state.src ?? layer.src
                if (!src && layer.type !== 'text' && layer.type !== 'shape') return null
                const isSelected = selectedLayerId === layer.id
                return (
                  <div
                    key={layer.id}
                    style={{
                      position: 'absolute', left: `${state.x}%`, top: `${state.y}%`,
                      width: `${state.width}%`, height: `${state.height}%`,
                      opacity: state.opacity, zIndex: layer.zIndex,
                      transition: dragRef.current?.layerId === layer.id || resizeRef.current?.layerId === layer.id ? 'none' : 'all 0.6s ease-out',
                      cursor: 'move',
                    }}
                    onMouseDown={(e) => handleLayerMouseDown(e, layer.id)}
                    onClick={(e) => { e.stopPropagation(); setSelectedLayerId(layer.id) }}
                  >
                    {layer.type === 'image' && <img src={src!} alt="" className="w-full h-full object-contain pointer-events-none" style={{ transform: `rotate(${state.rotation}deg)` }} />}
                    {layer.type === 'video' && <video src={src!} autoPlay loop muted playsInline className="w-full h-full object-contain pointer-events-none" style={{ transform: `rotate(${state.rotation}deg)` }} />}
                    {layer.type === 'text' && <div className="w-full h-full flex items-center justify-center pointer-events-none" style={{ color: layer.color || '#fff', fontSize: `${(layer.fontSize || 24) * 0.5}px`, transform: `rotate(${state.rotation}deg)` }}>{layer.text}</div>}
                    {layer.type === 'shape' && <div className="w-full h-full pointer-events-none" style={{ backgroundColor: layer.color || '#666', transform: `rotate(${state.rotation}deg)` }} />}
                    {isSelected && (
                      <>
                        <div className="absolute inset-0 border-2 border-blue-500 border-dashed pointer-events-none rounded" />
                        {['tl', 'tr', 'bl', 'br'].map(h => (
                          <div key={h} className="absolute w-2.5 h-2.5 bg-white border-2 border-blue-500 rounded-sm z-10"
                            style={{ top: h.includes('t') ? -5 : undefined, bottom: h.includes('b') ? -5 : undefined, left: h.includes('l') ? -5 : undefined, right: h.includes('r') ? -5 : undefined, cursor: h === 'tl' || h === 'br' ? 'nwse-resize' : 'nesw-resize' }}
                            onMouseDown={(e) => handleResizeMouseDown(e, layer.id, h)}
                          />
                        ))}
                        <button className="absolute -top-3 -right-3 z-20 w-5 h-5 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center shadow-lg transition-colors" onClick={(e) => { e.stopPropagation(); deleteLayer(layer.id) }}>
                          <Trash2 className="w-2.5 h-2.5 text-white" />
                        </button>
                      </>
                    )}
                  </div>
                )
              })}
              {isDragOver && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-500/10 pointer-events-none z-50">
                  <div className="px-4 py-2 bg-red-600 rounded-lg text-white text-xs font-bold uppercase tracking-wider">Drop to add to canvas</div>
                </div>
              )}
            </div>

            {/* Zoom + Fullscreen controls (floating) */}
            <div className="absolute bottom-6 right-6 flex items-center gap-1 bg-[#1e1f22] border border-[#3f4147] rounded-lg px-1.5 py-1 shadow-xl z-10">
              <button onClick={() => setCanvasZoom(prev => Math.max(25, prev - 25))} className="p-1 text-zinc-400 hover:text-white transition-colors"><ZoomOut className="w-3.5 h-3.5" /></button>
              <button onClick={() => setCanvasZoom(100)} className="px-1.5 text-[10px] font-mono text-zinc-300 hover:text-white transition-colors min-w-[36px] text-center">{canvasZoom}%</button>
              <button onClick={() => setCanvasZoom(prev => Math.min(200, prev + 25))} className="p-1 text-zinc-400 hover:text-white transition-colors"><ZoomIn className="w-3.5 h-3.5" /></button>
              <div className="w-px h-4 bg-zinc-700 mx-0.5" />
              <button onClick={toggleFullscreen} className="p-1 text-zinc-400 hover:text-white transition-colors"><Maximize2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>

          {/* ─── QR Code + Join Bar (Bottom) ─── */}
          <div className="h-12 bg-[#1a1a1c] border-t border-[#2b2d31] flex items-center justify-center gap-6 px-4 shrink-0">
            <div className="bg-white p-0.5 rounded">
              <QRCodeSVG value={joinUrl} size={32} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-zinc-500">Join at</span>
              <span className="text-[10px] text-zinc-300 font-mono">{typeof window !== 'undefined' ? window.location.origin : ''}/join</span>
            </div>
            <div className="h-4 w-px bg-zinc-700" />
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-zinc-500">Code:</span>
              <span className="text-lg font-mono font-bold text-white tracking-[0.15em]">{session.room_code}</span>
            </div>
          </div>
        </div>

        {/* ─── Push Panel (Right) ─── */}
        <PushPanel layers={layers} pendingLayers={pendingLayers} onAddPendingLayer={l => setPendingLayers(prev => [...prev, l])} onRemovePendingLayer={id => setPendingLayers(prev => prev.filter(l => l.id !== id))} onPush={handlePush} onClear={() => setPendingLayers([])} />
      </div>

      {/* ─── End Confirm Dialog ─── */}
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

/* ─── Event Button ─── */

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
