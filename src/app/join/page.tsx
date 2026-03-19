'use client'
import Link from 'next/link'
import { ShieldAlert, ArrowLeft } from 'lucide-react'
import { JoinCodeInput } from '@/components/join/JoinCodeInput'

export default function JoinPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-foreground">
          <div className="w-7 h-7 bg-red-600 rounded-xl flex items-center justify-center">
            <ShieldAlert className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          Command 360
        </Link>
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </Link>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-5 pb-16">
        <div className="w-full max-w-sm space-y-10 text-center hero-fade-up hero-fade-up-1">
          <div className="space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">Join a session</h1>
            <p className="text-muted-foreground">Enter the room code shown on the presenter screen</p>
          </div>
          <JoinCodeInput variant="page" />
          <p className="text-xs text-muted-foreground">
            No account needed. Your responses will be anonymous unless the presenter requests names.
          </p>
        </div>
      </main>
    </div>
  )
}
