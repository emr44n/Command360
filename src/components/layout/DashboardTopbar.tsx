'use client'
import { Zap } from 'lucide-react'
import Link from 'next/link'

interface DashboardTopbarProps {
  title?: string
  actions?: React.ReactNode
}

export function DashboardTopbar({ title, actions }: DashboardTopbarProps) {
  return (
    <header className="h-14 bg-background border-b border-border flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="flex items-center gap-2 lg:hidden">
          <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
            <Zap className="w-3 h-3 text-primary-foreground" />
          </div>
        </Link>
        {title && <h1 className="text-sm font-semibold text-foreground">{title}</h1>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  )
}
