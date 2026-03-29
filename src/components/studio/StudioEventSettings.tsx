'use client'

import React, { useState } from 'react'
import {
  Target, X, Plus, Trash2, ChevronDown, Play,
  Image as ImageIcon, Video, Type, Square,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { StudioEvent, StudioAction, StudioLayer, StudioEventCategory, StudioLayerState } from '@/types/slide'
import { useStudioStore } from '@/stores/studioStore'

interface StudioEventSettingsProps {
  event: StudioEvent
  layers: StudioLayer[]
  categories: StudioEventCategory[]
  onUpdateEvent: (event: StudioEvent) => void
  onDeleteEvent: (eventId: string) => void
  onTriggerEvent: (eventId: string) => void
}

const PROPERTY_OPTIONS = [
  { value: 'opacity', label: 'Opacity', min: 0, max: 1, step: 0.05 },
  { value: 'x', label: 'Position X', min: -100, max: 200, step: 1 },
  { value: 'y', label: 'Position Y', min: -100, max: 200, step: 1 },
  { value: 'width', label: 'Width', min: 0, max: 200, step: 1 },
  { value: 'height', label: 'Height', min: 0, max: 200, step: 1 },
  { value: 'rotation', label: 'Rotation', min: 0, max: 360, step: 1 },
  { value: 'visible', label: 'Visibility', min: 0, max: 1, step: 1 },
  { value: 'scaleX', label: 'Scale X', min: 0, max: 200, step: 1 },
  { value: 'scaleY', label: 'Scale Y', min: 0, max: 200, step: 1 },
] as const

const EASING_OPTIONS = [
  { value: 'linear', label: 'Linear' },
  { value: 'ease-in', label: 'Ease In' },
  { value: 'ease-out', label: 'Ease Out' },
  { value: 'ease-in-out', label: 'Ease In-Out' },
]

const END_BEHAVIOUR_OPTIONS = [
  { value: 'stay', label: 'Stay' },
  { value: 'fadeOut', label: 'Fade Out' },
  { value: 'reset', label: 'Reset' },
]

interface PresetDef {
  label: string
  actions: Omit<StudioAction, 'id' | 'layerId'>[]
}

function getPresets(): PresetDef[] {
  return [
    {
      label: 'Fade In',
      actions: [{ property: 'opacity', fromValue: 0, toValue: 1, delay: 0, duration: 500, easing: 'ease-out', endBehaviour: 'stay' }],
    },
    {
      label: 'Fade Out',
      actions: [{ property: 'opacity', fromValue: 1, toValue: 0, delay: 0, duration: 500, easing: 'ease-in', endBehaviour: 'stay' }],
    },
    {
      label: 'Scale Up',
      actions: [
        { property: 'width', fromValue: 5, toValue: 30, delay: 0, duration: 300, easing: 'ease-out', endBehaviour: 'stay' },
        { property: 'height', fromValue: 5, toValue: 30, delay: 0, duration: 300, easing: 'ease-out', endBehaviour: 'stay' },
        { property: 'opacity', fromValue: 0, toValue: 1, delay: 0, duration: 200, easing: 'ease-out', endBehaviour: 'stay' },
      ],
    },
    {
      label: 'Scale Down',
      actions: [
        { property: 'width', fromValue: 30, toValue: 5, delay: 0, duration: 300, easing: 'ease-in', endBehaviour: 'stay' },
        { property: 'height', fromValue: 30, toValue: 5, delay: 0, duration: 300, easing: 'ease-in', endBehaviour: 'stay' },
        { property: 'opacity', fromValue: 1, toValue: 0, delay: 100, duration: 200, easing: 'ease-in', endBehaviour: 'stay' },
      ],
    },
    {
      label: 'Spin',
      actions: [{ property: 'rotation', fromValue: 0, toValue: 360, delay: 0, duration: 800, easing: 'ease-in-out', endBehaviour: 'stay' }],
    },
    {
      label: 'Slide In Left',
      actions: [{ property: 'x', fromValue: -20, toValue: 10, delay: 0, duration: 400, easing: 'ease-out', endBehaviour: 'stay' }],
    },
    {
      label: 'Show',
      actions: [{ property: 'visible', fromValue: false, toValue: true, delay: 0, duration: 0, easing: 'linear', endBehaviour: 'stay' }],
    },
    {
      label: 'Hide',
      actions: [{ property: 'visible', fromValue: true, toValue: false, delay: 0, duration: 0, easing: 'linear', endBehaviour: 'stay' }],
    },
  ]
}

function layerIcon(type: StudioLayer['type']) {
  switch (type) {
    case 'image': return <ImageIcon className="size-3.5 text-red-400" />
    case 'video': return <Video className="size-3.5 text-purple-400" />
    case 'text': return <Type className="size-3.5 text-amber-400" />
    case 'shape': return <Square className="size-3.5 text-emerald-400" />
    default: return null
  }
}

export function StudioEventSettings({
  event,
  layers,
  categories,
  onUpdateEvent,
  onDeleteEvent,
  onTriggerEvent,
}: StudioEventSettingsProps) {
  const {
    objectSelectionMode,
    objectSelectionTargetLayerId,
    startObjectSelection,
    lockObjectSelection,
    cancelObjectSelection,
  } = useStudioStore()

  // New action form state
  const [newProperty, setNewProperty] = useState<string>('opacity')
  const [newFromValue, setNewFromValue] = useState<string>('')
  const [newToValue, setNewToValue] = useState<string>('1')
  const [newDuration, setNewDuration] = useState<number>(500)
  const [newDelay, setNewDelay] = useState<number>(0)
  const [newEasing, setNewEasing] = useState<string>('ease-out')
  const [newEndBehaviour, setNewEndBehaviour] = useState<string>('stay')

  const lockedLayer = layers.find((l) => l.id === objectSelectionTargetLayerId)

  const handleNameChange = (name: string) => {
    onUpdateEvent({ ...event, name })
  }

  const handleColorChange = (color: string) => {
    onUpdateEvent({ ...event, color })
  }

  const handleCategoryChange = (categoryId: string) => {
    onUpdateEvent({ ...event, categoryId: categoryId || undefined })
  }

  const handleAddAction = () => {
    if (!objectSelectionTargetLayerId) return

    const action: StudioAction = {
      id: crypto.randomUUID(),
      layerId: objectSelectionTargetLayerId,
      property: newProperty as StudioAction['property'],
      fromValue: newFromValue !== '' ? (newProperty === 'visible' ? newFromValue === 'true' : parseFloat(newFromValue)) : undefined,
      toValue: newProperty === 'visible' ? newToValue === 'true' : parseFloat(newToValue),
      delay: newDelay,
      duration: newDuration,
      easing: newEasing as StudioAction['easing'],
      endBehaviour: newEndBehaviour as StudioAction['endBehaviour'],
    }

    onUpdateEvent({
      ...event,
      actions: [...event.actions, action],
    })
  }

  const handleDeleteAction = (actionId: string) => {
    onUpdateEvent({
      ...event,
      actions: event.actions.filter((a) => a.id !== actionId),
    })
  }

  const handleApplyPreset = (preset: PresetDef) => {
    if (!objectSelectionTargetLayerId) return

    const newActions: StudioAction[] = preset.actions.map((a) => ({
      ...a,
      id: crypto.randomUUID(),
      layerId: objectSelectionTargetLayerId,
    }))

    onUpdateEvent({
      ...event,
      actions: [...event.actions, ...newActions],
    })
  }

  const handleTriggerChange = (trigger: 'manual' | 'vote') => {
    onUpdateEvent({ ...event, trigger })
  }

  const getLayerName = (layerId: string) => {
    const layer = layers.find((l) => l.id === layerId)
    return layer?.name ?? 'Unknown'
  }

  const getLayerType = (layerId: string) => {
    const layer = layers.find((l) => l.id === layerId)
    return layer?.type ?? 'image'
  }

  return (
    <div className="flex flex-col h-full text-zinc-100">
      {/* Header */}
      <div className="px-3 py-2 border-b border-[#1a1a1a] flex items-center gap-2">
        <div
          className="w-3 h-3 rounded-full shrink-0"
          style={{ backgroundColor: event.color || '#6366f1' }}
        />
        <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex-1">Event Settings</span>
        <button
          onClick={() => onTriggerEvent(event.id)}
          className="p-1 rounded hover:bg-emerald-600/20 text-emerald-400 transition-colors cursor-pointer"
          title="Trigger event"
        >
          <Play className="size-3.5 fill-current" />
        </button>
        <button
          onClick={() => onDeleteEvent(event.id)}
          className="p-1 rounded hover:bg-red-600/20 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
          title="Delete event"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {/* Event Info */}
        <section className="space-y-2">
          <div className="space-y-1">
            <Label className="text-[10px] text-zinc-500 uppercase tracking-wider">Name</Label>
            <Input
              value={event.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="h-7 text-xs border-zinc-700 bg-zinc-800/50 text-zinc-100"
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1 space-y-1">
              <Label className="text-[10px] text-zinc-500 uppercase tracking-wider">Category</Label>
              <select
                value={event.categoryId || ''}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full h-7 text-xs rounded-md border border-zinc-700 bg-zinc-800/50 text-zinc-100 px-2"
              >
                <option value="">Uncategorized</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="w-12 space-y-1">
              <Label className="text-[10px] text-zinc-500 uppercase tracking-wider">Color</Label>
              <input
                type="color"
                value={event.color || '#6366f1'}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-full h-7 rounded cursor-pointer border border-zinc-700 bg-transparent p-0.5"
              />
            </div>
          </div>
        </section>

        {/* Select Object Button */}
        <section className="space-y-2">
          <Label className="text-[10px] text-zinc-500 uppercase tracking-wider">Target Object</Label>
          {objectSelectionMode === 'waiting' ? (
            <button
              onClick={() => cancelObjectSelection()}
              className="w-full h-10 rounded-lg bg-red-600 text-white text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer animate-pulse"
            >
              <Target className="size-4" />
              Click an object on canvas…
              <X className="size-3.5 ml-1 opacity-60" />
            </button>
          ) : objectSelectionMode === 'locked' && lockedLayer ? (
            <div className="w-full h-10 rounded-lg bg-emerald-600 text-white text-xs font-medium flex items-center justify-center gap-2">
              {layerIcon(lockedLayer.type)}
              <span className="truncate">{lockedLayer.name}</span>
              <button
                onClick={() => cancelObjectSelection()}
                className="ml-1 p-0.5 rounded hover:bg-white/20 transition-colors cursor-pointer"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => startObjectSelection(event.id)}
              className="w-full h-10 rounded-lg border border-dashed border-zinc-600 text-zinc-400 text-xs font-medium flex items-center justify-center gap-2 hover:border-zinc-400 hover:text-zinc-200 transition-all cursor-pointer"
            >
              <Target className="size-4" />
              Select Object
            </button>
          )}
        </section>

        {/* Animation Presets (only when object is locked) */}
        {objectSelectionMode === 'locked' && objectSelectionTargetLayerId && (
          <section className="space-y-2">
            <Label className="text-[10px] text-zinc-500 uppercase tracking-wider">Quick Presets</Label>
            <div className="grid grid-cols-2 gap-1">
              {getPresets().map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handleApplyPreset(preset)}
                  className="h-7 rounded-md bg-zinc-800 hover:bg-zinc-700 text-[10px] text-zinc-300 font-medium transition-colors cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Manual Action Builder (only when object is locked) */}
        {objectSelectionMode === 'locked' && objectSelectionTargetLayerId && (
          <section className="space-y-2">
            <Label className="text-[10px] text-zinc-500 uppercase tracking-wider">Add Custom Action</Label>
            <div className="space-y-1.5 p-2 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
              <div className="grid grid-cols-2 gap-1.5">
                <div className="space-y-0.5">
                  <span className="text-[9px] text-zinc-500">Property</span>
                  <select
                    value={newProperty}
                    onChange={(e) => setNewProperty(e.target.value)}
                    className="w-full h-6 text-[10px] rounded border border-zinc-700 bg-[#1e1f22] text-zinc-200 px-1"
                  >
                    {PROPERTY_OPTIONS.map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] text-zinc-500">Easing</span>
                  <select
                    value={newEasing}
                    onChange={(e) => setNewEasing(e.target.value)}
                    className="w-full h-6 text-[10px] rounded border border-zinc-700 bg-[#1e1f22] text-zinc-200 px-1"
                  >
                    {EASING_OPTIONS.map((e) => (
                      <option key={e.value} value={e.value}>{e.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <div className="space-y-0.5">
                  <span className="text-[9px] text-zinc-500">From (optional)</span>
                  <Input
                    value={newFromValue}
                    onChange={(e) => setNewFromValue(e.target.value)}
                    placeholder="auto"
                    className="h-6 text-[10px] border-zinc-700 bg-[#1e1f22] text-zinc-200 px-1.5"
                  />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] text-zinc-500">To</span>
                  <Input
                    value={newToValue}
                    onChange={(e) => setNewToValue(e.target.value)}
                    className="h-6 text-[10px] border-zinc-700 bg-[#1e1f22] text-zinc-200 px-1.5"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <div className="space-y-0.5">
                  <span className="text-[9px] text-zinc-500">Duration (ms)</span>
                  <Input
                    type="number"
                    value={newDuration}
                    onChange={(e) => setNewDuration(parseInt(e.target.value) || 0)}
                    className="h-6 text-[10px] border-zinc-700 bg-[#1e1f22] text-zinc-200 px-1.5"
                  />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] text-zinc-500">Delay (ms)</span>
                  <Input
                    type="number"
                    value={newDelay}
                    onChange={(e) => setNewDelay(parseInt(e.target.value) || 0)}
                    className="h-6 text-[10px] border-zinc-700 bg-[#1e1f22] text-zinc-200 px-1.5"
                  />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] text-zinc-500">End</span>
                  <select
                    value={newEndBehaviour}
                    onChange={(e) => setNewEndBehaviour(e.target.value)}
                    className="w-full h-6 text-[10px] rounded border border-zinc-700 bg-[#1e1f22] text-zinc-200 px-1"
                  >
                    {END_BEHAVIOUR_OPTIONS.map((e) => (
                      <option key={e.value} value={e.value}>{e.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddAction}
                className="w-full h-6 text-[10px] border-zinc-600 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 mt-1"
              >
                <Plus className="size-3 mr-1" /> Add Action
              </Button>
            </div>
          </section>
        )}

        {/* Actions List */}
        {event.actions.length > 0 && (
          <section className="space-y-2">
            <Label className="text-[10px] text-zinc-500 uppercase tracking-wider">
              Actions ({event.actions.length})
            </Label>
            <div className="space-y-1">
              {event.actions.map((action) => (
                <div
                  key={action.id}
                  className="flex items-center gap-1.5 px-2 py-1.5 rounded-md bg-zinc-800/50 border border-zinc-700/50 text-[10px] group"
                >
                  {layerIcon(getLayerType(action.layerId))}
                  <span className="text-zinc-300 truncate">{getLayerName(action.layerId)}</span>
                  <span className="text-zinc-500">·</span>
                  <span className="text-amber-400 font-medium">{action.property}</span>
                  <span className="text-zinc-500 ml-auto whitespace-nowrap">
                    {String(action.fromValue ?? 'auto')} → {String(action.toValue)}
                  </span>
                  <span className="text-zinc-600 whitespace-nowrap">{action.duration}ms</span>
                  <button
                    onClick={() => handleDeleteAction(action.id)}
                    className="p-0.5 text-zinc-600 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all cursor-pointer"
                  >
                    <Trash2 className="size-2.5" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Trigger Type */}
        <section className="space-y-2">
          <Label className="text-[10px] text-zinc-500 uppercase tracking-wider">Trigger</Label>
          <div className="flex gap-1.5">
            <button
              onClick={() => handleTriggerChange('manual')}
              className={`flex-1 h-7 rounded-md text-[10px] font-medium transition-colors cursor-pointer ${
                event.trigger === 'manual'
                  ? 'bg-zinc-700 text-white'
                  : 'bg-zinc-800/50 text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Manual
            </button>
            <button
              onClick={() => handleTriggerChange('vote')}
              className={`flex-1 h-7 rounded-md text-[10px] font-medium transition-colors cursor-pointer ${
                event.trigger === 'vote'
                  ? 'bg-zinc-700 text-white'
                  : 'bg-zinc-800/50 text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Vote
            </button>
          </div>
          {event.trigger === 'vote' && (
            <div className="space-y-1.5 mt-2">
              <Input
                value={event.voteQuestion || ''}
                onChange={(e) => onUpdateEvent({ ...event, voteQuestion: e.target.value })}
                placeholder="Vote question..."
                className="h-7 text-xs border-zinc-700 bg-zinc-800/50 text-zinc-100"
              />
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
