import Link from 'next/link'
import {
  BarChart2, Cloud, HelpCircle, MessageCircle, ClipboardList, Sparkles,
  ArrowRight, Users, CheckCircle2, Flame, Siren,
  Radio, Shield, Anchor, Search, Building2, Lock, FileText, Check, Zap,
  Heart, Quote, Target, ShieldCheck, Eye, EyeOff, Brain, Monitor, Layers, MousePointerClick,
} from 'lucide-react'
import { ScrollReveal } from '@/components/home/ScrollReveal'
import { SpotlightCard } from '@/components/home/SpotlightCard'
import { CountUp } from '@/components/home/CountUp'
import { JoinCodeInput } from '@/components/join/JoinCodeInput'
import { HomepageClient } from '@/components/home/HomepageClient'
import { AuthCTAButton } from '@/components/home/AuthCTAButton'
import { FloatingJoinDock } from '@/components/join/FloatingJoinDock'
// PricingToggle removed — pricing is handled face-to-face
import { HeroMockup } from '@/components/home/HeroMockup'
import { TestimonialMarquee } from '@/components/home/TestimonialMarquee'
import { FaqAccordion } from '@/components/home/FaqAccordion'

/* ── HELPERS ── */

// Maps a tailwind text-color class to an rgba glow for the spotlight effect.
function glowFor(colorClass: string): string {
  if (colorClass.includes('red')) return 'rgba(239,68,68,0.14)'
  if (colorClass.includes('emerald')) return 'rgba(16,185,129,0.14)'
  if (colorClass.includes('violet')) return 'rgba(139,92,246,0.14)'
  if (colorClass.includes('blue')) return 'rgba(59,130,246,0.14)'
  if (colorClass.includes('amber')) return 'rgba(245,158,11,0.14)'
  if (colorClass.includes('sky')) return 'rgba(14,165,233,0.14)'
  if (colorClass.includes('rose')) return 'rgba(244,63,94,0.14)'
  return 'rgba(239,68,68,0.12)'
}

/* ── DATA ── */

const BENTO_FEATURES = [
  {
    icon: BarChart2,
    label: 'Live Interaction',
    title: 'Every voice heard',
    description: 'Run live polls, word clouds, and Q&A that engage your entire team. Responses appear instantly with animated visualisations.',
    color: 'text-red-400',
    borderHover: 'hover:border-red-500/20',
    span: 'md:col-span-2 md:row-span-2',
  },
  {
    icon: ShieldCheck,
    label: 'Anonymous & Secure',
    title: 'Speak without fear',
    description: 'Fully anonymous responses. No names, no judgement. Your team can be honest about what matters.',
    color: 'text-emerald-400',
    borderHover: 'hover:border-emerald-500/20',
    span: 'md:col-span-1 md:row-span-1',
  },
  {
    icon: Brain,
    label: 'AI-Powered',
    title: 'Instant AI analysis',
    description: 'Auto-generated summaries, key themes, and sentiment analysis after every session.',
    color: 'text-violet-400',
    borderHover: 'hover:border-violet-500/20',
    span: 'md:col-span-1 md:row-span-1',
  },
  {
    icon: HelpCircle,
    label: 'Knowledge Testing',
    title: 'Test understanding',
    description: 'Timed quizzes with leaderboards and scoring. Perfect for competency checks and CPD assessments.',
    color: 'text-blue-400',
    borderHover: 'hover:border-blue-500/20',
    span: 'md:col-span-1 md:row-span-1',
  },
  {
    icon: Eye,
    label: 'Real-time Results',
    title: 'See it live',
    description: 'Watch responses flow in with animated bar charts, word clouds, and live vote tallies.',
    color: 'text-amber-400',
    borderHover: 'hover:border-amber-500/20',
    span: 'md:col-span-1 md:row-span-1',
  },
  {
    icon: FileText,
    label: 'Export & Compliance',
    title: 'Audit-ready records',
    description: 'Export session data as CSV or PDF for training records, compliance documentation, and evaluation logs.',
    color: 'text-sky-400',
    borderHover: 'hover:border-sky-500/20',
    span: 'md:col-span-2 md:row-span-1',
  },
]

const SLIDE_TYPES = [
  { icon: BarChart2, label: 'Live Polling', description: 'Gauge opinions and readiness with animated bar charts.', color: 'text-red-500', bg: 'bg-red-500/10', borderColor: 'hover:border-red-500/20' },
  { icon: Cloud, label: 'Word Clouds', description: 'Capture collective sentiment with growing word clouds.', color: 'text-sky-500', bg: 'bg-sky-500/10', borderColor: 'hover:border-sky-500/20' },
  { icon: HelpCircle, label: 'Quizzes', description: 'Scored, timed knowledge checks with leaderboards.', color: 'text-emerald-500', bg: 'bg-emerald-500/10', borderColor: 'hover:border-emerald-500/20' },
  { icon: MessageCircle, label: 'Q&A', description: 'Anonymous questions with upvoting and moderation.', color: 'text-amber-500', bg: 'bg-amber-500/10', borderColor: 'hover:border-amber-500/20' },
  { icon: ClipboardList, label: 'Surveys', description: 'Multi-question feedback forms for structured data.', color: 'text-rose-500', bg: 'bg-rose-500/10', borderColor: 'hover:border-rose-500/20' },
  { icon: Sparkles, label: 'AI Insights', description: 'AI summaries, quiz generation, and session analysis.', color: 'text-violet-500', bg: 'bg-violet-500/10', borderColor: 'hover:border-violet-500/20' },
]

const STEPS = [
  { n: '01', title: 'Create your session', desc: 'Build interactive slides with polls, quizzes, word clouds, and Q&A. Use a template or start from scratch.', icon: FileText },
  { n: '02', title: 'Launch a live session', desc: 'Share a 6-digit code or QR at your briefing. Crew join instantly on any device — no app or account needed.', icon: Zap },
  { n: '03', title: 'See results instantly', desc: 'Review live results, get AI summaries, and export data for evaluation records and learning logs.', icon: BarChart2 },
]

const USE_CASES = [
  { icon: Flame, label: 'Fire & Rescue', slug: 'fire-rescue', desc: 'Safety briefings, incident debriefs, and operational learning.', color: '#f97316', bg: 'bg-orange-500/10', text: 'text-orange-400' },
  { icon: Shield, label: 'Police', slug: 'police', desc: 'Training days, knowledge checks, and community engagement.', color: '#3b82f6', bg: 'bg-blue-500/10', text: 'text-blue-400' },
  { icon: Siren, label: 'Ambulance', slug: 'ambulance', desc: 'Clinical updates, CPD sessions, and crew welfare checks.', color: '#10b981', bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  { icon: Target, label: 'Armed Forces', slug: 'armed-forces', desc: 'Operational readiness, doctrine training, and lessons learned.', color: '#64748b', bg: 'bg-slate-500/10', text: 'text-slate-400' },
  { icon: Anchor, label: 'HM Coastguard', slug: 'coastguard', desc: 'Safety training, equipment checks, and incident reviews.', color: '#0ea5e9', bg: 'bg-sky-500/10', text: 'text-sky-400' },
  { icon: Search, label: 'Search & Rescue', slug: 'search-rescue', desc: 'Scenario learning, volunteer training, and skills checks.', color: '#f59e0b', bg: 'bg-amber-500/10', text: 'text-amber-400' },
  { icon: Lock, label: 'Prison & Probation', slug: 'prison-probation', desc: 'Staff training, incident reviews, and compliance checks.', color: '#71717a', bg: 'bg-zinc-500/10', text: 'text-zinc-400' },
  { icon: Building2, label: 'Local Authority', slug: 'local-authority', desc: 'Emergency planning, business continuity, and team training.', color: '#8b5cf6', bg: 'bg-violet-500/10', text: 'text-violet-400' },
  { icon: Radio, label: 'Civil Contingencies', slug: 'civil-contingencies', desc: 'Multi-agency exercises, resilience planning, and debriefs.', color: '#ef4444', bg: 'bg-red-500/10', text: 'text-red-400' },
  { icon: Heart, label: 'NHS Emergency Departments', slug: 'nhs-emergency', desc: 'Clinical governance, major incident training, and team briefings.', color: '#ec4899', bg: 'bg-pink-500/10', text: 'text-pink-400' },
  { icon: Users, label: 'Voluntary Sector', slug: 'voluntary-sector', desc: 'Volunteer inductions, skills development, and safeguarding training.', color: '#14b8a6', bg: 'bg-teal-500/10', text: 'text-teal-400' },
]

const TEMPLATE_EXAMPLES = [
  'Hot debriefs', 'Safety briefings', 'Incident command refreshers', 'Operational learning',
  'Welfare & fatigue checks', 'Risk assessments', 'New joiner onboarding', 'Skills & knowledge checks',
]

const TESTIMONIALS = [
  {
    quote: 'Command 360 completely changed how we run our debrief sessions. Every firefighter now has a voice, not just the loudest in the room. The AI summaries save us hours of write-up time after every exercise.',
    name: 'James Thornton',
    role: 'Station Officer',
    org: 'West Midlands Fire Service',
    icon: Flame,
  },
  {
    quote: 'We use it for CPD days and knowledge checks across three divisions. The quiz leaderboards bring genuine energy to sessions that used to feel flat. Our pass rates on competency assessments are up significantly.',
    name: 'Sarah Mitchell',
    role: 'Training & Development Lead',
    org: 'Metropolitan Police',
    icon: Shield,
  },
  {
    quote: 'The anonymous Q&A feature has been a game-changer for clinical governance meetings. Paramedics raise issues they never would face-to-face. We get honest feedback and can act on it immediately.',
    name: 'Dr Priya Sharma',
    role: 'Clinical Lead',
    org: 'East Midlands Ambulance Service',
    icon: Siren,
  },
  {
    quote: 'Rolling it out across our volunteer teams was painless. No accounts, no app installs — just a code on the screen and everyone is connected. We were up and running in our first session within minutes.',
    name: 'Mark Evans',
    role: 'Operations Manager',
    org: 'Lowland Rescue',
    icon: Search,
  },
]

const FAQ_ITEMS = [
  {
    q: 'Is Command 360 free to use?',
    a: 'Yes. Command 360 is completely free to get started with no credit card required. Simply create an account and start building sessions right away.',
  },
  {
    q: 'Do participants need to create an account?',
    a: 'No. Participants simply enter a 6-digit join code on any device with a web browser. No app download or account creation needed.',
  },
  {
    q: 'Can I export session data for training records?',
    a: 'Yes. All session results, quiz scores, and AI summaries can be exported as CSV or PDF for your training records and compliance documentation.',
  },
  {
    q: 'Is Command 360 suitable for multi-agency exercises?',
    a: 'Absolutely. Command 360 is regularly used for multi-agency exercises involving fire, police, ambulance, and local authority teams working together.',
  },
  {
    q: 'What about data security and GDPR?',
    a: 'Command 360 is hosted in the UK, fully GDPR compliant, and we offer a Data Processing Agreement (DPA) for all organisations. Contact us for data residency options.',
  },
]

/* ── PAGE ── */

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'Command 360', applicationCategory: 'PresentationApplication', description: 'Interactive training and briefing platform for emergency services.', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' } }) }} />

      <HomepageClient />

      {/* ═══════════════════════════════════════════
          HERO
          ═══════════════════════════════════════════ */}
      <section className="relative min-h-[95vh] flex flex-col bg-[#07070a] overflow-hidden">
        {/* Background layers — prominent aurora gradient */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Main red aurora glow — prominent and wide */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_140%_70%_at_50%_-20%,rgba(220,38,38,0.3),transparent_65%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_60%_at_30%_10%,rgba(220,38,38,0.15),transparent_55%)] float-glow" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_75%_15%,rgba(249,115,22,0.1),transparent_50%)] float-glow" style={{ animationDelay: '-6s' }} />
          {/* Secondary cool accent at bottom */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_70%_80%,rgba(59,130,246,0.05),transparent_50%)]" />
          {/* Grid — prominent, red-tinted, full coverage */}
          <div
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage: 'linear-gradient(rgba(220,38,38,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,0.4) 1px, transparent 1px)',
              backgroundSize: '56px 56px',
              maskImage: 'radial-gradient(ellipse 100% 80% at 50% 40%, black 20%, transparent 80%)',
              WebkitMaskImage: 'radial-gradient(ellipse 100% 80% at 50% 40%, black 20%, transparent 80%)',
            }}
          />
          {/* Bottom fade to black */}
          <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#07070a] via-[#07070a]/80 to-transparent" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center max-w-4xl mx-auto px-5 pt-32 pb-8">
          {/* Badge */}
          <div className="hero-fade-up hero-fade-up-1 inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] uppercase tracking-[0.15em] text-white/50 mb-8 font-medium">
            <span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" /><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 shadow-[0_0_8px_2px_rgba(239,68,68,0.5)]" /></span>
            The interactive learning platform for emergency services
          </div>

          {/* Heading */}
          <h1 className="hero-fade-up hero-fade-up-2 text-[clamp(2.2rem,6.5vw,4.2rem)] font-bold tracking-tight leading-[1.08] text-white mb-6">
            Where emergency teams{' '}
            <br className="hidden sm:block" />
            <span className="bg-[linear-gradient(90deg,#f87171,#ef4444,#f97316,#ef4444,#f87171)] gradient-text gradient-text-flow">learn, grow, and lead.</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-fade-up hero-fade-up-3 text-base md:text-lg text-white/40 max-w-2xl leading-relaxed mb-10">
            An interactive training environment that transforms briefings, debriefs, and CPD sessions
            into engaging learning experiences. Live polls, quizzes, and AI insights — helping your crews
            build knowledge and confidence together.
          </p>

          {/* CTAs */}
          <div className="hero-fade-up hero-fade-up-4 flex flex-col sm:flex-row items-center gap-3">
            <AuthCTAButton tab="register" label="Start free trial" />
            <a href="#how-it-works" className="inline-flex items-center gap-2 px-7 h-12 rounded-xl text-sm font-medium border border-white/[0.1] text-white/60 hover:text-white hover:border-white/[0.2] hover:bg-white/[0.03] transition-all duration-200 cursor-pointer">
              See how it works
            </a>
          </div>

          {/* Join code section */}
          <div id="hero-join" className="hero-fade-up hero-fade-up-5 mt-10 flex flex-col items-center gap-3">
            <p className="text-white/25 text-[10px] uppercase tracking-[0.2em] font-medium flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 shadow-[0_0_8px_2px_rgba(239,68,68,0.5)]" />
              </span>
              Got a join code?
            </p>
            <JoinCodeInput variant="hero" />
          </div>
        </div>

        {/* Animated product mockup */}
        <div className="relative z-10 mx-auto max-w-3xl w-full px-5 mt-8 mb-[-80px] hero-fade-up hero-fade-up-5">
          {/* Animated sweeping glow behind mockup */}
          <div className="absolute inset-0 -m-16 pointer-events-none">
            <div className="absolute inset-0 bg-red-500/[0.12] blur-[100px] rounded-full glow-sweep" />
            <div className="absolute inset-0 bg-orange-500/[0.06] blur-[80px] rounded-full float-glow" style={{ animationDelay: '-4s' }} />
          </div>
          <HeroMockup />
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TRUST STRIP
          ═══════════════════════════════════════════ */}
      <section className="pt-32 pb-16 bg-[#07070a] dark:bg-[#07070a] border-t border-white/[0.04] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-red-500/[0.04] blur-[120px] rounded-full" />
        </div>
        <ScrollReveal>
          <div className="max-w-4xl mx-auto px-5 text-center">
            <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-medium mb-8">Trusted by emergency services across the UK</p>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
              {[
                { icon: Flame, label: 'Fire & Rescue' },
                { icon: Shield, label: 'Police' },
                { icon: Siren, label: 'Ambulance' },
                { icon: Target, label: 'Armed Forces' },
                { icon: Radio, label: 'Resilience' },
                { icon: Building2, label: 'Local Authority' },
              ].map((item) => (
                <span key={item.label} className="flex items-center gap-2 text-xs text-white/25">
                  <item.icon className="w-3.5 h-3.5" />
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ═══════════════════════════════════════════
          BENTO FEATURES
          ═══════════════════════════════════════════ */}
      <section id="features" className="bg-[#07070a] pb-24 md:pb-32 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/3 w-[500px] h-[400px] bg-red-500/[0.04] blur-[120px] rounded-full section-glow-drift" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[300px] bg-orange-500/[0.03] blur-[100px] rounded-full section-glow-drift" style={{ animationDelay: '-7s' }} />
        </div>
        <div className="relative max-w-5xl mx-auto px-5">
          <ScrollReveal className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/[0.08] border border-blue-500/[0.15] text-[10px] uppercase tracking-[0.2em] text-blue-400/70 font-medium">Command Classroom</span>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mt-5 text-white">Everything you need to engage your team</h2>
            <p className="text-white/35 mt-4 max-w-lg mx-auto text-sm">Six powerful tools in one secure environment, designed for the realities of operational training.</p>
          </ScrollReveal>

          <ScrollReveal stagger>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {BENTO_FEATURES.map((f) => (
                <SpotlightCard
                  key={f.title}
                  glow={glowFor(f.color)}
                  className={`group relative flex flex-col overflow-hidden rounded-2xl p-5 border border-white/[0.06] bg-white/[0.02] ${f.borderHover} hover:bg-white/[0.04] transition-all duration-300 hover:-translate-y-1 cursor-default [box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.03)_inset]`}
                >
                  {/* Color accent line at top */}
                  <div className="absolute top-0 left-0 right-0 h-px opacity-40" style={{ background: `linear-gradient(90deg, transparent 10%, var(--accent-color, rgba(255,255,255,0.1)) 50%, transparent 90%)` }} />
                  {/* Corner glow on hover */}
                  <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-3xl pointer-events-none" style={{ backgroundColor: f.color.includes('red') ? 'rgba(220,38,38,0.06)' : f.color.includes('emerald') ? 'rgba(16,185,129,0.06)' : f.color.includes('violet') ? 'rgba(139,92,246,0.06)' : f.color.includes('blue') ? 'rgba(59,130,246,0.06)' : f.color.includes('amber') ? 'rgba(245,158,11,0.06)' : 'rgba(14,165,233,0.06)' }} />
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <f.icon className={`w-3.5 h-3.5 ${f.color}`} />
                    </div>
                    <span className={`text-[9px] uppercase tracking-[0.15em] font-semibold ${f.color}`}>{f.label}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1.5">{f.title}</h3>
                  <p className="text-xs text-white/35 leading-relaxed mb-3">{f.description}</p>
                  {/* Mini visual bar */}
                  <div className="mt-auto flex items-center gap-1.5">
                    {[40, 65, 25, 80, 50].map((w, i) => (
                      <div key={i} className="h-1 rounded-full bg-white/[0.06] flex-1">
                        <div className="h-full rounded-full transition-all duration-700 group-hover:opacity-100 opacity-40" style={{ width: `${w}%`, backgroundColor: f.color.includes('red') ? '#dc2626' : f.color.includes('emerald') ? '#10b981' : f.color.includes('violet') ? '#8b5cf6' : f.color.includes('blue') ? '#3b82f6' : f.color.includes('amber') ? '#f59e0b' : '#0ea5e9' }} />
                      </div>
                    ))}
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CORE FEATURES — Classroom + Studio Side by Side
          ═══════════════════════════════════════════ */}
      <section className="relative bg-[#07070a] border-t border-white/[0.04] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-1/2 h-full bg-[radial-gradient(ellipse_80%_50%_at_50%_30%,rgba(59,130,246,0.06),transparent)]" />
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(ellipse_80%_50%_at_50%_30%,rgba(220,38,38,0.06),transparent)]" />
        </div>
        <div className="relative max-w-6xl mx-auto px-5 py-20 md:py-28">
          <ScrollReveal className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] uppercase tracking-[0.2em] text-white/40 font-medium">Two Powerful Training Modes</span>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mt-5 text-white">Built for how you train</h2>
            <p className="text-white/35 mt-4 max-w-lg mx-auto text-sm">Whether it&apos;s interactive classroom learning or immersive scenario simulation — Command 360 has you covered.</p>
          </ScrollReveal>

          <ScrollReveal>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Command Classroom */}
              <div className="group rounded-2xl border border-blue-500/10 bg-blue-500/[0.02] p-6 md:p-8 hover:border-blue-500/20 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_20%_20%,rgba(59,130,246,0.08),transparent)] pointer-events-none" />
                <div className="relative">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-semibold text-blue-400 uppercase tracking-[0.15em] mb-5">
                    Command Classroom
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3">Interactive Training Sessions</h3>
                  <p className="text-sm text-white/40 mb-6 leading-relaxed">Run live polls, quizzes, word clouds, and Q&A sessions that engage every team member — all from any device.</p>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-md bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5"><BarChart2 className="w-3 h-3 text-blue-400" /></div>
                      <div><p className="text-xs font-medium text-white">Live Interaction</p><p className="text-[10px] text-white/30">Polls, word clouds, and Q&A in real time</p></div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-md bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5"><HelpCircle className="w-3 h-3 text-blue-400" /></div>
                      <div><p className="text-xs font-medium text-white">Knowledge Assessment</p><p className="text-[10px] text-white/30">Timed quizzes with leaderboards and CPD scoring</p></div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-md bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5"><Sparkles className="w-3 h-3 text-blue-400" /></div>
                      <div><p className="text-xs font-medium text-white">AI-Powered Insights</p><p className="text-[10px] text-white/30">Auto summaries, themes, and sentiment analysis</p></div>
                    </div>
                  </div>
                  <Link href="/#services" className="group/btn inline-flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
                    Explore services <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Command Studio */}
              <div className="group rounded-2xl border border-red-500/10 bg-red-500/[0.02] p-6 md:p-8 hover:border-red-500/20 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_20%,rgba(220,38,38,0.08),transparent)] pointer-events-none" />
                <div className="relative">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] font-semibold text-red-400 uppercase tracking-[0.15em] mb-5">
                    <Monitor className="w-3 h-3" /> Command Studio
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3">Visual Scenario Simulation</h3>
                  <p className="text-sm text-white/40 mb-6 leading-relaxed">Build interactive training scenarios with layered images, video effects, and real-time event triggers — the most immersive way to train.</p>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-md bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5"><Layers className="w-3 h-3 text-red-400" /></div>
                      <div><p className="text-xs font-medium text-white">Layer-Based Scenes</p><p className="text-[10px] text-white/30">Stack images, videos, and overlays for realism</p></div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-md bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5"><MousePointerClick className="w-3 h-3 text-red-400" /></div>
                      <div><p className="text-xs font-medium text-white">Live Event Triggers</p><p className="text-[10px] text-white/30">Control the narrative — fire spread, casualties, conditions</p></div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-md bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5"><Eye className="w-3 h-3 text-red-400" /></div>
                      <div><p className="text-xs font-medium text-white">Real-Time Audience View</p><p className="text-[10px] text-white/30">Everyone sees the scene evolve simultaneously</p></div>
                    </div>
                  </div>
                  <Link href="/command-studio" className="group/btn inline-flex items-center gap-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors">
                    Learn more <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FEATURE DEEP DIVES (mockups)
          ═══════════════════════════════════════════ */}
      <div>
        {[
          {
            badge: 'Live Interaction',
            badgeClass: 'bg-red-500/10 text-red-400',
            title: 'Every voice heard, every time',
            description: 'Run live polls, word clouds, and Q&A sessions that engage your entire team. Responses appear instantly on the presenter screen with animated visualisations.',
            bullets: ['Live polling with animated bar charts', 'Word clouds that grow in real-time', 'Anonymous Q&A with upvoting', 'Multi-question surveys'],
            mockup: <PollingMockup />,
          },
          {
            badge: 'Knowledge Testing',
            badgeClass: 'bg-blue-500/10 text-blue-400',
            title: 'Test understanding instantly',
            description: 'Create timed quizzes with leaderboards and scoring. Perfect for competency checks, CPD assessments, and post-incident learning verification.',
            bullets: ['Scored quizzes with countdown timers', 'Leaderboard rankings after each round', 'Instant correct/wrong feedback', 'Export results for training records'],
            mockup: <QuizMockup />,
          },
          {
            badge: 'AI-Powered',
            badgeClass: 'bg-violet-500/10 text-violet-400',
            title: 'AI analysis of every session',
            description: 'Get instant AI-generated summaries, key themes, and sentiment analysis. Understand what your team thinks without reading every individual response.',
            bullets: ['Automatic session summaries', 'Key theme extraction', 'Quiz question generation from any topic', 'Actionable recommendations'],
            mockup: <AIMockup />,
          },
        ].map((feature, idx) => {
          const isReversed = idx % 2 !== 0
          return (
            <section key={feature.title} className={`${idx % 2 === 0 ? 'bg-background' : 'bg-muted/30 dark:bg-muted/10'} border-t border-border/50 relative overflow-hidden`}>
              <div className="max-w-5xl mx-auto px-5 py-20 md:py-28">
                <div className={`flex flex-col gap-12 md:gap-16 items-center ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
                  <ScrollReveal direction={isReversed ? 'right' : 'left'} className="flex-1 space-y-5">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.15em] font-medium border border-white/[0.06] ${feature.badgeClass}`}>{feature.badge}</span>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">{feature.title}</h2>
                    <p className="text-muted-foreground leading-relaxed text-sm">{feature.description}</p>
                    <ul className="space-y-2.5 pt-2">
                      {feature.bullets.map((pt) => (
                        <li key={pt} className="flex items-start gap-3 text-sm text-muted-foreground">
                          <Check className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />{pt}
                        </li>
                      ))}
                    </ul>
                  </ScrollReveal>
                  <ScrollReveal direction={isReversed ? 'left' : 'right'} className="flex-1 w-full">
                    {feature.mockup}
                  </ScrollReveal>
                </div>
              </div>
            </section>
          )
        })}
      </div>

      {/* ═══════════════════════════════════════════
          SLIDE TYPES
          ═══════════════════════════════════════════ */}
      <section id="slide-types" className="bg-background border-t border-border/50 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none dark:block hidden">
          <div className="absolute top-0 left-1/4 w-[500px] h-[400px] bg-red-500/[0.05] blur-[120px] rounded-full section-glow-drift" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-blue-500/[0.04] blur-[100px] rounded-full section-glow-drift" style={{ animationDelay: '-8s' }} />
        </div>
        <div className="max-w-5xl mx-auto px-5 py-20 md:py-28">
          <ScrollReveal className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] uppercase tracking-[0.15em] font-medium border border-primary/20">Interactive Tools</span>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mt-5">Six ways to engage your team</h2>
            <p className="text-muted-foreground mt-4 max-w-lg mx-auto text-sm">Mix and match any combination in a single training session.</p>
          </ScrollReveal>

          <ScrollReveal stagger>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {SLIDE_TYPES.map((s) => (
                <SpotlightCard key={s.label} glow={glowFor(s.color)} className={`group p-5 rounded-2xl border border-border/60 bg-card/50 ${s.borderColor} hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default [box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.02)_inset] relative overflow-hidden`}>
                  {/* Color accent line at top */}
                  <div className={`absolute top-0 left-0 right-0 h-px ${s.bg.replace('/10', '/30')}`} style={{ background: `linear-gradient(90deg, transparent, ${s.color === 'text-red-500' ? '#dc2626' : s.color === 'text-sky-500' ? '#0ea5e9' : s.color === 'text-emerald-500' ? '#10b981' : s.color === 'text-amber-500' ? '#f59e0b' : s.color === 'text-rose-500' ? '#f43f5e' : '#8b5cf6'}40, transparent)` }} />
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-9 h-9 rounded-xl ${s.bg} border border-white/[0.06] flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <s.icon className={`w-4 h-4 ${s.color}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{s.label}</h3>
                      <span className={`text-[9px] uppercase tracking-[0.12em] font-medium ${s.color} opacity-60`}>Interactive</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed">{s.description}</p>
                </SpotlightCard>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          HOW IT WORKS
          ═══════════════════════════════════════════ */}
      <section id="how-it-works" className="bg-muted/30 border-t border-border/50 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none dark:block hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-primary/[0.04] blur-[120px] rounded-full" />
        </div>
        <div className="max-w-5xl mx-auto px-5 py-20 md:py-28">
          <ScrollReveal className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] uppercase tracking-[0.15em] font-medium border border-primary/20">How It Works</span>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mt-5">Up and running in minutes</h2>
          </ScrollReveal>

          <ScrollReveal stagger>
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Connecting line on desktop */}
              <div className="hidden md:block absolute top-[60px] left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
              {STEPS.map((step, i) => (
                <SpotlightCard key={step.n} className="relative bg-card/50 rounded-2xl border border-border/60 p-8 text-center [box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.02)_inset] hover:-translate-y-1 transition-all duration-300 group">
                  {/* Numbered circle */}
                  <div className="relative mx-auto mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                      <step.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">{i + 1}</div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[9px] uppercase tracking-[0.15em] font-semibold border border-primary/15 mb-3">Step {step.n}</span>
                  <h3 className="text-base font-bold mt-2 mb-3">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                </SpotlightCard>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SERVICES
          ═══════════════════════════════════════════ */}
      <section id="services" className="bg-background border-t border-border/50 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none dark:block hidden">
          <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-orange-500/[0.03] blur-[150px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/[0.02] blur-[120px] rounded-full" />
        </div>
        <div className="max-w-5xl mx-auto px-5 py-20 md:py-28">
          <ScrollReveal className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] uppercase tracking-[0.15em] font-medium border border-primary/20">Solutions</span>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mt-5">Purpose-built for every service</h2>
            <p className="text-muted-foreground mt-4 max-w-lg mx-auto text-sm">Tailored templates, language, and workflows for operational training.</p>
          </ScrollReveal>

          <ScrollReveal stagger>
            <div className="flex flex-wrap justify-center gap-3">
              {USE_CASES.map((uc) => (
                <SpotlightCard key={uc.slug} href={`/solutions/${uc.slug}`} glow={`${uc.color}26`}
                  className="group p-5 rounded-2xl border border-border/60 bg-card/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 [box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.02)_inset] relative overflow-hidden w-full sm:w-[calc(50%-6px)] lg:w-[calc(25%-9px)]"
                >
                  {/* Background glow on hover — uses the service's color */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" style={{ background: `radial-gradient(ellipse at center, ${uc.color}15, transparent 70%)` }} />
                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `linear-gradient(90deg, transparent, ${uc.color}50, transparent)` }} />
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div className={`w-8 h-8 rounded-lg ${uc.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      <uc.icon className={`w-3.5 h-3.5 ${uc.text}`} />
                    </div>
                    <h3 className="text-sm font-bold transition-colors">{uc.label}</h3>
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed">{uc.desc}</p>
                </SpotlightCard>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          OUTCOMES
          ═══════════════════════════════════════════ */}
      <section className="relative bg-[#07070a] border-t border-white/[0.04] overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(220,38,38,0.08),transparent)]" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        </div>
        <div className="relative max-w-5xl mx-auto px-5 py-20 md:py-28">
          <ScrollReveal className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] text-white/40 text-[10px] uppercase tracking-[0.15em] font-medium border border-white/[0.08]">Impact</span>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mt-5 text-white">Measurable impact on training</h2>
          </ScrollReveal>

          <ScrollReveal stagger>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { value: 3, suffix: 'x', label: 'More participation than hand-raising', desc: 'Everyone contributes, not just the loudest voices.', color: 'from-red-400 to-orange-500', glow: 'rgba(239,68,68,0.14)' },
                { value: 90, suffix: '%', label: 'Of crews prefer interactive briefings', desc: 'Engagement that keeps your team focused and alert.', color: 'from-blue-400 to-cyan-400', glow: 'rgba(59,130,246,0.14)' },
                { value: 60, suffix: '%', label: 'Faster feedback vs paper forms', desc: 'Results ready instantly, not after hours of data entry.', color: 'from-emerald-400 to-green-400', glow: 'rgba(16,185,129,0.14)' },
              ].map((s) => (
                <SpotlightCard key={s.label} glow={s.glow} className="text-center rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 [box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.03)_inset] hover:-translate-y-1 transition-all duration-300">
                  <CountUp value={s.value} suffix={s.suffix} className={`block text-3xl sm:text-5xl font-bold bg-gradient-to-r ${s.color} gradient-text mb-3`} />
                  <p className="font-semibold text-sm text-white/80 mb-2">{s.label}</p>
                  <p className="text-white/35 text-xs">{s.desc}</p>
                </SpotlightCard>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TEMPLATES
          ═══════════════════════════════════════════ */}
      <section id="templates" className="bg-background border-t border-border/50 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none dark:block hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-violet-500/[0.04] blur-[120px] rounded-full" />
        </div>
        <div className="max-w-5xl mx-auto px-5 py-20 md:py-28">
          <ScrollReveal className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] uppercase tracking-[0.15em] font-medium border border-primary/20">Templates</span>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mt-5">Start with a ready-made template</h2>
            <p className="text-muted-foreground mt-4 max-w-lg mx-auto text-sm">Purpose-built templates for operational training, debriefs, and learning capture.</p>
          </ScrollReveal>

          <div className="relative overflow-hidden">
            <div className="flex gap-3 animate-[marqueeLeft_30s_linear_infinite] hover:[animation-play-state:paused]">
              {[...TEMPLATE_EXAMPLES, ...TEMPLATE_EXAMPLES, ...TEMPLATE_EXAMPLES, ...TEMPLATE_EXAMPLES].map((t, i) => (
                <span key={`${t}-${i}`} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/60 bg-card/50 text-sm font-medium whitespace-nowrap shrink-0 hover:border-primary/20 hover:bg-card transition-all duration-200 cursor-default">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  {t}
                </span>
              ))}
            </div>
            {/* Fade edges */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent" />
          </div>
          <div className="text-center mt-8">
            <Link href="/templates" className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline transition-all">
              View all templates <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          GET A DEMO (replaced Pricing)
          ═══════════════════════════════════════════ */}
      <section id="demo" className="relative bg-[#07070a] border-t border-white/[0.04] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(220,38,38,0.08),transparent)]" />
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-red-500/[0.05] blur-[120px] rounded-full float-glow" />
        </div>
        <div className="relative max-w-4xl mx-auto px-5 py-20 md:py-28">
          <ScrollReveal className="text-center">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] text-white/40 text-[10px] uppercase tracking-[0.15em] font-medium border border-white/[0.08]">Get Started</span>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mt-5 text-white">Ready to transform your training?</h2>
            <p className="text-white/35 mt-4 max-w-lg mx-auto text-sm leading-relaxed">
              Book a personalised demo and see how Command 360 can engage your teams, improve knowledge retention, and streamline your training workflow.
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <div className="mt-10 text-center flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/contact" className="group inline-flex items-center gap-2 px-7 h-12 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-500 transition-all hover:shadow-lg hover:shadow-red-500/25 cursor-pointer">
                Book a demo <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </ScrollReveal>

          {/* FAQ */}
          <div className="mt-20 max-w-2xl mx-auto">
            <ScrollReveal className="text-center mb-10">
              <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white">Frequently asked questions</h3>
            </ScrollReveal>
            <ScrollReveal>
              <FaqAccordion items={FAQ_ITEMS} />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TESTIMONIALS
          ═══════════════════════════════════════════ */}
      <section id="testimonials" className="relative bg-[#07070a] border-t border-white/[0.04] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-red-500/[0.06] blur-[150px] rounded-full float-glow" />
          <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-blue-500/[0.04] blur-[100px] rounded-full float-glow" style={{ animationDelay: '-6s' }} />
        </div>
        <div className="relative py-20 md:py-28">
          <ScrollReveal className="text-center mb-14 px-5">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] text-white/40 text-[10px] uppercase tracking-[0.15em] font-medium border border-white/[0.08]">Testimonials</span>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mt-5 text-white">Trusted by those who serve</h2>
            <p className="text-white/35 mt-4 max-w-lg mx-auto text-sm">Hear from emergency service professionals already using Command 360.</p>
          </ScrollReveal>

          <TestimonialMarquee />
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA
          ═══════════════════════════════════════════ */}
      <section className="relative bg-[#07070a] overflow-hidden border-t border-white/[0.04]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(220,38,38,0.18),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(220,38,38,0.08),transparent)]" />
          {/* Grid texture */}
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
        </div>
        <div className="relative max-w-3xl mx-auto px-5 py-24 md:py-32 text-center">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] uppercase tracking-[0.15em] text-white/40 font-medium mb-6">
              <span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" /><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 shadow-[0_0_8px_2px_rgba(239,68,68,0.5)]" /></span>
              Get started today
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
              Ready to transform{' '}
              <span className="bg-[linear-gradient(90deg,#f87171,#ef4444,#f97316,#ef4444,#f87171)] gradient-text gradient-text-flow">your training?</span>
            </h2>
            <p className="text-white/35 text-base md:text-lg mb-10 max-w-lg mx-auto">
              Free for 30 days. No credit card required. Built for those who serve.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <AuthCTAButton className="px-8 h-13" />
              <Link href="/contact" className="inline-flex items-center gap-2 px-8 h-13 rounded-xl text-sm font-medium border border-white/[0.1] text-white/60 hover:text-white hover:border-white/[0.2] transition-all duration-200 cursor-pointer">
                Book a demo
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════ */}
      <footer className="border-t border-border/50 relative bg-gradient-to-b from-background via-background to-muted/30 dark:from-[#0a0a0e] dark:via-[#0c0c12] dark:to-[#111118]">
        {/* Grid texture + top glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(128,128,128,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(128,128,128,0.4) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-primary/[0.03] blur-[100px] rounded-full hidden dark:block" />
        </div>
        <div className="max-w-6xl mx-auto px-5 py-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 font-semibold text-sm text-foreground mb-4">
                <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-3 h-3 text-primary-foreground" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                Command 360
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">Interactive training platform for emergency services.</p>
              <p className="text-xs text-muted-foreground mt-2">command360.co.uk</p>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-4">Services</h4>
              <ul className="space-y-2 text-xs text-muted-foreground">
                {USE_CASES.map((uc) => (
                  <li key={uc.slug}><Link href={`/solutions/${uc.slug}`} className="hover:text-foreground transition-colors">{uc.label}</Link></li>
                ))}
              </ul>
            </div>

            {/* Platform */}
            <div>
              <h4 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-4">Platform</h4>
              <ul className="space-y-2.5 text-xs text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><Link href="/command-studio" className="hover:text-foreground transition-colors">Command Studio</Link></li>
                <li><Link href="/contact" className="hover:text-foreground transition-colors">Book a Demo</Link></li>
                <li><a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-4">Company</h4>
              <ul className="space-y-2.5 text-xs text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
                <li><Link href="/help" className="hover:text-foreground transition-colors">Help</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-4">Legal</h4>
              <ul className="space-y-2.5 text-xs text-muted-foreground">
                <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link></li>
                <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link></li>
                <li><Link href="/cookies" className="hover:text-foreground transition-colors">Cookies</Link></li>
                <li><Link href="/accessibility" className="hover:text-foreground transition-colors">Accessibility</Link></li>
                <li><Link href="/dpa" className="hover:text-foreground transition-colors">DPA</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/[0.06] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-red-600/80 rounded-md flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              </div>
              <span className="text-[11px] text-muted-foreground/60">&copy; 2026 Command 360. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-muted-foreground/30 font-mono tracking-wide">command360.co.uk</span>
            </div>
          </div>
        </div>
      </footer>

      <FloatingJoinDock />
    </div>
  )
}

/* ── INLINE MOCKUP COMPONENTS ── */

function PollingMockup() {
  return (
    <div className="relative">
      <div className="absolute inset-0 -m-4 bg-red-500/5 dark:bg-red-500/10 blur-2xl rounded-3xl pointer-events-none" />
      <div className="relative rounded-2xl border border-border/60 bg-card/80 overflow-hidden shadow-xl dark:shadow-black/20 [box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.03)_inset]">
        <div className="px-5 py-3 border-b border-border/50 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-[11px] font-semibold text-foreground">Live Poll Results</span>
          <span className="ml-auto text-[10px] text-muted-foreground">24 responses</span>
        </div>
        <div className="p-5 space-y-4">
          <p className="text-sm font-semibold">Which protocol applies to this scenario?</p>
          {[
            { label: 'Protocol Alpha', pct: 65, barColor: 'bg-red-500' },
            { label: 'Protocol Bravo', pct: 22, barColor: 'bg-red-400' },
            { label: 'Protocol Charlie', pct: 13, barColor: 'bg-red-300' },
          ].map((bar) => (
            <div key={bar.label}>
              <div className="flex justify-between text-[11px] text-muted-foreground mb-1.5">
                <span>{bar.label}</span>
                <span className="font-semibold">{bar.pct}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className={`h-full rounded-full ${bar.barColor} transition-all duration-1000`} style={{ width: `${bar.pct}%` }} />
              </div>
            </div>
          ))}
          <div className="flex items-center gap-2 pt-2">
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Live
            </div>
            <span className="text-[10px] text-muted-foreground">&middot;</span>
            <span className="text-[10px] text-muted-foreground">Updated just now</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function QuizMockup() {
  return (
    <div className="relative">
      <div className="absolute inset-0 -m-4 bg-blue-500/5 dark:bg-blue-500/10 blur-2xl rounded-3xl pointer-events-none" />
      <div className="relative rounded-2xl border border-border/60 bg-card/80 overflow-hidden shadow-xl dark:shadow-black/20 [box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.03)_inset]">
        <div className="px-5 py-3 border-b border-border/50 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-[11px] font-semibold text-foreground">Knowledge Check</span>
          <span className="ml-auto text-[10px] text-muted-foreground">&#9201; 0:28</span>
        </div>
        <div className="p-5">
          <p className="text-sm font-semibold mb-4">What is the maximum safe working height without a harness?</p>
          <div className="space-y-2.5">
            {[
              { label: 'A. 1.8 metres', correct: false, selected: false },
              { label: 'B. 2.0 metres', correct: true, selected: true },
              { label: 'C. 2.5 metres', correct: false, selected: false },
              { label: 'D. 3.0 metres', correct: false, selected: false },
            ].map((opt) => (
              <div key={opt.label} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm border transition-all ${
                opt.correct && opt.selected
                  ? 'border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400'
                  : 'border-border/60 text-muted-foreground'
              }`}>
                {opt.correct && opt.selected ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-border/60 shrink-0" />
                )}
                <span>{opt.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between text-[10px] text-muted-foreground">
            <span>Question 4 of 10</span>
            <span className="text-green-500 font-semibold">+100 pts</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function AIMockup() {
  return (
    <div className="relative">
      <div className="absolute inset-0 -m-4 bg-violet-500/5 dark:bg-violet-500/10 blur-2xl rounded-3xl pointer-events-none" />
      <div className="relative rounded-2xl border border-border/60 bg-card/80 overflow-hidden shadow-xl dark:shadow-black/20 [box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.03)_inset]">
        <div className="px-5 py-3 border-b border-border/50 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-violet-500" />
          <span className="text-[11px] font-semibold text-foreground">AI Session Summary</span>
          <span className="ml-auto text-[10px] text-muted-foreground">Generated in 3s</span>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em] mb-2">Key Themes</h4>
            <div className="flex flex-wrap gap-1.5">
              {['Equipment readiness', 'Communication gaps', 'Protocol adherence', 'Team morale'].map((tag) => (
                <span key={tag} className="px-2.5 py-1 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 text-[10px] font-medium border border-violet-500/10">{tag}</span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em] mb-2">Summary</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The team demonstrated strong awareness of evacuation procedures. Key areas for improvement include radio communication during multi-floor operations and equipment inventory checks.
            </p>
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em] mb-2">Recommendations</h4>
            <ul className="space-y-1.5">
              {['Schedule radio protocol refresher', 'Update equipment checklist', 'Run scenario drill next watch'].map((rec) => (
                <li key={rec} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Sparkles className="w-3 h-3 text-violet-500 mt-0.5 shrink-0" />{rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
