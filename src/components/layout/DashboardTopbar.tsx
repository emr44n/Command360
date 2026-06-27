'use client'
import Link from 'next/link'

interface DashboardTopbarProps {
  title?: string
  actions?: React.ReactNode
}

export function DashboardTopbar({ title, actions }: DashboardTopbarProps) {
  return (
    <header className="h-14 bg-[#0F1216] border-b border-white/12 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="flex items-center gap-2 lg:hidden">
          <div className="w-6 h-6 bg-[#C9241A] flex items-center justify-center shrink-0">
            <span className="ff-display text-[13px] font-black leading-none text-white">C</span>
          </div>
        </Link>
        {title && <h1 className="ff-display text-base font-extrabold tracking-tight text-white">{title}</h1>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  )
}
