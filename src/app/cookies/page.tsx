import { PublicLayout } from '@/components/layout/PublicLayout'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy — Command 360',
}

export default function CookiesPage() {
  return (
    <PublicLayout>
      <article className="py-16 px-6">
        <div className="max-w-3xl mx-auto prose prose-sm prose-neutral dark:prose-invert">
          <h1>Cookie Policy</h1>
          <p className="text-muted-foreground">Last updated: February 2026</p>

          <h2>What Are Cookies</h2>
          <p>Cookies are small text files stored on your device when you visit a website. They help us provide a better experience by remembering your preferences and understanding how you use our platform.</p>

          <h2>Essential Cookies</h2>
          <p>These cookies are necessary for Command 360 to function. They include authentication tokens, session identifiers, and security cookies. You cannot opt out of essential cookies as the platform requires them to operate.</p>

          <h2>Analytics Cookies</h2>
          <p>We use analytics cookies to understand how visitors interact with our platform. This helps us improve the user experience. Analytics data is aggregated and anonymised.</p>

          <h2>Preference Cookies</h2>
          <p>These cookies remember your settings and preferences, such as your chosen theme (light or dark mode) and language preferences.</p>

          <h2>Managing Cookies</h2>
          <p>You can control cookies through your browser settings. Most browsers allow you to block or delete cookies. However, blocking essential cookies may prevent Command 360 from functioning correctly.</p>

          <h2>Third-Party Cookies</h2>
          <p>We minimise the use of third-party cookies. Our authentication provider (Supabase) may set cookies necessary for secure sign-in.</p>

          <h2>Contact</h2>
          <p>For questions about our cookie policy, please contact us at hello@command360.co.uk.</p>
        </div>
      </article>
    </PublicLayout>
  )
}
