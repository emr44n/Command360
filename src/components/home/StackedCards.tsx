'use client'

import { useEffect, useRef, type ReactNode } from 'react'

export interface StackItem {
  n: string
  tag: string
  title: string
  desc: string
  c: string
  preview: ReactNode
}

/**
 * Scroll-driven sticky stacked cards. Each card is `position: sticky` with
 * a stepped top offset, so card 2 scrolls up and stacks over card 1, then
 * card 3 over card 2; after the last card the page scrolls on normally.
 * A lightweight rAF scroll driver scales + dims each card as the next one
 * covers it, for a premium recede effect. Reduced-motion-safe; no deps.
 */
export function StackedCards({ items }: { items: StackItem[] }) {
  const cardRefs = useRef<Array<HTMLDivElement | null>>([])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    const smoothstep = (p: number) => p * p * (3 - 2 * p)

    const apply = () => {
      raf = 0
      const vh = window.innerHeight || 1
      const cards = cardRefs.current
      for (let i = 0; i < cards.length; i++) {
        const card = cards[i]
        if (!card) continue
        const inner = card.querySelector<HTMLElement>('.sc-inner')
        const dim = card.querySelector<HTMLElement>('.sc-dim')
        const next = cards[i + 1]
        if (!inner) continue
        if (!next) {
          // top-most card never recedes
          inner.style.transform = ''
          if (dim) dim.style.opacity = '0'
          continue
        }
        const nextTop = next.getBoundingClientRect().top
        const stickyTopNext = parseFloat(getComputedStyle(next).top) || 0
        // 0 when the next card is at the bottom of the viewport, 1 when it
        // has risen to its sticky position (fully stacked over this one).
        let p = (vh - nextTop) / (vh - stickyTopNext)
        p = Math.max(0, Math.min(1, p))
        const e = smoothstep(p)
        inner.style.transform = `translateY(${(-12 * e).toFixed(2)}px) scale(${(1 - 0.06 * e).toFixed(4)})`
        if (dim) dim.style.opacity = (0.24 * e).toFixed(3)
      }
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
  }, [items.length])

  return (
    <div className="sc-stack relative">
      {items.map((ph, i) => (
        <div
          key={ph.n}
          ref={(el) => { cardRefs.current[i] = el }}
          className="sc-card"
          style={{
            top: `calc(var(--sc-top) + ${i} * var(--sc-step))`,
            zIndex: i + 1,
            marginBottom: i < items.length - 1 ? 'var(--sc-gap)' : 0,
          }}
        >
          <div className="sc-inner relative bg-[#16191E] text-white border border-white/10 overflow-hidden shadow-[0_18px_60px_-20px_rgba(0,0,0,0.85)]">
            <div className="absolute top-[-120px] left-[-80px] w-[480px] h-[400px] pointer-events-none" aria-hidden="true" style={{ background: `radial-gradient(50% 60% at 30% 30%,${ph.c}33,transparent 72%)`, filter: 'blur(42px)' }} />
            <div className="absolute top-4 right-[18px] z-[2] ff-mono text-[10px] font-semibold tracking-[0.16em] text-[#6f757d]">PHASE {ph.n} / 03</div>
            <div className="absolute inset-0 v5-grain opacity-[0.1] mix-blend-overlay pointer-events-none" aria-hidden="true" />
            <div className="relative grid md:grid-cols-2 min-h-[320px]">
              <div className="p-9 sm:p-11 md:border-r border-white/10">
                <div className="flex items-center gap-3 mb-6">
                  <span data-reveal className="v5-num ff-display font-black text-[46px] leading-none" style={{ color: ph.c }}>{ph.n}</span>
                  <span className="ff-mono text-[11px] tracking-[0.1em] uppercase text-[#9aa0a8]">{ph.tag}</span>
                </div>
                <h3 className="ff-display font-bold text-[25px] tracking-[-0.01em] mb-3">{ph.title}</h3>
                <p className="text-[15px] text-[#aab0b8] max-w-[380px]">{ph.desc}</p>
              </div>
              <div className="p-9 sm:p-11 flex items-center justify-center">{ph.preview}</div>
            </div>
            {/* receding overlay — opacity driven by scroll */}
            <div className="sc-dim" aria-hidden="true" />
          </div>
        </div>
      ))}
    </div>
  )
}
