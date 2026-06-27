'use client'

import React, { useCallback, useState, useRef, useEffect } from 'react'
import { Monitor, Grid2x2, LayoutGrid, Columns2, Square, ChevronDown } from 'lucide-react'
import type { Slide, StudioContent } from '@/types/slide'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

interface StudioCctvEditorProps {
  content: StudioContent
  onContentChange: (content: StudioContent) => void
  slides: Slide[]
  currentSlideId: string
}

type CctvLayout = '1' | '2' | '3' | '4' | '6' | '8'

const LAYOUT_OPTIONS: { value: CctvLayout; label: string; icon: React.ReactNode; description: string }[] = [
  { value: '1', label: '1', icon: <Square className="w-3.5 h-3.5" />, description: 'Full screen' },
  { value: '2', label: '2', icon: <Columns2 className="w-3.5 h-3.5" />, description: 'Side by side' },
  { value: '3', label: '3', icon: <LayoutGrid className="w-3.5 h-3.5" />, description: '1 large + 2 stacked' },
  { value: '4', label: '4', icon: <Grid2x2 className="w-3.5 h-3.5" />, description: '2×2 grid' },
  { value: '6', label: '6', icon: <LayoutGrid className="w-3.5 h-3.5" />, description: '3×2 grid' },
  { value: '8', label: '8', icon: <LayoutGrid className="w-3.5 h-3.5" />, description: '4×2 grid' },
]

function getSlotCount(layout: CctvLayout): number {
  return parseInt(layout, 10)
}

/** Visual preview of the grid layout */
function LayoutPreview({ layout }: { layout: CctvLayout }) {
  const cellClass = 'bg-[#3f4147] rounded-none'
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
    case '8':
      return (
        <div className="w-full aspect-video grid grid-cols-4 grid-rows-2 gap-[2px]">
          <div className={cellClass} />
          <div className={cellClass} />
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
    <div className="flex flex-col min-w-0 bg-[#2b2d31] text-white">
      {/* Header */}
      <div className="px-2 py-1.5 border-b border-[#1e1f22] flex items-center gap-1.5">
        <Monitor className="w-3.5 h-3.5 text-[#6a5ea8]" />
        <span className="text-[10px] font-semibold text-[#9aa0a8]">CCTV Configuration</span>
      </div>

      <div className="overflow-y-auto p-2 space-y-3">
        {/* Layout selector — compact */}
        <div>
          <label className="text-[9px] font-medium text-[#9aa0a8] mb-1.5 block">
            Layout
          </label>
          <div className="flex gap-1 flex-wrap">
            {LAYOUT_OPTIONS.map((opt) => {
              const isActive = layout === opt.value
              return (
                <Tooltip key={opt.value}><TooltipTrigger asChild>
                <button
                  onClick={() => handleLayoutChange(opt.value)}
                  className={`flex items-center justify-center w-8 h-8 rounded-none border transition-all cursor-pointer ${
                    isActive
                      ? 'border-red-500 bg-red-500/15 text-red-400'
                      : 'border-[#3f4147] bg-[#1e1f22] text-[#9aa0a8] hover:border-[#9aa0a8] hover:text-white'
                  }`}
                >
                  <div className="w-5">
                    <LayoutPreview layout={opt.value} />
                  </div>
                </button>
                </TooltipTrigger><TooltipContent>{opt.description}</TooltipContent></Tooltip>
              )
            })}
          </div>
        </div>

        {/* Scene assignment — visual dropdown list */}
        <div>
          <label className="text-[9px] font-medium text-[#9aa0a8] mb-1.5 block">
            Assign Scenes
          </label>
          <div className="space-y-1">
            {Array.from({ length: slotCount }, (_, i) => {
              const assignedId = slots[i] || ''
              const assigned = assignedId ? slides.find(s => s.id === assignedId) : null
              const assignedContent = assigned ? (assigned.content as StudioContent) : null
              const assignedLayers = assignedContent?.layers || []
              const assignedIdx = assigned ? slides.findIndex(s => s.id === assigned.id) : -1
              return (
                <SceneSlotDropdown
                  key={i}
                  index={i}
                  assignedId={assignedId}
                  assigned={assigned}
                  assignedContent={assignedContent}
                  assignedLayers={assignedLayers}
                  assignedIdx={assignedIdx}
                  availableSlides={availableSlides}
                  allSlides={slides}
                  onSlotChange={handleSlotChange}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

/** Visual dropdown for scene slot assignment */
function SceneSlotDropdown({
  index,
  assignedId,
  assigned,
  assignedContent,
  assignedLayers,
  assignedIdx,
  availableSlides,
  allSlides,
  onSlotChange,
}: {
  index: number
  assignedId: string
  assigned: Slide | null | undefined
  assignedContent: StudioContent | null
  assignedLayers: StudioContent['layers']
  assignedIdx: number
  availableSlides: Slide[]
  allSlides: Slide[]
  onSlotChange: (index: number, slideId: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, width: 0 })
  const dropdownRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
          triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const openDropdown = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setMenuPos({ top: rect.bottom + 2, left: rect.left, width: Math.max(rect.width, 200) })
    }
    setOpen(v => !v)
  }

  const assignedLabel = assigned
    ? (assigned.title || `Scene ${assignedIdx + 1}`)
    : '— Empty —'

  return (
    <div ref={dropdownRef} className="relative flex items-center gap-1.5">
      <span className="text-[8px] font-bold text-[#9aa0a8] w-3 shrink-0">{index + 1}</span>
      {/* Thumbnail of assigned scene */}
      <div className="w-10 min-w-[2.5rem] max-w-[5rem] flex-[0_0_auto] aspect-video rounded-none bg-[#1e1f22] overflow-hidden border border-[#3f4147] relative" style={{ width: 'clamp(2.5rem, 20%, 5rem)' }}>
        {assignedContent ? (
          <div className="w-full h-full relative" style={{ backgroundColor: assignedContent.canvas?.backgroundColor || '#000' }}>
            {assignedLayers.map(layer => layer.visible && layer.src ? (
              <img key={layer.id} src={layer.src} className="absolute object-contain" draggable={false}
                style={{ left: `${layer.x}%`, top: `${layer.y}%`, width: `${layer.width}%`, height: `${layer.height}%` }} />
            ) : null)}
          </div>
        ) : (
          <div className="w-full h-full bg-[#1e1f22]" />
        )}
      </div>
      {/* Dropdown trigger */}
      <button
        ref={triggerRef}
        onClick={openDropdown}
        className="flex-1 h-6 flex items-center justify-between text-[9px] bg-[#1e1f22] border border-[#3f4147] rounded-none text-[#9aa0a8] px-1.5 cursor-pointer hover:border-red-500/50 transition-colors"
      >
        <span className="truncate">{assignedLabel}</span>
        <ChevronDown className={`w-2.5 h-2.5 shrink-0 text-[#9aa0a8] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {/* Dropdown menu — fixed, grid of scene thumbnails */}
      {open && (
        <div ref={dropdownRef} className="fixed z-[9999] bg-[#1e1f22] border border-[#3f4147] rounded-none shadow-2xl p-1.5 max-h-72 overflow-y-auto"
          style={{ top: menuPos.top, left: Math.max(4, menuPos.left), width: Math.min(menuPos.width + 40, Math.max(menuPos.width, 180), window.innerWidth - menuPos.left - 8) }}>
          {/* Empty option */}
          <div
            onClick={() => { onSlotChange(index, ''); setOpen(false) }}
            className="flex items-center gap-1.5 px-1.5 py-1 hover:bg-[#35363c] cursor-pointer rounded-none transition-colors mb-0.5"
          >
            <div className="w-6 h-4 rounded-none bg-[#2b2d31] border border-dashed border-[#3f4147] shrink-0" />
            <span className="text-[8px] text-[#9aa0a8] italic truncate">Empty</span>
          </div>
          <div className="h-px bg-[#2b2d31] my-0.5" />
          {/* Available scenes as a list */}
          {availableSlides.map((s) => {
            const sc = s.content as StudioContent
            const sceneLayers = sc?.layers || []
            const sceneIdx = allSlides.findIndex(sl => sl.id === s.id)
            const sceneName = s.title || `Scene ${sceneIdx + 1}`
            const isSelected = assignedId === s.id
            return (
              <div
                key={s.id}
                onClick={() => { onSlotChange(index, s.id); setOpen(false) }}
                className={`flex items-center gap-1.5 px-1.5 py-1 cursor-pointer rounded-none transition-colors mb-0.5 ${isSelected ? 'bg-red-500/20 ring-1 ring-red-500/40' : 'hover:bg-[#35363c]'}`}
              >
                <div className="w-6 h-4 rounded-none bg-[#1e1f22] overflow-hidden shrink-0 border border-[#3f4147] relative">
                  <div className="w-full h-full relative" style={{ backgroundColor: sc?.canvas?.backgroundColor || '#000' }}>
                    {sceneLayers.slice(0, 2).map(layer => layer.visible && layer.src ? (
                      <img key={layer.id} src={layer.src} className="absolute object-contain" draggable={false}
                        style={{ left: `${layer.x}%`, top: `${layer.y}%`, width: `${layer.width}%`, height: `${layer.height}%` }} />
                    ) : null)}
                  </div>
                </div>
                <span className={`text-[8px] truncate flex-1 ${isSelected ? 'text-red-300 font-medium' : 'text-[#9aa0a8]'}`}>{sceneName}</span>
                {isSelected && <span className="text-[7px] text-red-400 shrink-0">✓</span>}
              </div>
            )
          })}
        </div>
      )}
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
        className={`rounded-none border flex flex-col items-center justify-center gap-2 p-3 transition-all ${
          isAssigned
            ? 'border-[#6a5ea8]/40 bg-[#6a5ea8]/5'
            : 'border-[#3f4147] bg-[#2b2d31]'
        }`}
      >
        <span className="text-[10px] font-bold text-[#9aa0a8] uppercase">Slot {i + 1}</span>
        {isAssigned ? (
          <span className="text-xs font-medium text-white truncate max-w-full px-1">
            {getSlideLabel(assignedId)}
          </span>
        ) : (
          <span className="text-[11px] text-[#9aa0a8] italic">Empty</span>
        )}
        <select
          value={assignedId}
          onChange={(e) => onSlotChange(i, e.target.value)}
          className="w-full h-6 text-[10px] bg-[#1e1f22] border border-[#3f4147] rounded-none px-1 text-[#9aa0a8] outline-none focus:border-[#6a5ea8] cursor-pointer"
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
