'use client'
import type { Slide, PollContent, PollOption } from '@/types/slide'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'

interface Props { slide: Slide; onChange: (content: Slide['content']) => void }

export function PollSlideForm({ slide, onChange }: Props) {
  const content = slide.content as PollContent

  function updateContent(updates: Partial<PollContent>) {
    onChange({ ...content, ...updates })
  }

  function addOption() {
    const newOption: PollOption = { id: crypto.randomUUID(), text: '' }
    updateContent({ options: [...(content.options || []), newOption] })
  }

  function updateOption(id: string, text: string) {
    updateContent({
      options: (content.options || []).map((o) => o.id === id ? { ...o, text } : o),
    })
  }

  function removeOption(id: string) {
    updateContent({ options: (content.options || []).filter((o) => o.id !== id) })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-muted-foreground text-xs uppercase tracking-wide">Options</Label>
        <div className="space-y-2">
          {(content.options || []).map((opt) => (
            <div key={opt.id} className="flex gap-2">
              <Input
                value={opt.text}
                onChange={(e) => updateOption(opt.id, e.target.value)}
                placeholder="Option text"
                className="bg-background border-border text-foreground placeholder:text-muted-foreground flex-1 text-sm"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeOption(opt.id)}
                disabled={(content.options || []).length <= 2}
                className="text-muted-foreground hover:text-destructive px-2"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
        </div>
        <Button variant="ghost" size="sm" onClick={addOption} className="gap-1.5 text-muted-foreground hover:text-foreground px-0">
          <Plus className="w-3.5 h-3.5" />Add option
        </Button>
      </div>
      <div className="flex items-center justify-between">
        <Label className="text-sm">Allow multiple answers</Label>
        <Switch checked={content.allow_multiple} onCheckedChange={(v) => updateContent({ allow_multiple: v })} />
      </div>
      <div className="flex items-center justify-between">
        <Label className="text-sm">Show results immediately</Label>
        <Switch checked={content.show_results_immediately} onCheckedChange={(v) => updateContent({ show_results_immediately: v })} />
      </div>
    </div>
  )
}
