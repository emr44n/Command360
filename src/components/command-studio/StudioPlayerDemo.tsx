'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Zap, Check, Play, ChevronDown, ChevronRight, Vote, RotateCcw, Layers, Flame, Cloud, Users, CloudRain } from 'lucide-react'

/**
 * Live-presentation studio player — a self-running mock of Command Studio in
 * presentation mode. A trigger sequence fires step by step: the events panel
 * lights up and ticks off, the canvas evolves (fire grows, smoke builds, a
 * casualty appears, rain changes behaviour, a team-decision vote opens), the
 * narrative line updates, and the timeline playhead sweeps. Wider, animated
 * version of the old static editor mock.
 */

interface Step {
  key: string
  cat: 'fire' | 'cas' | 'weather' | 'decision'
  label: string
  color: string
  fire: number
  smoke: number
  rain: boolean
  casualty: boolean
  vote: boolean
  narrate: string
}

const SEQ: Step[] = [
  { key: 'start', cat: 'fire', label: 'Start Fire', color: '#D94B3D', fire: 0.34, smoke: 0.06, rain: false, casualty: false, vote: false, narrate: 'Initial fire reported — single seat of fire, ground floor.' },
  { key: 'spread', cat: 'fire', label: 'Spread Fire', color: '#C9241A', fire: 0.72, smoke: 0.4, rain: false, casualty: false, vote: false, narrate: 'Fire spreading to the first floor — stairwell smoke-logging.' },
  { key: 'smoke', cat: 'weather', label: 'Smoke Build', color: '#8a9098', fire: 0.82, smoke: 0.85, rain: false, casualty: false, vote: false, narrate: 'Heavy smoke — visibility dropping across the scene.' },
  { key: 'casualty', cat: 'cas', label: 'Casualty Found', color: '#2E9E63', fire: 0.76, smoke: 0.72, rain: false, casualty: true, vote: false, narrate: 'Casualty located at a first-floor window — priority extraction.' },
  { key: 'rain', cat: 'weather', label: 'Rain · Wind', color: '#3E6DC4', fire: 0.46, smoke: 0.6, rain: true, casualty: true, vote: false, narrate: 'Weather turns — rain and gusting wind change fire behaviour.' },
  { key: 'vote', cat: 'decision', label: 'Team Decision', color: '#6a5ea8', fire: 0.42, smoke: 0.5, rain: true, casualty: true, vote: true, narrate: 'Decision point — what is your next command?' },
]

const ASSETS: { label: string; icon: typeof Flame; c: string }[] = [
  { label: 'Fire', icon: Flame, c: '#D94B3D' },
  { label: 'Smoke', icon: Cloud, c: '#8a9098' },
  { label: 'Rain', icon: CloudRain, c: '#3E6DC4' },
  { label: 'Casualty', icon: Users, c: '#2E9E63' },
]

export function StudioPlayerDemo() {
  const [step, setStep] = useState(0)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setReduced(true); return }
    const id = setInterval(() => setStep((v) => (v + 1) % SEQ.length), 2400)
    return () => clearInterval(id)
  }, [])

  const s = SEQ[step]
  const playhead = ((step + 1) / SEQ.length) * 100

  return (
    <div className="relative border border-white/12 bg-[#16191E] overflow-hidden" data-reveal>
      {/* title bar */}
      <div className="px-4 py-2.5 border-b border-white/10 flex items-center gap-2">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 bg-[#C9241A]/60" /><span className="w-2.5 h-2.5 bg-[#c98a2a]/40" /><span className="w-2.5 h-2.5 bg-[#2E9E63]/40" />
        </div>
        <span className="ff-mono text-[10px] text-white/40 ml-2 uppercase tracking-[0.08em]">Command Studio — Presentation Mode</span>
        <div className="ml-auto flex items-center gap-2">
          <span className="ff-mono px-2 py-0.5 bg-white/[0.05] text-[8px] text-white/40 uppercase tracking-[0.08em] hidden sm:inline">Code XK72</span>
          <span className="ff-mono px-2 py-0.5 bg-[#C9241A] text-[8px] text-white uppercase tracking-[0.08em] inline-flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-white v5-pulse" />Go Live</span>
        </div>
      </div>

      <div className="flex min-h-[360px] md:min-h-[440px]">
        {/* ── left: events panel ── */}
        <div className="w-[150px] sm:w-[200px] shrink-0 border-r border-white/10 p-2.5 flex flex-col">
          <div className="flex items-center justify-between mb-2.5">
            <span className="ff-mono text-[9px] text-white/35 uppercase tracking-[0.1em]">Events</span>
            <span className="flex items-center gap-1 ff-mono text-[7px] text-white/25 uppercase tracking-[0.08em]"><RotateCcw className="w-2 h-2" /> Reset</span>
          </div>
          {/* Fire Events category (expanded) */}
          <div className="flex items-center gap-1 mb-1">
            <ChevronDown className="w-2.5 h-2.5 text-white/30" />
            <span className="ff-mono text-[8px] font-semibold uppercase tracking-[0.1em] text-[#D94B3D]">Fire Events</span>
          </div>
          <div className="space-y-1">
            {SEQ.map((ev, i) => {
              const done = i < step
              const live = i === step
              return (
                <motion.div
                  key={ev.key}
                  animate={live ? { scale: [1, 1.025, 1] } : { scale: 1 }}
                  transition={live ? { duration: 1.1, repeat: Infinity } : { duration: 0.2 }}
                  className="flex items-center gap-1.5 px-2 py-1.5 border cursor-default"
                  style={
                    live
                      ? { background: `${ev.color}1f`, borderColor: `${ev.color}80` }
                      : done
                        ? { background: 'rgba(46,158,99,0.10)', borderColor: 'rgba(46,158,99,0.35)' }
                        : { background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.07)' }
                  }
                >
                  <Zap className="w-2.5 h-2.5 shrink-0" style={{ color: live ? ev.color : done ? '#2E9E63' : 'rgba(255,255,255,0.25)' }} />
                  <span className="text-[8.5px] font-medium truncate flex-1" style={{ color: live ? '#fff' : done ? '#7fd6a3' : 'rgba(255,255,255,0.4)' }}>{ev.label}</span>
                  {live ? <span className="w-2 h-2 shrink-0" style={{ background: ev.color }}><span className="block w-full h-full animate-ping" style={{ background: ev.color }} /></span>
                    : done ? <Check className="w-2.5 h-2.5 text-[#2E9E63] shrink-0" />
                      : <Play className="w-2.5 h-2.5 text-white/20 shrink-0" />}
                </motion.div>
              )
            })}
          </div>
          {/* collapsed categories */}
          <div className="mt-2 space-y-1">
            <div className="flex items-center gap-1"><ChevronRight className="w-2.5 h-2.5 text-white/30" /><span className="ff-mono text-[8px] font-semibold uppercase tracking-[0.1em] text-[#2E9E63]">Casualties</span><span className="text-[7px] text-white/20 ml-auto">2</span></div>
            <div className="flex items-center gap-1"><ChevronRight className="w-2.5 h-2.5 text-white/30" /><span className="ff-mono text-[8px] font-semibold uppercase tracking-[0.1em] text-[#3E6DC4]">Weather</span><span className="text-[7px] text-white/20 ml-auto">2</span></div>
          </div>
          {/* decision */}
          <div className="mt-auto pt-2 border-t border-white/10">
            <div className="flex items-center gap-1.5 px-2 py-1.5 border cursor-default" style={s.vote ? { background: 'rgba(106,94,168,0.18)', borderColor: 'rgba(106,94,168,0.55)' } : { background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.07)' }}>
              <Vote className="w-2.5 h-2.5 text-[#a99fd6]" />
              <span className="text-[8.5px] text-[#a99fd6] font-medium truncate flex-1">Team Decision</span>
              {s.vote ? <span className="w-2 h-2 bg-[#a99fd6] animate-ping" /> : <Play className="w-2.5 h-2.5 text-[#a99fd6]/50" />}
            </div>
          </div>
        </div>

        {/* ── center: canvas ── */}
        <div className="flex-1 relative bg-[#11151b] overflow-hidden flex flex-col">
          <div className="flex-1 relative overflow-hidden">
            {/* grid */}
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.4) 1px,transparent 1px)', backgroundSize: '22px 22px' }} />
            {/* building */}
            <div className="absolute inset-5 bg-[#2a313c]/30 border border-white/[0.05]">
              <div className="grid grid-cols-5 gap-1.5 p-4 pt-7">
                {Array.from({ length: 15 }).map((_, i) => (
                  <div key={i} className={`aspect-[3/4] ${i >= 10 ? 'bg-[#c98a2a]/40' : 'bg-sky-200/12'}`} />
                ))}
              </div>
            </div>
            {/* fire overlay — height + opacity track the step */}
            <motion.div
              className="absolute bottom-5 left-5 right-[42%] bg-gradient-to-t from-[#D94B3D]/40 via-[#C9241A]/22 to-transparent border-t-2 border-[#D94B3D]/50"
              animate={{ height: `${30 + s.fire * 38}%`, opacity: 0.55 + s.fire * 0.45 }}
              transition={{ duration: 1 }}
            >
              <motion.div className="absolute inset-0 bg-[#D94B3D]/15" animate={reduced ? {} : { opacity: [0.2, 0.55, 0.2] }} transition={{ duration: 1.3, repeat: Infinity }} />
              <span className="absolute -top-4 left-0 ff-mono text-[7px] text-[#eaa097] uppercase tracking-[0.08em]">Fire · {Math.round(s.fire * 100)}%</span>
            </motion.div>
            {/* smoke */}
            <motion.div className="absolute top-5 left-[12%] right-[20%] h-[30%] bg-gradient-to-b from-white/14 to-transparent" animate={{ opacity: s.smoke }} transition={{ duration: 1 }} />
            {/* rain */}
            <div className={`cs-rain absolute inset-0 transition-opacity duration-700 pointer-events-none ${s.rain ? 'opacity-100' : 'opacity-0'}`} />
            {/* casualty marker */}
            <AnimatePresence>
              {s.casualty && (
                <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }} className="absolute top-[34%] right-[34%] flex items-center gap-1 px-1.5 py-1 bg-[#2E9E63]/20 border border-[#2E9E63]/60 backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 bg-[#2E9E63] rounded-full animate-ping" />
                  <span className="ff-mono text-[7px] text-[#7fd6a3] uppercase tracking-[0.06em]">Casualty</span>
                </motion.div>
              )}
            </AnimatePresence>
            {/* animating badge */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 bg-black/45 border backdrop-blur-sm" style={{ borderColor: `${s.color}66` }}>
              <span className="w-1.5 h-1.5 animate-ping" style={{ background: s.color }} />
              <span className="ff-mono text-[8px] uppercase tracking-[0.08em]" style={{ color: s.color }}>Animating: {s.label}</span>
            </div>
            {/* decision vote popup */}
            <AnimatePresence>
              {s.vote && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute bottom-4 right-4 w-[150px] bg-[#0F1216]/92 border border-[#6a5ea8]/50 backdrop-blur-sm p-2.5">
                  <div className="ff-mono text-[7px] uppercase tracking-[0.1em] text-[#a99fd6] mb-1.5">Team Decision</div>
                  {[['Defensive', 64], ['Offensive', 36]].map(([l, v]) => (
                    <div key={l as string} className="mb-1.5">
                      <div className="flex justify-between ff-mono text-[7px] text-white/55 mb-0.5"><span>{l}</span><span>{v}%</span></div>
                      <div className="h-1.5 bg-white/[0.08]"><motion.div className="h-full bg-[#6a5ea8]" initial={{ width: 0 }} animate={{ width: `${v}%` }} transition={{ duration: 0.8 }} /></div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* narrative line */}
          <div className="border-t border-white/[0.07] px-4 py-2 flex items-center gap-2.5">
            <span className="ff-mono text-[8px] uppercase tracking-[0.1em] shrink-0" style={{ color: s.color }}>Narrative</span>
            <AnimatePresence mode="wait">
              <motion.span key={s.key} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.3 }} className="text-[11px] text-white/65 leading-snug truncate">{s.narrate}</motion.span>
            </AnimatePresence>
          </div>
        </div>

        {/* ── right: assets / layers (desktop) ── */}
        <div className="w-[160px] shrink-0 border-l border-white/10 p-2.5 hidden lg:flex flex-col">
          <div className="flex items-center gap-1.5 mb-2.5"><Layers className="w-3 h-3 text-white/30" /><span className="ff-mono text-[9px] text-white/35 uppercase tracking-[0.1em]">Assets</span></div>
          <div className="space-y-1.5">
            {ASSETS.map((a) => {
              const on = (a.label === 'Fire') || (a.label === 'Smoke' && s.smoke > 0.3) || (a.label === 'Rain' && s.rain) || (a.label === 'Casualty' && s.casualty)
              return (
                <div key={a.label} className="flex items-center gap-2 px-2 py-1.5 border transition-colors duration-500" style={on ? { background: `${a.c}1a`, borderColor: `${a.c}66` } : { background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
                  <a.icon className="w-3 h-3 shrink-0" style={{ color: on ? a.c : 'rgba(255,255,255,0.3)' }} />
                  <span className="text-[9px] font-medium flex-1" style={{ color: on ? '#fff' : 'rgba(255,255,255,0.4)' }}>{a.label}</span>
                  <span className="ff-mono text-[7px] uppercase tracking-[0.06em]" style={{ color: on ? a.c : 'rgba(255,255,255,0.25)' }}>{on ? 'On' : 'Off'}</span>
                </div>
              )
            })}
          </div>
          <div className="mt-auto pt-2 border-t border-white/10">
            <div className="ff-mono text-[7px] text-white/25 uppercase tracking-[0.08em] mb-1">Audience</div>
            <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#2E9E63] v5-pulse" /><span className="ff-mono text-[10px] text-white/55">32 watching live</span></div>
          </div>
        </div>
      </div>

      {/* ── bottom: timeline with sweeping playhead ── */}
      <div className="border-t border-white/10 h-[78px] sm:h-[92px] flex">
        <div className="w-[150px] sm:w-[200px] shrink-0 border-r border-white/10 py-2">
          {[
            { name: 'Building.jpg', c: '#3E6DC4' },
            { name: 'Fire_overlay.webm', c: '#D94B3D' },
            { name: 'Smoke.webm', c: '#8a9098' },
            { name: 'Rain.webm', c: '#3E6DC4' },
          ].map((t) => (
            <div key={t.name} className="flex items-center gap-1.5 px-2.5 py-[3px]">
              <span className="w-1.5 h-1.5 shrink-0" style={{ background: t.c }} />
              <span className="ff-mono text-[7px] text-white/35 truncate">{t.name}</span>
            </div>
          ))}
        </div>
        <div className="flex-1 relative py-2 px-1.5">
          <div className="absolute top-0 inset-x-0 h-3 border-b border-white/[0.06] flex items-end px-1.5">
            {['0s', '2s', '4s', '6s', '8s', '10s'].map((t) => <span key={t} className="ff-mono text-[6px] text-white/15 flex-1">{t}</span>)}
          </div>
          <div className="mt-3.5 space-y-[4px]">
            <div className="h-[12px] bg-[#3E6DC4]/20 border border-[#3E6DC4]/30 w-full" />
            <div className="h-[12px] bg-[#D94B3D]/25 border border-[#D94B3D]/35" style={{ width: `${20 + s.fire * 60}%`, marginLeft: '8%' }} />
            <div className="h-[12px] bg-white/[0.07] border border-white/[0.08]" style={{ width: `${10 + s.smoke * 45}%`, marginLeft: '18%' }} />
            <div className={`h-[12px] bg-[#3E6DC4]/18 border border-[#3E6DC4]/25 transition-all duration-700`} style={{ width: s.rain ? '46%' : '0%', marginLeft: '40%' }} />
          </div>
          {/* sweeping playhead */}
          <motion.div className="absolute top-0 bottom-0 w-px bg-[#C9241A] z-10" animate={{ left: `${playhead}%` }} transition={{ duration: 0.8, ease: 'easeInOut' }}>
            <div className="absolute -top-0.5 -left-[3px] w-[7px] h-[7px] bg-[#C9241A] rotate-45" />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
