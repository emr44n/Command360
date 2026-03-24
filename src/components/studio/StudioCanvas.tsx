'use client'

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react'
import { Stage, Layer, Rect, Text, Image as KonvaImage, Transformer } from 'react-konva'
import type Konva from 'konva'
import type { StudioLayer, StudioLayerState } from '@/types/slide'

interface StudioCanvasProps {
  layers: StudioLayer[]
  layerStates: Record<string, StudioLayerState>
  canvasConfig: { width: number; height: number; backgroundColor: string }
  interactive?: boolean
  selectedLayerId?: string | null
  onSelectLayer?: (id: string | null) => void
  onUpdateLayer?: (id: string, updates: Partial<StudioLayer>) => void
}

const ASPECT_RATIO = 16 / 9

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
          flipEnabled={false}
          boundBoxFunc={(oldBox, newBox) => {
            if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) return oldBox
            return newBox
          }}
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
          flipEnabled={false}
          boundBoxFunc={(oldBox, newBox) => {
            if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) return oldBox
            return newBox
          }}
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
          flipEnabled={false}
          boundBoxFunc={(oldBox, newBox) => {
            if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) return oldBox
            return newBox
          }}
        />
      )}
    </>
  )
}

/* ---------- Main canvas component ---------- */

export function StudioCanvas({
  layers,
  layerStates,
  canvasConfig,
  interactive = false,
  selectedLayerId = null,
  onSelectLayer,
  onUpdateLayer,
}: StudioCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [stageSize, setStageSize] = useState({ width: 960, height: 540 })

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

  return (
    <div
      ref={containerRef}
      className="relative flex h-full w-full items-center justify-center overflow-hidden bg-black/30"
    >
      {/* Konva stage for non-video layers */}
      <div className="relative" style={{ width: stageSize.width, height: stageSize.height }}>
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
              fill={canvasConfig.backgroundColor}
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

          return (
            <div
              key={layer.id}
              className={`absolute ${selectedLayerId === layer.id ? 'ring-2 ring-blue-500' : ''}`}
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
              onClick={() => onSelectLayer?.(layer.id)}
            >
              <video
                src={src}
                className="h-full w-full object-cover"
                autoPlay={layer.autoplay ?? true}
                loop={layer.loop ?? true}
                muted={layer.muted ?? true}
                playsInline
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
