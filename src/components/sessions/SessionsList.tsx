'use client'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  Radio, Users, MessageSquare, Clock, Search, ExternalLink, BarChart2,
  LayoutGrid, List, ArrowUpDown, Calendar,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatDistanceToNow } from 'date-fns'

interface Session {
  id: string
  presentation_id: string
  presentation_title: string
  room_code: string
  status: string
  started_at: string
  ended_at: string | null
  current_slide_index: number
  participant_count: number
  response_count: number
}

interface Props {
  sessions: Session[]
}

type Filter = 'all' | 'active' | 'ended'
type SortKey = 'recent' | 'participants' | 'name' | 'responses'

export function SessionsList({ sessions }: Props) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [view, setView] = useState<'grid' | 'list'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('c360-view-mode') as 'grid' | 'list') || 'list'
    }
    return 'list'
  })
  const [sortBy, setSortBy] = useState<SortKey>('recent')

  const filtered = useMemo(() => {
    let result = sessions

    if (filter === 'active') {
      result = result.filter((s) => s.status === 'active' || s.status === 'waiting')
    } else if (filter === 'ended') {
      result = result.filter((s) => s.status === 'ended')
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (s) =>
          s.presentation_title.toLowerCase().includes(q) ||
          s.room_code.toLowerCase().includes(q)
      )
    }

    // Sort
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'participants': return b.participant_count - a.participant_count
        case 'name': return a.presentation_title.localeCompare(b.presentation_title)
        case 'responses': return b.response_count - a.response_count
        default: return new Date(b.started_at).getTime() - new Date(a.started_at).getTime()
      }
    })

    return result
  }, [sessions, filter, search, sortBy])

  const activeSessions = sessions.filter((s) => s.status === 'active' || s.status === 'waiting')
  const endedSessions = sessions.filter((s) => s.status === 'ended')

  function formatDate(dateStr: string) {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  function formatTime(dateStr: string) {
    const d = new Date(dateStr)
    return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  }

  function getDuration(start: string, end: string | null) {
    if (!end) return 'In progress'
    const diff = new Date(end).getTime() - new Date(start).getTime()
    const mins = Math.round(diff / 60000)
    if (mins < 60) return `${mins}m`
    const hrs = Math.floor(mins / 60)
    return `${hrs}h ${mins % 60}m`
  }

  const FILTERS: { label: string; value: Filter; count: number }[] = [
    { label: 'All', value: 'all', count: sessions.length },
    { label: 'Live', value: 'active', count: activeSessions.length },
    { label: 'Ended', value: 'ended', count: endedSessions.length },
  ]

  const SORT_OPTIONS: { label: string; value: SortKey }[] = [
    { label: 'Most recent', value: 'recent' },
    { label: 'Most participants', value: 'participants' },
    { label: 'Most responses', value: 'responses' },
    { label: 'Alphabetical', value: 'name' },
  ]

  return (
    <div className="space-y-4">
      {/* Filters, Search, Sort & View toggle */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1 bg-muted rounded-none p-0.5">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1.5 rounded-none text-xs font-medium transition-colors ${
                filter === f.value
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {f.label}
              {f.count > 0 && (
                <span className="ml-1.5 text-[10px] opacity-70">{f.count}</span>
              )}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sessions..."
            className="pl-9 h-8 text-xs rounded-none"
          />
        </div>

        {/* Sort dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-2 text-muted-foreground hover:text-foreground rounded-none border-border">
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
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => { setView('list'); localStorage.setItem('c360-view-mode', 'list') }}
            className={`p-2 transition-all duration-200 ${
              view === 'list' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Radio className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            {sessions.length === 0 ? 'No sessions yet' : 'No sessions match your filters'}
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            {sessions.length === 0 ? 'Start a presentation to create your first session' : 'Try a different search or filter'}
          </p>
        </div>
      ) : view === 'list' ? (
        /* List View */
        <div className="space-y-2">
          {filtered.map((session) => {
            const isLive = session.status === 'active' || session.status === 'waiting'

            return (
              <div
                key={session.id}
                className="group bg-card border border-border rounded-none p-4 hover:border-primary/20 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-pointer dark:[box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.03)_inset] overflow-hidden relative"
                onClick={() => {
                  if (isLive) {
                    router.push(`/present/${session.id}`)
                  } else {
                    router.push(`/presentations/${session.presentation_id}/results`)
                  }
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent group-hover:via-primary/30 transition-colors duration-300" />
                <div className="flex items-center gap-4">
                  {/* Status indicator */}
                  <div className={`w-2 h-2 rounded-full shrink-0 ${isLive ? 'bg-emerald-500' : 'bg-muted-foreground/30'}`}>
                    {isLive && (
                      <span className="block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    )}
                  </div>

                  {/* Main info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground truncate">
                        {session.presentation_title}
                      </p>
                      {isLive && (
                        <span className="shrink-0 px-2 py-0.5 rounded-none bg-emerald-500/10 text-emerald-600 text-[10px] font-semibold uppercase tracking-wider">
                          Live
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="font-mono">{session.room_code}</span>
                      <span>{formatDate(session.started_at)} at {formatTime(session.started_at)}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {getDuration(session.started_at, session.ended_at)}
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="w-3.5 h-3.5" />
                      <span className="font-medium">{session.participant_count}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span className="font-medium">{session.response_count}</span>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    {isLive ? (
                      <Button variant="ghost" size="sm" className="gap-1 text-xs h-7 px-2">
                        <ExternalLink className="w-3 h-3" />
                        Rejoin
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm" className="gap-1 text-xs h-7 px-2">
                        <BarChart2 className="w-3 h-3" />
                        Results
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((session) => {
            const isLive = session.status === 'active' || session.status === 'waiting'

            return (
              <div
                key={session.id}
                className="group relative bg-card border border-border rounded-none p-5 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden dark:[box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.03)_inset]"
                onClick={() => {
                  if (isLive) {
                    router.push(`/present/${session.id}`)
                  } else {
                    router.push(`/presentations/${session.presentation_id}/results`)
                  }
                }}
              >
                {/* Top accent */}
                <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${isLive ? 'via-emerald-500/40' : 'via-border'} to-transparent group-hover:via-primary/30 transition-colors`} />

                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className={`w-9 h-9 rounded-none flex items-center justify-center shrink-0 ${isLive ? 'bg-emerald-500/10' : 'bg-muted'}`}>
                    <Radio className={`w-4 h-4 ${isLive ? 'text-emerald-500' : 'text-muted-foreground'}`} />
                  </div>
                  {isLive && (
                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-none bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                      </span>
                      <span className="text-[10px] font-semibold uppercase tracking-wider">Live</span>
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                  {session.presentation_title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 font-mono">{session.room_code}</p>

                <div className="flex items-center gap-3 mt-3 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDistanceToNow(new Date(session.started_at), { addSuffix: true })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {session.participant_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    {session.response_count}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-border/50 text-[10px] text-muted-foreground">
                  <span>{formatDate(session.started_at)} at {formatTime(session.started_at)}</span>
                  <span className="text-border">|</span>
                  <span>{getDuration(session.started_at, session.ended_at)}</span>
                </div>

                {/* Hover action hint */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  {isLive ? (
                    <ExternalLink className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <BarChart2 className="w-4 h-4 text-primary" />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
