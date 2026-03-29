'use client'

import { useState, useEffect } from 'react'
import { BarChart2, Cloud, HelpCircle, MessageCircle, Sparkles, Star, Layers, Zap } from 'lucide-react'

const TOOLS = [
  {
    label: 'Studio',
    icon: Layers,
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.12)',
    content: (
      <div className="space-y-3 px-5 pb-5">
        <p className="text-white/80 text-xs font-medium">Interactive training scenario builder</p>
        {/* Event triggers */}
        <div className="space-y-1.5">
          {[
            { name: 'Fire Spread', color: '#ef4444', triggered: true },
            { name: 'Smoke Layer', color: '#f59e0b', triggered: false },
            { name: 'Casualties Revealed', color: '#6366f1', triggered: false },
          ].map((evt) => (
            <div key={evt.name} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/[0.06] bg-white/[0.02]">
              <Zap className="w-3 h-3" style={{ color: evt.color }} />
              <span className="text-[11px] text-white/50 flex-1">{evt.name}</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${evt.triggered ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/[0.04] text-white/20'}`}>
                {evt.triggered ? 'Triggered' : 'Ready'}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 pt-1">
          <div className="flex items-center gap-1.5 text-[9px] text-white/25">
            <Layers className="w-3 h-3 text-purple-400/60" />
            3 layers · 1 scene
          </div>
          <span className="text-[9px] text-white/15 font-mono">Timeline: 10s</span>
        </div>
      </div>
    ),
  },
  {
    label: 'Live Poll',
    icon: BarChart2,
    color: '#dc2626',
    bg: 'rgba(220,38,38,0.12)',
    content: (
      <div className="space-y-3 px-5 pb-5">
        <p className="text-white/80 text-xs font-medium">How confident are you in the new protocol?</p>
        {[
          { label: 'Very confident', pct: 58 },
          { label: 'Somewhat', pct: 28 },
          { label: 'Need more training', pct: 14 },
        ].map((bar) => (
          <div key={bar.label} className="space-y-1">
            <div className="flex justify-between text-[10px]">
              <span className="text-white/50">{bar.label}</span>
              <span className="text-white/40 font-mono">{bar.pct}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${bar.pct}%`, backgroundColor: '#dc2626' }}
              />
            </div>
          </div>
        ))}
        <div className="flex items-center gap-1.5 pt-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[9px] text-white/30">32 responses</span>
        </div>
      </div>
    ),
  },
  {
    label: 'Word Cloud',
    icon: Cloud,
    color: '#0ea5e9',
    bg: 'rgba(14,165,233,0.12)',
    content: (
      <div className="px-5 pb-5 flex flex-wrap items-center justify-center gap-2 min-h-[100px]">
        {[
          { word: 'Communication', size: 'text-base', op: 'text-sky-400' },
          { word: 'Teamwork', size: 'text-sm', op: 'text-sky-300' },
          { word: 'Safety', size: 'text-lg', op: 'text-sky-500' },
          { word: 'PPE', size: 'text-xs', op: 'text-sky-400/60' },
          { word: 'Leadership', size: 'text-sm', op: 'text-sky-300' },
          { word: 'Protocol', size: 'text-base', op: 'text-sky-400' },
          { word: 'Risk', size: 'text-xs', op: 'text-sky-300/70' },
          { word: 'Training', size: 'text-lg', op: 'text-sky-500' },
          { word: 'Awareness', size: 'text-sm', op: 'text-sky-400/80' },
          { word: 'Response', size: 'text-xs', op: 'text-sky-300/60' },
        ].map((w) => (
          <span key={w.word} className={`${w.size} ${w.op} font-semibold transition-all duration-500`}>
            {w.word}
          </span>
        ))}
      </div>
    ),
  },
  {
    label: 'Quiz',
    icon: HelpCircle,
    color: '#10b981',
    bg: 'rgba(16,185,129,0.12)',
    content: (
      <div className="px-5 pb-5 space-y-2">
        <p className="text-white/80 text-xs font-medium mb-3">What is the correct order of triage?</p>
        {['A. Red, Yellow, Green', 'B. Green, Yellow, Red', 'C. Yellow, Red, Green'].map((opt, i) => (
          <div
            key={opt}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] border transition-all ${
              i === 0
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                : 'border-white/[0.06] text-white/40'
            }`}
          >
            {i === 0 ? (
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center">
                <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            ) : (
              <div className="w-3.5 h-3.5 rounded-full border border-white/10" />
            )}
            {opt}
          </div>
        ))}
        <div className="flex justify-between text-[9px] text-white/30 pt-1">
          <span>Question 2 of 8</span>
          <span className="text-emerald-400 font-semibold">+100 pts</span>
        </div>
      </div>
    ),
  },
  {
    label: 'Q&A',
    icon: MessageCircle,
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.12)',
    content: (
      <div className="px-5 pb-5 space-y-2.5">
        {[
          { q: 'Can we review the radio protocol?', votes: 12 },
          { q: 'When is the next drill scheduled?', votes: 8 },
          { q: 'Who is the new incident commander?', votes: 5 },
        ].map((item) => (
          <div key={item.q} className="flex items-start gap-2.5 px-3 py-2 rounded-lg border border-white/[0.06] bg-white/[0.02]">
            <div className="flex flex-col items-center gap-0.5 shrink-0 pt-0.5">
              <svg className="w-3 h-3 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
              </svg>
              <span className="text-[9px] text-amber-400 font-bold">{item.votes}</span>
            </div>
            <span className="text-[11px] text-white/50">{item.q}</span>
          </div>
        ))}
        <p className="text-[9px] text-white/20 italic">Anonymous questions from your team</p>
      </div>
    ),
  },
  {
    label: 'Rating',
    icon: Star,
    color: '#f97316',
    bg: 'rgba(249,115,22,0.12)',
    content: (
      <div className="px-5 pb-5 space-y-3">
        <p className="text-white/80 text-xs font-medium">Rate today&apos;s briefing session</p>
        <div className="flex justify-center gap-1.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <Star
              key={n}
              className={`w-7 h-7 transition-all ${n <= 4 ? 'text-orange-400 fill-orange-400' : 'text-white/15'}`}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-white/30">
          <span>Average: 4.2 / 5</span>
          <span>28 ratings</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
          <div className="h-full rounded-full bg-orange-500 w-[84%]" />
        </div>
      </div>
    ),
  },
]

export function HeroMockup() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % TOOLS.length)
    }, 3500)
    return () => clearInterval(timer)
  }, [])

  const tool = TOOLS[active]

  return (
    <div className="relative rounded-2xl border border-white/[0.08] overflow-hidden shadow-2xl shadow-black/60 bg-[#0c0c10]">
      {/* Tab bar */}
      <div className="flex items-center gap-0.5 px-2 pt-2 pb-0 bg-white/[0.02]">
        {TOOLS.map((t, i) => (
          <button
            key={t.label}
            onClick={() => setActive(i)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg text-[10px] font-medium transition-all duration-300 cursor-pointer ${
              i === active
                ? 'bg-white/[0.06] text-white/80 border-t border-x border-white/[0.08]'
                : 'text-white/25 hover:text-white/40'
            }`}
          >
            <t.icon className="w-3 h-3" style={i === active ? { color: t.color } : undefined} />
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="h-px bg-white/[0.06]" />

      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-3">
        <div
          className="w-6 h-6 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: tool.bg }}
        >
          <tool.icon className="w-3.5 h-3.5" style={{ color: tool.color }} />
        </div>
        <span className="text-[11px] font-semibold text-white/70">{tool.label}</span>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[9px] text-white/25">Live</span>
        </div>
      </div>

      {/* Content — animated swap */}
      <div className="min-h-[160px] relative">
        <div
          key={active}
          className="animate-[fadeSlideIn_0.4s_ease-out]"
        >
          {tool.content}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between px-5 py-2.5 border-t border-white/[0.04] bg-white/[0.01]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[9px] text-white/20">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500/70" />
            32 connected
          </div>
          <span className="text-[9px] text-white/15 font-mono">Code: C360-7K</span>
        </div>
        <span className="text-[9px] text-white/15">command360.co.uk</span>
      </div>
    </div>
  )
}
