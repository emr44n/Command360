'use client'

import { useEffect } from 'react'

/**
 * Cross-browser scroll reveal. The page is server-rendered with plain
 * `data-reveal` / `data-rule` / `data-word` attributes (so it needs no
 * client wrappers); this manager adds `.is-in` as each element scrolls
 * into view, which the CSS transitions animate. Works in every browser
 * (unlike CSS `animation-timeline: view()`), and honours reduced-motion.
 */
export function RevealManager() {
  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>('[data-reveal],[data-rule],[data-word]')
    )
    if (!els.length) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      els.forEach((el) => el.classList.add('is-in'))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in')
            io.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )
    els.forEach((el) => io.observe(el))

    // Safety: reveal anything already above the fold on first paint.
    requestAnimationFrame(() => {
      const vh = window.innerHeight
      els.forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.top < vh * 0.9) el.classList.add('is-in')
      })
    })

    return () => io.disconnect()
  }, [])

  return null
}
