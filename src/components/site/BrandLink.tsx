'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BrandMark } from './BrandMark'

/**
 * Brand link (logo + COMMAND 360 wordmark) used wherever the combined mark
 * appears — site header, home nav and footer.
 *
 * Animation rules:
 *  - On load / every page navigation: after a ~1s beat the logo revolves one
 *    full turn clockwise and settles upright.
 *  - On hover (anywhere on the link): spins one full turn clockwise, settling
 *    upright; moving the cursor away spins another full turn clockwise (never
 *    reversing), again settling upright.
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
  const [hover, setHover] = useState(false)
  const [reduce, setReduce] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduce(m.matches)
    sync()
    m.addEventListener('change', sync)
    return () => m.removeEventListener('change', sync)
  }, [])

  // on first load and on every route change, wait a beat then revolve once
  useEffect(() => {
    if (reduce) return
    const t = setTimeout(() => setTurns((n) => n + 1), 1000)
    return () => clearTimeout(t)
  }, [pathname, reduce])

  // each hover-enter and hover-leave adds one clockwise turn, so the logo
  // always rotates the same direction and lands back at its start orientation;
  // hovering also scales it up slightly (and back down on leave), like the seal
  const spin = () => { if (!reduce) setTurns((n) => n + 1) }
  const onEnter = () => { setHover(true); spin() }
  const onLeave = () => { setHover(false); spin() }

  return (
    <Link href="/" className={className} onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <span
        className="inline-flex shrink-0 will-change-transform"
        style={{
          transform: `rotate(${turns * 360}deg) scale(${hover && !reduce ? 1.12 : 1})`,
          transition: reduce ? undefined : 'transform 0.9s cubic-bezier(0.22, 0.61, 0.36, 1)',
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
