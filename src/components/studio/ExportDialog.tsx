'use client'

import { useState } from 'react'
import { Download, FileText, Presentation, X, FileJson, Loader2 } from 'lucide-react'
import type { Slide, StudioContent } from '@/types/slide'

interface ExportDialogProps {
  isOpen: boolean
  onClose: () => void
  presentationId: string
  presentationTitle: string
  slides: Slide[]
}

export function ExportDialog({ isOpen, onClose, presentationId, presentationTitle, slides }: ExportDialogProps) {
  const [exporting, setExporting] = useState<string | null>(null)

  if (!isOpen) return null

  const handleExportC360 = () => {
    window.open(`/api/presentations/${presentationId}/export-c360`, '_blank')
  }

  const handleExportPPTX = async () => {
    setExporting('pptx')
    try {
      const PptxGenJS = (await import('pptxgenjs')).default
      const pptx = new PptxGenJS()
      pptx.title = presentationTitle
      pptx.author = 'Command 360'
      pptx.subject = 'Command Studio Presentation'

      for (const slide of slides) {
        const pptSlide = pptx.addSlide()
        const content = slide.content as StudioContent
        const bgColor = content?.canvas?.backgroundColor || '#ffffff'
        pptSlide.background = { color: bgColor.replace('#', '') }

        // Add title
        pptSlide.addText(slide.title || `Scene ${slides.indexOf(slide) + 1}`, {
          x: 0.5, y: 0.3, w: 9, h: 0.5,
          fontSize: 18, color: bgColor === '#ffffff' ? '333333' : 'FFFFFF',
          fontFace: 'Arial', bold: true,
        })

        // Add layers as positioned elements
        const layers = content?.layers || []
        for (const layer of layers) {
          if (!layer.visible) continue

          if (layer.type === 'text' && layer.text) {
            pptSlide.addText(layer.text, {
              x: (layer.x / 100) * 10,
              y: (layer.y / 100) * 7.5,
              w: (layer.width / 100) * 10,
              h: (layer.height / 100) * 7.5,
              fontSize: layer.fontSize || 24,
              color: (layer.color || '#ffffff').replace('#', ''),
              fontFace: layer.fontFamily || 'Arial',
              rotate: layer.rotation,
            })
          } else if ((layer.type === 'image' || layer.type === 'video') && layer.src && !layer.src.startsWith('blob:')) {
            try {
              pptSlide.addImage({
                path: layer.src,
                x: (layer.x / 100) * 10,
                y: (layer.y / 100) * 7.5,
                w: (layer.width / 100) * 10,
                h: (layer.height / 100) * 7.5,
                rotate: layer.rotation,
              })
            } catch {
              // Skip if image can't be added (CORS, etc.)
            }
          } else if (layer.type === 'shape') {
            pptSlide.addShape(pptx.ShapeType.rect, {
              x: (layer.x / 100) * 10,
              y: (layer.y / 100) * 7.5,
              w: (layer.width / 100) * 10,
              h: (layer.height / 100) * 7.5,
              fill: { color: (layer.color || '#666666').replace('#', '') },
              rotate: layer.rotation,
            })
          }
        }
      }

      await pptx.writeFile({ fileName: `${presentationTitle || 'Command360'}.pptx` })
    } catch (err) {
      console.error('PPTX export error:', err)
      const { toast } = await import('sonner')
      toast.error('Failed to export PPTX', { duration: 3000 })
    } finally {
      setExporting(null)
    }
  }

  const handleExportPDF = async () => {
    setExporting('pdf')
    try {
      // Simple PDF using browser print
      const printWindow = window.open('', '_blank')
      if (!printWindow) throw new Error('Popup blocked')

      let html = `<!DOCTYPE html><html><head><title>${presentationTitle}</title><style>
        body { margin: 0; font-family: Arial, sans-serif; }
        .slide { page-break-after: always; width: 100vw; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; }
        .slide:last-child { page-break-after: auto; }
        .slide-title { font-size: 24px; font-weight: bold; margin-bottom: 20px; }
        .slide-canvas { width: 80%; aspect-ratio: 16/9; position: relative; overflow: hidden; border: 1px solid #ddd; border-radius: 8px; }
        .layer { position: absolute; }
        img.layer { object-fit: contain; }
        @media print { .no-print { display: none; } }
      </style></head><body>`

      for (const slide of slides) {
        const content = slide.content as StudioContent
        const bgColor = content?.canvas?.backgroundColor || '#ffffff'
        html += `<div class="slide"><div class="slide-title">${slide.title || `Scene ${slides.indexOf(slide) + 1}`}</div>`
        html += `<div class="slide-canvas" style="background:${bgColor}">`

        const layers = content?.layers || []
        for (const layer of layers) {
          if (!layer.visible) continue
          if (layer.type === 'image' && layer.src && !layer.src.startsWith('blob:')) {
            html += `<img class="layer" src="${layer.src}" style="left:${layer.x}%;top:${layer.y}%;width:${layer.width}%;height:${layer.height}%;opacity:${layer.opacity};transform:rotate(${layer.rotation}deg);transform-origin:center" />`
          } else if (layer.type === 'text') {
            html += `<div class="layer" style="left:${layer.x}%;top:${layer.y}%;width:${layer.width}%;height:${layer.height}%;color:${layer.color || '#000'};font-size:${(layer.fontSize || 24) * 0.6}px;opacity:${layer.opacity};transform:rotate(${layer.rotation}deg);font-family:${layer.fontFamily || 'Arial'}">${layer.text || ''}</div>`
          } else if (layer.type === 'shape') {
            html += `<div class="layer" style="left:${layer.x}%;top:${layer.y}%;width:${layer.width}%;height:${layer.height}%;background:${layer.color || '#666'};opacity:${layer.opacity};transform:rotate(${layer.rotation}deg)"></div>`
          }
        }
        html += '</div></div>'
      }

      html += `<div class="no-print" style="position:fixed;bottom:20px;right:20px;z-index:100"><button onclick="window.print()" style="padding:10px 20px;background:#dc2626;color:white;border:none;border-radius:8px;cursor:pointer;font-size:14px">Print / Save as PDF</button></div>`
      html += '</body></html>'

      printWindow.document.write(html)
      printWindow.document.close()
    } catch {
      const { toast } = await import('sonner')
      toast.error('Failed to generate PDF preview', { duration: 3000 })
    } finally {
      setExporting(null)
    }
  }

  return (
    <div className="fixed inset-0 z-[300] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#1e1f22] border border-[#3f4147] rounded-xl p-5 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Download className="w-4 h-4 text-red-400" />
            Export Presentation
          </h3>
          <button onClick={onClose} className="p-1 rounded-md text-zinc-500 hover:text-white hover:bg-white/10 transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          <button onClick={handleExportPPTX} disabled={!!exporting}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#2b2d31] hover:bg-[#35363c] transition-colors text-left disabled:opacity-50">
            <Presentation className="w-5 h-5 text-orange-400" />
            <div className="flex-1">
              <p className="text-[11px] font-medium text-zinc-200">PowerPoint (.pptx)</p>
              <p className="text-[9px] text-zinc-500">Editable slides with layers</p>
            </div>
            {exporting === 'pptx' && <Loader2 className="w-4 h-4 text-zinc-400 animate-spin" />}
          </button>

          <button onClick={handleExportPDF} disabled={!!exporting}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#2b2d31] hover:bg-[#35363c] transition-colors text-left disabled:opacity-50">
            <FileText className="w-5 h-5 text-red-400" />
            <div className="flex-1">
              <p className="text-[11px] font-medium text-zinc-200">PDF (Print Preview)</p>
              <p className="text-[9px] text-zinc-500">Opens print dialog for PDF</p>
            </div>
            {exporting === 'pdf' && <Loader2 className="w-4 h-4 text-zinc-400 animate-spin" />}
          </button>

          <button onClick={handleExportC360} disabled={!!exporting}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#2b2d31] hover:bg-[#35363c] transition-colors text-left disabled:opacity-50">
            <FileJson className="w-5 h-5 text-blue-400" />
            <div className="flex-1">
              <p className="text-[11px] font-medium text-zinc-200">Command 360 (.c360)</p>
              <p className="text-[9px] text-zinc-500">Full project backup</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
