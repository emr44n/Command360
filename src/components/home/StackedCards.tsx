'use client'

import { useRef, type ReactNode } from 'react'
import { motion, useScroll, useTransform, cubicBezier, type MotionValue } from 'framer-motion'

export interface StackItem {
  n: string
  tag: string
  title: string
  desc: string
  c: string
  points: string[]
  meta: { k: string; v: string }
  preview: ReactNode
}

/**
 * Pinned scroll-stacking cards — a "dock"/deck stack.
 *
 * A tall section pins a 100vh stage. The three cards are absolutely positioned
 * with a small vertical step between their rest slots: card 1 highest, card 2
 * a touch lower, card 3 lower still — so once all three are down they read as
 * an offset deck with the top edge of each card behind peeking out. Card 1
 * starts in place; card 2 then card 3 fling up from below (translateY 100vh →
 * 0) as scroll advances and lock hard into their slot (steep expo ease, so it
 * snaps into place rather than drifting). Scrolling back reverses it.
 */
const EASE = cubicBezier(0.16, 1, 0.3, 1)

function PhaseCard({
  item,
  z,
  y,
  slot,
}: {
  item: StackItem
  z: number
  y?: MotionValue<string>
  /** rest-slot offset classes (top/bottom) so the cards form an offset deck */
  slot: string
}) {
  return (
    <motion.div className={`absolute left-0 right-0 ${slot}`} style={{ zIndex: z, y }}>
      <div className="relative h-full w-full bg-[#16191E] text-white border border-white/12 overflow-hidden shadow-[0_-18px_40px_-24px_rgba(0,0,0,0.7)]">
        {/* very faint square grid in the card background */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)', backgroundSize: '46px 46px', maskImage: 'radial-gradient(120% 120% at 20% 10%,#000,transparent 80%)', WebkitMaskImage: 'radial-gradient(120% 120% at 20% 10%,#000,transparent 80%)' }} />
        <div className="absolute top-[-120px] left-[-80px] w-[480px] h-[400px] pointer-events-none" aria-hidden="true" style={{ background: `radial-gradient(50% 60% at 30% 30%,${item.c}33,transparent 72%)`, filter: 'blur(42px)' }} />
        {/* roundish dark glow easing in from the bottom-right corner, blurred */}
        <div className="absolute bottom-[-160px] right-[-120px] w-[520px] h-[440px] pointer-events-none" aria-hidden="true" style={{ background: 'radial-gradient(50% 60% at 70% 70%, rgba(0,0,0,0.55), rgba(0,0,0,0.2) 46%, transparent 74%)', filter: 'blur(44px)' }} />
        <div className="absolute top-4 right-[18px] z-[2] ff-mono text-[10px] font-semibold tracking-[0.16em] text-[#6f757d]">PHASE {item.n} / 03</div>
        <div className="absolute inset-0 v5-grain opacity-[0.1] mix-blend-overlay pointer-events-none" aria-hidden="true" />
        <div className="relative h-full grid grid-rows-[auto_1fr] md:grid-rows-1 md:grid-cols-[1.05fr_0.95fr]">
          {/* Left — number, title, copy, meta stat */}
          <div className="p-6 sm:p-9 md:p-10 flex flex-col justify-center md:border-r border-b md:border-b-0 border-white/10">
            <div className="flex items-baseline gap-4 mb-4">
              <span className="ff-display font-black text-[clamp(52px,7vw,82px)] leading-[0.82]" style={{ color: item.c }}>{item.n}</span>
              <span className="ff-mono text-[11px] tracking-[0.16em] uppercase text-[#9aa0a8]">{item.tag}</span>
            </div>
            <h3 className="ff-display font-bold text-[clamp(22px,2.6vw,30px)] tracking-[-0.01em] mb-2.5">{item.title}</h3>
            <p className="text-[14px] sm:text-[15px] text-[#aab0b8] max-w-[420px] leading-relaxed mb-6">{item.desc}</p>
            <div className="inline-flex items-center gap-3 border-t border-white/10 pt-4 mt-auto max-w-[280px]">
              <span className="ff-display font-black text-[26px] leading-none" style={{ color: item.c }}>{item.meta.v}</span>
              <span className="ff-mono text-[10.5px] tracking-[0.1em] uppercase text-[#7c828a]">{item.meta.k}</span>
            </div>
          </div>

          {/* Right — bullet grid + preview */}
          <div className="flex flex-col justify-center p-6 sm:p-9 md:p-10 gap-5">
            <div className="border-t border-l border-white/12">
              {item.points.map((p) => (
                <div key={p} className="flex items-center gap-3 px-3.5 py-2.5 border-r border-b border-white/12">
                  <span className="w-[7px] h-[7px] shrink-0" style={{ background: item.c }} />
                  <span className="ff-mono text-[12px] tracking-[0.02em] text-[#dfe2e6]">{p}</span>
                </div>
              ))}
            </div>
            <div className="hidden sm:flex items-center justify-center">{item.preview}</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function StackedCards({ items }: { items: StackItem[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  // Card 2 flings up through the first half of the pinned scroll, card 3
  // through the second half. Each finishes well before its window ends so it
  // holds locked in its slot for a beat — the "click into place" feel — and
  // the full deck is settled before the section unpins (no dead tail).
  const y2 = useTransform(scrollYProgress, [0.08, 0.40], ['100vh', '0vh'], { ease: EASE })
  const y3 = useTransform(scrollYProgress, [0.52, 0.84], ['100vh', '0vh'], { ease: EASE })

  const [c1, c2, c3] = items

  // Rest slots: each card is the same height, stepped down by ~26px (mobile) /
  // 40px (desktop) so the top edge of the cards behind peeks out as a deck.
  const SLOT1 = 'top-0 bottom-[52px] sm:bottom-[80px]'
  const SLOT2 = 'top-[26px] bottom-[26px] sm:top-[40px] sm:bottom-[40px]'
  const SLOT3 = 'top-[52px] bottom-0 sm:top-[80px] sm:bottom-0'

  return (
    <section ref={ref} className="relative h-[220vh] sm:h-[280vh]">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center px-4 sm:px-6 py-[clamp(72px,12vh,128px)]">
        <div className="relative w-full max-w-[1080px] h-[clamp(468px,66vh,560px)] sm:h-[clamp(500px,76vh,648px)]">
          {c1 && <PhaseCard item={c1} z={1} slot={SLOT1} />}
          {c2 && <PhaseCard item={c2} z={2} y={y2} slot={SLOT2} />}
          {c3 && <PhaseCard item={c3} z={3} y={y3} slot={SLOT3} />}
        </div>
      </div>
    </section>
  )
}
