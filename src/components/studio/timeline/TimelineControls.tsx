'use client'

import { Play, Pause, Square, ZoomIn, ZoomOut } from 'lucide-react'

interface TimelineControlsProps {
  isPlaying: boolean
  currentTime: number
  totalDuration: number
  zoomLevel: number
  onPlay: () => void
  onPause: () => void
  onStop: () => void
  onZoomChange: (zoom: number) => void
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const millis = Math.floor(ms % 1000)
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(millis).padStart(3, '0')}`
}

export function TimelineControls({
  isPlaying,
  currentTime,
  totalDuration,
  zoomLevel,
  onPlay,
  onPause,
  onStop,
  onZoomChange,
}: TimelineControlsProps) {
  const MIN_ZOOM = 50
  const MAX_ZOOM = 500

  const handleZoomSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    onZoomChange(Number(e.target.value))
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2 border-b border-zinc-800 bg-zinc-900/80">
      {/* Transport controls */}
      <div className="flex items-center gap-1">
        {isPlaying ? (
          <button
            onClick={onPause}
            className="flex items-center justify-center w-7 h-7 rounded bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
            title="Pause"
          >
            <Pause className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={onPlay}
            className="flex items-center justify-center w-7 h-7 rounded bg-red-600 hover:bg-red-500 text-white transition-colors"
            title="Play"
          >
            <Play className="w-3.5 h-3.5 ml-0.5" />
          </button>
        )}
        <button
          onClick={onStop}
          className="flex items-center justify-center w-7 h-7 rounded bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
          title="Stop"
        >
          <Square className="w-3 h-3" />
        </button>
      </div>

      {/* Time display */}
      <div className="flex items-center gap-1 px-2 py-1 rounded bg-zinc-950 border border-zinc-800 font-mono text-xs tabular-nums">
        <span className="text-zinc-100">{formatTime(currentTime)}</span>
        <span className="text-zinc-600">/</span>
        <span className="text-zinc-400">{formatTime(totalDuration)}</span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Zoom controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onZoomChange(Math.max(MIN_ZOOM, zoomLevel - 25))}
          className="flex items-center justify-center w-6 h-6 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          title="Zoom out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <input
          type="range"
          min={MIN_ZOOM}
          max={MAX_ZOOM}
          value={zoomLevel}
          onChange={handleZoomSlider}
          className="w-24 h-1 accent-red-500 bg-zinc-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-500"
        />
        <button
          onClick={() => onZoomChange(Math.min(MAX_ZOOM, zoomLevel + 25))}
          className="flex items-center justify-center w-6 h-6 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          title="Zoom in"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <span className="text-[10px] text-zinc-500 w-12 text-right tabular-nums">
          {zoomLevel}px/s
        </span>
      </div>
    </div>
  )
}
