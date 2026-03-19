'use client'
import type { Slide, SurveyContent, SurveyQuestion, SurveyOption } from '@/types/slide'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Trash2 } from 'lucide-react'

interface Props { slide: Slide; onChange: (content: Slide['content']) => void }

export function SurveySlideForm({ slide, onChange }: Props) {
  const content = slide.content as SurveyContent

  function updateQuestion(id: string, updates: Partial<SurveyQuestion>) {
    onChange({
      ...content,
      questions: (content.questions || []).map((q) => q.id === id ? { ...q, ...updates } : q),
    })
  }

  function addQuestion() {
    const newQ: SurveyQuestion = {
      id: crypto.randomUUID(),
      text: '',
      type: 'text',
      required: false,
    }
    onChange({ ...content, questions: [...(content.questions || []), newQ] })
  }

  function removeQuestion(id: string) {
    onChange({ ...content, questions: (content.questions || []).filter((q) => q.id !== id) })
  }

  function addOption(qId: string) {
    const newOpt: SurveyOption = { id: crypto.randomUUID(), text: '' }
    const q = (content.questions || []).find((q) => q.id === qId)
    updateQuestion(qId, { options: [...(q?.options || []), newOpt] })
  }

  function updateOption(qId: string, optId: string, text: string) {
    const q = (content.questions || []).find((q) => q.id === qId)
    if (!q) return
    updateQuestion(qId, {
      options: (q.options || []).map((o) => o.id === optId ? { ...o, text } : o),
    })
  }

  return (
    <div className="space-y-4">
      <Label className="text-muted-foreground text-xs uppercase tracking-wide">Questions</Label>
      {(content.questions || []).map((q, i) => (
        <div key={q.id} className="bg-muted/50 rounded-xl p-3 space-y-3 border border-border">
          <div className="flex gap-2 items-center">
            <span className="text-muted-foreground text-xs shrink-0">{i + 1}.</span>
            <Input
              value={q.text}
              onChange={(e) => updateQuestion(q.id, { text: e.target.value })}
              placeholder="Question text"
              className="bg-background border-border text-foreground placeholder:text-muted-foreground flex-1 text-sm"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeQuestion(q.id)}
              className="text-muted-foreground hover:text-destructive px-2 shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={q.type}
              onValueChange={(v) => updateQuestion(q.id, { type: v as SurveyQuestion['type'] })}
            >
              <SelectTrigger className="bg-background border-border text-foreground text-xs h-8 flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text" className="text-xs">Text response</SelectItem>
                <SelectItem value="rating" className="text-xs">Rating scale</SelectItem>
                <SelectItem value="single_choice" className="text-xs">Single choice</SelectItem>
                <SelectItem value="multiple_choice" className="text-xs">Multiple choice</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-muted-foreground text-xs">Required</span>
              <Switch
                checked={q.required}
                onCheckedChange={(v) => updateQuestion(q.id, { required: v })}
              />
            </div>
          </div>
          {q.type === 'rating' && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-xs">Max rating:</span>
              <Select
                value={String(q.rating_max || 5)}
                onValueChange={(v) => updateQuestion(q.id, { rating_max: Number(v) })}
              >
                <SelectTrigger className="bg-background border-border text-foreground text-xs h-8 w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[3, 4, 5, 7, 10].map((n) => (
                    <SelectItem key={n} value={String(n)} className="text-xs">{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {(q.type === 'single_choice' || q.type === 'multiple_choice') && (
            <div className="space-y-1.5 pl-2">
              {(q.options || []).map((opt) => (
                <Input
                  key={opt.id}
                  value={opt.text}
                  onChange={(e) => updateOption(q.id, opt.id, e.target.value)}
                  placeholder="Option"
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground text-xs h-8"
                />
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => addOption(q.id)}
                className="gap-1 text-muted-foreground hover:text-foreground px-0 text-xs h-7"
              >
                <Plus className="w-3 h-3" />Add option
              </Button>
            </div>
          )}
        </div>
      ))}
      <Button
        variant="ghost"
        size="sm"
        onClick={addQuestion}
        className="gap-1.5 text-muted-foreground hover:text-foreground px-0"
      >
        <Plus className="w-3.5 h-3.5" />Add question
      </Button>
    </div>
  )
}
