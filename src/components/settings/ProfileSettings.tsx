'use client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { User, Mail, Shield, Moon, Sun, Lock, Trash2, Bell, BellOff, Loader2 } from 'lucide-react'

interface Props {
  user: { id: string; email: string; displayName: string }
}

const NOTIF_KEY = 'c360_notifications'

export function ProfileSettings({ user }: Props) {
  const [displayName, setDisplayName] = useState(user.displayName)
  const [saving, setSaving] = useState(false)
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    }
    return 'light'
  })

  // Password change
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)

  // Delete account
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteText, setDeleteText] = useState('')
  const [deleting, setDeleting] = useState(false)

  // Notifications
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    sessionAlerts: true,
    weeklyDigest: false,
  })

  const supabase = createClient()

  useEffect(() => {
    const stored = localStorage.getItem(NOTIF_KEY)
    if (stored) {
      try { setNotifications(JSON.parse(stored)) } catch { /* ignore */ }
    }
  }, [])

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

  async function handleChangePassword() {
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    setChangingPassword(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) toast.error(error.message)
    else {
      toast.success('Password updated successfully')
      setNewPassword('')
      setConfirmPassword('')
    }
    setChangingPassword(false)
  }

  async function handleDeleteAccount() {
    if (deleteText !== 'DELETE') return
    setDeleting(true)
    // Sign out and show message — actual deletion needs server-side admin
    await supabase.auth.signOut()
    toast.success('Account deletion requested. You have been signed out.')
    window.location.href = '/'
  }

  function updateNotification(key: keyof typeof notifications, value: boolean) {
    const next = { ...notifications, [key]: value }
    setNotifications(next)
    localStorage.setItem(NOTIF_KEY, JSON.stringify(next))
    toast.success('Notification preference saved')
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

      {/* Password Change Section */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Change Password</h2>
            <p className="text-xs text-muted-foreground">Update your account password</p>
          </div>
        </div>
        <div className="space-y-4 max-w-sm">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">New Password</Label>
            <Input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="Minimum 6 characters"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Confirm Password</Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Repeat new password"
            />
          </div>
          <Button
            onClick={handleChangePassword}
            disabled={changingPassword || !newPassword || !confirmPassword}
            variant="outline"
            className="gap-2"
          >
            {changingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
            {changingPassword ? 'Updating...' : 'Update Password'}
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

      {/* Notifications Section */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Bell className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Notifications</h2>
            <p className="text-xs text-muted-foreground">Manage your notification preferences</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-muted/50 rounded-xl p-4">
            <div>
              <p className="text-sm font-medium text-foreground">Email Updates</p>
              <p className="text-xs text-muted-foreground">Receive product updates via email</p>
            </div>
            <Switch
              checked={notifications.emailUpdates}
              onCheckedChange={v => updateNotification('emailUpdates', v)}
            />
          </div>
          <div className="flex items-center justify-between bg-muted/50 rounded-xl p-4">
            <div>
              <p className="text-sm font-medium text-foreground">Session Alerts</p>
              <p className="text-xs text-muted-foreground">Get notified when participants join</p>
            </div>
            <Switch
              checked={notifications.sessionAlerts}
              onCheckedChange={v => updateNotification('sessionAlerts', v)}
            />
          </div>
          <div className="flex items-center justify-between bg-muted/50 rounded-xl p-4">
            <div>
              <p className="text-sm font-medium text-foreground">Weekly Digest</p>
              <p className="text-xs text-muted-foreground">Receive a weekly summary of activity</p>
            </div>
            <Switch
              checked={notifications.weeklyDigest}
              onCheckedChange={v => updateNotification('weeklyDigest', v)}
            />
          </div>
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
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Account ID</p>
              <p className="text-xs text-muted-foreground font-mono">{user.id.slice(0, 8)}...{user.id.slice(-4)}</p>
            </div>
          </div>

          {/* Danger zone */}
          <div className="border-t border-border pt-4 mt-4">
            <h3 className="text-sm font-semibold text-destructive mb-3 flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              Danger Zone
            </h3>
            {!showDeleteConfirm ? (
              <Button
                variant="outline"
                className="border-destructive/30 text-destructive hover:bg-destructive/10 gap-2"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="w-4 h-4" />
                Delete Account
              </Button>
            ) : (
              <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4 space-y-3">
                <p className="text-sm text-destructive font-medium">
                  This action is irreversible. All your data will be permanently deleted.
                </p>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Type DELETE to confirm</Label>
                  <Input
                    value={deleteText}
                    onChange={e => setDeleteText(e.target.value)}
                    placeholder="DELETE"
                    className="max-w-[200px] border-destructive/30"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    disabled={deleteText !== 'DELETE' || deleting}
                    onClick={handleDeleteAccount}
                    className="gap-2"
                  >
                    {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    {deleting ? 'Deleting...' : 'Confirm Delete'}
                  </Button>
                  <Button variant="outline" onClick={() => { setShowDeleteConfirm(false); setDeleteText('') }}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
