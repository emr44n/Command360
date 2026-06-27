import Link from 'next/link'
import {
  BarChart2, Cloud, HelpCircle, MessageCircle, ClipboardList, FileText,
  Zap, Shield, Eye, Users, Download, Brain,
} from 'lucide-react'
import type { Metadata } from 'next'
import { SiteShell } from '@/components/site/SiteShell'
import { PageHero, Eyebrow, LightSection, DarkSection, Container } from '@/components/site/primitives'
import { SpotlightCard } from '@/components/home/SpotlightCard'
import { V5AuthButton } from '@/components/home/V5Chrome'

export const metadata: Metadata = {
  title: 'Product — Command 360',
  description: 'Interactive polls, quizzes, word clouds, Q&A and AI insights for emergency services training.',
}

const FEATURES = [
  { icon: BarChart2, title: 'Live Polls', description: 'Create multiple-choice polls with real-time voting. See results update instantly as your audience responds.', c: '#C9241A' },
  { icon: Cloud, title: 'Word Clouds', description: 'Collect words and phrases from participants and visualise them as a live word cloud.', c: '#3E6DC4' },
  { icon: HelpCircle, title: 'Quizzes', description: 'Test knowledge with scored questions. Correct answers are highlighted and participants see their results.', c: '#2E9E63' },
  { icon: MessageCircle, title: 'Q&A Sessions', description: 'Let your audience ask questions with upvoting. Moderate and answer questions in real-time.', c: '#c98a2a' },
  { icon: ClipboardList, title: 'Surveys', description: 'Collect structured feedback with rating scales and open-ended questions. Export results as CSV.', c: '#D94B3D' },
  { icon: FileText, title: 'Content Slides', description: 'Add text and media slides between interactive elements to create a complete presentation.', c: '#6a5ea8' },
]

const CAPABILITIES = [
  { icon: Zap, title: 'Real-time responses', desc: 'Answers appear instantly on the presenter screen with animated visualisations.' },
  { icon: Shield, title: 'Anonymous mode', desc: 'Encourage honest responses with anonymous participation — no names attached.' },
  { icon: Eye, title: 'Presenter view', desc: 'Full presenter controls with speaker notes, keyboard shortcuts, and QR panel.' },
  { icon: Users, title: 'Unlimited participants', desc: 'No cap on audience size — designed for briefing rooms and large conference halls.' },
  { icon: Download, title: 'CSV export', desc: 'Download all session data for external analysis, evaluation, and reporting.' },
  { icon: Brain, title: 'AI insights', desc: 'AI-generated summaries, key themes, and actionable recommendations from every session.' },
]

export default function ProductPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow={<Eyebrow>Product</Eyebrow>}
        title={<>Everything you need for <span className="text-[#C9241A]">interactive training</span></>}
        lede="Live polls, quizzes, word clouds, Q&A and AI-powered insights — all in one platform built for emergency services professionals."
      >
        <V5AuthButton tab="register" label="Get started free" variant="solid" />
        <Link href="/pricing" className="ff-mono text-[13px] font-semibold uppercase tracking-[0.05em] text-white border border-white/22 hover:bg-white/[0.06] hover:border-white/40 px-6 py-4 transition-colors">View pricing</Link>
      </PageHero>

      {/* Slide types */}
      <LightSection>
        <Container>
          <div className="max-w-[620px] mb-3.5">
            <Eyebrow n="01">Interactive Tools</Eyebrow>
            <h2 className="ff-display font-extrabold text-[clamp(30px,3.8vw,48px)] leading-none tracking-[-0.02em] mt-4 text-[#16191E]">Six interactive slide types</h2>
            <p className="text-[16px] text-[#5a5f66] mt-4">Mix and match to create engaging training sessions.</p>
          </div>
          <div className="h-0.5 bg-[#16191E] origin-left mt-7" data-rule />
          <div className="grid sm:grid-cols-2 md:grid-cols-3 border-l border-[rgba(20,25,30,0.16)]">
            {FEATURES.map((f) => (
              <SpotlightCard key={f.title} glow={`${f.c}26`} className="v5-card group relative overflow-hidden p-[34px_30px] border-r border-b border-[rgba(20,25,30,0.16)] block cursor-default">
                <span className="absolute inset-0 pointer-events-none" style={{ ['--v5-wash' as string]: `${f.c}24` }} aria-hidden="true" />
                <div className="relative">
                  <div className="w-[42px] h-[42px] flex items-center justify-center mb-5" style={{ background: `${f.c}18` }}>
                    <f.icon className="w-5 h-5" style={{ color: f.c }} />
                  </div>
                  <h3 className="ff-display font-bold text-[21px] tracking-[-0.01em] mb-2.5 text-[#16191E]">{f.title}</h3>
                  <p className="text-[14.5px] text-[#5a5f66] leading-relaxed">{f.description}</p>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </Container>
      </LightSection>

      {/* Capabilities */}
      <DarkSection>
        <div className="absolute top-[-140px] right-[-100px] w-[780px] h-[560px] pointer-events-none" aria-hidden="true" style={{ background: 'radial-gradient(55% 65% at 70% 30%,rgba(201,36,26,.14),transparent 76%)', filter: 'blur(46px)' }} />
        <div className="absolute inset-0 v5-grain opacity-[0.1] mix-blend-overlay pointer-events-none" aria-hidden="true" />
        <Container className="relative">
          <div className="max-w-[620px] mb-9">
            <Eyebrow n="02">Capabilities</Eyebrow>
            <h2 className="ff-display font-extrabold text-[clamp(28px,3.6vw,44px)] leading-[1.02] tracking-[-0.02em] mt-4 text-white">Built for professional training</h2>
            <p className="text-[16px] text-[#9aa0a8] mt-4">Features that make a difference in real-world sessions.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-white/14">
            {CAPABILITIES.map((c) => (
              <div key={c.title} data-reveal className="group v5-pop cursor-default relative p-[28px_26px] border-r border-b border-white/14">
                <div className="w-[42px] h-[42px] flex items-center justify-center mb-5 bg-[#C9241A]/12">
                  <c.icon className="w-5 h-5 text-[#C9241A]" />
                </div>
                <h3 className="ff-display font-bold text-[18px] tracking-[-0.01em] mb-2 text-white">{c.title}</h3>
                <p className="text-[14px] text-[#9aa0a8] leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </DarkSection>
    </SiteShell>
  )
}
