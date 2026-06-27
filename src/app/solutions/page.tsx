import Link from 'next/link'
import {
  Flame, Shield, Siren, Radio, Anchor, Search,
  Lock, Building2, AlertTriangle, Heart, Users,
} from 'lucide-react'
import type { Metadata } from 'next'
import { SiteShell } from '@/components/site/SiteShell'
import { PageHero, Eyebrow, LightSection, Container } from '@/components/site/primitives'
import { SpotlightCard } from '@/components/home/SpotlightCard'

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

export default function SolutionsPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow={<Eyebrow>Solutions</Eyebrow>}
        title={<>Purpose-built for <span className="text-[#C9241A]">every service</span></>}
        lede="Command 360 is designed for emergency services training. Choose your service to see how we can help your team."
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
    </SiteShell>
  )
}
