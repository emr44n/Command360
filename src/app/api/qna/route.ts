import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { session_id, slide_id, participant_id, question_text } = await req.json()

  if (!session_id || !slide_id || !participant_id || !question_text?.trim()) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Check if moderation is enabled on this slide
  const { data: slide } = await supabase
    .from('slides')
    .select('content')
    .eq('id', slide_id)
    .single()

  const moderationEnabled = (slide?.content as { moderation_enabled?: boolean })?.moderation_enabled ?? false

  const { data, error } = await supabase
    .from('qna_questions')
    .insert({
      session_id,
      slide_id,
      participant_id,
      question_text: question_text.trim(),
      upvote_count: 0,
      is_hidden: moderationEnabled,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ question: data }, { status: 201 })
}
