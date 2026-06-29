'use client'

import { FaqAccordion } from '@/components/home/FaqAccordion'
import { useAuthSlideOver } from '@/components/auth/AuthSlideOverProvider'
import { SiteShell } from '@/components/site/SiteShell'
import { PageHero, Eyebrow, LightSection, DarkSection, Container, ServiceHeroImage } from '@/components/site/primitives'
import { SpotlightCard } from '@/components/home/SpotlightCard'
import {
  Flame, Shield, Siren, Radio, Anchor, Search,
  Lock, Building2, AlertTriangle, Heart, Users,
  BarChart2, Cloud, HelpCircle, MessageCircle, ClipboardList,
  CheckCircle, ArrowRight, Zap, Globe, FileText, Eye, ShieldAlert,
  Smartphone, Timer, TrendingUp, Award, BookOpen,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { CSSProperties } from 'react'

/* ─── Types ─── */
interface UseCase {
  title: string
  description: string
  icon: LucideIcon
}

interface ServiceData {
  slug: string
  name: string
  icon: LucideIcon
  color: string
  bg: string
  gradient: string
  heroGlow: string
  heroTitle: string
  heroDescription: string
  heroStats: { value: string; label: string }[]
  useCases: UseCase[]
  benefits: { title: string; description: string; icon: LucideIcon }[]
  templateSuggestions: string[]
  faqs: { question: string; answer: string }[]
  ctaHeadline: string
  /* bespoke, per-service content (added to bolster each page) */
  standards?: { name: string; description: string }[]
  evidence?: string
  multiAgency?: string
}

/* ─── Slide types (shared) ─── */
const SLIDE_TYPES = [
  {
    icon: BarChart2,
    label: 'Live Polling',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    accent: '#3E6DC4',
    description: 'Gauge opinions and readiness in real time with animated bar charts.',
  },
  {
    icon: Cloud,
    label: 'Word Clouds',
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10',
    accent: '#2592a3',
    description: 'Capture collective sentiment with beautiful, growing word clouds.',
  },
  {
    icon: HelpCircle,
    label: 'Quizzes',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    accent: '#2E9E63',
    description: 'Scored, timed knowledge checks with leaderboards and instant results.',
  },
  {
    icon: MessageCircle,
    label: 'Q&A',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    accent: '#c98a2a',
    description: 'Anonymous questions with upvoting so the most important rise to the top.',
  },
  {
    icon: ClipboardList,
    label: 'Surveys',
    color: 'text-pink-500',
    bg: 'bg-pink-500/10',
    accent: '#D94B3D',
    description: 'Multi-question feedback forms for structured data collection after sessions.',
  },
]

/* ─── Services data ─── */
const SERVICES: ServiceData[] = [
  {
    slug: 'fire-rescue',
    name: 'Fire & Rescue',
    icon: Flame,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    gradient: 'from-orange-500/10 to-red-500/5',
    heroGlow: 'rgba(249,115,22,0.15)',
    heroTitle: 'Interactive training built for Fire & Rescue teams',
    heroDescription: 'From watch-level safety briefings to post-incident hot debriefs, Command 360 helps your crews engage, learn, and feed back — all in real time, on any device.',
    heroStats: [
      { value: '3x', label: 'More participation than hand-raising' },
      { value: '< 5s', label: 'For crews to join a session' },
      { value: '100%', label: 'Anonymous option for honest feedback' },
    ],
    useCases: [
      { title: 'Watch-level safety briefings', description: 'Replace passive briefings with live polls and quick-fire knowledge checks that keep every firefighter engaged.', icon: ShieldAlert },
      { title: 'Equipment competency checks', description: 'Use timed quizzes to verify BA, ladder, and pump competency with automatic scoring and records.', icon: Award },
      { title: 'Incident debriefs & hot debriefs', description: 'Capture honest crew sentiment immediately after incidents using anonymous word clouds and open-text slides.', icon: Timer },
      { title: 'Operational readiness assessments', description: 'Run station-wide polls to gauge crew confidence on procedures, PPE, and operational scenarios.', icon: TrendingUp },
      { title: 'New recruit induction', description: 'Onboard new firefighters with interactive quizzes on SOPs, station protocols, and safety procedures.', icon: BookOpen },
      { title: 'Risk assessment workshops', description: 'Gather crew input on site risks using surveys and collaborative Q&A before planned operations.', icon: Eye },
    ],
    benefits: [
      { title: 'Engage every firefighter', description: 'Move beyond one-way briefings. Every crew member can contribute to discussions and knowledge checks in real-time — whether on station or at an incident ground.', icon: Users },
      { title: 'Capture debrief insights', description: 'Use word clouds and open text to gather honest, anonymous feedback after incidents while details are still fresh. Export results for operational learning.', icon: FileText },
      { title: 'Track competency over time', description: 'Quiz-based assessments with automatic scoring help track knowledge across your watch or station. Export CSV reports for training records and compliance.', icon: TrendingUp },
    ],
    templateSuggestions: ['Safety Briefing', 'Incident Debrief', 'Equipment Check', 'Hot Debrief', 'BA Competency Quiz', 'New Recruit Induction'],
    faqs: [
      { question: 'Can crew members join on their phones at the station?', answer: 'Yes — Command 360 is fully mobile-responsive. Crew join by entering a 6-digit code on any device. No app download or account needed.' },
      { question: 'Is feedback truly anonymous?', answer: 'When anonymous mode is enabled, responses cannot be traced back to individuals. This is ideal for sensitive topics like welfare checks and incident feedback.' },
      { question: 'Can I use it for mandatory training records?', answer: 'Yes. Quiz scores and participation data can be exported as CSV files for your training records and compliance audits.' },
      { question: 'Does it work at incident grounds with limited signal?', answer: 'Command 360 is lightweight and works on any mobile connection. For truly offline scenarios, sessions can be prepared in advance and run when connectivity returns.' },
    ],
    ctaHeadline: 'Run your next safety briefing with live crew input.',
  },
  {
    slug: 'police',
    name: 'Police',
    icon: Shield,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    gradient: 'from-blue-500/10 to-indigo-500/5',
    heroGlow: 'rgba(59,130,246,0.15)',
    heroTitle: 'Interactive briefings built for Police teams',
    heroDescription: 'Deliver consistent policy training, knowledge assessments, and shift briefings with instant feedback, anonymous participation, and audit-ready reporting.',
    heroStats: [
      { value: '90%', label: 'Prefer interactive briefings' },
      { value: '60%', label: 'Faster than paper-based checks' },
      { value: 'CSV', label: 'Export for audit compliance' },
    ],
    useCases: [
      { title: 'Shift briefings and tasking', description: 'Start every shift with a quick poll or knowledge check to ensure awareness of current priorities and operational orders.', icon: Timer },
      { title: 'Policy and procedure training', description: 'Roll out new policies with embedded quizzes to verify understanding. Track completion rates across teams and divisions.', icon: BookOpen },
      { title: 'Use of force refresher assessments', description: 'Scenario-based quizzes test decision-making on use of force situations with instant feedback and discussion.', icon: ShieldAlert },
      { title: 'Community engagement feedback', description: 'Capture structured feedback from community events, public meetings, and neighbourhood panels using surveys.', icon: Users },
      { title: 'Detective training workshops', description: 'Interactive case study presentations with polls and Q&A to develop investigative thinking and share good practice.', icon: Search },
      { title: 'Promotion preparation sessions', description: 'Test NIE/OSPRE knowledge with timed quizzes, leaderboards, and detailed scoring for officers preparing for promotion.', icon: Award },
    ],
    benefits: [
      { title: 'Standardise training delivery', description: 'Ensure consistent training across divisions and BCUs with reusable presentation templates, standardised quizzes, and centralised content management.', icon: Globe },
      { title: 'Anonymous feedback on sensitive topics', description: 'Enable honest responses on welfare, wellbeing, policy understanding, and conduct matters without identifying individual officers.', icon: Eye },
      { title: 'Audit-ready reporting', description: 'Export session data as CSV for training records, compliance audits, HMICFRS inspections, and performance tracking across the force.', icon: FileText },
    ],
    templateSuggestions: ['Shift Briefing', 'Policy Training', 'Knowledge Check', 'Welfare Survey', 'Use of Force Scenario', 'Promotion Prep Quiz'],
    faqs: [
      { question: 'Can officers join during parade briefings?', answer: 'Yes. Officers simply enter a 6-digit code on their phone or MDT. No app needed — it runs in any browser in seconds.' },
      { question: 'Is it suitable for sensitive welfare surveys?', answer: 'Absolutely. Anonymous mode ensures responses cannot be traced to individuals, making it ideal for sensitive topics like welfare, conduct, and whistleblowing.' },
      { question: 'Can we track which officers have completed mandatory training?', answer: 'Yes. Named sessions track individual participation and quiz scores. Export data as CSV for your training management system.' },
      { question: 'Can it be used across multiple divisions?', answer: 'Yes. Create template presentations centrally and share them across divisions. Each team can run their own sessions with local results.' },
    ],
    ctaHeadline: 'Make your next briefing count with live officer input.',
  },
  {
    slug: 'ambulance',
    name: 'Ambulance',
    icon: Siren,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    gradient: 'from-emerald-500/10 to-teal-500/5',
    heroGlow: 'rgba(16,185,129,0.15)',
    heroTitle: 'Interactive training built for Ambulance services',
    heroDescription: 'Run clinical protocol training, CPD sessions, and welfare checks with anonymous response options — all from a phone, tablet, or laptop at station.',
    heroStats: [
      { value: 'CPD', label: 'Ready for clinical development' },
      { value: 'Mobile', label: 'Join from any device on station' },
      { value: 'Anon', label: 'Anonymous welfare checks' },
    ],
    useCases: [
      { title: 'Clinical protocol assessments', description: 'Test paramedic knowledge on JRCALC guidelines, medication protocols, and clinical procedures with scored quizzes.', icon: BookOpen },
      { title: 'CPD training sessions', description: 'Deliver interactive CPD content with embedded polls and quizzes. Track participation for revalidation evidence.', icon: Award },
      { title: 'Welfare and wellbeing checks', description: 'Anonymous surveys let crews share honest feedback on workload, fatigue, and mental health without fear of identification.', icon: Heart },
      { title: 'New guideline roll-outs', description: 'When new clinical guidelines drop, use quizzes and polls to verify understanding across all stations quickly.', icon: Zap },
      { title: 'Paramedic skill refreshers', description: 'Scenario-based quizzes covering airway management, cardiac arrest algorithms, and trauma assessment protocols.', icon: ShieldAlert },
      { title: 'Patient care scenario reviews', description: 'Present anonymised cases with embedded polls to discuss clinical decision-making and share learning.', icon: Eye },
    ],
    benefits: [
      { title: 'Clinical knowledge verification', description: 'Use quizzes to assess understanding of JRCALC protocols and clinical guidelines with immediate feedback, automatic scoring, and exportable results.', icon: HelpCircle },
      { title: 'Wellbeing monitoring at scale', description: 'Anonymous surveys help identify welfare concerns across crews and stations without individual identification. Trend data over time.', icon: Heart },
      { title: 'Flexible delivery for shift workers', description: 'Works on mobile devices with minimal data — ideal for station-based training, remote CPD sessions, or quick knowledge checks between jobs.', icon: Smartphone },
    ],
    templateSuggestions: ['Protocol Training', 'CPD Session', 'Welfare Check', 'Clinical Scenario', 'JRCALC Quiz', 'Revalidation Evidence'],
    faqs: [
      { question: 'Can paramedics join between emergency calls?', answer: 'Yes. Sessions can be paused and resumed. Crew members can join at any point during an active session from their phone.' },
      { question: 'Does it help with CPD evidence for revalidation?', answer: 'Yes. Quiz scores and session participation records can be exported as evidence for HCPC revalidation portfolios.' },
      { question: 'Can we run welfare checks anonymously?', answer: 'Absolutely. Anonymous surveys ensure no individual identification — perfect for sensitive topics like fatigue, mental health, and workload concerns.' },
      { question: 'Is it suitable for clinical governance meetings?', answer: 'Yes. Present anonymised cases with polls to gather clinical opinions, then export the discussion data for governance records.' },
    ],
    ctaHeadline: 'Deliver your next CPD session with real-time crew engagement.',
  },
  {
    slug: 'armed-forces',
    name: 'Armed Forces',
    icon: Radio,
    color: 'text-slate-600',
    bg: 'bg-slate-500/10',
    gradient: 'from-slate-500/10 to-gray-500/5',
    heroGlow: 'rgba(100,116,139,0.15)',
    heroTitle: 'Interactive training built for the Armed Forces',
    heroDescription: 'Conduct operational briefings, readiness assessments, and training evaluations at scale across units, formations, and locations.',
    heroStats: [
      { value: 'Scale', label: 'Run across multiple units' },
      { value: 'Instant', label: 'Readiness assessment results' },
      { value: 'Export', label: 'Full data export capability' },
    ],
    useCases: [
      { title: 'Operational briefings', description: 'Deliver OPORD briefings with embedded polls to confirm understanding of key orders and timings.', icon: ShieldAlert },
      { title: 'Readiness assessments', description: 'Quick-fire quizzes and polls to assess unit readiness levels before deployments and exercises.', icon: TrendingUp },
      { title: 'Post-exercise debriefs', description: 'Structured debriefs with anonymous feedback to capture honest lessons from exercises and operations.', icon: Timer },
      { title: 'Leadership training workshops', description: 'Interactive leadership development sessions with scenario-based polls and discussion Q&A.', icon: Award },
      { title: 'Equipment familiarisation', description: 'Knowledge checks on new equipment, weapon systems, and platform procedures with scored assessments.', icon: BookOpen },
      { title: 'Force protection training', description: 'Test awareness of force protection measures, security procedures, and threat assessment protocols.', icon: Shield },
    ],
    benefits: [
      { title: 'Scale across formations', description: 'Run identical training sessions across multiple units and compare results for standardisation and readiness assessment.', icon: Globe },
      { title: 'Rapid readiness snapshots', description: 'Quiz-based knowledge checks provide instant readiness data without lengthy paper assessments or formal testing arrangements.', icon: Zap },
      { title: 'Secure and controlled', description: 'All data stays within your control with full export capability. No sensitive information is stored beyond what you choose to keep.', icon: Lock },
    ],
    templateSuggestions: ['Operational Briefing', 'Readiness Assessment', 'Post-Exercise Debrief', 'Leadership Workshop', 'Equipment Familiarisation', 'Force Protection Quiz'],
    faqs: [
      { question: 'Can it work in environments with limited connectivity?', answer: 'Command 360 is lightweight and works on basic mobile connections. Sessions can be prepared offline and delivered when connectivity is available.' },
      { question: 'Is it secure enough for military training?', answer: 'Command 360 does not require participants to create accounts. Session data can be exported and deleted. No classified information should be entered into any cloud platform.' },
      { question: 'Can we run assessments for large formations?', answer: 'Yes. Sessions support large numbers of concurrent participants. Multiple units can join the same session using a single code.' },
      { question: 'Does it replace formal testing?', answer: 'Command 360 supplements formal assessment. It is ideal for quick knowledge checks, briefing verification, and informal readiness assessments.' },
    ],
    ctaHeadline: 'Brief your unit with instant feedback and engagement.',
  },
  {
    slug: 'coastguard',
    name: 'HM Coastguard',
    icon: Anchor,
    color: 'text-sky-500',
    bg: 'bg-sky-500/10',
    gradient: 'from-sky-500/10 to-blue-500/5',
    heroGlow: 'rgba(14,165,233,0.15)',
    heroTitle: 'Interactive training built for HM Coastguard',
    heroDescription: 'Maritime safety training, operational briefings, and volunteer coordination sessions with real-time participation from any device.',
    heroStats: [
      { value: 'Mobile', label: 'Works at remote stations' },
      { value: 'No app', label: 'Join with just a code' },
      { value: 'Track', label: 'Training completion records' },
    ],
    useCases: [
      { title: 'Maritime safety training', description: 'Interactive sessions covering rescue techniques, navigation safety, and maritime emergency procedures.', icon: ShieldAlert },
      { title: 'Volunteer team briefings', description: 'Brief volunteer coastguard rescue officers with polls to confirm understanding of procedures and taskings.', icon: Users },
      { title: 'Rescue procedure assessments', description: 'Scored quizzes on cliff rescue, mud rescue, water rescue, and search procedures with instant feedback.', icon: Award },
      { title: 'Equipment competency checks', description: 'Verify knowledge of lifejackets, radio equipment, rescue gear, and PPE through timed assessments.', icon: BookOpen },
      { title: 'Coordination exercise debriefs', description: 'Capture feedback from multi-agency exercises using anonymous surveys and structured Q&A sessions.', icon: Timer },
      { title: 'New volunteer induction', description: 'Onboard new volunteer rescue officers with interactive training covering station procedures and safety.', icon: Zap },
    ],
    benefits: [
      { title: 'Engage volunteer teams', description: 'Interactive sessions ensure volunteer rescue officers are actively engaged in training, not just passively listening to lectures.', icon: Users },
      { title: 'Mobile-first for remote locations', description: 'Participants join from any device — ideal for coastguard teams in remote coastal station locations with limited infrastructure.', icon: Smartphone },
      { title: 'Track training completion', description: 'Session reports show participation and assessment scores for mandatory training records and volunteer competency tracking.', icon: FileText },
    ],
    templateSuggestions: ['Safety Briefing', 'Rescue Procedure Check', 'Volunteer Induction', 'Equipment Training', 'Water Rescue Quiz', 'Multi-Agency Debrief'],
    faqs: [
      { question: 'Can volunteers join from their phones at the station?', answer: 'Yes. Command 360 works on any smartphone browser. Just share a 6-digit code — no app download or account creation needed.' },
      { question: 'Is it suitable for practical training sessions?', answer: 'Yes. Use it alongside practical training to test knowledge before and after practical exercises, or for classroom-based theory sessions.' },
      { question: 'Can we track volunteer training hours?', answer: 'Session data including participation time and quiz scores can be exported as CSV for your volunteer management system.' },
      { question: 'Does it work for multi-agency exercises?', answer: 'Yes. Participants from coastguard, RNLI, police, and other agencies can all join the same session with a single code.' },
    ],
    ctaHeadline: 'Train your volunteer teams with instant engagement.',
  },
  {
    slug: 'search-rescue',
    name: 'Search & Rescue',
    icon: Search,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    gradient: 'from-amber-500/10 to-orange-500/5',
    heroGlow: 'rgba(245,158,11,0.15)',
    heroTitle: 'Interactive training built for Search & Rescue teams',
    heroDescription: 'Team training exercises, equipment familiarisation, and operational readiness assessments designed for volunteer and professional SAR teams.',
    heroStats: [
      { value: 'Scenario', label: 'Based learning and assessment' },
      { value: 'Quick', label: 'Hot debrief capture' },
      { value: 'Free', label: 'Starter plan for volunteer teams' },
    ],
    useCases: [
      { title: 'Team training exercises', description: 'Scenario-based presentations with embedded polls and quizzes to test search planning and decision-making.', icon: BookOpen },
      { title: 'Navigation skill assessments', description: 'Test map reading, compass work, and GPS navigation knowledge with scored, timed quizzes.', icon: Award },
      { title: 'Equipment familiarisation', description: 'Verify knowledge of search equipment, radios, and PPE through interactive assessment sessions.', icon: ShieldAlert },
      { title: 'Scenario-based learning', description: 'Present realistic search scenarios and use polls to test team decision-making at key decision points.', icon: Eye },
      { title: 'Post-search debriefs', description: 'Capture lessons learned immediately after operations using anonymous word clouds and structured feedback.', icon: Timer },
      { title: 'New member onboarding', description: 'Induction training for new team members covering SOPs, safety, and team procedures with knowledge checks.', icon: Users },
    ],
    benefits: [
      { title: 'Scenario-based learning', description: 'Present scenarios with polls and quizzes to test decision-making in realistic search and rescue situations. Discuss results as a team.', icon: Eye },
      { title: 'Team knowledge sharing', description: 'Word clouds and Q&A sessions help capture and share collective team knowledge, experiences, and lessons learned effectively.', icon: Cloud },
      { title: 'Quick hot debriefs', description: 'Hot debrief templates help capture lessons immediately after operations while memories are fresh. Export for organisational learning.', icon: Zap },
    ],
    templateSuggestions: ['Training Exercise Debrief', 'Navigation Assessment', 'Equipment Check', 'Scenario Training', 'Hot Debrief', 'New Member Induction'],
    faqs: [
      { question: 'Is there a free plan for volunteer SAR teams?', answer: 'Yes. The Starter plan is free and includes core features. This is ideal for volunteer teams with limited training budgets.' },
      { question: 'Can we use it during field training?', answer: 'Yes. It works on mobile phones with a basic data connection. Use it for knowledge checks before practical exercises or for theory sessions.' },
      { question: 'Can we capture lessons learned after callouts?', answer: 'Yes. Hot debrief templates with anonymous word clouds and open-text help capture honest feedback while details are fresh.' },
      { question: 'Does it support scenario-based training?', answer: 'Absolutely. Present scenarios with images, then use polls at key decision points to test and discuss team decision-making.' },
    ],
    ctaHeadline: 'Train your team with interactive scenarios and instant feedback.',
  },
  {
    slug: 'prison-probation',
    name: 'Prison & Probation',
    icon: Lock,
    color: 'text-zinc-500',
    bg: 'bg-zinc-500/10',
    gradient: 'from-zinc-500/10 to-gray-500/5',
    heroGlow: 'rgba(113,113,122,0.15)',
    heroTitle: 'Interactive training built for Prison & Probation staff',
    heroDescription: 'Staff training, security procedure assessments, and policy awareness sessions with secure, anonymous participation for sensitive environments.',
    heroStats: [
      { value: 'Anon', label: 'For sensitive staff feedback' },
      { value: 'Track', label: 'Compliance and completion' },
      { value: 'Scale', label: 'Large group briefings' },
    ],
    useCases: [
      { title: 'Security procedure training', description: 'Test staff knowledge on security protocols, emergency procedures, and incident response with scored assessments.', icon: Shield },
      { title: 'Policy awareness assessments', description: 'Roll out new policies with embedded quizzes to verify understanding across all grades and roles.', icon: BookOpen },
      { title: 'Safeguarding training', description: 'Interactive safeguarding awareness sessions with scenario-based polls and knowledge checks.', icon: ShieldAlert },
      { title: 'Staff wellbeing surveys', description: 'Anonymous surveys to monitor staff morale, workload concerns, and wellbeing without individual identification.', icon: Heart },
      { title: 'Incident response drills', description: 'Test readiness for incident scenarios using polls and quizzes to assess decision-making under pressure.', icon: Timer },
      { title: 'New officer induction', description: 'Onboard new prison officers with interactive training covering procedures, safety, and institutional knowledge.', icon: Users },
    ],
    benefits: [
      { title: 'Safe space for sensitive topics', description: 'Anonymous mode enables honest responses on staff welfare, security concerns, violence reduction, and whistleblowing without attribution.', icon: Eye },
      { title: 'Compliance tracking', description: 'Mandatory training completion can be tracked with quiz scores and participation records. Export for HMPPS reporting requirements.', icon: FileText },
      { title: 'Large group support', description: 'Run sessions for large staff groups during briefings, training days, or all-staff meetings with instant real-time results.', icon: Users },
    ],
    templateSuggestions: ['Security Assessment', 'Policy Training', 'Safeguarding Quiz', 'Staff Wellbeing Survey', 'Incident Response Drill', 'New Officer Induction'],
    faqs: [
      { question: 'Can staff join on personal devices?', answer: 'Yes. Staff enter a 6-digit code on any device with a browser. No app installation or account creation required.' },
      { question: 'Is it suitable for mandatory training records?', answer: 'Yes. Named sessions track individual participation and assessment scores. Export data for HMPPS training management systems.' },
      { question: 'Can anonymous surveys really not be traced?', answer: 'When anonymous mode is enabled, no identifying information is collected or stored. Responses are completely anonymous.' },
      { question: 'Does it work within prison security restrictions?', answer: 'Command 360 runs in a standard web browser. Check with your IT team regarding network access policies for the specific establishment.' },
    ],
    ctaHeadline: 'Deliver compliant, interactive training to your staff.',
  },
  {
    slug: 'local-authority',
    name: 'Local Authority',
    icon: Building2,
    color: 'text-violet-500',
    bg: 'bg-violet-500/10',
    gradient: 'from-violet-500/10 to-purple-500/5',
    heroGlow: 'rgba(139,92,246,0.15)',
    heroTitle: 'Interactive training built for Local Authority teams',
    heroDescription: 'Emergency planning exercises, council briefings, and community resilience training with full participation tracking and exportable data.',
    heroStats: [
      { value: 'Multi', label: 'Agency exercise support' },
      { value: 'Export', label: 'Evidence for planning records' },
      { value: 'Browser', label: 'Based — no installs needed' },
    ],
    useCases: [
      { title: 'Emergency planning exercises', description: 'Run table-top exercises with scenario-based polls and quizzes to test emergency response plans and decision-making.', icon: AlertTriangle },
      { title: 'Multi-agency coordination', description: 'Bring together participants from different organisations for joint training exercises with a single session code.', icon: Globe },
      { title: 'Community resilience workshops', description: 'Engage community volunteers in resilience planning with interactive feedback and discussion sessions.', icon: Users },
      { title: 'Staff training days', description: 'Interactive all-staff training covering safeguarding, equality, data protection, and organisational policies.', icon: BookOpen },
      { title: 'Council briefing sessions', description: 'Deliver member briefings with live polling to gauge understanding and gather feedback on proposals.', icon: BarChart2 },
      { title: 'Risk register reviews', description: 'Use surveys and polls to gather structured input from stakeholders during community risk register reviews.', icon: Eye },
    ],
    benefits: [
      { title: 'Multi-agency exercises', description: 'Bring together participants from councils, emergency services, utilities, and voluntary sector for joint training — all joining with one code.', icon: Globe },
      { title: 'Evidence-based planning', description: 'Collect structured feedback during planning exercises to inform emergency response plans. Export all data for planning records.', icon: FileText },
      { title: 'No software installation', description: 'Browser-based platform means no special software installation, procurement, or IT requests needed for participants or organisers.', icon: Smartphone },
    ],
    templateSuggestions: ['Emergency Planning Exercise', 'Risk Assessment Workshop', 'Community Resilience Training', 'Multi-Agency Briefing', 'Staff Training Day', 'Member Briefing'],
    faqs: [
      { question: 'Can external partners join sessions?', answer: 'Yes. Anyone with the 6-digit code can join — no account needed. Perfect for multi-agency exercises with external partners.' },
      { question: 'Is it suitable for elected member briefings?', answer: 'Yes. Use polls and Q&A to engage councillors during briefings. Anonymous mode can be used for sensitive topics.' },
      { question: 'Can we use it for COMAH exercises?', answer: 'Yes. Table-top exercise templates with scenario-based polls are ideal for testing emergency response plans including COMAH site scenarios.' },
      { question: 'Does it meet local authority IT requirements?', answer: 'Command 360 runs in standard web browsers with no software installation required. It is cloud-based with data encryption in transit and at rest.' },
    ],
    ctaHeadline: 'Run your next exercise with real-time multi-agency engagement.',
  },
  {
    slug: 'civil-contingencies',
    name: 'Civil Contingencies',
    icon: AlertTriangle,
    color: 'text-red-500',
    bg: 'bg-red-500/10',
    gradient: 'from-red-500/10 to-orange-500/5',
    heroGlow: 'rgba(239,68,68,0.15)',
    heroTitle: 'Interactive training built for Civil Contingencies',
    heroDescription: 'Multi-agency exercises, table-top scenarios, and emergency response plan testing with real-time feedback collection and AI-powered analysis.',
    heroStats: [
      { value: 'Real-time', label: 'Exercise feedback capture' },
      { value: 'AI', label: 'Powered session analysis' },
      { value: 'No accounts', label: 'For exercise participants' },
    ],
    useCases: [
      { title: 'Table-top exercises', description: 'Present scenarios with embedded polls and quizzes to test decision-making during structured table-top exercises.', icon: BookOpen },
      { title: 'Category 1/2 responder training', description: 'Joint training sessions bringing together all Category 1 and 2 responders with real-time participation and feedback.', icon: ShieldAlert },
      { title: 'Business continuity assessments', description: 'Survey-based assessments of organisational readiness and business continuity planning across partner agencies.', icon: TrendingUp },
      { title: 'Risk assessment workshops', description: 'Collaborative risk assessment sessions using polls and Q&A to gather multi-agency perspectives on community risks.', icon: Eye },
      { title: 'Lessons-learned debriefs', description: 'Structured post-incident debriefs capturing honest anonymous feedback from all responding agencies and teams.', icon: Timer },
      { title: 'Exercise planning and delivery', description: 'End-to-end exercise delivery from injects and scenario presentation to real-time assessment and post-exercise reporting.', icon: ClipboardList },
    ],
    benefits: [
      { title: 'Seamless exercise delivery', description: 'Present scenarios with embedded polls and quizzes to test decision-making. Capture responses in real-time without disrupting exercise flow.', icon: Zap },
      { title: 'Multi-agency participation', description: 'Participants from multiple organisations join the same session via a simple code — no accounts, software, or pre-registration needed.', icon: Globe },
      { title: 'Immediate AI insights', description: 'AI-generated summaries provide instant analysis of exercise outcomes, participant responses, and key themes for debrief reports.', icon: TrendingUp },
    ],
    templateSuggestions: ['Table-Top Exercise', 'Business Continuity Assessment', 'Risk Workshop', 'Lessons Learned Debrief', 'Multi-Agency Exercise', 'COMAH Scenario'],
    faqs: [
      { question: 'Can participants from multiple agencies join?', answer: 'Yes. Share a single 6-digit code. Participants join from any device with no account, software installation, or pre-registration required.' },
      { question: 'Can it handle large-scale exercises?', answer: 'Yes. Sessions support large numbers of concurrent participants from multiple agencies, locations, and organisations.' },
      { question: 'Does it generate exercise reports?', answer: 'AI-powered summaries provide instant analysis. All response data can be exported as CSV for comprehensive exercise reports.' },
      { question: 'Is it suitable for LRF training events?', answer: 'Absolutely. It is designed for the kind of multi-agency, scenario-based exercises that Local Resilience Forums regularly deliver.' },
    ],
    ctaHeadline: 'Deliver your next multi-agency exercise with real-time engagement.',
  },
  {
    slug: 'nhs-emergency',
    name: 'NHS Emergency Departments',
    icon: Heart,
    color: 'text-pink-500',
    bg: 'bg-pink-500/10',
    gradient: 'from-pink-500/10 to-rose-500/5',
    heroGlow: 'rgba(236,72,153,0.15)',
    heroTitle: 'Interactive training built for NHS Emergency Departments',
    heroDescription: 'Clinical governance training, major incident briefings, and team development sessions with confidential feedback and exportable evidence.',
    heroStats: [
      { value: 'CPD', label: 'Evidence for revalidation' },
      { value: 'Confidential', label: 'Anonymous clinical feedback' },
      { value: 'Minutes', label: 'Gather dept-wide feedback' },
    ],
    useCases: [
      { title: 'Clinical governance sessions', description: 'Present cases with embedded polls to assess clinical knowledge and gather anonymised opinions during governance meetings.', icon: ShieldAlert },
      { title: 'Major incident plan briefings', description: 'Brief the department on major incident plans with knowledge checks to verify understanding of roles and procedures.', icon: AlertTriangle },
      { title: 'Team development days', description: 'Interactive team-building sessions with polls, word clouds, and Q&A to develop department culture and teamwork.', icon: Users },
      { title: 'Mortality and morbidity reviews', description: 'Anonymous polling during M&M reviews to gather honest clinical opinions on case management and outcomes.', icon: Eye },
      { title: 'New starter induction', description: 'Onboard new clinicians and nursing staff with interactive department orientation and essential knowledge checks.', icon: BookOpen },
      { title: 'Simulation debrief capture', description: 'Capture structured feedback after simulation training using anonymous surveys and word clouds for learning points.', icon: Timer },
    ],
    benefits: [
      { title: 'Clinical training support', description: 'Assess clinical knowledge with quizzes and gather insights with word clouds during governance and educational meetings. Track CPD evidence.', icon: Award },
      { title: 'Confidential feedback', description: 'Anonymous surveys enable honest feedback during sensitive M&M reviews, patient safety discussions, and governance proceedings.', icon: Eye },
      { title: 'Time-efficient', description: 'Gather feedback from the entire department in minutes rather than hours of individual conversations. Ideal for busy ED environments.', icon: Timer },
    ],
    templateSuggestions: ['Clinical Governance', 'Major Incident Briefing', 'Team Development', 'Simulation Debrief', 'M&M Review', 'New Starter Induction'],
    faqs: [
      { question: 'Can clinicians join during a busy shift?', answer: 'Yes. Sessions can run asynchronously — staff join when available. Or use it during protected teaching time for immediate engagement.' },
      { question: 'Is it suitable for CPD evidence?', answer: 'Yes. Quiz scores and participation data can be exported as evidence for appraisal portfolios and revalidation requirements.' },
      { question: 'Can we use anonymous mode for M&M reviews?', answer: 'Absolutely. Anonymous mode ensures candid clinical discussion without attribution — essential for psychological safety in M&M reviews.' },
      { question: 'Does it meet NHS IG requirements?', answer: 'Command 360 uses encryption in transit and at rest. No patient data should be entered. Session data is controller-managed with full export and deletion capability.' },
    ],
    ctaHeadline: 'Engage your department with interactive clinical training.',
  },
  {
    slug: 'voluntary-sector',
    name: 'Voluntary Sector',
    icon: Users,
    color: 'text-teal-500',
    bg: 'bg-teal-500/10',
    gradient: 'from-teal-500/10 to-emerald-500/5',
    heroGlow: 'rgba(20,184,166,0.15)',
    heroTitle: 'Interactive training built for Voluntary Sector organisations',
    heroDescription: 'Volunteer induction, skills assessment, and coordination briefings for community response teams, charities, and voluntary organisations.',
    heroStats: [
      { value: 'Free', label: 'Starter plan available' },
      { value: 'No app', label: 'Volunteers join instantly' },
      { value: 'Mobile', label: 'Works on any phone' },
    ],
    useCases: [
      { title: 'Volunteer induction training', description: 'Onboard new volunteers with interactive sessions covering safeguarding, health and safety, and organisational procedures.', icon: BookOpen },
      { title: 'Skills and competency assessment', description: 'Test volunteer knowledge and skills with scored quizzes and track competency across your team.', icon: Award },
      { title: 'Team coordination briefings', description: 'Brief volunteer teams before events, deployments, or community activities with live polls for readiness checks.', icon: Users },
      { title: 'Safeguarding awareness training', description: 'Scenario-based safeguarding training with interactive quizzes to verify understanding of policies and procedures.', icon: ShieldAlert },
      { title: 'Post-event debriefs', description: 'Capture volunteer feedback after events using anonymous surveys and word clouds for organisational learning.', icon: Timer },
      { title: 'Fundraising strategy workshops', description: 'Engage your team in planning sessions with polls and Q&A to gather ideas and build consensus on priorities.', icon: TrendingUp },
    ],
    benefits: [
      { title: 'Free tier available', description: 'The Starter plan is free — ideal for voluntary organisations, charities, and community groups operating with limited training budgets.', icon: Zap },
      { title: 'No accounts for participants', description: 'Volunteers join sessions with a simple 6-digit code. No registration, downloads, or email addresses required — reducing barriers.', icon: Globe },
      { title: 'Mobile-friendly for everyone', description: 'Volunteers can participate from their personal phones during in-person or remote training sessions. Works on any modern browser.', icon: Smartphone },
    ],
    templateSuggestions: ['Volunteer Induction', 'Safeguarding Training', 'Skills Assessment', 'Team Briefing', 'Post-Event Debrief', 'Coordination Briefing'],
    faqs: [
      { question: 'Is there really a free plan?', answer: 'Yes. The Starter plan is free and includes core features like polls, word clouds, quizzes, and basic reporting. No credit card required.' },
      { question: 'Do volunteers need to create accounts?', answer: 'No. Volunteers join by entering a 6-digit code in their phone browser. No account, app, or email address needed.' },
      { question: 'Can we track mandatory safeguarding training?', answer: 'Yes. Named sessions track individual participation and quiz scores. Export the data for your training records and compliance needs.' },
      { question: 'Is it suitable for remote volunteer training?', answer: 'Yes. Volunteers can join sessions remotely from any device. Pair it with a video call for a fully interactive remote training experience.' },
    ],
    ctaHeadline: 'Train your volunteers with interactive, accessible sessions.',
  },
]

/* ─── How It Works steps ─── */
const HOW_IT_WORKS_STEPS = [
  {
    number: '1',
    title: 'Create your briefing presentation',
    description: 'Build interactive slides with polls, quizzes, word clouds, and Q&A in minutes using templates or from scratch.',
  },
  {
    number: '2',
    title: 'Launch a live session',
    description: 'Share a 6-digit code and your team joins instantly from any device — no app downloads or accounts needed.',
  },
  {
    number: '3',
    title: 'Get instant insights',
    description: 'See responses in real time, export data as CSV, and get AI-powered summaries for actionable next steps.',
  },
]

/* ─── Helper: extract a raw RGB from heroGlow for Tailwind-friendly use ─── */
function glowColor(heroGlow: string, opacity: number) {
  // heroGlow is like "rgba(249,115,22,0.15)" — extract r,g,b
  const m = heroGlow.match(/rgba?\((\d+),(\d+),(\d+)/)
  if (!m) return heroGlow
  return `rgba(${m[1]},${m[2]},${m[3]},${opacity})`
}

/* ─── Per-service hero image caption (training context, page-relevant) ─── */
const HERO_CAPTIONS: Record<string, string> = {
  'fire-rescue': 'Safety briefings & incident hot debriefs',
  'police': 'Shift briefings, training days & knowledge checks',
  'ambulance': 'Clinical CPD & anonymous crew welfare checks',
  'armed-forces': 'Operational briefings & readiness at scale',
  'coastguard': 'Maritime safety training from any station',
  'search-rescue': 'Scenario-based exercises & hot debriefs',
  'prison-probation': 'Secure staff briefings & compliance tracking',
  'local-authority': 'Emergency planning & resilience exercises',
  'civil-contingencies': 'Multi-agency exercises & table-top scenarios',
  'nhs-emergency': 'Clinical governance & major-incident drills',
  'voluntary-sector': 'Volunteer induction & skills assessment',
}

/* ─── Client page component ─── */
export function SolutionPageClient({ slug }: { slug: string }) {
  const service = SERVICES.find((s) => s.slug === slug)
  const { openAuth } = useAuthSlideOver()

  if (!service) return null

  // Solid service colour (full-opacity rgb) derived from the service heroGlow,
  // used as the per-service v5 accent on the hero glow + square card accents.
  const serviceColour = glowColor(service.heroGlow, 1)
  const faqItems = service.faqs.map((f) => ({ q: f.question, a: f.answer }))

  return (
    <SiteShell faqCta={false}>
      {/* ── Hero ── */}
      <PageHero
        accent={serviceColour}
        eyebrow={<Eyebrow>{service.name}</Eyebrow>}
        title={service.heroTitle}
        lede={service.heroDescription}
        media={
          <ServiceHeroImage
            src={`/solutions/${slug}.webp`}
            name={service.name}
            caption={HERO_CAPTIONS[slug] ?? 'Interactive training, on any device'}
            accent={serviceColour}
          />
        }
      >
        <button
          onClick={() => openAuth('register')}
          className="ff-mono inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.05em] text-white bg-[#C9241A] hover:bg-[#a91d14] v5-glow px-7 py-4 transition-colors cursor-pointer"
        >
          Get started free <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => openAuth('register')}
          className="ff-mono inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.05em] text-white border border-white/22 hover:bg-white/[0.06] hover:border-white/40 px-6 py-4 transition-colors cursor-pointer"
        >
          Book a demo
        </button>
      </PageHero>

      {/* ── Hero stats strip ── */}
      <DarkSection className="!py-0">
        <Container className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-3 border-l border-white/14">
            {service.heroStats.map((stat) => (
              <div key={stat.label} className="p-[28px_26px] border-r border-b border-t border-white/14">
                <p className="ff-display font-extrabold text-[clamp(28px,3.4vw,40px)] leading-none tracking-[-0.02em]" style={{ color: serviceColour }}>{stat.value}</p>
                <p className="text-[13px] text-[#9aa0a8] mt-2.5 leading-relaxed">{stat.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </DarkSection>

      {/* ── Use cases ── */}
      <LightSection>
        <Container>
          <div className="max-w-[640px] mb-3.5">
            <Eyebrow n="01">Use Cases</Eyebrow>
            <h2 className="ff-display font-extrabold text-[clamp(30px,3.8vw,48px)] leading-none tracking-[-0.02em] mt-4 text-[#16191E]">How {service.name} teams use Command 360</h2>
          </div>
          <div className="h-0.5 bg-[#16191E] origin-left mt-7" data-rule />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 border-l border-[rgba(20,25,30,0.16)]">
            {service.useCases.map((uc) => {
              const UCIcon = uc.icon
              return (
                <SpotlightCard key={uc.title} glow={glowColor(service.heroGlow, 0.15)} className="v5-card group relative overflow-hidden p-[34px_30px] border-r border-b border-[rgba(20,25,30,0.16)] block cursor-default">
                  <span className="absolute inset-0 pointer-events-none" style={{ '--v5-wash': glowColor(service.heroGlow, 0.14) } as CSSProperties} aria-hidden="true" />
                  <div className="relative">
                    <div className="w-[42px] h-[42px] flex items-center justify-center mb-5" style={{ background: glowColor(service.heroGlow, 0.12) }}>
                      <UCIcon className="w-5 h-5" style={{ color: serviceColour }} />
                    </div>
                    <h3 className="ff-display font-bold text-[20px] tracking-[-0.01em] mb-2.5 text-[#16191E]">{uc.title}</h3>
                    <p className="text-[14.5px] text-[#5a5f66] leading-relaxed">{uc.description}</p>
                  </div>
                </SpotlightCard>
              )
            })}
          </div>
        </Container>
      </LightSection>

      {/* ── How It Works ── */}
      <DarkSection>
        <div className="absolute top-[-140px] right-[-100px] w-[780px] h-[560px] pointer-events-none" aria-hidden="true" style={{ background: `radial-gradient(55% 65% at 70% 30%, ${glowColor(service.heroGlow, 0.14)}, transparent 76%)`, filter: 'blur(46px)' }} />
        <div className="absolute inset-0 v5-grain opacity-[0.1] mix-blend-overlay pointer-events-none" aria-hidden="true" />
        <Container className="relative">
          <div className="max-w-[640px] mb-9">
            <Eyebrow n="02">How It Works</Eyebrow>
            <h2 className="ff-display font-extrabold text-[clamp(28px,3.6vw,44px)] leading-[1.02] tracking-[-0.02em] mt-4 text-white">Three steps to better {service.name} training</h2>
          </div>
          <div className="grid sm:grid-cols-1 md:grid-cols-3 border-t border-l border-white/14">
            {HOW_IT_WORKS_STEPS.map((step) => (
              <div key={step.number} data-reveal className="group v5-pop cursor-default relative p-[30px_28px] border-r border-b border-white/14">
                <div className="ff-mono text-[12px] font-semibold tracking-[0.1em] uppercase mb-5" style={{ color: serviceColour }}>Step {step.number}</div>
                <div className="w-[42px] h-[42px] flex items-center justify-center mb-5 ff-display text-[20px] font-black text-white" style={{ background: glowColor(service.heroGlow, 0.14) }}>
                  {step.number}
                </div>
                <h3 className="ff-display font-bold text-[19px] tracking-[-0.01em] mb-2 text-white">{step.title}</h3>
                <p className="text-[14px] text-[#9aa0a8] leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </DarkSection>

      {/* ── Slide type showcase (Interactive Tools) ── */}
      <LightSection>
        <Container>
          <div className="max-w-[680px] mb-3.5">
            <Eyebrow n="03">Command Classroom</Eyebrow>
            <h2 className="ff-display font-extrabold text-[clamp(30px,3.8vw,48px)] leading-none tracking-[-0.02em] mt-4 text-[#16191E]">Five powerful question types at your fingertips</h2>
            <p className="text-[16px] text-[#5a5f66] mt-4">Mix and match polls, quizzes, word clouds, Q&amp;A, and surveys in Command Classroom to create engaging {service.name} training sessions.</p>
          </div>
          <div className="h-0.5 bg-[#16191E] origin-left mt-7" data-rule />
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 border-l border-[rgba(20,25,30,0.16)]">
            {SLIDE_TYPES.map((s) => {
              const SIcon = s.icon
              return (
                <SpotlightCard key={s.label} glow={`${s.accent}26`} className="v5-card group relative overflow-hidden p-[30px_24px] border-r border-b border-[rgba(20,25,30,0.16)] block cursor-default">
                  <span className="absolute inset-0 pointer-events-none" style={{ '--v5-wash': `${s.accent}24` } as CSSProperties} aria-hidden="true" />
                  <div className="relative">
                    <div className="w-[42px] h-[42px] flex items-center justify-center mb-5" style={{ background: `${s.accent}18` }}>
                      <SIcon className="w-5 h-5" style={{ color: s.accent }} />
                    </div>
                    <h3 className="ff-display font-bold text-[18px] tracking-[-0.01em] mb-1.5 text-[#16191E]">{s.label}</h3>
                    <p className="ff-mono text-[10px] font-semibold uppercase tracking-[0.1em] mb-2" style={{ color: s.accent }}>Interactive</p>
                    <p className="text-[13.5px] text-[#5a5f66] leading-relaxed">{s.description}</p>
                  </div>
                </SpotlightCard>
              )
            })}
          </div>
        </Container>
      </LightSection>

      {/* ── Benefits ── */}
      <DarkSection>
        <div className="absolute top-[-140px] left-[-100px] w-[780px] h-[560px] pointer-events-none" aria-hidden="true" style={{ background: `radial-gradient(55% 65% at 30% 30%, ${glowColor(service.heroGlow, 0.13)}, transparent 76%)`, filter: 'blur(46px)' }} />
        <div className="absolute inset-0 v5-grain opacity-[0.1] mix-blend-overlay pointer-events-none" aria-hidden="true" />
        <Container className="relative">
          <div className="max-w-[640px] mb-9">
            <Eyebrow n="04">Benefits</Eyebrow>
            <h2 className="ff-display font-extrabold text-[clamp(28px,3.6vw,44px)] leading-[1.02] tracking-[-0.02em] mt-4 text-white">Why {service.name} teams choose Command 360</h2>
          </div>
          <div className="grid sm:grid-cols-1 md:grid-cols-3 border-t border-l border-white/14">
            {service.benefits.map((b) => {
              const BIcon = b.icon
              return (
                <div key={b.title} data-reveal className="group v5-pop cursor-default relative p-[30px_28px] border-r border-b border-white/14">
                  <div className="w-[42px] h-[42px] flex items-center justify-center mb-5" style={{ background: glowColor(service.heroGlow, 0.14) }}>
                    <BIcon className="w-5 h-5" style={{ color: serviceColour }} />
                  </div>
                  <h3 className="ff-display font-bold text-[18px] tracking-[-0.01em] mb-2 text-white">{b.title}</h3>
                  <p className="text-[14px] text-[#9aa0a8] leading-relaxed">{b.description}</p>
                </div>
              )
            })}
          </div>
        </Container>
      </DarkSection>

      {/* ── Standards, evidence & joint working (bespoke per service) ── */}
      {service.standards && service.standards.length > 0 && (
        <LightSection>
          <Container>
            <div className="max-w-[680px] mb-3.5">
              <Eyebrow n="05">Standards &amp; Assurance</Eyebrow>
              <h2 className="ff-display font-extrabold text-[clamp(30px,3.8vw,48px)] leading-none tracking-[-0.02em] mt-4 text-[#16191E]">Built around {service.name} standards</h2>
              <p className="text-[16px] text-[#5a5f66] mt-4">Command 360 helps you train, assess and evidence competence against the frameworks {service.name} teams already work to.</p>
            </div>
            <div className="h-0.5 bg-[#16191E] origin-left mt-7" data-rule />
            <div className="grid sm:grid-cols-2 border-l border-t border-[rgba(20,25,30,0.16)]">
              {service.standards.map((st) => (
                <SpotlightCard key={st.name} glow={glowColor(service.heroGlow, 0.15)} className="v5-card group relative overflow-hidden p-[30px_28px] border-r border-b border-[rgba(20,25,30,0.16)] block cursor-default">
                  <span className="absolute inset-0 pointer-events-none" style={{ '--v5-wash': glowColor(service.heroGlow, 0.14) } as CSSProperties} aria-hidden="true" />
                  <div className="relative">
                    <div className="w-[34px] h-[34px] mb-5" style={{ background: serviceColour }} aria-hidden="true" />
                    <h3 className="ff-display font-bold text-[18px] tracking-[-0.01em] mb-2.5 text-[#16191E]">{st.name}</h3>
                    <p className="text-[14.5px] text-[#5a5f66] leading-relaxed">{st.description}</p>
                  </div>
                </SpotlightCard>
              ))}
            </div>
            {(service.evidence || service.multiAgency) && (
              <div className="grid md:grid-cols-2 gap-x-10 gap-y-8 mt-12 pt-10 border-t border-[rgba(20,25,30,0.16)]">
                {service.evidence && (
                  <div>
                    <div className="ff-mono text-[12px] font-semibold tracking-[0.12em] uppercase mb-3" style={{ color: serviceColour }}>Evidence-led learning</div>
                    <p className="text-[15px] text-[#3a3f46] leading-relaxed">{service.evidence}</p>
                  </div>
                )}
                {service.multiAgency && (
                  <div>
                    <div className="ff-mono text-[12px] font-semibold tracking-[0.12em] uppercase mb-3" style={{ color: serviceColour }}>Multi-agency ready</div>
                    <p className="text-[15px] text-[#3a3f46] leading-relaxed">{service.multiAgency}</p>
                  </div>
                )}
              </div>
            )}
          </Container>
        </LightSection>
      )}

      {/* ── Templates ── */}
      <LightSection>
        <Container>
          <div className="max-w-[640px] mb-3.5">
            <Eyebrow n="06">Ready-Made Presentations</Eyebrow>
            <h2 className="ff-display font-extrabold text-[clamp(30px,3.8vw,48px)] leading-none tracking-[-0.02em] mt-4 text-[#16191E]">Templates designed for {service.name}</h2>
            <p className="text-[16px] text-[#5a5f66] mt-4">Start quickly with purpose-built templates — or create your own from scratch.</p>
          </div>
          <div className="h-0.5 bg-[#16191E] origin-left mt-7 mb-8" data-rule />
          <div className="flex flex-wrap gap-3">
            {service.templateSuggestions.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-2 px-5 py-3 border border-[rgba(20,25,30,0.16)] bg-white/40 text-[14px] font-medium text-[#16191E] cursor-default"
              >
                <CheckCircle className="w-3.5 h-3.5 shrink-0" style={{ color: serviceColour }} />
                {t}
              </span>
            ))}
          </div>
        </Container>
      </LightSection>

      {/* ── FAQ ── */}
      <DarkSection>
        <div className="absolute top-[-140px] right-[-100px] w-[700px] h-[520px] pointer-events-none" aria-hidden="true" style={{ background: `radial-gradient(55% 65% at 70% 30%, ${glowColor(service.heroGlow, 0.1)}, transparent 76%)`, filter: 'blur(46px)' }} />
        <Container className="relative">
          <div className="max-w-[820px] mx-auto text-center mb-10">
            <div className="ff-mono text-[12px] font-semibold tracking-[0.12em] uppercase text-[#C9241A] mb-4">Briefing notes</div>
            <h2 className="ff-display font-extrabold text-[clamp(28px,3.4vw,42px)] leading-[1.02] tracking-[-0.02em] text-white">Common questions</h2>
          </div>
          <div className="max-w-[820px] mx-auto">
            <FaqAccordion items={faqItems} />
          </div>
        </Container>
      </DarkSection>

      {/* ── CTA ── */}
      <DarkSection>
        <div className="absolute bottom-[-200px] left-1/2 -translate-x-1/2 w-[1080px] h-[560px] pointer-events-none" aria-hidden="true" style={{ background: `radial-gradient(60% 80% at 50% 100%, ${glowColor(service.heroGlow, 0.18)}, ${glowColor(service.heroGlow, 0.06)} 48%, transparent 78%)`, filter: 'blur(44px)' }} />
        <div className="absolute inset-0 v5-grain opacity-[0.1] mix-blend-overlay pointer-events-none" aria-hidden="true" />
        <Container className="relative text-center">
          <Eyebrow>Get started today</Eyebrow>
          <h2 className="ff-display font-extrabold text-[clamp(28px,4vw,52px)] leading-[1.04] tracking-[-0.02em] mt-5 text-white max-w-[20ch] mx-auto" data-reveal>
            {service.ctaHeadline}
          </h2>
          <p className="text-[16px] text-[#9aa0a8] mt-5 max-w-[520px] mx-auto" data-reveal>
            Free to get started. No credit card required. Built for those who serve.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3" data-reveal>
            <button
              onClick={() => openAuth('register')}
              className="ff-mono inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.05em] text-white bg-[#C9241A] hover:bg-[#a91d14] v5-glow px-7 py-4 transition-colors cursor-pointer"
            >
              Start free trial <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => openAuth('register')}
              className="ff-mono inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.05em] text-white border border-white/22 hover:bg-white/[0.06] hover:border-white/40 px-6 py-4 transition-colors cursor-pointer"
            >
              Book a demo
            </button>
          </div>
        </Container>
      </DarkSection>
    </SiteShell>
  )
}
