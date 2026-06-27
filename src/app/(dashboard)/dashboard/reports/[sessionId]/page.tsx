import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ExportExcelButton } from '@/components/results/ExportExcelButton'
import { ArrowLeft, Calendar, Users, MessageSquare, Clock } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Session Report — Command 360' }

export default async function SessionReportPage({
  params,
}: {
  params: Promise<{ sessionId: string }>
}) {
  const { sessionId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch session
  const { data: session } = await supabase
    .from('sessions')
    .select('id, presentation_id, status, started_at, ended_at, room_code, host_user_id')
    .eq('id', sessionId)
    .single()

  if (!session || session.host_user_id !== user.id) {
    redirect('/dashboard/reports')
  }

  // Fetch presentation title
  const { data: presentation } = await supabase
    .from('presentations')
    .select('title')
    .eq('id', session.presentation_id)
    .single()

  // Fetch participants
  let participants: { id: string; name?: string; joined_at?: string; session_id: string }[] = []
  try {
    const { data } = await supabase
      .from('participants')
      .select('id, name, joined_at, session_id')
      .eq('session_id', sessionId)
      .order('joined_at', { ascending: true })
    participants = data || []
  } catch {
    // table may not exist
  }

  // Fetch response count
  let responseCount = 0
  try {
    const { count } = await supabase
      .from('responses')
      .select('*', { count: 'exact', head: true })
      .eq('session_id', sessionId)
    responseCount = count || 0
  } catch {
    // table may not exist
  }

  const startedAt = session.started_at ? new Date(session.started_at) : null
  const endedAt = session.ended_at ? new Date(session.ended_at) : null
  const durationMin = startedAt && endedAt
    ? Math.round((endedAt.getTime() - startedAt.getTime()) / 60000)
    : null

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Back link */}
      <Link href="/dashboard/reports" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Reports
      </Link>

      {/* Session Info Card */}
      <div className="bg-card border border-border rounded-none p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {presentation?.title || 'Untitled Presentation'}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Session: <span className="font-mono">{session.room_code || session.id.slice(0, 8)}</span>
              {' '}&middot;{' '}
              <span className={session.status === 'active' ? 'text-[#2E9E63] font-medium' : ''}>
                {session.status}
              </span>
            </p>
          </div>
          <ExportExcelButton sessionId={sessionId} sessionTitle={presentation?.title} />
        </div>

        {/* Stat pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div className="bg-muted/50 rounded-none p-4 flex items-center gap-3">
            <Calendar className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Started</p>
              <p className="text-sm font-medium">
                {startedAt ? startedAt.toLocaleDateString() : '-'}
              </p>
            </div>
          </div>
          <div className="bg-muted/50 rounded-none p-4 flex items-center gap-3">
            <Clock className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Duration</p>
              <p className="text-sm font-medium">{durationMin !== null ? `${durationMin} min` : '-'}</p>
            </div>
          </div>
          <div className="bg-muted/50 rounded-none p-4 flex items-center gap-3">
            <Users className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Participants</p>
              <p className="text-sm font-medium">{participants.length}</p>
            </div>
          </div>
          <div className="bg-muted/50 rounded-none p-4 flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Responses</p>
              <p className="text-sm font-medium">{responseCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Participants Table */}
      <div className="bg-card border border-border rounded-none p-6">
        <h2 className="font-semibold text-foreground mb-4">Participants</h2>
        {participants.length === 0 ? (
          <p className="text-sm text-muted-foreground">No participants recorded.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-2 font-medium text-muted-foreground">#</th>
                  <th className="pb-2 font-medium text-muted-foreground">Name</th>
                  <th className="pb-2 font-medium text-muted-foreground">Joined</th>
                  <th className="pb-2 font-medium text-muted-foreground">ID</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((p, i) => (
                  <tr key={p.id} className="border-b border-border/50 last:border-0">
                    <td className="py-2.5 text-muted-foreground">{i + 1}</td>
                    <td className="py-2.5 font-medium">{p.name || 'Anonymous'}</td>
                    <td className="py-2.5 text-muted-foreground">
                      {p.joined_at ? new Date(p.joined_at).toLocaleString() : '-'}
                    </td>
                    <td className="py-2.5 font-mono text-xs text-muted-foreground">{p.id.slice(0, 8)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
