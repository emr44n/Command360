'use client'

import { useEffect, useState } from 'react'

/**
 * Home "Deployment" (05) steps — the three cards auto-cycle a white highlight
 * (matching the About "Our Story" treatment): the active card goes white,
 * lifts, draws its coloured top accent and shows an ambient colour glow + grain
 * in the corner; ~5s each (also on hover). Non-active cards stay fully legible.
 * Honours prefers-reduced-motion.
 */
const STEPS = [
  { n: '01', title: 'Create your session', desc: 'Build interactive slides with polls, quizzes, word clouds, and Q&A — from a template or from scratch.', c: '#C9241A' },
  { n: '02', title: 'Launch a live session', desc: 'Crew join on any device with a 6-digit code or QR at your briefing — no app, no account needed.', c: '#3E6DC4' },
  { n: '03', title: 'See results instantly', desc: 'Review live results, get AI summaries, and export data for evaluation records and learning logs.', c: '#2E9E63' },
]

export function DeploymentSteps() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setActive((v) => (v + 1) % STEPS.length), 5000)
    return () => clearInterval(id)
  }, [])

  return (
    // data-reveal lives on this STATIC wrapper, not the cards: the cards'
    // className changes every 5s as they auto-cycle, and React rewriting
    // className wipes the imperatively-added `.is-in` reveal class — which made
    // the whole section fade back to opacity:0 after the first cycle tick.
    <div data-reveal className="grid md:grid-cols-3 border-l border-[rgba(20,25,30,0.16)]">
      {STEPS.map((s, i) => {
        const on = active === i
        return (
          <div
            key={s.n}
            className={`group relative overflow-hidden p-[40px_30px] border-r border-b border-[rgba(20,25,30,0.16)] cursor-default transition-[transform,background,box-shadow] duration-500 hover:bg-white hover:-translate-y-1 hover:shadow-[0_24px_50px_-28px_rgba(20,25,30,0.45)] ${on ? 'bg-white -translate-y-1 shadow-[0_24px_50px_-28px_rgba(20,25,30,0.45)]' : ''}`}
          >
            {/* ambient colour glow + grain in the corner of the highlighted card */}
            <span aria-hidden="true" className={`absolute top-[-40px] right-[-40px] w-[240px] h-[200px] pointer-events-none blur-[40px] transition-opacity duration-700 group-hover:opacity-100 ${on ? 'opacity-100' : 'opacity-0'}`} style={{ background: `radial-gradient(50% 60% at 70% 30%, ${s.c}40, transparent 72%)` }} />
            <span aria-hidden="true" className={`absolute inset-0 pointer-events-none v5-grain mix-blend-multiply transition-opacity duration-700 group-hover:opacity-[0.13] ${on ? 'opacity-[0.13]' : 'opacity-0'}`} />
            <span className="absolute top-0 left-0 right-0 h-0.5 origin-left transition-transform duration-500 group-hover:scale-x-100" style={{ background: s.c, transform: on ? 'scaleX(1)' : 'scaleX(0)' }} aria-hidden="true" />
            <div className="relative">
              <div className="ff-display font-black text-[46px] leading-none mb-5 origin-left transition-transform duration-500 group-hover:scale-110" style={{ color: s.c, transform: on ? 'scale(1.1)' : 'scale(1)' }}>{s.n}</div>
              <h3 className="ff-display font-bold text-[20px] tracking-[-0.01em] mb-2.5 text-[#16191E]">{s.title}</h3>
              <p className="text-[14.5px] text-[#5a5f66]">{s.desc}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
