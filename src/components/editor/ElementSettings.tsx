'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'
import type { CanvasElement } from '@/types/slide'
import { Input } from '@/components/ui/input'
import {
  Type, Image, Bold, Italic, AlignLeft, AlignCenter, AlignRight,
  Trash2, RotateCw, Square, Circle, Eye, Move, ChevronDown, Layers, Sparkles, Wind,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

interface Props {
  element: CanvasElement
  onUpdate: (updates: Partial<CanvasElement>) => void
  onUpdateStyle: (style: Partial<NonNullable<CanvasElement['style']>>) => void
  onDelete: () => void
}

/* Collapsible section — keeps the panel clean; expand only what you need. */
function Section({ id, title, icon, open, onToggle, children }: {
  id: string; title: string; icon: ReactNode; open: boolean; onToggle: (id: string) => void; children: ReactNode
}) {
  return (
    <div className="border-t border-border first:border-t-0">
      <button
        onClick={() => onToggle(id)}
        className="w-full flex items-center justify-between py-2.5 group"
      >
        <span className="flex items-center gap-1.5 text-muted-foreground text-xs uppercase tracking-wide font-medium group-hover:text-foreground transition-colors">
          {icon}{title}
        </span>
        <ChevronDown className={cn('w-3.5 h-3.5 text-muted-foreground/70 transition-transform', open && 'rotate-180')} />
      </button>
      {open && <div className="pb-4 space-y-3">{children}</div>}
    </div>
  )
}

export function ElementSettings({ element, onUpdate, onUpdateStyle, onDelete }: Props) {
  const style = element.style || {}
  const isText = element.type === 'text'
  const isImage = element.type === 'image'
  const ef = style.edgeFade || {}
  const anim = style.anim || {}
  const sides = ['top', 'bottom', 'left', 'right'] as const

  // which sections are expanded — type-specific + position open by default,
  // advanced controls collapsed to keep things tidy
  const [open, setOpen] = useState<Record<string, boolean>>({
    layout: true, content: true, rotation: false, opacity: false, edge: false, fade: false,
  })
  const toggle = (id: string) => setOpen((o) => ({ ...o, [id]: !o[id] }))

  const fadeMode = anim.fadeIn && anim.fadeOut ? 'both' : anim.fadeIn ? 'enter' : anim.fadeOut ? 'exit' : 'none'
  const setFadeMode = (mode: 'enter' | 'exit' | 'both') => {
    if (fadeMode === mode) { onUpdateStyle({ anim: undefined }); return } // toggle off
    const flags = mode === 'both' ? { fadeIn: true, fadeOut: true } : mode === 'enter' ? { fadeIn: true, fadeOut: false } : { fadeIn: false, fadeOut: true }
    onUpdateStyle({ anim: { ...anim, ...flags, speed: anim.speed ?? 600 } })
  }

  return (
    <div>
      {/* Element type header */}
      <div className="flex items-center gap-2 pb-3">
        <div className="w-8 h-8 rounded-none bg-primary/10 flex items-center justify-center">
          {isText ? <Type className="w-4 h-4 text-primary" /> : <Image className="w-4 h-4 text-primary" />}
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{isText ? 'Text Element' : 'Image Element'}</p>
          <p className="text-[11px] text-muted-foreground">Edit properties below</p>
        </div>
      </div>

      {/* ─── Position & Size ─── */}
      <Section id="layout" title="Position & Size" icon={<Move className="w-3 h-3" />} open={open.layout} onToggle={toggle}>
        <div className="grid grid-cols-2 gap-2">
          {([['x', 'X (%)', 0, 100], ['y', 'Y (%)', 0, 100], ['width', 'Width (%)', 5, 100], ['height', 'Height (%)', 3, 100]] as const).map(([key, label, min, max]) => (
            <div key={key} className="space-y-1">
              <label className="text-[11px] text-muted-foreground">{label}</label>
              <Input
                type="number"
                value={Math.round((element[key] as number) * 10) / 10}
                onChange={(e) => onUpdate({ [key]: Number(e.target.value) })}
                className="h-8 text-xs bg-background border-border"
                min={min} max={max} step={0.5}
              />
            </div>
          ))}
        </div>
      </Section>

      {/* ─── Rotation ─── */}
      <Section id="rotation" title="Rotation" icon={<RotateCw className="w-3 h-3" />} open={open.rotation} onToggle={toggle}>
        <div className="flex items-center gap-3">
          <input type="range" min={-180} max={180} value={element.rotation || 0} onChange={(e) => onUpdate({ rotation: Number(e.target.value) })} className="flex-1 accent-primary h-1.5" />
          <Input type="number" value={element.rotation || 0} onChange={(e) => onUpdate({ rotation: Number(e.target.value) })} className="w-16 h-8 text-xs text-center bg-background border-border" min={-360} max={360} />
          <span className="text-xs text-muted-foreground">°</span>
        </div>
        <div className="flex items-center gap-1.5">
          {[0, 45, 90, 180, -90, -45].map(deg => (
            <button key={deg} onClick={() => onUpdate({ rotation: deg })} className={cn('px-2 py-1 rounded-none text-[11px] font-medium transition-colors', element.rotation === deg ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground hover:text-foreground')}>{deg}°</button>
          ))}
        </div>
      </Section>

      {/* ─── Opacity ─── */}
      <Section id="opacity" title="Opacity" icon={<Eye className="w-3 h-3" />} open={open.opacity} onToggle={toggle}>
        <div className="flex items-center gap-3">
          <input type="range" min={0} max={100} value={(style.opacity ?? 1) * 100} onChange={(e) => onUpdateStyle({ opacity: Number(e.target.value) / 100 })} className="flex-1 accent-primary h-1.5" />
          <span className="text-xs text-muted-foreground w-10 text-right">{Math.round((style.opacity ?? 1) * 100)}%</span>
        </div>
      </Section>

      {/* ─── Edge fade (per side) ─── */}
      <Section id="edge" title="Edge fade" icon={<Wind className="w-3 h-3" />} open={open.edge} onToggle={toggle}>
        <div className="flex gap-4">
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
                <button key={side} onClick={() => onUpdateStyle({ edgeFade: { ...ef, [side]: on ? 0 : 25 } })} className={cn('absolute w-4 h-4 rounded-full border transition-colors', posCls, on ? 'bg-primary border-primary' : 'bg-background border-border hover:border-primary/60')} aria-label={`${side} edge fade`} />
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
      </Section>

      {/* ─── Fade animation (enter / exit / both) ─── */}
      <Section id="fade" title="Fade animation" icon={<Sparkles className="w-3 h-3" />} open={open.fade} onToggle={toggle}>
        <div className="flex items-center gap-1.5">
          {(['enter', 'exit', 'both'] as const).map((mode) => (
            <button key={mode} onClick={() => setFadeMode(mode)} className={cn('flex-1 py-1.5 rounded-none text-xs font-medium capitalize transition-colors', fadeMode === mode ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground hover:text-foreground')}>
              {mode === 'enter' ? 'On enter' : mode === 'exit' ? 'On exit' : 'Both'}
            </button>
          ))}
        </div>
        {fadeMode !== 'none' && (
          <>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-muted-foreground"><span>Speed</span><span>{((anim.speed ?? 600) / 1000).toFixed(1)}s</span></div>
              <input type="range" min={200} max={2000} step={100} value={anim.speed ?? 600} onChange={(e) => onUpdateStyle({ anim: { ...anim, speed: Number(e.target.value) } })} className="w-full accent-primary h-1.5" />
            </div>
            <p className="text-[11px] text-muted-foreground/80 leading-relaxed">Plays once as the slide enters / exits — in preview and when presenting.</p>
            <button onClick={() => onUpdateStyle({ anim: undefined })} className="text-[11px] text-muted-foreground hover:text-destructive transition-colors">Remove animation</button>
          </>
        )}
      </Section>

      {/* ─── Text-specific settings ─── */}
      {isText && (
        <Section id="content" title="Text Formatting" icon={<Type className="w-3 h-3" />} open={open.content} onToggle={toggle}>
          <div className="space-y-1">
            <label className="text-[11px] text-muted-foreground">Font size</label>
            <select value={style.fontSize || 16} onChange={(e) => onUpdateStyle({ fontSize: Number(e.target.value) })} className="w-full h-8 px-2 rounded-none bg-background border border-border text-foreground text-xs">
              {[10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48, 56, 64, 72].map(s => <option key={s} value={s}>{s}px</option>)}
            </select>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={() => onUpdateStyle({ fontWeight: style.fontWeight === 'bold' ? 'normal' : 'bold' })} className={cn('p-2 rounded-none transition-colors', style.fontWeight === 'bold' ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground hover:text-foreground')}><Bold className="w-3.5 h-3.5" /></button>
            <button onClick={() => onUpdateStyle({ fontStyle: style.fontStyle === 'italic' ? 'normal' : 'italic' })} className={cn('p-2 rounded-none transition-colors', style.fontStyle === 'italic' ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground hover:text-foreground')}><Italic className="w-3.5 h-3.5" /></button>
            <div className="w-px h-5 bg-border mx-1" />
            {(['left', 'center', 'right'] as const).map(align => {
              const AlignIcon = align === 'left' ? AlignLeft : align === 'center' ? AlignCenter : AlignRight
              return <button key={align} onClick={() => onUpdateStyle({ textAlign: align })} className={cn('p-2 rounded-none transition-colors', style.textAlign === align ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground hover:text-foreground')}><AlignIcon className="w-3.5 h-3.5" /></button>
            })}
          </div>
          <div className="space-y-1">
            <label className="text-[11px] text-muted-foreground">Text colour</label>
            <div className="flex items-center gap-2">
              <input type="color" value={style.color || '#374151'} onChange={(e) => onUpdateStyle({ color: e.target.value })} className="w-8 h-8 rounded-none cursor-pointer border border-border" />
              <Input value={style.color || '#374151'} onChange={(e) => onUpdateStyle({ color: e.target.value })} className="h-8 text-xs bg-background border-border font-mono flex-1" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[11px] text-muted-foreground">Background colour</label>
            <div className="flex items-center gap-2">
              <input type="color" value={style.backgroundColor || '#ffffff'} onChange={(e) => onUpdateStyle({ backgroundColor: e.target.value })} className="w-8 h-8 rounded-none cursor-pointer border border-border" />
              <Input value={style.backgroundColor || ''} onChange={(e) => onUpdateStyle({ backgroundColor: e.target.value })} className="h-8 text-xs bg-background border-border font-mono flex-1" placeholder="transparent" />
              {style.backgroundColor && (
                <Tooltip><TooltipTrigger asChild>
                  <button onClick={() => onUpdateStyle({ backgroundColor: '' })} className="p-1.5 rounded-none text-muted-foreground hover:text-foreground hover:bg-muted text-xs"><Trash2 className="w-3 h-3" /></button>
                </TooltipTrigger><TooltipContent>Clear background</TooltipContent></Tooltip>
              )}
            </div>
          </div>
        </Section>
      )}

      {/* ─── Image-specific settings ─── */}
      {isImage && (
        <Section id="content" title="Image Settings" icon={<Layers className="w-3 h-3" />} open={open.content} onToggle={toggle}>
          <div className="space-y-1">
            <label className="text-[11px] text-muted-foreground">Object fit</label>
            <div className="flex items-center gap-1.5">
              {(['cover', 'contain', 'fill'] as const).map(fit => (
                <button key={fit} onClick={() => onUpdateStyle({ objectFit: fit })} className={cn('flex-1 py-1.5 rounded-none text-xs font-medium capitalize transition-colors', style.objectFit === fit ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground hover:text-foreground')}>{fit}</button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-muted-foreground">Corner radius</label>
            <div className="flex items-center gap-3">
              <input type="range" min={0} max={50} value={style.borderRadiusPct ?? 0} onChange={(e) => onUpdateStyle({ borderRadiusPct: Number(e.target.value) })} className="flex-1 accent-primary h-1.5" />
              <span className="text-xs text-muted-foreground w-12 text-right">{(style.borderRadiusPct ?? 0) >= 50 ? 'circle' : `${style.borderRadiusPct ?? 0}%`}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Tooltip><TooltipTrigger asChild>
                <button onClick={() => onUpdateStyle({ borderRadiusPct: 0 })} className={cn('p-1.5 rounded-none transition-colors', (style.borderRadiusPct ?? 0) === 0 ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground hover:text-foreground')}><Square className="w-3.5 h-3.5" /></button>
              </TooltipTrigger><TooltipContent>Sharp corners</TooltipContent></Tooltip>
              <Tooltip><TooltipTrigger asChild>
                <button onClick={() => onUpdateStyle({ borderRadiusPct: 12 })} className={cn('p-1.5 rounded-none transition-colors', style.borderRadiusPct === 12 ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground hover:text-foreground')}><Square className="w-3.5 h-3.5" style={{ borderRadius: 3 }} /></button>
              </TooltipTrigger><TooltipContent>Rounded</TooltipContent></Tooltip>
              <Tooltip><TooltipTrigger asChild>
                <button onClick={() => onUpdateStyle({ borderRadiusPct: 50 })} className={cn('p-1.5 rounded-none transition-colors', style.borderRadiusPct === 50 ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground hover:text-foreground')}><Circle className="w-3.5 h-3.5" /></button>
              </TooltipTrigger><TooltipContent>Circle</TooltipContent></Tooltip>
            </div>
          </div>

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

          <div className="space-y-1">
            <label className="text-[11px] text-muted-foreground">Image scale (zoom inside frame)</label>
            <div className="flex items-center gap-3">
              <input type="range" min={100} max={400} value={Math.round((style.imageScale ?? 1) * 100)} onChange={(e) => onUpdateStyle({ imageScale: Number(e.target.value) / 100 })} className="flex-1 accent-primary h-1.5" />
              <span className="text-xs text-muted-foreground w-10 text-right">{Math.round((style.imageScale ?? 1) * 100)}%</span>
            </div>
            {(style.imageScale ?? 1) > 1 && (
              <>
                <p className="text-[11px] text-muted-foreground/80 leading-relaxed pt-0.5">Double-click the image on the canvas to drag it inside the frame.</p>
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
              </>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-muted-foreground">Image URL</label>
            <Input value={element.content} onChange={(e) => onUpdate({ content: e.target.value })} className="h-8 text-xs bg-background border-border" placeholder="https://..." />
          </div>
        </Section>
      )}

      {/* ─── Delete ─── */}
      <div className="border-t border-border pt-4 mt-1">
        <button onClick={onDelete} className="w-full flex items-center justify-center gap-2 py-2 rounded-none text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors border border-destructive/20">
          <Trash2 className="w-3.5 h-3.5" />
          Delete element
        </button>
      </div>
    </div>
  )
}
