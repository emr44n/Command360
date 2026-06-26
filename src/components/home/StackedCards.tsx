'use client'

import { useRef, type ReactNode } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'

export interface StackItem {
  n: string
  tag: string
  title: string
  desc: string
  c: string
  preview: ReactNode
}

/**
 * Pinned scroll-stacking cards.
 *
 * A tall (340vh) section pins a 100vh stage. All cards are absolutely
 * positioned in the SAME centre slot. Card 1 stays put; card 2 then card 3
 * slide up from below the viewport (translateY 100vh → 0) as scroll
 * progress advances, landing exactly on top of the card before them — same
 * size, same position, no scale. Scrolling back up reverses it (card 3
 * leaves first, then card 2). Framer Motion useScroll/useTransform drives it.
 */
function PhaseCard({
  item,
  z,
  y,
}: {
  item: StackItem
  z: number
  y?: MotionValue<string>
}) {
  return (
    <motion.div className="absolute inset-0" style={{ zIndex: z, y }}>
      <div className="relative h-full w-full bg-[#16191E] text-white border border-white/12 overflow-hidden">
        <div className="absolute top-[-120px] left-[-80px] w-[480px] h-[400px] pointer-events-none" aria-hidden="true" style={{ background: `radial-gradient(50% 60% at 30% 30%,${item.c}33,transparent 72%)`, filter: 'blur(42px)' }} />
        <div className="absolute top-4 right-[18px] z-[2] ff-mono text-[10px] font-semibold tracking-[0.16em] text-[#6f757d]">PHASE {item.n} / 03</div>
        <div className="absolute inset-0 v5-grain opacity-[0.1] mix-blend-overlay pointer-events-none" aria-hidden="true" />
        <div className="relative h-full grid grid-rows-2 md:grid-rows-1 md:grid-cols-2">
          <div className="p-7 sm:p-10 flex flex-col justify-center md:border-r border-b md:border-b-0 border-white/10">
            <div className="flex items-center gap-3 mb-4 sm:mb-5">
              <span className="ff-display font-black text-[clamp(38px,5vw,52px)] leading-none" style={{ color: item.c }}>{item.n}</span>
              <span className="ff-mono text-[11px] tracking-[0.1em] uppercase text-[#9aa0a8]">{item.tag}</span>
            </div>
            <h3 className="ff-display font-bold text-[clamp(20px,2.4vw,26px)] tracking-[-0.01em] mb-2.5">{item.title}</h3>
            <p className="text-[14px] sm:text-[15px] text-[#aab0b8] max-w-[400px] leading-relaxed">{item.desc}</p>
          </div>
          <div className="p-7 sm:p-10 flex items-center justify-center">{item.preview}</div>
        </div>
      </div>
    </motion.div>
  )
}

export function StackedCards({ items }: { items: StackItem[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  // Card 2 rises through the first half of the pinned scroll, card 3 through
  // the second half. Small buffers keep card 1 alone at the start and the
  // full stack settled before the section unpins.
  const y2 = useTransform(scrollYProgress, [0.08, 0.46], ['100vh', '0vh'])
  const y3 = useTransform(scrollYProgress, [0.54, 0.92], ['100vh', '0vh'])

  const [c1, c2, c3] = items

  return (
    <section ref={ref} className="relative" style={{ height: '280vh' }}>
      <div className="sticky top-0 h-screen overflow-hidden flex items-start justify-center px-4 sm:px-6 pt-[clamp(92px,13vh,150px)]">
        <div className="relative w-full max-w-[1040px] h-[64vh] max-h-[540px] sm:h-[400px] md:h-[380px]">
          {c1 && <PhaseCard item={c1} z={1} />}
          {c2 && <PhaseCard item={c2} z={2} y={y2} />}
          {c3 && <PhaseCard item={c3} z={3} y={y3} />}
        </div>
      </div>
    </section>
  )
}
