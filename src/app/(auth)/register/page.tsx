import { RegisterForm } from '@/components/auth/RegisterForm'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Create account' }

export default function RegisterPage() {
  return (
    <div className="relative">
      {/* Animated glow behind card */}
      <div className="absolute -inset-4 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.08),transparent_70%)] blur-2xl pointer-events-none" />

      {/* Card */}
      <div className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 [box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.03)_inset]">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/20">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
        </div>

        {/* Pill label */}
        <div className="flex justify-center mb-4">
          <span className="text-[10px] uppercase tracking-[0.15em] text-white/40 bg-white/[0.04] border border-white/[0.06] rounded-full px-3 py-1 font-medium">
            Get started
          </span>
        </div>

        <div className="space-y-1 text-center mb-8">
          <h1 className="text-xl font-semibold tracking-tight text-white">Create your account</h1>
          <p className="text-white/40 text-sm">Start creating interactive presentations for free</p>
        </div>

        <RegisterForm />

        <p className="mt-8 text-center text-sm text-white/40">
          Already have an account?{' '}
          <Link href="/login" className="text-red-400 hover:text-red-300 font-medium transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
