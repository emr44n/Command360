import { PublicLayout } from '@/components/layout/PublicLayout'
import Link from 'next/link'
import {
  Flame, Shield, Siren, Radio, Anchor, Search,
  Lock, Building2, AlertTriangle, Heart, Users, ArrowRight,
} from 'lucide-react'
import { JoinCodeInput } from '@/components/join/JoinCodeInput'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Solutions — Command 360',
  description: 'Interactive training solutions for every emergency service.',
}

const SERVICES = [
  { slug: 'fire-rescue', name: 'Fire & Rescue', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/10', description: 'Safety briefings, equipment checks, and incident debriefs with live participation from all crew members.' },
  { slug: 'police', name: 'Police', icon: Shield, color: 'text-blue-500', bg: 'bg-blue-500/10', description: 'Briefing sessions, policy training, and knowledge assessments with instant feedback and reporting.' },
  { slug: 'ambulance', name: 'Ambulance', icon: Siren, color: 'text-emerald-500', bg: 'bg-emerald-500/10', description: 'Clinical protocol training, CPD sessions, and welfare checks with anonymous response options.' },
  { slug: 'armed-forces', name: 'Armed Forces', icon: Radio, color: 'text-slate-600', bg: 'bg-slate-500/10', description: 'Operational briefings, readiness assessments, and training evaluations at scale.' },
  { slug: 'coastguard', name: 'HM Coastguard', icon: Anchor, color: 'text-sky-500', bg: 'bg-sky-500/10', description: 'Maritime safety training, operational briefings, and volunteer coordination sessions.' },
  { slug: 'search-rescue', name: 'Search & Rescue', icon: Search, color: 'text-amber-500', bg: 'bg-amber-500/10', description: 'Team training exercises, equipment familiarisation, and operational readiness assessments.' },
  { slug: 'prison-probation', name: 'Prison & Probation', icon: Lock, color: 'text-zinc-500', bg: 'bg-zinc-500/10', description: 'Staff training, security procedure assessments, and policy awareness sessions.' },
  { slug: 'local-authority', name: 'Local Authority', icon: Building2, color: 'text-violet-500', bg: 'bg-violet-500/10', description: 'Emergency planning exercises, council briefings, and community resilience training.' },
  { slug: 'civil-contingencies', name: 'Civil Contingencies', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10', description: 'Multi-agency exercises, table-top scenarios, and emergency response plan testing.' },
  { slug: 'nhs-emergency', name: 'NHS Emergency Departments', icon: Heart, color: 'text-pink-500', bg: 'bg-pink-500/10', description: 'Clinical governance training, major incident briefings, and team development sessions.' },
  { slug: 'voluntary-sector', name: 'Voluntary Sector', icon: Users, color: 'text-teal-500', bg: 'bg-teal-500/10', description: 'Volunteer induction, skills assessment, and coordination briefings for community response teams.' },
]

export default function SolutionsPage() {
  return (
    <PublicLayout>
      {/* Hero — Dark */}
      <section className="relative bg-[#07070a] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(220,38,38,0.12),transparent)]" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
        </div>
        <div className="relative max-w-4xl mx-auto px-5 pt-32 pb-24 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-[13px] text-white/60 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 pulse-dot" />
            Solutions
          </span>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
            Purpose-built for{' '}
            <span className="bg-gradient-to-r from-red-400 via-red-500 to-orange-500 gradient-text">every service</span>
          </h1>
          <p className="text-lg text-white/45 max-w-2xl mx-auto">
            Command 360 is designed for emergency services training. Choose your service to see how we can help your team.
          </p>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-24 md:py-32 px-6 bg-background">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICES.map((service) => (
            <Link
              key={service.slug}
              href={`/solutions/${service.slug}`}
              className="group bg-card border border-border rounded-2xl p-6 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all"
            >
              <div className={`w-10 h-10 rounded-xl ${service.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <service.icon className={`w-5 h-5 ${service.color}`} />
              </div>
              <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">{service.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA — Dark */}
      <section className="relative bg-[#07070a] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(220,38,38,0.12),transparent)]" />
        </div>
        <div className="relative max-w-3xl mx-auto px-5 py-24 text-center">
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white mb-4">
            Don&apos;t see your service?
          </h2>
          <p className="text-white/40 text-lg mb-8">Command 360 works for any training context. Contact us to discuss your specific needs.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <Link href="/register" className="group inline-flex items-center gap-2 px-8 h-12 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-500 transition-all hover:shadow-lg hover:shadow-red-500/25 cursor-pointer">
              Get started free <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link href="/contact" className="inline-flex items-center px-8 h-12 rounded-xl text-sm font-medium border border-white/[0.12] text-white/70 hover:text-white hover:border-white/[0.25] transition-all cursor-pointer">
              Contact us
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
