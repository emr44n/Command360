'use client'
import type { Slide, PollContent, QuizContent, ContentSlideContent } from '@/types/slide'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  Trash2, Copy, BarChart2, Cloud, HelpCircle,
  MessageCircle, ClipboardList, FileText, Star, AlignLeft,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const ICONS: Record<string, React.ElementType> = {
  poll: BarChart2, word_cloud: Cloud, quiz: HelpCircle, qna: MessageCircle,
  survey: ClipboardList, content: FileText, rating_scale: Star, open_text: AlignLeft,
}

const TYPE_COLORS: Record<string, string> = {
  poll: '#dc2626', word_cloud: '#3b82f6', quiz: '#10b981', qna: '#f59e0b',
  survey: '#ec4899', content: '#6b7280', rating_scale: '#f97316', open_text: '#14b8a6',
}

const TYPE_LABELS: Record<string, string> = {
  poll: 'Poll', word_cloud: 'Word Cloud', quiz: 'Quiz', qna: 'Q&A',
  survey: 'Survey', content: 'Content', rating_scale: 'Rating', open_text: 'Text',
}

interface SlideListProps {
  slides: Slide[]
  selectedId: string | null
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
  onReorder: (slides: Slide[]) => void
}

export function SlideList({ slides, selectedId, onSelect, onDelete, onDuplicate, onReorder }: SlideListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = slides.findIndex((s) => s.id === active.id)
      const newIndex = slides.findIndex((s) => s.id === over.id)
      onReorder(arrayMove(slides, oldIndex, newIndex))
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={slides.map((s) => s.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {slides.map((slide, i) => (
            <SortableSlideItem
              key={slide.id}
              slide={slide}
              index={i}
              isSelected={slide.id === selectedId}
              onSelect={() => onSelect(slide.id)}
              onDelete={() => onDelete(slide.id)}
              onDuplicate={() => onDuplicate(slide.id)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}

function SortableSlideItem({ slide, index, isSelected, onSelect, onDelete, onDuplicate }: {
  slide: Slide; index: number; isSelected: boolean; onSelect: () => void; onDelete: () => void; onDuplicate: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: slide.id })
  const Icon = ICONS[slide.slide_type] || FileText
  const typeColor = TYPE_COLORS[slide.slide_type] || '#6b7280'
  const typeLabel = TYPE_LABELS[slide.slide_type] || slide.slide_type

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
      className={cn(
        'group rounded-xl transition-all duration-150 border-2 cursor-grab active:cursor-grabbing select-none',
        isSelected
          ? 'border-primary shadow-md shadow-primary/10'
          : 'border-border shadow-sm hover:border-primary/40 hover:shadow-md',
        isDragging ? 'opacity-60 scale-[0.97] shadow-xl z-50' : ''
      )}
      onClick={onSelect}
    >
      {/* Mini slide thumbnail */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '10px 10px 0 0',
          aspectRatio: '16/9',
          padding: '8px 10px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Type badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginBottom: 4 }}>
          <Icon style={{ width: 8, height: 8, color: typeColor }} />
          <span style={{ fontSize: 7, fontWeight: 600, textTransform: 'uppercase', color: typeColor, letterSpacing: '0.04em' }}>
            {typeLabel}
          </span>
        </div>
        {/* Title */}
        <p style={{
          fontSize: 9, fontWeight: 700, color: '#111827', lineHeight: 1.2,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          marginBottom: 4,
        }}>
          {slide.title || 'Untitled'}
        </p>
        {/* Content hint */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <MiniContentPreview slide={slide} />
        </div>
        {/* Action buttons overlay */}
        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
          <button
            onClick={(e) => { e.stopPropagation(); onDuplicate() }}
            className="p-0.5 rounded bg-white/80 hover:bg-blue-50 text-muted-foreground hover:text-blue-600 transition-colors"
            title="Duplicate slide"
          >
            <Copy style={{ width: 10, height: 10 }} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete() }}
            className="p-0.5 rounded bg-white/80 hover:bg-red-50 text-muted-foreground hover:text-destructive transition-colors"
            title="Delete slide"
          >
            <Trash2 style={{ width: 10, height: 10 }} />
          </button>
        </div>
      </div>

      {/* Footer with number */}
      <div
        className={cn(
          'flex items-center gap-1.5 px-2 py-1 rounded-b-xl',
          isSelected ? 'bg-primary/10' : 'bg-muted/50'
        )}
      >
        <span className={cn(
          'text-[10px] font-bold tabular-nums w-4 text-center',
          isSelected ? 'text-primary' : 'text-muted-foreground'
        )}>
          {index + 1}
        </span>
        <span className="text-[10px] text-muted-foreground truncate flex-1">
          {slide.title || 'Untitled'}
        </span>
      </div>
    </div>
  )
}

/* Mini content previews for thumbnails */
function MiniContentPreview({ slide }: { slide: Slide }) {
  switch (slide.slide_type) {
    case 'poll': {
      const c = slide.content as PollContent
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {(c.options || []).slice(0, 3).map((o, i) => (
            <div key={i} style={{ background: '#f3f4f6', borderRadius: 3, padding: '1px 4px', fontSize: 7, color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {o.text || `Option ${i + 1}`}
            </div>
          ))}
        </div>
      )
    }
    case 'quiz': {
      const c = slide.content as QuizContent
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          {(c.options || []).slice(0, 4).map((o, i) => (
            <div key={i} style={{
              background: o.is_correct ? '#dcfce7' : '#f3f4f6',
              borderRadius: 2, padding: '1px 3px', fontSize: 6, color: '#6b7280',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {o.text || `Opt ${i + 1}`}
            </div>
          ))}
        </div>
      )
    }
    case 'word_cloud':
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <Cloud style={{ width: 16, height: 16, color: '#d1d5db' }} />
        </div>
      )
    case 'qna':
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <MessageCircle style={{ width: 16, height: 16, color: '#d1d5db' }} />
        </div>
      )
    case 'content': {
      const c = slide.content as ContentSlideContent
      return (
        <p style={{ fontSize: 7, color: '#9ca3af', lineHeight: 1.3, overflow: 'hidden', maxHeight: 24 }}>
          {c.body || 'No content'}
        </p>
      )
    }
    case 'rating_scale':
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, height: '100%' }}>
          {[1,2,3,4,5].map(n => (
            <div key={n} style={{ width: 12, height: 12, borderRadius: 2, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 6, color: '#9ca3af' }}>
              {n}
            </div>
          ))}
        </div>
      )
    case 'open_text':
      return (
        <div style={{ border: '1px dashed #d1d5db', borderRadius: 3, padding: '2px 4px', fontSize: 6, color: '#d1d5db', marginTop: 2 }}>
          Type here...
        </div>
      )
    default:
      return null
  }
}
