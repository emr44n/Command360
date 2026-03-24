import { create } from 'zustand'

interface StudioTimelineState {
  playheadPosition: number // ms
  isPlaying: boolean
  zoomLevel: number // pixels per second (default 100)
  scrollLeft: number // px
  snapping: boolean
  snapInterval: number // ms (default 100)
  // Actions
  setPlayhead: (ms: number) => void
  setPlaying: (playing: boolean) => void
  setZoomLevel: (zoom: number) => void
  setScrollLeft: (px: number) => void
  toggleSnapping: () => void
  setSnapInterval: (ms: number) => void
}

export const useStudioTimelineStore = create<StudioTimelineState>((set) => ({
  playheadPosition: 0,
  isPlaying: false,
  zoomLevel: 100,
  scrollLeft: 0,
  snapping: true,
  snapInterval: 100,

  setPlayhead: (ms) => set({ playheadPosition: Math.max(0, ms) }),
  setPlaying: (playing) => set({ isPlaying: playing }),
  setZoomLevel: (zoom) =>
    set({ zoomLevel: Math.max(10, Math.min(1000, zoom)) }),
  setScrollLeft: (px) => set({ scrollLeft: Math.max(0, px) }),
  toggleSnapping: () => set((state) => ({ snapping: !state.snapping })),
  setSnapInterval: (ms) => set({ snapInterval: Math.max(1, ms) }),
}))
