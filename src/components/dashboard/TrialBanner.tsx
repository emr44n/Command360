'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Clock, ArrowRight, X, Sparkles } from 'lucide-react'

interface TrialBannerProps {
  createdAt: string // ISO date string of when the user account was created
}

export function TrialBanner({ createdAt }: TrialBannerProps) {
  const [dismissed, setDismissed] = useState(false)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 })
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    function calculate() {
      const created = new Date(createdAt)
      const trialEnd = new Date(created.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days
      const now = new Date()
      const diff = trialEnd.getTime() - now.getTime()

      if (diff <= 0) {
        setExpired(true)
        setTimeLeft({ days: 0, hours: 0, minutes: 0 })
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      setTimeLeft({ days, hours, minutes })
    }

    calculate()
    const interval = setInterval(calculate, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [createdAt])

  if (dismissed) return null

  if (expired) {
    return (
      <div className="relative bg-gradient-to-r from-amber-500/10 via-red-500/10 to-amber-500/10 border border-red-500/20 rounded-2xl p-5">
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-3 right-3 p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-red-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground">Your free trial has ended</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Upgrade to continue using all features and keep your training sessions running.
            </p>
          </div>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-500 transition-all hover:shadow-lg hover:shadow-red-500/25 shrink-0"
          >
            Upgrade now <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    )
  }

  const isLow = timeLeft.days <= 7

  return (
    <div className={`relative border rounded-2xl p-5 ${
      isLow
        ? 'bg-gradient-to-r from-amber-500/5 via-orange-500/5 to-amber-500/5 border-amber-500/20'
        : 'bg-gradient-to-r from-primary/5 via-violet-500/5 to-primary/5 border-primary/20'
    }`}>
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-3 right-3 p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
          isLow ? 'bg-amber-500/15' : 'bg-primary/15'
        }`}>
          <Sparkles className={`w-5 h-5 ${isLow ? 'text-amber-500' : 'text-primary'}`} />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-foreground">
            {isLow ? 'Trial ending soon' : 'Free trial active'}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {timeLeft.days > 0
              ? `${timeLeft.days} day${timeLeft.days !== 1 ? 's' : ''}, ${timeLeft.hours}h ${timeLeft.minutes}m remaining`
              : `${timeLeft.hours}h ${timeLeft.minutes}m remaining`
            }
            {' '}&middot; 30-day free trial with full access
          </p>
        </div>

        {/* Countdown display */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          {[
            { value: timeLeft.days, label: 'Days' },
            { value: timeLeft.hours, label: 'Hrs' },
            { value: timeLeft.minutes, label: 'Min' },
          ].map((unit) => (
            <div key={unit.label} className="text-center">
              <div className={`w-12 h-12 rounded-xl border flex items-center justify-center text-lg font-bold ${
                isLow
                  ? 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400'
                  : 'bg-primary/10 border-primary/20 text-primary'
              }`}>
                {String(unit.value).padStart(2, '0')}
              </div>
              <span className="text-[10px] text-muted-foreground mt-1 block">{unit.label}</span>
            </div>
          ))}
        </div>

        <Link
          href="/pricing"
          className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg shrink-0 ${
            isLow
              ? 'bg-amber-600 hover:bg-amber-500 hover:shadow-amber-500/25'
              : 'bg-primary hover:bg-primary/90 hover:shadow-primary/25'
          }`}
        >
          Upgrade <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}
