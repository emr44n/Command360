'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Session } from '@/types/session'
import type { Slide, StudioContent } from '@/types/slide'
import { StudioInput } from './slide-inputs/StudioInput'
import { WaitingScreen } from './WaitingScreen'
import { BrandMark } from '@/components/site/BrandMark'
import { STUDIO_DEFAULT_BG } from '@/lib/studio/default-canvas'
import { Monitor, ChevronLeft, Radio } from 'lucide-react'

interface Props {
  session: Session
  /** all studio scenes in the scenario */
  scenes: Slide[]
  scenarioTitle: string
  participantId: string
  displayName: string
}

/**
 * Per-room view for a multi-scene live session. Each room (PC) joins with the
 * same code, sees the scenario details + the scenes the presenter has put live,
 * and picks ONE to show full-screen. Rooms choose independently, so different
 * PCs can each drive a different scene of the same scenario. The presenter can
 * add/remove live scenes at any time (LIVE_SCENES_UPDATED) and the picker
 * refreshes; the live content of the chosen scene updates via StudioInput's own
 * realtime channel.
 */
export function RoomSceneView({ session, scenes, scenarioTitle, participantId, displayName }: Props) {
  const [liveSceneIds, setLiveSceneIds] = useState<string[]>(session.live_scene_ids || [])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [sessionEnded, setSessionEnded] = useState(false)

  // Subscribe for live-scene set changes + session end
  useEffect(() => {
    const supabase = createClient()
    const channel = supabase.channel(`session:${session.id}`)
    channel
      .on('broadcast', { event: 'LIVE_SCENES_UPDATED' }, ({ payload }) => {
        if (payload.session_id === session.id) setLiveSceneIds(payload.live_scene_ids || [])
      })
      .on('broadcast', { event: 'SESSION_ENDED' }, () => setSessionEnded(true))
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ role: 'participant', participant_id: participantId, display_name: displayName })
        }
      })
    return () => { supabase.removeChannel(channel) }
  }, [session.id, participantId, displayName])

  const liveScenes = useMemo(
    () => liveSceneIds.map(id => scenes.find(s => s.id === id)).filter((s): s is Slide => !!s),
    [liveSceneIds, scenes]
  )

  // If the room's chosen scene is pulled from live, drop back to the picker
  useEffect(() => {
    if (selectedId && !liveSceneIds.includes(selectedId)) setSelectedId(null)
  }, [liveSceneIds, selectedId])

  const selectedScene = selectedId ? scenes.find(s => s.id === selectedId) ?? null : null

  const noop = useCallback(async () => {}, [])

  if (sessionEnded) {
    return (
      <div className="min-h-screen bg-[#0F1216] flex items-center justify-center relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_30%,rgba(201,36,26,0.12),transparent)]" />
        </div>
        <div className="text-center space-y-6 px-6 relative z-10">
          <div className="flex flex-col items-center gap-3">
            <BrandMark size={56} />
            <span className="ff-wordmark text-sm text-[#9aa0a8] tracking-widest uppercase">Command 360</span>
          </div>
          <h1 className="text-3xl font-bold text-white">This session has ended</h1>
          <p className="text-[#9aa0a8]">Thank you for participating</p>
        </div>
      </div>
    )
  }

  // ── Selected scene → full-screen StudioInput ──
  if (selectedScene) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <div className="bg-card/80 backdrop-blur-sm border-b border-border px-3 py-1.5 flex items-center justify-between gap-2">
          <button
            onClick={() => setSelectedId(null)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Scenes
          </button>
          <span className="text-sm font-semibold text-foreground truncate">{selectedScene.title || 'Scene'}</span>
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2E9E63] animate-pulse" /> Live
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-3">
          <StudioInput key={selectedScene.id} slide={selectedScene} sessionId={session.id} onSubmit={noop} />
        </div>
      </div>
    )
  }

  // ── Scene picker ──
  return (
    <div className="min-h-screen bg-[#0F1216] text-white flex flex-col">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(201,36,26,0.12),transparent)]" />
      </div>

      {/* Header */}
      <header className="relative px-5 py-4 border-b border-white/10 flex items-center gap-3">
        <BrandMark size={24} />
        <div className="min-w-0">
          <div className="ff-mono text-[10px] uppercase tracking-[0.14em] text-[#C9241A]">Live scenario</div>
          <h1 className="text-base font-bold text-white truncate leading-tight">{scenarioTitle || 'Command Studio exercise'}</h1>
        </div>
        <div className="ml-auto flex items-center gap-1.5 ff-mono text-[10px] uppercase tracking-wider text-[#9aa0a8]">
          <Radio className="w-3.5 h-3.5 text-[#2E9E63]" /> {session.room_code}
        </div>
      </header>

      <div className="relative flex-1 px-5 py-7 max-w-5xl mx-auto w-full">
        <div className="mb-5">
          <h2 className="text-lg font-bold text-white">Choose a scene for this screen</h2>
          <p className="text-sm text-[#9aa0a8] mt-1">
            Pick the scene to show full-screen in this room. Other rooms can show a different scene of the same scenario.
          </p>
        </div>

        {liveScenes.length === 0 ? (
          <WaitingScreen message="Waiting for the presenter…" subMessage="Scenes will appear here once they go live." />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {liveScenes.map((scene, i) => (
              <button
                key={scene.id}
                onClick={() => setSelectedId(scene.id)}
                className="group text-left border border-white/12 bg-[#0A0C0F] hover:border-[#C9241A]/60 transition-colors overflow-hidden"
              >
                <SceneThumb scene={scene} />
                <div className="p-3 flex items-center gap-2">
                  <span className="ff-mono text-[11px] text-[#6f757c] w-5 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-sm font-semibold text-white truncate flex-1 group-hover:text-[#C9241A] transition-colors">
                    {scene.title || `Scene ${i + 1}`}
                  </span>
                  <Monitor className="w-4 h-4 text-[#6f757c] group-hover:text-[#C9241A] transition-colors shrink-0" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Static scene thumbnail (no realtime — just the scene's authored layers) ─── */
function SceneThumb({ scene }: { scene: Slide }) {
  const content = scene.content as StudioContent
  const canvas = content?.canvas
  const layers = (content?.layers || []).filter(l => l.visible).sort((a, b) => a.zIndex - b.zIndex)
  return (
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16 / 9', backgroundColor: canvas?.backgroundColor || STUDIO_DEFAULT_BG }}>
      {layers.map(layer => {
        const base: React.CSSProperties = {
          position: 'absolute',
          left: `${layer.x}%`, top: `${layer.y}%`,
          width: `${layer.width}%`, height: `${layer.height}%`,
          opacity: layer.opacity,
          transform: `rotate(${layer.rotation}deg)`,
          zIndex: layer.zIndex,
          overflow: 'hidden',
        }
        if (layer.type === 'image' && layer.src) {
          return <div key={layer.id} style={base}><img src={layer.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
        }
        if (layer.type === 'text') {
          return (
            <div key={layer.id} style={{ ...base, display: 'flex', alignItems: 'center', justifyContent: 'center', color: layer.color || '#fff', fontSize: layer.fontSize ? `${Math.max(6, layer.fontSize * 0.25)}px` : '8px', fontWeight: layer.fontWeight || '400', textAlign: 'center' }}>
              {layer.text}
            </div>
          )
        }
        if (layer.type === 'shape') {
          return <div key={layer.id} style={{ ...base, backgroundColor: layer.fillTransparent ? 'transparent' : (layer.color || '#4a5568'), border: layer.borderWidth ? `${layer.borderWidth}px solid ${layer.borderColor || '#fff'}` : undefined }} />
        }
        return null
      })}
    </div>
  )
}
