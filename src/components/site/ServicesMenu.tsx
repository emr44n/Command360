'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ChevronDown, ArrowRight } from 'lucide-react'

/**
 * Services mega-menu — shared by the site header and the home nav. Hovering
 * (or clicking) "Services" opens a rigid v5 grid panel listing every UK
 * blue-light & emergency service, each with its own accent square + a short
 * descriptor, plus a "view all" cell. Colours match the per-service pages.
 */
export interface ServiceLink {
  slug: string
  label: string
  desc: string
  c: string
}

export const SERVICES: ServiceLink[] = [
  { slug: 'fire-rescue', label: 'Fire & Rescue', desc: 'Safety briefings & hot debriefs', c: '#f97316' },
  { slug: 'police', label: 'Police', desc: 'Briefings & knowledge checks', c: '#3b82f6' },
  { slug: 'ambulance', label: 'Ambulance', desc: 'Clinical CPD & welfare checks', c: '#10b981' },
  { slug: 'armed-forces', label: 'Armed Forces', desc: 'Readiness at scale', c: '#64748b' },
  { slug: 'coastguard', label: 'HM Coastguard', desc: 'Training from any station', c: '#0ea5e9' },
  { slug: 'search-rescue', label: 'Search & Rescue', desc: 'Scenario-based exercises', c: '#f59e0b' },
  { slug: 'prison-probation', label: 'Prison & Probation', desc: 'Secure staff briefings', c: '#71717a' },
  { slug: 'local-authority', label: 'Local Authority', desc: 'Planning & resilience', c: '#8b5cf6' },
  { slug: 'civil-contingencies', label: 'Civil Contingencies', desc: 'Multi-agency exercises', c: '#ef4444' },
  { slug: 'nhs-emergency', label: 'NHS Emergency', desc: 'Clinical governance & drills', c: '#ec4899' },
  { slug: 'voluntary-sector', label: 'Voluntary Sector', desc: 'Volunteer induction & skills', c: '#14b8a6' },
]

/* Desktop trigger + mega panel (hover-intent, like the Join dropdown). */
export function ServicesMenu() {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="hover:text-white transition-colors inline-flex items-center gap-1.5 cursor-pointer"
      >
        Services
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        // top-full + pt bridges the gap so the cursor can travel into the panel
        <div className="absolute left-0 top-full pt-[16px] z-[80]">
          <div className="w-[620px] bg-[#0F1216] border border-white/12 shadow-2xl shadow-black/60">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
              <span className="ff-mono text-[10px] font-semibold tracking-[0.12em] uppercase text-[#C9241A]">Services</span>
              <span className="ff-mono text-[10px] tracking-[0.06em] uppercase text-white/45">Every UK blue-light &amp; emergency service</span>
            </div>
            <div className="grid grid-cols-2 border-l border-white/8">
              {SERVICES.map((s) => (
                <Link
                  key={s.slug}
                  href={`/solutions/${s.slug}`}
                  onClick={() => setOpen(false)}
                  className="group flex items-start gap-3 px-5 py-3 border-r border-b border-white/8 hover:bg-white/[0.04] transition-colors"
                >
                  <span className="w-2.5 h-2.5 mt-1 shrink-0" style={{ background: s.c }} aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="block ff-display text-[13.5px] font-semibold text-white leading-tight">{s.label}</span>
                    <span className="block ff-mono text-[10.5px] tracking-[0.02em] text-white/45 mt-0.5 truncate">{s.desc}</span>
                  </span>
                </Link>
              ))}
              <Link
                href="/solutions"
                onClick={() => setOpen(false)}
                className="group flex items-center justify-between gap-3 px-5 py-3 border-r border-b border-white/8 bg-white/[0.02] hover:bg-white/[0.05] transition-colors"
              >
                <span className="ff-mono text-[11px] font-semibold tracking-[0.06em] uppercase text-white">All services</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C9241A] group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* Mobile list — rendered inside the burger menu under a "Services" heading. */
export function MobileServicesList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="pt-1">
      <div className="ff-mono text-[10px] tracking-[0.12em] uppercase text-white/40 px-2 pb-1.5">Services</div>
      <div className="grid grid-cols-1">
        {SERVICES.map((s) => (
          <Link
            key={s.slug}
            href={`/solutions/${s.slug}`}
            onClick={onNavigate}
            className="flex items-center gap-3 px-2 py-2.5 text-white/70 hover:text-white"
          >
            <span className="w-2 h-2 shrink-0" style={{ background: s.c }} aria-hidden="true" />
            <span className="ff-mono text-[12.5px] tracking-[0.02em]">{s.label}</span>
          </Link>
        ))}
        <Link
          href="/solutions"
          onClick={onNavigate}
          className="flex items-center gap-2 px-2 py-2.5 ff-mono text-[12px] font-semibold uppercase tracking-[0.05em] text-[#C9241A]"
        >
          All services <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}
