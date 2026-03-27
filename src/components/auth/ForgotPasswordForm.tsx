'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2, Mail } from 'lucide-react'

export function ForgotPasswordForm() {
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
      <div className="text-center py-4 space-y-4">
        <div className="w-14 h-14 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
          <Mail className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <p className="text-white font-medium mb-1">Check your email</p>
          <p className="text-white/40 text-sm">
            We sent a password reset link to <strong className="text-white/70">{email}</strong>
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="reset-email" className="text-sm font-medium text-white/60">Email</Label>
        <Input
          id="reset-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          disabled={loading}
          className="h-11 rounded-xl border-white/[0.08] bg-white/[0.04] text-white placeholder:text-white/25 focus-visible:ring-red-500/40 focus-visible:border-white/[0.12]"
        />
      </div>
      <Button type="submit" disabled={loading} className="w-full h-11 rounded-full bg-red-600 hover:bg-red-500 text-white font-semibold transition-all hover:shadow-lg hover:shadow-red-500/25 cursor-pointer">
        {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Sending...</> : 'Send reset link'}
      </Button>
    </form>
  )
}
