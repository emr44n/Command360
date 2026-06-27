'use client'

import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'

/**
 * The giant "C360" watermark at the foot of the page. It rests with a bit
 * over half visible (bottom portion below the fold), padding above so it
 * never clashes with the footer content. The motion is spring-smoothed and
 * tied to the footer scrolling into view, so it visibly EASES UP into place
 * as you reach the bottom and EASES DOWN out of view as you scroll back up.
 * A slow opacity breathe gives it a faint glow.
 */
export function FooterWordmark() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  // Spring-smooth the scroll value so the rise/sink reads as an eased motion
  // rather than rigidly tracking the scrollbar.
  const smooth = useSpring(scrollYProgress, { stiffness: 70, damping: 18, mass: 0.5 })
  // Big visible travel: deep below the fold (88%) → risen to ~55% visible (45%).
  const y = useTransform(smooth, [0, 1], ['88%', '45%'])

  return (
    <div ref={ref} aria-hidden="true" className="absolute left-0 right-0 bottom-0 h-[clamp(120px,27vw,360px)] pointer-events-none overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-x-0 bottom-0 flex justify-center">
        <motion.span
          animate={{ opacity: [0.55, 0.85, 0.55] }}
          transition={{ duration: 5.5, ease: 'easeInOut', repeat: Infinity }}
          className="ff-display font-black leading-[0.8] tracking-[-0.02em] whitespace-nowrap text-[clamp(120px,27vw,360px)] text-white/[0.07] select-none"
        >
          C360
        </motion.span>
      </motion.div>
    </div>
  )
}
