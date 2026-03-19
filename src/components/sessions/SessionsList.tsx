'use client'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Radio, Users, MessageSquare, Clock, Search, ExternalLink, BarChart2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

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

export function SessionsList({ sessions }: Props) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

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

    return result
  }, [sessions, filter, search])

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

  return (
    <div className="space-y-4">
      {/* Filters & Search */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1 bg-muted rounded-full p-0.5">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
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
            className="pl-9 h-8 text-xs rounded-xl"
          />
        </div>
      </div>

      {/* Sessions list */}
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
      ) : (
        <div className="space-y-2">
          {filtered.map((session) => {
            const isLive = session.status === 'active' || session.status === 'waiting'

            return (
              <div
                key={session.id}
                className="group bg-card border border-border rounded-2xl p-4 hover:border-primary/20 transition-colors cursor-pointer"
                onClick={() => {
                  if (isLive) {
                    router.push(`/present/${session.id}`)
                  } else {
                    router.push(`/presentations/${session.presentation_id}/results`)
                  }
                }}
              >
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
                        <span className="shrink-0 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-semibold uppercase tracking-wider">
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
      )}
    </div>
  )
}
