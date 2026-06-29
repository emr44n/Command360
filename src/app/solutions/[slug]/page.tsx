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
  'fire-rescue': "Scenario-based incident command training for UK Fire & Rescue. Rehearse decision-making under pressure, JESIP joint working and NOG-aligned exercises with Command 360.",
  'police': "Scenario-based police training on Command 360: rehearse NDM decisions, public order and command under pressure, with debriefs and analytics that reflect College of Policing APP.",
  'ambulance': "Scenario-based ambulance training for UK trusts. Rehearse clinical decisions, major-incident command and JESIP joint working, with CPD evidence built in.",
  'armed-forces': "Command 360 delivers scenario-based command training and assurance evidence for the UK Armed Forces, supporting DSAT, collective training and multi-agency readiness.",
  'coastguard': "Scenario-based HM Coastguard training software for SAR coordination, coastal rescue and multi-agency exercises. Build, run and debrief realistic incidents with Command 360.",
  'search-rescue': "Scenario-based search and rescue training for UK SAR, mountain, lowland and coastal volunteer teams. Rehearse search management, casualty care and multi-agency command.",
  'prison-probation': "Scenario-based prison and probation training for HMPPS teams. Rehearse de-escalation, use-of-force decisions, safety procedures and multi-agency incidents with Command 360.",
  'local-authority': "Scenario-based emergency planning and resilience training for UK local authorities. Rehearse Category 1 duties, JESIP joint working and business continuity with Command 360.",
  'civil-contingencies': "Civil contingencies training and exercising software for UK Local Resilience Forums. Run table-top and live-style scenarios, review capability and capture learning.",
  'nhs-emergency': "Scenario-based major incident and surge training for NHS emergency departments. Rehearse EPRR, MIMMS and RCEM-aligned decisions with exportable debrief evidence.",
  'voluntary-sector': "Command 360 delivers scenario-based incident-command training for the voluntary sector, supporting volunteer induction, multi-agency exercising and resilience.",
}

const SERVICE_KEYWORDS: Record<string, string[]> = {
  'fire-rescue': ["fire and rescue incident command training","fire service scenario based training","incident commander assessment software","National Operational Guidance training exercises","fire and rescue tabletop exercise platform","JESIP multi-agency training","decision making under pressure fire service","fire command competence assessment","fire and rescue debrief and analytics software","blue light incident command simulation"],
  'police': ["police scenario training software","national decision model training","police command training platform","public order training exercises","police decision-making under pressure","police CPD training tool","incident command training UK police","police debrief and analytics software","APP-aligned police training"],
  'ambulance': ["ambulance scenario training platform","paramedic clinical decision making training","JRCALC scenario training","ambulance major incident exercise software","EPRR ambulance training","paramedic CPD evidence portfolio","ambulance command and triage simulation","JESIP multi-agency ambulance training","NHS ambulance trust training software","paramedic competence assessment tool"],
  'armed-forces': ["Armed Forces training platform","DSAT training software","military collective training simulation","command decision training under pressure","Defence training assurance software","JESIP multi-agency military training","Military Aid to the Civil Authorities exercise","scenario-based command training UK","military readiness training tool"],
  'coastguard': ["HM Coastguard training software","Coastguard Rescue Officer training","coastal rescue scenario training","maritime search and rescue exercises","SAR coordination training UK","Coastguard Rescue Team training platform","declared facility competence assurance","multi-agency SAR exercise software"],
  'search-rescue': ["search and rescue training platform","SAR volunteer training UK","mountain rescue training scenarios","lowland rescue exercise software","search management training","casualty care scenario training","multi-agency SAR exercise","incident command training search and rescue"],
  'prison-probation': ["prison and probation training software","HMPPS scenario training","de-escalation training for prison officers","use of force decision-making training","custody incident command simulation","use of force training support","OMiC training tools","probation staff safety training","prison incident debrief and analytics","blue light immersive training platform"],
  'local-authority': ["local authority emergency planning training","Civil Contingencies Act 2004 training","Category 1 responder exercise platform","Local Resilience Forum exercise software","business continuity scenario training","JESIP multi-agency training","community resilience training UK","emergency planning debrief and analytics","council incident command training"],
  'civil-contingencies': ["civil contingencies training","Local Resilience Forum exercises","Civil Contingencies Act 2004 training","table-top exercise software","multi-agency exercise platform","emergency planning exercise tool","National Risk Register scenario training","LRF readiness and exercising","resilience training for blue-light services","JESIP joint working exercises"],
  'nhs-emergency': ["NHS emergency department major incident training","ED surge scenario training","EPRR exercise software NHS","hospital major incident command training","MIMMS CSCATTT training simulation","emergency department debrief and analytics","RCEM aligned ED training platform","CQC evidence emergency department training","blue light incident command simulation","NHS emergency preparedness tabletop exercise"],
  'voluntary-sector': ["voluntary sector emergency response training","voluntary sector civil protection training","volunteer induction emergency services","Local Resilience Forum voluntary sector exercise","multi-agency exercise voluntary sector","scenario-based training emergency volunteers","voluntary sector incident command training","JESIP joint working voluntary sector","emergency responder volunteer training UK","community resilience exercise platform"],
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
    keywords: SERVICE_KEYWORDS[slug] ?? [
      `${name} training`, `${name} briefings`, 'interactive training', 'emergency services training', 'Command 360',
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
