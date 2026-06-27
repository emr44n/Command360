import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { BarChart2, FileText, Users, Clock, TrendingUp, MessageSquare, ArrowRight, Timer, Activity, PieChart, Play } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ReportsResultsList } from '@/components/reports/ReportsResultsList'
import Script from 'next/script'

export const metadata: Metadata = { title: 'Reports — Command 360' }

export default async function ReportsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch presentations with session data
  const { data: presentations } = await supabase
    .from('presentations')
    .select('id, title, updated_at, description')
    .eq('user_id', user.id)
    .eq('is_archived', false)
    .order('updated_at', { ascending: false })

  const presentationIds = (presentations || []).map((p: { id: string }) => p.id)

  // Get session counts + participant counts per presentation
  const sessionCounts: Record<string, number> = {}
  const participantCounts: Record<string, number> = {}
  const responseCounts: Record<string, number> = {}
  const latestSession: Record<string, string> = {}

  if (presentationIds.length > 0) {
    const { data: sessions } = await supabase
      .from('sessions')
      .select('id, presentation_id, created_at, status')
      .in('presentation_id', presentationIds)
      .order('created_at', { ascending: false })

    if (sessions) {
      for (const s of sessions) {
        sessionCounts[s.presentation_id] = (sessionCounts[s.presentation_id] || 0) + 1
        if (!latestSession[s.presentation_id]) {
          latestSession[s.presentation_id] = s.created_at
        }
      }

      // Get participant counts
      const sessionIds = sessions.map((s: { id: string }) => s.id)
      if (sessionIds.length > 0) {
        const { data: participants } = await supabase
          .from('session_participants')
          .select('session_id')
          .in('session_id', sessionIds)

        if (participants) {
          const sessionToPres: Record<string, string> = {}
          for (const s of sessions) {
            sessionToPres[s.id] = s.presentation_id
          }
          for (const p of participants) {
            const presId = sessionToPres[p.session_id]
            if (presId) participantCounts[presId] = (participantCounts[presId] || 0) + 1
          }
        }

        // Get response counts
        const { data: responses } = await supabase
          .from('responses')
          .select('session_id')
          .in('session_id', sessionIds)

        if (responses) {
          const sessionToPres: Record<string, string> = {}
          for (const s of sessions) {
            sessionToPres[s.id] = s.presentation_id
          }
          for (const r of responses) {
            const presId = sessionToPres[r.session_id]
            if (presId) responseCounts[presId] = (responseCounts[presId] || 0) + 1
          }
        }
      }
    }
  }

  const decksWithSessions = (presentations || [])
    .filter((p: { id: string }) => (sessionCounts[p.id] || 0) > 0)
    .map((p: { id: string; title: string; updated_at: string; description: string | null }) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      updated_at: p.updated_at,
      session_count: sessionCounts[p.id] || 0,
      participant_count: participantCounts[p.id] || 0,
      response_count: responseCounts[p.id] || 0,
      latest_session: latestSession[p.id],
    }))

  // Summary stats
  const totalSessions = Object.values(sessionCounts).reduce((a, b) => a + b, 0)
  const totalParticipants = Object.values(participantCounts).reduce((a, b) => a + b, 0)
  const totalResponses = Object.values(responseCounts).reduce((a, b) => a + b, 0)
  const avgResponsesPerParticipant = totalParticipants > 0 ? (totalResponses / totalParticipants).toFixed(1) : '0'
  const maxResponses = Math.max(...decksWithSessions.map(d => d.response_count), 1)

  // ── Completed sessions with per-session analytics ──
  interface CompletedSession {
    id: string
    presentation_id: string
    presentation_title: string
    status: string
    started_at: string
    ended_at: string | null
    created_at: string
    participant_count: number
    response_count: number
    duration_minutes: number | null
  }

  const completedSessions: CompletedSession[] = []

  if (presentationIds.length > 0) {
    const { data: allSessions } = await supabase
      .from('sessions')
      .select('id, presentation_id, status, started_at, ended_at, created_at')
      .in('presentation_id', presentationIds)
      .eq('status', 'ended')
      .order('ended_at', { ascending: false })
      .limit(20)

    if (allSessions && allSessions.length > 0) {
      // Build title lookup
      const titleMap: Record<string, string> = {}
      for (const p of presentations || []) {
        titleMap[(p as { id: string }).id] = (p as { id: string; title: string }).title
      }

      // Get participant + response counts per session
      const cSessionIds = allSessions.map((s: { id: string }) => s.id)

      const { data: cParticipants } = await supabase
        .from('session_participants')
        .select('session_id')
        .in('session_id', cSessionIds)

      const { data: cResponses } = await supabase
        .from('responses')
        .select('session_id')
        .in('session_id', cSessionIds)

      const cPartCounts: Record<string, number> = {}
      const cRespCounts: Record<string, number> = {}

      if (cParticipants) {
        for (const p of cParticipants) {
          cPartCounts[p.session_id] = (cPartCounts[p.session_id] || 0) + 1
        }
      }
      if (cResponses) {
        for (const r of cResponses) {
          cRespCounts[r.session_id] = (cRespCounts[r.session_id] || 0) + 1
        }
      }

      for (const s of allSessions) {
        const start = s.started_at ? new Date(s.started_at).getTime() : null
        const end = s.ended_at ? new Date(s.ended_at).getTime() : null
        const durationMinutes = start && end ? Math.round((end - start) / 60000) : null

        completedSessions.push({
          id: s.id,
          presentation_id: s.presentation_id,
          presentation_title: titleMap[s.presentation_id] || 'Untitled',
          status: s.status,
          started_at: s.started_at,
          ended_at: s.ended_at,
          created_at: s.created_at,
          participant_count: cPartCounts[s.id] || 0,
          response_count: cRespCounts[s.id] || 0,
          duration_minutes: durationMinutes,
        })
      }
    }
  }

  // Aggregate for charts placeholder data
  const avgSessionDuration =
    completedSessions.filter(s => s.duration_minutes !== null).length > 0
      ? Math.round(
          completedSessions
            .filter(s => s.duration_minutes !== null)
            .reduce((a, b) => a + (b.duration_minutes ?? 0), 0) /
            completedSessions.filter(s => s.duration_minutes !== null).length
        )
      : null

  const avgParticipantsPerSession =
    completedSessions.length > 0
      ? (completedSessions.reduce((a, b) => a + b.participant_count, 0) / completedSessions.length).toFixed(1)
      : '0'

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <Script id="onboard-report" strategy="afterInteractive">{`localStorage.setItem('c360_onboard_report','true')`}</Script>
      <div className="mb-8">
        <p className="text-[10px] ff-mono uppercase tracking-[0.1em] text-muted-foreground/60 font-medium mb-1.5">Analytics</p>
        <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground text-sm mt-1">
          View results and analytics for your sessions
        </p>
      </div>

      {decksWithSessions.length === 0 ? (
        <div className="text-center py-16">
          <BarChart2 className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No session data yet</p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            Run a session from one of your classrooms to see reports here
          </p>
        </div>
      ) : (
        <>
          {/* Summary stats */}
          <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 font-medium mb-2.5">Overview</p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
            <div className="relative bg-card border border-border rounded-2xl p-4 [box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.03)_inset] hover:-translate-y-0.5 hover:shadow-lg hover:border-border/80 transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
              <div className="flex items-center gap-2 text-muted-foreground/60 mb-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase tracking-[0.15em] font-medium">Classrooms</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{decksWithSessions.length}</p>
            </div>
            <div className="relative bg-card border border-border rounded-2xl p-4 [box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.03)_inset] hover:-translate-y-0.5 hover:shadow-lg hover:border-border/80 transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
              <div className="flex items-center gap-2 text-muted-foreground/60 mb-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase tracking-[0.15em] font-medium">Sessions</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{totalSessions}</p>
            </div>
            <div className="relative bg-card border border-border rounded-2xl p-4 [box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.03)_inset] hover:-translate-y-0.5 hover:shadow-lg hover:border-border/80 transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
              <div className="flex items-center gap-2 text-muted-foreground/60 mb-1.5">
                <Users className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase tracking-[0.15em] font-medium">Participants</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{totalParticipants}</p>
            </div>
            <div className="relative bg-card border border-border rounded-2xl p-4 [box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.03)_inset] hover:-translate-y-0.5 hover:shadow-lg hover:border-border/80 transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
              <div className="flex items-center gap-2 text-muted-foreground/60 mb-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase tracking-[0.15em] font-medium">Responses</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{totalResponses}</p>
            </div>
            <div className="relative bg-card border border-border rounded-2xl p-4 [box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.03)_inset] hover:-translate-y-0.5 hover:shadow-lg hover:border-border/80 transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-rose-500/40 to-transparent" />
              <div className="flex items-center gap-2 text-muted-foreground/60 mb-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase tracking-[0.15em] font-medium">Avg per user</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{avgResponsesPerParticipant}</p>
            </div>
          </div>

          {/* Presentation list with sort, view toggle, and type badges */}
          <ReportsResultsList decks={decksWithSessions} />

          {/* Session Analytics Cards */}
          <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 font-medium mb-2.5 mt-10">Session Analytics</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <div className="relative bg-card border border-border rounded-2xl p-4 [box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.03)_inset] hover:-translate-y-0.5 hover:shadow-lg hover:border-border/80 transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
              <div className="flex items-center gap-2 text-muted-foreground/60 mb-1.5">
                <Timer className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase tracking-[0.15em] font-medium">Avg Duration</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {avgSessionDuration !== null ? `${avgSessionDuration}m` : '--'}
              </p>
            </div>
            <div className="relative bg-card border border-border rounded-2xl p-4 [box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.03)_inset] hover:-translate-y-0.5 hover:shadow-lg hover:border-border/80 transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
              <div className="flex items-center gap-2 text-muted-foreground/60 mb-1.5">
                <Users className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase tracking-[0.15em] font-medium">Avg Participants</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{avgParticipantsPerSession}</p>
            </div>
            <div className="relative bg-card border border-border rounded-2xl p-4 [box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.03)_inset] hover:-translate-y-0.5 hover:shadow-lg hover:border-border/80 transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-pink-500/40 to-transparent" />
              <div className="flex items-center gap-2 text-muted-foreground/60 mb-1.5">
                <Activity className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase tracking-[0.15em] font-medium">Completed</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{completedSessions.length}</p>
            </div>
            <div className="relative bg-card border border-border rounded-2xl p-4 [box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.03)_inset] hover:-translate-y-0.5 hover:shadow-lg hover:border-border/80 transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />
              <div className="flex items-center gap-2 text-muted-foreground/60 mb-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase tracking-[0.15em] font-medium">Engagement Rate</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{avgResponsesPerParticipant}x</p>
            </div>
          </div>

          {/* Charts Placeholder */}
          <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 font-medium mb-2.5">Trends</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            <div className="relative bg-card border border-border rounded-2xl p-6 [box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.03)_inset] overflow-hidden">
              <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
              <div className="flex items-center gap-2 text-muted-foreground/60 mb-4">
                <BarChart2 className="w-4 h-4" />
                <span className="text-xs font-medium">Participation Over Time</span>
              </div>
              {/* Chart placeholder: Bar chart showing participant counts per session over time */}
              <div className="h-40 flex items-end gap-1.5 px-2">
                {completedSessions.slice(0, 12).reverse().map((s, i) => {
                  const maxP = Math.max(...completedSessions.map(cs => cs.participant_count), 1)
                  const height = Math.max((s.participant_count / maxP) * 100, 4)
                  return (
                    <div key={s.id} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full bg-primary/20 hover:bg-primary/30 rounded-t-md transition-colors duration-200"
                        style={{ height: `${height}%` }}
                        title={`${s.presentation_title}: ${s.participant_count} participants`}
                      />
                      <span className="text-[8px] text-muted-foreground/40">
                        {new Date(s.ended_at || s.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  )
                })}
                {completedSessions.length === 0 && (
                  <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground/40">
                    No completed sessions yet
                  </div>
                )}
              </div>
            </div>
            <div className="relative bg-card border border-border rounded-2xl p-6 [box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.03)_inset] overflow-hidden">
              <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
              <div className="flex items-center gap-2 text-muted-foreground/60 mb-4">
                <PieChart className="w-4 h-4" />
                <span className="text-xs font-medium">Response Distribution</span>
              </div>
              {/* Chart placeholder: Shows response volume per presentation as horizontal bars */}
              <div className="h-40 flex flex-col justify-center gap-2 px-2">
                {decksWithSessions.slice(0, 5).map((deck) => {
                  const pct = Math.max((deck.response_count / (totalResponses || 1)) * 100, 1)
                  return (
                    <div key={deck.id} className="flex items-center gap-3">
                      <span className="text-[10px] text-muted-foreground/70 truncate w-24 shrink-0 text-right">{deck.title}</span>
                      <div className="flex-1 h-5 bg-muted/30 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-violet-500/30 to-violet-500/50 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-muted-foreground/60 w-8 shrink-0">{deck.response_count}</span>
                    </div>
                  )
                })}
                {decksWithSessions.length === 0 && (
                  <div className="flex items-center justify-center text-xs text-muted-foreground/40">
                    No response data yet
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Completed Sessions List */}
          {completedSessions.length > 0 && (
            <>
              <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 font-medium mb-2.5">Completed Sessions</p>
              <div className="grid gap-2">
                {completedSessions.map((session) => (
                  <Link
                    key={session.id}
                    href={`/presentations/${session.presentation_id}/results`}
                    className="relative bg-card border border-border rounded-2xl p-4 [box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.03)_inset] hover:-translate-y-0.5 hover:shadow-lg hover:border-primary/20 transition-all duration-300 group overflow-hidden"
                  >
                    <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
                    <div className="relative flex items-center gap-4">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/[0.08] flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-emerald-500/15 transition-all duration-200">
                        <Play className="w-4 h-4 text-emerald-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors duration-200">
                          {session.presentation_title}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          {session.duration_minutes !== null && (
                            <span className="text-xs text-muted-foreground/70 flex items-center gap-1">
                              <Timer className="w-3 h-3" />
                              {session.duration_minutes}m
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground/70 flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {session.participant_count}
                          </span>
                          <span className="text-xs text-muted-foreground/70 flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            {session.response_count} response{session.response_count !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs text-muted-foreground/60">
                          {new Date(session.ended_at || session.created_at).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
