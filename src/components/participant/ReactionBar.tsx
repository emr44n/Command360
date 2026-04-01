'use client'

import { useState, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

interface ReactionBarProps {
  sessionId: string
  channelName?: string
}

const REACTIONS = [
  { emoji: '\uD83D\uDC4D', label: 'Thumbs Up' },
  { emoji: '\u2764\uFE0F', label: 'Heart' },
  { emoji: '\uD83D\uDE02', label: 'Laugh' },
  { emoji: '\uD83E\uDD14', label: 'Thinking' },
  { emoji: '\uD83D\uDC4F', label: 'Clap' },
]

interface FloatingEmoji {
  id: number
  emoji: string
  x: number
}

export function ReactionBar({ sessionId, channelName }: ReactionBarProps) {
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([])
  const nextId = useRef(0)
  const supabase = createClient()

  const sendReaction = useCallback(async (emoji: string) => {
    // Add floating animation
    const id = nextId.current++
    const x = 10 + Math.random() * 80 // random horizontal position %
    setFloatingEmojis(prev => [...prev, { id, emoji, x }])

    // Remove after animation
    setTimeout(() => {
      setFloatingEmojis(prev => prev.filter(e => e.id !== id))
    }, 2000)

    // Broadcast via Supabase Realtime
    const channel = supabase.channel(channelName || `reactions-${sessionId}`)
    await channel.send({
      type: 'broadcast',
      event: 'reaction',
      payload: { emoji, sessionId, timestamp: Date.now() },
    })
  }, [sessionId, channelName, supabase])

  return (
    <div className="relative">
      {/* Floating emojis */}
      <div className="absolute bottom-full left-0 right-0 h-32 pointer-events-none overflow-hidden">
        {floatingEmojis.map(fe => (
          <span
            key={fe.id}
            className="absolute text-2xl animate-float-up"
            style={{
              left: `${fe.x}%`,
              bottom: 0,
              animation: 'floatUp 2s ease-out forwards',
            }}
          >
            {fe.emoji}
          </span>
        ))}
      </div>

      {/* Reaction buttons */}
      <div className="flex items-center justify-center gap-2 bg-card border border-border rounded-full px-4 py-2 shadow-lg">
        {REACTIONS.map(r => (
          <button
            key={r.label}
            onClick={() => sendReaction(r.emoji)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-xl hover:bg-muted/80 hover:scale-125 active:scale-95 transition-all duration-200"
            title={r.label}
          >
            {r.emoji}
          </button>
        ))}
      </div>

      {/* Keyframe animation */}
      <style jsx>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-120px) scale(1.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
