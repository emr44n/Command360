import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { direction } = await req.json()

  // Get session + presentation slides
  const { data: session } = await supabase
    .from('sessions')
    .select('*, presentations(slides(id, position))')
    .eq('id', id)
    .eq('host_user_id', user.id)
    .single()

  if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 })

  const slides = (session.presentations as { slides: { id: string; position: number }[] }).slides
    .sort((a, b) => a.position - b.position)

  const currentIdx = slides.findIndex((s) => s.id === session.current_slide_id)
  const nextIdx = direction === 'next'
    ? Math.min(currentIdx + 1, slides.length - 1)
    : Math.max(currentIdx - 1, 0)
  const nextSlide = slides[nextIdx]

  if (!nextSlide) return NextResponse.json({ error: 'No slide' }, { status: 400 })

  await supabase
    .from('sessions')
    .update({ current_slide_id: nextSlide.id, voting_open: false })
    .eq('id', id)

  return NextResponse.json({ slide_id: nextSlide.id, slide_index: nextIdx, voting_open: false })
}
