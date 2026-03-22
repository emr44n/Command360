'use client'
import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Loader2 } from 'lucide-react'

interface Props {
  variant?: 'hero' | 'page' | 'compact'
  className?: string
}

export function JoinCodeInput({ variant = 'hero', className = '' }: Props) {
  const [code, setCode] = useState('')
  const [joining, setJoining] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleSubmit = useCallback((e?: React.FormEvent) => {
    e?.preventDefault()
    const trimmed = code.trim().toUpperCase()
    if (trimmed.length < 4) return
    setJoining(true)
    router.push(`/join/${trimmed}`)
  }, [code, router])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
    setCode(val)
  }, [])

  if (variant === 'compact') {
    return (
      <form onSubmit={handleSubmit} className={`flex items-center gap-3 ${className}`}>
        <input
          ref={inputRef}
          value={code}
          onChange={handleChange}
          placeholder="Enter code"
          maxLength={6}
          autoCapitalize="characters"
          className="flex-1 min-w-[100px] max-w-[180px] text-center text-base font-mono font-semibold tracking-widest px-3 h-11 sm:h-12 rounded-xl border border-border bg-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:tracking-normal placeholder:text-sm"
        />
        <button
          type="submit"
          disabled={code.trim().length < 4 || joining}
          className="h-11 w-11 sm:h-12 sm:w-12 flex items-center justify-center rounded-xl bg-primary text-primary-foreground disabled:opacity-40 transition-all hover:bg-primary/90 btn-animated shrink-0"
        >
          {joining ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
        </button>
      </form>
    )
  }

  if (variant === 'page') {
    return (
      <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
        <input
          ref={inputRef}
          value={code}
          onChange={handleChange}
          placeholder="A B C 1 2 3"
          maxLength={6}
          autoFocus
          autoCapitalize="characters"
          className="w-full text-center text-3xl font-mono font-semibold tracking-[0.4em] h-16 rounded-2xl border border-border bg-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 code-glow transition-all placeholder:text-muted-foreground/30 placeholder:text-xl placeholder:tracking-widest"
        />
        <button
          type="submit"
          disabled={code.trim().length < 4 || joining}
          className="w-full h-12 rounded-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-base inline-flex items-center justify-center btn-animated disabled:opacity-40 disabled:pointer-events-none"
        >
          {joining ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Joining...
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    )
  }

  // Hero variant — inline, side-by-side
  return (
    <form onSubmit={handleSubmit} className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          value={code}
          onChange={handleChange}
          placeholder="Room code"
          maxLength={6}
          autoCapitalize="characters"
          className="w-40 text-center text-sm font-mono font-semibold tracking-widest px-3 py-2.5 rounded-full border border-border bg-background/80 backdrop-blur-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 code-glow transition-all placeholder:text-muted-foreground/40 placeholder:font-normal placeholder:tracking-normal"
        />
      </div>
      <button
        type="submit"
        disabled={code.trim().length < 4 || joining}
        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-foreground text-background text-sm font-medium disabled:opacity-40 transition-all hover:bg-foreground/90 btn-animated"
      >
        {joining ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <>Join <ArrowRight className="w-3.5 h-3.5" /></>}
      </button>
    </form>
  )
}
