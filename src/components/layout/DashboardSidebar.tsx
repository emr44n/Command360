'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { BrandLink } from '@/components/site/BrandLink'
import {
  LayoutDashboard, LogOut, LayoutTemplate, Settings,
  Radio, BarChart2, Users, ChevronLeft, ChevronRight, Plus, Moon, Sun, Monitor, FileText, Share2, ShieldCheck, TrendingUp,
  Loader2, Presentation, Clapperboard,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/presentations', label: 'Command Classroom', icon: FileText },
  { href: '/dashboard/studio', label: 'Command Studio', icon: Monitor },
  { href: '/dashboard/sessions', label: 'Activity', icon: Radio },
  { href: '/dashboard/templates', label: 'Templates', icon: LayoutTemplate },
  { href: '/dashboard/reports', label: 'Reports', icon: BarChart2 },
  { href: '/dashboard/admin', label: 'Admin', icon: ShieldCheck },
  { href: '/dashboard/studio-analytics', label: 'Analytics', icon: TrendingUp },
  { href: '/dashboard/shared', label: 'Shared', icon: Share2 },
  { href: '/dashboard/team', label: 'Team', icon: Users },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [userEmail, setUserEmail] = useState('')
  const [userName, setUserName] = useState('')
  const [collapsed, setCollapsed] = useState(false)
  const [activeSessions, setActiveSessions] = useState(0)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [creatingPresentation, setCreatingPresentation] = useState(false)
  const [showNewDialog, setShowNewDialog] = useState(false)
  const [selectedType, setSelectedType] = useState<'presentation' | 'command_studio' | null>(null)
  const [newTitle, setNewTitle] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Dashboard theme is owned by the `.c360-light` scope on the shell root
      // (applied server-side from the c360_theme cookie). Reflect it here.
      const root = document.querySelector('[data-dash-root]')
      setTheme(root?.classList.contains('c360-light') ? 'light' : 'dark')
    }

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserEmail(data.user.email || '')
        setUserName(data.user.user_metadata?.display_name || '')

        supabase
          .from('sessions')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', data.user.id)
          .eq('status', 'active')
          .then(({ count }) => {
            setActiveSessions(count || 0)
          })
      }
    })
  }, [])

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    // Flip the dashboard-scoped light theme and persist via cookie so the
    // server applies it (no flash) on the next load. Only the dashboard
    // subtree is affected — the rest of the app stays dark.
    document.querySelector('[data-dash-root]')?.classList.toggle('c360-light', next === 'light')
    document.cookie = `c360_theme=${next}; path=/; max-age=31536000; samesite=lax`
    localStorage.setItem('c360_theme', next)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  function isActive(item: typeof NAV_ITEMS[0]) {
    if (item.exact) return pathname === item.href
    return pathname === item.href || pathname.startsWith(item.href + '/')
  }

  const initials = userName
    ? userName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : userEmail ? userEmail[0].toUpperCase() : '?'

  async function createPresentation(type: 'presentation' | 'command_studio', title?: string) {
    if (creatingPresentation) return
    setCreatingPresentation(true)
    setShowNewDialog(false)
    setSelectedType(null)
    setNewTitle('')
    try {
      const finalTitle = title?.trim() || (type === 'command_studio' ? 'Untitled Scene' : 'Untitled Session')
      const res = await fetch('/api/presentations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: finalTitle, description: '' }),
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem('c360_onboard_presentation', 'true')
        if (type === 'command_studio') {
          // Create a studio slide in the new presentation
          await fetch('/api/slides', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              presentation_id: data.presentation.id,
              slide_type: 'studio',
              position: 0,
              title: 'Scene 1',
            }),
          })
          router.push(`/presentations/${data.presentation.id}/edit`)
        } else {
          router.push(`/presentations/${data.presentation.id}/edit`)
        }
      }
    } catch {} finally {
      setCreatingPresentation(false)
    }
  }

  return (
    <aside className={cn(
      'relative bg-[#0A0C0F] dash-light:bg-[#ECEAE3] border-r border-white/12 dash-light:border-black/10 flex flex-col h-full shrink-0 transition-all duration-300 ease-in-out',
      collapsed ? 'w-[68px]' : 'w-[220px]'
    )}>
      {/* Subtle right-edge red glow */}
      <div className="pointer-events-none absolute inset-y-0 -right-px w-px shadow-[0_0_12px_1px_rgba(201,36,26,0.10)]" />

      {/* Logo — hovering the logo OR the wordmark runs the brand spin+zoom */}
      <div className={cn('h-16 flex items-center', collapsed ? 'px-3 justify-center' : 'px-5')}>
        <BrandLink
          href="/dashboard"
          size={32}
          wordmark={!collapsed}
          className="flex items-center gap-2.5 text-white dash-light:text-[#16191E]"
          wordmarkText="Command 360"
          wordmarkClassName="ff-wordmark text-[15px] tracking-tight uppercase"
        />
      </div>

      {/* New Presentation button */}
      <div className={cn('pt-4', collapsed ? 'px-2.5' : 'px-3')}>
        {collapsed ? (
          <Tooltip><TooltipTrigger asChild>
          <button
            onClick={() => setShowNewDialog(true)}
            disabled={creatingPresentation}
            className="v5-glow w-full flex items-center justify-center p-2.5 bg-[#C9241A] text-white hover:bg-[#dd2b20] transition-colors duration-200 active:scale-95 group relative disabled:opacity-70"
          >
            {creatingPresentation ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          </button>
          </TooltipTrigger><TooltipContent side="right">Create New</TooltipContent></Tooltip>
        ) : (
          <button
            onClick={() => setShowNewDialog(true)}
            disabled={creatingPresentation}
            className="v5-glow w-full flex items-center gap-2 px-3.5 py-2.5 bg-[#C9241A] text-white ff-mono text-[11px] font-medium uppercase tracking-[0.12em] hover:bg-[#dd2b20] transition-colors duration-200 active:scale-[0.98] disabled:opacity-70"
          >
            {creatingPresentation ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Create New
          </button>
        )}
      </div>

      {/* New Presentation Type Dialog */}
      <Dialog open={showNewDialog} onOpenChange={(open) => { setShowNewDialog(open); if (!open) { setSelectedType(null); setNewTitle('') } }}>
        <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden border border-white/12 bg-[#16191E] text-white [&>button]:text-[#9aa0a8]" style={{ borderRadius: 0 }}>
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle className="ff-display text-lg font-extrabold uppercase tracking-tight text-white">Create New</DialogTitle>
            <p className="ff-mono text-[11px] uppercase tracking-[0.12em] text-[#9aa0a8] mt-2">Choose what you want to create</p>
          </DialogHeader>
          <div className="px-6 pb-6 grid gap-3">
            <div className={cn(
              'border bg-[#0F1216] transition-all duration-200 text-left overflow-hidden',
              selectedType === 'presentation' ? 'border-[#C9241A]/50 bg-[#C9241A]/[0.05]' : 'border-white/12 hover:border-[#C9241A]/40 hover:bg-white/[0.03]'
            )}>
              <button
                onClick={() => { setSelectedType('presentation'); setNewTitle('') }}
                className="group flex items-start gap-4 p-4 w-full text-left"
              >
                <div className="w-11 h-11 bg-blue-500/10 border border-blue-500/[0.25] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200">
                  <Presentation className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="ff-display text-sm font-bold text-white">Command Classroom</p>
                  <p className="text-xs text-[#9aa0a8] mt-1 leading-relaxed">
                    Interactive sessions with polls, quizzes, word clouds, and live audience participation
                  </p>
                </div>
              </button>
              {selectedType === 'presentation' && (
                <div className="px-4 pb-4 flex gap-2">
                  <input
                    type="text"
                    autoFocus
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') createPresentation('presentation', newTitle) }}
                    placeholder="Untitled Session"
                    className="flex-1 h-9 px-3 border border-white/12 bg-[#16191E] text-sm text-white placeholder:text-[#9aa0a8] focus:outline-none focus:border-[#C9241A]/60"
                  />
                  <button
                    onClick={() => createPresentation('presentation', newTitle)}
                    disabled={creatingPresentation}
                    className="h-9 px-4 bg-[#C9241A] text-white ff-mono text-[11px] font-medium uppercase tracking-[0.1em] hover:bg-[#dd2b20] transition-colors disabled:opacity-70"
                  >
                    {creatingPresentation ? 'Creating...' : 'Create Session'}
                  </button>
                </div>
              )}
            </div>
            <div className={cn(
              'border bg-[#0F1216] transition-all duration-200 text-left overflow-hidden',
              selectedType === 'command_studio' ? 'border-[#C9241A]/50 bg-[#C9241A]/[0.05]' : 'border-white/12 hover:border-[#C9241A]/40 hover:bg-white/[0.03]'
            )}>
              <button
                onClick={() => { setSelectedType('command_studio'); setNewTitle('') }}
                className="group flex items-start gap-4 p-4 w-full text-left"
              >
                <div className="w-11 h-11 bg-violet-500/10 border border-violet-500/[0.25] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200">
                  <Clapperboard className="w-5 h-5 text-violet-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="ff-display text-sm font-bold text-white">Command Studio</p>
                  <p className="text-xs text-[#9aa0a8] mt-1 leading-relaxed">
                    Scene-based editor with canvas, timeline, layers, and timed events
                  </p>
                </div>
              </button>
              {selectedType === 'command_studio' && (
                <div className="px-4 pb-4 flex gap-2">
                  <input
                    type="text"
                    autoFocus
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') createPresentation('command_studio', newTitle) }}
                    placeholder="Untitled Scene"
                    className="flex-1 h-9 px-3 border border-white/12 bg-[#16191E] text-sm text-white placeholder:text-[#9aa0a8] focus:outline-none focus:border-[#C9241A]/60"
                  />
                  <button
                    onClick={() => createPresentation('command_studio', newTitle)}
                    disabled={creatingPresentation}
                    className="h-9 px-4 bg-[#C9241A] text-white ff-mono text-[11px] font-medium uppercase tracking-[0.1em] hover:bg-[#dd2b20] transition-colors disabled:opacity-70"
                  >
                    {creatingPresentation ? 'Creating...' : 'Create Scene'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Separator */}
      <div className={cn('pt-3', collapsed ? 'px-4' : 'px-5')}>
        <div className="h-px bg-white/12 dash-light:bg-black/10" />
      </div>

      {/* Navigation */}
      <nav className={cn('flex-1 py-3 space-y-0.5', collapsed ? 'px-2.5' : 'px-3')}>
        {NAV_ITEMS.map((item, index) => {
          const active = isActive(item)
          const hasBadge = item.label === 'Activity' && activeSessions > 0
          const hasNewBadge = 'badge' in item && (item as Record<string, unknown>).badge

          /* Insert a separator before "Reports" to visually group nav sections */
          const showSeparator = item.label === 'Reports'

          /* Core product items get a subtle colored left border when not active */
          const isClassroom = item.label === 'Command Classroom'
          const isStudio = item.label === 'Command Studio'

          const linkContent = (
            <Link
              href={item.href}
              className={cn(
                'relative flex items-center gap-3 ff-mono text-[11px] font-medium uppercase tracking-[0.1em] transition-colors duration-200 group',
                collapsed ? 'px-0 py-2.5 justify-center' : 'px-3 py-2.5',
                active
                  ? 'bg-white/[0.05] dash-light:bg-black/[0.06] text-white dash-light:text-[#16191E]'
                  : 'text-[#9aa0a8] dash-light:text-[#5B6169] hover:text-white dash-light:hover:text-[#16191E] hover:bg-white/[0.03] dash-light:hover:bg-black/[0.04]',
                !active && isClassroom && 'border-l-2 border-blue-500/40',
                !active && isStudio && 'border-l-2 border-violet-500/40',
              )}
            >
              {/* Active red left-accent bar */}
              <div className={cn(
                'absolute left-0 top-0 bottom-0 w-[3px] bg-[#C9241A] transition-all duration-300 origin-center',
                active ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'
              )} />

              <item.icon className={cn(
                'shrink-0 transition-transform duration-200',
                collapsed ? 'w-[18px] h-[18px]' : 'w-4 h-4',
                active ? '' : 'group-hover:scale-110'
              )} />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {hasBadge && (
                    <span className="flex items-center justify-center min-w-[20px] h-5 bg-emerald-500 text-white text-[10px] font-bold px-1.5">
                      {activeSessions}
                    </span>
                  )}
                  {hasNewBadge && (
                    <span className="flex items-center justify-center h-4 bg-[#C9241A]/15 text-[#C9241A] text-[9px] font-bold px-1.5 uppercase tracking-wider">
                      New
                    </span>
                  )}
                </>
              )}
              {collapsed && hasBadge && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0A0C0F] dash-light:border-[#ECEAE3]" />
              )}
            </Link>
          )

          return (
            <div key={item.href}>
              {showSeparator && (
                <div className={cn('py-2', collapsed ? 'px-1.5' : 'px-2')}>
                  <div className="h-px bg-white/12 dash-light:bg-black/10" />
                </div>
              )}
              {collapsed ? (
                <Tooltip><TooltipTrigger asChild>{linkContent}</TooltipTrigger><TooltipContent side="right">{item.label}{hasBadge && ` (${activeSessions})`}</TooltipContent></Tooltip>
              ) : linkContent}
            </div>
          )
        })}
      </nav>

      {/* Separator before controls */}
      <div className={cn(collapsed ? 'px-4' : 'px-5')}>
        <div className="h-px bg-white/12 dash-light:bg-black/10" />
      </div>

      {/* Theme toggle + Collapse */}
      <div className={cn('px-3 py-2 flex items-center', collapsed ? 'flex-col gap-1 px-2.5' : 'gap-1')}>
        <Tooltip><TooltipTrigger asChild>
        <button
          onClick={toggleTheme}
          className="p-2 text-[#9aa0a8] dash-light:text-[#5B6169] hover:text-white dash-light:hover:text-[#16191E] hover:bg-white/[0.05] dash-light:hover:bg-black/[0.05] transition-colors duration-200 group relative"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        </TooltipTrigger><TooltipContent side="right">{theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}</TooltipContent></Tooltip>
        {!collapsed && (
          <span className="ff-mono text-[10px] uppercase tracking-[0.12em] text-[#9aa0a8] dash-light:text-[#5B6169] flex-1">{theme === 'dark' ? 'Dark' : 'Light'}</span>
        )}
        <Tooltip><TooltipTrigger asChild>
        <button
          onClick={() => setCollapsed(v => !v)}
          className="p-2 text-[#9aa0a8] dash-light:text-[#5B6169] hover:text-white dash-light:hover:text-[#16191E] hover:bg-white/[0.05] dash-light:hover:bg-black/[0.05] transition-colors duration-200"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
        </TooltipTrigger><TooltipContent side="right">{collapsed ? 'Expand sidebar' : 'Collapse sidebar'}</TooltipContent></Tooltip>
      </div>

      {/* User area */}
      <div className={cn('border-t border-white/12 dash-light:border-black/10 shrink-0', collapsed ? 'p-2.5' : 'p-3 space-y-1')}>
        {collapsed ? (
          <>
            <Tooltip><TooltipTrigger asChild>
            <Link
              href="/dashboard/settings"
              className="flex items-center justify-center p-1.5 group relative"
            >
              <div className="w-9 h-9 bg-[#C9241A]/15 flex items-center justify-center shrink-0 group-hover:bg-[#C9241A]/25 transition-colors duration-200">
                <span className="ff-display text-[11px] font-bold text-[#C9241A]">{initials}</span>
              </div>
            </Link>
            </TooltipTrigger><TooltipContent side="right">{userName || userEmail}</TooltipContent></Tooltip>
            <Tooltip><TooltipTrigger asChild>
            <button
              onClick={handleSignOut}
              className="flex items-center justify-center p-2 text-[#9aa0a8] dash-light:text-[#5B6169] hover:text-white dash-light:hover:text-[#16191E] hover:bg-white/[0.05] dash-light:hover:bg-black/[0.05] w-full transition-colors duration-200 group relative"
            >
              <LogOut className="w-4 h-4" />
            </button>
            </TooltipTrigger><TooltipContent side="right">Sign out</TooltipContent></Tooltip>
          </>
        ) : (
          <>
            {(userName || userEmail) && (
              <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/[0.05] dash-light:hover:bg-black/[0.05] transition-colors duration-200 group">
                <div className="w-9 h-9 bg-[#C9241A]/15 flex items-center justify-center shrink-0 group-hover:bg-[#C9241A]/25 transition-colors duration-200">
                  <span className="ff-display text-[11px] font-bold text-[#C9241A]">{initials}</span>
                </div>
                <div className="min-w-0 flex-1">
                  {userName && <p className="text-[13px] font-medium text-white dash-light:text-[#16191E] truncate">{userName}</p>}
                  <p className="text-[11px] text-[#9aa0a8] dash-light:text-[#5B6169] truncate">{userEmail}</p>
                </div>
              </Link>
            )}
            <button onClick={handleSignOut}
              className="flex items-center gap-3 px-3 py-2.5 ff-mono text-[11px] font-medium uppercase tracking-[0.1em] text-[#9aa0a8] dash-light:text-[#5B6169] hover:text-white dash-light:hover:text-[#16191E] hover:bg-white/[0.05] dash-light:hover:bg-black/[0.05] w-full transition-colors duration-200">
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </>
        )}
      </div>
    </aside>
  )
}
