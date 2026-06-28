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
  media,
}: {
  eyebrow?: ReactNode
  title: ReactNode
  lede?: ReactNode
  children?: ReactNode
  accent?: string
  /** optional right-hand media (e.g. ServiceHeroImage) — turns the hero into
   *  a two-column layout on large screens; omitted = single column as before. */
  media?: ReactNode
}) {
  const textBlock = (
    <div>
      {eyebrow && <div className="mb-6">{eyebrow}</div>}
      <h1 className={`ff-display font-extrabold text-white leading-[1.0] tracking-[-0.02em] text-[clamp(38px,5vw,68px)] ${media ? 'max-w-[15ch]' : 'max-w-[14ch]'}`} data-reveal>
        {title}
      </h1>
      {lede && (
        <p className="text-[18px] leading-[1.62] text-[#aab0b8] max-w-[560px] mt-7" data-reveal>
          {lede}
        </p>
      )}
      {children && <div className="mt-9 flex flex-wrap items-center gap-3" data-reveal>{children}</div>}
    </div>
  )

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
        {media ? (
          <div className="grid lg:grid-cols-[1.05fr_0.9fr] gap-10 lg:gap-14 items-center">
            {textBlock}
            <div className="relative w-full max-w-[520px] lg:max-w-none mx-auto">{media}</div>
          </div>
        ) : textBlock}
      </div>
    </header>
  )
}

/**
 * Framed service-page hero image — regimental "grid frame": bordered panel,
 * faint grid overlay, corner ticks in the service accent, an agency label
 * chip, a live marker, and a training-context caption. Static/presentational.
 */
export function ServiceHeroImage({ src, name, caption, accent }: { src: string; name: string; caption: string; accent: string }) {
  return (
    <div className="relative w-full overflow-hidden border border-white/12 bg-[#0A0C0F] aspect-[4/5]" data-reveal>
      <img src={src} alt={`${name} professionals using Command 360 interactive training`} width={1000} height={1250} loading="eager" className="absolute inset-0 w-full h-full object-cover object-top select-none" />
      {/* faint grid frame */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.06) 1px,transparent 1px)', backgroundSize: '46px 46px', WebkitMaskImage: 'radial-gradient(120% 110% at 50% 0%,#000,transparent 80%)', maskImage: 'radial-gradient(120% 110% at 50% 0%,#000,transparent 80%)' }} />
      {/* legibility wash + grain */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/90 via-black/12 to-black/45" />
      <div aria-hidden="true" className="absolute inset-0 v5-grain opacity-[0.1] mix-blend-overlay pointer-events-none" />
      {/* corner ticks */}
      <span aria-hidden="true" className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2" style={{ borderColor: accent }} />
      <span aria-hidden="true" className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2" style={{ borderColor: accent }} />
      <span aria-hidden="true" className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2" style={{ borderColor: accent }} />
      <span aria-hidden="true" className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2" style={{ borderColor: accent }} />
      {/* top labels */}
      <div className="absolute top-0 inset-x-0 flex items-start justify-between p-4">
        <span className="inline-flex items-center gap-2 ff-mono text-[10.5px] font-semibold tracking-[0.12em] uppercase text-white bg-black/55 backdrop-blur-sm border border-white/15 px-2.5 py-1.5">
          <span className="w-2 h-2" style={{ background: accent }} />{name}
        </span>
        <span className="inline-flex items-center gap-1.5 ff-mono text-[10px] font-semibold tracking-[0.1em] uppercase text-white bg-black/45 backdrop-blur-sm border border-white/12 px-2.5 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2E9E63] v5-pulse" />Live
        </span>
      </div>
      {/* bottom caption — training context */}
      <div className="absolute bottom-0 inset-x-0 p-5 pt-12">
        <div className="ff-mono text-[10px] tracking-[0.14em] uppercase mb-1.5" style={{ color: accent }}>Interactive training</div>
        <div className="ff-display font-bold text-white text-[clamp(16px,1.7vw,20px)] leading-tight tracking-[-0.01em] max-w-[94%]">{caption}</div>
      </div>
    </div>
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
