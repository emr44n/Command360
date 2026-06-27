'use client'

import { useEffect, useState, type ComponentType } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

/**
 * Hero right-hand panel — a "live session" frame that cycles through the
 * three core areas of Command 360:
 *   · Command Classroom — polls, quizzes, word clouds, Q&A, AI (TDEs)
 *   · Command Live — running scenario-based exercises live
 *   · Command Studio — building the visual scenarios
 * Each panel runs its own small live micro-animation (bars shifting, words
 * floating, AI typing, a countdown ticking, fire spreading…). Rigid,
 * label-driven, regimental: white numbers stand out, mono labels, square
 * accents, agency colours.
 */

const RED = '#C9241A'
const CLASSROOM = 'Command Classroom'
const LIVE = 'Command Live'
const STUDIO = 'Command Studio'

interface Stat {
  label: string
  value: string
  sub?: string
}
interface Feature {
  key: string
  tab: string
  pillar: string
  caption: string
  accent: string
  stats: [Stat, Stat]
  Render: ComponentType
}

/* ── animated bar ── */
function Bar({ label, pct, lead, accent }: { label: string; pct: number; lead?: boolean; accent: string }) {
  return (
    <div>
      <div className="flex justify-between ff-mono text-[12px] font-semibold mb-1.5">
        <span className={lead ? '' : 'text-[#aab0b8]'}>{label}</span>
        <motion.span style={{ color: lead ? accent : '#7c828a' }} key={pct} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }}>{pct}%</motion.span>
      </div>
      <div className="h-2 bg-white/[0.08] overflow-hidden">
        <motion.div className="h-full" style={{ background: lead ? accent : '#6b7178' }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} />
      </div>
    </div>
  )
}

/* ── POLL — bars shift live ── */
const POLL_FRAMES = [
  [65, 22, 13], [61, 26, 13], [57, 29, 14], [63, 23, 14], [59, 27, 14],
]
function PollContent() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % POLL_FRAMES.length), 1150)
    return () => clearInterval(id)
  }, [])
  const [a, b, c] = POLL_FRAMES[i]
  return (
    <div className="w-full flex flex-col gap-[11px]">
      <Bar label="ALPHA" pct={a} lead accent={RED} />
      <Bar label="BRAVO" pct={b} accent={RED} />
      <Bar label="CHARLIE" pct={c} accent={RED} />
    </div>
  )
}

/* ── QUIZ — options reveal, correct one pulses ── */
const QUIZ_OPTS: [string, boolean][] = [
  ['Immediate · Delayed · Minor', true],
  ['Minor · Delayed · Immediate', false],
  ['Delayed · Minor · Immediate', false],
]
function QuizContent() {
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="ff-mono text-[11px] tracking-[0.04em] text-[#8a9098] mb-1">Correct order of triage?</div>
      {QUIZ_OPTS.map(([opt, correct], i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -8 }}
          animate={correct ? { opacity: 1, x: 0, borderColor: ['rgba(62,109,196,0.4)', 'rgba(62,109,196,1)', 'rgba(62,109,196,0.4)'] } : { opacity: 1, x: 0 }}
          transition={correct ? { x: { delay: 0.1 + i * 0.12 }, opacity: { delay: 0.1 + i * 0.12 }, borderColor: { duration: 1.8, repeat: Infinity, delay: 0.6 } } : { delay: 0.1 + i * 0.12 }}
          className={`flex items-center justify-between ff-mono text-[12px] px-3 py-2.5 border ${correct ? 'text-white bg-[#3E6DC4]/12' : 'border-white/12 text-[#aab0b8]'}`}
          style={correct ? { borderColor: 'rgba(62,109,196,0.6)' } : undefined}
        >
          <span>{opt}</span>
          {correct && <span className="text-[#3E6DC4] font-bold">✓</span>}
        </motion.div>
      ))}
    </div>
  )
}

/* ── CLOUD — sphere of words floating around a centre word ── */
const CLOUD_RING: { w: string; left: string; top: string; s: number; c: string; d: number }[] = [
  { w: 'Steady', left: '46%', top: '6%', s: 14, c: '#fff', d: 1.8 },
  { w: 'Focused', left: '14%', top: '18%', s: 15, c: '#2E9E63', d: 0 },
  { w: 'Alert', left: '78%', top: '14%', s: 17, c: '#fff', d: 0.3 },
  { w: 'Calm', left: '7%', top: '56%', s: 13, c: '#aab0b8', d: 0.6 },
  { w: 'Prepared', left: '80%', top: '60%', s: 14, c: '#8a9098', d: 0.9 },
  { w: 'Sharp', left: '26%', top: '88%', s: 13, c: '#aab0b8', d: 1.2 },
  { w: 'Confident', left: '64%', top: '90%', s: 15, c: '#2E9E63', d: 1.5 },
]
function CloudContent() {
  return (
    <div className="relative w-full h-[150px] flex items-center justify-center">
      <motion.span
        className="ff-display font-black text-[#fff] leading-none relative z-[1]"
        style={{ fontSize: 34 }}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1, y: [0, -3, 0] }}
        transition={{ opacity: { type: 'spring', stiffness: 200, damping: 16 }, scale: { type: 'spring', stiffness: 200, damping: 16 }, y: { duration: 3.6, ease: 'easeInOut', repeat: Infinity } }}
      >
        Ready
      </motion.span>
      {CLOUD_RING.map((it) => (
        <div key={it.w} className="absolute" style={{ left: it.left, top: it.top, transform: 'translate(-50%,-50%)' }}>
          <motion.span
            className="ff-display font-bold leading-none whitespace-nowrap block"
            style={{ fontSize: it.s, color: it.c }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, -6, 0] }}
            transition={{ opacity: { delay: 0.1 + it.d * 0.12 }, y: { duration: 3.2 + it.d, ease: 'easeInOut', repeat: Infinity, delay: it.d * 0.2 } }}
          >
            {it.w}
          </motion.span>
        </div>
      ))}
    </div>
  )
}

/* ── Q&A — selection cycles through the questions ── */
const QNA = [
  ['Will the new protocol affect night shifts?', 14],
  ['Can we get the checklist on mobile?', 9],
  ['When does refresher training start?', 6],
] as const
function QnaContent() {
  const [sel, setSel] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setSel((v) => (v + 1) % QNA.length), 1300)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="w-full flex flex-col gap-2">
      {QNA.map(([q, votes], i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.1 }}
          className={`flex items-center gap-3 border px-3 py-2.5 transition-colors duration-300 ${i === sel ? 'border-[#2592a3] bg-[#2592a3]/10' : 'border-white/12'}`}
        >
          <span className="ff-mono text-[12px] font-semibold text-[#2592a3] flex items-center gap-1 shrink-0">▲ {i === sel ? (votes as number) + 1 : votes}</span>
          <span className="text-[12px] text-[#cfd3d8] leading-snug">{q}</span>
        </motion.div>
      ))}
    </div>
  )
}

/* ── AI — typewriter summary ── */
const AI_LINE = 'Briefing analysed — comms gaps & fatigue flagged for action.'
function AiContent() {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (n >= AI_LINE.length) return
    const id = setTimeout(() => setN(n + 1), 34)
    return () => clearTimeout(id)
  }, [n])
  return (
    <div className="w-full flex flex-col gap-3">
      <div>
        <div className="ff-mono text-[10px] tracking-[0.1em] uppercase text-[#7c828a] mb-2">Key themes</div>
        <div className="flex flex-wrap gap-1.5">
          {['Comms gaps', 'Readiness', 'Morale', 'Fatigue'].map((t, i) => (
            <motion.span key={t} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + i * 0.09 }} className="ff-mono text-[10.5px] text-[#cfd3d8] border border-white/14 px-2.5 py-1">{t}</motion.span>
          ))}
        </div>
      </div>
      <div>
        <div className="ff-mono text-[10px] tracking-[0.1em] uppercase text-[#7c828a] mb-2">AI summary</div>
        <div className="flex items-start gap-2 text-[12.5px] text-[#cfd3d8] leading-snug min-h-[34px]">
          <span className="w-[14px] h-[14px] mt-0.5 shrink-0 flex items-center justify-center text-[9px] text-white" style={{ background: '#6a5ea8' }}>✦</span>
          <span>
            {AI_LINE.slice(0, n)}
            <span className="inline-block w-[7px] h-[14px] -mb-[2px] ml-0.5 bg-[#6a5ea8] v5-caret" />
          </span>
        </div>
      </div>
    </div>
  )
}

/* ── LIVE — tactical decision with a ticking countdown ── */
const LIVE_OPTS: [string, boolean][] = [
  ['Establish cordon & assess', true],
  ['Commit crew to interior', false],
  ['Request additional pumps', false],
]
function LiveContent() {
  const [t, setT] = useState(18)
  useEffect(() => {
    const id = setInterval(() => setT((v) => (v > 1 ? v - 1 : 18)), 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center justify-between mb-1">
        <span className="ff-mono text-[11px] tracking-[0.04em] text-[#8a9098]">Crew on scene — next action?</span>
        <span className="ff-mono text-[11px] font-semibold text-[#c98a2a]">00:{String(t).padStart(2, '0')}</span>
      </div>
      {LIVE_OPTS.map(([opt, lead], i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -8 }}
          animate={lead ? { opacity: 1, x: 0, borderColor: ['rgba(201,138,42,0.4)', 'rgba(201,138,42,1)', 'rgba(201,138,42,0.4)'] } : { opacity: 1, x: 0 }}
          transition={lead ? { x: { delay: 0.1 + i * 0.12 }, opacity: { delay: 0.1 + i * 0.12 }, borderColor: { duration: 1.8, repeat: Infinity, delay: 0.5 } } : { delay: 0.1 + i * 0.12 }}
          className={`flex items-center justify-between ff-mono text-[12px] px-3 py-2.5 border ${lead ? 'text-white bg-[#c98a2a]/12' : 'border-white/12 text-[#aab0b8]'}`}
          style={lead ? { borderColor: 'rgba(201,138,42,0.6)' } : undefined}
        >
          <span>{opt}</span>
          {lead ? <span className="text-[#c98a2a] font-semibold">48%</span> : null}
        </motion.div>
      ))}
    </div>
  )
}

/* ── STUDIO — scenario building: fire spread climbs, triggers tick in ── */
const STUDIO_EVENTS: [string, string, string][] = [
  ['00:42', 'Fire spread', '#D94B3D'],
  ['01:15', 'Smoke layer', '#8a9098'],
  ['02:03', 'Casualties reported', RED],
]
function StudioContent() {
  const [spread, setSpread] = useState(34)
  const [shown, setShown] = useState(1)
  useEffect(() => {
    const id = setInterval(() => setSpread((v) => (v >= 92 ? 34 : v + 6)), 700)
    return () => clearInterval(id)
  }, [])
  useEffect(() => {
    const id = setInterval(() => setShown((v) => (v >= STUDIO_EVENTS.length ? 1 : v + 1)), 1100)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="w-full flex flex-col gap-2.5">
      <div>
        <div className="flex items-center justify-between ff-mono text-[10.5px] tracking-[0.04em] text-[#8a9098] mb-1.5">
          <span>Warehouse fire · spread</span>
          <span className="text-white font-semibold">{spread}%</span>
        </div>
        <div className="h-2 bg-white/[0.08] overflow-hidden">
          <motion.div className="h-full" style={{ background: '#D94B3D' }} animate={{ width: `${spread}%` }} transition={{ duration: 0.6, ease: 'easeOut' }} />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <AnimatePresence initial={false}>
          {STUDIO_EVENTS.slice(0, shown).map(([time, ev, c], i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 border border-white/12 px-3 py-2"
            >
              <span className="ff-mono text-[11px] font-semibold text-white shrink-0">{time}</span>
              <span className="w-1.5 h-1.5 shrink-0" style={{ background: c }} />
              <span className="ff-mono text-[12px] text-[#cfd3d8]">{ev}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

const FEATURES: Feature[] = [
  { key: 'poll', tab: 'Poll', pillar: CLASSROOM, caption: 'Live poll · Protocol applied', accent: RED, stats: [{ label: 'Connected', value: '32', sub: '/34' }, { label: 'Responded', value: '94', sub: '%' }], Render: PollContent },
  { key: 'quiz', tab: 'Quiz', pillar: CLASSROOM, caption: 'Scored quiz · Triage order', accent: '#3E6DC4', stats: [{ label: 'Avg score', value: '82', sub: '%' }, { label: 'Top streak', value: '7' }], Render: QuizContent },
  { key: 'cloud', tab: 'Cloud', pillar: CLASSROOM, caption: 'Word cloud · One word for today', accent: '#2E9E63', stats: [{ label: 'Responses', value: '41' }, { label: 'Unique', value: '18' }], Render: CloudContent },
  { key: 'qna', tab: 'Q&A', pillar: CLASSROOM, caption: 'Anonymous Q&A · Upvoted', accent: '#2592a3', stats: [{ label: 'Questions', value: '12' }, { label: 'Upvotes', value: '38' }], Render: QnaContent },
  { key: 'ai', tab: 'AI', pillar: CLASSROOM, caption: 'AI summary ready · 2 actions flagged', accent: '#6a5ea8', stats: [{ label: 'Summary in', value: '3', sub: 's' }, { label: 'Actions', value: '2' }], Render: AiContent },
  { key: 'live', tab: 'Live', pillar: LIVE, caption: 'Command Live · Tactical decision exercise', accent: '#c98a2a', stats: [{ label: 'Decision', value: '02', sub: '/05' }, { label: 'Crew', value: '24' }], Render: LiveContent },
  { key: 'studio', tab: 'Studio', pillar: STUDIO, caption: 'Command Studio · Building the scenario', accent: RED, stats: [{ label: 'Scenario', value: 'LIVE' }, { label: 'Triggers', value: '3' }], Render: StudioContent },
]

export function HeroShowcase() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setActive((v) => (v + 1) % FEATURES.length), 3600)
    return () => clearInterval(id)
  }, [paused])

  const f = FEATURES[active]
  const Render = f.Render

  return (
    <div
      className="relative h-full flex flex-col overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Soft luminous glow in the active feature's colour; a rounded black
          fade sits on top so the colour emerges from black; grain for polish.
          initial=false stops any first-load flash. */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        initial={false}
        animate={{ background: `radial-gradient(56% 46% at 80% 30%, ${f.accent}15, transparent 72%)` }}
        transition={{ duration: 0.8 }}
      />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[55%] pointer-events-none" style={{ background: 'radial-gradient(120% 90% at 50% 0%, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.34) 40%, transparent 78%)' }} />
      <div aria-hidden="true" className="absolute inset-0 v5-grain opacity-[0.12] mix-blend-overlay pointer-events-none" />

      {/* header — shows the active core area (pillar) */}
      <div className="relative z-[1] flex items-center justify-between px-6 py-[18px] border-b border-white/10">
        <span className="flex items-center gap-2 min-w-0">
          <AnimatePresence mode="wait">
            <motion.span key={f.pillar} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.3 }} className="ff-mono text-[11px] font-semibold tracking-[0.1em] uppercase text-white whitespace-nowrap">{f.pillar}</motion.span>
          </AnimatePresence>
          <span className="ff-mono text-[10px] tracking-[0.12em] uppercase text-[#6f757d] hidden sm:inline">· Live</span>
        </span>
        <span className="ff-mono text-[11px] font-semibold tracking-[0.06em] text-[#C9241A] flex items-center gap-1.5 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C9241A] v5-pulse" />REC
        </span>
      </div>

      {/* feature tab strip */}
      <div className="relative z-[1] grid grid-cols-7 border-b border-white/10">
        {FEATURES.map((feat, i) => (
          <button
            key={feat.key}
            onClick={() => setActive(i)}
            className={`ff-mono text-[9.5px] font-semibold tracking-[0.03em] uppercase py-2.5 border-r border-white/10 last:border-r-0 transition-colors cursor-pointer relative ${i === active ? 'text-white bg-white/[0.04]' : 'text-[#6f757d] hover:text-[#aab0b8]'}`}
          >
            {feat.tab}
            {i === active && <motion.span layoutId="hero-tab-underline" className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: f.accent }} />}
          </button>
        ))}
      </div>

      {/* stat row — white numbers stand out */}
      <div className="relative z-[1] grid grid-cols-2">
        {f.stats.map((s, i) => (
          <div key={s.label} className={`px-6 py-[20px] border-b border-white/10 ${i === 0 ? 'border-r' : ''}`}>
            <div className="ff-mono text-[10.5px] tracking-[0.1em] uppercase text-[#7c828a] mb-2">{s.label}</div>
            <AnimatePresence mode="wait">
              <motion.div key={f.key + s.label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }} className="ff-display font-extrabold text-[34px] leading-none text-white">
                {s.value}
                {s.sub && <span className="text-[15px] text-[#7c828a]">{s.sub}</span>}
              </motion.div>
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* main feature content */}
      <div className="relative z-[1] px-6 py-[24px] border-b border-white/10 min-h-[196px] flex items-center">
        <AnimatePresence mode="wait">
          <motion.div key={f.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }} className="w-full">
            <Render />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* caption status line */}
      <div className="relative z-[1] px-6 py-[16px] flex items-center gap-3 overflow-hidden border-b border-white/10">
        <span className="w-1.5 h-1.5 shrink-0" style={{ background: f.accent }} />
        <AnimatePresence mode="wait">
          <motion.span key={f.key} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.3 }} className="ff-mono text-[11.5px] tracking-[0.02em] text-[#aab0b8] whitespace-nowrap">{f.caption}</motion.span>
        </AnimatePresence>
      </div>

      {/* filler — progress dot-row showing which feature is live */}
      <div className="relative z-[1] flex-1 min-h-[56px] flex items-center px-6 py-5">
        <div className="flex items-center gap-2">
          {FEATURES.map((feat, i) => (
            <button key={feat.key} onClick={() => setActive(i)} aria-label={feat.tab} className="h-1.5 transition-all duration-500" style={{ width: i === active ? 26 : 7, background: i === active ? f.accent : 'rgba(255,255,255,0.18)' }} />
          ))}
        </div>
      </div>

      {/* foot — live activity bar */}
      <div className="relative z-[1] flex items-center justify-between gap-3 px-6 py-[15px] border-t border-white/10">
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2E9E63] v5-pulse" />
          <span className="ff-mono text-[11px] tracking-[0.04em] text-[#9aa0a8]">32 connected</span>
        </div>
        <div className="flex items-end gap-[3px] h-3" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.span key={i} className="w-[3px]" style={{ background: f.accent }} animate={{ height: ['25%', '100%', '45%', '85%', '30%'] }} transition={{ duration: 1.4, ease: 'easeInOut', repeat: Infinity, delay: i * 0.16 }} />
          ))}
        </div>
        <span className="ff-mono text-[11px] tracking-[0.04em] text-[#7c828a]">command360.co.uk</span>
      </div>
    </div>
  )
}
