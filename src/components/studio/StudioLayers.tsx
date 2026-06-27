'use client'

import React from 'react'
import {
  GripVerticalIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  UnlockIcon,
  Trash2Icon,
  ImageIcon,
  VideoIcon,
  TypeIcon,
  SquareIcon,
  ShieldIcon,
  ShieldOffIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { StudioLayer } from '@/types/slide'

interface StudioLayersProps {
  layers: StudioLayer[]
  selectedLayerId: string | null
  onSelect: (id: string) => void
  onReorder: (fromIndex: number, toIndex: number) => void
  onToggleVisibility: (id: string) => void
  onToggleLock: (id: string) => void
  onToggleMaskImmune?: (id: string) => void
  onDelete: (id: string) => void
}

function layerTypeIcon(type: StudioLayer['type']) {
  switch (type) {
    case 'image':
      return <ImageIcon className="size-3.5 text-[#C9241A]" />
    case 'video':
      return <VideoIcon className="size-3.5 text-[#6a5ea8]" />
    case 'text':
      return <TypeIcon className="size-3.5 text-[#c98a2a]" />
    case 'shape':
      return <SquareIcon className="size-3.5 text-[#2E9E63]" />
  }
}

export function StudioLayers({
  layers,
  selectedLayerId,
  onSelect,
  onReorder,
  onToggleVisibility,
  onToggleLock,
  onToggleMaskImmune,
  onDelete,
}: StudioLayersProps) {
  // Display in reverse z-index order (top layer first)
  const sortedLayers = [...layers].sort((a, b) => b.zIndex - a.zIndex)

  const handleDragStart = (e: React.DragEvent, layerIndex: number) => {
    e.dataTransfer.setData('text/plain', String(layerIndex))
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10)
    if (fromIndex !== targetIndex) {
      // Convert from sorted display indices back to original layer indices
      const fromLayer = sortedLayers[fromIndex]
      const toLayer = sortedLayers[targetIndex]
      const realFrom = layers.findIndex((l) => l.id === fromLayer.id)
      const realTo = layers.findIndex((l) => l.id === toLayer.id)
      if (realFrom >= 0 && realTo >= 0) {
        onReorder(realFrom, realTo)
      }
    }
  }

  return (
    <div className="flex h-full flex-col bg-[#1e1f22] text-white">
      <div className="border-b border-[#2b2d31] px-3 py-2">
        <span className="text-xs font-medium uppercase tracking-wider text-[#9aa0a8]">
          Layers
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {sortedLayers.length === 0 && (
          <p className="p-4 text-center text-xs text-[#9aa0a8]">
            No layers added yet
          </p>
        )}

        {sortedLayers.map((layer, displayIndex) => {
          const isSelected = layer.id === selectedLayerId

          return (
            <div
              key={layer.id}
              draggable
              onDragStart={(e) => handleDragStart(e, displayIndex)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, displayIndex)}
              className={`group flex items-center gap-1 border-b border-[#2b2d31]/50 px-1 py-1 transition-colors ${
                isSelected
                  ? 'bg-[#383a40]'
                  : 'hover:bg-[#2b2d31]/60'
              } ${!layer.visible ? 'opacity-50' : ''}`}
              onClick={() => onSelect(layer.id)}
            >
              {/* Drag handle */}
              <div className="cursor-grab px-0.5 text-[#9aa0a8] active:cursor-grabbing">
                <GripVerticalIcon className="size-3" />
              </div>

              {/* Type icon */}
              <div className="flex-shrink-0">{layerTypeIcon(layer.type)}</div>

              {/* Name */}
              <span className="flex-1 truncate text-xs">{layer.name}</span>

              {/* Visibility toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-[#9aa0a8] transition-colors hover:text-white data-[visible]:opacity-100"
                data-visible={!layer.visible || undefined}
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleVisibility(layer.id)
                }}
                title={layer.visible ? 'Hide' : 'Show'}
              >
                {layer.visible ? (
                  <EyeIcon className="size-3" />
                ) : (
                  <EyeOffIcon className="size-3 text-[#9aa0a8]" />
                )}
              </Button>

              {/* Lock toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-[#9aa0a8] transition-colors hover:text-white data-[locked]:opacity-100"
                data-locked={layer.locked || undefined}
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleLock(layer.id)
                }}
                title={layer.locked ? 'Unlock' : 'Lock'}
              >
                {layer.locked ? (
                  <LockIcon className="size-3 text-[#c98a2a]" />
                ) : (
                  <UnlockIcon className="size-3" />
                )}
              </Button>

              {/* Mask Immune */}
              {onToggleMaskImmune && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-[#9aa0a8] transition-colors hover:text-white data-[immune]:opacity-100"
                  data-immune={layer.maskImmune || undefined}
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleMaskImmune(layer.id)
                  }}
                  title={layer.maskImmune ? 'Remove mask immunity' : 'Make mask immune'}
                >
                  {layer.maskImmune ? (
                    <ShieldIcon className="size-3 text-[#3E6DC4]" />
                  ) : (
                    <ShieldOffIcon className="size-3" />
                  )}
                </Button>
              )}

              {/* Delete */}
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-[#9aa0a8] transition-colors hover:text-[#C9241A]"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(layer.id)
                }}
                title="Delete"
              >
                <Trash2Icon className="size-3" />
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
