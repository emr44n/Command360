import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { room_code, display_name } = await req.json()

  if (!room_code || !display_name) {
    return NextResponse.json({ error: 'Room code and display name are required' }, { status: 400 })
  }

  // Find active session
  const { data: session } = await supabase
    .from('sessions')
    .select('id, status, presentation_id, current_slide_id, voting_open, room_code')
    .eq('room_code', room_code.toUpperCase())
    .in('status', ['waiting', 'active'])
    .single()

  if (!session) {
    return NextResponse.json({ error: 'Room not found or session has ended' }, { status: 404 })
  }

  // Create participant
  const { data: participant, error } = await supabase
    .from('participants')
    .insert({ session_id: session.id, display_name: display_name.trim(), score: 0 })
    .select('id, client_token')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    session_id: session.id,
    participant_id: participant.id,
    client_token: participant.client_token,
    display_name: display_name.trim(),
  }, { status: 201 })
}
