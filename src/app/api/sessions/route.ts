import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { presentation_id } = await req.json()

  // Verify ownership
  const { data: pres } = await supabase
    .from('presentations')
    .select('id')
    .eq('id', presentation_id)
    .eq('user_id', user.id)
    .single()
  if (!pres) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  // Generate a unique 6-char uppercase room code
  let roomCode: string = ''
  for (let attempts = 0; attempts < 10; attempts++) {
    const candidate = Math.random().toString(36).substring(2, 8).toUpperCase()
    const { data: existing } = await supabase
      .from('sessions').select('id').eq('room_code', candidate).maybeSingle()
    if (!existing) { roomCode = candidate; break }
  }
  if (!roomCode) return NextResponse.json({ error: 'Could not generate room code' }, { status: 500 })

  // Get the first slide
  const { data: firstSlide } = await supabase
    .from('slides').select('id')
    .eq('presentation_id', presentation_id)
    .order('position', { ascending: true })
    .limit(1).maybeSingle()

  // Create the session
  const { data, error } = await supabase
    .from('sessions')
    .insert({
      presentation_id,
      host_user_id: user.id,
      room_code: roomCode,
      current_slide_id: firstSlide?.id || null,
      status: 'active',
      voting_open: false,
    })
    .select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ session: data }, { status: 201 })
}

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const url = new URL(req.url)
  const presentationId = url.searchParams.get('presentation_id')

  let query = supabase.from('sessions').select('*, presentations(title)').eq('host_user_id', user.id)
  if (presentationId) query = query.eq('presentation_id', presentationId)

  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ sessions: data })
}
