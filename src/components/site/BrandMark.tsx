/**
 * The Command 360 brand mark (aperture logo). One source of truth — used in
 * the header, footer, auth, dashboard and in-app chrome.
 *
 * Rendered as a plain <img> of the full-resolution PNG so the browser does the
 * downscaling itself (crisp at every size). next/image's generated variants
 * looked soft, so we deliberately bypass it here.
 */
export function BrandMark({ size = 30, className = '' }: { size?: number; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.png"
      alt="Command 360"
      width={size}
      height={size}
      decoding="async"
      draggable={false}
      className={`shrink-0 select-none ${className}`}
      style={{ width: size, height: size }}
    />
  )
}
