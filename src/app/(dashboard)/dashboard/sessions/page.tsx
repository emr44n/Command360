import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SessionsList } from '@/components/sessions/SessionsList'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Sessions — Command 360' }

export default async function SessionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch user's presentations
  const { data: presentations } = await supabase
    .from('presentations')
    .select('id, title')
    .eq('user_id', user.id)
    .eq('is_archived', false)

  const presentationIds = (presentations || []).map((p: { id: string }) => p.id)
  const presentationMap: Record<string, string> = {}
  for (const p of (presentations || []) as { id: string; title: string }[]) {
    presentationMap[p.id] = p.title
  }

  // Fetch all sessions
  let sessions: {
    id: string
    presentation_id: string
    room_code: string
    status: string
    started_at: string
    ended_at: string | null
    current_slide_index: number
  }[] = []

  if (presentationIds.length > 0) {
    const { data: sessionsData } = await supabase
      .from('sessions')
      .select('id, presentation_id, room_code, status, started_at, ended_at, current_slide_index')
      .in('presentation_id', presentationIds)
      .order('started_at', { ascending: false })

    sessions = sessionsData || []
  }

  // Get participant counts per session
  const participantCounts: Record<string, number> = {}
  if (sessions.length > 0) {
    const sessionIds = sessions.map((s) => s.id)
    const { data: participants } = await supabase
      .from('participants')
      .select('session_id')
      .in('session_id', sessionIds)

    if (participants) {
      for (const p of participants) {
        participantCounts[p.session_id] = (participantCounts[p.session_id] || 0) + 1
      }
    }
  }

  // Get response counts per session
  const responseCounts: Record<string, number> = {}
  if (sessions.length > 0) {
    const sessionIds = sessions.map((s) => s.id)
    const { data: responses } = await supabase
      .from('responses')
      .select('session_id')
      .in('session_id', sessionIds)

    if (responses) {
      for (const r of responses) {
        responseCounts[r.session_id] = (responseCounts[r.session_id] || 0) + 1
      }
    }
  }

  const enrichedSessions = sessions.map((s) => ({
    ...s,
    presentation_title: presentationMap[s.presentation_id] || 'Untitled',
    participant_count: participantCounts[s.id] || 0,
    response_count: responseCounts[s.id] || 0,
  }))

  // Compute summary stats
  const activeCount = enrichedSessions.filter(s => s.status === 'active' || s.status === 'waiting').length
  const totalParticipants = Object.values(participantCounts).reduce((a, b) => a + b, 0)
  const totalResponses = Object.values(responseCounts).reduce((a, b) => a + b, 0)

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 font-medium mb-1.5">Dashboard</p>
        <h1 className="text-2xl font-bold tracking-tight">Sessions</h1>
        <p className="text-muted-foreground text-sm mt-1">
          View and manage your presentation sessions
        </p>
      </div>

      {/* Summary stats */}
      <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 font-medium mb-2.5">Overview</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <div className="relative bg-card border border-border rounded-2xl p-5 [box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.03)_inset] hover:-translate-y-0.5 hover:shadow-lg hover:border-border/80 transition-all duration-300 overflow-hidden group">
          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
          <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 font-medium">Total sessions</p>
          <p className="text-2xl font-bold text-foreground mt-1.5">{enrichedSessions.length}</p>
        </div>
        <div className="relative bg-card border border-border rounded-2xl p-5 [box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.03)_inset] hover:-translate-y-0.5 hover:shadow-lg hover:border-border/80 transition-all duration-300 overflow-hidden group">
          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
          <div className="flex items-center gap-2">
            <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 font-medium">Live now</p>
            {activeCount > 0 && (
              <span className="relative flex h-2 w-2">
                <span className="absolute -inset-1 rounded-full bg-emerald-400/20 blur-sm" />
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
            )}
          </div>
          <p className={`text-2xl font-bold mt-1.5 ${activeCount > 0 ? 'text-emerald-500' : 'text-foreground'}`}>{activeCount}</p>
        </div>
        <div className="relative bg-card border border-border rounded-2xl p-5 [box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.03)_inset] hover:-translate-y-0.5 hover:shadow-lg hover:border-border/80 transition-all duration-300 overflow-hidden group">
          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
          <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 font-medium">Participants</p>
          <p className="text-2xl font-bold text-foreground mt-1.5">{totalParticipants}</p>
        </div>
        <div className="relative bg-card border border-border rounded-2xl p-5 [box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.03)_inset] hover:-translate-y-0.5 hover:shadow-lg hover:border-border/80 transition-all duration-300 overflow-hidden group">
          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
          <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 font-medium">Responses</p>
          <p className="text-2xl font-bold text-foreground mt-1.5">{totalResponses}</p>
        </div>
      </div>

      <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 font-medium mb-2.5">All Sessions</p>
      <SessionsList sessions={enrichedSessions} />
    </div>
  )
}
