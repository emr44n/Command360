import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Monitor, Clock, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

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
            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 flex items-center justify-center">
              <Monitor className="w-5 h-5 text-cyan-500" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Command Studio</h1>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            Create rich, interactive visual experiences with layers, timelines, and live events
          </p>
        </div>
        <NewStudioButton />
      </div>

      {/* Studio presentations grid */}
      {presentations.length === 0 ? (
        <div className="relative border border-dashed border-border rounded-2xl p-12 text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-4">
            <Monitor className="w-8 h-8 text-cyan-500/60" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            No studio presentations yet
          </h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
            Create your first Command Studio presentation to start building interactive visual experiences with layers, animations, and live audience interaction.
          </p>
          <NewStudioButton />
        </div>
      ) : (
        <div>
          <h2 className="text-[10px] uppercase tracking-[0.15em] font-semibold text-muted-foreground mb-3">
            Studio Presentations ({presentations.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {presentations.map((p) => (
              <Link
                key={p.id}
                href={`/presentations/${p.id}/edit`}
                className="group relative bg-card border border-border rounded-2xl p-5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
              >
                {/* Top accent */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0 group-hover:bg-cyan-500/20 transition-colors">
                    <Monitor className="w-4 h-4 text-cyan-500" />
                  </div>
                  <span className="text-[10px] rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 px-2 py-0.5 font-medium">
                    {p.studioSlideCount} studio slide{p.studioSlideCount !== 1 ? 's' : ''}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                  {p.title}
                </h3>
                {p.description && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {p.description}
                  </p>
                )}

                <div className="flex items-center gap-1.5 mt-3 text-[10px] text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>
                    {new Date(p.updated_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-4 h-4 text-primary" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ── New Studio button (client component) ── */

function NewStudioButton() {
  return (
    <form action={createStudioPresentation}>
      <button
        type="submit"
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 text-white text-[13px] font-semibold hover:bg-cyan-500 transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/25 active:scale-[0.98]"
      >
        <Plus className="w-4 h-4" />
        New Studio
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
      title: 'Untitled Studio',
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
