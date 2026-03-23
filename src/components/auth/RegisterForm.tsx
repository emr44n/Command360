'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Eye, EyeOff, Loader2, Mail } from 'lucide-react'

export function RegisterForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { display_name: name.trim() } } })
    if (error) { toast.error(error.message); setLoading(false); return }
    if (data.session) {
      toast.success('Account created! Redirecting...')
      router.push('/dashboard')
      router.refresh()
    } else {
      setEmailSent(true)
      setLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="text-center space-y-4 py-4">
        <div className="w-16 h-16 bg-red-600/10 rounded-full flex items-center justify-center mx-auto ring-1 ring-red-500/20">
          <Mail className="w-8 h-8 text-red-400" />
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-white text-lg">Check your email</h3>
          <p className="text-white/40 text-sm">
            We sent a confirmation link to <span className="font-medium text-white/70">{email}</span>.
            Click the link to activate your account.
          </p>
        </div>
        <p className="text-xs text-white/25">
          Didn&apos;t receive it? Check your spam folder.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="name" className="text-sm font-medium text-white/60">Full name</Label>
        <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)}
          placeholder="Jane Smith" required disabled={loading}
          className="h-11 rounded-xl border-white/[0.08] bg-white/[0.04] text-white placeholder:text-white/25 focus-visible:ring-red-500/40 focus-visible:border-white/[0.12]" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-sm font-medium text-white/60">Email</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com" required disabled={loading}
          className="h-11 rounded-xl border-white/[0.08] bg-white/[0.04] text-white placeholder:text-white/25 focus-visible:ring-red-500/40 focus-visible:border-white/[0.12]" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password" className="text-sm font-medium text-white/60">Password</Label>
        <div className="relative">
          <Input id="password" type={showPassword ? 'text' : 'password'} value={password}
            onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters"
            required minLength={6} disabled={loading}
            className="h-11 rounded-xl border-white/[0.08] bg-white/[0.04] text-white placeholder:text-white/25 pr-10 focus-visible:ring-red-500/40 focus-visible:border-white/[0.12]" />
          <button type="button" onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>
      <Button type="submit" disabled={loading} className="w-full h-11 rounded-full bg-red-600 hover:bg-red-500 text-white font-semibold transition-all hover:shadow-lg hover:shadow-red-500/25 cursor-pointer">
        {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Creating account...</> : 'Start free trial'}
      </Button>
    </form>
  )
}
