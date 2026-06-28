import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PresentationGrid } from '@/components/presentations/PresentationGrid'
import { DashboardCreateNewButton } from '@/components/dashboard/DashboardCreateNewButton'
import { DashboardStats } from '@/components/dashboard/DashboardStats'
import { QuickCreate } from '@/components/dashboard/QuickCreate'
import { QuickCreateStudioCard } from '@/components/dashboard/QuickCreateStudioCard'
import { QuickCreatePresentationCard } from '@/components/dashboard/QuickCreatePresentationCard'
import { RecentlyOpened } from '@/components/dashboard/RecentlyOpened'
import { TrialBanner } from '@/components/dashboard/TrialBanner'
import { OnboardingChecklist } from '@/components/onboarding/OnboardingChecklist'
import Link from 'next/link'
import { LayoutTemplate, ArrowRight, Radio, Monitor } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard — Command 360' }

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch presentations with slide info
  const { data: presentations } = await supabase
    .from('presentations')
    .select('*, slides(count, slide_type)')
    .eq('user_id', user.id)
    .eq('is_archived', false)
    .order('updated_at', { ascending: false })

  // Fetch all sessions for this user's presentations (for analytics)
  const presentationIds = (presentations || []).map((p: { id: string }) => p.id)

  let sessions: { id: string; presentation_id: string; status: string; started_at: string; ended_at: string | null; room_code?: string }[] = []
  let totalParticipants = 0
  let totalResponses = 0

  if (presentationIds.length > 0) {
    const { data: sessionsData } = await supabase
      .from('sessions')
      .select('id, presentation_id, status, started_at, ended_at, room_code')
      .in('presentation_id', presentationIds)
      .order('started_at', { ascending: false })

    sessions = sessionsData || []

    if (sessions.length > 0) {
      const sessionIds = sessions.map((s) => s.id)

      const { count: participantCount } = await supabase
        .from('participants')
        .select('*', { count: 'exact', head: true })
        .in('session_id', sessionIds)

      totalParticipants = participantCount || 0

      const { count: responseCount } = await supabase
        .from('responses')
        .select('*', { count: 'exact', head: true })
        .in('session_id', sessionIds)

      totalResponses = responseCount || 0
    }
  }

  // Build per-presentation analytics
  const sessionCountMap: Record<string, number> = {}
  const participantCountMap: Record<string, number> = {}
  const activeSessionMap: Record<string, boolean> = {}

  for (const s of sessions) {
    sessionCountMap[s.presentation_id] = (sessionCountMap[s.presentation_id] || 0) + 1
    if (s.status === 'active' || s.status === 'waiting') {
      activeSessionMap[s.presentation_id] = true
    }
  }

  if (sessions.length > 0) {
    const sessionIds = sessions.map((s) => s.id)
    const { data: participantData } = await supabase
      .from('participants')
      .select('session_id')
      .in('session_id', sessionIds)

    if (participantData) {
      const sessionToPres: Record<string, string> = {}
      for (const s of sessions) sessionToPres[s.id] = s.presentation_id
      for (const p of participantData) {
        const presId = sessionToPres[p.session_id]
        if (presId) participantCountMap[presId] = (participantCountMap[presId] || 0) + 1
      }
    }
  }

  // Fetch recently accessed presentations (fall back to updated_at if last_accessed_at doesn't exist)
  let recentPresentations: { id: string; title: string; last_accessed_at: string; updated_at: string }[] | null = null
  try {
    const { data } = await supabase
      .from('presentations')
      .select('id, title, last_accessed_at, updated_at')
      .eq('user_id', user.id)
      .eq('is_archived', false)
      .not('last_accessed_at', 'is', null)
      .order('last_accessed_at', { ascending: false })
      .limit(6)
    recentPresentations = data
  } catch {
    // last_accessed_at column may not exist yet — fall back to most recently updated
    const { data } = await supabase
      .from('presentations')
      .select('id, title, updated_at')
      .eq('user_id', user.id)
      .eq('is_archived', false)
      .order('updated_at', { ascending: false })
      .limit(6)
    recentPresentations = (data || []).map(p => ({ ...p, last_accessed_at: p.updated_at }))
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const enrichedPresentations = (presentations || []).map((p: any) => ({
    id: p.id as string,
    title: p.title as string,
    description: p.description as string | undefined,
    updated_at: p.updated_at as string,
    created_at: p.created_at as string | undefined,
    slides: p.slides,
    session_count: sessionCountMap[p.id as string] || 0,
    participant_count: participantCountMap[p.id as string] || 0,
    has_active_session: activeSessionMap[p.id as string] || false,
  }))

  const displayName = user.user_metadata?.display_name || user.email?.split('@')[0] || 'there'
  const activeSessions = sessions.filter((s) => s.status === 'active' || s.status === 'waiting').length
  const activeSessionsList = sessions.filter((s) => s.status === 'active' || s.status === 'waiting')

  // Build presentation title lookup for active sessions
  const presTitleMap: Record<string, string> = {}
  for (const p of (presentations || []) as { id: string; title: string }[]) {
    presTitleMap[p.id] = p.title
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 bg-[#0F1216] dash-light:bg-[#F4F4F2] text-white dash-light:text-[#16191E] min-h-screen">
      {/* Welcome header with time-aware greeting */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="ff-display text-2xl font-extrabold tracking-tight text-white dash-light:text-[#16191E]">
            {getGreeting()}, <span className="text-[#C9241A]">{displayName}</span>
          </h1>
          <p className="ff-mono text-[11px] uppercase tracking-[0.15em] text-[#9aa0a8] dash-light:text-[#5B6169] mt-2">
            Manage your classrooms, scenes, and training sessions
          </p>
        </div>
        <DashboardCreateNewButton />
      </div>

      {/* Trial countdown banner */}
      <TrialBanner createdAt={user.created_at} />

      {/* Stats cards — 2x2 or 1x4 grid */}
      <DashboardStats
        totalPresentations={presentations?.length || 0}
        totalSessions={sessions.length}
        totalParticipants={totalParticipants}
        totalResponses={totalResponses}
        activeSessions={activeSessions}
      />

      {/* Active sessions banner (if any) */}
      {activeSessionsList.length > 0 && (
        <div className="relative bg-[#16191E] dash-light:bg-white dash-card-elev border border-[#2E9E63]/40 dash-light:border-[#1F8F54]/45 p-5 overflow-hidden">
          {/* Left accent bar */}
          <div className="absolute top-0 left-0 bottom-0 w-[3px] bg-[#2E9E63]" />

          <div className="relative flex items-center gap-2 mb-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full bg-[#2E9E63] opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 bg-[#2E9E63]" />
            </span>
            <h3 className="ff-mono text-[10px] uppercase tracking-[0.15em] font-semibold text-[#2E9E63] dash-light:text-[#1F8F54]">Live Sessions</h3>
          </div>
          <div className="relative grid gap-2">
            {activeSessionsList.slice(0, 3).map((session) => (
              <Link
                key={session.id}
                href={`/present/${session.id}`}
                className="v5-pop flex items-center justify-between bg-[#0F1216] dash-light:bg-[#F6F5F2] px-4 py-3 border border-white/12 dash-light:border-black/10 hover:border-[#2E9E63]/50 transition-colors duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <Radio className="w-4 h-4 text-[#2E9E63] dash-light:text-[#1F8F54]" />
                  <div>
                    <p className="ff-display text-sm font-semibold text-white dash-light:text-[#16191E] group-hover:text-[#2E9E63] transition-colors">
                      {presTitleMap[session.presentation_id] || 'Untitled'}
                    </p>
                    <p className="ff-mono text-xs text-[#9aa0a8] dash-light:text-[#5B6169]">
                      Code: <span className="font-bold text-[#2E9E63] dash-light:text-[#1F8F54]">{session.room_code}</span>
                    </p>
                  </div>
                </div>
                <span className="ff-mono text-xs uppercase tracking-[0.1em] text-[#9aa0a8] dash-light:text-[#5B6169] group-hover:text-[#2E9E63] transition-colors flex items-center gap-1">
                  Resume <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions — section header + 3 prominent cards */}
      <div>
        <h2 className="ff-mono text-[10px] uppercase tracking-[0.15em] font-semibold text-[#9aa0a8] dash-light:text-[#5B6169] mb-3">Quick Create</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <QuickCreatePresentationCard />
          <QuickCreateStudioCard />
          <Link href="/dashboard/templates" className="group">
            <div className="v5-pop dash-tile relative h-full bg-[#16191E] dash-light:bg-white dash-card-elev border border-white/12 dash-light:border-black/10 p-5 hover:border-[#6a5ea8]/50 cursor-pointer overflow-hidden">
              {/* Square colour accent */}
              <div className="w-10 h-10 bg-[#6a5ea8]/15 flex items-center justify-center mb-3">
                <LayoutTemplate className="w-5 h-5 text-[#6a5ea8] dash-light:text-[#5B4F98]" />
              </div>
              <h3 className="ff-display text-sm font-semibold text-white dash-light:text-[#16191E] group-hover:text-[#8a7fd0] transition-colors">Use a Template</h3>
              <p className="ff-mono text-[11px] uppercase tracking-[0.1em] text-[#9aa0a8] dash-light:text-[#5B6169] mt-1">10 ready-made templates</p>
            </div>
          </Link>
          <Link href="/dashboard/sessions" className="group">
            <div className="v5-pop dash-tile relative h-full bg-[#16191E] dash-light:bg-white dash-card-elev border border-white/12 dash-light:border-black/10 p-5 hover:border-[#3E6DC4]/50 cursor-pointer overflow-hidden">
              {/* Square colour accent */}
              <div className="w-10 h-10 bg-[#3E6DC4]/15 flex items-center justify-center mb-3">
                <Radio className="w-5 h-5 text-[#3E6DC4] dash-light:text-[#3360BC]" />
              </div>
              <h3 className="ff-display text-sm font-semibold text-white dash-light:text-[#16191E] group-hover:text-[#5a87de] transition-colors">View Activity</h3>
              <p className="ff-mono text-[11px] uppercase tracking-[0.1em] text-[#9aa0a8] dash-light:text-[#5B6169] mt-1">Manage live & past activity</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Quick create by slide type */}
      <QuickCreate />

      {/* Recently Opened */}
      {recentPresentations && recentPresentations.length > 0 && (
        <RecentlyOpened
          items={recentPresentations.map((p: { id: string; title: string; last_accessed_at: string; updated_at: string }) => ({
            id: p.id,
            title: p.title,
            last_accessed_at: p.last_accessed_at,
            updated_at: p.updated_at,
          }))}
        />
      )}

      {/* Divider */}
      <div className="border-t border-white/12 dash-light:border-black/10" />

      {/* My Presentations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="ff-mono text-[10px] uppercase tracking-[0.15em] font-semibold text-[#9aa0a8] dash-light:text-[#5B6169]">All Classrooms</h2>
            <p className="ff-mono text-[11px] uppercase tracking-[0.1em] text-[#9aa0a8]/70 dash-light:text-[#5B6169]/70 mt-1">
              {enrichedPresentations.length} classroom{enrichedPresentations.length !== 1 ? 's' : ''} total
            </p>
          </div>
          <Link
            href="/dashboard/templates"
            className="ff-mono text-[11px] uppercase tracking-[0.1em] text-[#C9241A] font-medium hover:underline flex items-center gap-1 group"
          >
            Browse templates <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
        <PresentationGrid presentations={enrichedPresentations} />
      </div>

      {/* Onboarding checklist for new users */}
      <OnboardingChecklist />
    </div>
  )
}
