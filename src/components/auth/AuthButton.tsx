'use client'
import { useAuthSlideOver } from '@/components/auth/AuthSlideOverProvider'

interface AuthButtonProps {
  mode?: 'register' | 'login'
  className?: string
  children: React.ReactNode
}

export function AuthButton({ mode = 'register', className, children }: AuthButtonProps) {
  const { openAuth } = useAuthSlideOver()
  return (
    <button onClick={() => openAuth(mode)} className={className}>
      {children}
    </button>
  )
}
