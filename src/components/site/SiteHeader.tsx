'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { JoinCodeInput } from '@/components/join/JoinCodeInput'
import { useAuthSlideOver } from '@/components/auth/AuthSlideOverProvider'

/**
 * Shared v5 site header — the rigid/regimental nav used across every
 * front-facing page (the home page has its own equivalent). Uses absolute
 * `/#…` links so in-page anchors resolve from any route. Join opens on hover;
 * the primary CTA carries the border-trace hover (.v5-glow).
 */
const NAV_LINKS = [
  { href: '/#capabilities', label: 'How It Works' },
  { href: '/#services', label: 'Services' },
  { href: '/command-studio', label: 'Command Studio', badge: 'NEW' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function SiteHeader() {
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

  return (
    <header
      className={`fixed left-0 right-0 z-[60] transition-all duration-300 ${
        scrolled ? 'top-0 bg-[#0F1216]/92 backdrop-blur-md border-b border-white/10' : 'top-9 bg-transparent border-b border-transparent'
      }`}
    >
      <nav className="max-w-[1280px] mx-auto px-5 sm:px-[30px] h-[66px] flex items-center gap-7">
        <Link href="/" className="flex items-center gap-3 text-white shrink-0">
          <span className="ff-display w-[30px] h-[30px] bg-[#C9241A] flex items-center justify-center text-base font-black text-white">C</span>
          <span className="ff-display font-extrabold text-[18px] tracking-[0.01em] whitespace-nowrap">COMMAND&nbsp;360</span>
        </Link>

        <div className="hidden lg:flex items-center gap-7 ml-3 ff-mono text-[12.5px] font-medium tracking-[0.04em] uppercase text-[#9aa0a8]">
          {NAV_LINKS.map((l) => (
            <Link key={l.label} href={l.href} className="hover:text-white transition-colors inline-flex items-center gap-1.5">
              {l.label}
              {l.badge && <span className="text-[9px] text-[#C9241A] border border-[#C9241A] px-1 py-px leading-none">{l.badge}</span>}
            </Link>
          ))}
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
          <button
            onClick={() => openAuth('register')}
            className="ff-mono hidden sm:inline-flex items-center text-[12.5px] font-semibold tracking-[0.05em] uppercase text-white bg-[#C9241A] hover:bg-[#a91d14] v5-glow px-5 py-2.5 transition-colors cursor-pointer"
          >
            Start trial
          </button>
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
        <div className="lg:hidden bg-[#0F1216]/97 backdrop-blur-md border-t border-white/10 px-5 py-4 space-y-1">
          {NAV_LINKS.map((l) => (
            <Link key={l.label} href={l.href} onClick={() => setOpen(false)} className="ff-mono block px-2 py-3 text-sm uppercase tracking-[0.04em] text-white/70 hover:text-white">
              {l.label}
            </Link>
          ))}
          <div className="pt-3 mt-2 border-t border-white/10 space-y-3">
            <div className="ff-mono text-[10px] tracking-[0.1em] uppercase text-white/45">Joining a session? Enter your code</div>
            <JoinCodeInput variant="v5" />
            <button onClick={() => { setOpen(false); openAuth('login') }} className="ff-mono block w-full text-center py-3 text-sm uppercase tracking-[0.04em] text-white/70 hover:text-white cursor-pointer">Sign in</button>
            <button onClick={() => { setOpen(false); openAuth('register') }} className="ff-mono block w-full text-center py-3 text-sm uppercase tracking-[0.04em] text-white border border-white/22 hover:bg-white/[0.06] cursor-pointer">Start free trial</button>
          </div>
        </div>
      )}
    </header>
  )
}
