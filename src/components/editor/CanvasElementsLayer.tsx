'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import type { CanvasElement } from '@/types/slide'
import { Type, Image, X, Bold, Italic, AlignLeft, AlignCenter, AlignRight, Trash2, GripVertical, Move } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { buildEdgeFadeMasks } from '@/lib/editor/edge-fade'

interface Props {
  elements: CanvasElement[]
  onChange: (elements: CanvasElement[]) => void
  containerRef: React.RefObject<HTMLDivElement | null>
  selectedElementId?: string | null
  onSelectElement?: (id: string | null) => void
  onRequestAddImage?: () => void
}

function generateId() {
  return `el_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

// Curved-arrow cursor shown in the rotate zone just outside each handle.
// Drawn as a white arrow with a dark halo (path stroked twice) so it stays
// crisp and legible on any background. 28px canvas, hotspot at centre.
const ROTATE_CURSOR = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'%3E%3Cg fill='none' stroke='%23111' stroke-width='4.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 14a8 8 0 1 0 2.3-5.6'/%3E%3Cpolyline points='6 5 6 10 11 10'/%3E%3C/g%3E%3Cg fill='none' stroke='%23fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 14a8 8 0 1 0 2.3-5.6'/%3E%3Cpolyline points='6 5 6 10 11 10'/%3E%3C/g%3E%3C/svg%3E") 14 14, grab`

export function CanvasElementsLayer({ elements, onChange, containerRef, selectedElementId, onSelectElement, onRequestAddImage }: Props) {
  // Use lifted state if provided, otherwise fall back to local state
  const [localSelectedId, setLocalSelectedId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  // Canva-style "reposition" mode: drag the image inside its frame to set the pan
  const [panMode, setPanMode] = useState(false)

  const selectedId = selectedElementId !== undefined ? selectedElementId : localSelectedId
  const setSelectedId = onSelectElement || setLocalSelectedId

  const selected = elements.find(e => e.id === selectedId) || null

  // leaving the image (or deselecting) exits reposition mode
  useEffect(() => {
    if (!selected || selected.type !== 'image') setPanMode(false)
  }, [selectedId, selected])

  const addTextElement = useCallback(() => {
    const el: CanvasElement = {
      id: generateId(),
      type: 'text',
      x: 10,
      y: 60,
      width: 40,
      height: 12,
      rotation: 0,
      content: 'Click to edit text',
      style: { fontSize: 16, fontWeight: 'normal', color: '#374151', textAlign: 'left' },
    }
    onChange([...elements, el])
    setSelectedId(el.id)
    setEditingId(el.id)
  }, [elements, onChange, setSelectedId])

  const addImageElement = useCallback(() => {
    if (onRequestAddImage) {
      onRequestAddImage()
      return
    }
    // Fallback: use a placeholder image instead of browser prompt
    const url = 'https://placehold.co/400x300/1e1f22/666?text=Image'
    const el: CanvasElement = {
      id: generateId(),
      type: 'image',
      x: 25,
      y: 30,
      width: 30,
      height: 30,
      rotation: 0,
      content: url,
      style: { objectFit: 'cover', borderRadius: 8, opacity: 1 },
    }
    onChange([...elements, el])
    setSelectedId(el.id)
  }, [elements, onChange, setSelectedId, onRequestAddImage])

  const updateElement = useCallback((id: string, updates: Partial<CanvasElement>) => {
    onChange(elements.map(e => e.id === id ? { ...e, ...updates } : e))
  }, [elements, onChange])

  const updateElementStyle = useCallback((id: string, styleUpdates: Partial<NonNullable<CanvasElement['style']>>) => {
    onChange(elements.map(e => {
      if (e.id !== id) return e
      return { ...e, style: { ...e.style, ...styleUpdates } }
    }))
  }, [elements, onChange])

  const deleteElement = useCallback((id: string) => {
    onChange(elements.filter(e => e.id !== id))
    if (selectedId === id) { setSelectedId(null); setEditingId(null) }
  }, [elements, onChange, selectedId, setSelectedId])

  // Click on canvas background deselects
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedId(null)
      setEditingId(null)
    }
  }, [])

  // Keyboard: delete, escape, and arrow-key nudge (Shift = larger step)
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const ae = document.activeElement
      const inField = !!ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA' || ae.tagName === 'SELECT' || (ae as HTMLElement).isContentEditable)

      if (selectedId && !editingId && !inField && (e.key === 'Delete' || e.key === 'Backspace')) {
        e.preventDefault()
        deleteElement(selectedId)
        return
      }
      if (e.key === 'Escape') {
        setSelectedId(null)
        setEditingId(null)
        return
      }
      if (selectedId && !editingId && !inField && e.key.startsWith('Arrow')) {
        const el = elements.find((x) => x.id === selectedId)
        if (!el) return
        e.preventDefault()
        const step = e.shiftKey ? 2 : 0.5
        let { x, y } = el
        if (e.key === 'ArrowLeft') x -= step
        else if (e.key === 'ArrowRight') x += step
        else if (e.key === 'ArrowUp') y -= step
        else if (e.key === 'ArrowDown') y += step
        updateElement(selectedId, { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedId, editingId, deleteElement, elements, updateElement, setSelectedId])

  return (
    <>
      {/* Canvas elements overlay.
          Content is rendered in two canvas-level layers so off-canvas parts
          ghost correctly even when an element is rotated:
            · ghost layer  — every element, dimmed, NOT clipped (the bleed)
            · crisp layer  — every element, full, clipped to the canvas bounds
                             (overflow:hidden in canvas pixel space → rotation-safe)
          The interactive frames (drag/resize/rotate + handles) sit on top. */}
      <div
        style={{ position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none' }}
        onClick={handleCanvasClick}
      >
        {/* off-canvas ghost (dimmed) */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {elements.map(el => el.id === editingId ? null : <ElementContent key={el.id} element={el} ghost />)}
        </div>
        {/* on-canvas crisp, clipped to the slide */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          {elements.map(el => el.id === editingId ? null : <ElementContent key={el.id} element={el} />)}
        </div>
        {/* interactive frames + handles */}
        {elements.map(el => (
          <DraggableElement
            key={el.id}
            element={el}
            isSelected={el.id === selectedId}
            isHovered={el.id === hoveredId}
            isEditing={el.id === editingId}
            containerRef={containerRef}
            onHover={(h) => setHoveredId(h ? el.id : (cur) => (cur === el.id ? null : cur))}
            onSelect={() => { setSelectedId(el.id); setEditingId(null) }}
            onStartEdit={() => setEditingId(el.id)}
            onUpdate={(updates) => updateElement(el.id, updates)}
            onUpdateStyle={(s) => updateElementStyle(el.id, s)}
            onDelete={() => deleteElement(el.id)}
            panMode={panMode && el.id === selectedId}
            onTogglePan={() => { setSelectedId(el.id); setPanMode(v => !v) }}
          />
        ))}
      </div>

      {/* Text formatting toolbar for selected text element */}
      {selected && selected.type === 'text' && selectedId && (
        <div
          style={{
            position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
            zIndex: 40,
          }}
        >
          <TextFormatToolbar
            element={selected}
            onUpdateStyle={(s) => updateElementStyle(selectedId, s)}
            onDelete={() => deleteElement(selectedId)}
          />
        </div>
      )}

      {/* Image toolbar */}
      {selected && selected.type === 'image' && selectedId && (
        <div
          style={{
            position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
            zIndex: 40,
          }}
        >
          <div className="flex items-center gap-1 px-2 py-1 rounded-none bg-card/95 backdrop-blur border border-border shadow-lg">
            <button
              onClick={() => {
                if (onRequestAddImage) { onRequestAddImage(); return }
              }}
              className="px-2 py-1 rounded-none text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              Change
            </button>
            <div className="w-px h-4 bg-border" />
            <button
              onClick={() => setPanMode(v => !v)}
              title="Drag the image inside its frame to reposition it"
              className={cn(
                'flex items-center gap-1 px-2 py-1 rounded-none text-xs transition-colors',
                panMode ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted',
              )}
            >
              <Move className="w-3.5 h-3.5" />
              Reposition
            </button>
            <div className="w-px h-4 bg-border" />
            <button
              onClick={() => deleteElement(selectedId)}
              className="p-1 rounded-none text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}

/* ─── Element content (pure visual — no interaction) ───
   Rendered in two canvas-level layers: a dimmed `ghost` (unclipped, shows the
   off-canvas bleed) and the crisp on-canvas copy (clipped to the slide by the
   parent layer's overflow:hidden, so it's correct under any rotation). */
function ElementContent({ element, ghost }: { element: CanvasElement; ghost?: boolean }) {
  const style = element.style || {}
  const radius = style.borderRadiusPct != null ? `${style.borderRadiusPct}%` : `${style.borderRadius || 0}px`
  const borderW = style.borderWidth || 0
  const border = borderW > 0 ? `${borderW}px solid ${style.borderColor || '#ffffff'}` : undefined
  const { vMask, hMask } = buildEdgeFadeMasks(style.edgeFade)
  const imgTransform = `translate(${style.imagePanX || 0}%, ${style.imagePanY || 0}%) scale(${style.imageScale || 1})`

  return (
    <div
      style={{
        position: 'absolute',
        left: `${element.x}%`, top: `${element.y}%`,
        width: `${element.width}%`, height: `${element.height}%`,
        borderRadius: radius,
        border,
        boxSizing: 'border-box',
        opacity: (style.opacity ?? 1) * (ghost ? 0.28 : 1),
        transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
        pointerEvents: 'none',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: radius, WebkitMaskImage: vMask, maskImage: vMask }}>
        <div style={{ width: '100%', height: '100%', WebkitMaskImage: hMask, maskImage: hMask }}>
          {element.type === 'text' && (
            <div style={{
              width: '100%', height: '100%',
              background: style.backgroundColor || 'transparent',
              color: style.color || '#374151',
              fontSize: style.fontSize || 16,
              fontWeight: style.fontWeight || 'normal',
              fontStyle: style.fontStyle || 'normal',
              textAlign: (style.textAlign as 'left' | 'center' | 'right') || 'left',
              padding: '4px 6px', lineHeight: 1.4, overflow: 'hidden',
              whiteSpace: 'pre-wrap', wordBreak: 'break-word', userSelect: 'none',
            }}>
              {element.content || 'Click to edit'}
            </div>
          )}
          {element.type === 'image' && (
            <img
              src={element.content}
              alt=""
              draggable={false}
              style={{
                width: '100%', height: '100%',
                objectFit: (style.objectFit as 'cover' | 'contain' | 'fill') || 'cover',
                transform: imgTransform, transformOrigin: 'center',
                userSelect: 'none', pointerEvents: 'none',
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── Draggable Element ─── */

function DraggableElement({ element, isSelected, isHovered, isEditing, containerRef, onHover, onSelect, onStartEdit, onUpdate, onUpdateStyle, onDelete, panMode, onTogglePan }: {
  element: CanvasElement
  isSelected: boolean
  isHovered: boolean
  isEditing: boolean
  containerRef: React.RefObject<HTMLDivElement | null>
  onHover: (hovering: boolean) => void
  onSelect: () => void
  onStartEdit: () => void
  onUpdate: (updates: Partial<CanvasElement>) => void
  onUpdateStyle: (s: Partial<NonNullable<CanvasElement['style']>>) => void
  onDelete: () => void
  panMode?: boolean
  onTogglePan?: () => void
}) {
  const elRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)
  const [panning, setPanning] = useState(false)
  const [resizing, setResizing] = useState<string | null>(null)
  const [rotating, setRotating] = useState(false)
  const dragStart = useRef({ x: 0, y: 0, elX: 0, elY: 0, elW: 0, elH: 0 })
  const panStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 })
  const rotateStart = useRef({ cx: 0, cy: 0, startAngle: 0, startRotation: 0 })

  const startDrag = useCallback((e: React.MouseEvent) => {
    if (isEditing) return
    e.preventDefault()
    e.stopPropagation()
    onSelect()
    const container = containerRef.current
    if (!container) return
    // reposition mode: drag pans the image within its frame instead of moving it
    if (panMode && element.type === 'image') {
      setPanning(true)
      panStart.current = {
        x: e.clientX, y: e.clientY,
        panX: element.style?.imagePanX || 0,
        panY: element.style?.imagePanY || 0,
      }
      return
    }
    setDragging(true)
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      elX: element.x,
      elY: element.y,
      elW: element.width,
      elH: element.height,
    }
  }, [element, isEditing, onSelect, containerRef, panMode])

  const startResize = useCallback((e: React.MouseEvent, handle: string) => {
    e.preventDefault()
    e.stopPropagation()
    onSelect()
    setResizing(handle)
    const container = containerRef.current
    if (!container) return
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      elX: element.x,
      elY: element.y,
      elW: element.width,
      elH: element.height,
    }
  }, [element, containerRef, onSelect])

  // Rotation — grabbed from the ring just outside a corner. Angle is measured
  // from the element centre to the pointer; Shift snaps to 15°.
  const startRotate = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onSelect()
    const el = elRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    rotateStart.current = {
      cx, cy,
      startAngle: (Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI,
      startRotation: element.rotation || 0,
    }
    setRotating(true)
  }, [element, onSelect])

  useEffect(() => {
    if (!dragging && !resizing && !rotating && !panning) return

    function onMove(e: MouseEvent) {
      if (panning) {
        const container = containerRef.current
        if (!container) return
        const rect = container.getBoundingClientRect()
        // convert pointer delta (px) → % of the element's own box
        const dxPct = ((e.clientX - panStart.current.x) / rect.width) * 100 / (element.width / 100)
        const dyPct = ((e.clientY - panStart.current.y) / rect.height) * 100 / (element.height / 100)
        const clamp = (v: number) => Math.max(-50, Math.min(50, Math.round(v * 10) / 10))
        onUpdateStyle({
          imagePanX: clamp(panStart.current.panX + dxPct),
          imagePanY: clamp(panStart.current.panY + dyPct),
        })
        return
      }
      if (rotating) {
        const a = (Math.atan2(e.clientY - rotateStart.current.cy, e.clientX - rotateStart.current.cx) * 180) / Math.PI
        let next = rotateStart.current.startRotation + (a - rotateStart.current.startAngle)
        if (e.shiftKey) next = Math.round(next / 15) * 15
        next = Math.round(next)
        while (next > 180) next -= 360
        while (next < -180) next += 360
        onUpdate({ rotation: next })
        return
      }
      const container = containerRef.current
      if (!container) return
      const rect = container.getBoundingClientRect()
      const dx = ((e.clientX - dragStart.current.x) / rect.width) * 100
      const dy = ((e.clientY - dragStart.current.y) / rect.height) * 100

      if (dragging) {
        // Allow elements to be dragged outside the slide boundary (pasteboard area)
        let newX = dragStart.current.elX + dx
        let newY = dragStart.current.elY + dy
        // Shift constrains movement to the dominant axis (like real design tools)
        if (e.shiftKey) {
          if (Math.abs(dx) >= Math.abs(dy)) newY = dragStart.current.elY
          else newX = dragStart.current.elX
        }
        onUpdate({ x: Math.round(newX * 10) / 10, y: Math.round(newY * 10) / 10 })
      }

      if (resizing) {
        const corner = resizing.length === 2
        let newW = dragStart.current.elW
        let newH = dragStart.current.elH
        let newX = dragStart.current.elX
        let newY = dragStart.current.elY

        if (resizing.includes('e')) newW = dragStart.current.elW + dx
        if (resizing.includes('w')) newW = dragStart.current.elW - dx
        if (resizing.includes('s')) newH = dragStart.current.elH + dy
        if (resizing.includes('n')) newH = dragStart.current.elH - dy
        newW = Math.max(5, newW)
        newH = Math.max(3, newH)

        // Shift on a corner = lock the aspect ratio (driven by the larger change)
        if (corner && e.shiftKey && dragStart.current.elH > 0) {
          const aspect = dragStart.current.elW / dragStart.current.elH
          if (Math.abs(newW - dragStart.current.elW) >= Math.abs(newH - dragStart.current.elH) * aspect) {
            newH = newW / aspect
          } else {
            newW = newH * aspect
          }
        }

        // keep the opposite edge anchored when dragging a west/north handle
        if (resizing.includes('w')) newX = dragStart.current.elX + (dragStart.current.elW - newW)
        if (resizing.includes('n')) newY = dragStart.current.elY + (dragStart.current.elH - newH)

        onUpdate({
          x: Math.round(newX * 10) / 10,
          y: Math.round(newY * 10) / 10,
          width: Math.round(newW * 10) / 10,
          height: Math.round(newH * 10) / 10,
        })
      }
    }

    function onUp() {
      setDragging(false)
      setResizing(null)
      setRotating(false)
      setPanning(false)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [dragging, resizing, rotating, panning, element.width, element.height, onUpdate, onUpdateStyle, containerRef])

  const style = element.style || {}
  const showHandles = (isSelected || isHovered) && !isEditing && !panMode

  return (
    <div
      ref={elRef}
      style={{
        position: 'absolute',
        left: `${element.x}%`,
        top: `${element.y}%`,
        width: `${element.width}%`,
        height: `${element.height}%`,
        pointerEvents: 'auto',
        cursor: isEditing ? 'text' : panMode && element.type === 'image' ? (panning ? 'grabbing' : 'move') : dragging ? 'grabbing' : 'grab',
        outline: isSelected
          ? (panMode && element.type === 'image' ? '2px dashed #dc2626' : '2px solid #dc2626')
          : isHovered ? '1px solid rgba(220,38,38,0.55)' : 'none',
        outlineOffset: 2,
        boxSizing: 'border-box',
        background: 'transparent',
        zIndex: isSelected ? 25 : isHovered ? 24 : 22,
        transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
      }}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onMouseDown={startDrag}
      onClick={(e) => { e.stopPropagation(); onSelect() }}
      onDoubleClick={(e) => {
        e.stopPropagation()
        // text → edit; image → enter/exit Canva-style reposition (drag inside frame)
        if (element.type === 'text') onStartEdit()
        else if (element.type === 'image') onTogglePan?.()
      }}
    >
      {/* The visible content lives in the canvas-level crisp/ghost layers; the
          frame is transparent and only carries interaction + handles. Text
          editing happens here so you can type. */}
      {isEditing && element.type === 'text' && (
        <textarea
          autoFocus
          value={element.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          onMouseDown={(e) => e.stopPropagation()}
          style={{
            width: '100%', height: '100%',
            background: style.backgroundColor || 'transparent',
            color: style.color || '#374151',
            fontSize: style.fontSize || 16,
            fontWeight: style.fontWeight || 'normal',
            fontStyle: style.fontStyle || 'normal',
            textAlign: (style.textAlign as 'left' | 'center' | 'right') || 'left',
            border: 'none', outline: 'none', resize: 'none',
            padding: '4px 6px', lineHeight: 1.4, overflow: 'hidden', fontFamily: 'inherit',
          }}
        />
      )}

      {/* Reposition-mode hint */}
      {isSelected && panMode && element.type === 'image' && (
        <div style={{ position: 'absolute', top: -22, left: 0, zIndex: 31, pointerEvents: 'none' }}
          className="ff-mono text-[9px] uppercase tracking-wider bg-[#dc2626] text-white px-1.5 py-0.5 whitespace-nowrap">
          Drag to reposition · double-click to finish
        </div>
      )}

      {/* Transform handles — shown on hover OR selection. Rotate zones sit
          OUTSIDE the scale handles (no overlap → no cursor flicker); both work
          from corners AND edge midpoints. */}
      {showHandles && (() => {
        const HIT = 16          // scale hit-box (centred on the point)
        const ROT = 16          // rotate zone size, placed just beyond the hit-box
        const cursors: Record<string, string> = {
          nw: 'nwse-resize', se: 'nwse-resize', ne: 'nesw-resize', sw: 'nesw-resize',
          n: 'ns-resize', s: 'ns-resize', e: 'ew-resize', w: 'ew-resize',
        }
        const HANDLES = ['nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w']
        // scale hit-box position (centred on the corner / edge-midpoint)
        const hitPos = (h: string): React.CSSProperties => {
          const p: React.CSSProperties = {}
          if (h.includes('n')) p.top = -HIT / 2
          if (h.includes('s')) p.bottom = -HIT / 2
          if (h.includes('w')) p.left = -HIT / 2
          if (h.includes('e')) p.right = -HIT / 2
          if (h === 'n' || h === 's') { p.left = '50%'; p.marginLeft = -HIT / 2 }
          if (h === 'e' || h === 'w') { p.top = '50%'; p.marginTop = -HIT / 2 }
          return p
        }
        // rotate zone position (just OUTSIDE the hit-box, no overlap)
        const rotPos = (h: string): React.CSSProperties => {
          const out = HIT / 2 + ROT  // distance from the edge to the zone's near side
          const p: React.CSSProperties = {}
          if (h.includes('n')) p.top = -out
          if (h.includes('s')) p.bottom = -out
          if (h.includes('w')) p.left = -out
          if (h.includes('e')) p.right = -out
          if (h === 'n' || h === 's') { p.left = '50%'; p.marginLeft = -ROT / 2 }
          if (h === 'e' || h === 'w') { p.top = '50%'; p.marginTop = -ROT / 2 }
          return p
        }
        return (
          <>
            {/* rotate zones (lower layer) */}
            {HANDLES.map(h => (
              <div
                key={`rot-${h}`}
                onMouseDown={startRotate}
                style={{ position: 'absolute', ...rotPos(h), width: ROT, height: ROT, zIndex: 28, cursor: ROTATE_CURSOR }}
              />
            ))}
            {/* scale handles (upper layer) — white dot, red ring, crisp */}
            {HANDLES.map(h => {
              const isCorner = h.length === 2
              const dot = isCorner ? 10 : 8
              return (
                <div
                  key={`scl-${h}`}
                  onMouseDown={(e) => startResize(e, h)}
                  style={{ position: 'absolute', ...hitPos(h), width: HIT, height: HIT, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: cursors[h], zIndex: 30 }}
                >
                  <div style={{
                    width: dot, height: dot,
                    background: '#fff',
                    border: '1.5px solid #dc2626',
                    borderRadius: isCorner ? 2 : '50%',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.35)',
                  }} />
                </div>
              )
            })}
          </>
        )
      })()}
    </div>
  )
}

/* ─── Text Format Toolbar ─── */

function TextFormatToolbar({ element, onUpdateStyle, onDelete }: {
  element: CanvasElement
  onUpdateStyle: (s: Partial<NonNullable<CanvasElement['style']>>) => void
  onDelete: () => void
}) {
  const style = element.style || {}

  return (
    <div className="flex items-center gap-0.5 px-2 py-1 rounded-none bg-card/95 backdrop-blur border border-border shadow-lg">
      {/* Font size */}
      <select
        value={style.fontSize || 16}
        onChange={(e) => onUpdateStyle({ fontSize: Number(e.target.value) })}
        className="bg-muted text-foreground text-xs rounded-none px-1 py-0.5 border-none outline-none cursor-pointer"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {[10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48, 56, 64, 72].map(s => (
          <option key={s} value={s}>{s}px</option>
        ))}
      </select>

      <div className="w-px h-4 bg-border mx-0.5" />

      {/* Bold */}
      <button
        onClick={() => onUpdateStyle({ fontWeight: style.fontWeight === 'bold' ? 'normal' : 'bold' })}
        className={cn('p-1 rounded-none transition-colors', style.fontWeight === 'bold' ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted')}
      >
        <Bold className="w-3.5 h-3.5" />
      </button>

      {/* Italic */}
      <button
        onClick={() => onUpdateStyle({ fontStyle: style.fontStyle === 'italic' ? 'normal' : 'italic' })}
        className={cn('p-1 rounded-none transition-colors', style.fontStyle === 'italic' ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted')}
      >
        <Italic className="w-3.5 h-3.5" />
      </button>

      <div className="w-px h-4 bg-border mx-0.5" />

      {/* Align */}
      {(['left', 'center', 'right'] as const).map(align => {
        const AlignIcon = align === 'left' ? AlignLeft : align === 'center' ? AlignCenter : AlignRight
        return (
          <button
            key={align}
            onClick={() => onUpdateStyle({ textAlign: align })}
            className={cn('p-1 rounded-none transition-colors', style.textAlign === align ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted')}
          >
            <AlignIcon className="w-3.5 h-3.5" />
          </button>
        )
      })}

      <div className="w-px h-4 bg-border mx-0.5" />

      {/* Color */}
      <Tooltip><TooltipTrigger asChild>
      <input
        type="color"
        value={style.color || '#374151'}
        onChange={(e) => onUpdateStyle({ color: e.target.value })}
        className="w-5 h-5 rounded-none cursor-pointer border-none"
        onMouseDown={(e) => e.stopPropagation()}
      />
      </TooltipTrigger><TooltipContent>Text color</TooltipContent></Tooltip>

      <div className="w-px h-4 bg-border mx-0.5" />

      {/* Delete */}
      <button
        onClick={onDelete}
        className="p-1 rounded-none text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
