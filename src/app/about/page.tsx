'use client'

import { SiteShell } from '@/components/site/SiteShell'
import { PageHero, Eyebrow, LightSection, DarkSection, Container } from '@/components/site/primitives'
import { SpotlightCard } from '@/components/home/SpotlightCard'
import { Target, Heart, Zap, ArrowRight, Flame, Shield, Siren, Anchor, Search, Lock, Building2, Radio, Users } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { AboutCarousel } from '@/components/about/AboutCarousel'

/* ── DATA ── */

const STATS = [
  { number: '11+', label: 'Services Supported' },
  { number: '8', label: 'Slide Types' },
  { number: '∞', label: 'Real-time Results' },
  { number: 'UK', label: 'Wide Coverage' },
]

const FOUNDING_BOXES = [
  {
    title: 'The Problem',
    text: 'Emergency services training has long relied on static slideshows and one-way lectures. Trainers knew their teams were disengaged, but had no tools purpose-built for their world.',
    c: '#D94B3D',
  },
  {
    title: 'The Vision',
    text: 'Command 360 was created to change that. We set out to build an interactive platform that makes every training session a two-way conversation — where every crew member has a voice, and facilitators get instant insight into what their teams actually know.',
    c: '#3E6DC4',
  },
  {
    title: 'The Impact',
    text: 'From fire station watch-room briefings to multi-agency exercises, Command 360 turns passive audiences into active participants.',
    c: '#2E9E63',
  },
]

const VALUES = [
  {
    icon: Target,
    title: 'Purpose-built',
    description: 'Every feature is designed specifically for emergency services training needs — from safety briefings to incident debriefs.',
    c: '#C9241A',
  },
  {
    icon: Heart,
    title: 'People-first',
    description: 'We believe better training leads to better outcomes. Our platform helps teams learn together, not just listen.',
    c: '#2E9E63',
  },
  {
    icon: Zap,
    title: 'Simple by design',
    description: 'Training facilitators should focus on content, not technology. Command 360 is intuitive for presenters and participants alike.',
    c: '#c98a2a',
  },
]

const SERVICES = [
  { icon: Flame, label: 'Fire & Rescue Services', color: '#D94B3D', slug: 'fire-rescue' },
  { icon: Shield, label: 'Police Forces', color: '#3E6DC4', slug: 'police' },
  { icon: Siren, label: 'Ambulance Trusts', color: '#2E9E63', slug: 'ambulance' },
  { icon: Target, label: 'Armed Forces', color: '#8a7d3a', slug: 'armed-forces' },
  { icon: Anchor, label: 'HM Coastguard', color: '#2592a3', slug: 'coastguard' },
  { icon: Search, label: 'Search & Rescue', color: '#c98a2a', slug: 'search-rescue' },
  { icon: Lock, label: 'Prison & Probation', color: '#6a5ea8', slug: 'prison-probation' },
  { icon: Building2, label: 'Local Authority Emergency Planning', color: '#6a5ea8', slug: 'local-authority' },
  { icon: Radio, label: 'Civil Contingencies Teams', color: '#C9241A', slug: 'civil-contingencies' },
  { icon: Users, label: 'NHS Emergency Departments', color: '#2592a3', slug: 'nhs-emergency' },
]

const COVERAGE_FEATURES = [
  { title: 'Every Fire & Rescue Service', description: 'County, metropolitan, and combined FRS teams across England, Scotland, Wales & Northern Ireland.', c: '#D94B3D' },
  { title: 'All Police Forces', description: 'From the Met to rural constabularies — training tools that scale to any force size.', c: '#3E6DC4' },
  { title: 'NHS & Ambulance Trusts', description: 'Pre-hospital care, paramedic CPD, and clinical governance sessions made interactive.', c: '#2E9E63' },
  { title: 'Multi-Agency Ready', description: 'JESIP, LRF exercises and cross-service training — all in one platform.', c: '#6a5ea8' },
]

const MISSION_FEATURES = [
  {
    title: 'Live Polls & Quizzes',
    description: 'Instant feedback loops that keep every participant engaged and accountable.',
    icon: Radio,
    c: '#C9241A',
  },
  {
    title: 'Word Clouds',
    description: 'Capture the collective voice of your team in real time — surfacing themes and priorities.',
    icon: Users,
    c: '#2592a3',
  },
  {
    title: 'Scenario-Based Learning',
    description: 'Present realistic incidents and let teams collaborate on decision-making in a safe environment.',
    icon: Shield,
    c: '#c98a2a',
  },
  {
    title: 'Analytics & Reporting',
    description: 'Track knowledge gaps, measure improvement, and evidence training outcomes for inspections.',
    icon: Target,
    c: '#2E9E63',
  },
]

/* ── CAROUSEL HOOK ── */

function useCarousel(count: number, interval = 4000) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % count)
    }, interval)
    return () => clearInterval(timer)
  }, [count, interval])

  return active
}

/* ── PAGE ── */

export default function AboutPage() {
  const foundingIdx = useCarousel(FOUNDING_BOXES.length, 4000)
  const missionIdx = useCarousel(MISSION_FEATURES.length, 4000)

  return (
    <SiteShell>
      <PageHero
        eyebrow={<Eyebrow>About Us</Eyebrow>}
        title={<>Making emergency services training <span className="text-[#C9241A]">interactive</span></>}
        lede="Command 360 was built with one goal: to help emergency services teams run better, more engaging training sessions that improve knowledge retention and save lives."
        media={<AboutCarousel />}
      />

      {/* ─── OUR STORY ─── */}
      <LightSection>
        <Container>
          <div className="max-w-[620px] mb-3.5">
            <Eyebrow n="01">Our Story</Eyebrow>
            <h2 className="ff-display font-extrabold text-[clamp(30px,3.8vw,48px)] leading-none tracking-[-0.02em] mt-4 text-[#16191E]">Born from a need for better training</h2>
          </div>
          <div className="h-0.5 bg-[#16191E] origin-left mt-7 mb-9" data-rule />
          <div className="grid md:grid-cols-3 border-t border-l border-[rgba(20,25,30,0.16)]">
            {FOUNDING_BOXES.map((box, i) => (
              <SpotlightCard
                key={box.title}
                glow={`${box.c}26`}
                className="v5-card group relative overflow-hidden p-[34px_30px] border-r border-b border-[rgba(20,25,30,0.16)] block cursor-default"
              >
                <span className="absolute inset-0 pointer-events-none" style={{ ['--v5-wash' as string]: `${box.c}24` }} aria-hidden="true" />
                <div className="relative transition-opacity duration-700" style={{ opacity: foundingIdx === i ? 1 : 0.42 }}>
                  <div className="w-[34px] h-[34px] mb-5" style={{ background: box.c }} aria-hidden="true" />
                  <div className="ff-mono text-[12px] font-semibold tracking-[0.12em] uppercase mb-3" style={{ color: box.c }}>{box.title}</div>
                  <p className="text-[14.5px] text-[#5a5f66] leading-relaxed">{box.text}</p>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </Container>
      </LightSection>

      {/* ─── STATS STRIP ─── */}
      <DarkSection>
        <div className="absolute top-[-140px] left-1/2 -translate-x-1/2 w-[820px] h-[420px] pointer-events-none" aria-hidden="true" style={{ background: 'radial-gradient(55% 65% at 50% 30%,rgba(201,36,26,.14),transparent 76%)', filter: 'blur(46px)' }} />
        <div className="absolute inset-0 v5-grain opacity-[0.1] mix-blend-overlay pointer-events-none" aria-hidden="true" />
        <Container className="relative">
          <div className="grid grid-cols-2 md:grid-cols-4 border-t border-l border-white/14">
            {STATS.map((stat) => (
              <div key={stat.label} data-reveal className="group v5-pop cursor-default relative p-[34px_28px] border-r border-b border-white/14 text-center md:text-left">
                <div className="ff-display font-black text-[clamp(40px,5vw,68px)] leading-none tracking-[-0.02em] text-white mb-3">{stat.number}</div>
                <div className="ff-mono text-[12px] font-semibold tracking-[0.12em] uppercase text-[#9aa0a8]">{stat.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </DarkSection>

      {/* ─── WHY UK-WIDE COVERAGE ─── */}
      <LightSection>
        <Container>
          <div className="max-w-[620px] mb-3.5">
            <Eyebrow n="02">Coverage</Eyebrow>
            <h2 className="ff-display font-extrabold text-[clamp(30px,3.8vw,48px)] leading-none tracking-[-0.02em] mt-4 text-[#16191E]">Why UK-wide coverage matters</h2>
            <p className="text-[16px] text-[#5a5f66] mt-4">One platform that works for every service, everywhere.</p>
          </div>
          <div className="h-0.5 bg-[#16191E] origin-left mt-7 mb-9" data-rule />
          <div className="grid sm:grid-cols-2 border-t border-l border-[rgba(20,25,30,0.16)]">
            {COVERAGE_FEATURES.map((feat) => (
              <SpotlightCard key={feat.title} glow={`${feat.c}26`} className="v5-card group relative overflow-hidden p-[34px_30px] border-r border-b border-[rgba(20,25,30,0.16)] block cursor-default">
                <span className="absolute inset-0 pointer-events-none" style={{ ['--v5-wash' as string]: `${feat.c}24` }} aria-hidden="true" />
                <div className="relative">
                  <div className="w-[34px] h-[34px] mb-5" style={{ background: feat.c }} aria-hidden="true" />
                  <h3 className="ff-display font-bold text-[21px] tracking-[-0.01em] mb-2.5 text-[#16191E]">{feat.title}</h3>
                  <p className="text-[14.5px] text-[#5a5f66] leading-relaxed">{feat.description}</p>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </Container>
      </LightSection>

      {/* ─── VALUES ─── */}
      <DarkSection>
        <div className="absolute top-[-140px] right-[-100px] w-[780px] h-[560px] pointer-events-none" aria-hidden="true" style={{ background: 'radial-gradient(55% 65% at 70% 30%,rgba(201,36,26,.14),transparent 76%)', filter: 'blur(46px)' }} />
        <div className="absolute inset-0 v5-grain opacity-[0.1] mix-blend-overlay pointer-events-none" aria-hidden="true" />
        <Container className="relative">
          <div className="max-w-[620px] mb-9">
            <Eyebrow n="03">Our Values</Eyebrow>
            <h2 className="ff-display font-extrabold text-[clamp(28px,3.6vw,44px)] leading-[1.02] tracking-[-0.02em] mt-4 text-white">What drives us</h2>
            <p className="text-[16px] text-[#9aa0a8] mt-4">Three core principles that shape every feature we build.</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 border-t border-l border-white/14">
            {VALUES.map((v) => (
              <div key={v.title} data-reveal className="group v5-pop cursor-default relative p-[28px_26px] border-r border-b border-white/14">
                <div className="w-[42px] h-[42px] flex items-center justify-center mb-5" style={{ background: `${v.c}1f` }}>
                  <v.icon className="w-5 h-5" style={{ color: v.c }} />
                </div>
                <h3 className="ff-display font-bold text-[18px] tracking-[-0.01em] mb-2 text-white">{v.title}</h3>
                <p className="text-[14px] text-[#9aa0a8] leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </DarkSection>

      {/* ─── WHO WE SERVE ─── */}
      <LightSection>
        <Container>
          <div className="max-w-[620px] mb-3.5">
            <Eyebrow n="04">Who We Serve</Eyebrow>
            <h2 className="ff-display font-extrabold text-[clamp(30px,3.8vw,48px)] leading-none tracking-[-0.02em] mt-4 text-[#16191E]">Built for those who protect us</h2>
            <p className="text-[16px] text-[#5a5f66] mt-4">Command 360 serves training teams across the UK emergency services sector.</p>
          </div>
          <div className="h-0.5 bg-[#16191E] origin-left mt-7 mb-9" data-rule />
          <div className="grid sm:grid-cols-2 md:grid-cols-3 border-t border-l border-[rgba(20,25,30,0.16)]">
            {SERVICES.map((service) => (
              <SpotlightCard
                key={service.label}
                glow={`${service.color}26`}
                href={`/solutions/${service.slug}`}
                className="v5-card group relative overflow-hidden p-[28px_26px] border-r border-b border-[rgba(20,25,30,0.16)] block cursor-pointer"
              >
                <span className="absolute inset-0 pointer-events-none" style={{ ['--v5-wash' as string]: `${service.color}24` }} aria-hidden="true" />
                <div className="relative flex items-center gap-3">
                  <div className="w-[42px] h-[42px] flex items-center justify-center shrink-0" style={{ background: `${service.color}1f` }}>
                    <service.icon className="w-5 h-5" style={{ color: service.color }} />
                  </div>
                  <span className="ff-display font-bold text-[15px] tracking-[-0.01em] text-[#16191E]">{service.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#5a5f66] ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
                </div>
              </SpotlightCard>
            ))}
          </div>
        </Container>
      </LightSection>

      {/* ─── MISSION ─── */}
      <DarkSection>
        <div className="absolute top-[-140px] left-1/2 -translate-x-1/2 w-[820px] h-[460px] pointer-events-none" aria-hidden="true" style={{ background: 'radial-gradient(55% 65% at 50% 30%,rgba(201,36,26,.14),transparent 76%)', filter: 'blur(46px)' }} />
        <div className="absolute inset-0 v5-grain opacity-[0.1] mix-blend-overlay pointer-events-none" aria-hidden="true" />
        <Container className="relative">
          <div className="max-w-[620px] mb-9">
            <Eyebrow n="05">Our Mission</Eyebrow>
            <h2 className="ff-display font-extrabold text-[clamp(28px,3.6vw,44px)] leading-[1.02] tracking-[-0.02em] mt-4 text-white">Make your training <span className="text-[#C9241A]">engaging</span></h2>
            <p className="text-[16px] text-[#9aa0a8] mt-4">We believe that when training is interactive, people pay attention. When people pay attention, they learn. And when emergency responders learn better, communities are safer.</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 border-t border-l border-white/14">
            {MISSION_FEATURES.map((feat, i) => (
              <div
                key={feat.title}
                data-reveal
                className="group v5-pop cursor-default relative p-[28px_26px] border-r border-b border-white/14 transition-opacity duration-700"
                style={{ opacity: missionIdx === i ? 1 : 0.5 }}
              >
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
