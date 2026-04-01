import type { StudioLayer, StudioLayerState } from './slide'

export type BroadcastEvent =
  | { event: 'SLIDE_CHANGED'; payload: { slide_id: string; slide_index: number; voting_open: boolean } }
  | { event: 'VOTING_OPENED'; payload: { session_id: string } }
  | { event: 'VOTING_CLOSED'; payload: { session_id: string } }
  | { event: 'SESSION_ENDED'; payload: { session_id: string } }
  | { event: 'RESPONSE_SUBMITTED'; payload: { slide_id: string; participant_id: string } }
  /* Command Studio events */
  | { event: 'STUDIO_EVENT_TRIGGERED'; payload: { slide_id: string; event_id: string; layerStates: Record<string, StudioLayerState> } }
  | { event: 'STUDIO_VOTE_STARTED'; payload: { slide_id: string; event_id: string; question: string; options: { id: string; label: string }[] } }
  | { event: 'STUDIO_VOTE_CAST'; payload: { slide_id: string; event_id: string; option_id: string } }
  | { event: 'STUDIO_VOTE_RESULT'; payload: { slide_id: string; event_id: string; winning_option_id: string; results: Record<string, number> } }
  | { event: 'STUDIO_LAYER_ADDED'; payload: { slide_id: string; layer: StudioLayer } }
  | { event: 'STUDIO_LAYER_REMOVED'; payload: { slide_id: string; layerId: string } }
  | { event: 'STUDIO_EXERCISE_ENDED'; payload: { slide_id: string; duration: number; eventsTriggered: number } }
  /* Command Studio v2 playback events */
  | { event: 'STUDIO_PLAYBACK_START'; payload: { slide_id: string; startTime: number; eventId?: string } }
  | { event: 'STUDIO_PLAYBACK_PAUSE'; payload: { slide_id: string; currentTime: number } }
  | { event: 'STUDIO_LAYER_STATES_UPDATE'; payload: { slide_id: string; layerStates: Record<string, StudioLayerState> } }

export type PresenceState = {
  role: 'presenter' | 'participant'
  session_id: string
  participant_id?: string
  display_name?: string
}
