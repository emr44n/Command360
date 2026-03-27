// ── Session Recording & Playback ──
//
// Captures presenter actions during a live session for later replay.
// Each entry is timestamped relative to the session start so playback
// can seek to any point and reconstruct the session state.

export interface SessionRecordingEntry {
  timestamp: number // ms from session start
  type:
    | 'slide_change'
    | 'event_triggered'
    | 'vote_started'
    | 'vote_closed'
    | 'playback_seek'
  payload: Record<string, unknown>
}

export interface SessionRecording {
  id: string
  sessionId: string
  presentationId: string
  startedAt: string
  endedAt?: string
  entries: SessionRecordingEntry[]
  totalDuration: number
}

// ── Recorder ──

export class SessionRecorder {
  private entries: SessionRecordingEntry[] = []
  private startTime: number = 0
  private recording = false

  /** Begin a new recording, clearing any previous entries. */
  start(): void {
    this.startTime = Date.now()
    this.entries = []
    this.recording = true
  }

  /** Append an entry. No-op if the recorder has not been started. */
  record(
    type: SessionRecordingEntry['type'],
    payload: Record<string, unknown>
  ): void {
    if (!this.recording) return
    this.entries.push({
      timestamp: Date.now() - this.startTime,
      type,
      payload,
    })
  }

  /** Stop recording and return a copy of all captured entries. */
  stop(): SessionRecordingEntry[] {
    this.recording = false
    return [...this.entries]
  }

  /** Whether the recorder is actively capturing. */
  isRecording(): boolean {
    return this.recording
  }

  /** Return a snapshot of entries captured so far. */
  getEntries(): SessionRecordingEntry[] {
    return [...this.entries]
  }

  /** Total elapsed time in ms since start (0 if not started). */
  getElapsedMs(): number {
    if (this.startTime === 0) return 0
    return Date.now() - this.startTime
  }

  /** Build a full SessionRecording object. */
  toRecording(meta: {
    id: string
    sessionId: string
    presentationId: string
  }): SessionRecording {
    return {
      ...meta,
      startedAt: new Date(this.startTime).toISOString(),
      endedAt: this.recording ? undefined : new Date().toISOString(),
      entries: [...this.entries],
      totalDuration: this.getElapsedMs(),
    }
  }
}

// ── Playback helpers ──

/**
 * Returns every entry that has occurred at or before `timeMs`.
 * Useful for reconstructing session state up to a given moment.
 */
export function getEntriesUpToTime(
  entries: SessionRecordingEntry[],
  timeMs: number
): SessionRecordingEntry[] {
  return entries.filter((e) => e.timestamp <= timeMs)
}

/**
 * Returns the single next entry that will occur after `timeMs`,
 * or null if none remain.
 */
export function getNextEntry(
  entries: SessionRecordingEntry[],
  timeMs: number
): SessionRecordingEntry | null {
  return entries.find((e) => e.timestamp > timeMs) ?? null
}

/**
 * Returns entries that fall within the half-open interval [fromMs, toMs).
 * Handy for rendering a "what happened in this window" view.
 */
export function getEntriesInRange(
  entries: SessionRecordingEntry[],
  fromMs: number,
  toMs: number
): SessionRecordingEntry[] {
  return entries.filter((e) => e.timestamp >= fromMs && e.timestamp < toMs)
}

/**
 * Groups entries by type for summary analytics.
 */
export function groupEntriesByType(
  entries: SessionRecordingEntry[]
): Record<SessionRecordingEntry['type'], SessionRecordingEntry[]> {
  const groups: Record<string, SessionRecordingEntry[]> = {
    slide_change: [],
    event_triggered: [],
    vote_started: [],
    vote_closed: [],
    playback_seek: [],
  }
  for (const entry of entries) {
    groups[entry.type]?.push(entry)
  }
  return groups as Record<SessionRecordingEntry['type'], SessionRecordingEntry[]>
}
