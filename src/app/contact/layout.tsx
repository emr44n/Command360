import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact — Book a Demo or Talk to the Team',
  description:
    'Get in touch with Command 360. Book a demo, ask about bespoke scenarios and assessments, or talk to our team about training for your UK emergency service.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact Command 360 — Book a Demo',
    description:
      'Book a demo or talk to our team about interactive command training for UK emergency services.',
    url: '/contact',
    type: 'website',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
