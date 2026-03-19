'use client'
import { useState, useEffect } from 'react'
import type { Slide } from '@/types/slide'
import type { QnAQuestion } from '@/types/participant'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'
import { ThumbsUp, MessageSquare } from 'lucide-react'
import { toast } from 'sonner'
import { useParticipantStore } from '@/stores/participantStore'

interface QnAInputProps {
  slide: Slide
  sessionId: string
  disabled?: boolean
}

export function QnAInput({ slide, sessionId, disabled }: QnAInputProps) {
  const [question, setQuestion] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [questions, setQuestions] = useState<QnAQuestion[]>([])
  const [upvoted, setUpvoted] = useState<Set<string>>(new Set())
  const participantId = useParticipantStore((s) => s.participantId)
  const supabase = createClient()

  useEffect(() => {
    fetchQuestions()
    const channel = supabase.channel(`qna-participant:${slide.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'qna_questions', filter: `slide_id=eq.${slide.id}` }, fetchQuestions)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [slide.id])

  async function fetchQuestions() {
    const { data } = await supabase
      .from('qna_questions')
      .select('*')
      .eq('slide_id', slide.id)
      .eq('is_hidden', false)
      .order('upvote_count', { ascending: false })
    if (data) setQuestions(data as QnAQuestion[])
  }

  async function submitQuestion(e: React.FormEvent) {
    e.preventDefault()
    const text = question.trim()
    if (!text || submitting || !participantId) return
    setSubmitting(true)
    const res = await fetch('/api/qna', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId, slide_id: slide.id, question_text: text, participant_id: participantId }),
    })
    if (res.ok) {
      setQuestion('')
      toast.success('Question submitted!')
      fetchQuestions()
    } else {
      toast.error('Failed to submit question')
    }
    setSubmitting(false)
  }

  async function handleUpvote(questionId: string) {
    if (!participantId || upvoted.has(questionId)) return
    const res = await fetch(`/api/qna/${questionId}/upvote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ participant_id: participantId }),
    })
    if (res.ok) {
      setUpvoted((prev) => new Set([...prev, questionId]))
      fetchQuestions()
    }
  }

  return (
    <div className="space-y-5">
      <form onSubmit={submitQuestion} className="space-y-3">
        <Textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask the presenter a question..."
          disabled={disabled || submitting}
          rows={3}
          className="bg-background border-border text-foreground placeholder:text-muted-foreground rounded-2xl resize-none focus-visible:ring-primary"
        />
        <Button
          type="submit"
          disabled={!question.trim() || submitting || disabled}
          className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-5 rounded-xl transition-all hover:shadow-lg hover:shadow-red-500/25"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          {submitting ? 'Submitting...' : 'Ask Question'}
        </Button>
      </form>

      {questions.length > 0 && (
        <div className="space-y-2">
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">All questions</p>
          {questions.map((q) => (
            <div key={q.id} className={`bg-card rounded-2xl p-3 border ${q.is_answered ? 'border-emerald-500/30 opacity-60' : 'border-border'}`}>
              <p className="text-foreground text-sm">{q.question_text}</p>
              <div className="flex items-center gap-2 mt-2">
                {q.is_answered && <span className="text-xs text-emerald-500">✓ Answered</span>}
                <button
                  onClick={() => handleUpvote(q.id)}
                  disabled={upvoted.has(q.id)}
                  className={`flex items-center gap-1 text-xs px-2 py-1 rounded-xl border transition-colors ${
                    upvoted.has(q.id)
                      ? 'border-primary text-primary bg-primary/10'
                      : 'border-border text-muted-foreground hover:border-primary/50'
                  }`}
                >
                  <ThumbsUp className="w-3 h-3" />
                  {q.upvote_count}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
