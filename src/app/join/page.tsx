'use client'
import Link from 'next/link'
import { ShieldAlert, ArrowLeft, QrCode, Users, Zap } from 'lucide-react'
import { JoinCodeInput } from '@/components/join/JoinCodeInput'

export default function JoinPage() {
  return (
    <div className="min-h-screen bg-[#07070a] flex flex-col relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(220,38,38,0.12),transparent)]" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#07070a] to-transparent" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 font-semibold text-white">
          <div className="w-8 h-8 bg-red-600 rounded-xl flex items-center justify-center">
            <ShieldAlert className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm">Command 360</span>
        </Link>
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </Link>
      </header>

      {/* Main */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-5 pb-16">
        <div className="w-full max-w-md space-y-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-[11px] text-white/50 mx-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            No account needed — join instantly
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
              <QrCode className="w-8 h-8 text-red-400" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white">
              Join a Session
            </h1>
            <p className="text-white/40 text-base max-w-sm mx-auto leading-relaxed">
              Enter your code to join a Command Classroom session or Command Studio scene
            </p>
          </div>

          {/* Join input */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 backdrop-blur-sm">
            <JoinCodeInput variant="page" />
          </div>

          {/* Info cards */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3 text-center">
              <Zap className="w-4 h-4 text-amber-400 mx-auto mb-1.5" />
              <p className="text-[10px] text-white/30 uppercase tracking-wider">Instant</p>
              <p className="text-[11px] text-white/50 mt-0.5">No app needed</p>
            </div>
            <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3 text-center">
              <ShieldAlert className="w-4 h-4 text-red-400 mx-auto mb-1.5" />
              <p className="text-[10px] text-white/30 uppercase tracking-wider">Anonymous</p>
              <p className="text-[11px] text-white/50 mt-0.5">Responses private</p>
            </div>
            <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3 text-center">
              <Users className="w-4 h-4 text-blue-400 mx-auto mb-1.5" />
              <p className="text-[10px] text-white/30 uppercase tracking-wider">Any device</p>
              <p className="text-[11px] text-white/50 mt-0.5">Phone or laptop</p>
            </div>
          </div>

          <p className="text-[11px] text-white/20">
            command360.co.uk/join
          </p>
        </div>
      </main>
    </div>
  )
}
