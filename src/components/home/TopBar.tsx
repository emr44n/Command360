'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ShieldCheck, Mail } from 'lucide-react'

const TICKER = [
  'New — Scenario Studio: immersive incident simulation',
  'Trusted across UK fire, police & ambulance services',
  'Run your first live session free — no card required',
  'AI session summaries generated in seconds',
]

/**
 * Dark utility bar above the nav. Shows trust details on the left and a
 * vertical rotating ticker on the right. Slides up out of view on
 * scroll-down and returns at the top of the page.
 */
export function TopBar() {
  const [hidden, setHidden] = useState(false)
  const [i, setI] = useState(0)

  useEffect(() => {
    const onScroll = () => setHidden(window.scrollY > 36)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setI((v) => (v + 1) % TICKER.length), 3400)
    return () => clearInterval(id)
  }, [])

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[61] h-9 bg-black border-b border-white/[0.08] transition-transform duration-300 ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-[30px] h-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-5 ff-mono text-[11px] tracking-[0.03em] text-[#8a9098] min-w-0">
          <span className="flex items-center gap-1.5 whitespace-nowrap"><ShieldCheck className="w-3.5 h-3.5 text-[#2E9E63]" /> UK-hosted · GDPR ready</span>
          <a href="mailto:enquiries@command360.co.uk" className="hidden sm:flex items-center gap-1.5 whitespace-nowrap hover:text-white transition-colors"><Mail className="w-3.5 h-3.5" /> enquiries@command360.co.uk</a>
        </div>
        <div className="flex items-center gap-5 min-w-0">
          <div className="relative h-9 overflow-hidden hidden lg:block w-[480px]" aria-live="off">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={i}
                initial={{ y: 14, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -14, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 flex items-center justify-end ff-mono text-[11px] tracking-[0.02em] text-[#aab0b8] text-right whitespace-nowrap"
              >
                <span className="w-1.5 h-1.5 bg-[#C9241A] mr-2 shrink-0" />
                {TICKER[i]}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
