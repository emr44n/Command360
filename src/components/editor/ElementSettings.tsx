'use client'

import type { CanvasElement } from '@/types/slide'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Type, Image, Bold, Italic, AlignLeft, AlignCenter, AlignRight,
  Trash2, RotateCw, Square, Circle, Eye,
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
  const ef = style.edgeFade || {}
  const anim = style.anim || {}
  const sides = ['top', 'bottom', 'left', 'right'] as const

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

      {/* ─── Edge fade (per side) ─── */}
      <div className="space-y-3 border-t border-border pt-5">
        <Label className="text-muted-foreground text-xs uppercase tracking-wide">Edge fade</Label>
        <div className="flex gap-4">
          {/* square with a cross — tap an edge to feather it */}
          <div className="relative w-[76px] h-[76px] shrink-0 border border-border bg-muted/30">
            <span className="absolute left-1/2 top-1.5 bottom-1.5 w-px -translate-x-1/2 bg-border" aria-hidden="true" />
            <span className="absolute top-1/2 left-1.5 right-1.5 h-px -translate-y-1/2 bg-border" aria-hidden="true" />
            {sides.map((side) => {
              const on = (ef[side] || 0) > 0
              const posCls =
                side === 'top' ? 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2'
                  : side === 'bottom' ? 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2'
                    : side === 'left' ? 'left-0 top-1/2 -translate-y-1/2 -translate-x-1/2'
                      : 'right-0 top-1/2 -translate-y-1/2 translate-x-1/2'
              return (
                <button
                  key={side}
                  onClick={() => onUpdateStyle({ edgeFade: { ...ef, [side]: on ? 0 : 25 } })}
                  className={cn('absolute w-4 h-4 rounded-full border transition-colors', posCls, on ? 'bg-primary border-primary' : 'bg-background border-border hover:border-primary/60')}
                  aria-label={`${side} edge fade`}
                />
              )
            })}
          </div>
          <div className="flex-1 space-y-2.5">
            {sides.filter((side) => (ef[side] || 0) > 0).map((side) => (
              <div key={side} className="space-y-1">
                <div className="flex justify-between text-[11px] text-muted-foreground"><span className="capitalize">{side}</span><span>{ef[side] || 0}%</span></div>
                <input type="range" min={0} max={60} value={ef[side] || 0} onChange={(e) => onUpdateStyle({ edgeFade: { ...ef, [side]: Number(e.target.value) } })} className="w-full accent-primary h-1.5" />
              </div>
            ))}
            {!(ef.top || ef.bottom || ef.left || ef.right) && (
              <p className="text-[11px] text-muted-foreground leading-relaxed">Tap an edge to softly fade it into the background.</p>
            )}
          </div>
        </div>
      </div>

      {/* ─── Fade animation (on enter / exit) ─── */}
      <div className="space-y-3 border-t border-border pt-5">
        <Label className="text-muted-foreground text-xs uppercase tracking-wide">Fade animation</Label>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onUpdateStyle({ anim: { ...anim, fadeIn: !anim.fadeIn } })}
            className={cn('flex-1 py-1.5 rounded-none text-xs font-medium transition-colors', anim.fadeIn ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground hover:text-foreground')}
          >
            On enter
          </button>
          <button
            onClick={() => onUpdateStyle({ anim: { ...anim, fadeOut: !anim.fadeOut } })}
            className={cn('flex-1 py-1.5 rounded-none text-xs font-medium transition-colors', anim.fadeOut ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground hover:text-foreground')}
          >
            On exit
          </button>
        </div>
        {(anim.fadeIn || anim.fadeOut) && (
          <>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-muted-foreground"><span>Speed</span><span>{((anim.speed ?? 600) / 1000).toFixed(1)}s</span></div>
              <input type="range" min={200} max={2000} step={100} value={anim.speed ?? 600} onChange={(e) => onUpdateStyle({ anim: { ...anim, speed: Number(e.target.value) } })} className="w-full accent-primary h-1.5" />
            </div>
            <button onClick={() => onUpdateStyle({ anim: undefined })} className="text-[11px] text-muted-foreground hover:text-destructive transition-colors">Remove animation</button>
          </>
        )}
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

          {/* Corner radius (% — 50% = full circle) */}
          <div className="space-y-1">
            <label className="text-[11px] text-muted-foreground">Corner radius</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={50}
                value={style.borderRadiusPct ?? 0}
                onChange={(e) => onUpdateStyle({ borderRadiusPct: Number(e.target.value) })}
                className="flex-1 accent-primary h-1.5"
              />
              <span className="text-xs text-muted-foreground w-12 text-right">{(style.borderRadiusPct ?? 0) >= 50 ? 'circle' : `${style.borderRadiusPct ?? 0}%`}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Tooltip><TooltipTrigger asChild>
              <button onClick={() => onUpdateStyle({ borderRadiusPct: 0 })} className={cn('p-1.5 rounded-none transition-colors', (style.borderRadiusPct ?? 0) === 0 ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground hover:text-foreground')}>
                <Square className="w-3.5 h-3.5" />
              </button>
              </TooltipTrigger><TooltipContent>Sharp corners</TooltipContent></Tooltip>
              <Tooltip><TooltipTrigger asChild>
              <button onClick={() => onUpdateStyle({ borderRadiusPct: 12 })} className={cn('p-1.5 rounded-none transition-colors', style.borderRadiusPct === 12 ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground hover:text-foreground')}>
                <Square className="w-3.5 h-3.5" style={{ borderRadius: 3 }} />
              </button>
              </TooltipTrigger><TooltipContent>Rounded</TooltipContent></Tooltip>
              <Tooltip><TooltipTrigger asChild>
              <button onClick={() => onUpdateStyle({ borderRadiusPct: 50 })} className={cn('p-1.5 rounded-none transition-colors', style.borderRadiusPct === 50 ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground hover:text-foreground')}>
                <Circle className="w-3.5 h-3.5" />
              </button>
              </TooltipTrigger><TooltipContent>Circle</TooltipContent></Tooltip>
            </div>
          </div>

          {/* Border */}
          <div className="space-y-1">
            <label className="text-[11px] text-muted-foreground">Border</label>
            <div className="flex items-center gap-3">
              <input type="range" min={0} max={20} value={style.borderWidth || 0} onChange={(e) => onUpdateStyle({ borderWidth: Number(e.target.value) })} className="flex-1 accent-primary h-1.5" />
              <span className="text-xs text-muted-foreground w-10 text-right">{style.borderWidth || 0}px</span>
            </div>
            {(style.borderWidth || 0) > 0 && (
              <div className="flex items-center gap-2 pt-1">
                <input type="color" value={style.borderColor || '#ffffff'} onChange={(e) => onUpdateStyle({ borderColor: e.target.value })} className="w-8 h-8 rounded-none cursor-pointer border border-border" />
                <Input value={style.borderColor || '#ffffff'} onChange={(e) => onUpdateStyle({ borderColor: e.target.value })} className="h-8 text-xs bg-background border-border font-mono flex-1" />
              </div>
            )}
          </div>

          {/* In-frame image zoom + pan */}
          <div className="space-y-1">
            <label className="text-[11px] text-muted-foreground">Image scale (zoom inside frame)</label>
            <div className="flex items-center gap-3">
              <input type="range" min={100} max={400} value={Math.round((style.imageScale ?? 1) * 100)} onChange={(e) => onUpdateStyle({ imageScale: Number(e.target.value) / 100 })} className="flex-1 accent-primary h-1.5" />
              <span className="text-xs text-muted-foreground w-10 text-right">{Math.round((style.imageScale ?? 1) * 100)}%</span>
            </div>
            {(style.imageScale ?? 1) > 1 && (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-muted-foreground"><span>Pan X</span><span>{style.imagePanX ?? 0}%</span></div>
                  <input type="range" min={-50} max={50} value={style.imagePanX ?? 0} onChange={(e) => onUpdateStyle({ imagePanX: Number(e.target.value) })} className="w-full accent-primary h-1.5" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-muted-foreground"><span>Pan Y</span><span>{style.imagePanY ?? 0}%</span></div>
                  <input type="range" min={-50} max={50} value={style.imagePanY ?? 0} onChange={(e) => onUpdateStyle({ imagePanY: Number(e.target.value) })} className="w-full accent-primary h-1.5" />
                </div>
              </div>
            )}
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
