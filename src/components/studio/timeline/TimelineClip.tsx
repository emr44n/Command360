'use client'

import { useCallback, useRef } from 'react'
import type { StudioClip } from '@/types/slide'

interface TimelineClipProps {
  clip: StudioClip
  trackColor: string
  zoomLevel: number
  isSelected: boolean
  onSelect: () => void
  onMove: (newStartTime: number) => void
  onResize: (newDuration: number) => void
  onContextMenu: (e: React.MouseEvent) => void
}

type DragMode = 'move' | 'resize-left' | 'resize-right'

export function TimelineClip({
  clip,
  trackColor,
  zoomLevel,
  isSelected,
  onSelect,
  onMove,
  onResize,
  onContextMenu,
}: TimelineClipProps) {
  const dragRef = useRef<{
    mode: DragMode
    startX: number
    origStartTime: number
    origDuration: number
  } | null>(null)

  const width = (clip.duration * zoomLevel) / 1000
  const left = (clip.startTime * zoomLevel) / 1000

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, mode: DragMode) => {
      e.preventDefault()
      e.stopPropagation()
      onSelect()

      dragRef.current = {
        mode,
        startX: e.clientX,
        origStartTime: clip.startTime,
        origDuration: clip.duration,
      }

      const onMouseMove = (moveEvent: MouseEvent) => {
        if (!dragRef.current) return
        const deltaX = moveEvent.clientX - dragRef.current.startX
        const deltaMs = (deltaX * 1000) / zoomLevel

        switch (dragRef.current.mode) {
          case 'move': {
            const newStart = Math.max(0, dragRef.current.origStartTime + deltaMs)
            onMove(Math.round(newStart))
            break
          }
          case 'resize-left': {
            // Shrink/grow from left: moves start, adjusts duration inversely
            const newStart = Math.max(0, dragRef.current.origStartTime + deltaMs)
            const newDuration = dragRef.current.origDuration - (newStart - dragRef.current.origStartTime)
            if (newDuration > 50) {
              onMove(Math.round(newStart))
              onResize(Math.round(newDuration))
            }
            break
          }
          case 'resize-right': {
            const newDuration = Math.max(50, dragRef.current.origDuration + deltaMs)
            onResize(Math.round(newDuration))
            break
          }
        }
      }

      const onMouseUp = () => {
        dragRef.current = null
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
      }

      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    },
    [clip.startTime, clip.duration, zoomLevel, onSelect, onMove, onResize]
  )

  return (
    <div
      className={`absolute top-1 bottom-1 rounded group cursor-grab active:cursor-grabbing select-none ${
        isSelected ? 'ring-1 ring-blue-400 ring-offset-0' : ''
      }`}
      style={{
        left,
        width: Math.max(width, 4),
        backgroundColor: trackColor + '40',
        borderLeft: `2px solid ${trackColor}`,
      }}
      onMouseDown={(e) => handleMouseDown(e, 'move')}
      onContextMenu={onContextMenu}
    >
      {/* Selected highlight */}
      {isSelected && (
        <div className="absolute inset-0 bg-blue-500/10 rounded pointer-events-none" />
      )}

      {/* Clip label */}
      <div className="absolute inset-0 flex items-center px-1.5 overflow-hidden">
        <span className="text-[10px] text-zinc-200 truncate font-medium">
          {clip.id.slice(0, 8)}
        </span>
      </div>

      {/* Keyframe diamonds */}
      {clip.keyframes.map((kf) => {
        const kfLeft = (kf.time * zoomLevel) / 1000
        if (kfLeft < 0 || kfLeft > width) return null
        return (
          <div
            key={kf.id}
            className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-yellow-400 border border-yellow-600 z-10"
            style={{ left: kfLeft - 4 }}
            title={`${kf.property}: ${kf.value}`}
          />
        )
      })}

      {/* Left resize handle */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1.5 cursor-col-resize opacity-0 group-hover:opacity-100 hover:bg-white/20 transition-opacity z-20"
        onMouseDown={(e) => handleMouseDown(e, 'resize-left')}
      />

      {/* Right resize handle */}
      <div
        className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize opacity-0 group-hover:opacity-100 hover:bg-white/20 transition-opacity z-20"
        onMouseDown={(e) => handleMouseDown(e, 'resize-right')}
      />
    </div>
  )
}
