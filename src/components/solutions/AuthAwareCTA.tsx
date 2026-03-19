'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, LayoutDashboard } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  className?: string
  size?: 'default' | 'lg'
}

export function AuthAwareCTA({ className = '', size = 'default' }: Props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setIsLoggedIn(!!data.user)
      setLoading(false)
    })
  }, [])

  const sizeClasses = size === 'lg'
    ? 'px-8 h-12 text-base'
    : 'px-6 py-2.5 text-sm'

  if (loading) {
    return (
      <span className={`inline-flex items-center gap-2 ${sizeClasses} font-medium bg-primary text-primary-foreground rounded-full opacity-70 ${className}`}>
        Get started free <ArrowRight className="w-4 h-4" />
      </span>
    )
  }

  if (isLoggedIn) {
    return (
      <Link
        href="/dashboard"
        className={`inline-flex items-center gap-2 ${sizeClasses} font-medium bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors btn-animated ${className}`}
      >
        <LayoutDashboard className="w-4 h-4" />
        Go to dashboard
      </Link>
    )
  }

  return (
    <Link
      href="/register"
      className={`inline-flex items-center gap-2 ${sizeClasses} font-medium bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors btn-animated ${className}`}
    >
      Get started free <ArrowRight className="w-4 h-4" />
    </Link>
  )
}
