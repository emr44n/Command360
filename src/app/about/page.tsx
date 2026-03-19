import { PublicLayout } from '@/components/layout/PublicLayout'
import { Target, Heart, Zap, ArrowRight } from 'lucide-react'
import { JoinCodeInput } from '@/components/join/JoinCodeInput'
import { ScrollReveal } from '@/components/home/ScrollReveal'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About — Command 360',
  description: 'Learn about Command 360 and our mission to improve emergency services training.',
}

export default function AboutPage() {
  return (
    <PublicLayout>
      {/* ═══════════════════════════════════════════
          HERO — Dark
          ═══════════════════════════════════════════ */}
      <section className="relative bg-[#07070a] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(220,38,38,0.12),transparent)]" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
        </div>
        <div className="relative max-w-6xl mx-auto px-5 pt-32 pb-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left — text */}
            <div className="text-center md:text-left">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-[13px] text-white/60 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 pulse-dot" />
                About Us
              </span>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
                Making emergency services training{' '}
                <span className="bg-gradient-to-r from-red-400 via-red-500 to-orange-500 gradient-text">interactive</span>
              </h1>
              <p className="text-lg text-white/45 leading-relaxed max-w-xl">
                Command 360 was built with one goal: to help emergency services teams run better, more engaging training sessions that improve knowledge retention and save lives.
              </p>
            </div>

            {/* Right — CSS mockup: team collaboration card */}
            <ScrollReveal direction="right" className="hidden md:block">
              <div className="relative">
                <div className="absolute -inset-4 bg-red-500/[0.06] blur-[40px] rounded-full pointer-events-none" />
                <div className="relative rounded-2xl border border-white/[0.08] bg-[#0c0c10] p-5 shadow-2xl shadow-black/40">
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
      <section className="py-24 px-6 bg-background">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal direction="left">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left — text */}
              <div>
                <span className="feature-badge bg-primary/10 text-primary">Our Story</span>
                <h2 className="text-2xl md:text-4xl font-bold tracking-tight mt-4 mb-5">Born from a need for better training</h2>
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
                <div className="rounded-xl border border-border bg-muted/50 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/40" />
                    <span className="text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Before</span>
                  </div>
                  <div className="rounded-lg bg-muted p-4 space-y-2.5">
                    <div className="h-3 rounded bg-muted-foreground/10 w-3/4" />
                    <div className="h-3 rounded bg-muted-foreground/10 w-full" />
                    <div className="h-3 rounded bg-muted-foreground/10 w-5/6" />
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                      <div className="w-8 h-5 rounded bg-muted-foreground/10" />
                      <div className="w-8 h-5 rounded bg-muted-foreground/10" />
                      <span className="text-[9px] text-muted-foreground/40 ml-auto">Slide 14 of 47</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground/50 mt-2 text-center">Static slideshow — no interaction</p>
                </div>

                {/* After card */}
                <div className="rounded-xl border border-primary/20 bg-card p-5 shadow-lg shadow-primary/5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">After — Command 360</span>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-4">
                    <p className="text-xs font-medium text-foreground mb-2">What is your confidence level?</p>
                    <div className="space-y-1.5">
                      {[
                        { label: 'Very confident', pct: 45, color: 'bg-emerald-500' },
                        { label: 'Somewhat', pct: 35, color: 'bg-amber-500' },
                        { label: 'Need more training', pct: 20, color: 'bg-red-500' },
                      ].map((bar) => (
                        <div key={bar.label} className="flex items-center gap-2">
                          <span className="text-[9px] text-muted-foreground w-24 shrink-0">{bar.label}</span>
                          <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                            <div className={`h-full rounded-full ${bar.color}`} style={{ width: `${bar.pct}%` }} />
                          </div>
                          <span className="text-[9px] font-semibold text-foreground w-6 text-right">{bar.pct}%</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-border">
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
          STATS STRIP
          ═══════════════════════════════════════════ */}
      <section className="py-16 px-6 bg-muted/40 border-y border-border">
        <ScrollReveal direction="up">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { number: '11+', label: 'Services Supported', color: 'bg-red-500/10 border-red-500/20', textColor: 'text-red-600 dark:text-red-400' },
              { number: '8', label: 'Slide Types', color: 'bg-blue-500/10 border-blue-500/20', textColor: 'text-blue-600 dark:text-blue-400' },
              { number: '∞', label: 'Real-time Results', color: 'bg-emerald-500/10 border-emerald-500/20', textColor: 'text-emerald-600 dark:text-emerald-400' },
              { number: 'UK', label: 'Wide Coverage', color: 'bg-violet-500/10 border-violet-500/20', textColor: 'text-violet-600 dark:text-violet-400' },
            ].map((stat) => (
              <div key={stat.label} className={`text-center p-6 rounded-2xl border ${stat.color}`}>
                <div className={`text-3xl md:text-4xl font-bold tracking-tight ${stat.textColor} mb-1`}>{stat.number}</div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ═══════════════════════════════════════════
          VALUES
          ═══════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="feature-badge bg-primary/10 text-primary">Our Values</span>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mt-4">What drives us</h2>
          </div>
          <ScrollReveal direction="up">
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Target, title: 'Purpose-built', description: 'Every feature is designed specifically for emergency services training needs — from safety briefings to incident debriefs.' },
                { icon: Heart, title: 'People-first', description: 'We believe better training leads to better outcomes. Our platform helps teams learn together, not just listen.' },
                { icon: Zap, title: 'Simple by design', description: 'Training facilitators should focus on content, not technology. Command 360 is intuitive for presenters and participants alike.' },
              ].map((v) => (
                <div key={v.title} className="text-center p-8 rounded-2xl border border-border bg-card hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                    <v.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground text-lg mb-2">{v.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.description}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          WHO WE SERVE
          ═══════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-muted/40">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <span className="feature-badge bg-primary/10 text-primary">Who We Serve</span>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mt-4">Built for those who protect us</h2>
            <p className="text-muted-foreground mt-3">Command 360 serves training teams across the UK emergency services sector.</p>
          </div>
          <ScrollReveal direction="up">
            <div className="grid sm:grid-cols-2 gap-3">
              {['Fire & Rescue Services', 'Police Forces', 'Ambulance Trusts', 'Armed Forces', 'HM Coastguard', 'Search & Rescue', 'Prison & Probation', 'Local Authority Emergency Planning', 'Civil Contingencies Teams', 'NHS Emergency Departments'].map((service) => (
                <div key={service} className="flex items-center gap-3 px-5 py-3 bg-card border border-border rounded-xl hover:border-primary/20 transition-all">
                  <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  <span className="text-sm font-medium text-foreground">{service}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          MISSION — Dark
          ═══════════════════════════════════════════ */}
      <section className="relative bg-[#07070a] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(220,38,38,0.08),transparent)]" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
        </div>
        <div className="relative max-w-5xl mx-auto px-5 py-24">
          <ScrollReveal direction="up">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left — text */}
              <div className="text-center md:text-left">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-[13px] text-white/60 mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 pulse-dot" />
                  Our Mission
                </span>
                <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white mb-5">
                  Making training{' '}
                  <span className="bg-gradient-to-r from-red-400 via-red-500 to-orange-500 gradient-text">engaging</span>
                </h2>
                <p className="text-white/45 leading-relaxed mb-4">
                  We believe that when training is interactive, people pay attention. When people pay attention, they learn. And when emergency responders learn better, communities are safer.
                </p>
                <p className="text-white/45 leading-relaxed">
                  Our mission is to replace one-way lectures with two-way conversations — giving every crew member a voice and every trainer instant insight into team readiness.
                </p>
              </div>

              {/* Right — CSS mockup: quiz / word cloud interaction */}
              <div className="relative">
                <div className="absolute -inset-4 bg-red-500/[0.04] blur-[40px] rounded-full pointer-events-none" />
                <div className="relative rounded-2xl border border-white/[0.08] bg-[#0c0c10] p-5 shadow-2xl shadow-black/40">
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
                          {opt.correct && <span className="text-[8px] text-white font-bold">✓</span>}
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
      <section className="relative bg-[#07070a] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(220,38,38,0.12),transparent)]" />
        </div>
        <div className="relative max-w-3xl mx-auto px-5 py-24 text-center">
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white mb-4">
            Join the teams already using Command 360
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
        </div>
      </section>
    </PublicLayout>
  )
}
