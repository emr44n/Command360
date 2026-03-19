'use client'
import type { Slide, WordCloudContent } from '@/types/slide'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Props { slide: Slide; onChange: (content: Slide['content']) => void }

export function WordCloudSlideForm({ slide, onChange }: Props) {
  const content = slide.content as WordCloudContent

  function update(updates: Partial<WordCloudContent>) {
    onChange({ ...content, ...updates })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-muted-foreground text-xs uppercase tracking-wide">Prompt</Label>
        <Input
          value={content.prompt || ''}
          onChange={(e) => update({ prompt: e.target.value })}
          placeholder="What word comes to mind?"
          className="bg-background border-border text-foreground placeholder:text-muted-foreground text-sm"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-muted-foreground text-xs uppercase tracking-wide">Max words per person</Label>
        <Select
          value={String(content.max_words_per_person || 1)}
          onValueChange={(v) => update({ max_words_per_person: Number(v) })}
        >
          <SelectTrigger className="bg-background border-border text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 5].map((n) => (
              <SelectItem key={n} value={String(n)}>{n}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center justify-between">
        <Label className="text-sm">Profanity filter</Label>
        <Switch checked={content.profanity_filter ?? true} onCheckedChange={(v) => update({ profanity_filter: v })} />
      </div>
    </div>
  )
}
