import type { Metadata } from 'next'
import { SiteShell } from '@/components/site/SiteShell'
import { PageHero, Eyebrow, DarkSection, Container } from '@/components/site/primitives'

export const metadata: Metadata = {
  title: 'Privacy Policy — Command 360',
}

export default function PrivacyPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow={<Eyebrow>Legal</Eyebrow>}
        title={<>Privacy <span className="text-[#C9241A]">Policy</span></>}
        lede="Last updated: February 2026"
      />

      <DarkSection>
        <Container>
          <article className="max-w-[820px]">
            <h2 className="ff-display font-bold text-[22px] tracking-[-0.01em] mt-10 mb-3 text-white">1. Who We Are</h2>
            <p className="text-[15px] leading-relaxed text-[#aab0b8]">Command 360 is an interactive training and briefing platform for emergency services. This privacy policy explains how we collect, use, and protect your personal data.</p>

            <h2 className="ff-display font-bold text-[22px] tracking-[-0.01em] mt-10 mb-3 text-white">2. Data We Collect</h2>
            <p className="text-[15px] leading-relaxed text-[#aab0b8]">We collect the following categories of personal data:</p>
            <ul className="mt-3 space-y-2 list-disc pl-5 marker:text-[#C9241A] text-[15px] leading-relaxed text-[#aab0b8]">
              <li><strong className="text-white font-semibold">Account data:</strong> Name, email address, organisation name when you register</li>
              <li><strong className="text-white font-semibold">Usage data:</strong> How you interact with the platform, pages visited, features used</li>
              <li><strong className="text-white font-semibold">Session data:</strong> Responses submitted during training sessions (may be anonymous)</li>
              <li><strong className="text-white font-semibold">Technical data:</strong> Browser type, device information, IP address</li>
            </ul>

            <h2 className="ff-display font-bold text-[22px] tracking-[-0.01em] mt-10 mb-3 text-white">3. How We Use Your Data</h2>
            <p className="text-[15px] leading-relaxed text-[#aab0b8]">We use your data to:</p>
            <ul className="mt-3 space-y-2 list-disc pl-5 marker:text-[#C9241A] text-[15px] leading-relaxed text-[#aab0b8]">
              <li>Provide and maintain the Command 360 platform</li>
              <li>Process your training session responses</li>
              <li>Improve our platform and develop new features</li>
              <li>Send service-related communications</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2 className="ff-display font-bold text-[22px] tracking-[-0.01em] mt-10 mb-3 text-white">4. Legal Basis for Processing</h2>
            <p className="text-[15px] leading-relaxed text-[#aab0b8]">We process your data under the following legal bases: contract performance (to provide the service), legitimate interests (to improve our platform), and consent (for marketing communications).</p>

            <h2 className="ff-display font-bold text-[22px] tracking-[-0.01em] mt-10 mb-3 text-white">5. Data Sharing</h2>
            <p className="text-[15px] leading-relaxed text-[#aab0b8]">We do not sell your personal data. We may share data with:</p>
            <ul className="mt-3 space-y-2 list-disc pl-5 marker:text-[#C9241A] text-[15px] leading-relaxed text-[#aab0b8]">
              <li>Service providers who help us operate the platform (hosting, analytics)</li>
              <li>Law enforcement when required by law</li>
            </ul>

            <h2 className="ff-display font-bold text-[22px] tracking-[-0.01em] mt-10 mb-3 text-white">6. Data Retention</h2>
            <p className="text-[15px] leading-relaxed text-[#aab0b8]">We retain your data for as long as your account is active. Session response data is retained for 12 months after the session. You may request deletion at any time.</p>

            <h2 className="ff-display font-bold text-[22px] tracking-[-0.01em] mt-10 mb-3 text-white">7. Your Rights</h2>
            <p className="text-[15px] leading-relaxed text-[#aab0b8]">Under UK GDPR, you have the right to access, rectify, erase, restrict processing of, and port your data. You also have the right to object to processing and to withdraw consent.</p>

            <h2 className="ff-display font-bold text-[22px] tracking-[-0.01em] mt-10 mb-3 text-white">8. Data Security</h2>
            <p className="text-[15px] leading-relaxed text-[#aab0b8]">We implement appropriate technical and organisational measures to protect your data, including encryption in transit and at rest, access controls, and regular security assessments.</p>

            <h2 className="ff-display font-bold text-[22px] tracking-[-0.01em] mt-10 mb-3 text-white">9. International Transfers</h2>
            <p className="text-[15px] leading-relaxed text-[#aab0b8]">Your data may be processed outside the UK where our service providers are located. We ensure appropriate safeguards are in place for any international transfers.</p>

            <h2 className="ff-display font-bold text-[22px] tracking-[-0.01em] mt-10 mb-3 text-white">10. Contact</h2>
            <p className="text-[15px] leading-relaxed text-[#aab0b8]">For privacy enquiries, please contact our Data Protection Officer at dpo@command360.co.uk.</p>
          </article>
        </Container>
      </DarkSection>
    </SiteShell>
  )
}
