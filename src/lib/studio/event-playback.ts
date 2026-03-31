import type { StudioEvent, StudioAction, StudioLayer, StudioLayerState } from '@/types/slide'
import { interpolateValue, easingFunctions } from './playback-engine'

export interface EventPlaybackController {
  cancel: () => void
}

/**
 * Plays an event's actions as animations using requestAnimationFrame.
 * Each action independently delays, interpolates, then applies end behaviour.
 *
 * @param event       The event to play
 * @param layers      Current layer definitions (for resolving fromValue defaults)
 * @param onLayerOverride  Called each frame with per-layer property overrides
 * @param onComplete  Called when ALL actions have finished
 * @returns           A controller with a cancel() method
 */
export function playEvent(
  event: StudioEvent,
  layers: StudioLayer[],
  onLayerOverride: (overrides: Record<string, Partial<StudioLayerState>>) => void,
  onComplete: () => void
): EventPlaybackController {
  const actions = event.actions ?? []
  if (actions.length === 0) {
    onComplete()
    return { cancel: () => {} }
  }

  // Build a lookup for current layer values
  const layerMap = new Map<string, StudioLayer>()
  for (const layer of layers) {
    layerMap.set(layer.id, layer)
  }

  let cancelled = false
  let startTime: number | null = null
  let rafId: number | null = null

  // Track which actions have completed
  const actionComplete = new Array(actions.length).fill(false)

  // Compute the total duration of all actions (delay + duration + endDelay)
  const totalDuration = actions.reduce((max, action) => {
    const end = action.delay + action.duration + (action.endDelay ?? 0)
    return Math.max(max, end)
  }, 0)

  function resolveFromValue(action: StudioAction): number | boolean | string {
    if (action.fromValue !== undefined) return action.fromValue
    const layer = layerMap.get(action.layerId)
    if (!layer) return 0
    const prop = action.property
    if (prop === 'opacity') return layer.opacity
    if (prop === 'visible') return layer.visible
    if (prop === 'x') return layer.x
    if (prop === 'y') return layer.y
    if (prop === 'width') return layer.width
    if (prop === 'height') return layer.height
    if (prop === 'rotation') return layer.rotation
    if (prop === 'src') return layer.src ?? ''
    if (prop === 'scaleX') return layer.width
    if (prop === 'scaleY') return layer.height
    if (prop === 'volume') return layer.volume ?? 1
    return 0
  }

  function tick(timestamp: number) {
    if (cancelled) return
    if (startTime === null) startTime = timestamp

    const elapsed = timestamp - startTime
    const overrides: Record<string, Partial<StudioLayerState>> = {}

    for (let i = 0; i < actions.length; i++) {
      const action = actions[i]
      const fromValue = resolveFromValue(action)

      // Not started yet
      if (elapsed < action.delay) continue

      const actionElapsed = elapsed - action.delay

      if (actionElapsed >= action.duration) {
        // Action animation finished
        if (!actionComplete[i]) {
          // Apply final value based on endBehaviour
          if (action.endBehaviour === 'stay') {
            if (!overrides[action.layerId]) overrides[action.layerId] = {}
            ;(overrides[action.layerId] as Record<string, unknown>)[action.property] = action.toValue
          } else if (action.endBehaviour === 'reset') {
            if (!overrides[action.layerId]) overrides[action.layerId] = {}
            ;(overrides[action.layerId] as Record<string, unknown>)[action.property] = fromValue
          } else if (action.endBehaviour === 'fadeOut') {
            // fadeOut: reverse the animation over endDelay
            const fadeElapsed = actionElapsed - action.duration
            const fadeDuration = action.endDelay ?? 500
            if (fadeElapsed < fadeDuration) {
              const progress = fadeElapsed / fadeDuration
              const value = interpolateNumeric(action.toValue, fromValue, progress, action.easing)
              if (!overrides[action.layerId]) overrides[action.layerId] = {}
              ;(overrides[action.layerId] as Record<string, unknown>)[action.property] = value
            } else {
              // Fade out complete — revert to fromValue
              if (!overrides[action.layerId]) overrides[action.layerId] = {}
              ;(overrides[action.layerId] as Record<string, unknown>)[action.property] = fromValue
              actionComplete[i] = true
            }
            continue
          }

          actionComplete[i] = true
        } else {
          // Already complete, keep applying final state
          if (action.endBehaviour === 'stay') {
            if (!overrides[action.layerId]) overrides[action.layerId] = {}
            ;(overrides[action.layerId] as Record<string, unknown>)[action.property] = action.toValue
          }
        }
        continue
      }

      // In progress — interpolate
      const progress = actionElapsed / action.duration
      const value = interpolateNumeric(fromValue, action.toValue, progress, action.easing)
      if (!overrides[action.layerId]) overrides[action.layerId] = {}
      ;(overrides[action.layerId] as Record<string, unknown>)[action.property] = value
    }

    onLayerOverride(overrides)

    // Check if all done
    const allDone = elapsed >= totalDuration + 100 // small buffer
    if (allDone && actionComplete.every(Boolean)) {
      onComplete()
      return
    }

    rafId = requestAnimationFrame(tick)
  }

  rafId = requestAnimationFrame(tick)

  return {
    cancel: () => {
      cancelled = true
      if (rafId !== null) cancelAnimationFrame(rafId)
    },
  }
}

/**
 * Interpolates between two values. For numeric values uses eased interpolation.
 * For boolean/string values, snaps at 50% progress.
 */
function interpolateNumeric(
  from: number | boolean | string,
  to: number | boolean | string,
  progress: number,
  easing: string
): number | boolean | string {
  if (typeof from === 'boolean' || typeof to === 'boolean') {
    return progress < 0.5 ? from : to
  }
  if (typeof from === 'string' || typeof to === 'string') {
    return progress < 0.5 ? from : to
  }
  return interpolateValue(from, to, progress, easing)
}
