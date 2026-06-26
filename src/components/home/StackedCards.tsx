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
 * Pinned scroll-stacking cards.
 *
 * A tall section pins a 100vh stage. All cards are absolutely positioned in
 * the SAME centre slot. Card 1 stays put; card 2 then card 3 ease up from
 * below (translateY 100vh → 0) as scroll progress advances, landing exactly
 * on top of the card before them — same size, same position, no scale.
 * Scrolling back up reverses it. Framer Motion useScroll/useTransform drives
 * it, with a smooth ease so each card settles into its slot.
 */
const EASE = cubicBezier(0.22, 1, 0.36, 1)

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

  // Card 2 eases up through the first half of the pinned scroll, card 3
  // through the second half. Tight buffers keep card 1 alone briefly at the
  // start and settle the full stack before the section unpins — no dead tail.
  const y2 = useTransform(scrollYProgress, [0.06, 0.42], ['100vh', '0vh'], { ease: EASE })
  const y3 = useTransform(scrollYProgress, [0.5, 0.86], ['100vh', '0vh'], { ease: EASE })

  const [c1, c2, c3] = items

  return (
    <section ref={ref} className="relative" style={{ height: '260vh' }}>
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center px-4 sm:px-6 pt-[clamp(64px,9vh,104px)] pb-[clamp(28px,5vh,56px)]">
        <div className="relative w-full max-w-[1080px] h-[clamp(440px,72vh,620px)]">
          {c1 && <PhaseCard item={c1} z={1} />}
          {c2 && <PhaseCard item={c2} z={2} y={y2} />}
          {c3 && <PhaseCard item={c3} z={3} y={y3} />}
        </div>
      </div>
    </section>
  )
}
