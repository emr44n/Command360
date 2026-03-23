'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import {
  FileText, Pin, Clock, Play, Copy, Edit3, MoreHorizontal,
} from 'lucide-react'
import { toast } from 'sonner'

interface RecentItem {
  id: string
  title: string
  last_accessed_at: string
  updated_at: string
}

function getRelativeTime(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true })
}

function SlideCountIcon({ title }: { title: string }) {
  // Derive a colour from the title for visual variety
  const hash = title.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const colors = [
    'bg-blue-500/15 text-blue-600',
    'bg-purple-500/15 text-purple-600',
    'bg-amber-500/15 text-amber-600',
    'bg-emerald-500/15 text-emerald-600',
    'bg-rose-500/15 text-rose-600',
    'bg-cyan-500/15 text-cyan-600',
  ]
  const colorClass = colors[hash % colors.length]

  return (
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClass}`}>
      <FileText className="w-5 h-5" />
    </div>
  )
}

function RecentCard({ item }: { item: RecentItem }) {
  const [hovering, setHovering] = useState(false)
  const router = useRouter()

  async function handleDuplicate(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    try {
      const res = await fetch(`/api/presentations/${item.id}/duplicate`, { method: 'POST' })
      if (res.ok) {
        toast.success('Deck duplicated')
        router.refresh()
      } else {
        toast.error('Failed to duplicate')
      }
    } catch {
      toast.error('Failed to duplicate')
    }
  }

  function handlePresent(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    window.open(`/presentations/${item.id}/preview`, '_blank')
  }

  function handleEdit(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    router.push(`/presentations/${item.id}/edit`)
  }

  return (
    <Link
      href={`/presentations/${item.id}/edit`}
      className="group relative flex-shrink-0 w-[220px] rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden dark:[box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.03)_inset]"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent group-hover:via-primary/30 transition-colors duration-300" />

      {/* Mini preview area */}
      <div className="relative h-[120px] bg-muted/40 flex items-center justify-center border-b border-border/50">
        {/* Fake slide preview */}
        <div className="w-[160px] h-[90px] rounded-lg bg-white dark:bg-white/10 shadow-sm border border-border/40 flex flex-col items-center justify-center gap-1.5 px-3">
          <div className="w-full h-1.5 rounded-full bg-muted" />
          <div className="w-3/4 h-1.5 rounded-full bg-muted" />
          <div className="w-1/2 h-1.5 rounded-full bg-muted/60 mt-1" />
        </div>

        {/* Hover quick-actions overlay */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center gap-2 transition-opacity duration-200"
          style={{ opacity: hovering ? 1 : 0, pointerEvents: hovering ? 'auto' : 'none' }}
        >
          <button
            onClick={handleEdit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/95 text-gray-800 text-xs font-medium hover:bg-white transition-colors shadow-sm"
            title="Edit"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit
          </button>
          <button
            onClick={handlePresent}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-500 transition-colors shadow-sm"
            title="Present"
          >
            <Play className="w-3.5 h-3.5" />
            Present
          </button>
          <button
            onClick={handleDuplicate}
            className="flex items-center gap-1 p-1.5 rounded-lg bg-white/95 text-gray-800 hover:bg-white transition-colors shadow-sm"
            title="Duplicate"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Card info */}
      <div className="p-3">
        <div className="flex items-start gap-2.5">
          <SlideCountIcon title={item.title || 'Untitled'} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
              {item.title || 'Untitled'}
            </p>
            <div className="flex items-center gap-1 mt-1 text-[11px] text-muted-foreground">
              <Clock className="w-3 h-3 shrink-0" />
              <span className="truncate">{getRelativeTime(item.last_accessed_at || item.updated_at)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export function RecentlyOpened({ items }: { items: RecentItem[] }) {
  if (items.length === 0) return null

  return (
    <div>
      {/* Pinned section (visual placeholder) */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2.5">
          <Pin className="w-3.5 h-3.5 text-muted-foreground/60" />
          <h3 className="text-[10px] uppercase tracking-[0.15em] font-semibold text-muted-foreground/60">Pinned</h3>
        </div>
        <div className="flex items-center gap-2 px-3 py-3 rounded-xl border border-dashed border-border/60 bg-muted/10">
          <Pin className="w-4 h-4 text-muted-foreground/30" />
          <p className="text-xs text-muted-foreground/50">
            Right-click a presentation and pin it here for quick access
          </p>
        </div>
      </div>

      {/* Recent section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
          <h3 className="text-[10px] uppercase tracking-[0.15em] font-semibold text-muted-foreground">Recently Opened</h3>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
          {items.map((item) => (
            <RecentCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  )
}
