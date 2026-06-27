'use client'
import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Loader2, ClipboardPaste } from 'lucide-react'

interface Props {
  variant?: 'hero' | 'page' | 'compact' | 'v5'
  className?: string
}

export function JoinCodeInput({ variant = 'hero', className = '' }: Props) {
  const [code, setCode] = useState('')
  const [joining, setJoining] = useState(false)
  const [focused, setFocused] = useState(false)
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
      <form onSubmit={handleSubmit} className={`flex items-center gap-2 ${className}`}>
        <input
          ref={inputRef}
          value={code}
          onChange={handleChange}
          placeholder="Enter code"
          maxLength={6}
          autoCapitalize="characters"
          className="w-[140px] text-center text-sm font-mono font-semibold tracking-widest px-3 h-10 rounded-none border border-border bg-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:tracking-normal placeholder:text-sm"
        />
        <button
          type="submit"
          disabled={code.trim().length < 4 || joining}
          className="h-10 w-10 flex items-center justify-center rounded-none bg-primary text-primary-foreground disabled:opacity-40 transition-all hover:bg-primary/90 btn-animated shrink-0"
        >
          {joining ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
        </button>
      </form>
    )
  }

  if (variant === 'v5') {
    // Hard-edged "regimental" join input for the v5 dark surfaces.
    return (
      <form onSubmit={handleSubmit} className={`flex items-stretch border border-white/20 ${className}`}>
        <div className="relative flex-1 min-w-0 flex">
          <input
            ref={inputRef}
            value={code}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder=""
            maxLength={6}
            autoCapitalize="characters"
            aria-label="Session join code"
            className="ff-mono w-full min-w-0 bg-transparent border-none text-white text-[15px] font-semibold tracking-[0.22em] px-4 py-3 outline-none"
          />
          {/* Animated terminal-style placeholder — light weight (matching the
              "Joining a session?" label) with a thin blinking caret. Purely
              decorative; the field below is fully usable. */}
          {!code && !focused && (
            <span aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none ff-mono text-[12px] font-medium tracking-[0.14em] text-white/35 flex items-center gap-[3px]">
              ENTER CODE<span className="inline-block w-[1.5px] h-[13px] bg-white/45" style={{ animation: 'v5caret 1s step-end infinite' }} />
            </span>
          )}
        </div>
        <button
          type="submit"
          disabled={code.trim().length < 4 || joining}
          className="ff-mono bg-white text-[#0F1216] font-semibold text-[12.5px] tracking-[0.06em] uppercase px-5 hover:bg-[#C9241A] hover:text-white transition-colors disabled:hover:bg-white disabled:hover:text-[#0F1216] inline-flex items-center gap-1.5 shrink-0"
        >
          {joining ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Join <ArrowRight className="w-3.5 h-3.5" /></>}
        </button>
      </form>
    )
  }

  if (variant === 'page') {
    return (
      <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
        <div className="relative">
          <input
            ref={inputRef}
            value={code}
            onChange={handleChange}
            placeholder="A B C 1 2 3"
            maxLength={6}
            autoFocus
            autoCapitalize="characters"
            className="w-full text-center text-3xl font-mono font-semibold tracking-[0.4em] h-16 rounded-none border border-border bg-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 code-glow transition-all placeholder:text-muted-foreground/30 placeholder:text-xl placeholder:tracking-widest"
          />
          <button
            type="button"
            onClick={async () => {
              try {
                const text = await navigator.clipboard.readText()
                const cleaned = text.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6)
                if (cleaned) setCode(cleaned)
              } catch {}
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-none text-[11px] font-medium bg-red-600 text-white border border-red-500/30 hover:bg-red-500 transition-colors"
          >
            Paste
          </button>
        </div>
        <button
          type="submit"
          disabled={code.trim().length < 4 || joining}
          className="w-full h-12 rounded-none gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-base inline-flex items-center justify-center btn-animated disabled:opacity-40 disabled:pointer-events-none"
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
          className="w-40 text-center text-sm font-mono font-semibold tracking-widest pl-3 pr-14 py-2.5 rounded-none border border-border bg-background/80 backdrop-blur-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 code-glow transition-all placeholder:text-muted-foreground/40 placeholder:font-normal placeholder:tracking-normal"
        />
        <button
          type="button"
          onClick={async () => {
            try {
              const text = await navigator.clipboard.readText()
              const cleaned = text.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6)
              if (cleaned) setCode(cleaned)
            } catch {}
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-none text-[11px] font-medium bg-red-600 text-white border border-red-500/30 hover:bg-red-500 transition-colors"
        >
          Paste
        </button>
      </div>
      <button
        type="submit"
        disabled={code.trim().length < 4 || joining}
        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-none bg-foreground text-background text-sm font-medium disabled:opacity-40 transition-all hover:bg-foreground/90 btn-animated"
      >
        {joining ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <>Join <ArrowRight className="w-3.5 h-3.5" /></>}
      </button>
    </form>
  )
}
