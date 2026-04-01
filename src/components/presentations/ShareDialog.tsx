'use client'

import { useState, useEffect } from 'react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Copy, Mail, Link2, Trash2 } from 'lucide-react'

interface ShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  presentationId: string
  presentationTitle: string
}

interface ShareEntry {
  email: string
  permission: 'view' | 'edit'
  sharedAt: string
}

const STORAGE_KEY_PREFIX = 'c360_shares_'

export function ShareDialog({ open, onOpenChange, presentationId, presentationTitle }: ShareDialogProps) {
  const [email, setEmail] = useState('')
  const [permission, setPermission] = useState<'view' | 'edit'>('view')
  const [shares, setShares] = useState<ShareEntry[]>([])

  const storageKey = STORAGE_KEY_PREFIX + presentationId

  useEffect(() => {
    if (open) {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        try { setShares(JSON.parse(stored)) } catch { /* ignore */ }
      } else {
        setShares([])
      }
    }
  }, [open, storageKey])

  function addShare() {
    const trimmed = email.trim().toLowerCase()
    if (!trimmed || !trimmed.includes('@')) {
      toast.error('Please enter a valid email')
      return
    }
    if (shares.some(s => s.email === trimmed)) {
      toast.error('Already shared with this email')
      return
    }
    const next = [...shares, { email: trimmed, permission, sharedAt: new Date().toISOString() }]
    setShares(next)
    localStorage.setItem(storageKey, JSON.stringify(next))
    setEmail('')
    toast.success(`Shared with ${trimmed}`)
  }

  function removeShare(emailToRemove: string) {
    const next = shares.filter(s => s.email !== emailToRemove)
    setShares(next)
    localStorage.setItem(storageKey, JSON.stringify(next))
    toast.success('Removed')
  }

  function copyLink() {
    const url = `${window.location.origin}/presentations/${presentationId}/edit`
    navigator.clipboard.writeText(url).then(() => toast.success('Link copied!'))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Presentation</DialogTitle>
          <DialogDescription>
            Share &quot;{presentationTitle}&quot; with others
          </DialogDescription>
        </DialogHeader>

        {/* Email input + permission + add */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addShare()}
                className="pl-9"
              />
            </div>
            <select
              value={permission}
              onChange={e => setPermission(e.target.value as 'view' | 'edit')}
              className="h-9 rounded-md border border-border bg-background px-2 text-sm"
            >
              <option value="view">View</option>
              <option value="edit">Edit</option>
            </select>
            <Button onClick={addShare} size="sm">Share</Button>
          </div>

          {/* Copy link */}
          <Button variant="outline" className="w-full gap-2" onClick={copyLink}>
            <Link2 className="w-4 h-4" />
            Copy Link
          </Button>
        </div>

        {/* Shared list */}
        {shares.length > 0 && (
          <div className="space-y-2 mt-2">
            <p className="text-xs font-medium text-muted-foreground">Shared with</p>
            {shares.map(s => (
              <div key={s.email} className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2">
                <div className="min-w-0">
                  <p className="text-sm truncate">{s.email}</p>
                  <p className="text-xs text-muted-foreground capitalize">{s.permission}</p>
                </div>
                <button onClick={() => removeShare(s.email)} className="text-muted-foreground hover:text-destructive shrink-0">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
