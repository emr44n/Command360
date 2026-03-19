'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { Slide } from '@/types/slide'
import type { SlideType } from '@/types/slide'
import { SlideList } from './SlideList'
import { SlideCanvas } from './SlideCanvas'
import { SlideSettings } from './SlideSettings'
import { SlideTypeSelector } from './SlideTypeSelector'
import { ElementSettings } from './ElementSettings'
import { AddImageDialog } from './AddImageDialog'
import type { CanvasElement } from '@/types/slide'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Plus, Play, ArrowLeft, BarChart2, Check, Loader2, AlertCircle,
  Eye, Monitor, Smartphone, Tablet, Copy, Undo2, Redo2,
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  Maximize2, StickyNote, QrCode, Type, ImageIcon,
  Download, Upload, Save, FolderOpen, FilePlus, Clock,
  MoreHorizontal, FileDown,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface Presentation {
  id: string
  title: string
  description?: string
}

interface SlideEditorProps {
  presentation: Presentation
  initialSlides: Slide[]
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'
type DevicePreview = 'desktop' | 'tablet' | 'phone'

export function SlideEditor({ presentation, initialSlides }: SlideEditorProps) {
  const [slides, setSlides] = useState<Slide[]>(initialSlides)
  const [selectedSlideId, setSelectedSlideId] = useState<string | null>(initialSlides[0]?.id || null)
  const [showTypeSelector, setShowTypeSelector] = useState(false)
  const [presentationTitle, setPresentationTitle] = useState(presentation.title)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [starting, setStarting] = useState(false)
  const [devicePreview, setDevicePreview] = useState<DevicePreview>('desktop')
  const [settingsOpen, setSettingsOpen] = useState(true)
  const [slideListOpen, setSlideListOpen] = useState(true)
  const [notesOpen, setNotesOpen] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null)
  const [showAddImageDialog, setShowAddImageDialog] = useState(false)
  const [showFileMenu, setShowFileMenu] = useState(false)
  const [slideListWidth, setSlideListWidth] = useState(220)
  const fileMenuRef = useRef<HTMLDivElement>(null)
  const importInputRef = useRef<HTMLInputElement>(null)
  const splitterDragging = useRef(false)
  const router = useRouter()

  // Debounce refs
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const titleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingUpdatesRef = useRef<Record<string, Partial<Slide>>>({})

  // Undo/redo
  const [undoStack, setUndoStack] = useState<Slide[][]>([])
  const [redoStack, setRedoStack] = useState<Slide[][]>([])

  const selectedSlide = slides.find((s) => s.id === selectedSlideId) || null
  const selectedIndex = slides.findIndex((s) => s.id === selectedSlideId)

  // Helper to get canvas elements from current slide
  function getCanvasElements(): CanvasElement[] {
    if (!selectedSlide) return []
    return ((selectedSlide.content as Record<string, unknown>)?._canvas_elements as CanvasElement[]) || []
  }

  // handleAddTextElement and handleAddImageElement are defined after handleSlideChange below

  // Clear saved indicator after delay
  useEffect(() => {
    if (saveStatus === 'saved') {
      const t = setTimeout(() => setSaveStatus('idle'), 2000)
      return () => clearTimeout(t)
    }
  }, [saveStatus])

  // Flush pending saves on unmount
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
      if (titleTimerRef.current) clearTimeout(titleTimerRef.current)
    }
  }, [])

  // Close file menu on outside click
  useEffect(() => {
    if (!showFileMenu) return
    function onClick(e: MouseEvent) {
      if (fileMenuRef.current && !fileMenuRef.current.contains(e.target as Node)) {
        setShowFileMenu(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [showFileMenu])

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault()
        flushSaves()
        toast.success('Saved')
      } else if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        handleUndo()
      } else if (e.ctrlKey && e.key === 'z' && e.shiftKey) {
        e.preventDefault()
        handleRedo()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  function handleUndo() {
    if (undoStack.length === 0) return
    const prev = undoStack[undoStack.length - 1]
    setRedoStack((s) => [...s, slides])
    setUndoStack((s) => s.slice(0, -1))
    setSlides(prev)
  }

  function handleRedo() {
    if (redoStack.length === 0) return
    const next = redoStack[redoStack.length - 1]
    setUndoStack((s) => [...s, slides])
    setRedoStack((s) => s.slice(0, -1))
    setSlides(next)
  }

  function pushUndo() {
    setUndoStack((s) => [...s.slice(-19), slides])
    setRedoStack([])
  }

  const flushSaves = useCallback(async () => {
    const pending = { ...pendingUpdatesRef.current }
    pendingUpdatesRef.current = {}
    const entries = Object.entries(pending)
    if (entries.length === 0) return true

    setSaveStatus('saving')

    const results = await Promise.all(
      entries.map(([slideId, updates]) => {
        const cleanUpdates = { ...updates }
        if ('speaker_notes' in cleanUpdates) {
          delete (cleanUpdates as Record<string, unknown>)['speaker_notes']
          if (Object.keys(cleanUpdates).length === 0) return Promise.resolve(true)
        }
        return fetch(`/api/slides/${slideId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cleanUpdates),
        }).then((r) => r.ok)
      })
    )

    const allOk = results.every(Boolean)
    setSaveStatus(allOk ? 'saved' : 'error')
    if (!allOk) toast.error('Some changes failed to save')
    return allOk
  }, [])

  const handleAddSlide = useCallback(async (type: SlideType) => {
    pushUndo()
    const position = slides.length
    setSaveStatus('saving')
    const res = await fetch('/api/slides', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ presentation_id: presentation.id, slide_type: type, position, title: '' }),
    })
    if (res.ok) {
      const data = await res.json()
      setSlides((prev) => [...prev, data.slide])
      setSelectedSlideId(data.slide.id)
      setSaveStatus('saved')
      toast.success('Slide added')
    } else {
      setSaveStatus('error')
      const errData = await res.json().catch(() => ({}))
      if (errData.migration_needed && errData.dashboard_url) {
        toast.error(
          `"${type}" slide type needs a database migration. Open the Supabase SQL Editor and run the migration SQL.`,
          {
            duration: 10000,
            action: {
              label: 'Open SQL Editor',
              onClick: () => window.open(errData.dashboard_url, '_blank'),
            },
          }
        )
      } else {
        toast.error(errData.error || 'Failed to add slide')
      }
    }
  }, [slides.length, presentation.id])

  const handleDuplicateSlide = useCallback(async () => {
    if (!selectedSlide) return
    const originalIndex = slides.findIndex(s => s.id === selectedSlide.id)
    const insertPosition = originalIndex + 1
    pushUndo()
    setSaveStatus('saving')
    const res = await fetch('/api/slides', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        presentation_id: presentation.id,
        slide_type: selectedSlide.slide_type,
        position: insertPosition,
        title: `${selectedSlide.title} (copy)`,
        content: selectedSlide.content,
      }),
    })
    if (res.ok) {
      const data = await res.json()
      setSlides((prev) => {
        const next = [...prev]
        next.splice(insertPosition, 0, data.slide)
        return next
      })
      setSelectedSlideId(data.slide.id)
      setSaveStatus('saved')
      toast.success('Slide duplicated')
    } else {
      setSaveStatus('error')
      toast.error('Failed to duplicate slide')
    }
  }, [selectedSlide, slides, presentation.id])

  const handleDuplicateSlideById = useCallback(async (id: string) => {
    const originalIndex = slides.findIndex(s => s.id === id)
    const slide = slides[originalIndex]
    if (!slide) return
    const insertPosition = originalIndex + 1
    pushUndo()
    setSaveStatus('saving')
    const res = await fetch('/api/slides', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        presentation_id: presentation.id,
        slide_type: slide.slide_type,
        position: insertPosition,
        title: `${slide.title} (copy)`,
        content: slide.content,
      }),
    })
    if (res.ok) {
      const data = await res.json()
      setSlides((prev) => {
        const next = [...prev]
        next.splice(insertPosition, 0, data.slide)
        return next
      })
      setSelectedSlideId(data.slide.id)
      setSaveStatus('saved')
      toast.success('Slide duplicated')
    } else {
      setSaveStatus('error')
      toast.error('Failed to duplicate slide')
    }
  }, [slides, presentation.id])

  const handleDeleteSlide = useCallback(async (id: string) => {
    if (!confirm('Delete this slide?')) return
    pushUndo()
    setSaveStatus('saving')
    const res = await fetch(`/api/slides/${id}`, { method: 'DELETE' })
    if (res.ok) {
      delete pendingUpdatesRef.current[id]
      setSlides((prev) => {
        const next = prev.filter((s) => s.id !== id)
        if (selectedSlideId === id) setSelectedSlideId(next[0]?.id || null)
        return next
      })
      setSaveStatus('saved')
      toast.success('Slide deleted')
    } else {
      setSaveStatus('error')
      toast.error('Failed to delete slide')
    }
  }, [selectedSlideId])

  const handleSlideChange = useCallback((updates: Partial<Slide>) => {
    if (!selectedSlideId) return

    setSlides((prev) => prev.map((s) => s.id === selectedSlideId ? { ...s, ...updates } : s))

    pendingUpdatesRef.current[selectedSlideId] = {
      ...pendingUpdatesRef.current[selectedSlideId],
      ...updates,
    }

    setSaveStatus('saving')

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => {
      flushSaves()
    }, 800)
  }, [selectedSlideId, flushSaves])

  // Add text element to the active slide's canvas
  const handleAddTextElement = useCallback(() => {
    if (!selectedSlide) return
    const el: CanvasElement = {
      id: `el_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      type: 'text',
      x: 10,
      y: 60,
      width: 40,
      height: 12,
      rotation: 0,
      content: 'Click to edit text',
      style: { fontSize: 16, fontWeight: 'normal', color: '#374151', textAlign: 'left' },
    }
    const existingEls = ((selectedSlide.content as Record<string, unknown>)?._canvas_elements as CanvasElement[] || [])
    handleSlideChange({ content: { ...selectedSlide.content, _canvas_elements: [...existingEls, el] } as unknown as Slide['content'] })
    setSelectedElementId(el.id)
  }, [selectedSlide, handleSlideChange])

  // Add image element to the active slide's canvas
  const handleAddImageElement = useCallback(() => {
    if (!selectedSlide) return
    setShowAddImageDialog(true)
  }, [selectedSlide])

  const handleReorder = useCallback(async (reordered: Slide[]) => {
    pushUndo()
    setSlides(reordered)
    setSaveStatus('saving')
    const results = await Promise.all(reordered.map((slide, i) =>
      fetch(`/api/slides/${slide.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ position: i }),
      }).then((r) => r.ok)
    ))
    setSaveStatus(results.every(Boolean) ? 'saved' : 'error')
  }, [])

  const handleImportC360 = useCallback(async (file: File) => {
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      if (data.format !== 'c360') {
        toast.error('Invalid file format. Expected a .c360 file.')
        return
      }
      const res = await fetch('/api/presentations/import-c360', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: text,
      })
      if (res.ok) {
        const { presentation: newPres } = await res.json()
        toast.success('Deck imported successfully!')
        router.push(`/presentations/${newPres.id}/edit`)
      } else {
        toast.error('Failed to import deck')
      }
    } catch {
      toast.error('Invalid .c360 file')
    }
  }, [router])

  function handleTitleChange(value: string) {
    setPresentationTitle(value)
    setSaveStatus('saving')
    if (titleTimerRef.current) clearTimeout(titleTimerRef.current)
    titleTimerRef.current = setTimeout(async () => {
      const res = await fetch(`/api/presentations/${presentation.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: value }),
      })
      setSaveStatus(res.ok ? 'saved' : 'error')
    }, 600)
  }

  async function handleStart() {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current)
      saveTimerRef.current = null
    }
    await flushSaves()

    setStarting(true)
    const res = await fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ presentation_id: presentation.id }),
    })
    if (res.ok) {
      const data = await res.json()
      router.push(`/present/${data.session.id}`)
    } else {
      toast.error('Failed to start session')
      setStarting(false)
    }
  }

  function selectPrev() {
    if (selectedIndex > 0) setSelectedSlideId(slides[selectedIndex - 1].id)
  }
  function selectNext() {
    if (selectedIndex < slides.length - 1) setSelectedSlideId(slides[selectedIndex + 1].id)
  }

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      {/* ─── Top bar ─────────────────────────────────────────────── */}
      <div className="h-14 bg-background/80 backdrop-blur-xl border-b border-border flex items-center gap-2 px-4 shrink-0">
        {/* Left: back + File menu + title */}
        <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard')}
          className="text-muted-foreground hover:text-foreground h-8 w-8 shrink-0 rounded-xl">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="w-px h-5 bg-border mx-1" />

        {/* File menu dropdown */}
        <div className="relative" ref={fileMenuRef}>
          <button
            onClick={() => setShowFileMenu(v => !v)}
            className={cn(
              'h-8 px-2.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all',
              showFileMenu
                ? 'bg-muted text-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            )}
          >
            File
            <ChevronDown className="w-3 h-3" />
          </button>
          {showFileMenu && (
            <div className="absolute top-full left-0 mt-1 w-64 bg-card border border-border rounded-xl shadow-xl z-50 py-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
              <FileMenuItem icon={Save} label="Save" shortcut="Ctrl+S" onClick={() => { flushSaves(); toast.success('Saved'); setShowFileMenu(false) }} />
              <FileMenuItem icon={FilePlus} label="New presentation" onClick={() => { setShowFileMenu(false); router.push('/dashboard') }} />
              <div className="h-px bg-border mx-2 my-1" />
              <FileMenuItem icon={FolderOpen} label="Open recent" shortcut="" onClick={() => { setShowFileMenu(false); router.push('/dashboard') }} />
              <div className="h-px bg-border mx-2 my-1" />
              <FileMenuItem icon={Copy} label="Duplicate presentation" onClick={async () => {
                setShowFileMenu(false)
                const res = await fetch(`/api/presentations/${presentation.id}/duplicate`, { method: 'POST' })
                if (res.ok) {
                  const data = await res.json()
                  toast.success('Presentation duplicated')
                  router.push(`/presentations/${data.presentation.id}/edit`)
                } else {
                  toast.error('Failed to duplicate')
                }
              }} />
              <div className="h-px bg-border mx-2 my-1" />
              <FileMenuItem icon={FileDown} label="Export as .c360" onClick={() => { setShowFileMenu(false); window.open(`/api/presentations/${presentation.id}/export-c360`, '_blank') }} />
              <FileMenuItem icon={Upload} label="Import .c360" onClick={() => { setShowFileMenu(false); importInputRef.current?.click() }} />
              <div className="h-px bg-border mx-2 my-1" />
              <FileMenuItem icon={Eye} label="Preview" shortcut="" onClick={() => { setShowFileMenu(false); window.open(`/presentations/${presentation.id}/preview`, '_blank') }} />
              <FileMenuItem icon={BarChart2} label="View results" onClick={() => { setShowFileMenu(false); router.push(`/presentations/${presentation.id}/results`) }} />
            </div>
          )}
        </div>

        <div className="w-px h-5 bg-border mx-1" />
        <Input
          value={presentationTitle}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="bg-transparent border-transparent hover:border-border focus:border-border text-foreground font-semibold max-w-[220px] h-8 text-sm rounded-xl"
        />

        {/* Save status */}
        <div className={cn(
          'flex items-center gap-1.5 transition-all duration-300 min-w-[70px]',
          saveStatus === 'idle' ? 'opacity-0' : 'opacity-100'
        )}>
          {saveStatus === 'saving' && <>
            <Loader2 className="w-3 h-3 text-muted-foreground animate-spin" />
            <span className="text-[11px] text-muted-foreground">Saving</span>
          </>}
          {saveStatus === 'saved' && <>
            <Check className="w-3 h-3 text-emerald-500" />
            <span className="text-[11px] text-emerald-500">Saved</span>
          </>}
          {saveStatus === 'error' && <>
            <AlertCircle className="w-3 h-3 text-destructive" />
            <span className="text-[11px] text-destructive">Error</span>
          </>}
        </div>

        <div className="flex-1" />

        {/* Center: toolbar */}
        <div className="flex items-center gap-0.5 bg-muted/60 rounded-xl px-1.5 py-1">
          <button onClick={handleUndo} disabled={undoStack.length === 0}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-background disabled:opacity-30 disabled:pointer-events-none transition-all" title="Undo (Ctrl+Z)">
            <Undo2 className="w-4 h-4" />
          </button>
          <button onClick={handleRedo} disabled={redoStack.length === 0}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-background disabled:opacity-30 disabled:pointer-events-none transition-all" title="Redo (Ctrl+Shift+Z)">
            <Redo2 className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-border mx-1" />
          <button onClick={handleDuplicateSlide} disabled={!selectedSlide}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-background disabled:opacity-30 disabled:pointer-events-none transition-all" title="Duplicate slide">
            <Copy className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-border mx-1" />
          <button onClick={handleAddTextElement} disabled={!selectedSlide}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-background disabled:opacity-30 disabled:pointer-events-none transition-all" title="Add text">
            <Type className="w-4 h-4" />
          </button>
          <button onClick={handleAddImageElement} disabled={!selectedSlide}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-background disabled:opacity-30 disabled:pointer-events-none transition-all" title="Add image">
            <ImageIcon className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-border mx-1" />
          <button onClick={() => setNotesOpen(v => !v)}
            className={cn('p-1.5 rounded-lg transition-all', notesOpen ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-background')}
            title="Speaker notes">
            <StickyNote className="w-4 h-4" />
          </button>
          <button onClick={() => setShowQR(v => !v)}
            className={cn('p-1.5 rounded-lg transition-all', showQR ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-background')}
            title="QR code / join info">
            <QrCode className="w-4 h-4" />
          </button>
        </div>

        {/* Device preview toggle */}
        <div className="flex items-center gap-0.5 bg-muted/60 rounded-xl px-1.5 py-1 ml-2">
          {([
            { key: 'desktop' as const, icon: Monitor, label: 'Desktop' },
            { key: 'tablet' as const, icon: Tablet, label: 'Tablet' },
            { key: 'phone' as const, icon: Smartphone, label: 'Phone' },
          ]).map(({ key, icon: DevIcon, label }) => (
            <button
              key={key}
              onClick={() => setDevicePreview(key)}
              className={cn(
                'p-1.5 rounded-lg transition-all',
                devicePreview === key
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background'
              )}
              title={label}
            >
              <DevIcon className="w-4 h-4" />
            </button>
          ))}
        </div>

        <div className="flex-1" />

        {/* Right: actions */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"
            className="gap-1.5 text-muted-foreground hover:text-foreground h-8 text-xs rounded-xl"
            onClick={() => {
              window.open(`/api/presentations/${presentation.id}/export-c360`, '_blank')
            }}>
            <Download className="w-3.5 h-3.5" />
            Export
          </Button>
          <Button variant="outline" size="sm"
            className="gap-1.5 text-muted-foreground hover:text-foreground h-8 text-xs rounded-xl"
            onClick={() => importInputRef.current?.click()}>
            <Upload className="w-3.5 h-3.5" />
            Import
          </Button>
          <Button variant="outline" size="sm"
            className="gap-1.5 text-muted-foreground hover:text-foreground h-8 text-xs rounded-xl"
            onClick={() => window.open(`/presentations/${presentation.id}/preview`, '_blank')}>
            <Maximize2 className="w-3.5 h-3.5" />
            Preview
          </Button>
          <Button variant="outline" size="sm"
            className="gap-1.5 text-muted-foreground hover:text-foreground h-8 text-xs rounded-xl"
            onClick={() => router.push(`/presentations/${presentation.id}/results`)}>
            <BarChart2 className="w-3.5 h-3.5" />
            Results
          </Button>
          <Button
            onClick={handleStart}
            disabled={slides.length === 0 || starting}
            className="bg-red-600 hover:bg-red-500 text-white gap-1.5 rounded-full px-5 h-8 text-xs font-semibold transition-all hover:shadow-lg hover:shadow-red-500/25"
            size="sm">
            <Play className="w-3.5 h-3.5" />
            {starting ? 'Starting...' : 'Present'}
          </Button>
        </div>
      </div>

      {/* ─── Main layout ─────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left panel - slide list */}
        {slideListOpen && (
          <>
            <div style={{ width: slideListWidth }} className="bg-card border-r border-border flex flex-col shrink-0">
              <div className="flex items-center justify-between px-3 py-2 border-b border-border shrink-0">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Slides</span>
                <button onClick={() => setSlideListOpen(false)}
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  title="Collapse slides">
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-2.5 slide-list-scroll">
                {slides.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-3">
                      <Plus className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground text-xs mb-1">No slides yet</p>
                    <p className="text-muted-foreground/60 text-[11px]">Click below to add your first slide</p>
                  </div>
                ) : (
                  <SlideList
                    slides={slides}
                    selectedId={selectedSlideId}
                    onSelect={(id) => { setSelectedSlideId(id); setSelectedElementId(null) }}
                    onDelete={handleDeleteSlide}
                    onDuplicate={handleDuplicateSlideById}
                    onReorder={handleReorder}
                  />
                )}
              </div>
              <div className="p-2.5 border-t border-border">
                <Button onClick={() => setShowTypeSelector(true)} variant="outline" className="w-full gap-1.5 h-9 text-xs rounded-xl" size="sm">
                  <Plus className="w-3.5 h-3.5" />
                  Add slide
                </Button>
              </div>
            </div>
            {/* Resizable splitter */}
            <div
              className="w-1.5 shrink-0 cursor-col-resize hover:bg-primary/20 active:bg-primary/30 transition-colors relative group"
              onMouseDown={(e) => {
                e.preventDefault()
                splitterDragging.current = true
                const startX = e.clientX
                const startWidth = slideListWidth
                const onMove = (ev: MouseEvent) => {
                  if (!splitterDragging.current) return
                  const newWidth = Math.max(160, Math.min(400, startWidth + (ev.clientX - startX)))
                  setSlideListWidth(newWidth)
                }
                const onUp = () => {
                  splitterDragging.current = false
                  document.removeEventListener('mousemove', onMove)
                  document.removeEventListener('mouseup', onUp)
                }
                document.addEventListener('mousemove', onMove)
                document.addEventListener('mouseup', onUp)
              }}
            >
              <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-center">
                <div className="w-0.5 h-8 rounded-full bg-border group-hover:bg-primary/40 transition-colors" />
              </div>
            </div>
          </>
        )}
        {!slideListOpen && (
          <button onClick={() => setSlideListOpen(true)}
            className="w-10 bg-card border-r border-border flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
            title="Show slides">
            <ChevronRight className="w-4 h-4" />
            <span className="text-[9px] font-semibold [writing-mode:vertical-lr] rotate-180">Slides</span>
          </button>
        )}

        {/* Center - canvas + QR + notes */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* QR Code / Join bar */}
          {showQR && (
            <div className="bg-card border-b border-border px-4 py-2.5 flex items-center gap-3 shrink-0">
              <QrCode className="w-5 h-5 text-primary shrink-0" />
              <div className="flex-1 flex items-center gap-3 flex-wrap">
                <div className="bg-muted rounded-lg px-3 py-1.5">
                  <span className="text-xs text-muted-foreground mr-1.5">Join at:</span>
                  <span className="text-sm font-bold font-mono text-foreground tracking-wider">command360.co.uk/join</span>
                </div>
                <div className="bg-muted rounded-lg px-3 py-1.5">
                  <span className="text-xs text-muted-foreground mr-1.5">Room code:</span>
                  <span className="text-sm font-bold font-mono text-primary tracking-widest">------</span>
                </div>
                <span className="text-[11px] text-muted-foreground/60 italic">Room code generated when you start presenting</span>
              </div>
              <button onClick={() => setShowQR(false)} className="p-1 rounded text-muted-foreground hover:text-foreground">
                <ChevronUp className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Canvas */}
          <div className="flex-1 min-h-0">
            <SlideCanvas
              slide={selectedSlide}
              slides={slides}
              selectedIndex={selectedIndex}
              devicePreview={devicePreview}
              onTitleChange={(title) => { if (selectedSlide) handleSlideChange({ title }) }}
              onCanvasElementsChange={(canvas_elements) => {
                if (selectedSlide) {
                  handleSlideChange({ content: { ...selectedSlide.content, _canvas_elements: canvas_elements } as unknown as Slide['content'] })
                }
              }}
              selectedElementId={selectedElementId}
              onSelectElement={setSelectedElementId}
              onRequestAddImage={() => setShowAddImageDialog(true)}
              onSelectSlide={(id) => { setSelectedSlideId(id); setSelectedElementId(null) }}
              onPrev={selectPrev}
              onNext={selectNext}
            />
          </div>

          {/* Speaker notes panel */}
          {notesOpen && selectedSlide && (
            <div className="bg-card border-t border-border shrink-0" style={{ height: 220 }}>
              <div className="flex items-center justify-between px-4 py-2 border-b border-border">
                <div className="flex items-center gap-2">
                  <StickyNote className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Speaker Notes</span>
                  <span className="text-[10px] text-muted-foreground/50 ml-1">(only visible to you)</span>
                </div>
                <button onClick={() => setNotesOpen(false)} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 h-[calc(100%-40px)]">
                <textarea
                  value={selectedSlide.speaker_notes || ''}
                  onChange={(e) => handleSlideChange({ speaker_notes: e.target.value })}
                  placeholder="Add speaker notes here... These will be visible to you during presentation mode when you press N."
                  className="w-full h-full bg-muted/30 rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none p-3 border border-border/50 focus:border-border transition-colors"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right panel - contextual settings (element or slide) */}
        {selectedSlide && (
          <div className={cn(
            'bg-card border-l border-border flex flex-col shrink-0 transition-all duration-200',
            settingsOpen ? 'w-[300px]' : 'w-0 overflow-hidden'
          )}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {selectedElementId && getCanvasElements().find(e => e.id === selectedElementId) ? 'Element settings' : 'Slide settings'}
              </h3>
              <div className="flex items-center gap-1">
                {selectedElementId && (
                  <button
                    onClick={() => setSelectedElementId(null)}
                    className="text-[10px] text-primary hover:underline mr-2"
                  >
                    Back to slide
                  </button>
                )}
                <button onClick={() => setSettingsOpen(false)} className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 settings-scroll">
              {selectedElementId && getCanvasElements().find(e => e.id === selectedElementId) ? (
                <ElementSettings
                  element={getCanvasElements().find(e => e.id === selectedElementId)!}
                  onUpdate={(updates) => {
                    const els = getCanvasElements()
                    const updated = els.map(e => e.id === selectedElementId ? { ...e, ...updates } : e)
                    handleSlideChange({ content: { ...selectedSlide.content, _canvas_elements: updated } as unknown as Slide['content'] })
                  }}
                  onUpdateStyle={(styleUpdates) => {
                    const els = getCanvasElements()
                    const updated = els.map(e => e.id === selectedElementId ? { ...e, style: { ...e.style, ...styleUpdates } } : e)
                    handleSlideChange({ content: { ...selectedSlide.content, _canvas_elements: updated } as unknown as Slide['content'] })
                  }}
                  onDelete={() => {
                    const els = getCanvasElements().filter(e => e.id !== selectedElementId)
                    handleSlideChange({ content: { ...selectedSlide.content, _canvas_elements: els } as unknown as Slide['content'] })
                    setSelectedElementId(null)
                  }}
                />
              ) : (
                <SlideSettings slide={selectedSlide} onChange={handleSlideChange} />
              )}
            </div>
          </div>
        )}

        {/* Settings toggle when collapsed */}
        {selectedSlide && !settingsOpen && (
          <button onClick={() => setSettingsOpen(true)}
            className="w-10 bg-card border-l border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
            title="Open settings">
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Add Image Dialog */}
      <AddImageDialog
        open={showAddImageDialog}
        onClose={() => setShowAddImageDialog(false)}
        onAdd={(url) => {
          if (!selectedSlide) return
          const el: CanvasElement = {
            id: `el_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
            type: 'image',
            x: 25,
            y: 30,
            width: 30,
            height: 30,
            rotation: 0,
            content: url,
            style: { objectFit: 'cover', borderRadius: 8, opacity: 1 },
          }
          const existingEls = ((selectedSlide.content as Record<string, unknown>)?._canvas_elements as CanvasElement[] || [])
          handleSlideChange({ content: { ...selectedSlide.content, _canvas_elements: [...existingEls, el] } as unknown as Slide['content'] })
          setSelectedElementId(el.id)
        }}
      />

      {showTypeSelector && (
        <SlideTypeSelector onSelect={handleAddSlide} onClose={() => setShowTypeSelector(false)} />
      )}

      <input
        ref={importInputRef}
        type="file"
        accept=".c360"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleImportC360(file)
          e.target.value = ''
        }}
      />
    </div>
  )
}

/* ─── File Menu Item ─── */
function FileMenuItem({ icon: Icon, label, shortcut, onClick }: {
  icon: React.ElementType; label: string; shortcut?: string; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
    >
      <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
      <span className="flex-1 text-left">{label}</span>
      {shortcut && <span className="text-[10px] text-muted-foreground/60 font-mono">{shortcut}</span>}
    </button>
  )
}
