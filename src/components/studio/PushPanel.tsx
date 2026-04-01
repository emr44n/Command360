'use client'
import { useState } from 'react'
import type { StudioLayer } from '@/types/slide'
import { Zap, X } from 'lucide-react'

interface PushPanelProps {
  layers: StudioLayer[]
  pendingLayers: StudioLayer[]
  onAddPendingLayer: (layer: StudioLayer) => void
  onRemovePendingLayer: (id: string) => void
  onPush: (layers: StudioLayer[], transition: 'fade' | 'instant') => void
  onClear: () => void
}

export function PushPanel({ pendingLayers, onRemovePendingLayer, onPush, onClear }: PushPanelProps) {
  const [transition, setTransition] = useState<'fade' | 'instant'>('fade')

  return (
    <div className="w-48 shrink-0 bg-[#1e1f22] border-l border-[#2b2d31] flex flex-col overflow-hidden">
      <div className="px-2 py-2 border-b border-[#2b2d31]">
        <h3 className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Push to Live</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {pendingLayers.length === 0 ? (
          <p className="text-[9px] text-zinc-600 text-center py-6">Drag assets onto the canvas to add them to the push queue</p>
        ) : (
          <div className="space-y-1">
            {pendingLayers.map(layer => (
              <div key={layer.id} className="flex items-center gap-1.5 bg-[#2b2d31] rounded-md px-2 py-1.5 text-[9px] text-zinc-300">
                <span className="flex-1 truncate">{layer.name}</span>
                <button onClick={() => onRemovePendingLayer(layer.id)} className="text-zinc-600 hover:text-red-400 transition-colors"><X className="w-2.5 h-2.5" /></button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="p-2 border-t border-[#2b2d31] space-y-2">
        <div className="flex gap-1">
          <button onClick={() => setTransition('fade')} className={`flex-1 text-[8px] py-1 rounded-md transition-colors ${transition === 'fade' ? 'bg-red-500/20 text-red-400' : 'bg-[#2b2d31] text-zinc-500'}`}>Fade In</button>
          <button onClick={() => setTransition('instant')} className={`flex-1 text-[8px] py-1 rounded-md transition-colors ${transition === 'instant' ? 'bg-red-500/20 text-red-400' : 'bg-[#2b2d31] text-zinc-500'}`}>Instant</button>
        </div>
        <button onClick={() => onPush(pendingLayers, transition)} disabled={pendingLayers.length === 0}
          className="w-full py-2 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-30 disabled:cursor-not-allowed text-white text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5">
          <Zap className="w-3 h-3" /> Push Live
        </button>
        {pendingLayers.length > 0 && (
          <button onClick={onClear} className="w-full py-1 text-[9px] text-zinc-500 hover:text-zinc-300 transition-colors">Clear all</button>
        )}
      </div>
    </div>
  )
}
