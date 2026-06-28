/**
 * New-scene canvas background, theme-aware.
 *
 * When the dashboard is in light mode, a freshly created scene / slide / CCTV
 * should default to the LIGHTEST surface (white) so it matches the light
 * workspace — instead of the dark regimental navy used in dark mode. Existing
 * scenes are never touched; this only governs the default at creation time.
 *
 * Client-side helper: reads the active theme from the dashboard shell class
 * (set live by the toggle) with the persisted cookie as a fallback.
 *
 * @param darkDefault the background to use in dark mode (navy for scenes,
 *                    black for CCTV walls).
 */
export function defaultStudioCanvasBg(darkDefault = '#1a1a2e'): string {
  if (typeof document !== 'undefined') {
    const root = document.querySelector('[data-dash-root]')
    if (root?.classList.contains('c360-light')) return '#ffffff'
    if (/(?:^|;\s*)c360_theme=light/.test(document.cookie)) return '#ffffff'
  }
  return darkDefault
}
