import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { BarChart2, Users, Clock, Radio } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Studio Analytics — Command 360' }

function StatCard({ icon: Icon, label, value, subtitle }: {
  icon: React.ElementType
  label: string
  value: string | number
  subtitle?: string
}) {
  return (
    <div className="rounded-none border border-border bg-card p-5 flex flex-col gap-2">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="w-4 h-4" />
        <span className="text-xs ff-mono font-medium uppercase tracking-[0.1em]">{label}</span>
      </div>
      <span className="text-2xl font-bold text-foreground">{value}</span>
      {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
    </div>
  )
}

export default async function StudioAnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  // Get user's presentations to scope sessions
  const { data: presentations } = await supabase
    .from('presentations')
    .select('id, title')
    .eq('user_id', user.id)

  const presentationIds = (presentations || []).map((p) => p.id)
  const presentationNameMap: Record<string, string> = {}
  for (const p of presentations || []) presentationNameMap[p.id] = p.title

  let sessions: {
    id: string
    presentation_id: string
    status: string
    started_at: string
    ended_at: string | null
    room_code: string
  }[] = []
  let totalParticipants = 0

  if (presentationIds.length > 0) {
    const { data: sessionsData } = await supabase
      .from('sessions')
      .select('id, presentation_id, status, started_at, ended_at, room_code')
      .in('presentation_id', presentationIds)
      .order('started_at', { ascending: false })
      .limit(20)

    sessions = sessionsData || []

    if (sessions.length > 0) {
      const sessionIds = sessions.map((s) => s.id)
      const { count } = await supabase
        .from('participants')
        .select('*', { count: 'exact', head: true })
        .in('session_id', sessionIds)
      totalParticipants = count || 0
    }
  }

  // Calculate average duration for completed sessions
  const completedSessions = sessions.filter((s) => s.ended_at && s.started_at)
  let avgDurationMin = 0
  if (completedSessions.length > 0) {
    const totalMs = completedSessions.reduce((sum, s) => {
      return sum + (new Date(s.ended_at!).getTime() - new Date(s.started_at).getTime())
    }, 0)
    avgDurationMin = Math.round(totalMs / completedSessions.length / 60000)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Studio Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of your presentation sessions</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Radio} label="Total Sessions" value={sessions.length} />
        <StatCard icon={Users} label="Total Participants" value={totalParticipants} />
        <StatCard
          icon={Clock}
          label="Avg Duration"
          value={avgDurationMin > 0 ? `${avgDurationMin}m` : '--'}
          subtitle={completedSessions.length > 0 ? `from ${completedSessions.length} completed` : 'No completed sessions'}
        />
        <StatCard icon={BarChart2} label="Presentations" value={presentationIds.length} />
      </div>

      {/* Recent sessions table */}
      <div className="rounded-none border border-border bg-card overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Recent Sessions</h2>
        </div>
        {sessions.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-muted-foreground">
            No sessions yet. Start a presentation to see analytics here.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs ff-mono text-muted-foreground uppercase tracking-[0.1em] border-b border-border">
                <th className="px-5 py-2 font-medium">Presentation</th>
                <th className="px-5 py-2 font-medium">Room Code</th>
                <th className="px-5 py-2 font-medium">Status</th>
                <th className="px-5 py-2 font-medium">Started</th>
                <th className="px-5 py-2 font-medium">Duration</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => {
                const durationMs = s.ended_at
                  ? new Date(s.ended_at).getTime() - new Date(s.started_at).getTime()
                  : null
                const durationStr = durationMs
                  ? `${Math.round(durationMs / 60000)}m`
                  : '--'
                return (
                  <tr key={s.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-2.5 text-foreground font-medium truncate max-w-[200px]">
                      {presentationNameMap[s.presentation_id] || 'Untitled'}
                    </td>
                    <td className="px-5 py-2.5 font-mono text-muted-foreground">{s.room_code}</td>
                    <td className="px-5 py-2.5">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-none ${
                        s.status === 'active'
                          ? 'bg-[#2E9E63]/10 text-[#2E9E63]'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {s.status === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-[#2E9E63] animate-pulse" />}
                        {s.status}
                      </span>
                    </td>
                    <td className="px-5 py-2.5 text-muted-foreground">
                      {new Date(s.started_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-5 py-2.5 text-muted-foreground tabular-nums">{durationStr}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
