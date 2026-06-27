import Link from 'next/link'
import { CountUp } from '@/components/home/CountUp'
import { SpotlightCard } from '@/components/home/SpotlightCard'
import { RevealManager } from '@/components/home/RevealManager'
import { RotatingWord } from '@/components/home/RotatingWord'
import { StackedCards } from '@/components/home/StackedCards'
import { TopBar } from '@/components/home/TopBar'
import { ScrollProgress } from '@/components/home/ScrollProgress'
import { TestimonialColumns } from '@/components/home/TestimonialColumns'
import { V5Nav, V5AuthButton } from '@/components/home/V5Chrome'
import { V5Demo } from '@/components/home/V5Demo'
import { HeroShowcase } from '@/components/home/HeroShowcase'
import { JoinCodeInput } from '@/components/join/JoinCodeInput'
import { FaqAccordion } from '@/components/home/FaqAccordion'
import { FloatingJoinDock } from '@/components/join/FloatingJoinDock'
import { FooterWordmark } from '@/components/home/FooterWordmark'

/* ── DATA (canonical Command 360 copy) ── */

const CAPABILITIES = [
  { n: '01', title: 'Live Polls', desc: 'Gauge opinions and readiness with animated bar charts — everyone responds, not just the loudest in the room.', c: '#C9241A' },
  { n: '02', title: 'Scored Quizzes', desc: 'Timed knowledge checks with leaderboards — perfect for competency checks and CPD assessments.', c: '#3E6DC4' },
  { n: '03', title: 'Word Clouds', desc: 'Capture collective sentiment with word clouds that grow in real time — an instant read on the room.', c: '#2E9E63' },
  { n: '04', title: 'Anonymous Q&A', desc: 'Upvoted questions surface the concerns nobody raises face-to-face. No names, no judgement.', c: '#2592a3' },
  { n: '05', title: 'AI Insights', desc: 'Auto-generated summaries, key themes, and sentiment analysis after every session.', c: '#6a5ea8' },
  { n: '06', title: 'Scenario Studio', desc: 'Layered images and video with live event triggers — the most immersive way to train.', c: '#C9241A', badge: 'NEW', href: '/command-studio' },
]

const DOCTRINE_BOXES = [
  'Anonymous responses', 'Scored & ranked', 'Fully recorded', 'CSV & PDF export',
  'UK-hosted', 'GDPR & DPA ready', 'No app for crew',
]

const LIFECYCLE = [
  {
    n: '01', tag: 'Brief', title: 'Set the scene', c: '#D94B3D',
    desc: 'Build the session from a template, issue a join code, and bring every crew member onto the same page — on any device.',
    points: ['Pick from 40+ ready templates', 'Issue a 6-digit join code or QR', 'Works on any device — no app', 'Brief the whole watch at once'],
    meta: { k: 'Setup time', v: '< 2 min' },
  },
  {
    n: '02', tag: 'Engage', title: 'Run it live', c: '#3E6DC4',
    desc: 'Polls, quizzes, word clouds, and anonymous Q&A — responses land instantly on the presenter screen as the session unfolds.',
    points: ['Live polls & scored quizzes', 'Word clouds & anonymous Q&A', 'Responses land in real time', 'Presenter stays fully in control'],
    meta: { k: 'Avg participation', v: '94%' },
  },
  {
    n: '03', tag: 'Debrief', title: 'Record & act', c: '#2E9E63',
    desc: 'An AI summary, key themes, and recommendations — exported to your training records in seconds, ready for the next watch.',
    points: ['AI summary & key themes', 'Sentiment read on the room', 'Actions flagged automatically', 'Export to CSV or PDF'],
    meta: { k: 'Summary in', v: '3 sec' },
  },
]

const IMPACT = [
  { value: 3, suffix: '×', label: 'Participation vs hand-raising', accent: true },
  { value: 90, suffix: '%', label: 'Prefer interactive briefings', accent: false },
  { value: 60, suffix: '%', label: 'Faster than paper forms', accent: false },
  { value: 3, suffix: 's', label: 'To an AI session summary', accent: false },
]

const STEPS = [
  { n: '01', title: 'Create your session', desc: 'Build interactive slides with polls, quizzes, word clouds, and Q&A — from a template or from scratch.', accent: true },
  { n: '02', title: 'Launch a live session', desc: 'Crew join on any device with a 6-digit code or QR at your briefing — no app, no account needed.', accent: false },
  { n: '03', title: 'See results instantly', desc: 'Review live results, get AI summaries, and export data for evaluation records and learning logs.', accent: false },
]

const USE_CASES = [
  { label: 'Fire & Rescue', slug: 'fire-rescue', desc: 'Safety briefings, incident debriefs, and operational learning.', color: '#f97316' },
  { label: 'Police', slug: 'police', desc: 'Training days, knowledge checks, and community engagement.', color: '#3b82f6' },
  { label: 'Ambulance', slug: 'ambulance', desc: 'Clinical updates, CPD sessions, and crew welfare checks.', color: '#10b981' },
  { label: 'Armed Forces', slug: 'armed-forces', desc: 'Operational readiness, doctrine training, and lessons learned.', color: '#94a3b8' },
  { label: 'HM Coastguard', slug: 'coastguard', desc: 'Safety training, equipment checks, and incident reviews.', color: '#0ea5e9' },
  { label: 'Search & Rescue', slug: 'search-rescue', desc: 'Scenario learning, volunteer training, and skills checks.', color: '#f59e0b' },
  { label: 'Prison & Probation', slug: 'prison-probation', desc: 'Staff training, incident reviews, and compliance checks.', color: '#a1a1aa' },
  { label: 'Local Authority', slug: 'local-authority', desc: 'Emergency planning, business continuity, and team training.', color: '#8b5cf6' },
  { label: 'Civil Contingencies', slug: 'civil-contingencies', desc: 'Multi-agency exercises, resilience planning, and debriefs.', color: '#ef4444' },
  { label: 'NHS Emergency', slug: 'nhs-emergency', desc: 'Clinical governance, major incident training, and team briefings.', color: '#ec4899' },
  { label: 'Voluntary Sector', slug: 'voluntary-sector', desc: 'Volunteer inductions, skills development, and safeguarding.', color: '#14b8a6' },
]

const TEMPLATE_EXAMPLES = [
  'Hot debriefs', 'Safety briefings', 'Incident command refreshers', 'Operational learning',
  'Welfare & fatigue checks', 'Risk assessments', 'New joiner onboarding', 'Skills & knowledge checks',
]


const FAQ_ITEMS = [
  { q: 'Is Command 360 free to use?', a: 'Yes. Command 360 is completely free to get started with no credit card required. Simply create an account and start building sessions right away.' },
  { q: 'Do participants need to create an account?', a: 'No. Participants simply enter a 6-digit join code on any device with a web browser. No app download or account creation needed.' },
  { q: 'Can I export session data for training records?', a: 'Yes. All session results, quiz scores, and AI summaries can be exported as CSV or PDF for your training records and compliance documentation.' },
  { q: 'Is Command 360 suitable for multi-agency exercises?', a: 'Absolutely. Command 360 is regularly used for multi-agency exercises involving fire, police, ambulance, and local authority teams working together.' },
  { q: 'What about data security and GDPR?', a: 'Command 360 is hosted in the UK, fully GDPR compliant, and we offer a Data Processing Agreement (DPA) for all organisations. Contact us for data residency options.' },
]

const TRUST = [
  { label: 'Fire & Rescue', c: '#D94B3D' }, { label: 'Police', c: '#3E6DC4' }, { label: 'Ambulance', c: '#2E9E63' },
  { label: 'Armed Forces', c: '#8a7d3a' }, { label: 'Coastguard', c: '#2592a3' }, { label: 'Local Authority', c: '#6a5ea8' },
]

/* ── STRUCTURED DATA ── */
const SOFTWARE_JSONLD = {
  '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'Command 360',
  applicationCategory: 'PresentationApplication',
  description: 'Interactive training and briefing platform for emergency services.',
  operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
}
const FAQ_JSONLD = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
}

/* ── PRESENTATIONAL HELPERS ── */
function Eyebrow({ children, n }: { children: React.ReactNode; n?: string }) {
  return (
    <div className="ff-mono text-[12px] font-semibold tracking-[0.12em] uppercase text-[#C9241A]" data-reveal>
      {n && <span>{n} — </span>}{children}
    </div>
  )
}

/* ── PAGE ── */
export default function LandingPage() {
  return (
    <div className="v5 relative min-h-screen" id="top">
      <div className="fixed inset-0 -z-10 bg-[#0F1216]" aria-hidden="true" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SOFTWARE_JSONLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSONLD) }} />

      <RevealManager />
      <ScrollProgress />
      <TopBar />
      <V5Nav />

      <main>
        {/* ════════════ HERO ════════════ */}
        <header className="relative overflow-hidden bg-[#0F1216] text-white" aria-label="Introduction">
          {/* pure-black fade from the very top (under the black ticker bar)
              down into the hero, so it eases into the grid below */}
          <div className="absolute top-0 left-0 right-0 h-[66%] pointer-events-none" aria-hidden="true"
            style={{ background: 'linear-gradient(180deg, #000 0%, #000 6%, rgba(0,0,0,0.55) 28%, rgba(0,0,0,0.16) 60%, transparent 100%)' }} />
          <div className="absolute bottom-[-180px] left-1/2 -translate-x-1/2 w-[1280px] h-[720px] pointer-events-none" aria-hidden="true"
            style={{ background: 'radial-gradient(60% 80% at 50% 100%,rgba(201,36,26,.22),rgba(201,36,26,.06) 48%,transparent 78%)', filter: 'blur(38px)' }} />
          <div className="absolute inset-0 v5-grain opacity-[0.16] mix-blend-overlay pointer-events-none" aria-hidden="true" />
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.055) 1px,transparent 1px)', backgroundSize: '74px 74px', maskImage: 'radial-gradient(1600px 920px at 32% 2%,#000,transparent 88%)', WebkitMaskImage: 'radial-gradient(1600px 920px at 32% 2%,#000,transparent 88%)' }} />

          {/* rotating seal */}
          <div className="hidden lg:flex absolute top-[96px] right-[38px] z-[4] w-[104px] h-[104px] items-center justify-center" aria-hidden="true">
            <svg viewBox="0 0 100 100" className="v5-seal absolute inset-0 w-full h-full">
              <defs><path id="sealpath" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" /></defs>
              <text className="ff-mono" fontSize="8.6" letterSpacing="2.4" fill="#8b9099"><textPath href="#sealpath">COMMAND 360 · INTERACTIVE TRAINING · </textPath></text>
            </svg>
            <span className="w-[9px] h-[9px] bg-[#C9241A]" style={{ boxShadow: '0 0 0 6px rgba(201,36,26,.18)' }} />
          </div>

          <div className="relative max-w-[1280px] mx-auto px-5 sm:px-[30px] pt-[104px]">
            <div className="grid lg:grid-cols-[1.05fr_0.95fr] border-x border-white/10">
              {/* Left */}
              <div className="pb-14 lg:py-[56px] lg:pr-12 lg:border-r border-white/10">
                <div className="flex items-center gap-3 ff-mono text-[12px] font-medium tracking-[0.14em] uppercase text-[#9aa0a8] mb-7" data-reveal>
                  <span className="w-[7px] h-[7px] bg-[#C9241A] v5-pulse" />
                  Interactive learning · UK emergency services
                </div>
                <h1 className="ff-display font-extrabold text-white mb-7 leading-[0.98] tracking-[-0.02em] text-[clamp(44px,5.4vw,74px)] lg:pl-9" data-reveal>
                  Where emergency<br />teams{' '}
                  <RotatingWord words={['learn.', 'grow.', 'lead.']} className="text-[#C9241A] underline decoration-[3px] underline-offset-[10px] decoration-[#C9241A]/45" />
                </h1>
                <p className="text-[18px] leading-[1.62] text-[#aab0b8] max-w-[500px] mb-9 lg:pl-9" data-reveal>
                  An interactive training environment that turns briefings, debriefs, and CPD into measured,
                  interactive learning — live polls, scored quizzes, and AI insight, with a full record for every session.
                </p>
                <div className="flex flex-wrap items-center gap-3 mb-8 lg:pl-9" data-reveal>
                  <V5AuthButton tab="register" label="Start free trial" variant="solid" />
                  <a href="#demo" className="ff-mono text-[13px] font-semibold uppercase tracking-[0.05em] text-white border border-white/22 hover:bg-white/[0.06] hover:border-white/40 px-6 py-4 transition-colors">View demo</a>
                </div>
                <div id="hero-join" className="max-w-[400px] lg:pl-9" data-reveal>
                  <div className="ff-mono text-[11px] font-medium tracking-[0.1em] uppercase text-[#7c828a] mb-2.5">Joining a session?</div>
                  <JoinCodeInput variant="v5" />
                  <div className="ff-mono text-[11px] text-white/35 mt-3 flex flex-wrap gap-x-4 gap-y-1">
                    <span>No app to install</span><span>·</span><span>No account for crew</span><span>·</span><span>UK-hosted &amp; GDPR ready</span>
                  </div>
                </div>
              </div>

              {/* Right — live session panel that cycles every feature */}
              <div className="relative min-h-[560px]">
                <HeroShowcase />
              </div>
            </div>
          </div>

          {/* agency chips strip */}
          <div className="relative border-t border-white/10">
            <div className="max-w-[1280px] mx-auto px-5 sm:px-[30px]">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 border-l border-white/10">
                {TRUST.map((t) => (
                  <div key={t.label} className="px-[18px] py-4 border-r border-white/10 flex items-center gap-2">
                    <span className="w-2 h-2" style={{ background: t.c }} />
                    <span className="ff-mono text-[11px] font-medium tracking-[0.04em] text-[#cfd3d8]">{t.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* ════════════ 01 CAPABILITIES (light) ════════════ */}
        <section id="capabilities" className="bg-[#EFECE4] text-[#16191E] pt-[90px] pb-[100px]">
          <div className="max-w-[1280px] mx-auto px-5 sm:px-[30px]">
            <div className="flex items-end justify-between gap-8 flex-wrap mb-3.5">
              <div className="max-w-[620px]" data-reveal>
                <Eyebrow n="01">Capabilities</Eyebrow>
                <h2 className="ff-display font-extrabold text-[clamp(30px,3.8vw,48px)] leading-none tracking-[-0.02em] mt-4 text-[#16191E]">One toolkit for every kind of session</h2>
              </div>
              <p className="text-[16px] text-[#5a5f66] max-w-[360px] mb-1.5" data-reveal>Six interactive tools in one secure, UK-hosted environment — built for the realities of operational training.</p>
            </div>
            <div className="h-0.5 bg-[#16191E] origin-left" data-rule />
            <div className="grid sm:grid-cols-2 md:grid-cols-3 border-l border-[rgba(20,25,30,0.16)]">
              {CAPABILITIES.map((cap) => {
                const inner = (
                  <>
                    <div className="absolute inset-0 v5-grain opacity-[0.05] mix-blend-multiply pointer-events-none" aria-hidden="true" />
                    <div className="relative">
                      <div className="flex items-center justify-between mb-[22px]">
                        <span className="ff-display font-extrabold text-[15px] text-[#b9b3a5]">{cap.n}</span>
                        {cap.badge
                          ? <span className="ff-mono text-[9px] font-semibold tracking-[0.08em] text-[#C9241A] border border-[#C9241A] px-1.5 py-0.5">{cap.badge}</span>
                          : <span className="w-[9px] h-[9px]" style={{ background: cap.c }} />}
                      </div>
                      <h3 className="ff-display font-bold text-[21px] tracking-[-0.01em] mb-2.5 text-[#16191E]">{cap.title}</h3>
                      <p className="text-[14.5px] text-[#5a5f66]">{cap.desc}</p>
                    </div>
                  </>
                )
                const cls = 'v5-card group relative overflow-hidden p-[34px_30px] border-r border-b border-[rgba(20,25,30,0.16)] block'
                const style = { ['--v5-wash' as string]: `${cap.c}24` }
                return cap.href ? (
                  <SpotlightCard key={cap.n} href={cap.href} glow={`${cap.c}26`} className={cls} >
                    <span style={style} className="absolute inset-0 pointer-events-none" aria-hidden="true" />
                    {inner}
                  </SpotlightCard>
                ) : (
                  <SpotlightCard key={cap.n} glow={`${cap.c}26`} className={`${cls} cursor-default`}>
                    <span style={style} className="absolute inset-0 pointer-events-none" aria-hidden="true" />
                    {inner}
                  </SpotlightCard>
                )
              })}
            </div>
          </div>
        </section>

        {/* ════════════ 02 DOCTRINE (dark) ════════════ */}
        <section className="relative overflow-hidden bg-[#0F1216] text-white py-[100px]">
          <div className="absolute top-[-160px] right-[-120px] w-[860px] h-[660px] pointer-events-none" aria-hidden="true"
            style={{ background: 'radial-gradient(55% 65% at 70% 30%,rgba(201,36,26,.17),transparent 76%)', filter: 'blur(46px)' }} />
          <div className="absolute inset-0 v5-grain opacity-[0.14] mix-blend-overlay pointer-events-none" aria-hidden="true" />
          <div className="relative max-w-[1280px] mx-auto px-5 sm:px-[30px]">
            <Eyebrow n="02">Doctrine</Eyebrow>
            <div className="grid lg:grid-cols-[1.5fr_1fr] gap-[54px] items-center mt-7">
              <h2 className="ff-display font-extrabold text-[clamp(30px,4.4vw,58px)] leading-[1.04] tracking-[-0.02em] text-[#8a9099]">
                {[
                  ['Every', '#fff'], ['briefing', '#fff'], ['becomes', '#fff'], ['a', '#8a9099'],
                  ['measured,', '#fff'], ['accountable', '#C9241A'], ['act', '#8a9099'], ['of', '#8a9099'],
                  ['shared', '#fff'], ['learning.', '#fff'],
                ].map(([w, c], i) => (
                  <span key={i} data-word className="inline-block" style={{ color: c as string, ['--rd' as string]: `${i * 70}ms`, marginRight: '0.22em' }}>{w}</span>
                ))}
              </h2>
              <div className="border-t border-l border-white/14">
                {DOCTRINE_BOXES.map((b, i) => (
                  <div key={b} data-reveal style={{ ['--rd' as string]: `${i * 110}ms` }} className="group v5-pop cursor-default flex items-center gap-3 px-[18px] py-3.5 border-r border-b border-white/14">
                    <span className="ff-display font-extrabold text-[13px] text-[#C9241A] w-6 transition-transform duration-300 group-hover:scale-[1.35] origin-left">{String(i + 1).padStart(2, '0')}</span>
                    <span className="ff-mono text-[12.5px] tracking-[0.03em] text-[#dfe2e6] transition-colors group-hover:text-white">{b}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ════════════ 03 SESSION LIFECYCLE — pinned scroll-stack ════════════ */}
        <section className="bg-[#EFECE4] text-[#16191E] pt-[90px] pb-12">
          <div className="max-w-[1280px] mx-auto px-5 sm:px-[30px]">
            <Eyebrow n="03">Session lifecycle</Eyebrow>
            <h2 className="ff-display font-extrabold text-[clamp(28px,3.6vw,44px)] leading-[1.02] tracking-[-0.02em] mt-4 max-w-[680px]" data-reveal>Three phases, one continuous record</h2>
          </div>
        </section>
        <div className="bg-[#EFECE4] text-[#16191E]">
          <StackedCards
            items={[
                {
                  ...LIFECYCLE[0],
                  preview: (
                    <div className="w-full border border-white/12 px-4 py-3 flex items-center justify-between gap-4">
                      <div>
                        <div className="ff-mono text-[9.5px] tracking-[0.1em] uppercase text-[#7c828a] mb-1">Join code</div>
                        <div className="ff-display font-extrabold text-[24px] tracking-[0.12em] leading-none">418 207</div>
                      </div>
                      <div className="flex gap-1.5 w-[64px] shrink-0"><span className="flex-1 h-1.5" style={{ background: LIFECYCLE[0].c }} /><span className="flex-1 h-1.5 bg-white/12" /><span className="flex-1 h-1.5 bg-white/12" /></div>
                    </div>
                  ),
                },
                {
                  ...LIFECYCLE[1],
                  preview: (
                    <div className="w-full flex flex-col gap-2">
                      {([['ALPHA', 65, true], ['BRAVO', 22, false], ['CHARLIE', 13, false]] as const).map(([l, p, lead]) => (
                        <div key={l}>
                          <div className="flex justify-between ff-mono text-[10.5px] mb-1"><span className={lead ? '' : 'text-[#aab0b8]'}>{l}</span><span style={{ color: lead ? LIFECYCLE[1].c : '#7c828a' }}>{p}%</span></div>
                          <div className="h-1.5 bg-white/[0.08]"><div className="h-full" style={{ width: `${p}%`, background: lead ? LIFECYCLE[1].c : '#6b7178' }} /></div>
                        </div>
                      ))}
                    </div>
                  ),
                },
                {
                  ...LIFECYCLE[2],
                  preview: (
                    <div className="w-full border border-white/12 px-4 py-3">
                      <div className="flex items-center gap-2.5 mb-2.5"><span className="w-[18px] h-[18px] flex items-center justify-center text-[10px] text-white" style={{ background: LIFECYCLE[2].c }}>✦</span><span className="ff-mono text-[9.5px] tracking-[0.08em] uppercase text-[#7c828a]">Summary · 3s</span></div>
                      <div className="flex flex-wrap gap-1.5">{['Comms gaps', 'Readiness', 'Morale'].map((t) => <span key={t} className="ff-mono text-[10px] text-[#cfd3d8] border border-white/14 px-2 py-0.5">{t}</span>)}</div>
                    </div>
                  ),
                },
            ]}
          />
        </div>

        {/* ════════════ FIELD RESULTS — stat band (dark) ════════════ */}
        <section className="relative overflow-hidden bg-[#16191E] text-white py-[72px]">
          <div className="absolute bottom-[-200px] left-1/2 -translate-x-1/2 w-[1120px] h-[580px] pointer-events-none" aria-hidden="true" style={{ background: 'radial-gradient(55% 70% at 50% 100%,rgba(201,36,26,.18),transparent 76%)', filter: 'blur(42px)' }} />
          <div className="absolute inset-0 v5-grain opacity-[0.12] mix-blend-overlay pointer-events-none" aria-hidden="true" />
          <div className="relative max-w-[1280px] mx-auto px-5 sm:px-[30px]">
            <div className="ff-mono text-[12px] font-semibold tracking-[0.12em] uppercase text-[#9aa0a8] mb-7" data-reveal>Field results</div>
            <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-l border-white/14">
              {IMPACT.map((s) => (
                <div key={s.label} data-reveal className="px-[26px] py-7 border-r border-b border-white/14">
                  <CountUp value={s.value} suffix={s.suffix} className="ff-display font-black text-[clamp(40px,4.6vw,58px)] leading-[0.92] tracking-[-0.03em] block" style={s.accent ? { color: '#C9241A' } : { color: '#fff' }} />
                  <div className="ff-mono text-[12px] text-[#9aa0a8] mt-3 tracking-[0.02em]">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════ 04 LIVE DEMO (light) ════════════ */}
        <section id="demo" className="bg-[#EFECE4] text-[#16191E] py-[90px]">
          <div className="max-w-[1280px] mx-auto px-5 sm:px-[30px]">
            <Eyebrow n="04">Live demonstration</Eyebrow>
            <h2 className="ff-display font-extrabold text-[clamp(28px,3.6vw,44px)] leading-[1.02] tracking-[-0.02em] mt-4 mb-8" data-reveal>Watch a session come to life</h2>
            <div data-reveal><V5Demo /></div>
          </div>
        </section>

        {/* ════════════ 05 DEPLOYMENT (light) ════════════ */}
        <section id="deploy" className="bg-[#EFECE4] text-[#16191E] pb-[90px]">
          <div className="max-w-[1280px] mx-auto px-5 sm:px-[30px]">
            <Eyebrow n="05">Deployment</Eyebrow>
            <h2 className="ff-display font-extrabold text-[clamp(28px,3.6vw,44px)] leading-[1.02] tracking-[-0.02em] mt-4 mb-3.5" data-reveal>Operational in minutes</h2>
            <div className="h-0.5 bg-[#16191E] origin-left" data-rule />
            <div className="grid md:grid-cols-3 border-l border-[rgba(20,25,30,0.16)]">
              {STEPS.map((s) => (
                <div key={s.n} data-reveal className="group relative p-[40px_30px] border-r border-b border-[rgba(20,25,30,0.16)] transition-[transform,background,box-shadow] duration-300 hover:bg-white hover:-translate-y-1 hover:shadow-[0_24px_50px_-28px_rgba(20,25,30,0.45)]">
                  <span className="absolute top-0 left-0 right-0 h-0.5 bg-[#C9241A] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" aria-hidden="true" />
                  <div className="ff-display font-black text-[46px] leading-none mb-5 origin-left transition-transform duration-300 group-hover:scale-110" style={{ color: s.accent ? '#C9241A' : '#16191E' }}>{s.n}</div>
                  <h3 className="ff-display font-bold text-[20px] tracking-[-0.01em] mb-2.5 text-[#16191E]">{s.title}</h3>
                  <p className="text-[14.5px] text-[#5a5f66]">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════ 06 SERVICES (dark) ════════════ */}
        <section id="services" className="relative overflow-hidden bg-[#0F1216] text-white py-[90px]">
          <div className="absolute top-[-140px] right-[-100px] w-[780px] h-[560px] pointer-events-none" aria-hidden="true" style={{ background: 'radial-gradient(55% 65% at 70% 30%,rgba(201,36,26,.14),transparent 76%)', filter: 'blur(46px)' }} />
          <div className="absolute inset-0 v5-grain opacity-[0.1] mix-blend-overlay pointer-events-none" aria-hidden="true" />
          <div className="relative max-w-[1280px] mx-auto px-5 sm:px-[30px]">
            <div className="flex items-end justify-between gap-8 flex-wrap mb-9">
              <div className="max-w-[620px]" data-reveal>
                <Eyebrow n="06">Services</Eyebrow>
                <h2 className="ff-display font-extrabold text-[clamp(28px,3.6vw,44px)] leading-[1.02] tracking-[-0.02em] mt-4 text-white">Purpose-built for every service</h2>
              </div>
              <p className="text-[16px] text-[#9aa0a8] max-w-[340px] mb-1.5" data-reveal>Tailored templates, language, and workflows — each highlighted in the unit colours your teams already know.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 border-t border-l border-white/14">
              {USE_CASES.map((uc) => (
                <SpotlightCard key={uc.slug} href={`/solutions/${uc.slug}`} glow={`${uc.color}33`} className="v5-card group relative overflow-hidden block p-[28px_24px] border-r border-b border-white/14">
                  <span className="absolute inset-0 pointer-events-none" style={{ ['--v5-wash' as string]: `${uc.color}3a` }} aria-hidden="true" />
                  <div className="absolute inset-0 v5-grain opacity-[0.08] mix-blend-overlay pointer-events-none" aria-hidden="true" />
                  <div className="relative">
                    <span className="inline-block w-3 h-3 mb-[18px]" style={{ background: uc.color }} />
                    <div className="ff-display font-bold text-[17px] mb-1.5 text-white">{uc.label}</div>
                    <div className="text-[13px] text-[#9aa0a8] leading-[1.5]">{uc.desc}</div>
                  </div>
                </SpotlightCard>
              ))}
              <Link href="/contact" className="v5-card group relative overflow-hidden flex flex-col justify-center p-[28px_24px] border-r border-b border-white/14 bg-[#C9241A] hover:bg-[#a91d14] transition-colors">
                <div className="absolute inset-0 v5-grain opacity-[0.12] mix-blend-overlay pointer-events-none" aria-hidden="true" />
                <div className="relative">
                  <div className="ff-display font-extrabold text-[17px] mb-1.5 text-white">See your service →</div>
                  <div className="text-[13px] text-white/80 leading-[1.5]">Book a tailored walkthrough for your team.</div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* ════════════ 07 TEMPLATES — marquee (light) ════════════ */}
        <section className="bg-[#EFECE4] text-[#16191E] py-[84px] overflow-hidden v5-marquee-wrap">
          <div className="max-w-[1280px] mx-auto px-5 sm:px-[30px] pb-[34px]">
            <Eyebrow n="07">Templates</Eyebrow>
            <h2 className="ff-display font-extrabold text-[clamp(26px,3.2vw,40px)] leading-[1.02] tracking-[-0.02em] mt-4 max-w-[560px]" data-reveal>Deploy from a ready-made template</h2>
          </div>
          <div className="flex w-max v5-marquee">
            {[...TEMPLATE_EXAMPLES, ...TEMPLATE_EXAMPLES].map((t, i) => (
              <span key={i} className="ff-mono whitespace-nowrap font-medium text-[13px] tracking-[0.02em] text-[#16191E] bg-[#EFECE4] border border-[rgba(20,25,30,0.2)] px-[22px] py-[13px]" style={i > 0 ? { borderLeft: 'none' } : undefined}>{t}</span>
            ))}
          </div>
          <div className="max-w-[1280px] mx-auto px-5 sm:px-[30px] pt-9">
            <Link href="/templates" className="ff-mono text-[12.5px] font-semibold uppercase tracking-[0.05em] text-[#C9241A] hover:text-[#a91d14] transition-colors inline-flex items-center gap-2">View all templates →</Link>
          </div>
        </section>

        {/* ════════════ 08 TESTIMONIALS (light) ════════════ */}
        <section className="bg-[#EFECE4] text-[#16191E] pb-[90px]">
          <div className="max-w-[1280px] mx-auto px-5 sm:px-[30px]">
            <Eyebrow n="08">Testimonials</Eyebrow>
            <h2 className="ff-display font-extrabold text-[clamp(28px,3.6vw,44px)] leading-[1.02] tracking-[-0.02em] mt-4 mb-9" data-reveal>Trusted by those who serve</h2>
            <TestimonialColumns />
          </div>
        </section>

        {/* ════════════ FAQ (dark) ════════════ */}
        <section className="relative overflow-hidden bg-[#0F1216] text-white py-[90px]">
          {/* black fade into the section from the top, easing to nothing */}
          <div className="absolute inset-x-0 top-0 h-[180px] pointer-events-none" aria-hidden="true" style={{ background: 'linear-gradient(180deg, #000 0%, transparent 100%)' }} />
          <div className="absolute inset-0 v5-grain opacity-[0.1] mix-blend-overlay pointer-events-none" aria-hidden="true" />
          <div className="relative max-w-[820px] mx-auto px-5 sm:px-[30px]">
            <div className="text-center mb-10" data-reveal>
              <div className="ff-mono text-[12px] font-semibold tracking-[0.12em] uppercase text-[#C9241A] mb-4">Briefing notes</div>
              <h2 className="ff-display font-extrabold text-[clamp(28px,3.4vw,42px)] leading-[1.02] tracking-[-0.02em]">Frequently asked questions</h2>
            </div>
            <div data-reveal><FaqAccordion items={FAQ_ITEMS} /></div>
          </div>
        </section>

        {/* ════════════ FINAL CTA (dark) ════════════ */}
        <section id="cta" className="relative overflow-hidden bg-[#0F1216] text-white py-[104px]">
          <div className="absolute bottom-[-220px] left-1/2 -translate-x-1/2 w-[1240px] h-[720px] pointer-events-none" aria-hidden="true" style={{ background: 'radial-gradient(55% 70% at 50% 100%,rgba(201,36,26,.24),rgba(201,36,26,.07) 48%,transparent 78%)', filter: 'blur(42px)' }} />
          <div className="absolute inset-0 v5-grain opacity-[0.14] mix-blend-overlay pointer-events-none" aria-hidden="true" />
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px)', backgroundSize: '74px 74px', maskImage: 'radial-gradient(700px 420px at 50% 40%,#000,transparent 80%)', WebkitMaskImage: 'radial-gradient(700px 420px at 50% 40%,#000,transparent 80%)' }} />
          <div className="relative max-w-[1280px] mx-auto px-5 sm:px-[30px] text-center" data-reveal>
            <div className="ff-mono text-[12px] font-semibold tracking-[0.14em] uppercase text-[#C9241A] mb-6">Begin deployment</div>
            <h2 className="ff-display font-extrabold text-[clamp(34px,5vw,64px)] leading-[0.98] tracking-[-0.025em] mb-5">Ready to transform<br />your training?</h2>
            <p className="text-[18px] text-[#aab0b8] mb-9">Free for 30 days. No credit card. Built for those who serve.</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <V5AuthButton tab="register" label="Start free trial" variant="solid" />
              <Link href="/contact" className="ff-mono text-[13px] font-semibold uppercase tracking-[0.05em] text-white border border-white/24 hover:bg-white/[0.06] px-7 py-4 transition-colors">Book a demo</Link>
            </div>
          </div>
        </section>
      </main>

      {/* ════════════ FOOTER ════════════ */}
      <footer id="about" className="relative overflow-hidden bg-[#0A0C0F] text-[#8a9098] pt-20 pb-[92px] md:pb-[188px]">
        {/* roundish glow easing outwards from the top, black-to-transparent feel */}
        <div aria-hidden="true" className="absolute left-1/2 top-[-120px] -translate-x-1/2 w-[1200px] h-[520px] pointer-events-none" style={{ background: 'radial-gradient(50% 60% at 50% 0%, rgba(201,36,26,0.10), rgba(201,36,26,0.03) 42%, transparent 74%)', filter: 'blur(36px)' }} />
        {/* C360 wordmark — gray, scroll-parallax + faint sticker breathe */}
        <FooterWordmark />
        <div className="relative max-w-[1280px] mx-auto px-5 sm:px-[30px]">
          <div className="grid md:grid-cols-2 gap-10 items-end pb-11 border-b border-white/10">
            <div>
              <h2 className="ff-display font-extrabold text-[clamp(24px,2.6vw,34px)] leading-[1.04] tracking-[-0.02em] text-white mb-2.5">Operational briefings, monthly</h2>
              <p className="text-[15px] text-[#9aa0a8] max-w-[420px]">Training tactics, product updates, and lessons from the UK blue-light community. No spam — unsubscribe anytime.</p>
            </div>
            <form className="flex items-stretch border border-white/20 max-w-[440px] w-full md:ml-auto">
              <input type="email" placeholder="name@service.gov.uk" aria-label="Email address" className="ff-mono flex-1 min-w-0 bg-transparent border-none text-white text-[13.5px] tracking-[0.02em] px-4 py-3.5 outline-none placeholder:text-white/35" />
              <button type="button" className="ff-mono bg-[#C9241A] text-white font-semibold text-[12px] tracking-[0.05em] uppercase px-6 hover:bg-[#a91d14] transition-colors">Subscribe</button>
            </form>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-12 gap-x-8 gap-y-10 py-12 border-b border-white/10">
            <div className="col-span-2 md:col-span-3">
              <div className="flex items-center gap-3 mb-4">
                <span className="ff-display w-[30px] h-[30px] bg-[#C9241A] flex items-center justify-center text-base font-black text-white">C</span>
                <span className="ff-display font-extrabold text-[18px] text-white tracking-[0.01em]">COMMAND 360</span>
              </div>
              <p className="text-[14px] leading-[1.6] mb-5 max-w-[300px]">Interactive training platform for UK emergency services. UK-hosted, GDPR ready, built for those who serve.</p>
              <div className="flex gap-2.5">
                {['in', 'X', '@'].map((s) => <span key={s} className="w-9 h-9 border border-white/15 flex items-center justify-center ff-mono text-[12px] text-[#9aa0a8] hover:border-white/45 hover:text-white transition-colors cursor-pointer">{s}</span>)}
              </div>
            </div>
            <div className="md:col-span-3">
              <div className="ff-mono text-[11px] font-semibold tracking-[0.1em] uppercase text-white mb-[18px]">Solutions</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-[13.5px]">
                {USE_CASES.map((uc) => <Link key={uc.slug} href={`/solutions/${uc.slug}`} className="hover:text-white transition-colors">{uc.label}</Link>)}
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="ff-mono text-[11px] font-semibold tracking-[0.1em] uppercase text-white mb-[18px]">Platform</div>
              <div className="flex flex-col gap-2.5 text-[13.5px]">
                <a href="#capabilities" className="hover:text-white transition-colors">How it works</a>
                <a href="#services" className="hover:text-white transition-colors">Services</a>
                <a href="#demo" className="hover:text-white transition-colors">Live demo</a>
                <Link href="/command-studio" className="hover:text-white transition-colors">Command Studio</Link>
                <a href="#deploy" className="hover:text-white transition-colors">Deployment</a>
                <Link href="/templates" className="hover:text-white transition-colors">Templates</Link>
                <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
                <Link href="/product" className="hover:text-white transition-colors">Product tour</Link>
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="ff-mono text-[11px] font-semibold tracking-[0.1em] uppercase text-white mb-[18px]">Company</div>
              <div className="flex flex-col gap-2.5 text-[13.5px]">
                <Link href="/about" className="hover:text-white transition-colors">About</Link>
                <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
                <Link href="/help" className="hover:text-white transition-colors">Help centre</Link>
                <Link href="/contact" className="hover:text-white transition-colors">Book a demo</Link>
                <Link href="/join" className="hover:text-white transition-colors">Join a session</Link>
                <Link href="/login" className="hover:text-white transition-colors">Sign in</Link>
                <Link href="/register" className="hover:text-white transition-colors">Start free trial</Link>
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="ff-mono text-[11px] font-semibold tracking-[0.1em] uppercase text-white mb-[18px]">Legal</div>
              <div className="flex flex-col gap-2.5 text-[13.5px]">
                <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
                <Link href="/accessibility" className="hover:text-white transition-colors">Accessibility</Link>
                <Link href="/dpa" className="hover:text-white transition-colors">DPA</Link>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-5 flex-wrap pt-6 ff-mono text-[12px] text-[#5f656c]">
            <span>© 2026 Command 360 · Registered in England &amp; Wales</span>
            <div className="flex gap-5 flex-wrap">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/accessibility" className="hover:text-white transition-colors">Accessibility</Link>
              <Link href="/dpa" className="hover:text-white transition-colors">DPA</Link>
              <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>

      <FloatingJoinDock />
    </div>
  )
}
