'use client'

import { Flame, Shield, Siren, Search } from 'lucide-react'

const TESTIMONIALS = [
  {
    quote: 'Command 360 completely changed how we run our debrief sessions. Every firefighter now has a voice, not just the loudest in the room.',
    name: 'James Thornton',
    role: 'Station Officer',
    org: 'West Midlands Fire Service',
    icon: Flame,
    color: '#f97316',
  },
  {
    quote: 'The quiz leaderboards bring genuine energy to sessions that used to feel flat. Our pass rates on competency assessments are up significantly.',
    name: 'Sarah Mitchell',
    role: 'Training & Development Lead',
    org: 'Metropolitan Police',
    icon: Shield,
    color: '#3b82f6',
  },
  {
    quote: 'The anonymous Q&A feature has been a game-changer for clinical governance meetings. Paramedics raise issues they never would face-to-face.',
    name: 'Dr Priya Sharma',
    role: 'Clinical Lead',
    org: 'East Midlands Ambulance Service',
    icon: Siren,
    color: '#10b981',
  },
  {
    quote: 'Rolling it out across our volunteer teams was painless. No accounts, no app installs — just a code on the screen and everyone is connected.',
    name: 'Mark Evans',
    role: 'Operations Manager',
    org: 'Lowland Rescue',
    icon: Search,
    color: '#f59e0b',
  },
]

function TestimonialCard({ t }: { t: typeof TESTIMONIALS[number] }) {
  return (
    <div className="w-[320px] shrink-0 p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] [box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.03)_inset]">
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${t.color}15` }}
        >
          <t.icon className="w-4 h-4" style={{ color: t.color }} />
        </div>
        <div>
          <p className="text-xs font-semibold text-white/80">{t.name}</p>
          <p className="text-[10px] text-white/30">{t.role}, {t.org}</p>
        </div>
      </div>
      <p className="text-xs text-white/40 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
    </div>
  )
}

export function TestimonialMarquee() {
  const doubled = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS]

  return (
    <div className="relative overflow-hidden">
      {/* Row 1 — scroll left */}
      <div className="flex gap-4 animate-[marqueeLeft_40s_linear_infinite] hover:[animation-play-state:paused]">
        {doubled.map((t, i) => (
          <TestimonialCard key={`r1-${i}`} t={t} />
        ))}
      </div>

      {/* Row 2 — scroll right */}
      <div className="flex gap-4 mt-4 animate-[marqueeRight_45s_linear_infinite] hover:[animation-play-state:paused]">
        {[...doubled].reverse().map((t, i) => (
          <TestimonialCard key={`r2-${i}`} t={t} />
        ))}
      </div>

      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#07070a] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#07070a] to-transparent" />
    </div>
  )
}
