import type { Metadata } from 'next'
import { SiteShell } from '@/components/site/SiteShell'
import { PageHero, Eyebrow, DarkSection, Container } from '@/components/site/primitives'

export const metadata: Metadata = {
  title: 'Terms of Service — Command 360',
}

export default function TermsPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow={<Eyebrow>Legal</Eyebrow>}
        title={<>Terms of <span className="text-[#C9241A]">Service</span></>}
        lede="Last updated: February 2026"
      />

      <DarkSection>
        <Container>
          <article className="max-w-[820px]">
            <h2 className="ff-display font-bold text-[22px] tracking-[-0.01em] mt-10 mb-3 text-white">1. Introduction</h2>
            <p className="text-[15px] leading-relaxed text-[#aab0b8]">These Terms of Service govern your use of Command 360, an interactive presentation platform for emergency services training. By accessing or using our platform, you agree to be bound by these terms.</p>

            <h2 className="ff-display font-bold text-[22px] tracking-[-0.01em] mt-10 mb-3 text-white">2. Account Registration</h2>
            <p className="text-[15px] leading-relaxed text-[#aab0b8]">To use Command 360, you must create an account with accurate information. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>

            <h2 className="ff-display font-bold text-[22px] tracking-[-0.01em] mt-10 mb-3 text-white">3. Acceptable Use</h2>
            <p className="text-[15px] leading-relaxed text-[#aab0b8]">You agree to use Command 360 only for lawful purposes related to professional training and education. You may not use the platform to distribute harmful, offensive, or illegal content.</p>

            <h2 className="ff-display font-bold text-[22px] tracking-[-0.01em] mt-10 mb-3 text-white">4. Content Ownership</h2>
            <p className="text-[15px] leading-relaxed text-[#aab0b8]">You retain ownership of all content you create on Command 360, including presentations, slides, and training materials. By using our platform, you grant us a limited licence to host and display your content as necessary to provide the service.</p>

            <h2 className="ff-display font-bold text-[22px] tracking-[-0.01em] mt-10 mb-3 text-white">5. Data Protection</h2>
            <p className="text-[15px] leading-relaxed text-[#aab0b8]">We process personal data in accordance with UK GDPR and the Data Protection Act 2018. See our Privacy Policy for full details on how we handle your data.</p>

            <h2 className="ff-display font-bold text-[22px] tracking-[-0.01em] mt-10 mb-3 text-white">6. Service Availability</h2>
            <p className="text-[15px] leading-relaxed text-[#aab0b8]">We aim to provide 99.9% uptime for the Command 360 platform. We may perform scheduled maintenance with advance notice. We are not liable for temporary service interruptions.</p>

            <h2 className="ff-display font-bold text-[22px] tracking-[-0.01em] mt-10 mb-3 text-white">7. Subscription and Payment</h2>
            <p className="text-[15px] leading-relaxed text-[#aab0b8]">Paid plans are billed monthly or annually as selected. Cancellation takes effect at the end of the current billing period. Refunds are available within 14 days of initial purchase.</p>

            <h2 className="ff-display font-bold text-[22px] tracking-[-0.01em] mt-10 mb-3 text-white">8. Termination</h2>
            <p className="text-[15px] leading-relaxed text-[#aab0b8]">Either party may terminate the agreement at any time. Upon termination, you may export your data within 30 days. After this period, data may be permanently deleted.</p>

            <h2 className="ff-display font-bold text-[22px] tracking-[-0.01em] mt-10 mb-3 text-white">9. Limitation of Liability</h2>
            <p className="text-[15px] leading-relaxed text-[#aab0b8]">Command 360 is provided on an &quot;as is&quot; basis. We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform.</p>

            <h2 className="ff-display font-bold text-[22px] tracking-[-0.01em] mt-10 mb-3 text-white">10. Governing Law</h2>
            <p className="text-[15px] leading-relaxed text-[#aab0b8]">These terms are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p>

            <h2 className="ff-display font-bold text-[22px] tracking-[-0.01em] mt-10 mb-3 text-white">11. Changes to Terms</h2>
            <p className="text-[15px] leading-relaxed text-[#aab0b8]">We may update these terms from time to time. We will notify registered users of material changes via email at least 30 days in advance.</p>

            <h2 className="ff-display font-bold text-[22px] tracking-[-0.01em] mt-10 mb-3 text-white">12. Contact</h2>
            <p className="text-[15px] leading-relaxed text-[#aab0b8]">For questions about these terms, please contact us at hello@command360.co.uk.</p>
          </article>
        </Container>
      </DarkSection>
    </SiteShell>
  )
}
