import type {
  StudioLayer,
  StudioLayerState,
  StudioTrack,
  StudioClip,
  StudioKeyframe,
} from '@/types/slide'

// ── Easing functions ──

export const easingFunctions: Record<string, (t: number) => number> = {
  linear: (t: number) => t,
  'ease-in': (t: number) => t * t,
  'ease-out': (t: number) => 1 - (1 - t) * (1 - t),
  'ease-in-out': (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
}

// ── Interpolation ──

/**
 * Interpolates between two numeric values using a progress (0..1) and an
 * easing function name. Falls back to linear for unknown easing names.
 */
export function interpolateValue(
  from: number,
  to: number,
  progress: number,
  easing: string
): number {
  const clampedProgress = Math.max(0, Math.min(1, progress))
  const easeFn = easingFunctions[easing] ?? easingFunctions.linear
  const easedProgress = easeFn(clampedProgress)
  return from + (to - from) * easedProgress
}

// ── Clip lookup ──

/**
 * Returns the clip that is active at the given timeline time, or null if no
 * clip covers that moment.
 */
export function getActiveClipAtTime(
  track: StudioTrack,
  timeMs: number
): StudioClip | null {
  for (const clip of track.clips) {
    if (timeMs >= clip.startTime && timeMs < clip.startTime + clip.duration) {
      return clip
    }
  }
  return null
}

// ── Keyframe helpers ──

const ANIMATABLE_PROPERTIES = [
  'x',
  'y',
  'width',
  'height',
  'rotation',
  'opacity',
  'visible',
] as const

type AnimatableProperty = (typeof ANIMATABLE_PROPERTIES)[number]

function getKeyframesForProperty(
  clip: StudioClip,
  property: string
): StudioKeyframe[] {
  return clip.keyframes
    .filter((kf) => kf.property === property)
    .sort((a, b) => a.time - b.time)
}

function resolveKeyframeValue(
  keyframes: StudioKeyframe[],
  clipLocalTime: number
): number | boolean | string | undefined {
  if (keyframes.length === 0) return undefined

  // Before or at the first keyframe
  if (clipLocalTime <= keyframes[0].time) {
    return keyframes[0].value
  }

  // After or at the last keyframe
  if (clipLocalTime >= keyframes[keyframes.length - 1].time) {
    return keyframes[keyframes.length - 1].value
  }

  // Between two keyframes — find the surrounding pair
  for (let i = 0; i < keyframes.length - 1; i++) {
    const kfBefore = keyframes[i]
    const kfAfter = keyframes[i + 1]

    if (clipLocalTime >= kfBefore.time && clipLocalTime < kfAfter.time) {
      const span = kfAfter.time - kfBefore.time
      if (span === 0) return kfBefore.value

      const progress = (clipLocalTime - kfBefore.time) / span

      // Boolean / string values snap — no interpolation
      if (
        typeof kfBefore.value === 'boolean' ||
        typeof kfBefore.value === 'string' ||
        typeof kfAfter.value === 'boolean' ||
        typeof kfAfter.value === 'string'
      ) {
        return progress < 0.5 ? kfBefore.value : kfAfter.value
      }

      return interpolateValue(
        kfBefore.value as number,
        kfAfter.value as number,
        progress,
        kfAfter.easing
      )
    }
  }

  return keyframes[keyframes.length - 1].value
}

// ── Core: compute all layer states at a point in time ──

function buildDefaultState(layer: StudioLayer): StudioLayerState {
  return {
    visible: layer.visible,
    opacity: layer.opacity,
    x: layer.x,
    y: layer.y,
    width: layer.width,
    height: layer.height,
    rotation: layer.rotation,
    src: layer.src,
  }
}

/**
 * Computes the runtime state of every layer at the given timeline time by
 * evaluating tracks, clips, and keyframe interpolation.
 *
 * Returns a map of layerId -> StudioLayerState.
 */
export function computeLayerStatesAtTime(
  layers: StudioLayer[],
  tracks: StudioTrack[],
  timeMs: number
): Record<string, StudioLayerState> {
  const states: Record<string, StudioLayerState> = {}

  // Build a quick lookup: layerId -> track
  const trackByLayerId = new Map<string, StudioTrack>()
  for (const track of tracks) {
    trackByLayerId.set(track.layerId, track)
  }

  for (const layer of layers) {
    const state = buildDefaultState(layer)
    const track = trackByLayerId.get(layer.id)

    if (track && !track.muted) {
      const clip = getActiveClipAtTime(track, timeMs)

      if (clip) {
        const clipLocalTime = timeMs - clip.startTime

        for (const prop of ANIMATABLE_PROPERTIES) {
          const keyframes = getKeyframesForProperty(clip, prop)
          const resolved = resolveKeyframeValue(keyframes, clipLocalTime)

          if (resolved !== undefined) {
            ;(state as unknown as Record<string, unknown>)[prop] = resolved
          }
        }

        // Also handle 'src' which is non-numeric
        const srcKeyframes = getKeyframesForProperty(clip, 'src')
        const resolvedSrc = resolveKeyframeValue(srcKeyframes, clipLocalTime)
        if (resolvedSrc !== undefined) {
          state.src = resolvedSrc as string
        }
      } else if (track.clips.length > 0) {
        // No clip at this time but track has clips — layer is not visible during gaps
        state.visible = false
      }
      // If track has no clips at all, keep layer at default state (always visible)
    }

    // If track is hidden, force invisible
    if (track?.hidden) {
      state.visible = false
    }

    states[layer.id] = state
  }

  return states
}
