import { PublicLayout } from '@/components/layout/PublicLayout'
import Link from 'next/link'
import {
  BarChart2, Cloud, HelpCircle, MessageCircle, ClipboardList, FileText,
  Zap, Shield, Eye, Users, Download, Brain, ArrowRight,
} from 'lucide-react'
import { JoinCodeInput } from '@/components/join/JoinCodeInput'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Product — Command 360',
  description: 'Interactive polls, quizzes, word clouds, Q&A and AI insights for emergency services training.',
}

const FEATURES = [
  { icon: BarChart2, title: 'Live Polls', description: 'Create multiple-choice polls with real-time voting. See results update instantly as your audience responds.', color: 'text-red-500', bg: 'bg-red-500/10' },
  { icon: Cloud, title: 'Word Clouds', description: 'Collect words and phrases from participants and visualise them as a live word cloud.', color: 'text-sky-500', bg: 'bg-sky-500/10' },
  { icon: HelpCircle, title: 'Quizzes', description: 'Test knowledge with scored questions. Correct answers are highlighted and participants see their results.', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { icon: MessageCircle, title: 'Q&A Sessions', description: 'Let your audience ask questions with upvoting. Moderate and answer questions in real-time.', color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { icon: ClipboardList, title: 'Surveys', description: 'Collect structured feedback with rating scales and open-ended questions. Export results as CSV.', color: 'text-rose-500', bg: 'bg-rose-500/10' },
  { icon: FileText, title: 'Content Slides', description: 'Add text and media slides between interactive elements to create a complete presentation.', color: 'text-violet-500', bg: 'bg-violet-500/10' },
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
    <PublicLayout>
      {/* Hero — Dark */}
      <section className="relative bg-[#07070a] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(220,38,38,0.12),transparent)]" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
        </div>
        <div className="relative max-w-3xl mx-auto px-5 pt-32 pb-24 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-[13px] text-white/60 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 pulse-dot" />
            Product
          </span>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
            Everything you need for{' '}
            <span className="bg-gradient-to-r from-red-400 via-red-500 to-orange-500 gradient-text">interactive training</span>
          </h1>
          <p className="text-lg text-white/45 max-w-xl mx-auto mb-10">
            Live polls, quizzes, word clouds, Q&amp;A and AI-powered insights — all in one platform built for emergency services professionals.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register" className="group inline-flex items-center gap-2 px-7 h-12 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-500 transition-all hover:shadow-lg hover:shadow-red-500/25 cursor-pointer">
              Get started free <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link href="/pricing" className="inline-flex items-center px-7 h-12 rounded-xl text-sm font-medium border border-white/[0.12] text-white/70 hover:text-white hover:border-white/[0.25] transition-all cursor-pointer">
              View pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Slide types */}
      <section className="py-24 md:py-32 px-5 bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="feature-badge bg-primary/10 text-primary">Interactive Tools</span>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mt-4">Six interactive slide types</h2>
            <p className="text-muted-foreground mt-3">Mix and match to create engaging training sessions</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-card border border-border rounded-2xl p-6 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all">
                <div className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center mb-4`}>
                  <f.icon className={`w-5 h-5 ${f.color}`} />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-24 px-5 bg-muted/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="feature-badge bg-primary/10 text-primary">Capabilities</span>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mt-4">Built for professional training</h2>
            <p className="text-muted-foreground mt-3">Features that make a difference in real-world sessions</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CAPABILITIES.map((c) => (
              <div key={c.title} className="flex items-start gap-4 p-5 rounded-2xl border border-border bg-card hover:border-primary/20 transition-all">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <c.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{c.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — Dark */}
      <section className="relative bg-[#07070a] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(220,38,38,0.12),transparent)]" />
        </div>
        <div className="relative max-w-3xl mx-auto px-5 py-24 text-center">
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white mb-4">
            Ready to transform your training?
          </h2>
          <p className="text-white/40 text-lg mb-8">Create your first interactive presentation in minutes.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <Link href="/register" className="group inline-flex items-center gap-2 px-8 h-12 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-500 transition-all hover:shadow-lg hover:shadow-red-500/25 cursor-pointer">
              Start free today <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
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
