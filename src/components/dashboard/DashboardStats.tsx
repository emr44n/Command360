'use client'
import { useEffect, useState, useRef } from 'react'
import { Presentation, Users, MessageSquare, Activity } from 'lucide-react'

interface StatsProps {
  totalPresentations: number
  totalSessions: number
  totalParticipants: number
  totalResponses: number
  activeSessions: number
}

function AnimatedCounter({ target, duration = 1000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (hasAnimated.current) return
    hasAnimated.current = true
    if (target === 0) { setCount(0); return }

    const startTime = performance.now()
    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration])

  return <span>{count.toLocaleString()}</span>
}

const STATS_CONFIG = [
  {
    key: 'presentations',
    label: 'Decks',
    icon: Presentation,
    gradient: 'from-primary/10 to-primary/5',
    iconBg: 'bg-primary/15',
    iconColor: 'text-primary',
    valueColor: 'text-primary',
    accentColor: 'via-primary/40',
  },
  {
    key: 'sessions',
    label: 'Sessions',
    icon: Activity,
    gradient: 'from-blue-500/10 to-blue-500/5',
    iconBg: 'bg-blue-500/15',
    iconColor: 'text-blue-500',
    valueColor: 'text-blue-600 dark:text-blue-400',
    accentColor: 'via-blue-500/40',
  },
  {
    key: 'participants',
    label: 'Participants',
    icon: Users,
    gradient: 'from-emerald-500/10 to-emerald-500/5',
    iconBg: 'bg-emerald-500/15',
    iconColor: 'text-emerald-500',
    valueColor: 'text-emerald-600 dark:text-emerald-400',
    accentColor: 'via-emerald-500/40',
  },
  {
    key: 'responses',
    label: 'Responses',
    icon: MessageSquare,
    gradient: 'from-amber-500/10 to-amber-500/5',
    iconBg: 'bg-amber-500/15',
    iconColor: 'text-amber-500',
    valueColor: 'text-amber-600 dark:text-amber-400',
    accentColor: 'via-amber-500/40',
  },
]

export function DashboardStats({ totalPresentations, totalSessions, totalParticipants, totalResponses, activeSessions }: StatsProps) {
  const values: Record<string, number> = {
    presentations: totalPresentations,
    sessions: totalSessions,
    participants: totalParticipants,
    responses: totalResponses,
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {STATS_CONFIG.map((stat) => (
        <div
          key={stat.key}
          className={`relative overflow-hidden bg-gradient-to-br ${stat.gradient} border border-border rounded-2xl p-5 transition-all duration-200 hover:shadow-md hover:border-border/80 hover:-translate-y-0.5 group dark:[box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.03)_inset]`}
        >
          {/* Top accent line */}
          <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${stat.accentColor} to-transparent`} />

          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center transition-transform group-hover:scale-110 duration-200`}>
              <stat.icon className={`w-[18px] h-[18px] ${stat.iconColor}`} />
            </div>
            {stat.key === 'sessions' && activeSessions > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                </span>
                {activeSessions} live
              </span>
            )}
          </div>
          <p className={`text-2xl font-bold ${stat.valueColor} tabular-nums`}>
            <AnimatedCounter target={values[stat.key]} />
          </p>
          <p className="text-[10px] uppercase tracking-[0.15em] font-medium text-muted-foreground mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}
