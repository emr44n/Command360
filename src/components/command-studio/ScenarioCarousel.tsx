'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

/**
 * Command Studio hero carousel — plays the seven built scenario scenes in
 * order (1 → 7), each a different emergency-services discipline. Crossfades
 * between them, with a scenario label chip, a "scenario N / 7" marker, a
 * scrolling ticker of the training focus for that scene, pagination dots and a
 * swipeable stage (touch + mouse drag). Rigid v5 grid frame.
 */

interface Scene {
  src: string
  label: string
  scenario: string
  c: string
  /** training-focus keywords that scroll on the ticker */
  ticker: string[]
}

const SCENES: Scene[] = [
  { src: '/command-studio/cs-1.webp', label: 'Fire & Rescue', scenario: 'Structure fire · live simulation', c: '#D94B3D', ticker: ['Fire behaviour', 'Smoke spread', 'Crew safety', 'Water application', 'Search & rescue', 'Cordon control'] },
  { src: '/command-studio/cs-2.webp', label: 'Road Traffic Collision', scenario: 'Multi-agency extrication', c: '#C9241A', ticker: ['Scene safety', 'Extrication', 'Casualty triage', 'Traffic management', 'Inter-agency comms'] },
  { src: '/command-studio/cs-3.webp', label: 'Prison & Probation', scenario: 'Incident response & control', c: '#9aa0a8', ticker: ['Control & restraint', 'Cell extraction', 'Perimeter security', 'De-escalation', 'Escort procedure'] },
  { src: '/command-studio/cs-4.webp', label: 'HM Coastguard', scenario: 'Cliff & sea rescue', c: '#0ea5e9', ticker: ['Search pattern', 'Winch recovery', 'Casualty care', 'Weather assessment', 'Helicopter ops'] },
  { src: '/command-studio/cs-5.webp', label: 'Armed & EOD', scenario: 'Suspect device · cordon & control', c: '#64748b', ticker: ['Threat assessment', 'Cordon control', 'EOD approach', 'Force protection', 'Command & control'] },
  { src: '/command-studio/cs-6.webp', label: 'Airport & Aviation', scenario: 'Aircraft incident response', c: '#f59e0b', ticker: ['Runway access', 'Fire & foam attack', 'Evacuation', 'Perimeter control', 'Air-traffic liaison'] },
  { src: '/command-studio/cs-7.webp', label: 'Public Order', scenario: 'Crowd & public-order', c: '#3E6DC4', ticker: ['Shield formations', 'Crowd dynamics', 'Cordon lines', 'De-escalation', 'Casualty support'] },
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

export function ScenarioCarousel() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // dwell slowed ~60% (4200 → 6700ms) for a calmer transition cadence
    const id = setInterval(() => setActive((v) => (v + 1) % SCENES.length), 6700)
    return () => clearInterval(id)
  }, [paused])

  const next = () => setActive((v) => (v + 1) % SCENES.length)
  const prev = () => setActive((v) => (v - 1 + SCENES.length) % SCENES.length)
  const s = SCENES[active]

  return (
    <div
      className="relative w-full border border-white/12 bg-[#0A0C0F] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      data-reveal
    >
      {/* swipeable image stage */}
      <motion.div
        className="relative aspect-[1200/849] overflow-hidden cursor-grab active:cursor-grabbing touch-pan-y"
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
            alt={`${s.label} — ${s.scenario}, built in Command 360`}
            draggable={false}
            loading={active === 0 ? 'eager' : 'lazy'}
            // full-frame: the stage matches the 1200×849 source, so the whole
            // image is visible — top and sides — with no crop; top-anchored so
            // any sub-pixel rounding trims the bottom, never the top
            className="absolute inset-0 w-full h-full object-cover object-top select-none pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.1, ease: 'easeInOut' } }}
          />
        </AnimatePresence>

        <div aria-hidden="true" className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/85 via-transparent to-black/35" />

        {/* top — scenario chip + index */}
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
            Example scene
          </span>
        </div>

        {/* bottom — scenario title + ticker + dots */}
        <div className="absolute bottom-0 inset-x-0 px-3.5 pb-3.5 pt-10 z-[2]">
          <AnimatePresence mode="wait">
            <motion.div key={s.scenario} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.34 }} className="mb-2.5">
              <div className="ff-mono text-[9.5px] tracking-[0.14em] uppercase mb-1" style={{ color: s.c }}>Built in Command Studio</div>
              <div className="ff-display font-bold text-white text-[clamp(15px,1.6vw,19px)] leading-tight tracking-[-0.01em]">{s.scenario}</div>
            </motion.div>
          </AnimatePresence>
          <Ticker items={s.ticker} c={s.c} />
          <div className="flex items-center gap-2 mt-3">
            {SCENES.map((sc, i) => (
              <button
                key={sc.src}
                onClick={() => setActive(i)}
                aria-label={sc.label}
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
