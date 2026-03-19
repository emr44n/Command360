'use client'
import { useState, useEffect, useCallback } from 'react'
import type { Presentation } from '@/types/session'
import type { Slide } from '@/types/slide'

export function usePresentation(presentationId: string) {
  const [presentation, setPresentation] = useState<Presentation | null>(null)
  const [slides, setSlides] = useState<Slide[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPresentation = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/presentations/${presentationId}`)
      if (!res.ok) throw new Error('Failed to fetch presentation')
      const data = await res.json()
      setPresentation(data.presentation)
      setSlides((data.presentation.slides || []).sort((a: Slide, b: Slide) => a.position - b.position))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [presentationId])

  useEffect(() => {
    fetchPresentation()
  }, [fetchPresentation])

  return { presentation, slides, loading, error, refetch: fetchPresentation }
}
