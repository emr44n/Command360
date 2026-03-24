'use client'

import React, { useRef, useState } from 'react'
import {
  ImageIcon,
  VideoIcon,
  LayersIcon,
  PlusIcon,
  UploadIcon,
} from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import type { StudioLayer } from '@/types/slide'
import { generateLayerId } from '@/lib/utils/studio-utils'

interface StudioGalleryProps {
  layers: StudioLayer[]
  onAddLayer: (layer: Partial<StudioLayer>) => void
  onSelectLayer: (id: string) => void
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
}: StudioGalleryProps) {
  const [images, setImages] = useState<AssetItem[]>([])
  const [videos, setVideos] = useState<AssetItem[]>([])
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

  const typeIcon = (type: StudioLayer['type']) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="size-3.5 text-blue-400" />
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
        <TabsList className="mx-2 mt-2 w-auto bg-zinc-800">
          <TabsTrigger value="images" className="gap-1 text-xs">
            <ImageIcon className="size-3.5" /> Images
          </TabsTrigger>
          <TabsTrigger value="videos" className="gap-1 text-xs">
            <VideoIcon className="size-3.5" /> Videos
          </TabsTrigger>
          <TabsTrigger value="placed" className="gap-1 text-xs">
            <LayersIcon className="size-3.5" /> Placed
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
                className="group relative aspect-video overflow-hidden rounded border border-zinc-700 bg-zinc-800 hover:border-zinc-500"
                onClick={() => addImageToCanvas(asset)}
                title={asset.name}
              >
                <img
                  src={asset.url}
                  alt={asset.name}
                  className="h-full w-full object-cover"
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
                className="group relative aspect-video overflow-hidden rounded border border-zinc-700 bg-zinc-800 hover:border-zinc-500"
                onClick={() => addVideoToCanvas(asset)}
                title={asset.name}
              >
                <video
                  src={asset.url}
                  className="h-full w-full object-cover"
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
      </Tabs>
    </div>
  )
}
