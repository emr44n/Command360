'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

/**
 * The giant "C360" watermark at the foot of the page. It is parallax-linked
 * to scroll — as you reach the bottom of the page it rises up into full view
 * (the whole "C360" centred on its middle line), and sinks back down as you
 * scroll up. A slow opacity breathe gives it a faint, sticker-like glow.
 */
export function FooterWordmark() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  // progress 0 (footer entering) → pushed down/hidden; progress 1 (page bottom)
  // → risen up so the whole wordmark sits on its middle line, fully readable.
  const y = useTransform(scrollYProgress, [0, 1], ['46%', '-6%'])

  return (
    <div ref={ref} aria-hidden="true" className="absolute left-0 right-0 bottom-[6%] flex items-end justify-center pointer-events-none overflow-hidden">
      <motion.span
        style={{ y }}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 5.5, ease: 'easeInOut', repeat: Infinity }}
        className="ff-display font-black leading-[0.8] tracking-[-0.02em] whitespace-nowrap text-[clamp(130px,28vw,380px)] text-white/[0.09] select-none"
      >
        C360
      </motion.span>
    </div>
  )
}
