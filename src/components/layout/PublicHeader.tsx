'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Moon, Sun, LogIn } from 'lucide-react'
import { useState, useEffect } from 'react'
import { JoinCodeInput } from '@/components/join/JoinCodeInput'

const NAV = [
  { href: '/#services', label: 'Services' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/templates', label: 'Templates' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function PublicHeader() {
  const pathname = usePathname()
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

  // On the dark hero (not scrolled): white text
  const onHero = !scrolled

  return (
    <header className={`fixed top-0 left-0 right-0 z-[70] transition-all duration-300 ${
      scrolled
        ? 'backdrop-blur-xl bg-background/80 border-b border-border shadow-sm'
        : 'bg-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
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
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-md text-[13px] transition-colors ${
                  onHero
                    ? active ? 'text-white font-medium' : 'text-white/60 hover:text-white'
                    : active ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Right */}
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

          {/* Join dropdown */}
          <div className="relative">
            <button onClick={() => setJoinOpen(!joinOpen)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[13px] rounded-lg transition-colors cursor-pointer ${
                onHero
                  ? 'text-white/70 hover:text-white border border-white/[0.1] hover:border-white/[0.2] hover:bg-white/[0.06]'
                  : 'text-muted-foreground hover:text-foreground border border-border hover:bg-muted'
              }`}>
              <LogIn className="w-3.5 h-3.5" />
              Join
            </button>
            {joinOpen && (
              <>
                <div className="fixed inset-0 z-[80]" onClick={() => setJoinOpen(false)} />
                <div className="absolute right-0 top-full mt-2.5 z-[90] bg-card/95 backdrop-blur-xl border border-border/60 rounded-xl shadow-2xl shadow-black/20 dark:shadow-black/40 p-4 slide-down min-w-[260px]">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-medium mb-2.5">Enter room code</p>
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
              onHero ? 'text-white/50 hover:text-white' : 'text-muted-foreground hover:text-foreground'
            }`}
            aria-label="Toggle theme">
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button className={`p-2 cursor-pointer ${onHero ? 'text-white/70' : 'text-foreground'}`} onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl p-4 space-y-1 slide-down">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              {item.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-border mt-3 space-y-2">
            <p className="text-xs text-muted-foreground px-3">Join a session</p>
            <div className="px-3"><JoinCodeInput variant="compact" /></div>
            <Link href="/login" onClick={() => setMobileOpen(false)} className="block text-center px-4 py-2.5 text-base text-muted-foreground hover:text-foreground transition-colors">Sign in</Link>
            <Link href="/register" onClick={() => setMobileOpen(false)} className="block text-center px-4 py-2.5 text-base font-semibold bg-red-600 text-white rounded-lg">Start free trial</Link>
          </div>
        </div>
      )}
    </header>
  )
}
