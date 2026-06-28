'use client'

import { useState, useEffect, useCallback } from 'react'
import { X } from 'lucide-react'
import { BrandMark } from '@/components/site/BrandMark'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'
import { ForgotPasswordForm } from './ForgotPasswordForm'

type Tab = 'login' | 'register'

interface AuthSlideOverProps {
  isOpen: boolean
  onClose: () => void
  defaultTab?: Tab
  required?: boolean // when true, cannot dismiss (middleware redirect)
}

export function AuthSlideOver({ isOpen, onClose, defaultTab = 'login', required = false }: AuthSlideOverProps) {
  const [tab, setTab] = useState<Tab>(defaultTab)
  const [showForgotPassword, setShowForgotPassword] = useState(false)

  // Sync tab when defaultTab changes (e.g. opening with a specific tab)
  useEffect(() => {
    if (isOpen) {
      setTab(defaultTab)
      setShowForgotPassword(false)
    }
  }, [isOpen, defaultTab])

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Close on Escape
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && !required) onClose()
  }, [onClose, required])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleKeyDown])

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={required ? undefined : onClose}
        aria-hidden="true"
      />

      {/* Panel — rigid v5: square corners, red accent line, mono labels */}
      <div
        className={`v5 fixed inset-y-0 right-0 z-[101] w-full max-w-md bg-[#0F1216] border-l border-white/12 shadow-2xl shadow-black/50 transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label={tab === 'login' ? 'Sign in' : 'Create account'}
      >
        <div aria-hidden="true" className="absolute top-0 left-0 right-0 h-[2px] bg-[#C9241A]" />
        {/* v5 depth — same language as the main page: faint grid, a soft red
            glow in the top corner, a dark black-to-transparent silhouette from
            the foot, and grain over the top */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px)', backgroundSize: '74px 74px', maskImage: 'radial-gradient(120% 70% at 80% 0%,#000,transparent 80%)', WebkitMaskImage: 'radial-gradient(120% 70% at 80% 0%,#000,transparent 80%)' }} />
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(70% 38% at 92% 2%, rgba(201,36,26,0.16), transparent 64%)' }} />
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(100% 55% at 50% 100%, rgba(0,0,0,0.55), transparent 70%)' }} />
        <div aria-hidden="true" className="absolute inset-0 v5-grain opacity-[0.12] mix-blend-overlay pointer-events-none" />
        {/* Close button — hidden when auth is required (middleware redirect) */}
        {!required && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/35 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer z-10"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Scrollable content */}
        <div className="relative flex-1 overflow-y-auto px-8 py-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-9">
            <BrandMark size={30} />
            <span className="ff-wordmark text-[16px] text-white tracking-[0.01em]">COMMAND 360</span>
          </div>

          {/* Tabs */}
          <div className="grid grid-cols-2 border border-white/12 mb-8">
            <button
              onClick={() => setTab('login')}
              className={`ff-mono py-2.5 text-[12px] font-semibold uppercase tracking-[0.06em] transition-colors cursor-pointer border-r border-white/12 ${
                tab === 'login' ? 'bg-[#C9241A] text-white' : 'text-white/45 hover:text-white/75'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setTab('register')}
              className={`ff-mono py-2.5 text-[12px] font-semibold uppercase tracking-[0.06em] transition-colors cursor-pointer ${
                tab === 'register' ? 'bg-[#C9241A] text-white' : 'text-white/45 hover:text-white/75'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form content */}
          {showForgotPassword ? (
            <div>
              <div className="space-y-1.5 mb-6">
                <h2 className="ff-display text-[22px] font-bold tracking-[-0.01em] text-white">Reset password</h2>
                <p className="text-white/45 text-sm">Enter your email and we&apos;ll send a reset link</p>
              </div>
              <ForgotPasswordForm />
              <div className="mt-6 text-center text-sm">
                <button onClick={() => setShowForgotPassword(false)} className="ff-mono text-white/30 hover:text-white/60 transition-colors text-[11px] uppercase tracking-[0.05em] cursor-pointer">
                  &larr; Back to sign in
                </button>
              </div>
            </div>
          ) : tab === 'login' ? (
            <div>
              <div className="space-y-1.5 mb-6">
                <h2 className="ff-display text-[22px] font-bold tracking-[-0.01em] text-white">Welcome back</h2>
                <p className="text-white/45 text-sm">Enter your credentials to continue</p>
              </div>
              <LoginForm />
              <div className="mt-6 space-y-3 text-center text-sm">
                <p className="text-white/45">
                  Don&apos;t have an account?{' '}
                  <button onClick={() => setTab('register')} className="text-[#e0564d] hover:text-[#C9241A] font-medium transition-colors cursor-pointer">
                    Sign up free
                  </button>
                </p>
                <p>
                  <button onClick={() => setShowForgotPassword(true)} className="ff-mono text-white/30 hover:text-white/60 transition-colors text-[11px] uppercase tracking-[0.05em] cursor-pointer">
                    Forgot your password?
                  </button>
                </p>
              </div>
            </div>
          ) : (
            <div>
              <div className="space-y-1.5 mb-6">
                <h2 className="ff-display text-[22px] font-bold tracking-[-0.01em] text-white">Create your account</h2>
                <p className="text-white/45 text-sm">Start your free trial in seconds</p>
              </div>
              <RegisterForm />
              <div className="mt-6 text-center text-sm">
                <p className="text-white/45">
                  Already have an account?{' '}
                  <button onClick={() => setTab('login')} className="text-[#e0564d] hover:text-[#C9241A] font-medium transition-colors cursor-pointer">
                    Sign in
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
