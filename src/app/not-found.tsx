import Link from 'next/link'
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
      {/* Brand */}
      <Link href="/" className="flex items-center gap-2 font-semibold text-foreground mb-12">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <ShieldAlert className="w-4 h-4 text-primary-foreground" />
        </div>
        Command 360
      </Link>

      {/* 404 display */}
      <div className="relative mb-8">
        <p className="text-[8rem] sm:text-[10rem] font-bold text-primary/10 leading-none select-none font-mono">
          404
        </p>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <ShieldAlert className="w-8 h-8 text-primary" />
          </div>
        </div>
      </div>

      <h1 className="text-2xl font-bold tracking-tight mb-2">Page not found</h1>
      <p className="text-muted-foreground max-w-sm mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved. Check the URL or head back to base.
      </p>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Home className="w-4 h-4" />
          Go home
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium border border-border hover:bg-muted transition-colors"
        >
          Dashboard
        </Link>
      </div>
    </div>
  )
}
