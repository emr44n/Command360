import { getAllPosts } from '@/lib/news'

const SITE = 'https://command360.co.uk'

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const posts = getAllPosts()
  const items = posts
    .map(
      (p) => `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${SITE}/news/${p.slug}</link>
      <guid isPermaLink="true">${SITE}/news/${p.slug}</guid>
      <category>${escapeXml(p.category)}</category>
      <dc:creator>${escapeXml(p.author)}</dc:creator>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description>${escapeXml(p.excerpt)}</description>
    </item>`
    )
    .join('\n')

  const lastBuild = posts[0] ? new Date(posts[0].date).toUTCString() : new Date(0).toUTCString()

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Command 360 — News &amp; Insight</title>
    <link>${SITE}/news</link>
    <atom:link href="${SITE}/news/rss.xml" rel="self" type="application/rss+xml" />
    <description>Insight, product news and training science for UK incident command.</description>
    <language>en-gb</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
