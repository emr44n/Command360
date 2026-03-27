'use client'

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react'
import { Stage, Layer, Rect, Text, Image as KonvaImage, Transformer } from 'react-konva'
import type Konva from 'konva'
import type { StudioLayer, StudioTrack, StudioLayerState } from '@/types/slide'
import { computeLayerStatesAtTime } from '@/lib/studio/playback-engine'

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
}

const ASPECT_RATIO = 16 / 9

/** Shared Transformer props for Photoshop-style handles */
const TRANSFORMER_PROPS = {
  flipEnabled: false,
  rotateEnabled: true,
  rotateAnchorOffset: 24,
  centeredScaling: false,
  rotationSnaps: [0, 45, 90, 135, 180, 225, 270, 315],
  anchorCornerRadius: 2,
  anchorStroke: '#ef4444',
  anchorFill: '#ffffff',
  anchorSize: 8,
  borderStroke: '#ef4444',
  borderDash: [4, 4],
  keepRatio: false,
  enabledAnchors: [
    'top-left', 'top-right', 'bottom-left', 'bottom-right',
    'middle-right', 'middle-bottom',
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
}) {
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const shapeRef = useRef<Konva.Image>(null)
  const trRef = useRef<Konva.Transformer>(null)

  const src = state.src ?? layer.src
  useEffect(() => {
    if (!src) return
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.src = src
    img.onload = () => setImage(img)
  }, [src])

  useEffect(() => {
    if (isSelected && interactive && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current])
      trRef.current.getLayer()?.batchDraw()
    }
  }, [isSelected, interactive])

  if (!image || !state.visible) return null

  const x = pct2px(state.x, stageWidth)
  const y = pct2px(state.y, stageHeight)
  const w = pct2px(state.width, stageWidth)
  const h = pct2px(state.height, stageHeight)

  return (
    <>
      <KonvaImage
        ref={shapeRef}
        image={image}
        x={x}
        y={y}
        width={w}
        height={h}
        rotation={state.rotation}
        opacity={state.opacity}
        draggable={interactive && !layer.locked}
        onClick={onSelect}
        onTap={onSelect}
        globalCompositeOperation={layer.blendMode === 'normal' ? 'source-over' : layer.blendMode}
        onDragEnd={(e) => {
          onDragEnd(
            px2pct(e.target.x(), stageWidth),
            px2pct(e.target.y(), stageHeight)
          )
        }}
        onTransformEnd={() => {
          const node = shapeRef.current
          if (!node) return
          const scaleX = node.scaleX()
          const scaleY = node.scaleY()
          node.scaleX(1)
          node.scaleY(1)
          onTransformEnd({
            x: px2pct(node.x(), stageWidth),
            y: px2pct(node.y(), stageHeight),
            width: px2pct(node.width() * scaleX, stageWidth),
            height: px2pct(node.height() * scaleY, stageHeight),
            rotation: node.rotation(),
          })
        }}
      />
      {isSelected && interactive && (
        <Transformer
          ref={trRef}
          {...TRANSFORMER_PROPS}
        />
      )}
    </>
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
}) {
  const shapeRef = useRef<Konva.Text>(null)
  const trRef = useRef<Konva.Transformer>(null)

  useEffect(() => {
    if (isSelected && interactive && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current])
      trRef.current.getLayer()?.batchDraw()
    }
  }, [isSelected, interactive])

  if (!state.visible) return null

  const x = pct2px(state.x, stageWidth)
  const y = pct2px(state.y, stageHeight)
  const w = pct2px(state.width, stageWidth)
  const h = pct2px(state.height, stageHeight)

  return (
    <>
      <Text
        ref={shapeRef}
        x={x}
        y={y}
        width={w}
        height={h}
        text={layer.text ?? ''}
        fontSize={layer.fontSize ?? 24}
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
            px2pct(e.target.x(), stageWidth),
            px2pct(e.target.y(), stageHeight)
          )
        }}
        onTransformEnd={() => {
          const node = shapeRef.current
          if (!node) return
          const scaleX = node.scaleX()
          const scaleY = node.scaleY()
          node.scaleX(1)
          node.scaleY(1)
          onTransformEnd({
            x: px2pct(node.x(), stageWidth),
            y: px2pct(node.y(), stageHeight),
            width: px2pct(node.width() * scaleX, stageWidth),
            height: px2pct(node.height() * scaleY, stageHeight),
            rotation: node.rotation(),
          })
        }}
      />
      {isSelected && interactive && (
        <Transformer
          ref={trRef}
          {...TRANSFORMER_PROPS}
        />
      )}
    </>
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
}) {
  const shapeRef = useRef<Konva.Rect>(null)
  const trRef = useRef<Konva.Transformer>(null)

  useEffect(() => {
    if (isSelected && interactive && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current])
      trRef.current.getLayer()?.batchDraw()
    }
  }, [isSelected, interactive])

  if (!state.visible) return null

  const x = pct2px(state.x, stageWidth)
  const y = pct2px(state.y, stageHeight)
  const w = pct2px(state.width, stageWidth)
  const h = pct2px(state.height, stageHeight)

  return (
    <>
      <Rect
        ref={shapeRef}
        x={x}
        y={y}
        width={w}
        height={h}
        fill={layer.color ?? '#666666'}
        rotation={state.rotation}
        opacity={state.opacity}
        draggable={interactive && !layer.locked}
        onClick={onSelect}
        onTap={onSelect}
        globalCompositeOperation={layer.blendMode === 'normal' ? 'source-over' : layer.blendMode}
        onDragEnd={(e) => {
          onDragEnd(
            px2pct(e.target.x(), stageWidth),
            px2pct(e.target.y(), stageHeight)
          )
        }}
        onTransformEnd={() => {
          const node = shapeRef.current
          if (!node) return
          const scaleX = node.scaleX()
          const scaleY = node.scaleY()
          node.scaleX(1)
          node.scaleY(1)
          onTransformEnd({
            x: px2pct(node.x(), stageWidth),
            y: px2pct(node.y(), stageHeight),
            width: px2pct(node.width() * scaleX, stageWidth),
            height: px2pct(node.height() * scaleY, stageHeight),
            rotation: node.rotation(),
          })
        }}
      />
      {isSelected && interactive && (
        <Transformer
          ref={trRef}
          {...TRANSFORMER_PROPS}
        />
      )}
    </>
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
}: StudioCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [stageSize, setStageSize] = useState({ width: 960, height: 540 })

  // Compute layer states from timeline
  const layerStates = useMemo(
    () => computeLayerStatesAtTime(layers, tracks, currentTime),
    [layers, tracks, currentTime]
  )

  // Maintain 16:9 aspect ratio based on container width
  const updateSize = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    const containerWidth = container.clientWidth
    const containerHeight = container.clientHeight
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
    () => sortedLayers.filter((l) => l.type !== 'video'),
    [sortedLayers]
  )

  const handleStageClick = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      // Clicked on empty area
      if (e.target === e.target.getStage()) {
        onSelectLayer?.(null)
      }
    },
    [onSelectLayer]
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

  return (
    <div
      ref={containerRef}
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
      style={{ background: '#1a1a1a' }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Konva stage for non-video layers */}
      <div className="relative" style={{ width: stageSize.width, height: stageSize.height, boxShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>
        <Stage
          width={stageSize.width}
          height={stageSize.height}
          onClick={handleStageClick}
          onTap={handleStageClick as unknown as (evt: Konva.KonvaEventObject<TouchEvent>) => void}
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          {/* Background */}
          <Layer>
            <Rect
              x={0}
              y={0}
              width={stageSize.width}
              height={stageSize.height}
              fill="#ffffff"
            />
          </Layer>

          {/* Content layers (non-video) */}
          <Layer>
            {nonVideoLayers.map((layer) => {
              const state = getState(layer)
              const isSelected = layer.id === selectedLayerId

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
                    onSelect={() => onSelectLayer?.(layer.id)}
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
                    onSelect={() => onSelectLayer?.(layer.id)}
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
                    onSelect={() => onSelectLayer?.(layer.id)}
                    onTransformEnd={(attrs) => handleTransformEnd(layer.id, attrs)}
                    onDragEnd={(x, y) => handleDragEnd(layer.id, x, y)}
                  />
                )
              }

              return null
            })}
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
                transformOrigin: 'top left',
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
                    border: '2px dashed #ef4444',
                  }}
                />
              )}

              {/* Video element with drag handler */}
              <div
                className="h-full w-full cursor-move"
                onClick={() => onSelectLayer?.(layer.id)}
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
                      border: '1.5px solid #ef4444',
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
                      border: '1.5px solid #ef4444',
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
                      border: '1.5px solid #ef4444',
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
                      border: '1.5px solid #ef4444',
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
                      border: '1.5px solid #ef4444',
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

                  {/* Rotation handle - offset above top center */}
                  <div
                    data-handle="rotate"
                    className="absolute flex flex-col items-center"
                    style={{
                      left: '50%',
                      top: -28,
                      marginLeft: -4,
                    }}
                  >
                    {/* Connecting line */}
                    <div
                      className="w-px h-[16px]"
                      style={{ backgroundColor: '#ef4444' }}
                    />
                    {/* Rotation circle */}
                    <div
                      className="w-[10px] h-[10px] rounded-full cursor-grab"
                      style={{
                        backgroundColor: '#ffffff',
                        border: '1.5px solid #ef4444',
                        marginTop: -1,
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault()
                        e.stopPropagation()

                        // Get center of the video element for rotation calculation
                        const elRect = (e.target as HTMLElement).closest('[data-handle]')!
                          .parentElement!.parentElement!.getBoundingClientRect()
                        const centerX = elRect.left + elRect.width / 2
                        const centerY = elRect.top + elRect.height / 2
                        const startRotation = state.rotation

                        // Calculate initial angle
                        const startAngle = Math.atan2(
                          e.clientY - centerY,
                          e.clientX - centerX
                        ) * (180 / Math.PI)

                        const rotationSnaps = [0, 45, 90, 135, 180, 225, 270, 315]
                        const SNAP_THRESHOLD = 5

                        const onMove = (ev: MouseEvent) => {
                          const currentAngle = Math.atan2(
                            ev.clientY - centerY,
                            ev.clientX - centerX
                          ) * (180 / Math.PI)
                          let newRotation = startRotation + (currentAngle - startAngle)

                          // Normalize to 0-360
                          newRotation = ((newRotation % 360) + 360) % 360

                          // Snap to common angles
                          for (const snap of rotationSnaps) {
                            if (Math.abs(newRotation - snap) < SNAP_THRESHOLD) {
                              newRotation = snap
                              break
                            }
                          }

                          onUpdateLayer?.(layer.id, { rotation: newRotation })
                        }
                        const onUp = () => {
                          document.removeEventListener('mousemove', onMove)
                          document.removeEventListener('mouseup', onUp)
                        }
                        document.addEventListener('mousemove', onMove)
                        document.addEventListener('mouseup', onUp)
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
