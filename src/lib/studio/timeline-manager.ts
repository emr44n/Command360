import type {
  StudioContent,
  StudioLayer,
  StudioTrack,
  StudioClip,
  StudioKeyframe,
  StudioTimelineEvent,
} from '@/types/slide'

// ── Helpers ──

function cloneContent(content: StudioContent): StudioContent {
  return JSON.parse(JSON.stringify(content))
}

function findClipInTracks(
  tracks: StudioTrack[],
  clipId: string
): { track: StudioTrack; clip: StudioClip; clipIndex: number } | null {
  for (const track of tracks) {
    const clipIndex = track.clips.findIndex((c) => c.id === clipId)
    if (clipIndex !== -1) {
      return { track, clip: track.clips[clipIndex], clipIndex }
    }
  }
  return null
}

// ── Track operations ──

export function addTrackForLayer(
  content: StudioContent,
  layer: StudioLayer
): StudioContent {
  const result = cloneContent(content)
  if (!result.tracks) result.tracks = []

  // Don't create duplicate tracks for the same layer
  if (result.tracks.some((t) => t.layerId === layer.id)) {
    return result
  }

  const track: StudioTrack = {
    id: crypto.randomUUID(),
    layerId: layer.id,
    name: layer.name,
    muted: false,
    hidden: false,
    locked: layer.locked,
    color: '#6366f1',
    clips: [],
  }

  result.tracks.push(track)
  return result
}

export function removeTrack(
  content: StudioContent,
  trackId: string
): StudioContent {
  const result = cloneContent(content)
  if (!result.tracks) return result
  result.tracks = result.tracks.filter((t) => t.id !== trackId)
  return result
}

// ── Clip operations ──

export function addClipToTrack(
  content: StudioContent,
  trackId: string,
  startTime: number,
  duration: number
): StudioContent {
  const result = cloneContent(content)
  if (!result.tracks) return result

  const track = result.tracks.find((t) => t.id === trackId)
  if (!track) return result

  const clip: StudioClip = {
    id: crypto.randomUUID(),
    trackId,
    startTime,
    duration,
    trimStart: 0,
    trimEnd: 0,
    keyframes: [],
  }

  track.clips.push(clip)
  return result
}

export function moveClip(
  content: StudioContent,
  clipId: string,
  newStartTime: number,
  newTrackId?: string
): StudioContent {
  const result = cloneContent(content)
  if (!result.tracks) return result

  const found = findClipInTracks(result.tracks, clipId)
  if (!found) return result

  if (newTrackId && newTrackId !== found.track.id) {
    // Move clip to a different track
    found.track.clips.splice(found.clipIndex, 1)
    const targetTrack = result.tracks.find((t) => t.id === newTrackId)
    if (!targetTrack) return result
    found.clip.trackId = newTrackId
    found.clip.startTime = Math.max(0, newStartTime)
    targetTrack.clips.push(found.clip)
  } else {
    found.clip.startTime = Math.max(0, newStartTime)
  }

  return result
}

export function resizeClip(
  content: StudioContent,
  clipId: string,
  newDuration: number
): StudioContent {
  const result = cloneContent(content)
  if (!result.tracks) return result

  const found = findClipInTracks(result.tracks, clipId)
  if (!found) return result

  found.clip.duration = Math.max(1, newDuration)
  return result
}

export function trimClip(
  content: StudioContent,
  clipId: string,
  trimStart: number,
  trimEnd: number
): StudioContent {
  const result = cloneContent(content)
  if (!result.tracks) return result

  const found = findClipInTracks(result.tracks, clipId)
  if (!found) return result

  found.clip.trimStart = Math.max(0, trimStart)
  found.clip.trimEnd = Math.max(0, trimEnd)
  return result
}

export function splitClipAtTime(
  content: StudioContent,
  clipId: string,
  timeMs: number
): StudioContent {
  const result = cloneContent(content)
  if (!result.tracks) return result

  const found = findClipInTracks(result.tracks, clipId)
  if (!found) return result

  const { clip, track } = found

  // timeMs must be within the clip's range (exclusive of edges)
  if (timeMs <= clip.startTime || timeMs >= clip.startTime + clip.duration) {
    return result
  }

  const splitPoint = timeMs - clip.startTime // local time within clip

  // First half: original clip shortened
  const firstDuration = splitPoint
  // Second half: new clip starting at timeMs
  const secondDuration = clip.duration - splitPoint

  // Partition keyframes
  const firstKeyframes: StudioKeyframe[] = []
  const secondKeyframes: StudioKeyframe[] = []

  for (const kf of clip.keyframes) {
    if (kf.time < splitPoint) {
      firstKeyframes.push({ ...kf })
    } else {
      secondKeyframes.push({
        ...kf,
        id: crypto.randomUUID(),
        time: kf.time - splitPoint,
      })
    }
  }

  // Update original clip
  clip.duration = firstDuration
  clip.keyframes = firstKeyframes

  // Create new clip
  const newClip: StudioClip = {
    id: crypto.randomUUID(),
    trackId: track.id,
    startTime: timeMs,
    duration: secondDuration,
    trimStart: 0,
    trimEnd: clip.trimEnd,
    keyframes: secondKeyframes,
  }

  // Original clip loses its trimEnd (the new clip inherits it)
  clip.trimEnd = 0

  track.clips.push(newClip)
  return result
}

export function deleteClip(
  content: StudioContent,
  clipId: string
): StudioContent {
  const result = cloneContent(content)
  if (!result.tracks) return result

  for (const track of result.tracks) {
    const idx = track.clips.findIndex((c) => c.id === clipId)
    if (idx !== -1) {
      track.clips.splice(idx, 1)
      break
    }
  }

  return result
}

// ── Keyframe operations ──

export function addKeyframe(
  content: StudioContent,
  clipId: string,
  keyframe: Omit<StudioKeyframe, 'id'>
): StudioContent {
  const result = cloneContent(content)
  if (!result.tracks) return result

  const found = findClipInTracks(result.tracks, clipId)
  if (!found) return result

  const newKeyframe: StudioKeyframe = {
    id: crypto.randomUUID(),
    ...keyframe,
  }

  found.clip.keyframes.push(newKeyframe)
  return result
}

export function updateKeyframe(
  content: StudioContent,
  clipId: string,
  keyframeId: string,
  updates: Partial<StudioKeyframe>
): StudioContent {
  const result = cloneContent(content)
  if (!result.tracks) return result

  const found = findClipInTracks(result.tracks, clipId)
  if (!found) return result

  const kf = found.clip.keyframes.find((k) => k.id === keyframeId)
  if (!kf) return result

  if (updates.time !== undefined) kf.time = updates.time
  if (updates.property !== undefined) kf.property = updates.property
  if (updates.value !== undefined) kf.value = updates.value
  if (updates.easing !== undefined) kf.easing = updates.easing

  return result
}

export function deleteKeyframe(
  content: StudioContent,
  clipId: string,
  keyframeId: string
): StudioContent {
  const result = cloneContent(content)
  if (!result.tracks) return result

  const found = findClipInTracks(result.tracks, clipId)
  if (!found) return result

  found.clip.keyframes = found.clip.keyframes.filter(
    (k) => k.id !== keyframeId
  )
  return result
}

// ── Timeline event operations ──

export function addTimelineEvent(
  content: StudioContent,
  event: Omit<StudioTimelineEvent, 'id'>
): StudioContent {
  const result = cloneContent(content)
  if (!result.timelineEvents) result.timelineEvents = []

  const newEvent: StudioTimelineEvent = {
    id: crypto.randomUUID(),
    ...event,
  }

  result.timelineEvents.push(newEvent)
  return result
}

export function removeTimelineEvent(
  content: StudioContent,
  eventId: string
): StudioContent {
  const result = cloneContent(content)
  if (!result.timelineEvents) return result
  result.timelineEvents = result.timelineEvents.filter((e) => e.id !== eventId)
  return result
}

export function updateTimelineEvent(
  content: StudioContent,
  eventId: string,
  updates: Partial<StudioTimelineEvent>
): StudioContent {
  const result = cloneContent(content)
  if (!result.timelineEvents) return result

  const event = result.timelineEvents.find((e) => e.id === eventId)
  if (!event) return result

  Object.assign(event, updates, { id: eventId }) // preserve id
  return result
}

// ── Duration computation ──

export function computeTotalDuration(content: StudioContent): number {
  let maxEnd = 0

  // Check clip end times
  if (content.tracks) {
    for (const track of content.tracks) {
      for (const clip of track.clips) {
        const clipEnd = clip.startTime + clip.duration
        if (clipEnd > maxEnd) maxEnd = clipEnd
      }
    }
  }

  // Check timeline event end times
  if (content.timelineEvents) {
    for (const event of content.timelineEvents) {
      const eventEnd = event.timelinePosition + event.duration
      if (eventEnd > maxEnd) maxEnd = eventEnd
    }
  }

  return maxEnd
}
