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
  const colors = ['#3E6DC4', '#6a5ea8', '#c98a2a', '#2E9E63', '#D94B3D', '#2592a3']
  const accent = colors[hash % colors.length]

  return (
    <div className="w-10 h-10 flex items-center justify-center" style={{ backgroundColor: `${accent}26`, color: accent }}>
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
        toast.success('Presentation duplicated')
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
      className="v5-pop group relative flex-shrink-0 w-[220px] border border-white/12 dash-light:border-black/10 bg-[#16191E] dash-light:bg-white dash-card-elev hover:border-[#C9241A]/50 transition-colors duration-200 overflow-hidden"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Mini preview area */}
      <div className="relative h-[120px] bg-[#0F1216] dash-light:bg-[#F6F5F2] flex items-center justify-center border-b border-white/12 dash-light:border-black/10">
        {/* Fake slide preview */}
        <div className="w-[160px] h-[90px] bg-white/10 border border-white/12 dash-light:border-black/10 flex flex-col items-center justify-center gap-1.5 px-3">
          <div className="w-full h-1.5 bg-white/20" />
          <div className="w-3/4 h-1.5 bg-white/20" />
          <div className="w-1/2 h-1.5 bg-white/10 mt-1" />
        </div>

        {/* Hover quick-actions overlay */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center gap-2 transition-opacity duration-200"
          style={{ opacity: hovering ? 1 : 0, pointerEvents: hovering ? 'auto' : 'none' }}
        >
          <button
            onClick={handleEdit}
            className="ff-mono uppercase tracking-[0.08em] flex items-center gap-1.5 px-3 py-1.5 bg-white text-[#16191E] text-xs font-medium hover:bg-white/90 transition-colors"
            title="Edit"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit
          </button>
          <button
            onClick={handlePresent}
            className="ff-mono uppercase tracking-[0.08em] flex items-center gap-1.5 px-3 py-1.5 bg-[#C9241A] text-white text-xs font-medium hover:bg-[#e02d22] transition-colors"
            title="Present"
          >
            <Play className="w-3.5 h-3.5" />
            Present
          </button>
          <button
            onClick={handleDuplicate}
            className="flex items-center gap-1 p-1.5 bg-white text-[#16191E] hover:bg-white/90 transition-colors"
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
            <p className="ff-display text-sm font-semibold text-white dash-light:text-[#16191E] truncate group-hover:text-[#C9241A] transition-colors">
              {item.title || 'Untitled'}
            </p>
            <div className="ff-mono flex items-center gap-1 mt-1 text-[11px] text-[#9aa0a8] dash-light:text-[#5B6169]">
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
          <Pin className="w-3.5 h-3.5 text-[#9aa0a8]/60 dash-light:text-[#5B6169]/60" />
          <h3 className="ff-mono text-[10px] uppercase tracking-[0.15em] font-semibold text-[#9aa0a8]/60 dash-light:text-[#5B6169]/60">Pinned</h3>
        </div>
        <div className="flex items-center gap-2 px-3 py-3 border border-dashed border-white/15 dash-light:border-black/10 bg-[#16191E] dash-light:bg-white">
          <Pin className="w-4 h-4 text-[#9aa0a8]/40 dash-light:text-[#5B6169]/40" />
          <p className="ff-body text-xs text-[#9aa0a8]/60 dash-light:text-[#5B6169]/60">
            Right-click a presentation and pin it here for quick access
          </p>
        </div>
      </div>

      {/* Recent section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-3.5 h-3.5 text-[#9aa0a8] dash-light:text-[#5B6169]" />
          <h3 className="ff-mono text-[10px] uppercase tracking-[0.15em] font-semibold text-[#9aa0a8] dash-light:text-[#5B6169]">Recently Opened</h3>
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
