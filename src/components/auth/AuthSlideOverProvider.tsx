'use client'

import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { AuthSlideOver } from './AuthSlideOver'

type Tab = 'login' | 'register'

interface AuthSlideOverContextValue {
  openAuth: (tab?: Tab) => void
  closeAuth: (force?: boolean) => void
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
  const [required, setRequired] = useState(false) // true when opened via middleware redirect — cannot dismiss

  // Auto-open when ?auth=login or ?auth=register is in URL (e.g. middleware redirect)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const authParam = params.get('auth')
    const nextParam = params.get('next')
    if (authParam === 'login' || authParam === 'register') {
      setDefaultTab(authParam)
      setIsOpen(true)
      // If there's a ?next= param, this was a middleware redirect — auth is required
      if (nextParam) {
        setRequired(true)
      }
      // Clean the URL without triggering navigation
      const url = new URL(window.location.href)
      url.searchParams.delete('auth')
      url.searchParams.delete('next')
      window.history.replaceState({}, '', url.toString())
    }
  }, [])

  const openAuth = useCallback((tab: Tab = 'login') => {
    setDefaultTab(tab)
    setRequired(false) // user-initiated open is dismissible
    setIsOpen(true)
  }, [])

  const closeAuth = useCallback((force?: boolean) => {
    if (required && !force) return // cannot dismiss when auth is required from redirect
    setRequired(false)
    setIsOpen(false)
  }, [required])

  return (
    <AuthSlideOverContext.Provider value={{ openAuth, closeAuth }}>
      {children}
      <AuthSlideOver isOpen={isOpen} onClose={closeAuth} defaultTab={defaultTab} required={required} />
    </AuthSlideOverContext.Provider>
  )
}
