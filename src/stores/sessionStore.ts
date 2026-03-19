import { create } from 'zustand'
import type { Session } from '@/types/session'
import type { Slide } from '@/types/slide'

interface SessionState {
  session: Session | null
  slides: Slide[]
  currentSlideIndex: number
  participantCount: number
  responseCount: number
  setSession: (session: Session) => void
  setSlides: (slides: Slide[]) => void
  setCurrentSlideIndex: (index: number) => void
  setParticipantCount: (count: number) => void
  incrementParticipants: () => void
  decrementParticipants: () => void
  setResponseCount: (count: number) => void
  incrementResponses: () => void
  reset: () => void
}

export const useSessionStore = create<SessionState>((set) => ({
  session: null,
  slides: [],
  currentSlideIndex: 0,
  participantCount: 0,
  responseCount: 0,
  setSession: (session) => set({ session }),
  setSlides: (slides) => set({ slides }),
  setCurrentSlideIndex: (index) => set({ currentSlideIndex: index }),
  setParticipantCount: (count) => set({ participantCount: count }),
  incrementParticipants: () => set((s) => ({ participantCount: s.participantCount + 1 })),
  decrementParticipants: () => set((s) => ({ participantCount: Math.max(0, s.participantCount - 1) })),
  setResponseCount: (count) => set({ responseCount: count }),
  incrementResponses: () => set((s) => ({ responseCount: s.responseCount + 1 })),
  reset: () => set({
    session: null,
    slides: [],
    currentSlideIndex: 0,
    participantCount: 0,
    responseCount: 0,
  }),
}))
