import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const {
      session_id,
      duration,
      events_triggered,
      assets_added,
      presenter_name,
      scene_name,
      start_time,
      end_time,
    } = body

    // Store exercise data as a session metadata update
    // We update the session record with exercise stats
    const { error } = await supabase
      .from('sessions')
      .update({
        ended_at: end_time,
        metadata: {
          exercise: {
            duration,
            events_triggered,
            assets_added,
            presenter_name,
            scene_name,
            start_time,
            end_time,
          },
        },
      })
      .eq('id', session_id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Failed to save exercise data:', error)
      return NextResponse.json({ error: 'Failed to save exercise data' }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
