import type { Metadata } from 'next'
import CommandStudioClient from './CommandStudioClient'

export const metadata: Metadata = {
  title: 'Command Studio — Interactive Simulation Scenarios',
  description: 'Build interactive training scenarios with layered images, video effects, and real-time event triggers for emergency services.',
}

export default function CommandStudioPage() {
  return <CommandStudioClient />
}
