'use client'

import { useEffect, useRef } from 'react'
import { animate, motion, useMotionValue } from 'framer-motion'
import { BrandMark } from './BrandMark'

/**
 * Brand logo in the bottom-right corner of a hero image panel.
 *
 * The spin is triggered by hovering the whole image (the logo's parent panel),
 * not the logo itself: while the cursor is over the image the logo revolves
 * slowly and continuously clockwise; when the cursor leaves it does one quick
 * faster turn and settles back upright. It only ever turns clockwise. Rendered
 * ~10% larger than the header logo so it stands out. Honours reduced-motion.
 */
export function HeroCornerLogo({ size = 33, className = '' }: { size?: number; className?: string }) {
  const rotate = useMotionValue(0)
  const wrapRef = useRef<HTMLDivElement>(null)
  const ctrl = useRef<ReturnType<typeof animate> | null>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const panel = wrapRef.current?.parentElement
    if (!panel) return

    const SLOW = 95 // deg/sec — a gentle revolve while hovered

    const startSpin = () => {
      ctrl.current?.stop()
      const from = rotate.get()
      // animate far ahead at constant speed => effectively continuous
      ctrl.current = animate(rotate, from + 100000, { duration: 100000 / SLOW, ease: 'linear' })
    }
    const settle = () => {
      ctrl.current?.stop()
      const cur = rotate.get()
      // a quick extra clockwise turn that lands upright (never anticlockwise)
      const target = (Math.floor(cur / 360) + 2) * 360
      ctrl.current = animate(rotate, target, { duration: 0.7, ease: [0.2, 0.7, 0.3, 1] })
    }

    panel.addEventListener('mouseenter', startSpin)
    panel.addEventListener('mouseleave', settle)
    return () => {
      ctrl.current?.stop()
      panel.removeEventListener('mouseenter', startSpin)
      panel.removeEventListener('mouseleave', settle)
    }
  }, [rotate])

  return (
    <div
      ref={wrapRef}
      className={`absolute bottom-3 right-3 z-[5] inline-flex items-center justify-center pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {/* soft dark disc so the mark reads on any image */}
      <span className="absolute inset-[-7px] rounded-full bg-black/35 backdrop-blur-[2px]" />
      <motion.span className="relative inline-flex will-change-transform" style={{ rotate }}>
        <BrandMark size={size} />
      </motion.span>
    </div>
  )
}
