import Link from 'next/link'
import {
  ArrowRight, Layers, Zap, Users, Sparkles, Vote, Play, MessageSquare,
  Flame, Shield, Siren, Target, Image, Video, MousePointerClick,
  Monitor, Eye, LayoutGrid, ChevronRight, Check,
} from 'lucide-react'
import { ScrollReveal } from '@/components/home/ScrollReveal'
import { FloatingJoinDock } from '@/components/join/FloatingJoinDock'
import { PublicLayout } from '@/components/layout/PublicLayout'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Command Studio — Command 360',
  description: 'Build interactive training scenarios with layered images, video effects, and real-time event triggers for emergency services.',
}

/* ── DATA ── */

const STEPS = [
  {
    n: '01',
    icon: Layers,
    title: 'Build your scene',
    description: 'Layer images, videos, and transparent WebM overlays on a flexible canvas. Position, resize, and stack elements to create realistic training environments.',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
  },
  {
    n: '02',
    icon: Zap,
    title: 'Define events',
    description: 'Create triggers that change the scene — add fire spread, reveal casualties, update weather conditions. Each event is a button press away.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20',
  },
  {
    n: '03',
    icon: Play,
    title: 'Go live',
    description: 'Present to your team and trigger events in real-time. Everyone sees the scene evolve simultaneously as you control the narrative.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20',
  },
  {
    n: '04',
    icon: Sparkles,
    title: 'Debrief',
    description: 'Review decisions with AI-powered analysis. Understand how your team responded to each event and identify areas for improvement.',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    borderColor: 'border-violet-500/20',
  },
]

const FEATURES = [
  {
    icon: Layers,
    title: 'Layer-based canvas',
    description: 'Stack images, videos, and transparent WebM overlays to build complex, realistic scenes. Full control over z-order, opacity, and positioning.',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    borderHover: 'hover:border-red-500/20',
    barColor: '#dc2626',
  },
  {
    icon: MousePointerClick,
    title: 'Event triggers',
    description: 'Create manual buttons that control scene changes — reveal fire spread, introduce casualties, change conditions. One click, instant transformation.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    borderHover: 'hover:border-amber-500/20',
    barColor: '#f59e0b',
  },
  {
    icon: Eye,
    title: 'Live audience view',
    description: 'Everyone sees the scene evolve in real-time. No refreshing, no delays. Your team experiences the scenario together as it unfolds.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    borderHover: 'hover:border-emerald-500/20',
    barColor: '#10b981',
  },
  {
    icon: Monitor,
    title: 'CSS transitions',
    description: 'Smooth fade, move, and resize animations bring your scenarios to life. Elements transition naturally between states for maximum realism.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    borderHover: 'hover:border-blue-500/20',
    barColor: '#3b82f6',
  },
  {
    icon: Vote,
    title: 'Optional voting',
    description: 'Let your audience vote on what happens next. Collaborative decision-making adds engagement and reveals team thinking in real-time.',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    borderHover: 'hover:border-violet-500/20',
    barColor: '#8b5cf6',
  },
  {
    icon: Sparkles,
    title: 'AI analysis',
    description: 'Post-scenario decision review powered by AI. Get automatic summaries, timeline analysis, and actionable recommendations for your team.',
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
    borderHover: 'hover:border-sky-500/20',
    barColor: '#0ea5e9',
  },
]

const USE_CASES = [
  {
    icon: Flame,
    title: 'Fire & Rescue',
    description: 'Building fire scenarios with smoke and fire overlays. Progress from initial report through escalation, rescue, and containment phases.',
    color: '#f97316',
    bg: 'bg-orange-500/10',
    text: 'text-orange-400',
  },
  {
    icon: Shield,
    title: 'Police',
    description: 'Crime scene reconstruction and decision training. Walk your team through evolving situations where every choice matters.',
    color: '#3b82f6',
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
  },
  {
    icon: Siren,
    title: 'Ambulance',
    description: 'Patient assessment scenarios with evolving symptoms. Layer vital signs, injury overlays, and environmental conditions.',
    color: '#10b981',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
  },
  {
    icon: Target,
    title: 'Armed Forces',
    description: 'Tactical situation awareness training. Build evolving battlefield conditions with terrain, assets, and threat overlays.',
    color: '#64748b',
    bg: 'bg-slate-500/10',
    text: 'text-slate-400',
  },
]

/* ── PAGE ── */

export default function CommandStudioPage() {
  return (
    <PublicLayout>
      {/* ═══════════════════════════════════════════
          HERO
          ═══════════════════════════════════════════ */}
      <section className="relative min-h-[90vh] flex flex-col bg-[#07070a] overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_140%_70%_at_50%_-20%,rgba(220,38,38,0.25),transparent_65%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_30%_20%,rgba(220,38,38,0.12),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_75%_15%,rgba(249,115,22,0.08),transparent_50%)]" />
          {/* Grid texture */}
          <div
            className="absolute inset-0 opacity-[0.10]"
            style={{
              backgroundImage: 'linear-gradient(rgba(220,38,38,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,0.4) 1px, transparent 1px)',
              backgroundSize: '56px 56px',
              maskImage: 'radial-gradient(ellipse 100% 80% at 50% 40%, black 20%, transparent 80%)',
              WebkitMaskImage: 'radial-gradient(ellipse 100% 80% at 50% 40%, black 20%, transparent 80%)',
            }}
          />
          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#07070a] via-[#07070a]/80 to-transparent" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center max-w-4xl mx-auto px-5 pt-32 pb-8">
          {/* Badge */}
          <div className="hero-fade-up hero-fade-up-1 inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] uppercase tracking-[0.15em] text-white/50 mb-8 font-medium">
            <Monitor className="w-3.5 h-3.5 text-red-400" />
            Command Studio
          </div>

          {/* Heading */}
          <h1 className="hero-fade-up hero-fade-up-2 text-[clamp(2.2rem,6.5vw,4.2rem)] font-bold tracking-tight leading-[1.08] text-white mb-6">
            Interactive scenarios that{' '}
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-red-400 via-red-500 to-orange-500 gradient-text">bring training to life.</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-fade-up hero-fade-up-3 text-base md:text-lg text-white/40 max-w-2xl leading-relaxed mb-10">
            Build live, evolving scenes for emergency services training. Layer images and videos on a canvas,
            define event triggers, and control the narrative in real-time while your team watches the scenario unfold.
          </p>

          {/* CTAs */}
          <div className="hero-fade-up hero-fade-up-4 flex flex-col sm:flex-row items-center gap-3">
            <Link href="/register" className="group inline-flex items-center gap-2 px-7 h-12 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-500 transition-all duration-200 hover:shadow-lg hover:shadow-red-500/25 cursor-pointer">
              Start free trial <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a href="#how-it-works" className="inline-flex items-center gap-2 px-7 h-12 rounded-xl text-sm font-medium border border-white/[0.1] text-white/60 hover:text-white hover:border-white/[0.2] hover:bg-white/[0.03] transition-all duration-200 cursor-pointer">
              See how it works
            </a>
          </div>
        </div>

        {/* Mockup: Building with fire overlays */}
        <div className="relative z-10 mx-auto max-w-3xl w-full px-5 mt-8 mb-[-80px] hero-fade-up hero-fade-up-5">
          <div className="absolute inset-0 -m-16 pointer-events-none">
            <div className="absolute inset-0 bg-red-500/[0.12] blur-[100px] rounded-full" />
          </div>
          <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.03] overflow-hidden shadow-2xl shadow-black/40 backdrop-blur-sm">
            {/* Title bar */}
            <div className="px-4 py-2.5 border-b border-white/[0.06] flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
              </div>
              <span className="text-[10px] text-white/30 font-medium ml-2">Command Studio — Building Fire Scenario</span>
            </div>
            {/* Canvas mockup */}
            <div className="relative h-[280px] md:h-[340px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
              {/* Background building */}
              <div className="absolute inset-4 rounded-lg bg-gradient-to-b from-slate-700 to-slate-800 border border-white/[0.05]">
                {/* Windows grid */}
                <div className="grid grid-cols-6 gap-2 p-4 pt-8">
                  {Array.from({ length: 18 }).map((_, i) => (
                    <div key={i} className={`aspect-[3/4] rounded-sm ${
                      i >= 12 ? 'bg-amber-400/40' : i >= 6 ? 'bg-sky-300/10' : 'bg-sky-300/20'
                    }`} />
                  ))}
                </div>
                {/* Building label */}
                <div className="absolute bottom-3 left-4 text-[9px] text-white/20 uppercase tracking-wider">Commercial Building — 3 floors</div>
              </div>
              {/* Fire overlay layer */}
              <div className="absolute bottom-4 left-4 right-[40%] h-[40%] rounded-lg bg-gradient-to-t from-orange-500/30 via-red-500/20 to-transparent border border-orange-500/20 flex items-end p-2">
                <span className="text-[8px] text-orange-300/70 uppercase tracking-wider font-medium">Fire — Ground Floor</span>
              </div>
              {/* Smoke overlay */}
              <div className="absolute top-4 left-[20%] right-[30%] h-[30%] rounded-lg bg-gradient-to-b from-white/10 via-white/5 to-transparent border border-white/[0.06] flex items-start p-2">
                <span className="text-[8px] text-white/30 uppercase tracking-wider font-medium">Smoke Plume</span>
              </div>
              {/* Layer indicators */}
              <div className="absolute top-3 right-3 space-y-1.5">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-black/40 backdrop-blur-sm border border-white/[0.08]">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[8px] text-white/50">Layer 3: Smoke</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-black/40 backdrop-blur-sm border border-white/[0.08]">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                  <span className="text-[8px] text-white/50">Layer 2: Fire</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-black/40 backdrop-blur-sm border border-white/[0.08]">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span className="text-[8px] text-white/50">Layer 1: Building</span>
                </div>
              </div>
              {/* Event trigger buttons */}
              <div className="absolute bottom-3 right-3 flex gap-1.5">
                <div className="px-2.5 py-1 rounded-md bg-red-500/20 border border-red-500/30 text-[8px] text-red-300 font-medium">Spread Fire</div>
                <div className="px-2.5 py-1 rounded-md bg-amber-500/20 border border-amber-500/30 text-[8px] text-amber-300 font-medium">Add Casualties</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spacer for mockup overlap */}
      <div className="h-24 bg-[#07070a]" />

      {/* ═══════════════════════════════════════════
          HOW IT WORKS
          ═══════════════════════════════════════════ */}
      <section id="how-it-works" className="bg-[#07070a] border-t border-white/[0.04] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-red-500/[0.04] blur-[120px] rounded-full" />
        </div>
        <div className="relative max-w-5xl mx-auto px-5 py-20 md:py-28">
          <ScrollReveal className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] text-white/40 text-[10px] uppercase tracking-[0.15em] font-medium border border-white/[0.08]">How It Works</span>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mt-5 text-white">Four steps to immersive training</h2>
            <p className="text-white/35 mt-4 max-w-lg mx-auto text-sm">From scene creation to AI-powered debrief, Command Studio covers the full training lifecycle.</p>
          </ScrollReveal>

          <ScrollReveal stagger>
            <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {STEPS.map((step, i) => (
                <div key={step.n} className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 [box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.03)_inset] hover:-translate-y-0.5 transition-all duration-300 group">
                  <div className="relative mb-4">
                    <div className={`w-12 h-12 rounded-xl ${step.bg} border ${step.borderColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <step.icon className={`w-5 h-5 ${step.color}`} />
                    </div>
                    <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">{i + 1}</div>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${step.bg} ${step.color} text-[9px] uppercase tracking-[0.15em] font-semibold border ${step.borderColor} mb-3`}>Step {step.n}</span>
                  <h3 className="text-sm font-bold text-white mt-2 mb-2">{step.title}</h3>
                  <p className="text-white/35 text-xs leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          KEY FEATURES
          ═══════════════════════════════════════════ */}
      <section className="bg-background border-t border-border/50 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none dark:block hidden">
          <div className="absolute top-0 left-1/4 w-[500px] h-[400px] bg-red-500/[0.03] blur-[120px] rounded-full" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-blue-500/[0.03] blur-[100px] rounded-full" />
        </div>
        <div className="max-w-5xl mx-auto px-5 py-20 md:py-28">
          <ScrollReveal className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] uppercase tracking-[0.15em] font-medium border border-primary/20">Key Features</span>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mt-5">Everything you need for scenario training</h2>
            <p className="text-muted-foreground mt-4 max-w-lg mx-auto text-sm">Powerful tools designed to make immersive training accessible to every team.</p>
          </ScrollReveal>

          <ScrollReveal stagger>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className={`group relative flex flex-col overflow-hidden rounded-2xl p-5 border border-white/[0.06] bg-white/[0.02] dark:bg-white/[0.02] ${f.borderHover} hover:bg-white/[0.04] transition-all duration-300 hover:-translate-y-0.5 cursor-default [box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.03)_inset]`}
                >
                  <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-3xl pointer-events-none" style={{ backgroundColor: `${f.barColor}10` }} />
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className={`w-8 h-8 rounded-lg ${f.bg} border border-white/[0.08] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      <f.icon className={`w-3.5 h-3.5 ${f.color}`} />
                    </div>
                    <span className={`text-[9px] uppercase tracking-[0.15em] font-semibold ${f.color}`}>{f.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
                  {/* Mini visual bar */}
                  <div className="mt-auto pt-4 flex items-center gap-1.5">
                    {[40, 65, 25, 80, 50].map((w, i) => (
                      <div key={i} className="h-1 rounded-full bg-white/[0.06] flex-1">
                        <div className="h-full rounded-full transition-all duration-700 group-hover:opacity-100 opacity-40" style={{ width: `${w}%`, backgroundColor: f.barColor }} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          USE CASES
          ═══════════════════════════════════════════ */}
      <section className="bg-muted/30 dark:bg-muted/10 border-t border-border/50 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none dark:block hidden">
          <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-orange-500/[0.03] blur-[150px] rounded-full" />
        </div>
        <div className="max-w-5xl mx-auto px-5 py-20 md:py-28">
          <ScrollReveal className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] uppercase tracking-[0.15em] font-medium border border-primary/20">Use Cases</span>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mt-5">Built for every emergency service</h2>
            <p className="text-muted-foreground mt-4 max-w-lg mx-auto text-sm">Realistic scenario training tailored to operational needs.</p>
          </ScrollReveal>

          <ScrollReveal stagger>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {USE_CASES.map((uc) => (
                <div key={uc.title} className="group relative rounded-2xl border border-border/60 bg-card/50 p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 [box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.02)_inset] overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `linear-gradient(90deg, transparent, ${uc.color}50, transparent)` }} />
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl ${uc.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      <uc.icon className={`w-4.5 h-4.5 ${uc.text}`} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold mb-1.5">{uc.title}</h3>
                      <p className="text-muted-foreground text-xs leading-relaxed">{uc.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          EDITOR MOCKUP
          ═══════════════════════════════════════════ */}
      <section className="relative bg-[#07070a] border-t border-white/[0.04] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(220,38,38,0.06),transparent)]" />
        </div>
        <div className="relative max-w-5xl mx-auto px-5 py-20 md:py-28">
          <ScrollReveal className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] text-white/40 text-[10px] uppercase tracking-[0.15em] font-medium border border-white/[0.08]">The Editor</span>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mt-5 text-white">A purpose-built scenario editor</h2>
            <p className="text-white/35 mt-4 max-w-lg mx-auto text-sm">Everything in one view — your media gallery, canvas, properties panel, and event timeline.</p>
          </ScrollReveal>

          <ScrollReveal>
            <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden shadow-2xl shadow-black/30">
              {/* Editor title bar */}
              <div className="px-4 py-2.5 border-b border-white/[0.06] flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
                </div>
                <span className="text-[10px] text-white/30 font-medium ml-2">Command Studio Editor</span>
                <div className="ml-auto flex gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-[8px] text-emerald-300 font-medium">Saved</span>
                  <span className="px-2 py-0.5 rounded bg-red-500/20 text-[8px] text-red-300 font-medium">Go Live</span>
                </div>
              </div>

              {/* Editor layout */}
              <div className="flex min-h-[350px] md:min-h-[420px]">
                {/* Left: Gallery */}
                <div className="w-[180px] shrink-0 border-r border-white/[0.06] p-3 hidden md:block">
                  <div className="text-[9px] text-white/30 uppercase tracking-wider font-medium mb-3">Media Gallery</div>
                  <div className="space-y-2">
                    {['Building.jpg', 'Fire_overlay.webm', 'Smoke_effect.webm', 'Casualties.png', 'Weather_rain.webm', 'Crowd.png'].map((file, i) => (
                      <div key={file} className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-white/[0.03] border border-white/[0.05] hover:border-white/[0.1] transition-colors cursor-default">
                        {file.endsWith('.webm') ? (
                          <Video className="w-3 h-3 text-amber-400/60" />
                        ) : (
                          <Image className="w-3 h-3 text-blue-400/60" />
                        )}
                        <span className="text-[9px] text-white/40 truncate">{file}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Center: Canvas */}
                <div className="flex-1 relative bg-gradient-to-br from-slate-900/50 to-slate-800/50 flex items-center justify-center">
                  <div className="absolute inset-0 opacity-[0.06]" style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                  }} />
                  {/* Canvas elements */}
                  <div className="relative w-[85%] h-[75%] rounded-lg border border-white/[0.08] bg-slate-800/50 overflow-hidden">
                    {/* Building base */}
                    <div className="absolute inset-2 rounded bg-gradient-to-b from-slate-600/30 to-slate-700/30 border border-white/[0.04]" />
                    {/* Fire overlay - selected */}
                    <div className="absolute bottom-2 left-2 right-[50%] h-[35%] rounded bg-orange-500/20 border-2 border-dashed border-orange-400/50">
                      <div className="absolute -top-5 left-0 text-[7px] text-orange-300/60 uppercase tracking-wider">Fire Overlay (selected)</div>
                      {/* Resize handles */}
                      <div className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-orange-400 border border-white/30" />
                      <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-orange-400 border border-white/30" />
                      <div className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-orange-400 border border-white/30" />
                      <div className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-orange-400 border border-white/30" />
                    </div>
                    {/* Canvas label */}
                    <div className="absolute bottom-1.5 right-2 text-[7px] text-white/15">1920 x 1080</div>
                  </div>
                </div>

                {/* Right: Properties */}
                <div className="w-[180px] shrink-0 border-l border-white/[0.06] p-3 hidden md:block">
                  <div className="text-[9px] text-white/30 uppercase tracking-wider font-medium mb-3">Properties</div>
                  <div className="space-y-3">
                    {[
                      { label: 'X Position', value: '120 px' },
                      { label: 'Y Position', value: '340 px' },
                      { label: 'Width', value: '680 px' },
                      { label: 'Height', value: '280 px' },
                      { label: 'Opacity', value: '85%' },
                      { label: 'Z-Index', value: '2' },
                    ].map((prop) => (
                      <div key={prop.label}>
                        <div className="text-[8px] text-white/25 mb-1">{prop.label}</div>
                        <div className="px-2 py-1 rounded bg-white/[0.04] border border-white/[0.06] text-[9px] text-white/50">{prop.value}</div>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-white/[0.06]">
                      <div className="text-[8px] text-white/25 mb-1.5">Transition</div>
                      <div className="px-2 py-1 rounded bg-white/[0.04] border border-white/[0.06] text-[9px] text-white/50">Fade In — 0.8s ease</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom: Events Timeline */}
              <div className="border-t border-white/[0.06] px-4 py-3">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[9px] text-white/30 uppercase tracking-wider font-medium">Event Timeline</span>
                  <div className="flex-1 h-px bg-white/[0.04]" />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {[
                    { label: 'Initial Scene', active: true, color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
                    { label: 'Fire Starts', active: false, color: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
                    { label: 'Fire Spreads', active: false, color: 'bg-red-500/20 text-red-300 border-red-500/30' },
                    { label: 'Casualties Found', active: false, color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
                    { label: 'Evacuation', active: false, color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
                  ].map((evt) => (
                    <div key={evt.label} className="flex items-center gap-1.5">
                      <div className={`px-2.5 py-1 rounded-md border text-[8px] font-medium whitespace-nowrap ${evt.color} ${evt.active ? 'ring-1 ring-emerald-400/30' : ''}`}>
                        {evt.active && <span className="inline-block w-1 h-1 rounded-full bg-emerald-400 mr-1" />}
                        {evt.label}
                      </div>
                      {evt.label !== 'Evacuation' && <ChevronRight className="w-3 h-3 text-white/15 shrink-0" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA
          ═══════════════════════════════════════════ */}
      <section className="relative bg-[#07070a] overflow-hidden border-t border-white/[0.04]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(220,38,38,0.18),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(220,38,38,0.08),transparent)]" />
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
        </div>
        <div className="relative max-w-3xl mx-auto px-5 py-24 md:py-32 text-center">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] uppercase tracking-[0.15em] text-white/40 font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 pulse-dot" />
              Get started today
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
              Ready to build your{' '}
              <span className="bg-gradient-to-r from-red-400 to-orange-500 gradient-text">first scenario?</span>
            </h2>
            <p className="text-white/35 text-base md:text-lg mb-10 max-w-lg mx-auto">
              Free for 30 days. No credit card required. Start creating immersive training scenarios in minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/register" className="group inline-flex items-center gap-2 px-8 h-13 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-500 transition-all duration-200 hover:shadow-lg hover:shadow-red-500/25 cursor-pointer">
                Start free trial <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 px-8 h-13 rounded-xl text-sm font-medium border border-white/[0.1] text-white/60 hover:text-white hover:border-white/[0.2] transition-all duration-200 cursor-pointer">
                Book a demo
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </PublicLayout>
  )
}
