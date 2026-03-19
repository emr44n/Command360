import { PublicLayout } from '@/components/layout/PublicLayout'
import Link from 'next/link'
import {
  Shield, AlertTriangle, ClipboardList, BookOpen,
  Flame, Heart, Users, Radio, HelpCircle, BarChart2,
  ArrowRight, Layers,
} from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Templates — Command 360',
  description: 'Ready-made interactive training templates for emergency services teams.',
}

const TEMPLATE_CATEGORIES = [
  {
    title: 'Briefings & Debriefs',
    description: 'Pre-shift briefings, post-incident debriefs, and handover sessions.',
    icon: Radio,
    color: 'text-blue-500 bg-blue-500/10',
    templates: [
      { name: 'Safety Briefing', description: 'Pre-shift safety awareness with hazard identification, PPE compliance, and knowledge quiz.', icon: Shield, slides: 8, types: ['content', 'poll', 'word cloud', 'quiz', 'rating'] },
      { name: 'Incident Debrief', description: 'Structured post-incident debrief covering decisions, outcomes, and lessons learned.', icon: AlertTriangle, slides: 10, types: ['content', 'poll', 'word cloud', 'rating', 'Q&A'] },
      { name: 'Hot Debrief', description: 'Quick 5-minute post-incident capture while details are fresh.', icon: Flame, slides: 5, types: ['rating', 'word cloud', 'open text', 'poll'] },
      { name: 'Shift Briefing', description: 'Standard shift handover with key information, risk updates, and tasking.', icon: Radio, slides: 6, types: ['content', 'poll', 'quiz', 'word cloud', 'Q&A'] },
    ],
  },
  {
    title: 'Training & Assessment',
    description: 'Protocol training, equipment checks, knowledge assessments, and onboarding.',
    icon: BookOpen,
    color: 'text-emerald-500 bg-emerald-500/10',
    templates: [
      { name: 'Protocol Training', description: 'Step-by-step protocol walkthrough with embedded knowledge checks and competency verification.', icon: BookOpen, slides: 12, types: ['content', 'poll', 'quiz', 'rating', 'survey'] },
      { name: 'Equipment Check', description: 'Equipment competency assessment covering identification, usage, and maintenance.', icon: ClipboardList, slides: 8, types: ['quiz', 'poll', 'rating', 'open text'] },
      { name: 'Knowledge Assessment', description: 'Scored knowledge quiz with multiple topics and instant results for CPD tracking.', icon: HelpCircle, slides: 9, types: ['quiz', 'rating', 'content'] },
      { name: 'New Starter Onboarding', description: 'Induction session covering key procedures, expectations, and introductions.', icon: Users, slides: 12, types: ['content', 'word cloud', 'poll', 'quiz', 'Q&A'] },
    ],
  },
  {
    title: 'Wellbeing & Feedback',
    description: 'Welfare monitoring, team feedback, training evaluation, and risk workshops.',
    icon: Heart,
    color: 'text-pink-500 bg-pink-500/10',
    templates: [
      { name: 'Welfare Check', description: 'Anonymous wellbeing survey for team welfare monitoring and early concern identification.', icon: Heart, slides: 7, types: ['rating', 'poll', 'open text', 'content'] },
      { name: 'Team Feedback', description: 'Anonymous feedback on team dynamics, leadership, communication, and morale.', icon: Users, slides: 7, types: ['rating', 'word cloud', 'poll', 'open text', 'survey'] },
      { name: 'Training Evaluation', description: 'Post-training feedback with rating scales, key takeaways, and improvement suggestions.', icon: BarChart2, slides: 5, types: ['rating', 'poll', 'word cloud', 'open text'] },
      { name: 'Risk Assessment Workshop', description: 'Collaborative risk identification and prioritisation with team voting.', icon: AlertTriangle, slides: 8, types: ['word cloud', 'poll', 'rating', 'open text', 'Q&A'] },
    ],
  },
]

export default function PublicTemplatesPage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="py-20 px-6 hero-fade-up hero-fade-up-1">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <Layers className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            Templates built for emergency services
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Start with a ready-made template designed by training professionals for real-world use. Customise for your team in minutes.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link href="/register" className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors btn-animated">
              Get started free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="pb-12 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-8 text-center">
          <div>
            <p className="text-3xl font-bold text-foreground">12</p>
            <p className="text-xs text-muted-foreground mt-0.5">Templates</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div>
            <p className="text-3xl font-bold text-foreground">8</p>
            <p className="text-xs text-muted-foreground mt-0.5">Slide types</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div>
            <p className="text-3xl font-bold text-foreground">95</p>
            <p className="text-xs text-muted-foreground mt-0.5">Total slides</p>
          </div>
        </div>
      </section>

      {/* Template categories */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto space-y-14">
          {TEMPLATE_CATEGORIES.map((cat, catIdx) => (
            <div key={cat.title} className="hero-fade-up" style={{ animationDelay: `${(catIdx + 1) * 150}ms` }}>
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${cat.color}`}>
                  <cat.icon className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">{cat.title}</h2>
                  <p className="text-xs text-muted-foreground">{cat.description}</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {cat.templates.map((t) => (
                  <div
                    key={t.name}
                    className="bg-card border border-border rounded-xl p-5 hover:border-primary/20 hover:shadow-md transition-all group card-hover"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200">
                        <t.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">{t.name}</h3>
                        <p className="text-[10px] text-muted-foreground/60 mt-0.5">{t.slides} slides</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3">{t.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {t.types.map((type) => (
                        <span key={type} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-primary/5">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold">Need a custom template?</h2>
          <p className="text-muted-foreground mt-2">
            Create your own from scratch or customise any existing template for your specific training needs.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link href="/register" className="px-6 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors btn-animated">
              Start creating
            </Link>
            <Link href="/contact" className="px-6 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              Request a template
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
