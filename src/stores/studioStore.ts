import { create } from 'zustand'

interface StudioEditorState {
  selectedLayerId: string | null
  selectedClipId: string | null
  selectedKeyframeId: string | null
  selectedTrackId: string | null
  activeTool: 'select' | 'pan' | 'transform'
  zoom: number
  panelSizes: { left: number; right: number; bottom: number }
  clipboard: { type: 'clip' | 'keyframe'; data: unknown } | null
  // Actions
  setSelectedLayerId: (id: string | null) => void
  setSelectedClipId: (id: string | null) => void
  setSelectedKeyframeId: (id: string | null) => void
  setSelectedTrackId: (id: string | null) => void
  setActiveTool: (tool: 'select' | 'pan' | 'transform') => void
  setZoom: (zoom: number) => void
  setPanelSize: (panel: 'left' | 'right' | 'bottom', size: number) => void
  setClipboard: (data: StudioEditorState['clipboard']) => void
  clearSelection: () => void
}

export const useStudioStore = create<StudioEditorState>((set) => ({
  selectedLayerId: null,
  selectedClipId: null,
  selectedKeyframeId: null,
  selectedTrackId: null,
  activeTool: 'select',
  zoom: 1,
  panelSizes: { left: 260, right: 300, bottom: 240 },
  clipboard: null,

  setSelectedLayerId: (id) => set({ selectedLayerId: id }),
  setSelectedClipId: (id) => set({ selectedClipId: id }),
  setSelectedKeyframeId: (id) => set({ selectedKeyframeId: id }),
  setSelectedTrackId: (id) => set({ selectedTrackId: id }),
  setActiveTool: (tool) => set({ activeTool: tool }),
  setZoom: (zoom) => set({ zoom: Math.max(0.1, Math.min(5, zoom)) }),
  setPanelSize: (panel, size) =>
    set((state) => ({
      panelSizes: { ...state.panelSizes, [panel]: Math.max(0, size) },
    })),
  setClipboard: (data) => set({ clipboard: data }),
  clearSelection: () =>
    set({
      selectedLayerId: null,
      selectedClipId: null,
      selectedKeyframeId: null,
      selectedTrackId: null,
    }),
}))
