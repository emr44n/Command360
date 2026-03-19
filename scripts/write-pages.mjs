import { writeFileSync } from 'fs'
import { join } from 'path'

const base = 'D:/My Products/Command360/src'

// ── Landing page ──────────────────────────────────────────────────────────────
writeFileSync(join(base, 'app/page.tsx'), `import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BarChart2, Cloud, HelpCircle, MessageCircle, ClipboardList, Sparkles, ArrowRight, Users, Zap, Play, CheckCircle2 } from 'lucide-react'

const SLIDE_TYPES = [
  { icon: BarChart2, label: 'Live Polling', description: 'Real-time votes with instant animated bar charts.', color: 'text-blue-500' },
  { icon: Cloud, label: 'Word Cloud', description: 'Collect words and visualise them in a live cloud.', color: 'text-sky-500' },
  { icon: HelpCircle, label: 'Quiz', description: 'Timed questions with automatic scoring and leaderboard.', color: 'text-emerald-500' },
  { icon: MessageCircle, label: 'Q&A', description: 'Let the audience submit and upvote questions.', color: 'text-amber-500' },
  { icon: ClipboardList, label: 'Survey', description: 'Multi-question forms with ratings and multiple choice.', color: 'text-rose-500' },
  { icon: Sparkles, label: 'AI Insights', description: 'Gemini-powered summaries, suggestions and quiz generation.', color: 'text-purple-500' },
]
const FEATURES = [
  { eyebrow: 'Real-time', title: 'Your audience responds instantly.', description: 'Live results appear the moment participants submit. No page refresh, no delay.', icon: Zap, points: ['Animated bar charts update live', 'Word clouds grow as words arrive', 'Quiz leaderboard refreshes in real time'] },
  { eyebrow: 'Powered by AI', title: 'Gemini handles the heavy lifting.', description: 'From generating quiz questions to summarising an entire session.', icon: Sparkles, points: ['Auto-generate quiz questions from any topic', 'Stream suggested answers for Q&A', 'Post-session executive summary in seconds'] },
  { eyebrow: 'Zero friction', title: 'Participants join in seconds.', description: 'No app download, no account required. Share a 6-digit code or QR code.', icon: Users, points: ['Works on any device', 'Anonymous or named participation', 'Persistent score across quiz slides'] },
]
const STEPS = [
  { n: '01', title: 'Create', desc: 'Build your deck with polls, quizzes, word clouds, surveys and Q&A.' },
  { n: '02', title: 'Present', desc: 'Share your 6-digit code or QR. Participants join instantly.' },
  { n: '03', title: 'Analyse', desc: 'See live results, get AI summaries, and export insights.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'Command 360', applicationCategory: 'PresentationApplication', description: 'AI-powered interactive presentation platform.', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }) }} />

      {/* Nav */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/60">
        <nav className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold text-foreground">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center"><Zap className="w-3.5 h-3.5 text-primary-foreground" /></div>
            Command 360
          </Link>
          <div className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
            <a href="#slides" className="hover:text-foreground transition-colors">Slide types</a>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/join"><Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hidden sm:flex">Join session</Button></Link>
            <Link href="/login"><Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">Sign in</Button></Link>
            <Link href="/register"><Button size="sm" className="rounded-full px-5 bg-primary hover:bg-primary/90 text-primary-foreground">Get started</Button></Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="blob blob-delay absolute -top-40 -left-20 w-[600px] h-[600px] rounded-full bg-primary/8 blur-3xl" />
          <div className="blob blob-delay-2 absolute -bottom-20 -right-20 w-[500px] h-[500px] rounded-full bg-sky-400/8 blur-3xl" />
        </div>
        <div className="max-w-5xl mx-auto px-5 pt-28 pb-24 text-center">
          <div className="inline-flex items-center gap-2 border border-border rounded-full px-4 py-1.5 text-sm text-muted-foreground mb-8">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            Powered by Google Gemini
          </div>
          <h1 className="text-[clamp(2.6rem,8vw,5.5rem)] font-semibold tracking-tight leading-[1.05] mb-6">
            Interactive presentations<br />
            <span className="text-primary">your audience will love.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Live polls, word clouds, quizzes, Q&amp;A and surveys all in one platform, with AI-powered insights in real time.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register"><Button size="lg" className="rounded-full px-8 gap-2 text-base bg-primary hover:bg-primary/90 text-primary-foreground h-12">Create your first presentation <ArrowRight className="w-4 h-4" /></Button></Link>
            <Link href="/join"><Button size="lg" variant="outline" className="rounded-full px-8 gap-2 text-base h-12 border-border hover:bg-muted"><Users className="w-4 h-4" /> Join with a code</Button></Link>
          </div>
          <p className="mt-10 text-sm text-muted-foreground">Free to get started · No credit card required</p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-5 py-24 space-y-32">
        {FEATURES.map((f, i) => {
          const Icon = f.icon
          const isReversed = i % 2 !== 0
          return (
            <div key={f.title} className={\`flex flex-col \${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 md:gap-20\`}>
              <div className="flex-1 space-y-5">
                <p className="text-sm font-medium text-primary uppercase tracking-widest">{f.eyebrow}</p>
                <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">{f.title}</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">{f.description}</p>
                <ul className="space-y-2.5">{f.points.map((pt) => (<li key={pt} className="flex items-start gap-2.5 text-sm text-muted-foreground"><CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />{pt}</li>))}</ul>
              </div>
              <div className="flex-1 w-full"><div className="bg-muted rounded-3xl aspect-video flex items-center justify-center border border-border"><Icon className="w-16 h-16 text-primary/30" /></div></div>
            </div>
          )
        })}
      </section>

      {/* How it works */}
      <section id="how" className="border-y border-border bg-muted/40">
        <div className="max-w-6xl mx-auto px-5 py-24">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">How it works</p>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Up and running in minutes.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step) => (
              <div key={step.n} className="space-y-4">
                <div className="text-5xl font-bold text-border">{step.n}</div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Slide types */}
      <section id="slides" className="max-w-6xl mx-auto px-5 py-24">
        <div className="text-center mb-14">
          <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">Slide types</p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">Six ways to engage your audience.</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">Mix and match any combination in a single presentation.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SLIDE_TYPES.map((s) => (<div key={s.label} className="group p-6 rounded-2xl border border-border hover:border-primary/30 hover:shadow-sm bg-card transition-all duration-200"><s.icon className={\`w-6 h-6 mb-4 \${s.color}\`} /><h3 className="font-semibold mb-1.5">{s.label}</h3><p className="text-muted-foreground text-sm leading-relaxed">{s.description}</p></div>))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-5 pb-24">
        <div className="bg-primary rounded-3xl px-8 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4 text-primary-foreground">Ready to engage your audience?</h2>
          <p className="text-primary-foreground/70 mb-8 text-lg">Free to get started. No credit card required.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register"><Button size="lg" className="rounded-full px-8 gap-2 text-base h-12 bg-white text-primary hover:bg-white/90">Get started free <ArrowRight className="w-4 h-4" /></Button></Link>
            <Link href="/join"><Button size="lg" variant="ghost" className="rounded-full px-8 gap-2 text-base h-12 text-primary-foreground hover:bg-white/10"><Play className="w-4 h-4" /> Join a session</Button></Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-5 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 font-medium text-foreground">
            <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center"><Zap className="w-3 h-3 text-primary-foreground" /></div>
            Command 360
          </div>
          <div className="flex gap-6">
            <Link href="/join" className="hover:text-foreground transition-colors">Join session</Link>
            <Link href="/login" className="hover:text-foreground transition-colors">Sign in</Link>
            <Link href="/register" className="hover:text-foreground transition-colors">Register</Link>
          </div>
          <p>2025 Command 360. Built with Next.js &amp; Supabase.</p>
        </div>
      </footer>
    </div>
  )
}
`)

// ── Auth layout ────────────────────────────────────────────────────────────────
writeFileSync(join(base, 'app/(auth)/layout.tsx'), `import Link from 'next/link'
import { Zap } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left brand panel — hidden on mobile */}
      <div className="hidden lg:flex lg:w-[45%] bg-primary flex-col justify-between p-10 text-primary-foreground">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          Command 360
        </Link>
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold leading-tight">
            The interactive presentation platform your audience will love.
          </h2>
          <p className="text-primary-foreground/70 text-lg leading-relaxed">
            Live polls, quizzes, word clouds and AI insights — all in one place.
          </p>
        </div>
        <p className="text-primary-foreground/40 text-sm">© 2025 Command 360</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <header className="lg:hidden p-5 border-b border-border">
          <Link href="/" className="flex items-center gap-2 font-semibold text-foreground w-fit">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            Command 360
          </Link>
        </header>
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-sm">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
`)

// ── Login page ─────────────────────────────────────────────────────────────────
writeFileSync(join(base, 'app/(auth)/login/page.tsx'), `import { LoginForm } from '@/components/auth/LoginForm'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Sign in' }

export default function LoginPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground text-sm">Sign in to your Command 360 account</p>
      </div>
      <LoginForm />
      <div className="space-y-3 text-center text-sm">
        <p className="text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-primary hover:underline font-medium">Sign up free</Link>
        </p>
        <p>
          <Link href="/forgot-password" className="text-muted-foreground hover:text-foreground transition-colors text-xs">
            Forgot your password?
          </Link>
        </p>
      </div>
    </div>
  )
}
`)

// ── Register page ──────────────────────────────────────────────────────────────
writeFileSync(join(base, 'app/(auth)/register/page.tsx'), `import { RegisterForm } from '@/components/auth/RegisterForm'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Create account' }

export default function RegisterPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
        <p className="text-muted-foreground text-sm">Start creating interactive presentations for free</p>
      </div>
      <RegisterForm />
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="text-primary hover:underline font-medium">Sign in</Link>
      </p>
    </div>
  )
}
`)

// ── LoginForm ──────────────────────────────────────────────────────────────────
writeFileSync(join(base, 'components/auth/LoginForm.tsx'), `'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { toast.error(error.message); setLoading(false); return }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-sm font-medium">Email</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com" required disabled={loading}
          className="h-11 rounded-xl border-border bg-background focus-visible:ring-primary" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password" className="text-sm font-medium">Password</Label>
        <div className="relative">
          <Input id="password" type={showPassword ? 'text' : 'password'} value={password}
            onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required disabled={loading}
            className="h-11 rounded-xl border-border bg-background pr-10 focus-visible:ring-primary" />
          <button type="button" onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>
      <Button type="submit" disabled={loading} className="w-full h-11 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
        {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Signing in...</> : 'Sign in'}
      </Button>
    </form>
  )
}
`)

// ── RegisterForm ───────────────────────────────────────────────────────────────
writeFileSync(join(base, 'components/auth/RegisterForm.tsx'), `'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

export function RegisterForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { display_name: name.trim() } } })
    if (error) { toast.error(error.message); setLoading(false); return }
    toast.success('Account created! Redirecting...')
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="name" className="text-sm font-medium">Full name</Label>
        <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)}
          placeholder="Jane Smith" required disabled={loading}
          className="h-11 rounded-xl border-border bg-background focus-visible:ring-primary" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-sm font-medium">Email</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com" required disabled={loading}
          className="h-11 rounded-xl border-border bg-background focus-visible:ring-primary" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password" className="text-sm font-medium">Password</Label>
        <div className="relative">
          <Input id="password" type={showPassword ? 'text' : 'password'} value={password}
            onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters"
            required minLength={6} disabled={loading}
            className="h-11 rounded-xl border-border bg-background pr-10 focus-visible:ring-primary" />
          <button type="button" onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>
      <Button type="submit" disabled={loading} className="w-full h-11 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
        {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Creating account...</> : 'Create account'}
      </Button>
    </form>
  )
}
`)

// ── Join page ──────────────────────────────────────────────────────────────────
writeFileSync(join(base, 'app/join/page.tsx'), `'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, Zap } from 'lucide-react'

export default function JoinPage() {
  const [roomCode, setRoomCode] = useState('')
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const code = roomCode.trim().toUpperCase()
    if (!code) return
    router.push(\`/join/\${code}\`)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="p-5">
        <Link href="/" className="flex items-center gap-2 font-semibold text-foreground w-fit">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          Command 360
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-5">
        <div className="w-full max-w-sm space-y-10 text-center">
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight">Join a session</h1>
            <p className="text-muted-foreground">Enter the room code shown on the presenter screen</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
              placeholder="A B C 1 2 3"
              maxLength={6}
              autoFocus
              autoCapitalize="characters"
              className="w-full text-center text-3xl font-mono font-semibold tracking-[0.4em] h-16 rounded-2xl border border-border bg-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/40 placeholder:text-xl placeholder:tracking-widest"
            />
            <Button
              type="submit"
              disabled={roomCode.trim().length < 4}
              className="w-full h-12 rounded-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-base"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-block">
            ← Back to home
          </Link>
        </div>
      </main>
    </div>
  )
}
`)

// ── Join room page ─────────────────────────────────────────────────────────────
writeFileSync(join(base, 'app/join/[roomCode]/page.tsx'), `'use client'
import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { ArrowRight, Loader2, Zap } from 'lucide-react'
import Link from 'next/link'

export default function JoinRoomPage() {
  const params = useParams()
  const roomCode = String(params.roomCode).toUpperCase()
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault()
    const name = displayName.trim()
    if (!name || loading) return
    setLoading(true)
    const res = await fetch('/api/join', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ room_code: roomCode, display_name: name }) })
    if (!res.ok) {
      const err = await res.json()
      toast.error(err.error || 'Failed to join session')
      setLoading(false)
      return
    }
    const data = await res.json()
    sessionStorage.setItem('participant_id', data.participant_id)
    sessionStorage.setItem('client_token', data.client_token)
    sessionStorage.setItem('display_name', data.display_name)
    sessionStorage.setItem('session_id', data.session_id)
    router.push(\`/participate/\${data.session_id}\`)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="p-5">
        <Link href="/" className="flex items-center gap-2 font-semibold text-foreground w-fit">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          Command 360
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-5">
        <div className="w-full max-w-sm space-y-10 text-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 border border-border rounded-full px-4 py-1.5 text-sm font-mono font-semibold tracking-widest text-foreground">
              {roomCode}
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">What&apos;s your name?</h1>
            <p className="text-muted-foreground text-sm">This is how you&apos;ll appear to the presenter</p>
          </div>
          <form onSubmit={handleJoin} className="space-y-4">
            <div className="space-y-1.5 text-left">
              <Label htmlFor="name" className="text-sm font-medium">Display name</Label>
              <Input id="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name" maxLength={30} disabled={loading} autoFocus
                className="h-12 rounded-xl text-base border-border bg-background focus-visible:ring-primary" />
            </div>
            <Button type="submit" disabled={!displayName.trim() || loading}
              className="w-full h-12 rounded-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-base">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Joining...</> : <>Join Session <ArrowRight className="w-4 h-4" /></>}
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
`)

// ── Dashboard layout ───────────────────────────────────────────────────────────
writeFileSync(join(base, 'app/(dashboard)/layout.tsx'), `import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardSidebar } from '@/components/layout/DashboardSidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="h-screen flex bg-muted/30 overflow-hidden">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto bg-background">
        {children}
      </main>
    </div>
  )
}
`)

// ── Dashboard sidebar ──────────────────────────────────────────────────────────
writeFileSync(join(base, 'components/layout/DashboardSidebar.tsx'), `'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, LogOut, Zap } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="w-56 bg-background border-r border-border flex flex-col h-full shrink-0">
      <div className="px-5 h-14 flex items-center border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-sm text-foreground">
          <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
            <Zap className="w-3 h-3 text-primary-foreground" />
          </div>
          Command 360
        </Link>
      </div>
      <nav className="flex-1 p-3 space-y-0.5">
        {NAV_ITEMS.map((item) => (
          <Link key={item.href} href={item.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              pathname === item.href || pathname.startsWith(item.href + '/')
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-3 border-t border-border">
        <button onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted w-full transition-colors">
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
`)

// ── Dashboard topbar ───────────────────────────────────────────────────────────
writeFileSync(join(base, 'components/layout/DashboardTopbar.tsx'), `'use client'
import { Zap } from 'lucide-react'
import Link from 'next/link'

interface DashboardTopbarProps {
  title?: string
  actions?: React.ReactNode
}

export function DashboardTopbar({ title, actions }: DashboardTopbarProps) {
  return (
    <header className="h-14 bg-background border-b border-border flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="flex items-center gap-2 lg:hidden">
          <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
            <Zap className="w-3 h-3 text-primary-foreground" />
          </div>
        </Link>
        {title && <h1 className="text-sm font-semibold text-foreground">{title}</h1>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  )
}
`)

// ── Dashboard page ─────────────────────────────────────────────────────────────
writeFileSync(join(base, 'app/(dashboard)/dashboard/page.tsx'), `import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PresentationGrid } from '@/components/presentations/PresentationGrid'
import { CreatePresentationButton } from '@/components/presentations/CreatePresentationButton'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: presentations } = await supabase
    .from('presentations')
    .select('*, slides(count)')
    .eq('user_id', user.id)
    .eq('is_archived', false)
    .order('updated_at', { ascending: false })

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">My Presentations</h1>
          <p className="text-muted-foreground text-sm mt-1">{presentations?.length || 0} presentation{presentations?.length !== 1 ? 's' : ''}</p>
        </div>
        <CreatePresentationButton />
      </div>
      <PresentationGrid presentations={presentations || []} />
    </div>
  )
}
`)

// ── Presentation grid ──────────────────────────────────────────────────────────
writeFileSync(join(base, 'components/presentations/PresentationGrid.tsx'), `'use client'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { MoreHorizontal, Pencil, BarChart2, Trash2, Play, FilePresentation } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface Presentation { id: string; title: string; description?: string; updated_at: string; slides?: Array<{ count: number }> | number }

export function PresentationGrid({ presentations }: { presentations: Presentation[] }) {
  const router = useRouter()

  if (presentations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-5">
          <FilePresentation className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No presentations yet</h3>
        <p className="text-muted-foreground text-sm max-w-xs">Create your first presentation to get started with live polls, quizzes and more.</p>
      </div>
    )
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(\`Delete "\${title}"? This cannot be undone.\`)) return
    const res = await fetch(\`/api/presentations/\${id}\`, { method: 'DELETE' })
    if (res.ok) { toast.success('Presentation deleted'); router.refresh() } else { toast.error('Failed to delete') }
  }

  async function handleStart(presentationId: string) {
    const res = await fetch('/api/sessions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ presentation_id: presentationId }) })
    if (res.ok) { const data = await res.json(); router.push(\`/present/\${data.session.id}\`) } else { toast.error('Failed to start session') }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {presentations.map((pres) => {
        const slideCount = Array.isArray(pres.slides) ? pres.slides.reduce((sum, s) => sum + (s.count || 0), 0) : pres.slides || 0
        return (
          <div key={pres.id} className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md transition-all duration-200">
            <Link href={\`/presentations/\${pres.id}/edit\`} className="block">
              <div className="h-36 bg-muted flex items-center justify-center group-hover:bg-muted/70 transition-colors">
                <FilePresentation className="w-10 h-10 text-muted-foreground/30 group-hover:text-primary/30 transition-colors" />
              </div>
            </Link>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <Link href={\`/presentations/\${pres.id}/edit\`}>
                    <h3 className="font-medium text-foreground truncate hover:text-primary transition-colors text-sm">{pres.title || 'Untitled'}</h3>
                  </Link>
                  <p className="text-muted-foreground text-xs mt-1">{slideCount} slide{slideCount !== 1 ? 's' : ''} · {formatDistanceToNow(new Date(pres.updated_at), { addSuffix: true })}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem onClick={() => router.push(\`/presentations/\${pres.id}/edit\`)} className="gap-2 text-sm"><Pencil className="w-3.5 h-3.5" />Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStart(pres.id)} className="gap-2 text-sm"><Play className="w-3.5 h-3.5" />Start session</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(\`/presentations/\${pres.id}/results\`)} className="gap-2 text-sm"><BarChart2 className="w-3.5 h-3.5" />Results</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleDelete(pres.id, pres.title)} className="gap-2 text-sm text-destructive focus:text-destructive"><Trash2 className="w-3.5 h-3.5" />Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
`)

// ── Create presentation button ─────────────────────────────────────────────────
writeFileSync(join(base, 'components/presentations/CreatePresentationButton.tsx'), `'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

export function CreatePresentationButton() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleCreate() {
    if (!title.trim() || loading) return
    setLoading(true)
    const res = await fetch('/api/presentations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: title.trim(), description: description.trim() }) })
    if (res.ok) {
      const data = await res.json()
      toast.success('Presentation created!')
      setOpen(false); setTitle(''); setDescription('')
      router.push(\`/presentations/\${data.presentation.id}/edit\`)
    } else { toast.error('Failed to create presentation') }
    setLoading(false)
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} className="rounded-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
        <Plus className="w-4 h-4" /> New Presentation
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="text-lg font-semibold">New presentation</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="My awesome presentation"
                className="h-10 rounded-xl" onKeyDown={(e) => e.key === 'Enter' && handleCreate()} autoFocus />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Description <span className="text-muted-foreground font-normal">(optional)</span></Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this presentation about?" rows={3} className="rounded-xl resize-none" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)} className="text-muted-foreground">Cancel</Button>
            <Button onClick={handleCreate} disabled={!title.trim() || loading} className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground">
              {loading ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
`)

console.log('All pages written successfully!')
