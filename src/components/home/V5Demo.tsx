'use client'

import { useState } from 'react'

const TABS = [
  { key: 'poll', label: 'Live Poll', color: '#C9241A' },
  { key: 'quiz', label: 'Quiz', color: '#3E6DC4' },
  { key: 'cloud', label: 'Word Cloud', color: '#2E9E63' },
  { key: 'ai', label: 'AI Summary', color: '#8a7d3a' },
] as const

type TabKey = (typeof TABS)[number]['key']

export function V5Demo() {
  const [tab, setTab] = useState<TabKey>('poll')
  const active = TABS.find((t) => t.key === tab)!

  return (
    <div>
      {/* Tab bar */}
      <div className="flex flex-wrap gap-x-7 gap-y-2 border-b border-[rgba(20,25,30,0.16)] mb-0">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            data-active={tab === t.key}
            className={`v5-tab ff-mono text-[12.5px] uppercase tracking-[0.06em] font-semibold pb-3 -mb-px inline-flex items-center gap-2 transition-colors cursor-pointer ${
              tab === t.key ? 'text-[#16191E]' : 'text-[#8a8579] hover:text-[#16191E]'
            }`}
            style={tab === t.key ? ({ ['--v5-accent' as string]: t.color }) : undefined}
          >
            <span className="w-2 h-2" style={{ background: t.color }} aria-hidden="true" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Panel */}
      <div className="bg-[#16191E] border border-white/10 border-t-0 text-white relative overflow-hidden">
        <div className="absolute inset-0 v5-grain opacity-[0.08] mix-blend-overlay pointer-events-none" aria-hidden="true" />
        <div className="relative flex items-center justify-between px-5 sm:px-7 h-12 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <span className="flex gap-1.5" aria-hidden="true">
              <span className="w-2 h-2 bg-[#C9241A]" />
              <span className="w-2 h-2 bg-[#8a7d3a]" />
              <span className="w-2 h-2 bg-[#2E9E63]" />
            </span>
            <span className="ff-mono text-[11px] text-white/45 tracking-[0.04em]">command360.co.uk/present · {active.label}</span>
          </div>
          <span className="ff-mono text-[11px] font-semibold tracking-[0.06em]" style={{ color: active.color }}>● LIVE · 32</span>
        </div>

        <div className="relative p-5 sm:p-8 min-h-[300px]">
          {tab === 'poll' && <PollPanel color={active.color} />}
          {tab === 'quiz' && <QuizPanel color={active.color} />}
          {tab === 'cloud' && <CloudPanel />}
          {tab === 'ai' && <AiPanel color={active.color} />}
        </div>
      </div>
    </div>
  )
}

function PollPanel({ color }: { color: string }) {
  const bars = [
    { label: 'ALPHA', pct: 65, lead: true },
    { label: 'BRAVO', pct: 22, lead: false },
    { label: 'CHARLIE', pct: 13, lead: false },
  ]
  return (
    <div>
      <p className="ff-display font-bold text-lg sm:text-xl mb-1">Which protocol applies to this scenario?</p>
      <p className="ff-mono text-[11px] uppercase tracking-[0.08em] text-white/40 mb-6">24 of 32 responded</p>
      <div className="space-y-4">
        {bars.map((b) => (
          <div key={b.label}>
            <div className="flex justify-between ff-mono text-[12.5px] font-semibold mb-1.5">
              <span className={b.lead ? 'text-white' : 'text-white/65'}>{b.label}</span>
              <span style={{ color: b.lead ? color : '#7c828a' }}>{b.pct}%</span>
            </div>
            <div className="h-2 bg-white/[0.08]">
              <div className="h-full transition-[width] duration-700" style={{ width: `${b.pct}%`, background: b.lead ? color : '#6b7178' }} />
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
  return (
    <div>
      <p className="ff-display font-bold text-lg sm:text-xl mb-1">Max safe working height without a harness?</p>
      <p className="ff-mono text-[11px] uppercase tracking-[0.08em] text-white/40 mb-6">Question 4 / 10 · ⏱ 0:28</p>
      <div className="space-y-2.5">
        {opts.map((o) => (
          <div
            key={o.label}
            className="ff-mono text-[13px] flex items-center gap-3 px-4 py-2.5 border"
            style={o.correct ? { borderColor: color, background: `${color}1a`, color: '#fff' } : { borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.55)' }}
          >
            <span className="w-3.5 h-3.5 border flex items-center justify-center text-[9px]" style={o.correct ? { borderColor: color, background: color, color: '#fff' } : { borderColor: 'rgba(255,255,255,0.25)' }}>{o.correct ? '✓' : ''}</span>
            {o.label}
          </div>
        ))}
      </div>
      <div className="ff-mono text-[11px] mt-4 flex justify-between text-white/40">
        <span>Leaderboard updating…</span>
        <span style={{ color }}>+100 pts</span>
      </div>
    </div>
  )
}

function CloudPanel() {
  const words: [string, number, string][] = [
    ['Ready', 34, '#C9241A'], ['Calm', 20, '#aab0b8'], ['Focused', 28, '#8a7d3a'],
    ['Alert', 16, '#6b7178'], ['Confident', 22, '#2E9E63'], ['Prepared', 18, '#3E6DC4'],
    ['Sharp', 15, '#9aa0a8'], ['Briefed', 24, '#fff'], ['Steady', 17, '#6b7178'],
  ]
  return (
    <div>
      <p className="ff-display font-bold text-lg sm:text-xl mb-1">How does the crew feel going in?</p>
      <p className="ff-mono text-[11px] uppercase tracking-[0.08em] text-white/40 mb-6">31 of 32 responded</p>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        {words.map(([w, size, c]) => (
          <span key={w} className="ff-display font-extrabold leading-none" style={{ fontSize: size, color: c }}>{w}</span>
        ))}
      </div>
    </div>
  )
}

function AiPanel({ color }: { color: string }) {
  return (
    <div>
      <div className="flex items-center gap-2.5 mb-5">
        <span className="w-6 h-6 flex items-center justify-center text-white text-xs" style={{ background: color }}>✦</span>
        <span className="ff-mono text-[11px] uppercase tracking-[0.08em] text-white/45">AI session summary · generated in 3s</span>
      </div>
      <div className="ff-mono text-[10px] uppercase tracking-[0.1em] text-white/40 mb-2">Key themes</div>
      <div className="flex flex-wrap gap-2 mb-6">
        {['Equipment readiness', 'Communication gaps', 'Protocol adherence', 'Team morale'].map((t) => (
          <span key={t} className="ff-mono text-[11px] text-white/75 border border-white/15 px-2.5 py-1">{t}</span>
        ))}
      </div>
      <div className="ff-mono text-[10px] uppercase tracking-[0.1em] text-white/40 mb-2">Summary</div>
      <p className="text-[13.5px] leading-relaxed text-white/65 max-w-2xl">
        Strong awareness of evacuation procedures across the watch. Key areas for improvement: radio
        communication during multi-floor operations and equipment inventory checks. Two actions flagged.
      </p>
    </div>
  )
}
