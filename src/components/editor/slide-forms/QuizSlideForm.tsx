'use client'
import type { Slide, QuizContent, QuizOption } from '@/types/slide'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react'

interface Props { slide: Slide; onChange: (content: Slide['content']) => void }

export function QuizSlideForm({ slide, onChange }: Props) {
  const content = slide.content as QuizContent

  function update(updates: Partial<QuizContent>) {
    onChange({ ...content, ...updates })
  }

  function addOption() {
    const newOption: QuizOption = { id: crypto.randomUUID(), text: '', is_correct: false }
    update({ options: [...(content.options || []), newOption] })
  }

  function updateOption(id: string, changes: Partial<QuizOption>) {
    let options = (content.options || []).map((o) => o.id === id ? { ...o, ...changes } : o)
    // Ensure only one correct answer
    if (changes.is_correct) {
      options = options.map((o) => ({ ...o, is_correct: o.id === id }))
    }
    update({ options })
  }

  function removeOption(id: string) {
    update({ options: (content.options || []).filter((o) => o.id !== id) })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-muted-foreground text-xs uppercase tracking-wide">Options (click circle to mark correct)</Label>
        <div className="space-y-2">
          {(content.options || []).map((opt) => (
            <div key={opt.id} className="flex gap-2 items-center">
              <button
                type="button"
                onClick={() => updateOption(opt.id, { is_correct: true })}
                className="shrink-0"
              >
                {opt.is_correct
                  ? <CheckCircle2 className="w-5 h-5 text-emerald-500 dash-light:text-[#157045]" />
                  : <Circle className="w-5 h-5 text-muted-foreground hover:text-foreground" />}
              </button>
              <Input
                value={opt.text}
                onChange={(e) => updateOption(opt.id, { text: e.target.value })}
                placeholder="Option text"
                className={`bg-background border-border text-foreground placeholder:text-muted-foreground flex-1 text-sm ${opt.is_correct ? 'border-emerald-500' : ''}`}
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
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-muted-foreground text-xs">Time limit</Label>
          <Select
            value={String(content.time_limit_seconds || 30)}
            onValueChange={(v) => update({ time_limit_seconds: Number(v) })}
          >
            <SelectTrigger className="bg-background border-border text-foreground text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 15, 20, 30, 45, 60, 90, 120].map((n) => (
                <SelectItem key={n} value={String(n)}>{n}s</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-muted-foreground text-xs">Points</Label>
          <Select
            value={String(content.points || 1000)}
            onValueChange={(v) => update({ points: Number(v) })}
          >
            <SelectTrigger className="bg-background border-border text-foreground text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[100, 250, 500, 1000, 2000].map((n) => (
                <SelectItem key={n} value={String(n)}>{n}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-muted-foreground text-xs uppercase tracking-wide">Explanation (shown after)</Label>
        <Textarea
          value={content.explanation || ''}
          onChange={(e) => update({ explanation: e.target.value })}
          placeholder="Explain the correct answer..."
          rows={2}
          className="bg-background border-border text-foreground placeholder:text-muted-foreground text-sm resize-none"
        />
      </div>
    </div>
  )
}
