'use client'

import { useState, useEffect, useCallback } from 'react'
import { JoinCodeInput } from './JoinCodeInput'
import { ShieldAlert, X } from 'lucide-react'

export function FloatingJoinDock() {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [atFooter, setAtFooter] = useState(false)

  useEffect(() => {
    // Watch the hero join section — dock appears when it scrolls out of view
    const heroJoin = document.getElementById('hero-join')
    const footer = document.querySelector('footer')

    const observers: IntersectionObserver[] = []

    // Hero join sentinel: show dock when hero join is NOT visible
    if (heroJoin) {
      const heroObs = new IntersectionObserver(
        ([entry]) => {
          setVisible(!entry.isIntersecting)
        },
        { threshold: 0 }
      )
      heroObs.observe(heroJoin)
      observers.push(heroObs)
    } else {
      // If no hero join section (e.g. solution pages), show dock after scrolling 400px
      const handleScroll = () => {
        setVisible(window.scrollY > 400)
      }
      window.addEventListener('scroll', handleScroll, { passive: true })
      return () => window.removeEventListener('scroll', handleScroll)
    }

    // Footer sentinel: dock sits naturally when footer is visible
    if (footer) {
      const footerObs = new IntersectionObserver(
        ([entry]) => {
          setAtFooter(entry.isIntersecting)
        },
        { threshold: 0 }
      )
      footerObs.observe(footer)
      observers.push(footerObs)
    }

    return () => {
      observers.forEach((o) => o.disconnect())
    }
  }, [])

  const handleDismiss = useCallback(() => {
    setDismissed(true)
  }, [])

  const shouldShow = visible && !dismissed && !atFooter

  return (
    <div
      className={`fixed bottom-4 left-0 right-0 z-40 transition-all duration-300 ease-out ${
        shouldShow
          ? 'translate-y-0 opacity-100'
          : 'translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      <div className="mx-auto w-full max-w-xl px-3 sm:px-4">
        {/* Animated red glow behind the dock */}
        <div className="relative">
          <div className="absolute -inset-2 rounded-3xl bg-primary/20 blur-xl dock-glow-pulse" />

          <div className="relative flex items-center justify-center gap-3 rounded-2xl border border-primary/30 bg-card/95 backdrop-blur-xl px-3 sm:px-5 py-2.5 sm:py-3 shadow-xl shadow-primary/10">
            {/* Brand mark */}
            <div className="hidden sm:flex items-center gap-2 pr-3 border-r border-border">
              <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
                <ShieldAlert className="w-3 h-3 text-primary-foreground" />
              </div>
              <span className="text-xs font-semibold text-foreground whitespace-nowrap">
                Join session
              </span>
            </div>

            {/* Join input */}
            <JoinCodeInput variant="compact" />

            {/* Dismiss */}
            <button
              onClick={handleDismiss}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Dismiss join dock"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
