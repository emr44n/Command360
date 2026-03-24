import { create } from 'zustand'

interface StudioPlaybackState {
  currentTime: number // ms
  isPlaying: boolean
  playbackRate: number
  looping: boolean
  activeEventId: string | null
  // Actions
  play: () => void
  pause: () => void
  stop: () => void
  seek: (timeMs: number) => void
  setRate: (rate: number) => void
  setActiveEvent: (eventId: string | null) => void
  tick: (deltaMs: number) => void
}

export const useStudioPlaybackStore = create<StudioPlaybackState>(
  (set, get) => ({
    currentTime: 0,
    isPlaying: false,
    playbackRate: 1,
    looping: false,
    activeEventId: null,

    play: () => set({ isPlaying: true }),
    pause: () => set({ isPlaying: false }),
    stop: () => set({ isPlaying: false, currentTime: 0 }),
    seek: (timeMs) => set({ currentTime: Math.max(0, timeMs) }),
    setRate: (rate) =>
      set({ playbackRate: Math.max(0.1, Math.min(4, rate)) }),
    setActiveEvent: (eventId) => set({ activeEventId: eventId }),
    tick: (deltaMs) => {
      const state = get()
      if (!state.isPlaying) return
      const newTime = state.currentTime + deltaMs * state.playbackRate
      set({ currentTime: Math.max(0, newTime) })
    },
  })
)
