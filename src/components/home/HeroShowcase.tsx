'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

/**
 * Hero right-hand panel. A "live session" frame that cycles through every
 * Command 360 feature — Command Classroom (polls, quizzes, word clouds,
 * Q&A, AI) and Command Studio (scenario triggers). Rigid, label-driven
 * micro-animations in the v5 regimental style: white numbers stand out
 * against the dark panel, mono labels, square accents, agency red.
 */

interface Stat {
  label: string
  value: string
  sub?: string
}
interface Feature {
  key: string
  tab: string
  caption: string
  accent: string
  stats: [Stat, Stat]
  content: ReactNode
}

const RED = '#C9241A'

function Bar({ label, pct, lead }: { label: string; pct: number; lead?: boolean }) {
  return (
    <div>
      <div className="flex justify-between ff-mono text-[12px] font-semibold mb-1.5">
        <span className={lead ? '' : 'text-[#aab0b8]'}>{label}</span>
        <span style={{ color: lead ? RED : '#7c828a' }}>{pct}%</span>
      </div>
      <div className="h-2 bg-white/[0.08] overflow-hidden">
        <motion.div
          className="h-full"
          style={{ background: lead ? RED : '#6b7178' }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  )
}

const FEATURES: Feature[] = [
  {
    key: 'poll',
    tab: 'Poll',
    caption: 'Live poll · Protocol applied',
    accent: RED,
    stats: [
      { label: 'Connected', value: '32', sub: '/34' },
      { label: 'Responded', value: '94', sub: '%' },
    ],
    content: (
      <div className="w-full flex flex-col gap-[11px]">
        <Bar label="ALPHA" pct={65} lead />
        <Bar label="BRAVO" pct={22} />
        <Bar label="CHARLIE" pct={13} />
      </div>
    ),
  },
  {
    key: 'quiz',
    tab: 'Quiz',
    caption: 'Scored quiz · Triage order',
    accent: '#3E6DC4',
    stats: [
      { label: 'Avg score', value: '82', sub: '%' },
      { label: 'Top streak', value: '7' },
    ],
    content: (
      <div className="w-full flex flex-col gap-2">
        <div className="ff-mono text-[11px] tracking-[0.04em] text-[#8a9098] mb-1">Correct order of triage?</div>
        {[
          ['Immediate · Delayed · Minor', true],
          ['Minor · Delayed · Immediate', false],
          ['Delayed · Minor · Immediate', false],
        ].map(([opt, correct], i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.12 }}
            className={`flex items-center justify-between ff-mono text-[12px] px-3 py-2.5 border ${
              correct ? 'border-[#3E6DC4] text-white bg-[#3E6DC4]/12' : 'border-white/12 text-[#aab0b8]'
            }`}
          >
            <span>{opt as string}</span>
            {correct && <span className="text-[#3E6DC4] font-bold">✓</span>}
          </motion.div>
        ))}
      </div>
    ),
  },
  {
    key: 'cloud',
    tab: 'Cloud',
    caption: 'Word cloud · One word for today',
    accent: '#2E9E63',
    stats: [
      { label: 'Responses', value: '41' },
      { label: 'Unique', value: '18' },
    ],
    content: (
      <div className="w-full flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 py-1">
        {([
          ['Ready', 26, '#fff'],
          ['Focused', 20, '#2E9E63'],
          ['Calm', 15, '#aab0b8'],
          ['Alert', 22, '#fff'],
          ['Prepared', 17, '#8a9098'],
          ['Confident', 19, '#2E9E63'],
          ['Sharp', 14, '#aab0b8'],
        ] as const).map(([w, size, c], i) => (
          <motion.span
            key={w}
            className="ff-display font-bold leading-none"
            style={{ fontSize: size, color: c }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08, type: 'spring', stiffness: 220, damping: 18 }}
          >
            {w}
          </motion.span>
        ))}
      </div>
    ),
  },
  {
    key: 'qna',
    tab: 'Q&A',
    caption: 'Anonymous Q&A · Upvoted',
    accent: '#2592a3',
    stats: [
      { label: 'Questions', value: '12' },
      { label: 'Upvotes', value: '38' },
    ],
    content: (
      <div className="w-full flex flex-col gap-2">
        {[
          ['Will the new protocol affect night shifts?', 14],
          ['Can we get the checklist on mobile?', 9],
          ['When does refresher training start?', 6],
        ].map(([q, votes], i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.12 }}
            className="flex items-center gap-3 border border-white/12 px-3 py-2.5"
          >
            <span className="ff-mono text-[12px] font-semibold text-[#2592a3] flex items-center gap-1 shrink-0">▲ {votes as number}</span>
            <span className="text-[12px] text-[#cfd3d8] leading-snug">{q as string}</span>
          </motion.div>
        ))}
      </div>
    ),
  },
  {
    key: 'ai',
    tab: 'AI',
    caption: 'AI summary ready · 2 actions flagged',
    accent: '#6a5ea8',
    stats: [
      { label: 'Summary in', value: '3', sub: 's' },
      { label: 'Actions', value: '2' },
    ],
    content: (
      <div className="w-full flex flex-col gap-3">
        <div>
          <div className="ff-mono text-[10px] tracking-[0.1em] uppercase text-[#7c828a] mb-2">Key themes</div>
          <div className="flex flex-wrap gap-1.5">
            {['Comms gaps', 'Readiness', 'Morale', 'Fatigue'].map((t, i) => (
              <motion.span
                key={t}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.09 }}
                className="ff-mono text-[10.5px] text-[#cfd3d8] border border-white/14 px-2.5 py-1"
              >
                {t}
              </motion.span>
            ))}
          </div>
        </div>
        <div>
          <div className="ff-mono text-[10px] tracking-[0.1em] uppercase text-[#7c828a] mb-2">Flagged actions</div>
          {['Brief night watch on protocol', 'Schedule comms refresher'].map((a, i) => (
            <motion.div
              key={a}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.12 }}
              className="flex items-start gap-2 text-[12px] text-[#cfd3d8] leading-snug mb-1.5"
            >
              <span className="w-[14px] h-[14px] mt-0.5 shrink-0 flex items-center justify-center text-[9px] text-white" style={{ background: '#6a5ea8' }}>✦</span>
              {a}
            </motion.div>
          ))}
        </div>
      </div>
    ),
  },
  {
    key: 'studio',
    tab: 'Studio',
    caption: 'Command Studio · Incident running',
    accent: RED,
    stats: [
      { label: 'Scenario', value: 'LIVE' },
      { label: 'Triggers', value: '3' },
    ],
    content: (
      <div className="w-full flex flex-col gap-2">
        <div className="ff-mono text-[11px] tracking-[0.04em] text-[#8a9098] mb-1">Warehouse fire · event triggers</div>
        {[
          ['00:42', 'Fire spread', '#D94B3D'],
          ['01:15', 'Smoke layer', '#8a9098'],
          ['02:03', 'Casualties reported', RED],
        ].map(([time, ev, c], i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.14 }}
            className="flex items-center gap-3 border border-white/12 px-3 py-2.5"
          >
            <span className="ff-mono text-[11px] font-semibold text-white shrink-0">{time as string}</span>
            <span className="w-1.5 h-1.5 shrink-0" style={{ background: c as string }} />
            <span className="ff-mono text-[12px] text-[#cfd3d8]">{ev as string}</span>
          </motion.div>
        ))}
      </div>
    ),
  },
]

export function HeroShowcase() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setActive((v) => (v + 1) % FEATURES.length), 3400)
    return () => clearInterval(id)
  }, [paused])

  const f = FEATURES[active]

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* header */}
      <div className="flex items-center justify-between px-6 py-[18px] border-b border-white/10">
        <span className="ff-mono text-[11px] font-semibold tracking-[0.12em] uppercase text-[#9aa0a8]">Session · Live</span>
        <span className="ff-mono text-[11px] font-semibold tracking-[0.06em] text-[#C9241A] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C9241A] v5-pulse" />REC
        </span>
      </div>

      {/* feature tab strip */}
      <div className="grid grid-cols-6 border-b border-white/10">
        {FEATURES.map((feat, i) => (
          <button
            key={feat.key}
            onClick={() => setActive(i)}
            className={`ff-mono text-[10px] font-semibold tracking-[0.04em] uppercase py-2.5 border-r border-white/10 last:border-r-0 transition-colors cursor-pointer relative ${
              i === active ? 'text-white bg-white/[0.04]' : 'text-[#6f757d] hover:text-[#aab0b8]'
            }`}
          >
            {feat.tab}
            {i === active && (
              <motion.span layoutId="hero-tab-underline" className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: f.accent }} />
            )}
          </button>
        ))}
      </div>

      {/* stat row — white numbers stand out */}
      <div className="grid grid-cols-2">
        {f.stats.map((s, i) => (
          <div key={s.label} className={`px-6 py-[20px] border-b border-white/10 ${i === 0 ? 'border-r' : ''}`}>
            <div className="ff-mono text-[10.5px] tracking-[0.1em] uppercase text-[#7c828a] mb-2">{s.label}</div>
            <AnimatePresence mode="wait">
              <motion.div
                key={f.key + s.label}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
                className="ff-display font-extrabold text-[34px] leading-none text-white"
              >
                {s.value}
                {s.sub && <span className="text-[15px] text-[#7c828a]">{s.sub}</span>}
              </motion.div>
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* main feature content */}
      <div className="px-6 py-[24px] border-b border-white/10 min-h-[176px] flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={f.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            {f.content}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* caption status line */}
      <div className="px-6 py-[16px] flex items-center gap-3 overflow-hidden">
        <span className="w-1.5 h-1.5 shrink-0" style={{ background: f.accent }} />
        <AnimatePresence mode="wait">
          <motion.span
            key={f.key}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.3 }}
            className="ff-mono text-[11.5px] tracking-[0.02em] text-[#aab0b8] whitespace-nowrap"
          >
            {f.caption}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  )
}
