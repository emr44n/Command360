import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getDefaultSlideContent } from '@/lib/utils/slide-utils'
import type { SlideType } from '@/types/slide'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { presentation_id, slide_type, position, title } = await req.json()

  const { data: pres } = await supabase
    .from('presentations')
    .select('id')
    .eq('id', presentation_id)
    .eq('user_id', user.id)
    .single()
  if (!pres) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const content = getDefaultSlideContent(slide_type as SlideType)
  const { data, error } = await supabase
    .from('slides')
    .insert({ presentation_id, slide_type, position: position ?? 0, title: title || '', content })
    .select()
    .single()

  if (error) {
    if (error.message.includes('slides_slide_type_check')) {
      const projectRef = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').match(/https:\/\/(.+)\.supabase\.co/)?.[1] || ''
      return NextResponse.json({
        error: `Slide type "${slide_type}" not yet enabled in database.`,
        migration_needed: true,
        dashboard_url: projectRef ? `https://supabase.com/dashboard/project/${projectRef}/sql/new` : null,
        sql: `ALTER TABLE slides DROP CONSTRAINT IF EXISTS slides_slide_type_check;\nALTER TABLE slides ADD CONSTRAINT slides_slide_type_check\n  CHECK (slide_type IN ('poll', 'word_cloud', 'quiz', 'qna', 'survey', 'content', 'rating_scale', 'open_text', 'studio'));\nALTER TABLE slides ADD COLUMN IF NOT EXISTS speaker_notes TEXT DEFAULT '';`,
      }, { status: 400 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ slide: data }, { status: 201 })
}
