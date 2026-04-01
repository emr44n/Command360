'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, FileText, Radio, X } from 'lucide-react'

interface SearchResult {
  id: string
  title: string
  type: 'presentation' | 'session'
  subtitle?: string
}

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Open on Cmd+K / Ctrl+K
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(prev => !prev)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery('')
      setResults([])
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  // Search with debounce
  const searchTimeout = useRef<ReturnType<typeof setTimeout>>(undefined)
  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([])
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`)
      if (res.ok) {
        const data = await res.json()
        setResults(data.results || [])
        setSelectedIndex(0)
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  function handleInputChange(val: string) {
    setQuery(val)
    clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(() => doSearch(val), 250)
  }

  function navigateToResult(result: SearchResult) {
    setOpen(false)
    if (result.type === 'presentation') {
      router.push(`/presentations/${result.id}/edit`)
    } else {
      router.push(`/dashboard/reports/${result.id}`)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(i => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault()
      navigateToResult(results[selectedIndex])
    }
  }

  if (!open) return null

  const presentations = results.filter(r => r.type === 'presentation')
  const sessions = results.filter(r => r.type === 'session')

  return (
    <div className="fixed inset-0 z-[100]" onClick={() => setOpen(false)}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative mx-auto mt-[15vh] w-full max-w-lg"
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-background border border-border rounded-2xl shadow-2xl overflow-hidden">
          {/* Search input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
            <Search className="w-5 h-5 text-muted-foreground shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search classrooms, activity..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              value={query}
              onChange={e => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-80 overflow-y-auto p-2">
            {loading && (
              <p className="text-xs text-muted-foreground text-center py-4">Searching...</p>
            )}
            {!loading && query && results.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-4">No results found</p>
            )}
            {!loading && !query && (
              <p className="text-xs text-muted-foreground text-center py-4">
                Type to search... <kbd className="ml-1 px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">Esc</kbd> to close
              </p>
            )}

            {presentations.length > 0 && (
              <div className="mb-2">
                <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground px-2 py-1">Classrooms</p>
                {presentations.map(r => {
                  const globalIdx = results.indexOf(r)
                  return (
                    <button
                      key={r.id}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                        globalIdx === selectedIndex ? 'bg-primary/10 text-primary' : 'hover:bg-muted/80'
                      }`}
                      onClick={() => navigateToResult(r)}
                      onMouseEnter={() => setSelectedIndex(globalIdx)}
                    >
                      <FileText className="w-4 h-4 shrink-0" />
                      <span className="truncate">{r.title}</span>
                    </button>
                  )
                })}
              </div>
            )}

            {sessions.length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground px-2 py-1">Activity</p>
                {sessions.map(r => {
                  const globalIdx = results.indexOf(r)
                  return (
                    <button
                      key={r.id}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                        globalIdx === selectedIndex ? 'bg-primary/10 text-primary' : 'hover:bg-muted/80'
                      }`}
                      onClick={() => navigateToResult(r)}
                      onMouseEnter={() => setSelectedIndex(globalIdx)}
                    >
                      <Radio className="w-4 h-4 shrink-0" />
                      <div className="min-w-0">
                        <span className="truncate block">{r.title}</span>
                        {r.subtitle && <span className="text-xs text-muted-foreground">{r.subtitle}</span>}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Footer hint */}
          <div className="border-t border-border px-4 py-2 flex items-center gap-4 text-[10px] text-muted-foreground">
            <span><kbd className="px-1 py-0.5 bg-muted rounded font-mono">↑↓</kbd> Navigate</span>
            <span><kbd className="px-1 py-0.5 bg-muted rounded font-mono">Enter</kbd> Open</span>
            <span><kbd className="px-1 py-0.5 bg-muted rounded font-mono">Esc</kbd> Close</span>
          </div>
        </div>
      </div>
    </div>
  )
}
