'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, LogIn, Moon, Sun } from 'lucide-react'
import { JoinCodeInput } from '@/components/join/JoinCodeInput'

const NAV_LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#services', label: 'Services' },
  { href: '#pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function HomepageClient() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [joinOpen, setJoinOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light')
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.classList.toggle('dark', next === 'dark')
    localStorage.setItem('theme', next)
  }

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      const el = document.getElementById(href.slice(1))
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      setMobileOpen(false)
    }
  }

  // On the dark hero (not scrolled): white text
  // After scrolling: normal theme-aware text
  const onHero = !scrolled

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'backdrop-blur-xl bg-background/80 border-b border-border shadow-sm'
        : 'bg-transparent'
    }`}>
      <nav className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className={`flex items-center gap-2.5 font-semibold transition-colors ${onHero ? 'text-white' : 'text-foreground'}`}>
          <div className="w-7 h-7 bg-red-600 rounded-lg flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <span className="text-sm tracking-tight">Command 360</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1 text-[13px]">
          {NAV_LINKS.map((item) => item.href.startsWith('#') ? (
            <a key={item.href} href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                onHero
                  ? 'text-white/60 hover:text-white'
                  : 'text-muted-foreground hover:text-foreground'
              }`}>
              {item.label}
            </a>
          ) : (
            <Link key={item.href} href={item.href}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                onHero
                  ? 'text-white/60 hover:text-white'
                  : 'text-muted-foreground hover:text-foreground'
              }`}>
              {item.label}
            </Link>
          ))}
        </div>

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-1.5">
          <button onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              onHero
                ? 'text-white/50 hover:text-white hover:bg-white/[0.06]'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
            aria-label="Toggle theme">
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <div className="relative">
            <button onClick={() => setJoinOpen(!joinOpen)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] rounded-md transition-colors cursor-pointer ${
                onHero
                  ? 'text-white/60 hover:text-white hover:bg-white/[0.06]'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}>
              <LogIn className="w-3.5 h-3.5" />
              Join
            </button>
            {joinOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setJoinOpen(false)} />
                <div className="absolute right-0 top-full mt-2 z-50 bg-card border border-border rounded-xl shadow-lg p-4 slide-down min-w-[260px]">
                  <p className="text-xs text-muted-foreground mb-2">Enter room code to join</p>
                  <JoinCodeInput variant="compact" />
                </div>
              </>
            )}
          </div>

          <Link href="/login"
            className={`px-3 py-1.5 text-[13px] transition-colors ${
              onHero
                ? 'text-white/60 hover:text-white'
                : 'text-muted-foreground hover:text-foreground'
            }`}>
            Sign in
          </Link>
          <Link href="/register" className="px-4 py-1.5 text-[13px] font-semibold bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors cursor-pointer">
            Start free trial
          </Link>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-1">
          <button onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              onHero
                ? 'text-white/50 hover:text-white'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            aria-label="Toggle theme">
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            className={`p-2 cursor-pointer ${onHero ? 'text-white/70' : 'text-foreground'}`}
            onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl p-4 space-y-1 slide-down">
          {NAV_LINKS.map((item) => item.href.startsWith('#') ? (
            <a key={item.href} href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="block px-3 py-2.5 rounded-lg text-base text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer">
              {item.label}
            </a>
          ) : (
            <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer">
              {item.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-border mt-3">
            <p className="text-xs text-muted-foreground mb-2 px-3">Join a session</p>
            <div className="px-3 mb-3"><JoinCodeInput variant="compact" /></div>
            <Link href="/login" onClick={() => setMobileOpen(false)} className="block text-center px-4 py-2.5 text-base text-muted-foreground hover:text-foreground transition-colors">Sign in</Link>
            <Link href="/register" onClick={() => setMobileOpen(false)} className="block text-center px-4 py-2.5 text-base font-semibold bg-red-600 text-white rounded-lg mt-2">Start free trial</Link>
          </div>
        </div>
      )}
    </header>
  )
}
