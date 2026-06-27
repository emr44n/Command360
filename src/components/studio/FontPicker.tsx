'use client'
import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Search } from 'lucide-react'

const GOOGLE_FONTS = [
  'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins',
  'Raleway', 'Oswald', 'Playfair Display', 'Merriweather', 'Nunito',
  'Ubuntu', 'Rubik', 'Work Sans', 'Fira Sans', 'Quicksand', 'Karla',
  'Inconsolata', 'Source Code Pro', 'JetBrains Mono', 'Bebas Neue',
  'Anton', 'Lobster', 'Pacifico', 'Dancing Script', 'Permanent Marker',
  'Caveat', 'Comfortaa', 'Righteous', 'Bangers', 'Orbitron',
  'DM Sans', 'Space Grotesk', 'Plus Jakarta Sans', 'Outfit', 'Lexend',
  'Sora', 'Manrope', 'Figtree', 'Archivo', 'Geist',
]

// Load font dynamically
function loadFont(fontName: string) {
  const link = document.createElement('link')
  link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}&display=swap`
  link.rel = 'stylesheet'
  if (!document.querySelector(`link[href="${link.href}"]`)) {
    document.head.appendChild(link)
  }
}

interface FontPickerProps {
  value: string
  onChange: (font: string) => void
}

export function FontPicker({ value, onChange }: FontPickerProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const filtered = GOOGLE_FONTS.filter(f => f.toLowerCase().includes(search.toLowerCase()))

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(v => !v)}
        className="w-full h-5 flex items-center justify-between px-1.5 text-[9px] bg-[#1e1f22] border border-[#3f4147] rounded-none text-[#9aa0a8] cursor-pointer hover:border-red-500/50 transition-colors">
        <span className="truncate" style={{ fontFamily: value || 'inherit' }}>{value || 'Default'}</span>
        <ChevronDown className="w-2.5 h-2.5 shrink-0 text-[#9aa0a8]" />
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-0.5 z-[9999] bg-[#1e1f22] border border-[#3f4147] rounded-none shadow-2xl max-h-48 overflow-hidden flex flex-col">
          <div className="p-1 border-b border-[#2b2d31]">
            <div className="flex items-center gap-1 px-1.5 h-5 bg-[#2b2d31] rounded-none">
              <Search className="w-2.5 h-2.5 text-[#9aa0a8]" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-[8px] text-[#9aa0a8] outline-none" placeholder="Search fonts..." autoFocus />
            </div>
          </div>
          <div className="overflow-y-auto flex-1">
            {filtered.map(font => {
              loadFont(font)
              return (
                <button key={font} onClick={() => { onChange(font); setOpen(false); loadFont(font) }}
                  className={`w-full text-left px-2 py-1 text-[9px] hover:bg-[#35363c] transition-colors ${value === font ? 'text-red-400 bg-red-500/10' : 'text-[#9aa0a8]'}`}
                  style={{ fontFamily: font }}>
                  {font}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
