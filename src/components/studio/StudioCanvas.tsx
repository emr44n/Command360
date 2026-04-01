'use client'

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react'
import { Stage, Layer, Rect, Text, Image as KonvaImage, Transformer, Group, Line as KonvaLine, Ellipse } from 'react-konva'
import Konva from 'konva'
import type { StudioLayer, StudioTrack, StudioLayerState } from '@/types/slide'
import { computeLayerStatesAtTime } from '@/lib/studio/playback-engine'
import { useStudioStore } from '@/stores/studioStore'

interface StudioCanvasProps {
  layers: StudioLayer[]
  tracks: StudioTrack[]
  currentTime: number
  canvasConfig: { width: number; height: number; backgroundColor: string }
  interactive?: boolean
  selectedLayerId?: string | null
  onSelectLayer?: (id: string | null) => void
  onUpdateLayer?: (id: string, updates: Partial<StudioLayer>) => void
  onDropAsset?: (type: 'image' | 'video', src: string, x: number, y: number) => void
  eventOverrides?: Record<string, Partial<StudioLayerState>>
}

const ASPECT_RATIO = 16 / 9

/**
 * Photoshop/Illustrator-style cursor detection for Konva Transformer.
 *
 * Konva's built-in anchors are separate nodes. We override their cursors so:
 * - Corner anchors (inside approach) → resize cursor
 * - Rotation anchor (outside approach) → rotate cursor
 * - Edge anchors → directional resize
 *
 * Additionally, we add a mousemove listener on the Stage so that when the
 * cursor is near a corner of the selected object from the OUTSIDE, the cursor
 * changes to 'grab' (rotate). From the INSIDE, it stays as resize.
 */
const ANCHOR_CURSORS: Record<string, string> = {
  'top-left': 'nwse-resize',
  'top-right': 'nesw-resize',
  'bottom-left': 'nesw-resize',
  'bottom-right': 'nwse-resize',
  'middle-left': 'ew-resize',
  'middle-right': 'ew-resize',
  'middle-top': 'ns-resize',
  'middle-bottom': 'ns-resize',
  'rotater': 'grab',
}

const CORNER_ROTATE_CURSORS: Record<string, string> = {
  'top-left': 'nwse-resize',
  'top-right': 'nesw-resize',
  'bottom-left': 'nesw-resize',
  'bottom-right': 'nwse-resize',
}

/** Attach Photoshop-style cursor handlers to Transformer anchor nodes */
function setupTransformerCursors(tr: { getStage: () => { container: () => HTMLDivElement } | null; find: (selector: string) => Array<{ name: () => string; on: (event: string, fn: () => void) => void }> } | null) {
  if (!tr) return
  const stage = tr.getStage()
  if (!stage) return
  const container = stage.container()

  // Konva anchors are Rect children with names like 'top-left', 'rotater', etc.
  const anchors = tr.find('Rect')
  for (const anchor of anchors) {
    const name = anchor.name()
    const cursor = ANCHOR_CURSORS[name]
    if (cursor) {
      anchor.on('mouseenter', () => { container.style.cursor = cursor })
      anchor.on('mouseleave', () => { container.style.cursor = 'default' })
    }
  }

  // Rotation anchor (circle) — always shows grab/rotate cursor
  const circles = tr.find('Circle')
  for (const circle of circles) {
    circle.on('mouseenter', () => { container.style.cursor = 'grab' })
    circle.on('mouseleave', () => { container.style.cursor = 'default' })
  }
}

/**
 * Returns a cursor string based on mouse proximity to corners of the selected shape.
 * - Inside the bounding box near corners → resize cursor
 * - Outside the bounding box near corners → rotate (grab) cursor
 * - Otherwise → null (use default)
 */
function getPhotoshopCursor(
  mouseX: number,
  mouseY: number,
  node: { x: () => number; y: () => number; width: () => number; height: () => number; rotation: () => number; scaleX: () => number; scaleY: () => number } | null,
  threshold: number = 20
): string | null {
  if (!node) return null

  // node.x()/y() is now the CENTER (due to offset)
  const centerX = node.x()
  const centerY = node.y()
  const w = node.width() * node.scaleX()
  const h = node.height() * node.scaleY()
  const rot = (node.rotation() * Math.PI) / 180

  // Four corners relative to center
  const corners = [
    { name: 'top-left', lx: -w / 2, ly: -h / 2 },
    { name: 'top-right', lx: w / 2, ly: -h / 2 },
    { name: 'bottom-left', lx: -w / 2, ly: h / 2 },
    { name: 'bottom-right', lx: w / 2, ly: h / 2 },
  ]

  // Check if mouse is inside the bounding box (unrotated space relative to center)
  const cosR = Math.cos(-rot)
  const sinR = Math.sin(-rot)
  const dx = mouseX - centerX
  const dy = mouseY - centerY
  const localX = dx * cosR - dy * sinR
  const localY = dx * sinR + dy * cosR
  const isStrictlyInside = localX >= -w / 2 && localX <= w / 2 && localY >= -h / 2 && localY <= h / 2

  for (const corner of corners) {
    // Transform corner to world space
    const wx = centerX + corner.lx * Math.cos(rot) - corner.ly * Math.sin(rot)
    const wy = centerY + corner.lx * Math.sin(rot) + corner.ly * Math.cos(rot)

    const dist = Math.sqrt((mouseX - wx) ** 2 + (mouseY - wy) ** 2)
    if (dist < threshold) {
      if (isStrictlyInside) {
        // Inside → resize
        return CORNER_ROTATE_CURSORS[corner.name] || 'nwse-resize'
      } else {
        // Outside → rotate
        return 'grab'
      }
    }
  }

  return null
}

const TRANSFORMER_PROPS = {
  flipEnabled: false,
  rotateEnabled: true,
  // Hide the rotation anchor by making it tiny and at 0 offset — rotation is via corner approach
  rotateAnchorOffset: 0,
  rotateAnchorSize: 0,
  centeredScaling: false,
  anchorCornerRadius: 50,
  anchorStroke: '#3b82f6',
  anchorFill: '#ffffff',
  anchorSize: 10,
  borderStroke: '#3b82f6',
  borderDash: [4, 4],
  keepRatio: false,
  enabledAnchors: [
    'top-left', 'top-right', 'bottom-left', 'bottom-right',
    'middle-left', 'middle-right', 'middle-top', 'middle-bottom',
  ] as string[],
  boundBoxFunc: (oldBox: { x: number; y: number; width: number; height: number; rotation: number }, newBox: { x: number; y: number; width: number; height: number; rotation: number }) => {
    if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) return oldBox
    return newBox
  },
}

/** Convert percentage (0-100) to pixel value */
function pct2px(pct: number, total: number): number {
  return (pct / 100) * total
}

/** Convert pixel value back to percentage (0-100) */
function px2pct(px: number, total: number): number {
  return (px / total) * 100
}

/* ---------- Image layer (uses native browser Image API) ---------- */

function ImageLayerNode({
  layer,
  state,
  stageWidth,
  stageHeight,
  isSelected,
  interactive,
  onSelect,
  onTransformEnd,
  onDragEnd,
  shapeRef,
}: {
  layer: StudioLayer
  state: StudioLayerState
  stageWidth: number
  stageHeight: number
  isSelected: boolean
  interactive: boolean
  onSelect: () => void
  onTransformEnd: (attrs: Partial<StudioLayer>) => void
  onDragEnd: (x: number, y: number) => void
  shapeRef: React.RefObject<Konva.Image | null>
}) {
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const imageNodeRef = useRef<Konva.Image>(null)
  // Use a Group with a Rect as the base — this ALWAYS has the ref so the
  // Transformer can attach even while the image is still loading.
  const groupRef = useRef<Konva.Group>(null)

  // Konva filters require caching
  useEffect(() => {
    if (imageNodeRef.current && layer.feather && layer.feather > 0) {
      imageNodeRef.current.cache()
    } else if (imageNodeRef.current) {
      try { imageNodeRef.current.clearCache() } catch { /* ok */ }
    }
  }, [layer.feather, image])

  const src = state.src ?? layer.src
  useEffect(() => {
    if (!src) return
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.src = src
    img.onload = () => setImage(img)
    img.onerror = () => {
      // Fallback: try without crossOrigin for blob URLs
      if (src.startsWith('blob:')) {
        const img2 = new window.Image()
        img2.src = src
        img2.onload = () => setImage(img2)
      }
    }
  }, [src])

  // Keep the shapeRef pointing at the group so the Transformer can always attach
  useEffect(() => {
    if (groupRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (shapeRef as React.MutableRefObject<any>).current = groupRef.current
    }
  })

  if (!state.visible) return null

  const x = pct2px(state.x, stageWidth)
  const y = pct2px(state.y, stageHeight)
  const w = pct2px(state.width, stageWidth)
  const h = pct2px(state.height, stageHeight)

  return (
    <Group
      ref={groupRef}
      x={x + w / 2}
      y={y + h / 2}
      offsetX={w / 2}
      offsetY={h / 2}
      width={w}
      height={h}
      rotation={state.rotation}
      opacity={state.opacity}
      draggable={interactive && !layer.locked}
      listening={true}
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e) => {
        // x,y is now the center point — convert back to top-left for storage
        const centerX = e.target.x()
        const centerY = e.target.y()
        onDragEnd(
          px2pct(centerX - w / 2, stageWidth),
          px2pct(centerY - h / 2, stageHeight)
        )
      }}
      onTransformEnd={() => {
        const node = groupRef.current
        if (!node) return
        const scaleX = node.scaleX()
        const scaleY = node.scaleY()
        const newW = node.width() * scaleX
        const newH = node.height() * scaleY
        // Reset scale and update offset to new center
        node.scaleX(1)
        node.scaleY(1)
        node.offsetX(newW / 2)
        node.offsetY(newH / 2)
        // Convert center position back to top-left for storage
        onTransformEnd({
          x: px2pct(node.x() - newW / 2, stageWidth),
          y: px2pct(node.y() - newH / 2, stageHeight),
          width: px2pct(newW, stageWidth),
          height: px2pct(newH, stageHeight),
          rotation: node.rotation(),
        })
      }}
    >
      {/* Hit area — always present for clicking/selecting */}
      <Rect
        width={w}
        height={h}
        fill={image ? 'transparent' : '#1e1f22'}
        stroke={!image ? '#3b82f6' : undefined}
        strokeWidth={!image ? 1 : 0}
        dash={!image ? [4, 4] : undefined}
        listening={true}
      />
      {/* Image rendered on top when loaded */}
      {image && (
        <KonvaImage
          ref={imageNodeRef}
          image={image}
          width={w}
          height={h}
          listening={false}
          globalCompositeOperation={layer.blendMode === 'normal' ? 'source-over' : layer.blendMode}
          filters={layer.feather ? [Konva.Filters.Blur] : undefined}
          blurRadius={layer.feather || 0}
        />
      )}
    </Group>
  )
}

/* ---------- Text layer ---------- */

function TextLayerNode({
  layer,
  state,
  stageWidth,
  stageHeight,
  isSelected,
  interactive,
  onSelect,
  onTransformEnd,
  onDragEnd,
  shapeRef,
}: {
  layer: StudioLayer
  state: StudioLayerState
  stageWidth: number
  stageHeight: number
  isSelected: boolean
  interactive: boolean
  onSelect: () => void
  onTransformEnd: (attrs: Partial<StudioLayer>) => void
  onDragEnd: (x: number, y: number) => void
  shapeRef: React.RefObject<Konva.Text | null>
}) {
  // Load custom font dynamically
  useEffect(() => {
    if (layer.fontFamily) {
      const link = document.createElement('link')
      link.href = `https://fonts.googleapis.com/css2?family=${layer.fontFamily.replace(/ /g, '+')}&display=swap`
      link.rel = 'stylesheet'
      if (!document.querySelector(`link[href="${link.href}"]`)) {
        document.head.appendChild(link)
      }
    }
  }, [layer.fontFamily])

  if (!state.visible) return null

  const x = pct2px(state.x, stageWidth)
  const y = pct2px(state.y, stageHeight)
  const w = pct2px(state.width, stageWidth)
  const h = pct2px(state.height, stageHeight)

  return (
    <Text
      ref={shapeRef}
      x={x + w / 2}
      y={y + h / 2}
      offsetX={w / 2}
      offsetY={h / 2}
      width={w}
      height={h}
      text={layer.text ?? ''}
      fontSize={layer.fontSize ?? 24}
      fontFamily={layer.fontFamily || 'Inter'}
      align={layer.textAlign || 'left'}
      fontStyle={layer.fontWeight ?? 'normal'}
      fill={layer.color ?? '#ffffff'}
      rotation={state.rotation}
      opacity={state.opacity}
      draggable={interactive && !layer.locked}
      onClick={onSelect}
      onTap={onSelect}
      globalCompositeOperation={layer.blendMode === 'normal' ? 'source-over' : layer.blendMode}
      onDragEnd={(e) => {
        onDragEnd(
          px2pct(e.target.x() - w / 2, stageWidth),
          px2pct(e.target.y() - h / 2, stageHeight)
        )
      }}
      onTransformEnd={() => {
        const node = shapeRef.current
        if (!node) return
        const scaleX = node.scaleX()
        const scaleY = node.scaleY()
        const newW = node.width() * scaleX
        const newH = node.height() * scaleY
        node.scaleX(1)
        node.scaleY(1)
        node.offsetX(newW / 2)
        node.offsetY(newH / 2)
        onTransformEnd({
          x: px2pct(node.x() - newW / 2, stageWidth),
          y: px2pct(node.y() - newH / 2, stageHeight),
          width: px2pct(newW, stageWidth),
          height: px2pct(newH, stageHeight),
          rotation: node.rotation(),
        })
      }}
    />
  )
}

/* ---------- Shape layer ---------- */

function ShapeLayerNode({
  layer,
  state,
  stageWidth,
  stageHeight,
  isSelected,
  interactive,
  onSelect,
  onTransformEnd,
  onDragEnd,
  shapeRef,
}: {
  layer: StudioLayer
  state: StudioLayerState
  stageWidth: number
  stageHeight: number
  isSelected: boolean
  interactive: boolean
  onSelect: () => void
  onTransformEnd: (attrs: Partial<StudioLayer>) => void
  onDragEnd: (x: number, y: number) => void
  shapeRef: React.RefObject<Konva.Rect | null>
}) {
  // Konva filters require caching
  useEffect(() => {
    if (shapeRef.current && layer.feather && layer.feather > 0) {
      shapeRef.current.cache()
    } else if (shapeRef.current) {
      try { shapeRef.current.clearCache() } catch { /* ok */ }
    }
  }, [layer.feather, shapeRef])

  if (!state.visible) return null

  const x = pct2px(state.x, stageWidth)
  const y = pct2px(state.y, stageHeight)
  const w = pct2px(state.width, stageWidth)
  const h = pct2px(state.height, stageHeight)

  const commonProps = {
    fill: layer.fillTransparent ? 'transparent' : (layer.color ?? '#666666'),
    stroke: layer.borderWidth ? (layer.borderColor || '#ffffff') : undefined,
    strokeWidth: layer.borderWidth || 0,
    dash: layer.borderStyle === 'dashed' ? [8, 4] : layer.borderStyle === 'dotted' ? [2, 2] : undefined,
    rotation: state.rotation,
    opacity: state.opacity,
    filters: layer.feather ? [Konva.Filters.Blur] : undefined,
    blurRadius: layer.feather || 0,
    draggable: interactive && !layer.locked,
    onClick: onSelect,
    onTap: onSelect,
    globalCompositeOperation: (layer.blendMode === 'normal' ? 'source-over' : layer.blendMode) as GlobalCompositeOperation,
    onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => {
      onDragEnd(px2pct(e.target.x() - w / 2, stageWidth), px2pct(e.target.y() - h / 2, stageHeight))
    },
    onTransformEnd: () => {
      const node = shapeRef.current; if (!node) return
      const scaleX = node.scaleX(), scaleY = node.scaleY()
      const newW = node.width() * scaleX, newH = node.height() * scaleY
      node.scaleX(1); node.scaleY(1); node.offsetX(newW / 2); node.offsetY(newH / 2)
      onTransformEnd({ x: px2pct(node.x() - newW / 2, stageWidth), y: px2pct(node.y() - newH / 2, stageHeight), width: px2pct(newW, stageWidth), height: px2pct(newH, stageHeight), rotation: node.rotation() })
    },
  }

  if (layer.name === 'Triangle') {
    return (
      <KonvaLine
        ref={shapeRef as unknown as React.RefObject<Konva.Line>}
        points={[w / 2, 0, w, h, 0, h]}
        closed
        x={x + w / 2} y={y + h / 2} offsetX={w / 2} offsetY={h / 2}
        {...commonProps}
      />
    )
  }

  if (layer.name === 'Circle') {
    return (
      <Ellipse
        ref={shapeRef as unknown as React.RefObject<Konva.Ellipse>}
        x={x + w / 2} y={y + h / 2}
        radiusX={w / 2} radiusY={h / 2}
        {...commonProps}
      />
    )
  }

  return (
    <Rect
      ref={shapeRef}
      x={x + w / 2} y={y + h / 2} offsetX={w / 2} offsetY={h / 2}
      width={w} height={h}
      {...commonProps}
    />
  )
}

/* ---------- Transformer rendered last in the Layer so it's always on top ---------- */

function SelectedTransformer({
  shapeRef,
  isSelected,
  interactive,
  layerId,
}: {
  shapeRef: React.RefObject<Konva.Image | Konva.Text | Konva.Rect | Konva.Group | null>
  isSelected: boolean
  interactive: boolean
  layerId: string | null
}) {
  const trRef = useRef<Konva.Transformer>(null)

  useEffect(() => {
    if (!isSelected || !interactive) return

    // Attach transformer to shape node — retry until ref is available
    function attach() {
      if (trRef.current && shapeRef.current) {
        trRef.current.nodes([shapeRef.current])
        trRef.current.getLayer()?.batchDraw()
        setupTransformerCursors(trRef.current as unknown as Parameters<typeof setupTransformerCursors>[0])
        return true
      }
      return false
    }

    // Try immediately
    if (attach()) return

    // Retry with increasing delays if ref isn't ready yet
    const t1 = setTimeout(() => { if (!attach()) { setTimeout(attach, 50) } }, 10)
    return () => clearTimeout(t1)
  }, [isSelected, interactive, shapeRef, layerId])

  if (!isSelected || !interactive) return null

  return (
    <Transformer
      ref={trRef}
      {...TRANSFORMER_PROPS}
      keepRatio={useStudioStore.getState().aspectLocked}
    />
  )
}

/* ---------- Main canvas component ---------- */

export function StudioCanvas({
  layers,
  tracks,
  currentTime,
  canvasConfig,
  interactive = false,
  selectedLayerId = null,
  onSelectLayer,
  onUpdateLayer,
  onDropAsset,
  eventOverrides,
}: StudioCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [stageSize, setStageSize] = useState({ width: 960, height: 540 })
  const [canvasZoom, setCanvasZoom] = useState(100) // percentage
  const { objectSelectionMode, objectSelectionTargetLayerId, lockObjectSelection, aspectLocked } = useStudioStore()

  // Stable ref map for shape nodes — keyed by layer id
  const shapeRefsMap = useRef<Map<string, React.RefObject<any>>>(new Map())
  const getShapeRef = useCallback((layerId: string) => {
    if (!shapeRefsMap.current.has(layerId)) {
      shapeRefsMap.current.set(layerId, React.createRef())
    }
    return shapeRefsMap.current.get(layerId)!
  }, [])

  // Compute layer states from timeline, then merge event overrides
  const baseLayerStates = useMemo(
    () => computeLayerStatesAtTime(layers, tracks, currentTime),
    [layers, tracks, currentTime]
  )

  const layerStates = useMemo(() => {
    if (!eventOverrides || Object.keys(eventOverrides).length === 0) return baseLayerStates
    const merged = { ...baseLayerStates }
    for (const [layerId, overrides] of Object.entries(eventOverrides)) {
      if (merged[layerId]) {
        merged[layerId] = { ...merged[layerId], ...overrides }
      }
    }
    return merged
  }, [baseLayerStates, eventOverrides])

  // Maintain 16:9 aspect ratio based on container width
  const updateSize = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    const containerWidth = container.clientWidth - 40  // 20px padding each side
    const containerHeight = container.clientHeight - 40
    let width = containerWidth
    let height = width / ASPECT_RATIO
    if (height > containerHeight) {
      height = containerHeight
      width = height * ASPECT_RATIO
    }
    setStageSize({ width: Math.round(width), height: Math.round(height) })
  }, [])

  useEffect(() => {
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [updateSize])

  // Sort layers by zIndex for render order
  const sortedLayers = useMemo(
    () => [...layers].sort((a, b) => a.zIndex - b.zIndex),
    [layers]
  )

  // Collect video layers for DOM overlay
  const videoLayers = useMemo(
    () => sortedLayers.filter((l) => l.type === 'video'),
    [sortedLayers]
  )

  const nonVideoLayers = useMemo(
    () => sortedLayers.filter((l) => l.type !== 'video' && l.type !== 'audio'),
    [sortedLayers]
  )

  const handleStageClick = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      // Object selection mode: intercept clicks to lock target
      if (objectSelectionMode === 'waiting') {
        // Find the clicked layer by checking the target's name
        const target = e.target
        const layerId = target.name?.() || target.id?.()
        if (layerId && layers.some((l) => l.id === layerId)) {
          lockObjectSelection(layerId)
          return
        }
        // Check parent group
        const parent = target.parent
        const parentName = parent?.name?.()
        if (parentName && layers.some((l) => l.id === parentName)) {
          lockObjectSelection(parentName)
          return
        }
        return
      }
      // Normal: clicked on empty area
      if (e.target === e.target.getStage()) {
        onSelectLayer?.(null)
      }
    },
    [onSelectLayer, objectSelectionMode, lockObjectSelection, layers]
  )

  const handleDragEnd = useCallback(
    (id: string, x: number, y: number) => {
      onUpdateLayer?.(id, { x, y })
    },
    [onUpdateLayer]
  )

  const handleTransformEnd = useCallback(
    (id: string, attrs: Partial<StudioLayer>) => {
      onUpdateLayer?.(id, attrs)
    },
    [onUpdateLayer]
  )

  const getState = (layer: StudioLayer): StudioLayerState => {
    return (
      layerStates[layer.id] ?? {
        visible: layer.visible,
        opacity: layer.opacity,
        x: layer.x,
        y: layer.y,
        width: layer.width,
        height: layer.height,
        rotation: layer.rotation,
        src: layer.src,
      }
    )
  }

  // Drop zone handlers
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      if (!onDropAsset || !containerRef.current) return

      const assetType = e.dataTransfer.getData('studio/asset-type') as 'image' | 'video'
      const assetSrc = e.dataTransfer.getData('studio/asset-src')
      if (!assetType || !assetSrc) return

      // Calculate drop position relative to the stage
      const rect = containerRef.current.getBoundingClientRect()
      // Stage is centered in the container
      const stageLeft = (rect.width - stageSize.width) / 2
      const stageTop = (rect.height - stageSize.height) / 2
      const dropX = e.clientX - rect.left - stageLeft
      const dropY = e.clientY - rect.top - stageTop

      const xPct = px2pct(Math.max(0, dropX), stageSize.width)
      const yPct = px2pct(Math.max(0, dropY), stageSize.height)

      onDropAsset(assetType, assetSrc, xPct, yPct)
    },
    [onDropAsset, stageSize]
  )

  const zoomScale = canvasZoom / 100

  return (
    <div
      ref={containerRef}
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
      style={{
        background: '#141416',
        backgroundImage: 'radial-gradient(circle, #1e1f22 1px, transparent 1px)',
        backgroundSize: '16px 16px',
        cursor: objectSelectionMode === 'waiting' ? 'crosshair' : undefined,
      }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onWheel={(e) => {
        e.preventDefault()
        setCanvasZoom(prev => Math.max(25, Math.min(200, prev + (e.deltaY > 0 ? -5 : 5))))
      }}
    >
      {/* Zoom controls — bottom-right of canvas area */}
      {interactive && (
        <div className="absolute bottom-2 right-2 z-20 flex items-center gap-1 bg-[#1e1f22]/90 backdrop-blur-sm rounded-lg px-1.5 py-1 border border-[#3f4147]/50">
          <button onClick={() => setCanvasZoom(prev => Math.max(25, prev - 10))} className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-white rounded-md transition-colors text-sm font-bold cursor-pointer">−</button>
          <span className="text-[10px] text-zinc-400 font-mono w-10 text-center">{canvasZoom}%</span>
          <button onClick={() => setCanvasZoom(prev => Math.min(200, prev + 10))} className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-white rounded-md transition-colors text-sm font-bold cursor-pointer">+</button>
          <button onClick={() => setCanvasZoom(100)} className="ml-0.5 px-1.5 h-6 flex items-center justify-center text-zinc-500 hover:text-white rounded-md text-[9px] transition-colors cursor-pointer">Fit</button>
        </div>
      )}
      {/* Konva stage for non-video layers */}
      <div className="relative" style={{
        width: stageSize.width,
        height: stageSize.height,
        boxShadow: '0 2px 20px rgba(0,0,0,0.5)',
        transform: `scale(${zoomScale})`,
        transformOrigin: 'center center',
        // No special background pattern — white backgrounds show as white
      }}>
        <Stage
          width={stageSize.width}
          height={stageSize.height}
          onClick={handleStageClick}
          onTap={handleStageClick as unknown as (evt: Konva.KonvaEventObject<TouchEvent>) => void}
          onMouseMove={(e: Konva.KonvaEventObject<MouseEvent>) => {
            if (!selectedLayerId || !interactive) return
            const stage = e.target.getStage()
            if (!stage) return
            const pointer = stage.getPointerPosition()
            if (!pointer) return
            const ref = shapeRefsMap.current.get(selectedLayerId)
            const node = ref?.current
            const cursor = getPhotoshopCursor(pointer.x, pointer.y, node as Parameters<typeof getPhotoshopCursor>[2])
            stage.container().style.cursor = cursor || 'default'
          }}
          onMouseDown={(e: Konva.KonvaEventObject<MouseEvent>) => {
            // Custom rotation: when cursor is 'grab' (outside corner), start rotation drag
            if (!selectedLayerId || !interactive) return
            const stage = e.target.getStage()
            if (!stage) return
            const pointer = stage.getPointerPosition()
            if (!pointer) return
            const ref = shapeRefsMap.current.get(selectedLayerId)
            const node = ref?.current
            if (!node) return
            const cursor = getPhotoshopCursor(pointer.x, pointer.y, node as Parameters<typeof getPhotoshopCursor>[2])
            if (cursor !== 'grab') return // Only intercept rotation (outside corner)

            e.evt.preventDefault()
            e.evt.stopPropagation()

            // Center of object — with offset, node.x()/y() IS the center
            const selLayer = layers.find(l => l.id === selectedLayerId)
            if (!selLayer) return
            const cx = pct2px(selLayer.x, stageSize.width) + pct2px(selLayer.width, stageSize.width) / 2
            const cy = pct2px(selLayer.y, stageSize.height) + pct2px(selLayer.height, stageSize.height) / 2

            const startAngle = Math.atan2(pointer.y - cy, pointer.x - cx)
            const startRotation = node.rotation()
            const container = stage.container()
            container.style.cursor = 'grabbing'

            const onMove = (ev: MouseEvent) => {
              const rect = container.getBoundingClientRect()
              const mx = ev.clientX - rect.left
              const my = ev.clientY - rect.top
              const currentAngle = Math.atan2(my - cy, mx - cx)
              let delta = ((currentAngle - startAngle) * 180) / Math.PI
              let newRotation = startRotation + delta

              // Snap to 45° increments when holding Shift
              if (ev.shiftKey) {
                newRotation = Math.round(newRotation / 45) * 45
              }

              // Normalize to 0-360
              newRotation = ((newRotation % 360) + 360) % 360

              onUpdateLayer?.(selectedLayerId, { rotation: newRotation })
            }

            const onUp = () => {
              container.style.cursor = 'default'
              document.removeEventListener('mousemove', onMove)
              document.removeEventListener('mouseup', onUp)
            }

            document.addEventListener('mousemove', onMove)
            document.addEventListener('mouseup', onUp)
          }}
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          {/* Background */}
          <Layer>
            <Rect
              x={0}
              y={0}
              width={stageSize.width}
              height={stageSize.height}
              fill={canvasConfig.backgroundColor}
            />
          </Layer>

          {/* Content layers (non-video) */}
          <Layer>
            {nonVideoLayers.map((layer) => {
              const state = getState(layer)
              const isSelected = layer.id === selectedLayerId
              const shapeRef = getShapeRef(layer.id)

              if (layer.type === 'image') {
                return (
                  <ImageLayerNode
                    key={layer.id}
                    layer={layer}
                    state={state}
                    stageWidth={stageSize.width}
                    stageHeight={stageSize.height}
                    isSelected={isSelected}
                    interactive={interactive}
                    shapeRef={shapeRef}
                    onSelect={() => {
                      if (objectSelectionMode === 'waiting') { lockObjectSelection(layer.id); return }
                      onSelectLayer?.(layer.id)
                    }}
                    onTransformEnd={(attrs) => handleTransformEnd(layer.id, attrs)}
                    onDragEnd={(x, y) => handleDragEnd(layer.id, x, y)}
                  />
                )
              }

              if (layer.type === 'text') {
                return (
                  <TextLayerNode
                    key={layer.id}
                    layer={layer}
                    state={state}
                    stageWidth={stageSize.width}
                    stageHeight={stageSize.height}
                    isSelected={isSelected}
                    interactive={interactive}
                    shapeRef={shapeRef}
                    onSelect={() => {
                      if (objectSelectionMode === 'waiting') { lockObjectSelection(layer.id); return }
                      onSelectLayer?.(layer.id)
                    }}
                    onTransformEnd={(attrs) => handleTransformEnd(layer.id, attrs)}
                    onDragEnd={(x, y) => handleDragEnd(layer.id, x, y)}
                  />
                )
              }

              if (layer.type === 'shape') {
                return (
                  <ShapeLayerNode
                    key={layer.id}
                    layer={layer}
                    state={state}
                    stageWidth={stageSize.width}
                    stageHeight={stageSize.height}
                    isSelected={isSelected}
                    interactive={interactive}
                    shapeRef={shapeRef}
                    onSelect={() => {
                      if (objectSelectionMode === 'waiting') { lockObjectSelection(layer.id); return }
                      onSelectLayer?.(layer.id)
                    }}
                    onTransformEnd={(attrs) => handleTransformEnd(layer.id, attrs)}
                    onDragEnd={(x, y) => handleDragEnd(layer.id, x, y)}
                  />
                )
              }

              return null
            })}

            {/* Transformer rendered LAST so it's always on top of all shapes */}
            {selectedLayerId && interactive && (() => {
              const selectedNonVideo = nonVideoLayers.find((l) => l.id === selectedLayerId)
              if (!selectedNonVideo) return null
              const shapeRef = getShapeRef(selectedLayerId)
              return (
                <SelectedTransformer
                  key={`transformer-${selectedLayerId}`}
                  shapeRef={shapeRef}
                  isSelected={true}
                  interactive={interactive}
                  layerId={selectedLayerId}
                />
              )
            })()}
          </Layer>
        </Stage>

        {/* Video layers rendered as HTML overlays on top of the Konva stage */}
        {videoLayers.map((layer) => {
          const state = getState(layer)
          if (!state.visible) return null
          const src = state.src ?? layer.src
          if (!src) return null

          const left = pct2px(state.x, stageSize.width)
          const top = pct2px(state.y, stageSize.height)
          const width = pct2px(state.width, stageSize.width)
          const height = pct2px(state.height, stageSize.height)
          const isVideoSelected = selectedLayerId === layer.id

          return (
            <div
              key={layer.id}
              className="absolute"
              style={{
                left,
                top,
                width,
                height,
                opacity: state.opacity,
                transform: `rotate(${state.rotation}deg)`,
                transformOrigin: 'center center',
                pointerEvents: interactive && !layer.locked ? 'auto' : 'none',
                zIndex: layer.zIndex + 100,
                mixBlendMode: layer.blendMode === 'normal' ? undefined : layer.blendMode,
              }}
            >
              {/* Selection border (dashed red to match Konva transformer) */}
              {isVideoSelected && interactive && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    border: '2px dashed #3b82f6',
                  }}
                />
              )}

              {/* Video element with drag handler */}
              <div
                className="h-full w-full cursor-move"
                onClick={() => {
                  if (objectSelectionMode === 'waiting') { lockObjectSelection(layer.id); return }
                  onSelectLayer?.(layer.id)
                }}
                onMouseDown={(e) => {
                  if (!interactive || layer.locked) return
                  // Ignore if clicking on a handle
                  if ((e.target as HTMLElement).dataset.handle) return
                  e.preventDefault()
                  e.stopPropagation()
                  onSelectLayer?.(layer.id)
                  const startMX = e.clientX
                  const startMY = e.clientY
                  const startX = state.x
                  const startY = state.y

                  const onMove = (ev: MouseEvent) => {
                    const dx = ((ev.clientX - startMX) / stageSize.width) * 100
                    const dy = ((ev.clientY - startMY) / stageSize.height) * 100
                    onUpdateLayer?.(layer.id, { x: startX + dx, y: startY + dy })
                  }
                  const onUp = () => {
                    document.removeEventListener('mousemove', onMove)
                    document.removeEventListener('mouseup', onUp)
                  }
                  document.addEventListener('mousemove', onMove)
                  document.addEventListener('mouseup', onUp)
                }}
              >
                <video
                  src={src}
                  className="h-full w-full object-contain pointer-events-none"
                  autoPlay={layer.autoplay ?? true}
                  loop={layer.loop ?? true}
                  muted={layer.muted ?? true}
                  playsInline
                />
              </div>

              {/* Handles when selected */}
              {isVideoSelected && interactive && (
                <>
                  {/* Resize handle - bottom right */}
                  <div
                    data-handle="resize"
                    className="absolute w-[8px] h-[8px] rounded-[2px] cursor-se-resize"
                    style={{
                      right: -4,
                      bottom: -4,
                      backgroundColor: '#ffffff',
                      border: '1.5px solid #3b82f6',
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      const startMX = e.clientX
                      const startMY = e.clientY
                      const startW = state.width
                      const startH = state.height

                      const onMove = (ev: MouseEvent) => {
                        const dw = ((ev.clientX - startMX) / stageSize.width) * 100
                        const dh = ((ev.clientY - startMY) / stageSize.height) * 100
                        onUpdateLayer?.(layer.id, {
                          width: Math.max(5, startW + dw),
                          height: Math.max(5, startH + dh),
                        })
                      }
                      const onUp = () => {
                        document.removeEventListener('mousemove', onMove)
                        document.removeEventListener('mouseup', onUp)
                      }
                      document.addEventListener('mousemove', onMove)
                      document.addEventListener('mouseup', onUp)
                    }}
                  />

                  {/* Resize handle - bottom left */}
                  <div
                    data-handle="resize-bl"
                    className="absolute w-[8px] h-[8px] rounded-[2px] cursor-sw-resize"
                    style={{
                      left: -4,
                      bottom: -4,
                      backgroundColor: '#ffffff',
                      border: '1.5px solid #3b82f6',
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      const startMX = e.clientX
                      const startW = state.width
                      const startH = state.height
                      const startX = state.x
                      const startMY = e.clientY

                      const onMove = (ev: MouseEvent) => {
                        const dw = ((startMX - ev.clientX) / stageSize.width) * 100
                        const dh = ((ev.clientY - startMY) / stageSize.height) * 100
                        const newW = Math.max(5, startW + dw)
                        const newX = startX - (newW - startW)
                        onUpdateLayer?.(layer.id, {
                          x: newX,
                          width: newW,
                          height: Math.max(5, startH + dh),
                        })
                      }
                      const onUp = () => {
                        document.removeEventListener('mousemove', onMove)
                        document.removeEventListener('mouseup', onUp)
                      }
                      document.addEventListener('mousemove', onMove)
                      document.addEventListener('mouseup', onUp)
                    }}
                  />

                  {/* Resize handle - top right */}
                  <div
                    data-handle="resize-tr"
                    className="absolute w-[8px] h-[8px] rounded-[2px] cursor-ne-resize"
                    style={{
                      right: -4,
                      top: -4,
                      backgroundColor: '#ffffff',
                      border: '1.5px solid #3b82f6',
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      const startMX = e.clientX
                      const startMY = e.clientY
                      const startW = state.width
                      const startH = state.height
                      const startY = state.y

                      const onMove = (ev: MouseEvent) => {
                        const dw = ((ev.clientX - startMX) / stageSize.width) * 100
                        const dh = ((startMY - ev.clientY) / stageSize.height) * 100
                        const newH = Math.max(5, startH + dh)
                        const newY = startY - (newH - startH)
                        onUpdateLayer?.(layer.id, {
                          y: newY,
                          width: Math.max(5, startW + dw),
                          height: newH,
                        })
                      }
                      const onUp = () => {
                        document.removeEventListener('mousemove', onMove)
                        document.removeEventListener('mouseup', onUp)
                      }
                      document.addEventListener('mousemove', onMove)
                      document.addEventListener('mouseup', onUp)
                    }}
                  />

                  {/* Middle-right resize handle */}
                  <div
                    data-handle="resize-mr"
                    className="absolute w-[8px] h-[8px] rounded-[2px] cursor-e-resize"
                    style={{
                      right: -4,
                      top: '50%',
                      marginTop: -4,
                      backgroundColor: '#ffffff',
                      border: '1.5px solid #3b82f6',
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      const startMX = e.clientX
                      const startW = state.width

                      const onMove = (ev: MouseEvent) => {
                        const dw = ((ev.clientX - startMX) / stageSize.width) * 100
                        onUpdateLayer?.(layer.id, { width: Math.max(5, startW + dw) })
                      }
                      const onUp = () => {
                        document.removeEventListener('mousemove', onMove)
                        document.removeEventListener('mouseup', onUp)
                      }
                      document.addEventListener('mousemove', onMove)
                      document.addEventListener('mouseup', onUp)
                    }}
                  />

                  {/* Middle-bottom resize handle */}
                  <div
                    data-handle="resize-mb"
                    className="absolute w-[8px] h-[8px] rounded-[2px] cursor-s-resize"
                    style={{
                      bottom: -4,
                      left: '50%',
                      marginLeft: -4,
                      backgroundColor: '#ffffff',
                      border: '1.5px solid #3b82f6',
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      const startMY = e.clientY
                      const startH = state.height

                      const onMove = (ev: MouseEvent) => {
                        const dh = ((ev.clientY - startMY) / stageSize.height) * 100
                        onUpdateLayer?.(layer.id, { height: Math.max(5, startH + dh) })
                      }
                      const onUp = () => {
                        document.removeEventListener('mousemove', onMove)
                        document.removeEventListener('mouseup', onUp)
                      }
                      document.addEventListener('mousemove', onMove)
                      document.addEventListener('mouseup', onUp)
                    }}
                  />

                  {/* Rotation zones — invisible areas OUTSIDE each corner for rotation */}
                  {['tl', 'tr', 'bl', 'br'].map((corner) => {
                    const positions: Record<string, { left?: number; right?: number; top?: number; bottom?: number }> = {
                      tl: { left: -18, top: -18 },
                      tr: { right: -18, top: -18 },
                      bl: { left: -18, bottom: -18 },
                      br: { right: -18, bottom: -18 },
                    }
                    return (
                      <div
                        key={corner}
                        data-handle="rotate"
                        className="absolute w-[22px] h-[22px] cursor-grab z-[5]"
                        style={positions[corner]}
                        onMouseDown={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          const videoEl = (e.target as HTMLElement).closest('[class*="absolute"]')?.parentElement
                          if (!videoEl) return
                          const rect = videoEl.getBoundingClientRect()
                          const cx = rect.left + rect.width / 2
                          const cy = rect.top + rect.height / 2
                          const startRot = state.rotation
                          const startAngle = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI)

                          const onMove = (ev: MouseEvent) => {
                            const angle = Math.atan2(ev.clientY - cy, ev.clientX - cx) * (180 / Math.PI)
                            let newRot = startRot + (angle - startAngle)
                            newRot = ((newRot % 360) + 360) % 360
                            if (ev.shiftKey) newRot = Math.round(newRot / 45) * 45
                            onUpdateLayer?.(layer.id, { rotation: newRot })
                          }
                          const onUp = () => {
                            document.removeEventListener('mousemove', onMove)
                            document.removeEventListener('mouseup', onUp)
                          }
                          document.addEventListener('mousemove', onMove)
                          document.addEventListener('mouseup', onUp)
                        }}
                      />
                    )
                  })}
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
