'use client'

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import {
  PanelLeftClose, PanelRightClose, PanelBottomClose,
  PanelLeftOpen, PanelRightOpen, PanelBottomOpen,
  FolderOpen, Type, Shapes, Image, Film, Sparkles, Settings2,
  Play, Square, SkipBack,
} from 'lucide-react'
import type {
  StudioContent,
  StudioLayer,
  StudioClip,
  StudioKeyframe,
  StudioTimelineEvent,
} from '@/types/slide'
import { StudioGallery } from '@/components/studio/StudioGallery'
import { StudioCanvas } from '@/components/studio/StudioCanvas'
import { StudioProperties } from '@/components/studio/StudioProperties'
import { StudioTimeline } from '@/components/studio/StudioTimeline'
import { migrateStudioContent } from '@/lib/studio/migrate-studio-content'
import { addTrackForLayer, addTimelineEvent, removeTimelineEvent } from '@/lib/studio/timeline-manager'
import { useStudioStore } from '@/stores/studioStore'
import { generateLayerId } from '@/lib/utils/studio-utils'

interface StudioEditorProps {
  content: StudioContent
  onContentChange: (content: StudioContent) => void
}

export function StudioEditor({ content, onContentChange }: StudioEditorProps) {
  // ── Migration on first load ──
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

  // ── Zustand store ──
  const { selectedLayerId, setSelectedLayerId } = useStudioStore()

  // ── Playback state ──
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const rafRef = useRef<number | null>(null)
  const lastFrameRef = useRef<number>(0)

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

  // ── Derived data ──
  const layers = content.layers
  const tracks = content.tracks ?? []
  const timelineEvents = content.timelineEvents ?? []

  const selectedLayer = useMemo(
    () => layers.find((l) => l.id === selectedLayerId) ?? null,
    [layers, selectedLayerId]
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

  // ── Content mutation helpers ──
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

      // Add layer and create a track for it
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

  // Timeline event operations
  const handleAddTimelineEvent = useCallback(
    (event: Omit<StudioTimelineEvent, 'id'>) => {
      const updated = addTimelineEvent(content, event)
      onContentChange(updated)
    },
    [content, onContentChange]
  )

  const handleRemoveTimelineEvent = useCallback(
    (eventId: string) => {
      const updated = removeTimelineEvent(content, eventId)
      onContentChange(updated)
    },
    [content, onContentChange]
  )

  // ── Timeline-specific state ──
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null)
  const [zoomLevel, setZoomLevel] = useState(100)

  // ── Panel visibility ──
  const [showGallery, setShowGallery] = useState(true)
  const [showProperties, setShowProperties] = useState(true)
  const [showTimeline, setShowTimeline] = useState(true)

  // ── Resizable panel widths ──
  const [galleryWidth, setGalleryWidth] = useState(240)
  const [propertiesWidth, setPropertiesWidth] = useState(280)
  const [timelineHeight, setTimelineHeight] = useState(280)

  const galleryDragging = useRef(false)
  const propertiesDragging = useRef(false)
  const timelineDragging = useRef(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (galleryDragging.current) {
        setGalleryWidth(Math.max(180, Math.min(400, e.clientX)))
      }
      if (propertiesDragging.current) {
        setPropertiesWidth(Math.max(200, Math.min(450, window.innerWidth - e.clientX)))
      }
      if (timelineDragging.current) {
        setTimelineHeight(Math.max(150, Math.min(500, window.innerHeight - e.clientY)))
      }
    }
    const handleMouseUp = () => {
      galleryDragging.current = false
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

  const startDrag = (which: 'gallery' | 'properties' | 'timeline') => {
    if (which === 'gallery') galleryDragging.current = true
    if (which === 'properties') propertiesDragging.current = true
    if (which === 'timeline') timelineDragging.current = true
    document.body.style.cursor = which === 'timeline' ? 'row-resize' : 'col-resize'
    document.body.style.userSelect = 'none'
  }

  // Icon sidebar items
  const SIDEBAR_ICONS = [
    { icon: FolderOpen, label: 'Assets', panel: 'gallery' as const },
    { icon: Type, label: 'Text', action: () => handleAddLayer({ type: 'text', name: 'Text', text: 'Text', fontSize: 24 }) },
    { icon: Shapes, label: 'Shapes', action: () => handleAddLayer({ type: 'shape', name: 'Shape' }) },
    { icon: Sparkles, label: 'Events', panel: 'events' as const },
  ]

  const [activePanel, setActivePanel] = useState<'gallery' | 'events'>('gallery')

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#1a1a2e]">
      {/* ── Icon Sidebar (OpenCut-style) ── */}
      <div className="w-11 shrink-0 bg-[#12121f] border-r border-[#2a2a3e] flex flex-col items-center py-2 gap-1">
        {SIDEBAR_ICONS.map((item) => {
          const isActive = item.panel && showGallery && activePanel === item.panel
          return (
            <button
              key={item.label}
              onClick={() => {
                if (item.panel) {
                  if (showGallery && activePanel === item.panel) {
                    setShowGallery(false)
                  } else {
                    setActivePanel(item.panel)
                    setShowGallery(true)
                  }
                } else if (item.action) {
                  item.action()
                }
              }}
              className={`w-9 h-9 rounded-lg flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600/20 text-blue-400'
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

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        {/* Top: Asset panel | Canvas | Properties */}
        <div className="flex flex-1 min-h-0">
          {/* Left: Asset/Events panel */}
          {showGallery && (
            <>
              <div className="shrink-0 bg-[#16162a] overflow-hidden" style={{ width: galleryWidth }}>
                <StudioGallery
                  layers={layers}
                  onAddLayer={handleAddLayer}
                  onSelectLayer={(id) => setSelectedLayerId(id)}
                  timelineEvents={timelineEvents}
                  onAddTimelineEvent={handleAddTimelineEvent}
                  onRemoveTimelineEvent={handleRemoveTimelineEvent}
                />
              </div>
              <div
                className="w-px shrink-0 cursor-col-resize bg-[#2a2a3e] hover:bg-blue-500/50 transition-colors"
                onMouseDown={() => startDrag('gallery')}
              />
            </>
          )}

          {/* Center: Canvas + transport */}
          <div className="flex-1 min-w-0 min-h-0 flex flex-col bg-[#0d0d1a]">
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
              />
            </div>
            {/* Transport bar below canvas */}
            <div className="h-9 shrink-0 bg-[#12121f] border-t border-[#2a2a3e] flex items-center justify-center gap-4 px-4">
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
                  className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer"
                >
                  {isPlaying ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                </button>
              </div>
              <span className="text-[11px] font-mono text-zinc-500 tabular-nums">
                / {formatTime(totalDuration)}
              </span>
            </div>
          </div>

          {/* Right: Properties */}
          {showProperties && (
            <>
              <div
                className="w-px shrink-0 cursor-col-resize bg-[#2a2a3e] hover:bg-blue-500/50 transition-colors"
                onMouseDown={() => startDrag('properties')}
              />
              <div className="shrink-0 bg-[#16162a] overflow-y-auto overflow-x-hidden" style={{ width: propertiesWidth }}>
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
              </div>
            </>
          )}
        </div>

        {/* Timeline resize splitter */}
        {showTimeline && (
          <div
            className="h-px shrink-0 cursor-row-resize bg-[#2a2a3e] hover:bg-blue-500/50 transition-colors"
            onMouseDown={() => startDrag('timeline')}
          />
        )}

        {/* Bottom: Timeline */}
        {showTimeline && (
          <div className="shrink-0 bg-[#12121f] overflow-hidden" style={{ height: timelineHeight }}>
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

function formatTime(ms: number): string {
  const totalSec = Math.floor(ms / 1000)
  const mins = Math.floor(totalSec / 60)
  const secs = totalSec % 60
  const frames = Math.floor((ms % 1000) / (1000 / 30))
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}:${String(frames).padStart(2, '0')}`
}
