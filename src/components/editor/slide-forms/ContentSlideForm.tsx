'use client'
import { useState, useCallback, useRef } from 'react'
import type { Slide, ContentSlideContent } from '@/types/slide'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RichTextEditor } from '@/components/editor/RichTextEditor'
import { ImagePlus, X, Upload } from 'lucide-react'
import { toast } from 'sonner'

interface Props { slide: Slide; onChange: (content: Slide['content']) => void }

export function ContentSlideForm({ slide, onChange }: Props) {
  const content = slide.content as ContentSlideContent
  const [imageUrl, setImageUrl] = useState(content.image_url || '')
  const fileInputRef = useRef<HTMLInputElement>(null)

  function update(updates: Partial<ContentSlideContent>) {
    onChange({ ...content, ...updates })
  }

  const handleBodyChange = useCallback((html: string) => {
    update({ body: html })
  }, [content]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleImageUrlChange(url: string) {
    setImageUrl(url)
    update({ image_url: url })
  }

  function handleRemoveImage() {
    setImageUrl('')
    update({ image_url: '' })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-muted-foreground text-xs uppercase tracking-wide">Content</Label>
        <RichTextEditor
          content={content.body || ''}
          onChange={handleBodyChange}
          placeholder="Enter your slide content..."
        />
      </div>

      <div className="space-y-2">
        <Label className="text-muted-foreground text-xs uppercase tracking-wide">Layout</Label>
        <Select
          value={content.layout || 'text_only'}
          onValueChange={(v) => update({ layout: v as ContentSlideContent['layout'] })}
        >
          <SelectTrigger className="bg-background border-border text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text_only">Text only</SelectItem>
            <SelectItem value="image_only">Image only</SelectItem>
            <SelectItem value="text_left">Text left, image right</SelectItem>
            <SelectItem value="text_right">Image left, text right</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Image section */}
      {content.layout !== 'text_only' && (
        <div className="space-y-2">
          <Label className="text-muted-foreground text-xs uppercase tracking-wide">Image</Label>
          {imageUrl ? (
            <div className="relative group rounded-lg overflow-hidden border border-border">
              <img
                src={imageUrl}
                alt="Slide image"
                className="w-full h-32 object-cover"
                onError={() => toast.error('Failed to load image')}
              />
              <button
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
              >
                <ImagePlus className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Click to upload or paste URL below</p>
              </div>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => handleImageUrlChange(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
