import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Count presentations
  const { count: presentationCount } = await supabase
    .from('presentations')
    .select('*', { count: 'exact', head: true })

  // Count sessions
  const { count: sessionCount } = await supabase
    .from('sessions')
    .select('*', { count: 'exact', head: true })

  // Count participants
  let participantCount = 0
  try {
    const { count } = await supabase
      .from('participants')
      .select('*', { count: 'exact', head: true })
    participantCount = count || 0
  } catch {
    // table may not exist
  }

  // Count responses
  let responseCount = 0
  try {
    const { count } = await supabase
      .from('responses')
      .select('*', { count: 'exact', head: true })
    responseCount = count || 0
  } catch {
    // table may not exist
  }

  // Recent presentations
  const { data: recentPresentations } = await supabase
    .from('presentations')
    .select('id, title, created_at, user_id')
    .order('created_at', { ascending: false })
    .limit(10)

  // Recent sessions
  const { data: recentSessions } = await supabase
    .from('sessions')
    .select('id, room_code, status, started_at, host_user_id')
    .order('started_at', { ascending: false })
    .limit(10)

  return NextResponse.json({
    presentationCount: presentationCount || 0,
    sessionCount: sessionCount || 0,
    participantCount,
    responseCount,
    recentPresentations: recentPresentations || [],
    recentSessions: recentSessions || [],
  })
}
