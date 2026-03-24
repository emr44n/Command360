'use client'

import React, { useState } from 'react'
import {
  Trash2Icon,
  CopyIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  UnlockIcon,
  PlusIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  Link2Icon,
  Unlink2Icon,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { StudioLayer, StudioClip, StudioKeyframe } from '@/types/slide'

interface StudioPropertiesProps {
  layer: StudioLayer | null
  onUpdate: (updates: Partial<StudioLayer>) => void
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
  selectedClip?: StudioClip | null
  onUpdateClip?: (updates: Partial<StudioClip>) => void
  onAddKeyframe?: (property: string, value: number | boolean, time: number) => void
  onDeleteKeyframe?: (keyframeId: string) => void
  currentTime?: number
}

const KEYFRAME_PROPERTIES = [
  { value: 'opacity', label: 'Opacity' },
  { value: 'x', label: 'X' },
  { value: 'y', label: 'Y' },
  { value: 'width', label: 'Width' },
  { value: 'height', label: 'Height' },
  { value: 'rotation', label: 'Rotation' },
  { value: 'visible', label: 'Visible' },
] as const

const EASING_OPTIONS = [
  { value: 'linear', label: 'Linear' },
  { value: 'ease-in', label: 'Ease In' },
  { value: 'ease-out', label: 'Ease Out' },
  { value: 'ease-in-out', label: 'Ease In-Out' },
] as const

export function StudioProperties({
  layer,
  onUpdate,
  onDelete,
  onDuplicate,
  selectedClip,
  onUpdateClip,
  onAddKeyframe,
  onDeleteKeyframe,
  currentTime = 0,
}: StudioPropertiesProps) {
  const [clipInfoOpen, setClipInfoOpen] = useState(true)
  const [keyframesOpen, setKeyframesOpen] = useState(true)
  const [fadeOpen, setFadeOpen] = useState(true)
  const [newKfProperty, setNewKfProperty] = useState<string>('opacity')
  const [fadeInDuration, setFadeInDuration] = useState(500)
  const [fadeOutDuration, setFadeOutDuration] = useState(500)
  const [aspectLocked, setAspectLocked] = useState(false)

  if (!layer) {
    return (
      <div className="flex h-full items-center justify-center bg-zinc-900 p-4 text-zinc-500">
        <p className="text-center text-xs">Select a layer to edit its properties</p>
      </div>
    )
  }

  const sortedKeyframes = selectedClip
    ? [...selectedClip.keyframes].sort((a, b) => a.time - b.time)
    : []

  // Compute clip-local time for "Add Keyframe" button
  const clipLocalTime = selectedClip
    ? Math.max(0, currentTime - selectedClip.startTime)
    : 0

  const handleAddFadeIn = () => {
    if (!onAddKeyframe || !selectedClip) return
    onAddKeyframe('opacity', 0, 0)
    onAddKeyframe('opacity', 1, fadeInDuration)
  }

  const handleAddFadeOut = () => {
    if (!onAddKeyframe || !selectedClip) return
    const clipEnd = selectedClip.duration
    onAddKeyframe('opacity', 1, Math.max(0, clipEnd - fadeOutDuration))
    onAddKeyframe('opacity', 0, clipEnd)
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-zinc-900 text-zinc-100">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-zinc-800 px-3 py-2">
        <span className="flex-1 truncate text-xs font-medium">{layer.name}</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 text-zinc-400 hover:text-zinc-100"
          onClick={() => onDuplicate(layer.id)}
          title="Duplicate"
        >
          <CopyIcon className="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 text-red-400 hover:text-red-300"
          onClick={() => onDelete(layer.id)}
          title="Delete"
        >
          <Trash2Icon className="size-3.5" />
        </Button>
      </div>

      <div className="space-y-3 p-3">
        {/* Name */}
        <div>
          <Label className="mb-1 text-[10px] uppercase tracking-wider text-zinc-400">
            Name
          </Label>
          <Input
            value={layer.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            className="h-7 border-zinc-700 bg-zinc-800 text-xs text-zinc-100"
          />
        </div>

        {/* Position */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="mb-1 text-[10px] uppercase tracking-wider text-zinc-400">
              X %
            </Label>
            <Input
              type="number"
              value={layer.x}
              min={0}
              max={100}
              step={0.1}
              onChange={(e) => onUpdate({ x: parseFloat(e.target.value) || 0 })}
              className="h-7 border-zinc-700 bg-zinc-800 text-xs text-zinc-100"
            />
          </div>
          <div>
            <Label className="mb-1 text-[10px] uppercase tracking-wider text-zinc-400">
              Y %
            </Label>
            <Input
              type="number"
              value={layer.y}
              min={0}
              max={100}
              step={0.1}
              onChange={(e) => onUpdate({ y: parseFloat(e.target.value) || 0 })}
              className="h-7 border-zinc-700 bg-zinc-800 text-xs text-zinc-100"
            />
          </div>
        </div>

        {/* Size */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <Label className="text-[10px] uppercase tracking-wider text-zinc-400">
              Size
            </Label>
            <button
              onClick={() => setAspectLocked((v) => !v)}
              className={`p-1 rounded transition-colors ${
                aspectLocked
                  ? 'text-red-400 bg-red-400/10 hover:bg-red-400/20'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'
              }`}
              title={aspectLocked ? 'Unlock aspect ratio' : 'Lock aspect ratio'}
            >
              {aspectLocked ? (
                <Link2Icon className="size-3.5" />
              ) : (
                <Unlink2Icon className="size-3.5" />
              )}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="mb-1 text-[10px] text-zinc-400">
                Width %
              </Label>
              <Input
                type="number"
                value={layer.width}
                min={0}
                max={200}
                step={0.1}
                onChange={(e) => {
                  const newW = parseFloat(e.target.value) || 0
                  if (aspectLocked && layer.width > 0) {
                    const ratio = layer.height / layer.width
                    onUpdate({ width: newW, height: parseFloat((newW * ratio).toFixed(2)) })
                  } else {
                    onUpdate({ width: newW })
                  }
                }}
                className="h-7 border-zinc-700 bg-zinc-800 text-xs text-zinc-100"
              />
            </div>
            <div>
              <Label className="mb-1 text-[10px] text-zinc-400">
                Height %
              </Label>
              <Input
                type="number"
                value={layer.height}
                min={0}
                max={200}
                step={0.1}
                onChange={(e) => {
                  const newH = parseFloat(e.target.value) || 0
                  if (aspectLocked && layer.height > 0) {
                    const ratio = layer.width / layer.height
                    onUpdate({ height: newH, width: parseFloat((newH * ratio).toFixed(2)) })
                  } else {
                    onUpdate({ height: newH })
                  }
                }}
                className="h-7 border-zinc-700 bg-zinc-800 text-xs text-zinc-100"
              />
            </div>
          </div>
        </div>

        {/* Rotation */}
        <div>
          <Label className="mb-1 text-[10px] uppercase tracking-wider text-zinc-400">
            Rotation ({Math.round(layer.rotation)}&deg;)
          </Label>
          <Slider
            value={[layer.rotation]}
            min={0}
            max={360}
            step={1}
            onValueChange={([v]) => onUpdate({ rotation: v })}
            className="py-1"
          />
        </div>

        {/* Opacity */}
        <div>
          <Label className="mb-1 text-[10px] uppercase tracking-wider text-zinc-400">
            Opacity ({Math.round(layer.opacity * 100)}%)
          </Label>
          <Slider
            value={[layer.opacity * 100]}
            min={0}
            max={100}
            step={1}
            onValueChange={([v]) => onUpdate({ opacity: v / 100 })}
            className="py-1"
          />
        </div>

        {/* Blend Mode */}
        <div>
          <Label className="mb-1 text-[10px] uppercase tracking-wider text-zinc-400">
            Blend Mode
          </Label>
          <Select
            value={layer.blendMode}
            onValueChange={(v) =>
              onUpdate({ blendMode: v as StudioLayer['blendMode'] })
            }
          >
            <SelectTrigger className="h-7 w-full border-zinc-700 bg-zinc-800 text-xs text-zinc-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="multiply">Multiply</SelectItem>
              <SelectItem value="screen">Screen</SelectItem>
              <SelectItem value="overlay">Overlay</SelectItem>
              <SelectItem value="darken">Darken</SelectItem>
              <SelectItem value="lighten">Lighten</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Visibility & Lock */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {layer.visible ? (
              <EyeIcon className="size-3.5 text-zinc-400" />
            ) : (
              <EyeOffIcon className="size-3.5 text-zinc-500" />
            )}
            <Switch
              checked={layer.visible}
              onCheckedChange={(v) => onUpdate({ visible: v })}
              size="sm"
            />
            <span className="text-[10px] text-zinc-400">Visible</span>
          </div>
          <div className="flex items-center gap-2">
            {layer.locked ? (
              <LockIcon className="size-3.5 text-amber-400" />
            ) : (
              <UnlockIcon className="size-3.5 text-zinc-400" />
            )}
            <Switch
              checked={layer.locked}
              onCheckedChange={(v) => onUpdate({ locked: v })}
              size="sm"
            />
            <span className="text-[10px] text-zinc-400">Lock</span>
          </div>
        </div>

        {/* Text-specific properties */}
        {layer.type === 'text' && (
          <div className="space-y-3 border-t border-zinc-800 pt-3">
            <Label className="text-[10px] uppercase tracking-wider text-zinc-400">
              Text Properties
            </Label>
            <div>
              <Label className="mb-1 text-[10px] text-zinc-400">Content</Label>
              <Input
                value={layer.text ?? ''}
                onChange={(e) => onUpdate({ text: e.target.value })}
                className="h-7 border-zinc-700 bg-zinc-800 text-xs text-zinc-100"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="mb-1 text-[10px] text-zinc-400">Font Size</Label>
                <Input
                  type="number"
                  value={layer.fontSize ?? 24}
                  min={8}
                  max={200}
                  onChange={(e) =>
                    onUpdate({ fontSize: parseInt(e.target.value) || 24 })
                  }
                  className="h-7 border-zinc-700 bg-zinc-800 text-xs text-zinc-100"
                />
              </div>
              <div>
                <Label className="mb-1 text-[10px] text-zinc-400">Weight</Label>
                <Select
                  value={layer.fontWeight ?? 'normal'}
                  onValueChange={(v) => onUpdate({ fontWeight: v })}
                >
                  <SelectTrigger className="h-7 w-full border-zinc-700 bg-zinc-800 text-xs text-zinc-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="bold">Bold</SelectItem>
                    <SelectItem value="100">Thin</SelectItem>
                    <SelectItem value="300">Light</SelectItem>
                    <SelectItem value="500">Medium</SelectItem>
                    <SelectItem value="600">Semibold</SelectItem>
                    <SelectItem value="800">Extra Bold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="mb-1 text-[10px] text-zinc-400">Color</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={layer.color ?? '#ffffff'}
                  onChange={(e) => onUpdate({ color: e.target.value })}
                  className="h-7 w-8 cursor-pointer rounded border border-zinc-700 bg-zinc-800"
                />
                <Input
                  value={layer.color ?? '#ffffff'}
                  onChange={(e) => onUpdate({ color: e.target.value })}
                  className="h-7 flex-1 border-zinc-700 bg-zinc-800 text-xs text-zinc-100"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Clip Info Section ── */}
        {selectedClip && onUpdateClip && (
          <div className="border-t border-zinc-800 pt-3">
            <button
              className="flex w-full items-center gap-1 text-[10px] uppercase tracking-wider text-zinc-400 hover:text-zinc-200 transition-colors"
              onClick={() => setClipInfoOpen(!clipInfoOpen)}
            >
              {clipInfoOpen ? (
                <ChevronDownIcon className="size-3" />
              ) : (
                <ChevronRightIcon className="size-3" />
              )}
              Clip Info
            </button>
            {clipInfoOpen && (
              <div className="mt-2 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="mb-1 text-[10px] text-zinc-400">Start (ms)</Label>
                    <Input
                      type="number"
                      value={selectedClip.startTime}
                      min={0}
                      step={100}
                      onChange={(e) =>
                        onUpdateClip({ startTime: parseInt(e.target.value) || 0 })
                      }
                      className="h-7 border-zinc-700 bg-zinc-800 text-xs text-zinc-100"
                    />
                  </div>
                  <div>
                    <Label className="mb-1 text-[10px] text-zinc-400">Duration (ms)</Label>
                    <Input
                      type="number"
                      value={selectedClip.duration}
                      min={1}
                      step={100}
                      onChange={(e) =>
                        onUpdateClip({ duration: parseInt(e.target.value) || 1000 })
                      }
                      className="h-7 border-zinc-700 bg-zinc-800 text-xs text-zinc-100"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="mb-1 text-[10px] text-zinc-400">Trim Start (ms)</Label>
                    <Input
                      type="number"
                      value={selectedClip.trimStart}
                      min={0}
                      step={100}
                      onChange={(e) =>
                        onUpdateClip({ trimStart: parseInt(e.target.value) || 0 })
                      }
                      className="h-7 border-zinc-700 bg-zinc-800 text-xs text-zinc-100"
                    />
                  </div>
                  <div>
                    <Label className="mb-1 text-[10px] text-zinc-400">Trim End (ms)</Label>
                    <Input
                      type="number"
                      value={selectedClip.trimEnd}
                      min={0}
                      step={100}
                      onChange={(e) =>
                        onUpdateClip({ trimEnd: parseInt(e.target.value) || 0 })
                      }
                      className="h-7 border-zinc-700 bg-zinc-800 text-xs text-zinc-100"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Keyframes Section ── */}
        {selectedClip && onAddKeyframe && onDeleteKeyframe && (
          <div className="border-t border-zinc-800 pt-3">
            <button
              className="flex w-full items-center gap-1 text-[10px] uppercase tracking-wider text-zinc-400 hover:text-zinc-200 transition-colors"
              onClick={() => setKeyframesOpen(!keyframesOpen)}
            >
              {keyframesOpen ? (
                <ChevronDownIcon className="size-3" />
              ) : (
                <ChevronRightIcon className="size-3" />
              )}
              Keyframes ({sortedKeyframes.length})
            </button>
            {keyframesOpen && (
              <div className="mt-2 space-y-1.5">
                {sortedKeyframes.length === 0 && (
                  <p className="text-[10px] text-zinc-500 italic">No keyframes yet</p>
                )}

                {sortedKeyframes.map((kf) => (
                  <div
                    key={kf.id}
                    className="flex items-center gap-1.5 rounded bg-zinc-800/60 px-2 py-1 text-[10px]"
                  >
                    <span className="w-10 shrink-0 font-mono text-zinc-400">
                      {kf.time}ms
                    </span>
                    <span className="w-12 shrink-0 truncate text-zinc-300">
                      {kf.property}
                    </span>
                    <span className="flex-1 truncate text-zinc-400">
                      {String(kf.value)}
                    </span>
                    <span className="w-12 shrink-0 truncate text-zinc-500">
                      {kf.easing}
                    </span>
                    <button
                      className="p-0.5 text-zinc-600 hover:text-red-400 transition-colors"
                      onClick={() => onDeleteKeyframe(kf.id)}
                      title="Delete keyframe"
                    >
                      <Trash2Icon className="size-3" />
                    </button>
                  </div>
                ))}

                {/* Add keyframe at current time */}
                <div className="flex items-center gap-1.5 pt-1">
                  <Select
                    value={newKfProperty}
                    onValueChange={setNewKfProperty}
                  >
                    <SelectTrigger className="h-6 w-24 border-zinc-700 bg-zinc-800 text-[10px] text-zinc-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {KEYFRAME_PROPERTIES.map((p) => (
                        <SelectItem key={p.value} value={p.value} className="text-xs">
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 flex-1 border-zinc-600 bg-zinc-800 text-[10px] text-zinc-300 hover:bg-zinc-700"
                    onClick={() => {
                      // Use current layer value as default
                      const prop = newKfProperty as keyof StudioLayer
                      let value: number | boolean = 1
                      if (prop === 'visible') {
                        value = layer.visible
                      } else if (prop in layer) {
                        const layerVal = layer[prop]
                        if (typeof layerVal === 'number') value = layerVal
                        if (typeof layerVal === 'boolean') value = layerVal
                      }
                      onAddKeyframe(newKfProperty, value, clipLocalTime)
                    }}
                  >
                    <PlusIcon className="mr-1 size-3" />
                    Add at {Math.round(clipLocalTime)}ms
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Fade Controls Section ── */}
        {selectedClip && onAddKeyframe && (
          <div className="border-t border-zinc-800 pt-3">
            <button
              className="flex w-full items-center gap-1 text-[10px] uppercase tracking-wider text-zinc-400 hover:text-zinc-200 transition-colors"
              onClick={() => setFadeOpen(!fadeOpen)}
            >
              {fadeOpen ? (
                <ChevronDownIcon className="size-3" />
              ) : (
                <ChevronRightIcon className="size-3" />
              )}
              Fade Controls
            </button>
            {fadeOpen && (
              <div className="mt-2 space-y-2">
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Label className="mb-1 text-[10px] text-zinc-400">
                      Fade In (ms)
                    </Label>
                    <Input
                      type="number"
                      value={fadeInDuration}
                      min={0}
                      step={100}
                      onChange={(e) => setFadeInDuration(parseInt(e.target.value) || 0)}
                      className="h-7 border-zinc-700 bg-zinc-800 text-xs text-zinc-100"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 shrink-0 border-zinc-600 bg-zinc-800 text-[10px] text-zinc-300 hover:bg-zinc-700"
                    onClick={handleAddFadeIn}
                  >
                    Apply
                  </Button>
                </div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Label className="mb-1 text-[10px] text-zinc-400">
                      Fade Out (ms)
                    </Label>
                    <Input
                      type="number"
                      value={fadeOutDuration}
                      min={0}
                      step={100}
                      onChange={(e) => setFadeOutDuration(parseInt(e.target.value) || 0)}
                      className="h-7 border-zinc-700 bg-zinc-800 text-xs text-zinc-100"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 shrink-0 border-zinc-600 bg-zinc-800 text-[10px] text-zinc-300 hover:bg-zinc-700"
                    onClick={handleAddFadeOut}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Delete / Duplicate buttons */}
        <div className="grid grid-cols-2 gap-2 border-t border-zinc-800 pt-3">
          <Button
            variant="outline"
            size="sm"
            className="border-zinc-700 bg-zinc-800 text-xs text-zinc-300 hover:bg-zinc-700"
            onClick={() => onDuplicate(layer.id)}
          >
            <CopyIcon className="mr-1 size-3" /> Duplicate
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-red-900/50 bg-red-950/30 text-xs text-red-400 hover:bg-red-950/50"
            onClick={() => onDelete(layer.id)}
          >
            <Trash2Icon className="mr-1 size-3" /> Delete
          </Button>
        </div>
      </div>
    </div>
  )
}
