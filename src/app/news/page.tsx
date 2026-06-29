import Link from 'next/link'
import type { Metadata } from 'next'
import { Rss, ArrowUpRight } from 'lucide-react'
import { SiteShell } from '@/components/site/SiteShell'
import { PageHero, Eyebrow, LightSection, DarkSection, Container } from '@/components/site/primitives'
import { SpotlightCard } from '@/components/home/SpotlightCard'
import { getAllPosts, formatNewsDate, INDUSTRY_FEED } from '@/lib/news'

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
    description:
      'Insight, product news and training science for UK incident command.',
    type: 'website',
    url: '/news',
  },
}

export default function NewsPage() {
  const posts = getAllPosts()
  const [lead, ...rest] = posts

  return (
    <SiteShell>
      <PageHero
        eyebrow={<Eyebrow>News &amp; Insight</Eyebrow>}
        title={<>From the <span className="text-[#C9241A]">command line</span></>}
        lede="Original writing on incident command, multi-agency working and the science of training that sticks — plus the latest from across the UK blue-light and resilience community."
      >
        <a
          href="/news/rss.xml"
          className="ff-mono inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.05em] text-white border border-white/22 hover:bg-white/[0.06] hover:border-white/40 px-5 py-3.5 transition-colors"
        >
          <Rss className="w-4 h-4 text-[#C9241A]" /> Subscribe via RSS
        </a>
      </PageHero>

      {/* Featured + grid */}
      <LightSection>
        <Container>
          <div className="max-w-[640px] mb-9">
            <Eyebrow n="01">Latest</Eyebrow>
            <h2 className="ff-display font-extrabold text-[clamp(30px,3.8vw,48px)] leading-none tracking-[-0.02em] mt-4 text-[#16191E]">
              Latest from Command 360
            </h2>
            <p className="text-[16px] text-[#5a5f66] mt-4">
              Briefings, product updates and lessons from the field — written for the people who run the room.
            </p>
          </div>

          {/* Lead story */}
          {lead && (
            <Link
              href={`/news/${lead.slug}`}
              className="group grid md:grid-cols-2 border border-[rgba(20,25,30,0.16)] bg-white hover:shadow-[0_24px_60px_-24px_rgba(20,25,30,0.35)] transition-shadow mb-10"
            >
              <div className="relative aspect-[16/10] md:aspect-auto overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={lead.heroImage}
                  alt={lead.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <span
                  className="absolute top-3 left-3 ff-mono text-[10.5px] font-semibold tracking-[0.1em] uppercase text-white px-2.5 py-1.5"
                  style={{ background: lead.accent }}
                >
                  {lead.category}
                </span>
              </div>
              <div className="p-7 sm:p-9 flex flex-col">
                <div className="ff-mono text-[11px] tracking-[0.08em] uppercase text-[#9099a1] mb-4">
                  {formatNewsDate(lead.date)} · {lead.readingMinutes} min read
                </div>
                <h3 className="ff-display font-extrabold text-[clamp(22px,2.4vw,30px)] leading-[1.08] tracking-[-0.015em] text-[#16191E] group-hover:text-[#C9241A] transition-colors">
                  {lead.title}
                </h3>
                <p className="text-[15px] text-[#5a5f66] leading-relaxed mt-4">{lead.excerpt}</p>
                <span className="ff-mono mt-auto pt-7 inline-flex items-center gap-1.5 text-[12.5px] font-semibold uppercase tracking-[0.05em] text-[#16191E]">
                  Read article <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </Link>
          )}

          {/* Rest of the grid */}
          {rest.length > 0 && (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 border-t border-l border-[rgba(20,25,30,0.16)]">
              {rest.map((post) => (
                <SpotlightCard
                  key={post.slug}
                  glow={`${post.accent}22`}
                  className="v5-card group relative overflow-hidden border-r border-b border-[rgba(20,25,30,0.16)] block"
                >
                  <Link href={`/news/${post.slug}`} className="relative block">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.heroImage}
                        alt={post.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                      />
                      <span
                        className="absolute top-3 left-3 ff-mono text-[10px] font-semibold tracking-[0.1em] uppercase text-white px-2 py-1"
                        style={{ background: post.accent }}
                      >
                        {post.category}
                      </span>
                    </div>
                    <div className="p-[26px_24px]">
                      <div className="ff-mono text-[10.5px] tracking-[0.08em] uppercase text-[#9099a1] mb-3">
                        {formatNewsDate(post.date)} · {post.readingMinutes} min
                      </div>
                      <h3 className="ff-display font-bold text-[19px] leading-[1.16] tracking-[-0.01em] text-[#16191E] group-hover:text-[#C9241A] transition-colors mb-2.5">
                        {post.title}
                      </h3>
                      <p className="text-[14px] text-[#5a5f66] leading-relaxed">{post.excerpt}</p>
                    </div>
                  </Link>
                </SpotlightCard>
              ))}
            </div>
          )}
        </Container>
      </LightSection>

      {/* Industry feed (RSS placeholder) */}
      <DarkSection>
        <div
          className="absolute top-[-140px] right-[-100px] w-[780px] h-[520px] pointer-events-none"
          aria-hidden="true"
          style={{ background: 'radial-gradient(55% 65% at 70% 30%,rgba(201,36,26,.14),transparent 76%)', filter: 'blur(46px)' }}
        />
        <div className="absolute inset-0 v5-grain opacity-[0.1] mix-blend-overlay pointer-events-none" aria-hidden="true" />
        <Container className="relative">
          <div className="flex items-end justify-between flex-wrap gap-5 mb-9">
            <div className="max-w-[640px]">
              <Eyebrow n="02">Industry Feed</Eyebrow>
              <h2 className="ff-display font-extrabold text-[clamp(28px,3.6vw,44px)] leading-[1.02] tracking-[-0.02em] mt-4 text-white">
                Across the community
              </h2>
              <p className="text-[16px] text-[#9aa0a8] mt-4">
                The latest incident-command and resilience news from across the UK blue-light community, pulled into one place. Live RSS ingestion is coming — this is a preview of the feed.
              </p>
            </div>
            <a
              href="/news/rss.xml"
              className="ff-mono inline-flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.05em] text-white border border-white/22 hover:bg-white/[0.06] hover:border-white/40 px-5 py-3 transition-colors"
            >
              <Rss className="w-4 h-4 text-[#C9241A]" /> RSS feed
            </a>
          </div>
          <div className="border-t border-white/14">
            {INDUSTRY_FEED.map((item) => (
              <a
                key={item.title}
                href={item.url}
                className="group flex items-center gap-5 py-5 border-b border-white/14 hover:bg-white/[0.03] transition-colors px-1"
              >
                <span className="ff-mono text-[11px] tracking-[0.08em] uppercase text-[#6f757c] w-[120px] shrink-0 hidden sm:block">
                  {formatNewsDate(item.date)}
                </span>
                <span className="flex-1 ff-display font-semibold text-[16px] sm:text-[18px] tracking-[-0.01em] text-white group-hover:text-[#C9241A] transition-colors">
                  {item.title}
                </span>
                <span className="ff-mono text-[11px] tracking-[0.08em] uppercase text-[#9aa0a8] shrink-0 hidden md:block">
                  {item.source}
                </span>
                <ArrowUpRight className="w-4 h-4 text-[#6f757c] group-hover:text-[#C9241A] transition-colors shrink-0" />
              </a>
            ))}
          </div>
        </Container>
      </DarkSection>
    </SiteShell>
  )
}
