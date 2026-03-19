'use client'
import type { Slide, OpenTextContent } from '@/types/slide'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

interface Props { slide: Slide; onChange: (content: Slide['content']) => void }

export function OpenTextSlideForm({ slide, onChange }: Props) {
  const content = slide.content as OpenTextContent

  function updateContent(updates: Partial<OpenTextContent>) {
    onChange({ ...content, ...updates })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label className="text-muted-foreground text-xs uppercase tracking-wide">Placeholder text</Label>
        <Input
          value={content.placeholder}
          onChange={(e) => updateContent({ placeholder: e.target.value })}
          placeholder="Hint text shown to participants..."
          className="bg-background border-border text-foreground text-sm placeholder:text-muted-foreground"
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-muted-foreground text-xs uppercase tracking-wide">Max character length</Label>
        <Input
          type="number"
          value={content.max_length}
          onChange={(e) => updateContent({ max_length: parseInt(e.target.value) || 500 })}
          min={50}
          max={5000}
          className="bg-background border-border text-foreground text-sm w-32"
        />
      </div>
      <div className="flex items-center justify-between">
        <Label className="text-sm">Allow multiple submissions</Label>
        <Switch checked={content.allow_multiple_submissions} onCheckedChange={(v) => updateContent({ allow_multiple_submissions: v })} />
      </div>
      <div className="flex items-center justify-between">
        <Label className="text-sm">Show responses live</Label>
        <Switch checked={content.show_responses_live} onCheckedChange={(v) => updateContent({ show_responses_live: v })} />
      </div>
    </div>
  )
}
