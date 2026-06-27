import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardSidebar } from '@/components/layout/DashboardSidebar'
import { CommandPalette } from '@/components/search/CommandPalette'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  return (
    <div className="h-screen flex overflow-hidden bg-[#0F1216]">
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto overflow-x-hidden bg-[#0F1216] text-[#e7e9ec] relative">
        {/* Faint v5 regimental grid (74px) */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '74px 74px',
          }}
        />
        {/* Soft red corner glow — top-right */}
        <div className="pointer-events-none absolute -top-32 -right-32 w-[600px] h-[600px] bg-[#C9241A]/[0.06] blur-[120px]" />
        <div className="relative z-0">{children}</div>
      </main>
      <CommandPalette />
    </div>
  )
}
