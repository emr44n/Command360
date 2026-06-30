import Link from 'next/link'
import type { Metadata } from 'next'
import { Rss, ArrowUpRight, ArrowRight } from 'lucide-react'
import { SiteShell } from '@/components/site/SiteShell'
import { Eyebrow, LightSection, DarkSection, Container } from '@/components/site/primitives'
import { V5AuthButton } from '@/components/home/V5Chrome'
import { getAllPosts, formatNewsDate } from '@/lib/news'
import { fetchIndustryFeed } from '@/lib/news-feed'

// refresh the live industry feed hourly
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'News & Insight — Command 360',
  description:
    'Insight, product news and training science for UK incident command. Original articles from Command 360 plus the latest from across the blue-light and resilience community.',
  keywords: [
    'incident command news',
    'emergency services training',
    'blue light training insight',
    'multi-agency command',
    'Command 360 news',
  ],
  alternates: {
    canonical: '/news',
    types: { 'application/rss+xml': '/news/rss.xml' },
  },
  openGraph: {
    title: 'News & Insight — Command 360',
    description: 'Insight, product news and training science for UK incident command.',
    type: 'website',
    url: '/news',
  },
}

const FAQS = [
  {
    q: 'What does Command 360 publish here?',
    a: 'Original writing on incident command, multi-agency working and the science of training that sticks — alongside product news and a live feed of incident-command updates from across the UK blue-light and resilience community.',
  },
  {
    q: 'Is the training based on recognised frameworks?',
    a: 'Yes. Our scenarios and assessments map to the frameworks UK services already use — JESIP and the Joint Decision Model, the National Decision Model, NFCC and College of Policing guidance, and service-specific doctrine.',
  },
  {
    q: 'Do participants need an app or special hardware?',
    a: 'No. Command 360 is browser-based. Crews join a live session on any phone, tablet or laptop with a short code or QR — no app, no account, no headset.',
  },
  {
    q: 'Can I get these articles by RSS?',
    a: 'Yes — subscribe to our feed at /news/rss.xml to get every new article in your reader.',
  },
]

export default async function NewsPage() {
  const posts = getAllPosts()
  const [latest, ...rest] = posts
  const [featured, ...thumbs] = rest
  const industryFeed = await fetchIndustryFeed(8)

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* ── HERO: the latest article ── */}
      {latest && (
        <header className="relative overflow-hidden bg-[#0F1216] text-white">
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={latest.heroImage} alt="" className="w-full h-full object-cover opacity-[0.30]" />
          </div>
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
            style={{ background: 'linear-gradient(180deg, rgba(15,18,22,0.62) 0%, rgba(15,18,22,0.84) 58%, #0F1216 100%)' }} />
          <div className="absolute bottom-[-200px] left-1/2 -translate-x-1/2 w-[1180px] h-[600px] pointer-events-none" aria-hidden="true"
            style={{ background: `radial-gradient(60% 80% at 50% 100%, ${latest.accent}33, ${latest.accent}10 48%, transparent 78%)`, filter: 'blur(40px)' }} />
          <div className="absolute inset-0 v5-grain opacity-[0.12] mix-blend-overlay pointer-events-none" aria-hidden="true" />

          <Container className="relative pt-[clamp(120px,16vh,168px)] pb-[clamp(40px,7vh,72px)]">
            <Eyebrow>News &amp; Insight</Eyebrow>
            <div className="mt-6 grid lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-12 items-end">
              <div>
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <span className="ff-mono text-[10.5px] font-semibold tracking-[0.1em] uppercase text-white px-2.5 py-1.5" style={{ background: latest.accent }}>
                    {latest.category}
                  </span>
                  <span className="ff-mono text-[11px] tracking-[0.08em] uppercase text-[#9aa0a8]">Latest · {formatNewsDate(latest.date)} · {latest.readingMinutes} min</span>
                </div>
                <Link href={`/news/${latest.slug}`} className="group block">
                  <h1 className="ff-display font-extrabold text-white leading-[1.04] tracking-[-0.02em] text-[clamp(30px,4.6vw,56px)] max-w-[16ch] group-hover:text-[#f2c0bc] transition-colors">
                    {latest.title}
                  </h1>
                </Link>
                <p className="text-[17px] sm:text-[18px] leading-[1.6] text-[#aab0b8] max-w-[600px] mt-5">{latest.excerpt}</p>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Link href={`/news/${latest.slug}`} className="ff-mono inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.05em] text-white bg-[#C9241A] hover:bg-[#a91d14] v5-glow px-5 py-3.5 transition-colors">
                    Read article <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a href="/news/rss.xml" className="ff-mono inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.05em] text-white border border-white/22 hover:bg-white/[0.06] hover:border-white/40 px-5 py-3.5 transition-colors">
                    <Rss className="w-4 h-4 text-[#C9241A]" /> RSS
                  </a>
                </div>
              </div>
              {/* hero image card (hidden on small to keep the hero tight) */}
              <Link href={`/news/${latest.slug}`} className="hidden lg:block relative aspect-[16/11] overflow-hidden border border-white/12 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={latest.heroImage} alt={latest.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                <span className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" aria-hidden="true" />
              </Link>
            </div>
          </Container>
        </header>
      )}

      {/* ── BODY: stories (left) + industry feed (right) ── */}
      <LightSection className="!py-[64px]">
        <Container>
          <div className="grid lg:grid-cols-[1fr_330px] gap-10 lg:gap-12">
            {/* LEFT — featured + thumbnail grid */}
            <div>
              <div className="mb-7">
                <Eyebrow n="01">Latest Stories</Eyebrow>
                <h2 className="ff-display font-extrabold text-[clamp(26px,3.4vw,40px)] leading-none tracking-[-0.02em] mt-4 text-[#16191E]">From Command 360</h2>
              </div>

              {/* featured */}
              {featured && (
                <Link href={`/news/${featured.slug}`} className="group grid sm:grid-cols-2 border border-[rgba(20,25,30,0.16)] bg-white hover:shadow-[0_24px_60px_-24px_rgba(20,25,30,0.35)] transition-shadow mb-8">
                  <div className="relative aspect-[16/10] sm:aspect-auto overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={featured.heroImage} alt={featured.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
                    <span className="absolute top-3 left-3 ff-mono text-[10px] font-semibold tracking-[0.1em] uppercase text-white px-2 py-1" style={{ background: featured.accent }}>{featured.category}</span>
                  </div>
                  <div className="p-6 sm:p-7 flex flex-col">
                    <div className="ff-mono text-[11px] tracking-[0.08em] uppercase text-[#9099a1] mb-3">{formatNewsDate(featured.date)} · {featured.readingMinutes} min</div>
                    <h3 className="ff-display font-extrabold text-[clamp(19px,2vw,24px)] leading-[1.12] tracking-[-0.015em] text-[#16191E] group-hover:text-[#C9241A] transition-colors">{featured.title}</h3>
                    <p className="text-[14.5px] text-[#5a5f66] leading-relaxed mt-3">{featured.excerpt}</p>
                    <span className="ff-mono mt-auto pt-5 inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.05em] text-[#16191E]">Read <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span>
                  </div>
                </Link>
              )}

              {/* thumbnail grid */}
              <div className="grid sm:grid-cols-2 gap-px bg-[rgba(20,25,30,0.16)] border border-[rgba(20,25,30,0.16)]">
                {thumbs.map((post) => (
                  <Link key={post.slug} href={`/news/${post.slug}`} className="group bg-[#EFECE4] hover:bg-white transition-colors block">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={post.heroImage} alt={post.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
                      <span className="absolute top-2.5 left-2.5 ff-mono text-[9.5px] font-semibold tracking-[0.1em] uppercase text-white px-2 py-1" style={{ background: post.accent }}>{post.category}</span>
                    </div>
                    <div className="p-5">
                      <div className="ff-mono text-[10px] tracking-[0.08em] uppercase text-[#9099a1] mb-2">{formatNewsDate(post.date)} · {post.readingMinutes} min</div>
                      <h3 className="ff-display font-bold text-[17px] leading-[1.16] tracking-[-0.01em] text-[#16191E] group-hover:text-[#C9241A] transition-colors mb-1.5">{post.title}</h3>
                      <p className="text-[13.5px] text-[#5a5f66] leading-relaxed line-clamp-2">{post.excerpt}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* RIGHT — industry RSS feed sidebar */}
            <aside className="lg:sticky lg:top-24 self-start">
              <div className="border border-[rgba(20,25,30,0.16)] bg-white">
                <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(20,25,30,0.12)]">
                  <span className="ff-mono text-[11px] font-semibold tracking-[0.1em] uppercase text-[#16191E] flex items-center gap-2"><Rss className="w-3.5 h-3.5 text-[#C9241A]" /> Industry Feed</span>
                  <a href="/news/rss.xml" className="ff-mono text-[10px] tracking-[0.06em] uppercase text-[#9099a1] hover:text-[#C9241A] transition-colors">RSS</a>
                </div>
                <div>
                  {industryFeed.map((item) => (
                    <a key={item.title} href={item.url} className="group block px-5 py-3.5 border-b border-[rgba(20,25,30,0.1)] last:border-b-0 hover:bg-[#F5F2EB] transition-colors">
                      <div className="ff-mono text-[10px] tracking-[0.06em] uppercase text-[#9099a1] mb-1 flex items-center gap-2">
                        {formatNewsDate(item.date) && <span>{formatNewsDate(item.date)}</span>}
                        <span className="text-[#b9bdc2]">·</span>
                        <span className="truncate">{item.source}</span>
                      </div>
                      <div className="text-[13.5px] font-semibold leading-snug text-[#16191E] group-hover:text-[#C9241A] transition-colors">{item.title}</div>
                    </a>
                  ))}
                </div>
                <div className="px-5 py-4 border-t border-[rgba(20,25,30,0.12)] bg-[#F5F2EB]">
                  <p className="ff-mono text-[10px] tracking-[0.04em] text-[#7c828a] leading-relaxed">Live from public GOV.UK feeds — fire &amp; rescue, emergency services and resilience — refreshed hourly.</p>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </LightSection>

      {/* ── FAQ + CTA ── */}
      <DarkSection className="!py-[80px]">
        <div className="absolute top-[-140px] right-[-100px] w-[760px] h-[500px] pointer-events-none" aria-hidden="true" style={{ background: 'radial-gradient(55% 65% at 70% 30%,rgba(201,36,26,.14),transparent 76%)', filter: 'blur(46px)' }} />
        <div className="absolute inset-0 v5-grain opacity-[0.1] mix-blend-overlay pointer-events-none" aria-hidden="true" />
        <Container className="relative grid lg:grid-cols-[0.9fr_1.1fr] gap-12">
          <div>
            <Eyebrow n="02">Common Questions</Eyebrow>
            <h2 className="ff-display font-extrabold text-[clamp(28px,3.6vw,44px)] leading-[1.02] tracking-[-0.02em] mt-4 text-white">Good to know</h2>
            <p className="text-[16px] text-[#9aa0a8] mt-4 max-w-[420px]">What this section is, the frameworks behind the training, and how teams take part.</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <V5AuthButton tab="register" label="Start free" variant="solid" />
              <Link href="/contact" className="ff-mono text-[13px] font-semibold uppercase tracking-[0.05em] text-white border border-white/22 hover:bg-white/[0.06] hover:border-white/40 px-6 py-4 transition-colors">Book a demo</Link>
            </div>
          </div>
          <div className="border-t border-white/14">
            {FAQS.map((f) => (
              <details key={f.q} className="group border-b border-white/14 py-5">
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none">
                  <span className="ff-display font-semibold text-[16px] sm:text-[18px] tracking-[-0.01em] text-white">{f.q}</span>
                  <span className="ff-mono text-[#C9241A] text-lg leading-none transition-transform group-open:rotate-45 shrink-0">+</span>
                </summary>
                <p className="text-[14.5px] text-[#9aa0a8] leading-relaxed mt-3 max-w-[60ch]">{f.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </DarkSection>
    </SiteShell>
  )
}
