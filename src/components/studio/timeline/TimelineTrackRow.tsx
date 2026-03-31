'use client'

import { useState } from 'react'
import { Eye, EyeOff, Volume2, VolumeX, Lock, Trash2, GripVertical } from 'lucide-react'
import type { StudioTrack, StudioLayer } from '@/types/slide'
import { TimelineClip } from './TimelineClip'

interface TimelineTrackRowProps {
  track: StudioTrack
  layer: StudioLayer
  index?: number
  zoomLevel: number
  scrollLeft: number
  selectedClipId: string | null
  selectedKeyframeId?: string
  labelWidth?: number
  rowHeight?: number
  compact?: boolean
  onSelectClip: (clipId: string) => void
  onMoveClip: (clipId: string, newStartTime: number) => void
  onResizeClip: (clipId: string, newDuration: number) => void
  onToggleMute: () => void
  onToggleHidden: () => void
  onDeleteTrack: () => void
  onRenameTrack?: (newName: string) => void
  onReorderTrack?: (fromIndex: number, toIndex: number) => void
  onSelectKeyframe?: (id: string) => void
  onDeleteKeyframe?: (id: string) => void
  onMoveKeyframe?: (id: string, newTime: number) => void
}

export function TimelineTrackRow({
  track,
  layer,
  index = 0,
  zoomLevel,
  scrollLeft,
  selectedClipId,
  onSelectClip,
  onMoveClip,
  onResizeClip,
  onToggleMute,
  onToggleHidden,
  onDeleteTrack,
  onRenameTrack,
  onReorderTrack,
  selectedKeyframeId,
  onSelectKeyframe,
  onDeleteKeyframe,
  onMoveKeyframe,
  labelWidth = 140,
  rowHeight = 40,
  compact = false,
}: TimelineTrackRowProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(track.name)

  const handleDoubleClick = () => {
    if (!onRenameTrack) return
    setEditName(track.name)
    setIsEditing(true)
  }

  const handleRenameSubmit = () => {
    if (editName.trim() && onRenameTrack) {
      onRenameTrack(editName.trim())
    }
    setIsEditing(false)
  }

  return (
    <div
      className="flex border-b border-[#1e1f22]/60 group/row"
      style={{ height: rowHeight }}
      draggable={!!onReorderTrack}
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', String(index))
        e.dataTransfer.effectAllowed = 'move'
      }}
      onDragOver={(e) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
      }}
      onDrop={(e) => {
        e.preventDefault()
        const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10)
        if (!isNaN(fromIndex) && fromIndex !== index && onReorderTrack) {
          onReorderTrack(fromIndex, index)
        }
      }}
    >
      {/* Left label area */}
      <div className="flex-shrink-0 flex items-center gap-1 px-1 bg-[#2b2d31] border-r border-[#1e1f22]" style={{ width: labelWidth }}>
        {/* Drag handle */}
        {onReorderTrack && (
          <GripVertical className="w-3 h-3 text-zinc-600 shrink-0 cursor-grab active:cursor-grabbing" />
        )}
        {/* Color dot */}
        <div
          className="rounded-full flex-shrink-0"
          style={{ backgroundColor: track.color, width: compact ? 6 : 8, height: compact ? 6 : 8 }}
        />
        {/* Track name */}
        {isEditing ? (
          <input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleRenameSubmit}
            onKeyDown={(e) => { if (e.key === 'Enter') handleRenameSubmit(); if (e.key === 'Escape') setIsEditing(false) }}
            className="flex-1 h-5 text-zinc-100 bg-zinc-800 border border-zinc-600 rounded px-1 outline-none"
            style={{ fontSize: compact ? 9 : 11 }}
            autoFocus
          />
        ) : (
          <span
            className="text-zinc-300 truncate flex-1 cursor-default"
            style={{ fontSize: compact ? 9 : 11 }}
            title={`${track.name} (double-click to rename)`}
            onDoubleClick={handleDoubleClick}
          >
            {track.name}
          </span>
        )}
        {/* Track action buttons */}
        <div className="flex items-center gap-0.5 shrink-0">
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
              layerName={layer.name}
              selectedKeyframeId={selectedKeyframeId}
              onSelect={() => onSelectClip(clip.id)}
              onMove={(newStartTime) => onMoveClip(clip.id, newStartTime)}
              onResize={(newDuration) => onResizeClip(clip.id, newDuration)}
              onContextMenu={(e) => e.preventDefault()}
              onSelectKeyframe={onSelectKeyframe}
              onDeleteKeyframe={onDeleteKeyframe}
              onMoveKeyframe={onMoveKeyframe}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
