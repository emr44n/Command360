'use client'

import { createContext, useContext, useState, useCallback, useEffect } from 'react'
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

  // Auto-open when ?auth=login or ?auth=register is in URL (e.g. middleware redirect)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const authParam = params.get('auth')
    if (authParam === 'login' || authParam === 'register') {
      setDefaultTab(authParam)
      setIsOpen(true)
      // Clean the URL without triggering navigation
      const url = new URL(window.location.href)
      url.searchParams.delete('auth')
      url.searchParams.delete('next')
      window.history.replaceState({}, '', url.toString())
    }
  }, [])

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
