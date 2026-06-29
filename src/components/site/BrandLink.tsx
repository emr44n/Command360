'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { BrandMark } from './BrandMark'

/**
 * Header brand link (logo + COMMAND 360 wordmark). Hovering anywhere on the
 * link spins the logo one full turn clockwise and settles it back upright;
 * moving the cursor away spins it another full turn clockwise (never
 * reversing), again settling upright. A small, deliberate micro-animation.
 * Honours prefers-reduced-motion (no spin).
 */
export function BrandLink({
  size = 30,
  wordmark = true,
  className = 'flex items-center gap-3 text-white shrink-0',
}: {
  size?: number
  wordmark?: boolean
  className?: string
}) {
  const [turns, setTurns] = useState(0)
  const [reduce, setReduce] = useState(false)

  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduce(m.matches)
    sync()
    m.addEventListener('change', sync)
    return () => m.removeEventListener('change', sync)
  }, [])

  // each hover-enter and hover-leave adds one clockwise turn, so the logo
  // always rotates the same direction and lands back at its start orientation
  const spin = () => { if (!reduce) setTurns((t) => t + 1) }

  return (
    <Link href="/" className={className} onMouseEnter={spin} onMouseLeave={spin}>
      <span
        className="inline-flex shrink-0 will-change-transform"
        style={{
          transform: `rotate(${turns * 360}deg)`,
          transition: reduce ? undefined : 'transform 0.8s cubic-bezier(0.22, 0.61, 0.36, 1)',
        }}
      >
        <BrandMark size={size} />
      </span>
      {wordmark && (
        <span className="ff-wordmark text-[18px] tracking-[0.01em] whitespace-nowrap">COMMAND&nbsp;360</span>
      )}
    </Link>
  )
}
