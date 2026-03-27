'use client'

import { PublicHeader } from './PublicHeader'
import { PublicFooter } from './PublicFooter'
import { FloatingJoinDock } from '../join/FloatingJoinDock'
export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />
      <FloatingJoinDock />
    </div>
  )
}
