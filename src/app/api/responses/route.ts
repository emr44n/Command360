import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { calculateQuizScore } from '@/lib/utils/scoring'
import type { QuizContent } from '@/types/slide'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { session_id, slide_id, participant_id, client_token, answer } = await req.json()

  if (!session_id || !slide_id || !participant_id || !client_token) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Validate participant
  const { data: participant } = await supabase
    .from('participants')
    .select('id, client_token, score')
    .eq('id', participant_id)
    .eq('session_id', session_id)
    .single()

  if (!participant || participant.client_token !== client_token) {
    return NextResponse.json({ error: 'Invalid participant' }, { status: 403 })
  }

  // Check session voting is open
  const { data: session } = await supabase
    .from('sessions')
    .select('voting_open, status')
    .eq('id', session_id)
    .single()

  if (!session?.voting_open || session.status !== 'active') {
    return NextResponse.json({ error: 'Voting is not open' }, { status: 400 })
  }

  // Check for existing response (prevent duplicate)
  const { data: existing } = await supabase
    .from('responses')
    .select('id')
    .eq('slide_id', slide_id)
    .eq('participant_id', participant_id)
    .single()

  if (existing) {
    return NextResponse.json({ error: 'Already responded to this slide' }, { status: 409 })
  }

  // Get slide info to calculate quiz score
  const { data: slide } = await supabase.from('slides').select('slide_type, content').eq('id', slide_id).single()

  let pointsEarned = 0
  let enrichedAnswer = answer

  if (slide?.slide_type === 'quiz') {
    const quizContent = slide.content as QuizContent
    const correctOption = quizContent.options?.find((o) => o.is_correct)
    const isCorrect = answer.selected_option_id === correctOption?.id
    const timeLimitMs = (quizContent.time_limit_seconds || 30) * 1000
    const timeTakenMs = answer.time_taken_ms || timeLimitMs

    if (isCorrect) {
      pointsEarned = calculateQuizScore(quizContent.time_limit_seconds || 30, timeTakenMs, quizContent.points || 1000)
    }

    enrichedAnswer = { ...answer, is_correct: isCorrect, points_earned: pointsEarned }

    // Update participant score
    if (pointsEarned > 0) {
      await supabase
        .from('participants')
        .update({ score: (participant.score || 0) + pointsEarned })
        .eq('id', participant_id)
    }
  }

  // Insert response
  const { error } = await supabase
    .from('responses')
    .insert({ session_id, slide_id, participant_id, answer: enrichedAnswer })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true, points_earned: pointsEarned }, { status: 201 })
}
