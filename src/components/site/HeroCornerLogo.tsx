'use client'

import { BrandMark } from './BrandMark'

/**
 * Brand logo in the bottom-right corner of a hero image panel.
 *
 * Uses the SAME micro-interaction as the header/footer logo (via BrandMark's
 * built-in animation): hovering the logo spins it one clockwise turn and scales
 * it up; leaving spins another clockwise turn back to upright and scales it back
 * to its original size. Always clockwise. Rendered ~10% larger than the header
 * logo so it stands out. Honours reduced-motion (handled inside BrandMark).
 */
export function HeroCornerLogo({ size = 33, className = '' }: { size?: number; className?: string }) {
  return (
    <div
      className={`absolute bottom-3 right-3 z-[5] inline-flex items-center justify-center ${className}`}
      aria-hidden="true"
    >
      {/* soft dark disc so the mark reads on any image */}
      <span className="absolute inset-[-7px] rounded-full bg-black/35 backdrop-blur-[2px] pointer-events-none" />
      <BrandMark size={size} animated />
    </div>
  )
}
