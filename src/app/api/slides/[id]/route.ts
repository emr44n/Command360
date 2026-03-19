import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

async function verifySlideOwnership(supabase: Awaited<ReturnType<typeof createClient>>, slideId: string, userId: string) {
  const { data: slide } = await supabase.from('slides').select('presentation_id').eq('id', slideId).single()
  if (!slide) return false
  const { data: pres } = await supabase.from('presentations').select('id')
    .eq('id', slide.presentation_id).eq('user_id', userId).single()
  return !!pres
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const owned = await verifySlideOwnership(supabase, id, user.id)
  if (!owned) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const { data, error } = await supabase.from('slides').update(body).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ slide: data })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const owned = await verifySlideOwnership(supabase, id, user.id)
  if (!owned) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { error } = await supabase.from('slides').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
