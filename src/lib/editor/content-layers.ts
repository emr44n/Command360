/**
 * Content slides are composed as a canvas of movable text/image boxes — there
 * is no baked-in title bar or centred body block. The slide's title and body
 * are surfaced as two *bound* text boxes:
 *
 *   - the title box reflects `slide.title` (so the slide-list name and the
 *     on-canvas heading stay in sync — one source of truth),
 *   - the body box reflects `content.body`.
 *
 * Their geometry/style is stored alongside the body in `content._titleBox` /
 * `content._bodyBox`, so moving/restyling them persists without duplicating the
 * text itself. Everything else the author adds lives in `content._canvas_elements`
 * as normal. This keeps one render path for editor, preview, presenter and the
 * audience, and means nothing is silently migrated or lost.
 */
import type { Slide, CanvasElement } from '@/types/slide'
import { plainTextFromHtml, isEmptyBody } from '@/lib/slide-content'

export const TITLE_EL_ID = '__title__'
export const BODY_EL_ID = '__body__'

export type BoundBox = {
  x: number; y: number; width: number; height: number
  rotation?: number
  style?: CanvasElement['style']
}

const DEFAULT_TITLE_BOX: BoundBox = { x: 8, y: 7, width: 84, height: 16 }
const DEFAULT_BODY_BOX: BoundBox = { x: 10, y: 30, width: 80, height: 56 }

const TITLE_STYLE: CanvasElement['style'] = { fontSize: 34, fontWeight: 'bold', color: '#111827', textAlign: 'center' }
const BODY_STYLE: CanvasElement['style'] = { fontSize: 18, fontWeight: 'normal', color: '#374151', textAlign: 'center' }

/** The author-added elements only (no bound title/body). */
export function realCanvasElements(slide: Slide): CanvasElement[] {
  const els = (slide.content as Record<string, unknown>)?._canvas_elements
  return Array.isArray(els) ? (els as CanvasElement[]) : []
}

/** The two bound boxes for a content slide. `includeEmpty` keeps a box present
 *  even when its text is blank (used in the editor so it stays grabbable). */
export function contentBoundElements(slide: Slide, includeEmpty = false): CanvasElement[] {
  if (slide.slide_type !== 'content') return []
  const content = slide.content as Record<string, unknown>
  const titleBox = (content._titleBox as BoundBox) || DEFAULT_TITLE_BOX
  const bodyBox = (content._bodyBox as BoundBox) || DEFAULT_BODY_BOX
  const titleText = slide.title || ''
  const bodyRaw = (content.body as string) || ''
  const bodyText = plainTextFromHtml(bodyRaw)

  const out: CanvasElement[] = []
  if (titleText || includeEmpty) {
    out.push({
      id: TITLE_EL_ID, type: 'text', rotation: titleBox.rotation || 0,
      x: titleBox.x, y: titleBox.y, width: titleBox.width, height: titleBox.height,
      content: titleText,
      style: { ...TITLE_STYLE, ...(titleBox.style || {}) },
    })
  }
  // The body box only appears once there's body text. (Unlike the title — which
  // every slide conceptually has, so an empty grabbable title box stays in the
  // editor — an empty body box would just reappear right after a delete and read
  // as "it won't delete". Re-add body text from the side CONTENT field to bring
  // the box back.)
  if (!isEmptyBody(bodyRaw)) {
    out.push({
      id: BODY_EL_ID, type: 'text', rotation: bodyBox.rotation || 0,
      x: bodyBox.x, y: bodyBox.y, width: bodyBox.width, height: bodyBox.height,
      content: bodyText,
      style: { ...BODY_STYLE, ...(bodyBox.style || {}) },
    })
  }
  return out
}

/** Full element list to render for a slide: bound title/body (content slides)
 *  behind the author's own elements. `includeEmpty` is for the editor. */
export function slideRenderElements(slide: Slide, includeEmpty = false): CanvasElement[] {
  return [...contentBoundElements(slide, includeEmpty), ...realCanvasElements(slide)]
}

/** Whether a content slide has anything laid out (so renderers can decide to go
 *  full-bleed instead of showing an empty framed title). */
export function contentSlideHasLayout(slide: Slide): boolean {
  if (slide.slide_type !== 'content') return realCanvasElements(slide).length > 0
  const content = slide.content as Record<string, unknown>
  return !!(slide.title || !isEmptyBody((content.body as string) || '') || realCanvasElements(slide).length > 0)
}

/**
 * Route an edited element list (which may include the bound title/body boxes)
 * back into a slide patch: `__title__` text → `slide.title`, its geometry →
 * `content._titleBox`; `__body__` likewise into `content.body` / `_bodyBox`;
 * everything else into `content._canvas_elements`.
 */
export function applyEditedElements(
  slide: Slide,
  elements: CanvasElement[],
): { title?: string; content: Slide['content'] } {
  const content = { ...(slide.content as Record<string, unknown>) }
  let title: string | undefined

  const real: CanvasElement[] = []
  let titleSeen = false
  let bodySeen = false

  for (const el of elements) {
    if (el.id === TITLE_EL_ID) {
      titleSeen = true
      title = el.content
      content._titleBox = { x: el.x, y: el.y, width: el.width, height: el.height, rotation: el.rotation, style: el.style }
    } else if (el.id === BODY_EL_ID) {
      bodySeen = true
      // The box holds plain text; the side CONTENT field holds rich HTML. Only
      // overwrite the stored body when the *text* actually changed — moving or
      // restyling the box must not strip the author's formatting.
      const prevBody = (content.body as string) || ''
      if (plainTextFromHtml(prevBody) !== el.content) content.body = el.content
      content._bodyBox = { x: el.x, y: el.y, width: el.width, height: el.height, rotation: el.rotation, style: el.style }
    } else {
      real.push(el)
    }
  }

  // A bound box removed from the list means the author deleted it — clear the
  // underlying text so it doesn't reappear with stale content.
  if (slide.slide_type === 'content' && !titleSeen) title = ''
  if (slide.slide_type === 'content' && !bodySeen) content.body = ''

  content._canvas_elements = real
  return { title, content: content as Slide['content'] }
}
