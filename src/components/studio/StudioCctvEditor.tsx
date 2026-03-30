'use client'

import React, { useCallback } from 'react'
import { Monitor, Grid2x2, LayoutGrid, Columns2, Square } from 'lucide-react'
import type { Slide, StudioContent } from '@/types/slide'

interface StudioCctvEditorProps {
  content: StudioContent
  onContentChange: (content: StudioContent) => void
  slides: Slide[]
  currentSlideId: string
}

type CctvLayout = '1' | '2' | '3' | '4' | '6'

const LAYOUT_OPTIONS: { value: CctvLayout; label: string; icon: React.ReactNode; description: string }[] = [
  { value: '1', label: '1 Panel', icon: <Square className="w-4 h-4" />, description: 'Full screen' },
  { value: '2', label: '2 Panels', icon: <Columns2 className="w-4 h-4" />, description: 'Side by side' },
  { value: '3', label: '3 Panels', icon: <LayoutGrid className="w-4 h-4" />, description: '1 large + 2 stacked' },
  { value: '4', label: '4 Panels', icon: <Grid2x2 className="w-4 h-4" />, description: '2x2 grid' },
  { value: '6', label: '6 Panels', icon: <LayoutGrid className="w-4 h-4" />, description: '3x2 grid' },
]

function getSlotCount(layout: CctvLayout): number {
  return parseInt(layout, 10)
}

/** Visual preview of the grid layout */
function LayoutPreview({ layout }: { layout: CctvLayout }) {
  const cellClass = 'bg-zinc-700 rounded-[2px]'
  switch (layout) {
    case '1':
      return (
        <div className="w-full aspect-video grid grid-cols-1 grid-rows-1 gap-[2px]">
          <div className={cellClass} />
        </div>
      )
    case '2':
      return (
        <div className="w-full aspect-video grid grid-cols-2 grid-rows-1 gap-[2px]">
          <div className={cellClass} />
          <div className={cellClass} />
        </div>
      )
    case '3':
      return (
        <div className="w-full aspect-video grid grid-cols-2 grid-rows-2 gap-[2px]">
          <div className={`${cellClass} row-span-2`} />
          <div className={cellClass} />
          <div className={cellClass} />
        </div>
      )
    case '4':
      return (
        <div className="w-full aspect-video grid grid-cols-2 grid-rows-2 gap-[2px]">
          <div className={cellClass} />
          <div className={cellClass} />
          <div className={cellClass} />
          <div className={cellClass} />
        </div>
      )
    case '6':
      return (
        <div className="w-full aspect-video grid grid-cols-3 grid-rows-2 gap-[2px]">
          <div className={cellClass} />
          <div className={cellClass} />
          <div className={cellClass} />
          <div className={cellClass} />
          <div className={cellClass} />
          <div className={cellClass} />
        </div>
      )
    default:
      return null
  }
}

export function StudioCctvEditor({ content, onContentChange, slides, currentSlideId }: StudioCctvEditorProps) {
  const layout = (content.cctvLayout || '4') as CctvLayout
  const slots = content.cctvSlots || []
  const slotCount = getSlotCount(layout)

  // Filter out the current CCTV slide and other CCTV slides from the picker
  const availableSlides = slides.filter((s) => {
    if (s.id === currentSlideId) return false
    const sc = s.content as StudioContent
    if (sc?.cctvLayout) return false
    return true
  })

  const handleLayoutChange = useCallback(
    (newLayout: CctvLayout) => {
      const newSlotCount = getSlotCount(newLayout)
      // Preserve existing assignments, trim or pad with empty strings
      const newSlots = Array.from({ length: newSlotCount }, (_, i) => slots[i] || '')
      onContentChange({ ...content, cctvLayout: newLayout, cctvSlots: newSlots })
    },
    [content, slots, onContentChange]
  )

  const handleSlotChange = useCallback(
    (index: number, slideId: string) => {
      const newSlots = Array.from({ length: slotCount }, (_, i) => slots[i] || '')
      newSlots[index] = slideId
      onContentChange({ ...content, cctvSlots: newSlots })
    },
    [content, slots, slotCount, onContentChange]
  )

  const getSlideLabel = (slideId: string): string => {
    const slide = slides.find((s) => s.id === slideId)
    if (!slide) return 'Unknown'
    const idx = slides.findIndex((s) => s.id === slideId)
    return slide.title || `Scene ${idx + 1}`
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-[#313338]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#1e1f22] flex items-center gap-2">
        <Monitor className="w-4 h-4 text-indigo-400" />
        <span className="text-sm font-semibold text-zinc-200">CCTV Configuration</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Layout selector */}
        <div>
          <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2 block">
            Layout
          </label>
          <div className="grid grid-cols-5 gap-2">
            {LAYOUT_OPTIONS.map((opt) => {
              const isActive = layout === opt.value
              return (
                <button
                  key={opt.value}
                  onClick={() => handleLayoutChange(opt.value)}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-lg border transition-all cursor-pointer ${
                    isActive
                      ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300'
                      : 'border-[#3f4147] bg-[#2b2d31] text-zinc-400 hover:border-zinc-500 hover:text-zinc-200'
                  }`}
                >
                  <div className="w-12">
                    <LayoutPreview layout={opt.value} />
                  </div>
                  <span className="text-[10px] font-medium">{opt.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Grid preview with slot assignment */}
        <div>
          <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2 block">
            Slot Assignment
          </label>
          <div className="bg-[#1e1f22] rounded-lg p-3">
            <CctvGridPreview
              layout={layout}
              slots={slots}
              slotCount={slotCount}
              availableSlides={availableSlides}
              allSlides={slides}
              onSlotChange={handleSlotChange}
              getSlideLabel={getSlideLabel}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

/** Renders the CCTV grid with slot cards arranged in the actual layout */
function CctvGridPreview({
  layout,
  slots,
  slotCount,
  availableSlides,
  allSlides,
  onSlotChange,
  getSlideLabel,
}: {
  layout: CctvLayout
  slots: string[]
  slotCount: number
  availableSlides: Slide[]
  allSlides: Slide[]
  onSlotChange: (index: number, slideId: string) => void
  getSlideLabel: (id: string) => string
}) {
  const slotCards = Array.from({ length: slotCount }, (_, i) => {
    const assignedId = slots[i] || ''
    const isAssigned = !!assignedId && allSlides.some((s) => s.id === assignedId)
    return (
      <div
        key={i}
        className={`rounded-md border flex flex-col items-center justify-center gap-2 p-3 transition-all ${
          isAssigned
            ? 'border-indigo-500/40 bg-indigo-500/5'
            : 'border-[#3f4147] bg-[#2b2d31]'
        }`}
      >
        <span className="text-[10px] font-bold text-zinc-500 uppercase">Slot {i + 1}</span>
        {isAssigned ? (
          <span className="text-xs font-medium text-zinc-200 truncate max-w-full px-1">
            {getSlideLabel(assignedId)}
          </span>
        ) : (
          <span className="text-[11px] text-zinc-600 italic">Empty</span>
        )}
        <select
          value={assignedId}
          onChange={(e) => onSlotChange(i, e.target.value)}
          className="w-full h-6 text-[10px] bg-[#1e1f22] border border-[#3f4147] rounded px-1 text-zinc-300 outline-none focus:border-indigo-500 cursor-pointer"
        >
          <option value="">-- None --</option>
          {availableSlides.map((s) => {
            const idx = allSlides.findIndex((sl) => sl.id === s.id)
            return (
              <option key={s.id} value={s.id}>
                {s.title || `Scene ${idx + 1}`}
              </option>
            )
          })}
        </select>
      </div>
    )
  })

  // Arrange slot cards according to the layout grid
  switch (layout) {
    case '1':
      return <div className="grid grid-cols-1 gap-2 aspect-video">{slotCards}</div>
    case '2':
      return <div className="grid grid-cols-2 gap-2 aspect-video">{slotCards}</div>
    case '3':
      return (
        <div className="grid grid-cols-2 grid-rows-2 gap-2 aspect-video">
          <div className="row-span-2">{slotCards[0]}</div>
          {slotCards[1]}
          {slotCards[2]}
        </div>
      )
    case '4':
      return <div className="grid grid-cols-2 grid-rows-2 gap-2 aspect-video">{slotCards}</div>
    case '6':
      return <div className="grid grid-cols-3 grid-rows-2 gap-2 aspect-video">{slotCards}</div>
    default:
      return <div className="grid grid-cols-2 gap-2">{slotCards}</div>
  }
}
