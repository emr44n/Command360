/**
 * Per-edge feather masks for canvas elements (images, text).
 *
 * A linear gradient has a slope discontinuity where the solid area meets the
 * fade, which the eye reads as a faint hard line — exactly the "edge still
 * viewable, then the rest fades" artefact. We instead sample a smootherstep
 * curve across each fade band so the dissolve eases in and out with no visible
 * seam, fully reaching transparent at the element edge.
 *
 * Vertical (top/bottom) and horizontal (left/right) masks are returned
 * separately so they can be applied to nested wrappers and multiply — giving
 * correct corner falloff without needing `mask-composite`.
 */

export interface EdgeFade {
  top?: number
  bottom?: number
  left?: number
  right?: number
}

// smootherstep: 6t^5 - 15t^4 + 10t^3
function ease(t: number): number {
  const c = Math.max(0, Math.min(1, t))
  return c * c * c * (c * (c * 6 - 15) + 10)
}

/** Build the eased gradient stop list for one axis. `near` fades in over the
 *  first `near`% from transparent; `far` fades out over the last `far`%. */
function axisStops(near: number, far: number): string {
  const N = 6
  const stops: string[] = []
  if (near > 0) {
    for (let i = 0; i <= N; i++) {
      const pos = (near * i) / N
      const a = ease(i / N)
      stops.push(`rgba(0,0,0,${a.toFixed(3)}) ${pos.toFixed(2)}%`)
    }
  } else {
    stops.push('#000 0%')
  }
  stops.push(`#000 ${(100 - far).toFixed(2)}%`)
  if (far > 0) {
    for (let i = 1; i <= N; i++) {
      const pos = 100 - far + (far * i) / N
      const a = ease(1 - i / N)
      stops.push(`rgba(0,0,0,${a.toFixed(3)}) ${pos.toFixed(2)}%`)
    }
  } else {
    stops.push('#000 100%')
  }
  return stops.join(', ')
}

export function buildEdgeFadeMasks(ef: EdgeFade | undefined): { vMask?: string; hMask?: string } {
  const ft = ef?.top || 0, fb = ef?.bottom || 0, fl = ef?.left || 0, fr = ef?.right || 0
  return {
    vMask: (ft || fb) ? `linear-gradient(to bottom, ${axisStops(ft, fb)})` : undefined,
    hMask: (fl || fr) ? `linear-gradient(to right, ${axisStops(fl, fr)})` : undefined,
  }
}
