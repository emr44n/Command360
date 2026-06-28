'use client'
import Link from 'next/link'
import { BrandMark } from '@/components/site/BrandMark'

interface DashboardTopbarProps {
  title?: string
  actions?: React.ReactNode
}

export function DashboardTopbar({ title, actions }: DashboardTopbarProps) {
  return (
    <header className="h-14 bg-[#0F1216] border-b border-white/12 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="flex items-center gap-2 lg:hidden">
          <BrandMark size={26} />
        </Link>
        {title && <h1 className="ff-display text-base font-extrabold tracking-tight text-white">{title}</h1>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  )
}
