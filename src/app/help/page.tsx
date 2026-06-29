import Link from 'next/link'
import {
  BookOpen, Play, BarChart2, Users, Settings, HelpCircle,
  ChevronRight, Search,
} from 'lucide-react'
import type { Metadata } from 'next'
import { SiteShell } from '@/components/site/SiteShell'
import { PageHero, Eyebrow, DarkSection, LightSection, Container } from '@/components/site/primitives'

export const metadata: Metadata = {
  title: 'Help Centre — Command 360',
  description: 'Help centre for Command 360: guides on live polls, quizzes, scenario building, debriefs and analytics for UK emergency-services training teams.',
  keywords: [
    'emergency services training help', 'interactive training platform support', 'live polling setup guide',
    'incident command exercise builder', 'blue light training software help', 'quiz and survey tool guide',
    'training session troubleshooting', 'scenario builder how to', 'debrief and analytics help',
    'word cloud and Q&A setup', 'facilitator getting started guide', 'UK emergency training platform support',
  ],
}

const CATEGORIES = [
  {
    icon: BookOpen,
    title: 'Getting Started',
    description: 'Create your account, build your first presentation, and run a session.',
    articles: ['Creating your first presentation', 'Adding interactive slides', 'Understanding slide types', 'Sharing your session link'],
  },
  {
    icon: Play,
    title: 'Running Sessions',
    description: 'Everything about presenting, managing live sessions, and audience participation.',
    articles: ['Starting a live session', 'Presenter view controls', 'Keyboard shortcuts', 'Managing Q&A questions'],
  },
  {
    icon: BarChart2,
    title: 'Results & Reports',
    description: 'Viewing results, exporting data, and understanding analytics.',
    articles: ['Viewing session results', 'Exporting to CSV', 'AI-generated summaries', 'Understanding response data'],
  },
  {
    icon: Users,
    title: 'Team & Collaboration',
    description: 'Inviting team members, managing roles, and sharing presentations.',
    articles: ['Inviting team members', 'Understanding roles', 'Sharing presentations', 'Organisation settings'],
  },
  {
    icon: Settings,
    title: 'Account & Settings',
    description: 'Managing your profile, preferences, and account settings.',
    articles: ['Updating your profile', 'Dark mode', 'Account security', 'Billing and plans'],
  },
  {
    icon: HelpCircle,
    title: 'Troubleshooting',
    description: 'Common issues and how to resolve them.',
    articles: ['Participants can\'t join', 'Session not loading', 'Results not appearing', 'Browser compatibility'],
  },
]

export default function HelpPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow={<Eyebrow>Help Centre</Eyebrow>}
        title={<>Find guides, tutorials, and <span className="text-[#C9241A]">answers</span></>}
        lede="Find guides, tutorials, and answers to common questions."
      >
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#aab0b8]" />
          <input
            type="text"
            placeholder="Search for help..."
            className="w-full pl-11 pr-4 py-3.5 bg-white/[0.04] border border-white/22 text-sm text-white placeholder:text-[#aab0b8] focus:outline-none focus:border-white/40"
          />
        </div>
      </PageHero>

      {/* Categories */}
      <DarkSection>
        <div className="absolute top-[-140px] right-[-100px] w-[780px] h-[560px] pointer-events-none" aria-hidden="true" style={{ background: 'radial-gradient(55% 65% at 70% 30%,rgba(201,36,26,.14),transparent 76%)', filter: 'blur(46px)' }} />
        <div className="absolute inset-0 v5-grain opacity-[0.1] mix-blend-overlay pointer-events-none" aria-hidden="true" />
        <Container className="relative">
          <div className="max-w-[620px] mb-9">
            <Eyebrow n="01">Browse Topics</Eyebrow>
            <h2 className="ff-display font-extrabold text-[clamp(28px,3.6vw,44px)] leading-[1.02] tracking-[-0.02em] mt-4 text-white">Browse by category</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-white/14">
            {CATEGORIES.map((cat) => (
              <div key={cat.title} data-reveal className="group v5-pop cursor-default relative p-[28px_26px] border-r border-b border-white/14">
                <div className="w-[42px] h-[42px] flex items-center justify-center mb-5 bg-[#C9241A]/12">
                  <cat.icon className="w-5 h-5 text-[#C9241A]" />
                </div>
                <h3 className="ff-display font-bold text-[18px] tracking-[-0.01em] mb-1.5 text-white">{cat.title}</h3>
                <p className="text-[13px] text-[#9aa0a8] leading-relaxed mb-4">{cat.description}</p>
                <ul className="space-y-1.5">
                  {cat.articles.map((a) => (
                    <li key={a}>
                      <span className="flex items-center gap-1.5 text-[13px] text-[#9aa0a8] hover:text-white cursor-pointer transition-colors">
                        <ChevronRight className="w-3 h-3 text-[#C9241A]" />
                        {a}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </DarkSection>

      {/* Still need help */}
      <LightSection className="!py-[64px]">
        <Container>
          <div className="max-w-[640px]">
            <h2 className="ff-display font-extrabold text-[clamp(26px,3.2vw,38px)] leading-[1.04] tracking-[-0.02em] text-[#16191E]">Still need help?</h2>
            <p className="text-[15px] text-[#5a5f66] leading-relaxed mt-3">
              Our team is here to support you. Get in touch and we&apos;ll respond within 24 hours.
            </p>
            <Link href="/contact" className="ff-mono text-[13px] font-semibold uppercase tracking-[0.05em] inline-flex mt-7 px-6 py-4 bg-[#16191E] text-white hover:bg-[#C9241A] transition-colors">
              Contact support
            </Link>
          </div>
        </Container>
      </LightSection>
    </SiteShell>
  )
}
