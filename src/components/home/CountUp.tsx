'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'

interface Props {
  value: number
  prefix?: string
  suffix?: string
  /** Animation length in ms. */
  duration?: number
  decimals?: number
  className?: string
  style?: CSSProperties
}

/**
 * Counts up from 0 to `value` the first time it scrolls into view.
 * Respects prefers-reduced-motion by rendering the final value immediately.
 */
export function CountUp({ value, prefix = '', suffix = '', duration = 1600, decimals = 0, className = '', style }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let raf = 0
    let started = false

    const run = () => {
      const start = performance.now()
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1)
        // easeOutExpo for a snappy, premium settle
        const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
        setDisplay(value * eased)
        if (t < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started) {
            started = true
            if (reduce) setDisplay(value)
            else run()
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.4 }
    )

    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [value, duration])

  return (
    <span ref={ref} className={className} style={style}>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  )
}
