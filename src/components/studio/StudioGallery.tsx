'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import {
  ImageIcon,
  VideoIcon,
  LayersIcon,
  PlusIcon,
  UploadIcon,
  Trash2Icon,
  LayoutGrid,
  List,
  ZapIcon,
  Loader2Icon,
  ChevronDown,
  ChevronRight,
  Play,
  Settings2,
  GripVertical,
} from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { StudioLayer, StudioEvent, StudioEventCategory } from '@/types/slide'
import { generateLayerId } from '@/lib/utils/studio-utils'
import { useStudioStore } from '@/stores/studioStore'

interface StudioGalleryProps {
  layers: StudioLayer[]
  onAddLayer: (layer: Partial<StudioLayer>) => void
  onSelectLayer: (id: string) => void
  onDeleteLayer?: (id: string) => void
  events?: StudioEvent[]
  eventCategories?: StudioEventCategory[]
  onUpdateEvents?: (events: StudioEvent[]) => void
  onReorderLayers?: (fromIndex: number, toIndex: number) => void
  onUpdateCategories?: (categories: StudioEventCategory[]) => void
  onTriggerEvent?: (eventId: string) => void
  initialTab?: 'images' | 'videos' | 'placed' | 'events'
}

interface AssetItem {
  id: string
  name: string
  url: string
  type: 'image' | 'video'
}

function uploadAssetFile(
  file: File,
  onProgress?: (pct: number) => void
): Promise<{ url: string; name: string }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    const formData = new FormData()
    formData.append('file', file)

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100))
      }
    })

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText))
        } catch {
          reject(new Error('Invalid response'))
        }
      } else {
        try {
          const err = JSON.parse(xhr.responseText)
          reject(new Error(err.error || 'Upload failed'))
        } catch {
          reject(new Error('Upload failed'))
        }
      }
    })

    xhr.addEventListener('error', () => reject(new Error('Upload failed')))
    xhr.addEventListener('abort', () => reject(new Error('Upload aborted')))

    xhr.open('POST', '/api/studio/assets')
    xhr.send(formData)
  })
}

function extractAssetsFromLayers(layers: StudioLayer[]): { images: AssetItem[]; videos: AssetItem[] } {
  const images: AssetItem[] = []
  const videos: AssetItem[] = []
  const seen = new Set<string>()

  for (const layer of layers) {
    if ((layer.type === 'image' || layer.type === 'video') && layer.src && !seen.has(layer.src)) {
      seen.add(layer.src)
      const asset: AssetItem = {
        id: layer.id,
        name: layer.name,
        url: layer.src,
        type: layer.type,
      }
      if (layer.type === 'image') images.push(asset)
      else videos.push(asset)
    }
  }

  return { images, videos }
}

export function StudioGallery({
  layers,
  onAddLayer,
  onSelectLayer,
  onDeleteLayer,
  events = [],
  eventCategories = [],
  onUpdateEvents,
  onReorderLayers,
  onUpdateCategories,
  onTriggerEvent,
  initialTab = 'images',
}: StudioGalleryProps) {
  const [images, setImages] = useState<AssetItem[]>([])
  const [videos, setVideos] = useState<AssetItem[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [newEventName, setNewEventName] = useState('')
  const [newCategoryName, setNewCategoryName] = useState('')
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set())
  const [editingEventId, setEditingEventId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [tabsNarrow, setTabsNarrow] = useState(false)
  const [dragLayerIdx, setDragLayerIdx] = useState<number | null>(null)
  const tabContainerRef = useRef<HTMLDivElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const { selectedEventId, setSelectedEventId } = useStudioStore()

  // Measure tab container width to hide labels when narrow
  useEffect(() => {
    const el = tabContainerRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      setTabsNarrow(entry.contentRect.width < 220)
    })
    ro.observe(el)
    setTabsNarrow(el.clientWidth < 220)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const existing = extractAssetsFromLayers(layers)
    setImages((prev) => {
      const urls = new Set(prev.map((a) => a.url))
      const newOnes = existing.images.filter((a) => !urls.has(a.url))
      return newOnes.length > 0 ? [...prev, ...newOnes] : prev
    })
    setVideos((prev) => {
      const urls = new Set(prev.map((a) => a.url))
      const newOnes = existing.videos.filter((a) => !urls.has(a.url))
      return newOnes.length > 0 ? [...prev, ...newOnes] : prev
    })
  }, [layers])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    setUploading(true)
    setUploadProgress(0)
    let successCount = 0
    try {
      for (const file of Array.from(files)) {
        try {
          const { url, name } = await uploadAssetFile(file, (pct) => setUploadProgress(pct))
          setImages((prev) => [...prev, { id: generateLayerId(), name, url, type: 'image' }])
          successCount++
        } catch (err) {
          // Retry once
          try {
            const { url, name } = await uploadAssetFile(file, (pct) => setUploadProgress(pct))
            setImages((prev) => [...prev, { id: generateLayerId(), name, url, type: 'image' }])
            successCount++
          } catch {
            // DO NOT fallback to blob URL — it will break on refresh
            const { toast } = await import('sonner')
            toast.error(`Failed to upload "${file.name}". Check your connection and try again.`, { duration: 4000 })
          }
        }
      }
    } finally {
      setUploading(false)
      setUploadProgress(0)
      if (successCount > 0) {
        const { toast } = await import('sonner')
        toast.success(`${successCount} image${successCount > 1 ? 's' : ''} uploaded`, { duration: 2000 })
      }
    }
    e.target.value = ''
  }

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    setUploading(true)
    setUploadProgress(0)
    let successCount = 0
    try {
      for (const file of Array.from(files)) {
        try {
          const { url, name } = await uploadAssetFile(file, (pct) => setUploadProgress(pct))
          setVideos((prev) => [...prev, { id: generateLayerId(), name, url, type: 'video' }])
          successCount++
        } catch {
          // Retry once
          try {
            const { url, name } = await uploadAssetFile(file, (pct) => setUploadProgress(pct))
            setVideos((prev) => [...prev, { id: generateLayerId(), name, url, type: 'video' }])
            successCount++
          } catch {
            const { toast } = await import('sonner')
            toast.error(`Failed to upload video. Check your connection and try again.`, { duration: 4000 })
          }
        }
      }
    } finally {
      setUploading(false)
      setUploadProgress(0)
      if (successCount > 0) {
        const { toast } = await import('sonner')
        toast.success(`${successCount} video${successCount > 1 ? 's' : ''} uploaded`, { duration: 2000 })
      }
    }
    e.target.value = ''
  }

  const handleAssetDragStart = (e: React.DragEvent<HTMLElement>, asset: AssetItem) => {
    e.dataTransfer.setData('studio/asset-type', asset.type)
    e.dataTransfer.setData('studio/asset-src', asset.url)
    e.dataTransfer.effectAllowed = 'copy'
  }

  // Clean up file names — truncate long names, add layer count
  const cleanName = (name: string, type: string) => {
    const ext = name.split('.').pop() || ''
    const base = name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')
    const short = base.length > 24 ? base.slice(0, 24) + '…' : base
    const count = layers.filter(l => l.type === type).length + 1
    return `${short}_${count}`
  }

  const addImageToCanvas = (asset: AssetItem) => {
    const layerName = cleanName(asset.name, 'image')
    // Load image to get natural dimensions, then add with correct aspect ratio
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.src = asset.url
    img.onload = () => {
      const aspectRatio = img.naturalWidth / img.naturalHeight
      // Fit within 40% width, calculate height from aspect ratio
      const widthPct = 40
      const heightPct = widthPct / aspectRatio * (16 / 9) // account for 16:9 canvas
      onAddLayer({
        id: generateLayerId(), name: layerName, type: 'image', src: asset.url,
        x: 10, y: 10, width: widthPct, height: Math.min(heightPct, 80), rotation: 0, opacity: 1,
        blendMode: 'normal', visible: true, locked: false,
      })
    }
    img.onerror = () => {
      // Fallback: use default size
      onAddLayer({
        id: generateLayerId(), name: layerName, type: 'image', src: asset.url,
        x: 10, y: 10, width: 30, height: 30, rotation: 0, opacity: 1,
        blendMode: 'normal', visible: true, locked: false,
      })
    }
  }

  const addVideoToCanvas = (asset: AssetItem) => {
    // Videos default to 16:9 aspect ratio
    onAddLayer({
      id: generateLayerId(), name: cleanName(asset.name, 'video'), type: 'video', src: asset.url,
      x: 10, y: 10, width: 40, height: 22.5, rotation: 0, opacity: 1,
      blendMode: 'normal', visible: true, locked: false,
      loop: true, autoplay: true, muted: true,
    })
  }

  // Event CRUD
  const handleAddEvent = (categoryId?: string) => {
    if (!newEventName.trim() || !onUpdateEvents) return
    const newEvent: StudioEvent = {
      id: crypto.randomUUID(),
      name: newEventName.trim(),
      categoryId,
      color: '#6366f1',
      trigger: 'manual',
      actions: [],
    }
    onUpdateEvents([...events, newEvent])
    setNewEventName('')
    setSelectedEventId(newEvent.id)
  }

  const handleDeleteEvent = (eventId: string) => {
    if (!onUpdateEvents) return
    onUpdateEvents(events.filter((e) => e.id !== eventId))
    if (selectedEventId === eventId) setSelectedEventId(null)
  }

  const handleRenameEvent = (eventId: string, newName: string) => {
    if (!onUpdateEvents || !newName.trim()) return
    onUpdateEvents(events.map((e) => e.id === eventId ? { ...e, name: newName.trim() } : e))
    setEditingEventId(null)
  }

  // Category CRUD
  const handleAddCategory = () => {
    if (!newCategoryName.trim() || !onUpdateCategories) return
    const cat: StudioEventCategory = {
      id: crypto.randomUUID(),
      name: newCategoryName.trim(),
      color: '#6366f1',
    }
    onUpdateCategories([...eventCategories, cat])
    setNewCategoryName('')
  }

  const handleDeleteCategory = (catId: string) => {
    if (!onUpdateCategories || !onUpdateEvents) return
    onUpdateCategories(eventCategories.filter((c) => c.id !== catId))
    onUpdateEvents(events.map((e) => e.categoryId === catId ? { ...e, categoryId: undefined } : e))
  }

  const toggleCategory = (catId: string) => {
    setCollapsedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(catId)) next.delete(catId)
      else next.add(catId)
      return next
    })
  }

  // Group events by category
  const uncategorizedEvents = events.filter((e) => !e.categoryId)
  const categorizedEvents = eventCategories.map((cat) => ({
    category: cat,
    events: events.filter((e) => e.categoryId === cat.id),
  }))

  const getTargetName = (event: StudioEvent) => {
    if (event.actions.length === 0) return null
    const layer = layers.find((l) => l.id === event.actions[0].layerId)
    return layer?.name ?? null
  }

  const typeIcon = (type: StudioLayer['type']) => {
    switch (type) {
      case 'image': return <ImageIcon className="size-3.5 text-red-400" />
      case 'video': return <VideoIcon className="size-3.5 text-purple-400" />
      case 'text': return <span className="text-xs font-bold text-amber-400">T</span>
      case 'shape': return <span className="text-xs text-emerald-400">&#9632;</span>
      default: return null
    }
  }

  const renderEventRow = (evt: StudioEvent) => {
    const isSelected = selectedEventId === evt.id
    const targetName = getTargetName(evt)

    return (
      <div
        key={evt.id}
        className={`flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs cursor-pointer transition-all group ${
          isSelected ? 'bg-red-600/20 text-red-300' : 'hover:bg-zinc-800 text-zinc-300'
        }`}
        onClick={() => setSelectedEventId(evt.id)}
      >
        <div
          className="size-2 shrink-0 rounded-full"
          style={{ backgroundColor: evt.color || '#6366f1' }}
        />
        {editingEventId === evt.id ? (
          <input
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
            onBlur={() => handleRenameEvent(evt.id, editingName)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleRenameEvent(evt.id, editingName) }}
            className="flex-1 h-5 text-xs bg-zinc-800 border border-zinc-600 rounded px-1 text-zinc-100"
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span
            className="flex-1 truncate"
            onDoubleClick={(e) => {
              e.stopPropagation()
              setEditingEventId(evt.id)
              setEditingName(evt.name)
            }}
          >
            {evt.name}
          </span>
        )}
        {targetName && (
          <span className="text-[9px] text-zinc-500 truncate max-w-[60px]">{targetName}</span>
        )}
        {evt.actions.length > 0 && (
          <span className="text-[9px] bg-zinc-700/50 text-zinc-400 px-1 rounded">
            {evt.actions.length}
          </span>
        )}
        {onTriggerEvent && (
          <button
            className="p-0.5 text-zinc-600 opacity-0 group-hover:opacity-100 hover:text-emerald-400 transition-all cursor-pointer"
            onClick={(e) => { e.stopPropagation(); onTriggerEvent(evt.id) }}
            title="Trigger"
          >
            <Play className="size-3 fill-current" />
          </button>
        )}
        <button
          className="p-0.5 text-zinc-600 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all cursor-pointer"
          onClick={(e) => { e.stopPropagation(); handleDeleteEvent(evt.id) }}
          title="Delete"
        >
          <Trash2Icon className="size-3" />
        </button>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-[#2b2d31] text-zinc-200">
      <Tabs defaultValue={initialTab} key={initialTab} className="flex h-full flex-col">
        <div ref={tabContainerRef} className="flex border-b border-[#1e1f22] shrink-0">
          <TabsList className="w-full bg-transparent p-0 h-auto rounded-none gap-0">
            <TabsTrigger value="images" className="flex-1 min-w-0 flex items-center justify-center gap-1 px-1 py-1.5 text-[9px] font-semibold rounded-none border-b-[3px] transition-all duration-200 data-[state=active]:border-red-500 data-[state=active]:text-white data-[state=active]:bg-[#3a1c1c] data-[state=active]:[&_svg]:text-red-400 data-[state=inactive]:border-transparent data-[state=inactive]:text-zinc-700 data-[state=inactive]:bg-[#1a1b1e] data-[state=inactive]:[&_svg]:text-zinc-700 data-[state=inactive]:hover:text-zinc-300 data-[state=inactive]:hover:bg-[#2a2b30]" title="Images">
              <ImageIcon className="size-3 shrink-0" />
              {!tabsNarrow && 'Images'}
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex-1 min-w-0 flex items-center justify-center gap-1 px-1 py-1.5 text-[9px] font-semibold rounded-none border-b-[3px] transition-all duration-200 data-[state=active]:border-red-500 data-[state=active]:text-white data-[state=active]:bg-[#3a1c1c] data-[state=active]:[&_svg]:text-red-400 data-[state=inactive]:border-transparent data-[state=inactive]:text-zinc-700 data-[state=inactive]:bg-[#1a1b1e] data-[state=inactive]:[&_svg]:text-zinc-700 data-[state=inactive]:hover:text-zinc-300 data-[state=inactive]:hover:bg-[#2a2b30]" title="Videos">
              <VideoIcon className="size-3 shrink-0" />
              {!tabsNarrow && 'Videos'}
            </TabsTrigger>
            <TabsTrigger value="placed" className="flex-1 min-w-0 flex items-center justify-center gap-1 px-1 py-1.5 text-[9px] font-semibold rounded-none border-b-[3px] transition-all duration-200 data-[state=active]:border-red-500 data-[state=active]:text-white data-[state=active]:bg-[#3a1c1c] data-[state=active]:[&_svg]:text-red-400 data-[state=inactive]:border-transparent data-[state=inactive]:text-zinc-700 data-[state=inactive]:bg-[#1a1b1e] data-[state=inactive]:[&_svg]:text-zinc-700 data-[state=inactive]:hover:text-zinc-300 data-[state=inactive]:hover:bg-[#2a2b30]" title="Layers">
              <LayersIcon className="size-3 shrink-0" />
              {!tabsNarrow && 'Layers'}
            </TabsTrigger>
            <TabsTrigger value="events" className="flex-1 min-w-0 flex items-center justify-center gap-1 px-1 py-1.5 text-[9px] font-semibold rounded-none border-b-[3px] transition-all duration-200 data-[state=active]:border-red-500 data-[state=active]:text-white data-[state=active]:bg-[#3a1c1c] data-[state=active]:[&_svg]:text-red-400 data-[state=inactive]:border-transparent data-[state=inactive]:text-zinc-700 data-[state=inactive]:bg-[#1a1b1e] data-[state=inactive]:[&_svg]:text-zinc-700 data-[state=inactive]:hover:text-zinc-300 data-[state=inactive]:hover:bg-[#2a2b30]" title="Events">
              <ZapIcon className="size-3 shrink-0" />
              {!tabsNarrow && 'Events'}
            </TabsTrigger>
          </TabsList>
          {/* Grid/List toggle for assets */}
          <div className="flex items-center px-1 gap-0.5 border-b-2 border-transparent">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded transition-colors ${viewMode === 'grid' ? 'text-zinc-300 bg-[#35363c]' : 'text-zinc-600 hover:text-zinc-400'}`}
              title="Grid view"
            >
              <LayoutGrid className="size-3" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded transition-colors ${viewMode === 'list' ? 'text-zinc-300 bg-[#35363c]' : 'text-zinc-600 hover:text-zinc-400'}`}
              title="List view"
            >
              <List className="size-3" />
            </button>
          </div>
        </div>

        {/* Images Tab */}
        <TabsContent value="images" className="flex-1 overflow-y-auto px-2 pb-2 animate-[fadeIn_0.2s_ease-out]">
          <input ref={imageInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
          <Button
            variant="outline" size="sm"
            className="mt-2 w-full border-dashed border-zinc-600 bg-[#383a40] text-zinc-300 hover:bg-zinc-700"
            onClick={() => imageInputRef.current?.click()} disabled={uploading}
          >
            {uploading ? <Loader2Icon className="mr-1.5 size-3.5 animate-spin" /> : <UploadIcon className="mr-1.5 size-3.5" />}
            {uploading ? 'Uploading...' : 'Upload Image'}
          </Button>
          {uploading && (
            <div className="mt-1.5 h-1 w-full rounded-full bg-zinc-800 overflow-hidden">
              <div className="h-1 bg-red-500 rounded-full transition-all duration-150" style={{ width: `${uploadProgress}%` }} />
            </div>
          )}
          {images.length === 0 && <p className="mt-4 text-center text-xs text-zinc-500">No images uploaded yet</p>}
          <div className={`mt-1.5 ${viewMode === 'grid' ? 'grid grid-cols-2 gap-1' : 'flex flex-col gap-0.5'}`}>
            {images.map((asset) => viewMode === 'list' ? (
              <div
                key={asset.id}
                role="button"
                tabIndex={0}
                className="group flex items-center gap-2 px-1.5 py-1 rounded hover:bg-[#35363c] cursor-pointer transition-colors"
                onClick={() => addImageToCanvas(asset)}
                draggable onDragStart={(e) => handleAssetDragStart(e, asset)}
              >
                <img src={asset.url} alt={asset.name} className="w-8 h-6 object-cover rounded shrink-0" />
                <span className="text-[9px] text-zinc-300 truncate flex-1">{asset.name}</span>
                <button
                  className="p-0.5 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => { e.stopPropagation(); onDeleteLayer?.(asset.id); setImages(prev => prev.filter(a => a.id !== asset.id)) }}
                >
                  <Trash2Icon className="size-2.5" />
                </button>
              </div>
            ) : (
              <div
                key={asset.id}
                role="button"
                tabIndex={0}
                className="group relative aspect-video overflow-hidden rounded border border-[#3f4147] bg-[#383a40] hover:border-zinc-500 cursor-grab active:cursor-grabbing"
                draggable onDragStart={(e) => handleAssetDragStart(e, asset)}
                onClick={() => addImageToCanvas(asset)} title={`${asset.name} — drag to canvas or click to add`}
              >
                <img src={asset.url} alt={asset.name} className="h-full w-full object-cover pointer-events-none" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <PlusIcon className="size-5 text-white" />
                </div>
                <button
                  className="absolute top-0.5 right-0.5 p-0.5 rounded bg-red-600/80 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 z-10"
                  onClick={(e) => { e.stopPropagation(); onDeleteLayer?.(asset.id); setImages(prev => prev.filter(a => a.id !== asset.id)) }}
                  title="Remove from canvas"
                >
                  <Trash2Icon className="size-2.5" />
                </button>
                <span className="absolute bottom-0 left-0 right-0 truncate bg-black/60 px-1 py-0.5 text-[10px] text-zinc-300">{asset.name}</span>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Videos Tab */}
        <TabsContent value="videos" className="flex-1 overflow-y-auto px-2 pb-2 animate-[fadeIn_0.2s_ease-out]">
          <input ref={videoInputRef} type="file" accept="video/mp4,video/webm" multiple className="hidden" onChange={handleVideoUpload} />
          <Button
            variant="outline" size="sm"
            className="mt-2 w-full border-dashed border-zinc-600 bg-[#383a40] text-zinc-300 hover:bg-zinc-700"
            onClick={() => videoInputRef.current?.click()} disabled={uploading}
          >
            {uploading ? <Loader2Icon className="mr-1.5 size-3.5 animate-spin" /> : <UploadIcon className="mr-1.5 size-3.5" />}
            {uploading ? 'Uploading...' : 'Upload Video'}
          </Button>
          {uploading && (
            <div className="mt-1.5 h-1 w-full rounded-full bg-zinc-800 overflow-hidden">
              <div className="h-1 bg-red-500 rounded-full transition-all duration-150" style={{ width: `${uploadProgress}%` }} />
            </div>
          )}
          {videos.length === 0 && <p className="mt-4 text-center text-xs text-zinc-500">No videos uploaded yet</p>}
          <div className={`mt-1.5 ${viewMode === 'grid' ? 'grid grid-cols-2 gap-1' : 'flex flex-col gap-0.5'}`}>
            {videos.map((asset) => viewMode === 'list' ? (
              <div
                key={asset.id}
                role="button"
                tabIndex={0}
                className="group flex items-center gap-2 px-1.5 py-1 rounded hover:bg-[#35363c] cursor-pointer transition-colors"
                onClick={() => addVideoToCanvas(asset)}
                draggable onDragStart={(e) => handleAssetDragStart(e, asset)}
              >
                <video src={asset.url} className="w-8 h-6 object-cover rounded shrink-0" muted playsInline />
                <span className="text-[9px] text-zinc-300 truncate flex-1">{asset.name}</span>
                <button
                  className="p-0.5 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => { e.stopPropagation(); onDeleteLayer?.(asset.id); setVideos(prev => prev.filter(a => a.id !== asset.id)) }}
                >
                  <Trash2Icon className="size-2.5" />
                </button>
              </div>
            ) : (
              <div
                key={asset.id}
                role="button"
                tabIndex={0}
                className="group relative aspect-video overflow-hidden rounded border border-[#3f4147] bg-[#383a40] hover:border-zinc-500 cursor-grab active:cursor-grabbing"
                draggable onDragStart={(e) => handleAssetDragStart(e, asset)}
                onClick={() => addVideoToCanvas(asset)} title={`${asset.name} — drag to canvas or click to add`}
              >
                <video src={asset.url} className="h-full w-full object-cover pointer-events-none" muted playsInline />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <PlusIcon className="size-5 text-white" />
                </div>
                <button
                  className="absolute top-0.5 right-0.5 p-0.5 rounded bg-red-600/80 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 z-10"
                  onClick={(e) => { e.stopPropagation(); onDeleteLayer?.(asset.id); setVideos(prev => prev.filter(a => a.id !== asset.id)) }}
                  title="Remove from canvas"
                >
                  <Trash2Icon className="size-2.5" />
                </button>
                <span className="absolute bottom-0 left-0 right-0 truncate bg-black/60 px-1 py-0.5 text-[10px] text-zinc-300">{asset.name}</span>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Placed Items Tab */}
        <TabsContent value="placed" className="flex-1 overflow-y-auto px-2 pb-2 animate-[fadeIn_0.2s_ease-out]">
          {layers.length === 0 && <p className="mt-4 text-center text-xs text-zinc-500">No layers placed yet</p>}
          <div className="mt-2 space-y-1">
            {layers.map((layer, idx) => (
              <div
                key={layer.id}
                draggable
                onDragStart={() => setDragLayerIdx(idx)}
                onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move' }}
                onDrop={() => {
                  if (dragLayerIdx !== null && dragLayerIdx !== idx) {
                    onReorderLayers?.(dragLayerIdx, idx)
                  }
                  setDragLayerIdx(null)
                }}
                onDragEnd={() => setDragLayerIdx(null)}
                className={`flex w-full items-center gap-1.5 rounded px-1.5 py-1.5 text-left text-xs hover:bg-zinc-800 cursor-pointer transition-colors ${
                  dragLayerIdx === idx ? 'opacity-50' : ''
                }`}
                onClick={() => onSelectLayer(layer.id)}
              >
                <GripVertical className="size-3 text-zinc-600 shrink-0 cursor-grab active:cursor-grabbing" />
                {typeIcon(layer.type)}
                <span className="flex-1 truncate">{layer.name}</span>
                {!layer.visible && <span className="text-[10px] text-zinc-500">hidden</span>}
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="flex-1 overflow-y-auto px-2 pb-2 animate-[fadeIn_0.2s_ease-out]">
          <div className="mt-2 space-y-2">
            {/* Add category (on top) */}
            <div className="flex gap-1.5">
              <Input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddCategory() }}
                placeholder="New category..."
                className="h-6 flex-1 border-[#3f4147] bg-[#383a40] text-xs text-zinc-100 placeholder:text-zinc-500"
              />
              <Button
                variant="outline" size="sm"
                className="h-6 shrink-0 border-zinc-600 bg-zinc-800 px-2 text-zinc-300 hover:bg-zinc-700"
                onClick={handleAddCategory} disabled={!newCategoryName.trim()}
              >
                <PlusIcon className="size-3.5" />
              </Button>
            </div>

            {/* Add event (below category) */}
            <div className="flex gap-1.5">
              <Input
                value={newEventName}
                onChange={(e) => setNewEventName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddEvent() }}
                placeholder="New event..."
                className="h-5 flex-1 border-zinc-700/50 bg-zinc-800/50 text-[10px] text-zinc-300 placeholder:text-zinc-600"
              />
              <Button
                variant="ghost" size="sm"
                className="h-5 shrink-0 px-1.5 text-zinc-500 hover:text-zinc-300"
                onClick={() => handleAddEvent()} disabled={!newEventName.trim()}
              >
                <PlusIcon className="size-3" />
              </Button>
            </div>

            {events.length === 0 && eventCategories.length === 0 && (
              <p className="mt-4 text-center text-xs text-zinc-500">No events yet</p>
            )}

            {/* Categorized events */}
            {categorizedEvents.map(({ category, events: catEvents }) => {
              const isCollapsed = collapsedCategories.has(category.id)
              return (
                <div key={category.id}>
                  <div className="flex items-center gap-1.5 group">
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="flex items-center gap-1 flex-1 py-1 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider hover:text-zinc-200 transition-colors cursor-pointer"
                    >
                      {isCollapsed ? <ChevronRight className="size-3" /> : <ChevronDown className="size-3" />}
                      <div className="size-1.5 rounded-full" style={{ backgroundColor: category.color || '#6366f1' }} />
                      {category.name}
                      <span className="text-zinc-600 font-normal ml-1">({catEvents.length})</span>
                    </button>
                    <button
                      className="p-0.5 text-zinc-600 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all cursor-pointer"
                      onClick={() => handleDeleteCategory(category.id)}
                      title="Delete category"
                    >
                      <Trash2Icon className="size-2.5" />
                    </button>
                  </div>
                  {!isCollapsed && (
                    <div className="ml-2 space-y-0.5">
                      {catEvents.map(renderEventRow)}
                      {catEvents.length === 0 && (
                        <p className="text-[10px] text-zinc-600 py-1 pl-2">No events in this category</p>
                      )}
                    </div>
                  )}
                </div>
              )
            })}

            {/* Uncategorized events */}
            {uncategorizedEvents.length > 0 && (
              <div>
                {eventCategories.length > 0 && (
                  <div className="py-1 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                    Uncategorized
                  </div>
                )}
                <div className="space-y-0.5">
                  {uncategorizedEvents.map(renderEventRow)}
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
