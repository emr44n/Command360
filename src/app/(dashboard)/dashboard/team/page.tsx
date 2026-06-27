import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Users, UserPlus, Shield, Crown, Pencil, Eye, Radio, Info } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Team — Command 360' }

const ROLES = [
  { role: 'owner', label: 'Owner', description: 'Full access to all features and settings', icon: Crown, color: 'text-[#c98a2a]', bg: 'bg-[#c98a2a]/10', border: 'border-[#c98a2a]/20', accent: 'bg-[#c98a2a]' },
  { role: 'admin', label: 'Admin', description: 'Manage team members, presentations, and sessions', icon: Shield, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20', accent: 'bg-primary' },
  { role: 'editor', label: 'Editor', description: 'Create and edit presentations and templates', icon: Pencil, color: 'text-[#3E6DC4]', bg: 'bg-[#3E6DC4]/10', border: 'border-[#3E6DC4]/20', accent: 'bg-[#3E6DC4]' },
  { role: 'presenter', label: 'Presenter', description: 'Run sessions and view results', icon: Radio, color: 'text-[#2E9E63]', bg: 'bg-[#2E9E63]/10', border: 'border-[#2E9E63]/20', accent: 'bg-[#2E9E63]' },
  { role: 'viewer', label: 'Viewer', description: 'View presentations, sessions, and reports', icon: Eye, color: 'text-muted-foreground', bg: 'bg-muted', border: 'border-border', accent: 'bg-muted-foreground' },
]

export default async function TeamPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="inline-block text-[10px] ff-mono uppercase tracking-[0.1em] font-semibold text-muted-foreground bg-muted/60 border border-border/50 rounded-none px-2.5 py-0.5 mb-2">
            Team
          </span>
          <h1 className="text-2xl font-bold tracking-tight">Team</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your team members and their roles
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-none bg-[#C9241A] hover:bg-[#C9241A]/90 text-white text-sm font-medium transition-all">
          <UserPlus className="w-4 h-4" />
          Invite member
        </button>
      </div>

      {/* Current user */}
      <div className="mb-8">
        <h2 className="text-xs ff-mono font-semibold text-muted-foreground uppercase tracking-[0.1em] mb-3">Members</h2>
        <div className="relative bg-card border border-border rounded-none p-4">
          <div className="absolute inset-0 rounded-none bg-gradient-to-br from-[#c98a2a]/[0.03] to-transparent pointer-events-none" />
          <div className="relative flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 ring-1 ring-primary/20">
              <Users className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">
                {user.user_metadata?.display_name || user.email?.split('@')[0]}
              </p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-none bg-[#c98a2a]/10 text-[#c98a2a] text-xs font-medium">
              <Crown className="w-3 h-3" />
              Owner
            </span>
          </div>
        </div>
      </div>

      {/* Roles reference */}
      <div>
        <h2 className="text-xs ff-mono font-semibold text-muted-foreground uppercase tracking-[0.1em] mb-3">Roles</h2>
        <div className="grid gap-2">
          {ROLES.map((r) => (
            <div
              key={r.role}
              className="group relative overflow-hidden bg-card border border-border rounded-none p-4 flex items-center gap-3 transition-all duration-200 hover:border-border/80"
            >
              {/* Top accent line */}
              <div className={`absolute top-0 left-0 right-0 h-[2px] ${r.accent} opacity-40 group-hover:opacity-70 transition-opacity`} />
              <div className={`w-8 h-8 rounded-none ${r.bg} border ${r.border} flex items-center justify-center shrink-0`}>
                <r.icon className={`w-4 h-4 ${r.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{r.label}</p>
                <p className="text-xs text-muted-foreground">{r.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Coming soon notice */}
      <div className="mt-8 bg-card border border-border rounded-none p-5">
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-none bg-[#3E6DC4]/10 border border-[#3E6DC4]/20 flex items-center justify-center shrink-0 mt-0.5">
            <Info className="w-3.5 h-3.5 text-[#3E6DC4]" />
          </div>
          <div>
            <p className="text-sm text-foreground/80 font-medium">
              Team invitations and role management coming soon.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              You&apos;ll be able to invite colleagues and assign roles to collaborate on training content.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
