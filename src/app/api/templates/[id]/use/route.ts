import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

// POST /api/templates/[id]/use — create a new presentation from a user template
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Get the template presentation
  const { data: template } = await supabase
    .from('presentations')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!template) return NextResponse.json({ error: 'Template not found' }, { status: 404 })

  // Get slides from the template
  const { data: slides } = await supabase
    .from('slides')
    .select('*')
    .eq('presentation_id', id)
    .order('position')

  // Create a new presentation from the template
  const newId = uuidv4()
  const cleanTitle = template.title.replace(/\s*\(Template\)$/, '')
  const cleanDescription = (template.description || '').replace(/^\[TEMPLATE\]\s*/, '')

  const { data: newPres, error: presError } = await supabase
    .from('presentations')
    .insert({
      id: newId,
      user_id: user.id,
      title: cleanTitle,
      description: cleanDescription,
      is_archived: false,
    })
    .select()
    .single()

  if (presError) return NextResponse.json({ error: presError.message }, { status: 500 })

  // Copy slides to the new presentation
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
