'use client'
import { useEffect, useRef, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
  stagger?: boolean
  delay?: number
  direction?: 'up' | 'left' | 'right' | 'scale' | 'fade'
}

export function ScrollReveal({ children, className = '', stagger = false, delay = 0, direction = 'up' }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.opacity = '1'
      el.style.transform = 'none'
      el.style.filter = 'none'
      el.querySelectorAll('.sr, .stagger-children > *').forEach((child) => {
        ;(child as HTMLElement).style.opacity = '1'
        ;(child as HTMLElement).style.transform = 'none'
        ;(child as HTMLElement).style.filter = 'none'
      })
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (delay > 0) {
              setTimeout(() => entry.target.classList.add('revealed'), delay)
            } else {
              entry.target.classList.add('revealed')
            }
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  const baseClass = stagger ? 'stagger-children' : `sr sr-${direction}`

  return (
    <div ref={ref} className={`${baseClass} ${className}`}>
      {children}
    </div>
  )
}
