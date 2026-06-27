'use client'

import { motion, useScroll, useTransform } from 'framer-motion'

/**
 * The giant "C360" watermark at the foot of the page. It rests half-in /
 * half-out of the page (bottom half below the fold), with a little padding
 * above so it never clashes with the footer content. As you scroll down to
 * the very bottom it eases up into that resting position; as you scroll back
 * up it sinks down out of view. A slow opacity breathe gives it a faint glow.
 */
export function FooterWordmark() {
  const { scrollYProgress } = useScroll()
  // Over the last stretch of the page: sunk (66% down → mostly hidden) easing
  // up to its resting spot (50% down → exactly half visible).
  const y = useTransform(scrollYProgress, [0.9, 1], ['66%', '50%'])

  return (
    <div aria-hidden="true" className="absolute left-0 right-0 bottom-0 flex items-end justify-center pointer-events-none overflow-hidden">
      <motion.span
        style={{ y }}
        animate={{ opacity: [0.55, 0.85, 0.55] }}
        transition={{ duration: 5.5, ease: 'easeInOut', repeat: Infinity }}
        className="ff-display font-black leading-[0.8] tracking-[-0.02em] whitespace-nowrap text-[clamp(120px,27vw,360px)] text-white/[0.07] select-none"
      >
        C360
      </motion.span>
    </div>
  )
}
