'use client'

import { Eye, EyeOff, Volume2, VolumeX, Lock, Trash2 } from 'lucide-react'
import type { StudioTrack, StudioLayer } from '@/types/slide'
import { TimelineClip } from './TimelineClip'

interface TimelineTrackRowProps {
  track: StudioTrack
  layer: StudioLayer
  zoomLevel: number
  scrollLeft: number
  selectedClipId: string | null
  labelWidth?: number
  rowHeight?: number
  compact?: boolean
  onSelectClip: (clipId: string) => void
  onMoveClip: (clipId: string, newStartTime: number) => void
  onResizeClip: (clipId: string, newDuration: number) => void
  onToggleMute: () => void
  onToggleHidden: () => void
  onDeleteTrack: () => void
}

export function TimelineTrackRow({
  track,
  layer,
  zoomLevel,
  scrollLeft,
  selectedClipId,
  onSelectClip,
  onMoveClip,
  onResizeClip,
  onToggleMute,
  onToggleHidden,
  onDeleteTrack,
  labelWidth = 140,
  rowHeight = 40,
  compact = false,
}: TimelineTrackRowProps) {
  return (
    <div className="flex border-b border-zinc-800/60 group/row" style={{ height: rowHeight }}>
      {/* Left label area */}
      <div className="flex-shrink-0 flex items-center gap-1 px-2 bg-zinc-900 border-r border-zinc-800" style={{ width: labelWidth }}>
        {/* Color dot */}
        <div
          className="rounded-full flex-shrink-0"
          style={{ backgroundColor: track.color, width: compact ? 6 : 8, height: compact ? 6 : 8 }}
        />
        {/* Track name */}
        <span className="text-zinc-300 truncate flex-1" style={{ fontSize: compact ? 9 : 11 }} title={track.name}>
          {track.name}
        </span>
        {/* Track action buttons */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover/row:opacity-100 transition-opacity">
          <button
            onClick={onToggleMute}
            className={`p-0.5 rounded transition-colors ${
              track.muted ? 'text-red-400 opacity-100' : 'text-zinc-500 hover:text-zinc-300'
            }`}
            title={track.muted ? 'Unmute' : 'Mute'}
          >
            {track.muted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
          </button>
          <button
            onClick={onToggleHidden}
            className={`p-0.5 rounded transition-colors ${
              track.hidden ? 'text-red-400 opacity-100' : 'text-zinc-500 hover:text-zinc-300'
            }`}
            title={track.hidden ? 'Show' : 'Hide'}
          >
            {track.hidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          </button>
          {track.locked && (
            <Lock className="w-3 h-3 text-zinc-600" />
          )}
          <button
            onClick={onDeleteTrack}
            className="p-0.5 rounded text-zinc-500 hover:text-red-400 transition-colors"
            title="Delete track"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Right clip area */}
      <div className="flex-1 relative overflow-hidden bg-zinc-950/50">
        <div
          className="relative h-full"
          style={{ transform: `translateX(-${scrollLeft}px)` }}
        >
          {track.clips.map((clip) => (
            <TimelineClip
              key={clip.id}
              clip={clip}
              trackColor={track.color}
              zoomLevel={zoomLevel}
              isSelected={selectedClipId === clip.id}
              onSelect={() => onSelectClip(clip.id)}
              onMove={(newStartTime) => onMoveClip(clip.id, newStartTime)}
              onResize={(newDuration) => onResizeClip(clip.id, newDuration)}
              onContextMenu={(e) => e.preventDefault()}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
