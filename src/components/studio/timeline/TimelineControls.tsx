'use client'

import { Play, Pause, Square, ZoomIn, ZoomOut } from 'lucide-react'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

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
    <div className="flex items-center gap-1.5 px-2 py-1 border-b border-[#1e1f22] bg-[#232428]/80">
      {/* Transport controls */}
      <div className="flex items-center gap-1">
        {isPlaying ? (
          <Tooltip><TooltipTrigger asChild>
          <button
            onClick={onPause}
            className="flex items-center justify-center w-6 h-6 rounded-none bg-[#1e1f22] hover:bg-[#3f4147] text-white transition-colors cursor-pointer"
          >
            <Pause className="w-3.5 h-3.5" />
          </button>
          </TooltipTrigger><TooltipContent>Pause</TooltipContent></Tooltip>
        ) : (
          <Tooltip><TooltipTrigger asChild>
          <button
            onClick={onPlay}
            className="flex items-center justify-center w-6 h-6 rounded-md bg-zinc-700 hover:bg-zinc-600 text-white transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 ml-0.5" />
          </button>
          </TooltipTrigger><TooltipContent>Play</TooltipContent></Tooltip>
        )}
        <Tooltip><TooltipTrigger asChild>
        <button
          onClick={onStop}
          className="flex items-center justify-center w-6 h-6 rounded-md bg-[#1e1f22] hover:bg-zinc-700 text-white transition-colors cursor-pointer"
        >
          <Square className="w-3 h-3" />
        </button>
        </TooltipTrigger><TooltipContent>Stop</TooltipContent></Tooltip>
      </div>

      {/* Time display */}
      <div className="flex items-center gap-1 px-2 py-1 rounded bg-zinc-950 border border-[#1e1f22] font-mono text-xs tabular-nums">
        <span className="text-zinc-100">{formatTime(currentTime)}</span>
        <span className="text-zinc-600">/</span>
        <span className="text-zinc-400">{formatTime(totalDuration)}</span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Zoom controls */}
      <div className="flex items-center gap-2">
        <Tooltip><TooltipTrigger asChild>
        <button
          onClick={() => onZoomChange(Math.max(MIN_ZOOM, zoomLevel - 25))}
          className="flex items-center justify-center w-5 h-5 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-[#1e1f22] transition-colors cursor-pointer"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        </TooltipTrigger><TooltipContent>Zoom out</TooltipContent></Tooltip>
        <input
          type="range"
          min={MIN_ZOOM}
          max={MAX_ZOOM}
          value={zoomLevel}
          onChange={handleZoomSlider}
          className="w-24 h-1 accent-red-500 bg-zinc-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-500"
        />
        <Tooltip><TooltipTrigger asChild>
        <button
          onClick={() => onZoomChange(Math.min(MAX_ZOOM, zoomLevel + 25))}
          className="flex items-center justify-center w-5 h-5 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-[#1e1f22] transition-colors cursor-pointer"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        </TooltipTrigger><TooltipContent>Zoom in</TooltipContent></Tooltip>
        <span className="text-[10px] text-zinc-500 w-12 text-right tabular-nums">
          {zoomLevel}px/s
        </span>
      </div>
    </div>
  )
}
