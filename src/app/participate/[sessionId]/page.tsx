'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ParticipantView } from '@/components/participant/ParticipantView'
import { RoomSceneView } from '@/components/participant/RoomSceneView'
import { WaitingScreen } from '@/components/participant/WaitingScreen'
import type { Session } from '@/types/session'
import type { Slide } from '@/types/slide'

export default function ParticipatePage() {
  const params = useParams()
  const sessionId = String(params.sessionId)
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  const [slides, setSlides] = useState<Slide[]>([])
  const [participantId, setParticipantId] = useState<string | null>(null)
  const [clientToken, setClientToken] = useState<string | null>(null)
  const [displayName, setDisplayName] = useState<string | null>(null)
  const [scenarioTitle, setScenarioTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Get participant data from sessionStorage
    const pid = sessionStorage.getItem('participant_id')
    const token = sessionStorage.getItem('client_token')
    const name = sessionStorage.getItem('display_name')
    const storedSessionId = sessionStorage.getItem('session_id')

    if (!pid || !token || !name || storedSessionId !== sessionId) {
      router.push('/join')
      return
    }

    setParticipantId(pid)
    setClientToken(token)
    setDisplayName(name)

    loadSession()
  }, [sessionId])

  // Keep live_scene_ids fresh so a participant who joined BEFORE the presenter
  // went live still flips into the multi-scene room picker when scenes go live.
  useEffect(() => {
    const channel = supabase.channel(`session:${sessionId}`)
    channel
      .on('broadcast', { event: 'LIVE_SCENES_UPDATED' }, ({ payload }) => {
        if (payload.session_id === sessionId) {
          setSession((prev) => (prev ? { ...prev, live_scene_ids: payload.live_scene_ids || [] } : prev))
        }
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [sessionId])

  async function loadSession() {
    const { data: sess } = await supabase
      .from('sessions')
      .select('*, presentations(title)')
      .eq('id', sessionId)
      .single()

    if (!sess) {
      router.push('/join')
      return
    }

    const { data: slideData } = await supabase
      .from('slides')
      .select('*')
      .eq('presentation_id', sess.presentation_id)
      .order('position')

    setScenarioTitle((sess as { presentations?: { title?: string } }).presentations?.title || '')
    setSession(sess as Session)
    setSlides(slideData || [])
    setLoading(false)
  }

  if (loading || !session || !participantId || !clientToken || !displayName) {
    return <WaitingScreen message="Loading session..." />
  }

  // Multi-scene live studio session → per-room scene picker (rooms each choose a
  // scene). Identified by the presenter having put scenes live.
  const studioScenes = slides.filter((s) => s.slide_type === 'studio')
  const isMultiSceneRoom = studioScenes.length > 0 && (session.live_scene_ids?.length ?? 0) > 0
  if (isMultiSceneRoom) {
    return (
      <RoomSceneView
        session={session}
        scenes={studioScenes}
        scenarioTitle={scenarioTitle}
        participantId={participantId}
        displayName={displayName}
      />
    )
  }

  return (
    <ParticipantView
      session={session}
      slides={slides}
      participantId={participantId}
      clientToken={clientToken}
      displayName={displayName}
    />
  )
}
