'use client'

import { useEffect, useState } from 'react'

/**
 * A thin gradient bar pinned to the top of the viewport that fills as the
 * page scrolls. Reads scroll position on a passive listener and animates
 * via transform (scaleX) for a cheap, jank-free fill.
 */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const el = document.documentElement
      const max = el.scrollHeight - el.clientHeight
      setProgress(max > 0 ? el.scrollTop / max : 0)
    }
    // Defer the first read so we never call setState synchronously in the effect.
    const raf = requestAnimationFrame(update)
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-[70] h-[3px] pointer-events-none" aria-hidden="true">
      <div
        className="scroll-progress h-full w-full bg-gradient-to-r from-red-600 via-red-500 to-orange-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  )
}
