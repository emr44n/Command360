'use client'

import React from 'react'
import {
  Trash2Icon,
  CopyIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  UnlockIcon,
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
import type { StudioLayer } from '@/types/slide'

interface StudioPropertiesProps {
  layer: StudioLayer | null
  onUpdate: (updates: Partial<StudioLayer>) => void
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
}

export function StudioProperties({
  layer,
  onUpdate,
  onDelete,
  onDuplicate,
}: StudioPropertiesProps) {
  if (!layer) {
    return (
      <div className="flex h-full items-center justify-center bg-zinc-900 p-4 text-zinc-500">
        <p className="text-center text-xs">Select a layer to edit its properties</p>
      </div>
    )
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
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="mb-1 text-[10px] uppercase tracking-wider text-zinc-400">
              Width %
            </Label>
            <Input
              type="number"
              value={layer.width}
              min={0}
              max={200}
              step={0.1}
              onChange={(e) => onUpdate({ width: parseFloat(e.target.value) || 0 })}
              className="h-7 border-zinc-700 bg-zinc-800 text-xs text-zinc-100"
            />
          </div>
          <div>
            <Label className="mb-1 text-[10px] uppercase tracking-wider text-zinc-400">
              Height %
            </Label>
            <Input
              type="number"
              value={layer.height}
              min={0}
              max={200}
              step={0.1}
              onChange={(e) => onUpdate({ height: parseFloat(e.target.value) || 0 })}
              className="h-7 border-zinc-700 bg-zinc-800 text-xs text-zinc-100"
            />
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
