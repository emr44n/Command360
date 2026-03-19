import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { PresenterView } from '@/components/presenter/PresenterView'

export default async function PresentPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: session } = await supabase
    .from('sessions')
    .select('*, presentations!inner(id, title)')
    .eq('id', sessionId)
    .eq('host_user_id', user.id)
    .single()

  if (!session) notFound()

  const { data: slides } = await supabase
    .from('slides')
    .select('*')
    .eq('presentation_id', session.presentation_id)
    .order('position')

  return (
    <PresenterView
      session={session as Parameters<typeof PresenterView>[0]['session']}
      slides={slides || []}
    />
  )
}
