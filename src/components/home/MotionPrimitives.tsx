'use client'

import { useEffect, useRef, type ReactNode } from 'react'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Scroll-scrubbed 3D tilt + scale. As the element travels up from the
 * bottom of the viewport toward the middle it "stands up" (rotateX eases
 * to 0), grows to full scale and settles — a device tilting forward into
 * view. Driven by rAF reads of getBoundingClientRect, started/stopped by
 * an IntersectionObserver so it costs nothing while off-screen.
 * The OUTER node is measured (never transformed); the INNER node is
 * transformed, so the measurement stays stable. Honours reduced-motion.
 */
export function ScrollTilt({
  children,
  className = '',
  tilt = 14,
  fromScale = 0.9,
  perspective = 1500,
  lift = 36,
}: {
  children: ReactNode
  className?: string
  tilt?: number
  fromScale?: number
  perspective?: number
  lift?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const inner = el.firstElementChild as HTMLElement | null
    if (!inner) return
    if (prefersReducedMotion()) return

    let raf = 0

    const apply = () => {
      raf = 0
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight || 1
      // Skip work when comfortably off-screen, but never freeze: clamp does
      // the right thing at the edges.
      if (rect.bottom < -200 || rect.top > vh + 200) return
      const start = vh // fully tilted when top is at viewport bottom
      const end = vh * 0.45 // settled when center reaches ~45% up
      const center = rect.top + rect.height / 2
      let p = (start - center) / (start - end)
      p = Math.max(0, Math.min(1, p))
      const eased = 1 - Math.pow(1 - p, 3) // easeOutCubic
      const rx = (1 - eased) * tilt
      const sc = fromScale + (1 - fromScale) * eased
      const ty = (1 - eased) * lift
      inner.style.transform = `perspective(${perspective}px) rotateX(${rx.toFixed(2)}deg) scale(${sc.toFixed(3)}) translateY(${ty.toFixed(1)}px)`
    }

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    apply()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [tilt, fromScale, perspective, lift])

  return (
    <div ref={ref} className={className}>
      <div style={{ willChange: 'transform', transformOrigin: 'center bottom' }}>{children}</div>
    </div>
  )
}

/**
 * Pointer-follow 3D tilt for a hero/product element. Inner node rotates
 * gently toward the cursor with an eased transition. Disabled on coarse
 * pointers (touch) and for reduced-motion users.
 */
export function MouseTilt({
  children,
  className = '',
  max = 7,
}: {
  children: ReactNode
  className?: string
  max?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const inner = el.firstElementChild as HTMLElement | null
    if (!inner) return
    if (prefersReducedMotion()) return
    if (window.matchMedia('(pointer: coarse)').matches) return

    let raf = 0
    let tx = 0
    let ty = 0

    const applyT = () => {
      raf = 0
      inner.style.transform = `perspective(1100px) rotateY(${(tx * max).toFixed(2)}deg) rotateX(${(-ty * max).toFixed(2)}deg)`
    }
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      tx = (e.clientX - rect.left) / rect.width - 0.5
      ty = (e.clientY - rect.top) / rect.height - 0.5
      if (!raf) raf = requestAnimationFrame(applyT)
    }
    const onLeave = () => {
      inner.style.transform = 'perspective(1100px) rotateY(0deg) rotateX(0deg)'
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [max])

  return (
    <div ref={ref} className={className}>
      <div style={{ transition: 'transform 0.25s cubic-bezier(0.16,1,0.3,1)', willChange: 'transform' }}>
        {children}
      </div>
    </div>
  )
}

/**
 * Vertical parallax — translates the inner node a fraction of scroll
 * distance as it crosses the viewport. `speed` < 0 moves it up faster
 * (foreground), > 0 lags behind (background). rAF + IntersectionObserver.
 */
export function Parallax({
  children,
  className = '',
  speed = -30,
}: {
  children: ReactNode
  className?: string
  speed?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const inner = el.firstElementChild as HTMLElement | null
    if (!inner) return
    if (prefersReducedMotion()) return

    let raf = 0

    const apply = () => {
      raf = 0
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight || 1
      if (rect.bottom < -200 || rect.top > vh + 200) return
      const progress = (rect.top + rect.height / 2 - vh / 2) / vh // -~ to +~, 0 at center
      inner.style.transform = `translate3d(0, ${(progress * speed).toFixed(1)}px, 0)`
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    apply()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [speed])

  return (
    <div ref={ref} className={className}>
      <div style={{ willChange: 'transform' }}>{children}</div>
    </div>
  )
}
