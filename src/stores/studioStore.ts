import { create } from 'zustand'

interface StudioEditorState {
  selectedLayerId: string | null
  activeTool: 'select' | 'pan'
  zoom: number
  // Actions
  setSelectedLayerId: (id: string | null) => void
  setActiveTool: (tool: 'select' | 'pan') => void
  setZoom: (zoom: number) => void
}

export const useStudioStore = create<StudioEditorState>((set) => ({
  selectedLayerId: null,
  activeTool: 'select',
  zoom: 1,
  setSelectedLayerId: (id) => set({ selectedLayerId: id }),
  setActiveTool: (tool) => set({ activeTool: tool }),
  setZoom: (zoom) => set({ zoom: Math.max(0.1, Math.min(5, zoom)) }),
}))
