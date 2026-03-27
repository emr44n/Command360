import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // ── Fetch session ──
  const { data: session, error: sessionError } = await supabase
    .from('sessions')
    .select('id, presentation_id, host_user_id, status, started_at, ended_at, created_at')
    .eq('id', id)
    .eq('host_user_id', user.id)
    .single()

  if (sessionError || !session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }

  // ── Session duration ──
  const startedAt = session.started_at ? new Date(session.started_at) : null
  const endedAt = session.ended_at ? new Date(session.ended_at) : null
  const durationMs =
    startedAt && endedAt ? endedAt.getTime() - startedAt.getTime() : null
  const durationSeconds = durationMs !== null ? Math.round(durationMs / 1000) : null

  // ── Participants ──
  let participantCount = 0
  try {
    const { data: participants } = await supabase
      .from('session_participants')
      .select('id, joined_at')
      .eq('session_id', id)

    participantCount = participants?.length ?? 0
  } catch {
    // Table may not exist yet
  }

  // ── Responses & vote participation ──
  let totalResponses = 0
  let avgResponseTimeMs: number | null = null
  const slideResponseCounts: Record<string, number> = {}

  try {
    const { data: responses } = await supabase
      .from('responses')
      .select('id, slide_id, created_at')
      .eq('session_id', id)

    if (responses && responses.length > 0) {
      totalResponses = responses.length

      // Count responses per slide for participation breakdown
      for (const r of responses) {
        slideResponseCounts[r.slide_id] =
          (slideResponseCounts[r.slide_id] || 0) + 1
      }

      // Estimate average response time from the gap between session start
      // and the first response per slide (rough proxy without explicit timing)
      if (startedAt) {
        const responseTimes = responses
          .map((r) => new Date(r.created_at).getTime() - startedAt.getTime())
          .filter((t) => t > 0)

        if (responseTimes.length > 0) {
          avgResponseTimeMs = Math.round(
            responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
          )
        }
      }
    }
  } catch {
    // Table may not exist yet
  }

  // ── Slides for context ──
  let slideCount = 0
  try {
    const { data: slides } = await supabase
      .from('slides')
      .select('id')
      .eq('presentation_id', session.presentation_id)

    slideCount = slides?.length ?? 0
  } catch {
    // Table may not exist yet
  }

  // ── Vote participation rate ──
  // If there were interactive slides and participants, compute participation
  const interactiveSlideCount = Object.keys(slideResponseCounts).length
  const voteParticipationRate =
    participantCount > 0 && interactiveSlideCount > 0
      ? Math.round(
          (totalResponses / (participantCount * interactiveSlideCount)) * 100
        )
      : null

  // ── Event trigger log (session_events table, may not exist yet) ──
  let eventLog: Array<{ type: string; timestamp: string; payload: unknown }> = []
  try {
    const { data: events } = await supabase
      .from('session_events')
      .select('event_type, created_at, payload')
      .eq('session_id', id)
      .order('created_at', { ascending: true })

    if (events) {
      eventLog = events.map((e) => ({
        type: e.event_type,
        timestamp: e.created_at,
        payload: e.payload,
      }))
    }
  } catch {
    // Table may not exist yet
  }

  return NextResponse.json({
    sessionId: session.id,
    presentationId: session.presentation_id,
    status: session.status,
    startedAt: session.started_at,
    endedAt: session.ended_at,
    durationSeconds,
    participantCount,
    totalResponses,
    avgResponseTimeMs,
    slideCount,
    interactiveSlideCount,
    voteParticipationRate,
    slideResponseCounts,
    eventLog,
  })
}
