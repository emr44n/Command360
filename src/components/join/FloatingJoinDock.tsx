'use client'

import { useState, useEffect } from 'react'
import { JoinCodeInput } from './JoinCodeInput'
import { useAuthSlideOver } from '@/components/auth/AuthSlideOverProvider'

/**
 * v5 "regimental" sticky command bar. Slides up once the hero join block
 * has scrolled away, hides again over the footer. Keeps the real join +
 * auth functionality.
 */
export function FloatingJoinDock() {
  const [visible, setVisible] = useState(false)
  const [atFooter, setAtFooter] = useState(false)
  const { openAuth } = useAuthSlideOver()

  useEffect(() => {
    const heroJoin = document.getElementById('hero-join')
    const footer = document.querySelector('footer')
    const cleanups: Array<() => void> = []

    // Reveal once the hero join block (home) has scrolled away; on pages
    // without one, reveal after a short scroll.
    if (heroJoin) {
      const heroObs = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), { threshold: 0 })
      heroObs.observe(heroJoin)
      cleanups.push(() => heroObs.disconnect())
    } else {
      const handleScroll = () => setVisible(window.scrollY > 400)
      handleScroll()
      window.addEventListener('scroll', handleScroll, { passive: true })
      cleanups.push(() => window.removeEventListener('scroll', handleScroll))
    }

    // Always hide again once the footer comes into view — on every page.
    if (footer) {
      const footerObs = new IntersectionObserver(([entry]) => setAtFooter(entry.isIntersecting), { threshold: 0 })
      footerObs.observe(footer)
      cleanups.push(() => footerObs.disconnect())
    }

    return () => cleanups.forEach((fn) => fn())
  }, [])

  const shouldShow = visible && !atFooter

  return (
    <div
      className={`fixed left-0 right-0 bottom-0 z-[55] bg-[#16191E] border-t border-white/14 transition-transform duration-500 ease-out ${
        shouldShow ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{ willChange: 'transform' }}
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-[30px]">
        <div className="flex items-center gap-4 py-2.5">
          {/* Text + status — desktop only, to give the join field room on mobile */}
          <div className="hidden sm:flex items-center gap-3 min-w-0">
            <span className="w-2 h-2 bg-[#C9241A] v5-pulse shrink-0" aria-hidden="true" />
            <div className="min-w-0">
              <div className="ff-display font-bold text-[14.5px] text-white leading-tight">Join a live session or start your own</div>
              <div className="ff-mono hidden md:block text-[11.5px] text-white/55">No app · no account for crew · free for 30 days</div>
            </div>
          </div>
          <div className="flex-1 sm:flex-none sm:ml-auto flex items-stretch gap-2.5 min-w-0">
            {/* Join code field (with the flashing cursor) — leads on mobile */}
            <div className="flex-1 sm:flex-none min-w-0">
              <JoinCodeInput variant="v5" className="w-full sm:w-auto" />
            </div>
            <button
              onClick={() => openAuth('register')}
              className="ff-mono hidden sm:inline-flex items-center text-[11.5px] font-semibold uppercase tracking-[0.05em] text-white bg-[#C9241A] hover:bg-[#a91d14] v5-glow px-5 whitespace-nowrap transition-colors cursor-pointer"
            >
              Start trial
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
