import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getGeminiClient, GEMINI_MODEL } from '@/lib/gemini/client'
import { SUMMARIZE_SESSION_PROMPT } from '@/lib/gemini/prompts'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Fetch session + all responses
  const { data: session } = await supabase
    .from('sessions')
    .select('*, presentations(title, slides(id, title, slide_type, content))')
    .eq('id', id)
    .eq('host_user_id', user.id)
    .single()

  if (!session) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { data: responses } = await supabase
    .from('responses')
    .select('slide_id, answer')
    .eq('session_id', id)

  const pres = session.presentations as { title: string; slides: Array<{ id: string; title: string; slide_type: string; content: unknown }> }

  const sessionData = {
    title: pres.title,
    slides: pres.slides.map((slide) => ({
      title: slide.title,
      type: slide.slide_type,
      responses: (responses || []).filter((r) => r.slide_id === slide.id).map((r) => r.answer),
    })),
  }

  const prompt = SUMMARIZE_SESSION_PROMPT + '\n\nSession data:\n' + JSON.stringify(sessionData, null, 2)

  const genAI = getGeminiClient()

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
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Transfer-Encoding': 'chunked' },
  })
}
