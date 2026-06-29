'use client'

import {
  Layers, Zap, Play, Sparkles, Vote, Eye, Monitor, MousePointerClick,
  Flame, Shield, Siren, Target, Workflow, Repeat,
} from 'lucide-react'
import { PageHero, Eyebrow, LightSection, DarkSection, Container } from '@/components/site/primitives'
import { SpotlightCard } from '@/components/home/SpotlightCard'
import { V5AuthButton } from '@/components/home/V5Chrome'
import { ScenarioCarousel } from '@/components/command-studio/ScenarioCarousel'
import { StudioPlayerDemo } from '@/components/command-studio/StudioPlayerDemo'

/* ── DATA ── */

const IMMERSIVE = [
  { icon: Layers, title: 'Build a believable world', description: 'Compose bespoke scenes from images, video and overlays so teams confront recognisable settings — a motorway pile-up, a high-rise fire, a flooded estate — grounded in your own operating context.', c: '#D94B3D' },
  { icon: Workflow, title: 'Scenarios that evolve', description: 'Trigger events that shift the picture in real time, so decisions carry consequences. As conditions change, commanders must reassess, reprioritise and adapt the way a live incident demands.', c: '#3E6DC4' },
  { icon: Flame, title: 'Experience rare, high-risk events', description: 'Major incidents are rare by design, which limits real exposure. Simulation lets teams rehearse mass-casualty, hazmat or wide-area scenarios repeatedly, building familiarity real deployments cannot reliably provide.', c: '#c98a2a' },
  { icon: Repeat, title: 'Practise safely, then repeat', description: 'A consequence-free environment encourages bold decisions and honest mistakes. Run the same scenario again with new variables to test alternative approaches and embed learning through deliberate repetition.', c: '#2E9E63' },
]

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
        media={<ScenarioCarousel />}
      >
        <V5AuthButton tab="register" label="Start free trial" variant="solid" />
        <a href="#how-it-works" className="ff-mono text-[13px] font-semibold uppercase tracking-[0.05em] text-white border border-white/22 hover:bg-white/[0.06] hover:border-white/40 px-6 py-4 transition-colors">See how it works</a>
      </PageHero>

      {/* ═══════════════════════════════════════════
          EDITOR MOCKUP — removed (the simulation player now lives in the
          Live Presentation section below, animated and full-width).
          ═══════════════════════════════════════════ */}

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

          <StudioPlayerDemo />
        </Container>
      </DarkSection>

      {/* ═══ 05 IMMERSIVE PRACTICE (light) ═══ */}
      <LightSection>
        <Container>
          <div className="max-w-[680px] mb-3.5">
            <Eyebrow n="05">Immersive Practice</Eyebrow>
            <h2 className="ff-display font-extrabold text-[clamp(30px,3.8vw,48px)] leading-none tracking-[-0.02em] mt-4 text-[#16191E]">Rehearse the rare event before it ever reaches the ground</h2>
            <p className="text-[16px] text-[#5a5f66] mt-4">Layered, evolving scenarios let commanders make real decisions under pressure in a safe browser-based environment — no headset required, every detail tailored to your incident types.</p>
          </div>
          <div className="h-0.5 bg-[#16191E] origin-left mt-7" data-rule />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 border-l border-[rgba(20,25,30,0.16)]">
            {IMMERSIVE.map((f) => (
              <SpotlightCard key={f.title} glow={`${f.c}26`} className="v5-card group relative overflow-hidden p-[34px_28px] border-r border-b border-[rgba(20,25,30,0.16)] block cursor-default">
                <span className="absolute inset-0 pointer-events-none" style={{ ['--v5-wash' as string]: `${f.c}24` }} aria-hidden="true" />
                <div className="relative">
                  <div className="w-[42px] h-[42px] flex items-center justify-center mb-5" style={{ background: `${f.c}18` }}>
                    <f.icon className="w-5 h-5" style={{ color: f.c }} />
                  </div>
                  <h3 className="ff-display font-bold text-[18px] tracking-[-0.01em] mb-2.5 text-[#16191E]">{f.title}</h3>
                  <p className="text-[14px] text-[#5a5f66] leading-relaxed">{f.description}</p>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </Container>
      </LightSection>
    </>
  )
}
