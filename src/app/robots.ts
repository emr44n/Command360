import type { MetadataRoute } from 'next'

const BASE = 'https://command360.co.uk'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // private / app surfaces — no SEO value, keep out of the index
      disallow: ['/api/', '/dashboard', '/presentations', '/present', '/participate', '/join', '/auth'],
    },
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  }
}
