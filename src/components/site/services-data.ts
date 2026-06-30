/**
 * Service list data — the UK blue-light & emergency services Command 360 serves.
 *
 * Kept in a plain (server-safe) module, NOT in the `'use client'` ServicesMenu,
 * so server-only routes (e.g. sitemap.ts) can import the array directly. When a
 * value export is imported from a `'use client'` module into the server build it
 * comes through as a client-reference proxy, not the array — which broke the
 * `/sitemap.xml` prerender. This module has no client dependencies.
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
