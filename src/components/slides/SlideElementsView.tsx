'use client'

/**
 * Read-only renderer for a content slide's canvas elements (images / text
 * overlays). Mirrors the editor's `ElementContent` render — border radius,
 * borders, in-frame image zoom/pan and per-edge fade — so what the author lays
 * out in Command Studio is exactly what the audience (and the presenter) see.
 *
 * It fills its positioned parent (`position: absolute; inset: 0`) and clips to
 * it, so the parent decides the slide's aspect/size. Pointer events are off —
 * this is a pure visual layer.
 */
import type { CanvasElement, Slide } from '@/types/slide'
import { buildEdgeFadeMasks, type EdgeFade } from '@/lib/editor/edge-fade'
import { slideRenderElements } from '@/lib/editor/content-layers'

/** Everything to render for a slide: the author's images/text plus, for content
 *  slides, the bound title/body boxes. */
export function slideCanvasElements(slide: Slide): CanvasElement[] {
  return slideRenderElements(slide)
}

export function hasCanvasElements(slide: Slide): boolean {
  return slideCanvasElements(slide).length > 0
}

export function SlideElementsView({ slide, radius = 0 }: { slide: Slide; radius?: number }) {
  const elements = slideCanvasElements(slide)
  if (elements.length === 0) return null
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: radius, pointerEvents: 'none' }}>
      {elements.map((el) => (
        <SlideElement key={el.id} element={el} />
      ))}
    </div>
  )
}

function SlideElement({ element }: { element: CanvasElement }) {
  const style = element.style || {}
  const radius = style.borderRadiusPct != null ? `${style.borderRadiusPct}%` : `${style.borderRadius || 0}px`
  const borderW = style.borderWidth || 0
  const border = borderW > 0 ? `${borderW}px solid ${style.borderColor || '#ffffff'}` : undefined
  const { vMask, hMask } = buildEdgeFadeMasks(style.edgeFade as EdgeFade | undefined)
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
        opacity: style.opacity ?? 1,
        transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
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
              whiteSpace: 'pre-wrap', wordBreak: 'break-word',
            }}>
              {element.content}
            </div>
          )}
          {element.type === 'image' && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={element.content}
              alt=""
              draggable={false}
              style={{
                width: '100%', height: '100%',
                objectFit: (style.objectFit as 'cover' | 'contain' | 'fill') || 'cover',
                transform: imgTransform, transformOrigin: 'center',
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
