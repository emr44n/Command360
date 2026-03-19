import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest, { params }: { params: Promise<{ questionId: string }> }) {
  const { questionId } = await params
  const supabase = await createClient()
  const { participant_id } = await req.json()

  if (!participant_id) return NextResponse.json({ error: 'participant_id required' }, { status: 400 })

  const { data, error } = await supabase.rpc('upvote_question', {
    p_question_id: questionId,
    p_participant_id: participant_id,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, upvote_count: data })
}
