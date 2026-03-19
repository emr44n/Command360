'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { User, Mail, Shield, Moon, Sun } from 'lucide-react'

interface Props {
  user: { id: string; email: string; displayName: string }
}

export function ProfileSettings({ user }: Props) {
  const [displayName, setDisplayName] = useState(user.displayName)
  const [saving, setSaving] = useState(false)
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    }
    return 'light'
  })
  const supabase = createClient()

  async function handleSave() {
    setSaving(true)
    const { error } = await supabase.auth.updateUser({ data: { display_name: displayName.trim() } })
    if (error) toast.error(error.message)
    else toast.success('Profile updated')
    setSaving(false)
  }

  function toggleTheme(checked: boolean) {
    const next = checked ? 'dark' : 'light'
    setTheme(next)
    document.documentElement.classList.toggle('dark', next === 'dark')
    localStorage.setItem('theme', next)
  }

  return (
    <div className="space-y-8">
      {/* Profile Section */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Profile</h2>
            <p className="text-xs text-muted-foreground">Your personal information</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Display Name</Label>
            <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your name" className="max-w-sm" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Email</Label>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="w-4 h-4" />
              {user.email}
            </div>
          </div>
          <Button onClick={handleSave} disabled={saving || !displayName.trim()} className="bg-red-600 hover:bg-red-500 text-white rounded-full transition-all hover:shadow-lg hover:shadow-red-500/25">
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Appearance Section */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            {theme === 'dark' ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-primary" />}
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Appearance</h2>
            <p className="text-xs text-muted-foreground">Customize how Command 360 looks</p>
          </div>
        </div>
        <div className="flex items-center justify-between bg-muted/50 rounded-xl p-4">
          <div>
            <p className="text-sm font-medium text-foreground">Dark Mode</p>
            <p className="text-xs text-muted-foreground">Toggle between light and dark theme</p>
          </div>
          <Switch
            checked={theme === 'dark'}
            onCheckedChange={toggleTheme}
          />
        </div>
      </div>

      {/* Account Section */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Account</h2>
            <p className="text-xs text-muted-foreground">Account security and data</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Account ID</p>
              <p className="text-xs text-muted-foreground font-mono">{user.id.slice(0, 8)}...{user.id.slice(-4)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
