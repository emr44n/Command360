'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import type { StudioLayer } from '@/types/slide'
import { Zap, X, Upload, ImageIcon, VideoIcon, Plus, Loader2 } from 'lucide-react'
import { generateLayerId } from '@/lib/utils/studio-utils'

/* ─── Upload helper (same pattern as StudioGallery) ─── */
function uploadAssetFile(
  file: File,
  onProgress?: (pct: number) => void
): Promise<{ url: string; name: string }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    const formData = new FormData()
    formData.append('file', file)
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100))
    })
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try { resolve(JSON.parse(xhr.responseText)) } catch { reject(new Error('Invalid response')) }
      } else { reject(new Error('Upload failed')) }
    })
    xhr.addEventListener('error', () => reject(new Error('Upload failed')))
    xhr.open('POST', '/api/studio/assets')
    xhr.send(formData)
  })
}

interface AssetItem {
  id: string
  name: string
  url: string
  type: 'image' | 'video'
}

interface PushPanelProps {
  layers: StudioLayer[]
  pendingLayers: StudioLayer[]
  onAddPendingLayer: (layer: StudioLayer) => void
  onRemovePendingLayer: (id: string) => void
  onPush: (layers: StudioLayer[], transition: 'fade' | 'instant') => void
  onClear: () => void
}

export function PushPanel({ layers, pendingLayers, onRemovePendingLayer, onPush, onClear, onAddPendingLayer }: PushPanelProps) {
  const [transition, setTransition] = useState<'fade' | 'instant'>('fade')
  const [tab, setTab] = useState<'images' | 'videos'>('images')
  const [images, setImages] = useState<AssetItem[]>([])
  const [videos, setVideos] = useState<AssetItem[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  // Extract assets from existing layers on mount
  useEffect(() => {
    const seen = new Set<string>()
    const imgs: AssetItem[] = []
    const vids: AssetItem[] = []
    for (const l of layers) {
      if (l.src && !seen.has(l.src)) {
        seen.add(l.src)
        if (l.type === 'image') imgs.push({ id: l.id, name: l.name, url: l.src, type: 'image' })
        if (l.type === 'video') vids.push({ id: l.id, name: l.name, url: l.src, type: 'video' })
      }
    }
    setImages(imgs)
    setVideos(vids)
  }, [layers])

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    setUploading(true)
    setUploadProgress(0)
    for (const file of Array.from(files)) {
      try {
        const { url, name } = await uploadAssetFile(file, (pct) => setUploadProgress(pct))
        setImages(prev => [...prev, { id: generateLayerId(), name, url, type: 'image' }])
      } catch {
        try {
          const { url, name } = await uploadAssetFile(file, (pct) => setUploadProgress(pct))
          setImages(prev => [...prev, { id: generateLayerId(), name, url, type: 'image' }])
        } catch { /* silent */ }
      }
    }
    setUploading(false)
    setUploadProgress(0)
    e.target.value = ''
  }, [])

  const handleVideoUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    setUploading(true)
    setUploadProgress(0)
    for (const file of Array.from(files)) {
      try {
        const { url, name } = await uploadAssetFile(file, (pct) => setUploadProgress(pct))
        setVideos(prev => [...prev, { id: generateLayerId(), name, url, type: 'video' }])
      } catch {
        try {
          const { url, name } = await uploadAssetFile(file, (pct) => setUploadProgress(pct))
          setVideos(prev => [...prev, { id: generateLayerId(), name, url, type: 'video' }])
        } catch { /* silent */ }
      }
    }
    setUploading(false)
    setUploadProgress(0)
    e.target.value = ''
  }, [])

  const handleAssetDragStart = (e: React.DragEvent<HTMLElement>, asset: AssetItem) => {
    e.dataTransfer.setData('studio/asset-type', asset.type)
    e.dataTransfer.setData('studio/asset-src', asset.url)
    e.dataTransfer.setData('studio/asset-name', asset.name)
    e.dataTransfer.effectAllowed = 'copy'
  }

  const addToPending = (asset: AssetItem) => {
    const layer: StudioLayer = {
      id: generateLayerId(),
      name: asset.name,
      type: asset.type,
      src: asset.url,
      x: 10, y: 10,
      width: asset.type === 'video' ? 40 : 30,
      height: asset.type === 'video' ? 22.5 : 30,
      rotation: 0, zIndex: 100, opacity: 1,
      blendMode: 'normal', visible: true, locked: false,
      ...(asset.type === 'video' ? { loop: true, autoplay: true, muted: true } : {}),
    }
    onAddPendingLayer(layer)
  }

  const assets = tab === 'images' ? images : videos

  return (
    <div className="w-56 shrink-0 bg-[#1e1f22] border-l border-[#2b2d31] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-2 py-2 border-b border-[#2b2d31]">
        <h3 className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Push to Live</h3>
      </div>

      {/* Asset Browser Tabs */}
      <div className="flex border-b border-[#2b2d31]">
        <button
          onClick={() => setTab('images')}
          className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-[8px] font-bold uppercase tracking-wider transition-colors ${tab === 'images' ? 'text-red-400 border-b border-red-500' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          <ImageIcon className="w-2.5 h-2.5" /> Images
        </button>
        <button
          onClick={() => setTab('videos')}
          className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-[8px] font-bold uppercase tracking-wider transition-colors ${tab === 'videos' ? 'text-red-400 border-b border-red-500' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          <VideoIcon className="w-2.5 h-2.5" /> Videos
        </button>
      </div>

      {/* Upload Button */}
      <div className="px-2 pt-2">
        <input ref={imageInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
        <input ref={videoInputRef} type="file" accept="video/mp4,video/webm" multiple className="hidden" onChange={handleVideoUpload} />
        <button
          onClick={() => tab === 'images' ? imageInputRef.current?.click() : videoInputRef.current?.click()}
          disabled={uploading}
          className="w-full flex items-center justify-center gap-1 py-1.5 text-[9px] font-medium rounded-md border border-dashed border-zinc-600 bg-[#2b2d31] text-zinc-300 hover:bg-[#35363c] disabled:opacity-50 transition-colors"
        >
          {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
          {uploading ? `${uploadProgress}%` : `Upload ${tab === 'images' ? 'Image' : 'Video'}`}
        </button>
        {uploading && (
          <div className="mt-1 h-0.5 w-full rounded-full bg-zinc-800 overflow-hidden">
            <div className="h-0.5 bg-red-500 rounded-full transition-all duration-150" style={{ width: `${uploadProgress}%` }} />
          </div>
        )}
      </div>

      {/* Asset Grid */}
      <div className="flex-1 overflow-y-auto p-2">
        {assets.length === 0 ? (
          <p className="text-[9px] text-zinc-600 text-center py-4">No {tab} yet. Upload to get started.</p>
        ) : (
          <div className="grid grid-cols-2 gap-1">
            {assets.map(asset => (
              <div
                key={asset.id}
                className="group relative aspect-video overflow-hidden rounded border border-[#3f4147] bg-[#383a40] hover:border-zinc-500 cursor-grab active:cursor-grabbing"
                draggable
                onDragStart={(e) => handleAssetDragStart(e, asset)}
                onClick={() => addToPending(asset)}
              >
                {asset.type === 'image' ? (
                  <img src={asset.url} alt={asset.name} className="h-full w-full object-cover pointer-events-none" />
                ) : (
                  <video src={asset.url} className="h-full w-full object-cover pointer-events-none" muted preload="metadata" />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <Plus className="w-4 h-4 text-white" />
                </div>
                <span className="absolute bottom-0 left-0 right-0 truncate bg-black/60 px-1 py-0.5 text-[8px] text-zinc-300">{asset.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pending Queue */}
      {pendingLayers.length > 0 && (
        <div className="border-t border-[#2b2d31] px-2 py-1.5 max-h-32 overflow-y-auto">
          <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Queue ({pendingLayers.length})</p>
          <div className="space-y-0.5">
            {pendingLayers.map(layer => (
              <div key={layer.id} className="flex items-center gap-1.5 bg-[#2b2d31] rounded-md px-2 py-1 text-[9px] text-zinc-300">
                <span className="flex-1 truncate">{layer.name}</span>
                <button onClick={() => onRemovePendingLayer(layer.id)} className="text-zinc-600 hover:text-red-400 transition-colors"><X className="w-2.5 h-2.5" /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Push Controls */}
      <div className="p-2 border-t border-[#2b2d31] space-y-2">
        <div className="flex gap-1">
          <button onClick={() => setTransition('fade')} className={`flex-1 text-[8px] py-1 rounded-md transition-colors ${transition === 'fade' ? 'bg-red-500/20 text-red-400' : 'bg-[#2b2d31] text-zinc-500'}`}>Fade In</button>
          <button onClick={() => setTransition('instant')} className={`flex-1 text-[8px] py-1 rounded-md transition-colors ${transition === 'instant' ? 'bg-red-500/20 text-red-400' : 'bg-[#2b2d31] text-zinc-500'}`}>Instant</button>
        </div>
        <button onClick={() => onPush(pendingLayers, transition)} disabled={pendingLayers.length === 0}
          className="w-full py-2 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-30 disabled:cursor-not-allowed text-white text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5">
          <Zap className="w-3 h-3" /> Push Live
        </button>
        {pendingLayers.length > 0 && (
          <button onClick={onClear} className="w-full py-1 text-[9px] text-zinc-500 hover:text-zinc-300 transition-colors">Clear all</button>
        )}
      </div>
    </div>
  )
}
