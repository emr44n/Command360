'use client'

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import {
  FolderOpen, Type, Shapes, Film, Sparkles, Settings2,
  Play, Square, SkipBack, Layers, Plus, Trash2 as Trash2Icon, Copy, Monitor,
  Pencil, Image, Undo2, Redo2, Layout, Save,
} from 'lucide-react'
import type {
  Slide,
  StudioContent,
  StudioLayer,
  StudioClip,
  StudioKeyframe,
  StudioEvent,
  StudioEventCategory,
  StudioLayerState,
} from '@/types/slide'
import { StudioGallery } from '@/components/studio/StudioGallery'
import { StudioCanvas } from '@/components/studio/StudioCanvas'
import { StudioProperties } from '@/components/studio/StudioProperties'
import { StudioTimeline } from '@/components/studio/StudioTimeline'
import { StudioEventSettings } from '@/components/studio/StudioEventSettings'
import { StudioCctvEditor } from '@/components/studio/StudioCctvEditor'
import { migrateStudioContent } from '@/lib/studio/migrate-studio-content'
import { addTrackForLayer } from '@/lib/studio/timeline-manager'
import { playEvent } from '@/lib/studio/event-playback'
import { useStudioStore } from '@/stores/studioStore'
import { generateLayerId } from '@/lib/utils/studio-utils'
import { TemplateGallery, saveAsTemplate } from '@/components/studio/TemplateGallery'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

interface StudioEditorProps {
  content: StudioContent
  onContentChange: (content: StudioContent) => void
  slides?: Slide[]
  selectedSlideId?: string | null
  onSelectSlide?: (id: string) => void
  onAddSlide?: () => void
  onAddCctvSlide?: () => void
  onRenameSlide?: (slideId: string, newTitle: string) => void
  onDeleteSlide?: (id: string) => void
  onDuplicateSlide?: (id: string) => void
  onReorderSlides?: (fromIndex: number, toIndex: number) => void
}

/* ── CCTV Live Preview — renders scene layers in grid on the canvas area ── */
function CctvLivePreview({ content, slides }: { content: StudioContent; slides: Slide[] }) {
  const layout = content.cctvLayout || '4'
  const slots = content.cctvSlots || []
  const count = parseInt(layout, 10)

  const gridStyle: React.CSSProperties = (() => {
    switch (layout) {
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
    <div
      className="w-full max-w-4xl aspect-video rounded-lg overflow-hidden border border-[#3f4147] shadow-2xl"
      style={{ display: 'grid', gap: '2px', background: '#000', ...gridStyle }}
    >
      {Array.from({ length: count }, (_, i) => {
        const slideId = slots[i]
        const scene = slideId ? slides.find(s => s.id === slideId) : null
        const sceneContent = scene?.content as StudioContent | undefined
        const sceneLayers = sceneContent?.layers || []
        const canvasBg = sceneContent?.canvas?.backgroundColor || '#1a1a1a'

        return (
          <div
            key={i}
            className="relative overflow-hidden"
            style={{
              backgroundColor: canvasBg,
              gridRow: layout === '3' && i === 0 ? 'span 2' : undefined,
            }}
          >
            {/* Scene label */}
            <div className="absolute top-1 left-1 z-10 px-1.5 py-0.5 rounded bg-black/60 text-[8px] text-white/70 font-medium">
              {scene ? (scene.title || `Scene ${slides.indexOf(scene) + 1}`) : `View ${i + 1}`}
            </div>

            {scene && sceneLayers.length > 0 ? (
              /* Render scene layers as positioned elements */
              sceneLayers.map(layer => {
                if (!layer.visible) return null
                if (layer.type === 'audio') return null // Audio doesn't render on canvas
                const src = layer.src
                if (!src) {
                  if (layer.type === 'text') {
                    return (
                      <div
                        key={layer.id}
                        className="absolute"
                        style={{
                          left: `${layer.x}%`, top: `${layer.y}%`,
                          width: `${layer.width}%`, height: `${layer.height}%`,
                          color: layer.color || '#fff',
                          fontSize: `${(layer.fontSize || 24) * 0.4}px`,
                          opacity: layer.opacity,
                          transform: `rotate(${layer.rotation}deg)`,
                          transformOrigin: 'center center',
                          overflow: 'hidden',
                        }}
                      >
                        {layer.text}
                      </div>
                    )
                  }
                  if (layer.type === 'shape') {
                    return (
                      <div
                        key={layer.id}
                        className="absolute"
                        style={{
                          left: `${layer.x}%`, top: `${layer.y}%`,
                          width: `${layer.width}%`, height: `${layer.height}%`,
                          backgroundColor: layer.color || '#666',
                          opacity: layer.opacity,
                          transform: `rotate(${layer.rotation}deg)`,
                          transformOrigin: 'center center',
                        }}
                      />
                    )
                  }
                  return null
                }
                return layer.type === 'video' ? (
                  <video
                    key={layer.id}
                    src={src}
                    className="absolute object-contain pointer-events-none"
                    style={{
                      left: `${layer.x}%`, top: `${layer.y}%`,
                      width: `${layer.width}%`, height: `${layer.height}%`,
                      opacity: layer.opacity,
                      transform: `rotate(${layer.rotation}deg)`,
                      transformOrigin: 'center center',
                    }}
                    autoPlay loop muted playsInline
                  />
                ) : (
                  <img
                    key={layer.id}
                    src={src}
                    alt={layer.name}
                    className="absolute object-contain pointer-events-none"
                    style={{
                      left: `${layer.x}%`, top: `${layer.y}%`,
                      width: `${layer.width}%`, height: `${layer.height}%`,
                      opacity: layer.opacity,
                      transform: `rotate(${layer.rotation}deg)`,
                      transformOrigin: 'center center',
                    }}
                  />
                )
              })
            ) : (
              /* Empty slot — no signal */
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Monitor className="w-5 h-5 text-zinc-700 mx-auto mb-1" />
                  <p className="text-[8px] text-zinc-700 uppercase tracking-wider">No Signal</p>
                </div>
              </div>
            )}

            {/* Recording indicator dot */}
            {scene && (
              <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            )}
          </div>
        )
      })}
    </div>
  )
}

export function StudioEditor({
  content,
  onContentChange,
  slides,
  selectedSlideId: activeSlideId,
  onSelectSlide,
  onAddSlide,
  onAddCctvSlide,
  onRenameSlide,
  onDeleteSlide,
  onDuplicateSlide,
  onReorderSlides,
}: StudioEditorProps) {
  // Migration on first load
  const migratedRef = useRef(false)
  useEffect(() => {
    if (!migratedRef.current) {
      migratedRef.current = true
      const migrated = migrateStudioContent(content)
      if (migrated !== content) {
        onContentChange(migrated)
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Zustand store
  const { selectedLayerId, setSelectedLayerId, selectedEventId, setSelectedEventId } = useStudioStore()

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const rafRef = useRef<number | null>(null)
  const lastFrameRef = useRef<number>(0)

  // Audio playback refs
  const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map())

  // Undo / Redo
  const [undoStack, setUndoStack] = useState<StudioContent[]>([])
  const [redoStack, setRedoStack] = useState<StudioContent[]>([])
  const MAX_HISTORY = 50

  // Event animation state
  const [eventOverrides, setEventOverrides] = useState<Record<string, Partial<StudioLayerState>>>({})
  const eventControllerRef = useRef<{ cancel: () => void } | null>(null)

  const totalDuration = content.totalDuration ?? 10000

  // rAF playback loop
  useEffect(() => {
    if (!isPlaying) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      return
    }
    lastFrameRef.current = performance.now()

    const tick = (now: number) => {
      const delta = now - lastFrameRef.current
      lastFrameRef.current = now
      setCurrentTime((prev) => {
        const next = prev + delta
        if (next >= totalDuration) {
          setIsPlaying(false)
          return totalDuration
        }
        return next
      })
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [isPlaying, totalDuration])

  // Audio playback sync — create/update audio elements for audio layers
  useEffect(() => {
    const audioLayers = content.layers.filter((l) => l.type === 'audio' && l.src)
    const existingIds = new Set(audioLayers.map((l) => l.id))

    // Remove audio elements for layers that no longer exist
    for (const [id, el] of audioRefs.current) {
      if (!existingIds.has(id)) {
        el.pause()
        audioRefs.current.delete(id)
      }
    }

    // Create or update audio elements
    for (const layer of audioLayers) {
      let el = audioRefs.current.get(layer.id)
      if (!el) {
        el = new Audio(layer.src!)
        audioRefs.current.set(layer.id, el)
      }
      if (el.src !== layer.src) {
        el.src = layer.src!
      }
      el.loop = layer.audioLoop ?? false
      el.volume = layer.volume ?? 1
    }
  }, [content.layers])

  // Start/stop audio with playback
  useEffect(() => {
    const audioLayers = content.layers.filter((l) => l.type === 'audio' && l.src && l.visible)
    const tracks = content.tracks ?? []

    for (const layer of audioLayers) {
      const el = audioRefs.current.get(layer.id)
      if (!el) continue

      // Check if layer has a track/clip active at current time
      const track = tracks.find((t) => t.layerId === layer.id)
      let isActive = true
      if (track && !track.muted && track.clips.length > 0) {
        isActive = track.clips.some(
          (c) => currentTime >= c.startTime && currentTime < c.startTime + c.duration
        )
      }
      if (track?.hidden) isActive = false

      if (isPlaying && isActive) {
        // Sync currentTime (convert ms to seconds)
        const targetTime = currentTime / 1000
        if (Math.abs(el.currentTime - targetTime) > 0.3) {
          el.currentTime = targetTime
        }
        if (el.paused) el.play().catch(() => {})
      } else {
        if (!el.paused) el.pause()
      }
    }
  }, [isPlaying, currentTime, content.layers, content.tracks])

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      for (const [, el] of audioRefs.current) {
        el.pause()
      }
      audioRefs.current.clear()
    }
  }, [])

  // Derived data
  const layers = content.layers
  const tracks = content.tracks ?? []
  const events = content.events ?? []
  const eventCategories = content.eventCategories ?? []

  const selectedLayer = useMemo(
    () => layers.find((l) => l.id === selectedLayerId) ?? null,
    [layers, selectedLayerId]
  )

  const selectedEvent = useMemo(
    () => events.find((e) => e.id === selectedEventId) ?? null,
    [events, selectedEventId]
  )

  // Find the active clip for the selected layer at current time
  const selectedClip = useMemo(() => {
    if (!selectedLayerId) return null
    const track = tracks.find((t) => t.layerId === selectedLayerId)
    if (!track) return null
    return (
      track.clips.find(
        (c) => currentTime >= c.startTime && currentTime < c.startTime + c.duration
      ) ?? null
    )
  }, [selectedLayerId, tracks, currentTime])

  // Undo / Redo helpers
  const pushUndo = useCallback(() => {
    setUndoStack(prev => [...prev.slice(-(MAX_HISTORY - 1)), content])
    setRedoStack([]) // Clear redo on new action
  }, [content])

  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return
    const prev = undoStack[undoStack.length - 1]
    setRedoStack(r => [...r, content])
    setUndoStack(s => s.slice(0, -1))
    onContentChange(prev)
  }, [undoStack, content, onContentChange])

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return
    const next = redoStack[redoStack.length - 1]
    setUndoStack(s => [...s, content])
    setRedoStack(r => r.slice(0, -1))
    onContentChange(next)
  }, [redoStack, content, onContentChange])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        handleUndo()
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault()
        handleRedo()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleUndo, handleRedo])

  // Content mutation helpers
  const updateContent = useCallback(
    (updates: Partial<StudioContent>) => {
      pushUndo()
      onContentChange({ ...content, ...updates })
    },
    [content, onContentChange, pushUndo]
  )

  // Layer operations
  const handleAddLayer = useCallback(
    (partial: Partial<StudioLayer>) => {
      const layer: StudioLayer = {
        id: generateLayerId(),
        name: partial.name || 'New Layer',
        type: partial.type || 'image',
        src: partial.src,
        x: partial.x ?? 10,
        y: partial.y ?? 10,
        width: partial.width ?? 30,
        height: partial.height ?? 30,
        rotation: 0,
        zIndex: layers.length,
        opacity: 1,
        blendMode: 'normal',
        visible: true,
        locked: false,
        ...partial,
      } as StudioLayer

      const withLayer: StudioContent = { ...content, layers: [...layers, layer] }
      const withTrack = addTrackForLayer(withLayer, layer)
      onContentChange(withTrack)
      setSelectedLayerId(layer.id)
    },
    [content, layers, onContentChange, setSelectedLayerId]
  )

  const handleUpdateLayer = useCallback(
    (id: string, updates: Partial<StudioLayer>) => {
      updateContent({
        layers: layers.map((l) => (l.id === id ? { ...l, ...updates } : l)),
      })
    },
    [layers, updateContent]
  )

  const handleDeleteLayer = useCallback(
    (id: string) => {
      updateContent({
        layers: layers.filter((l) => l.id !== id),
        tracks: tracks.filter((t) => t.layerId !== id),
      })
      if (selectedLayerId === id) setSelectedLayerId(null)
    },
    [layers, tracks, selectedLayerId, updateContent, setSelectedLayerId]
  )

  const handleDuplicateLayer = useCallback(
    (id: string) => {
      const original = layers.find((l) => l.id === id)
      if (!original) return
      const dup: StudioLayer = {
        ...original,
        id: generateLayerId(),
        name: `${original.name} (copy)`,
        x: original.x + 2,
        y: original.y + 2,
      }
      const withLayer: StudioContent = { ...content, layers: [...layers, dup] }
      const withTrack = addTrackForLayer(withLayer, dup)
      onContentChange(withTrack)
      setSelectedLayerId(dup.id)
    },
    [content, layers, onContentChange, setSelectedLayerId]
  )

  // Drop asset from gallery onto canvas
  const handleDropAsset = useCallback(
    (type: 'image' | 'video', src: string, x: number, y: number) => {
      handleAddLayer({
        type,
        src,
        name: type === 'image' ? 'Dropped Image' : 'Dropped Video',
        x,
        y,
        width: type === 'video' ? 40 : 30,
        height: 30,
        ...(type === 'video' ? { loop: true, autoplay: true, muted: true } : {}),
      })
    },
    [handleAddLayer]
  )

  // Clip operations
  const handleUpdateClip = useCallback(
    (updates: Partial<StudioClip>) => {
      if (!selectedClip) return
      updateContent({
        tracks: tracks.map((t) => ({
          ...t,
          clips: t.clips.map((c) =>
            c.id === selectedClip.id ? { ...c, ...updates } : c
          ),
        })),
      })
    },
    [selectedClip, tracks, updateContent]
  )

  // Keyframe operations
  const handleAddKeyframe = useCallback(
    (property: string, value: number | boolean, time: number) => {
      if (!selectedClip) return
      const kf: StudioKeyframe = {
        id: crypto.randomUUID(),
        time,
        property: property as StudioKeyframe['property'],
        value,
        easing: 'linear',
      }
      updateContent({
        tracks: tracks.map((t) => ({
          ...t,
          clips: t.clips.map((c) =>
            c.id === selectedClip.id
              ? { ...c, keyframes: [...c.keyframes, kf] }
              : c
          ),
        })),
      })
    },
    [selectedClip, tracks, updateContent]
  )

  const handleDeleteKeyframe = useCallback(
    (keyframeId: string) => {
      if (!selectedClip) return
      updateContent({
        tracks: tracks.map((t) => ({
          ...t,
          clips: t.clips.map((c) =>
            c.id === selectedClip.id
              ? { ...c, keyframes: c.keyframes.filter((k) => k.id !== keyframeId) }
              : c
          ),
        })),
      })
    },
    [selectedClip, tracks, updateContent]
  )

  // Event operations
  const handleUpdateEvents = useCallback(
    (updatedEvents: StudioEvent[]) => {
      updateContent({ events: updatedEvents })
    },
    [updateContent]
  )

  const handleUpdateCategories = useCallback(
    (updatedCategories: StudioEventCategory[]) => {
      updateContent({ eventCategories: updatedCategories })
    },
    [updateContent]
  )

  const handleUpdateEvent = useCallback(
    (updatedEvent: StudioEvent) => {
      updateContent({
        events: events.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)),
      })
    },
    [events, updateContent]
  )

  const handleDeleteEvent = useCallback(
    (eventId: string) => {
      updateContent({
        events: events.filter((e) => e.id !== eventId),
      })
      if (selectedEventId === eventId) setSelectedEventId(null)
    },
    [events, selectedEventId, updateContent, setSelectedEventId]
  )

  const handleTriggerEvent = useCallback(
    (eventId: string) => {
      const event = events.find((e) => e.id === eventId)
      if (!event || event.actions.length === 0) return

      // Cancel any running event animation
      eventControllerRef.current?.cancel()

      const controller = playEvent(
        event,
        layers,
        (overrides) => setEventOverrides(overrides),
        () => setEventOverrides({})
      )
      eventControllerRef.current = controller
    },
    [events, layers]
  )

  // Cleanup event controller on unmount
  useEffect(() => {
    return () => { eventControllerRef.current?.cancel() }
  }, [])

  // Timeline-specific state
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null)
  const [zoomLevel, setZoomLevel] = useState(100)

  // Panel visibility
  const [showLeftPanel, setShowLeftPanel] = useState(true)
  const [showProperties, setShowProperties] = useState(true)
  const [showTemplateName, setShowTemplateName] = useState(false)
  const [templateNameInput, setTemplateNameInput] = useState('')
  const [showTimeline, setShowTimeline] = useState(true)

  // Resizable panel widths
  const [leftPanelWidth, setLeftPanelWidth] = useState(220)
  const [propertiesWidth, setPropertiesWidth] = useState(240)
  const [timelineHeight, setTimelineHeight] = useState(200)

  const leftPanelDragging = useRef(false)
  const propertiesDragging = useRef(false)
  const timelineDragging = useRef(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (leftPanelDragging.current) {
        setLeftPanelWidth(Math.max(180, Math.min(400, e.clientX)))
      }
      if (propertiesDragging.current) {
        setPropertiesWidth(Math.max(200, Math.min(450, window.innerWidth - e.clientX)))
      }
      if (timelineDragging.current) {
        setTimelineHeight(Math.max(150, Math.min(500, window.innerHeight - e.clientY)))
      }
    }
    const handleMouseUp = () => {
      leftPanelDragging.current = false
      propertiesDragging.current = false
      timelineDragging.current = false
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  const startDrag = (which: 'left' | 'properties' | 'timeline') => {
    if (which === 'left') leftPanelDragging.current = true
    if (which === 'properties') propertiesDragging.current = true
    if (which === 'timeline') timelineDragging.current = true
    document.body.style.cursor = which === 'timeline' ? 'row-resize' : 'col-resize'
    document.body.style.userSelect = 'none'
  }

  // Determine if slides panel is available
  const hasSlides = !!(slides && slides.length > 0 && onSelectSlide)

  // Icon sidebar items — each has its own accent color
  const SIDEBAR_ICONS = [
    ...(hasSlides ? [{ icon: Layers, label: 'Scenes', panel: 'slides' as const, activeClass: 'bg-violet-600/20 text-violet-400' }] : []),
    { icon: FolderOpen, label: 'Assets', panel: 'gallery' as const, activeClass: 'bg-red-600/20 text-red-400' },
    { icon: Type, label: 'Text', panel: 'text' as const, activeClass: 'bg-sky-600/20 text-sky-400' },
    { icon: Shapes, label: 'Shapes', panel: 'shapes' as const, activeClass: 'bg-emerald-600/20 text-emerald-400' },
    { icon: Sparkles, label: 'Events', panel: 'events' as const, activeClass: 'bg-amber-600/20 text-amber-400' },
    { icon: Layout, label: 'Templates', panel: 'templates' as const, activeClass: 'bg-pink-600/20 text-pink-400' },
  ]

  const [activePanel, setActivePanel] = useState<'slides' | 'gallery' | 'events' | 'text' | 'shapes' | 'templates'>(hasSlides ? 'slides' : 'gallery')

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#1e1f22]" style={{ minHeight: 0 }}>
      {/* Icon Sidebar — Discord-style dark rail */}
      <div className="w-[52px] shrink-0 bg-[#1e1f22] flex flex-col items-center py-3 gap-1.5">
        {SIDEBAR_ICONS.map((item) => {
          const isActive = item.panel && showLeftPanel && activePanel === item.panel
          return (
            <Tooltip key={item.label}><TooltipTrigger asChild>
            <button
              onClick={() => {
                if (showLeftPanel && activePanel === item.panel) {
                  setShowLeftPanel(false)
                } else {
                  setActivePanel(item.panel)
                  setShowLeftPanel(true)
                }
              }}
              className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all duration-200 cursor-pointer ${
                isActive
                  ? `${item.activeClass} shadow-lg`
                  : 'text-zinc-500 hover:text-zinc-200 hover:bg-[#35363c]'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span className="text-[7px] leading-none font-medium">{item.label}</span>
            </button>
            </TooltipTrigger><TooltipContent side="right">{item.label}</TooltipContent></Tooltip>
          )
        })}

        <div className="flex-1" />

        {/* Save as Template */}
        <Tooltip><TooltipTrigger asChild>
        <button
          onClick={() => setShowTemplateName(true)}
          className="w-10 h-10 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all duration-200 cursor-pointer text-zinc-500 hover:text-zinc-200 hover:bg-[#35363c]"
        >
          <Save className="w-4 h-4" />
          <span className="text-[7px] leading-none font-medium">Save</span>
        </button>
        </TooltipTrigger><TooltipContent side="right">Save as Template</TooltipContent></Tooltip>

        {/* Divider */}
        <div className="w-6 h-px bg-zinc-700/50 mb-1" />

        {/* Panel toggles at bottom */}
        <Tooltip><TooltipTrigger asChild>
        <button
          onClick={() => setShowProperties(v => !v)}
          className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all duration-200 cursor-pointer ${
            showProperties ? 'bg-[#35363c] text-zinc-300' : 'text-zinc-600 hover:text-zinc-400 hover:bg-[#35363c]'
          }`}
        >
          <Settings2 className="w-4 h-4" />
          <span className="text-[7px] leading-none font-medium">Props</span>
        </button>
        </TooltipTrigger><TooltipContent side="right">Properties</TooltipContent></Tooltip>
        <Tooltip><TooltipTrigger asChild>
        <button
          onClick={() => setShowTimeline(v => !v)}
          className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all duration-200 cursor-pointer ${
            showTimeline ? 'bg-[#35363c] text-zinc-300' : 'text-zinc-600 hover:text-zinc-400 hover:bg-[#35363c]'
          }`}
        >
          <Film className="w-4 h-4" />
          <span className="text-[7px] leading-none font-medium">Time</span>
        </button>
        </TooltipTrigger><TooltipContent side="right">Timeline</TooltipContent></Tooltip>
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        {/* Top: Left panel | Canvas | Properties */}
        <div className="flex flex-1 min-h-0">
          {/* Left: Slides / Asset / Events panel — Discord channel list color */}
          {showLeftPanel && (
            <>
              <div className="shrink-0 bg-[#2b2d31] overflow-hidden overflow-x-hidden flex flex-col border-r border-[#1e1f22]" style={{ width: leftPanelWidth }}>
                {/* Active panel accent strip */}
                <div className="h-[2px] shrink-0" style={{
                  backgroundColor: activePanel === 'slides' ? '#7c3aed' : activePanel === 'gallery' ? '#ef4444' : activePanel === 'text' ? '#0ea5e9' : activePanel === 'shapes' ? '#10b981' : activePanel === 'templates' ? '#ec4899' : '#f59e0b'
                }} />
                {activePanel === 'slides' && hasSlides ? (
                  <SlidesPanel
                    slides={slides!}
                    activeSlideId={activeSlideId ?? null}
                    onSelectSlide={onSelectSlide!}
                    onAddSlide={onAddSlide}
                    onAddCctvSlide={onAddCctvSlide}
                    onRenameSlide={onRenameSlide}
                    onDeleteSlide={onDeleteSlide}
                    onDuplicateSlide={onDuplicateSlide}
                    onReorderSlides={onReorderSlides}
                  />
                ) : activePanel === 'text' ? (
                  <TextPanel
                    layers={layers}
                    onAddLayer={handleAddLayer}
                    onSelectLayer={(id) => setSelectedLayerId(id)}
                    onDeleteLayer={handleDeleteLayer}
                    selectedLayerId={selectedLayerId}
                  />
                ) : activePanel === 'shapes' ? (
                  <ShapesPanel
                    layers={layers}
                    onAddLayer={handleAddLayer}
                    onSelectLayer={(id) => setSelectedLayerId(id)}
                    onDeleteLayer={handleDeleteLayer}
                    onUpdateLayer={handleUpdateLayer}
                    selectedLayerId={selectedLayerId}
                  />
                ) : activePanel === 'templates' ? (
                  <TemplateGallery
                    onUseTemplate={(templateContent) => {
                      onContentChange(templateContent)
                    }}
                  />
                ) : activePanel === 'events' ? (
                  <StudioGallery
                    layers={layers}
                    onAddLayer={handleAddLayer}
                    onSelectLayer={(id) => setSelectedLayerId(id)}
                    onDeleteLayer={handleDeleteLayer}
                    onReorderLayers={(fromIndex, toIndex) => {
                      const reordered = [...layers]
                      const [moved] = reordered.splice(fromIndex, 1)
                      reordered.splice(toIndex, 0, moved)
                      const newLayers = reordered.map((l, i) => ({ ...l, zIndex: i }))
                      // Sync timeline tracks to match new layer order
                      const reorderedTracks = newLayers.map(l => tracks.find(t => t.layerId === l.id)).filter(Boolean)
                      const unmatchedTracks = tracks.filter(t => !newLayers.some(l => l.id === t.layerId))
                      updateContent({ layers: newLayers, tracks: [...reorderedTracks, ...unmatchedTracks] as typeof tracks })
                    }}
                    events={events}
                    eventCategories={eventCategories}
                    onUpdateEvents={handleUpdateEvents}
                    onUpdateCategories={handleUpdateCategories}
                    onTriggerEvent={handleTriggerEvent}
                    initialTab="events"
                  />
                ) : (
                  <StudioGallery
                    layers={layers}
                    onAddLayer={handleAddLayer}
                    onSelectLayer={(id) => setSelectedLayerId(id)}
                    onDeleteLayer={handleDeleteLayer}
                    onReorderLayers={(fromIndex, toIndex) => {
                      const reordered = [...layers]
                      const [moved] = reordered.splice(fromIndex, 1)
                      reordered.splice(toIndex, 0, moved)
                      const newLayers = reordered.map((l, i) => ({ ...l, zIndex: i }))
                      // Sync timeline tracks to match new layer order
                      const reorderedTracks = newLayers.map(l => tracks.find(t => t.layerId === l.id)).filter(Boolean)
                      const unmatchedTracks = tracks.filter(t => !newLayers.some(l => l.id === t.layerId))
                      updateContent({ layers: newLayers, tracks: [...reorderedTracks, ...unmatchedTracks] as typeof tracks })
                    }}
                    events={events}
                    eventCategories={eventCategories}
                    onUpdateEvents={handleUpdateEvents}
                    onUpdateCategories={handleUpdateCategories}
                    onTriggerEvent={handleTriggerEvent}
                  />
                )}
              </div>
              <div
                className="w-[3px] shrink-0 cursor-col-resize bg-[#1e1f22] hover:bg-indigo-500/60 transition-colors"
                onMouseDown={() => startDrag('left')}
              />
            </>
          )}

          {/* Center: Canvas area */}
          <div className="flex-1 min-w-0 min-h-0 flex flex-col bg-[#313338]">
            {content.cctvLayout ? (
              /* CCTV: live grid preview of assigned scenes */
              <div className="flex-1 min-h-0 flex items-center justify-center p-4" style={{ background: '#141416', backgroundImage: 'radial-gradient(circle, #1e1f22 1px, transparent 1px)', backgroundSize: '16px 16px' }}>
                <CctvLivePreview
                  content={content}
                  slides={slides || []}
                />
              </div>
            ) : (
              <>
                {/* Normal canvas */}
                <div className="flex-1 min-h-0">
                  <StudioCanvas
                    layers={layers}
                    tracks={tracks}
                    currentTime={currentTime}
                    canvasConfig={content.canvas}
                    interactive
                    selectedLayerId={selectedLayerId}
                    onSelectLayer={setSelectedLayerId}
                    onUpdateLayer={handleUpdateLayer}
                    onDropAsset={handleDropAsset}
                    eventOverrides={eventOverrides}
                  />
                </div>
                {/* Transport bar */}
                <div className="h-6 shrink-0 bg-[#2b2d31] border-t border-[#1e1f22] flex items-center justify-center gap-3 px-3">
                  <span className="text-[9px] font-mono text-emerald-400 tabular-nums">
                    {formatTime(currentTime)}
                  </span>
                  <div className="flex items-center gap-1">
                    <Tooltip><TooltipTrigger asChild>
                    <button onClick={handleUndo} disabled={undoStack.length === 0}
                      className="w-6 h-6 rounded-md flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:pointer-events-none transition-colors cursor-pointer">
                      <Undo2 className="w-3.5 h-3.5" />
                    </button>
                    </TooltipTrigger><TooltipContent>Undo (Ctrl+Z)</TooltipContent></Tooltip>
                    <Tooltip><TooltipTrigger asChild>
                    <button onClick={handleRedo} disabled={redoStack.length === 0}
                      className="w-6 h-6 rounded-md flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:pointer-events-none transition-colors cursor-pointer">
                      <Redo2 className="w-3.5 h-3.5" />
                    </button>
                    </TooltipTrigger><TooltipContent>Redo (Ctrl+Shift+Z)</TooltipContent></Tooltip>
                    <button onClick={() => { setIsPlaying(false); setCurrentTime(0) }} className="w-5 h-5 rounded flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
                      <SkipBack className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => {
                        if (isPlaying) { setIsPlaying(false) } else { if (currentTime >= totalDuration) setCurrentTime(0); setIsPlaying(true) }
                      }}
                      className="w-5 h-5 rounded-md flex items-center justify-center bg-zinc-700 hover:bg-zinc-600 text-white transition-colors cursor-pointer"
                    >
                      {isPlaying ? <Square className="w-2 h-2 fill-current" /> : <Play className="w-2.5 h-2.5 fill-current ml-0.5" />}
                    </button>
                  </div>
                  <span className="text-[9px] font-mono text-zinc-500 tabular-nums">
                    / {formatTime(totalDuration)}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Right: Properties or Event Settings */}
          {showProperties && (
            <>
              <div
                className="w-[3px] shrink-0 cursor-col-resize bg-[#1e1f22] hover:bg-indigo-500/60 transition-colors"
                onMouseDown={() => startDrag('properties')}
              />
              <div className="shrink-0 bg-[#2b2d31] border-l border-[#1e1f22] overflow-y-auto overflow-x-hidden" style={{ width: propertiesWidth }}>
                {content.cctvLayout ? (
                  /* CCTV settings in properties panel */
                  <StudioCctvEditor
                    content={content}
                    onContentChange={onContentChange}
                    slides={slides || []}
                    currentSlideId={activeSlideId || ''}
                  />
                ) : selectedEvent ? (
                  <StudioEventSettings
                    event={selectedEvent}
                    layers={layers}
                    categories={eventCategories}
                    onUpdateEvent={handleUpdateEvent}
                    onDeleteEvent={handleDeleteEvent}
                    onTriggerEvent={handleTriggerEvent}
                  />
                ) : selectedLayer ? (
                  <StudioProperties
                    layer={selectedLayer}
                    onUpdate={(updates) => {
                      if (selectedLayerId) handleUpdateLayer(selectedLayerId, updates)
                    }}
                    onDelete={handleDeleteLayer}
                    onDuplicate={handleDuplicateLayer}
                    selectedClip={selectedClip}
                    onUpdateClip={handleUpdateClip}
                    onAddKeyframe={handleAddKeyframe}
                    onDeleteKeyframe={handleDeleteKeyframe}
                    currentTime={currentTime}
                  />
                ) : (
                  <SceneProperties
                    content={content}
                    onContentChange={onContentChange}
                    slideName={slides?.find(s => s.id === activeSlideId)?.title || ''}
                    onRename={(name) => onRenameSlide?.(activeSlideId || '', name)}
                    onOpenPanel={(panel) => { setActivePanel(panel); setShowLeftPanel(true) }}
                  />
                )}
              </div>
            </>
          )}
        </div>

        {/* Timeline resize splitter */}
        {showTimeline && !content.cctvLayout && (
          <div
            className="h-[5px] shrink-0 cursor-row-resize bg-[#1e1f22] hover:bg-indigo-500/60 transition-colors flex items-center justify-center group"
            onMouseDown={() => startDrag('timeline')}
          >
            <div className="w-10 h-[2px] rounded-full bg-zinc-600 group-hover:bg-indigo-400 transition-colors" />
          </div>
        )}

        {/* Bottom: Timeline */}
        {showTimeline && !content.cctvLayout && (
          <div className="shrink-0 bg-[#232428] overflow-hidden border-t border-[#1e1f22]" style={{ height: timelineHeight }}>
            <StudioTimeline
              content={content}
              onContentChange={(updates) => {
                onContentChange({ ...content, ...updates })
              }}
              selectedClipId={selectedClipId}
              selectedLayerId={selectedLayerId}
              onSelectClip={setSelectedClipId}
              onSelectLayer={setSelectedLayerId}
              playheadPosition={currentTime}
              isPlaying={isPlaying}
              onPlayheadChange={setCurrentTime}
              onPlay={() => {
                if (currentTime >= totalDuration) setCurrentTime(0)
                setIsPlaying(true)
              }}
              onPause={() => setIsPlaying(false)}
              onStop={() => {
                setIsPlaying(false)
                setCurrentTime(0)
              }}
              zoomLevel={zoomLevel}
              onZoomChange={setZoomLevel}
            />
          </div>
        )}
      </div>
      {/* Template name dialog */}
      {showTemplateName && (
        <div className="fixed inset-0 z-[300] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowTemplateName(false)}>
          <div className="bg-[#1e1f22] border border-[#3f4147] rounded-xl p-5 max-w-xs w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-sm font-semibold text-white mb-3">Save as Template</h3>
            <input type="text" value={templateNameInput} onChange={e => setTemplateNameInput(e.target.value)} onKeyDown={async e => { if (e.key === 'Enter' && templateNameInput.trim()) { saveAsTemplate(content, templateNameInput.trim()); const { toast } = await import('sonner'); toast.success('Saved as template', { duration: 2000 }); setShowTemplateName(false); setTemplateNameInput('') } }} placeholder="Template name..." className="w-full h-8 px-3 text-sm rounded-lg border border-[#3f4147] bg-[#2b2d31] text-white placeholder:text-zinc-500 focus:outline-none focus:border-red-500 mb-3" autoFocus />
            <div className="flex gap-2 justify-end">
              <button onClick={() => { setShowTemplateName(false); setTemplateNameInput('') }} className="px-3 py-1.5 text-[11px] font-medium rounded-lg bg-[#2b2d31] text-zinc-300 hover:bg-[#35363c] transition-colors">Cancel</button>
              <button onClick={async () => { if (!templateNameInput.trim()) return; saveAsTemplate(content, templateNameInput.trim()); const { toast } = await import('sonner'); toast.success('Saved as template', { duration: 2000 }); setShowTemplateName(false); setTemplateNameInput('') }} className="px-3 py-1.5 text-[11px] font-medium rounded-lg bg-red-600 text-white hover:bg-red-500 transition-colors">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── CCTV Canvas Preview ─── */

function CctvCanvasPreview({ content, slides }: { content: StudioContent; slides: Slide[] }) {
  const layout = content.cctvLayout || '4'
  const slots = content.cctvSlots || []
  const slotCount = parseInt(layout, 10)

  const gridStyle = (): React.CSSProperties => {
    switch (layout) {
      case '1': return { gridTemplateColumns: '1fr', gridTemplateRows: '1fr' }
      case '2': return { gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr' }
      case '3': return { gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr' }
      case '4': return { gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr' }
      case '6': return { gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr 1fr' }
      case '8': return { gridTemplateColumns: '1fr 1fr 1fr 1fr', gridTemplateRows: '1fr 1fr' }
      default: return { gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr' }
    }
  }

  return (
    <div
      className="w-full max-w-4xl rounded-lg overflow-hidden shadow-2xl shadow-black/60"
      style={{ aspectRatio: '16/9', display: 'grid', gap: '2px', backgroundColor: '#111', ...gridStyle() }}
    >
      {Array.from({ length: slotCount }, (_, i) => {
        const slideId = slots[i]
        const assigned = slideId ? slides.find(s => s.id === slideId) : null
        const assignedContent = assigned ? (assigned.content as StudioContent) : null
        const slideIdx = assigned ? slides.findIndex(s => s.id === assigned.id) : -1
        const label = assigned ? (assigned.title || `Scene ${slideIdx + 1}`) : null

        return (
          <div
            key={i}
            className="relative overflow-hidden bg-black"
            style={{ border: '1px solid #222', ...(layout === '3' && i === 0 ? { gridRow: 'span 2' } : {}) }}
          >
            {assignedContent?.layers ? (
              <>
                <div className="absolute inset-0" style={{ backgroundColor: assignedContent.canvas?.backgroundColor || '#000' }}>
                  {assignedContent.layers.filter(l => l.visible).map(layer => (
                    <div
                      key={layer.id}
                      className="absolute"
                      style={{
                        left: `${layer.x}%`, top: `${layer.y}%`,
                        width: `${layer.width}%`, height: `${layer.height}%`,
                        opacity: layer.opacity,
                        transform: `rotate(${layer.rotation}deg)`,
                        transformOrigin: 'center center',
                      }}
                    >
                      {layer.type === 'image' && layer.src && (
                        <img src={layer.src} alt="" className="w-full h-full object-cover" />
                      )}
                      {layer.type === 'video' && layer.src && (
                        <video src={layer.src} className="w-full h-full object-cover" muted autoPlay loop playsInline />
                      )}
                      {layer.type === 'text' && (
                        <span style={{ color: layer.color || '#fff', fontSize: `${(layer.fontSize || 24) * 0.5}px` }}>{layer.text}</span>
                      )}
                      {layer.type === 'shape' && (
                        <div className="w-full h-full" style={{ backgroundColor: layer.color || '#666' }} />
                      )}
                    </div>
                  ))}
                </div>
                {label && (
                  <div className="absolute top-1 left-1 z-10 px-1.5 py-0.5 bg-black/70 rounded text-[9px] font-semibold text-white/80 backdrop-blur-sm">
                    {label}
                  </div>
                )}
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/80">
                <Monitor className="w-5 h-5 text-zinc-700 mb-0.5" />
                <span className="text-[9px] font-mono text-zinc-600 uppercase">No Signal</span>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* Slides Panel */

function SlidesPanel({
  slides,
  activeSlideId,
  onSelectSlide,
  onAddSlide,
  onAddCctvSlide,
  onRenameSlide,
  onDeleteSlide,
  onDuplicateSlide,
  onReorderSlides,
}: {
  slides: Slide[]
  activeSlideId: string | null
  onSelectSlide: (id: string) => void
  onAddSlide?: () => void
  onAddCctvSlide?: () => void
  onRenameSlide?: (slideId: string, newTitle: string) => void
  onDeleteSlide?: (id: string) => void
  onDuplicateSlide?: (id: string) => void
  onReorderSlides?: (fromIndex: number, toIndex: number) => void
}) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [dragFromIndex, setDragFromIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2.5 border-b border-[#1e1f22]">
        <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Scenes</span>
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-2.5">
        {slides.map((slide, index) => {
          const isActive = slide.id === activeSlideId
          const isEditing = editingId === slide.id
          const isCctv = !!(slide.content as StudioContent)?.cctvLayout
          return (
            <div key={slide.id} className="relative">
              {/* Drop indicator line — before this item */}
              {dragFromIndex !== null && dragOverIndex === index && dragFromIndex !== index && (
                <div className="absolute -top-[5px] left-1 right-1 h-[3px] bg-red-500 rounded-full z-50 pointer-events-none" />
              )}
            <div
              draggable={!isEditing}
              onDragStart={(e) => {
                setDragFromIndex(index)
                e.dataTransfer.effectAllowed = 'move'
              }}
              onDragOver={(e) => {
                e.preventDefault()
                e.dataTransfer.dropEffect = 'move'
                const rect = e.currentTarget.getBoundingClientRect()
                const midY = rect.top + rect.height / 2
                setDragOverIndex(e.clientY < midY ? index : index + 1)
              }}
              onDragLeave={() => setDragOverIndex(null)}
              onDrop={(e) => {
                e.preventDefault()
                if (dragFromIndex !== null && dragOverIndex !== null && onReorderSlides) {
                  const toIndex = dragOverIndex > dragFromIndex ? dragOverIndex - 1 : dragOverIndex
                  if (toIndex !== dragFromIndex) onReorderSlides(dragFromIndex, toIndex)
                }
                setDragFromIndex(null)
                setDragOverIndex(null)
              }}
              onDragEnd={() => { setDragFromIndex(null); setDragOverIndex(null) }}
              onClick={() => onSelectSlide(slide.id)}
              className={`w-full rounded-lg overflow-hidden transition-all cursor-grab group relative ${
                dragFromIndex === index ? 'opacity-70 scale-105 shadow-2xl ring-2 ring-red-500 z-50 cursor-grabbing' : ''
              } ${
                isActive && dragFromIndex !== index
                  ? 'ring-2 ring-red-500 ring-offset-1 ring-offset-[#2b2d31]'
                  : dragFromIndex !== index ? 'ring-1 ring-[#3f4147] hover:ring-zinc-500' : ''
              }`}
              style={dragFromIndex === null && dragOverIndex === null ? {} : undefined}
            >
              <div className="relative aspect-video bg-[#1e1f22] flex items-center justify-center">
                {/* Live canvas preview */}
                {(() => {
                  const slideContent = slide.content as StudioContent | undefined
                  const slideLayers = slideContent?.layers || []
                  const canvasBg = slideContent?.canvas?.backgroundColor || '#1e1f22'
                  if (isCctv) {
                    const cctvLayout = slideContent?.cctvLayout || '4'
                    const cctvCount = parseInt(cctvLayout, 10)
                    const cctvSlots = slideContent?.cctvSlots || []
                    const cols = cctvCount <= 2 ? cctvCount : cctvCount <= 4 ? 2 : cctvCount <= 6 ? 3 : 4
                    return (
                      <div className="absolute inset-0 overflow-hidden bg-black p-[1px]" style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '1px' }}>
                        {Array.from({ length: cctvCount }, (_, ci) => {
                          const slotId = cctvSlots[ci]
                          const slotScene = slotId ? slides!.find(s => s.id === slotId) : null
                          const slotContent = slotScene?.content as StudioContent | undefined
                          const slotLayers = slotContent?.layers || []
                          const slotBg = slotContent?.canvas?.backgroundColor || '#1a1a1a'
                          return (
                            <div key={ci} className="relative overflow-hidden" style={{ backgroundColor: slotBg }}>
                              {slotScene && slotLayers.length > 0 ? (
                                slotLayers.map(layer => {
                                  if (!layer.visible) return null
                                  if (layer.type === 'audio') return null
                                  if (!layer.src) {
                                    if (layer.type === 'text') {
                                      return (
                                        <div key={layer.id} className="absolute overflow-hidden pointer-events-none"
                                          style={{ left: `${layer.x}%`, top: `${layer.y}%`, width: `${layer.width}%`, height: `${layer.height}%`, color: layer.color || '#fff', fontSize: '3px', opacity: layer.opacity }}>
                                          {layer.text}
                                        </div>
                                      )
                                    }
                                    if (layer.type === 'shape') {
                                      return (
                                        <div key={layer.id} className="absolute pointer-events-none"
                                          style={{ left: `${layer.x}%`, top: `${layer.y}%`, width: `${layer.width}%`, height: `${layer.height}%`, backgroundColor: layer.color || '#666', opacity: layer.opacity }} />
                                      )
                                    }
                                    return null
                                  }
                                  return layer.type === 'video' ? (
                                    <video key={layer.id} src={layer.src} className="absolute object-contain pointer-events-none"
                                      style={{ left: `${layer.x}%`, top: `${layer.y}%`, width: `${layer.width}%`, height: `${layer.height}%`, opacity: layer.opacity }}
                                      muted playsInline />
                                  ) : (
                                    <img key={layer.id} src={layer.src} alt="" className="absolute object-contain pointer-events-none"
                                      style={{ left: `${layer.x}%`, top: `${layer.y}%`, width: `${layer.width}%`, height: `${layer.height}%`, opacity: layer.opacity }} />
                                  )
                                })
                              ) : (
                                <div className="flex items-center justify-center h-full">
                                  <Monitor className="w-2 h-2 text-zinc-700" />
                                </div>
                              )}
                            </div>
                          )
                        })}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <span className="text-[8px] font-bold text-indigo-400/70 bg-black/60 px-1 py-0.5 rounded">CCTV</span>
                        </div>
                      </div>
                    )
                  }
                  return (
                    <div className="absolute inset-0 overflow-hidden" style={{ backgroundColor: canvasBg }}>
                      {slideLayers.map(layer => {
                        if (!layer.visible || !layer.src) {
                          if (layer.visible && layer.type === 'text') {
                            return (
                              <div key={layer.id} className="absolute overflow-hidden pointer-events-none"
                                style={{ left: `${layer.x}%`, top: `${layer.y}%`, width: `${layer.width}%`, height: `${layer.height}%`, color: layer.color || '#fff', fontSize: `${(layer.fontSize || 24) * 0.3}px`, opacity: layer.opacity }}>
                                {layer.text}
                              </div>
                            )
                          }
                          if (layer.visible && layer.type === 'shape') {
                            return (
                              <div key={layer.id} className="absolute pointer-events-none"
                                style={{ left: `${layer.x}%`, top: `${layer.y}%`, width: `${layer.width}%`, height: `${layer.height}%`, backgroundColor: layer.color || '#666', opacity: layer.opacity }} />
                            )
                          }
                          return null
                        }
                        return layer.type === 'video' ? (
                          <video key={layer.id} src={layer.src} className="absolute object-contain pointer-events-none"
                            style={{ left: `${layer.x}%`, top: `${layer.y}%`, width: `${layer.width}%`, height: `${layer.height}%`, opacity: layer.opacity }}
                            muted playsInline />
                        ) : (
                          <img key={layer.id} src={layer.src} alt="" className="absolute object-contain pointer-events-none"
                            style={{ left: `${layer.x}%`, top: `${layer.y}%`, width: `${layer.width}%`, height: `${layer.height}%`, opacity: layer.opacity }} />
                        )
                      })}
                    </div>
                  )
                })()}
                {/* Scene name label at bottom */}
                {isEditing ? (
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onBlur={() => {
                        if (editTitle.trim() && onRenameSlide) onRenameSlide(slide.id, editTitle.trim())
                        setEditingId(null)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          if (editTitle.trim() && onRenameSlide) onRenameSlide(slide.id, editTitle.trim())
                          setEditingId(null)
                        }
                        if (e.key === 'Escape') setEditingId(null)
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="w-[80%] h-5 text-[10px] text-zinc-100 bg-[#383a40] border border-zinc-600 rounded px-1 text-center outline-none"
                      autoFocus
                    />
                  </div>
                ) : (
                  <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/70 to-transparent px-1.5 py-1">
                    <Tooltip><TooltipTrigger asChild>
                    <span
                      className="text-[9px] text-zinc-300 font-medium flex items-center gap-1 truncate"
                      onDoubleClick={(e) => {
                        e.stopPropagation()
                        setEditTitle(slide.title || (isCctv ? `CCTV ${index + 1}` : `Scene ${index + 1}`))
                        setEditingId(slide.id)
                      }}
                    >
                      {isCctv && <Monitor className="w-2.5 h-2.5 text-indigo-400 shrink-0" />}
                      {slide.title || (isCctv ? `CCTV ${index + 1}` : `Scene ${index + 1}`)}
                    </span>
                    </TooltipTrigger><TooltipContent>Double-click to rename</TooltipContent></Tooltip>
                  </div>
                )}
                {/* Scene number badge */}
                <span className={`absolute top-1 left-1 z-20 text-[9px] font-bold px-1 py-0.5 rounded ${
                  isActive ? 'bg-red-600 text-white' : 'bg-[#383a40]/80 text-zinc-400'
                }`}>
                  {index + 1}
                </span>
                {/* Duplicate & Delete buttons — visible on hover */}
                <div className="absolute top-1 right-1 z-20 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  {onDuplicateSlide && (
                    <Tooltip><TooltipTrigger asChild>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDuplicateSlide(slide.id) }}
                      className="w-5 h-5 rounded-md bg-[#383a40]/90 hover:bg-indigo-500/80 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <Copy className="w-2.5 h-2.5" />
                    </button>
                    </TooltipTrigger><TooltipContent>Duplicate scene</TooltipContent></Tooltip>
                  )}
                  {onDeleteSlide && slides.length > 1 && (
                    <Tooltip><TooltipTrigger asChild>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDeleteSlide(slide.id) }}
                      className="w-5 h-5 rounded-md bg-[#383a40]/90 hover:bg-red-500/80 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <Trash2Icon className="w-2.5 h-2.5" />
                    </button>
                    </TooltipTrigger><TooltipContent>Delete scene</TooltipContent></Tooltip>
                  )}
                </div>
              </div>
            </div>
              {/* Drop indicator line — after last item */}
              {dragFromIndex !== null && dragOverIndex === index + 1 && index === slides.length - 1 && dragFromIndex !== index && (
                <div className="absolute -bottom-[5px] left-1 right-1 h-[3px] bg-red-500 rounded-full z-50 pointer-events-none" />
              )}
            </div>
          )
        })}
      </div>
      {(onAddSlide || onAddCctvSlide) && (
        <div className="px-2 py-2 border-t border-[#1e1f22] flex gap-1.5">
          {onAddSlide && (
            <button
              onClick={onAddSlide}
              className="flex-1 h-7 rounded-lg border border-dashed border-[#3f4147] hover:border-red-500/50 text-zinc-500 hover:text-red-400 flex items-center justify-center gap-1 text-[11px] transition-all cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              Scene
            </button>
          )}
          {onAddCctvSlide && (
            <button
              onClick={onAddCctvSlide}
              className="flex-1 h-7 rounded-lg border border-dashed border-[#3f4147] hover:border-indigo-500/50 text-zinc-500 hover:text-indigo-400 flex items-center justify-center gap-1 text-[11px] transition-all cursor-pointer"
            >
              <Monitor className="w-3 h-3" />
              CCTV
            </button>
          )}
        </div>
      )}
    </div>
  )
}

/* Text Panel */

function TextPanel({
  layers,
  onAddLayer,
  onSelectLayer,
  onDeleteLayer,
  selectedLayerId,
}: {
  layers: StudioLayer[]
  onAddLayer: (partial: Partial<StudioLayer>) => void
  onSelectLayer: (id: string) => void
  onDeleteLayer: (id: string) => void
  selectedLayerId: string | null
}) {
  const textLayers = layers.filter((l) => l.type === 'text')
  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2 border-b border-[#1a1a1a]">
        <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Text Layers</span>
      </div>
      <div className="px-2 py-2">
        <button
          onClick={() => onAddLayer({ type: 'text', name: 'Text', text: 'Text', fontSize: 24, color: '#000000' })}
          className="w-full h-8 rounded-lg border border-dashed border-[#2a2a2a] hover:border-red-500/50 text-zinc-500 hover:text-red-400 flex items-center justify-center gap-1.5 text-xs transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Text
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        {textLayers.length === 0 && (
          <p className="mt-4 text-center text-xs text-zinc-500">No text layers yet</p>
        )}
        {textLayers.map((layer) => {
          const isActive = layer.id === selectedLayerId
          return (
            <div
              key={layer.id}
              className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs cursor-pointer transition-all group ${
                isActive ? 'bg-red-600/20 text-red-300' : 'text-zinc-300 hover:bg-white/5'
              }`}
              onClick={() => onSelectLayer(layer.id)}
            >
              <Type className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="flex-1 truncate">{layer.name}</span>
              <span className="text-[10px] text-zinc-600 truncate max-w-[80px]">{layer.text}</span>
              <Tooltip><TooltipTrigger asChild>
              <button
                onClick={(e) => { e.stopPropagation(); onDeleteLayer(layer.id) }}
                className="p-0.5 text-zinc-600 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all"
              >
                <Trash2Icon className="w-3 h-3" />
              </button>
              </TooltipTrigger><TooltipContent>Delete</TooltipContent></Tooltip>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* Shapes Panel */

function ShapesPanel({
  layers,
  onAddLayer,
  onSelectLayer,
  onDeleteLayer,
  onUpdateLayer,
  selectedLayerId,
}: {
  layers: StudioLayer[]
  onAddLayer: (partial: Partial<StudioLayer>) => void
  onSelectLayer: (id: string) => void
  onDeleteLayer: (id: string) => void
  onUpdateLayer: (id: string, updates: Partial<StudioLayer>) => void
  selectedLayerId: string | null
}) {
  const shapeLayers = layers.filter((l) => l.type === 'shape')
  const shapePresets = [
    { label: 'Rectangle', icon: '▬', shape: 'rectangle' },
    { label: 'Circle', icon: '●', shape: 'circle' },
    { label: 'Triangle', icon: '▲', shape: 'triangle' },
    { label: 'Line', icon: '━', shape: 'line' },
  ]
  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2 border-b border-[#1a1a1a]">
        <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Shapes</span>
      </div>
      <div className="px-2 py-2 grid grid-cols-2 gap-1.5">
        {shapePresets.map((preset) => (
          <button
            key={preset.shape}
            onClick={() => onAddLayer({
              type: 'shape',
              name: preset.label,
              width: preset.shape === 'line' ? 30 : 15,
              height: preset.shape === 'line' ? 1 : 15,
              color: '#666666',
            })}
            className="h-10 rounded-lg border border-[#2a2a2a] hover:border-red-500/50 text-zinc-400 hover:text-red-400 flex items-center justify-center gap-1.5 text-xs transition-all cursor-pointer"
          >
            <span className="text-base">{preset.icon}</span>
            <span>{preset.label}</span>
          </button>
        ))}
      </div>
      <div className="px-3 py-1 border-b border-[#1a1a1a]">
        <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Placed Shapes</span>
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-1 space-y-1">
        {shapeLayers.length === 0 && (
          <p className="mt-4 text-center text-xs text-zinc-500">No shapes yet</p>
        )}
        {shapeLayers.map((layer) => {
          const isActive = layer.id === selectedLayerId
          return (
            <div
              key={layer.id}
              className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs cursor-pointer transition-all group ${
                isActive ? 'bg-red-600/20 text-red-300' : 'text-zinc-300 hover:bg-white/5'
              }`}
              onClick={() => onSelectLayer(layer.id)}
            >
              <div className="w-3.5 h-3.5 rounded-sm shrink-0" style={{ backgroundColor: layer.color || '#666666' }} />
              <span className="flex-1 truncate">{layer.name}</span>
              <input
                type="color"
                value={layer.color || '#666666'}
                onChange={(e) => { e.stopPropagation(); onUpdateLayer(layer.id, { color: e.target.value }) }}
                onClick={(e) => e.stopPropagation()}
                className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent p-0"
              />
              <Tooltip><TooltipTrigger asChild>
              <button
                onClick={(e) => { e.stopPropagation(); onDeleteLayer(layer.id) }}
                className="p-0.5 text-zinc-600 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all"
              >
                <Trash2Icon className="w-3 h-3" />
              </button>
              </TooltipTrigger><TooltipContent>Delete</TooltipContent></Tooltip>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* Scene Properties Panel — shown when no layer/event is selected */

function SceneProperties({
  content,
  onContentChange,
  slideName,
  onRename,
  onOpenPanel,
}: {
  content: StudioContent
  onContentChange: (content: StudioContent) => void
  slideName: string
  onRename: (name: string) => void
  onOpenPanel: (panel: 'gallery' | 'text' | 'shapes' | 'events') => void
}) {
  const [isEditingName, setIsEditingName] = useState(false)
  const [nameValue, setNameValue] = useState(slideName)

  const bgColor = content.canvas?.backgroundColor || '#1e1f22'

  const handleBgChange = (color: string) => {
    onContentChange({
      ...content,
      canvas: { ...(content.canvas || { width: 1920, height: 1080 }), backgroundColor: color },
    })
  }

  return (
    <div className="flex flex-col h-full overflow-x-hidden">
      <div className="px-3 py-2.5 border-b border-[#1e1f22]">
        <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Scene Properties</span>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-3 space-y-5 min-w-0">
        {/* Scene Name */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Scene Name</label>
          {isEditingName ? (
            <input
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              onBlur={() => {
                if (nameValue.trim()) onRename(nameValue.trim())
                setIsEditingName(false)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (nameValue.trim()) onRename(nameValue.trim())
                  setIsEditingName(false)
                }
                if (e.key === 'Escape') setIsEditingName(false)
              }}
              className="w-full h-7 text-[11px] text-zinc-100 bg-[#383a40] border border-zinc-600 rounded-md px-2 outline-none focus:border-red-500/60"
              autoFocus
            />
          ) : (
            <button
              onClick={() => { setNameValue(slideName); setIsEditingName(true) }}
              className="w-full h-7 text-left text-[11px] text-zinc-300 bg-[#383a40] rounded-md px-2 flex items-center justify-between hover:bg-[#43454b] transition-colors cursor-pointer"
            >
              <span className="truncate">{slideName || 'Untitled Scene'}</span>
              <Pencil className="w-3 h-3 text-zinc-500 shrink-0" />
            </button>
          )}
        </div>

        {/* Background Color */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Background Color</label>
          {/* Preset color swatches */}
          <div className="flex flex-wrap gap-1 mb-1.5 max-w-full">
            {['#ffffff', '#000000', '#1a1a2e', '#dc2626'].map(c => (
              <button key={c} onClick={() => handleBgChange(c)}
                className={`w-5 h-5 rounded-md border transition-all cursor-pointer ${bgColor === c ? 'border-red-500 ring-1 ring-red-500/50 scale-110' : 'border-[#3f4147] hover:border-zinc-400'}`}
                style={{ backgroundColor: c }} />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md border border-[#3f4147] shrink-0 cursor-pointer relative overflow-hidden" style={{ backgroundColor: bgColor }}>
              <input type="color" value={bgColor} onChange={(e) => handleBgChange(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            </div>
            <input
              value={bgColor}
              onChange={(e) => {
                const v = e.target.value
                if (/^#[0-9a-fA-F]{0,6}$/.test(v)) handleBgChange(v)
              }}
              className="flex-1 min-w-0 h-7 text-[11px] text-zinc-300 bg-[#383a40] border border-zinc-600 rounded-md px-2 font-mono outline-none focus:border-red-500/60"
            />
          </div>
        </div>

        {/* Canvas Size */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Canvas Size</label>
          <div className="flex items-center gap-2 text-[11px] text-zinc-400">
            <div className="flex-1 h-7 bg-[#383a40] rounded-md px-2 flex items-center border border-zinc-700/50">
              {content.canvas?.width || 1920} x {content.canvas?.height || 1080}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Quick Actions</label>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => onOpenPanel('gallery')}
              className="h-8 rounded-lg border border-[#3f4147] hover:border-red-500/50 text-zinc-400 hover:text-red-400 flex items-center justify-center gap-1.5 text-[10px] transition-all cursor-pointer"
            >
              <Image className="w-3 h-3" />
              Add Assets
            </button>
            <button
              onClick={() => onOpenPanel('text')}
              className="h-8 rounded-lg border border-[#3f4147] hover:border-sky-500/50 text-zinc-400 hover:text-sky-400 flex items-center justify-center gap-1.5 text-[10px] transition-all cursor-pointer"
            >
              <Type className="w-3 h-3" />
              Add Text
            </button>
            <button
              onClick={() => onOpenPanel('shapes')}
              className="h-8 rounded-lg border border-[#3f4147] hover:border-emerald-500/50 text-zinc-400 hover:text-emerald-400 flex items-center justify-center gap-1.5 text-[10px] transition-all cursor-pointer"
            >
              <Shapes className="w-3 h-3" />
              Add Shape
            </button>
            <button
              onClick={() => onOpenPanel('events')}
              className="h-8 rounded-lg border border-[#3f4147] hover:border-amber-500/50 text-zinc-400 hover:text-amber-400 flex items-center justify-center gap-1.5 text-[10px] transition-all cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              Add Event
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function formatTime(ms: number): string {
  const totalSec = Math.floor(ms / 1000)
  const mins = Math.floor(totalSec / 60)
  const secs = totalSec % 60
  const frames = Math.floor((ms % 1000) / (1000 / 30))
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}:${String(frames).padStart(2, '0')}`
}
