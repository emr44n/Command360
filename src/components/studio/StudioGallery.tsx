'use client'

import React, { useEffect, useRef, useState, useCallback, memo } from 'react'
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
  Pause,
  Settings2,
  GripVertical,
  Volume2,
} from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { StudioLayer, StudioEvent, StudioEventCategory } from '@/types/slide'
import { generateLayerId } from '@/lib/utils/studio-utils'
import { useStudioStore } from '@/stores/studioStore'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

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
  onStartPolygonDraw?: () => void
  initialTab?: 'images' | 'videos' | 'placed' | 'events' | 'audio' | 'text' | 'shapes'
}

interface AssetItem {
  id: string
  name: string
  url: string
  type: 'image' | 'video' | 'audio'
  duration?: number // seconds, for audio assets
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

function extractAssetsFromLayers(layers: StudioLayer[]): { images: AssetItem[]; videos: AssetItem[]; audios: AssetItem[] } {
  const images: AssetItem[] = []
  const videos: AssetItem[] = []
  const audios: AssetItem[] = []
  const seen = new Set<string>()

  for (const layer of layers) {
    if ((layer.type === 'image' || layer.type === 'video' || layer.type === 'audio') && layer.src && !seen.has(layer.src)) {
      seen.add(layer.src)
      const asset: AssetItem = {
        id: layer.id,
        name: layer.name,
        url: layer.src,
        type: layer.type,
      }
      if (layer.type === 'image') images.push(asset)
      else if (layer.type === 'video') videos.push(asset)
      else audios.push(asset)
    }
  }

  return { images, videos, audios }
}

const VideoThumbnail = memo(function VideoThumbnail({ src, className }: { src: string; className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hovering, setHovering] = useState(false)

  const handleMouseMove = (e: React.MouseEvent) => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas || !video.duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = (e.clientX - rect.left) / rect.width
    video.currentTime = pct * video.duration
  }

  useEffect(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return
    const ctx = canvas.getContext('2d')
    const drawFrame = () => {
      if (ctx && video.videoWidth) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        ctx.drawImage(video, 0, 0)
      }
    }
    video.addEventListener('seeked', drawFrame)
    // Set initial poster at 0.5s
    video.currentTime = 0.5
    return () => video.removeEventListener('seeked', drawFrame)
  }, [])

  return (
    <div
      className="relative w-full h-full"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => { setHovering(false); if (videoRef.current) videoRef.current.currentTime = 0.5 }}
      onMouseMove={hovering ? handleMouseMove : undefined}
    >
      <video ref={videoRef} src={src} className={className} muted playsInline preload="metadata" />
      {hovering && <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />}
    </div>
  )
})

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
  onStartPolygonDraw,
  initialTab = 'images',
}: StudioGalleryProps) {
  const [images, setImages] = useState<AssetItem[]>([])
  const [videos, setVideos] = useState<AssetItem[]>([])
  const [audios, setAudios] = useState<AssetItem[]>([])
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
  const [showYoutubeInput, setShowYoutubeInput] = useState(false)
  const [youtubeUrlInput, setYoutubeUrlInput] = useState('')
  const tabContainerRef = useRef<HTMLDivElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const audioInputRef = useRef<HTMLInputElement>(null)
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null)
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null)
  const { selectedEventId, setSelectedEventId, selectedLayerId } = useStudioStore()

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
    setAudios((prev) => {
      const urls = new Set(prev.map((a) => a.url))
      const newOnes = existing.audios.filter((a) => !urls.has(a.url))
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

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    setUploading(true)
    setUploadProgress(0)
    let successCount = 0
    try {
      for (const file of Array.from(files)) {
        try {
          const { url, name } = await uploadAssetFile(file, (pct) => setUploadProgress(pct))
          setAudios((prev) => [...prev, { id: generateLayerId(), name, url, type: 'audio' }])
          successCount++
        } catch {
          // Retry once
          try {
            const { url, name } = await uploadAssetFile(file, (pct) => setUploadProgress(pct))
            setAudios((prev) => [...prev, { id: generateLayerId(), name, url, type: 'audio' }])
            successCount++
          } catch {
            const { toast } = await import('sonner')
            toast.error(`Failed to upload audio. Check your connection and try again.`, { duration: 4000 })
          }
        }
      }
    } finally {
      setUploading(false)
      setUploadProgress(0)
      if (successCount > 0) {
        const { toast } = await import('sonner')
        toast.success(`${successCount} audio file${successCount > 1 ? 's' : ''} uploaded`, { duration: 2000 })
      }
    }
    e.target.value = ''
  }

  const addAudioToCanvas = (asset: AssetItem) => {
    onAddLayer({
      id: generateLayerId(),
      name: cleanName(asset.name, 'audio'),
      type: 'audio',
      src: asset.url,
      x: 0, y: 0, width: 0, height: 0,
      rotation: 0, opacity: 1,
      blendMode: 'normal', visible: true, locked: false,
      volume: 1, audioLoop: false,
    })
  }

  const toggleAudioPreview = (asset: AssetItem) => {
    if (playingAudioId === asset.id) {
      audioPreviewRef.current?.pause()
      audioPreviewRef.current = null
      setPlayingAudioId(null)
    } else {
      audioPreviewRef.current?.pause()
      const audio = new Audio(asset.url)
      audio.onended = () => { setPlayingAudioId(null); audioPreviewRef.current = null }
      audio.play()
      audioPreviewRef.current = audio
      setPlayingAudioId(asset.id)
    }
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
      case 'video': return <VideoIcon className="size-3.5 text-[#6a5ea8]" />
      case 'text': return <span className="text-xs font-bold text-amber-400">T</span>
      case 'shape': return <span className="text-xs text-[#2E9E63]">&#9632;</span>
      case 'audio': return <Volume2 className="size-3.5 text-[#3E6DC4]" />
      default: return null
    }
  }

  const renderEventRow = (evt: StudioEvent) => {
    const isSelected = selectedEventId === evt.id
    const targetName = getTargetName(evt)

    return (
      <div
        key={evt.id}
        className={`flex items-center gap-1.5 rounded-none px-2 py-1.5 text-xs cursor-pointer transition-all group ${
          isSelected ? 'bg-red-600/20 text-red-300' : 'hover:bg-[#2b2d31] text-[#9aa0a8]'
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
            className="flex-1 h-5 text-xs bg-[#2b2d31] border border-zinc-600 rounded-none px-1 text-white"
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
          <span className="text-[9px] text-[#9aa0a8] truncate max-w-[60px]">{targetName}</span>
        )}
        {evt.actions.length > 0 && (
          <span className="text-[9px] bg-zinc-700/50 text-[#9aa0a8] px-1 rounded-none">
            {evt.actions.length}
          </span>
        )}
        {onTriggerEvent && (
          <Tooltip><TooltipTrigger asChild>
          <button
            className="p-0.5 text-[#9aa0a8] opacity-0 group-hover:opacity-100 hover:text-[#2E9E63] transition-all cursor-pointer"
            onClick={(e) => { e.stopPropagation(); onTriggerEvent(evt.id) }}
          >
            <Play className="size-3 fill-current" />
          </button>
          </TooltipTrigger><TooltipContent>Trigger</TooltipContent></Tooltip>
        )}
        <Tooltip><TooltipTrigger asChild>
        <button
          className="p-0.5 text-[#9aa0a8] opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all cursor-pointer"
          onClick={(e) => { e.stopPropagation(); handleDeleteEvent(evt.id) }}
        >
          <Trash2Icon className="size-3" />
        </button>
        </TooltipTrigger><TooltipContent>Delete</TooltipContent></Tooltip>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-[#2b2d31] text-white">
      <Tabs defaultValue={initialTab} key={initialTab} className="flex h-full flex-col">
        <div ref={tabContainerRef} className="flex border-b border-[#1e1f22] shrink-0">
          <TabsList className="w-full bg-transparent p-0 h-auto rounded-none gap-0">
            <Tooltip><TooltipTrigger asChild><TabsTrigger value="images" className="flex-1 min-w-0 flex items-center justify-center gap-1 px-1 py-1.5 text-[9px] font-semibold rounded-none border-b-[3px] transition-all duration-200 data-[state=active]:border-red-500 data-[state=active]:text-white data-[state=active]:bg-[#3a1c1c] data-[state=active]:[&_svg]:text-red-400 data-[state=inactive]:border-transparent data-[state=inactive]:text-zinc-700 data-[state=inactive]:bg-[#1a1b1e] data-[state=inactive]:[&_svg]:text-zinc-700 data-[state=inactive]:hover:text-white data-[state=inactive]:hover:bg-[#2a2b30]">
              <ImageIcon className="size-3 shrink-0" />
              {!tabsNarrow && 'Images'}
            </TabsTrigger></TooltipTrigger><TooltipContent>Images</TooltipContent></Tooltip>
            <Tooltip><TooltipTrigger asChild><TabsTrigger value="videos" className="flex-1 min-w-0 flex items-center justify-center gap-1 px-1 py-1.5 text-[9px] font-semibold rounded-none border-b-[3px] transition-all duration-200 data-[state=active]:border-red-500 data-[state=active]:text-white data-[state=active]:bg-[#3a1c1c] data-[state=active]:[&_svg]:text-red-400 data-[state=inactive]:border-transparent data-[state=inactive]:text-zinc-700 data-[state=inactive]:bg-[#1a1b1e] data-[state=inactive]:[&_svg]:text-zinc-700 data-[state=inactive]:hover:text-white data-[state=inactive]:hover:bg-[#2a2b30]">
              <VideoIcon className="size-3 shrink-0" />
              {!tabsNarrow && 'Videos'}
            </TabsTrigger></TooltipTrigger><TooltipContent>Videos</TooltipContent></Tooltip>
            <Tooltip><TooltipTrigger asChild><TabsTrigger value="audio" className="flex-1 min-w-0 flex items-center justify-center gap-1 px-1 py-1.5 text-[9px] font-semibold rounded-none border-b-[3px] transition-all duration-200 data-[state=active]:border-red-500 data-[state=active]:text-white data-[state=active]:bg-[#3a1c1c] data-[state=active]:[&_svg]:text-red-400 data-[state=inactive]:border-transparent data-[state=inactive]:text-zinc-700 data-[state=inactive]:bg-[#1a1b1e] data-[state=inactive]:[&_svg]:text-zinc-700 data-[state=inactive]:hover:text-white data-[state=inactive]:hover:bg-[#2a2b30]">
              <Volume2 className="size-3 shrink-0" />
              {!tabsNarrow && 'Audio'}
            </TabsTrigger></TooltipTrigger><TooltipContent>Audio</TooltipContent></Tooltip>
            <Tooltip><TooltipTrigger asChild><TabsTrigger value="placed" className="flex-1 min-w-0 flex items-center justify-center gap-1 px-1 py-1.5 text-[9px] font-semibold rounded-none border-b-[3px] transition-all duration-200 data-[state=active]:border-red-500 data-[state=active]:text-white data-[state=active]:bg-[#3a1c1c] data-[state=active]:[&_svg]:text-red-400 data-[state=inactive]:border-transparent data-[state=inactive]:text-zinc-700 data-[state=inactive]:bg-[#1a1b1e] data-[state=inactive]:[&_svg]:text-zinc-700 data-[state=inactive]:hover:text-white data-[state=inactive]:hover:bg-[#2a2b30]">
              <LayersIcon className="size-3 shrink-0" />
              {!tabsNarrow && 'Layers'}
            </TabsTrigger></TooltipTrigger><TooltipContent>Layers</TooltipContent></Tooltip>
            <Tooltip><TooltipTrigger asChild><TabsTrigger value="text" className="flex-1 min-w-0 flex items-center justify-center gap-1 px-1 py-1.5 text-[9px] font-semibold rounded-none border-b-[3px] transition-all duration-200 data-[state=active]:border-red-500 data-[state=active]:text-white data-[state=active]:bg-[#3a1c1c] data-[state=active]:[&_svg]:text-red-400 data-[state=inactive]:border-transparent data-[state=inactive]:text-zinc-700 data-[state=inactive]:bg-[#1a1b1e] data-[state=inactive]:[&_svg]:text-zinc-700 data-[state=inactive]:hover:text-white data-[state=inactive]:hover:bg-[#2a2b30]">
              <svg viewBox="0 0 24 24" className="size-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>
              {!tabsNarrow && 'Text'}
            </TabsTrigger></TooltipTrigger><TooltipContent>Text</TooltipContent></Tooltip>
            <Tooltip><TooltipTrigger asChild><TabsTrigger value="shapes" className="flex-1 min-w-0 flex items-center justify-center gap-1 px-1 py-1.5 text-[9px] font-semibold rounded-none border-b-[3px] transition-all duration-200 data-[state=active]:border-red-500 data-[state=active]:text-white data-[state=active]:bg-[#3a1c1c] data-[state=active]:[&_svg]:text-red-400 data-[state=inactive]:border-transparent data-[state=inactive]:text-zinc-700 data-[state=inactive]:bg-[#1a1b1e] data-[state=inactive]:[&_svg]:text-zinc-700 data-[state=inactive]:hover:text-white data-[state=inactive]:hover:bg-[#2a2b30]">
              <svg viewBox="0 0 24 24" className="size-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>
              {!tabsNarrow && 'Shapes'}
            </TabsTrigger></TooltipTrigger><TooltipContent>Shapes</TooltipContent></Tooltip>
            <Tooltip><TooltipTrigger asChild><TabsTrigger value="events" className="flex-1 min-w-0 flex items-center justify-center gap-1 px-1 py-1.5 text-[9px] font-semibold rounded-none border-b-[3px] transition-all duration-200 data-[state=active]:border-red-500 data-[state=active]:text-white data-[state=active]:bg-[#3a1c1c] data-[state=active]:[&_svg]:text-red-400 data-[state=inactive]:border-transparent data-[state=inactive]:text-zinc-700 data-[state=inactive]:bg-[#1a1b1e] data-[state=inactive]:[&_svg]:text-zinc-700 data-[state=inactive]:hover:text-white data-[state=inactive]:hover:bg-[#2a2b30]">
              <ZapIcon className="size-3 shrink-0" />
              {!tabsNarrow && 'Events'}
            </TabsTrigger></TooltipTrigger><TooltipContent>Events</TooltipContent></Tooltip>
          </TabsList>
          {/* Grid/List toggle for assets */}
          <div className="flex items-center px-1 gap-0.5 border-b-2 border-transparent">
            <Tooltip><TooltipTrigger asChild>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded-none transition-colors ${viewMode === 'grid' ? 'text-[#9aa0a8] bg-[#35363c]' : 'text-[#9aa0a8] hover:text-white'}`}
            >
              <LayoutGrid className="size-3" />
            </button>
            </TooltipTrigger><TooltipContent>Grid view</TooltipContent></Tooltip>
            <Tooltip><TooltipTrigger asChild>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded-none transition-colors ${viewMode === 'list' ? 'text-[#9aa0a8] bg-[#35363c]' : 'text-[#9aa0a8] hover:text-white'}`}
            >
              <List className="size-3" />
            </button>
            </TooltipTrigger><TooltipContent>List view</TooltipContent></Tooltip>
          </div>
        </div>

        {/* Images Tab */}
        <TabsContent value="images" className="flex-1 overflow-y-auto px-2 pb-2 animate-[fadeIn_0.2s_ease-out]">
          <input ref={imageInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
          <Button
            variant="outline" size="sm"
            className="mt-2 w-full border-dashed border-zinc-600 bg-[#383a40] text-[#9aa0a8] hover:bg-zinc-700"
            onClick={() => imageInputRef.current?.click()} disabled={uploading}
          >
            {uploading ? <Loader2Icon className="mr-1.5 size-3.5 animate-spin" /> : <UploadIcon className="mr-1.5 size-3.5" />}
            {uploading ? 'Uploading...' : 'Upload Image'}
          </Button>
          {uploading && (
            <div className="mt-1.5 h-1 w-full rounded-none bg-[#2b2d31] overflow-hidden">
              <div className="h-1 bg-red-500 rounded-none transition-all duration-150" style={{ width: `${uploadProgress}%` }} />
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
                onClick={() => addImageToCanvas(asset)}
              >
                <img src={asset.url} alt={asset.name} className="h-full w-full object-cover pointer-events-none" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <PlusIcon className="size-5 text-white" />
                </div>
                <Tooltip><TooltipTrigger asChild>
                <button
                  className="absolute top-0.5 right-0.5 p-0.5 rounded bg-red-600/80 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 z-10"
                  onClick={(e) => { e.stopPropagation(); onDeleteLayer?.(asset.id); setImages(prev => prev.filter(a => a.id !== asset.id)) }}
                >
                  <Trash2Icon className="size-2.5" />
                </button>
                </TooltipTrigger><TooltipContent>Remove from canvas</TooltipContent></Tooltip>
                <span className="absolute bottom-0 left-0 right-0 truncate bg-black/60 px-1 py-0.5 text-[10px] text-zinc-300">{asset.name}</span>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Videos Tab */}
        <TabsContent value="videos" className="flex-1 overflow-y-auto px-2 pb-2 animate-[fadeIn_0.2s_ease-out]">
          <input ref={videoInputRef} type="file" accept="video/mp4,video/webm" multiple className="hidden" onChange={handleVideoUpload} />
          <div className="mt-2 flex gap-1">
            <Button
              variant="outline" size="sm"
              className="flex-1 border-dashed border-zinc-600 bg-[#383a40] text-[#9aa0a8] hover:bg-zinc-700"
              onClick={() => videoInputRef.current?.click()} disabled={uploading}
            >
              {uploading ? <Loader2Icon className="mr-1.5 size-3.5 animate-spin" /> : <UploadIcon className="mr-1.5 size-3.5" />}
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
            <Button
              variant="outline" size="sm"
              className={`border-zinc-600 bg-[#383a40] text-[#9aa0a8] hover:bg-zinc-700 px-2 ${showYoutubeInput ? 'border-red-500 bg-red-500/10 text-red-400' : ''}`}
              onClick={() => setShowYoutubeInput(v => !v)}
            >
              <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor"><path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 00.5 6.2 31.5 31.5 0 000 12a31.5 31.5 0 00.5 5.8 3 3 0 002.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 002.1-2.1A31.5 31.5 0 0024 12a31.5 31.5 0 00-.5-5.8zM9.5 15.6V8.4l6.3 3.6-6.3 3.6z"/></svg>
            </Button>
          </div>
          {showYoutubeInput && (
            <div className="mt-1.5 mb-2 animate-in slide-in-from-top-1 duration-200">
              <div className="flex gap-1">
                <Input
                  value={youtubeUrlInput}
                  onChange={(e) => setYoutubeUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const m = youtubeUrlInput.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
                      if (!m) return
                      const id = m[1], thumb = `https://img.youtube.com/vi/${id}/hqdefault.jpg`
                      onAddLayer({ type: 'video', name: `YouTube: ${id}`, youtubeUrl: `https://www.youtube.com/embed/${id}?autoplay=1&mute=1`, src: thumb, x: 10, y: 10, width: 40, height: 22.5, rotation: 0, opacity: 1, blendMode: 'normal', visible: true, locked: false, loop: false, autoplay: true, muted: true })
                      setVideos(prev => [...prev, { id: generateLayerId(), name: `YouTube: ${id}`, url: thumb, type: 'video' }])
                      setYoutubeUrlInput(''); setShowYoutubeInput(false)
                    }
                  }}
                  placeholder="Paste YouTube URL..."
                  className="h-6 flex-1 border-zinc-600 bg-[#1e1f22] text-[9px] text-zinc-200 placeholder:text-zinc-600"
                />
                <Button size="sm" className="h-6 px-2 bg-red-600 hover:bg-red-500 text-white text-[8px] font-bold"
                  onClick={() => {
                    const m = youtubeUrlInput.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
                    if (!m) return
                    const id = m[1], thumb = `https://img.youtube.com/vi/${id}/hqdefault.jpg`
                    onAddLayer({ type: 'video', name: `YouTube: ${id}`, youtubeUrl: `https://www.youtube.com/embed/${id}?autoplay=1&mute=1`, src: thumb, x: 10, y: 10, width: 40, height: 22.5, rotation: 0, opacity: 1, blendMode: 'normal', visible: true, locked: false, loop: false, autoplay: true, muted: true })
                    setVideos(prev => [...prev, { id: generateLayerId(), name: `YouTube: ${id}`, url: thumb, type: 'video' }])
                    setYoutubeUrlInput(''); setShowYoutubeInput(false)
                  }}
                >Add</Button>
              </div>
            </div>
          )}
          {uploading && (
            <div className="mt-1.5 h-1 w-full rounded-none bg-[#2b2d31] overflow-hidden">
              <div className="h-1 bg-red-500 rounded-none transition-all duration-150" style={{ width: `${uploadProgress}%` }} />
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
                <div className="w-8 h-6 shrink-0 rounded overflow-hidden"><VideoThumbnail src={asset.url} className="w-full h-full object-cover" /></div>
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
                onClick={() => addVideoToCanvas(asset)}
              >
                <VideoThumbnail src={asset.url} className="h-full w-full object-cover pointer-events-none" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <PlusIcon className="size-5 text-white" />
                </div>
                <Tooltip><TooltipTrigger asChild>
                <button
                  className="absolute top-0.5 right-0.5 p-0.5 rounded bg-red-600/80 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 z-10"
                  onClick={(e) => { e.stopPropagation(); onDeleteLayer?.(asset.id); setVideos(prev => prev.filter(a => a.id !== asset.id)) }}
                >
                  <Trash2Icon className="size-2.5" />
                </button>
                </TooltipTrigger><TooltipContent>Remove from canvas</TooltipContent></Tooltip>
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
                className={`flex w-full items-center gap-1.5 rounded px-1.5 py-1.5 text-left text-xs cursor-pointer transition-colors ${
                  selectedLayerId === layer.id ? 'bg-red-500/20 border-l-2 border-red-500 text-white' : 'text-zinc-300 hover:bg-zinc-800'
                } ${dragLayerIdx === idx ? 'opacity-50' : ''}`}
                onClick={() => onSelectLayer(layer.id)}
              >
                <GripVertical className="size-3 text-zinc-600 shrink-0 cursor-grab active:cursor-grabbing" />
                {typeIcon(layer.type)}
                <span className="flex-1 truncate">{layer.name}</span>
                {!layer.visible && <span className="text-[10px] text-zinc-500">hidden</span>}
                <button onClick={e => { e.stopPropagation(); onDeleteLayer?.(layer.id) }} className="p-0.5 text-zinc-600 hover:text-red-400 transition-colors shrink-0"><Trash2Icon className="size-2.5" /></button>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Audio Tab */}
        <TabsContent value="audio" className="flex-1 overflow-y-auto px-2 pb-2 animate-[fadeIn_0.2s_ease-out]">
          <input ref={audioInputRef} type="file" accept="audio/mpeg,audio/wav,audio/ogg,audio/webm,audio/mp4,audio/*" multiple className="hidden" onChange={handleAudioUpload} />
          <Button
            variant="outline" size="sm"
            className="mt-2 w-full border-dashed border-zinc-600 bg-[#383a40] text-[#9aa0a8] hover:bg-zinc-700"
            onClick={() => audioInputRef.current?.click()} disabled={uploading}
          >
            {uploading ? <Loader2Icon className="mr-1.5 size-3.5 animate-spin" /> : <UploadIcon className="mr-1.5 size-3.5" />}
            {uploading ? 'Uploading...' : 'Upload Audio'}
          </Button>
          {uploading && (
            <div className="mt-1.5 h-1 w-full rounded-none bg-[#2b2d31] overflow-hidden">
              <div className="h-1 bg-red-500 rounded-none transition-all duration-150" style={{ width: `${uploadProgress}%` }} />
            </div>
          )}
          {audios.length === 0 && <p className="mt-4 text-center text-xs text-zinc-500">No audio files uploaded yet</p>}
          <div className="mt-1.5 flex flex-col gap-0.5">
            {audios.map((asset) => (
              <div
                key={asset.id}
                className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-[#35363c] group"
              >
                <button
                  onClick={() => toggleAudioPreview(asset)}
                  className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center shrink-0 hover:bg-red-500 transition-colors"
                >
                  {playingAudioId === asset.id ? (
                    <Pause className="w-3 h-3 text-white" />
                  ) : (
                    <Play className="w-3 h-3 text-white ml-0.5" />
                  )}
                </button>
                <span className="text-[9px] text-zinc-300 truncate flex-1">{asset.name}</span>
                <Tooltip><TooltipTrigger asChild>
                <button
                  onClick={() => addAudioToCanvas(asset)}
                  className="text-zinc-600 hover:text-zinc-300 transition-colors"
                >
                  <PlusIcon className="w-3 h-3" />
                </button>
                </TooltipTrigger><TooltipContent>Add to canvas</TooltipContent></Tooltip>
                <Tooltip><TooltipTrigger asChild>
                <button
                  className="p-0.5 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setAudios(prev => prev.filter(a => a.id !== asset.id))}
                >
                  <Trash2Icon className="size-2.5" />
                </button>
                </TooltipTrigger><TooltipContent>Remove</TooltipContent></Tooltip>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Text Tab */}
        <TabsContent value="text" className="flex-1 overflow-y-auto px-2 pb-2 animate-[fadeIn_0.2s_ease-out]">
          <Button variant="outline" size="sm" className="mt-2 w-full border-dashed border-zinc-600 bg-[#383a40] text-[#9aa0a8] hover:bg-zinc-700"
            onClick={() => onAddLayer({ type: 'text', name: 'Text', text: 'Text', fontSize: 24, color: '#ffffff', x: 10, y: 10, width: 20, height: 10, rotation: 0, opacity: 1, blendMode: 'normal', visible: true, locked: false })}>
            <PlusIcon className="mr-1.5 size-3.5" /> Add Text Layer
          </Button>
          {layers.filter(l => l.type === 'text').length === 0 && <p className="mt-4 text-center text-xs text-zinc-500">No text layers yet</p>}
          <div className="mt-2 space-y-0.5">
            {layers.filter(l => l.type === 'text').map(layer => (
              <div key={layer.id} className={`group flex items-center gap-1.5 px-1.5 py-1 rounded cursor-pointer text-xs transition-colors ${selectedLayerId === layer.id ? 'bg-red-500/20 border-l-2 border-red-500 text-white' : 'text-zinc-300 hover:bg-[#35363c]'}`} onClick={() => onSelectLayer(layer.id)}>
                <span className="text-zinc-400 font-mono">T</span>
                <span className="flex-1 truncate text-zinc-300">{layer.text || layer.name}</span>
                <button onClick={e => { e.stopPropagation(); onDeleteLayer?.(layer.id) }} className="p-0.5 text-zinc-600 hover:text-red-400 transition-opacity opacity-0 group-hover:opacity-100"><Trash2Icon className="size-2.5" /></button>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Shapes Tab */}
        <TabsContent value="shapes" className="flex-1 overflow-y-auto px-2 pb-2 animate-[fadeIn_0.2s_ease-out]">
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            {[{ name: 'Rectangle', w: 20, h: 12, color: '#4a5568' }, { name: 'Circle', w: 15, h: 15, color: '#4a5568' }, { name: 'Triangle', w: 15, h: 15, color: '#4a5568' }, { name: 'Line', w: 30, h: 0.5, color: '#4a5568' }, { name: 'Polygon', w: 15, h: 15, color: '#4a5568' }].map(p => (
              <button key={p.name} onClick={() => { if (p.name === 'Polygon' && onStartPolygonDraw) { onStartPolygonDraw() } else { onAddLayer({ type: 'shape', name: p.name, color: p.color, x: 10, y: 10, width: p.w, height: p.h, rotation: 0, opacity: 1, blendMode: 'normal', visible: true, locked: false }) } }}
                className="flex flex-col items-center gap-1 py-2.5 rounded-lg border border-[#3f4147] bg-[#383a40] hover:bg-[#35363c] hover:border-zinc-500 transition-colors">
                <div className="w-5 h-5 bg-zinc-500" style={{ borderRadius: p.name === 'Circle' ? '50%' : 2, width: p.name === 'Line' ? 20 : p.name === 'Rectangle' ? 24 : undefined, height: p.name === 'Line' ? 2 : p.name === 'Rectangle' ? 14 : undefined, clipPath: p.name === 'Triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : p.name === 'Polygon' ? 'polygon(30% 0%, 70% 0%, 100% 40%, 80% 100%, 20% 100%, 0% 40%)' : undefined }} />
                <span className="text-[8px] text-zinc-400">{p.name}</span>
              </button>
            ))}
          </div>
          {layers.filter(l => l.type === 'shape').length === 0 && <p className="mt-4 text-center text-xs text-zinc-500">No shapes placed yet</p>}
          <div className="mt-2 space-y-0.5">
            {layers.filter(l => l.type === 'shape').map(layer => (
              <div key={layer.id} className={`group flex items-center gap-1.5 px-1.5 py-1 rounded cursor-pointer text-xs transition-colors ${selectedLayerId === layer.id ? 'bg-red-500/20 border-l-2 border-red-500 text-white' : 'text-zinc-300 hover:bg-[#35363c]'}`} onClick={() => onSelectLayer(layer.id)}>
                {layer.name === 'Circle' ? <div className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: layer.color || '#666' }} />
                  : layer.name === 'Triangle' ? <div className="w-4 h-4 shrink-0" style={{ backgroundColor: layer.color || '#666', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
                  : layer.name === 'Line' ? <div className="shrink-0" style={{ backgroundColor: layer.color || '#666', width: 16, height: 2 }} />
                  : <div className="w-4 h-3 rounded-sm shrink-0" style={{ backgroundColor: layer.color || '#666' }} />}
                <span className="flex-1 truncate text-zinc-300">{layer.name}</span>
                {layer.maskMode === 'mask' && <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" title="Mask" />}
                {layer.maskMode === 'multi-layer-mask' && <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" title="Multi-Mask" />}
                <button onClick={e => { e.stopPropagation(); onDeleteLayer?.(layer.id) }} className="p-0.5 text-zinc-600 hover:text-red-400 transition-colors"><Trash2Icon className="size-2.5" /></button>
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
                className="h-6 shrink-0 border-zinc-600 bg-[#2b2d31] px-2 text-[#9aa0a8] hover:bg-zinc-700"
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
                    <Tooltip><TooltipTrigger asChild>
                    <button
                      className="p-0.5 text-zinc-600 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all cursor-pointer"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <Trash2Icon className="size-2.5" />
                    </button>
                    </TooltipTrigger><TooltipContent>Delete category</TooltipContent></Tooltip>
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
