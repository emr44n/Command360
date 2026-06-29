'use client'

import { useState, useCallback } from 'react'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { QRCodeSVG } from 'qrcode.react'
import { Radio, Check, Play } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

export interface LiveScene {
  id: string
  title: string
}

interface Props {
  session: { id: string; room_code: string }
  channelRef: React.RefObject<RealtimeChannel | null>
  scenes: LiveScene[]
  initialLiveSceneIds: string[]
  /** scene the presenter is currently driving (highlighted) */
  currentSceneId?: string
  /** click a scene to drive it (Phase 4) — optional */
  onDrive?: (sceneId: string) => void
  /** report the live-scene set upward so it survives a director remount */
  onChange?: (liveSceneIds: string[]) => void
}

/**
 * Presenter control for multi-scene live sessions. Shows the join code + QR and
 * lets the presenter toggle which studio scenes are broadcast "live". Joining
 * rooms then pick one of the live scenes to show full-screen. Toggling persists
 * `live_scene_ids` on the session and broadcasts LIVE_SCENES_UPDATED so any open
 * join pickers refresh.
 */
export function LiveScenesPanel({ session, channelRef, scenes, initialLiveSceneIds, currentSceneId, onDrive, onChange }: Props) {
  const [liveIds, setLiveIds] = useState<string[]>(initialLiveSceneIds)
  const [saving, setSaving] = useState(false)

  const joinUrl = typeof window !== 'undefined' ? `${window.location.origin}/join/${session.room_code}` : ''
  const joinOrigin = typeof window !== 'undefined' ? window.location.origin : ''

  const persist = useCallback(async (next: string[]) => {
    setSaving(true)
    try {
      await fetch(`/api/sessions/${session.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ live_scene_ids: next }),
      })
      channelRef.current?.send({
        type: 'broadcast', event: 'LIVE_SCENES_UPDATED',
        payload: { session_id: session.id, live_scene_ids: next },
      })
    } finally {
      setSaving(false)
    }
  }, [session.id, channelRef])

  const toggle = useCallback((sceneId: string) => {
    setLiveIds(prev => {
      const next = prev.includes(sceneId) ? prev.filter(id => id !== sceneId) : [...prev, sceneId]
      persist(next)
      onChange?.(next)
      return next
    })
  }, [persist, onChange])

  return (
    <div className="flex flex-col gap-3 text-zinc-200">
      {/* Join code + QR */}
      <div className="flex items-center gap-3 p-3 bg-[#202227] dash-light:bg-white border border-zinc-700/60 dash-light:border-black/10 rounded-none">
        <div className="bg-white p-1 rounded-none shrink-0">
          <QRCodeSVG value={joinUrl} size={56} />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-zinc-500 dash-light:text-[#5B6169] mb-0.5">
            <Radio className="w-3 h-3 text-[#C9241A]" /> Join at {joinOrigin.replace(/^https?:\/\//, '')}/join
          </div>
          <div className="text-2xl font-mono font-bold text-white dash-light:text-[#16191E] tracking-[0.18em] leading-none">
            {session.room_code}
          </div>
        </div>
      </div>

      {/* Scene live toggles */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dash-light:text-[#5B6169]">
            Live scenes ({liveIds.length}/{scenes.length})
          </span>
          {saving && <span className="text-[9px] text-zinc-600">Saving…</span>}
        </div>
        <p className="text-[10px] text-zinc-500 dash-light:text-[#5B6169] mb-2 leading-snug">
          Switch on the scenes you want rooms to be able to join. Each room picks one to show full-screen.
        </p>
        <div className="flex flex-col gap-1">
          {scenes.map((scene, i) => {
            const isLive = liveIds.includes(scene.id)
            const isCurrent = scene.id === currentSceneId
            return (
              <div
                key={scene.id}
                className={cn(
                  'flex items-center gap-2 px-2 py-1.5 rounded-none border transition-colors',
                  isCurrent ? 'border-[#C9241A]/60 bg-[#C9241A]/10' : 'border-zinc-700/50 dash-light:border-black/10 bg-[#202227] dash-light:bg-white',
                )}
              >
                <span className="text-[10px] font-mono text-zinc-500 w-4 shrink-0">{i + 1}</span>
                {onDrive ? (
                  <Tooltip><TooltipTrigger asChild>
                    <button
                      onClick={() => onDrive(scene.id)}
                      className="flex-1 min-w-0 text-left text-[12px] text-zinc-200 dash-light:text-[#16191E] truncate hover:text-white transition-colors flex items-center gap-1.5"
                    >
                      {isCurrent && <Play className="w-2.5 h-2.5 text-[#C9241A] shrink-0" />}
                      {scene.title || `Scene ${i + 1}`}
                    </button>
                  </TooltipTrigger><TooltipContent>Drive this scene</TooltipContent></Tooltip>
                ) : (
                  <span className="flex-1 min-w-0 text-[12px] text-zinc-200 dash-light:text-[#16191E] truncate flex items-center gap-1.5">
                    {isCurrent && <Play className="w-2.5 h-2.5 text-[#C9241A] shrink-0" />}
                    {scene.title || `Scene ${i + 1}`}
                  </span>
                )}
                {/* live toggle */}
                <button
                  onClick={() => toggle(scene.id)}
                  role="switch"
                  aria-checked={isLive}
                  aria-label={`${isLive ? 'Stop' : 'Go'} live: ${scene.title || `Scene ${i + 1}`}`}
                  className={cn(
                    'relative w-9 h-5 rounded-full transition-colors shrink-0',
                    isLive ? 'bg-[#2E9E63]' : 'bg-zinc-600 dash-light:bg-black/20',
                  )}
                >
                  <span
                    className={cn(
                      'absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform flex items-center justify-center',
                      isLive && 'translate-x-4',
                    )}
                  >
                    {isLive && <Check className="w-2.5 h-2.5 text-[#2E9E63]" />}
                  </span>
                </button>
              </div>
            )
          })}
          {scenes.length === 0 && (
            <p className="text-[11px] text-zinc-600 italic py-2">No studio scenes in this scenario.</p>
          )}
        </div>
      </div>
    </div>
  )
}
