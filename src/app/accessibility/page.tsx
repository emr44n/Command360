import { PublicLayout } from '@/components/layout/PublicLayout'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Accessibility Statement — Command 360',
}

export default function AccessibilityPage() {
  return (
    <PublicLayout>
      <article className="py-16 px-6">
        <div className="max-w-3xl mx-auto prose prose-sm prose-neutral dark:prose-invert">
          <h1>Accessibility Statement</h1>
          <p className="text-muted-foreground">Last updated: February 2026</p>

          <h2>Our Commitment</h2>
          <p>Command 360 is committed to ensuring digital accessibility for people of all abilities. We continually improve the user experience for everyone and apply the relevant accessibility standards.</p>

          <h2>Standards</h2>
          <p>We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA. These guidelines explain how to make web content more accessible for people with disabilities.</p>

          <h2>Measures Taken</h2>
          <ul>
            <li>Semantic HTML structure throughout the application</li>
            <li>Keyboard navigation support for all interactive elements</li>
            <li>Sufficient colour contrast ratios in both light and dark themes</li>
            <li>ARIA labels and roles for screen reader compatibility</li>
            <li>Focus indicators on all interactive elements</li>
            <li>Responsive design that works across screen sizes</li>
            <li>Alternative text for meaningful images</li>
          </ul>

          <h2>Known Limitations</h2>
          <p>While we strive for full accessibility, some areas may have limitations:</p>
          <ul>
            <li>Real-time word cloud visualisations may not be fully accessible to screen readers</li>
            <li>Some drag-and-drop interactions in the editor have keyboard alternatives being developed</li>
          </ul>

          <h2>Feedback</h2>
          <p>We welcome your feedback on the accessibility of Command 360. If you encounter barriers, please contact us at accessibility@command360.co.uk. We aim to respond within 5 business days.</p>

          <h2>Enforcement</h2>
          <p>This statement was prepared in February 2026. It is based on a self-assessment of the platform. We plan to commission an independent accessibility audit within the next 12 months.</p>
        </div>
      </article>
    </PublicLayout>
  )
}
