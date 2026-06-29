'use client'

import { useState } from 'react'
import { BrandMark } from './BrandMark'

/**
 * Brand logo dropped into the bottom-right corner of a hero image panel.
 * Hovering keeps it spinning continuously (clockwise); moving the cursor away
 * freezes it where it is. Rendered ~10% larger than the header logo so it
 * stands out on the imagery. Honours prefers-reduced-motion (see globals.css).
 */
export function HeroCornerLogo({ size = 33, className = '' }: { size?: number; className?: string }) {
  const [hover, setHover] = useState(false)
  return (
    <div
      className={`absolute bottom-3 right-3 z-[5] inline-flex items-center justify-center pointer-events-auto ${className}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-hidden="true"
    >
      {/* soft dark disc so the mark reads on any image */}
      <span className="absolute inset-[-7px] rounded-full bg-black/35 backdrop-blur-[2px]" />
      <span className={`relative inline-flex hero-corner-logo${hover ? ' is-spinning' : ''}`}>
        <BrandMark size={size} />
      </span>
    </div>
  )
}
