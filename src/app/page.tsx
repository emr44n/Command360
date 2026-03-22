import Link from 'next/link'
import {
  BarChart2, Cloud, HelpCircle, MessageCircle, ClipboardList, Sparkles,
  ArrowRight, Users, CheckCircle2, Flame, Siren,
  Radio, Shield, Anchor, Search, Building2, Lock, FileText, Check, Zap,
  Heart, Globe, Quote, MapPin, Mail, Target,
} from 'lucide-react'
import { ScrollReveal } from '@/components/home/ScrollReveal'
import { JoinCodeInput } from '@/components/join/JoinCodeInput'
import { HomepageClient } from '@/components/home/HomepageClient'
import { FloatingJoinDock } from '@/components/join/FloatingJoinDock'
import { PricingToggle } from '@/components/pricing/PricingToggle'

/* ── DATA ── */

const FEATURES = [
  {
    badge: 'Live Interaction',
    badgeClass: 'bg-red-500/10 text-red-600 dark:bg-red-500/15 dark:text-red-400',
    title: 'Every voice heard, every time',
    description: 'Run live polls, word clouds, and Q&A sessions that engage your entire team. Responses appear instantly on the presenter screen with animated visualisations.',
    bullets: ['Live polling with animated bar charts', 'Word clouds that grow in real-time', 'Anonymous Q&A with upvoting', 'Multi-question surveys'],
  },
  {
    badge: 'Knowledge Testing',
    badgeClass: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400',
    title: 'Test understanding instantly',
    description: 'Create timed quizzes with leaderboards and scoring. Perfect for competency checks, CPD assessments, and post-incident learning verification.',
    bullets: ['Scored quizzes with countdown timers', 'Leaderboard rankings after each round', 'Instant correct/wrong feedback', 'Export results for training records'],
  },
  {
    badge: 'AI-Powered',
    badgeClass: 'bg-violet-500/10 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400',
    title: 'AI analysis of every session',
    description: 'Get instant AI-generated summaries, key themes, and sentiment analysis. Understand what your team thinks without reading every individual response.',
    bullets: ['Automatic session summaries', 'Key theme extraction', 'Quiz question generation from any topic', 'Actionable recommendations'],
  },
]

const SLIDE_TYPES = [
  { icon: BarChart2, label: 'Live Polling', description: 'Gauge opinions and readiness with animated bar charts.', color: 'text-red-500', bg: 'bg-red-500/10' },
  { icon: Cloud, label: 'Word Clouds', description: 'Capture collective sentiment with growing word clouds.', color: 'text-sky-500', bg: 'bg-sky-500/10' },
  { icon: HelpCircle, label: 'Quizzes', description: 'Scored, timed knowledge checks with leaderboards.', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { icon: MessageCircle, label: 'Q&A', description: 'Anonymous questions with upvoting and moderation.', color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { icon: ClipboardList, label: 'Surveys', description: 'Multi-question feedback forms for structured data.', color: 'text-rose-500', bg: 'bg-rose-500/10' },
  { icon: Sparkles, label: 'AI Insights', description: 'AI summaries, quiz generation, and session analysis.', color: 'text-violet-500', bg: 'bg-violet-500/10' },
]

const STEPS = [
  { n: '01', title: 'Create your deck', desc: 'Build interactive slides with polls, quizzes, word clouds, and Q&A. Use a template or start from scratch.', icon: FileText },
  { n: '02', title: 'Launch a live session', desc: 'Share a 6-digit code or QR at your briefing. Crew join instantly on any device — no app or account needed.', icon: Zap },
  { n: '03', title: 'See results instantly', desc: 'Review live results, get AI summaries, and export data for evaluation records and learning logs.', icon: BarChart2 },
]

const USE_CASES = [
  { icon: Flame, label: 'Fire & Rescue', slug: 'fire-rescue', desc: 'Safety briefings, incident debriefs, and operational learning.' },
  { icon: Shield, label: 'Police', slug: 'police', desc: 'Training days, knowledge checks, and community engagement.' },
  { icon: Siren, label: 'Ambulance', slug: 'ambulance', desc: 'Clinical updates, CPD sessions, and crew welfare checks.' },
  { icon: Target, label: 'Armed Forces', slug: 'armed-forces', desc: 'Operational readiness, doctrine training, and lessons learned.' },
  { icon: Anchor, label: 'HM Coastguard', slug: 'coastguard', desc: 'Safety training, equipment checks, and incident reviews.' },
  { icon: Search, label: 'Search & Rescue', slug: 'search-rescue', desc: 'Scenario learning, volunteer training, and skills checks.' },
  { icon: Lock, label: 'Prison & Probation', slug: 'prison-probation', desc: 'Staff training, incident reviews, and compliance checks.' },
  { icon: Building2, label: 'Local Authority', slug: 'local-authority', desc: 'Emergency planning, business continuity, and team training.' },
  { icon: Radio, label: 'Civil Contingencies', slug: 'civil-contingencies', desc: 'Multi-agency exercises, resilience planning, and debriefs.' },
  { icon: Heart, label: 'NHS Emergency Departments', slug: 'nhs-emergency', desc: 'Clinical governance, major incident training, and team briefings.' },
  { icon: Users, label: 'Voluntary Sector', slug: 'voluntary-sector', desc: 'Volunteer inductions, skills development, and safeguarding training.' },
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
    q: 'How long is the free trial?',
    a: 'The free trial lasts 30 days with full access to all features. No credit card required to start.',
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
    a: 'Command 360 is hosted in the UK, fully GDPR compliant, and we offer a Data Processing Agreement (DPA) for all organisations. Enterprise plans include data residency options.',
  },
]

/* ── PAGE ── */

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'Command 360', applicationCategory: 'PresentationApplication', description: 'Interactive training and briefing platform for emergency services.', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' } }) }} />

      <HomepageClient />

      {/* ═══════════════════════════════════════════
          HERO — Always dark, regardless of theme
          ═══════════════════════════════════════════ */}
      <section className="relative min-h-[95vh] flex flex-col bg-[#07070a] overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(220,38,38,0.15),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_80%,rgba(220,38,38,0.06),transparent)]" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#07070a] to-transparent" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center max-w-4xl mx-auto px-5 pt-32 pb-8">
          {/* Badge */}
          <div className="hero-fade-up hero-fade-up-1 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-[13px] text-white/60 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 pulse-dot" />
            The secure training platform for emergency services
          </div>

          {/* Heading */}
          <h1 className="hero-fade-up hero-fade-up-2 text-[clamp(2.5rem,7vw,4.5rem)] font-bold tracking-tight leading-[1.08] text-white mb-6">
            Brief. Train. Debrief.{' '}
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-red-400 via-red-500 to-orange-500 gradient-text">With confidence.</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-fade-up hero-fade-up-3 text-base md:text-lg text-white/45 max-w-xl leading-relaxed mb-10">
            A specialist environment where your teams can speak openly, test knowledge, and learn together — anonymously and securely. Built exclusively for Fire, Police, Ambulance, and Armed Forces.
          </p>

          {/* CTAs */}
          <div className="hero-fade-up hero-fade-up-4 flex flex-col sm:flex-row items-center gap-3">
            <Link href="/register" className="group inline-flex items-center gap-2 px-7 h-12 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-500 transition-all hover:shadow-lg hover:shadow-red-500/25 cursor-pointer">
              Start free trial <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a href="#how-it-works" className="inline-flex items-center gap-2 px-7 h-12 rounded-xl text-sm font-medium border border-white/[0.12] text-white/70 hover:text-white hover:border-white/[0.25] hover:bg-white/[0.04] transition-all cursor-pointer">
              See how it works
            </a>
          </div>

          {/* Join code section */}
          <div id="hero-join" className="hero-fade-up hero-fade-up-5 mt-10 flex flex-col items-center gap-3">
            <p className="text-white/30 text-xs uppercase tracking-widest font-medium">Have a join code?</p>
            <JoinCodeInput variant="hero" />
          </div>
        </div>

        {/* Product mockup — browser frame */}
        <div className="relative z-10 mx-auto max-w-4xl w-full px-5 mt-8 mb-[-80px] hero-fade-up hero-fade-up-5">
          <div className="absolute inset-0 -m-10 bg-red-500/[0.06] blur-[60px] rounded-full pointer-events-none" />

          <div className="relative rounded-xl border border-white/[0.08] overflow-hidden shadow-2xl shadow-black/60 bg-[#0c0c10]">
            {/* Chrome bar */}
            <div className="flex items-center gap-2 px-4 h-9 bg-white/[0.03] border-b border-white/[0.06]">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]/50" />
              </div>
              <div className="flex-1 max-w-[240px] mx-auto h-5 rounded-md bg-white/[0.04] flex items-center justify-center">
                <span className="text-[9px] text-white/20 font-mono">command360.co.uk/present</span>
              </div>
            </div>

            {/* Presenter view */}
            <div className="aspect-[16/9] p-4 md:p-6 grid grid-cols-1 md:grid-cols-[1fr_180px] gap-4">
              {/* Main slide */}
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-red-500/15 text-red-400 uppercase tracking-wider">Live Poll</span>
                  <span className="text-[9px] text-white/15">Slide 3 of 8</span>
                </div>
                <p className="text-white/90 text-xs md:text-sm font-medium mb-5">Which evacuation protocol applies to this scenario?</p>

                <div className="space-y-2.5 flex-1">
                  {[
                    { label: 'Protocol Alpha', pct: 65 },
                    { label: 'Protocol Bravo', pct: 22 },
                    { label: 'Protocol Charlie', pct: 13 },
                  ].map((bar) => (
                    <div key={bar.label} className="flex items-center gap-2">
                      <div className="flex-1 h-5 md:h-7 rounded-lg bg-white/[0.04] overflow-hidden relative">
                        <div className="absolute inset-y-0 left-0 rounded-lg bg-gradient-to-r from-red-500/30 to-red-500/15 shimmer-bar" style={{ width: `${bar.pct}%` }} />
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[9px] md:text-[10px] text-white/50">{bar.label}</span>
                      </div>
                      <span className="text-[9px] text-white/25 w-7 text-right font-mono">{bar.pct}%</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/[0.03] text-[8px] text-white/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500/70" />24 connected
                  </div>
                  <div className="px-2 py-1 rounded-md bg-white/[0.03] text-[8px] text-white/20">
                    Code: C360-7K
                  </div>
                </div>
              </div>

              {/* Right panel */}
              <div className="hidden md:block border-l border-white/[0.04] pl-4">
                <span className="text-[8px] text-white/15 uppercase tracking-wider font-medium">Responses</span>
                <div className="mt-2 space-y-1">
                  {['Station Officer', 'Crew Manager', 'Watch B', 'FF Jones', 'FF Smith', 'FF Taylor'].map((n) => (
                    <div key={n} className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/[0.02]">
                      <div className="w-3.5 h-3.5 rounded-full bg-white/[0.05]" />
                      <span className="text-[8px] text-white/20 flex-1 truncate">{n}</span>
                      <span className="text-[7px] text-green-400/50">&#10003;</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TRUST STRIP
          ═══════════════════════════════════════════ */}
      <section className="pt-32 pb-20 bg-background">
        <ScrollReveal>
          <div className="max-w-4xl mx-auto px-5 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-8">Trusted by emergency services across the UK</p>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
              {[
                { icon: Flame, label: 'Fire & Rescue' },
                { icon: Shield, label: 'Police' },
                { icon: Siren, label: 'Ambulance' },
                { icon: Target, label: 'Armed Forces' },
                { icon: Radio, label: 'Resilience' },
                { icon: Building2, label: 'Local Authority' },
              ].map((item) => (
                <span key={item.label} className="flex items-center gap-2 text-sm text-muted-foreground/50">
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ═══════════════════════════════════════════
          FEATURE SECTIONS
          ═══════════════════════════════════════════ */}
      <div id="features">
        {FEATURES.map((feature, idx) => {
          const isReversed = idx % 2 !== 0
          const mockups = [<PollingMockup key="poll" />, <QuizMockup key="quiz" />, <AIMockup key="ai" />]

          return (
            <section key={feature.title} className={idx % 2 === 0 ? 'bg-background' : 'bg-muted/40'}>
              <div className="max-w-5xl mx-auto px-5 py-24 md:py-32">
                <div className={`flex flex-col gap-12 md:gap-16 items-center ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
                  {/* Text */}
                  <ScrollReveal direction={isReversed ? 'right' : 'left'} className="flex-1 space-y-5">
                    <span className={`feature-badge ${feature.badgeClass}`}>{feature.badge}</span>
                    <h2 className="text-2xl md:text-4xl font-bold tracking-tight leading-tight">{feature.title}</h2>
                    <p className="text-muted-foreground leading-relaxed text-base">{feature.description}</p>
                    <ul className="space-y-3 pt-2">
                      {feature.bullets.map((pt) => (
                        <li key={pt} className="flex items-start gap-3 text-sm text-muted-foreground">
                          <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />{pt}
                        </li>
                      ))}
                    </ul>
                  </ScrollReveal>

                  {/* Mockup */}
                  <ScrollReveal direction={isReversed ? 'left' : 'right'} className="flex-1 w-full">
                    {mockups[idx]}
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
      <section id="slide-types" className="bg-background">
        <div className="max-w-5xl mx-auto px-5 py-24 md:py-32">
          <ScrollReveal className="text-center mb-14">
            <span className="feature-badge bg-primary/10 text-primary">Interactive Tools</span>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mt-4">Six ways to engage your team</h2>
            <p className="text-muted-foreground mt-4 max-w-lg mx-auto">Mix and match any combination in a single training session.</p>
          </ScrollReveal>

          <ScrollReveal stagger>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SLIDE_TYPES.map((s) => (
                <div key={s.label} className="group p-6 rounded-2xl border border-border bg-card hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all cursor-default">
                  <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-4`}>
                    <s.icon className={`w-5 h-5 ${s.color}`} />
                  </div>
                  <h3 className="font-semibold mb-2">{s.label}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{s.description}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          HOW IT WORKS
          ═══════════════════════════════════════════ */}
      <section id="how-it-works" className="bg-muted/40">
        <div className="max-w-5xl mx-auto px-5 py-24 md:py-32">
          <ScrollReveal className="text-center mb-14">
            <span className="feature-badge bg-primary/10 text-primary">How It Works</span>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mt-4">Up and running in minutes</h2>
          </ScrollReveal>

          <ScrollReveal stagger>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {STEPS.map((step) => (
                <div key={step.n} className="relative bg-card rounded-2xl border border-border p-8 text-center">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                    <step.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs font-bold text-primary/40 uppercase tracking-widest">Step {step.n}</span>
                  <h3 className="text-lg font-bold mt-2 mb-3">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SERVICES (USE CASES) — All 11
          ═══════════════════════════════════════════ */}
      <section id="services" className="bg-background">
        <div className="max-w-5xl mx-auto px-5 py-24 md:py-32">
          <ScrollReveal className="text-center mb-14">
            <span className="feature-badge bg-primary/10 text-primary">Solutions</span>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mt-4">Purpose-built for every service</h2>
            <p className="text-muted-foreground mt-4 max-w-lg mx-auto">Tailored templates, language, and workflows for operational training.</p>
          </ScrollReveal>

          <ScrollReveal stagger>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {USE_CASES.map((uc) => (
                <Link key={uc.slug} href={`/solutions/${uc.slug}`}
                  className="group p-5 rounded-2xl border border-border bg-card hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all">
                  <uc.icon className="w-5 h-5 mb-3 text-primary" />
                  <h3 className="text-sm font-bold mb-1 group-hover:text-primary transition-colors">{uc.label}</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">{uc.desc}</p>
                </Link>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          OUTCOMES / STATS
          ═══════════════════════════════════════════ */}
      <section className="bg-muted/40">
        <div className="max-w-5xl mx-auto px-5 py-24 md:py-32">
          <ScrollReveal className="text-center mb-14">
            <span className="feature-badge bg-primary/10 text-primary">Impact</span>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mt-4">Measurable impact on training</h2>
          </ScrollReveal>

          <ScrollReveal stagger>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { stat: '3x', label: 'More participation than traditional hand-raising', desc: 'Everyone contributes, not just the loudest voices.' },
                { stat: '90%', label: 'Of crews prefer interactive briefings', desc: 'Engagement that keeps your team focused and alert.' },
                { stat: '60%', label: 'Faster feedback capture vs paper forms', desc: 'Results ready instantly, not after hours of data entry.' },
              ].map((s) => (
                <div key={s.label} className="text-center bg-card rounded-2xl border border-border p-8">
                  <p className="text-5xl font-bold text-primary mb-3">{s.stat}</p>
                  <p className="font-semibold text-sm mb-2">{s.label}</p>
                  <p className="text-muted-foreground text-xs">{s.desc}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TEMPLATES
          ═══════════════════════════════════════════ */}
      <section id="templates" className="bg-background">
        <div className="max-w-5xl mx-auto px-5 py-24 md:py-32">
          <ScrollReveal className="text-center mb-10">
            <span className="feature-badge bg-primary/10 text-primary">Templates</span>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mt-4">Start with a ready-made deck</h2>
            <p className="text-muted-foreground mt-4 max-w-lg mx-auto">Purpose-built templates for operational training, debriefs, and learning capture.</p>
          </ScrollReveal>

          <ScrollReveal stagger>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {TEMPLATE_EXAMPLES.map((t) => (
                <span key={t} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card text-sm font-medium hover:border-primary/20 hover:shadow-md transition-all cursor-default">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  {t}
                </span>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/templates" className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline transition-all">
                View all templates <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PRICING
          ═══════════════════════════════════════════ */}
      <section id="pricing" className="bg-muted/40">
        <div className="max-w-5xl mx-auto px-5 py-24 md:py-32">
          <ScrollReveal className="text-center mb-10">
            <span className="feature-badge bg-primary/10 text-primary">Pricing</span>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mt-4">Simple, transparent pricing</h2>
            <p className="text-muted-foreground mt-4 max-w-lg mx-auto">Start free for 30 days. No credit card required.</p>
          </ScrollReveal>

          <ScrollReveal>
            <PricingToggle />
          </ScrollReveal>

          {/* FAQ */}
          <div className="mt-20 max-w-2xl mx-auto">
            <ScrollReveal className="text-center mb-10">
              <h3 className="text-xl md:text-2xl font-bold tracking-tight">Frequently asked questions</h3>
            </ScrollReveal>
            <ScrollReveal stagger>
              <div className="space-y-4">
                {FAQ_ITEMS.map((item) => (
                  <div key={item.q} className="bg-card border border-border rounded-xl p-5">
                    <h4 className="font-semibold text-sm mb-2">{item.q}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TESTIMONIALS
          ═══════════════════════════════════════════ */}
      <section id="testimonials" className="bg-background">
        <div className="max-w-5xl mx-auto px-5 py-24 md:py-32">
          <ScrollReveal className="text-center mb-14">
            <span className="feature-badge bg-primary/10 text-primary">Testimonials</span>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mt-4">Trusted by those who serve</h2>
          </ScrollReveal>

          <ScrollReveal stagger>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {TESTIMONIALS.map((t) => (
                <div key={t.name} className="bg-card border border-border rounded-2xl p-6 flex flex-col">
                  <Quote className="w-8 h-8 text-primary/20 mb-4 shrink-0" />
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <t.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}, {t.org}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          ABOUT
          ═══════════════════════════════════════════ */}
      <section id="about" className="bg-muted/40">
        <div className="max-w-3xl mx-auto px-5 py-24 md:py-32 text-center">
          <ScrollReveal>
            <span className="feature-badge bg-primary/10 text-primary">About</span>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mt-4 mb-6">About Command 360</h2>
            <p className="text-muted-foreground leading-relaxed text-base mb-6">
              Command 360 is based in Birmingham, West Midlands. Our mission is to improve emergency services training through interactive technology that makes every session count.
            </p>
            <p className="text-muted-foreground leading-relaxed text-base mb-6">
              Founded by people who understand operational training, we built Command 360 because we saw first-hand how traditional briefings and debriefs failed to capture every voice. Too often, only the most confident speak up while critical insights go unheard.
            </p>
            <p className="text-muted-foreground leading-relaxed text-base">
              Our platform gives every participant an equal voice through live polls, anonymous Q&A, knowledge checks, and AI-powered analysis — turning passive briefings into genuinely interactive 360-degree training sessions.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CONTACT
          ═══════════════════════════════════════════ */}
      <section id="contact" className="bg-background">
        <div className="max-w-5xl mx-auto px-5 py-24 md:py-32">
          <ScrollReveal className="text-center mb-14">
            <span className="feature-badge bg-primary/10 text-primary">Contact</span>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mt-4">Get in touch</h2>
            <p className="text-muted-foreground mt-4 max-w-lg mx-auto">Have a question or want to see a demo? We&apos;d love to hear from you.</p>
          </ScrollReveal>

          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Map */}
              <div className="rounded-2xl overflow-hidden border border-border h-[320px] md:h-full min-h-[320px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d77965.63652610841!2d-1.9535!3d52.4862!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4870942d1b417173%3A0xca81fef0aeee7998!2sBirmingham%2C%20UK!5e0!3m2!1sen!2suk!4v1710000000000!5m2!1sen!2suk"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Command 360 location — Birmingham, West Midlands"
                />
              </div>

              {/* Contact info */}
              <div className="flex flex-col justify-center space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1">Email</h3>
                    <a href="mailto:hello@command360.co.uk" className="text-muted-foreground text-sm hover:text-primary transition-colors">hello@command360.co.uk</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1">Location</h3>
                    <p className="text-muted-foreground text-sm">Birmingham, West Midlands, UK</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Globe className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1">Website</h3>
                    <p className="text-muted-foreground text-sm">command360.co.uk</p>
                  </div>
                </div>
                <div className="pt-4">
                  <Link href="/contact" className="group inline-flex items-center gap-2 px-6 h-11 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all cursor-pointer">
                    Send us a message <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA — Dark section
          ═══════════════════════════════════════════ */}
      <section className="relative bg-[#07070a] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(220,38,38,0.12),transparent)]" />
        </div>
        <div className="relative max-w-3xl mx-auto px-5 py-24 md:py-32 text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
              Ready to transform your training?
            </h2>
            <p className="text-white/40 text-lg mb-10 max-w-lg mx-auto">
              Free for 30 days. No credit card required. Built for those who serve.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/register" className="group inline-flex items-center gap-2 px-8 h-13 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-500 transition-all hover:shadow-lg hover:shadow-red-500/25 cursor-pointer">
                Start free trial <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 px-8 h-13 rounded-xl text-sm font-medium border border-white/[0.12] text-white/70 hover:text-white hover:border-white/[0.25] transition-all cursor-pointer">
                Book a demo
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════ */}
      <footer className="border-t border-border bg-background">
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
              <h4 className="text-xs font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-xs text-muted-foreground">
                {USE_CASES.map((uc) => (
                  <li key={uc.slug}><Link href={`/solutions/${uc.slug}`} className="hover:text-foreground transition-colors">{uc.label}</Link></li>
                ))}
              </ul>
            </div>

            {/* Platform */}
            <div>
              <h4 className="text-xs font-semibold mb-4">Platform</h4>
              <ul className="space-y-2.5 text-xs text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><Link href="/templates" className="hover:text-foreground transition-colors">Templates</Link></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-xs font-semibold mb-4">Company</h4>
              <ul className="space-y-2.5 text-xs text-muted-foreground">
                <li><a href="#about" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#contact" className="hover:text-foreground transition-colors">Contact</a></li>
                <li><Link href="/help" className="hover:text-foreground transition-colors">Help</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-xs font-semibold mb-4">Legal</h4>
              <ul className="space-y-2.5 text-xs text-muted-foreground">
                <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link></li>
                <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link></li>
                <li><Link href="/cookies" className="hover:text-foreground transition-colors">Cookies</Link></li>
                <li><Link href="/accessibility" className="hover:text-foreground transition-colors">Accessibility</Link></li>
                <li><Link href="/dpa" className="hover:text-foreground transition-colors">DPA</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <p>&copy; 2026 Command 360. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/join" className="hover:text-foreground transition-colors">Join session</Link>
              <Link href="/login" className="hover:text-foreground transition-colors">Sign in</Link>
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
      <div className="relative rounded-2xl border border-border bg-card overflow-hidden shadow-xl dark:shadow-black/20 mockup-card">
        <div className="px-5 py-3 border-b border-border flex items-center gap-2">
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
              <div className="h-2.5 rounded-full bg-muted overflow-hidden">
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
      <div className="relative rounded-2xl border border-border bg-card overflow-hidden shadow-xl dark:shadow-black/20 mockup-card">
        <div className="px-5 py-3 border-b border-border flex items-center gap-2">
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
                  : 'border-border text-muted-foreground'
              }`}>
                {opt.correct && opt.selected ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-border shrink-0" />
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
      <div className="relative rounded-2xl border border-border bg-card overflow-hidden shadow-xl dark:shadow-black/20 mockup-card">
        <div className="px-5 py-3 border-b border-border flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-violet-500" />
          <span className="text-[11px] font-semibold text-foreground">AI Session Summary</span>
          <span className="ml-auto text-[10px] text-muted-foreground">Generated in 3s</span>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Key Themes</h4>
            <div className="flex flex-wrap gap-1.5">
              {['Equipment readiness', 'Communication gaps', 'Protocol adherence', 'Team morale'].map((tag) => (
                <span key={tag} className="px-2.5 py-1 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 text-[10px] font-medium">{tag}</span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Summary</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The team demonstrated strong awareness of evacuation procedures. Key areas for improvement include radio communication during multi-floor operations and equipment inventory checks.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Recommendations</h4>
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
