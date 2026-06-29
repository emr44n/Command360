import type { Metadata } from 'next'
import { SiteShell } from '@/components/site/SiteShell'
import CommandStudioClient from './CommandStudioClient'

export const metadata: Metadata = {
  title: 'Command Studio — Interactive Simulation Scenarios',
  description: 'Build immersive, evolving incident scenarios in the browser. Rehearse rare, high-risk events safely and train decision-making — no VR headset needed.',
  keywords: [
    'immersive scenario training', 'incident command simulation', 'browser-based emergency training',
    'scenario-based learning blue light', 'tabletop exercise software', 'major incident rehearsal',
    'decision-making under pressure training', 'bespoke training scenarios', '2D incident simulation',
    'command training platform UK', 'low-frequency high-risk event training', 'virtual exercise platform',
  ],
}

export default function CommandStudioPage() {
  return (
    <SiteShell>
      <CommandStudioClient />
    </SiteShell>
  )
}
