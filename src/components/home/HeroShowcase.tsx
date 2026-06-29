'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { HeroCornerLogo } from '@/components/site/HeroCornerLogo'

/**
 * Hero right-hand panel — a cinematic image carousel of the UK blue-light
 * services Command 360 trains. Crossfades through the hero photography with an
 * agency label + a training caption on each, a live "REC" marker, pagination
 * dots, and a swipeable stage (touch + mouse drag) for mobile and desktop.
 * The foot bar cycles through every agency, "connecting" live. Rigid,
 * label-driven, regimental — square corners, mono labels, agency colours.
 */

interface Slide {
  src: string
  agency: string
  caption: string
  c: string
}

const SLIDES: Slide[] = [
  { src: '/hero/hero-1.webp', agency: 'Multi-Agency', caption: 'Every blue-light service, one platform', c: '#C9241A' },
  { src: '/hero/hero-2.webp', agency: 'Fire & Rescue', caption: 'Incident command & safety briefings', c: '#D94B3D' },
  { src: '/hero/hero-3.webp', agency: 'Ambulance', caption: 'Clinical CPD & crew welfare checks', c: '#2E9E63' },
  { src: '/hero/hero-4.webp', agency: 'Armed Response', caption: 'Tactical decision exercises', c: '#3E6DC4' },
  { src: '/hero/hero-5.webp', agency: 'Police', caption: 'Training days & knowledge checks', c: '#3E6DC4' },
  { src: '/hero/hero-6.webp', agency: 'Search & Rescue', caption: 'Coordinated multi-team response', c: '#2592a3' },
]

/* every agency that connects on the foot bar */
const AGENCIES: { label: string; c: string }[] = [
  { label: 'Fire & Rescue', c: '#D94B3D' },
  { label: 'Police', c: '#3E6DC4' },
  { label: 'Ambulance', c: '#2E9E63' },
  { label: 'Armed Forces', c: '#8a7d3a' },
  { label: 'Coastguard', c: '#2592a3' },
  { label: 'Local Authority', c: '#6a5ea8' },
]

function FootConnected({ accent }: { accent: string }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setI((v) => (v + 1) % AGENCIES.length), 1800)
    return () => clearInterval(id)
  }, [])
  const a = AGENCIES[i]
  return (
    <div className="relative z-[2] flex items-center justify-between gap-3 px-5 py-[13px] border-t border-white/10 bg-[#0A0C0F]">
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="w-1.5 h-1.5 rounded-full bg-[#2E9E63] v5-pulse shrink-0" />
        <AnimatePresence mode="wait">
          <motion.span
            key={a.label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.32 }}
            className="ff-mono text-[11px] tracking-[0.04em] text-[#9aa0a8] whitespace-nowrap"
          >
            <span className="font-semibold" style={{ color: a.c }}>{a.label}</span> connected
          </motion.span>
        </AnimatePresence>
      </div>
      <div className="flex items-end gap-[3px] h-3 shrink-0" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((b) => (
          <motion.span key={b} className="w-[3px]" style={{ background: accent }} animate={{ height: ['25%', '100%', '45%', '85%', '30%'] }} transition={{ duration: 1.4, ease: 'easeInOut', repeat: Infinity, delay: b * 0.16 }} />
        ))}
      </div>
      <span className="ff-mono text-[11px] tracking-[0.04em] text-[#7c828a] hidden sm:inline">command360.co.uk</span>
    </div>
  )
}

export function HeroShowcase() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  // drag/swipe only on touch devices; desktop uses the pagination dots
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    const m = window.matchMedia('(pointer: coarse)')
    const sync = () => setIsTouch(m.matches)
    sync()
    m.addEventListener('change', sync)
    return () => m.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setActive((v) => (v + 1) % SLIDES.length), 4200)
    return () => clearInterval(id)
  }, [paused])

  const next = () => setActive((v) => (v + 1) % SLIDES.length)
  const prev = () => setActive((v) => (v - 1 + SLIDES.length) % SLIDES.length)
  const s = SLIDES[active]

  return (
    <div
      className="relative h-full min-h-[520px] flex flex-col border border-white/10 bg-[#0A0C0F] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* swipeable image stage */}
      <motion.div
        className={`relative flex-1 overflow-hidden touch-pan-y ${isTouch ? 'cursor-grab active:cursor-grabbing' : ''}`}
        drag={isTouch ? 'x' : false}
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
            alt={`${s.agency} — Command 360 interactive training`}
            draggable={false}
            loading={active === 0 ? 'eager' : 'lazy'}
            className="absolute inset-0 w-full h-full object-cover object-top select-none pointer-events-none"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 0.7, ease: 'easeInOut' }, scale: { duration: 5.5, ease: 'linear' } }}
          />
        </AnimatePresence>

        {/* legibility washes + grain */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/90 via-black/10 to-black/45" />
        <div aria-hidden="true" className="absolute inset-0 v5-grain opacity-[0.1] mix-blend-overlay pointer-events-none" />

        {/* top row — agency chip + REC */}
        <div className="absolute top-0 inset-x-0 flex items-start justify-between px-5 py-4 z-[2] pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.span
              key={s.agency}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-2 ff-mono text-[10.5px] font-semibold tracking-[0.12em] uppercase text-white bg-black/50 backdrop-blur-sm border border-white/15 px-2.5 py-1.5"
            >
              <span className="w-2 h-2" style={{ background: s.c }} />{s.agency}
            </motion.span>
          </AnimatePresence>
          <span className="inline-flex items-center gap-1.5 ff-mono text-[10.5px] font-semibold tracking-[0.08em] text-white bg-black/50 backdrop-blur-sm border border-white/12 px-2.5 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9241A] v5-pulse" />REC
          </span>
        </div>

        {/* bottom — training caption + pagination dots */}
        <div className="absolute bottom-0 inset-x-0 px-5 pb-4 pt-12 z-[2]">
          <AnimatePresence mode="wait">
            <motion.div key={s.caption} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.34 }}>
              <div className="ff-mono text-[10px] tracking-[0.14em] uppercase mb-1.5" style={{ color: s.c }}>Interactive training</div>
              <div className="ff-display font-bold text-white text-[clamp(17px,1.8vw,20px)] leading-tight tracking-[-0.01em] max-w-[88%]">{s.caption}</div>
            </motion.div>
          </AnimatePresence>
          <div className="flex items-center gap-2 mt-4">
            {SLIDES.map((sl, i) => (
              <button
                key={sl.src}
                onClick={() => setActive(i)}
                aria-label={sl.agency}
                className="h-1.5 transition-all duration-500 cursor-pointer"
                style={{ width: i === active ? 24 : 7, background: i === active ? s.c : 'rgba(255,255,255,0.32)' }}
              />
            ))}
          </div>
        </div>
        <HeroCornerLogo />
      </motion.div>

      {/* foot — agencies connecting live */}
      <FootConnected accent={s.c} />
    </div>
  )
}
