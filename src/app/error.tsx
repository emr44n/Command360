'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import { ShieldAlert, RefreshCw, Home } from 'lucide-react'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
      {/* Brand */}
      <Link href="/" className="flex items-center gap-2 font-semibold text-foreground mb-12">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <ShieldAlert className="w-4 h-4 text-primary-foreground" />
        </div>
        Command 360
      </Link>

      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
        <ShieldAlert className="w-8 h-8 text-red-500" />
      </div>

      <h1 className="text-2xl font-bold tracking-tight mb-2">Something went wrong</h1>
      <p className="text-muted-foreground max-w-sm mb-8">
        An unexpected error occurred. Try refreshing the page or head back to the dashboard.
      </p>

      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try again
        </button>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium border border-border hover:bg-muted transition-colors"
        >
          <Home className="w-4 h-4" />
          Dashboard
        </Link>
      </div>
    </div>
  )
}
