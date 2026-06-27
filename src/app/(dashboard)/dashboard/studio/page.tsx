import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Monitor, Plus } from 'lucide-react'
import type { Metadata } from 'next'
import { StudioListClient } from '@/components/studio/StudioListClient'

export const metadata: Metadata = { title: 'Command Studio — Command 360' }

export default async function StudioPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch presentations that have at least one studio slide
  const { data: allPresentations } = await supabase
    .from('presentations')
    .select('id, title, description, updated_at, created_at, slides(id, slide_type)')
    .eq('user_id', user.id)
    .eq('is_archived', false)
    .order('updated_at', { ascending: false })

  // Filter to only those with a studio slide
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const studioPresentations = (allPresentations || []).filter((p: any) => {
    const slides = p.slides as { id: string; slide_type: string }[] | null
    return slides && slides.some((s) => s.slide_type === 'studio')
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const presentations = studioPresentations.map((p: any) => ({
    id: p.id as string,
    title: p.title as string,
    description: (p.description as string) || '',
    updated_at: p.updated_at as string,
    created_at: (p.created_at as string) || p.updated_at as string,
    totalSlides: ((p.slides as { slide_type: string }[]) || []).length,
    studioSlideCount: ((p.slides as { slide_type: string }[]) || []).filter(
      (s) => s.slide_type === 'studio'
    ).length,
  }))

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-9 h-9 rounded-none bg-[#2592a3]/15 flex items-center justify-center">
              <Monitor className="w-5 h-5 text-[#2592a3]" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Command Studio</h1>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            Create rich, interactive visual experiences with layers, timelines, and live events
          </p>
        </div>
        <NewStudioButton />
      </div>

      {/* Studio presentations with grid/list toggle */}
      <StudioListClient presentations={presentations} />
    </div>
  )
}

/* -- New Studio button (server action) -- */

function NewStudioButton() {
  return (
    <form action={createStudioPresentation}>
      <button
        type="submit"
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 text-white text-[13px] font-semibold hover:bg-cyan-500 transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/25 active:scale-[0.98]"
      >
        <Plus className="w-4 h-4" />
        New Scene
      </button>
    </form>
  )
}

async function createStudioPresentation() {
  'use server'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Create presentation
  const { data: presentation, error: presError } = await supabase
    .from('presentations')
    .insert({
      user_id: user.id,
      title: 'Untitled Scene',
      description: '',
    })
    .select('id')
    .single()

  if (presError || !presentation) {
    redirect('/dashboard/studio')
  }

  // Create a studio slide
  const defaultStudioContent = {
    canvas: { width: 1920, height: 1080, backgroundColor: '#1a1a2e' },
    layers: [],
    eventCategories: [],
    events: [],
    tracks: [],
    timelineEvents: [],
    totalDuration: 10000,
    votingEnabled: false,
  }

  await supabase.from('slides').insert({
    presentation_id: presentation.id,
    slide_type: 'studio',
    position: 0,
    title: 'Studio Slide',
    content: defaultStudioContent,
  })

  redirect(`/presentations/${presentation.id}/edit`)
}
