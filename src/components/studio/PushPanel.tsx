'use client'
import { useState } from 'react'
import type { StudioLayer } from '@/types/slide'
import { Zap, X, ChevronDown, ImageIcon, VideoIcon, Type, Square, Volume2 } from 'lucide-react'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

/* Type color map for visual distinction */
const TYPE_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  image: { bg: 'bg-[#3E6DC4]/20', text: 'text-[#3E6DC4] dash-light:text-[#3360BC]', label: 'IMG' },
  video: { bg: 'bg-[#6a5ea8]/20', text: 'text-[#6a5ea8] dash-light:text-[#5B4F98]', label: 'VID' },
  text: { bg: 'bg-white/10 dash-light:bg-black/[0.04]', text: 'text-white dash-light:text-[#16191E]', label: 'TXT' },
  shape: { bg: 'bg-[#9aa0a8]/20', text: 'text-[#9aa0a8] dash-light:text-[#5B6169]', label: 'SHP' },
  audio: { bg: 'bg-[#2E9E63]/20', text: 'text-[#2E9E63] dash-light:text-[#1F8F54]', label: 'AUD' },
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
      <div className="px-3 py-2 border-b border-[#2b2d31] dash-light:border-black/10 shrink-0">
        <h3 className="text-[9px] font-bold text-[#9aa0a8] dash-light:text-[#5B6169] uppercase tracking-wider">Push to Live</h3>
        {queue.length > 0 && <p className="text-[8px] text-[#9aa0a8] dash-light:text-[#5B6169] mt-0.5">{queue.length} item{queue.length !== 1 ? 's' : ''} ready</p>}
      </div>

      {/* Queue list */}
      <div className="flex-1 overflow-y-auto p-2">
        {queue.length === 0 ? (
          <div className="text-center py-8">
            <Zap className="w-5 h-5 text-[#9aa0a8] dash-light:text-[#5B6169] mx-auto mb-2" />
            <p className="text-[9px] text-[#9aa0a8] dash-light:text-[#5B6169]">Drop assets on the canvas</p>
            <p className="text-[8px] text-[#9aa0a8] dash-light:text-[#5B6169] mt-1">They&apos;ll appear here ready to push</p>
          </div>
        ) : (
          <div className="space-y-1">
            {queue.map(item => {
              const tc = TYPE_COLORS[item.layer.type] || TYPE_COLORS.image
              const isExpanded = expandedId === item.layer.id
              return (
                <div key={item.layer.id} className="bg-[#2b2d31] dash-light:bg-white rounded-none overflow-hidden">
                  {/* Main row */}
                  <div className="flex items-center gap-1.5 px-2 py-1.5">
                    {/* Type badge */}
                    <div className={`w-5 h-5 rounded-none flex items-center justify-center shrink-0 ${tc.bg} ${tc.text}`}>
                      {TYPE_ICONS[item.layer.type]}
                    </div>
                    {/* Name */}
                    <span className="flex-1 text-[9px] text-[#9aa0a8] dash-light:text-[#5B6169] truncate">{item.layer.name}</span>
                    {/* Expand for options */}
                    <Tooltip><TooltipTrigger asChild>
                    <button onClick={() => setExpandedId(isExpanded ? null : item.layer.id)} className="p-0.5 text-[#9aa0a8] dash-light:text-[#5B6169] hover:text-white dash-light:hover:text-[#16191E] transition-colors">
                      <ChevronDown className={`w-2.5 h-2.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                    </TooltipTrigger><TooltipContent>Options</TooltipContent></Tooltip>
                    {/* Individual push */}
                    <Tooltip><TooltipTrigger asChild>
                    <button onClick={() => onPushItem(item.layer.id)} className="p-1 rounded-none bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white transition-colors">
                      <Zap className="w-2.5 h-2.5" />
                    </button>
                    </TooltipTrigger><TooltipContent>Push this item live</TooltipContent></Tooltip>
                    {/* Remove */}
                    <Tooltip><TooltipTrigger asChild>
                    <button onClick={() => onRemoveItem(item.layer.id)} className="p-0.5 text-[#9aa0a8] dash-light:text-[#5B6169] hover:text-red-400 transition-colors">
                      <X className="w-2.5 h-2.5" />
                    </button>
                    </TooltipTrigger><TooltipContent>Remove from queue</TooltipContent></Tooltip>
                  </div>
                  {/* Expanded options */}
                  {isExpanded && (
                    <div className="px-2 pb-2 pt-0.5 border-t border-[#3f4147] dash-light:border-black/10">
                      <p className="text-[7px] text-[#9aa0a8] dash-light:text-[#5B6169] uppercase tracking-wider mb-1">Transition</p>
                      <div className="flex gap-1">
                        <button
                          onClick={() => onUpdateTransition(item.layer.id, 'fade')}
                          className={`flex-1 text-[8px] py-1 rounded-none transition-colors ${item.transition === 'fade' ? 'bg-red-500/20 text-red-400' : 'bg-[#1e1f22] dash-light:bg-[#F5F2EB] text-[#9aa0a8] dash-light:text-[#5B6169] hover:text-white dash-light:hover:text-[#16191E]'}`}
                        >
                          Fade In
                        </button>
                        <button
                          onClick={() => onUpdateTransition(item.layer.id, 'instant')}
                          className={`flex-1 text-[8px] py-1 rounded-none transition-colors ${item.transition === 'instant' ? 'bg-red-500/20 text-red-400' : 'bg-[#1e1f22] dash-light:bg-[#F5F2EB] text-[#9aa0a8] dash-light:text-[#5B6169] hover:text-white dash-light:hover:text-[#16191E]'}`}
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
      <div className="p-2 border-t border-[#2b2d31] dash-light:border-black/10 shrink-0 space-y-1.5">
        <p className="text-[7px] text-[#9aa0a8] dash-light:text-[#5B6169] uppercase tracking-wider">Default Transition</p>
        <div className="flex gap-1">
          <button onClick={() => onSetGlobalTransition('fade')} className={`flex-1 text-[8px] py-1 rounded-none transition-colors ${globalTransition === 'fade' ? 'bg-red-500/20 text-red-400' : 'bg-[#1e1f22] dash-light:bg-[#F5F2EB] text-[#9aa0a8] dash-light:text-[#5B6169] hover:text-white dash-light:hover:text-[#16191E]'}`}>Fade In</button>
          <button onClick={() => onSetGlobalTransition('instant')} className={`flex-1 text-[8px] py-1 rounded-none transition-colors ${globalTransition === 'instant' ? 'bg-red-500/20 text-red-400' : 'bg-[#1e1f22] dash-light:bg-[#F5F2EB] text-[#9aa0a8] dash-light:text-[#5B6169] hover:text-white dash-light:hover:text-[#16191E]'}`}>Instant</button>
        </div>
      </div>
      <div className="px-2 pb-2 shrink-0">
        <button
          onClick={onPushAll}
          disabled={queue.length === 0}
          className="w-full py-2.5 rounded-none bg-red-600 hover:bg-red-500 disabled:opacity-30 disabled:cursor-not-allowed text-white text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
        >
          <Zap className="w-3.5 h-3.5" /> Push All Live{queue.length > 0 ? ` (${queue.length})` : ''}
        </button>
      </div>
    </div>
  )
}
