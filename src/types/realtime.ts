export type BroadcastEvent =
  | { event: 'SLIDE_CHANGED'; payload: { slide_id: string; slide_index: number; voting_open: boolean } }
  | { event: 'VOTING_OPENED'; payload: { session_id: string } }
  | { event: 'VOTING_CLOSED'; payload: { session_id: string } }
  | { event: 'SESSION_ENDED'; payload: { session_id: string } }
  | { event: 'RESPONSE_SUBMITTED'; payload: { slide_id: string; participant_id: string } }

export type PresenceState = {
  role: 'presenter' | 'participant'
  session_id: string
  participant_id?: string
  display_name?: string
}
