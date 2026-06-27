'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  BarChart2, Clock, Users, MessageSquare, ArrowRight,
  ArrowUpDown, LayoutGrid, LayoutList, Monitor, FileText, Video,
} from 'lucide-react'

interface DeckResult {
  id: string
  title: string
  description: string | null
  updated_at: string
  session_count: number
  participant_count: number
  response_count: number
  latest_session?: string
  presentation_type?: string
}

type SortKey = 'date_newest' | 'date_oldest' | 'participants_most' | 'participants_least' | 'responses_most' | 'responses_least'
type ViewMode = 'list' | 'grid'

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'date_newest', label: 'Newest first' },
  { value: 'date_oldest', label: 'Oldest first' },
  { value: 'participants_most', label: 'Most participants' },
  { value: 'participants_least', label: 'Fewest participants' },
  { value: 'responses_most', label: 'Most responses' },
  { value: 'responses_least', label: 'Fewest responses' },
]

function getTypeInfo(title: string): { label: string; color: string; icon: React.ElementType } {
  const lower = title.toLowerCase()
  if (lower.includes('studio') || lower.includes('scene') || lower.includes('timeline')) {
    return { label: 'Command Studio', color: 'bg-[#6a5ea8]/15 text-[#6a5ea8] border-[#6a5ea8]/20', icon: Monitor }
  }
  if (lower.includes('cctv') || lower.includes('camera') || lower.includes('surveillance')) {
    return { label: 'CCTV', color: 'bg-[#c98a2a]/15 text-[#c98a2a] border-[#c98a2a]/20', icon: Video }
  }
  return { label: 'Classroom', color: 'bg-[#3E6DC4]/15 text-[#3E6DC4] border-[#3E6DC4]/20', icon: FileText }
}

export function ReportsResultsList({ decks }: { decks: DeckResult[] }) {
  const [sortKey, setSortKey] = useState<SortKey>('date_newest')
  const [viewMode, setViewMode] = useState<ViewMode>('list')

  const sorted = useMemo(() => {
    const copy = [...decks]
    switch (sortKey) {
      case 'date_newest':
        return copy.sort((a, b) => new Date(b.latest_session || b.updated_at).getTime() - new Date(a.latest_session || a.updated_at).getTime())
      case 'date_oldest':
        return copy.sort((a, b) => new Date(a.latest_session || a.updated_at).getTime() - new Date(b.latest_session || b.updated_at).getTime())
      case 'participants_most':
        return copy.sort((a, b) => b.participant_count - a.participant_count)
      case 'participants_least':
        return copy.sort((a, b) => a.participant_count - b.participant_count)
      case 'responses_most':
        return copy.sort((a, b) => b.response_count - a.response_count)
      case 'responses_least':
        return copy.sort((a, b) => a.response_count - b.response_count)
      default:
        return copy
    }
  }, [decks, sortKey])

  const maxResponses = Math.max(...decks.map(d => d.response_count), 1)

  return (
    <div>
      {/* Controls bar */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 font-medium">Results</p>
        <div className="flex items-center gap-2">
          {/* Sort */}
          <div className="relative">
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="appearance-none bg-card border border-border rounded-none pl-7 pr-8 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-border/80 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all cursor-pointer"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ArrowUpDown className="w-3 h-3 text-muted-foreground/50 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* View toggle */}
          <div className="flex items-center bg-card border border-border rounded-none overflow-hidden">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 transition-colors ${viewMode === 'list' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              title="List view"
            >
              <LayoutList className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 transition-colors ${viewMode === 'grid' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              title="Grid view"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3' : 'grid gap-3'}>
        {sorted.map((deck) => {
          const barWidth = Math.max((deck.response_count / maxResponses) * 100, 2)
          const typeInfo = getTypeInfo(deck.title)
          const TypeIcon = typeInfo.icon

          if (viewMode === 'grid') {
            return (
              <Link
                key={deck.id}
                href={`/presentations/${deck.id}/results`}
                className="relative bg-card border border-border rounded-none p-4 [box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.03)_inset] hover:-translate-y-0.5 hover:shadow-lg hover:border-primary/20 transition-all duration-300 group overflow-hidden flex flex-col"
              >
                <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-none bg-primary/10 border border-primary/[0.08] flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-primary/15 transition-all duration-200">
                    <BarChart2 className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors duration-200">
                      {deck.title}
                    </p>
                    <span className={`inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded-none text-[10px] font-medium border ${typeInfo.color}`}>
                      <TypeIcon className="w-2.5 h-2.5" />
                      {typeInfo.label}
                    </span>
                  </div>
                </div>
                {/* Bar */}
                <div className="w-full h-1.5 bg-muted/30 rounded-full overflow-hidden mb-3">
                  <div className="h-full bg-primary/30 rounded-full transition-all duration-500" style={{ width: `${barWidth}%` }} />
                </div>
                <div className="flex items-center gap-3 mt-auto">
                  <span className="text-xs text-muted-foreground/70 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {deck.session_count}
                  </span>
                  <span className="text-xs text-muted-foreground/70 flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {deck.participant_count}
                  </span>
                  <span className="text-xs text-muted-foreground/70 flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    {deck.response_count}
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground/50 mt-2">
                  {deck.latest_session
                    ? new Date(deck.latest_session).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                    : new Date(deck.updated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
                  }
                </span>
              </Link>
            )
          }

          // List view (default)
          return (
            <Link
              key={deck.id}
              href={`/presentations/${deck.id}/results`}
              className="relative bg-card border border-border rounded-none p-4 [box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.03)_inset] hover:-translate-y-0.5 hover:shadow-lg hover:border-primary/20 transition-all duration-300 group overflow-hidden"
            >
              {/* Colored top accent */}
              <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

              {/* Engagement bar background */}
              <div
                className="absolute left-0 top-0 bottom-0 bg-primary/[0.04] transition-all duration-500"
                style={{ width: `${barWidth}%` }}
              />

              <div className="relative flex items-center gap-4">
                <div className="w-10 h-10 rounded-none bg-primary/10 border border-primary/[0.08] flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-primary/15 transition-all duration-200">
                  <BarChart2 className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors duration-200">
                      {deck.title}
                    </p>
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-none text-[10px] font-medium border shrink-0 ${typeInfo.color}`}>
                      <TypeIcon className="w-2.5 h-2.5" />
                      {typeInfo.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-muted-foreground/70 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {deck.session_count} session{deck.session_count !== 1 ? 's' : ''}
                    </span>
                    <span className="text-xs text-muted-foreground/70 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {deck.participant_count}
                    </span>
                    <span className="text-xs text-muted-foreground/70 flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      {deck.response_count} response{deck.response_count !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-muted-foreground/60">
                    {deck.latest_session
                      ? new Date(deck.latest_session).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                      : new Date(deck.updated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
                    }
                  </span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
