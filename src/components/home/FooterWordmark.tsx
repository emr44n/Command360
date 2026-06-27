'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

/**
 * The giant "C360" watermark at the foot of the page. It is parallax-linked
 * to scroll — as you scroll down into the footer it eases downward (revealing
 * more as the page comes up), and rises back as you scroll up. A slow opacity
 * breathe gives it a faint, sticker-like glow on/off.
 */
export function FooterWordmark() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const y = useTransform(scrollYProgress, [0, 1], ['8%', '58%'])

  return (
    <div ref={ref} aria-hidden="true" className="absolute left-0 right-0 bottom-0 flex items-end justify-center pointer-events-none overflow-hidden">
      <motion.span
        style={{ y }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 5.5, ease: 'easeInOut', repeat: Infinity }}
        className="ff-display font-black leading-[0.8] tracking-[-0.02em] whitespace-nowrap text-[clamp(120px,27vw,360px)] text-white/[0.06] select-none"
      >
        C360
      </motion.span>
    </div>
  )
}
