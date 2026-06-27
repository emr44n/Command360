'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Monitor, Clock, ArrowRight, Search, LayoutGrid, List, ArrowUpDown, Calendar,
  MoreHorizontal, Pencil, Trash2, Copy,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'

interface StudioPresentation {
  id: string
  title: string
  description: string
  updated_at: string
  created_at: string
  totalSlides: number
  studioSlideCount: number
}

type SortKey = 'updated' | 'created' | 'name' | 'slides'

export function StudioListClient({ presentations }: { presentations: StudioPresentation[] }) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'grid' | 'list'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('c360-view-mode') as 'grid' | 'list') || 'grid'
    }
    return 'grid'
  })
  const [sortBy, setSortBy] = useState<SortKey>('updated')
  const [loadingStates, setLoadingStates] = useState<Record<string, string>>({})

  const filtered = useMemo(() => {
    let result = presentations
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      )
    }
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.title.localeCompare(b.title)
        case 'created': return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'slides': return b.studioSlideCount - a.studioSlideCount
        default: return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      }
    })
    return result
  }, [presentations, search, sortBy])

  function setLoading(id: string, action: string) {
    setLoadingStates((prev) => ({ ...prev, [id]: action }))
  }
  function clearLoading(id: string) {
    setLoadingStates((prev) => { const next = { ...prev }; delete next[id]; return next })
  }

  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; title: string } | null>(null)

  function handleDelete(id: string, title: string) {
    setDeleteConfirm({ id, title })
  }

  async function confirmDelete() {
    if (!deleteConfirm) return
    const { id } = deleteConfirm
    setDeleteConfirm(null)
    setLoading(id, 'deleting')
    const res = await fetch(`/api/presentations/${id}`, { method: 'DELETE' })
    if (res.ok) { toast.success('Scene deleted'); router.refresh() } else { toast.error('Failed to delete') }
    clearLoading(id)
  }

  async function handleDuplicate(id: string) {
    setLoading(id, 'duplicating')
    const res = await fetch(`/api/presentations/${id}/duplicate`, { method: 'POST' })
    if (res.ok) { toast.success('Duplicated'); router.refresh() } else { toast.error('Failed to duplicate') }
    clearLoading(id)
  }

  if (presentations.length === 0) {
    return (
      <div className="relative border border-dashed border-border rounded-none p-12 text-center">
        <div className="mx-auto w-16 h-16 rounded-none bg-[#6a5ea8]/10 flex items-center justify-center mb-4">
          <Monitor className="w-8 h-8 text-[#6a5ea8]/60" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">
          No scenes yet
        </h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
          Create your first Command Studio scene to start building interactive visual experiences with layers, animations, and live audience interaction.
        </p>
      </div>
    )
  }

  const SORT_OPTIONS: { label: string; value: SortKey }[] = [
    { label: 'Recently edited', value: 'updated' },
    { label: 'Date created', value: 'created' },
    { label: 'Alphabetical', value: 'name' },
    { label: 'Most slides', value: 'slides' },
  ]

  return (<>
    <div>
      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search scenes..."
            className="pl-9 h-9 rounded-none bg-background border-border"
          />
        </div>

        {/* Sort dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 gap-2 text-muted-foreground hover:text-foreground rounded-none border-border">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span className="text-xs">
                {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            {SORT_OPTIONS.map((opt) => (
              <DropdownMenuItem
                key={opt.value}
                onClick={() => setSortBy(opt.value)}
                className={`gap-2 text-sm ${sortBy === opt.value ? 'text-primary' : ''}`}
              >
                <Calendar className="w-3.5 h-3.5" /> {opt.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* View toggle */}
        <div className="flex items-center rounded-none border border-border overflow-hidden">
          <button
            onClick={() => { setView('grid'); localStorage.setItem('c360-view-mode', 'grid') }}
            className={`p-2 transition-all duration-200 ${
              view === 'grid' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => { setView('list'); localStorage.setItem('c360-view-mode', 'list') }}
            className={`p-2 transition-all duration-200 ${
              view === 'list' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Empty search */}
      {filtered.length === 0 && search && (
        <div className="text-center py-16 text-muted-foreground">
          <div className="w-16 h-16 rounded-none bg-muted/50 border border-border/50 flex items-center justify-center mx-auto mb-3">
            <Search className="w-8 h-8 opacity-20" />
          </div>
          <p className="text-sm">No scenes matching &quot;{search}&quot;</p>
          <button onClick={() => setSearch('')} className="text-primary text-xs mt-2 hover:underline">
            Clear search
          </button>
        </div>
      )}

      {/* Grid View */}
      {view === 'grid' ? (
        <div>
          <h2 className="text-[10px] uppercase tracking-[0.15em] font-semibold text-muted-foreground mb-3">
            Scenes ({filtered.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((p) => {
              const isLoading = !!loadingStates[p.id]
              return (
                <div
                  key={p.id}
                  className={`group relative bg-card border border-border rounded-none p-5 hover:border-[#6a5ea8]/30 hover:shadow-lg hover:shadow-[#6a5ea8]/5 hover:-translate-y-0.5 transition-all duration-200 overflow-hidden dark:[box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.03)_inset] ${isLoading ? 'pointer-events-none opacity-70' : ''}`}
                >
                  {/* Top accent */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#6a5ea8]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-9 h-9 rounded-none bg-[#6a5ea8]/10 flex items-center justify-center shrink-0 group-hover:bg-[#6a5ea8]/20 transition-colors">
                      <Monitor className="w-4 h-4 text-[#6a5ea8]" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] rounded-none bg-[#6a5ea8]/10 text-[#6a5ea8] px-2 py-0.5 font-medium">
                        {p.studioSlideCount} studio slide{p.studioSlideCount !== 1 ? 's' : ''}
                      </span>
                      {/* Quick actions */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost" size="sm"
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem onClick={() => router.push(`/presentations/${p.id}/edit`)} className="gap-2 text-sm">
                            <Pencil className="w-3.5 h-3.5" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicate(p.id)} className="gap-2 text-sm">
                            <Copy className="w-3.5 h-3.5" /> Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDelete(p.id, p.title)} className="gap-2 text-sm text-destructive focus:text-destructive">
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <Link href={`/presentations/${p.id}/edit`}>
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
                      <span>{formatDistanceToNow(new Date(p.updated_at), { addSuffix: true })}</span>
                    </div>

                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-4 h-4 text-primary" />
                    </div>
                  </Link>

                  {/* Loading overlay */}
                  {isLoading && (
                    <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center rounded-none">
                      <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-none shadow-lg border border-border">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm text-muted-foreground capitalize">{loadingStates[p.id]}...</span>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        /* List View */
        <div>
          <h2 className="text-[10px] uppercase tracking-[0.15em] font-semibold text-muted-foreground mb-3">
            Scenes ({filtered.length})
          </h2>
          <div className="space-y-2">
            {filtered.map((p) => {
              const isLoading = !!loadingStates[p.id]
              return (
                <div
                  key={p.id}
                  className={`group relative flex items-center gap-4 bg-card border border-border rounded-none p-4 overflow-hidden transition-all duration-200 hover:shadow-md hover:shadow-black/5 hover:border-[#6a5ea8]/20 hover:-translate-y-0.5 dark:[box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.03)_inset] ${isLoading ? 'pointer-events-none opacity-70' : ''}`}
                >
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent group-hover:via-[#6a5ea8]/30 transition-colors duration-300" />

                  <div className="w-10 h-10 rounded-none bg-[#6a5ea8]/10 flex items-center justify-center shrink-0 group-hover:bg-[#6a5ea8]/20 transition-colors">
                    <Monitor className="w-5 h-5 text-[#6a5ea8]" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Link href={`/presentations/${p.id}/edit`}>
                        <h3 className="font-medium text-foreground text-sm hover:text-primary transition-colors truncate">
                          {p.title}
                        </h3>
                      </Link>
                      <span className="text-[10px] rounded-none bg-[#6a5ea8]/10 text-[#6a5ea8] px-2 py-0.5 font-medium shrink-0">
                        {p.studioSlideCount} studio
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground text-xs mt-0.5">
                      <span>{p.totalSlides} slide{p.totalSlides !== 1 ? 's' : ''} total</span>
                      <span className="text-border">|</span>
                      <span>{formatDistanceToNow(new Date(p.updated_at), { addSuffix: true })}</span>
                    </div>
                  </div>

                  {/* List actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <Button
                      size="sm" variant="ghost"
                      className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => router.push(`/presentations/${p.id}/edit`)}
                    >
                      <Pencil className="w-3 h-3" /> Edit
                    </Button>
                    <Button
                      size="sm" variant="ghost"
                      className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => handleDuplicate(p.id)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem onClick={() => handleDuplicate(p.id)} className="gap-2 text-sm">
                          <Copy className="w-3.5 h-3.5" /> Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDelete(p.id, p.title)} className="gap-2 text-sm text-destructive focus:text-destructive">
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Loading overlay */}
                  {isLoading && (
                    <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center rounded-none">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
    {deleteConfirm && (
      <div className="fixed inset-0 z-[300] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
        <div className="bg-card border border-border rounded-none p-5 max-w-xs w-full shadow-2xl" onClick={e => e.stopPropagation()}>
          <h3 className="text-sm font-semibold text-white mb-2">Delete &ldquo;{deleteConfirm.title}&rdquo;?</h3>
          <p className="text-[11px] text-muted-foreground mb-4">This action cannot be undone.</p>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setDeleteConfirm(null)} className="px-3 py-1.5 text-[11px] font-medium rounded-none bg-muted text-muted-foreground hover:bg-muted/80 transition-colors">Cancel</button>
            <button onClick={confirmDelete} className="px-3 py-1.5 text-[11px] font-medium rounded-none bg-[#C9241A] text-white hover:bg-[#C9241A]/90 transition-colors">Delete</button>
          </div>
        </div>
      </div>
    )}
  </>)
}
