'use client'

import { useEffect, useRef, useState } from 'react'

const TABS = [
  { key: 'poll', label: 'Live Poll', color: '#C9241A' },
  { key: 'quiz', label: 'Quiz', color: '#3E6DC4' },
  { key: 'cloud', label: 'Word Cloud', color: '#2E9E63' },
  { key: 'ai', label: 'AI Summary', color: '#8a7d3a' },
] as const

type TabKey = (typeof TABS)[number]['key']

export function V5Demo() {
  const [tab, setTab] = useState<TabKey>('poll')
  const [paused, setPaused] = useState(false)
  const active = TABS.find((t) => t.key === tab)!

  useEffect(() => {
    if (paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => {
      setTab((cur) => {
        const idx = TABS.findIndex((t) => t.key === cur)
        return TABS[(idx + 1) % TABS.length].key
      })
    }, 7000)
    return () => clearInterval(id)
  }, [paused, tab])

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="flex flex-wrap gap-x-7 gap-y-2 border-b border-[rgba(20,25,30,0.16)]">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            data-active={tab === t.key}
            className={`v5-tab ff-mono text-[12.5px] uppercase tracking-[0.06em] font-semibold pb-3 -mb-px inline-flex items-center gap-2 transition-colors cursor-pointer ${tab === t.key ? 'text-[#16191E]' : 'text-[#8a8579] hover:text-[#16191E]'}`}
            style={tab === t.key ? ({ ['--v5-accent' as string]: t.color }) : undefined}
          >
            <span className="w-2 h-2" style={{ background: t.color }} aria-hidden="true" />
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-[#16191E] border border-white/10 border-t-0 text-white relative overflow-hidden">
        <div className="absolute inset-0 v5-grain opacity-[0.08] mix-blend-overlay pointer-events-none" aria-hidden="true" />
        <div className="relative flex items-center justify-between px-5 sm:px-7 h-12 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <span className="flex gap-1.5" aria-hidden="true">
              <span className="w-2 h-2 bg-[#C9241A]" /><span className="w-2 h-2 bg-[#8a7d3a]" /><span className="w-2 h-2 bg-[#2E9E63]" />
            </span>
            <span className="ff-mono text-[11px] text-white/45 tracking-[0.04em]">command360.co.uk/present · {active.label}</span>
          </div>
          <span className="ff-mono text-[11px] font-semibold tracking-[0.06em] flex items-center gap-1.5" style={{ color: active.color }}>
            <span className="w-1.5 h-1.5 rounded-full v5-pulse" style={{ background: active.color }} /> LIVE · 32
          </span>
        </div>

        <div key={tab} className="relative p-5 sm:p-8 min-h-[300px]">
          {tab === 'poll' && <PollPanel color={active.color} />}
          {tab === 'quiz' && <QuizPanel color={active.color} />}
          {tab === 'cloud' && <CloudPanel />}
          {tab === 'ai' && <AiPanel color={active.color} />}
        </div>
      </div>
    </div>
  )
}

/* ── Live poll: bars shift as votes come in; the leader turns red ── */
function PollPanel({ color }: { color: string }) {
  const FRAMES: [number, number, number][] = [
    [62, 26, 12], [54, 34, 12], [44, 45, 11], [38, 51, 11], [47, 41, 12], [58, 30, 12],
  ]
  const [f, setF] = useState(0)
  const [responses, setResponses] = useState(18)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => { setF((v) => (v + 1) % FRAMES.length); setResponses((r) => (r >= 32 ? 24 : r + 2)) }, 1500)
    return () => clearInterval(id)
  }, [])
  const vals = FRAMES[f]
  const lead = vals.indexOf(Math.max(...vals))
  const rows = ['ALPHA', 'BRAVO', 'CHARLIE']
  return (
    <div>
      <p className="ff-display font-bold text-lg sm:text-xl mb-1">Which protocol applies to this scenario?</p>
      <p className="ff-mono text-[11px] uppercase tracking-[0.08em] text-white/40 mb-6">{responses} of 32 responded</p>
      <div className="space-y-4">
        {rows.map((label, idx) => (
          <div key={label}>
            <div className="flex justify-between ff-mono text-[12.5px] font-semibold mb-1.5">
              <span className={idx === lead ? 'text-white' : 'text-white/60'}>{label}</span>
              <span style={{ color: idx === lead ? color : '#7c828a' }}>{vals[idx]}%</span>
            </div>
            <div className="h-2 bg-white/[0.08]">
              <div className="h-full transition-[width,background] duration-700 ease-out" style={{ width: `${vals[idx]}%`, background: idx === lead ? color : '#6b7178' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function QuizPanel({ color }: { color: string }) {
  const opts = [
    { label: 'A · 1.8 metres', correct: false },
    { label: 'B · 2.0 metres', correct: true },
    { label: 'C · 2.5 metres', correct: false },
    { label: 'D · 3.0 metres', correct: false },
  ]
  const [reveal, setReveal] = useState(false)
  useEffect(() => { const id = setTimeout(() => setReveal(true), 1100); return () => clearTimeout(id) }, [])
  return (
    <div>
      <p className="ff-display font-bold text-lg sm:text-xl mb-1">Max safe working height without a harness?</p>
      <p className="ff-mono text-[11px] uppercase tracking-[0.08em] text-white/40 mb-6">Question 4 / 10 · ⏱ 0:28</p>
      <div className="space-y-2.5">
        {opts.map((o) => {
          const on = reveal && o.correct
          return (
            <div key={o.label} className="ff-mono text-[13px] flex items-center gap-3 px-4 py-2.5 border transition-all duration-500"
              style={on ? { borderColor: color, background: `${color}1a`, color: '#fff' } : { borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.55)' }}>
              <span className="w-3.5 h-3.5 border flex items-center justify-center text-[9px] transition-all duration-500" style={on ? { borderColor: color, background: color, color: '#fff' } : { borderColor: 'rgba(255,255,255,0.25)' }}>{on ? '✓' : ''}</span>
              {o.label}
            </div>
          )
        })}
      </div>
      <div className="ff-mono text-[11px] mt-4 flex justify-between text-white/40">
        <span>{reveal ? 'Leaderboard updated' : 'Locking in answers…'}</span>
        <span style={{ color, opacity: reveal ? 1 : 0.3 }}>+100 pts</span>
      </div>
    </div>
  )
}

/* ── Word cloud of what Command 360 offers — words drift gently ── */
function CloudPanel() {
  const words: [string, number, string][] = [
    // top cluster — sits above the big centre word
    ['Briefings', 19, '#cfd3d8'], ['Live Polls', 26, '#C9241A'], ['Readiness', 21, '#2592a3'],
    ['Quizzes', 22, '#3E6DC4'], ['Recorded', 16, '#7c828a'], ['Confident', 18, '#2E9E63'],
    // big centre word
    ['Engaged', 40, '#fff'],
    // lower cluster — left, right and underneath
    ['Word Clouds', 20, '#2E9E63'], ['Anonymous Q&A', 18, '#8a7d3a'], ['AI Insights', 24, '#6a5ea8'],
    ['Debriefs', 17, '#aab0b8'], ['CPD', 16, '#9aa0a8'], ['Trusted', 23, '#D94B3D'],
    ['Prepared', 18, '#8a9098'], ['Alert', 20, '#fff'], ['Sharp', 15, '#aab0b8'], ['Focused', 17, '#2592a3'],
  ]
  return (
    <div>
      <p className="ff-display font-bold text-lg sm:text-xl mb-1">What does Command 360 bring to your watch?</p>
      <p className="ff-mono text-[11px] uppercase tracking-[0.08em] text-white/40 mb-6">31 of 32 responded</p>
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 py-2">
        {words.map(([w, size, c], i) => (
          <span key={w} className="ff-display font-extrabold leading-none v5-wfloat" style={{ fontSize: size, color: c, animationDuration: `${3 + (i % 4)}s`, animationDelay: `${(i % 5) * -0.6}s` }}>{w}</span>
        ))}
      </div>
    </div>
  )
}

/* ── AI summary: theme chips light up, summary types out with a caret ── */
function AiPanel({ color }: { color: string }) {
  const SUMMARY = 'Strong awareness of evacuation procedures across the watch. Two actions flagged — radio comms on multi-floor operations, and equipment inventory checks before the next shift.'
  const themes = ['Equipment readiness', 'Communication gaps', 'Protocol adherence', 'Team morale']
  const [typed, setTyped] = useState('')
  const [chip, setChip] = useState(0)
  const done = typed.length >= SUMMARY.length
  const reduced = useRef(false)
  useEffect(() => { reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches }, [])
  useEffect(() => {
    if (reduced.current) { setTyped(SUMMARY); setChip(themes.length); return }
    const cid = setInterval(() => setChip((c) => Math.min(c + 1, themes.length)), 380)
    let i = 0
    const tid = setInterval(() => { i += 1; setTyped(SUMMARY.slice(0, i)); if (i >= SUMMARY.length) clearInterval(tid) }, 26)
    return () => { clearInterval(cid); clearInterval(tid) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div>
      <div className="flex items-center gap-2.5 mb-5">
        <span className="w-6 h-6 flex items-center justify-center text-white text-xs" style={{ background: color }}>✦</span>
        <span className="ff-mono text-[11px] uppercase tracking-[0.08em] text-white/45">AI session summary · generating…</span>
      </div>
      <div className="ff-mono text-[10px] uppercase tracking-[0.1em] text-white/40 mb-2">Key themes</div>
      <div className="flex flex-wrap gap-2 mb-6">
        {themes.map((t, i) => (
          <span key={t} className="ff-mono text-[11px] border px-2.5 py-1 transition-all duration-300"
            style={i < chip ? { color: '#fff', borderColor: `${color}99`, background: `${color}22` } : { color: 'rgba(255,255,255,0.35)', borderColor: 'rgba(255,255,255,0.12)' }}>{t}</span>
        ))}
      </div>
      <div className="ff-mono text-[10px] uppercase tracking-[0.1em] text-white/40 mb-2">Summary</div>
      <p className="text-[13.5px] leading-relaxed text-white/70 max-w-2xl min-h-[60px]">
        {typed}
        {!done && <span className="v5-caret" style={{ color }} />}
      </p>
    </div>
  )
}
