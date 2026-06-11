import Link from 'next/link'
import dynamic from 'next/dynamic'
import {
  BarChart2, Cloud, HelpCircle, MessageCircle, ClipboardList, Sparkles,
  ArrowRight, Users, CheckCircle2, Flame, Siren,
  Radio, Shield, Anchor, Search, Building2, Lock, FileText, Check, Zap,
  Heart, Target, ShieldCheck, Eye, Brain, Monitor, Layers, MousePointerClick, Star,
} from 'lucide-react'
import { ScrollReveal } from '@/components/home/ScrollReveal'
import { SpotlightCard } from '@/components/home/SpotlightCard'
import { CountUp } from '@/components/home/CountUp'
import { ScrollProgress } from '@/components/home/ScrollProgress'
import { JoinCodeInput } from '@/components/join/JoinCodeInput'
import { HomepageClient } from '@/components/home/HomepageClient'
import { AuthCTAButton } from '@/components/home/AuthCTAButton'
import { FloatingJoinDock } from '@/components/join/FloatingJoinDock'
import { FaqAccordion } from '@/components/home/FaqAccordion'

/* ── LAZY-LOADED BELOW/INTERACTIVE CHUNKS ── */
const HeroMockup = dynamic(
  () => import('@/components/home/HeroMockup').then((m) => ({ default: m.HeroMockup })),
  { loading: () => <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] h-[340px] w-full animate-pulse" aria-hidden="true" /> }
)
const TestimonialMarquee = dynamic(
  () => import('@/components/home/TestimonialMarquee').then((m) => ({ default: m.TestimonialMarquee })),
  { loading: () => <div className="h-72" aria-hidden="true" /> }
)

/* ── HELPERS ── */

// Maps a tailwind text-color class to an rgba glow for the spotlight effect.
function glowFor(colorClass: string): string {
  if (colorClass.includes('red')) return 'rgba(239,68,68,0.12)'
  if (colorClass.includes('emerald')) return 'rgba(16,185,129,0.12)'
  if (colorClass.includes('violet')) return 'rgba(139,92,246,0.12)'
  if (colorClass.includes('blue')) return 'rgba(59,130,246,0.12)'
  if (colorClass.includes('amber')) return 'rgba(245,158,11,0.12)'
  if (colorClass.includes('sky')) return 'rgba(14,165,233,0.12)'
  if (colorClass.includes('rose')) return 'rgba(244,63,94,0.12)'
  return 'rgba(239,68,68,0.10)'
}

// Resolve a tailwind text-color token to a hex for inline accents.
function hexFor(colorClass: string): string {
  if (colorClass.includes('red')) return '#dc2626'
  if (colorClass.includes('emerald')) return '#10b981'
  if (colorClass.includes('violet')) return '#8b5cf6'
  if (colorClass.includes('blue')) return '#3b82f6'
  if (colorClass.includes('amber')) return '#f59e0b'
  if (colorClass.includes('sky')) return '#0ea5e9'
  if (colorClass.includes('rose')) return '#f43f5e'
  return '#dc2626'
}

/* ── DATA ── */

const BENTO_FEATURES = [
  {
    icon: BarChart2,
    label: 'Live Interaction',
    title: 'Every voice heard',
    description: 'Run live polls, word clouds, and Q&A that engage your entire team. Responses appear instantly with animated visualisations.',
    color: 'text-red-500',
    span: 'md:col-span-2 md:row-span-2',
  },
  {
    icon: ShieldCheck,
    label: 'Anonymous & Secure',
    title: 'Speak without fear',
    description: 'Fully anonymous responses. No names, no judgement. Your team can be honest about what matters.',
    color: 'text-emerald-500',
    span: 'md:col-span-1 md:row-span-1',
  },
  {
    icon: Brain,
    label: 'AI-Powered',
    title: 'Instant AI analysis',
    description: 'Auto-generated summaries, key themes, and sentiment analysis after every session.',
    color: 'text-violet-500',
    span: 'md:col-span-1 md:row-span-1',
  },
  {
    icon: HelpCircle,
    label: 'Knowledge Testing',
    title: 'Test understanding',
    description: 'Timed quizzes with leaderboards and scoring. Perfect for competency checks and CPD assessments.',
    color: 'text-blue-500',
    span: 'md:col-span-1 md:row-span-1',
  },
  {
    icon: Eye,
    label: 'Real-time Results',
    title: 'See it live',
    description: 'Watch responses flow in with animated bar charts, word clouds, and live vote tallies.',
    color: 'text-amber-500',
    span: 'md:col-span-1 md:row-span-1',
  },
  {
    icon: FileText,
    label: 'Export & Compliance',
    title: 'Audit-ready records',
    description: 'Export session data as CSV or PDF for training records, compliance documentation, and evaluation logs.',
    color: 'text-sky-500',
    span: 'md:col-span-1',
  },
]

const SLIDE_TYPES = [
  { icon: BarChart2, label: 'Live Polling', description: 'Gauge opinions and readiness with animated bar charts.', color: 'text-red-500', bg: 'bg-red-50' },
  { icon: Cloud, label: 'Word Clouds', description: 'Capture collective sentiment with growing word clouds.', color: 'text-sky-500', bg: 'bg-sky-50' },
  { icon: HelpCircle, label: 'Quizzes', description: 'Scored, timed knowledge checks with leaderboards.', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { icon: MessageCircle, label: 'Q&A', description: 'Anonymous questions with upvoting and moderation.', color: 'text-amber-500', bg: 'bg-amber-50' },
  { icon: ClipboardList, label: 'Surveys', description: 'Multi-question feedback forms for structured data.', color: 'text-rose-500', bg: 'bg-rose-50' },
  { icon: Sparkles, label: 'AI Insights', description: 'AI summaries, quiz generation, and session analysis.', color: 'text-violet-500', bg: 'bg-violet-50' },
]

const STEPS = [
  { n: '01', title: 'Create your session', desc: 'Build interactive slides with polls, quizzes, word clouds, and Q&A. Use a template or start from scratch.', icon: FileText },
  { n: '02', title: 'Launch a live session', desc: 'Share a 6-digit code or QR at your briefing. Crew join instantly on any device — no app or account needed.', icon: Zap },
  { n: '03', title: 'See results instantly', desc: 'Review live results, get AI summaries, and export data for evaluation records and learning logs.', icon: BarChart2 },
]

const USE_CASES = [
  { icon: Flame, label: 'Fire & Rescue', slug: 'fire-rescue', desc: 'Safety briefings, incident debriefs, and operational learning.', color: '#f97316', bg: 'bg-orange-50', text: 'text-orange-600' },
  { icon: Shield, label: 'Police', slug: 'police', desc: 'Training days, knowledge checks, and community engagement.', color: '#3b82f6', bg: 'bg-blue-50', text: 'text-blue-600' },
  { icon: Siren, label: 'Ambulance', slug: 'ambulance', desc: 'Clinical updates, CPD sessions, and crew welfare checks.', color: '#10b981', bg: 'bg-emerald-50', text: 'text-emerald-600' },
  { icon: Target, label: 'Armed Forces', slug: 'armed-forces', desc: 'Operational readiness, doctrine training, and lessons learned.', color: '#64748b', bg: 'bg-slate-100', text: 'text-slate-600' },
  { icon: Anchor, label: 'HM Coastguard', slug: 'coastguard', desc: 'Safety training, equipment checks, and incident reviews.', color: '#0ea5e9', bg: 'bg-sky-50', text: 'text-sky-600' },
  { icon: Search, label: 'Search & Rescue', slug: 'search-rescue', desc: 'Scenario learning, volunteer training, and skills checks.', color: '#f59e0b', bg: 'bg-amber-50', text: 'text-amber-600' },
  { icon: Lock, label: 'Prison & Probation', slug: 'prison-probation', desc: 'Staff training, incident reviews, and compliance checks.', color: '#71717a', bg: 'bg-zinc-100', text: 'text-zinc-600' },
  { icon: Building2, label: 'Local Authority', slug: 'local-authority', desc: 'Emergency planning, business continuity, and team training.', color: '#8b5cf6', bg: 'bg-violet-50', text: 'text-violet-600' },
  { icon: Radio, label: 'Civil Contingencies', slug: 'civil-contingencies', desc: 'Multi-agency exercises, resilience planning, and debriefs.', color: '#ef4444', bg: 'bg-red-50', text: 'text-red-600' },
  { icon: Heart, label: 'NHS Emergency Departments', slug: 'nhs-emergency', desc: 'Clinical governance, major incident training, and team briefings.', color: '#ec4899', bg: 'bg-pink-50', text: 'text-pink-600' },
  { icon: Users, label: 'Voluntary Sector', slug: 'voluntary-sector', desc: 'Volunteer inductions, skills development, and safeguarding training.', color: '#14b8a6', bg: 'bg-teal-50', text: 'text-teal-600' },
]

const TEMPLATE_EXAMPLES = [
  'Hot debriefs', 'Safety briefings', 'Incident command refreshers', 'Operational learning',
  'Welfare & fatigue checks', 'Risk assessments', 'New joiner onboarding', 'Skills & knowledge checks',
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

const TRUST_LOGOS = [
  { icon: Flame, label: 'Fire & Rescue' },
  { icon: Shield, label: 'Police' },
  { icon: Siren, label: 'Ambulance' },
  { icon: Target, label: 'Armed Forces' },
  { icon: Radio, label: 'Resilience' },
  { icon: Building2, label: 'Local Authority' },
]

/* ── STRUCTURED DATA ── */
const SOFTWARE_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Command 360',
  applicationCategory: 'PresentationApplication',
  description: 'Interactive training and briefing platform for emergency services.',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
}
const FAQ_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

/* ── PAGE ── */

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white text-slate-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SOFTWARE_JSONLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSONLD) }} />

      <ScrollProgress />
      <HomepageClient />

      <main>
        {/* ═══════════════════════════════════════════
            HERO — dark, two-column
            ═══════════════════════════════════════════ */}
        <section className="relative bg-[#07070a] overflow-hidden" aria-label="Introduction">
          {/* Background layers */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_70%_at_15%_-10%,rgba(220,38,38,0.28),transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_85%_10%,rgba(249,115,22,0.10),transparent_55%)] float-glow" />
            {/* Cool light accent for brightness */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_70%,rgba(59,130,246,0.10),transparent_55%)] float-glow" style={{ animationDelay: '-6s' }} />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_0%,rgba(255,255,255,0.05),transparent_60%)]" />
            {/* Grid */}
            <div
              className="absolute inset-0 opacity-[0.10]"
              style={{
                backgroundImage: 'linear-gradient(rgba(220,38,38,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,0.4) 1px, transparent 1px)',
                backgroundSize: '56px 56px',
                maskImage: 'radial-gradient(ellipse 90% 80% at 30% 30%, black 10%, transparent 80%)',
                WebkitMaskImage: 'radial-gradient(ellipse 90% 80% at 30% 30%, black 10%, transparent 80%)',
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#07070a] to-transparent" />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-5 pt-32 pb-20 md:pt-36 md:pb-28 grid lg:grid-cols-2 gap-12 lg:gap-12 items-center">
            {/* Left — copy + CTAs + join */}
            <div className="text-center lg:text-left">
              <div className="hero-fade-up hero-fade-up-1 inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.1] text-[11px] uppercase tracking-[0.15em] text-white/60 mb-7 font-medium">
                <span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" /><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 shadow-[0_0_8px_2px_rgba(239,68,68,0.5)]" /></span>
                Interactive learning for emergency services
              </div>

              <h1 className="hero-fade-up hero-fade-up-2 text-[clamp(2.3rem,5.5vw,3.8rem)] font-bold tracking-tight leading-[1.07] text-white mb-6">
                Where emergency teams{' '}
                <span className="bg-[linear-gradient(90deg,#f87171,#ef4444,#f97316,#ef4444,#f87171)] gradient-text gradient-text-flow">learn, grow, and lead.</span>
              </h1>

              <p className="hero-fade-up hero-fade-up-3 text-base md:text-lg text-white/55 max-w-xl mx-auto lg:mx-0 leading-relaxed mb-9">
                An interactive training environment that turns briefings, debriefs, and CPD into engaging
                learning. Live polls, quizzes, and AI insights — building knowledge and confidence together.
              </p>

              <div className="hero-fade-up hero-fade-up-4 flex flex-col sm:flex-row items-center lg:items-start lg:justify-start justify-center gap-3">
                <AuthCTAButton tab="register" label="Start free trial" />
                <a href="#how-it-works" className="inline-flex items-center gap-2 px-7 h-12 rounded-xl text-sm font-medium border border-white/[0.12] text-white/70 hover:text-white hover:border-white/[0.25] hover:bg-white/[0.04] transition-all duration-200 cursor-pointer">
                  See how it works <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              <div id="hero-join" className="hero-fade-up hero-fade-up-5 mt-9 flex flex-col items-center lg:items-start gap-3">
                <p className="text-white/35 text-[10px] uppercase tracking-[0.2em] font-medium flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                  </span>
                  Got a join code?
                </p>
                <JoinCodeInput variant="hero" />
              </div>

              <p className="hero-fade-up hero-fade-up-5 mt-7 text-[11px] text-white/30 flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-1">
                <span className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-400" /> No app to install</span>
                <span className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-400" /> No account for participants</span>
                <span className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-400" /> UK-hosted &amp; GDPR ready</span>
              </p>
            </div>

            {/* Right — animated product preview */}
            <div className="relative hero-fade-up hero-fade-up-4 lg:pl-4">
              <div className="absolute inset-0 -m-10 pointer-events-none" aria-hidden="true">
                <div className="absolute inset-0 bg-red-500/[0.14] blur-[90px] rounded-full glow-sweep" />
                <div className="absolute inset-0 bg-blue-500/[0.08] blur-[80px] rounded-full float-glow" style={{ animationDelay: '-4s' }} />
              </div>

              <div className="relative border-beam max-w-md mx-auto lg:mx-0 lg:ml-auto">
                <HeroMockup />
              </div>

              {/* Floating accent chips — add lightness + life */}
              <div className="hidden sm:flex float-bob absolute -top-4 -left-2 lg:left-2 items-center gap-2 px-3 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 shadow-lg shadow-black/30" aria-hidden="true">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-medium text-white/90">32 crew connected</span>
              </div>
              <div className="hidden sm:flex float-bob absolute -bottom-3 right-0 lg:-right-3 items-center gap-2 px-3 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 shadow-lg shadow-black/30" style={{ animationDelay: '-2.5s' }} aria-hidden="true">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="text-[11px] font-medium text-white/90">+100 pts</span>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            TRUST STRIP — light
            ═══════════════════════════════════════════ */}
        <section className="bg-[#fafafa] border-y border-slate-200/70" aria-label="Trusted by emergency services">
          <div className="max-w-5xl mx-auto px-5 py-12">
            <ScrollReveal className="text-center">
              <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-semibold mb-7">Trusted by emergency services across the UK</p>
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
                {TRUST_LOGOS.map((item) => (
                  <span key={item.label} className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-700 transition-colors duration-300 cursor-default">
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </span>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            BENTO FEATURES — light
            ═══════════════════════════════════════════ */}
        <section id="features" className="bg-white py-20 md:py-28 relative overflow-hidden">
          <div className="relative max-w-5xl mx-auto px-5">
            <ScrollReveal className="text-center mb-14">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[10px] uppercase tracking-[0.2em] text-blue-600 font-semibold">Command Classroom</span>
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight mt-5 text-slate-900">Everything you need to engage your team</h2>
              <p className="text-slate-500 mt-4 max-w-lg mx-auto text-sm">Six powerful tools in one secure environment, designed for the realities of operational training.</p>
            </ScrollReveal>

            <ScrollReveal stagger>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {BENTO_FEATURES.map((f) => {
                  const isLarge = f.span.includes('row-span-2')
                  const hex = hexFor(f.color)
                  return (
                    <SpotlightCard
                      key={f.title}
                      glow={glowFor(f.color)}
                      className={`group card-light relative flex flex-col overflow-hidden rounded-2xl cursor-default ${f.span} ${isLarge ? 'p-7' : 'p-5'}`}
                    >
                      <div className="absolute top-0 left-0 right-0 h-px opacity-60" style={{ background: `linear-gradient(90deg, transparent 10%, ${hex}66 50%, transparent 90%)` }} aria-hidden="true" />
                      <div className="flex items-center gap-2.5 mb-3">
                        <div className={`rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 ${isLarge ? 'w-10 h-10' : 'w-8 h-8'}`} style={{ backgroundColor: `${hex}14`, border: `1px solid ${hex}26` }}>
                          <f.icon className={`${isLarge ? 'w-[18px] h-[18px]' : 'w-3.5 h-3.5'} ${f.color}`} />
                        </div>
                        <span className={`text-[9px] uppercase tracking-[0.15em] font-bold ${f.color}`}>{f.label}</span>
                      </div>
                      <h3 className={`font-semibold text-slate-900 mb-1.5 ${isLarge ? 'text-xl md:text-2xl' : 'text-sm'}`}>{f.title}</h3>
                      <p className={`text-slate-500 leading-relaxed mb-3 ${isLarge ? 'text-sm max-w-md' : 'text-xs'}`}>{f.description}</p>
                      <div className="mt-auto flex items-center gap-1.5">
                        {[40, 65, 25, 80, 50].map((w, i) => (
                          <div key={i} className={`rounded-full bg-slate-100 flex-1 ${isLarge ? 'h-1.5' : 'h-1'}`}>
                            <div className="h-full rounded-full transition-all duration-700 group-hover:opacity-100 opacity-50" style={{ width: `${w}%`, backgroundColor: hex }} />
                          </div>
                        ))}
                      </div>
                    </SpotlightCard>
                  )
                })}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            CORE FEATURES — Classroom + Studio — light
            ═══════════════════════════════════════════ */}
        <section className="relative bg-gradient-to-b from-white to-[#fafafa] border-t border-slate-200/70 overflow-hidden">
          <div className="relative max-w-6xl mx-auto px-5 py-20 md:py-28">
            <ScrollReveal className="text-center mb-14">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-semibold">Two Powerful Training Modes</span>
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight mt-5 text-slate-900">Built for how you train</h2>
              <p className="text-slate-500 mt-4 max-w-lg mx-auto text-sm">Whether it&apos;s interactive classroom learning or immersive scenario simulation — Command 360 has you covered.</p>
            </ScrollReveal>

            <ScrollReveal>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Command Classroom */}
                <SpotlightCard glow="rgba(59,130,246,0.10)" className="group rounded-2xl border border-blue-100 bg-blue-50/40 p-6 md:p-8 hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                  <div className="relative">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-[10px] font-bold text-blue-700 uppercase tracking-[0.15em] mb-5">Command Classroom</span>
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3">Interactive Training Sessions</h3>
                    <p className="text-sm text-slate-600 mb-6 leading-relaxed">Run live polls, quizzes, word clouds, and Q&amp;A sessions that engage every team member — all from any device.</p>
                    <div className="space-y-3 mb-6">
                      {[
                        { icon: BarChart2, t: 'Live Interaction', d: 'Polls, word clouds, and Q&A in real time' },
                        { icon: HelpCircle, t: 'Knowledge Assessment', d: 'Timed quizzes with leaderboards and CPD scoring' },
                        { icon: Sparkles, t: 'AI-Powered Insights', d: 'Auto summaries, themes, and sentiment analysis' },
                      ].map((row) => (
                        <div key={row.t} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center shrink-0 mt-0.5"><row.icon className="w-3 h-3 text-blue-600" /></div>
                          <div><p className="text-xs font-semibold text-slate-800">{row.t}</p><p className="text-[10px] text-slate-500">{row.d}</p></div>
                        </div>
                      ))}
                    </div>
                    <Link href="/#services" className="group/btn inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                      Explore services <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </SpotlightCard>

                {/* Command Studio */}
                <SpotlightCard glow="rgba(239,68,68,0.10)" className="group rounded-2xl border border-red-100 bg-red-50/40 p-6 md:p-8 hover:border-red-200 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                  <div className="relative">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 border border-red-200 text-[10px] font-bold text-red-700 uppercase tracking-[0.15em] mb-5">
                      <Monitor className="w-3 h-3" /> Command Studio
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3">Visual Scenario Simulation</h3>
                    <p className="text-sm text-slate-600 mb-6 leading-relaxed">Build interactive training scenarios with layered images, video effects, and real-time event triggers — the most immersive way to train.</p>
                    <div className="space-y-3 mb-6">
                      {[
                        { icon: Layers, t: 'Layer-Based Scenes', d: 'Stack images, videos, and overlays for realism' },
                        { icon: MousePointerClick, t: 'Live Event Triggers', d: 'Control the narrative — fire spread, casualties, conditions' },
                        { icon: Eye, t: 'Real-Time Audience View', d: 'Everyone sees the scene evolve simultaneously' },
                      ].map((row) => (
                        <div key={row.t} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-md bg-red-100 flex items-center justify-center shrink-0 mt-0.5"><row.icon className="w-3 h-3 text-red-600" /></div>
                          <div><p className="text-xs font-semibold text-slate-800">{row.t}</p><p className="text-[10px] text-slate-500">{row.d}</p></div>
                        </div>
                      ))}
                    </div>
                    <Link href="/command-studio" className="group/btn inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700 transition-colors">
                      Learn more <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </SpotlightCard>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            FEATURE DEEP DIVES — light
            ═══════════════════════════════════════════ */}
        <div>
          {[
            {
              badge: 'Live Interaction',
              badgeClass: 'bg-red-50 text-red-600 border-red-100',
              title: 'Every voice heard, every time',
              description: 'Run live polls, word clouds, and Q&A sessions that engage your entire team. Responses appear instantly on the presenter screen with animated visualisations.',
              bullets: ['Live polling with animated bar charts', 'Word clouds that grow in real-time', 'Anonymous Q&A with upvoting', 'Multi-question surveys'],
              mockup: <PollingMockup />,
            },
            {
              badge: 'Knowledge Testing',
              badgeClass: 'bg-blue-50 text-blue-600 border-blue-100',
              title: 'Test understanding instantly',
              description: 'Create timed quizzes with leaderboards and scoring. Perfect for competency checks, CPD assessments, and post-incident learning verification.',
              bullets: ['Scored quizzes with countdown timers', 'Leaderboard rankings after each round', 'Instant correct/wrong feedback', 'Export results for training records'],
              mockup: <QuizMockup />,
            },
            {
              badge: 'AI-Powered',
              badgeClass: 'bg-violet-50 text-violet-600 border-violet-100',
              title: 'AI analysis of every session',
              description: 'Get instant AI-generated summaries, key themes, and sentiment analysis. Understand what your team thinks without reading every individual response.',
              bullets: ['Automatic session summaries', 'Key theme extraction', 'Quiz question generation from any topic', 'Actionable recommendations'],
              mockup: <AIMockup />,
            },
          ].map((feature, idx) => {
            const isReversed = idx % 2 !== 0
            return (
              <section key={feature.title} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'} border-t border-slate-200/70 relative overflow-hidden`}>
                <div className="relative max-w-5xl mx-auto px-5 py-20 md:py-28">
                  <div className={`flex flex-col gap-12 md:gap-16 items-center ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
                    <ScrollReveal direction={isReversed ? 'right' : 'left'} className="flex-1 space-y-5">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.15em] font-bold border ${feature.badgeClass}`}>{feature.badge}</span>
                      <h2 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight text-slate-900">{feature.title}</h2>
                      <p className="text-slate-600 leading-relaxed text-sm">{feature.description}</p>
                      <ul className="space-y-2.5 pt-2">
                        {feature.bullets.map((pt) => (
                          <li key={pt} className="flex items-start gap-3 text-sm text-slate-600">
                            <span className="w-4 h-4 rounded-full bg-red-50 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-2.5 h-2.5 text-red-600" /></span>{pt}
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
            SLIDE TYPES — light
            ═══════════════════════════════════════════ */}
        <section id="slide-types" className="bg-white border-t border-slate-200/70 relative overflow-hidden">
          <div className="relative max-w-5xl mx-auto px-5 py-20 md:py-28">
            <ScrollReveal className="text-center mb-14">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 text-red-600 text-[10px] uppercase tracking-[0.15em] font-semibold border border-red-100">Interactive Tools</span>
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight mt-5 text-slate-900">Six ways to engage your team</h2>
              <p className="text-slate-500 mt-4 max-w-lg mx-auto text-sm">Mix and match any combination in a single training session.</p>
            </ScrollReveal>

            <ScrollReveal stagger>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {SLIDE_TYPES.map((s) => (
                  <SpotlightCard key={s.label} glow={glowFor(s.color)} className="group card-light p-5 rounded-2xl cursor-default relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${hexFor(s.color)}55, transparent)` }} aria-hidden="true" />
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <s.icon className={`w-4 h-4 ${s.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-slate-900">{s.label}</h3>
                        <span className={`text-[9px] uppercase tracking-[0.12em] font-semibold ${s.color} opacity-70`}>Interactive</span>
                      </div>
                    </div>
                    <p className="text-slate-500 text-xs leading-relaxed">{s.description}</p>
                  </SpotlightCard>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            HOW IT WORKS — light
            ═══════════════════════════════════════════ */}
        <section id="how-it-works" className="bg-[#fafafa] border-t border-slate-200/70 relative overflow-hidden">
          <div className="relative max-w-5xl mx-auto px-5 py-20 md:py-28">
            <ScrollReveal className="text-center mb-14">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 text-red-600 text-[10px] uppercase tracking-[0.15em] font-semibold border border-red-100">How It Works</span>
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight mt-5 text-slate-900">Up and running in minutes</h2>
            </ScrollReveal>

            <ScrollReveal stagger>
              <div className="relative grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="hidden md:block absolute top-[60px] left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-transparent via-red-200 to-transparent" aria-hidden="true" />
                {STEPS.map((step, i) => (
                  <SpotlightCard key={step.n} className="relative card-light rounded-2xl p-8 text-center group">
                    <div className="relative mx-auto mb-5">
                      <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                        <step.icon className="w-5 h-5 text-red-600" />
                      </div>
                      <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">{i + 1}</div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-[9px] uppercase tracking-[0.15em] font-bold border border-red-100 mb-3">Step {step.n}</span>
                    <h3 className="text-base font-bold mt-2 mb-3 text-slate-900">{step.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                  </SpotlightCard>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            SERVICES — light
            ═══════════════════════════════════════════ */}
        <section id="services" className="bg-white border-t border-slate-200/70 relative overflow-hidden">
          <div className="relative max-w-5xl mx-auto px-5 py-20 md:py-28">
            <ScrollReveal className="text-center mb-14">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 text-red-600 text-[10px] uppercase tracking-[0.15em] font-semibold border border-red-100">Solutions</span>
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight mt-5 text-slate-900">Purpose-built for every service</h2>
              <p className="text-slate-500 mt-4 max-w-lg mx-auto text-sm">Tailored templates, language, and workflows for operational training.</p>
            </ScrollReveal>

            <ScrollReveal stagger>
              <div className="flex flex-wrap justify-center gap-3">
                {USE_CASES.map((uc) => (
                  <SpotlightCard key={uc.slug} href={`/solutions/${uc.slug}`} glow={`${uc.color}1f`}
                    className="group card-light p-5 rounded-2xl relative overflow-hidden w-full sm:w-[calc(50%-6px)] lg:w-[calc(25%-9px)]"
                  >
                    <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `linear-gradient(90deg, transparent, ${uc.color}80, transparent)` }} aria-hidden="true" />
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <div className={`w-8 h-8 rounded-lg ${uc.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                        <uc.icon className={`w-3.5 h-3.5 ${uc.text}`} />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">{uc.label}</h3>
                    </div>
                    <p className="text-slate-500 text-xs leading-relaxed">{uc.desc}</p>
                  </SpotlightCard>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            OUTCOMES / IMPACT — dark emphasis band
            ═══════════════════════════════════════════ */}
        <section className="relative bg-[#07070a] border-t border-white/[0.04] overflow-hidden" aria-label="Impact">
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(220,38,38,0.10),transparent)]" />
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          </div>
          <div className="relative max-w-5xl mx-auto px-5 py-20 md:py-28">
            <ScrollReveal className="text-center mb-14">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.05] text-white/50 text-[10px] uppercase tracking-[0.15em] font-medium border border-white/[0.1]">Impact</span>
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight mt-5 text-white">Measurable impact on training</h2>
            </ScrollReveal>

            <ScrollReveal stagger>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { value: 3, suffix: 'x', label: 'More participation than hand-raising', desc: 'Everyone contributes, not just the loudest voices.', color: 'from-red-400 to-orange-500', glow: 'rgba(239,68,68,0.14)' },
                  { value: 90, suffix: '%', label: 'Of crews prefer interactive briefings', desc: 'Engagement that keeps your team focused and alert.', color: 'from-blue-400 to-cyan-400', glow: 'rgba(59,130,246,0.14)' },
                  { value: 60, suffix: '%', label: 'Faster feedback vs paper forms', desc: 'Results ready instantly, not after hours of data entry.', color: 'from-emerald-400 to-green-400', glow: 'rgba(16,185,129,0.14)' },
                ].map((s) => (
                  <SpotlightCard key={s.label} glow={s.glow} className="text-center rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 [box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.03)_inset] hover:-translate-y-1 hover:border-white/[0.12] transition-all duration-300">
                    <CountUp value={s.value} suffix={s.suffix} className={`block text-4xl sm:text-5xl font-bold bg-gradient-to-r ${s.color} gradient-text mb-3`} />
                    <p className="font-semibold text-sm text-white/80 mb-2">{s.label}</p>
                    <p className="text-white/40 text-xs">{s.desc}</p>
                  </SpotlightCard>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            TEMPLATES — light
            ═══════════════════════════════════════════ */}
        <section id="templates" className="bg-[#fafafa] border-t border-slate-200/70 relative overflow-hidden">
          <div className="relative max-w-5xl mx-auto px-5 py-20 md:py-28">
            <ScrollReveal className="text-center mb-10">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 text-red-600 text-[10px] uppercase tracking-[0.15em] font-semibold border border-red-100">Templates</span>
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight mt-5 text-slate-900">Start with a ready-made template</h2>
              <p className="text-slate-500 mt-4 max-w-lg mx-auto text-sm">Purpose-built templates for operational training, debriefs, and learning capture.</p>
            </ScrollReveal>

            <div className="relative overflow-hidden">
              <div className="flex gap-3 animate-[marqueeLeft_30s_linear_infinite] hover:[animation-play-state:paused]">
                {[...TEMPLATE_EXAMPLES, ...TEMPLATE_EXAMPLES, ...TEMPLATE_EXAMPLES, ...TEMPLATE_EXAMPLES].map((t, i) => (
                  <span key={`${t}-${i}`} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 whitespace-nowrap shrink-0 hover:border-red-200 hover:text-red-700 hover:shadow-sm transition-all duration-200 cursor-default">
                    <CheckCircle2 className="w-3.5 h-3.5 text-red-500" />
                    {t}
                  </span>
                ))}
              </div>
              <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#fafafa] to-transparent" aria-hidden="true" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#fafafa] to-transparent" aria-hidden="true" />
            </div>
            <div className="text-center mt-8">
              <Link href="/templates" className="group inline-flex items-center gap-2 text-sm text-red-600 font-semibold hover:text-red-700 transition-colors">
                View all templates <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            GET A DEMO + FAQ — light
            ═══════════════════════════════════════════ */}
        <section id="demo" className="relative bg-white border-t border-slate-200/70 overflow-hidden">
          <div className="relative max-w-4xl mx-auto px-5 py-20 md:py-28">
            <ScrollReveal className="text-center">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 text-red-600 text-[10px] uppercase tracking-[0.15em] font-semibold border border-red-100">Get Started</span>
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight mt-5 text-slate-900">Ready to transform your training?</h2>
              <p className="text-slate-500 mt-4 max-w-lg mx-auto text-sm leading-relaxed">
                Book a personalised demo and see how Command 360 can engage your teams, improve knowledge retention, and streamline your training workflow.
              </p>
            </ScrollReveal>

            <ScrollReveal>
              <div className="mt-10 text-center flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/contact" className="group btn-shine inline-flex items-center gap-2 px-7 h-12 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-500 transition-all hover:shadow-lg hover:shadow-red-500/25 cursor-pointer">
                  Book a demo <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <AuthCTAButton tab="register" variant="link" label="Start free trial →" className="text-sm font-semibold text-slate-600 hover:text-slate-900" />
              </div>
            </ScrollReveal>

            <div className="mt-20 max-w-2xl mx-auto">
              <ScrollReveal className="text-center mb-10">
                <h3 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">Frequently asked questions</h3>
              </ScrollReveal>
              <ScrollReveal>
                <FaqAccordion items={FAQ_ITEMS} />
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            TESTIMONIALS — dark
            ═══════════════════════════════════════════ */}
        <section id="testimonials" className="relative bg-[#07070a] border-t border-white/[0.04] overflow-hidden" aria-label="Testimonials">
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-red-500/[0.06] blur-[150px] rounded-full float-glow" />
            <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-blue-500/[0.04] blur-[100px] rounded-full float-glow" style={{ animationDelay: '-6s' }} />
          </div>
          <div className="relative py-20 md:py-28">
            <ScrollReveal className="text-center mb-14 px-5">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.05] text-white/50 text-[10px] uppercase tracking-[0.15em] font-medium border border-white/[0.1]">Testimonials</span>
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight mt-5 text-white">Trusted by those who serve</h2>
              <p className="text-white/40 mt-4 max-w-lg mx-auto text-sm">Hear from emergency service professionals already using Command 360.</p>
            </ScrollReveal>

            <TestimonialMarquee />
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            CTA — dark
            ═══════════════════════════════════════════ */}
        <section className="relative bg-[#07070a] overflow-hidden border-t border-white/[0.04]" aria-label="Get started">
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(220,38,38,0.18),transparent)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(220,38,38,0.08),transparent)]" />
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
          </div>
          <div className="relative max-w-3xl mx-auto px-5 py-24 md:py-32 text-center">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.1] text-[10px] uppercase tracking-[0.15em] text-white/50 font-medium mb-6">
                <span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" /><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 shadow-[0_0_8px_2px_rgba(239,68,68,0.5)]" /></span>
                Get started today
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
                Ready to transform{' '}
                <span className="bg-[linear-gradient(90deg,#f87171,#ef4444,#f97316,#ef4444,#f87171)] gradient-text gradient-text-flow">your training?</span>
              </h2>
              <p className="text-white/45 text-base md:text-lg mb-10 max-w-lg mx-auto">
                Free for 30 days. No credit card required. Built for those who serve.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <AuthCTAButton className="px-8 h-13" />
                <Link href="/contact" className="inline-flex items-center gap-2 px-8 h-13 rounded-xl text-sm font-medium border border-white/[0.12] text-white/70 hover:text-white hover:border-white/[0.25] transition-all duration-200 cursor-pointer">
                  Book a demo
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      {/* ═══════════════════════════════════════════
          FOOTER — dark
          ═══════════════════════════════════════════ */}
      <footer className="border-t border-white/[0.06] relative bg-gradient-to-b from-[#0a0a0e] via-[#0c0c12] to-[#111118]">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(128,128,128,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(128,128,128,0.4) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-red-500/[0.03] blur-[100px] rounded-full" />
        </div>
        <div className="relative max-w-6xl mx-auto px-5 py-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 font-semibold text-sm text-white mb-4">
                <div className="w-6 h-6 bg-red-600 rounded-lg flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                Command 360
              </div>
              <p className="text-xs text-white/35 leading-relaxed">Interactive training platform for emergency services.</p>
              <p className="text-xs text-white/35 mt-2">command360.co.uk</p>
            </div>

            <div>
              <h4 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40 mb-4">Services</h4>
              <ul className="space-y-2 text-xs text-white/35">
                {USE_CASES.map((uc) => (
                  <li key={uc.slug}><Link href={`/solutions/${uc.slug}`} className="hover:text-white transition-colors">{uc.label}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40 mb-4">Platform</h4>
              <ul className="space-y-2.5 text-xs text-white/35">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><Link href="/command-studio" className="hover:text-white transition-colors">Command Studio</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Book a Demo</Link></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40 mb-4">Company</h4>
              <ul className="space-y-2.5 text-xs text-white/35">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/help" className="hover:text-white transition-colors">Help</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40 mb-4">Legal</h4>
              <ul className="space-y-2.5 text-xs text-white/35">
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link></li>
                <li><Link href="/accessibility" className="hover:text-white transition-colors">Accessibility</Link></li>
                <li><Link href="/dpa" className="hover:text-white transition-colors">DPA</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/[0.06] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-red-600/80 rounded-md flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              </div>
              <span className="text-[11px] text-white/30">&copy; 2026 Command 360. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-white/20 font-mono tracking-wide">command360.co.uk</span>
            </div>
          </div>
        </div>
      </footer>

      <FloatingJoinDock />
      <div className="grain-overlay" aria-hidden="true" />
    </div>
  )
}

/* ── INLINE MOCKUP COMPONENTS (light) ── */

function PollingMockup() {
  return (
    <div className="relative group">
      <div className="absolute inset-0 -m-4 bg-red-500/5 blur-2xl rounded-3xl pointer-events-none" aria-hidden="true" />
      <div className="relative rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xl shadow-slate-900/5 transition-transform duration-300 group-hover:-translate-y-1">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 pulse-dot" />
          <span className="text-[11px] font-semibold text-slate-800">Live Poll Results</span>
          <span className="ml-auto text-[10px] text-slate-400">24 responses</span>
        </div>
        <div className="p-5 space-y-4">
          <p className="text-sm font-semibold text-slate-900">Which protocol applies to this scenario?</p>
          {[
            { label: 'Protocol Alpha', pct: 65, barColor: 'bg-red-500' },
            { label: 'Protocol Bravo', pct: 22, barColor: 'bg-red-400' },
            { label: 'Protocol Charlie', pct: 13, barColor: 'bg-red-300' },
          ].map((bar) => (
            <div key={bar.label}>
              <div className="flex justify-between text-[11px] text-slate-500 mb-1.5">
                <span>{bar.label}</span>
                <span className="font-semibold text-slate-700">{bar.pct}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className={`h-full rounded-full ${bar.barColor} transition-all duration-1000 relative shimmer-bar overflow-hidden`} style={{ width: `${bar.pct}%` }} />
              </div>
            </div>
          ))}
          <div className="flex items-center gap-2 pt-2">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Live
            </div>
            <span className="text-[10px] text-slate-400">&middot;</span>
            <span className="text-[10px] text-slate-400">Updated just now</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function QuizMockup() {
  return (
    <div className="relative group">
      <div className="absolute inset-0 -m-4 bg-blue-500/5 blur-2xl rounded-3xl pointer-events-none" aria-hidden="true" />
      <div className="relative rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xl shadow-slate-900/5 transition-transform duration-300 group-hover:-translate-y-1">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-[11px] font-semibold text-slate-800">Knowledge Check</span>
          <span className="ml-auto text-[10px] text-slate-400">&#9201; 0:28</span>
        </div>
        <div className="p-5">
          <p className="text-sm font-semibold text-slate-900 mb-4">What is the maximum safe working height without a harness?</p>
          <div className="space-y-2.5">
            {[
              { label: 'A. 1.8 metres', correct: false },
              { label: 'B. 2.0 metres', correct: true },
              { label: 'C. 2.5 metres', correct: false },
              { label: 'D. 3.0 metres', correct: false },
            ].map((opt) => (
              <div key={opt.label} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm border transition-all ${
                opt.correct
                  ? 'border-green-300 bg-green-50 text-green-700'
                  : 'border-slate-200 text-slate-500'
              }`}>
                {opt.correct ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                )}
                <span>{opt.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between text-[10px] text-slate-400">
            <span>Question 4 of 10</span>
            <span className="text-green-600 font-semibold">+100 pts</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function AIMockup() {
  return (
    <div className="relative group">
      <div className="absolute inset-0 -m-4 bg-violet-500/5 blur-2xl rounded-3xl pointer-events-none" aria-hidden="true" />
      <div className="relative rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xl shadow-slate-900/5 transition-transform duration-300 group-hover:-translate-y-1">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-violet-500" />
          <span className="text-[11px] font-semibold text-slate-800">AI Session Summary</span>
          <span className="ml-auto text-[10px] text-slate-400">Generated in 3s</span>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-2">Key Themes</h4>
            <div className="flex flex-wrap gap-1.5">
              {['Equipment readiness', 'Communication gaps', 'Protocol adherence', 'Team morale'].map((tag) => (
                <span key={tag} className="px-2.5 py-1 rounded-lg bg-violet-50 text-violet-700 text-[10px] font-medium border border-violet-100">{tag}</span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-2">Summary</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              The team demonstrated strong awareness of evacuation procedures. Key areas for improvement include radio communication during multi-floor operations and equipment inventory checks.
            </p>
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-2">Recommendations</h4>
            <ul className="space-y-1.5">
              {['Schedule radio protocol refresher', 'Update equipment checklist', 'Run scenario drill next watch'].map((rec) => (
                <li key={rec} className="flex items-start gap-2 text-xs text-slate-600">
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
