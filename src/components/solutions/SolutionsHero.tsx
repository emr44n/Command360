'use client'

import { HeroCornerLogo } from '@/components/site/HeroCornerLogo'

/**
 * Solutions-page hero image — the framed "grid panel" treatment used across
 * the site (matching the About / Command Studio carousels): bordered stage,
 * legibility wash, a section chip + brand tag up top, and a training caption
 * with a scrolling ticker of the services this page covers. Single static
 * image (no rotation), so no drag or pagination — just the chrome + ticker.
 */

const ACCENT = '#C9241A'

// the services listed on this page — scrolled on the ticker so the hero
// reflects the page content
const SERVICES = [
  'Fire & Rescue', 'Police', 'Ambulance', 'Armed Forces', 'HM Coastguard',
  'Search & Rescue', 'Prison & Probation', 'Local Authority',
  'Civil Contingencies', 'NHS Emergency Departments', 'Voluntary Sector',
]

function Ticker({ items, c }: { items: string[]; c: string }) {
  const row = [...items, ...items]
  return (
    <div className="relative overflow-hidden w-full mask-fade-x">
      <div className="flex items-center gap-6 w-max v5-marquee" style={{ animationDuration: '34s' }}>
        {row.map((t, i) => (
          <span key={i} className="inline-flex items-center gap-2 ff-mono text-[10.5px] tracking-[0.06em] uppercase text-white/75 whitespace-nowrap">
            <span className="w-1.5 h-1.5 shrink-0" style={{ background: c }} />{t}
          </span>
        ))}
      </div>
    </div>
  )
}

export function SolutionsHero() {
  return (
    <div className="relative w-full border border-white/12 bg-[#0A0C0F] overflow-hidden aspect-[16/9]" data-reveal>
      <img
        src="/solutions/all-services.webp"
        alt="Emergency-services teams using Command 360 interactive training"
        width={1280}
        height={720}
        loading="eager"
        className="absolute inset-0 w-full h-full object-cover object-top select-none"
      />

      {/* faint grid frame */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.06) 1px,transparent 1px)', backgroundSize: '46px 46px', WebkitMaskImage: 'radial-gradient(120% 110% at 50% 0%,#000,transparent 80%)', maskImage: 'radial-gradient(120% 110% at 50% 0%,#000,transparent 80%)' }} />
      {/* legibility wash */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/88 via-transparent to-black/35" />

      {/* top — section chip + brand tag */}
      <div className="absolute top-0 inset-x-0 flex items-start justify-between p-3.5 z-[2] pointer-events-none">
        <span className="inline-flex items-center gap-2 ff-mono text-[10px] font-semibold tracking-[0.12em] uppercase text-white bg-black/55 backdrop-blur-sm border border-white/15 px-2.5 py-1.5">
          <span className="w-2 h-2" style={{ background: ACCENT }} />Every Service
        </span>
        <span className="ff-mono text-[10px] font-semibold tracking-[0.1em] uppercase text-white bg-black/45 backdrop-blur-sm border border-white/12 px-2.5 py-1.5">
          Command 360
        </span>
      </div>

      {/* bottom — eyebrow + caption + ticker */}
      <div className="absolute bottom-0 inset-x-0 px-3.5 pb-3.5 pt-10 z-[2]">
        <div className="mb-2.5">
          <div className="ff-mono text-[9.5px] tracking-[0.14em] uppercase mb-1" style={{ color: ACCENT }}>Interactive training</div>
          <div className="ff-display font-bold text-white text-[clamp(15px,1.6vw,19px)] leading-tight tracking-[-0.01em]">Purpose-built for every blue-light service</div>
        </div>
        <Ticker items={SERVICES} c={ACCENT} />
      </div>
      <HeroCornerLogo />
    </div>
  )
}
