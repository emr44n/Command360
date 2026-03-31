'use client'
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

interface CollaboratorInfo {
  userId: string
  displayName: string
  color: string
  selectedLayerId: string | null
  lastSeen: string
}

export function useStudioCollaboration(presentationId: string, userId: string, displayName: string) {
  const [collaborators, setCollaborators] = useState<CollaboratorInfo[]>([])
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase.channel(`studio:${presentationId}`)

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        const users: CollaboratorInfo[] = []
        for (const [, presences] of Object.entries(state)) {
          for (const p of presences as unknown as CollaboratorInfo[]) {
            if (p.userId !== userId) users.push(p)
          }
        }
        setCollaborators(users)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            userId,
            displayName,
            color: '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'),
            selectedLayerId: null,
            lastSeen: new Date().toISOString(),
          })
        }
      })

    return () => { supabase.removeChannel(channel) }
  }, [presentationId, userId, displayName, supabase])

  const updatePresence = useCallback(async (data: Partial<CollaboratorInfo>) => {
    const channel = supabase.channel(`studio:${presentationId}`)
    await channel.track({ userId, displayName, ...data, lastSeen: new Date().toISOString() })
  }, [presentationId, userId, displayName, supabase])

  return { collaborators, updatePresence }
}
