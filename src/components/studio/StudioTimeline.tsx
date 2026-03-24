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
  const [scrollLeft, setScrollLeft] = useState(0)

  const tracks = content.tracks ?? []
  const timelineEvents = content.timelineEvents ?? []
  const totalDuration = content.totalDuration ?? 10000

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
    const viewRight = viewLeft + container.clientWidth - 120 // subtract label width
    if (playheadPx > viewRight - 50) {
      container.scrollLeft = playheadPx - container.clientWidth / 2
    }
  }, [playheadPosition, isPlaying, zoomLevel])

  // Track area height for playhead
  const trackAreaHeight = Math.max(tracks.length * 40, 120)

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
      const x = e.clientX - rect.left + container.scrollLeft - 120 // subtract label width
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
    <div className="flex flex-col bg-zinc-900 border-t border-zinc-800 select-none">
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
        <div className="flex-shrink-0 w-[120px] bg-zinc-900 border-r border-zinc-800" />
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
          />
        </div>
      </div>

      {/* Scrollable track area */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-auto relative"
        style={{ maxHeight: 300 }}
        onScroll={handleScroll}
        onClick={handleTrackAreaClick}
      >
        <div className="relative" style={{ minHeight: trackAreaHeight }}>
          {/* Track rows */}
          {tracks.map((track, index) => {
            const layer = getLayerForTrack(track.layerId)
            if (!layer) return null
            return (
              <TimelineTrackRow
                key={track.id}
                track={track}
                layer={layer}
                zoomLevel={zoomLevel}
                scrollLeft={scrollLeft}
                selectedClipId={selectedClipId}
                onSelectClip={(clipId) => {
                  onSelectClip(clipId)
                  onSelectLayer(track.layerId)
                }}
                onMoveClip={handleMoveClip}
                onResizeClip={handleResizeClip}
                onToggleMute={() => handleToggleMute(track.id)}
                onToggleHidden={() => handleToggleHidden(track.id)}
                onDeleteTrack={() => handleDeleteTrack(track.id)}
              />
            )
          })}

          {/* Empty state */}
          {tracks.length === 0 && (
            <div className="flex items-center justify-center h-[120px] text-zinc-600 text-xs">
              No tracks. Add layers to create timeline tracks.
            </div>
          )}

          {/* Playhead overlay */}
          <div className="absolute top-0 left-[120px] right-0 bottom-0 pointer-events-none overflow-hidden">
            <div
              className="relative h-full"
              style={{ transform: `translateX(-${scrollLeft}px)` }}
            >
              <TimelinePlayhead
                position={playheadPosition}
                zoomLevel={zoomLevel}
                height={trackAreaHeight}
                onSeek={onPlayheadChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
