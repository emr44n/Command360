import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Users, BarChart2, Clock, Download, Eye } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { SessionResults } from '@/components/results/SessionResults'
import { ExportPDFButton } from '@/components/results/ExportPDFButton'

export default async function PresentationResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: presentation } = await supabase
    .from('presentations')
    .select('*, sessions(*)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!presentation) notFound()

  // Get slides
  const { data: slides } = await supabase
    .from('slides')
    .select('*')
    .eq('presentation_id', id)
    .order('position')

  const sessions = (presentation.sessions || []).sort(
    (a: { started_at: string }, b: { started_at: string }) =>
      new Date(b.started_at).getTime() - new Date(a.started_at).getTime()
  )

  // Get participant + response counts per session
  const sessionIds = sessions.map((s: { id: string }) => s.id)
  const participantCounts: Record<string, number> = {}
  const responseCounts: Record<string, number> = {}

  if (sessionIds.length > 0) {
    const { data: participants } = await supabase
      .from('session_participants')
      .select('session_id')
      .in('session_id', sessionIds)

    if (participants) {
      for (const p of participants) {
        participantCounts[p.session_id] = (participantCounts[p.session_id] || 0) + 1
      }
    }

    const { data: allResponses } = await supabase
      .from('responses')
      .select('session_id')
      .in('session_id', sessionIds)

    if (allResponses) {
      for (const r of allResponses) {
        responseCounts[r.session_id] = (responseCounts[r.session_id] || 0) + 1
      }
    }
  }

  // Load full response data for the latest session (for chart display)
  const latestSession = sessions[0]
  let latestResponses: Array<{ id: string; slide_id: string; participant_id: string; answer: Record<string, unknown>; created_at: string }> = []
  if (latestSession) {
    const { data } = await supabase
      .from('responses')
      .select('id, slide_id, participant_id, answer, created_at')
      .eq('session_id', latestSession.id)
      .order('created_at')

    latestResponses = (data || []) as typeof latestResponses
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/reports">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />Back
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-semibold tracking-tight truncate">{presentation.title}</h1>
          <p className="text-muted-foreground text-xs mt-0.5">
            {sessions.length} session{sessions.length !== 1 ? 's' : ''}
          </p>
        </div>
        {sessions.length > 0 && (
          <ExportPDFButton
            presentationTitle={presentation.title}
            sessionCode={sessions[0].room_code}
            participantCount={Object.values(participantCounts).reduce((a: number, b: number) => a + b, 0)}
            responseCount={Object.values(responseCounts).reduce((a: number, b: number) => a + b, 0)}
            sessionDate={sessions[0].started_at}
          />
        )}
        <Link href={`/presentations/${id}/edit`}>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs rounded-xl">
            <Eye className="w-3.5 h-3.5" /> Edit deck
          </Button>
        </Link>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <BarChart2 className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-sm">No sessions have been run yet</p>
          <Link href={`/presentations/${id}/edit`}>
            <Button variant="outline" className="mt-4 rounded-xl">Go to Editor</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Session list */}
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-3">Sessions</h2>
            <div className="space-y-2">
              {sessions.map((session: {
                id: string; room_code: string; status: string; started_at: string; ended_at: string | null
              }) => (
                <div key={session.id} className="bg-card rounded-2xl p-4 border border-border flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-primary font-bold text-sm">{session.room_code}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                        session.status === 'ended' ? 'bg-muted text-muted-foreground' : 'bg-emerald-500/10 text-emerald-600'
                      }`}>
                        {session.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground text-xs">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(session.started_at), { addSuffix: true })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {participantCounts[session.id] || 0} participants
                      </span>
                      <span className="flex items-center gap-1">
                        <BarChart2 className="w-3 h-3" />
                        {responseCounts[session.id] || 0} responses
                      </span>
                    </div>
                  </div>
                  <a href={`/api/sessions/${session.id}/export`} download>
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs shrink-0 rounded-xl">
                      <Download className="w-3.5 h-3.5" />CSV
                    </Button>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Results visualization for latest session */}
          {latestSession && slides && slides.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-sm font-semibold text-foreground">Results</h2>
                <span className="text-xs text-muted-foreground">
                  from session {latestSession.room_code}
                </span>
              </div>
              <SessionResults
                slides={slides}
                responses={latestResponses}
                participantCount={participantCounts[latestSession.id] || 0}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
