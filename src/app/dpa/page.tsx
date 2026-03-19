import { PublicLayout } from '@/components/layout/PublicLayout'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Data Processing Agreement — Command 360',
}

export default function DpaPage() {
  return (
    <PublicLayout>
      <article className="py-16 px-6">
        <div className="max-w-3xl mx-auto prose prose-sm prose-neutral dark:prose-invert">
          <h1>Data Processing Agreement</h1>
          <p className="text-muted-foreground">Last updated: February 2026</p>

          <h2>1. Scope</h2>
          <p>This Data Processing Agreement (DPA) forms part of the agreement between Command 360 (the &quot;Processor&quot;) and the customer organisation (the &quot;Controller&quot;) for the processing of personal data through the Command 360 platform.</p>

          <h2>2. Processing Details</h2>
          <p>The Processor shall process personal data only on documented instructions from the Controller. The types of personal data processed include participant names (where provided), email addresses of account holders, and session response data.</p>

          <h2>3. Security Measures</h2>
          <p>The Processor implements appropriate technical and organisational measures including:</p>
          <ul>
            <li>Encryption of data in transit (TLS 1.2+) and at rest (AES-256)</li>
            <li>Access controls with role-based permissions</li>
            <li>Regular security assessments and penetration testing</li>
            <li>Incident response procedures</li>
            <li>Staff training on data protection</li>
          </ul>

          <h2>4. Sub-processors</h2>
          <p>The Processor uses the following sub-processors:</p>
          <ul>
            <li><strong>Supabase:</strong> Database hosting and authentication (EU/UK data centres)</li>
            <li><strong>Vercel:</strong> Application hosting and CDN</li>
          </ul>
          <p>The Controller will be notified of any changes to sub-processors with 30 days&apos; notice.</p>

          <h2>5. Data Subject Rights</h2>
          <p>The Processor shall assist the Controller in responding to data subject requests including access, rectification, erasure, and portability requests.</p>

          <h2>6. Data Breach Notification</h2>
          <p>The Processor shall notify the Controller without undue delay (and in any event within 72 hours) upon becoming aware of a personal data breach.</p>

          <h2>7. Data Retention and Deletion</h2>
          <p>Upon termination of the agreement, the Processor shall delete or return all personal data within 30 days, unless retention is required by law.</p>

          <h2>8. Audits</h2>
          <p>The Controller may audit the Processor&apos;s compliance with this DPA. The Processor shall make available all information necessary to demonstrate compliance.</p>

          <h2>9. Contact</h2>
          <p>For DPA-related enquiries, contact our Data Protection Officer at dpo@command360.co.uk.</p>
        </div>
      </article>
    </PublicLayout>
  )
}
