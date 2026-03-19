import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PresentationGrid } from '@/components/presentations/PresentationGrid'
import { CreatePresentationButton } from '@/components/presentations/CreatePresentationButton'
import { DashboardStats } from '@/components/dashboard/DashboardStats'
import { QuickCreate } from '@/components/dashboard/QuickCreate'
import { RecentlyOpened } from '@/components/dashboard/RecentlyOpened'
import { TrialBanner } from '@/components/dashboard/TrialBanner'
import Link from 'next/link'
import { Plus, LayoutTemplate, ArrowRight, Radio } from 'lucide-react'
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

  // Fetch recently accessed presentations (ones with last_accessed_at set)
  const { data: recentPresentations } = await supabase
    .from('presentations')
    .select('id, title, last_accessed_at, updated_at')
    .eq('user_id', user.id)
    .eq('is_archived', false)
    .not('last_accessed_at', 'is', null)
    .order('last_accessed_at', { ascending: false })
    .limit(6)

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
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Welcome header with time-aware greeting */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {getGreeting()}, <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text" style={{ WebkitTextFillColor: 'transparent' }}>{displayName}</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your interactive training decks and sessions
          </p>
        </div>
        <CreatePresentationButton />
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
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <h3 className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Live Sessions</h3>
          </div>
          <div className="grid gap-2">
            {activeSessionsList.slice(0, 3).map((session) => (
              <Link
                key={session.id}
                href={`/present/${session.id}`}
                className="flex items-center justify-between bg-background/60 rounded-lg px-4 py-2.5 hover:bg-background transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Radio className="w-4 h-4 text-emerald-500" />
                  <div>
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {presTitleMap[session.presentation_id] || 'Untitled'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Code: <span className="font-mono font-bold text-primary">{session.room_code}</span>
                    </p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                  Resume <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions — 3 prominent cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link href="/dashboard" className="group">
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 hover:bg-primary/10 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
              <Plus className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">New Deck</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Start from scratch</p>
          </div>
        </Link>
        <Link href="/dashboard/templates" className="group">
          <div className="bg-violet-500/5 border border-violet-500/20 rounded-2xl p-5 hover:bg-violet-500/10 hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/5 transition-all cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
              <LayoutTemplate className="w-5 h-5 text-violet-500" />
            </div>
            <h3 className="text-sm font-semibold text-foreground group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">Use a Template</h3>
            <p className="text-xs text-muted-foreground mt-0.5">10 ready-made templates</p>
          </div>
        </Link>
        <Link href="/dashboard/sessions" className="group">
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-5 hover:bg-blue-500/10 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5 transition-all cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
              <Radio className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="text-sm font-semibold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">View Sessions</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Manage live & past sessions</p>
          </div>
        </Link>
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
      <div className="border-t border-border" />

      {/* My Decks */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">My Decks</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {enrichedPresentations.length} deck{enrichedPresentations.length !== 1 ? 's' : ''} total
            </p>
          </div>
          <Link
            href="/dashboard/templates"
            className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
          >
            Browse templates <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <PresentationGrid presentations={enrichedPresentations} />
      </div>
    </div>
  )
}
