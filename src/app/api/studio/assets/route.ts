import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Accepts image, video, and audio files (mp3, wav, ogg, webm, mp4 audio).
// The Supabase 'assets' bucket allowedMimeTypes already includes audio/* MIME types.
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await request.formData()
  const file = formData.get('file') as File
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  const ext = file.name.split('.').pop()
  const path = `studio/${user.id}/${crypto.randomUUID()}.${ext}`

  const { data, error } = await supabase.storage
    .from('assets')
    .upload(path, file, { contentType: file.type })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: urlData } = supabase.storage.from('assets').getPublicUrl(path)

  return NextResponse.json({ url: urlData.publicUrl, name: file.name })
}
