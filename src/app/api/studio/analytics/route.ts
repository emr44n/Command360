import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  // Store in localStorage-based approach for now (no new table needed)
  // The event data is received and acknowledged; future iterations can persist to a table
  return NextResponse.json({ ok: true, event_type: body.event_type })
}

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const sessionId = req.nextUrl.searchParams.get('session_id')
  // Return analytics data — for now returns empty; future iterations can query a dedicated table
  return NextResponse.json({ events: [], summary: {}, session_id: sessionId })
}
