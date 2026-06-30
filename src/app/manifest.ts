import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Command 360 — Interactive Command Training',
    short_name: 'Command 360',
    description:
      'Interactive command training for UK emergency services — briefings, live decisions and debriefs turned into structured learning.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0F1216',
    theme_color: '#0F1216',
    icons: [
      { src: '/icon.png', sizes: '256x256', type: 'image/png', purpose: 'any' },
      { src: '/apple-icon.png', sizes: '256x256', type: 'image/png' },
    ],
  }
}
