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
 * Preserves v1 events (with actions) as the canonical event list.
 * If timelineEvents exist but events are empty, reverse-migrates them.
 */
export function migrateStudioContent(content: StudioContent): StudioContent {
  const result: StudioContent = JSON.parse(JSON.stringify(content))

  // Fix legacy blue canvas background
  if (result.canvas?.backgroundColor === '#1a1a2e') {
    result.canvas.backgroundColor = '#ffffff'
  }

  // ── Reverse-migrate: if we have timelineEvents but no events, create events from them ──
  if (
    (!result.events || result.events.length === 0) &&
    result.timelineEvents &&
    result.timelineEvents.length > 0
  ) {
    result.events = result.timelineEvents.map((te) => ({
      id: te.id,
      name: te.name,
      categoryId: te.categoryId,
      icon: te.icon,
      color: te.color,
      trigger: te.trigger,
      voteQuestion: te.voteQuestion,
      voteOptions: te.voteOptions
        ? JSON.parse(JSON.stringify(te.voteOptions))
        : undefined,
      actions: [], // actions were lost during original v1->v2 migration
    }))
  }

  // ── Build tracks from layers if not already present ──
  if (!result.tracks || result.tracks.length === 0) {
    const tracks: StudioTrack[] = result.layers.map((layer) => {
      const trackId = crypto.randomUUID()
      const clipId = crypto.randomUUID()

      // Collect keyframes from events that target this layer
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

    result.tracks = tracks

    // Also create timeline event markers (for visual display)
    if (!result.timelineEvents || result.timelineEvents.length === 0) {
      result.timelineEvents = (result.events ?? []).map((event, index) =>
        convertEventToTimelineEvent(event, index)
      )
    }

    result.totalDuration = computeMigratedDuration(
      result.tracks,
      result.timelineEvents ?? []
    )
  }

  // Ensure events array always exists
  if (!result.events) {
    result.events = []
  }

  return result
}

// ── Internal helpers ──

function convertActionToKeyframes(action: StudioAction): StudioKeyframe[] {
  const keyframes: StudioKeyframe[] = []
  const property = action.property as StudioKeyframe['property']

  if (action.fromValue !== undefined) {
    keyframes.push({
      id: crypto.randomUUID(),
      time: action.delay,
      property,
      value: action.fromValue,
      easing: 'linear',
    })
  }

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
    timelinePosition: index * 1000,
    duration: Math.max(maxEnd, 500),
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
