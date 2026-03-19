'use client'

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Clock, ArrowRight, Presentation } from 'lucide-react'

interface RecentItem {
  id: string
  title: string
  last_accessed_at: string
  updated_at: string
}

export function RecentlyOpened({ items }: { items: RecentItem[] }) {
  if (items.length === 0) return null

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">Recently Opened</h3>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/presentations/${item.id}/edit`}
            className="group flex-shrink-0 w-48 p-3 rounded-xl border border-border bg-card hover:border-primary/20 hover:shadow-md transition-all duration-200"
          >
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center mb-2 group-hover:bg-primary/10 transition-colors">
              <Presentation className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
              {item.title || 'Untitled'}
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">
              Opened {formatDistanceToNow(new Date(item.last_accessed_at || item.updated_at), { addSuffix: true })}
            </p>
            <div className="flex items-center gap-1 text-[11px] text-primary mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              Continue editing <ArrowRight className="w-3 h-3" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
