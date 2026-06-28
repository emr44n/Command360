'use client'

import { useCallback, useRef, useState, useEffect } from 'react'
import type { StudioContent } from '@/types/slide'
import { TimelineControls } from './timeline/TimelineControls'
import { TimelineRuler } from './timeline/TimelineRuler'
import { TimelineEventMarkers } from './timeline/TimelineEventMarkers'
import { TimelineTrackRow } from './timeline/TimelineTrackRow'
import { TimelinePlayhead } from './timeline/TimelinePlayhead'

interface StudioTimelineProps {
  content: StudioContent
  onContentChange: (updates: Partial<StudioContent>) => void
  selectedClipId: string | null
  selectedLayerId: string | null
  onSelectClip: (clipId: string | null) => void
  onSelectLayer: (layerId: string | null) => void
  playheadPosition: number
  isPlaying: boolean
  onPlayheadChange: (ms: number) => void
  onPlay: () => void
  onPause: () => void
  onStop: () => void
  zoomLevel: number
  onZoomChange: (zoom: number) => void
}

export function StudioTimeline({
  content,
  onContentChange,
  selectedClipId,
  selectedLayerId,
  onSelectClip,
  onSelectLayer,
  playheadPosition,
  isPlaying,
  onPlayheadChange,
  onPlay,
  onPause,
  onStop,
  zoomLevel,
  onZoomChange,
}: StudioTimelineProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const timelineContainerRef = useRef<HTMLDivElement>(null)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [labelWidth, setLabelWidth] = useState(140)
  const [containerHeight, setContainerHeight] = useState(0)
  const [selectedKeyframeId, setSelectedKeyframeId] = useState<string | null>(null)
  const labelDragging = useRef(false)

  const tracks = content.tracks ?? []
  const timelineEvents = content.timelineEvents ?? []
  const totalDuration = content.totalDuration ?? 10000

  // Measure container height for dynamic row sizing
  useEffect(() => {
    const el = timelineContainerRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerHeight(entry.contentRect.height)
      }
    })
    observer.observe(el)
    setContainerHeight(el.clientHeight)
    return () => observer.disconnect()
  }, [])

  // Sync scroll position
  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      setScrollLeft(scrollContainerRef.current.scrollLeft)
    }
  }, [])

  // Auto-scroll to follow playhead during playback
  useEffect(() => {
    if (!isPlaying || !scrollContainerRef.current) return
    const container = scrollContainerRef.current
    const playheadPx = (playheadPosition * zoomLevel) / 1000
    const viewLeft = container.scrollLeft
    const viewRight = viewLeft + container.clientWidth - labelWidth // subtract label width
    if (playheadPx > viewRight - 50) {
      container.scrollLeft = playheadPx - container.clientWidth / 2
    }
  }, [playheadPosition, isPlaying, zoomLevel])

  // Label column resize
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (labelDragging.current) {
        setLabelWidth(Math.max(100, Math.min(300, e.clientX - (scrollContainerRef.current?.getBoundingClientRect().left ?? 0))))
      }
    }
    const handleMouseUp = () => {
      if (labelDragging.current) {
        labelDragging.current = false
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
      }
    }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  // Dynamic sizing based on container height
  const controlsBarHeight = 44 // approximate height of TimelineControls
  const eventMarkersHeight = timelineEvents.length > 0 ? 20 : 0
  const baseRulerHeight = 24
  const fixedOverhead = controlsBarHeight + eventMarkersHeight + baseRulerHeight
  const availableTrackSpace = Math.max(0, containerHeight - fixedOverhead)
  const rowHeight = Math.max(24, Math.min(40, availableTrackSpace / Math.max(tracks.length, 3)))
  const rulerHeight = rowHeight < 30 ? 18 : 24
  const compact = rowHeight < 32

  // Track area height for playhead
  const trackAreaHeight = Math.max(tracks.length * rowHeight, 120)

  // Handle clip move
  const handleMoveClip = useCallback(
    (clipId: string, newStartTime: number) => {
      const updatedTracks = tracks.map((track) => ({
        ...track,
        clips: track.clips.map((clip) =>
          clip.id === clipId ? { ...clip, startTime: newStartTime } : clip
        ),
      }))
      onContentChange({ tracks: updatedTracks })
    },
    [tracks, onContentChange]
  )

  // Handle clip resize
  const handleResizeClip = useCallback(
    (clipId: string, newDuration: number) => {
      const updatedTracks = tracks.map((track) => ({
        ...track,
        clips: track.clips.map((clip) =>
          clip.id === clipId ? { ...clip, duration: newDuration } : clip
        ),
      }))
      onContentChange({ tracks: updatedTracks })
    },
    [tracks, onContentChange]
  )

  // Handle track mute toggle
  const handleToggleMute = useCallback(
    (trackId: string) => {
      const updatedTracks = tracks.map((track) =>
        track.id === trackId ? { ...track, muted: !track.muted } : track
      )
      onContentChange({ tracks: updatedTracks })
    },
    [tracks, onContentChange]
  )

  // Handle track hidden toggle
  const handleToggleHidden = useCallback(
    (trackId: string) => {
      const updatedTracks = tracks.map((track) =>
        track.id === trackId ? { ...track, hidden: !track.hidden } : track
      )
      onContentChange({ tracks: updatedTracks })
    },
    [tracks, onContentChange]
  )

  // Handle track delete
  const handleDeleteTrack = useCallback(
    (trackId: string) => {
      const updatedTracks = tracks.filter((track) => track.id !== trackId)
      onContentChange({ tracks: updatedTracks })
    },
    [tracks, onContentChange]
  )

  // Handle keyframe selection
  const handleSelectKeyframe = useCallback((id: string) => {
    setSelectedKeyframeId(id)
  }, [])

  // Handle keyframe deletion
  const handleDeleteKeyframe = useCallback(
    (kfId: string) => {
      const updatedTracks = tracks.map((track) => ({
        ...track,
        clips: track.clips.map((clip) => ({
          ...clip,
          keyframes: clip.keyframes.filter((kf) => kf.id !== kfId),
        })),
      }))
      onContentChange({ tracks: updatedTracks })
      if (selectedKeyframeId === kfId) setSelectedKeyframeId(null)
    },
    [tracks, onContentChange, selectedKeyframeId]
  )

  // Handle keyframe move (reposition in time)
  const handleMoveKeyframe = useCallback(
    (kfId: string, newTime: number) => {
      const updatedTracks = tracks.map((track) => ({
        ...track,
        clips: track.clips.map((clip) => ({
          ...clip,
          keyframes: clip.keyframes.map((kf) =>
            kf.id === kfId ? { ...kf, time: Math.round(newTime) } : kf
          ),
        })),
      }))
      onContentChange({ tracks: updatedTracks })
    },
    [tracks, onContentChange]
  )

  // Handle event selection
  const handleSelectEvent = useCallback(
    (eventId: string) => {
      // Seek playhead to event position
      const event = timelineEvents.find((e) => e.id === eventId)
      if (event) {
        onPlayheadChange(event.timelinePosition)
      }
    },
    [timelineEvents, onPlayheadChange]
  )

  // Handle seek by clicking on empty track area
  const handleTrackAreaClick = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement
      // Only seek if clicking the background, not a clip
      if (target.closest('[data-clip]')) return
      const container = scrollContainerRef.current
      if (!container) return
      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.left + container.scrollLeft - labelWidth // subtract label width
      if (x < 0) return
      const ms = Math.max(0, (x * 1000) / zoomLevel)
      onPlayheadChange(Math.round(ms))
    },
    [zoomLevel, onPlayheadChange]
  )

  // Find layer for track
  const getLayerForTrack = (layerId: string) =>
    content.layers.find((l) => l.id === layerId)

  return (
    <div ref={timelineContainerRef} className="flex flex-col h-full bg-[#232428] dash-light:bg-[#F5F2EB] border-t border-[#1e1f22] dash-light:border-black/10 select-none">
      {/* Controls bar */}
      <TimelineControls
        isPlaying={isPlaying}
        currentTime={playheadPosition}
        totalDuration={totalDuration}
        zoomLevel={zoomLevel}
        onPlay={onPlay}
        onPause={onPause}
        onStop={onStop}
        onZoomChange={onZoomChange}
      />

      {/* Event markers + Ruler row */}
      <div className="flex">
        {/* Spacer for the label column */}
        <div className="flex-shrink-0 bg-[#2b2d31] dash-light:bg-white border-r border-[#1e1f22] dash-light:border-black/10 relative" style={{ width: labelWidth }}>
          <div
            className="absolute right-0 top-0 bottom-0 w-[4px] cursor-col-resize hover:bg-red-500/50 transition-colors z-10"
            onMouseDown={() => {
              labelDragging.current = true
              document.body.style.cursor = 'col-resize'
              document.body.style.userSelect = 'none'
            }}
          />
        </div>
        {/* Markers and ruler */}
        <div className="flex-1 overflow-hidden">
          {timelineEvents.length > 0 && (
            <TimelineEventMarkers
              events={timelineEvents}
              zoomLevel={zoomLevel}
              scrollLeft={scrollLeft}
              onSelectEvent={handleSelectEvent}
            />
          )}
          <TimelineRuler
            totalDuration={totalDuration}
            zoomLevel={zoomLevel}
            scrollLeft={scrollLeft}
            height={rulerHeight}
          />
        </div>
      </div>

      {/* Scrollable track area */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-auto relative"
        style={{ maxHeight: 'none' }}
        onScroll={handleScroll}
        onClick={handleTrackAreaClick}
      >
        <div className="relative" style={{ minHeight: trackAreaHeight }}>
          {/* Track rows — drag to reorder */}
          {tracks.map((track, index) => {
            const layer = getLayerForTrack(track.layerId)
            if (!layer) return null
            return (
              <TimelineTrackRow
                key={track.id}
                track={track}
                layer={layer}
                index={index}
                zoomLevel={zoomLevel}
                scrollLeft={scrollLeft}
                selectedClipId={selectedClipId}
                labelWidth={labelWidth}
                rowHeight={rowHeight}
                compact={compact}
                onSelectClip={(clipId) => {
                  onSelectClip(clipId)
                  onSelectLayer(track.layerId)
                }}
                onMoveClip={handleMoveClip}
                onResizeClip={handleResizeClip}
                onToggleMute={() => handleToggleMute(track.id)}
                onToggleHidden={() => handleToggleHidden(track.id)}
                onDeleteTrack={() => handleDeleteTrack(track.id)}
                onRenameTrack={(newName) => {
                  const updatedTracks = tracks.map((t) =>
                    t.id === track.id ? { ...t, name: newName } : t
                  )
                  onContentChange({ tracks: updatedTracks })
                }}
                onReorderTrack={(fromIndex, toIndex) => {
                  const reordered = [...tracks]
                  const [moved] = reordered.splice(fromIndex, 1)
                  reordered.splice(toIndex, 0, moved)
                  onContentChange({ tracks: reordered })
                }}
                selectedKeyframeId={selectedKeyframeId ?? undefined}
                onSelectKeyframe={handleSelectKeyframe}
                onDeleteKeyframe={handleDeleteKeyframe}
                onMoveKeyframe={handleMoveKeyframe}
              />
            )
          })}

          {/* Empty state */}
          {tracks.length === 0 && (
            <div className="flex items-center justify-center h-[120px] text-[#9aa0a8] dash-light:text-[#5B6169] text-xs">
              No tracks. Add layers to create timeline tracks.
            </div>
          )}
        </div>

        {/* Playhead overlay — positioned relative to the scroll container so it spans the full visible height */}
        <div className="absolute top-0 right-0 bottom-0 pointer-events-none overflow-hidden" style={{ left: labelWidth, minHeight: '100%' }}>
          <div
            className="relative h-full"
            style={{ transform: `translateX(-${scrollLeft}px)` }}
          >
            <TimelinePlayhead
              position={playheadPosition}
              zoomLevel={zoomLevel}
              onSeek={onPlayheadChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
