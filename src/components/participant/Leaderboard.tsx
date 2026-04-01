'use client'

import { Trophy, Medal } from 'lucide-react'

interface LeaderboardEntry {
  id: string
  name: string
  score: number
}

interface LeaderboardProps {
  participants: LeaderboardEntry[]
  title?: string
}

const MEDAL_COLORS = ['text-yellow-500', 'text-gray-400', 'text-amber-600']

export function Leaderboard({ participants, title = 'Leaderboard' }: LeaderboardProps) {
  const sorted = [...participants].sort((a, b) => b.score - a.score).slice(0, 5)

  if (sorted.length === 0) {
    return null
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-yellow-500" />
        <h3 className="font-semibold text-foreground text-sm">{title}</h3>
      </div>

      <div className="space-y-2">
        {sorted.map((entry, i) => (
          <div
            key={entry.id}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
              i === 0 ? 'bg-yellow-500/5 border border-yellow-500/20' :
              i < 3 ? 'bg-muted/50' : ''
            }`}
          >
            {/* Rank */}
            <div className="w-6 text-center shrink-0">
              {i < 3 ? (
                <Medal className={`w-5 h-5 ${MEDAL_COLORS[i]}`} />
              ) : (
                <span className="text-sm font-bold text-muted-foreground">{i + 1}</span>
              )}
            </div>

            {/* Name */}
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${i === 0 ? 'text-yellow-700 dark:text-yellow-400' : 'text-foreground'}`}>
                {entry.name || 'Anonymous'}
              </p>
            </div>

            {/* Score */}
            <div className={`text-sm font-bold tabular-nums ${
              i === 0 ? 'text-yellow-600 dark:text-yellow-400' :
              i < 3 ? 'text-foreground' : 'text-muted-foreground'
            }`}>
              {entry.score.toLocaleString()} pts
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
