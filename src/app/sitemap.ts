import type { MetadataRoute } from 'next'
import { SERVICES } from '@/components/site/ServicesMenu'
import { getAllPosts } from '@/lib/news'

const BASE = 'https://command360.co.uk'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticRoutes: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
    { path: '', priority: 1.0, freq: 'weekly' },
    { path: '/solutions', priority: 0.9, freq: 'monthly' },
    { path: '/command-studio', priority: 0.9, freq: 'monthly' },
    { path: '/news', priority: 0.8, freq: 'daily' },
    { path: '/product', priority: 0.8, freq: 'monthly' },
    { path: '/about', priority: 0.7, freq: 'monthly' },
    { path: '/contact', priority: 0.7, freq: 'monthly' },
    { path: '/help', priority: 0.5, freq: 'monthly' },
    { path: '/accessibility', priority: 0.3, freq: 'yearly' },
    { path: '/privacy', priority: 0.3, freq: 'yearly' },
    { path: '/terms', priority: 0.3, freq: 'yearly' },
    { path: '/cookies', priority: 0.3, freq: 'yearly' },
    { path: '/dpa', priority: 0.3, freq: 'yearly' },
  ]

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: `${BASE}${r.path}`,
    lastModified: now,
    changeFrequency: r.freq,
    priority: r.priority,
  }))

  const serviceEntries: MetadataRoute.Sitemap = SERVICES.map((s) => ({
    url: `${BASE}/solutions/${s.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const newsEntries: MetadataRoute.Sitemap = getAllPosts().map((p) => ({
    url: `${BASE}/news/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticEntries, ...serviceEntries, ...newsEntries]
}
