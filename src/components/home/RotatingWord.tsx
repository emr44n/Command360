'use client'

import { useEffect, useState } from 'react'

/**
 * Cycles through `words` one at a time with a smooth fade/slide. Used for
 * the hero keyword (learn → grow → lead). Honours reduced-motion by
 * holding the first word. Renders a fixed inline slot so layout is stable.
 */
export function RotatingWord({
  words,
  className = '',
  interval = 1900,
}: {
  words: string[]
  className?: string
  interval?: number
}) {
  const [i, setI] = useState(0)
  const [anim, setAnim] = useState(true)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setAnim(false)
      return
    }
    const id = setInterval(() => setI((v) => (v + 1) % words.length), interval)
    return () => clearInterval(id)
  }, [words.length, interval])

  // Longest word reserves the slot width so nothing shifts as it cycles.
  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), '')

  return (
    <span className={`relative inline-grid align-baseline ${className}`} aria-live="off">
      <span className="invisible col-start-1 row-start-1" aria-hidden="true">{longest}</span>
      {words.map((w, idx) => (
        <span
          key={w}
          className="col-start-1 row-start-1 transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)]"
          style={
            anim
              ? {
                  opacity: idx === i ? 1 : 0,
                  transform: idx === i ? 'translateY(0)' : idx === (i - 1 + words.length) % words.length ? 'translateY(-0.5em)' : 'translateY(0.5em)',
                }
              : { opacity: idx === 0 ? 1 : 0 }
          }
          aria-hidden={anim ? idx !== i : idx !== 0}
        >
          {w}
        </span>
      ))}
    </span>
  )
}
