'use client'

import { useState, useEffect } from 'react'
import { Layout, Plus, Trash2, Download, FolderOpen } from 'lucide-react'
import type { StudioContent } from '@/types/slide'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

interface StudioTemplate {
  id: string
  title: string
  description: string
  content: StudioContent
  category: string
  createdAt: string
}

const STORAGE_KEY = 'studio-templates'

function loadTemplates(): StudioTemplate[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

function saveTemplates(templates: StudioTemplate[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates))
}

export function TemplateGallery({
  onUseTemplate,
  onClose,
}: {
  onUseTemplate: (content: StudioContent) => void
  onClose?: () => void
}) {
  const [templates, setTemplates] = useState<StudioTemplate[]>([])
  const [builtIn, setBuiltIn] = useState<StudioTemplate[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('all')

  // Load user templates from localStorage
  useEffect(() => {
    setTemplates(loadTemplates())
  }, [])

  // Load built-in templates from API
  useEffect(() => {
    fetch('/api/studio/templates')
      .then((r) => r.json())
      .then((data) => {
        if (data.templates) setBuiltIn(data.templates)
      })
      .catch(() => {})
  }, [])

  const allTemplates = [...builtIn, ...templates]

  const categories = ['all', ...Array.from(new Set(allTemplates.map((t) => t.category)))]

  const filtered =
    activeCategory === 'all'
      ? allTemplates
      : allTemplates.filter((t) => t.category === activeCategory)

  const handleDelete = (id: string) => {
    const updated = templates.filter((t) => t.id !== id)
    setTemplates(updated)
    saveTemplates(updated)
  }

  const handleUse = (template: StudioTemplate) => {
    onUseTemplate(template.content)
    onClose?.()
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#3f4147]">
        <div className="flex items-center gap-1.5">
          <Layout className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-medium text-zinc-200">Templates</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 text-xs">
            Close
          </button>
        )}
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-1 px-3 py-1.5 overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors whitespace-nowrap ${
              activeCategory === cat
                ? 'bg-amber-500/20 text-amber-300'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Template grid */}
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        {filtered.length === 0 ? (
          <div className="mt-8 text-center">
            <FolderOpen className="w-6 h-6 text-zinc-600 mx-auto mb-2" />
            <p className="text-xs text-zinc-500">No templates yet</p>
            <p className="text-[10px] text-zinc-600 mt-1">
              Save your current scene as a template to reuse it later
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-1.5 mt-1">
            {filtered.map((template) => {
              const isBuiltIn = builtIn.some((b) => b.id === template.id)
              return (
                <div
                  key={template.id}
                  className="group relative rounded-lg border border-[#3f4147] bg-[#383a40] hover:border-zinc-500 transition-colors overflow-hidden cursor-pointer"
                  onClick={() => handleUse(template)}
                >
                  {/* Preview area */}
                  <div className="aspect-video bg-zinc-900 flex items-center justify-center">
                    <Layout className="w-5 h-5 text-zinc-700" />
                  </div>

                  {/* Info */}
                  <div className="px-2 py-1.5">
                    <p className="text-[10px] font-medium text-zinc-200 truncate">
                      {template.title}
                    </p>
                    {template.description && (
                      <p className="text-[9px] text-zinc-500 truncate mt-0.5">
                        {template.description}
                      </p>
                    )}
                  </div>

                  {/* Overlay actions */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-1.5">
                      <Tooltip><TooltipTrigger asChild>
                      <button
                        className="p-1.5 rounded-lg bg-amber-500/90 text-white hover:bg-amber-500 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleUse(template)
                        }}
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      </TooltipTrigger><TooltipContent>Use template</TooltipContent></Tooltip>
                      {!isBuiltIn && (
                        <Tooltip><TooltipTrigger asChild>
                        <button
                          className="p-1.5 rounded-lg bg-red-500/80 text-white hover:bg-red-500 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(template.id)
                          }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        </TooltipTrigger><TooltipContent>Delete template</TooltipContent></Tooltip>
                      )}
                    </div>
                  </div>

                  {/* Category badge */}
                  <span className="absolute top-1 right-1 px-1 py-0.5 rounded bg-black/60 text-[8px] text-zinc-400">
                    {template.category}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

/** Save a StudioContent as a template to localStorage */
export function saveAsTemplate(content: StudioContent, title: string, description = '', category = 'custom') {
  const templates = loadTemplates()
  const newTemplate: StudioTemplate = {
    id: crypto.randomUUID(),
    title,
    description,
    content,
    category,
    createdAt: new Date().toISOString(),
  }
  templates.push(newTemplate)
  saveTemplates(templates)
  return newTemplate
}
