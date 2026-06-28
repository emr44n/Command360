import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { SolutionPageClient } from './SolutionPageClient'

/* ─── Valid slugs ─── */
const SLUGS = [
  'fire-rescue',
  'police',
  'ambulance',
  'armed-forces',
  'coastguard',
  'search-rescue',
  'prison-probation',
  'local-authority',
  'civil-contingencies',
  'nhs-emergency',
  'voluntary-sector',
]

/* ─── Service names for metadata ─── */
const SERVICE_NAMES: Record<string, string> = {
  'fire-rescue': 'Fire & Rescue',
  'police': 'Police',
  'ambulance': 'Ambulance',
  'armed-forces': 'Armed Forces',
  'coastguard': 'HM Coastguard',
  'search-rescue': 'Search & Rescue',
  'prison-probation': 'Prison & Probation',
  'local-authority': 'Local Authority',
  'civil-contingencies': 'Civil Contingencies',
  'nhs-emergency': 'NHS Emergency Departments',
  'voluntary-sector': 'Voluntary Sector',
}

const SERVICE_DESCRIPTIONS: Record<string, string> = {
  'fire-rescue': 'From watch-level safety briefings to post-incident hot debriefs, Command 360 helps your crews engage, learn, and feed back — all in real time, on any device.',
  'police': 'Deliver consistent policy training, knowledge assessments, and shift briefings with instant feedback, anonymous participation, and audit-ready reporting.',
  'ambulance': 'Run clinical protocol training, CPD sessions, and welfare checks with anonymous response options — all from a phone, tablet, or laptop at station.',
  'armed-forces': 'Conduct operational briefings, readiness assessments, and training evaluations at scale across units, formations, and locations.',
  'coastguard': 'Maritime safety training, operational briefings, and volunteer coordination sessions with real-time participation from any device.',
  'search-rescue': 'Team training exercises, equipment familiarisation, and operational readiness assessments designed for volunteer and professional SAR teams.',
  'prison-probation': 'Staff training, security procedure assessments, and policy awareness sessions with secure, anonymous participation for sensitive environments.',
  'local-authority': 'Emergency planning exercises, council briefings, and community resilience training with full participation tracking and exportable data.',
  'civil-contingencies': 'Multi-agency exercises, table-top scenarios, and emergency response plan testing with real-time feedback collection and AI-powered analysis.',
  'nhs-emergency': 'Clinical governance training, major incident briefings, and team development sessions with confidential feedback and exportable evidence.',
  'voluntary-sector': 'Volunteer induction, skills assessment, and coordination briefings for community response teams, charities, and voluntary organisations.',
}

/* ─── Static params + metadata ─── */
export async function generateStaticParams() {
  return SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  if (!SLUGS.includes(slug)) return { title: 'Solution — Command 360' }
  const name = SERVICE_NAMES[slug]
  const description = SERVICE_DESCRIPTIONS[slug]
  const title = `${name} Training & Briefings — Command 360`
  const path = `/solutions/${slug}`
  const image = `/solutions/${slug}.webp`
  return {
    title,
    description,
    keywords: [
      `${name} training`, `${name} briefings`, `${name} CPD`,
      'interactive training', 'emergency services training', 'UK blue light training',
      'live polls', 'session debrief', 'Command 360',
    ],
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: 'Command 360',
      type: 'website',
      images: [{ url: image, width: 1000, height: 1250, alt: `${name} professionals — Command 360 interactive training` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}

/* ─── Page component (server wrapper) ─── */
export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!SLUGS.includes(slug)) notFound()

  return <SolutionPageClient slug={slug} />
}
