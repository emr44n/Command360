'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuthSlideOver } from '@/components/auth/AuthSlideOverProvider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const { closeAuth } = useAuthSlideOver()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { toast.error(error.message); setLoading(false); return }
    // Force-close slide-over (even if it was required), then navigate to dashboard
    closeAuth(true)
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="email" className="ff-mono text-[11px] uppercase tracking-[0.1em] text-[#7c828a]">Email</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com" required disabled={loading}
          className="h-11 rounded-none shadow-none border border-white/15 bg-white/[0.03] text-white placeholder:text-white/25 focus:border-[#C9241A] focus:outline-none focus-visible:ring-0" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password" className="ff-mono text-[11px] uppercase tracking-[0.1em] text-[#7c828a]">Password</Label>
        <div className="relative">
          <Input id="password" type={showPassword ? 'text' : 'password'} value={password}
            onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required disabled={loading}
            className="h-11 rounded-none shadow-none border border-white/15 bg-white/[0.03] text-white placeholder:text-white/25 pr-10 focus:border-[#C9241A] focus:outline-none focus-visible:ring-0" />
          <button type="button" onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>
      <Button type="submit" disabled={loading} className="v5-glow w-full h-11 rounded-none bg-[#C9241A] hover:bg-[#a91d14] text-white ff-mono uppercase tracking-[0.05em] font-semibold transition-colors cursor-pointer">
        {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Signing in...</> : 'Sign in'}
      </Button>
    </form>
  )
}
