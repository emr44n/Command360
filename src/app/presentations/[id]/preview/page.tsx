import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { PreviewMode } from '@/components/editor/PreviewMode'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Preview — Command 360' }

export default async function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: presentation } = await supabase
    .from('presentations')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!presentation) notFound()

  const { data: slides } = await supabase
    .from('slides')
    .select('*')
    .eq('presentation_id', id)
    .order('position', { ascending: true })

  return <PreviewMode presentation={presentation} slides={slides || []} />
}
