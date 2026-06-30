'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ChevronDown, ArrowRight } from 'lucide-react'
import { SERVICES, type ServiceLink } from '@/components/site/services-data'

/**
 * Services mega-menu — shared by the site header and the home nav. Hovering
 * (or clicking) "Services" opens a rigid v5 grid panel listing every UK
 * blue-light & emergency service, each with its own accent square + a short
 * descriptor, plus a "view all" cell. Colours match the per-service pages.
 *
 * The list itself lives in the server-safe `services-data` module so non-client
 * routes (sitemap) can read it; re-exported here for existing importers.
 */
export { SERVICES, type ServiceLink }

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
        className="uppercase hover:text-white transition-colors inline-flex items-center gap-1.5 cursor-pointer"
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

/* Mobile list — a collapsible "Services" section inside the burger menu. Tap
   the row to expand the per-service subpages; collapsed by default so the menu
   stays short and the Join box / auth buttons remain reachable. */
export function MobileServicesList({ onNavigate }: { onNavigate?: () => void }) {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-2 py-3 ff-mono text-sm uppercase tracking-[0.04em] text-white/70 hover:text-white cursor-pointer"
      >
        Services
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="pl-3 pb-1 border-l border-white/10 ml-2">
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
      )}
    </div>
  )
}
