import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About — 20+ Years in Incident Command & Virtual Training',
  description:
    'Command 360 is built by people with over 20 years in incident command and virtual training. Learn our story and why we build immersive, scenario-based training for UK emergency services.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Command 360 — Built on 20+ Years in Incident Command',
    description:
      'Over 20 years in incident command and virtual training, turned into immersive scenario-based training for UK blue-light services.',
    url: '/about',
    type: 'website',
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
