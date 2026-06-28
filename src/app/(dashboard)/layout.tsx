import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { DashboardSidebar } from '@/components/layout/DashboardSidebar'
import { CommandPalette } from '@/components/search/CommandPalette'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  // Theme is read from a cookie at render time so the light/dark choice is
  // applied server-side with no flash on reload. `.c360-light` opts this
  // subtree into the dashboard light theme (see globals.css).
  const cookieStore = await cookies()
  const light = cookieStore.get('c360_theme')?.value === 'light'

  return (
    <div data-dash-root className={`${light ? 'c360-light ' : ''}h-screen flex overflow-hidden bg-[#0F1216] dash-light:bg-[#F4F4F2]`}>
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto overflow-x-hidden bg-[#0F1216] dash-light:bg-[#F4F4F2] text-[#e7e9ec] dash-light:text-[#16191E] relative">
        {/* Faint v5 regimental grid (74px) — theme-aware via --grid-line;
            fades to nothing on the light canvas via the mask in globals.css */}
        <div className="dash-grid pointer-events-none absolute inset-0 opacity-[0.025] dash-light:opacity-[0.08]" />
        {/* Film grain — invisible in dark, subtle speckle on the cream */}
        <div className="dash-grain pointer-events-none absolute inset-0 opacity-0 dash-light:opacity-[0.22] mix-blend-multiply" />
        {/* Ambient accent silhouettes — soft red top-right + warm gold
            bottom-left give the light canvas the same depth the dark panels
            get from their corner glows. */}
        <div className="pointer-events-none absolute -top-32 -right-32 w-[600px] h-[600px] bg-[#C9241A]/[0.06] dash-light:bg-[#C9241A]/[0.04] blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 w-[560px] h-[560px] bg-transparent dash-light:bg-[#C9A24A]/[0.06] blur-[130px]" />
        <div className="relative z-0">{children}</div>
      </main>
      <CommandPalette />
    </div>
  )
}
