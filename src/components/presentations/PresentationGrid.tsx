'use client'
import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import {
  MoreHorizontal, Pencil, BarChart2, Trash2, Play, Presentation, Copy, Bookmark,
  Search, LayoutGrid, List, Cloud, HelpCircle, MessageCircle, ClipboardList,
  FileText, Users, Activity, Radio, SlidersHorizontal, ArrowUpDown, Calendar,
  Star, AlignLeft,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface SlideInfo { count: number; slide_type?: string }
interface PresentationItem {
  id: string
  title: string
  description?: string
  updated_at: string
  created_at?: string
  slides?: SlideInfo[] | number
  session_count?: number
  participant_count?: number
  has_active_session?: boolean
}

const TYPE_ICON_MAP: Record<string, React.ElementType> = {
  poll: BarChart2, word_cloud: Cloud, quiz: HelpCircle, qna: MessageCircle,
  survey: ClipboardList, content: FileText, rating_scale: Star, open_text: AlignLeft,
}
const TYPE_COLOR_MAP: Record<string, string> = {
  poll: 'text-primary', word_cloud: 'text-blue-500', quiz: 'text-emerald-500',
  qna: 'text-amber-500', survey: 'text-pink-500', content: 'text-muted-foreground',
  rating_scale: 'text-orange-500', open_text: 'text-teal-500',
}
const TYPE_LABEL_MAP: Record<string, string> = {
  poll: 'Poll', word_cloud: 'Word Cloud', quiz: 'Quiz', qna: 'Q&A',
  survey: 'Survey', content: 'Content', rating_scale: 'Rating', open_text: 'Open Text',
}

type SortKey = 'updated' | 'created' | 'name' | 'sessions' | 'accessed'

export function PresentationGrid({ presentations }: { presentations: PresentationItem[] }) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'grid' | 'list'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('c360-view-mode') as 'grid' | 'list') || 'grid'
    }
    return 'grid'
  })
  const [sortBy, setSortBy] = useState<SortKey>('updated')
  const [mounted, setMounted] = useState(false)
  const [loadingStates, setLoadingStates] = useState<Record<string, string>>({})

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100)
    return () => clearTimeout(t)
  }, [])

  const filtered = useMemo(() => {
    let result = presentations
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (p) => (p.title || '').toLowerCase().includes(q) ||
               (p.description || '').toLowerCase().includes(q)
      )
    }
    // Sort
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.title || '').localeCompare(b.title || '')
        case 'created':
          return new Date(b.created_at || b.updated_at).getTime() - new Date(a.created_at || a.updated_at).getTime()
        case 'accessed':
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        case 'sessions':
          return (b.session_count || 0) - (a.session_count || 0)
        default: // updated
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      }
    })
    return result
  }, [presentations, search, sortBy])

  if (presentations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 rounded-2xl bg-muted/50 border border-border/50 flex items-center justify-center mb-5 animate-pulse">
          <Presentation className="w-10 h-10 text-muted-foreground/30" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No presentations yet</h3>
        <p className="text-muted-foreground text-sm max-w-xs mb-6">
          Create your first presentation to get started with live polls, quizzes, word clouds and more.
        </p>
      </div>
    )
  }

  function setLoading(id: string, action: string) {
    setLoadingStates((prev) => ({ ...prev, [id]: action }))
  }
  function clearLoading(id: string) {
    setLoadingStates((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    setLoading(id, 'deleting')
    const res = await fetch(`/api/presentations/${id}`, { method: 'DELETE' })
    if (res.ok) {
      toast.success('Presentation deleted')
      router.refresh()
    } else {
      toast.error('Failed to delete')
    }
    clearLoading(id)
  }

  async function handleStart(presentationId: string) {
    setLoading(presentationId, 'starting')
    const res = await fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ presentation_id: presentationId }),
    })
    if (res.ok) {
      const data = await res.json()
      router.push(`/present/${data.session.id}`)
    } else {
      toast.error('Failed to start session')
      clearLoading(presentationId)
    }
  }

  async function handleDuplicate(id: string) {
    setLoading(id, 'duplicating')
    const res = await fetch(`/api/presentations/${id}/duplicate`, { method: 'POST' })
    if (res.ok) {
      toast.success('Presentation duplicated')
      router.refresh()
    } else {
      toast.error('Failed to duplicate')
    }
    clearLoading(id)
  }

  async function handleSaveAsTemplate(id: string, title: string) {
    setLoading(id, 'saving template')
    const res = await fetch('/api/templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ presentation_id: id, title }),
    })
    if (res.ok) {
      toast.success('Saved as template')
    } else {
      toast.error('Failed to save as template')
    }
    clearLoading(id)
  }

  function getFirstSlideType(pres: PresentationItem): string | null {
    if (Array.isArray(pres.slides) && pres.slides.length > 0) {
      const first = pres.slides.find((s) => s.slide_type)
      return first?.slide_type || null
    }
    return null
  }

  function getSlideCount(pres: PresentationItem): number {
    if (Array.isArray(pres.slides)) return pres.slides.reduce((sum, s) => sum + (s.count || 0), 0)
    return (pres.slides as number) || 0
  }

  function getSlideTypes(pres: PresentationItem): string[] {
    if (Array.isArray(pres.slides)) {
      return [...new Set(pres.slides.filter((s) => s.slide_type).map((s) => s.slide_type!))]
    }
    return []
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search presentations..."
            className="pl-9 h-9 rounded-xl bg-background border-border"
          />
        </div>

        {/* Sort dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 gap-2 text-muted-foreground hover:text-foreground rounded-xl border-border">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span className="text-xs">
                {sortBy === 'updated' ? 'Last modified' : sortBy === 'created' ? 'Date created' : sortBy === 'name' ? 'Name' : sortBy === 'accessed' ? 'Last opened' : 'Most sessions'}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={() => setSortBy('updated')} className={`gap-2 text-sm ${sortBy === 'updated' ? 'text-primary' : ''}`}>
              <Calendar className="w-3.5 h-3.5" /> Last modified
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('created')} className={`gap-2 text-sm ${sortBy === 'created' ? 'text-primary' : ''}`}>
              <Calendar className="w-3.5 h-3.5" /> Date created
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('name')} className={`gap-2 text-sm ${sortBy === 'name' ? 'text-primary' : ''}`}>
              <ArrowUpDown className="w-3.5 h-3.5" /> Name
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('accessed')} className={`gap-2 text-sm ${sortBy === 'accessed' ? 'text-primary' : ''}`}>
              <Calendar className="w-3.5 h-3.5" /> Last opened
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('sessions')} className={`gap-2 text-sm ${sortBy === 'sessions' ? 'text-primary' : ''}`}>
              <Activity className="w-3.5 h-3.5" /> Most sessions
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* View toggle */}
        <div className="flex items-center rounded-xl border border-border overflow-hidden">
          <button
            onClick={() => { setView('grid'); localStorage.setItem('c360-view-mode', 'grid') }}
            className={`p-2 transition-all duration-200 ${
              view === 'grid'
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => { setView('list'); localStorage.setItem('c360-view-mode', 'list') }}
            className={`p-2 transition-all duration-200 ${
              view === 'list'
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Empty search */}
      {filtered.length === 0 && search && (
        <div className="text-center py-16 text-muted-foreground">
          <div className="w-16 h-16 rounded-2xl bg-muted/50 border border-border/50 flex items-center justify-center mx-auto mb-3">
            <Search className="w-8 h-8 opacity-20" />
          </div>
          <p className="text-sm">No presentations matching &quot;{search}&quot;</p>
          <button onClick={() => setSearch('')} className="text-primary text-xs mt-2 hover:underline">
            Clear search
          </button>
        </div>
      )}

      {/* Grid View */}
      {view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((pres, index) => {
            const slideCount = getSlideCount(pres)
            const firstType = getFirstSlideType(pres)
            const slideTypes = getSlideTypes(pres)
            const TypeIcon = firstType ? TYPE_ICON_MAP[firstType] || Presentation : Presentation
            const typeColor = firstType ? TYPE_COLOR_MAP[firstType] || 'text-muted-foreground/30' : 'text-muted-foreground/30'
            const isLoading = !!loadingStates[pres.id]
            const loadAction = loadingStates[pres.id]

            return (
              <div
                key={pres.id}
                className={`
                  group relative bg-card border border-border rounded-2xl overflow-hidden
                  transition-all duration-300 ease-out
                  hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:border-primary/20
                  dark:[box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.03)_inset]
                  ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                  ${isLoading ? 'pointer-events-none opacity-70' : ''}
                `}
                style={{ transitionDelay: mounted ? `${Math.min(index * 50, 400)}ms` : '0ms' }}
              >
                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent group-hover:via-primary/30 transition-colors duration-300 z-10" />

                {/* Card thumbnail area */}
                <Link href={`/presentations/${pres.id}/edit`} className="block">
                  <div className="h-36 bg-muted/50 flex items-center justify-center group-hover:bg-muted/30 transition-all duration-300 relative overflow-hidden">
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-[0.03]"
                      style={{
                        backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
                        backgroundSize: '20px 20px',
                      }}
                    />

                    <TypeIcon className={`w-10 h-10 opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all duration-300 ${typeColor}`} />

                    {/* Live indicator */}
                    {pres.has_active_session && (
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20 rounded-full px-2.5 py-1">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">Live</span>
                      </div>
                    )}

                    {/* Quick actions overlay */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
                      <Button
                        size="sm" variant="secondary"
                        className="h-7 w-7 p-0 rounded-lg shadow-md bg-background/90 backdrop-blur-sm hover:bg-background"
                        onClick={(e) => { e.preventDefault(); router.push(`/presentations/${pres.id}/edit`) }}
                      >
                        <Pencil className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm" variant="secondary"
                        className="h-7 w-7 p-0 rounded-lg shadow-md bg-background/90 backdrop-blur-sm hover:bg-background"
                        onClick={(e) => { e.preventDefault(); handleStart(pres.id) }}
                      >
                        <Play className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm" variant="secondary"
                        className="h-7 w-7 p-0 rounded-lg shadow-md bg-background/90 backdrop-blur-sm hover:bg-background"
                        onClick={(e) => { e.preventDefault(); handleDuplicate(pres.id) }}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>

                    {/* Slide count badge */}
                    {slideCount > 0 && (
                      <span className="absolute bottom-3 right-3 text-[11px] font-medium text-muted-foreground bg-background/80 backdrop-blur-sm rounded-md px-2 py-0.5 border border-border/50">
                        {slideCount} slide{slideCount !== 1 ? 's' : ''}
                      </span>
                    )}

                    {/* Type labels */}
                    {slideTypes.length > 0 && (
                      <div className="absolute bottom-3 left-3 flex items-center gap-1 flex-wrap">
                        {slideTypes.slice(0, 3).map((type) => {
                          const Icon = TYPE_ICON_MAP[type] || FileText
                          const color = TYPE_COLOR_MAP[type] || 'text-muted-foreground'
                          return (
                            <span
                              key={type}
                              className="flex items-center gap-1 text-[10px] font-medium bg-background/80 backdrop-blur-sm rounded-md px-1.5 py-0.5 border border-border/50"
                            >
                              <Icon className={`w-2.5 h-2.5 ${color}`} />
                              <span className="text-muted-foreground">{TYPE_LABEL_MAP[type] || type}</span>
                            </span>
                          )
                        })}
                        {slideTypes.length > 3 && (
                          <span className="text-[10px] text-muted-foreground bg-background/80 backdrop-blur-sm rounded-md px-1.5 py-0.5 border border-border/50">
                            +{slideTypes.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </Link>

                {/* Card content */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <Link href={`/presentations/${pres.id}/edit`}>
                        <h3 className="font-medium text-foreground truncate hover:text-primary transition-colors text-sm">
                          {pres.title || 'Untitled'}
                        </h3>
                      </Link>
                      {pres.description && (
                        <p className="text-muted-foreground text-xs mt-0.5 truncate">{pres.description}</p>
                      )}
                      <p className="text-muted-foreground/70 text-[11px] mt-1.5">
                        {formatDistanceToNow(new Date(pres.updated_at), { addSuffix: true })}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost" size="sm"
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => router.push(`/presentations/${pres.id}/edit`)} className="gap-2 text-sm">
                          <Pencil className="w-3.5 h-3.5" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStart(pres.id)} className="gap-2 text-sm">
                          <Play className="w-3.5 h-3.5" /> Start session
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(pres.id)} className="gap-2 text-sm">
                          <Copy className="w-3.5 h-3.5" /> Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSaveAsTemplate(pres.id, pres.title)} className="gap-2 text-sm">
                          <Bookmark className="w-3.5 h-3.5" /> Save as template
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/presentations/${pres.id}/results`)} className="gap-2 text-sm">
                          <BarChart2 className="w-3.5 h-3.5" /> Results
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(pres.id, pres.title)}
                          className="gap-2 text-sm text-destructive focus:text-destructive"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Analytics row */}
                  {((pres.session_count || 0) > 0 || (pres.participant_count || 0) > 0) && (
                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border/50">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Activity className="w-3 h-3" />
                        <span className="text-[11px]">{pres.session_count} session{pres.session_count !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Users className="w-3 h-3" />
                        <span className="text-[11px]">{pres.participant_count} participant{pres.participant_count !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Loading overlay */}
                {isLoading && (
                  <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                    <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-xl shadow-lg border border-border">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm text-muted-foreground capitalize">{loadAction}...</span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        /* List View */
        <div className="space-y-2">
          {filtered.map((pres, index) => {
            const slideCount = getSlideCount(pres)
            const firstType = getFirstSlideType(pres)
            const TypeIcon = firstType ? TYPE_ICON_MAP[firstType] || Presentation : Presentation
            const typeColor = firstType ? TYPE_COLOR_MAP[firstType] || 'text-muted-foreground' : 'text-muted-foreground'
            const isLoading = !!loadingStates[pres.id]

            return (
              <div
                key={pres.id}
                className={`
                  group relative flex items-center gap-4 bg-card border border-border rounded-2xl p-4 overflow-hidden
                  transition-all duration-300 ease-out
                  hover:shadow-md hover:shadow-black/5 hover:border-primary/20 hover:-translate-y-0.5
                  dark:[box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.03)_inset]
                  ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}
                  ${isLoading ? 'pointer-events-none opacity-70' : ''}
                `}
                style={{ transitionDelay: mounted ? `${Math.min(index * 40, 300)}ms` : '0ms' }}
              >
                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent group-hover:via-primary/30 transition-colors duration-300" />

                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0 group-hover:bg-muted/70 transition-colors">
                  <TypeIcon className={`w-5 h-5 opacity-60 group-hover:opacity-80 transition-opacity ${typeColor}`} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Link href={`/presentations/${pres.id}/edit`}>
                      <h3 className="font-medium text-foreground text-sm hover:text-primary transition-colors truncate">
                        {pres.title || 'Untitled'}
                      </h3>
                    </Link>
                    {pres.has_active_session && (
                      <span className="flex items-center gap-1 bg-emerald-500/10 text-emerald-600 rounded-full px-2 py-0.5">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                        </span>
                        <span className="text-[10px] font-semibold uppercase tracking-wider">Live</span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground text-xs mt-0.5">
                    <span>{slideCount} slide{slideCount !== 1 ? 's' : ''}</span>
                    {(pres.session_count || 0) > 0 && (
                      <>
                        <span className="text-border">|</span>
                        <span className="flex items-center gap-1">
                          <Activity className="w-3 h-3" />
                          {pres.session_count} session{pres.session_count !== 1 ? 's' : ''}
                        </span>
                      </>
                    )}
                    {(pres.participant_count || 0) > 0 && (
                      <>
                        <span className="text-border">|</span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {pres.participant_count}
                        </span>
                      </>
                    )}
                    <span className="text-border">|</span>
                    <span>{formatDistanceToNow(new Date(pres.updated_at), { addSuffix: true })}</span>
                  </div>
                </div>

                {/* List actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                  <Button
                    size="sm" variant="ghost"
                    className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => router.push(`/presentations/${pres.id}/edit`)}
                  >
                    <Pencil className="w-3 h-3" /> Edit
                  </Button>
                  <Button
                    size="sm" variant="ghost"
                    className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-primary hover:bg-primary/5"
                    onClick={() => handleStart(pres.id)}
                  >
                    <Play className="w-3 h-3" /> Present
                  </Button>
                  <Button
                    size="sm" variant="ghost"
                    className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => handleDuplicate(pres.id)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => router.push(`/presentations/${pres.id}/results`)} className="gap-2 text-sm">
                        <BarChart2 className="w-3.5 h-3.5" /> Results
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSaveAsTemplate(pres.id, pres.title)} className="gap-2 text-sm">
                        <Bookmark className="w-3.5 h-3.5" /> Save as template
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(pres.id, pres.title)}
                        className="gap-2 text-sm text-destructive focus:text-destructive"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Loading overlay */}
                {isLoading && (
                  <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center rounded-xl">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
