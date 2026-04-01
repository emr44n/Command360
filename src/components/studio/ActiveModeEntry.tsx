'use client'
import { useState } from 'react'
import { Radio, X } from 'lucide-react'

interface Props {
  sceneName: string
  onStart: (presenterName: string) => void
  onCancel: () => void
}

export function ActiveModeEntry({ sceneName, onStart, onCancel }: Props) {
  const [name, setName] = useState('')

  return (
    <div className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#1e1f22] border border-[#3f4147] rounded-xl p-6 max-w-sm w-full shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-600/20 flex items-center justify-center">
              <Radio className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Enter Active Mode</h3>
              <p className="text-[10px] text-zinc-500">{sceneName}</p>
            </div>
          </div>
          <button onClick={onCancel} className="p-1 text-zinc-500 hover:text-white rounded-md hover:bg-white/10 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[11px] text-zinc-400 mb-4 leading-relaxed">
          You&apos;re about to start a live exercise. Any changes made during the session (new assets, triggered events) will not be saved to the original scene.
        </p>

        <div className="mb-4">
          <label className="text-[10px] text-zinc-500 font-medium mb-1.5 block">Presenter Name (optional)</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') onStart(name) }}
            placeholder="Enter your name..."
            className="w-full h-8 px-3 text-[11px] bg-[#2b2d31] border border-[#3f4147] rounded-lg text-white placeholder:text-zinc-600 outline-none focus:border-red-500/50 transition-colors"
          />
        </div>

        <div className="flex gap-2">
          <button onClick={onCancel} className="flex-1 py-2 text-[11px] font-medium rounded-lg bg-[#2b2d31] text-zinc-300 hover:bg-[#35363c] transition-colors">
            Cancel
          </button>
          <button onClick={() => onStart(name)} className="flex-1 py-2 text-[11px] font-medium rounded-lg bg-red-600 text-white hover:bg-red-500 transition-colors">
            Start Exercise
          </button>
        </div>
      </div>
    </div>
  )
}
