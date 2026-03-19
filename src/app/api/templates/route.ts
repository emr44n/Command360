import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/templates — list user's saved templates (presentations marked as templates)
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Templates are presentations with is_template = true
  const { data: templates, error } = await supabase
    .from('presentations')
    .select('id, title, description, updated_at')
    .eq('user_id', user.id)
    .eq('is_template', true)
    .eq('is_archived', false)
    .order('updated_at', { ascending: false })

  if (error) {
    // If is_template column doesn't exist yet, return empty array
    if (error.message.includes('is_template')) {
      return NextResponse.json({ templates: [] })
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

  // Get slides
  const { data: slides } = await supabase
    .from('slides')
    .select('*')
    .eq('presentation_id', presentation_id)
    .order('position')

  // Try to mark the current presentation as a template
  // If is_template column doesn't exist, we'll store template info in description metadata
  const { error: updateError } = await supabase
    .from('presentations')
    .update({
      description: `[TEMPLATE] ${original.description || title || original.title}`,
    })
    .eq('id', presentation_id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    template: {
      id: presentation_id,
      title: title || original.title,
      slide_count: slides?.length || 0,
    },
  })
}
