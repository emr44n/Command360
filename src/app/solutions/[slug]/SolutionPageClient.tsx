'use client'

import { ScrollReveal } from '@/components/home/ScrollReveal'
import { FAQAccordion } from '@/components/solutions/FAQAccordion'
import { useAuthSlideOver } from '@/components/auth/AuthSlideOverProvider'
import { PublicLayout } from '@/components/layout/PublicLayout'
import {
  Flame, Shield, Siren, Radio, Anchor, Search,
  Lock, Building2, AlertTriangle, Heart, Users,
  BarChart2, Cloud, HelpCircle, MessageCircle, ClipboardList,
  CheckCircle, ArrowRight, Zap, Globe, FileText, Eye, ShieldAlert,
  Smartphone, Timer, TrendingUp, Award, BookOpen,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

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
}

/* ─── ServiceMockup component ─── */
function ServiceMockup({ name, color, bg }: { name: string; color: string; bg: string }) {
  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Browser frame */}
      <div className="rounded-2xl border border-border bg-card shadow-xl overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/60">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-400/80" />
            <span className="w-3 h-3 rounded-full bg-amber-400/80" />
            <span className="w-3 h-3 rounded-full bg-green-400/80" />
          </div>
          <div className="flex-1 text-center">
            <span className="text-xs text-muted-foreground font-medium">{name} — Command 360</span>
          </div>
        </div>

        {/* Content area */}
        <div className="p-6 space-y-5">
          {/* Poll question */}
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">How confident are you with current procedures?</p>
            <p className="text-xs text-muted-foreground">Live Poll &middot; 4 options</p>
          </div>

          {/* Animated bar chart */}
          <div className="space-y-3">
            {[
              { label: 'Very confident', pct: 42 },
              { label: 'Somewhat confident', pct: 31 },
              { label: 'Needs review', pct: 19 },
              { label: 'Not confident', pct: 8 },
            ].map((bar) => (
              <div key={bar.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{bar.label}</span>
                  <span className="font-semibold">{bar.pct}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full ${bg.replace('/10', '/60')} animate-[grow_1.2s_ease-out_forwards]`}
                    style={{
                      width: `${bar.pct}%`,
                      animation: `grow 1.2s ease-out forwards`,
                      animationDelay: `${0.2 + Math.random() * 0.4}s`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Participant count */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1.5">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-6 h-6 rounded-full border-2 border-card ${bg} flex items-center justify-center`}
                  >
                    <Users className={`w-3 h-3 ${color}`} />
                  </div>
                ))}
              </div>
              <span className="text-xs text-muted-foreground font-medium">24 participants</span>
            </div>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
            </span>
          </div>
        </div>
      </div>

      {/* CSS keyframes for bar animation */}
      <style>{`
        @keyframes grow {
          from { width: 0%; }
        }
      `}</style>
    </div>
  )
}

/* ─── Slide types (shared) ─── */
const SLIDE_TYPES = [
  {
    icon: BarChart2,
    label: 'Live Polling',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    description: 'Gauge opinions and readiness in real time with animated bar charts.',
  },
  {
    icon: Cloud,
    label: 'Word Clouds',
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10',
    description: 'Capture collective sentiment with beautiful, growing word clouds.',
  },
  {
    icon: HelpCircle,
    label: 'Quizzes',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    description: 'Scored, timed knowledge checks with leaderboards and instant results.',
  },
  {
    icon: MessageCircle,
    label: 'Q&A',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    description: 'Anonymous questions with upvoting so the most important rise to the top.',
  },
  {
    icon: ClipboardList,
    label: 'Surveys',
    color: 'text-pink-500',
    bg: 'bg-pink-500/10',
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

/* ─── Client page component ─── */
export function SolutionPageClient({ slug }: { slug: string }) {
  const service = SERVICES.find((s) => s.slug === slug)
  const { openAuth } = useAuthSlideOver()

  if (!service) return null

  const Icon = service.icon

  return (
    <PublicLayout>
      {/* ── Hero ── */}
      <section className="relative bg-[#07070a] overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 90% 60% at 50% -20%, ${service.heroGlow}, transparent)` }} />
          {/* Animated glow orbs behind hero content */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full blur-[150px] float-glow"
            style={{ background: glowColor(service.heroGlow, 0.08) }}
          />
          <div
            className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full blur-[120px] float-glow"
            style={{ background: glowColor(service.heroGlow, 0.06), animationDelay: '-4s' }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full blur-[100px] float-glow"
            style={{ background: glowColor(service.heroGlow, 0.05), animationDelay: '-8s' }}
          />
          {/* Enhanced grid texture using service accent color */}
          <div
            className="absolute inset-0 opacity-[0.10]"
            style={{
              backgroundImage: `linear-gradient(${glowColor(service.heroGlow, 0.4)} 1px, transparent 1px), linear-gradient(90deg, ${glowColor(service.heroGlow, 0.4)} 1px, transparent 1px)`,
              backgroundSize: '64px 64px',
              mask: 'radial-gradient(ellipse 80% 70% at 50% 40%, black, transparent)',
              WebkitMask: 'radial-gradient(ellipse 80% 70% at 50% 40%, black, transparent)',
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#07070a] to-transparent" />
        </div>

        <div className="relative max-w-6xl mx-auto px-5 pt-32 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: hero text */}
            <div className="text-center lg:text-left">
              <ScrollReveal direction="up">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/8 bg-white/6 mb-6 mx-auto lg:mx-0">
                  <Icon className={`w-4 h-4 ${service.color}`} />
                  <span className="text-[10px] uppercase tracking-[0.15em] font-semibold text-white/60">{service.name}</span>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="up">
                <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight mb-5 text-white">{service.heroTitle}</h1>
              </ScrollReveal>

              <ScrollReveal direction="up">
                <p className="text-sm sm:text-base md:text-xl text-white/50 max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed">
                  {service.heroDescription}
                </p>
              </ScrollReveal>

              <ScrollReveal direction="up">
                <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3 mb-12">
                  <button
                    onClick={() => openAuth('register')}
                    className="group inline-flex items-center gap-2 px-8 h-12 rounded-full text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors btn-animated cursor-pointer"
                  >
                    Get started free <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                  <button
                    onClick={() => openAuth('register')}
                    className="inline-flex items-center gap-2 px-8 h-12 rounded-full text-base font-medium border border-white/10 text-white/70 hover:bg-white/5 transition-colors btn-animated cursor-pointer"
                  >
                    Book a demo
                  </button>
                </div>
              </ScrollReveal>

              {/* Stats bar */}
              <ScrollReveal direction="up" stagger>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-lg mx-auto lg:mx-0">
                  {service.heroStats.map((stat) => (
                    <div key={stat.label} className="text-center lg:text-left">
                      <p className={`text-xl sm:text-2xl md:text-3xl font-bold ${service.color}`}>{stat.value}</p>
                      <p className="text-xs text-white/40 mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>

            {/* Right: mockup with animated glow */}
            <ScrollReveal direction="up" delay={200}>
              <div className="hidden lg:block relative">
                {/* Animated glow behind mockup */}
                <div
                  className="absolute -inset-8 rounded-full blur-3xl opacity-30 animate-pulse"
                  style={{ background: `radial-gradient(circle, ${service.heroGlow}, transparent 70%)` }}
                />
                <div className="relative">
                  <ServiceMockup name={service.name} color={service.color} bg={service.bg} />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Use cases ── */}
      <section className="relative py-20 px-5 overflow-hidden border-t border-border/50">
        {/* Animated colored glow orbs */}
        <div
          className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none float-glow"
          style={{ background: glowColor(service.heroGlow, 0.05) }}
        />
        <div
          className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full blur-[100px] pointer-events-none float-glow"
          style={{ background: glowColor(service.heroGlow, 0.03), animationDelay: '-6s' }}
        />
        <div className="relative max-w-5xl mx-auto">
          <ScrollReveal direction="up">
            <div className="text-center mb-14">
              <span className="feature-badge bg-primary/10 text-primary">Use Cases</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight mt-4">
                How {service.name} teams use Command 360
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" stagger>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {service.useCases.map((uc) => {
                const UCIcon = uc.icon
                return (
                  <div
                    key={uc.title}
                    className="group relative p-5 rounded-2xl border border-border bg-card hover:border-primary/20 hover:-translate-y-0.5 transition-all duration-300"
                    style={{ boxShadow: '0 -20px 80px -20px rgba(255,255,255,0.03) inset' }}
                  >
                    {/* Glow effect behind card on hover */}
                    <div
                      className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"
                      style={{ background: glowColor(service.heroGlow, 0.15) }}
                    />
                    {/* Colored top accent line on hover */}
                    <div
                      className="absolute top-0 left-4 right-4 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: `linear-gradient(90deg, transparent, ${glowColor(service.heroGlow, 0.6)}, transparent)` }}
                    />
                    <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                      <UCIcon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-sm mb-1.5">{uc.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{uc.description}</p>
                  </div>
                )
              })}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="relative py-20 px-5 overflow-hidden border-t border-border/50">
        {/* Animated colored glow orbs */}
        <div
          className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none float-glow"
          style={{ background: glowColor(service.heroGlow, 0.04), animationDelay: '-3s' }}
        />
        <div
          className="absolute top-20 right-0 w-[300px] h-[300px] rounded-full blur-[100px] pointer-events-none float-glow"
          style={{ background: glowColor(service.heroGlow, 0.03), animationDelay: '-9s' }}
        />
        <div className="relative max-w-4xl mx-auto">
          <ScrollReveal direction="up">
            <div className="text-center mb-14">
              <span className="feature-badge bg-primary/10 text-primary">How It Works</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight mt-4">
                Three steps to better {service.name} training
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" stagger>
            <div className="relative grid md:grid-cols-3 gap-8">
              {/* Connecting line between steps (desktop) */}
              <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-px bg-gradient-to-r from-border via-primary/20 to-border" />

              {HOW_IT_WORKS_STEPS.map((step) => (
                <div key={step.number} className="group relative text-center hover:-translate-y-0.5 transition-transform duration-300">
                  {/* Numbered circle badge */}
                  <div className="relative mx-auto mb-4">
                    <div className={`w-14 h-14 rounded-full ${service.bg} flex items-center justify-center mx-auto border-4 border-background relative z-10`}>
                      <span className={`text-2xl font-bold ${service.color}`}>{step.number}</span>
                    </div>
                  </div>
                  {/* Pill step label */}
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full bg-muted text-[10px] uppercase tracking-[0.12em] font-semibold text-muted-foreground mb-3">
                    Step {step.number}
                  </span>
                  <h3 className="font-semibold text-base sm:text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Slide type showcase (Interactive Tools) ── */}
      <section className="relative py-20 px-5 overflow-hidden border-t border-border/50">
        {/* Animated colored glow orb */}
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[150px] pointer-events-none float-glow"
          style={{ background: glowColor(service.heroGlow, 0.04) }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-[350px] h-[350px] rounded-full blur-[120px] pointer-events-none float-glow"
          style={{ background: glowColor(service.heroGlow, 0.03), animationDelay: '-5s' }}
        />
        <div className="relative max-w-5xl mx-auto">
          <ScrollReveal direction="left">
            <div className="text-center mb-14">
              <span className="feature-badge bg-blue-500/10 text-blue-500">Command Classroom</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight mt-4 mb-4">
                Five powerful question types at your fingertips
              </h2>
              <p className="text-muted-foreground text-sm sm:text-lg max-w-xl mx-auto">
                Mix and match polls, quizzes, word clouds, Q&amp;A, and surveys in Command Classroom to create engaging {service.name} training sessions.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="left" stagger>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {SLIDE_TYPES.map((s) => {
                const SIcon = s.icon
                return (
                  <div
                    key={s.label}
                    className="group relative text-center p-5 rounded-2xl border border-border bg-card hover:border-primary/20 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
                  >
                    {/* Glow effect behind card on hover */}
                    <div
                      className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"
                      style={{ background: glowColor(service.heroGlow, 0.12) }}
                    />
                    {/* Color accent line at top */}
                    <div className={`absolute top-0 left-0 right-0 h-0.5 ${s.bg.replace('/10', '/40')}`} />
                    <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                      <SIcon className={`w-6 h-6 ${s.color}`} />
                    </div>
                    <h3 className="font-semibold text-sm mb-0.5">{s.label}</h3>
                    {/* "Interactive" sub-label in accent color */}
                    <p className={`text-[10px] uppercase tracking-[0.1em] font-semibold ${s.color} mb-1.5`}>Interactive</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{s.description}</p>
                  </div>
                )
              })}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="relative py-20 px-5 overflow-hidden border-t border-border/50">
        {/* Animated colored glow orbs */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px] pointer-events-none float-glow"
          style={{ background: glowColor(service.heroGlow, 0.05) }}
        />
        <div
          className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full blur-[100px] pointer-events-none float-glow"
          style={{ background: glowColor(service.heroGlow, 0.04), animationDelay: '-7s' }}
        />
        <div className="relative max-w-5xl mx-auto">
          <ScrollReveal direction="right">
            <div className="text-center mb-14">
              <span className="feature-badge bg-primary/10 text-primary">Benefits</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight mt-4">
                Why {service.name} teams choose Command 360
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" stagger>
            <div className="grid md:grid-cols-3 gap-6">
              {service.benefits.map((b) => {
                const BIcon = b.icon
                return (
                  <div
                    key={b.title}
                    className="group relative p-6 rounded-2xl border border-border bg-card hover:border-primary/20 hover:-translate-y-0.5 transition-all duration-300"
                  >
                    {/* Glow effect behind card on hover */}
                    <div
                      className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"
                      style={{ background: glowColor(service.heroGlow, 0.15) }}
                    />
                    <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <BIcon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{b.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{b.description}</p>
                    {/* Mini visual bars */}
                    <div className="flex items-center gap-1">
                      {[60, 80, 45, 90, 70].map((w, j) => (
                        <div
                          key={j}
                          className="h-1 rounded-full"
                          style={{
                            width: `${w * 0.3}px`,
                            background: glowColor(service.heroGlow, 0.15 + (j * 0.08)),
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Templates (scrolling marquee) ── */}
      <section className="relative py-20 px-5 overflow-hidden border-t border-border/50">
        <div
          className="absolute -bottom-40 right-0 w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none float-glow"
          style={{ background: glowColor(service.heroGlow, 0.04), animationDelay: '-2s' }}
        />
        <div className="relative max-w-4xl mx-auto text-center">
          <ScrollReveal direction="up">
            <span className="feature-badge bg-primary/10 text-primary">Ready-Made Presentations</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight mt-4 mb-4">
              Templates designed for {service.name}
            </h2>
            <p className="text-muted-foreground mb-8">
              Start quickly with purpose-built templates — or create your own from scratch.
            </p>
          </ScrollReveal>

          {/* Scrolling marquee */}
          <div className="relative overflow-hidden py-4">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
            <div className="flex animate-[marquee_20s_linear_infinite] gap-3 w-max">
              {/* Double the items for seamless loop */}
              {[...service.templateSuggestions, ...service.templateSuggestions].map((t, i) => (
                <span
                  key={`${t}-${i}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-card text-sm font-medium hover:border-primary/20 hover:shadow-sm transition-all cursor-default shrink-0"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" />
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Marquee keyframes */}
          <style>{`
            @keyframes marquee {
              from { transform: translateX(0); }
              to { transform: translateX(-50%); }
            }
          `}</style>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="relative py-20 px-5 overflow-hidden border-t border-border/50">
        <div
          className="absolute -top-40 -left-40 w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none float-glow"
          style={{ background: glowColor(service.heroGlow, 0.03), animationDelay: '-4s' }}
        />
        <div className="relative max-w-2xl mx-auto">
          <ScrollReveal direction="up">
            <div className="text-center mb-10">
              <span className="feature-badge bg-primary/10 text-primary">FAQ</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight mt-4">
                Common questions
              </h2>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="up">
            <FAQAccordion items={service.faqs} />
          </ScrollReveal>
        </div>
      </section>

      {/* ── Bottom CTA (matches homepage dark CTA style) ── */}
      <section className="relative bg-[#07070a] overflow-hidden border-t border-white/[0.04]">
        {/* Background glow effects matching homepage CTA */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(220,38,38,0.18),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(220,38,38,0.08),transparent)]" />
          {/* Service-colored glow mixed in */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-[150px] float-glow"
            style={{ background: glowColor(service.heroGlow, 0.06) }}
          />
          {/* Grid texture */}
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />
        </div>
        <div className="relative max-w-3xl mx-auto px-5 py-24 md:py-32 text-center">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] uppercase tracking-[0.15em] text-white/40 font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 pulse-dot" />
              Get started today
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
              <span className="bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
                {service.ctaHeadline}
              </span>
            </h2>
            <p className="text-white/35 text-base md:text-lg mb-10 max-w-lg mx-auto">
              Free to get started. No credit card required. Built for those who serve.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => openAuth('register')}
                className="group inline-flex items-center gap-2 px-8 h-13 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-500 transition-all duration-200 hover:shadow-lg hover:shadow-red-500/25 cursor-pointer"
              >
                Start free trial <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={() => openAuth('register')}
                className="inline-flex items-center gap-2 px-8 h-13 rounded-xl text-sm font-medium border border-white/[0.1] text-white/60 hover:text-white hover:border-white/[0.2] transition-all duration-200 cursor-pointer"
              >
                Book a demo
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </PublicLayout>
  )
}
