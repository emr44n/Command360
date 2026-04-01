import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PresentationGrid } from '@/components/presentations/PresentationGrid'
import { CreatePresentationButton } from '@/components/presentations/CreatePresentationButton'
import { FileText } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Command Classroom — Command 360' }

export default async function PresentationsPage() {
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

  // Fetch all sessions for analytics
  const presentationIds = (presentations || []).map((p: { id: string }) => p.id)

  const sessionCountMap: Record<string, number> = {}
  const participantCountMap: Record<string, number> = {}
  const activeSessionMap: Record<string, boolean> = {}

  if (presentationIds.length > 0) {
    const { data: sessions } = await supabase
      .from('sessions')
      .select('id, presentation_id, status')
      .in('presentation_id', presentationIds)

    const sessionsList = sessions || []

    for (const s of sessionsList) {
      sessionCountMap[s.presentation_id] = (sessionCountMap[s.presentation_id] || 0) + 1
      if (s.status === 'active' || s.status === 'waiting') {
        activeSessionMap[s.presentation_id] = true
      }
    }

    if (sessionsList.length > 0) {
      const sessionIds = sessionsList.map((s) => s.id)
      const { data: participantData } = await supabase
        .from('participants')
        .select('session_id')
        .in('session_id', sessionIds)

      if (participantData) {
        const sessionToPres: Record<string, string> = {}
        for (const s of sessionsList) sessionToPres[s.id] = s.presentation_id
        for (const p of participantData) {
          const presId = sessionToPres[p.session_id]
          if (presId) participantCountMap[presId] = (participantCountMap[presId] || 0) + 1
        }
      }
    }
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

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Command Classroom</h1>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            Create and manage your interactive sessions
          </p>
        </div>
        <CreatePresentationButton />
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="relative bg-card border border-border rounded-2xl p-5 dark:[box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.03)_inset] hover:-translate-y-0.5 hover:shadow-lg hover:border-border/80 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 font-medium">Total</p>
          <p className="text-2xl font-bold text-foreground mt-1.5">{enrichedPresentations.length}</p>
        </div>
        <div className="relative bg-card border border-border rounded-2xl p-5 dark:[box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.03)_inset] hover:-translate-y-0.5 hover:shadow-lg hover:border-border/80 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
          <div className="flex items-center gap-2">
            <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 font-medium">Live now</p>
            {Object.keys(activeSessionMap).length > 0 && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
            )}
          </div>
          <p className={`text-2xl font-bold mt-1.5 ${Object.keys(activeSessionMap).length > 0 ? 'text-emerald-500' : 'text-foreground'}`}>
            {Object.keys(activeSessionMap).length}
          </p>
        </div>
        <div className="relative bg-card border border-border rounded-2xl p-5 dark:[box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.03)_inset] hover:-translate-y-0.5 hover:shadow-lg hover:border-border/80 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
          <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 font-medium">Total sessions</p>
          <p className="text-2xl font-bold text-foreground mt-1.5">
            {Object.values(sessionCountMap).reduce((a, b) => a + b, 0)}
          </p>
        </div>
        <div className="relative bg-card border border-border rounded-2xl p-5 dark:[box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.03)_inset] hover:-translate-y-0.5 hover:shadow-lg hover:border-border/80 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
          <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 font-medium">Participants</p>
          <p className="text-2xl font-bold text-foreground mt-1.5">
            {Object.values(participantCountMap).reduce((a, b) => a + b, 0)}
          </p>
        </div>
      </div>

      {/* Presentations grid with built-in search/sort/view toggle */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 font-medium mb-2.5">All Sessions</p>
        <PresentationGrid presentations={enrichedPresentations} />
      </div>
    </div>
  )
}
