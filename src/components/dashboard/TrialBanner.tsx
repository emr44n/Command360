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
      <div className="relative overflow-hidden bg-[#16191E] dash-light:bg-white dash-card-elev border border-[#C9241A]/40 p-5">
        {/* Left accent bar */}
        <div className="absolute top-0 left-0 bottom-0 w-[3px] bg-[#C9241A]" />
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-3 right-3 p-1 text-[#9aa0a8] dash-light:text-[#5B6169] hover:text-white dash-light:hover:text-[#16191E] hover:bg-white/10 dash-light:hover:bg-black/[0.06] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-10 h-10 bg-[#C9241A]/15 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-[#C9241A]" />
          </div>
          <div className="flex-1">
            <h3 className="ff-display text-sm font-semibold text-white dash-light:text-[#16191E]">Your free trial has ended</h3>
            <p className="ff-body text-xs text-[#9aa0a8] dash-light:text-[#5B6169] mt-0.5">
              Upgrade to continue using all features and keep your training sessions running.
            </p>
          </div>
          <Link
            href="/pricing"
            className="ff-mono uppercase tracking-[0.1em] inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold bg-[#C9241A] text-white hover:bg-[#e02d22] transition-colors shrink-0"
          >
            Upgrade now <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    )
  }

  const isLow = timeLeft.days <= 7
  const accent = isLow ? '#c98a2a' : '#C9241A'

  return (
    <div className="relative overflow-hidden bg-[#16191E] dash-light:bg-white dash-card-elev border p-5" style={{ borderColor: `${accent}66` }}>
      {/* Left accent bar */}
      <div className="absolute top-0 left-0 bottom-0 w-[3px]" style={{ backgroundColor: accent }} />
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-3 right-3 p-1 text-[#9aa0a8] dash-light:text-[#5B6169] hover:text-white dash-light:hover:text-[#16191E] hover:bg-white/10 dash-light:hover:bg-black/[0.06] transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-10 h-10 flex items-center justify-center shrink-0" style={{ backgroundColor: `${accent}26` }}>
          <Sparkles className="w-5 h-5" style={{ color: accent }} />
        </div>
        <div className="flex-1">
          <h3 className="ff-display text-sm font-semibold text-white dash-light:text-[#16191E]">
            {isLow ? 'Trial ending soon' : 'Free trial active'}
          </h3>
          <p className="ff-body text-xs text-[#9aa0a8] dash-light:text-[#5B6169] mt-0.5">
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
              <div
                className="ff-display w-12 h-12 border flex items-center justify-center text-lg font-bold text-white dash-light:text-[#16191E]"
                style={{ backgroundColor: `${accent}1a`, borderColor: `${accent}33` }}
              >
                {String(unit.value).padStart(2, '0')}
              </div>
              <span className="ff-mono text-[10px] uppercase tracking-[0.1em] text-[#9aa0a8] dash-light:text-[#5B6169] mt-1 block">{unit.label}</span>
            </div>
          ))}
        </div>

        <Link
          href="/pricing"
          className="ff-mono uppercase tracking-[0.1em] inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white transition-colors shrink-0 hover:brightness-110"
          style={{ backgroundColor: accent }}
        >
          Upgrade <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}
