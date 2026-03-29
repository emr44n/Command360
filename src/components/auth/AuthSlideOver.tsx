'use client'

import { useState, useEffect, useCallback } from 'react'
import { X } from 'lucide-react'
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

      {/* Panel */}
      <div
        className={`fixed inset-y-0 right-0 z-[101] w-full max-w-md bg-[#0c0c10] border-l border-white/[0.06] shadow-2xl shadow-black/40 transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label={tab === 'login' ? 'Sign in' : 'Create account'}
      >
        {/* Close button — hidden when auth is required (middleware redirect) */}
        {!required && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-colors cursor-pointer z-10"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-8 py-10">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-10">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-600/20">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-white tracking-tight">Command 360</span>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06] mb-8">
            <button
              onClick={() => setTab('login')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${
                tab === 'login'
                  ? 'bg-white/[0.08] text-white shadow-sm'
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setTab('register')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${
                tab === 'register'
                  ? 'bg-white/[0.08] text-white shadow-sm'
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form content */}
          {showForgotPassword ? (
            <div>
              <div className="space-y-1 mb-6">
                <h2 className="text-xl font-semibold tracking-tight text-white">Reset password</h2>
                <p className="text-white/40 text-sm">Enter your email and we&apos;ll send a reset link</p>
              </div>
              <ForgotPasswordForm />
              <div className="mt-6 text-center text-sm">
                <button onClick={() => setShowForgotPassword(false)} className="text-white/25 hover:text-white/50 transition-colors text-xs cursor-pointer">
                  &larr; Back to sign in
                </button>
              </div>
            </div>
          ) : tab === 'login' ? (
            <div>
              <div className="space-y-1 mb-6">
                <h2 className="text-xl font-semibold tracking-tight text-white">Welcome back</h2>
                <p className="text-white/40 text-sm">Enter your credentials to continue</p>
              </div>
              <LoginForm />
              <div className="mt-6 space-y-3 text-center text-sm">
                <p className="text-white/40">
                  Don&apos;t have an account?{' '}
                  <button onClick={() => setTab('register')} className="text-red-400 hover:text-red-300 font-medium transition-colors cursor-pointer">
                    Sign up free
                  </button>
                </p>
                <p>
                  <button onClick={() => setShowForgotPassword(true)} className="text-white/25 hover:text-white/50 transition-colors text-xs cursor-pointer">
                    Forgot your password?
                  </button>
                </p>
              </div>
            </div>
          ) : (
            <div>
              <div className="space-y-1 mb-6">
                <h2 className="text-xl font-semibold tracking-tight text-white">Create your account</h2>
                <p className="text-white/40 text-sm">Start your free trial in seconds</p>
              </div>
              <RegisterForm />
              <div className="mt-6 text-center text-sm">
                <p className="text-white/40">
                  Already have an account?{' '}
                  <button onClick={() => setTab('login')} className="text-red-400 hover:text-red-300 font-medium transition-colors cursor-pointer">
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
