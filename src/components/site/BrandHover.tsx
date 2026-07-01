'use client'

import { useEffect, useState } from 'react'
import { BrandMark } from './BrandMark'

/**
 * Logo + "COMMAND 360" wordmark as a non-navigating group (unlike BrandLink,
 * which is an <a>). Hovering ANYWHERE on the group — including the wordmark text
 * — spins the logo one clockwise turn and scales it up, settling back on leave.
 * Use in chrome (editor/preview top bars) where the mark shouldn't be a link.
 * Honours prefers-reduced-motion.
 */
export function BrandHover({
  size = 20,
  wordmarkText = 'COMMAND 360',
  wordmarkClassName = 'ff-wordmark text-xs tracking-tight uppercase',
  className = 'flex items-center gap-1.5',
}: {
  size?: number
  wordmarkText?: string
  wordmarkClassName?: string
  className?: string
}) {
  const [turns, setTurns] = useState(0)
  const [hover, setHover] = useState(false)
  const [reduce, setReduce] = useState(false)

  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduce(m.matches)
    sync()
    m.addEventListener('change', sync)
    return () => m.removeEventListener('change', sync)
  }, [])

  const spin = () => { if (!reduce) setTurns((n) => n + 1) }
  const onEnter = () => { setHover(true); spin() }
  const onLeave = () => { setHover(false); spin() }

  return (
    <span className={`${className} cursor-default select-none`} onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <span
        className="inline-flex shrink-0 will-change-transform"
        style={{
          transform: `rotate(${turns * 360}deg) scale(${hover && !reduce ? 1.12 : 1})`,
          transition: reduce ? undefined : 'transform 0.9s cubic-bezier(0.22, 0.61, 0.36, 1)',
        }}
      >
        <BrandMark size={size} animated={false} />
      </span>
      {wordmarkText && <span className={wordmarkClassName}>{wordmarkText}</span>}
    </span>
  )
}
