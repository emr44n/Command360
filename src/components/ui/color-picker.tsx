'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Pipette } from 'lucide-react'

const PRESET_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4',
  '#3b82f6', '#8b5cf6', '#ec4899', '#ffffff', '#000000',
  '#4a5568', '#1a1a2e', '#2d3748', '#718096', '#a0aec0',
]

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return [0, 0, l * 100]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
  else if (max === g) h = ((b - r) / d + 2) / 6
  else h = ((r - g) / d + 4) / 6
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => { const k = (n + h / 30) % 12; return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1) }
  const toHex = (x: number) => Math.round(x * 255).toString(16).padStart(2, '0')
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`
}

interface ColorPickerPopoverProps {
  value: string
  onChange: (color: string) => void
  className?: string
}

export function ColorPickerPopover({ value, onChange, className }: ColorPickerPopoverProps) {
  const [open, setOpen] = useState(false)
  const [hexInput, setHexInput] = useState(value)
  const [hsl, setHsl] = useState(() => hexToHsl(value || '#4a5568'))
  const spectrumRef = useRef<HTMLCanvasElement>(null)
  const hueRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    setHexInput(value)
    try { setHsl(hexToHsl(value || '#4a5568')) } catch { /* invalid hex */ }
  }, [value])

  // Draw spectrum (saturation x lightness for current hue)
  useEffect(() => {
    const canvas = spectrumRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const w = canvas.width, h = canvas.height
    for (let x = 0; x < w; x++) {
      for (let y = 0; y < h; y++) {
        const s = (x / w) * 100
        const l = 100 - (y / h) * 100
        ctx.fillStyle = `hsl(${hsl[0]}, ${s}%, ${l}%)`
        ctx.fillRect(x, y, 1, 1)
      }
    }
  }, [hsl[0], open])

  // Draw hue bar
  useEffect(() => {
    const canvas = hueRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const w = canvas.width
    for (let x = 0; x < w; x++) {
      ctx.fillStyle = `hsl(${(x / w) * 360}, 100%, 50%)`
      ctx.fillRect(x, 0, 1, canvas.height)
    }
  }, [open])

  const handleSpectrumClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const s = Math.round(((e.clientX - rect.left) / rect.width) * 100)
    const l = Math.round(100 - ((e.clientY - rect.top) / rect.height) * 100)
    const newHsl: [number, number, number] = [hsl[0], Math.max(0, Math.min(100, s)), Math.max(0, Math.min(100, l))]
    setHsl(newHsl)
    const hex = hslToHex(...newHsl)
    setHexInput(hex)
    onChange(hex)
  }, [hsl, onChange])

  const handleHueClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const h = Math.round(((e.clientX - rect.left) / rect.width) * 360)
    const newHsl: [number, number, number] = [Math.max(0, Math.min(360, h)), hsl[1], hsl[2]]
    setHsl(newHsl)
    const hex = hslToHex(...newHsl)
    setHexInput(hex)
    onChange(hex)
  }, [hsl, onChange])

  const handleHexSubmit = useCallback(() => {
    const hex = hexInput.startsWith('#') ? hexInput : `#${hexInput}`
    if (/^#[0-9a-fA-F]{6}$/.test(hex)) {
      onChange(hex)
      try { setHsl(hexToHsl(hex)) } catch { /* invalid */ }
    }
  }, [hexInput, onChange])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className={`h-7 w-9 rounded-none border border-[#3f4147] cursor-pointer transition-all hover:border-zinc-400 ${className || ''}`} style={{ backgroundColor: value || '#4a5568' }} />
      </PopoverTrigger>
      <PopoverContent className="w-52 bg-[#1a1a1c] border-[#3f4147] p-3 shadow-2xl" side="left" sideOffset={8}>
        {/* Spectrum */}
        <canvas
          ref={spectrumRef}
          width={180} height={120}
          className="w-full h-28 rounded-none cursor-crosshair border border-[#2b2d31]"
          onClick={handleSpectrumClick}
          onMouseDown={e => { const move = (ev: MouseEvent) => handleSpectrumClick(ev as unknown as React.MouseEvent<HTMLCanvasElement>); const up = () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up) }; window.addEventListener('mousemove', move); window.addEventListener('mouseup', up); handleSpectrumClick(e) }}
        />
        {/* Hue bar */}
        <canvas
          ref={hueRef}
          width={180} height={14}
          className="w-full h-3 rounded-full cursor-pointer mt-2 border border-[#2b2d31]"
          onClick={handleHueClick}
        />
        {/* Current color + hex input */}
        <div className="flex items-center gap-2 mt-2">
          <div className="w-7 h-7 rounded-none border border-[#3f4147] shrink-0" style={{ backgroundColor: value }} />
          <div className="flex-1 flex items-center gap-1">
            <Pipette className="w-3 h-3 text-zinc-500 shrink-0" />
            <input
              type="text"
              value={hexInput}
              onChange={e => setHexInput(e.target.value)}
              onBlur={handleHexSubmit}
              onKeyDown={e => { if (e.key === 'Enter') handleHexSubmit() }}
              className="w-full h-6 px-1.5 text-[10px] font-mono rounded-none border border-[#3f4147] bg-[#2b2d31] text-zinc-200 focus:outline-none focus:border-red-500"
            />
          </div>
        </div>
        {/* Preset swatches */}
        <div className="flex flex-wrap gap-1 mt-2">
          {PRESET_COLORS.map(c => (
            <button key={c} onClick={() => { onChange(c); setHexInput(c); setHsl(hexToHsl(c)) }}
              className={`w-4 h-4 rounded-none border transition-all hover:scale-110 ${value === c ? 'border-white ring-1 ring-white/30' : 'border-[#3f4147]'}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
