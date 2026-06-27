'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Slide } from '@/types/slide'
import type { Session } from '@/types/session'
import type { QnAQuestion } from '@/types/participant'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { QnAContent } from '@/types/slide'
import { Sparkles, CheckCircle2, ThumbsUp, EyeOff, Eye, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'

export function QnADisplay({ slide, session }: { slide: Slide; session: Session }) {
  const [questions, setQuestions] = useState<QnAQuestion[]>([])
  const [pendingQuestions, setPendingQuestions] = useState<QnAQuestion[]>([])
  const [suggestingFor, setSuggestingFor] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<Record<string, string>>({})
  const supabase = createClient()
  const content = slide.content as QnAContent
  const moderationEnabled = content.moderation_enabled ?? false

  useEffect(() => {
    fetchQuestions()
    if (moderationEnabled) fetchPendingQuestions()
    const channel = supabase.channel(`qna:${slide.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'qna_questions', filter: `slide_id=eq.${slide.id}` }, () => {
        fetchQuestions()
        if (moderationEnabled) fetchPendingQuestions()
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'qna_upvotes' }, fetchQuestions)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [slide.id])

  async function fetchQuestions() {
    const { data } = await supabase
      .from('qna_questions')
      .select('*, qna_upvotes(count)')
      .eq('slide_id', slide.id)
      .eq('is_hidden', false)
      .order('upvote_count', { ascending: false })
    if (data) setQuestions(data as QnAQuestion[])
  }

  async function fetchPendingQuestions() {
    const { data } = await supabase
      .from('qna_questions')
      .select('*')
      .eq('slide_id', slide.id)
      .eq('is_hidden', true)
      .eq('is_answered', false)
      .order('created_at', { ascending: true })
    if (data) setPendingQuestions(data as QnAQuestion[])
  }

  async function approveQuestion(questionId: string) {
    await supabase.from('qna_questions').update({ is_hidden: false }).eq('id', questionId)
    toast.success('Question approved')
  }

  async function markAnswered(questionId: string) {
    await supabase.from('qna_questions').update({ is_answered: true }).eq('id', questionId)
    toast.success('Marked as answered')
  }

  async function hideQuestion(questionId: string) {
    await supabase.from('qna_questions').update({ is_hidden: true }).eq('id', questionId)
    toast.success('Question hidden')
  }

  async function suggestAnswer(question: QnAQuestion) {
    setSuggestingFor(question.id)
    setSuggestions((prev) => ({ ...prev, [question.id]: '' }))
    const res = await fetch('/api/ai/suggest-answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: question.question_text }),
    })
    if (!res.body) { setSuggestingFor(null); return }
    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      setSuggestions((prev) => ({ ...prev, [question.id]: (prev[question.id] || '') + decoder.decode(value) }))
    }
    setSuggestingFor(null)
  }

  if (questions.length === 0 && pendingQuestions.length === 0) {
    return <p className="text-muted-foreground text-sm">No questions yet. Waiting for participants...</p>
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
      {/* Moderation queue */}
      {moderationEnabled && pendingQuestions.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-4 h-4 text-[#c98a2a]" />
            <span className="text-xs font-medium text-[#c98a2a] uppercase tracking-wide">Pending Approval ({pendingQuestions.length})</span>
          </div>
          <div className="space-y-2">
            {pendingQuestions.map((q) => (
              <div key={q.id} className="bg-[#c98a2a]/5 rounded-none p-3 border border-[#c98a2a]/20">
                <p className="text-foreground text-sm">{q.question_text}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Button size="sm" variant="ghost" onClick={() => approveQuestion(q.id)}
                    className="gap-1.5 text-[#2E9E63] hover:text-[#2E9E63]/80 text-xs h-7 px-2">
                    <Eye className="w-3 h-3" />Approve
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => hideQuestion(q.id)}
                    className="gap-1.5 text-[#C9241A] hover:text-[#C9241A]/80 text-xs h-7 px-2">
                    <EyeOff className="w-3 h-3" />Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {questions.length > 0 && <div className="border-t border-border mt-4 pt-2" />}
        </div>
      )}
      {questions.map((q) => (
        <div key={q.id} className={`bg-muted/50 rounded-none p-4 border ${q.is_answered ? 'border-[#2E9E63]/50 opacity-60' : 'border-border'}`}>
          <div className="flex items-start justify-between gap-3">
            <p className="text-foreground text-sm flex-1">{q.question_text}</p>
            <div className="flex items-center gap-1 shrink-0">
              <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted rounded-none px-2 py-0.5">
                <ThumbsUp className="w-3 h-3" />
                {q.upvote_count}
              </span>
              {q.is_answered && <Badge variant="secondary" className="text-xs bg-[#2E9E63] text-white">Answered</Badge>}
            </div>
          </div>
          {suggestions[q.id] && (
            <div className="mt-3 bg-primary/10 border border-primary/20 rounded-none p-3 text-sm text-foreground">
              <div className="flex items-center gap-1.5 text-xs text-primary mb-1.5">
                <Sparkles className="w-3 h-3" />AI Suggestion
              </div>
              {suggestions[q.id]}
            </div>
          )}
          {!q.is_answered && (
            <div className="flex items-center gap-2 mt-3">
              <Button size="sm" variant="ghost" onClick={() => suggestAnswer(q)}
                disabled={suggestingFor === q.id}
                className="gap-1.5 text-primary hover:text-primary/80 text-xs h-7 px-2">
                <Sparkles className="w-3 h-3" />
                {suggestingFor === q.id ? 'Thinking...' : 'AI Suggest'}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => markAnswered(q.id)}
                className="gap-1.5 text-[#2E9E63] hover:text-[#2E9E63]/80 text-xs h-7 px-2">
                <CheckCircle2 className="w-3 h-3" />Mark Answered
              </Button>
              <Button size="sm" variant="ghost" onClick={() => hideQuestion(q.id)}
                className="gap-1.5 text-muted-foreground hover:text-foreground text-xs h-7 px-2">
                <EyeOff className="w-3 h-3" />Hide
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
