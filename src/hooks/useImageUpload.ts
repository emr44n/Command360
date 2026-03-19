'use client'

import { useState, useCallback } from 'react'

interface UploadState {
  uploading: boolean
  progress: number
  error: string | null
}

interface UploadResult {
  url: string
  path: string
}

export function useImageUpload() {
  const [state, setState] = useState<UploadState>({
    uploading: false,
    progress: 0,
    error: null,
  })

  const upload = useCallback(async (file: File): Promise<UploadResult | null> => {
    setState({ uploading: true, progress: 10, error: null })

    try {
      const formData = new FormData()
      formData.append('file', file)

      setState(s => ({ ...s, progress: 30 }))

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      setState(s => ({ ...s, progress: 80 }))

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Upload failed')
      }

      const result: UploadResult = await res.json()
      setState({ uploading: false, progress: 100, error: null })
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed'
      setState({ uploading: false, progress: 0, error: message })
      return null
    }
  }, [])

  const reset = useCallback(() => {
    setState({ uploading: false, progress: 0, error: null })
  }, [])

  return { ...state, upload, reset }
}
