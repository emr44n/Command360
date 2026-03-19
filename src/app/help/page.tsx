import { PublicLayout } from '@/components/layout/PublicLayout'
import Link from 'next/link'
import {
  BookOpen, Play, BarChart2, Users, Settings, HelpCircle,
  ChevronRight, Search,
} from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Help Centre — Command 360',
  description: 'Guides and resources to help you get the most out of Command 360.',
}

const CATEGORIES = [
  {
    icon: BookOpen,
    title: 'Getting Started',
    description: 'Create your account, build your first deck, and run a session.',
    articles: ['Creating your first deck', 'Adding interactive slides', 'Understanding slide types', 'Sharing your session link'],
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
    description: 'Inviting team members, managing roles, and sharing decks.',
    articles: ['Inviting team members', 'Understanding roles', 'Sharing decks', 'Organisation settings'],
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
    <PublicLayout>
      {/* Hero */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight">Help Centre</h1>
          <p className="text-muted-foreground mt-3">
            Find guides, tutorials, and answers to common questions.
          </p>
          <div className="mt-6 relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search for help..."
              className="w-full pl-11 pr-4 py-3 rounded-full bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => (
            <div key={cat.title} className="bg-card border border-border rounded-2xl p-6 hover:border-primary/20 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <cat.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{cat.title}</h3>
              <p className="text-xs text-muted-foreground mb-4">{cat.description}</p>
              <ul className="space-y-1.5">
                {cat.articles.map((a) => (
                  <li key={a}>
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                      <ChevronRight className="w-3 h-3" />
                      {a}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Still need help */}
      <section className="py-12 px-6 bg-primary/5">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-xl font-bold">Still need help?</h2>
          <p className="text-muted-foreground text-sm mt-2">
            Our team is here to support you. Get in touch and we&apos;ll respond within 24 hours.
          </p>
          <Link href="/contact" className="inline-flex mt-4 px-6 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">
            Contact support
          </Link>
        </div>
      </section>
    </PublicLayout>
  )
}
