'use client'
import { useState, useCallback, useRef } from 'react'
import type { Slide } from '@/types/slide'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RichTextEditor } from './RichTextEditor'
import { PollSlideForm } from './slide-forms/PollSlideForm'
import { WordCloudSlideForm } from './slide-forms/WordCloudSlideForm'
import { QuizSlideForm } from './slide-forms/QuizSlideForm'
import { QnASlideForm } from './slide-forms/QnASlideForm'
import { SurveySlideForm } from './slide-forms/SurveySlideForm'
import { ContentSlideForm } from './slide-forms/ContentSlideForm'
import { RatingScaleSlideForm } from './slide-forms/RatingScaleSlideForm'
import { OpenTextSlideForm } from './slide-forms/OpenTextSlideForm'
import { ImagePlus, X, ChevronDown, ChevronRight, Type, Image } from 'lucide-react'
import { toast } from 'sonner'

interface SlideSettingsProps {
  slide: Slide
  onChange: (updates: Partial<Slide>) => void
}

export function SlideSettings({ slide, onChange }: SlideSettingsProps) {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label className="text-muted-foreground text-xs uppercase tracking-wide">Slide title</Label>
        <Input
          value={slide.title || ''}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Enter slide title..."
          className="bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
        />
      </div>
      <div className="border-t border-border pt-5">
        <SlideForm slide={slide} onChange={(content) => onChange({ content })} />
      </div>

      {/* Content & Media section — for non-content slides */}
      {slide.slide_type !== 'content' && (
        <div className="border-t border-border pt-5">
          <SlideMediaSection
            content={slide.content as Record<string, unknown>}
            onChange={(updates) => onChange({ content: { ...slide.content, ...updates } })}
          />
        </div>
      )}

      <div className="border-t border-border pt-5 space-y-2">
        <Label className="text-muted-foreground text-xs uppercase tracking-wide">Speaker notes</Label>
        <Textarea
          value={slide.speaker_notes || ''}
          onChange={(e) => onChange({ speaker_notes: e.target.value })}
          placeholder="Notes only you can see during presentation..."
          rows={3}
          className="bg-background border-border text-foreground text-sm resize-none placeholder:text-muted-foreground"
        />
      </div>
    </div>
  )
}

function SlideForm({ slide, onChange }: { slide: Slide; onChange: (content: Slide['content']) => void }) {
  switch (slide.slide_type) {
    case 'poll': return <PollSlideForm slide={slide} onChange={onChange} />
    case 'word_cloud': return <WordCloudSlideForm slide={slide} onChange={onChange} />
    case 'quiz': return <QuizSlideForm slide={slide} onChange={onChange} />
    case 'qna': return <QnASlideForm slide={slide} onChange={onChange} />
    case 'survey': return <SurveySlideForm slide={slide} onChange={onChange} />
    case 'content': return <ContentSlideForm slide={slide} onChange={onChange} />
    case 'rating_scale': return <RatingScaleSlideForm slide={slide} onChange={onChange} />
    case 'open_text': return <OpenTextSlideForm slide={slide} onChange={onChange} />
    default: return null
  }
}

/* ─── Reusable Content & Media section ─── */
function SlideMediaSection({ content, onChange }: {
  content: Record<string, unknown>
  onChange: (updates: Record<string, unknown>) => void
}) {
  const [expanded, setExpanded] = useState(() => !!(content.description || content.image_url))
  const [imageUrl, setImageUrl] = useState((content.image_url as string) || '')

  const handleDescriptionChange = useCallback((html: string) => {
    onChange({ description: html })
  }, [onChange])

  function handleImageUrlChange(url: string) {
    setImageUrl(url)
    onChange({ image_url: url })
  }

  function handleRemoveImage() {
    setImageUrl('')
    onChange({ image_url: '' })
  }

  return (
    <div className="space-y-3">
      <button
        onClick={() => setExpanded(v => !v)}
        className="flex items-center gap-2 w-full text-left group"
      >
        {expanded ? (
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
        )}
        <Label className="text-muted-foreground text-xs uppercase tracking-wide cursor-pointer group-hover:text-foreground transition-colors">
          Content & Media
        </Label>
      </button>

      {expanded && (
        <div className="space-y-4 pl-1">
          {/* Rich text description */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Type className="w-3 h-3 text-muted-foreground" />
              <Label className="text-muted-foreground text-xs">Description</Label>
            </div>
            <RichTextEditor
              content={(content.description as string) || ''}
              onChange={handleDescriptionChange}
              placeholder="Add a description or rich text content..."
            />
          </div>

          {/* Image */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Image className="w-3 h-3 text-muted-foreground" />
              <Label className="text-muted-foreground text-xs">Image</Label>
            </div>
            {imageUrl ? (
              <div className="relative group rounded-lg overflow-hidden border border-border">
                <img
                  src={imageUrl}
                  alt="Slide image"
                  className="w-full h-28 object-cover"
                  onError={() => toast.error('Failed to load image')}
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-default hover:border-primary/30 transition-colors">
                  <ImagePlus className="w-6 h-6 text-muted-foreground/30 mx-auto mb-1" />
                  <p className="text-[10px] text-muted-foreground">Paste an image URL below</p>
                </div>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => handleImageUrlChange(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
