'use client'
import { useState } from 'react'
import type { Slide, WordCloudContent } from '@/types/slide'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface WordCloudInputProps {
  slide: Slide
  onSubmit: (answer: Record<string, unknown>) => Promise<void>
  disabled?: boolean
}

export function WordCloudInput({ slide, onSubmit, disabled }: WordCloudInputProps) {
  const content = slide.content as WordCloudContent
  const [word, setWord] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = word.trim()
    if (!trimmed || submitting) return
    setSubmitting(true)
    await onSubmit({ word: trimmed.toLowerCase() })
    setSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {content.prompt && (
        <p className="text-muted-foreground text-center text-base">{content.prompt}</p>
      )}
      <div className="space-y-3">
        <Input
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder="Type a word..."
          maxLength={50}
          disabled={disabled || submitting}
          className="bg-background border-border text-foreground placeholder:text-muted-foreground text-center text-xl py-6 rounded-none focus-visible:ring-primary"
          autoFocus
        />
        <p className="text-muted-foreground text-xs text-center">
          {content.max_words_per_person ? `One word per submission` : 'Share your thoughts'}
        </p>
      </div>
      <Button
        type="submit"
        disabled={!word.trim() || submitting || disabled}
        className="w-full bg-[#C9241A] hover:bg-[#a81d15] text-white font-semibold py-6 rounded-none text-lg transition-all hover:shadow-lg hover:shadow-[#C9241A]/25"
      >
        {submitting ? 'Submitting...' : 'Submit'}
      </Button>
    </form>
  )
}
