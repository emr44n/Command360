import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { BarChart2, FileText, Users, Clock, TrendingUp, MessageSquare, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

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

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
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
            Run a session from one of your decks to see reports here
          </p>
        </div>
      ) : (
        <>
          {/* Summary stats */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
            <div className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <FileText className="w-3.5 h-3.5" />
                <span className="text-[11px] font-medium uppercase tracking-wider">Decks</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{decksWithSessions.length}</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-[11px] font-medium uppercase tracking-wider">Sessions</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{totalSessions}</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Users className="w-3.5 h-3.5" />
                <span className="text-[11px] font-medium uppercase tracking-wider">Participants</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{totalParticipants}</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="text-[11px] font-medium uppercase tracking-wider">Responses</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{totalResponses}</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span className="text-[11px] font-medium uppercase tracking-wider">Avg per user</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{avgResponsesPerParticipant}</p>
            </div>
          </div>

          {/* Deck list with engagement bars */}
          <h2 className="text-sm font-semibold text-foreground mb-3">Deck Results</h2>
          <div className="grid gap-3">
            {decksWithSessions.map((deck) => {
              const barWidth = Math.max((deck.response_count / maxResponses) * 100, 2)
              return (
                <Link
                  key={deck.id}
                  href={`/presentations/${deck.id}/results`}
                  className="bg-card border border-border rounded-2xl p-4 hover:border-primary/20 hover:shadow-md transition-all group relative overflow-hidden"
                >
                  {/* Engagement bar background */}
                  <div
                    className="absolute left-0 top-0 bottom-0 bg-primary/5 transition-all duration-500"
                    style={{ width: `${barWidth}%` }}
                  />

                  <div className="relative flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200">
                      <BarChart2 className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                        {deck.title}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {deck.session_count} session{deck.session_count !== 1 ? 's' : ''}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {deck.participant_count}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          {deck.response_count} response{deck.response_count !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-muted-foreground">
                        {deck.latest_session
                          ? new Date(deck.latest_session).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                          : new Date(deck.updated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
                        }
                      </span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
