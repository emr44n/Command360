'use client'

import { useAuthSlideOver } from '@/components/auth/AuthSlideOverProvider'
import { ArrowRight } from 'lucide-react'

interface Props {
  variant?: 'primary' | 'link'
  tab?: 'login' | 'register'
  label?: string
  className?: string
}

export function AuthCTAButton({ variant = 'primary', tab = 'register', label, className = '' }: Props) {
  const { openAuth } = useAuthSlideOver()

  if (variant === 'link') {
    return (
      <button onClick={() => openAuth(tab)} className={`hover:text-foreground transition-colors cursor-pointer ${className}`}>
        {label || 'Sign in'}
      </button>
    )
  }

  return (
    <button
      onClick={() => openAuth(tab)}
      className={`group btn-shine inline-flex items-center gap-2 px-7 h-12 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-500 transition-all duration-200 hover:shadow-lg hover:shadow-red-500/25 cursor-pointer ${className}`}
    >
      {label || 'Start free trial'} <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
    </button>
  )
}
