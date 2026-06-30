/**
 * Helpers for content-slide bodies, which may be rich-text HTML (e.g. an empty
 * editor leaves "<p></p>"). These let renderers detect a genuinely-empty body
 * and decide whether to render as HTML or plain text — so empty paragraphs no
 * longer show up as literal "<p></p>" on the slide.
 */
export function plainTextFromHtml(html?: string | null): string {
  if (!html) return ''
  return html
    .replace(/<br\s*\/?>(?=)/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .trim()
}

export function isHtmlBody(s?: string | null): boolean {
  return !!s && /<[a-z][\s\S]*>/i.test(s.trim())
}

/** True when a content body has no visible text (empty, whitespace, or "<p></p>"). */
export function isEmptyBody(s?: string | null): boolean {
  return plainTextFromHtml(s).length === 0
}
