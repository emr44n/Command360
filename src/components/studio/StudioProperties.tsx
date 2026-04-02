'use client'

import React, { useState } from 'react'
import { useStudioStore } from '@/stores/studioStore'
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
import { FontPicker } from '@/components/studio/FontPicker'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { ColorPickerPopover } from '@/components/ui/color-picker'

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
  { value: 'volume', label: 'Volume' },
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
  const { aspectLocked, setAspectLocked } = useStudioStore()

  if (!layer) {
    return (
      <div className="flex h-full items-center justify-center bg-[#2b2d31] p-4 text-zinc-500">
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
    <div className="flex h-full flex-col overflow-y-auto overflow-x-hidden bg-[#2b2d31] text-zinc-100">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-[#1e1f22] px-2 py-1.5">
        <span className="flex-1 truncate text-[10px] font-medium">{layer.name}</span>
        <Tooltip><TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-zinc-400 hover:text-zinc-100"
          onClick={() => onDuplicate(layer.id)}
        >
          <CopyIcon className="size-3.5" />
        </Button>
        </TooltipTrigger><TooltipContent>Duplicate</TooltipContent></Tooltip>
        <Tooltip><TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
          onClick={() => onDelete(layer.id)}
        >
          <Trash2Icon className="size-3.5" />
        </Button>
        </TooltipTrigger><TooltipContent>Delete</TooltipContent></Tooltip>
      </div>

      <div className="space-y-1.5 p-1.5">
        {/* Name */}
        <div>
          <Label className="mb-1 text-[9px] text-zinc-500 font-medium">
            Name
          </Label>
          <Input
            value={layer.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            className="h-5 border-[#3f4147] bg-[#1e1f22] text-[9px] text-zinc-200 px-1.5 rounded-md focus:ring-1 focus:ring-red-500/30"
          />
        </div>

        {/* Position */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="mb-1 text-[9px] text-zinc-500 font-medium">
              X %
            </Label>
            <Input
              type="number"
              value={layer.x}
              min={0}
              max={100}
              step={0.1}
              onChange={(e) => onUpdate({ x: parseFloat(e.target.value) || 0 })}
              className="h-5 border-[#3f4147] bg-[#1e1f22] text-[9px] text-zinc-200 px-1.5 rounded-md focus:ring-1 focus:ring-red-500/30"
            />
          </div>
          <div>
            <Label className="mb-1 text-[9px] text-zinc-500 font-medium">
              Y %
            </Label>
            <Input
              type="number"
              value={layer.y}
              min={0}
              max={100}
              step={0.1}
              onChange={(e) => onUpdate({ y: parseFloat(e.target.value) || 0 })}
              className="h-5 border-[#3f4147] bg-[#1e1f22] text-[9px] text-zinc-200 px-1.5 rounded-md focus:ring-1 focus:ring-red-500/30"
            />
          </div>
        </div>

        {/* Size */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <Label className="text-[9px] text-zinc-500 font-medium">
              Size
            </Label>
            <Tooltip><TooltipTrigger asChild>
            <button
              onClick={() => setAspectLocked(!aspectLocked)}
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium transition-colors ${
                aspectLocked
                  ? 'text-red-400 bg-red-400/10 hover:bg-red-400/20'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              {aspectLocked ? (
                <><Link2Icon className="size-3" /> Locked</>
              ) : (
                <><Unlink2Icon className="size-3" /> Unlocked</>
              )}
            </button>
            </TooltipTrigger><TooltipContent>{aspectLocked ? 'Unlock aspect ratio' : 'Lock aspect ratio'}</TooltipContent></Tooltip>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="mb-1 text-[9px] text-zinc-500 font-medium">
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
                className="h-5 border-[#3f4147] bg-[#1e1f22] text-[9px] text-zinc-200 px-1.5 rounded-md focus:ring-1 focus:ring-red-500/30"
              />
            </div>
            <div>
              <Label className="mb-1 text-[9px] text-zinc-500 font-medium">
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
                className="h-5 border-[#3f4147] bg-[#1e1f22] text-[9px] text-zinc-200 px-1.5 rounded-md focus:ring-1 focus:ring-red-500/30"
              />
            </div>
          </div>
        </div>

        {/* Rotation */}
        <div>
          <Label className="mb-1 text-[9px] text-zinc-500 font-medium">
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
          <Label className="mb-1 text-[9px] text-zinc-500 font-medium">
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
          <Label className="mb-1 text-[9px] text-zinc-500 font-medium">
            Blend Mode
          </Label>
          <Select
            value={layer.blendMode}
            onValueChange={(v) =>
              onUpdate({ blendMode: v as StudioLayer['blendMode'] })
            }
          >
            <SelectTrigger className="h-6 w-full border-[#3f4147] bg-[#1e1f22] text-[10px] text-zinc-100">
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
          <div className="space-y-2 border-t border-[#1e1f22] pt-2">
            <Label className="text-[9px] text-zinc-500 font-medium">
              Text Properties
            </Label>
            <div>
              <Label className="mb-1 text-[9px] text-zinc-500 font-medium">Content</Label>
              <Input
                value={layer.text ?? ''}
                onChange={(e) => onUpdate({ text: e.target.value })}
                className="h-5 border-[#3f4147] bg-[#1e1f22] text-[9px] text-zinc-200 px-1.5 rounded-md focus:ring-1 focus:ring-red-500/30"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="mb-1 text-[9px] text-zinc-500 font-medium">Font Size</Label>
                <Input
                  type="number"
                  value={layer.fontSize ?? 24}
                  min={8}
                  max={200}
                  onChange={(e) =>
                    onUpdate({ fontSize: parseInt(e.target.value) || 24 })
                  }
                  className="h-5 border-[#3f4147] bg-[#1e1f22] text-[9px] text-zinc-200 px-1.5 rounded-md focus:ring-1 focus:ring-red-500/30"
                />
              </div>
              <div>
                <Label className="mb-1 text-[9px] text-zinc-500 font-medium">Weight</Label>
                <Select
                  value={layer.fontWeight ?? 'normal'}
                  onValueChange={(v) => onUpdate({ fontWeight: v })}
                >
                  <SelectTrigger className="h-6 w-full border-[#3f4147] bg-[#1e1f22] text-[10px] text-zinc-100">
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
              <Label className="mb-1 text-[9px] text-zinc-500 font-medium">Color</Label>
              <ColorPickerPopover value={layer.color ?? '#ffffff'} onChange={(c) => onUpdate({ color: c })} />
            </div>
            <div>
              <label className="text-[9px] text-zinc-500 font-medium mb-1 block">Font</label>
              <FontPicker value={layer.fontFamily || 'Inter'} onChange={(f) => onUpdate({ fontFamily: f })} />
            </div>
            <div>
              <label className="text-[9px] text-zinc-500 font-medium mb-1 block">Align</label>
              <div className="flex gap-0.5">
                {(['left', 'center', 'right'] as const).map(a => (
                  <button key={a} onClick={() => onUpdate({ textAlign: a })}
                    className={`flex-1 h-5 rounded-md text-[8px] flex items-center justify-center transition-colors ${layer.textAlign === a ? 'bg-red-500/20 text-red-400' : 'bg-[#1e1f22] text-zinc-500 hover:text-zinc-300'}`}>
                    {a.charAt(0).toUpperCase() + a.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Audio-specific properties */}
        {layer.type === 'audio' && (
          <div className="space-y-2 border-t border-[#1e1f22] pt-2">
            <Label className="text-[9px] text-zinc-500 font-medium">
              Audio Properties
            </Label>
            {layer.src && (
              <div>
                <Label className="mb-1 text-[9px] text-zinc-500 font-medium">File</Label>
                <p className="text-[9px] text-zinc-300 truncate">{layer.name}</p>
              </div>
            )}
            <div>
              <Label className="mb-1 text-[9px] text-zinc-500 font-medium">
                Volume ({Math.round((layer.volume ?? 1) * 100)}%)
              </Label>
              <Slider
                value={[(layer.volume ?? 1) * 100]}
                min={0}
                max={100}
                step={1}
                onValueChange={([v]) => onUpdate({ volume: v / 100 })}
                className="py-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={layer.audioLoop ?? false}
                onCheckedChange={(v) => onUpdate({ audioLoop: v })}
                size="sm"
              />
              <span className="text-[10px] text-zinc-400">Loop</span>
            </div>
          </div>
        )}

        {/* Shape-specific properties */}
        {layer.type === 'shape' && (
          <div className="space-y-2 border-t border-[#1e1f22] pt-2">
            <Label className="text-[9px] text-zinc-500 font-medium">{layer.name === 'Line' ? 'Line Properties' : 'Shape Properties'}</Label>

            {/* LINE — simplified UI */}
            {layer.name === 'Line' ? (<>
              <div>
                <Label className="mb-1 text-[9px] text-zinc-500 font-medium">Color</Label>
                <ColorPickerPopover value={layer.color ?? '#4a5568'} onChange={(c) => onUpdate({ color: c })} />
              </div>
              <div>
                <Label className="mb-1 text-[9px] text-zinc-500 font-medium">Thickness ({layer.borderWidth ?? 2}px)</Label>
                <Slider value={[layer.borderWidth ?? 2]} min={1} max={20} step={1} onValueChange={([v]) => onUpdate({ borderWidth: v })} className="py-1" />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={layer.borderStyle === 'dashed'} onCheckedChange={(v) => onUpdate({ borderStyle: v ? 'dashed' : 'solid' })} />
                <span className="text-[10px] text-zinc-400">Dashed</span>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label className="text-[9px] text-zinc-500 font-medium">Feather ({layer.feather ?? 0}px)</Label>
                  {(layer.feather ?? 0) > 0 && <button onClick={() => onUpdate({ feather: 0 })} className="text-[7px] text-zinc-600 hover:text-zinc-300 transition-colors">Reset</button>}
                </div>
                <Slider value={[layer.feather ?? 0]} min={0} max={100} step={1} onValueChange={([v]) => onUpdate({ feather: v })} className="py-1" />
              </div>
            </>) : (<>
              {/* NON-LINE SHAPES — full UI */}
              {/* Fill Color */}
              <div>
                <Label className="mb-1 text-[9px] text-zinc-500 font-medium">Fill Color</Label>
                <ColorPickerPopover value={layer.color ?? '#4a5568'} onChange={(c) => onUpdate({ color: c })} />
              </div>
              {/* Transparent Fill */}
              <div className="flex items-center gap-2">
                <Switch checked={layer.fillTransparent ?? false} onCheckedChange={(v) => onUpdate({ fillTransparent: v })} />
                <span className="text-[10px] text-zinc-400">Transparent fill</span>
              </div>
              {/* Border */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Switch checked={!!layer.borderWidth && layer.borderWidth > 0} onCheckedChange={(v) => onUpdate(v ? { borderWidth: 2, borderStyle: 'solid', borderColor: '#ffffff' } : { borderWidth: 0, borderStyle: 'none' })} />
                  <span className="text-[10px] text-zinc-400">Border</span>
                </div>
                {layer.borderWidth && layer.borderWidth > 0 && (
                  <div className="space-y-2 pl-2 border-l-2 border-[#3f4147] ml-1">
                    <div>
                      <Label className="mb-1 text-[9px] text-zinc-500 font-medium">Border Color</Label>
                      <ColorPickerPopover value={layer.borderColor ?? '#ffffff'} onChange={(c) => onUpdate({ borderColor: c })} />
                    </div>
                    <div>
                      <Label className="mb-1 text-[9px] text-zinc-500 font-medium">Width ({layer.borderWidth ?? 2}px)</Label>
                      <Slider value={[layer.borderWidth ?? 2]} min={1} max={20} step={1} onValueChange={([v]) => onUpdate({ borderWidth: v })} className="py-1" />
                    </div>
                    <div>
                      <Label className="mb-1 text-[9px] text-zinc-500 font-medium">Style</Label>
                      <div className="flex gap-0.5">
                        {(['solid', 'dashed', 'dotted'] as const).map(s => (
                          <button key={s} onClick={() => onUpdate({ borderStyle: s })}
                            className={`flex-1 h-5 rounded-md text-[8px] flex items-center justify-center transition-colors ${layer.borderStyle === s ? 'bg-red-500/20 text-red-400' : 'bg-[#1e1f22] text-zinc-500 hover:text-zinc-300'}`}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>)}
            {/* Mask Mode */}
            <div>
              <Label className="mb-1 text-[9px] text-zinc-500 font-medium">Mask Mode</Label>
              <div className="flex gap-0.5">
                {([
                  { value: 'none' as const, label: 'None' },
                  { value: 'mask' as const, label: 'Mask' },
                  { value: 'multi-layer-mask' as const, label: 'Multi' },
                ]).map(m => (
                  <button key={m.value} onClick={() => onUpdate({ maskMode: m.value })}
                    className={`flex-1 h-5 rounded-md text-[8px] flex items-center justify-center transition-colors ${(layer.maskMode || 'none') === m.value ? 'bg-red-500/20 text-red-400' : 'bg-[#1e1f22] text-zinc-500 hover:text-zinc-300'}`}>
                    {m.label}
                  </button>
                ))}
              </div>
              {layer.maskMode === 'mask' && <p className="text-[7px] text-zinc-600 mt-1">Cuts through the layer directly below</p>}
              {layer.maskMode === 'multi-layer-mask' && <p className="text-[7px] text-zinc-600 mt-1">Cuts through all layers below to base</p>}
            </div>
            {/* Feather Edge */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <Label className="text-[9px] text-zinc-500 font-medium">Feather ({layer.feather ?? 0}px)</Label>
                {(layer.feather ?? 0) > 0 && <button onClick={() => onUpdate({ feather: 0 })} className="text-[7px] text-zinc-600 hover:text-zinc-300 transition-colors">Reset</button>}
              </div>
              <Slider value={[layer.feather ?? 0]} min={0} max={100} step={1} onValueChange={([v]) => onUpdate({ feather: v })} className="py-1" />
              <p className="text-[7px] text-zinc-600 mt-0.5">Soft/transparent edge — Photoshop-style feathering</p>
            </div>
          </div>
        )}

        {/* Image feather */}
        {layer.type === 'image' && (
          <div className="space-y-2 border-t border-[#1e1f22] pt-2">
            <div>
              <div className="flex items-center justify-between mb-1">
                <Label className="text-[9px] text-zinc-500 font-medium">Feather ({layer.feather ?? 0}px)</Label>
                {(layer.feather ?? 0) > 0 && <button onClick={() => onUpdate({ feather: 0 })} className="text-[7px] text-zinc-600 hover:text-zinc-300 transition-colors">Reset</button>}
              </div>
              <Slider value={[layer.feather ?? 0]} min={0} max={100} step={1} onValueChange={([v]) => onUpdate({ feather: v })} className="py-1" />
              <p className="text-[7px] text-zinc-600 mt-0.5">Soft/transparent edge inward</p>
            </div>
          </div>
        )}

        {/* ── Clip Info Section ── */}
        {selectedClip && onUpdateClip && (
          <div className="border-t border-[#1e1f22] pt-3">
            <button
              className="flex w-full items-center gap-1 text-[9px] text-zinc-500 font-medium hover:text-zinc-200 transition-colors"
              onClick={() => setClipInfoOpen(!clipInfoOpen)}
            >
              {clipInfoOpen ? (
                <ChevronDownIcon className="size-3" />
              ) : (
                <ChevronRightIcon className="size-3" />
              )}
              Clip Info ({(selectedClip.duration / 1000).toFixed(1)}s)
            </button>
            {clipInfoOpen && (
              <div className="mt-2 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="mb-1 text-[9px] text-zinc-500 font-medium">Start (ms)</Label>
                    <Input
                      type="number"
                      value={selectedClip.startTime}
                      min={0}
                      step={100}
                      onChange={(e) =>
                        onUpdateClip({ startTime: parseInt(e.target.value) || 0 })
                      }
                      className="h-5 border-[#3f4147] bg-[#1e1f22] text-[9px] text-zinc-200 px-1.5 rounded-md focus:ring-1 focus:ring-red-500/30"
                    />
                  </div>
                  <div>
                    <Label className="mb-1 text-[9px] text-zinc-500 font-medium">Duration (ms)</Label>
                    <Input
                      type="number"
                      value={selectedClip.duration}
                      min={1}
                      step={100}
                      onChange={(e) =>
                        onUpdateClip({ duration: parseInt(e.target.value) || 1000 })
                      }
                      className="h-5 border-[#3f4147] bg-[#1e1f22] text-[9px] text-zinc-200 px-1.5 rounded-md focus:ring-1 focus:ring-red-500/30"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="mb-1 text-[9px] text-zinc-500 font-medium">Trim Start (ms)</Label>
                    <Input
                      type="number"
                      value={selectedClip.trimStart}
                      min={0}
                      step={100}
                      onChange={(e) =>
                        onUpdateClip({ trimStart: parseInt(e.target.value) || 0 })
                      }
                      className="h-5 border-[#3f4147] bg-[#1e1f22] text-[9px] text-zinc-200 px-1.5 rounded-md focus:ring-1 focus:ring-red-500/30"
                    />
                  </div>
                  <div>
                    <Label className="mb-1 text-[9px] text-zinc-500 font-medium">Trim End (ms)</Label>
                    <Input
                      type="number"
                      value={selectedClip.trimEnd}
                      min={0}
                      step={100}
                      onChange={(e) =>
                        onUpdateClip({ trimEnd: parseInt(e.target.value) || 0 })
                      }
                      className="h-5 border-[#3f4147] bg-[#1e1f22] text-[9px] text-zinc-200 px-1.5 rounded-md focus:ring-1 focus:ring-red-500/30"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Keyframes Section ── */}
        {selectedClip && onAddKeyframe && onDeleteKeyframe && (
          <div className="border-t border-[#1e1f22] pt-3">
            <button
              className="flex w-full items-center gap-1 text-[9px] text-zinc-500 font-medium hover:text-zinc-200 transition-colors"
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
                    <Tooltip><TooltipTrigger asChild>
                    <button
                      className="p-0.5 text-zinc-600 hover:text-red-400 transition-colors"
                      onClick={() => onDeleteKeyframe(kf.id)}
                    >
                      <Trash2Icon className="size-3" />
                    </button>
                    </TooltipTrigger><TooltipContent>Delete keyframe</TooltipContent></Tooltip>
                  </div>
                ))}

                {/* Add keyframe at current time */}
                <div className="flex items-center gap-1.5 pt-1">
                  <Select
                    value={newKfProperty}
                    onValueChange={setNewKfProperty}
                  >
                    <SelectTrigger className="h-6 w-24 border-[#3f4147] bg-[#1e1f22] text-[10px] text-zinc-100">
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
          <div className="border-t border-[#1e1f22] pt-3">
            <button
              className="flex w-full items-center gap-1 text-[9px] text-zinc-500 font-medium hover:text-zinc-200 transition-colors"
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
                    <Label className="mb-1 text-[9px] text-zinc-500 font-medium">
                      Fade In (ms)
                    </Label>
                    <Input
                      type="number"
                      value={fadeInDuration}
                      min={0}
                      step={100}
                      onChange={(e) => setFadeInDuration(parseInt(e.target.value) || 0)}
                      className="h-5 border-[#3f4147] bg-[#1e1f22] text-[9px] text-zinc-200 px-1.5 rounded-md focus:ring-1 focus:ring-red-500/30"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 shrink-0 border-zinc-600 bg-zinc-800 text-[10px] text-zinc-300 hover:bg-zinc-700"
                    onClick={handleAddFadeIn}
                  >
                    Apply
                  </Button>
                </div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Label className="mb-1 text-[9px] text-zinc-500 font-medium">
                      Fade Out (ms)
                    </Label>
                    <Input
                      type="number"
                      value={fadeOutDuration}
                      min={0}
                      step={100}
                      onChange={(e) => setFadeOutDuration(parseInt(e.target.value) || 0)}
                      className="h-5 border-[#3f4147] bg-[#1e1f22] text-[9px] text-zinc-200 px-1.5 rounded-md focus:ring-1 focus:ring-red-500/30"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 shrink-0 border-zinc-600 bg-zinc-800 text-[10px] text-zinc-300 hover:bg-zinc-700"
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
        <div className="grid grid-cols-2 gap-2 border-t border-[#1e1f22] pt-3">
          <Button
            variant="outline"
            size="sm"
            className="border-[#3f4147] bg-[#1e1f22] text-xs text-zinc-300 hover:bg-zinc-700"
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
