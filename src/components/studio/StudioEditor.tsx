'use client'

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import {
  FolderOpen, Type, Shapes, Film, Sparkles, Settings2,
  Play, Square, SkipBack, Layers, Plus, Trash2 as Trash2Icon,
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
import { migrateStudioContent } from '@/lib/studio/migrate-studio-content'
import { addTrackForLayer } from '@/lib/studio/timeline-manager'
import { playEvent } from '@/lib/studio/event-playback'
import { useStudioStore } from '@/stores/studioStore'
import { generateLayerId } from '@/lib/utils/studio-utils'

interface StudioEditorProps {
  content: StudioContent
  onContentChange: (content: StudioContent) => void
  slides?: Slide[]
  selectedSlideId?: string | null
  onSelectSlide?: (id: string) => void
  onAddSlide?: () => void
  onRenameSlide?: (slideId: string, newTitle: string) => void
}

export function StudioEditor({
  content,
  onContentChange,
  slides,
  selectedSlideId: activeSlideId,
  onSelectSlide,
  onAddSlide,
  onRenameSlide,
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

  // Content mutation helpers
  const updateContent = useCallback(
    (updates: Partial<StudioContent>) => {
      onContentChange({ ...content, ...updates })
    },
    [content, onContentChange]
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
  const [showTimeline, setShowTimeline] = useState(true)

  // Resizable panel widths
  const [leftPanelWidth, setLeftPanelWidth] = useState(240)
  const [propertiesWidth, setPropertiesWidth] = useState(280)
  const [timelineHeight, setTimelineHeight] = useState(250)

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
  ]

  const [activePanel, setActivePanel] = useState<'slides' | 'gallery' | 'events' | 'text' | 'shapes'>(hasSlides ? 'slides' : 'gallery')

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#0a0a0a]" style={{ minHeight: 0 }}>
      {/* Icon Sidebar (OpenCut-style) */}
      <div className="w-11 shrink-0 bg-[#0c0c0c] border-r border-[#1a1a1a] flex flex-col items-center py-2 gap-1">
        {SIDEBAR_ICONS.map((item) => {
          const isActive = item.panel && showLeftPanel && activePanel === item.panel
          return (
            <button
              key={item.label}
              onClick={() => {
                if (showLeftPanel && activePanel === item.panel) {
                  setShowLeftPanel(false)
                } else {
                  setActivePanel(item.panel)
                  setShowLeftPanel(true)
                }
              }}
              className={`w-9 h-9 rounded-lg flex flex-col items-center justify-center gap-0.5 transition-all duration-200 cursor-pointer ${
                isActive
                  ? item.activeClass
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
              }`}
              title={item.label}
            >
              <item.icon className="w-4 h-4" />
              <span className="text-[8px] leading-none">{item.label}</span>
            </button>
          )
        })}

        <div className="flex-1" />

        {/* Panel toggles at bottom */}
        <button
          onClick={() => setShowProperties(v => !v)}
          className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer ${showProperties ? 'text-zinc-400' : 'text-zinc-600'}`}
          title="Properties"
        >
          <Settings2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => setShowTimeline(v => !v)}
          className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer ${showTimeline ? 'text-zinc-400' : 'text-zinc-600'}`}
          title="Timeline"
        >
          <Film className="w-4 h-4" />
        </button>
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        {/* Top: Left panel | Canvas | Properties */}
        <div className="flex flex-1 min-h-0">
          {/* Left: Slides / Asset / Events panel */}
          {showLeftPanel && (
            <>
              <div className="shrink-0 bg-[#0e0e0e] overflow-hidden flex flex-col" style={{ width: leftPanelWidth }}>
                {activePanel === 'slides' && hasSlides ? (
                  <SlidesPanel
                    slides={slides!}
                    activeSlideId={activeSlideId ?? null}
                    onSelectSlide={onSelectSlide!}
                    onAddSlide={onAddSlide}
                    onRenameSlide={onRenameSlide}
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
                ) : activePanel === 'events' ? (
                  <StudioGallery
                    layers={layers}
                    onAddLayer={handleAddLayer}
                    onSelectLayer={(id) => setSelectedLayerId(id)}
                    onDeleteLayer={handleDeleteLayer}
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
                    events={events}
                    eventCategories={eventCategories}
                    onUpdateEvents={handleUpdateEvents}
                    onUpdateCategories={handleUpdateCategories}
                    onTriggerEvent={handleTriggerEvent}
                  />
                )}
              </div>
              <div
                className="w-px shrink-0 cursor-col-resize bg-[#1a1a1a] hover:bg-red-500/50 transition-colors"
                onMouseDown={() => startDrag('left')}
              />
            </>
          )}

          {/* Center: Canvas + transport */}
          <div className="flex-1 min-w-0 min-h-0 flex flex-col bg-[#080808]">
            {/* Canvas area */}
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
            {/* Transport bar below canvas */}
            <div className="h-9 shrink-0 bg-[#0c0c0c] border-t border-[#1a1a1a] flex items-center justify-center gap-4 px-4">
              <span className="text-[11px] font-mono text-emerald-400 tabular-nums">
                {formatTime(currentTime)}
              </span>
              <div className="flex items-center gap-1">
                <button onClick={() => { setIsPlaying(false); setCurrentTime(0) }} className="w-7 h-7 rounded flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
                  <SkipBack className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (isPlaying) { setIsPlaying(false) } else { if (currentTime >= totalDuration) setCurrentTime(0); setIsPlaying(true) }
                  }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center bg-zinc-700 hover:bg-zinc-600 text-white transition-colors cursor-pointer"
                >
                  {isPlaying ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                </button>
              </div>
              <span className="text-[11px] font-mono text-zinc-500 tabular-nums">
                / {formatTime(totalDuration)}
              </span>
            </div>
          </div>

          {/* Right: Properties or Event Settings */}
          {showProperties && (
            <>
              <div
                className="w-px shrink-0 cursor-col-resize bg-[#1a1a1a] hover:bg-red-500/50 transition-colors"
                onMouseDown={() => startDrag('properties')}
              />
              <div className="shrink-0 bg-[#0e0e0e] overflow-y-auto overflow-x-hidden" style={{ width: propertiesWidth }}>
                {selectedEvent ? (
                  <StudioEventSettings
                    event={selectedEvent}
                    layers={layers}
                    categories={eventCategories}
                    onUpdateEvent={handleUpdateEvent}
                    onDeleteEvent={handleDeleteEvent}
                    onTriggerEvent={handleTriggerEvent}
                  />
                ) : (
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
                )}
              </div>
            </>
          )}
        </div>

        {/* Timeline resize splitter */}
        {showTimeline && (
          <div
            className="h-[6px] shrink-0 cursor-row-resize bg-[#1a1a1a] hover:bg-red-500/50 transition-colors flex items-center justify-center group"
            onMouseDown={() => startDrag('timeline')}
          >
            <div className="w-8 h-[2px] rounded-full bg-zinc-600 group-hover:bg-red-400 transition-colors" />
          </div>
        )}

        {/* Bottom: Timeline */}
        {showTimeline && (
          <div className="shrink-0 bg-[#0c0c0c] overflow-hidden" style={{ height: timelineHeight }}>
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
    </div>
  )
}

/* Slides Panel */

function SlidesPanel({
  slides,
  activeSlideId,
  onSelectSlide,
  onAddSlide,
  onRenameSlide,
}: {
  slides: Slide[]
  activeSlideId: string | null
  onSelectSlide: (id: string) => void
  onAddSlide?: () => void
  onRenameSlide?: (slideId: string, newTitle: string) => void
}) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2 border-b border-[#1a1a1a]">
        <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Scenes</span>
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-3">
        {slides.map((slide, index) => {
          const isActive = slide.id === activeSlideId
          const isEditing = editingId === slide.id
          return (
            <button
              key={slide.id}
              onClick={() => onSelectSlide(slide.id)}
              className={`w-full rounded-lg overflow-hidden transition-all cursor-pointer group ${
                isActive
                  ? 'ring-2 ring-red-500 ring-offset-1 ring-offset-[#0e0e0e]'
                  : 'ring-1 ring-[#2a2a2a] hover:ring-zinc-500'
              }`}
            >
              <div className="relative aspect-video bg-[#0a0a0a] flex items-center justify-center">
                {isEditing ? (
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
                    className="w-[80%] h-5 text-[10px] text-zinc-100 bg-zinc-800 border border-zinc-600 rounded px-1 text-center outline-none"
                    autoFocus
                  />
                ) : (
                  <span
                    className="text-[10px] text-zinc-500 font-medium"
                    onDoubleClick={(e) => {
                      e.stopPropagation()
                      setEditTitle(slide.title || `Scene ${index + 1}`)
                      setEditingId(slide.id)
                    }}
                    title="Double-click to rename"
                  >
                    {slide.title || `Scene ${index + 1}`}
                  </span>
                )}
                <span className={`absolute top-1 left-1 text-[9px] font-bold px-1 py-0.5 rounded ${
                  isActive ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400'
                }`}>
                  {index + 1}
                </span>
              </div>
            </button>
          )
        })}
      </div>
      {onAddSlide && (
        <div className="px-2 py-2 border-t border-[#1a1a1a]">
          <button
            onClick={onAddSlide}
            className="w-full h-8 rounded-lg border border-dashed border-[#2a2a2a] hover:border-red-500/50 text-zinc-500 hover:text-red-400 flex items-center justify-center gap-1.5 text-xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Scene
          </button>
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
              <button
                onClick={(e) => { e.stopPropagation(); onDeleteLayer(layer.id) }}
                className="p-0.5 text-zinc-600 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all"
                title="Delete"
              >
                <Trash2Icon className="w-3 h-3" />
              </button>
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
                title="Change color"
              />
              <button
                onClick={(e) => { e.stopPropagation(); onDeleteLayer(layer.id) }}
                className="p-0.5 text-zinc-600 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all"
                title="Delete"
              >
                <Trash2Icon className="w-3 h-3" />
              </button>
            </div>
          )
        })}
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
