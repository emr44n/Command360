import { PublicLayout } from '@/components/layout/PublicLayout'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — Command 360',
}

export default function PrivacyPage() {
  return (
    <PublicLayout>
      <article className="py-16 px-6">
        <div className="max-w-3xl mx-auto prose prose-sm prose-neutral dark:prose-invert">
          <h1>Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: February 2026</p>

          <h2>1. Who We Are</h2>
          <p>Command 360 is an interactive training and briefing platform for emergency services. This privacy policy explains how we collect, use, and protect your personal data.</p>

          <h2>2. Data We Collect</h2>
          <p>We collect the following categories of personal data:</p>
          <ul>
            <li><strong>Account data:</strong> Name, email address, organisation name when you register</li>
            <li><strong>Usage data:</strong> How you interact with the platform, pages visited, features used</li>
            <li><strong>Session data:</strong> Responses submitted during training sessions (may be anonymous)</li>
            <li><strong>Technical data:</strong> Browser type, device information, IP address</li>
          </ul>

          <h2>3. How We Use Your Data</h2>
          <p>We use your data to:</p>
          <ul>
            <li>Provide and maintain the Command 360 platform</li>
            <li>Process your training session responses</li>
            <li>Improve our platform and develop new features</li>
            <li>Send service-related communications</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2>4. Legal Basis for Processing</h2>
          <p>We process your data under the following legal bases: contract performance (to provide the service), legitimate interests (to improve our platform), and consent (for marketing communications).</p>

          <h2>5. Data Sharing</h2>
          <p>We do not sell your personal data. We may share data with:</p>
          <ul>
            <li>Service providers who help us operate the platform (hosting, analytics)</li>
            <li>Law enforcement when required by law</li>
          </ul>

          <h2>6. Data Retention</h2>
          <p>We retain your data for as long as your account is active. Session response data is retained for 12 months after the session. You may request deletion at any time.</p>

          <h2>7. Your Rights</h2>
          <p>Under UK GDPR, you have the right to access, rectify, erase, restrict processing of, and port your data. You also have the right to object to processing and to withdraw consent.</p>

          <h2>8. Data Security</h2>
          <p>We implement appropriate technical and organisational measures to protect your data, including encryption in transit and at rest, access controls, and regular security assessments.</p>

          <h2>9. International Transfers</h2>
          <p>Your data may be processed outside the UK where our service providers are located. We ensure appropriate safeguards are in place for any international transfers.</p>

          <h2>10. Contact</h2>
          <p>For privacy enquiries, please contact our Data Protection Officer at dpo@command360.co.uk.</p>
        </div>
      </article>
    </PublicLayout>
  )
}
