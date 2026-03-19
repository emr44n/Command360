import { create } from 'zustand'
import type { Slide } from '@/types/slide'

interface EditorState {
  selectedSlideId: string | null
  slides: Slide[]
  isDirty: boolean
  setSelectedSlideId: (id: string | null) => void
  setSlides: (slides: Slide[]) => void
  updateSlide: (id: string, data: Partial<Slide>) => void
  addSlide: (slide: Slide) => void
  removeSlide: (id: string) => void
  setIsDirty: (v: boolean) => void
}

export const useEditorStore = create<EditorState>((set) => ({
  selectedSlideId: null,
  slides: [],
  isDirty: false,
  setSelectedSlideId: (id) => set({ selectedSlideId: id }),
  setSlides: (slides) => set({ slides }),
  updateSlide: (id, data) => set((s) => ({
    slides: s.slides.map((slide) => slide.id === id ? { ...slide, ...data } : slide),
    isDirty: true,
  })),
  addSlide: (slide) => set((s) => ({ slides: [...s.slides, slide] })),
  removeSlide: (id) => set((s) => ({ slides: s.slides.filter((slide) => slide.id !== id) })),
  setIsDirty: (v) => set({ isDirty: v }),
}))
