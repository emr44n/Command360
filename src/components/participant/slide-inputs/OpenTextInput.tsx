'use client'
import { useState } from 'react'
import type { Slide, OpenTextContent } from '@/types/slide'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface Props {
  slide: Slide
  onSubmit: (answer: Record<string, unknown>) => Promise<void>
  disabled?: boolean
}

export function OpenTextInput({ slide, onSubmit, disabled }: Props) {
  const content = slide.content as OpenTextContent
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const charCount = text.length
  const maxLength = content.max_length || 500
  const isNearLimit = charCount > maxLength * 0.85

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed || submitting) return
    setSubmitting(true)
    await onSubmit({ text: trimmed })
    setSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, maxLength))}
          placeholder={content.placeholder || 'Type your response here...'}
          disabled={disabled || submitting}
          rows={5}
          className="bg-background border-border text-foreground placeholder:text-muted-foreground text-base rounded-none resize-none focus-visible:ring-primary p-4"
          autoFocus
        />
        <span className={`absolute bottom-3 right-3 text-xs ${isNearLimit ? 'text-[#C9241A] font-medium' : 'text-muted-foreground/50'}`}>
          {charCount}/{maxLength}
        </span>
      </div>

      <Button
        type="submit"
        disabled={!text.trim() || submitting || disabled}
        className="w-full bg-[#C9241A] hover:bg-[#a81d15] text-white font-semibold py-6 rounded-none text-lg transition-all hover:shadow-lg hover:shadow-[#C9241A]/25"
      >
        {submitting ? 'Submitting...' : 'Submit'}
      </Button>
    </form>
  )
}
