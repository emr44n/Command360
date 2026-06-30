/**
 * Live "industry feed" for the News page.
 *
 * Pulls real incident-command / emergency-services news from public GOV.UK
 * Atom feeds (the most reliable UK public sector source), merges + dedupes
 * them, and returns the latest items. On any failure it falls back to the
 * curated INDUSTRY_FEED list so the page always renders.
 *
 * Server-only. Cached for an hour via fetch ISR.
 */

import { INDUSTRY_FEED, type FeedItem } from '@/lib/news'

// Targeted GOV.UK news searches relevant to incident command + blue-light.
const SOURCES: { url: string; source: string }[] = [
  { url: 'https://www.gov.uk/search/news-and-communications.atom?keywords=fire%20and%20rescue', source: 'GOV.UK · Fire & Rescue' },
  { url: 'https://www.gov.uk/search/news-and-communications.atom?keywords=emergency%20services', source: 'GOV.UK · Emergency Services' },
  { url: 'https://www.gov.uk/search/news-and-communications.atom?keywords=resilience%20civil%20contingencies', source: 'GOV.UK · Resilience' },
]

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .trim()
}

function pick(re: RegExp, block: string): string {
  const m = block.match(re)
  return m ? m[1] : ''
}

function parseAtom(xml: string, source: string): FeedItem[] {
  const items: FeedItem[] = []
  const entries = xml.split('<entry>').slice(1)
  for (const entry of entries) {
    const title = decodeEntities(pick(/<title[^>]*>([\s\S]*?)<\/title>/, entry))
    const url = pick(/<link[^>]*rel="alternate"[^>]*href="([^"]+)"/, entry) || pick(/<link[^>]*href="([^"]+)"/, entry)
    const date = pick(/<updated>([^<]+)<\/updated>/, entry) || pick(/<published>([^<]+)<\/published>/, entry)
    if (title && url) items.push({ title, url, source, date: date ? date.slice(0, 10) : '' })
  }
  return items
}

export async function fetchIndustryFeed(limit = 6): Promise<FeedItem[]> {
  try {
    const results = await Promise.allSettled(
      SOURCES.map(async ({ url, source }) => {
        const res = await fetch(url, {
          headers: { Accept: 'application/atom+xml, application/xml, text/xml' },
          next: { revalidate: 3600 },
        })
        if (!res.ok) throw new Error(`${res.status}`)
        return parseAtom(await res.text(), source)
      })
    )

    const seen = new Set<string>()
    const merged: FeedItem[] = []
    for (const r of results) {
      if (r.status !== 'fulfilled') continue
      for (const item of r.value) {
        if (seen.has(item.url)) continue
        seen.add(item.url)
        merged.push(item)
      }
    }

    if (merged.length === 0) return INDUSTRY_FEED
    merged.sort((a, b) => (a.date < b.date ? 1 : -1))
    return merged.slice(0, limit)
  } catch {
    return INDUSTRY_FEED
  }
}
