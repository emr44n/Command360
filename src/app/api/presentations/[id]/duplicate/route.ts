import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: original } = await supabase
    .from('presentations')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!original) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const newId = uuidv4()
  const { data: newPres, error: presError } = await supabase
    .from('presentations')
    .insert({ id: newId, user_id: user.id, title: original.title + ' (Copy)', description: original.description, is_archived: false })
    .select()
    .single()

  if (presError) return NextResponse.json({ error: presError.message }, { status: 500 })

  const { data: slides } = await supabase
    .from('slides')
    .select('*')
    .eq('presentation_id', id)
    .order('position')

  if (slides && slides.length > 0) {
    const newSlides = slides.map((s) => ({
      id: uuidv4(),
      presentation_id: newId,
      slide_type: s.slide_type,
      position: s.position,
      title: s.title,
      content: s.content,
    }))
    await supabase.from('slides').insert(newSlides)
  }

  return NextResponse.json({ presentation: newPres })
}
