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
        <div className="w-14 h-14 bg-emerald-500/10 flex items-center justify-center mx-auto border border-emerald-500/20">
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
        <Label htmlFor="reset-email" className="ff-mono text-[11px] uppercase tracking-[0.1em] text-[#7c828a]">Email</Label>
        <Input
          id="reset-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          disabled={loading}
          className="h-11 rounded-none shadow-none border border-white/15 bg-white/[0.03] text-white placeholder:text-white/25 focus:border-[#C9241A] focus:outline-none focus-visible:ring-0"
        />
      </div>
      <Button type="submit" disabled={loading} className="v5-glow w-full h-11 rounded-none bg-[#C9241A] hover:bg-[#a91d14] text-white ff-mono uppercase tracking-[0.05em] font-semibold transition-colors cursor-pointer">
        {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Sending...</> : 'Send reset link'}
      </Button>
    </form>
  )
}
