'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { toast } from 'sonner'
import { ArrowLeft, Mail } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || loading) return
    setLoading(true)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    })

    if (error) {
      toast.error(error.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <Mail className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Check your email</h1>
        <p className="text-muted-foreground text-sm">
          We sent a password reset link to <strong className="text-foreground">{email}</strong>
        </p>
        <Link href="/?auth=login" className="text-primary hover:underline text-sm inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />Back to login
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Reset password</h1>
        <p className="text-muted-foreground text-sm">Enter your email and we&apos;ll send you a reset link</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="h-11 rounded-xl border-border bg-background focus-visible:ring-primary"
          />
        </div>
        <Button type="submit" disabled={loading} className="w-full h-11 rounded-full bg-red-600 hover:bg-red-500 text-white font-semibold transition-all hover:shadow-lg hover:shadow-red-500/25">
          {loading ? 'Sending...' : 'Send reset link'}
        </Button>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        <Link href="/?auth=login" className="text-primary hover:underline inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />Back to login
        </Link>
      </p>
    </div>
  )
}
