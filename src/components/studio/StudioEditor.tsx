'use client'

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { PanelLeftClose, PanelRightClose, PanelBottomClose, PanelLeftOpen, PanelRightOpen, PanelBottomOpen } from 'lucide-react'
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

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-zinc-950">
      {/* Panel toggle bar */}
      <div className="h-7 bg-zinc-900/60 border-b border-zinc-800/50 flex items-center gap-1 px-2 shrink-0">
        <button
          onClick={() => setShowGallery(v => !v)}
          className={`p-1 rounded hover:bg-zinc-700/50 transition-colors ${showGallery ? 'text-zinc-400' : 'text-zinc-600'}`}
          title={showGallery ? 'Hide Assets' : 'Show Assets'}
        >
          {showGallery ? <PanelLeftClose className="w-3.5 h-3.5" /> : <PanelLeftOpen className="w-3.5 h-3.5" />}
        </button>
        <button
          onClick={() => setShowTimeline(v => !v)}
          className={`p-1 rounded hover:bg-zinc-700/50 transition-colors ${showTimeline ? 'text-zinc-400' : 'text-zinc-600'}`}
          title={showTimeline ? 'Hide Timeline' : 'Show Timeline'}
        >
          {showTimeline ? <PanelBottomClose className="w-3.5 h-3.5" /> : <PanelBottomOpen className="w-3.5 h-3.5" />}
        </button>
        <button
          onClick={() => setShowProperties(v => !v)}
          className={`p-1 rounded hover:bg-zinc-700/50 transition-colors ${showProperties ? 'text-zinc-400' : 'text-zinc-600'}`}
          title={showProperties ? 'Hide Properties' : 'Show Properties'}
        >
          {showProperties ? <PanelRightClose className="w-3.5 h-3.5" /> : <PanelRightOpen className="w-3.5 h-3.5" />}
        </button>
        <span className="text-[9px] text-zinc-600 ml-2">Toggle panels for more canvas space</span>
      </div>

      {/* Top row: Gallery | Canvas | Properties */}
      <div className="flex flex-1 min-h-0">
        {/* Left: Gallery */}
        {showGallery && <div
          className="shrink-0 border-r border-zinc-800 overflow-hidden"
          style={{ width: galleryWidth }}
        >
          <StudioGallery
            layers={layers}
            onAddLayer={handleAddLayer}
            onSelectLayer={(id) => setSelectedLayerId(id)}
            timelineEvents={timelineEvents}
            onAddTimelineEvent={handleAddTimelineEvent}
            onRemoveTimelineEvent={handleRemoveTimelineEvent}
          />
        </div>}

        {/* Gallery resize splitter */}
        {showGallery && <div
          className="w-1 shrink-0 cursor-col-resize bg-zinc-800 hover:bg-primary/40 transition-colors relative group"
          onMouseDown={() => startDrag('gallery')}
        >
          <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-center">
            <div className="w-0.5 h-8 rounded-full bg-zinc-600 group-hover:bg-primary/60 transition-colors" />
          </div>
        </div>}

        {/* Center: Canvas */}
        <div className="flex-1 min-w-0 min-h-0 overflow-hidden">
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

        {/* Properties resize splitter */}
        {showProperties && <div
          className="w-1 shrink-0 cursor-col-resize bg-zinc-800 hover:bg-primary/40 transition-colors relative group"
          onMouseDown={() => startDrag('properties')}
        >
          <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-center">
            <div className="w-0.5 h-8 rounded-full bg-zinc-600 group-hover:bg-primary/60 transition-colors" />
          </div>
        </div>}

        {/* Right: Properties */}
        {showProperties && <div
          className="shrink-0 border-l border-zinc-800 overflow-hidden"
          style={{ width: propertiesWidth }}
        >
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
        </div>}
      </div>

      {/* Timeline resize splitter */}
      {showTimeline && <div
        className="h-1 shrink-0 cursor-row-resize bg-zinc-800 hover:bg-primary/40 transition-colors relative group"
        onMouseDown={() => startDrag('timeline')}
      >
        <div className="absolute inset-x-0 top-0 bottom-0 flex items-center justify-center">
          <div className="h-0.5 w-8 rounded-full bg-zinc-600 group-hover:bg-primary/60 transition-colors" />
        </div>
      </div>}

      {/* Bottom: Timeline */}
      {showTimeline && <div
        className="shrink-0 border-t border-zinc-800 overflow-hidden"
        style={{ height: timelineHeight }}
      >
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
      </div>}
    </div>
  )
}
