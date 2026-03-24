'use client'

import { createContext, useContext, useState, useCallback } from 'react'
import { AuthSlideOver } from './AuthSlideOver'

type Tab = 'login' | 'register'

interface AuthSlideOverContextValue {
  openAuth: (tab?: Tab) => void
  closeAuth: () => void
}

const AuthSlideOverContext = createContext<AuthSlideOverContextValue | null>(null)

export function useAuthSlideOver() {
  const ctx = useContext(AuthSlideOverContext)
  if (!ctx) throw new Error('useAuthSlideOver must be used within AuthSlideOverProvider')
  return ctx
}

export function AuthSlideOverProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [defaultTab, setDefaultTab] = useState<Tab>('login')

  const openAuth = useCallback((tab: Tab = 'login') => {
    setDefaultTab(tab)
    setIsOpen(true)
  }, [])

  const closeAuth = useCallback(() => {
    setIsOpen(false)
  }, [])

  return (
    <AuthSlideOverContext.Provider value={{ openAuth, closeAuth }}>
      {children}
      <AuthSlideOver isOpen={isOpen} onClose={closeAuth} defaultTab={defaultTab} />
    </AuthSlideOverContext.Provider>
  )
}
