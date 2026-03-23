import { PublicLayout } from '@/components/layout/PublicLayout'
import { Target, Heart, Zap, ArrowRight, Flame, Shield, Siren, Anchor, Search, Lock, Building2, Radio, Users } from 'lucide-react'
import { JoinCodeInput } from '@/components/join/JoinCodeInput'
import { ScrollReveal } from '@/components/home/ScrollReveal'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About — Command 360',
  description: 'Learn about Command 360 and our mission to improve emergency services training.',
}

/* ── DATA ── */

const STATS = [
  { number: '11+', label: 'Services Supported', gradient: 'from-red-400 to-orange-500', glow: 'rgba(220,38,38,0.15)' },
  { number: '8', label: 'Slide Types', gradient: 'from-blue-400 to-cyan-400', glow: 'rgba(59,130,246,0.15)' },
  { number: '∞', label: 'Real-time Results', gradient: 'from-emerald-400 to-teal-400', glow: 'rgba(16,185,129,0.15)' },
  { number: 'UK', label: 'Wide Coverage', gradient: 'from-violet-400 to-purple-400', glow: 'rgba(139,92,246,0.15)' },
]

const VALUES = [
  {
    icon: Target,
    title: 'Purpose-built',
    description: 'Every feature is designed specifically for emergency services training needs — from safety briefings to incident debriefs.',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    borderHover: 'hover:border-red-500/20',
    barColor: '#dc2626',
    glowColor: 'rgba(220,38,38,0.06)',
  },
  {
    icon: Heart,
    title: 'People-first',
    description: 'We believe better training leads to better outcomes. Our platform helps teams learn together, not just listen.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    borderHover: 'hover:border-emerald-500/20',
    barColor: '#10b981',
    glowColor: 'rgba(16,185,129,0.06)',
  },
  {
    icon: Zap,
    title: 'Simple by design',
    description: 'Training facilitators should focus on content, not technology. Command 360 is intuitive for presenters and participants alike.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    borderHover: 'hover:border-amber-500/20',
    barColor: '#f59e0b',
    glowColor: 'rgba(245,158,11,0.06)',
  },
]

const SERVICES = [
  { icon: Flame, label: 'Fire & Rescue Services', color: '#f97316', bg: 'bg-orange-500/10', text: 'text-orange-400' },
  { icon: Shield, label: 'Police Forces', color: '#3b82f6', bg: 'bg-blue-500/10', text: 'text-blue-400' },
  { icon: Siren, label: 'Ambulance Trusts', color: '#10b981', bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  { icon: Target, label: 'Armed Forces', color: '#64748b', bg: 'bg-slate-500/10', text: 'text-slate-400' },
  { icon: Anchor, label: 'HM Coastguard', color: '#0ea5e9', bg: 'bg-sky-500/10', text: 'text-sky-400' },
  { icon: Search, label: 'Search & Rescue', color: '#f59e0b', bg: 'bg-amber-500/10', text: 'text-amber-400' },
  { icon: Lock, label: 'Prison & Probation', color: '#71717a', bg: 'bg-zinc-500/10', text: 'text-zinc-400' },
  { icon: Building2, label: 'Local Authority Emergency Planning', color: '#8b5cf6', bg: 'bg-violet-500/10', text: 'text-violet-400' },
  { icon: Radio, label: 'Civil Contingencies Teams', color: '#ef4444', bg: 'bg-red-500/10', text: 'text-red-400' },
  { icon: Users, label: 'NHS Emergency Departments', color: '#ec4899', bg: 'bg-pink-500/10', text: 'text-pink-400' },
]

/* ── PAGE ── */

export default function AboutPage() {
  return (
    <PublicLayout>
      {/* ═══════════════════════════════════════════
          HERO — Dark
          ═══════════════════════════════════════════ */}
      <section className="relative bg-[#07070a] overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_140%_70%_at_50%_-20%,rgba(220,38,38,0.25),transparent_65%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_60%_at_30%_10%,rgba(220,38,38,0.12),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_75%_15%,rgba(249,115,22,0.08),transparent_50%)]" />
          {/* Grid — red-tinted */}
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
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#07070a] via-[#07070a]/80 to-transparent" />
        </div>

        <div className="relative max-w-6xl mx-auto px-5 pt-32 pb-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left — text */}
            <div className="text-center md:text-left">
              <ScrollReveal>
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] uppercase tracking-[0.15em] text-white/50 mb-8 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 pulse-dot" />
                  About Us
                </div>
                <h1 className="text-[clamp(2rem,5.5vw,3.5rem)] font-bold tracking-tight leading-[1.1] text-white mb-6">
                  Making emergency services training{' '}
                  <span className="bg-gradient-to-r from-red-400 via-red-500 to-orange-500 gradient-text">interactive</span>
                </h1>
                <p className="text-base md:text-lg text-white/40 leading-relaxed max-w-xl">
                  Command 360 was built with one goal: to help emergency services teams run better, more engaging training sessions that improve knowledge retention and save lives.
                </p>
              </ScrollReveal>
            </div>

            {/* Right — CSS mockup: team collaboration card */}
            <ScrollReveal direction="right" className="hidden md:block">
              <div className="relative">
                <div className="absolute -inset-4 bg-red-500/[0.06] blur-[40px] rounded-full pointer-events-none" />
                <div className="relative rounded-2xl border border-white/[0.08] bg-[#0c0c10] p-5 shadow-2xl shadow-black/40 [box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.03)_inset]">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Live Session</span>
                    </div>
                    <span className="text-[10px] text-white/25 font-mono">Room: 482 917</span>
                  </div>

                  {/* Avatars row */}
                  <div className="flex items-center gap-1.5 mb-5">
                    {['bg-red-500', 'bg-blue-500', 'bg-amber-500', 'bg-emerald-500', 'bg-violet-500', 'bg-sky-500'].map((color, i) => (
                      <div key={i} className={`w-7 h-7 rounded-full ${color} border-2 border-[#0c0c10] flex items-center justify-center text-[9px] font-bold text-white ${i > 0 ? '-ml-2' : ''}`}>
                        {['JD', 'SM', 'KL', 'AR', 'PB', 'TC'][i]}
                      </div>
                    ))}
                    <span className="text-[10px] text-white/30 ml-2">+18 participants</span>
                  </div>

                  {/* Poll question */}
                  <p className="text-white/80 text-xs font-medium mb-3">Which protocol applies to this scenario?</p>

                  {/* Poll bars */}
                  <div className="space-y-2 mb-4">
                    {[
                      { label: 'Protocol Alpha', pct: 62, color: 'bg-red-500' },
                      { label: 'Protocol Bravo', pct: 24, color: 'bg-white/20' },
                      { label: 'Protocol Charlie', pct: 14, color: 'bg-white/20' },
                    ].map((bar) => (
                      <div key={bar.label}>
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[10px] text-white/50">{bar.label}</span>
                          <span className="text-[10px] font-semibold text-white/70">{bar.pct}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                          <div className={`h-full rounded-full ${bar.color}`} style={{ width: `${bar.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                    <span className="text-[10px] text-white/25">24 of 24 responded</span>
                    <span className="px-2.5 py-1 rounded-md bg-red-500/15 text-red-400 text-[9px] font-semibold uppercase tracking-wider">Live Poll</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          OUR STORY
          ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-t border-border/50 bg-background">
        {/* Dark mode blur orbs */}
        <div className="absolute inset-0 pointer-events-none dark:block hidden">
          <div className="absolute top-0 left-1/4 w-[500px] h-[400px] bg-red-500/[0.03] blur-[120px] rounded-full" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-blue-500/[0.03] blur-[100px] rounded-full" />
        </div>

        <div className="relative max-w-5xl mx-auto px-5 py-24">
          <ScrollReveal direction="left">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left — text */}
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] uppercase tracking-[0.15em] font-medium border border-primary/20">Our Story</span>
                <h2 className="text-2xl md:text-4xl font-bold tracking-tight mt-5 mb-5">Born from a need for better training</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Emergency services training has long relied on static slideshows and one-way lectures. Trainers knew their teams were disengaged, but had no tools purpose-built for their world.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Command 360 was created to change that. We set out to build an interactive platform that makes every training session a two-way conversation — where every crew member has a voice, and facilitators get instant insight into what their teams actually know.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  From fire station watch-room briefings to multi-agency exercises, Command 360 turns passive audiences into active participants.
                </p>
              </div>

              {/* Right — before/after mockup */}
              <div className="space-y-4">
                {/* Before card */}
                <div className="rounded-2xl border border-border/60 bg-card/50 p-5 [box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.03)_inset] hover:-translate-y-0.5 transition-all duration-300">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/40" />
                    <span className="text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Before</span>
                  </div>
                  <div className="rounded-lg bg-muted/50 dark:bg-white/[0.02] p-4 space-y-2.5">
                    <div className="h-3 rounded bg-muted-foreground/10 w-3/4" />
                    <div className="h-3 rounded bg-muted-foreground/10 w-full" />
                    <div className="h-3 rounded bg-muted-foreground/10 w-5/6" />
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
                      <div className="w-8 h-5 rounded bg-muted-foreground/10" />
                      <div className="w-8 h-5 rounded bg-muted-foreground/10" />
                      <span className="text-[9px] text-muted-foreground/40 ml-auto">Slide 14 of 47</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground/50 mt-2 text-center">Static slideshow — no interaction</p>
                </div>

                {/* After card */}
                <div className="rounded-2xl border border-primary/20 bg-card/50 p-5 shadow-lg shadow-primary/5 [box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.03)_inset] hover:-translate-y-0.5 transition-all duration-300">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">After — Command 360</span>
                  </div>
                  <div className="rounded-lg bg-muted/50 dark:bg-white/[0.02] p-4">
                    <p className="text-xs font-medium text-foreground mb-2">What is your confidence level?</p>
                    <div className="space-y-1.5">
                      {[
                        { label: 'Very confident', pct: 45, color: 'bg-emerald-500' },
                        { label: 'Somewhat', pct: 35, color: 'bg-amber-500' },
                        { label: 'Need more training', pct: 20, color: 'bg-red-500' },
                      ].map((bar) => (
                        <div key={bar.label} className="flex items-center gap-2">
                          <span className="text-[9px] text-muted-foreground w-24 shrink-0">{bar.label}</span>
                          <div className="flex-1 h-2 rounded-full bg-muted dark:bg-white/[0.06] overflow-hidden">
                            <div className={`h-full rounded-full ${bar.color}`} style={{ width: `${bar.pct}%` }} />
                          </div>
                          <span className="text-[9px] font-semibold text-foreground w-6 text-right">{bar.pct}%</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-border/50">
                      <span className="text-[9px] text-muted-foreground">16 responses</span>
                      <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[8px] font-semibold ml-auto">LIVE</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-primary/70 mt-2 text-center font-medium">Real-time engagement from every participant</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          STATS STRIP — Dark
          ═══════════════════════════════════════════ */}
      <section className="relative bg-[#07070a] overflow-hidden border-t border-white/[0.04]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[250px] bg-red-500/[0.06] blur-[120px] rounded-full" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        </div>
        <ScrollReveal direction="up">
          <div className="relative max-w-5xl mx-auto px-5 py-20 grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="group text-center p-6 md:p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] [box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.03)_inset] hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden">
                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-px opacity-40" style={{ background: `linear-gradient(90deg, transparent 10%, ${stat.glow} 50%, transparent 90%)` }} />
                {/* Hover glow */}
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-3xl pointer-events-none" style={{ backgroundColor: stat.glow }} />
                <div className={`text-3xl md:text-5xl font-bold tracking-tight bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2`}>
                  {stat.number}
                </div>
                <div className="text-sm text-white/40 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ═══════════════════════════════════════════
          VALUES
          ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-t border-border/50 bg-background">
        {/* Dark mode blur orbs */}
        <div className="absolute inset-0 pointer-events-none dark:block hidden">
          <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-red-500/[0.03] blur-[150px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/[0.02] blur-[120px] rounded-full" />
        </div>

        <div className="relative max-w-5xl mx-auto px-5 py-24">
          <ScrollReveal className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] uppercase tracking-[0.15em] font-medium border border-primary/20">Our Values</span>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mt-5">What drives us</h2>
            <p className="text-muted-foreground mt-4 max-w-lg mx-auto text-sm">Three core principles that shape every feature we build.</p>
          </ScrollReveal>

          <ScrollReveal stagger>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {VALUES.map((v) => (
                <div
                  key={v.title}
                  className={`group relative flex flex-col overflow-hidden rounded-2xl p-6 md:p-8 border border-border/60 dark:border-white/[0.06] bg-card/50 dark:bg-white/[0.02] ${v.borderHover} hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-default [box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.03)_inset]`}
                >
                  {/* Color accent line at top */}
                  <div className="absolute top-0 left-0 right-0 h-px opacity-40" style={{ background: `linear-gradient(90deg, transparent 10%, ${v.barColor}40 50%, transparent 90%)` }} />
                  {/* Corner glow on hover */}
                  <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-3xl pointer-events-none" style={{ backgroundColor: v.glowColor }} />

                  <div className="flex items-center gap-2.5 mb-4">
                    <div className={`w-10 h-10 rounded-xl ${v.bg} border border-white/[0.06] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      <v.icon className={`w-5 h-5 ${v.color}`} />
                    </div>
                    <span className={`text-[9px] uppercase tracking-[0.15em] font-semibold ${v.color}`}>{v.title}</span>
                  </div>
                  <h3 className="font-bold text-foreground text-lg mb-2">{v.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{v.description}</p>

                  {/* Mini visual bars */}
                  <div className="mt-auto flex items-center gap-1.5">
                    {[40, 65, 25, 80, 50].map((w, i) => (
                      <div key={i} className="h-1 rounded-full bg-muted dark:bg-white/[0.06] flex-1">
                        <div className="h-full rounded-full transition-all duration-700 group-hover:opacity-100 opacity-40" style={{ width: `${w}%`, backgroundColor: v.barColor }} />
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
          WHO WE SERVE
          ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-t border-border/50 bg-muted/30 dark:bg-muted/10">
        {/* Dark mode blur orbs */}
        <div className="absolute inset-0 pointer-events-none dark:block hidden">
          <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-orange-500/[0.03] blur-[150px] rounded-full" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/[0.02] blur-[120px] rounded-full" />
        </div>

        <div className="relative max-w-5xl mx-auto px-5 py-24">
          <ScrollReveal className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] uppercase tracking-[0.15em] font-medium border border-primary/20">Who We Serve</span>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mt-5">Built for those who protect us</h2>
            <p className="text-muted-foreground mt-4 max-w-lg mx-auto text-sm">Command 360 serves training teams across the UK emergency services sector.</p>
          </ScrollReveal>

          <ScrollReveal stagger>
            <div className="flex flex-wrap justify-center gap-3">
              {SERVICES.map((service) => (
                <div
                  key={service.label}
                  className="group relative overflow-hidden p-5 rounded-2xl border border-border/60 dark:border-white/[0.06] bg-card/50 dark:bg-white/[0.02] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 [box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.02)_inset] w-full sm:w-[calc(50%-6px)] md:w-[calc(33.333%-8px)]"
                >
                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `linear-gradient(90deg, transparent, ${service.color}50, transparent)` }} />
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl ${service.bg} border border-white/[0.06] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      <service.icon className={`w-4 h-4 ${service.text}`} />
                    </div>
                    <span className="text-sm font-semibold text-foreground">{service.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          MISSION — Dark
          ═══════════════════════════════════════════ */}
      <section className="relative bg-[#07070a] overflow-hidden border-t border-white/[0.04]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(220,38,38,0.08),transparent)]" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
              backgroundSize: '64px 64px',
            }}
          />
        </div>
        <div className="relative max-w-5xl mx-auto px-5 py-24">
          <ScrollReveal direction="up">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left — text */}
              <div className="text-center md:text-left">
                <span className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] uppercase tracking-[0.15em] text-white/50 mb-6 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 pulse-dot" />
                  Our Mission
                </span>
                <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white mb-5">
                  Making training{' '}
                  <span className="bg-gradient-to-r from-red-400 via-red-500 to-orange-500 gradient-text">engaging</span>
                </h2>
                <p className="text-white/40 leading-relaxed mb-4">
                  We believe that when training is interactive, people pay attention. When people pay attention, they learn. And when emergency responders learn better, communities are safer.
                </p>
                <p className="text-white/40 leading-relaxed">
                  Our mission is to replace one-way lectures with two-way conversations — giving every crew member a voice and every trainer instant insight into team readiness.
                </p>
              </div>

              {/* Right — CSS mockup: quiz / word cloud interaction */}
              <div className="relative">
                <div className="absolute -inset-4 bg-red-500/[0.04] blur-[40px] rounded-full pointer-events-none" />
                <div className="relative rounded-2xl border border-white/[0.08] bg-[#0c0c10] p-5 shadow-2xl shadow-black/40 [box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.03)_inset]">
                  {/* Quiz header */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-1 rounded-md bg-violet-500/15 text-violet-400 text-[9px] font-semibold uppercase tracking-wider">Quiz</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center">
                        <span className="text-[8px] font-bold text-amber-400">15</span>
                      </div>
                      <span className="text-[9px] text-white/25">seconds left</span>
                    </div>
                  </div>

                  <p className="text-white/80 text-xs font-medium mb-3">What is the correct order of JESIP principles?</p>

                  {/* Quiz options */}
                  <div className="space-y-2 mb-5">
                    {[
                      { label: 'Co-locate, Communicate, Co-ordinate, Joint understanding, Shared SA', correct: true },
                      { label: 'Communicate, Collaborate, Command, Control, Co-ordinate', correct: false },
                      { label: 'Assess, Communicate, Command, Co-ordinate, Control', correct: false },
                    ].map((opt, i) => (
                      <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${opt.correct ? 'border-emerald-500/30 bg-emerald-500/[0.08]' : 'border-white/[0.06] bg-white/[0.02]'}`}>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${opt.correct ? 'border-emerald-500 bg-emerald-500' : 'border-white/15'}`}>
                          {opt.correct && <span className="text-[8px] text-white font-bold">&#10003;</span>}
                        </div>
                        <span className={`text-[10px] ${opt.correct ? 'text-emerald-400' : 'text-white/40'}`}>{opt.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-white/[0.06] pt-4 mb-3">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2.5 py-1 rounded-md bg-sky-500/15 text-sky-400 text-[9px] font-semibold uppercase tracking-wider">Word Cloud</span>
                    </div>
                  </div>

                  {/* Word cloud mockup */}
                  <div className="flex flex-wrap items-center justify-center gap-1.5 py-2">
                    {[
                      { word: 'Teamwork', size: 'text-sm font-bold', color: 'text-red-400' },
                      { word: 'Communication', size: 'text-base font-bold', color: 'text-white/80' },
                      { word: 'Safety', size: 'text-lg font-bold', color: 'text-red-500' },
                      { word: 'Leadership', size: 'text-xs', color: 'text-white/40' },
                      { word: 'Protocol', size: 'text-sm', color: 'text-amber-400/70' },
                      { word: 'Resilience', size: 'text-xs font-semibold', color: 'text-sky-400/60' },
                      { word: 'Training', size: 'text-sm font-bold', color: 'text-emerald-400/70' },
                      { word: 'Response', size: 'text-xs', color: 'text-violet-400/60' },
                      { word: 'Command', size: 'text-sm font-semibold', color: 'text-white/50' },
                      { word: 'Debrief', size: 'text-[10px]', color: 'text-white/30' },
                    ].map((w) => (
                      <span key={w.word} className={`${w.size} ${w.color} px-1`}>{w.word}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA — Dark
          ═══════════════════════════════════════════ */}
      <section className="relative bg-[#07070a] overflow-hidden border-t border-white/[0.04]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(220,38,38,0.12),transparent)]" />
          {/* Grid texture */}
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: 'linear-gradient(rgba(220,38,38,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,0.3) 1px, transparent 1px)',
              backgroundSize: '56px 56px',
              maskImage: 'radial-gradient(ellipse 80% 80% at 50% 80%, black 20%, transparent 80%)',
              WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 80%, black 20%, transparent 80%)',
            }}
          />
        </div>
        <div className="relative max-w-3xl mx-auto px-5 py-24 text-center">
          <ScrollReveal direction="up">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] uppercase tracking-[0.15em] text-white/50 mb-8 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 pulse-dot" />
              Get Started
            </div>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white mb-4">
              Join the teams already using{' '}
              <span className="bg-gradient-to-r from-red-400 via-red-500 to-orange-500 gradient-text">Command 360</span>
            </h2>
            <p className="text-white/40 text-lg mb-8">Start creating interactive training sessions today.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
              <Link href="/register" className="group inline-flex items-center gap-2 px-8 h-12 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-500 transition-all hover:shadow-lg hover:shadow-red-500/25 cursor-pointer">
                Get started free <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link href="/contact" className="inline-flex items-center px-8 h-12 rounded-xl text-sm font-medium border border-white/[0.12] text-white/70 hover:text-white hover:border-white/[0.25] transition-all cursor-pointer">
                Contact us
              </Link>
            </div>
            <div className="flex items-center justify-center gap-3">
              <span className="text-xs text-white/30">Got a room code?</span>
              <JoinCodeInput variant="hero" />
            </div>
          </ScrollReveal>
        </div>
      </section>
    </PublicLayout>
  )
}
