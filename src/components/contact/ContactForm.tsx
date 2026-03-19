'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Send, Loader2 } from 'lucide-react'

export function ContactForm() {
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSending(true)

    // Simulate sending — in production this would hit an API endpoint
    await new Promise((r) => setTimeout(r, 1500))

    setSending(false)
    setSent(true)
    toast.success('Message sent! We\'ll get back to you within 24 hours.')
  }

  if (sent) {
    return (
      <div className="bg-card border border-border rounded-2xl p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
          <Send className="w-5 h-5 text-emerald-500" />
        </div>
        <h3 className="font-semibold text-foreground mb-1">Message sent</h3>
        <p className="text-sm text-muted-foreground">
          Thank you for reaching out. We&apos;ll respond within 24 hours on business days.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Name</Label>
          <Input required placeholder="Your name" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Organisation</Label>
          <Input placeholder="e.g. London Fire Brigade" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Email</Label>
        <Input required type="email" placeholder="you@example.com" />
      </div>
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Subject</Label>
        <select className="w-full h-9 px-3 rounded-md border border-border bg-background text-sm text-foreground">
          <option>General enquiry</option>
          <option>Enterprise pricing</option>
          <option>Technical support</option>
          <option>Partnership</option>
          <option>Other</option>
        </select>
      </div>
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Message</Label>
        <textarea
          required
          rows={5}
          placeholder="How can we help?"
          className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>
      <Button type="submit" disabled={sending} className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
        {sending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Send message
          </>
        )}
      </Button>
    </form>
  )
}
