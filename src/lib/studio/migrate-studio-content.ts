import type {
  StudioContent,
  StudioTrack,
  StudioClip,
  StudioKeyframe,
  StudioTimelineEvent,
  StudioEvent,
  StudioAction,
} from '@/types/slide'

const DEFAULT_CLIP_DURATION = 5000 // 5 seconds

/**
 * Migrate a StudioContent object from v1 (action-based events) to v2
 * (timeline tracks + clips + keyframes).
 *
 * If the content already has populated tracks, it is returned as-is.
 */
export function migrateStudioContent(content: StudioContent): StudioContent {
  // Already migrated — tracks exist and have entries
  if (content.tracks && content.tracks.length > 0) {
    return content
  }

  const result: StudioContent = JSON.parse(JSON.stringify(content))

  // Fix legacy blue canvas background
  if (result.canvas?.backgroundColor === '#1a1a2e') {
    result.canvas.backgroundColor = '#ffffff'
  }

  // ── Build tracks from layers ──

  const tracks: StudioTrack[] = result.layers.map((layer) => {
    const trackId = crypto.randomUUID()
    const clipId = crypto.randomUUID()

    // Collect keyframes from legacy actions that target this layer
    const keyframes: StudioKeyframe[] = []

    for (const event of result.events ?? []) {
      for (const action of event.actions) {
        if (action.layerId !== layer.id) continue
        keyframes.push(...convertActionToKeyframes(action))
      }
    }

    const clip: StudioClip = {
      id: clipId,
      trackId,
      startTime: 0,
      duration: DEFAULT_CLIP_DURATION,
      trimStart: 0,
      trimEnd: 0,
      keyframes,
    }

    return {
      id: trackId,
      layerId: layer.id,
      name: layer.name,
      muted: false,
      hidden: false,
      locked: layer.locked,
      color: '#6366f1',
      clips: [clip],
    }
  })

  // ── Convert legacy events to timeline events ──

  const timelineEvents: StudioTimelineEvent[] = (result.events ?? []).map(
    (event, index) => convertEventToTimelineEvent(event, index)
  )

  result.tracks = tracks
  result.timelineEvents = timelineEvents
  result.totalDuration = computeMigratedDuration(tracks, timelineEvents)

  return result
}

// ── Internal helpers ──

function convertActionToKeyframes(action: StudioAction): StudioKeyframe[] {
  const keyframes: StudioKeyframe[] = []
  const property = action.property as StudioKeyframe['property']

  // If there is a fromValue, create a keyframe at the action's delay time
  if (action.fromValue !== undefined) {
    keyframes.push({
      id: crypto.randomUUID(),
      time: action.delay,
      property,
      value: action.fromValue,
      easing: 'linear',
    })
  }

  // Create a keyframe at delay + duration with the target value
  keyframes.push({
    id: crypto.randomUUID(),
    time: action.delay + action.duration,
    property,
    value: action.toValue,
    easing: action.easing ?? 'linear',
  })

  return keyframes
}

function convertEventToTimelineEvent(
  event: StudioEvent,
  index: number
): StudioTimelineEvent {
  // Compute how long the event's actions span
  let maxEnd = 0
  for (const action of event.actions) {
    const actionEnd = action.delay + action.duration + (action.endDelay ?? 0)
    if (actionEnd > maxEnd) maxEnd = actionEnd
  }

  return {
    id: crypto.randomUUID(),
    name: event.name,
    categoryId: event.categoryId,
    color: event.color,
    icon: event.icon,
    timelinePosition: index * 1000, // space events 1s apart by default
    duration: Math.max(maxEnd, 500), // minimum 500ms
    trigger: event.trigger,
    voteQuestion: event.voteQuestion,
    voteOptions: event.voteOptions
      ? JSON.parse(JSON.stringify(event.voteOptions))
      : undefined,
  }
}

function computeMigratedDuration(
  tracks: StudioTrack[],
  events: StudioTimelineEvent[]
): number {
  let max = 0

  for (const track of tracks) {
    for (const clip of track.clips) {
      const end = clip.startTime + clip.duration
      if (end > max) max = end
    }
  }

  for (const event of events) {
    const end = event.timelinePosition + event.duration
    if (end > max) max = end
  }

  return max
}
