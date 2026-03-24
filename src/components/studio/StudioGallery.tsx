'use client'

import React, { useRef, useState } from 'react'
import {
  ImageIcon,
  VideoIcon,
  LayersIcon,
  PlusIcon,
  UploadIcon,
  CalendarIcon,
  Trash2Icon,
  ZapIcon,
} from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { StudioLayer, StudioTimelineEvent } from '@/types/slide'
import { generateLayerId } from '@/lib/utils/studio-utils'

interface StudioGalleryProps {
  layers: StudioLayer[]
  onAddLayer: (layer: Partial<StudioLayer>) => void
  onSelectLayer: (id: string) => void
  timelineEvents?: StudioTimelineEvent[]
  onAddTimelineEvent?: (event: Omit<StudioTimelineEvent, 'id'>) => void
  onRemoveTimelineEvent?: (eventId: string) => void
}

interface AssetItem {
  id: string
  name: string
  url: string
  type: 'image' | 'video'
}

export function StudioGallery({
  layers,
  onAddLayer,
  onSelectLayer,
  timelineEvents = [],
  onAddTimelineEvent,
  onRemoveTimelineEvent,
}: StudioGalleryProps) {
  const [images, setImages] = useState<AssetItem[]>([])
  const [videos, setVideos] = useState<AssetItem[]>([])
  const [newEventName, setNewEventName] = useState('')
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file)
      const asset: AssetItem = {
        id: generateLayerId(),
        name: file.name,
        url,
        type: 'image',
      }
      setImages((prev) => [...prev, asset])
    })
    // Reset so the same file can be re-uploaded
    e.target.value = ''
  }

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file)
      const asset: AssetItem = {
        id: generateLayerId(),
        name: file.name,
        url,
        type: 'video',
      }
      setVideos((prev) => [...prev, asset])
    })
    e.target.value = ''
  }

  // Drag start handler for assets
  const handleAssetDragStart = (
    e: React.DragEvent<HTMLButtonElement>,
    asset: AssetItem
  ) => {
    e.dataTransfer.setData('studio/asset-type', asset.type)
    e.dataTransfer.setData('studio/asset-src', asset.url)
    e.dataTransfer.effectAllowed = 'copy'
  }

  // Click-to-add still works as fallback
  const addImageToCanvas = (asset: AssetItem) => {
    onAddLayer({
      id: generateLayerId(),
      name: asset.name,
      type: 'image',
      src: asset.url,
      x: 10,
      y: 10,
      width: 30,
      height: 30,
      rotation: 0,
      opacity: 1,
      blendMode: 'normal',
      visible: true,
      locked: false,
    })
  }

  const addVideoToCanvas = (asset: AssetItem) => {
    onAddLayer({
      id: generateLayerId(),
      name: asset.name,
      type: 'video',
      src: asset.url,
      x: 10,
      y: 10,
      width: 40,
      height: 30,
      rotation: 0,
      opacity: 1,
      blendMode: 'normal',
      visible: true,
      locked: false,
      loop: true,
      autoplay: true,
      muted: true,
    })
  }

  const handleAddEvent = () => {
    if (!newEventName.trim() || !onAddTimelineEvent) return
    onAddTimelineEvent({
      name: newEventName.trim(),
      color: '#6366f1',
      timelinePosition: 0,
      duration: 2000,
      trigger: 'manual',
    })
    setNewEventName('')
  }

  const typeIcon = (type: StudioLayer['type']) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="size-3.5 text-red-400" />
      case 'video':
        return <VideoIcon className="size-3.5 text-purple-400" />
      case 'text':
        return <span className="text-xs font-bold text-amber-400">T</span>
      case 'shape':
        return <span className="text-xs text-emerald-400">&#9632;</span>
      default:
        return null
    }
  }

  return (
    <div className="flex h-full flex-col bg-zinc-900 text-zinc-100">
      <Tabs defaultValue="images" className="flex h-full flex-col">
        <TabsList className="mx-2 mt-2 w-auto bg-zinc-800 grid grid-cols-4 gap-0 p-0.5">
          <TabsTrigger value="images" className="px-0 py-1.5 text-xs" title="Images">
            <ImageIcon className="size-3.5" />
          </TabsTrigger>
          <TabsTrigger value="videos" className="px-0 py-1.5 text-xs" title="Videos">
            <VideoIcon className="size-3.5" />
          </TabsTrigger>
          <TabsTrigger value="placed" className="px-0 py-1.5 text-xs" title="Placed Layers">
            <LayersIcon className="size-3.5" />
          </TabsTrigger>
          <TabsTrigger value="events" className="px-0 py-1.5 text-xs" title="Events">
            <ZapIcon className="size-3.5" />
          </TabsTrigger>
        </TabsList>

        {/* Images Tab */}
        <TabsContent value="images" className="flex-1 overflow-y-auto px-2 pb-2">
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageUpload}
          />
          <Button
            variant="outline"
            size="sm"
            className="mt-2 w-full border-dashed border-zinc-600 bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            onClick={() => imageInputRef.current?.click()}
          >
            <UploadIcon className="mr-1.5 size-3.5" /> Upload Image
          </Button>

          {images.length === 0 && (
            <p className="mt-4 text-center text-xs text-zinc-500">
              No images uploaded yet
            </p>
          )}

          <div className="mt-2 grid grid-cols-2 gap-1.5">
            {images.map((asset) => (
              <button
                key={asset.id}
                className="group relative aspect-video overflow-hidden rounded border border-zinc-700 bg-zinc-800 hover:border-zinc-500 cursor-grab active:cursor-grabbing"
                draggable
                onDragStart={(e) => handleAssetDragStart(e, asset)}
                onClick={() => addImageToCanvas(asset)}
                title={`${asset.name} — drag to canvas or click to add`}
              >
                <img
                  src={asset.url}
                  alt={asset.name}
                  className="h-full w-full object-cover pointer-events-none"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <PlusIcon className="size-5 text-white" />
                </div>
                <span className="absolute bottom-0 left-0 right-0 truncate bg-black/60 px-1 py-0.5 text-[10px] text-zinc-300">
                  {asset.name}
                </span>
              </button>
            ))}
          </div>
        </TabsContent>

        {/* Videos Tab */}
        <TabsContent value="videos" className="flex-1 overflow-y-auto px-2 pb-2">
          <input
            ref={videoInputRef}
            type="file"
            accept="video/mp4,video/webm"
            multiple
            className="hidden"
            onChange={handleVideoUpload}
          />
          <Button
            variant="outline"
            size="sm"
            className="mt-2 w-full border-dashed border-zinc-600 bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            onClick={() => videoInputRef.current?.click()}
          >
            <UploadIcon className="mr-1.5 size-3.5" /> Upload Video
          </Button>

          {videos.length === 0 && (
            <p className="mt-4 text-center text-xs text-zinc-500">
              No videos uploaded yet
            </p>
          )}

          <div className="mt-2 grid grid-cols-2 gap-1.5">
            {videos.map((asset) => (
              <button
                key={asset.id}
                className="group relative aspect-video overflow-hidden rounded border border-zinc-700 bg-zinc-800 hover:border-zinc-500 cursor-grab active:cursor-grabbing"
                draggable
                onDragStart={(e) => handleAssetDragStart(e, asset)}
                onClick={() => addVideoToCanvas(asset)}
                title={`${asset.name} — drag to canvas or click to add`}
              >
                <video
                  src={asset.url}
                  className="h-full w-full object-cover pointer-events-none"
                  muted
                  playsInline
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <PlusIcon className="size-5 text-white" />
                </div>
                <span className="absolute bottom-0 left-0 right-0 truncate bg-black/60 px-1 py-0.5 text-[10px] text-zinc-300">
                  {asset.name}
                </span>
              </button>
            ))}
          </div>
        </TabsContent>

        {/* Placed Items Tab */}
        <TabsContent value="placed" className="flex-1 overflow-y-auto px-2 pb-2">
          {layers.length === 0 && (
            <p className="mt-4 text-center text-xs text-zinc-500">
              No layers placed yet
            </p>
          )}

          <div className="mt-2 space-y-1">
            {layers.map((layer) => (
              <button
                key={layer.id}
                className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs hover:bg-zinc-800"
                onClick={() => onSelectLayer(layer.id)}
              >
                {typeIcon(layer.type)}
                <span className="flex-1 truncate">{layer.name}</span>
                {!layer.visible && (
                  <span className="text-[10px] text-zinc-500">hidden</span>
                )}
              </button>
            ))}
          </div>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="flex-1 overflow-y-auto px-2 pb-2">
          <div className="mt-2 space-y-2">
            {/* Add new event */}
            <div className="flex gap-1.5">
              <Input
                value={newEventName}
                onChange={(e) => setNewEventName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddEvent()
                }}
                placeholder="Event name..."
                className="h-7 flex-1 border-zinc-700 bg-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-500"
              />
              <Button
                variant="outline"
                size="sm"
                className="h-7 shrink-0 border-zinc-600 bg-zinc-800 px-2 text-zinc-300 hover:bg-zinc-700"
                onClick={handleAddEvent}
                disabled={!newEventName.trim()}
              >
                <PlusIcon className="size-3.5" />
              </Button>
            </div>

            {timelineEvents.length === 0 && (
              <p className="mt-4 text-center text-xs text-zinc-500">
                No timeline events yet
              </p>
            )}

            {/* Event list */}
            <div className="space-y-1">
              {timelineEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="flex items-center gap-2 rounded px-2 py-1.5 text-xs hover:bg-zinc-800 group"
                >
                  <div
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: evt.color || '#6366f1' }}
                  />
                  <span className="flex-1 truncate">{evt.name}</span>
                  <span className="text-[10px] text-zinc-500">
                    {evt.trigger === 'vote' ? 'vote' : 'manual'}
                  </span>
                  <span className="text-[10px] text-zinc-600">
                    {Math.round(evt.timelinePosition / 1000)}s
                  </span>
                  {onRemoveTimelineEvent && (
                    <button
                      className="p-0.5 text-zinc-600 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all"
                      onClick={() => onRemoveTimelineEvent(evt.id)}
                      title="Remove event"
                    >
                      <Trash2Icon className="size-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
