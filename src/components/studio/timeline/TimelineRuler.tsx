'use client'

import { useMemo } from 'react'

interface TimelineRulerProps {
  totalDuration: number
  zoomLevel: number
  scrollLeft: number
  height?: number
}

export function TimelineRuler({ totalDuration, zoomLevel, scrollLeft, height = 24 }: TimelineRulerProps) {
  const totalWidth = (totalDuration * zoomLevel) / 1000

  const ticks = useMemo(() => {
    const result: { position: number; label: string | null; isMajor: boolean }[] = []
    const totalMs = totalDuration
    // Determine tick interval based on zoom
    // At low zoom, show fewer ticks; at high zoom, show more
    const msPerPixel = 1000 / zoomLevel
    let majorInterval: number
    let minorInterval: number

    if (msPerPixel > 10) {
      // Very zoomed out: major every 5s, minor every 1s
      majorInterval = 5000
      minorInterval = 1000
    } else if (msPerPixel > 2) {
      // Normal: major every 1s, minor every 500ms
      majorInterval = 1000
      minorInterval = 500
    } else {
      // Zoomed in: major every 1s, minor every 100ms
      majorInterval = 1000
      minorInterval = 100
    }

    for (let ms = 0; ms <= totalMs; ms += minorInterval) {
      const isMajor = ms % majorInterval === 0
      const position = (ms * zoomLevel) / 1000
      let label: string | null = null
      if (isMajor) {
        const totalSec = Math.floor(ms / 1000)
        const min = Math.floor(totalSec / 60)
        const sec = totalSec % 60
        label = `${min}:${String(sec).padStart(2, '0')}`
      }
      result.push({ position, label, isMajor })
    }
    return result
  }, [totalDuration, zoomLevel])

  return (
    <div className="relative bg-[#1e1f22] border-b border-[#3f4147] overflow-hidden select-none" style={{ height }}>
      <div
        className="relative h-full"
        style={{ width: totalWidth, transform: `translateX(-${scrollLeft}px)` }}
      >
        {ticks.map((tick, i) => (
          <div
            key={i}
            className="absolute top-0 h-full"
            style={{ left: tick.position }}
          >
            {/* Tick line */}
            <div
              className={`absolute bottom-0 w-px ${
                tick.isMajor ? 'h-3 bg-[#9aa0a8]' : 'h-1.5 bg-[#3f4147]'
              }`}
            />
            {/* Label */}
            {tick.label !== null && (
              <span
                className="absolute left-1 text-[#9aa0a8] whitespace-nowrap font-mono tabular-nums"
                style={{ top: 1, fontSize: height < 22 ? 7 : 9 }}
              >
                {tick.label}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
