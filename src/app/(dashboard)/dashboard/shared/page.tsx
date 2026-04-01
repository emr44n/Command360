import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Share2, Users, Link2 } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Shared — Command 360' }

export default async function SharedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 font-medium mb-1.5">Collaboration</p>
        <h1 className="text-2xl font-bold tracking-tight">Shared</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Sessions shared with you and by you
        </p>
      </div>

      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-3xl bg-primary/[0.07] border border-primary/[0.1] flex items-center justify-center">
            <Share2 className="w-9 h-9 text-primary/40" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-muted border border-border flex items-center justify-center">
            <Users className="w-4 h-4 text-muted-foreground/50" />
          </div>
        </div>
        <p className="text-base font-medium text-foreground mb-1.5">No shared sessions yet</p>
        <p className="text-sm text-muted-foreground/70 max-w-sm">
          When you share a session with collaborators or someone shares one with you, it will appear here.
        </p>
        <div className="flex items-center gap-2 mt-6 text-xs text-muted-foreground/50">
          <Link2 className="w-3.5 h-3.5" />
          <span>Share sessions from the editor using the share button</span>
        </div>
      </div>
    </div>
  )
}
