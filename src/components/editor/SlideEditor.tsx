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
import type { CanvasElement, StudioContent } from '@/types/slide'
import { StudioEditor } from '@/components/studio/StudioEditor'
import { ExportDialog } from '@/components/studio/ExportDialog'
import { LiveDirectorView, type ExerciseStats } from '@/components/presenter/LiveDirectorView'
import { ExerciseDebrief } from '@/components/studio/ExerciseDebrief'
import { ActiveModeEntry } from '@/components/studio/ActiveModeEntry'
import { defaultStudioCanvasBg } from '@/lib/studio/default-canvas'
import { applyEditedElements, slideRenderElements } from '@/lib/editor/content-layers'
import {
  type SlideMaster, loadMasters, saveMasters, applyMasterToContent,
  restampMasterOnSlides, defaultMasterId, slideMasterId, NO_MASTER,
} from '@/lib/editor/slide-masters'
import { SlideMastersDialog } from '@/components/editor/SlideMastersDialog'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Plus, Play, ArrowLeft, BarChart2, Check, Loader2, AlertCircle,
  Eye, Copy, Undo2, Redo2,
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  Maximize2, StickyNote, QrCode, Type, ImageIcon,
  Download, Upload, Save, FolderOpen, FilePlus, Clock,
  MoreHorizontal, FileDown, LayoutTemplate,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { BrandMark } from '@/components/site/BrandMark'

interface Presentation {
  id: string
  title: string
  description?: string
  slide_masters?: unknown[]
}

interface SlideEditorProps {
  presentation: Presentation
  initialSlides: Slide[]
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'
export function SlideEditor({ presentation, initialSlides }: SlideEditorProps) {
  const [slides, setSlides] = useState<Slide[]>(initialSlides)
  // always-current slides (for undo snapshots / copy-paste, avoids stale closures)
  const slidesRef = useRef<Slide[]>(initialSlides)
  slidesRef.current = slides
  // throttle undo snapshots so a typing/drag burst is one step
  const lastSnapRef = useRef(0)
  // clipboard for copy/paste of canvas elements (persists across slide changes)
  const clipboardRef = useRef<CanvasElement | null>(null)
  const [selectedSlideId, setSelectedSlideId] = useState<string | null>(initialSlides[0]?.id || null)
  const [showTypeSelector, setShowTypeSelector] = useState(false)
  const [presentationTitle, setPresentationTitle] = useState(presentation.title)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [starting, setStarting] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(true)
  const [slideListOpen, setSlideListOpen] = useState(true)
  const [notesOpen, setNotesOpen] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null)
  const [showAddImageDialog, setShowAddImageDialog] = useState(false)
  const [showFileMenu, setShowFileMenu] = useState(false)
  const [studioFileMenu, setStudioFileMenu] = useState(false)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [showMasters, setShowMasters] = useState(false)
  const [slideListWidth, setSlideListWidth] = useState(220)

  // Slide masters (reusable branded layouts). Loaded from the presentation's
  // slide_masters column, with a per-device localStorage fallback until that
  // column exists (see MIGRATIONS_TODO.md).
  const [masters, setMasters] = useState<SlideMaster[]>(() => loadMasters(presentation.id, presentation.slide_masters))
  const [mastersPersisted, setMastersPersisted] = useState(true)
  const handleMastersChange = useCallback((next: SlideMaster[]) => {
    setMasters(next)
    saveMasters(presentation.id, next).then(({ persisted }) => setMastersPersisted(persisted))
  }, [presentation.id])
  const fileMenuRef = useRef<HTMLDivElement>(null)
  const studioFileMenuRef = useRef<HTMLDivElement>(null)
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

  // Active Mode (Live Director)
  const [activeMode, setActiveMode] = useState(false)
  const [showActiveEntry, setShowActiveEntry] = useState(false)
  const [activeModeSession, setActiveModeSession] = useState<{ id: string; room_code: string } | null>(null)
  const [activeModePresenter, setActiveModePresenter] = useState('')
  // multi-scene live: which studio scenes are currently broadcast live (tracked
  // here so it survives switching which scene the presenter drives)
  const [liveSceneIds, setLiveSceneIds] = useState<string[]>([])
  // exercise start time, kept across scene switches so the director timer is continuous
  const [exerciseStartedAt, setExerciseStartedAt] = useState<string | null>(null)
  // per-scene live state cache so switching away + back to a scene is non-destructive
  const sceneCacheRef = useRef<Record<string, { layers: import('@/types/slide').StudioLayer[]; layerStates: Record<string, import('@/types/slide').StudioLayerState> }>>({})
  const cacheSceneState = useCallback((sceneId: string, layers: import('@/types/slide').StudioLayer[], layerStates: Record<string, import('@/types/slide').StudioLayerState>) => {
    sceneCacheRef.current[sceneId] = { layers, layerStates }
  }, [])
  const [exerciseStats, setExerciseStats] = useState<ExerciseStats | null>(null)
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>['channel']> | null>(null)

  const selectedSlide = slides.find((s) => s.id === selectedSlideId) || null
  const selectedIndex = slides.findIndex((s) => s.id === selectedSlideId)
  const isStudioSlide = selectedSlide?.slide_type === 'studio'

  // Studio content — passed directly to StudioEditor
  const studioContent: StudioContent | null = isStudioSlide
    ? (selectedSlide.content as unknown as StudioContent) ?? {
        canvas: { width: 1920, height: 1080, backgroundColor: '#ffffff' },
        layers: [],
        eventCategories: [],
        events: [],
        tracks: [],
        timelineEvents: [],
        totalDuration: 10000,
        votingEnabled: false,
      }
    : null

  // Helper to get canvas elements from current slide
  function getCanvasElements(): CanvasElement[] {
    if (!selectedSlide) return []
    return ((selectedSlide.content as Record<string, unknown>)?._canvas_elements as CanvasElement[]) || []
  }

  // handleAddTextElement and handleAddImageElement are defined after handleSlideChange below

  // Restore selected slide from sessionStorage on mount
  useEffect(() => {
    const saved = sessionStorage.getItem(`studio-slide-${presentation.id}`)
    if (saved && initialSlides.some(s => s.id === saved)) {
      setSelectedSlideId(saved)
    }
  }, []) // eslint-disable-line

  // Persist selected slide to sessionStorage
  useEffect(() => {
    if (selectedSlideId) {
      sessionStorage.setItem(`studio-slide-${presentation.id}`, selectedSlideId)
    }
  }, [selectedSlideId, presentation.id])

  // Clear saved indicator after delay
  useEffect(() => {
    if (saveStatus === 'saved') {
      const t = setTimeout(() => setSaveStatus('idle'), 2000)
      return () => clearTimeout(t)
    }
  }, [saveStatus])

  // Clear timers on unmount (flushSaves added in separate effect below)
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

  // Close studio file menu on outside click
  useEffect(() => {
    if (!studioFileMenu) return
    function onClick(e: MouseEvent) {
      if (studioFileMenuRef.current && !studioFileMenuRef.current.contains(e.target as Node)) {
        setStudioFileMenu(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [studioFileMenu])

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const mod = e.ctrlKey || e.metaKey
      if (!mod) return
      const ae = document.activeElement
      const inField = !!ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA' || ae.tagName === 'SELECT' || (ae as HTMLElement).isContentEditable)
      const k = e.key.toLowerCase()

      if (k === 's') {
        e.preventDefault()
        flushSaves()
        toast.success('Saved', { duration: 2000 })
      } else if (k === 'z' && !e.shiftKey) {
        e.preventDefault()
        handleUndo()
      } else if ((k === 'z' && e.shiftKey) || k === 'y') {
        e.preventDefault()
        handleRedo()
      } else if (k === 'c' && !inField && selectedElementId) {
        // copy selected canvas element (let native copy run while typing)
        if (copySelectedElement()) e.preventDefault()
      } else if (k === 'v' && !inField && clipboardRef.current) {
        e.preventDefault()
        pasteElement()
      } else if (k === 'd' && !inField && selectedElementId) {
        e.preventDefault()
        duplicateSelectedElement()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  // Apply a restored slides array and queue the changed slides for save so
  // undo/redo actually persists (not just a local revert).
  function applyRestored(next: Slide[], current: Slide[]) {
    setSlides(next)
    const curById = new Map(current.map((s) => [s.id, s]))
    for (const s of next) {
      const c = curById.get(s.id)
      if (!c || c.title !== s.title || c.speaker_notes !== s.speaker_notes || JSON.stringify(c.content) !== JSON.stringify(s.content)) {
        pendingUpdatesRef.current[s.id] = { ...pendingUpdatesRef.current[s.id], title: s.title, content: s.content, speaker_notes: s.speaker_notes }
      }
    }
    setSaveStatus('saving')
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => flushSaves(), 400)
  }

  function handleUndo() {
    if (undoStack.length === 0) return
    const current = slidesRef.current
    const prev = undoStack[undoStack.length - 1]
    setRedoStack((s) => [...s, current])
    setUndoStack((s) => s.slice(0, -1))
    applyRestored(prev, current)
  }

  function handleRedo() {
    if (redoStack.length === 0) return
    const current = slidesRef.current
    const next = redoStack[redoStack.length - 1]
    setUndoStack((s) => [...s, current])
    setRedoStack((s) => s.slice(0, -1))
    applyRestored(next, current)
  }

  // Snapshot the CURRENT slides for undo. Throttled (a burst of edits = one
  // step); pass force for discrete actions (add / delete / duplicate slide).
  function pushUndo(force = false) {
    const now = Date.now()
    if (!force && now - lastSnapRef.current < 600) return
    lastSnapRef.current = now
    const snap = slidesRef.current
    setUndoStack((s) => [...s.slice(-49), snap])
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
    if (!allOk) toast.error('Some changes failed to save', { duration: 2000 })
    return allOk
  }, [])

  // Flush saves before page unload — prevents data loss
  useEffect(() => {
    const handleBeforeUnload = () => {
      const pending = { ...pendingUpdatesRef.current }
      const entries = Object.entries(pending)
      for (const [slideId, updates] of entries) {
        try { navigator.sendBeacon(`/api/slides/${slideId}`, JSON.stringify(updates)) } catch { /* ignore */ }
      }
      pendingUpdatesRef.current = {}
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      flushSaves()
    }
  }, [flushSaves])

  const handleAddSlide = useCallback(async (type: SlideType) => {
    pushUndo(true)
    const position = slides.length
    setSaveStatus('saving')
    const res = await fetch('/api/slides', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ presentation_id: presentation.id, slide_type: type, position, title: '' }),
    })
    if (res.ok) {
      const data = await res.json()
      let newSlide: Slide = data.slide
      // New content slides inherit the default master so every deck is branded
      // out of the box.
      if (type === 'content') {
        const def = masters.find((m) => m.id === defaultMasterId(masters))
        if (def) {
          newSlide = { ...newSlide, content: applyMasterToContent(newSlide.content, def) }
          pendingUpdatesRef.current[newSlide.id] = { ...pendingUpdatesRef.current[newSlide.id], content: newSlide.content }
          if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
          saveTimerRef.current = setTimeout(() => { flushSaves() }, 800)
        }
      }
      setSlides((prev) => [...prev, newSlide])
      setSelectedSlideId(newSlide.id)
      setSaveStatus('saved')
      toast.success('Slide added', { duration: 2000 })
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
        toast.error(errData.error || 'Failed to add slide', { duration: 2000 })
      }
    }
  }, [slides.length, presentation.id, masters, flushSaves])

  const handleDuplicateSlide = useCallback(async () => {
    if (!selectedSlide) return
    const originalIndex = slides.findIndex(s => s.id === selectedSlide.id)
    const insertPosition = originalIndex + 1
    pushUndo(true)
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
      toast.success('Slide duplicated', { duration: 2000 })
    } else {
      setSaveStatus('error')
      toast.error('Failed to duplicate slide', { duration: 2000 })
    }
  }, [selectedSlide, slides, presentation.id])

  const handleDuplicateSlideById = useCallback(async (id: string) => {
    const originalIndex = slides.findIndex(s => s.id === id)
    const slide = slides[originalIndex]
    if (!slide) return
    const insertPosition = originalIndex + 1
    pushUndo(true)
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
      toast.success('Slide duplicated', { duration: 2000 })
    } else {
      setSaveStatus('error')
      toast.error('Failed to duplicate slide', { duration: 2000 })
    }
  }, [slides, presentation.id])

  const handleDeleteSlide = useCallback(async (id: string) => {
    setDeleteTargetId(id)
  }, [])

  const confirmDeleteSlide = useCallback(async () => {
    if (!deleteTargetId) return
    const id = deleteTargetId
    setDeleteTargetId(null)
    pushUndo(true)
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
      toast.success('Scene deleted', { duration: 2000 })
    } else {
      setSaveStatus('error')
      toast.error('Failed to delete', { duration: 2000 })
    }
  }, [deleteTargetId, selectedSlideId])

  const handleSlideChange = useCallback((updates: Partial<Slide>) => {
    if (!selectedSlideId) return

    pushUndo() // throttled — records the pre-change state so edits are undoable

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

  // Persist an update to ANY slide (not just the selected one) — used when
  // applying / re-stamping slide masters across the deck.
  const queueSlideUpdate = useCallback((slideId: string, updates: Partial<Slide>) => {
    setSlides((prev) => prev.map((s) => (s.id === slideId ? { ...s, ...updates } : s)))
    pendingUpdatesRef.current[slideId] = { ...pendingUpdatesRef.current[slideId], ...updates }
    setSaveStatus('saving')
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => { flushSaves() }, 800)
  }, [flushSaves])

  // Apply a master (or NO_MASTER to detach) to the selected slide.
  const applyMasterToSelected = useCallback((masterId: string) => {
    if (!selectedSlide) return
    const master = masterId === NO_MASTER ? null : masters.find((m) => m.id === masterId) || null
    handleSlideChange({ content: applyMasterToContent(selectedSlide.content, master) })
  }, [selectedSlide, masters, handleSlideChange])

  // After a master is edited, refresh its stored snapshot on every slide using
  // it so the change shows (and persists) immediately.
  const handleMasterEdited = useCallback((master: SlideMaster) => {
    const changed = restampMasterOnSlides(slidesRef.current, master)
    changed.forEach((c) => queueSlideUpdate(c.id, { content: c.content }))
  }, [queueSlideUpdate])

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

  // ─── Copy / paste / duplicate of canvas elements ───
  const getCanvasEls = (slide: Slide | null): CanvasElement[] =>
    ((slide?.content as Record<string, unknown>)?._canvas_elements as CanvasElement[]) || []
  // Selectable elements include the bound title/body boxes on content slides, so
  // they can be copied/duplicated (into real, independent text elements).
  const getSelectableEls = (slide: Slide | null): CanvasElement[] =>
    !slide ? [] : slide.slide_type === 'content' ? slideRenderElements(slide, true) : getCanvasEls(slide)
  // Persist an edited element list, routing content-slide bound boxes back to
  // title/body and everything else into _canvas_elements.
  const persistElements = (slide: Slide, els: CanvasElement[]) => {
    if (slide.slide_type === 'content') {
      handleSlideChange(applyEditedElements(slide, els))
    } else {
      handleSlideChange({ content: { ...slide.content, _canvas_elements: els } as unknown as Slide['content'] })
    }
  }
  const newElId = () => `el_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
  const clampPct = (v: number) => Math.max(0, Math.min(92, v))

  const copySelectedElement = useCallback(() => {
    if (!selectedSlide || !selectedElementId) return false
    const el = getSelectableEls(selectedSlide).find((e) => e.id === selectedElementId)
    if (!el) return false
    clipboardRef.current = JSON.parse(JSON.stringify(el))
    return true
  }, [selectedSlide, selectedElementId])

  const pasteElement = useCallback(() => {
    if (!selectedSlide || !clipboardRef.current) return
    const src = clipboardRef.current
    const el: CanvasElement = { ...JSON.parse(JSON.stringify(src)), id: newElId(), x: clampPct((src.x || 0) + 3), y: clampPct((src.y || 0) + 3) }
    handleSlideChange({ content: { ...selectedSlide.content, _canvas_elements: [...getCanvasEls(selectedSlide), el] } as unknown as Slide['content'] })
    setSelectedElementId(el.id)
  }, [selectedSlide, handleSlideChange])

  const duplicateSelectedElement = useCallback(() => {
    if (!selectedSlide || !selectedElementId) return
    const el0 = getSelectableEls(selectedSlide).find((e) => e.id === selectedElementId)
    if (!el0) return
    const el: CanvasElement = { ...JSON.parse(JSON.stringify(el0)), id: newElId(), x: clampPct((el0.x || 0) + 3), y: clampPct((el0.y || 0) + 3) }
    handleSlideChange({ content: { ...selectedSlide.content, _canvas_elements: [...getCanvasEls(selectedSlide), el] } as unknown as Slide['content'] })
    setSelectedElementId(el.id)
  }, [selectedSlide, selectedElementId, handleSlideChange])

  const handleReorder = useCallback(async (reordered: Slide[]) => {
    pushUndo(true)
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
        toast.error('Invalid file format. Expected a .c360 file.', { duration: 2000 })
        return
      }
      const res = await fetch('/api/presentations/import-c360', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: text,
      })
      if (res.ok) {
        const { presentation: newPres } = await res.json()
        toast.success('Imported successfully!', { duration: 2000 })
        router.push(`/presentations/${newPres.id}/edit`)
      } else {
        toast.error('Failed to import', { duration: 2000 })
      }
    } catch {
      toast.error('Invalid .c360 file', { duration: 2000 })
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
      localStorage.setItem('c360_onboard_session', 'true')
      router.push(`/present/${data.session.id}`)
    } else {
      toast.error('Failed to start session', { duration: 2000 })
      setStarting(false)
    }
  }

  async function handleStartActiveMode(presenterName: string) {
    setShowActiveEntry(false)
    setActiveModePresenter(presenterName)
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
      const supabase = createClient()
      const channel = supabase.channel(`session:${data.session.id}`)
      channel.subscribe()
      channelRef.current = channel
      // seed the live scene set with the scene being driven so a joining room
      // has something to pick straight away
      setExerciseStartedAt(new Date().toISOString())
      if (selectedSlide) {
        setLiveSceneIds([selectedSlide.id])
        fetch(`/api/sessions/${data.session.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ live_scene_ids: [selectedSlide.id] }),
        }).catch(() => {})
      }
      setActiveModeSession({ id: data.session.id, room_code: data.session.room_code })
      setActiveMode(true)
      setStarting(false)
    } else {
      toast.error('Failed to start session', { duration: 2000 })
      setStarting(false)
    }
  }

  function selectPrev() {
    if (selectedIndex > 0) setSelectedSlideId(slides[selectedIndex - 1].id)
  }
  function selectNext() {
    if (selectedIndex < slides.length - 1) setSelectedSlideId(slides[selectedIndex + 1].id)
  }

  // ── Exercise Debrief Screen ──
  if (exerciseStats) {
    return (
      <ExerciseDebrief
        stats={exerciseStats}
        onReturn={() => {
          setExerciseStats(null)
          setActiveMode(false)
          setActiveModeSession(null)
          setExerciseStartedAt(null)
          setLiveSceneIds([])
          sceneCacheRef.current = {}
          if (channelRef.current) {
            const supabase = createClient()
            supabase.removeChannel(channelRef.current)
            channelRef.current = null
          }
        }}
      />
    )
  }

  // ── Active Mode (Live Director View) ──
  if (activeMode && activeModeSession && selectedSlide && isStudioSlide) {
    return (
      <>
        <LiveDirectorView
          key={selectedSlide.id}
          slide={selectedSlide}
          session={activeModeSession}
          channelRef={channelRef}
          presenterName={activeModePresenter}
          scenes={slides.filter(s => s.slide_type === 'studio').map(s => ({ id: s.id, title: s.title }))}
          initialLiveSceneIds={liveSceneIds.length ? liveSceneIds : [selectedSlide.id]}
          onLiveScenesChange={setLiveSceneIds}
          cachedLayers={sceneCacheRef.current[selectedSlide.id]?.layers}
          cachedStates={sceneCacheRef.current[selectedSlide.id]?.layerStates}
          exerciseStartedAt={exerciseStartedAt ?? undefined}
          onSceneStateChange={cacheSceneState}
          onDriveScene={(sceneId) => {
            // switch which scene the presenter drives; the key change remounts
            // the director onto that scene (only valid for studio scenes)
            if (slides.some(s => s.id === sceneId && s.slide_type === 'studio')) setSelectedSlideId(sceneId)
          }}
          onEndExercise={(stats) => {
            setActiveMode(false)
            setExerciseStats(stats)
          }}
        />
      </>
    )
  }

  // ── Full-screen Studio Mode — overlays on top of everything ──
  if (isStudioSlide && studioContent) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-zinc-950 dash-light:bg-[#ECE9E1] text-white dash-light:text-[#16191E]">
        {/* Compact top bar */}
        <div className="h-10 bg-zinc-900/90 dash-light:bg-[#F5F2EB] border-b border-zinc-800 dash-light:border-black/10 flex items-center gap-3 px-3 shrink-0 relative z-[60]">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-zinc-400 dash-light:text-[#5B6169] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <BrandMark size={20} />
          </button>
          <div className="w-px h-5 bg-zinc-700 dash-light:bg-black/10" />

          {/* File menu */}
          <div className="relative" ref={studioFileMenuRef}>
            <button
              onClick={() => setStudioFileMenu(v => !v)}
              className={cn(
                'h-7 px-2 rounded-none text-xs font-medium flex items-center gap-1 transition-all',
                studioFileMenu
                  ? 'bg-zinc-800 dash-light:bg-[#EAE6DD] text-white dash-light:text-[#16191E]'
                  : 'text-zinc-400 dash-light:text-[#5B6169] hover:text-white hover:bg-zinc-800 dash-light:hover:bg-black/[0.05]'
              )}
            >
              File
              <ChevronDown className="w-3 h-3" />
            </button>
            {studioFileMenu && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-zinc-900 dash-light:bg-white border border-zinc-700 dash-light:border-black/10 rounded-none shadow-xl z-50 py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                <StudioFileMenuItem icon={Save} label="Save" shortcut="Ctrl+S" onClick={() => { flushSaves(); toast.success('Saved', { duration: 2000 }); setStudioFileMenu(false) }} />
                <StudioFileMenuItem icon={FilePlus} label="New scene" onClick={() => { setStudioFileMenu(false); router.push('/dashboard') }} />
                <div className="h-px bg-zinc-700 dash-light:bg-black/10 mx-2 my-1" />
                <StudioFileMenuItem icon={FolderOpen} label="Open recent" onClick={() => { setStudioFileMenu(false); router.push('/dashboard') }} />
                <div className="h-px bg-zinc-700 dash-light:bg-black/10 mx-2 my-1" />
                <StudioFileMenuItem icon={Copy} label="Duplicate scene" onClick={async () => {
                  setStudioFileMenu(false)
                  const res = await fetch(`/api/presentations/${presentation.id}/duplicate`, { method: 'POST' })
                  if (res.ok) {
                    const data = await res.json()
                    toast.success('Duplicated', { duration: 2000 })
                    router.push(`/presentations/${data.presentation.id}/edit`)
                  } else {
                    toast.error('Failed to duplicate', { duration: 2000 })
                  }
                }} />
                <div className="h-px bg-zinc-700 dash-light:bg-black/10 mx-2 my-1" />
                <StudioFileMenuItem icon={FileDown} label="Export..." onClick={() => { setStudioFileMenu(false); setShowExportDialog(true) }} />
                <StudioFileMenuItem icon={Upload} label="Import .c360" onClick={() => { setStudioFileMenu(false); importInputRef.current?.click() }} />
              </div>
            )}
          </div>

          <span className="text-[10px] uppercase tracking-[0.15em] text-zinc-500 dash-light:text-[#5B6169] font-medium">Command Studio</span>
          {/* On light the faint green-on-cream washes out, so the badge flips
              to a solid dark chip with bright green text + border (high
              contrast, stands out) — see globals.css contrast notes. */}
          <span className="text-[9px] uppercase tracking-wider font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 dash-light:text-emerald-300 dash-light:bg-[#16191E] dash-light:border-emerald-400/70 px-2 py-0.5 rounded-none">Build Mode</span>
          <div className="relative group/title flex items-center">
            <input
              type="text"
              value={presentationTitle}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="bg-transparent border border-transparent hover:border-zinc-700 dash-light:hover:border-black/10 focus:border-zinc-600 dash-light:focus:border-black/10 text-sm text-white dash-light:text-[#16191E] font-medium focus:outline-none rounded-none px-2 py-0.5 w-auto max-w-[300px] truncate transition-colors"
              placeholder="Untitled Scenario"
              title="Scenario name"
            />
            <svg className="w-3 h-3 text-zinc-600 dash-light:text-[#5B6169] group-hover/title:text-zinc-400 transition-colors -ml-5 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
          </div>
          <div className="flex-1" />
          <span className={`text-[10px] transition-opacity ${saveStatus === 'saved' ? 'text-emerald-400 dash-light:text-[#157045] opacity-100' : saveStatus === 'saving' ? 'text-zinc-500 dash-light:text-[#5B6169] opacity-100' : 'opacity-0'}`}>
            {saveStatus === 'saving' ? 'Saving...' : 'Saved'}
          </span>

          {/* Fullscreen toggle */}
          <Tooltip><TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="text-zinc-400 dash-light:text-[#5B6169] hover:text-white h-7 w-7 p-0"
            onClick={() => {
              if (document.fullscreenElement) {
                document.exitFullscreen()
              } else {
                document.documentElement.requestFullscreen()
              }
            }}
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </Button>
          </TooltipTrigger><TooltipContent>Toggle fullscreen</TooltipContent></Tooltip>

          {/* Preview */}
          <Button
            variant="ghost"
            size="sm"
            className="text-zinc-400 dash-light:text-[#5B6169] hover:text-white h-7 text-xs gap-1"
            onClick={() => window.open(`/presentations/${presentation.id}/preview?slide=${selectedIndex}`, '_blank')}
          >
            <Eye className="w-3.5 h-3.5" />
            Preview
          </Button>

          {/* Run Scene → Active Mode */}
          <Button
            onClick={() => setShowActiveEntry(true)}
            disabled={starting}
            size="sm"
            className="bg-red-600 hover:bg-red-500 text-white gap-1 rounded-none px-4 h-7 text-xs font-semibold"
          >
            <Play className="w-3 h-3" />
            {starting ? 'Starting...' : 'Run Scene'}
          </Button>

          <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')} className="text-zinc-400 dash-light:text-[#5B6169] hover:text-white h-7 text-xs">
            Exit Studio
          </Button>
        </div>
        {/* Full-screen studio editor */}
        <div className="flex-1 min-h-0">
          <StudioEditor
            content={studioContent}
            onContentChange={(updated) => {
              handleSlideChange({ content: updated as unknown as Slide['content'] })
            }}
            slides={slides}
            selectedSlideId={selectedSlideId}
            onSelectSlide={(id) => { setSelectedSlideId(id); setSelectedElementId(null) }}
            onDeleteSlide={handleDeleteSlide}
            onDuplicateSlide={handleDuplicateSlideById}
            onRenameSlide={async (slideId: string, newTitle: string) => {
              setSlides(prev => prev.map(s => s.id === slideId ? { ...s, title: newTitle } : s))
              setSaveStatus('saving')
              const res = await fetch(`/api/slides/${slideId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: newTitle }),
              })
              setSaveStatus(res.ok ? 'saved' : 'error')
            }}
            onAddSlide={async () => {
              const position = slides.length
              setSaveStatus('saving')
              const res = await fetch('/api/slides', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ presentation_id: presentation.id, slide_type: 'studio', position, title: '' }),
              })
              if (res.ok) {
                const data = await res.json()
                setSlides((prev: Slide[]) => [...prev, data.slide])
                setSelectedSlideId(data.slide.id)
                setSaveStatus('saved')
                toast.success('Scene added', { duration: 2000 })
              } else {
                setSaveStatus('error')
                toast.error('Failed to add scene', { duration: 2000 })
              }
            }}
            onAddCctvSlide={async () => {
              const position = slides.length
              setSaveStatus('saving')
              const cctvContent = {
                canvas: { width: 1920, height: 1080, backgroundColor: defaultStudioCanvasBg('#000000') },
                layers: [],
                eventCategories: [],
                events: [],
                votingEnabled: false,
                cctvLayout: '4' as const,
                cctvSlots: [],
              }
              const res = await fetch('/api/slides', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  presentation_id: presentation.id,
                  slide_type: 'studio',
                  position,
                  title: 'CCTV',
                  content: cctvContent,
                }),
              })
              if (res.ok) {
                const data = await res.json()
                setSlides((prev: Slide[]) => [...prev, data.slide])
                setSelectedSlideId(data.slide.id)
                setSaveStatus('saved')
                toast.success('CCTV scene added', { duration: 2000 })
              } else {
                setSaveStatus('error')
                toast.error('Failed to add CCTV scene', { duration: 2000 })
              }
            }}
            onReorderSlides={async (fromIndex: number, toIndex: number) => {
              pushUndo(true)
              setSlides((prev: Slide[]) => {
                const next = [...prev]
                const [moved] = next.splice(fromIndex, 1)
                next.splice(toIndex, 0, moved)
                return next
              })
              // Persist new positions to the API
              setSaveStatus('saving')
              try {
                const reordered = [...slides]
                const [moved] = reordered.splice(fromIndex, 1)
                reordered.splice(toIndex, 0, moved)
                await Promise.all(
                  reordered.map((slide, idx) =>
                    fetch(`/api/slides/${slide.id}`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ position: idx }),
                    })
                  )
                )
                setSaveStatus('saved')
              } catch {
                setSaveStatus('error')
                toast.error('Failed to save scene order', { duration: 2000 })
              }
            }}
          />
        </div>

        {/* Custom delete confirmation modal */}
        {deleteTargetId && (
          <div className="fixed inset-0 z-[300] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setDeleteTargetId(null)}>
            <div className="bg-[#1e1f22] dash-light:bg-white border border-[#3f4147] dash-light:border-black/10 rounded-none p-5 max-w-xs w-full shadow-2xl" onClick={e => e.stopPropagation()}>
              <h3 className="text-sm font-semibold text-white dash-light:text-[#16191E] mb-2">Delete this scene?</h3>
              <p className="text-[11px] text-zinc-400 dash-light:text-[#5B6169] mb-4">This action cannot be undone. The scene and all its layers will be permanently removed.</p>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setDeleteTargetId(null)}
                  className="px-3 py-1.5 text-[11px] font-medium rounded-none bg-[#2b2d31] dash-light:bg-[#EAE6DD] text-zinc-300 dash-light:text-[#5B6169] hover:bg-[#35363c] dash-light:hover:bg-black/[0.05] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteSlide}
                  className="px-3 py-1.5 text-[11px] font-medium rounded-none bg-red-600 text-white hover:bg-red-500 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Export dialog */}
        <ExportDialog
          isOpen={showExportDialog}
          onClose={() => setShowExportDialog(false)}
          presentationId={presentation.id}
          presentationTitle={presentationTitle}
          slides={slides}
        />

        {/* Slide masters manager */}
        {showMasters && (
          <SlideMastersDialog
            masters={masters}
            onChange={handleMastersChange}
            slides={slides}
            selectedSlide={selectedSlide}
            onMasterEdited={handleMasterEdited}
            persisted={mastersPersisted}
            onClose={() => setShowMasters(false)}
          />
        )}

        {/* Active Mode Entry */}
        {showActiveEntry && (
          <ActiveModeEntry
            sceneName={presentationTitle || selectedSlide?.title || 'Untitled Scene'}
            onStart={(presenterName) => handleStartActiveMode(presenterName)}
            onCancel={() => setShowActiveEntry(false)}
          />
        )}
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      {/* ─── Top bar ─────────────────────────────────────────────── */}
      <div className="h-14 bg-background/80 backdrop-blur-xl border-b border-border flex items-center gap-2 px-4 shrink-0 relative z-[60]">
        {/* Left: back + File menu + title */}
        <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard')}
          className="text-muted-foreground hover:text-foreground h-8 w-8 shrink-0 rounded-none">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="w-px h-5 bg-border mx-1" />

        {/* File menu dropdown */}
        <div className="relative" ref={fileMenuRef}>
          <button
            onClick={() => setShowFileMenu(v => !v)}
            className={cn(
              'h-8 px-2.5 rounded-none text-xs font-medium flex items-center gap-1.5 transition-all',
              showFileMenu
                ? 'bg-muted text-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            )}
          >
            File
            <ChevronDown className="w-3 h-3" />
          </button>
          {showFileMenu && (
            <div className="absolute top-full left-0 mt-1 w-64 bg-card border border-border rounded-none shadow-xl z-50 py-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
              <FileMenuItem icon={Save} label="Save" shortcut="Ctrl+S" onClick={() => { flushSaves(); toast.success('Saved', { duration: 2000 }); setShowFileMenu(false) }} />
              <FileMenuItem icon={FilePlus} label="New session" onClick={() => { setShowFileMenu(false); router.push('/dashboard') }} />
              <div className="h-px bg-border mx-2 my-1" />
              <FileMenuItem icon={FolderOpen} label="Open recent" shortcut="" onClick={() => { setShowFileMenu(false); router.push('/dashboard') }} />
              <div className="h-px bg-border mx-2 my-1" />
              <FileMenuItem icon={Copy} label="Duplicate session" onClick={async () => {
                setShowFileMenu(false)
                const res = await fetch(`/api/presentations/${presentation.id}/duplicate`, { method: 'POST' })
                if (res.ok) {
                  const data = await res.json()
                  toast.success('Duplicated', { duration: 2000 })
                  router.push(`/presentations/${data.presentation.id}/edit`)
                } else {
                  toast.error('Failed to duplicate', { duration: 2000 })
                }
              }} />
              <div className="h-px bg-border mx-2 my-1" />
              <FileMenuItem icon={FileDown} label="Export as .c360" onClick={() => { setShowFileMenu(false); window.open(`/api/presentations/${presentation.id}/export-c360`, '_blank') }} />
              <FileMenuItem icon={Upload} label="Import .c360" onClick={() => { setShowFileMenu(false); importInputRef.current?.click() }} />
              <div className="h-px bg-border mx-2 my-1" />
              <FileMenuItem icon={Eye} label="Preview" shortcut="" onClick={() => { setShowFileMenu(false); window.open(`/presentations/${presentation.id}/preview?slide=${selectedIndex}`, '_blank') }} />
              <FileMenuItem icon={BarChart2} label="View results" onClick={() => { setShowFileMenu(false); router.push(`/presentations/${presentation.id}/results`) }} />
            </div>
          )}
        </div>

        <div className="w-px h-5 bg-border mx-1" />
        <Input
          value={presentationTitle}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="bg-transparent border-transparent hover:border-border focus:border-border text-foreground font-semibold max-w-[220px] h-8 text-sm rounded-none"
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
            <Check className="w-3 h-3 text-emerald-500 dash-light:text-[#157045]" />
            <span className="text-[11px] text-emerald-500 dash-light:text-[#157045]">Saved</span>
          </>}
          {saveStatus === 'error' && <>
            <AlertCircle className="w-3 h-3 text-destructive" />
            <span className="text-[11px] text-destructive">Error</span>
          </>}
        </div>

        <div className="flex-1" />

        {/* Center: toolbar */}
        <div className="flex items-center gap-0.5 bg-muted/60 rounded-none px-1.5 py-1">
          <Tooltip><TooltipTrigger asChild>
          <button onClick={handleUndo} disabled={undoStack.length === 0}
            className="p-1.5 rounded-none text-muted-foreground hover:text-foreground hover:bg-background disabled:opacity-30 disabled:pointer-events-none transition-all">
            <Undo2 className="w-4 h-4" />
          </button>
          </TooltipTrigger><TooltipContent>Undo (Ctrl+Z)</TooltipContent></Tooltip>
          <Tooltip><TooltipTrigger asChild>
          <button onClick={handleRedo} disabled={redoStack.length === 0}
            className="p-1.5 rounded-none text-muted-foreground hover:text-foreground hover:bg-background disabled:opacity-30 disabled:pointer-events-none transition-all">
            <Redo2 className="w-4 h-4" />
          </button>
          </TooltipTrigger><TooltipContent>Redo (Ctrl+Shift+Z)</TooltipContent></Tooltip>
          <div className="w-px h-4 bg-border mx-1" />
          <Tooltip><TooltipTrigger asChild>
          <button onClick={handleDuplicateSlide} disabled={!selectedSlide}
            className="p-1.5 rounded-none text-muted-foreground hover:text-foreground hover:bg-background disabled:opacity-30 disabled:pointer-events-none transition-all">
            <Copy className="w-4 h-4" />
          </button>
          </TooltipTrigger><TooltipContent>Duplicate slide</TooltipContent></Tooltip>
          <div className="w-px h-4 bg-border mx-1" />
          <Tooltip><TooltipTrigger asChild>
          <button onClick={handleAddTextElement} disabled={!selectedSlide}
            className="p-1.5 rounded-none text-muted-foreground hover:text-foreground hover:bg-background disabled:opacity-30 disabled:pointer-events-none transition-all">
            <Type className="w-4 h-4" />
          </button>
          </TooltipTrigger><TooltipContent>Add text</TooltipContent></Tooltip>
          <Tooltip><TooltipTrigger asChild>
          <button onClick={handleAddImageElement} disabled={!selectedSlide}
            className="p-1.5 rounded-none text-muted-foreground hover:text-foreground hover:bg-background disabled:opacity-30 disabled:pointer-events-none transition-all">
            <ImageIcon className="w-4 h-4" />
          </button>
          </TooltipTrigger><TooltipContent>Add image</TooltipContent></Tooltip>
          <Tooltip><TooltipTrigger asChild>
          <button onClick={() => setShowMasters(true)}
            className={cn('p-1.5 rounded-none transition-all', showMasters ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-background')}>
            <LayoutTemplate className="w-4 h-4" />
          </button>
          </TooltipTrigger><TooltipContent>Slide masters (branded layouts)</TooltipContent></Tooltip>
          <div className="w-px h-4 bg-border mx-1" />
          <Tooltip><TooltipTrigger asChild>
          <button onClick={() => setNotesOpen(v => !v)}
            className={cn('p-1.5 rounded-none transition-all', notesOpen ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-background')}>
            <StickyNote className="w-4 h-4" />
          </button>
          </TooltipTrigger><TooltipContent>Speaker notes</TooltipContent></Tooltip>
          <Tooltip><TooltipTrigger asChild>
          <button onClick={() => setShowQR(v => !v)}
            className={cn('p-1.5 rounded-none transition-all', showQR ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-background')}>
            <QrCode className="w-4 h-4" />
          </button>
          </TooltipTrigger><TooltipContent>QR code / join info</TooltipContent></Tooltip>
        </div>

        <div className="flex-1" />

        {/* Right: actions */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"
            className="gap-1.5 text-muted-foreground hover:text-foreground h-8 text-xs rounded-none"
            onClick={() => {
              window.open(`/api/presentations/${presentation.id}/export-c360`, '_blank')
            }}>
            <Download className="w-3.5 h-3.5" />
            Export
          </Button>
          <Button variant="outline" size="sm"
            className="gap-1.5 text-muted-foreground hover:text-foreground h-8 text-xs rounded-none"
            onClick={() => importInputRef.current?.click()}>
            <Upload className="w-3.5 h-3.5" />
            Import
          </Button>
          <Button variant="outline" size="sm"
            className="gap-1.5 text-muted-foreground hover:text-foreground h-8 text-xs rounded-none"
            onClick={() => window.open(`/presentations/${presentation.id}/preview?slide=${selectedIndex}`, '_blank')}>
            <Maximize2 className="w-3.5 h-3.5" />
            Preview
          </Button>
          <Button variant="outline" size="sm"
            className="gap-1.5 text-muted-foreground hover:text-foreground h-8 text-xs rounded-none"
            onClick={() => router.push(`/presentations/${presentation.id}/results`)}>
            <BarChart2 className="w-3.5 h-3.5" />
            Results
          </Button>
          <Button
            onClick={handleStart}
            disabled={slides.length === 0 || starting}
            className="bg-red-600 hover:bg-red-500 text-white gap-1.5 rounded-none px-5 h-8 text-xs font-semibold transition-all hover:shadow-lg hover:shadow-red-500/25"
            size="sm">
            <Play className="w-3.5 h-3.5" />
            {starting ? 'Starting...' : 'Start Session'}
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
                <Tooltip><TooltipTrigger asChild>
                <button onClick={() => setSlideListOpen(false)}
                  className="p-1 rounded-none text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                </TooltipTrigger><TooltipContent>Collapse slides</TooltipContent></Tooltip>
              </div>
              <div className="flex-1 overflow-y-auto p-2.5 slide-list-scroll">
                {slides.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full py-16 text-center px-4">
                    <div className="w-14 h-14 rounded-none bg-muted/60 flex items-center justify-center mb-4">
                      <Plus className="w-6 h-6 text-muted-foreground/50" />
                    </div>
                    <p className="text-muted-foreground text-sm font-medium mb-1">No slides yet</p>
                    <p className="text-muted-foreground/50 text-xs leading-relaxed">Click the + button below to add your first slide</p>
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
                <Button onClick={() => setShowTypeSelector(true)} variant="outline" className="w-full gap-1.5 h-9 text-xs rounded-none" size="sm">
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
                <div className="w-0.5 h-8 rounded-none bg-border group-hover:bg-primary/40 transition-colors" />
              </div>
            </div>
          </>
        )}
        {!slideListOpen && (
          <Tooltip><TooltipTrigger asChild>
          <button onClick={() => setSlideListOpen(true)}
            className="w-10 bg-card border-r border-border flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0">
            <ChevronRight className="w-4 h-4" />
            <span className="text-[9px] font-semibold [writing-mode:vertical-lr] rotate-180">Slides</span>
          </button>
          </TooltipTrigger><TooltipContent>Show slides</TooltipContent></Tooltip>
        )}

        {/* Center + Right: Studio layout vs normal layout */}
        {isStudioSlide && studioContent ? (
          <StudioEditor
            content={studioContent}
            onContentChange={(updated) => {
              handleSlideChange({ content: updated as unknown as Slide['content'] })
            }}
            slides={slides}
            selectedSlideId={selectedSlideId}
            onSelectSlide={(id) => { setSelectedSlideId(id); setSelectedElementId(null) }}
            onAddSlide={() => setShowTypeSelector(true)}
          />
        ) : (
          <>
            {/* Normal: Center canvas + QR + notes */}
            <div className="flex-1 flex flex-col min-w-0 min-h-0">
              {/* QR Code / Join bar */}
              {showQR && (
                <div className="bg-card border-b border-border px-4 py-2.5 flex items-center gap-3 shrink-0">
                  <QrCode className="w-5 h-5 text-primary shrink-0" />
                  <div className="flex-1 flex items-center gap-3 flex-wrap">
                    <div className="bg-muted rounded-none px-3 py-1.5">
                      <span className="text-xs text-muted-foreground mr-1.5">Join at:</span>
                      <span className="text-sm font-bold font-mono text-foreground tracking-wider">command360.co.uk/join</span>
                    </div>
                    <div className="bg-muted rounded-none px-3 py-1.5">
                      <span className="text-xs text-muted-foreground mr-1.5">Room code:</span>
                      <span className="text-sm font-bold font-mono text-primary tracking-widest">------</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground/60 italic">Room code generated when you start presenting</span>
                  </div>
                  <button onClick={() => setShowQR(false)} className="p-1 rounded-none text-muted-foreground hover:text-foreground">
                    <ChevronUp className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Canvas */}
              <div className="flex-1 min-h-0 overflow-hidden">
                <SlideCanvas
                  slide={selectedSlide}
                  slides={slides}
                  selectedIndex={selectedIndex}
                  onTitleChange={(title) => { if (selectedSlide) handleSlideChange({ title }) }}
                  onCanvasElementsChange={(canvas_elements) => {
                    if (!selectedSlide) return
                    if (selectedSlide.slide_type === 'content') {
                      // Content slides: the list may include the bound title/body
                      // boxes — route them back to slide.title / content.body.
                      handleSlideChange(applyEditedElements(selectedSlide, canvas_elements))
                    } else {
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
                      <StickyNote className="w-4 h-4 text-amber-500 dash-light:text-[#A8741F]" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Speaker Notes</span>
                      <span className="text-[10px] text-muted-foreground/50 ml-1">(only visible to you)</span>
                    </div>
                    <button onClick={() => setNotesOpen(false)} className="p-1.5 rounded-none text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-4 h-[calc(100%-40px)]">
                    <textarea
                      value={selectedSlide.speaker_notes || ''}
                      onChange={(e) => handleSlideChange({ speaker_notes: e.target.value })}
                      placeholder="Add speaker notes here... These will be visible to you during presentation mode when you press N."
                      className="w-full h-full bg-muted/30 rounded-none text-sm text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none p-3 border border-border/50 focus:border-border transition-colors"
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
                    {selectedElementId && getSelectableEls(selectedSlide).find(e => e.id === selectedElementId) ? 'Element settings' : 'Slide settings'}
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
                    <button onClick={() => setSettingsOpen(false)} className="text-muted-foreground hover:text-foreground p-1 rounded-none hover:bg-muted">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 settings-scroll">
                  {selectedElementId && getSelectableEls(selectedSlide).find(e => e.id === selectedElementId) ? (
                    <ElementSettings
                      element={getSelectableEls(selectedSlide).find(e => e.id === selectedElementId)!}
                      onUpdate={(updates) => {
                        const updated = getSelectableEls(selectedSlide).map(e => e.id === selectedElementId ? { ...e, ...updates } : e)
                        persistElements(selectedSlide, updated)
                      }}
                      onUpdateStyle={(styleUpdates) => {
                        const updated = getSelectableEls(selectedSlide).map(e => e.id === selectedElementId ? { ...e, style: { ...e.style, ...styleUpdates } } : e)
                        persistElements(selectedSlide, updated)
                      }}
                      onDelete={() => {
                        const updated = getSelectableEls(selectedSlide).filter(e => e.id !== selectedElementId)
                        persistElements(selectedSlide, updated)
                        setSelectedElementId(null)
                      }}
                      onDuplicate={duplicateSelectedElement}
                    />
                  ) : (
                    <div className="space-y-4">
                      {selectedSlide.slide_type === 'content' && (
                        <div className="space-y-1.5">
                          <label className="text-muted-foreground text-xs uppercase tracking-wide font-medium flex items-center gap-1.5">
                            <LayoutTemplate className="w-3 h-3" /> Slide master
                          </label>
                          <div className="flex items-center gap-1.5">
                            <select
                              value={slideMasterId(selectedSlide)}
                              onChange={(e) => applyMasterToSelected(e.target.value)}
                              className="flex-1 h-8 px-2 rounded-none bg-background border border-border text-foreground text-xs"
                            >
                              <option value={NO_MASTER}>None (blank)</option>
                              {masters.map((m) => (
                                <option key={m.id} value={m.id}>{m.name}{m.isDefault ? ' · default' : ''}</option>
                              ))}
                            </select>
                            <button
                              onClick={() => setShowMasters(true)}
                              title="Manage masters"
                              className="h-8 px-2 rounded-none border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                            >
                              <LayoutTemplate className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                      <SlideSettings slide={selectedSlide} onChange={handleSlideChange} />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Settings toggle when collapsed */}
            {selectedSlide && !settingsOpen && (
              <Tooltip><TooltipTrigger asChild>
              <button onClick={() => setSettingsOpen(true)}
                className="w-10 bg-card border-l border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0">
                <ChevronLeft className="w-4 h-4" />
              </button>
              </TooltipTrigger><TooltipContent>Open settings</TooltipContent></Tooltip>
            )}
          </>
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

      {/* Delete confirmation modal (also available in the normal editor view) */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-[300] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setDeleteTargetId(null)}>
          <div className="bg-[#1e1f22] dash-light:bg-white border border-[#3f4147] dash-light:border-black/10 rounded-none p-5 max-w-xs w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-sm font-semibold text-white dash-light:text-[#16191E] mb-2">Delete this scene?</h3>
            <p className="text-[11px] text-zinc-400 dash-light:text-[#5B6169] mb-4">This action cannot be undone. The scene and all its layers will be permanently removed.</p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setDeleteTargetId(null)}
                className="px-3 py-1.5 text-[11px] font-medium rounded-none bg-[#2b2d31] dash-light:bg-[#EAE6DD] text-zinc-300 dash-light:text-[#5B6169] hover:bg-[#35363c] dash-light:hover:bg-black/[0.05] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteSlide}
                className="px-3 py-1.5 text-[11px] font-medium rounded-none bg-red-600 text-white hover:bg-red-500 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
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

/* ─── Studio File Menu Item (dark theme) ─── */
function StudioFileMenuItem({ icon: Icon, label, shortcut, onClick }: {
  icon: React.ElementType; label: string; shortcut?: string; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-1.5 text-xs text-zinc-200 dash-light:text-[#16191E] hover:bg-zinc-800 dash-light:hover:bg-black/[0.05] transition-colors"
    >
      <Icon className="w-3.5 h-3.5 text-zinc-400 dash-light:text-[#5B6169] shrink-0" />
      <span className="flex-1 text-left">{label}</span>
      {shortcut && <span className="text-[10px] text-zinc-500 dash-light:text-[#5B6169] font-mono">{shortcut}</span>}
    </button>
  )
}
