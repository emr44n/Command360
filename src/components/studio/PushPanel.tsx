'use client'
import { useState } from 'react'
import type { StudioLayer } from '@/types/slide'
import { Zap, X, ChevronDown, ImageIcon, VideoIcon, Type, Square, Volume2 } from 'lucide-react'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

/* Type color map for visual distinction */
const TYPE_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  image: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'IMG' },
  video: { bg: 'bg-purple-500/20', text: 'text-purple-400', label: 'VID' },
  text: { bg: 'bg-white/10', text: 'text-white', label: 'TXT' },
  shape: { bg: 'bg-zinc-500/20', text: 'text-zinc-400', label: 'SHP' },
  audio: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'AUD' },
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  image: <ImageIcon className="w-2.5 h-2.5" />,
  video: <VideoIcon className="w-2.5 h-2.5" />,
  text: <Type className="w-2.5 h-2.5" />,
  shape: <Square className="w-2.5 h-2.5" />,
  audio: <Volume2 className="w-2.5 h-2.5" />,
}

export interface PushQueueItem {
  layer: StudioLayer
  transition: 'fade' | 'instant'
}

interface PushPanelProps {
  queue: PushQueueItem[]
  onUpdateTransition: (layerId: string, transition: 'fade' | 'instant') => void
  onPushItem: (layerId: string) => void
  onPushAll: () => void
  onRemoveItem: (layerId: string) => void
  globalTransition: 'fade' | 'instant'
  onSetGlobalTransition: (t: 'fade' | 'instant') => void
}

export function PushPanel({ queue, onUpdateTransition, onPushItem, onPushAll, onRemoveItem, globalTransition, onSetGlobalTransition }: PushPanelProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-3 py-2 border-b border-[#2b2d31] shrink-0">
        <h3 className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Push to Live</h3>
        {queue.length > 0 && <p className="text-[8px] text-zinc-600 mt-0.5">{queue.length} item{queue.length !== 1 ? 's' : ''} ready</p>}
      </div>

      {/* Queue list */}
      <div className="flex-1 overflow-y-auto p-2">
        {queue.length === 0 ? (
          <div className="text-center py-8">
            <Zap className="w-5 h-5 text-zinc-700 mx-auto mb-2" />
            <p className="text-[9px] text-zinc-600">Drop assets on the canvas</p>
            <p className="text-[8px] text-zinc-700 mt-1">They&apos;ll appear here ready to push</p>
          </div>
        ) : (
          <div className="space-y-1">
            {queue.map(item => {
              const tc = TYPE_COLORS[item.layer.type] || TYPE_COLORS.image
              const isExpanded = expandedId === item.layer.id
              return (
                <div key={item.layer.id} className="bg-[#2b2d31] rounded-lg overflow-hidden">
                  {/* Main row */}
                  <div className="flex items-center gap-1.5 px-2 py-1.5">
                    {/* Type badge */}
                    <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${tc.bg} ${tc.text}`}>
                      {TYPE_ICONS[item.layer.type]}
                    </div>
                    {/* Name */}
                    <span className="flex-1 text-[9px] text-zinc-300 truncate">{item.layer.name}</span>
                    {/* Expand for options */}
                    <Tooltip><TooltipTrigger asChild>
                    <button onClick={() => setExpandedId(isExpanded ? null : item.layer.id)} className="p-0.5 text-zinc-600 hover:text-zinc-300 transition-colors">
                      <ChevronDown className={`w-2.5 h-2.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                    </TooltipTrigger><TooltipContent>Options</TooltipContent></Tooltip>
                    {/* Individual push */}
                    <Tooltip><TooltipTrigger asChild>
                    <button onClick={() => onPushItem(item.layer.id)} className="p-1 rounded bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white transition-colors">
                      <Zap className="w-2.5 h-2.5" />
                    </button>
                    </TooltipTrigger><TooltipContent>Push this item live</TooltipContent></Tooltip>
                    {/* Remove */}
                    <Tooltip><TooltipTrigger asChild>
                    <button onClick={() => onRemoveItem(item.layer.id)} className="p-0.5 text-zinc-600 hover:text-red-400 transition-colors">
                      <X className="w-2.5 h-2.5" />
                    </button>
                    </TooltipTrigger><TooltipContent>Remove from queue</TooltipContent></Tooltip>
                  </div>
                  {/* Expanded options */}
                  {isExpanded && (
                    <div className="px-2 pb-2 pt-0.5 border-t border-[#3f4147]">
                      <p className="text-[7px] text-zinc-600 uppercase tracking-wider mb-1">Transition</p>
                      <div className="flex gap-1">
                        <button
                          onClick={() => onUpdateTransition(item.layer.id, 'fade')}
                          className={`flex-1 text-[8px] py-1 rounded-md transition-colors ${item.transition === 'fade' ? 'bg-red-500/20 text-red-400' : 'bg-[#1e1f22] text-zinc-500 hover:text-zinc-300'}`}
                        >
                          Fade In
                        </button>
                        <button
                          onClick={() => onUpdateTransition(item.layer.id, 'instant')}
                          className={`flex-1 text-[8px] py-1 rounded-md transition-colors ${item.transition === 'instant' ? 'bg-red-500/20 text-red-400' : 'bg-[#1e1f22] text-zinc-500 hover:text-zinc-300'}`}
                        >
                          Instant
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Global transition + Push All — always visible */}
      <div className="p-2 border-t border-[#2b2d31] shrink-0 space-y-1.5">
        <p className="text-[7px] text-zinc-600 uppercase tracking-wider">Default Transition</p>
        <div className="flex gap-1">
          <button onClick={() => onSetGlobalTransition('fade')} className={`flex-1 text-[8px] py-1 rounded-md transition-colors ${globalTransition === 'fade' ? 'bg-red-500/20 text-red-400' : 'bg-[#1e1f22] text-zinc-500 hover:text-zinc-300'}`}>Fade In</button>
          <button onClick={() => onSetGlobalTransition('instant')} className={`flex-1 text-[8px] py-1 rounded-md transition-colors ${globalTransition === 'instant' ? 'bg-red-500/20 text-red-400' : 'bg-[#1e1f22] text-zinc-500 hover:text-zinc-300'}`}>Instant</button>
        </div>
      </div>
      <div className="px-2 pb-2 shrink-0">
        <button
          onClick={onPushAll}
          disabled={queue.length === 0}
          className="w-full py-2.5 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-30 disabled:cursor-not-allowed text-white text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
        >
          <Zap className="w-3.5 h-3.5" /> Push All Live{queue.length > 0 ? ` (${queue.length})` : ''}
        </button>
      </div>
    </div>
  )
}
