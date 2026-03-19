import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { SlideEditor } from '@/components/editor/SlideEditor'

export default async function EditPresentationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: presentation } = await supabase
    .from('presentations')
    .select('*, slides(*)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!presentation) notFound()

  // Track last accessed time (fire-and-forget, non-blocking)
  supabase
    .from('presentations')
    .update({ last_accessed_at: new Date().toISOString() })
    .eq('id', id)
    .then(() => {})

  const slides = (presentation.slides || []).sort((a: { position: number }, b: { position: number }) => a.position - b.position)

  return <SlideEditor presentation={presentation} initialSlides={slides} />
}
