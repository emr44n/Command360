'use client'
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
      toast.success('Session created!')
      setOpen(false); setTitle(''); setDescription('')
      router.push(`/presentations/${data.presentation.id}/edit`)
    } else { toast.error('Failed to create session') }
    setLoading(false)
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} className="rounded-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
        <Plus className="w-4 h-4" /> New Session
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="text-lg font-semibold">New Session</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="My awesome session"
                className="h-10 rounded-xl" onKeyDown={(e) => e.key === 'Enter' && handleCreate()} autoFocus />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Description <span className="text-muted-foreground font-normal">(optional)</span></Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this session about?" rows={3} className="rounded-xl resize-none" />
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
