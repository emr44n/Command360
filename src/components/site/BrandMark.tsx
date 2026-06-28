import Image from 'next/image'

/**
 * The Command 360 brand mark (aperture logo). One source of truth — used in
 * the header, footer, auth, dashboard and in-app chrome. The asset keeps its
 * own slightly-rounded square; everything around it stays rigid.
 */
export function BrandMark({ size = 30, className = '' }: { size?: number; className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt="Command 360"
      width={size}
      height={size}
      // Serve the full-res lossless PNG and let the browser downscale it —
      // crisp at any size (next/image's small generated variants looked soft).
      unoptimized
      quality={100}
      className={`shrink-0 select-none ${className}`}
      draggable={false}
    />
  )
}
