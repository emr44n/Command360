'use client'
import Link from 'next/link'
import { ShieldAlert, ArrowLeft, QrCode, Users, Zap } from 'lucide-react'
import { BrandMark } from '@/components/site/BrandMark'
import { JoinCodeInput } from '@/components/join/JoinCodeInput'

export default function JoinPage() {
  return (
    <div className="v5 min-h-screen bg-[#0F1216] flex flex-col relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(201,36,26,0.12),transparent)]" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '74px 74px' }} />
        <div className="absolute inset-0 v5-grain opacity-[0.1] mix-blend-overlay" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#0F1216] to-transparent" />
      </div>

      {/* Top accent line */}
      <div aria-hidden="true" className="absolute top-0 left-0 right-0 h-[2px] bg-[#C9241A] z-10" />

      {/* Header */}
      <header className="relative z-10 p-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 font-semibold text-white">
          <BrandMark size={32} />
          <span className="ff-display font-extrabold text-sm tracking-[0.01em]">Command 360</span>
        </Link>
        <Link href="/" className="ff-mono inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.1em] text-[#7c828a] hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </Link>
      </header>

      {/* Main */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-5 pb-16">
        <div className="w-full max-w-md space-y-10 text-center">
          {/* Badge */}
          <div className="ff-mono inline-flex items-center gap-2 px-4 py-1.5 bg-white/[0.03] border border-white/12 text-[11px] uppercase tracking-[0.1em] text-[#7c828a] mx-auto">
            <span className="w-1.5 h-1.5 bg-emerald-500 animate-pulse" />
            No account needed — join instantly
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <div className="w-16 h-16 bg-[#C9241A]/10 border border-[#C9241A]/20 flex items-center justify-center mx-auto">
              <QrCode className="w-8 h-8 text-[#e0564d]" />
            </div>
            <h1 className="ff-display text-4xl font-black tracking-tight text-white">
              Join a Session
            </h1>
            <p className="text-[#9aa0a8] text-base max-w-sm mx-auto leading-relaxed">
              Enter your code to join a Command Classroom session or Command Studio scene
            </p>
          </div>

          {/* Join input */}
          <div className="bg-white/[0.03] border border-white/12 p-6">
            <JoinCodeInput variant="page" />
          </div>

          {/* Info cards */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="bg-white/[0.03] border border-white/12 p-3 text-center">
              <Zap className="w-4 h-4 text-[#c98a2a] mx-auto mb-1.5" />
              <p className="ff-mono text-[10px] text-[#7c828a] uppercase tracking-[0.1em]">Instant</p>
              <p className="text-[11px] text-[#9aa0a8] mt-0.5">No app needed</p>
            </div>
            <div className="bg-white/[0.03] border border-white/12 p-3 text-center">
              <ShieldAlert className="w-4 h-4 text-[#e0564d] mx-auto mb-1.5" />
              <p className="ff-mono text-[10px] text-[#7c828a] uppercase tracking-[0.1em]">Anonymous</p>
              <p className="text-[11px] text-[#9aa0a8] mt-0.5">Responses private</p>
            </div>
            <div className="bg-white/[0.03] border border-white/12 p-3 text-center">
              <Users className="w-4 h-4 text-[#3E6DC4] mx-auto mb-1.5" />
              <p className="ff-mono text-[10px] text-[#7c828a] uppercase tracking-[0.1em]">Any device</p>
              <p className="text-[11px] text-[#9aa0a8] mt-0.5">Phone or laptop</p>
            </div>
          </div>

          <p className="ff-mono text-[11px] uppercase tracking-[0.1em] text-white/20">
            command360.co.uk/join
          </p>
        </div>
      </main>
    </div>
  )
}
