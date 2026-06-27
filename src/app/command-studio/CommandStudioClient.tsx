'use client'

import {
  Layers, Zap, Play, Sparkles, Vote, Eye, Monitor, MousePointerClick,
  Flame, Shield, Siren, Target, Image, Video, ChevronRight, Check,
  Volume2, Type, Square, RotateCcw, ChevronDown,
} from 'lucide-react'
import { PageHero, Eyebrow, LightSection, DarkSection, Container } from '@/components/site/primitives'
import { SpotlightCard } from '@/components/home/SpotlightCard'
import { V5AuthButton } from '@/components/home/V5Chrome'

/* ── DATA ── */

const STEPS = [
  {
    n: '01',
    icon: Layers,
    title: 'Build your scene',
    description: 'Layer images, videos, and transparent WebM overlays on a flexible canvas. Position, resize, and stack elements to create realistic training environments.',
    c: '#C9241A',
  },
  {
    n: '02',
    icon: Zap,
    title: 'Define events',
    description: 'Create triggers that change the scene — add fire spread, reveal casualties, update weather conditions. Each event is a button press away.',
    c: '#c98a2a',
  },
  {
    n: '03',
    icon: Play,
    title: 'Go live',
    description: 'Present to your team and trigger events in real-time. Everyone sees the scene evolve simultaneously as you control the narrative.',
    c: '#2E9E63',
  },
  {
    n: '04',
    icon: Sparkles,
    title: 'Debrief',
    description: 'Review decisions with AI-powered analysis. Understand how your team responded to each event and identify areas for improvement.',
    c: '#6a5ea8',
  },
]

const FEATURES = [
  {
    icon: Layers,
    title: 'Layer-based canvas',
    description: 'Stack images, videos, and transparent WebM overlays to build complex, realistic scenes. Full control over z-order, opacity, and positioning.',
    c: '#C9241A',
  },
  {
    icon: MousePointerClick,
    title: 'Event triggers',
    description: 'Create manual buttons that control scene changes — reveal fire spread, introduce casualties, change conditions. One click, instant transformation.',
    c: '#c98a2a',
  },
  {
    icon: Eye,
    title: 'Live audience view',
    description: 'Everyone sees the scene evolve in real-time. No refreshing, no delays. Your team experiences the scenario together as it unfolds.',
    c: '#2E9E63',
  },
  {
    icon: Monitor,
    title: 'CSS transitions',
    description: 'Smooth fade, move, and resize animations bring your scenarios to life. Elements transition naturally between states for maximum realism.',
    c: '#3E6DC4',
  },
  {
    icon: Vote,
    title: 'Optional voting',
    description: 'Let your audience vote on what happens next. Collaborative decision-making adds engagement and reveals team thinking in real-time.',
    c: '#6a5ea8',
  },
  {
    icon: Sparkles,
    title: 'AI analysis',
    description: 'Post-scenario decision review powered by AI. Get automatic summaries, timeline analysis, and actionable recommendations for your team.',
    c: '#2592a3',
  },
]

const USE_CASES = [
  {
    icon: Flame,
    title: 'Fire & Rescue',
    description: 'Building fire scenarios with smoke and fire overlays. Progress from initial report through escalation, rescue, and containment phases.',
    c: '#D94B3D',
  },
  {
    icon: Shield,
    title: 'Police',
    description: 'Crime scene reconstruction and decision training. Walk your team through evolving situations where every choice matters.',
    c: '#3E6DC4',
  },
  {
    icon: Siren,
    title: 'Ambulance',
    description: 'Patient assessment scenarios with evolving symptoms. Layer vital signs, injury overlays, and environmental conditions.',
    c: '#2E9E63',
  },
  {
    icon: Target,
    title: 'Armed Forces',
    description: 'Tactical situation awareness training. Build evolving battlefield conditions with terrain, assets, and threat overlays.',
    c: '#8a7d3a',
  },
]

/* ── PAGE ── */

export default function CommandStudioClient() {
  return (
    <>
      {/* ═══════════════════════════════════════════
          HERO
          ═══════════════════════════════════════════ */}
      <PageHero
        eyebrow={<Eyebrow>Command Studio</Eyebrow>}
        title={<>Interactive scenarios that <span className="text-[#C9241A]">bring training to life.</span></>}
        lede="Build live, evolving scenes for emergency services training. Layer images and videos on a canvas, define event triggers, and control the narrative in real-time while your team watches the scenario unfold."
      >
        <V5AuthButton tab="register" label="Start free trial" variant="solid" />
        <a href="#how-it-works" className="ff-mono text-[13px] font-semibold uppercase tracking-[0.05em] text-white border border-white/22 hover:bg-white/[0.06] hover:border-white/40 px-6 py-4 transition-colors">See how it works</a>
      </PageHero>

      {/* ═══════════════════════════════════════════
          EDITOR MOCKUP — STUDIO EDITOR
          ═══════════════════════════════════════════ */}
      <DarkSection>
        <div className="absolute top-[-140px] left-1/2 -translate-x-1/2 w-[900px] h-[560px] pointer-events-none" aria-hidden="true" style={{ background: 'radial-gradient(55% 65% at 50% 30%,rgba(201,36,26,.14),transparent 76%)', filter: 'blur(46px)' }} />
        <div className="absolute inset-0 v5-grain opacity-[0.1] mix-blend-overlay pointer-events-none" aria-hidden="true" />
        <Container className="relative">
          <div className="max-w-[760px] mx-auto" data-reveal>
            <div className="relative border border-white/12 bg-[#16191E] overflow-hidden">
              {/* Title bar */}
              <div className="px-4 py-2 border-b border-white/10 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 bg-[#C9241A]/60" />
                  <span className="w-2.5 h-2.5 bg-[#c98a2a]/40" />
                  <span className="w-2.5 h-2.5 bg-[#2E9E63]/40" />
                </div>
                <span className="ff-mono text-[10px] text-white/35 ml-2 uppercase tracking-[0.08em]">Command Studio — Interactive Simulation Scenario</span>
                <div className="ml-auto flex gap-2">
                  <span className="ff-mono px-2 py-0.5 bg-[#2E9E63]/20 text-[8px] text-[#7fd6a3] uppercase tracking-[0.08em]">Saved</span>
                  <span className="ff-mono px-2 py-0.5 bg-[#C9241A] text-[8px] text-white uppercase tracking-[0.08em]">Go Live</span>
                </div>
              </div>

              {/* Editor 3-column layout */}
              <div className="flex h-[200px] sm:h-[260px] md:h-[320px]">
                {/* Left: Events panel with categories */}
                <div className="w-[110px] sm:w-[150px] md:w-[170px] shrink-0 border-r border-white/10 flex flex-col">
                  {/* Icon sidebar */}
                  <div className="flex items-center gap-0.5 px-2 py-2 border-b border-white/10">
                    {[Layers, Type, Square, Image, Video, Zap].map((Icon, i) => (
                      <div key={i} className={`w-6 h-6 flex items-center justify-center ${i === 5 ? 'bg-[#C9241A]/20 text-[#C9241A]' : 'text-white/20 hover:text-white/40'}`}>
                        <Icon className="w-3 h-3" />
                      </div>
                    ))}
                  </div>
                  <div className="ff-mono px-2 py-2 text-[9px] text-white/30 uppercase tracking-[0.1em]">Events</div>
                  {/* Category: Fire Events */}
                  <div className="px-2 space-y-0.5 flex-1 overflow-hidden">
                    <div className="flex items-center gap-1">
                      <ChevronDown className="w-2.5 h-2.5 text-white/30" />
                      <span className="ff-mono text-[8px] font-semibold uppercase tracking-[0.1em] text-[#D94B3D]">Fire Events</span>
                      <span className="text-[7px] text-white/20 ml-auto">3</span>
                    </div>
                    {[
                      { name: 'Start Fire', color: '#D94B3D', actions: 2 },
                      { name: 'Spread Fire', color: '#C9241A', actions: 3 },
                      { name: 'Fire Out', color: '#c98a2a', actions: 1 },
                    ].map((evt) => (
                      <div key={evt.name} className="flex items-center gap-1.5 px-1.5 py-1 bg-white/[0.02] border border-white/[0.06] hover:border-white/12 cursor-default">
                        <div className="w-1.5 h-1.5 shrink-0" style={{ backgroundColor: evt.color }} />
                        <span className="text-[8px] text-white/50 truncate flex-1">{evt.name}</span>
                        <span className="text-[7px] text-white/20 bg-white/[0.05] px-1">{evt.actions}</span>
                        <Play className="w-2 h-2 text-white/20" />
                      </div>
                    ))}
                    {/* Category: Casualties */}
                    <div className="flex items-center gap-1 mt-1.5">
                      <ChevronRight className="w-2.5 h-2.5 text-white/30" />
                      <span className="ff-mono text-[8px] font-semibold uppercase tracking-[0.1em] text-[#2E9E63]">Casualties</span>
                      <span className="text-[7px] text-white/20 ml-auto">2</span>
                    </div>
                    {/* Category: Weather */}
                    <div className="flex items-center gap-1 mt-0.5">
                      <ChevronRight className="w-2.5 h-2.5 text-white/30" />
                      <span className="ff-mono text-[8px] font-semibold uppercase tracking-[0.1em] text-[#3E6DC4]">Weather</span>
                      <span className="text-[7px] text-white/20 ml-auto">2</span>
                    </div>
                  </div>
                </div>

                {/* Center: Canvas */}
                <div className="flex-1 relative bg-[#0F1216] overflow-hidden">
                  <div className="absolute inset-0 opacity-[0.04]" style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                  }} />
                  {/* Canvas content */}
                  <div className="absolute inset-3 border border-white/[0.06] bg-[#1c222b] overflow-hidden">
                    {/* Building base layer */}
                    <div className="absolute inset-2 bg-[#2a313c]/40 border border-white/[0.03]">
                      <div className="grid grid-cols-5 gap-1.5 p-3 pt-6">
                        {Array.from({ length: 15 }).map((_, i) => (
                          <div key={i} className={`aspect-[3/4] ${i >= 10 ? 'bg-[#c98a2a]/30' : 'bg-sky-200/10'}`} />
                        ))}
                      </div>
                    </div>
                    {/* Fire overlay — selected with red transform handles */}
                    <div className="absolute bottom-3 left-3 right-[45%] h-[38%] bg-gradient-to-t from-[#D94B3D]/25 via-[#C9241A]/15 to-transparent border-2 border-dashed border-[#C9241A]/60">
                      <span className="absolute -top-4 left-0 ff-mono text-[7px] text-[#D94B3D]/80 uppercase tracking-[0.08em]">Fire Overlay</span>
                      {/* Transform handles */}
                      <div className="absolute -top-1 -left-1 w-2 h-2 bg-white border border-[#C9241A]" />
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-white border border-[#C9241A]" />
                      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white border border-[#C9241A]" />
                      <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white border border-[#C9241A]" />
                    </div>
                    {/* Smoke layer */}
                    <div className="absolute top-3 left-[15%] right-[25%] h-[28%] bg-gradient-to-b from-white/8 to-transparent border border-white/[0.04]" />
                    {/* Canvas label */}
                    <div className="absolute bottom-1.5 right-2 ff-mono text-[7px] text-white/15">1920 × 1080</div>
                  </div>
                </div>

                {/* Right: Event Settings Panel */}
                <div className="w-[170px] shrink-0 border-l border-white/10 p-2 hidden md:flex flex-col">
                  <div className="ff-mono text-[9px] text-white/30 uppercase tracking-[0.1em] mb-2">Event Settings</div>
                  {/* Event name */}
                  <div className="mb-2">
                    <div className="ff-mono text-[7px] text-white/20 mb-0.5 uppercase tracking-[0.08em]">Name</div>
                    <div className="px-1.5 py-1 bg-white/[0.04] border border-white/[0.06] text-[9px] text-[#e0b06a]">Spread Fire</div>
                  </div>
                  {/* Select Object — locked state (GREEN) */}
                  <div className="flex items-center gap-1.5 px-2 py-1.5 bg-[#2E9E63]/20 border border-[#2E9E63]/40 mb-2">
                    <div className="w-1.5 h-1.5 bg-[#2E9E63]" />
                    <span className="text-[8px] text-[#7fd6a3] font-medium">Fire Overlay</span>
                    <span className="text-[7px] text-[#2E9E63]/60 ml-auto">×</span>
                  </div>
                  {/* Animation controls */}
                  <div className="space-y-1.5 flex-1">
                    <div>
                      <div className="ff-mono text-[7px] text-white/20 mb-0.5 uppercase tracking-[0.08em]">Property</div>
                      <div className="px-1.5 py-0.5 bg-white/[0.04] border border-white/[0.06] text-[8px] text-white/50">Opacity</div>
                    </div>
                    <div className="flex gap-1">
                      <div className="flex-1">
                        <div className="ff-mono text-[7px] text-white/20 mb-0.5 uppercase tracking-[0.08em]">From</div>
                        <div className="px-1.5 py-0.5 bg-white/[0.04] border border-white/[0.06] text-[8px] text-white/50">0.3</div>
                      </div>
                      <div className="flex-1">
                        <div className="ff-mono text-[7px] text-white/20 mb-0.5 uppercase tracking-[0.08em]">To</div>
                        <div className="px-1.5 py-0.5 bg-white/[0.04] border border-white/[0.06] text-[8px] text-white/50">1.0</div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <div className="flex-1">
                        <div className="ff-mono text-[7px] text-white/20 mb-0.5 uppercase tracking-[0.08em]">Duration</div>
                        <div className="px-1.5 py-0.5 bg-white/[0.04] border border-white/[0.06] text-[8px] text-white/50">800ms</div>
                      </div>
                      <div className="flex-1">
                        <div className="ff-mono text-[7px] text-white/20 mb-0.5 uppercase tracking-[0.08em]">Easing</div>
                        <div className="px-1.5 py-0.5 bg-white/[0.04] border border-white/[0.06] text-[8px] text-white/50">Ease Out</div>
                      </div>
                    </div>
                    {/* Presets */}
                    <div className="pt-1 border-t border-white/[0.06]">
                      <div className="ff-mono text-[7px] text-white/20 mb-1 uppercase tracking-[0.08em]">Presets</div>
                      <div className="grid grid-cols-2 gap-0.5">
                        {['Fade In', 'Fade Out', 'Scale Up', 'Spin'].map((p) => (
                          <div key={p} className="px-1 py-0.5 bg-white/[0.03] border border-white/[0.06] text-[7px] text-white/30 text-center hover:border-white/12 cursor-default">{p}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom: Timeline with tracks and clips */}
              <div className="border-t border-white/10 h-[60px] sm:h-[80px] md:h-[100px] flex">
                {/* Track labels */}
                <div className="w-[110px] sm:w-[150px] md:w-[170px] shrink-0 border-r border-white/10 py-1.5">
                  {[
                    { name: 'Building.jpg', icon: Image, color: 'text-[#3E6DC4]/70' },
                    { name: 'Fire_overlay.webm', icon: Video, color: 'text-[#D94B3D]/70' },
                    { name: 'Smoke.webm', icon: Video, color: 'text-white/30' },
                    { name: 'Ambient.mp3', icon: Volume2, color: 'text-[#6a5ea8]/70' },
                  ].map((track) => (
                    <div key={track.name} className="flex items-center gap-1.5 px-2 py-[3px]">
                      <track.icon className={`w-2.5 h-2.5 ${track.color}`} />
                      <span className="ff-mono text-[7px] text-white/30 truncate">{track.name}</span>
                    </div>
                  ))}
                </div>
                {/* Track clips area */}
                <div className="flex-1 relative py-1.5 px-1">
                  {/* Time ruler */}
                  <div className="absolute top-0 left-0 right-0 h-3 border-b border-white/[0.06] flex items-end px-1">
                    {['0s', '2s', '4s', '6s', '8s', '10s'].map((t) => (
                      <span key={t} className="ff-mono text-[6px] text-white/15 flex-1">{t}</span>
                    ))}
                  </div>
                  {/* Clips */}
                  <div className="mt-3 space-y-[3px]">
                    <div className="h-[14px] bg-[#3E6DC4]/20 border border-[#3E6DC4]/30 w-full flex items-center px-1.5">
                      <span className="ff-mono text-[6px] text-[#8fb0e6]">Building.jpg</span>
                    </div>
                    <div className="h-[14px] bg-[#D94B3D]/20 border border-[#D94B3D]/30 w-[65%] ml-[10%] flex items-center px-1.5">
                      <span className="ff-mono text-[6px] text-[#eaa097]">Fire_overlay.webm</span>
                    </div>
                    <div className="h-[14px] bg-white/[0.06] border border-white/[0.06] w-[40%] ml-[20%] flex items-center px-1.5">
                      <span className="ff-mono text-[6px] text-white/30">Smoke.webm</span>
                    </div>
                    <div className="h-[14px] bg-[#6a5ea8]/20 border border-[#6a5ea8]/30 w-full flex items-center px-1.5">
                      <span className="ff-mono text-[6px] text-[#a99fd6]">Ambient.mp3</span>
                    </div>
                  </div>
                  {/* Playhead */}
                  <div className="absolute top-0 bottom-0 left-[35%] w-px bg-[#C9241A] z-10">
                    <div className="absolute -top-0.5 -left-[3px] w-[7px] h-[7px] bg-[#C9241A] rotate-45" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </DarkSection>

      {/* ═══════════════════════════════════════════
          HOW IT WORKS
          ═══════════════════════════════════════════ */}
      <LightSection>
        <Container>
          <div className="max-w-[620px] mb-3.5" id="how-it-works">
            <Eyebrow n="01">How It Works</Eyebrow>
            <h2 className="ff-display font-extrabold text-[clamp(30px,3.8vw,48px)] leading-none tracking-[-0.02em] mt-4 text-[#16191E]">Four steps to immersive training</h2>
            <p className="text-[16px] text-[#5a5f66] mt-4">From scene creation to AI-powered debrief, Command Studio covers the full training lifecycle.</p>
          </div>
          <div className="h-0.5 bg-[#16191E] origin-left mt-7" data-rule />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 border-l border-[rgba(20,25,30,0.16)]">
            {STEPS.map((step) => (
              <SpotlightCard key={step.n} glow={`${step.c}26`} className="v5-card group relative overflow-hidden p-[34px_30px] border-r border-b border-[rgba(20,25,30,0.16)] block cursor-default">
                <span className="absolute inset-0 pointer-events-none" style={{ ['--v5-wash' as string]: `${step.c}24` }} aria-hidden="true" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-[42px] h-[42px] flex items-center justify-center" style={{ background: `${step.c}18` }}>
                      <step.icon className="w-5 h-5" style={{ color: step.c }} />
                    </div>
                    <span className="ff-mono text-[12px] font-semibold tracking-[0.12em] text-[#5a5f66]">{step.n}</span>
                  </div>
                  <h3 className="ff-display font-bold text-[20px] tracking-[-0.01em] mb-2.5 text-[#16191E]">{step.title}</h3>
                  <p className="text-[14px] text-[#5a5f66] leading-relaxed">{step.description}</p>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </Container>
      </LightSection>

      {/* ═══════════════════════════════════════════
          KEY FEATURES
          ═══════════════════════════════════════════ */}
      <DarkSection>
        <div className="absolute top-[-140px] right-[-100px] w-[780px] h-[560px] pointer-events-none" aria-hidden="true" style={{ background: 'radial-gradient(55% 65% at 70% 30%,rgba(201,36,26,.14),transparent 76%)', filter: 'blur(46px)' }} />
        <div className="absolute inset-0 v5-grain opacity-[0.1] mix-blend-overlay pointer-events-none" aria-hidden="true" />
        <Container className="relative">
          <div className="max-w-[620px] mb-9">
            <Eyebrow n="02">Key Features</Eyebrow>
            <h2 className="ff-display font-extrabold text-[clamp(28px,3.6vw,44px)] leading-[1.02] tracking-[-0.02em] mt-4 text-white">Everything you need for scenario training</h2>
            <p className="text-[16px] text-[#9aa0a8] mt-4">Powerful tools designed to make immersive training accessible to every team.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-white/14">
            {FEATURES.map((f) => (
              <div key={f.title} data-reveal className="group v5-pop cursor-default relative p-[28px_26px] border-r border-b border-white/14">
                <div className="w-[42px] h-[42px] flex items-center justify-center mb-5" style={{ background: `${f.c}1f` }}>
                  <f.icon className="w-5 h-5" style={{ color: f.c }} />
                </div>
                <h3 className="ff-display font-bold text-[18px] tracking-[-0.01em] mb-2 text-white">{f.title}</h3>
                <p className="text-[14px] text-[#9aa0a8] leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </DarkSection>

      {/* ═══════════════════════════════════════════
          USE CASES
          ═══════════════════════════════════════════ */}
      <LightSection>
        <Container>
          <div className="max-w-[620px] mb-3.5">
            <Eyebrow n="03">Use Cases</Eyebrow>
            <h2 className="ff-display font-extrabold text-[clamp(30px,3.8vw,48px)] leading-none tracking-[-0.02em] mt-4 text-[#16191E]">Built for every emergency service</h2>
            <p className="text-[16px] text-[#5a5f66] mt-4">Realistic scenario training tailored to operational needs.</p>
          </div>
          <div className="h-0.5 bg-[#16191E] origin-left mt-7" data-rule />
          <div className="grid sm:grid-cols-2 border-l border-t border-[rgba(20,25,30,0.16)]">
            {USE_CASES.map((uc) => (
              <SpotlightCard key={uc.title} glow={`${uc.c}26`} className="v5-card group relative overflow-hidden p-[34px_30px] border-r border-b border-[rgba(20,25,30,0.16)] block cursor-default">
                <span className="absolute inset-0 pointer-events-none" style={{ ['--v5-wash' as string]: `${uc.c}24` }} aria-hidden="true" />
                <div className="relative flex items-start gap-4">
                  <div className="w-[42px] h-[42px] flex items-center justify-center shrink-0" style={{ background: `${uc.c}18` }}>
                    <uc.icon className="w-5 h-5" style={{ color: uc.c }} />
                  </div>
                  <div>
                    <h3 className="ff-display font-bold text-[21px] tracking-[-0.01em] mb-2.5 text-[#16191E]">{uc.title}</h3>
                    <p className="text-[14.5px] text-[#5a5f66] leading-relaxed">{uc.description}</p>
                  </div>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </Container>
      </LightSection>

      {/* ═══════════════════════════════════════════
          PRESENTER MOCKUP — LIVE PRESENTATION
          ═══════════════════════════════════════════ */}
      <DarkSection>
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true" style={{ background: 'radial-gradient(60% 50% at 50% 50%,rgba(201,36,26,.08),transparent 72%)' }} />
        <div className="absolute inset-0 v5-grain opacity-[0.1] mix-blend-overlay pointer-events-none" aria-hidden="true" />
        <Container className="relative">
          <div className="max-w-[620px] mb-9">
            <Eyebrow n="04">Live Presentation</Eyebrow>
            <h2 className="ff-display font-extrabold text-[clamp(28px,3.6vw,44px)] leading-[1.02] tracking-[-0.02em] mt-4 text-white">Trigger events. Control the narrative.</h2>
            <p className="text-[16px] text-[#9aa0a8] mt-4">In presentation mode, you see the full canvas with a live events panel. One click triggers animated scene changes that your entire audience sees in real-time.</p>
          </div>

          <div className="relative border border-white/12 bg-[#16191E] overflow-hidden" data-reveal>
            {/* Presenter layout */}
            <div className="flex min-h-[320px] md:min-h-[400px]">
              {/* Canvas view — large */}
              <div className="flex-1 relative bg-[#13171c] flex flex-col">
                {/* Presenter canvas */}
                <div className="flex-1 relative overflow-hidden">
                  {/* Building scene with fire actively animating */}
                  <div className="absolute inset-4 bg-[#2a313c]/30 border border-white/[0.04]">
                    <div className="grid grid-cols-5 gap-1.5 p-4 pt-8">
                      {Array.from({ length: 15 }).map((_, i) => (
                        <div key={i} className={`aspect-[3/4] ${i >= 10 ? 'bg-[#c98a2a]/40' : i >= 5 ? 'bg-sky-200/8' : 'bg-sky-200/15'}`} />
                      ))}
                    </div>
                  </div>
                  {/* Fire spread — animating (glowing border) */}
                  <div className="absolute bottom-4 left-4 right-[35%] h-[45%] bg-gradient-to-t from-[#D94B3D]/30 via-[#C9241A]/20 to-transparent border border-[#D94B3D]/40">
                    <div className="absolute inset-0 bg-[#D94B3D]/10 animate-pulse" />
                  </div>
                  {/* Smoke — visible */}
                  <div className="absolute top-6 left-[10%] right-[20%] h-[25%] bg-gradient-to-b from-white/8 to-transparent" />
                  {/* Animating indicator */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 bg-[#c98a2a]/15 border border-[#c98a2a]/40 backdrop-blur-sm">
                    <span className="w-1.5 h-1.5 bg-[#e0b06a] animate-ping" />
                    <span className="ff-mono text-[8px] text-[#e0b06a] uppercase tracking-[0.08em]">Animating: Spread Fire</span>
                  </div>
                </div>
                {/* Join bar */}
                <div className="border-t border-white/[0.06] px-4 py-1.5 flex items-center justify-center gap-3">
                  <span className="ff-mono text-[8px] text-white/25">command360.co.uk/join</span>
                  <span className="text-[8px] text-white/10">|</span>
                  <span className="ff-mono text-[8px] text-white/25">Code: <span className="text-white/45 font-bold">XK72</span></span>
                </div>
              </div>

              {/* Right: Events panel */}
              <div className="w-[200px] shrink-0 border-l border-white/10 p-3 hidden md:flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className="ff-mono text-[9px] text-white/30 uppercase tracking-[0.1em]">Events</span>
                  <div className="flex items-center gap-1 ff-mono text-[7px] text-white/20 hover:text-white/40 cursor-default uppercase tracking-[0.08em]">
                    <RotateCcw className="w-2 h-2" /> Reset
                  </div>
                </div>
                {/* Fire Events category */}
                <div className="mb-2">
                  <div className="flex items-center gap-1 mb-1">
                    <ChevronDown className="w-2.5 h-2.5 text-white/30" />
                    <span className="ff-mono text-[8px] font-semibold uppercase tracking-[0.1em] text-[#D94B3D]">Fire Events</span>
                  </div>
                  {/* Triggered event (green) */}
                  <div className="flex items-center gap-1.5 px-2 py-1.5 bg-[#2E9E63]/10 border border-[#2E9E63]/40 mb-1 cursor-default">
                    <Zap className="w-2.5 h-2.5 text-[#2E9E63]" />
                    <span className="text-[8px] text-[#7fd6a3] font-medium truncate flex-1">Start Fire</span>
                    <span className="text-[7px] text-[#2E9E63]/60 bg-[#2E9E63]/10 px-1">2</span>
                    <Check className="w-2.5 h-2.5 text-[#2E9E63]" />
                  </div>
                  {/* Currently animating event (amber pulse) */}
                  <div className="flex items-center gap-1.5 px-2 py-1.5 bg-[#c98a2a]/10 border border-[#c98a2a]/50 mb-1 cursor-default animate-pulse">
                    <Zap className="w-2.5 h-2.5 text-[#e0b06a]" />
                    <span className="text-[8px] text-[#e0b06a] font-medium truncate flex-1">Spread Fire</span>
                    <span className="text-[7px] text-[#c98a2a]/60 bg-[#c98a2a]/10 px-1">3</span>
                    <span className="w-2 h-2 bg-[#e0b06a] animate-ping" />
                  </div>
                  {/* Untriggered event */}
                  <div className="flex items-center gap-1.5 px-2 py-1.5 bg-white/[0.03] border border-white/[0.06] mb-1 cursor-default">
                    <Zap className="w-2.5 h-2.5 text-white/25" />
                    <span className="text-[8px] text-white/40 font-medium truncate flex-1">Fire Out</span>
                    <span className="text-[7px] text-white/20 bg-white/[0.05] px-1">1</span>
                    <Play className="w-2.5 h-2.5 text-white/20" />
                  </div>
                </div>
                {/* Collapsed categories */}
                <div className="flex items-center gap-1 mb-1">
                  <ChevronRight className="w-2.5 h-2.5 text-white/30" />
                  <span className="ff-mono text-[8px] font-semibold uppercase tracking-[0.1em] text-[#2E9E63]">Casualties</span>
                  <span className="text-[7px] text-white/20 ml-auto">2</span>
                </div>
                <div className="flex items-center gap-1 mb-1">
                  <ChevronRight className="w-2.5 h-2.5 text-white/30" />
                  <span className="ff-mono text-[8px] font-semibold uppercase tracking-[0.1em] text-[#3E6DC4]">Weather</span>
                  <span className="text-[7px] text-white/20 ml-auto">2</span>
                </div>
                {/* Vote event */}
                <div className="mt-auto pt-2 border-t border-white/10">
                  <div className="flex items-center gap-1.5 px-2 py-1.5 bg-[#6a5ea8]/10 border border-[#6a5ea8]/30 cursor-default">
                    <Vote className="w-2.5 h-2.5 text-[#a99fd6]" />
                    <span className="text-[8px] text-[#a99fd6] font-medium truncate flex-1">Team Decision</span>
                    <Play className="w-2.5 h-2.5 text-[#a99fd6]/50" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </DarkSection>
    </>
  )
}
