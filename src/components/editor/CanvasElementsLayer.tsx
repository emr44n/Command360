'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import type { CanvasElement } from '@/types/slide'
import { Type, Image, X, Bold, Italic, AlignLeft, AlignCenter, AlignRight, Trash2, GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

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

// curved-arrow cursor shown in the rotate ring just outside each corner
const ROTATE_CURSOR = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 24 24' fill='none' stroke='%23dc2626' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 12a9 9 0 1 0 2.6-6.4'/%3E%3Cpolyline points='3 3 3 8 8 8'/%3E%3C/svg%3E") 11 11, grab`

export function CanvasElementsLayer({ elements, onChange, containerRef, selectedElementId, onSelectElement, onRequestAddImage }: Props) {
  // Use lifted state if provided, otherwise fall back to local state
  const [localSelectedId, setLocalSelectedId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)

  const selectedId = selectedElementId !== undefined ? selectedElementId : localSelectedId
  const setSelectedId = onSelectElement || setLocalSelectedId

  const selected = elements.find(e => e.id === selectedId) || null

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

  // Keyboard delete
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (selectedId && !editingId && (e.key === 'Delete' || e.key === 'Backspace')) {
        e.preventDefault()
        deleteElement(selectedId)
      }
      if (e.key === 'Escape') {
        setSelectedId(null)
        setEditingId(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedId, editingId, deleteElement])

  return (
    <>
      {/* Canvas elements overlay */}
      <div
        style={{ position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none' }}
        onClick={handleCanvasClick}
      >
        {elements.map(el => (
          <DraggableElement
            key={el.id}
            element={el}
            isSelected={el.id === selectedId}
            isEditing={el.id === editingId}
            containerRef={containerRef}
            onSelect={() => { setSelectedId(el.id); setEditingId(null) }}
            onStartEdit={() => setEditingId(el.id)}
            onUpdate={(updates) => updateElement(el.id, updates)}
            onUpdateStyle={(s) => updateElementStyle(el.id, s)}
            onDelete={() => deleteElement(el.id)}
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

/* ─── Draggable Element ─── */

function DraggableElement({ element, isSelected, isEditing, containerRef, onSelect, onStartEdit, onUpdate, onUpdateStyle, onDelete }: {
  element: CanvasElement
  isSelected: boolean
  isEditing: boolean
  containerRef: React.RefObject<HTMLDivElement | null>
  onSelect: () => void
  onStartEdit: () => void
  onUpdate: (updates: Partial<CanvasElement>) => void
  onUpdateStyle: (s: Partial<NonNullable<CanvasElement['style']>>) => void
  onDelete: () => void
}) {
  const elRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)
  const [resizing, setResizing] = useState<string | null>(null)
  const [rotating, setRotating] = useState(false)
  const dragStart = useRef({ x: 0, y: 0, elX: 0, elY: 0, elW: 0, elH: 0 })
  const rotateStart = useRef({ cx: 0, cy: 0, startAngle: 0, startRotation: 0 })

  const startDrag = useCallback((e: React.MouseEvent) => {
    if (isEditing) return
    e.preventDefault()
    e.stopPropagation()
    onSelect()
    setDragging(true)
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      elX: element.x,
      elY: element.y,
      elW: element.width,
      elH: element.height,
    }
  }, [element, isEditing, onSelect, containerRef])

  const startResize = useCallback((e: React.MouseEvent, handle: string) => {
    e.preventDefault()
    e.stopPropagation()
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
  }, [element, containerRef])

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
    if (!dragging && !resizing && !rotating) return

    function onMove(e: MouseEvent) {
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
        const newX = dragStart.current.elX + dx
        const newY = dragStart.current.elY + dy
        onUpdate({ x: Math.round(newX * 10) / 10, y: Math.round(newY * 10) / 10 })
      }

      if (resizing) {
        let newW = dragStart.current.elW
        let newH = dragStart.current.elH
        let newX = dragStart.current.elX
        let newY = dragStart.current.elY

        if (resizing.includes('e')) newW = Math.max(5, dragStart.current.elW + dx)
        if (resizing.includes('w')) { newW = Math.max(5, dragStart.current.elW - dx); newX = dragStart.current.elX + dx }
        if (resizing.includes('s')) newH = Math.max(3, dragStart.current.elH + dy)
        if (resizing.includes('n')) { newH = Math.max(3, dragStart.current.elH - dy); newY = dragStart.current.elY + dy }

        onUpdate({
          x: Math.round(newX * 10) / 10,
          y: Math.round(newY * 10) / 10,
          width: Math.round(Math.max(5, newW) * 10) / 10,
          height: Math.round(Math.max(3, newH) * 10) / 10,
        })
      }
    }

    function onUp() {
      setDragging(false)
      setResizing(null)
      setRotating(false)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [dragging, resizing, rotating, onUpdate, containerRef])

  const style = element.style || {}

  // ─── resolved design-tool styling ───
  // border-radius: prefer the % model (50% = circle); fall back to legacy px
  const radius = style.borderRadiusPct != null ? `${style.borderRadiusPct}%` : `${style.borderRadius || 0}px`
  const borderW = style.borderWidth || 0
  const border = borderW > 0 ? `${borderW}px solid ${style.borderColor || '#ffffff'}` : undefined
  // per-edge feather → two nested gradient masks (vertical + horizontal) that
  // multiply, so corners fade correctly without needing mask-composite
  const ef = style.edgeFade || {}
  const ft = ef.top || 0, fb = ef.bottom || 0, fl = ef.left || 0, fr = ef.right || 0
  const vMask = (ft || fb) ? `linear-gradient(to bottom, transparent 0%, #000 ${ft}%, #000 ${100 - fb}%, transparent 100%)` : undefined
  const hMask = (fl || fr) ? `linear-gradient(to right, transparent 0%, #000 ${fl}%, #000 ${100 - fr}%, transparent 100%)` : undefined
  const imgTransform = `translate(${style.imagePanX || 0}%, ${style.imagePanY || 0}%) scale(${style.imageScale || 1})`

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
        cursor: isEditing ? 'text' : dragging ? 'grabbing' : 'grab',
        outline: isSelected ? '2px solid #dc2626' : 'none',
        outlineOffset: 2,
        borderRadius: radius,
        border,
        boxSizing: 'border-box',
        opacity: style.opacity ?? 1,
        zIndex: isSelected ? 25 : 22,
        transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
      }}
      onMouseDown={startDrag}
      onClick={(e) => { e.stopPropagation(); onSelect() }}
      onDoubleClick={(e) => {
        e.stopPropagation()
        if (element.type === 'text') onStartEdit()
      }}
    >
      {/* content clipped to the radius; nested wrappers carry the edge-fade masks */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: radius, WebkitMaskImage: vMask, maskImage: vMask }}>
        <div style={{ width: '100%', height: '100%', WebkitMaskImage: hMask, maskImage: hMask }}>
          {element.type === 'text' && (
            isEditing ? (
              <textarea
                autoFocus
                value={element.content}
                onChange={(e) => onUpdate({ content: e.target.value })}
                onMouseDown={(e) => e.stopPropagation()}
                style={{
                  width: '100%',
                  height: '100%',
                  background: style.backgroundColor || 'transparent',
                  color: style.color || '#374151',
                  fontSize: style.fontSize || 16,
                  fontWeight: style.fontWeight || 'normal',
                  fontStyle: style.fontStyle || 'normal',
                  textAlign: (style.textAlign as 'left' | 'center' | 'right') || 'left',
                  border: 'none',
                  outline: 'none',
                  resize: 'none',
                  padding: '4px 6px',
                  lineHeight: 1.4,
                  overflow: 'hidden',
                  fontFamily: 'inherit',
                }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: style.backgroundColor || 'transparent',
                  color: style.color || '#374151',
                  fontSize: style.fontSize || 16,
                  fontWeight: style.fontWeight || 'normal',
                  fontStyle: style.fontStyle || 'normal',
                  textAlign: (style.textAlign as 'left' | 'center' | 'right') || 'left',
                  padding: '4px 6px',
                  lineHeight: 1.4,
                  overflow: 'hidden',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  userSelect: 'none',
                }}
              >
                {element.content || 'Click to edit'}
              </div>
            )
          )}

          {element.type === 'image' && (
            <img
              src={element.content}
              alt=""
              draggable={false}
              style={{
                width: '100%',
                height: '100%',
                objectFit: (style.objectFit as 'cover' | 'contain' | 'fill') || 'cover',
                transform: imgTransform,
                transformOrigin: 'center',
                userSelect: 'none',
                pointerEvents: 'none',
              }}
            />
          )}
        </div>
      </div>

      {/* Resize handles when selected */}
      {isSelected && !isEditing && (
        <>
          {/* rotation rings just OUTSIDE each corner (scale handle sits on top) */}
          {['nw', 'ne', 'sw', 'se'].map(corner => {
            const pos: React.CSSProperties = {}
            if (corner.includes('n')) pos.top = -24
            if (corner.includes('s')) pos.bottom = -24
            if (corner.includes('w')) pos.left = -24
            if (corner.includes('e')) pos.right = -24
            return (
              <div
                key={`rot-${corner}`}
                onMouseDown={startRotate}
                style={{ position: 'absolute', ...pos, width: 24, height: 24, zIndex: 28, cursor: ROTATE_CURSOR }}
              />
            )
          })}
          {['nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w'].map(handle => {
            const isCorner = handle.length === 2
            const pos: React.CSSProperties = {}
            if (handle.includes('n')) pos.top = -5
            if (handle.includes('s')) pos.bottom = -5
            if (handle.includes('w')) pos.left = -5
            if (handle.includes('e')) pos.right = -5
            if (handle === 'n' || handle === 's') { pos.left = '50%'; pos.marginLeft = -4 }
            if (handle === 'e' || handle === 'w') { pos.top = '50%'; pos.marginTop = -4 }

            const cursors: Record<string, string> = {
              nw: 'nw-resize', ne: 'ne-resize', sw: 'sw-resize', se: 'se-resize',
              n: 'n-resize', s: 's-resize', e: 'e-resize', w: 'w-resize',
            }

            return (
              <div
                key={handle}
                onMouseDown={(e) => startResize(e, handle)}
                style={{
                  position: 'absolute',
                  ...pos,
                  width: isCorner ? 10 : 8,
                  height: isCorner ? 10 : 8,
                  background: '#dc2626',
                  border: '2px solid #fff',
                  borderRadius: isCorner ? 2 : 1,
                  cursor: cursors[handle],
                  zIndex: 30,
                }}
              />
            )
          })}
        </>
      )}
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
