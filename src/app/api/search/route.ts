import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim()
  if (!q) return NextResponse.json({ results: [] })

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const results: { id: string; title: string; type: 'presentation' | 'session'; subtitle?: string }[] = []

  // Search presentations by title
  const { data: presentations } = await supabase
    .from('presentations')
    .select('id, title')
    .eq('user_id', user.id)
    .ilike('title', `%${q}%`)
    .limit(10)

  if (presentations) {
    for (const p of presentations) {
      results.push({ id: p.id, title: p.title, type: 'presentation' })
    }
  }

  // Search sessions by room_code
  const { data: sessions } = await supabase
    .from('sessions')
    .select('id, room_code, presentation_id, status')
    .eq('host_user_id', user.id)
    .ilike('room_code', `%${q}%`)
    .limit(10)

  if (sessions) {
    for (const s of sessions) {
      results.push({
        id: s.id,
        title: `Session ${s.room_code || s.id.slice(0, 8)}`,
        type: 'session',
        subtitle: s.status,
      })
    }
  }

  return NextResponse.json({ results })
}
