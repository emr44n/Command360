import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getGeminiClient, GEMINI_MODEL } from '@/lib/gemini/client'
import { SUGGEST_ANSWER_PROMPT } from '@/lib/gemini/prompts'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { question } = await req.json()
  if (!question) return NextResponse.json({ error: 'Question required' }, { status: 400 })

  const genAI = getGeminiClient()
  const prompt = `${SUGGEST_ANSWER_PROMPT}\n\nQuestion: ${question}`

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const result = await genAI.models.generateContentStream({
          model: GEMINI_MODEL,
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
        })
        for await (const chunk of result) {
          const text = chunk.text
          if (text) controller.enqueue(new TextEncoder().encode(text))
        }
      } catch (err) {
        controller.error(err)
      } finally {
        controller.close()
      }
    },
  })

  return new NextResponse(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
