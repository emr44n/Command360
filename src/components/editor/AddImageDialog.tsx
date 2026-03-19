'use client'

import { useState, useCallback, useRef } from 'react'
import { X, Link2, Image, Loader2, Upload, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useImageUpload } from '@/hooks/useImageUpload'

interface Props {
  open: boolean
  onClose: () => void
  onAdd: (url: string) => void
}

type Tab = 'url' | 'upload'

export function AddImageDialog({ open, onClose, onAdd }: Props) {
  const [tab, setTab] = useState<Tab>('upload')
  const [url, setUrl] = useState('')
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const { uploading, progress, error: uploadError, upload, reset } = useImageUpload()

  const handleUrlChange = useCallback((value: string) => {
    setUrl(value)
    setError(false)
    if (value.match(/^https?:\/\/.+\..+/)) {
      setLoading(true)
      setPreview(value)
    } else {
      setPreview(null)
    }
  }, [])

  const handleFileUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      return
    }
    reset()
    // Show local preview
    const localUrl = URL.createObjectURL(file)
    setPreview(localUrl)

    const result = await upload(file)
    if (result) {
      onAdd(result.url)
      handleClose()
    }
  }, [upload, reset, onAdd])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileUpload(file)
  }, [handleFileUpload])

  const handleAdd = useCallback(() => {
    if (!url.trim()) return
    onAdd(url.trim())
    setUrl('')
    setPreview(null)
    onClose()
  }, [url, onAdd, onClose])

  const handleClose = useCallback(() => {
    setUrl('')
    setPreview(null)
    setError(false)
    setDragOver(false)
    reset()
    onClose()
  }, [onClose, reset])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

      {/* Dialog */}
      <div className="relative bg-card border border-border rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Image className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Add Image</h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setTab('upload')}
            className={`flex-1 py-2.5 text-xs font-medium transition-colors cursor-pointer ${
              tab === 'upload'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Upload className="w-3.5 h-3.5 inline mr-1.5" />
            Upload File
          </button>
          <button
            onClick={() => setTab('url')}
            className={`flex-1 py-2.5 text-xs font-medium transition-colors cursor-pointer ${
              tab === 'url'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Link2 className="w-3.5 h-3.5 inline mr-1.5" />
            Image URL
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {tab === 'upload' ? (
            <>
              {/* Drop zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
                  dragOver
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-muted-foreground/40'
                }`}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFileUpload(file)
                    e.target.value = ''
                  }}
                />
                {uploading ? (
                  <div className="space-y-3">
                    <Loader2 className="w-8 h-8 text-primary mx-auto animate-spin" />
                    <p className="text-xs text-muted-foreground">Uploading… {progress}%</p>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden max-w-[200px] mx-auto">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground font-medium">
                      Drop image here or click to browse
                    </p>
                    <p className="text-[11px] text-muted-foreground/60 mt-1">
                      JPG, PNG, GIF, WebP, SVG — max 5 MB
                    </p>
                  </>
                )}
              </div>
              {uploadError && (
                <p className="text-xs text-destructive text-center">{uploadError}</p>
              )}
              {preview && !uploading && (
                <div className="rounded-xl border border-border overflow-hidden bg-muted/30">
                  <img src={preview} alt="Preview" className="w-full max-h-36 object-contain" />
                </div>
              )}
            </>
          ) : (
            <>
              {/* URL input */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Link2 className="w-3 h-3" />
                  Image URL
                </Label>
                <Input
                  value={url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="bg-background border-border text-foreground"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                />
              </div>

              {/* Preview */}
              {preview && (
                <div className="rounded-xl border border-border overflow-hidden bg-muted/30">
                  {loading && !error && (
                    <div className="flex items-center justify-center h-32">
                      <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
                    </div>
                  )}
                  <img
                    src={preview}
                    alt="Preview"
                    className={`w-full max-h-48 object-contain ${loading && !error ? 'hidden' : ''}`}
                    onLoad={() => { setLoading(false); setError(false) }}
                    onError={() => { setLoading(false); setError(true) }}
                  />
                  {error && (
                    <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                      <Image className="w-6 h-6 mb-1 opacity-30" />
                      <p className="text-xs">Failed to load image</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer — only for URL tab */}
        {tab === 'url' && (
          <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border bg-muted/30">
            <Button variant="outline" size="sm" onClick={handleClose} className="h-8 text-xs cursor-pointer">
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleAdd}
              disabled={!url.trim() || error}
              className="h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
            >
              Add to slide
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
