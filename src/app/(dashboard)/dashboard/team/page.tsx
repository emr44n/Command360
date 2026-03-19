import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Users, UserPlus, Shield, Crown, Pencil, Eye, Radio } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Team — Command 360' }

const ROLES = [
  { role: 'owner', label: 'Owner', description: 'Full access to all features and settings', icon: Crown, color: 'text-amber-500' },
  { role: 'admin', label: 'Admin', description: 'Manage team members, decks, and sessions', icon: Shield, color: 'text-primary' },
  { role: 'editor', label: 'Editor', description: 'Create and edit decks and templates', icon: Pencil, color: 'text-blue-500' },
  { role: 'presenter', label: 'Presenter', description: 'Run sessions and view results', icon: Radio, color: 'text-emerald-500' },
  { role: 'viewer', label: 'Viewer', description: 'View decks, sessions, and reports', icon: Eye, color: 'text-muted-foreground' },
]

export default async function TeamPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Team</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your team members and their roles
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-all hover:shadow-lg hover:shadow-red-500/25">
          <UserPlus className="w-4 h-4" />
          Invite member
        </button>
      </div>

      {/* Current user */}
      <div className="mb-8">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Members</h2>
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">
                {user.user_metadata?.display_name || user.email?.split('@')[0]}
              </p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 text-xs font-medium">
              <Crown className="w-3 h-3" />
              Owner
            </span>
          </div>
        </div>
      </div>

      {/* Roles reference */}
      <div>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Roles</h2>
        <div className="grid gap-2">
          {ROLES.map((r) => (
            <div key={r.role} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
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
      <div className="mt-8 bg-muted/50 border border-border rounded-2xl p-4 text-center">
        <p className="text-sm text-muted-foreground">
          Team invitations and role management coming soon.
        </p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          You&apos;ll be able to invite colleagues and assign roles to collaborate on training content.
        </p>
      </div>
    </div>
  )
}
