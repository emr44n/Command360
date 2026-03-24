import type {
  StudioLayer,
  StudioLayerState,
  StudioAction,
  StudioEvent,
} from '@/types/slide'

/**
 * Compute the runtime state for every layer from its initial properties,
 * optionally applying a list of event actions on top.
 */
export function computeLayerStates(
  layers: StudioLayer[],
  eventActions?: StudioAction[]
): Record<string, StudioLayerState> {
  const states: Record<string, StudioLayerState> = {}

  for (const layer of layers) {
    states[layer.id] = {
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

  if (eventActions) {
    for (const action of eventActions) {
      const state = states[action.layerId]
      if (!state) continue
      applyActionToState(state, action)
    }
  }

  return states
}

/**
 * Apply a single event's actions to a set of layer states, returning a new
 * state map (does not mutate the input).
 */
export function applyEvent(
  currentStates: Record<string, StudioLayerState>,
  event: StudioEvent
): Record<string, StudioLayerState> {
  // Deep clone so we don't mutate the caller's object
  const next: Record<string, StudioLayerState> = {}
  for (const [id, state] of Object.entries(currentStates)) {
    next[id] = { ...state }
  }

  for (const action of event.actions) {
    const state = next[action.layerId]
    if (!state) continue
    applyActionToState(state, action)
  }

  return next
}

/** Mutates `state` in place for a single action (instant apply — no animation). */
function applyActionToState(state: StudioLayerState, action: StudioAction) {
  const prop = action.property
  const value = action.toValue

  switch (prop) {
    case 'visible':
      state.visible = value as boolean
      break
    case 'opacity':
      state.opacity = value as number
      break
    case 'x':
      state.x = value as number
      break
    case 'y':
      state.y = value as number
      break
    case 'width':
      state.width = value as number
      break
    case 'height':
      state.height = value as number
      break
    case 'rotation':
      state.rotation = value as number
      break
    case 'src':
      state.src = value as string
      break
  }
}

/** Generate a unique layer ID */
export function generateLayerId(): string {
  return `layer_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

/** Generate a unique event ID */
export function generateEventId(): string {
  return `event_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}
