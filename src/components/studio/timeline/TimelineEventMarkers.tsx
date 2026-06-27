'use client'

import { useState } from 'react'
import type { StudioTimelineEvent } from '@/types/slide'

interface TimelineEventMarkersProps {
  events: StudioTimelineEvent[]
  zoomLevel: number
  scrollLeft: number
  onSelectEvent: (eventId: string) => void
}

export function TimelineEventMarkers({
  events,
  zoomLevel,
  scrollLeft,
  onSelectEvent,
}: TimelineEventMarkersProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <div className="relative h-5 bg-[#1e1f22] border-b border-[#3f4147] overflow-hidden select-none">
      <div
        className="relative h-full"
        style={{ transform: `translateX(-${scrollLeft}px)` }}
      >
        {events.map((event) => {
          const left = (event.timelinePosition * zoomLevel) / 1000
          const width = Math.max(4, (event.duration * zoomLevel) / 1000)
          const color = event.color || '#6366f1'

          return (
            <div
              key={event.id}
              className="absolute top-0.5 h-4 rounded-none cursor-pointer transition-opacity hover:opacity-100"
              style={{
                left,
                width,
                backgroundColor: color,
                opacity: hoveredId === event.id ? 1 : 0.7,
              }}
              onClick={() => onSelectEvent(event.id)}
              onMouseEnter={() => setHoveredId(event.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Flag stem on the left */}
              <div
                className="absolute left-0 top-0 w-0.5 h-full rounded-none"
                style={{ backgroundColor: color }}
              />
              {/* Event name tooltip on hover */}
              {hoveredId === event.id && (
                <div className="absolute bottom-full left-0 mb-1 px-1.5 py-0.5 rounded-none bg-[#2b2d31] border border-[#3f4147] text-[10px] text-white whitespace-nowrap shadow-lg z-50">
                  {event.name}
                </div>
              )}
              {/* Event name inside if wide enough */}
              {width > 40 && (
                <span className="absolute inset-0 flex items-center px-1 text-[9px] text-white font-medium truncate">
                  {event.name}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
