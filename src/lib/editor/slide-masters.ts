/**
 * Slide Masters — reusable, branded slide templates (a background + a set of
 * fixed logo/text/image boxes) that any slide can be based on, so a deck keeps a
 * consistent, branded look without re-adding the same furniture to every slide.
 *
 * Mirrors how PowerPoint "slide masters" / Google Slides "layouts" / Keynote
 * "master slides" work: you design a layout once, name it, and apply it to
 * slides; the master paints *behind* each slide's own content.
 *
 * ── Persistence ────────────────────────────────────────────────────────────
 * Masters live per-presentation in the `slide_masters` jsonb column. That column
 * may not exist yet on the deployed database — see MIGRATIONS_TODO.md /
 * supabase/migrations. Until it does, {@link saveMasters} transparently falls
 * back to per-device localStorage so the feature still works; once the column is
 * added, masters persist server-side and sync across devices. No data is lost
 * either way.
 *
 * A slide references its master by id in `content._masterId`, and carries a
 * *snapshot* of the master's paint list in `content._masterSnapshot`. The
 * snapshot means every renderer (editor, preview, presenter, live audience) can
 * draw the master with zero extra plumbing — it never needs the masters list,
 * only the slide. Editing a master re-stamps the snapshot onto the slides using
 * it (see {@link restampMasterOnSlides}).
 */
import type { CanvasElement, Slide } from '@/types/slide'

export interface SlideMaster {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  /** Slide background painted behind everything. */
  background: { color?: string; imageUrl?: string }
  /** Fixed branded boxes (logo, footer text, etc.) painted behind slide content. */
  elements: CanvasElement[]
  /** Marks the master applied to new slides by default. */
  isDefault?: boolean
}

/** The paint list a master contributes (background first, then its boxes). */
export interface MasterSnapshot {
  background: { color?: string; imageUrl?: string }
  elements: CanvasElement[]
}

export const NO_MASTER = '__none__'

/** SQL the deployment still needs (surfaced in-app + tracked in MIGRATIONS_TODO). */
export const SLIDE_MASTERS_MIGRATION_SQL =
  "ALTER TABLE presentations ADD COLUMN IF NOT EXISTS slide_masters jsonb DEFAULT '[]'::jsonb;"

function uid(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`
}

/** The built-in default master: a clean white slide with a small corner wordmark
 *  — a neutral branded base that every new deck gets for free. */
export function buildDefaultMaster(): SlideMaster {
  const now = new Date().toISOString()
  return {
    id: 'master_default',
    name: 'Command 360 — Default',
    createdAt: now,
    updatedAt: now,
    isDefault: true,
    background: { color: '#ffffff' },
    elements: [
      {
        id: 'master_default_wordmark',
        type: 'text',
        x: 71, y: 90, width: 27, height: 7, rotation: 0,
        content: 'COMMAND 360',
        style: { fontSize: 12, fontWeight: 'bold', color: '#9ca3af', textAlign: 'right' },
      },
    ],
  }
}

export function coerceMasters(raw: unknown): SlideMaster[] {
  return Array.isArray(raw) ? (raw as SlideMaster[]) : []
}

/** Masters for a presentation, guaranteeing at least the default is present. */
export function getMasters(raw: unknown): SlideMaster[] {
  const masters = coerceMasters(raw)
  if (masters.length === 0) return [buildDefaultMaster()]
  return masters
}

export function defaultMasterId(masters: SlideMaster[]): string {
  return (masters.find((m) => m.isDefault) || masters[0])?.id || NO_MASTER
}

/** Create a new blank master (branded corner wordmark, white background). */
export function newBlankMaster(name: string): SlideMaster {
  const base = buildDefaultMaster()
  const now = new Date().toISOString()
  return { ...base, id: uid('master'), name, isDefault: false, createdAt: now, updatedAt: now }
}

/** Capture the current slide's background + author elements as a master, so you
 *  can design a layout on a slide and "Save as Master". Bound title/body boxes
 *  are excluded — a master is furniture, not the slide's words. */
export function masterFromSlide(slide: Slide, name: string): SlideMaster {
  const now = new Date().toISOString()
  const els = (slide.content as Record<string, unknown>)?._canvas_elements
  const elements = Array.isArray(els) ? (els as CanvasElement[]).map((e) => ({ ...e })) : []
  return {
    id: uid('master'),
    name,
    createdAt: now,
    updatedAt: now,
    isDefault: false,
    background: { color: '#ffffff' },
    elements,
  }
}

export function snapshotOf(master: SlideMaster): MasterSnapshot {
  return { background: master.background, elements: master.elements }
}

/** The master's paint list as renderable CanvasElements (background as a
 *  full-bleed box first, then the master's own boxes). Read straight off the
 *  slide's stored snapshot so any renderer can use it with only the slide. */
export function masterElementsForSlide(slide: Slide): CanvasElement[] {
  const snap = (slide.content as Record<string, unknown>)?._masterSnapshot as MasterSnapshot | undefined
  if (!snap) return []
  const out: CanvasElement[] = []
  if (snap.background?.color || snap.background?.imageUrl) {
    out.push({
      id: '__master_bg__',
      type: snap.background.imageUrl ? 'image' : 'text',
      x: 0, y: 0, width: 100, height: 100, rotation: 0,
      content: snap.background.imageUrl || '',
      style: snap.background.imageUrl
        ? { objectFit: 'cover' }
        : { backgroundColor: snap.background.color },
    })
  }
  for (const el of snap.elements || []) out.push(el)
  return out
}

/** Apply a master to a slide: returns the content patch (id + snapshot). Pass
 *  NO_MASTER to detach. */
export function applyMasterToContent(
  content: Slide['content'],
  master: SlideMaster | null,
): Slide['content'] {
  const next = { ...(content as Record<string, unknown>) }
  if (!master) {
    delete next._masterId
    delete next._masterSnapshot
  } else {
    next._masterId = master.id
    next._masterSnapshot = snapshotOf(master)
  }
  return next as Slide['content']
}

export function slideMasterId(slide: Slide): string {
  return ((slide.content as Record<string, unknown>)?._masterId as string) || NO_MASTER
}

/** After a master is edited, refresh the stored snapshot on every slide using it
 *  so the change shows immediately. Returns only the slides that changed. */
export function restampMasterOnSlides(slides: Slide[], master: SlideMaster): Slide[] {
  const snap = snapshotOf(master)
  const changed: Slide[] = []
  for (const s of slides) {
    if (slideMasterId(s) === master.id) {
      changed.push({ ...s, content: { ...(s.content as Record<string, unknown>), _masterSnapshot: snap } as Slide['content'] })
    }
  }
  return changed
}

/**
 * Persist masters for a presentation. Tries the `slide_masters` column; if that
 * column doesn't exist yet (migration pending), falls back to per-device
 * localStorage so nothing is lost. Resolves with whether it reached the server.
 */
export async function saveMasters(presentationId: string, masters: SlideMaster[]): Promise<{ persisted: boolean }> {
  try {
    const res = await fetch(`/api/presentations/${presentationId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slide_masters: masters }),
    })
    if (res.ok) {
      // Clear any stale local fallback now that the server has it.
      try { localStorage.removeItem(localKey(presentationId)) } catch { /* ignore */ }
      return { persisted: true }
    }
  } catch { /* network / column missing — fall through */ }
  try { localStorage.setItem(localKey(presentationId), JSON.stringify(masters)) } catch { /* ignore */ }
  return { persisted: false }
}

/** Load masters: server value wins; otherwise the local fallback; otherwise the
 *  built-in default. */
export function loadMasters(presentationId: string, serverValue: unknown): SlideMaster[] {
  const fromServer = coerceMasters(serverValue)
  if (fromServer.length > 0) return fromServer
  try {
    const local = localStorage.getItem(localKey(presentationId))
    if (local) {
      const parsed = coerceMasters(JSON.parse(local))
      if (parsed.length > 0) return parsed
    }
  } catch { /* ignore */ }
  return [buildDefaultMaster()]
}

function localKey(presentationId: string): string {
  return `c360-slide-masters-${presentationId}`
}
