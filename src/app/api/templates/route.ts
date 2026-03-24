import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

// GET /api/templates — list user's saved templates
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Try is_template column first
  const { data: templates, error } = await supabase
    .from('presentations')
    .select('id, title, description, updated_at')
    .eq('user_id', user.id)
    .eq('is_template', true)
    .eq('is_archived', false)
    .order('updated_at', { ascending: false })

  if (error) {
    // If is_template column doesn't exist, fall back to [TEMPLATE] prefix
    if (error.message.includes('is_template')) {
      const { data: fallback } = await supabase
        .from('presentations')
        .select('id, title, description, updated_at')
        .eq('user_id', user.id)
        .eq('is_archived', false)
        .ilike('description', '[TEMPLATE]%')
        .order('updated_at', { ascending: false })
      return NextResponse.json({ templates: fallback || [] })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ templates: templates || [] })
}

// POST /api/templates — save a presentation as a template (creates a copy marked as template)
export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { presentation_id, title } = await req.json()
  if (!presentation_id) return NextResponse.json({ error: 'presentation_id required' }, { status: 400 })

  // Get the original presentation
  const { data: original } = await supabase
    .from('presentations')
    .select('*')
    .eq('id', presentation_id)
    .eq('user_id', user.id)
    .single()

  if (!original) return NextResponse.json({ error: 'Presentation not found' }, { status: 404 })

  // Get slides from the original
  const { data: slides } = await supabase
    .from('slides')
    .select('*')
    .eq('presentation_id', presentation_id)
    .order('position')

  // Create a new presentation marked as a template
  const newId = uuidv4()
  const templateTitle = title || `${original.title} (Template)`

  // Try with is_template column first
  const { data: newPres, error: insertError } = await supabase
    .from('presentations')
    .insert({
      id: newId,
      user_id: user.id,
      title: templateTitle,
      description: original.description || '',
      is_template: true,
      is_archived: false,
    })
    .select()
    .single()

  if (insertError) {
    // If is_template column doesn't exist, use description prefix approach
    if (insertError.message.includes('is_template')) {
      const { data: fallbackPres, error: fallbackError } = await supabase
        .from('presentations')
        .insert({
          id: newId,
          user_id: user.id,
          title: templateTitle,
          description: `[TEMPLATE] ${original.description || ''}`,
          is_archived: false,
        })
        .select()
        .single()

      if (fallbackError) {
        return NextResponse.json({ error: fallbackError.message }, { status: 500 })
      }

      // Copy slides
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

      return NextResponse.json({
        success: true,
        template: {
          id: newId,
          title: templateTitle,
          slide_count: slides?.length || 0,
        },
      })
    }
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  // Copy slides to the template
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

  return NextResponse.json({
    success: true,
    template: {
      id: newId,
      title: templateTitle,
      slide_count: slides?.length || 0,
    },
  })
}
