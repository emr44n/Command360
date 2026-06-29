'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { JoinCodeInput } from '@/components/join/JoinCodeInput'
import { useAuthSlideOver } from '@/components/auth/AuthSlideOverProvider'
import { BrandLink } from '@/components/site/BrandLink'
import { ServicesMenu, MobileServicesList } from '@/components/site/ServicesMenu'

/* Boxy auth-trigger button (opens the real auth slide-over). */
export function V5AuthButton({
  tab = 'register',
  label,
  variant = 'solid',
  className = '',
}: {
  tab?: 'login' | 'register'
  label: string
  variant?: 'solid' | 'ghost' | 'plain'
  className?: string
}) {
  const { openAuth } = useAuthSlideOver()
  const base = 'ff-mono inline-flex items-center justify-center gap-2 text-[13px] font-semibold uppercase tracking-[0.05em] transition-colors cursor-pointer'
  const styles =
    variant === 'solid'
      ? 'text-white bg-[#C9241A] hover:bg-[#a91d14] v5-glow px-7 py-4'
      : variant === 'ghost'
        ? 'text-white border border-white/22 hover:bg-white/[0.06] hover:border-white/40 px-6 py-4'
        : 'text-white/60 hover:text-white'
  return (
    <button onClick={() => openAuth(tab)} className={`${base} ${styles} ${className}`}>
      {label}
    </button>
  )
}

// Mirrors the real site header (PublicHeader) so the v5 home links into the
// rest of the live site. In-page sections use hash anchors; everything else
// routes to the real pages.
const NAV_LINKS = [
  { href: '#capabilities', label: 'How It Works' },
  { href: '#services', label: 'Services' },
  { href: '/command-studio', label: 'Command Studio', badge: 'NEW' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function V5Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [joinOpen, setJoinOpen] = useState(false)
  const { openAuth } = useAuthSlideOver()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const onHash = (e: React.MouseEvent, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setOpen(false)
    }
  }

  return (
    <header
      className={`fixed left-0 right-0 z-[60] transition-all duration-300 ${
        scrolled ? 'top-0 bg-[#0F1216]/92 backdrop-blur-md border-b border-white/10' : 'top-9 bg-transparent border-b border-transparent'
      }`}
    >
      <nav className="max-w-[1280px] mx-auto px-5 sm:px-[30px] h-[66px] flex items-center gap-7">
        <BrandLink size={30} />

        <div className="hidden lg:flex items-center gap-7 ml-3 ff-mono text-[12.5px] font-medium tracking-[0.04em] uppercase text-[#9aa0a8]">
          {NAV_LINKS.map((l) =>
            l.label === 'Services' ? (
              <ServicesMenu key={l.label} />
            ) : l.href.startsWith('#') ? (
              <a key={l.label} href={l.href} onClick={(e) => onHash(e, l.href)} className="hover:text-white transition-colors inline-flex items-center gap-1.5">
                {l.label}
                {l.badge && <span className="text-[9px] text-[#C9241A] border border-[#C9241A] px-1 py-px leading-none">{l.badge}</span>}
              </a>
            ) : (
              <Link key={l.label} href={l.href} className="hover:text-white transition-colors inline-flex items-center gap-1.5">
                {l.label}
                {l.badge && <span className="text-[9px] text-[#C9241A] border border-[#C9241A] px-1 py-px leading-none">{l.badge}</span>}
              </Link>
            )
          )}
        </div>

        <div className="ml-auto flex items-center gap-4">
          <div
            className="relative hidden sm:flex items-center"
            onMouseEnter={() => setJoinOpen(true)}
            onMouseLeave={() => setJoinOpen(false)}
          >
            <button
              onClick={() => setJoinOpen((v) => !v)}
              aria-expanded={joinOpen}
              className="ff-mono leading-none text-[12.5px] font-medium tracking-[0.04em] uppercase text-[#9aa0a8] hover:text-white transition-colors cursor-pointer"
            >
              Join
            </button>
            {joinOpen && (
              // top-full + pt bridges the gap so moving the cursor from the
              // button down into the panel keeps it open (hover-intent).
              <div className="absolute right-0 top-full pt-[14px] z-[80]">
                <div className="w-[300px] bg-[#0F1216] border border-white/12 p-4 shadow-2xl shadow-black/50">
                  <div className="ff-mono text-[10px] tracking-[0.1em] uppercase text-white/45 mb-2.5">Joining a session?</div>
                  <JoinCodeInput variant="v5" />
                </div>
              </div>
            )}
          </div>
          <button
            onClick={() => openAuth('login')}
            className="ff-mono hidden sm:inline-flex items-center leading-none text-[12.5px] font-medium tracking-[0.04em] uppercase text-[#9aa0a8] hover:text-white transition-colors cursor-pointer"
          >
            Sign in
          </button>
          {/* Desktop primary: start trial. */}
          <button
            onClick={() => openAuth('register')}
            className="ff-mono hidden sm:inline-flex items-center text-[12.5px] font-semibold tracking-[0.05em] uppercase text-white bg-[#C9241A] hover:bg-[#a91d14] v5-glow px-5 py-2.5 transition-colors cursor-pointer"
          >
            Start trial
          </button>
          {/* Mobile primary: join a session — getting crew into a session is
              the first thing they need, so this leads instead of start-trial. */}
          <div className="relative sm:hidden">
            <button
              onClick={() => setJoinOpen((v) => !v)}
              className="ff-mono inline-flex items-center gap-1.5 text-[12.5px] font-semibold tracking-[0.05em] uppercase text-white bg-[#C9241A] hover:bg-[#a91d14] v5-glow px-4 py-2.5 transition-colors cursor-pointer"
            >
              Join
            </button>
            {joinOpen && (
              <>
                <div className="fixed inset-0 z-[70]" onClick={() => setJoinOpen(false)} />
                <div className="absolute right-0 top-[calc(100%+12px)] z-[80] w-[270px] bg-[#0F1216] border border-white/12 p-4 shadow-2xl shadow-black/50">
                  <div className="ff-mono text-[10px] tracking-[0.1em] uppercase text-white/45 mb-2.5">Enter your join code</div>
                  <JoinCodeInput variant="v5" />
                </div>
              </>
            )}
          </div>
          <button className="lg:hidden text-white p-1 cursor-pointer" onClick={() => setOpen((v) => !v)} aria-label="Menu">
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="lg:hidden bg-[#0F1216]/97 backdrop-blur-md border-t border-white/10 px-5 py-4 space-y-1 max-h-[calc(100dvh-80px)] overflow-y-auto overscroll-contain">
          {NAV_LINKS.map((l) =>
            l.label === 'Services' ? (
              <MobileServicesList key={l.label} onNavigate={() => setOpen(false)} />
            ) : l.href.startsWith('#') ? (
              <a key={l.label} href={l.href} onClick={(e) => onHash(e, l.href)} className="ff-mono block px-2 py-3 text-sm uppercase tracking-[0.04em] text-white/70 hover:text-white">
                {l.label}
              </a>
            ) : (
              <Link key={l.label} href={l.href} onClick={() => setOpen(false)} className="ff-mono block px-2 py-3 text-sm uppercase tracking-[0.04em] text-white/70 hover:text-white">
                {l.label}
              </Link>
            )
          )}
          <div className="pt-3 mt-2 border-t border-white/10 space-y-3">
            <div className="ff-mono text-[10px] tracking-[0.1em] uppercase text-white/45">Joining a session? Enter your code</div>
            <JoinCodeInput variant="v5" />
            <div className="grid grid-cols-2 gap-2.5">
              <button onClick={() => { setOpen(false); openAuth('login') }} className="ff-mono py-2.5 text-[12px] text-center uppercase tracking-[0.04em] text-white border border-white/22 hover:bg-white/[0.06] cursor-pointer">Sign in</button>
              <button onClick={() => { setOpen(false); openAuth('register') }} className="ff-mono py-2.5 text-[12px] text-center font-semibold uppercase tracking-[0.04em] text-white bg-[#C9241A] hover:bg-[#a91d14] cursor-pointer">Start trial</button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
