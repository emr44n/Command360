'use client'

import { PublicHeader } from './PublicHeader'
import { PublicFooter } from './PublicFooter'
import { FloatingJoinDock } from '../join/FloatingJoinDock'
import { AuthSlideOverProvider } from '../auth/AuthSlideOverProvider'

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthSlideOverProvider>
      <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden">
        <PublicHeader />
        <main className="flex-1">{children}</main>
        <PublicFooter />
        <FloatingJoinDock />
      </div>
    </AuthSlideOverProvider>
  )
}
