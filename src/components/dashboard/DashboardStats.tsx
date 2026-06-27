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
    label: 'Classrooms',
    icon: Presentation,
    accent: '#C9241A',
  },
  {
    key: 'sessions',
    label: 'Activity Runs',
    icon: Activity,
    accent: '#3E6DC4',
  },
  {
    key: 'participants',
    label: 'Participants',
    icon: Users,
    accent: '#2E9E63',
  },
  {
    key: 'responses',
    label: 'Responses',
    icon: MessageSquare,
    accent: '#c98a2a',
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
    <div className="grid grid-cols-2 lg:grid-cols-4 bg-[#16191E] border-t border-l border-white/12">
      {STATS_CONFIG.map((stat) => (
        <div
          key={stat.key}
          className="v5-pop relative overflow-hidden border-r border-b border-white/12 p-5 group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 flex items-center justify-center" style={{ backgroundColor: `${stat.accent}26` }}>
              <stat.icon className="w-[18px] h-[18px]" style={{ color: stat.accent }} />
            </div>
            {stat.key === 'sessions' && activeSessions > 0 && (
              <span className="ff-mono inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#2E9E63]/10 text-[#2E9E63] text-[10px] font-bold uppercase tracking-[0.1em]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full bg-[#2E9E63] opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 bg-[#2E9E63]" />
                </span>
                {activeSessions} live
              </span>
            )}
          </div>
          <p className="ff-display text-3xl font-extrabold text-white tabular-nums">
            <AnimatedCounter target={values[stat.key]} />
          </p>
          <p className="ff-mono text-[10px] uppercase tracking-[0.15em] font-medium text-[#9aa0a8] mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}
