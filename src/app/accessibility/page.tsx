import type { Metadata } from 'next'
import { SiteShell } from '@/components/site/SiteShell'
import { PageHero, Eyebrow, DarkSection, Container } from '@/components/site/primitives'

export const metadata: Metadata = {
  title: 'Accessibility Statement — Command 360',
}

export default function AccessibilityPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow={<Eyebrow>Legal</Eyebrow>}
        title={<>Accessibility <span className="text-[#C9241A]">Statement</span></>}
        lede="Last updated: February 2026"
      />

      <DarkSection>
        <Container>
          <article className="max-w-[820px]">
            <h2 className="ff-display font-bold text-[22px] tracking-[-0.01em] mt-10 mb-3 text-white">Our Commitment</h2>
            <p className="text-[15px] leading-relaxed text-[#aab0b8]">Command 360 is committed to ensuring digital accessibility for people of all abilities. We continually improve the user experience for everyone and apply the relevant accessibility standards.</p>

            <h2 className="ff-display font-bold text-[22px] tracking-[-0.01em] mt-10 mb-3 text-white">Standards</h2>
            <p className="text-[15px] leading-relaxed text-[#aab0b8]">We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA. These guidelines explain how to make web content more accessible for people with disabilities.</p>

            <h2 className="ff-display font-bold text-[22px] tracking-[-0.01em] mt-10 mb-3 text-white">Measures Taken</h2>
            <ul className="mt-3 space-y-2 list-disc pl-5 marker:text-[#C9241A] text-[15px] leading-relaxed text-[#aab0b8]">
              <li>Semantic HTML structure throughout the application</li>
              <li>Keyboard navigation support for all interactive elements</li>
              <li>Sufficient colour contrast ratios in both light and dark themes</li>
              <li>ARIA labels and roles for screen reader compatibility</li>
              <li>Focus indicators on all interactive elements</li>
              <li>Responsive design that works across screen sizes</li>
              <li>Alternative text for meaningful images</li>
            </ul>

            <h2 className="ff-display font-bold text-[22px] tracking-[-0.01em] mt-10 mb-3 text-white">Known Limitations</h2>
            <p className="text-[15px] leading-relaxed text-[#aab0b8]">While we strive for full accessibility, some areas may have limitations:</p>
            <ul className="mt-3 space-y-2 list-disc pl-5 marker:text-[#C9241A] text-[15px] leading-relaxed text-[#aab0b8]">
              <li>Real-time word cloud visualisations may not be fully accessible to screen readers</li>
              <li>Some drag-and-drop interactions in the editor have keyboard alternatives being developed</li>
            </ul>

            <h2 className="ff-display font-bold text-[22px] tracking-[-0.01em] mt-10 mb-3 text-white">Feedback</h2>
            <p className="text-[15px] leading-relaxed text-[#aab0b8]">We welcome your feedback on the accessibility of Command 360. If you encounter barriers, please contact us at accessibility@command360.co.uk. We aim to respond within 5 business days.</p>

            <h2 className="ff-display font-bold text-[22px] tracking-[-0.01em] mt-10 mb-3 text-white">Enforcement</h2>
            <p className="text-[15px] leading-relaxed text-[#aab0b8]">This statement was prepared in February 2026. It is based on a self-assessment of the platform. We plan to commission an independent accessibility audit within the next 12 months.</p>
          </article>
        </Container>
      </DarkSection>
    </SiteShell>
  )
}
