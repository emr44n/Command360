'use client'
import { useEffect, useCallback } from 'react'
import { X, BarChart2, Cloud, HelpCircle, MessageCircle, ClipboardList, FileText, Star, AlignLeft, Monitor } from 'lucide-react'
import type { SlideType } from '@/types/slide'

interface SlideTypeSelectorProps {
  onSelect: (type: SlideType) => void
  onClose: () => void
}

const ALL_TYPES = [
  { type: 'poll' as SlideType, label: 'Poll', description: 'Multiple choice voting', icon: BarChart2, color: '#dc2626', bg: '#fef2f2', key: '1' },
  { type: 'quiz' as SlideType, label: 'Quiz', description: 'Timed question with scoring', icon: HelpCircle, color: '#10b981', bg: '#ecfdf5', key: '2' },
  { type: 'word_cloud' as SlideType, label: 'Word Cloud', description: 'Collect word responses', icon: Cloud, color: '#3b82f6', bg: '#eff6ff', key: '3' },
  { type: 'rating_scale' as SlideType, label: 'Rating Scale', description: 'Numeric scale (1-10, etc.)', icon: Star, color: '#f97316', bg: '#fff7ed', key: '4' },
  { type: 'open_text' as SlideType, label: 'Open Text', description: 'Free-text responses', icon: AlignLeft, color: '#14b8a6', bg: '#f0fdfa', key: '5' },
  { type: 'qna' as SlideType, label: 'Q&A', description: 'Open questions from audience', icon: MessageCircle, color: '#f59e0b', bg: '#fffbeb', key: '6' },
  { type: 'survey' as SlideType, label: 'Survey', description: 'Multi-question form', icon: ClipboardList, color: '#ec4899', bg: '#fdf2f8', key: '7' },
  { type: 'content' as SlideType, label: 'Content', description: 'Text or image slide', icon: FileText, color: '#6b7280', bg: '#f9fafb', key: '8' },
  { type: 'studio' as SlideType, label: 'Command Studio', description: 'Interactive scenario engine', icon: Monitor, color: '#ef4444', bg: '#fef2f2', key: '9' },
]

const CATEGORIES = [
  {
    label: 'Interactive',
    types: ALL_TYPES.filter(t => ['poll', 'quiz', 'word_cloud', 'rating_scale', 'studio'].includes(t.type)),
  },
  {
    label: 'Collect input',
    types: ALL_TYPES.filter(t => ['open_text', 'qna', 'survey'].includes(t.type)),
  },
  {
    label: 'Present',
    types: ALL_TYPES.filter(t => t.type === 'content'),
  },
]

export function SlideTypeSelector({ onSelect, onClose }: SlideTypeSelectorProps) {
  const handleSelect = useCallback((type: SlideType) => {
    onSelect(type)
    onClose()
  }, [onSelect, onClose])

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { onClose(); return }
      const match = ALL_TYPES.find(t => t.key === e.key)
      if (match) {
        e.preventDefault()
        handleSelect(match.type)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleSelect, onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          borderRadius: 20,
          padding: 0,
          width: '100%',
          maxWidth: 560,
          boxShadow: '0 25px 60px -12px rgba(0,0,0,0.4)',
          color: '#111827',
          overflow: 'hidden',
          animation: 'reveal-scale 0.2s cubic-bezier(0.16,1,0.3,1) both',
        }}
      >
        <style>{`
          @keyframes reveal-scale { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        `}</style>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px', borderBottom: '1px solid #f3f4f6',
        }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>Add a slide</h2>
            <p style={{ fontSize: 13, color: '#9ca3af', marginTop: 2 }}>Choose a type or press 1-9</p>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: 6, borderRadius: 8, background: 'transparent', border: 'none',
              color: '#9ca3af', cursor: 'pointer', display: 'flex',
            }}
          >
            <X style={{ width: 20, height: 20 }} />
          </button>
        </div>

        {/* Categories */}
        <div style={{ padding: '16px 24px 24px' }}>
          {CATEGORIES.map((cat) => (
            <div key={cat.label} style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af', marginBottom: 10, paddingLeft: 2 }}>
                {cat.label}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                {cat.types.map((item) => (
                  <button
                    key={item.type}
                    onClick={() => handleSelect(item.type)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '14px 16px', borderRadius: 14,
                      border: '2px solid #f3f4f6', background: '#ffffff',
                      cursor: 'pointer', textAlign: 'left',
                      transition: 'all 0.15s ease',
                      position: 'relative',
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget
                      el.style.borderColor = item.color
                      el.style.background = item.bg
                      el.style.transform = 'translateY(-1px)'
                      el.style.boxShadow = `0 4px 12px ${item.color}20`
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget
                      el.style.borderColor = '#f3f4f6'
                      el.style.background = '#ffffff'
                      el.style.transform = 'translateY(0)'
                      el.style.boxShadow = 'none'
                    }}
                  >
                    <div style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: item.bg, display: 'flex',
                      alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <item.icon style={{ width: 20, height: 20, color: item.color }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{item.label}</p>
                      <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 1 }}>{item.description}</p>
                    </div>
                    {/* Keyboard shortcut badge */}
                    <span style={{
                      position: 'absolute', top: 8, right: 8,
                      width: 20, height: 20, borderRadius: 5,
                      background: '#f3f4f6', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, fontWeight: 700, color: '#9ca3af',
                      fontFamily: 'monospace',
                    }}>
                      {item.key}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
