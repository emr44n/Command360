'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

/**
 * About-page hero carousel — plays five brand scenes in order (1 → 5), each
 * tied to a part of the Command 360 story (mission, multi-agency coordination,
 * live insight, who we serve, interactive training). Matches the Command
 * Studio hero exactly: 6.7s dwell, 1.1s crossfade, a static zoom (no pan), a
 * scrolling ticker, pagination dots and a swipeable stage. Centred so the
 * brand mark stays in the safe zone on these centre-weighted compositions.
 */

interface Slide {
  src: string
  label: string
  caption: string
  c: string
  ticker: string[]
}

const SLIDES: Slide[] = [
  { src: '/about/about-1.webp', label: 'Our Mission', caption: 'One platform for every blue-light service', c: '#C9241A', ticker: ['Interactive training', 'Every service', 'Real-time insight', 'UK-hosted'] },
  { src: '/about/about-2.webp', label: 'Multi-Agency', caption: 'Coordinated response, trained together', c: '#3E6DC4', ticker: ['Multi-agency exercises', 'Shared scenarios', 'Joint debriefs', 'Readiness'] },
  { src: '/about/about-3.webp', label: 'Live Insight', caption: 'Briefings brought to life with live data', c: '#c98a2a', ticker: ['Live scenarios', 'Instant feedback', 'AI insight', 'Decision-making'] },
  { src: '/about/about-4.webp', label: 'Who We Serve', caption: 'Built for those who protect us', c: '#D94B3D', ticker: ['Fire & Rescue', 'Police', 'Ambulance', 'Search & rescue', 'Every responder'] },
  { src: '/about/about-5.webp', label: 'Interactive Training', caption: 'Every session a two-way conversation', c: '#2E9E63', ticker: ['Live polls', 'Quizzes', 'Anonymous Q&A', 'Debriefs', 'Knowledge retention'] },
]

function Ticker({ items, c }: { items: string[]; c: string }) {
  const row = [...items, ...items]
  return (
    <div className="relative overflow-hidden w-full mask-fade-x">
      <div className="flex items-center gap-6 w-max v5-marquee" style={{ animationDuration: '22s' }}>
        {row.map((t, i) => (
          <span key={i} className="inline-flex items-center gap-2 ff-mono text-[10.5px] tracking-[0.06em] uppercase text-white/75 whitespace-nowrap">
            <span className="w-1.5 h-1.5 shrink-0" style={{ background: c }} />{t}
          </span>
        ))}
      </div>
    </div>
  )
}

export function AboutCarousel() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // same dwell as the Command Studio hero
    const id = setInterval(() => setActive((v) => (v + 1) % SLIDES.length), 6700)
    return () => clearInterval(id)
  }, [paused])

  const next = () => setActive((v) => (v + 1) % SLIDES.length)
  const prev = () => setActive((v) => (v - 1 + SLIDES.length) % SLIDES.length)
  const s = SLIDES[active]

  return (
    <div
      className="relative w-full border border-white/12 bg-[#0A0C0F] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      data-reveal
    >
      <motion.div
        className="relative aspect-[16/10] overflow-hidden cursor-grab active:cursor-grabbing touch-pan-y"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.16}
        dragSnapToOrigin
        onDragStart={() => setPaused(true)}
        onDragEnd={(_, info) => {
          if (info.offset.x < -55 || info.velocity.x < -350) next()
          else if (info.offset.x > 55 || info.velocity.x > 350) prev()
          setPaused(false)
        }}
      >
        <AnimatePresence initial={false}>
          <motion.img
            key={s.src}
            src={s.src}
            alt={`${s.label} — ${s.caption}, Command 360`}
            draggable={false}
            loading={active === 0 ? 'eager' : 'lazy'}
            // gentle static zoom, centred so the brand mark stays in the safe zone
            className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none"
            style={{ scale: 1.12 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.1, ease: 'easeInOut' } }}
          />
        </AnimatePresence>

        <div aria-hidden="true" className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/85 via-transparent to-black/35" />

        {/* top — section chip + brand tag */}
        <div className="absolute top-0 inset-x-0 flex items-start justify-between p-3.5 z-[2] pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.span
              key={s.label}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-2 ff-mono text-[10px] font-semibold tracking-[0.12em] uppercase text-white bg-black/55 backdrop-blur-sm border border-white/15 px-2.5 py-1.5"
            >
              <span className="w-2 h-2" style={{ background: s.c }} />{s.label}
            </motion.span>
          </AnimatePresence>
          <span className="ff-mono text-[10px] font-semibold tracking-[0.1em] uppercase text-white bg-black/45 backdrop-blur-sm border border-white/12 px-2.5 py-1.5">
            Command 360
          </span>
        </div>

        {/* bottom — eyebrow + caption + ticker + dots */}
        <div className="absolute bottom-0 inset-x-0 px-3.5 pb-3.5 pt-10 z-[2]">
          <AnimatePresence mode="wait">
            <motion.div key={s.caption} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.34 }} className="mb-2.5">
              <div className="ff-mono text-[9.5px] tracking-[0.14em] uppercase mb-1" style={{ color: s.c }}>About Command 360</div>
              <div className="ff-display font-bold text-white text-[clamp(15px,1.6vw,19px)] leading-tight tracking-[-0.01em]">{s.caption}</div>
            </motion.div>
          </AnimatePresence>
          <Ticker items={s.ticker} c={s.c} />
          <div className="flex items-center gap-2 mt-3">
            {SLIDES.map((sl, i) => (
              <button
                key={sl.src}
                onClick={() => setActive(i)}
                aria-label={sl.label}
                className="h-1.5 transition-all duration-500 cursor-pointer"
                style={{ width: i === active ? 22 : 7, background: i === active ? s.c : 'rgba(255,255,255,0.32)' }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
