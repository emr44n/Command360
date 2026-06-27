'use client'

import type { CanvasElement } from '@/types/slide'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Type, Image, Bold, Italic, AlignLeft, AlignCenter, AlignRight,
  Trash2, RotateCw, Square, Circle, Maximize, Minimize, Eye,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

interface Props {
  element: CanvasElement
  onUpdate: (updates: Partial<CanvasElement>) => void
  onUpdateStyle: (style: Partial<NonNullable<CanvasElement['style']>>) => void
  onDelete: () => void
}

export function ElementSettings({ element, onUpdate, onUpdateStyle, onDelete }: Props) {
  const style = element.style || {}
  const isText = element.type === 'text'
  const isImage = element.type === 'image'

  return (
    <div className="space-y-5">
      {/* Element type header */}
      <div className="flex items-center gap-2">
        {isText ? (
          <div className="w-8 h-8 rounded-none bg-primary/10 flex items-center justify-center">
            <Type className="w-4 h-4 text-primary" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-none bg-primary/10 flex items-center justify-center">
            <Image className="w-4 h-4 text-primary" />
          </div>
        )}
        <div>
          <p className="text-sm font-semibold text-foreground">{isText ? 'Text Element' : 'Image Element'}</p>
          <p className="text-[11px] text-muted-foreground">Edit properties below</p>
        </div>
      </div>

      {/* ─── Position & Size ─── */}
      <div className="space-y-3">
        <Label className="text-muted-foreground text-xs uppercase tracking-wide">Position & Size</Label>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-[11px] text-muted-foreground">X (%)</label>
            <Input
              type="number"
              value={Math.round(element.x * 10) / 10}
              onChange={(e) => onUpdate({ x: Number(e.target.value) })}
              className="h-8 text-xs bg-background border-border"
              min={0} max={100} step={0.5}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] text-muted-foreground">Y (%)</label>
            <Input
              type="number"
              value={Math.round(element.y * 10) / 10}
              onChange={(e) => onUpdate({ y: Number(e.target.value) })}
              className="h-8 text-xs bg-background border-border"
              min={0} max={100} step={0.5}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] text-muted-foreground">Width (%)</label>
            <Input
              type="number"
              value={Math.round(element.width * 10) / 10}
              onChange={(e) => onUpdate({ width: Number(e.target.value) })}
              className="h-8 text-xs bg-background border-border"
              min={5} max={100} step={0.5}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] text-muted-foreground">Height (%)</label>
            <Input
              type="number"
              value={Math.round(element.height * 10) / 10}
              onChange={(e) => onUpdate({ height: Number(e.target.value) })}
              className="h-8 text-xs bg-background border-border"
              min={3} max={100} step={0.5}
            />
          </div>
        </div>
      </div>

      {/* ─── Rotation ─── */}
      <div className="space-y-3 border-t border-border pt-5">
        <Label className="text-muted-foreground text-xs uppercase tracking-wide flex items-center gap-1.5">
          <RotateCw className="w-3 h-3" />
          Rotation
        </Label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={-180}
            max={180}
            value={element.rotation || 0}
            onChange={(e) => onUpdate({ rotation: Number(e.target.value) })}
            className="flex-1 accent-primary h-1.5"
          />
          <Input
            type="number"
            value={element.rotation || 0}
            onChange={(e) => onUpdate({ rotation: Number(e.target.value) })}
            className="w-16 h-8 text-xs text-center bg-background border-border"
            min={-360} max={360}
          />
          <span className="text-xs text-muted-foreground">°</span>
        </div>
        <div className="flex items-center gap-1.5">
          {[0, 45, 90, 180, -90, -45].map(deg => (
            <button
              key={deg}
              onClick={() => onUpdate({ rotation: deg })}
              className={cn(
                'px-2 py-1 rounded-none text-[11px] font-medium transition-colors',
                element.rotation === deg
                  ? 'bg-primary/15 text-primary'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              )}
            >
              {deg}°
            </button>
          ))}
        </div>
      </div>

      {/* ─── Opacity ─── */}
      <div className="space-y-3 border-t border-border pt-5">
        <Label className="text-muted-foreground text-xs uppercase tracking-wide flex items-center gap-1.5">
          <Eye className="w-3 h-3" />
          Opacity
        </Label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={100}
            value={(style.opacity ?? 1) * 100}
            onChange={(e) => onUpdateStyle({ opacity: Number(e.target.value) / 100 })}
            className="flex-1 accent-primary h-1.5"
          />
          <span className="text-xs text-muted-foreground w-10 text-right">{Math.round((style.opacity ?? 1) * 100)}%</span>
        </div>
      </div>

      {/* ─── Text-specific settings ─── */}
      {isText && (
        <div className="space-y-3 border-t border-border pt-5">
          <Label className="text-muted-foreground text-xs uppercase tracking-wide">Text Formatting</Label>

          {/* Font size */}
          <div className="space-y-1">
            <label className="text-[11px] text-muted-foreground">Font size</label>
            <select
              value={style.fontSize || 16}
              onChange={(e) => onUpdateStyle({ fontSize: Number(e.target.value) })}
              className="w-full h-8 px-2 rounded-none bg-background border border-border text-foreground text-xs"
            >
              {[10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48, 56, 64, 72].map(s => (
                <option key={s} value={s}>{s}px</option>
              ))}
            </select>
          </div>

          {/* Bold / Italic */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onUpdateStyle({ fontWeight: style.fontWeight === 'bold' ? 'normal' : 'bold' })}
              className={cn('p-2 rounded-none transition-colors', style.fontWeight === 'bold' ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground hover:text-foreground')}
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onUpdateStyle({ fontStyle: style.fontStyle === 'italic' ? 'normal' : 'italic' })}
              className={cn('p-2 rounded-none transition-colors', style.fontStyle === 'italic' ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground hover:text-foreground')}
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-5 bg-border mx-1" />
            {(['left', 'center', 'right'] as const).map(align => {
              const AlignIcon = align === 'left' ? AlignLeft : align === 'center' ? AlignCenter : AlignRight
              return (
                <button
                  key={align}
                  onClick={() => onUpdateStyle({ textAlign: align })}
                  className={cn('p-2 rounded-none transition-colors', style.textAlign === align ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground hover:text-foreground')}
                >
                  <AlignIcon className="w-3.5 h-3.5" />
                </button>
              )
            })}
          </div>

          {/* Text color */}
          <div className="space-y-1">
            <label className="text-[11px] text-muted-foreground">Text colour</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={style.color || '#374151'}
                onChange={(e) => onUpdateStyle({ color: e.target.value })}
                className="w-8 h-8 rounded-none cursor-pointer border border-border"
              />
              <Input
                value={style.color || '#374151'}
                onChange={(e) => onUpdateStyle({ color: e.target.value })}
                className="h-8 text-xs bg-background border-border font-mono flex-1"
              />
            </div>
          </div>

          {/* Background color */}
          <div className="space-y-1">
            <label className="text-[11px] text-muted-foreground">Background colour</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={style.backgroundColor || '#ffffff'}
                onChange={(e) => onUpdateStyle({ backgroundColor: e.target.value })}
                className="w-8 h-8 rounded-none cursor-pointer border border-border"
              />
              <Input
                value={style.backgroundColor || ''}
                onChange={(e) => onUpdateStyle({ backgroundColor: e.target.value })}
                className="h-8 text-xs bg-background border-border font-mono flex-1"
                placeholder="transparent"
              />
              {style.backgroundColor && (
                <Tooltip><TooltipTrigger asChild>
                <button
                  onClick={() => onUpdateStyle({ backgroundColor: '' })}
                  className="p-1.5 rounded-none text-muted-foreground hover:text-foreground hover:bg-muted text-xs"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
                </TooltipTrigger><TooltipContent>Clear background</TooltipContent></Tooltip>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── Image-specific settings ─── */}
      {isImage && (
        <div className="space-y-3 border-t border-border pt-5">
          <Label className="text-muted-foreground text-xs uppercase tracking-wide">Image Settings</Label>

          {/* Object fit */}
          <div className="space-y-1">
            <label className="text-[11px] text-muted-foreground">Object fit</label>
            <div className="flex items-center gap-1.5">
              {(['cover', 'contain', 'fill'] as const).map(fit => (
                <button
                  key={fit}
                  onClick={() => onUpdateStyle({ objectFit: fit })}
                  className={cn(
                    'flex-1 py-1.5 rounded-none text-xs font-medium transition-colors',
                    style.objectFit === fit
                      ? 'bg-primary/15 text-primary'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  )}
                >
                  {fit === 'cover' ? 'Cover' : fit === 'contain' ? 'Contain' : 'Fill'}
                </button>
              ))}
            </div>
          </div>

          {/* Border radius */}
          <div className="space-y-1">
            <label className="text-[11px] text-muted-foreground">Border radius</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={50}
                value={style.borderRadius || 0}
                onChange={(e) => onUpdateStyle({ borderRadius: Number(e.target.value) })}
                className="flex-1 accent-primary h-1.5"
              />
              <span className="text-xs text-muted-foreground w-10 text-right">{style.borderRadius || 0}px</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Tooltip><TooltipTrigger asChild>
              <button
                onClick={() => onUpdateStyle({ borderRadius: 0 })}
                className={cn('p-1.5 rounded-none transition-colors', (style.borderRadius || 0) === 0 ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground hover:text-foreground')}
              >
                <Square className="w-3.5 h-3.5" />
              </button>
              </TooltipTrigger><TooltipContent>Sharp corners</TooltipContent></Tooltip>
              <Tooltip><TooltipTrigger asChild>
              <button
                onClick={() => onUpdateStyle({ borderRadius: 8 })}
                className={cn('p-1.5 rounded-none transition-colors', style.borderRadius === 8 ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground hover:text-foreground')}
              >
                <Square className="w-3.5 h-3.5" style={{ borderRadius: 3 }} />
              </button>
              </TooltipTrigger><TooltipContent>Rounded corners</TooltipContent></Tooltip>
              <Tooltip><TooltipTrigger asChild>
              <button
                onClick={() => onUpdateStyle({ borderRadius: 50 })}
                className={cn('p-1.5 rounded-none transition-colors', style.borderRadius === 50 ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground hover:text-foreground')}
              >
                <Circle className="w-3.5 h-3.5" />
              </button>
              </TooltipTrigger><TooltipContent>Circle</TooltipContent></Tooltip>
            </div>
          </div>

          {/* Image URL (to change) */}
          <div className="space-y-1">
            <label className="text-[11px] text-muted-foreground">Image URL</label>
            <Input
              value={element.content}
              onChange={(e) => onUpdate({ content: e.target.value })}
              className="h-8 text-xs bg-background border-border"
              placeholder="https://..."
            />
          </div>
        </div>
      )}

      {/* ─── Delete ─── */}
      <div className="border-t border-border pt-5">
        <button
          onClick={onDelete}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-none text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors border border-destructive/20"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete element
        </button>
      </div>
    </div>
  )
}
