'use client'

import { useEffect, useState } from 'react'

/**
 * The Command 360 brand mark (aperture logo). One source of truth — used in
 * the header, footer, auth, dashboard, presenter, preview, participant and
 * in-app chrome.
 *
 * Two variants ship: the dark-mode logo (white accent segment, for dark
 * surfaces — the default everywhere) and the light-mode logo (black accent
 * segment, shown inside the light theme `.dash-light` scope). Both are rendered
 * as plain <img> of the full-resolution PNG so the browser does the downscaling
 * (crisp at every size). CSS swaps which one shows so the correct variant
 * appears in light vs dark mode everywhere — including preview/presentation.
 *
 * By default the mark animates on hover (spins one clockwise turn and scales up
 * slightly, settling back on leave) so the logo has the same micro-interaction
 * everywhere in the system. Pass `animated={false}` where an outer wrapper
 * already drives the motion (BrandLink, HeroSeal, HeroCornerLogo).
 */
export function BrandMark({
  size = 30,
  className = '',
  animated = true,
}: {
  size?: number
  className?: string
  animated?: boolean
}) {
  const [turns, setTurns] = useState(0)
  const [hover, setHover] = useState(false)
  const [reduce, setReduce] = useState(false)

  useEffect(() => {
    if (!animated) return
    const m = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduce(m.matches)
    sync()
    m.addEventListener('change', sync)
    return () => m.removeEventListener('change', sync)
  }, [animated])

  const live = animated && !reduce
  const enter = () => { if (live) { setHover(true); setTurns((n) => n + 1) } }
  const leave = () => { if (live) { setHover(false); setTurns((n) => n + 1) } }

  const imgStyle = { width: size, height: size }
  const common = { width: size, height: size, decoding: 'async' as const, draggable: false, style: imgStyle }

  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 select-none ${live ? 'will-change-transform cursor-pointer' : ''} ${className}`}
      style={live ? { transform: `rotate(${turns * 360}deg) scale(${hover ? 1.12 : 1})`, transition: 'transform 0.9s cubic-bezier(0.22, 0.61, 0.36, 1)' } : undefined}
      onMouseEnter={enter}
      onMouseLeave={leave}
    >
      {/* dark-mode logo — default on every (dark) surface, hidden in light theme */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.png" alt="Command 360" {...common} className="block dash-light:hidden" />
      {/* light-mode logo — only shown inside the light `.dash-light` scope */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo-light.png" alt="" aria-hidden="true" {...common} className="hidden dash-light:block" />
    </span>
  )
}
