'use client'
import { useState, useCallback } from 'react'

interface SubmitResponseOptions {
  sessionId: string
  slideId: string
  participantId: string
  clientToken: string
  answer: Record<string, unknown>
}

export function useResponses() {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitResponse = useCallback(async (opts: SubmitResponseOptions) => {
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: opts.sessionId,
          slide_id: opts.slideId,
          participant_id: opts.participantId,
          client_token: opts.clientToken,
          answer: opts.answer,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to submit response')
        return null
      }
      return data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Network error'
      setError(message)
      return null
    } finally {
      setSubmitting(false)
    }
  }, [])

  return { submitResponse, submitting, error }
}
