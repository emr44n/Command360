import type { ReactNode } from 'react'

/**
 * v5 design-system page primitives shared across all front-facing pages.
 * Rigid, line-based, dark surfaces with the red accent. Keep copy verbatim;
 * these only provide the consistent shell/treatment.
 */

/** Mono red eyebrow label, optionally numbered (e.g. "01 — Capabilities"). */
export function Eyebrow({ children, n }: { children: ReactNode; n?: string }) {
  return (
    <div className="ff-mono text-[12px] font-semibold tracking-[0.12em] uppercase text-[#C9241A]" data-reveal>
      {n && <span>{n} — </span>}
      {children}
    </div>
  )
}

/**
 * Dark page hero band. Clears the fixed header (pt), lays in the grain + grid
 * + black top-fade + red glow treatment, and renders an eyebrow, headline,
 * optional lede and CTA row (children).
 */
export function PageHero({
  eyebrow,
  title,
  lede,
  children,
  accent = '#C9241A',
}: {
  eyebrow?: ReactNode
  title: ReactNode
  lede?: ReactNode
  children?: ReactNode
  accent?: string
}) {
  return (
    <header className="relative overflow-hidden bg-[#0F1216] text-white" aria-label="Introduction">
      <div className="absolute top-0 left-0 right-0 h-[78%] pointer-events-none" aria-hidden="true"
        style={{ background: 'linear-gradient(180deg, #000 0%, rgba(0,0,0,0.55) 26%, rgba(0,0,0,0.18) 52%, transparent 86%)' }} />
      <div className="absolute bottom-[-200px] left-1/2 -translate-x-1/2 w-[1180px] h-[640px] pointer-events-none" aria-hidden="true"
        style={{ background: `radial-gradient(60% 80% at 50% 100%, ${accent}33, ${accent}10 48%, transparent 78%)`, filter: 'blur(40px)' }} />
      <div className="absolute inset-0 v5-grain opacity-[0.15] mix-blend-overlay pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px)', backgroundSize: '74px 74px', maskImage: 'radial-gradient(1200px 760px at 30% 0%,#000,transparent 88%)', WebkitMaskImage: 'radial-gradient(1200px 760px at 30% 0%,#000,transparent 88%)' }} />

      <div className="relative max-w-[1280px] mx-auto px-5 sm:px-[30px] pt-[clamp(128px,17vh,180px)] pb-[clamp(64px,9vh,108px)]">
        {eyebrow && <div className="mb-6">{eyebrow}</div>}
        <h1 className="ff-display font-extrabold text-white leading-[1.0] tracking-[-0.02em] text-[clamp(38px,5vw,68px)] max-w-[14ch]" data-reveal>
          {title}
        </h1>
        {lede && (
          <p className="text-[18px] leading-[1.62] text-[#aab0b8] max-w-[560px] mt-7" data-reveal>
            {lede}
          </p>
        )}
        {children && <div className="mt-9 flex flex-wrap items-center gap-3" data-reveal>{children}</div>}
      </div>
    </header>
  )
}

/** Light (cream) section band — the "shout-out" surfaces. */
export function LightSection({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`bg-[#EFECE4] text-[#16191E] py-[90px] ${className}`}>{children}</section>
}

/** Dark section band. */
export function DarkSection({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`relative overflow-hidden bg-[#0F1216] text-white py-[90px] ${className}`}>{children}</section>
}

/** Standard max-width container. */
export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`max-w-[1280px] mx-auto px-5 sm:px-[30px] ${className}`}>{children}</div>
}
