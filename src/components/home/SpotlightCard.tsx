'use client'

import Link from 'next/link'
import { useRef, type ReactNode, type MouseEvent, type CSSProperties, type Ref } from 'react'

interface Props {
  children: ReactNode
  className?: string
  /** When provided, renders as a Next.js Link instead of a div. */
  href?: string
  /** rgba/hex colour used for the cursor-following glow. */
  glow?: string
}

/**
 * A card that paints a soft radial "spotlight" that follows the cursor.
 * Purely decorative and pointer-events-none, so it never blocks clicks.
 * Falls back gracefully — with no hover (touch) it simply stays hidden.
 */
export function SpotlightCard({ children, className = '', href, glow = 'rgba(239,68,68,0.10)' }: Props) {
  const ref = useRef<HTMLElement>(null)

  const handleMove = (e: MouseEvent<HTMLElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    el.style.setProperty('--my', `${e.clientY - rect.top}px`)
  }

  const style = { '--spot': glow } as CSSProperties
  const classes = `spotlight-card ${className}`

  if (href) {
    return (
      <Link
        href={href}
        ref={ref as Ref<HTMLAnchorElement>}
        onMouseMove={handleMove}
        style={style}
        className={classes}
      >
        {children}
      </Link>
    )
  }

  return (
    <div
      ref={ref as Ref<HTMLDivElement>}
      onMouseMove={handleMove}
      style={style}
      className={classes}
    >
      {children}
    </div>
  )
}
