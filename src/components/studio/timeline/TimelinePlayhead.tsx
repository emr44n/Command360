'use client'

import { useCallback, useRef } from 'react'

interface TimelinePlayheadProps {
  position: number
  zoomLevel: number
  height?: number
  onSeek: (ms: number) => void
}

export function TimelinePlayhead({ position, zoomLevel, onSeek }: TimelinePlayheadProps) {
  const isDragging = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const pixelPosition = (position * zoomLevel) / 1000

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      isDragging.current = true

      const onMouseMove = (moveEvent: MouseEvent) => {
        if (!isDragging.current) return
        const parent = containerRef.current?.parentElement
        if (!parent) return
        const rect = parent.getBoundingClientRect()
        const scrollLeft = parent.scrollLeft || 0
        const x = moveEvent.clientX - rect.left + scrollLeft
        const ms = Math.max(0, (x * 1000) / zoomLevel)
        onSeek(Math.round(ms))
      }

      const onMouseUp = () => {
        isDragging.current = false
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
      }

      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    },
    [zoomLevel, onSeek]
  )

  return (
    <div
      ref={containerRef}
      className="absolute top-0 bottom-0 z-30 pointer-events-none"
      style={{ left: pixelPosition }}
    >
      {/* Triangle handle at top */}
      <div
        className="pointer-events-auto cursor-col-resize relative -left-[5px] -top-0"
        onMouseDown={handleMouseDown}
      >
        <svg width="11" height="10" viewBox="0 0 11 10" className="drop-shadow-sm">
          <polygon points="0,0 11,0 5.5,10" fill="#ef4444" />
        </svg>
      </div>
      {/* Vertical line */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-red-500 pointer-events-none" />
    </div>
  )
}
