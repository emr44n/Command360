import type { Metadata } from 'next'
import { SiteShell } from '@/components/site/SiteShell'
import { PageHero, Eyebrow, DarkSection, Container } from '@/components/site/primitives'

export const metadata: Metadata = {
  title: 'Data Processing Agreement — Command 360',
}

export default function DpaPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow={<Eyebrow>Legal</Eyebrow>}
        title={<>Data Processing <span className="text-[#C9241A]">Agreement</span></>}
        lede="Last updated: February 2026"
      />

      <DarkSection>
        <Container>
          <article className="max-w-[820px]">
            <h2 className="ff-display font-bold text-[22px] tracking-[-0.01em] mt-10 mb-3 text-white">1. Scope</h2>
            <p className="text-[15px] leading-relaxed text-[#aab0b8]">This Data Processing Agreement (DPA) forms part of the agreement between Command 360 (the &quot;Processor&quot;) and the customer organisation (the &quot;Controller&quot;) for the processing of personal data through the Command 360 platform.</p>

            <h2 className="ff-display font-bold text-[22px] tracking-[-0.01em] mt-10 mb-3 text-white">2. Processing Details</h2>
            <p className="text-[15px] leading-relaxed text-[#aab0b8]">The Processor shall process personal data only on documented instructions from the Controller. The types of personal data processed include participant names (where provided), email addresses of account holders, and session response data.</p>

            <h2 className="ff-display font-bold text-[22px] tracking-[-0.01em] mt-10 mb-3 text-white">3. Security Measures</h2>
            <p className="text-[15px] leading-relaxed text-[#aab0b8]">The Processor implements appropriate technical and organisational measures including:</p>
            <ul className="mt-3 space-y-2 list-disc pl-5 marker:text-[#C9241A] text-[15px] leading-relaxed text-[#aab0b8]">
              <li>Encryption of data in transit (TLS 1.2+) and at rest (AES-256)</li>
              <li>Access controls with role-based permissions</li>
              <li>Regular security assessments and penetration testing</li>
              <li>Incident response procedures</li>
              <li>Staff training on data protection</li>
            </ul>

            <h2 className="ff-display font-bold text-[22px] tracking-[-0.01em] mt-10 mb-3 text-white">4. Sub-processors</h2>
            <p className="text-[15px] leading-relaxed text-[#aab0b8]">The Processor uses the following sub-processors:</p>
            <ul className="mt-3 space-y-2 list-disc pl-5 marker:text-[#C9241A] text-[15px] leading-relaxed text-[#aab0b8]">
              <li><strong className="text-white font-semibold">Supabase:</strong> Database hosting and authentication (EU/UK data centres)</li>
              <li><strong className="text-white font-semibold">Vercel:</strong> Application hosting and CDN</li>
            </ul>
            <p className="text-[15px] leading-relaxed text-[#aab0b8] mt-4">The Controller will be notified of any changes to sub-processors with 30 days&apos; notice.</p>

            <h2 className="ff-display font-bold text-[22px] tracking-[-0.01em] mt-10 mb-3 text-white">5. Data Subject Rights</h2>
            <p className="text-[15px] leading-relaxed text-[#aab0b8]">The Processor shall assist the Controller in responding to data subject requests including access, rectification, erasure, and portability requests.</p>

            <h2 className="ff-display font-bold text-[22px] tracking-[-0.01em] mt-10 mb-3 text-white">6. Data Breach Notification</h2>
            <p className="text-[15px] leading-relaxed text-[#aab0b8]">The Processor shall notify the Controller without undue delay (and in any event within 72 hours) upon becoming aware of a personal data breach.</p>

            <h2 className="ff-display font-bold text-[22px] tracking-[-0.01em] mt-10 mb-3 text-white">7. Data Retention and Deletion</h2>
            <p className="text-[15px] leading-relaxed text-[#aab0b8]">Upon termination of the agreement, the Processor shall delete or return all personal data within 30 days, unless retention is required by law.</p>

            <h2 className="ff-display font-bold text-[22px] tracking-[-0.01em] mt-10 mb-3 text-white">8. Audits</h2>
            <p className="text-[15px] leading-relaxed text-[#aab0b8]">The Controller may audit the Processor&apos;s compliance with this DPA. The Processor shall make available all information necessary to demonstrate compliance.</p>

            <h2 className="ff-display font-bold text-[22px] tracking-[-0.01em] mt-10 mb-3 text-white">9. Contact</h2>
            <p className="text-[15px] leading-relaxed text-[#aab0b8]">For DPA-related enquiries, contact our Data Protection Officer at dpo@command360.co.uk.</p>
          </article>
        </Container>
      </DarkSection>
    </SiteShell>
  )
}
