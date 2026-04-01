'use client'

import { useState, useEffect } from 'react'
import { CheckCircle2, Circle, X, ChevronDown, ChevronUp, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const CHECKLIST_ITEMS = [
  { key: 'profile', label: 'Set up your profile', href: '/dashboard/settings', flag: 'c360_onboard_profile' },
  { key: 'first_presentation', label: 'Create your first presentation', href: '/dashboard', flag: 'c360_onboard_presentation' },
  { key: 'add_slides', label: 'Add interactive slides', href: '/dashboard', flag: 'c360_onboard_presentation' },
  { key: 'start_session', label: 'Start a live session', href: '/dashboard/sessions', flag: 'c360_onboard_session' },
  { key: 'view_report', label: 'View a session report', href: '/dashboard/reports', flag: 'c360_onboard_report' },
]

const DISMISSED_KEY = 'c360_onboarding_dismissed'

export function OnboardingChecklist() {
  const [completed, setCompleted] = useState<Record<string, boolean>>({})
  const [dismissed, setDismissed] = useState(true) // start hidden until we read localStorage
  const [expanded, setExpanded] = useState(true)
  const [allDoneMessage, setAllDoneMessage] = useState(false)
  const pathname = usePathname()

  // Hide on editor/present/preview pages
  const isEditorPage = pathname.includes('/edit') || pathname.includes('/present') || pathname.includes('/preview')

  useEffect(() => {
    const wasDismissed = localStorage.getItem(DISMISSED_KEY)
    if (wasDismissed === 'true') {
      setDismissed(true)
      return
    }
    setDismissed(false)

    // Auto-detect completion from localStorage flags
    function checkFlags() {
      const next: Record<string, boolean> = {}
      for (const item of CHECKLIST_ITEMS) {
        next[item.key] = localStorage.getItem(item.flag) === 'true'
      }
      setCompleted(next)
    }

    checkFlags()

    // Re-check periodically in case flags are set by other actions
    const interval = setInterval(checkFlags, 3000)
    return () => clearInterval(interval)
  }, [])

  // Auto-dismiss when all done
  useEffect(() => {
    const completedCount = CHECKLIST_ITEMS.filter(i => completed[i.key]).length
    if (completedCount === CHECKLIST_ITEMS.length && completedCount > 0) {
      setAllDoneMessage(true)
      const timer = setTimeout(() => {
        setDismissed(true)
        localStorage.setItem(DISMISSED_KEY, 'true')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [completed])

  if (dismissed || isEditorPage) return null

  const completedCount = CHECKLIST_ITEMS.filter(i => completed[i.key]).length
  const progress = Math.round((completedCount / CHECKLIST_ITEMS.length) * 100)

  function handleDismiss() {
    setDismissed(true)
    localStorage.setItem(DISMISSED_KEY, 'true')
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-72">
      <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-primary/5 border-b border-border">
          <button onClick={() => setExpanded(v => !v)} className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Sparkles className="w-4 h-4 text-primary" />
            Getting Started
            {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
          </button>
          <button onClick={handleDismiss} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        {expanded && (
          <div className="p-4 space-y-3">
            {/* Progress bar */}
            <div>
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                <span>{completedCount}/{CHECKLIST_ITEMS.length} completed</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Items */}
            <div className="space-y-1">
              {CHECKLIST_ITEMS.map(item => (
                <div key={item.key} className="flex items-center gap-2 group">
                  <span className="shrink-0 text-muted-foreground">
                    {completed[item.key] ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </span>
                  <Link
                    href={item.href}
                    className={`text-xs transition-colors ${
                      completed[item.key]
                        ? 'text-muted-foreground line-through'
                        : 'text-foreground hover:text-primary'
                    }`}
                  >
                    {item.label}
                  </Link>
                </div>
              ))}
            </div>

            {allDoneMessage && (
              <p className="text-xs text-emerald-600 font-medium text-center pt-1">
                All done! You're ready to go.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
