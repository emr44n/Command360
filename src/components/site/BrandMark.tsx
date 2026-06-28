/**
 * The Command 360 brand mark (aperture logo). One source of truth — used in
 * the header, footer, auth, dashboard and in-app chrome.
 *
 * Two variants ship: the dark-mode logo (white accent segment, for dark
 * surfaces — the default everywhere) and the light-mode logo (black accent
 * segment, shown inside the dashboard light theme `.c360-light`). Both are
 * rendered as plain <img> of the full-resolution PNG so the browser does the
 * downscaling itself (crisp at every size); next/image's generated variants
 * looked soft, so we deliberately bypass it here. CSS swaps which one shows.
 */
export function BrandMark({ size = 30, className = '' }: { size?: number; className?: string }) {
  const common = {
    width: size,
    height: size,
    decoding: 'async' as const,
    draggable: false,
    style: { width: size, height: size },
  }
  return (
    <>
      {/* dark-mode logo — default on every (dark) surface, hidden in light theme */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.png" alt="Command 360" {...common} className={`shrink-0 select-none dash-light:hidden ${className}`} />
      {/* light-mode logo — only shown inside the dashboard `.c360-light` scope */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo-light.png" alt="" aria-hidden="true" {...common} className={`shrink-0 select-none hidden dash-light:inline-block ${className}`} />
    </>
  )
}
