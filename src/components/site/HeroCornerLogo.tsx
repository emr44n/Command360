'use client'

import { useEffect, useRef, useState } from 'react'
import { BrandMark } from './BrandMark'

/**
 * Brand logo in the bottom-right corner of a hero image panel.
 *
 * Runs the SAME micro-interaction as the header/footer logo, but triggered by
 * hovering the whole image panel (its parent), not just the logo: entering the
 * image spins the mark one clockwise turn and scales it up; leaving spins
 * another clockwise turn back to upright and scales it back to its original
 * size. Always clockwise. Rendered ~10% larger than the header logo so it
 * stands out. Honours reduced-motion.
 */
export function HeroCornerLogo({ size = 33, className = '' }: { size?: number; className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [turns, setTurns] = useState(0)
  const [hover, setHover] = useState(false)
  const [reduce, setReduce] = useState(false)

  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduce(m.matches)
    sync()
    m.addEventListener('change', sync)
    return () => m.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (reduce) return
    const panel = wrapRef.current?.parentElement
    if (!panel) return
    const enter = () => { setHover(true); setTurns((n) => n + 1) }
    const leave = () => { setHover(false); setTurns((n) => n + 1) }
    panel.addEventListener('mouseenter', enter)
    panel.addEventListener('mouseleave', leave)
    return () => {
      panel.removeEventListener('mouseenter', enter)
      panel.removeEventListener('mouseleave', leave)
    }
  }, [reduce])

  return (
    <div
      ref={wrapRef}
      className={`absolute bottom-3 right-3 z-[5] inline-flex items-center justify-center pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {/* soft dark disc so the mark reads on any image */}
      <span className="absolute inset-[-7px] rounded-full bg-black/35 backdrop-blur-[2px]" />
      <span
        className="relative inline-flex will-change-transform"
        style={reduce ? undefined : { transform: `rotate(${turns * 360}deg) scale(${hover ? 1.12 : 1})`, transition: 'transform 0.9s cubic-bezier(0.22, 0.61, 0.36, 1)' }}
      >
        <BrandMark size={size} animated={false} />
      </span>
    </div>
  )
}
