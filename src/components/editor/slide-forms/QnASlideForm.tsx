'use client'
import type { Slide, QnAContent } from '@/types/slide'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

interface Props { slide: Slide; onChange: (content: Slide['content']) => void }

export function QnASlideForm({ slide, onChange }: Props) {
  const content = slide.content as QnAContent

  function update(updates: Partial<QnAContent>) {
    onChange({ ...content, ...updates })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm">Upvotes enabled</Label>
        <Switch
          checked={content.upvotes_enabled ?? true}
          onCheckedChange={(v) => update({ upvotes_enabled: v })}
        />
      </div>
      <div className="flex items-center justify-between">
        <Label className="text-sm">Moderation (hide by default)</Label>
        <Switch
          checked={content.moderation_enabled ?? false}
          onCheckedChange={(v) => update({ moderation_enabled: v })}
        />
      </div>
      <div className="flex items-center justify-between">
        <Label className="text-sm">Allow anonymous questions</Label>
        <Switch
          checked={content.allow_anonymous_questions ?? false}
          onCheckedChange={(v) => update({ allow_anonymous_questions: v })}
        />
      </div>
    </div>
  )
}
