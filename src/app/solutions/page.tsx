import Link from 'next/link'
import {
  Flame, Shield, Siren, Radio, Anchor, Search,
  Lock, Building2, AlertTriangle, Heart, Users,
  Eye, Network, Workflow, Layers,
  MonitorPlay, Compass, Accessibility, Repeat,
  SlidersHorizontal, ClipboardCheck, FileText, BarChart3,
} from 'lucide-react'
import type { Metadata } from 'next'
import { SiteShell } from '@/components/site/SiteShell'
import { PageHero, Eyebrow, LightSection, DarkSection, Container } from '@/components/site/primitives'
import { SpotlightCard } from '@/components/home/SpotlightCard'
import { SolutionsHero } from '@/components/solutions/SolutionsHero'

export const metadata: Metadata = {
  title: 'Solutions — Command 360',
  description: 'Interactive training solutions for every emergency service.',
}

const SERVICES = [
  { slug: 'fire-rescue', name: 'Fire & Rescue', icon: Flame, c: '#D94B3D', description: 'Safety briefings, equipment checks, and incident debriefs with live participation from all crew members.' },
  { slug: 'police', name: 'Police', icon: Shield, c: '#3E6DC4', description: 'Briefing sessions, policy training, and knowledge assessments with instant feedback and reporting.' },
  { slug: 'ambulance', name: 'Ambulance', icon: Siren, c: '#2E9E63', description: 'Clinical protocol training, CPD sessions, and welfare checks with anonymous response options.' },
  { slug: 'armed-forces', name: 'Armed Forces', icon: Radio, c: '#c98a2a', description: 'Operational briefings, readiness assessments, and training evaluations at scale.' },
  { slug: 'coastguard', name: 'HM Coastguard', icon: Anchor, c: '#2592a3', description: 'Maritime safety training, operational briefings, and volunteer coordination sessions.' },
  { slug: 'search-rescue', name: 'Search & Rescue', icon: Search, c: '#8a7d3a', description: 'Team training exercises, equipment familiarisation, and operational readiness assessments.' },
  { slug: 'prison-probation', name: 'Prison & Probation', icon: Lock, c: '#6a5ea8', description: 'Staff training, security procedure assessments, and policy awareness sessions.' },
  { slug: 'local-authority', name: 'Local Authority', icon: Building2, c: '#6a5ea8', description: 'Emergency planning exercises, council briefings, and community resilience training.' },
  { slug: 'civil-contingencies', name: 'Civil Contingencies', icon: AlertTriangle, c: '#D94B3D', description: 'Multi-agency exercises, table-top scenarios, and emergency response plan testing.' },
  { slug: 'nhs-emergency', name: 'NHS Emergency Departments', icon: Heart, c: '#2E9E63', description: 'Clinical governance training, major incident briefings, and team development sessions.' },
  { slug: 'voluntary-sector', name: 'Voluntary Sector', icon: Users, c: '#2592a3', description: 'Volunteer induction, skills assessment, and coordination briefings for community response teams.' },
]

const MULTI_AGENCY = [
  { icon: Eye, title: 'Shared situational awareness', c: '#3E6DC4', description: 'When fire, police, ambulance and partner agencies train on the same scenario at once, everyone builds the same picture of the incident — the foundation of effective joint working under JESIP.' },
  { icon: Network, title: 'Co-ordinated joint response', c: '#2E9E63', description: 'Run multi-agency exercises where each service sees how its actions affect the others, rehearsing the co-location, communication and co-ordination that real incidents demand.' },
  { icon: Workflow, title: 'Defensible, recorded decisions', c: '#C9241A', description: 'Capture the decisions teams make and the reasoning behind them, so commanders can practise the clear, accountable decision-making that has to stand up long after the event.' },
  { icon: Layers, title: 'Bronze, Silver and Gold', c: '#c98a2a', description: 'Scale a single scenario across operational, tactical and strategic command, so commanders at every level train together rather than in isolation.' },
]

const LEARNING = [
  { icon: MonitorPlay, title: 'Scenario-based, not slide-based', c: '#C9241A', description: 'Passive slideshows are quickly forgotten. Command 360 drops teams into realistic, evolving incidents where they have to think, decide and act — the way the job actually feels.' },
  { icon: Compass, title: 'Decisions under pressure', c: '#2592a3', description: 'Let responders rehearse high-stakes calls in a safe environment, experiencing rare and dangerous situations they might never meet in conventional training.' },
  { icon: Accessibility, title: 'Built for every learning style', c: '#2E9E63', description: 'Mix imagery, live polls, word clouds, quizzes and open discussion so visual, verbal and hands-on learners all stay engaged in the same session.' },
  { icon: Repeat, title: 'Retention that lasts', c: '#6a5ea8', description: 'Active, immersive learning is proven to stick far better than one-way lectures — turning a single briefing into knowledge crews still carry months later.' },
]

const BESPOKE = [
  { icon: SlidersHorizontal, title: 'Bespoke scenarios', c: '#D94B3D', description: 'Build incidents around your own risks, stations and standard operating procedures — from a high-rise fire to a multi-agency flood — with layered imagery and timed events.' },
  { icon: ClipboardCheck, title: 'Custom assessments', c: '#3E6DC4', description: 'Create knowledge checks and competence assessments mapped to your own frameworks, with instant marking and a clear record of who knows what.' },
  { icon: FileText, title: 'Your own training material', c: '#c98a2a', description: 'Bring existing briefings, policies and media into Command 360 and turn static documents into interactive sessions your teams take part in.' },
  { icon: BarChart3, title: 'Debriefs & analytics', c: '#2E9E63', description: 'Every session produces a debrief — surfacing knowledge gaps, evidencing outcomes for inspection, and showing improvement over time.' },
]

export default function SolutionsPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow={<Eyebrow>Solutions</Eyebrow>}
        title={<>Purpose-built for <span className="text-[#C9241A]">every service</span></>}
        lede="Command 360 is designed for emergency services training. Choose your service to see how we can help your team."
        media={<SolutionsHero />}
      />

      {/* Services grid */}
      <LightSection>
        <Container>
          <div className="max-w-[620px] mb-3.5">
            <Eyebrow n="01">By Service</Eyebrow>
            <h2 className="ff-display font-extrabold text-[clamp(30px,3.8vw,48px)] leading-none tracking-[-0.02em] mt-4 text-[#16191E]">Solutions for every emergency service</h2>
            <p className="text-[16px] text-[#5a5f66] mt-4">Choose your service to see how Command 360 can help your team.</p>
          </div>
          <div className="h-0.5 bg-[#16191E] origin-left mt-7" data-rule />
          <div className="grid sm:grid-cols-2 md:grid-cols-3 border-l border-[rgba(20,25,30,0.16)]">
            {SERVICES.map((service) => (
              <SpotlightCard key={service.slug} glow={`${service.c}26`} className="v5-card group relative overflow-hidden p-[34px_30px] border-r border-b border-[rgba(20,25,30,0.16)] block cursor-pointer">
                <span className="absolute inset-0 pointer-events-none" style={{ ['--v5-wash' as string]: `${service.c}24` }} aria-hidden="true" />
                <Link href={`/solutions/${service.slug}`} className="relative block">
                  <div className="w-[42px] h-[42px] flex items-center justify-center mb-5" style={{ background: `${service.c}18` }}>
                    <service.icon className="w-5 h-5" style={{ color: service.c }} />
                  </div>
                  <h3 className="ff-display font-bold text-[21px] tracking-[-0.01em] mb-2.5 text-[#16191E]">{service.name}</h3>
                  <p className="text-[14.5px] text-[#5a5f66] leading-relaxed">{service.description}</p>
                </Link>
              </SpotlightCard>
            ))}
          </div>
        </Container>
      </LightSection>

      {/* ─── MULTI-AGENCY ─── */}
      <DarkSection>
        <div className="absolute top-[-140px] left-1/2 -translate-x-1/2 w-[820px] h-[420px] pointer-events-none" aria-hidden="true" style={{ background: 'radial-gradient(55% 65% at 50% 30%,rgba(201,36,26,.14),transparent 76%)', filter: 'blur(46px)' }} />
        <div className="absolute inset-0 v5-grain opacity-[0.1] mix-blend-overlay pointer-events-none" aria-hidden="true" />
        <Container className="relative">
          <div className="max-w-[640px] mb-9">
            <Eyebrow n="02">Multi-Agency</Eyebrow>
            <h2 className="ff-display font-extrabold text-[clamp(28px,3.6vw,44px)] leading-[1.02] tracking-[-0.02em] mt-4 text-white">Built for working across agencies</h2>
            <p className="text-[16px] text-[#9aa0a8] mt-4">Major incidents are never handled by one service alone. Command 360 lets blue-light services and their partners train together — building the shared awareness and co-ordinated decision-making that frameworks like JESIP and the Joint Decision Model set out to achieve.</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 border-t border-l border-white/14">
            {MULTI_AGENCY.map((feat) => (
              <div key={feat.title} data-reveal className="group v5-pop cursor-default relative p-[28px_26px] border-r border-b border-white/14">
                <div className="w-[42px] h-[42px] flex items-center justify-center mb-5" style={{ background: `${feat.c}1f` }}>
                  <feat.icon className="w-5 h-5" style={{ color: feat.c }} />
                </div>
                <h3 className="ff-display font-bold text-[18px] tracking-[-0.01em] mb-2 text-white">{feat.title}</h3>
                <p className="text-[14px] text-[#9aa0a8] leading-relaxed">{feat.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </DarkSection>

      {/* ─── HOW PEOPLE LEARN ─── */}
      <LightSection>
        <Container>
          <div className="max-w-[640px] mb-3.5">
            <Eyebrow n="03">How People Learn</Eyebrow>
            <h2 className="ff-display font-extrabold text-[clamp(30px,3.8vw,48px)] leading-none tracking-[-0.02em] mt-4 text-[#16191E]">Immersive learning that actually sticks</h2>
            <p className="text-[16px] text-[#5a5f66] mt-4">People remember what they do, not what they&apos;re told. Command 360 brings the engagement of immersive, scenario-based training into any room — no headset required — so every session is active, not passive.</p>
          </div>
          <div className="h-0.5 bg-[#16191E] origin-left mt-7 mb-9" data-rule />
          <div className="grid sm:grid-cols-2 md:grid-cols-4 border-t border-l border-[rgba(20,25,30,0.16)]">
            {LEARNING.map((feat) => (
              <SpotlightCard key={feat.title} glow={`${feat.c}26`} className="v5-card group relative overflow-hidden p-[34px_30px] border-r border-b border-[rgba(20,25,30,0.16)] block cursor-default">
                <span className="absolute inset-0 pointer-events-none" style={{ ['--v5-wash' as string]: `${feat.c}24` }} aria-hidden="true" />
                <div className="relative">
                  <div className="w-[42px] h-[42px] flex items-center justify-center mb-5" style={{ background: `${feat.c}18` }}>
                    <feat.icon className="w-5 h-5" style={{ color: feat.c }} />
                  </div>
                  <h3 className="ff-display font-bold text-[18px] tracking-[-0.01em] mb-2.5 text-[#16191E]">{feat.title}</h3>
                  <p className="text-[14.5px] text-[#5a5f66] leading-relaxed">{feat.description}</p>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </Container>
      </LightSection>

      {/* ─── BESPOKE CONTENT ─── */}
      <DarkSection>
        <div className="absolute top-[-140px] right-[-100px] w-[780px] h-[560px] pointer-events-none" aria-hidden="true" style={{ background: 'radial-gradient(55% 65% at 70% 30%,rgba(201,36,26,.14),transparent 76%)', filter: 'blur(46px)' }} />
        <div className="absolute inset-0 v5-grain opacity-[0.1] mix-blend-overlay pointer-events-none" aria-hidden="true" />
        <Container className="relative">
          <div className="max-w-[640px] mb-9">
            <Eyebrow n="04">Bespoke Content</Eyebrow>
            <h2 className="ff-display font-extrabold text-[clamp(28px,3.6vw,44px)] leading-[1.02] tracking-[-0.02em] mt-4 text-white">Scenarios, assessments and material — built around you</h2>
            <p className="text-[16px] text-[#9aa0a8] mt-4">No two services train the same way. Command 360 is a platform for building your own bespoke scenarios, assessments and training material — mapped to your risks, your procedures and your people.</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 border-t border-l border-white/14">
            {BESPOKE.map((feat) => (
              <div key={feat.title} data-reveal className="group v5-pop cursor-default relative p-[28px_26px] border-r border-b border-white/14">
                <div className="w-[42px] h-[42px] flex items-center justify-center mb-5" style={{ background: `${feat.c}1f` }}>
                  <feat.icon className="w-5 h-5" style={{ color: feat.c }} />
                </div>
                <h3 className="ff-display font-bold text-[18px] tracking-[-0.01em] mb-2 text-white">{feat.title}</h3>
                <p className="text-[14px] text-[#9aa0a8] leading-relaxed">{feat.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </DarkSection>
    </SiteShell>
  )
}
