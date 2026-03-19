import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getGeminiClient, GEMINI_MODEL } from '@/lib/gemini/client'
import { ANALYZE_WORD_CLOUD_PROMPT } from '@/lib/gemini/prompts'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { words, prompt: slidePrompt } = await req.json()
  if (!words?.length) return NextResponse.json({ error: 'Words required' }, { status: 400 })

  const genAI = getGeminiClient()
  const fullPrompt = `${ANALYZE_WORD_CLOUD_PROMPT}\n\n${slidePrompt ? `Context: ${slidePrompt}\n` : ''}Words submitted: ${words.join(', ')}`

  try {
    const result = await genAI.models.generateContent({
      model: GEMINI_MODEL,
      contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
    })
    return NextResponse.json({ analysis: result.text ?? '' })
  } catch {
    return NextResponse.json({ error: 'Failed to analyze words' }, { status: 500 })
  }
}
