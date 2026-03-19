'use client'
import type { Slide, RatingScaleContent } from '@/types/slide'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

interface Props { slide: Slide; onChange: (content: Slide['content']) => void }

export function RatingScaleSlideForm({ slide, onChange }: Props) {
  const content = slide.content as RatingScaleContent

  function updateContent(updates: Partial<RatingScaleContent>) {
    onChange({ ...content, ...updates })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-muted-foreground text-xs uppercase tracking-wide">Min value</Label>
          <Input
            type="number"
            value={content.min_value}
            onChange={(e) => updateContent({ min_value: parseInt(e.target.value) || 0 })}
            className="bg-background border-border text-foreground text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-muted-foreground text-xs uppercase tracking-wide">Max value</Label>
          <Input
            type="number"
            value={content.max_value}
            onChange={(e) => updateContent({ max_value: parseInt(e.target.value) || 10 })}
            className="bg-background border-border text-foreground text-sm"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-muted-foreground text-xs uppercase tracking-wide">Min label</Label>
          <Input
            value={content.min_label}
            onChange={(e) => updateContent({ min_label: e.target.value })}
            placeholder="e.g. Not at all"
            className="bg-background border-border text-foreground text-sm placeholder:text-muted-foreground"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-muted-foreground text-xs uppercase tracking-wide">Max label</Label>
          <Input
            value={content.max_label}
            onChange={(e) => updateContent({ max_label: e.target.value })}
            placeholder="e.g. Completely"
            className="bg-background border-border text-foreground text-sm placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-muted-foreground text-xs uppercase tracking-wide">Step size</Label>
        <Input
          type="number"
          value={content.step}
          onChange={(e) => updateContent({ step: parseInt(e.target.value) || 1 })}
          min={1}
          className="bg-background border-border text-foreground text-sm w-24"
        />
      </div>
      <div className="flex items-center justify-between">
        <Label className="text-sm">Show average result</Label>
        <Switch checked={content.show_average} onCheckedChange={(v) => updateContent({ show_average: v })} />
      </div>
    </div>
  )
}
