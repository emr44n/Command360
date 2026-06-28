'use client'
import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { ArrowRight, Loader2 } from 'lucide-react'
import { BrandMark } from '@/components/site/BrandMark'
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
    router.push(`/participate/${data.session_id}`)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="p-5">
        <Link href="/" className="flex items-center gap-2 font-semibold text-foreground w-fit">
          <BrandMark size={28} />
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
              className="w-full h-12 rounded-full gap-2 bg-red-600 hover:bg-red-500 text-white font-medium text-base transition-all hover:shadow-lg hover:shadow-red-500/25">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Joining...</> : <>Join Session <ArrowRight className="w-4 h-4" /></>}
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
