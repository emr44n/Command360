import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ questionId: string }> }) {
  const { questionId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { is_answered, is_hidden, ai_suggested_answer } = await req.json()

  const updates: Record<string, unknown> = {}
  if (is_answered !== undefined) updates.is_answered = is_answered
  if (is_hidden !== undefined) updates.is_hidden = is_hidden
  if (ai_suggested_answer !== undefined) updates.ai_suggested_answer = ai_suggested_answer

  // Verify the requesting user is the session host
  const { data: question } = await supabase
    .from('qna_questions').select('session_id').eq('id', questionId).single()
  if (!question) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const { data: session } = await supabase
    .from('sessions').select('host_user_id').eq('id', question.session_id).single()
  if (!session || session.host_user_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { data, error } = await supabase
    .from('qna_questions')
    .update(updates)
    .eq('id', questionId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ question: data })
}
