import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()

    if (body.format !== 'c360') {
      return NextResponse.json({ error: 'Invalid file format' }, { status: 400 })
    }

    // Create the presentation
    const { data: presentation, error: presError } = await supabase
      .from('presentations')
      .insert({
        user_id: user.id,
        title: `${body.presentation?.title || 'Imported Deck'} (imported)`,
        description: body.presentation?.description || '',
      })
      .select()
      .single()

    if (presError || !presentation) {
      return NextResponse.json({ error: 'Failed to create presentation' }, { status: 500 })
    }

    // Create slides
    if (body.slides && Array.isArray(body.slides)) {
      const slidesData = body.slides.map((s: Record<string, unknown>, i: number) => ({
        presentation_id: presentation.id,
        slide_type: s.slide_type || 'content',
        title: s.title || '',
        content: s.content || {},
        position: typeof s.position === 'number' ? s.position : i,
        speaker_notes: s.speaker_notes || '',
      }))

      const { error: slidesError } = await supabase.from('slides').insert(slidesData)
      if (slidesError) {
        // Clean up the presentation if slides fail
        await supabase.from('presentations').delete().eq('id', presentation.id)
        return NextResponse.json({ error: 'Failed to import slides' }, { status: 500 })
      }
    }

    return NextResponse.json({ presentation })
  } catch {
    return NextResponse.json({ error: 'Invalid file content' }, { status: 400 })
  }
}
