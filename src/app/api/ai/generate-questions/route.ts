import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getGeminiClient, GEMINI_MODEL } from '@/lib/gemini/client'
import { GENERATE_QUIZ_QUESTIONS_PROMPT } from '@/lib/gemini/prompts'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { topic, count = 5 } = await req.json()
  if (!topic) return NextResponse.json({ error: 'Topic required' }, { status: 400 })

  const genAI = getGeminiClient()
  const prompt = `${GENERATE_QUIZ_QUESTIONS_PROMPT}\n\nTopic: ${topic}\nNumber of questions: ${count}\n\nReturn ONLY valid JSON array, no markdown.`

  try {
    const result = await genAI.models.generateContent({
      model: GEMINI_MODEL,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    })
    const text = result.text ?? ''
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const questions = JSON.parse(cleaned)
    return NextResponse.json({ questions })
  } catch {
    return NextResponse.json({ error: 'Failed to generate questions' }, { status: 500 })
  }
}
