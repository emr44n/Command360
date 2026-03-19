import { create } from 'zustand'

interface ParticipantState {
  participantId: string | null
  clientToken: string | null
  displayName: string | null
  sessionId: string | null
  score: number
  hasResponded: boolean
  setParticipant: (data: { participantId: string; clientToken: string; displayName: string; sessionId: string }) => void
  setScore: (score: number) => void
  setHasResponded: (v: boolean) => void
  reset: () => void
}

export const useParticipantStore = create<ParticipantState>((set) => ({
  participantId: null,
  clientToken: null,
  displayName: null,
  sessionId: null,
  score: 0,
  hasResponded: false,
  setParticipant: (data) => set({
    participantId: data.participantId,
    clientToken: data.clientToken,
    displayName: data.displayName,
    sessionId: data.sessionId,
  }),
  setScore: (score) => set({ score }),
  setHasResponded: (v) => set({ hasResponded: v }),
  reset: () => set({
    participantId: null,
    clientToken: null,
    displayName: null,
    sessionId: null,
    score: 0,
    hasResponded: false,
  }),
}))
