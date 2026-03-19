import { LoginForm } from '@/components/auth/LoginForm'
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
