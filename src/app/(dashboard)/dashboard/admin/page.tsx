'use client'

import { useState, useEffect } from 'react'
import { BarChart2, Users, Radio, FileText, Loader2 } from 'lucide-react'

interface AdminStats {
  presentationCount: number
  sessionCount: number
  participantCount: number
  responseCount: number
  recentPresentations: { id: string; title: string; created_at: string; user_id: string }[]
  recentSessions: { id: string; room_code: string; status: string; started_at: string; host_user_id: string }[]
}

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(d => setStats(d))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="p-6 md:p-8 max-w-6xl mx-auto">
        <p className="text-muted-foreground">Failed to load admin stats.</p>
      </div>
    )
  }

  const statCards = [
    { label: 'Classrooms', value: stats.presentationCount, icon: FileText, color: 'text-blue-500 bg-blue-500/10' },
    { label: 'Activity', value: stats.sessionCount, icon: Radio, color: 'text-emerald-500 bg-emerald-500/10' },
    { label: 'Participants', value: stats.participantCount, icon: Users, color: 'text-violet-500 bg-violet-500/10' },
    { label: 'Responses', value: stats.responseCount, icon: BarChart2, color: 'text-orange-500 bg-orange-500/10' },
  ]

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Platform-wide statistics and recent activity</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(card => (
          <div key={card.label} className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
                <card.icon className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
            </div>
            <p className="text-2xl font-bold">{card.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Presentations */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-semibold text-foreground mb-4">Recent Classrooms</h2>
          {stats.recentPresentations.length === 0 ? (
            <p className="text-sm text-muted-foreground">No classrooms yet.</p>
          ) : (
            <div className="space-y-2">
              {stats.recentPresentations.map(p => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{p.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(p.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono shrink-0 ml-2">{p.user_id.slice(0, 8)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Sessions */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-semibold text-foreground mb-4">Recent Activity</h2>
          {stats.recentSessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No activity yet.</p>
          ) : (
            <div className="space-y-2">
              {stats.recentSessions.map(s => (
                <div key={s.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">
                      <span className="font-mono">{s.room_code || s.id.slice(0, 8)}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {s.started_at ? new Date(s.started_at).toLocaleDateString() : '-'}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    s.status === 'active' ? 'bg-emerald-500/15 text-emerald-600' :
                    s.status === 'ended' ? 'bg-muted text-muted-foreground' :
                    'bg-yellow-500/15 text-yellow-600'
                  }`}>
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
