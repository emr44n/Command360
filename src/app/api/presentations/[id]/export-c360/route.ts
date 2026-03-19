import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: presentation } = await supabase
    .from('presentations')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!presentation) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { data: slides } = await supabase
    .from('slides')
    .select('*')
    .eq('presentation_id', id)
    .order('position', { ascending: true })

  const exportData = {
    format: 'c360',
    version: '1.0',
    exported_at: new Date().toISOString(),
    presentation: {
      title: presentation.title,
      description: presentation.description,
    },
    slides: (slides || []).map((s: Record<string, unknown>) => ({
      slide_type: s.slide_type,
      title: s.title,
      content: s.content,
      position: s.position,
      speaker_notes: s.speaker_notes,
    })),
  }

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="${presentation.title.replace(/[^a-zA-Z0-9]/g, '_')}.c360"`,
    },
  })
}
