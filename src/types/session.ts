export type SessionStatus = 'waiting' | 'active' | 'paused' | 'ended'

export interface Session {
  id: string
  presentation_id: string
  host_user_id: string
  room_code: string
  status: SessionStatus
  current_slide_id: string | null
  /** studio scene (slide) IDs currently broadcast live for multi-scene rooms */
  live_scene_ids: string[]
  voting_open: boolean
  started_at: string
  ended_at: string | null
  created_at: string
}

export interface Presentation {
  id: string
  user_id: string
  title: string
  description?: string
  thumbnail_url?: string
  is_archived: boolean
  created_at: string
  updated_at: string
  /**
   * Reusable branded slide masters for this presentation. Persisted in the
   * `slide_masters` jsonb column (see supabase/migrations — MIGRATIONS_TODO).
   * Optional so the app runs before that column exists (it falls back to
   * per-device localStorage). Typed loosely here to avoid a types→lib cycle;
   * the concrete shape is `SlideMaster` in `@/lib/editor/slide-masters`.
   */
  slide_masters?: unknown[]
}
