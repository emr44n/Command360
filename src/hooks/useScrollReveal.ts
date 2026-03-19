'use client'
import { useEffect, useRef } from 'react'

export function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )

    // Observe the element itself and all children with reveal classes
    const targets = el.querySelectorAll('.reveal, .reveal-scale, .stagger-children')
    targets.forEach((t) => observer.observe(t))

    // Also observe the element if it has reveal classes
    if (el.classList.contains('reveal') || el.classList.contains('reveal-scale') || el.classList.contains('stagger-children')) {
      observer.observe(el)
    }

    return () => observer.disconnect()
  }, [])

  return ref
}
