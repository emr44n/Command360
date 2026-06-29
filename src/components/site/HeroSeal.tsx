'use client'

import { useEffect, useState } from 'react'
import { BrandMark } from './BrandMark'

/**
 * Top-right hero seal: the "COMMAND 360 · INTERACTIVE TRAINING" text revolves
 * continuously around a brand logo at the centre. The logo revolves once on
 * load, and on hover it scales up and spins one clockwise turn — settling back
 * (smaller) with another clockwise turn when the cursor leaves. Reduced-motion
 * disables the spins (the ring text is already handled in globals.css).
 */
export function HeroSeal() {
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

  useEffect(() => {
    if (reduce) return
    const t = setTimeout(() => setTurns((n) => n + 1), 1000)
    return () => clearTimeout(t)
  }, [reduce])

  const spin = () => { if (!reduce) setTurns((n) => n + 1) }

  return (
    <div className="hidden lg:flex absolute top-[88px] right-[32px] z-[4] w-[124px] h-[124px] items-center justify-center">
      <svg viewBox="0 0 100 100" className="v5-seal absolute inset-0 w-full h-full" aria-hidden="true">
        <defs><path id="sealpath" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" /></defs>
        <text className="ff-mono" fontSize="8.6" letterSpacing="2.4" fill="#8b9099"><textPath href="#sealpath">COMMAND 360 · INTERACTIVE TRAINING · </textPath></text>
      </svg>
      <button
        type="button"
        aria-label="Command 360"
        onMouseEnter={() => { setHover(true); spin() }}
        onMouseLeave={() => { setHover(false); spin() }}
        className="relative inline-flex items-center justify-center cursor-pointer"
      >
        <span className="absolute w-[44px] h-[44px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(201,36,26,.34), transparent 68%)' }} aria-hidden="true" />
        <span
          className="relative inline-flex will-change-transform"
          style={{
            transform: `rotate(${turns * 360}deg) scale(${hover ? 1.18 : 1})`,
            transition: reduce ? undefined : 'transform 0.9s cubic-bezier(0.22, 0.61, 0.36, 1)',
          }}
        >
          <BrandMark size={30} />
        </span>
      </button>
    </div>
  )
}
