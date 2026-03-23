import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProfileSettings } from '@/components/settings/ProfileSettings'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Settings' }

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <span className="inline-block text-[10px] uppercase tracking-[0.15em] font-semibold text-muted-foreground bg-muted/60 border border-border/50 rounded-full px-2.5 py-0.5 mb-2">
          Settings
        </span>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your profile and preferences</p>
      </div>
      <div className="bg-card border border-border rounded-2xl p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)] ring-1 ring-white/[0.02]">
        <ProfileSettings user={{ id: user.id, email: user.email || '', displayName: user.user_metadata?.display_name || '' }} />
      </div>
    </div>
  )
}
