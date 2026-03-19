import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Verify session ownership
  const { data: session } = await supabase
    .from('sessions')
    .select('*, presentations!inner(id, title, user_id)')
    .eq('id', id)
    .single()

  if (!session || (session.presentations as { user_id: string }).user_id !== user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // Get slides
  const { data: slides } = await supabase
    .from('slides')
    .select('*')
    .eq('presentation_id', (session.presentations as { id: string }).id)
    .order('position')

  // Get all responses for this session
  const { data: responses } = await supabase
    .from('responses')
    .select('*, participants(display_name)')
    .eq('session_id', id)

  // Get Q&A questions
  const { data: qnaQuestions } = await supabase
    .from('qna_questions')
    .select('*')
    .in('slide_id', (slides || []).map((s) => s.id))

  // Build CSV
  const rows: string[][] = []
  rows.push(['Slide', 'Type', 'Title', 'Participant', 'Answer', 'Timestamp'])

  const slideMap = new Map((slides || []).map((s) => [s.id, s]))

  // Add responses
  for (const r of responses || []) {
    const slide = slideMap.get(r.slide_id)
    if (!slide) continue
    const participant = (r.participants as { display_name: string })?.display_name || 'Anonymous'
    let answer = ''

    if (slide.slide_type === 'poll') {
      const selected = (r.answer as { selected_option_ids?: string[] })?.selected_option_ids || []
      const options = (slide.content as { options?: { id: string; text: string }[] })?.options || []
      answer = selected.map((sid: string) => options.find((o) => o.id === sid)?.text || sid).join(', ')
    } else if (slide.slide_type === 'quiz') {
      const selected = (r.answer as { selected_option_id?: string })?.selected_option_id || ''
      const options = (slide.content as { options?: { id: string; text: string }[] })?.options || []
      answer = options.find((o) => o.id === selected)?.text || selected
    } else if (slide.slide_type === 'word_cloud') {
      answer = ((r.answer as { words?: string[] })?.words || []).join(', ')
    } else if (slide.slide_type === 'survey') {
      answer = JSON.stringify(r.answer)
    } else {
      answer = JSON.stringify(r.answer)
    }

    rows.push([
      `${slide.position + 1}`,
      slide.slide_type,
      slide.title || '(untitled)',
      participant,
      answer,
      new Date(r.submitted_at || r.created_at).toISOString(),
    ])
  }

  // Add Q&A questions
  for (const q of qnaQuestions || []) {
    const slide = slideMap.get(q.slide_id)
    if (!slide) continue
    rows.push([
      `${slide.position + 1}`,
      'qna',
      slide.title || '(untitled)',
      q.participant_name || 'Anonymous',
      q.question_text,
      new Date(q.created_at).toISOString(),
    ])
  }

  // Convert to CSV string
  function escapeCsv(val: string): string {
    if (val.includes(',') || val.includes('"') || val.includes('\n')) {
      return `"${val.replace(/"/g, '""')}"`
    }
    return val
  }

  const csv = rows.map((row) => row.map(escapeCsv).join(',')).join('\n')
  const title = (session.presentations as { title: string }).title || 'export'

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${title.replace(/[^a-zA-Z0-9]/g, '_')}_${session.room_code}.csv"`,
    },
  })
}
