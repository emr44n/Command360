'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, LogOut, LayoutTemplate, Settings,
  Radio, BarChart2, Users, ChevronLeft, ChevronRight, Plus, Moon, Sun, Monitor,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Presentations', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/sessions', label: 'Sessions', icon: Radio },
  { href: '/dashboard/templates', label: 'Templates', icon: LayoutTemplate },
  { href: '/dashboard/studio', label: 'Command Studio', icon: Monitor, badge: 'New' },
  { href: '/dashboard/reports', label: 'Reports', icon: BarChart2 },
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light')
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
    document.documentElement.classList.toggle('dark', next === 'dark')
    localStorage.setItem('theme', next)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  function isActive(item: typeof NAV_ITEMS[0]) {
    if (item.exact) return pathname === item.href
    return pathname === item.href || pathname.startsWith(item.href + '/')
  }

  const initials = userName
    ? userName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : userEmail ? userEmail[0].toUpperCase() : '?'

  return (
    <aside className={cn(
      'relative bg-background border-r border-border flex flex-col h-full shrink-0 transition-all duration-300 ease-in-out',
      collapsed ? 'w-[68px]' : 'w-[220px]'
    )}>
      {/* Subtle right-edge glow for dark mode */}
      <div className="pointer-events-none absolute inset-y-0 -right-px w-px dark:shadow-[0_0_12px_1px_rgba(var(--primary-rgb,239,68,68),0.08)]" />

      {/* Logo */}
      <div className={cn('h-16 flex items-center border-b border-border', collapsed ? 'px-3 justify-center' : 'px-5')}>
        <Link href="/dashboard" className="flex items-center gap-2.5 font-semibold text-sm text-foreground">
          <div className="w-8 h-8 bg-red-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm shadow-red-500/20">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          </div>
          {!collapsed && <span className="tracking-tight">Command 360</span>}
        </Link>
      </div>

      {/* New Presentation button */}
      <div className={cn('pt-4', collapsed ? 'px-2.5' : 'px-3')}>
        {collapsed ? (
          <button
            onClick={async () => {
              if (creatingPresentation) return
              setCreatingPresentation(true)
              try {
                const res = await fetch('/api/presentations', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ title: 'Untitled Presentation', description: '' }),
                })
                const data = await res.json()
                if (res.ok) router.push(`/presentations/${data.presentation.id}/edit`)
              } catch {} finally {
                setCreatingPresentation(false)
              }
            }}
            disabled={creatingPresentation}
            className="w-full flex items-center justify-center p-2.5 rounded-xl bg-red-600 text-white hover:bg-red-500 transition-all duration-200 hover:shadow-lg hover:shadow-red-500/25 active:scale-95 group relative disabled:opacity-70"
            title="New Presentation"
          >
            {creatingPresentation ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            <div className="absolute left-full ml-2.5 px-2.5 py-1.5 rounded-lg bg-popover text-popover-foreground text-xs font-medium border border-border shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
              New Presentation
            </div>
          </button>
        ) : (
          <button
            onClick={async () => {
              if (creatingPresentation) return
              setCreatingPresentation(true)
              try {
                const res = await fetch('/api/presentations', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ title: 'Untitled Presentation', description: '' }),
                })
                const data = await res.json()
                if (res.ok) router.push(`/presentations/${data.presentation.id}/edit`)
              } catch {} finally {
                setCreatingPresentation(false)
              }
            }}
            disabled={creatingPresentation}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-red-600 text-white text-[13px] font-semibold hover:bg-red-500 transition-all duration-200 hover:shadow-lg hover:shadow-red-500/25 active:scale-[0.98] disabled:opacity-70"
          >
            {creatingPresentation ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            New Presentation
          </button>
        )}
      </div>

      {/* Separator */}
      <div className={cn('pt-3', collapsed ? 'px-4' : 'px-5')}>
        <div className="h-px bg-border/60" />
      </div>

      {/* Navigation */}
      <nav className={cn('flex-1 py-3 space-y-0.5', collapsed ? 'px-2.5' : 'px-3')}>
        {NAV_ITEMS.map((item, index) => {
          const active = isActive(item)
          const hasBadge = item.label === 'Sessions' && activeSessions > 0
          const hasNewBadge = 'badge' in item && item.badge

          /* Insert a separator before "Reports" to visually group nav sections */
          const showSeparator = item.label === 'Reports'

          return (
            <div key={item.href}>
              {showSeparator && (
                <div className={cn('py-2', collapsed ? 'px-1.5' : 'px-2')}>
                  <div className="h-px bg-border/60" />
                </div>
              )}
              <Link
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={cn(
                  'relative flex items-center gap-3 rounded-xl text-[13px] font-medium transition-all duration-200 group',
                  collapsed ? 'px-0 py-2.5 justify-center' : 'px-3 py-2.5',
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
                )}
              >
                {/* Active indicator line */}
                <div className={cn(
                  'absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-r-full bg-primary transition-all duration-300',
                  collapsed ? 'h-4' : 'h-5',
                  active ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'
                )} />

                <item.icon className={cn(
                  'shrink-0 transition-all duration-200',
                  collapsed ? 'w-[18px] h-[18px]' : 'w-4 h-4',
                  active ? '' : 'group-hover:scale-110'
                )} />
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {hasBadge && (
                      <span className="flex items-center justify-center min-w-[20px] h-5 rounded-full bg-emerald-500 text-white text-[10px] font-bold px-1.5">
                        {activeSessions}
                      </span>
                    )}
                    {hasNewBadge && (
                      <span className="flex items-center justify-center h-4 rounded-full bg-red-500/15 text-red-500 text-[9px] font-bold px-1.5 uppercase tracking-wider">
                        New
                      </span>
                    )}
                  </>
                )}
                {collapsed && hasBadge && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-background" />
                )}

                {/* Tooltip for collapsed mode */}
                {collapsed && (
                  <div className="absolute left-full ml-2.5 px-2.5 py-1.5 rounded-lg bg-popover text-popover-foreground text-xs font-medium border border-border shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                    {item.label}
                    {hasBadge && <span className="ml-1.5 text-emerald-500">({activeSessions})</span>}
                  </div>
                )}
              </Link>
            </div>
          )
        })}
      </nav>

      {/* Separator before controls */}
      <div className={cn(collapsed ? 'px-4' : 'px-5')}>
        <div className="h-px bg-border/60" />
      </div>

      {/* Theme toggle + Collapse */}
      <div className={cn('px-3 py-2 flex items-center', collapsed ? 'flex-col gap-1 px-2.5' : 'gap-1')}>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all duration-200 group relative"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {collapsed && (
            <div className="absolute left-full ml-2.5 px-2.5 py-1.5 rounded-lg bg-popover text-popover-foreground text-xs font-medium border border-border shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </div>
          )}
        </button>
        {!collapsed && (
          <span className="text-[11px] text-muted-foreground flex-1">{theme === 'dark' ? 'Dark' : 'Light'}</span>
        )}
        <button
          onClick={() => setCollapsed(v => !v)}
          className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all duration-200"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* User area */}
      <div className={cn('border-t border-border', collapsed ? 'p-2.5' : 'p-3 space-y-1')}>
        {collapsed ? (
          <>
            <Link
              href="/dashboard/settings"
              className="flex items-center justify-center p-1.5 group relative"
              title={userName || userEmail}
            >
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors duration-200">
                <span className="text-[11px] font-bold text-primary">{initials}</span>
              </div>
              <div className="absolute left-full ml-2.5 px-2.5 py-1.5 rounded-lg bg-popover text-popover-foreground text-xs font-medium border border-border shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                {userName || userEmail}
              </div>
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center justify-center p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 w-full transition-all duration-200 group relative"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
              <div className="absolute left-full ml-2.5 px-2.5 py-1.5 rounded-lg bg-popover text-popover-foreground text-xs font-medium border border-border shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                Sign out
              </div>
            </button>
          </>
        ) : (
          <>
            {(userName || userEmail) && (
              <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/80 transition-all duration-200 group">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors duration-200">
                  <span className="text-[11px] font-bold text-primary">{initials}</span>
                </div>
                <div className="min-w-0 flex-1">
                  {userName && <p className="text-[13px] font-medium text-foreground truncate">{userName}</p>}
                  <p className="text-[11px] text-muted-foreground truncate">{userEmail}</p>
                </div>
              </Link>
            )}
            <button onClick={handleSignOut}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/80 w-full transition-all duration-200">
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </>
        )}
      </div>
    </aside>
  )
}
