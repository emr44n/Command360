import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { SiteShell } from '@/components/site/SiteShell'
import { Container } from '@/components/site/primitives'
import { HeroCornerLogo } from '@/components/site/HeroCornerLogo'
import { getAllPosts, getPost, formatNewsDate, type NewsBlock } from '@/lib/news'

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return { title: 'Article not found — Command 360' }
  return {
    title: `${post.title} — Command 360`,
    description: post.excerpt,
    keywords: post.keywords,
    authors: [{ name: post.author }],
    alternates: { canonical: `/news/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: `/news/${post.slug}`,
      publishedTime: post.date,
      authors: [post.author],
      images: [{ url: post.heroImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.heroImage],
    },
  }
}

function Block({ block }: { block: NewsBlock }) {
  switch (block.type) {
    case 'heading':
      return (
        <h2 className="ff-display font-extrabold text-[clamp(22px,2.4vw,30px)] leading-[1.12] tracking-[-0.015em] text-[#16191E] mt-12 mb-4">
          {block.text}
        </h2>
      )
    case 'text':
      return <p className="text-[17px] leading-[1.75] text-[#33383e] mb-6">{block.text}</p>
    case 'image':
      return (
        <figure className="my-10">
          <div className="relative w-full overflow-hidden border border-[rgba(20,25,30,0.14)] aspect-[16/9]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={block.src} alt={block.alt} className="absolute inset-0 w-full h-full object-cover" />
          </div>
          {block.caption && (
            <figcaption className="ff-mono text-[12px] tracking-[0.02em] text-[#8a9098] mt-3 text-center">
              {block.caption}
            </figcaption>
          )}
        </figure>
      )
    case 'video':
      return (
        <figure className="my-10">
          <div className="relative w-full overflow-hidden border border-[rgba(20,25,30,0.14)] aspect-video bg-black">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${block.youtube}`}
              title={block.caption || 'Video'}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          {block.caption && (
            <figcaption className="ff-mono text-[12px] tracking-[0.02em] text-[#8a9098] mt-3 text-center">
              {block.caption}
            </figcaption>
          )}
        </figure>
      )
    case 'quote':
      return (
        <blockquote className="my-10 border-l-2 border-[#C9241A] pl-6">
          <p className="ff-display font-bold text-[clamp(20px,2.2vw,26px)] leading-[1.3] tracking-[-0.01em] text-[#16191E]">
            “{block.text}”
          </p>
          {block.attribution && (
            <cite className="ff-mono not-italic text-[12px] tracking-[0.08em] uppercase text-[#8a9098] mt-3 block">
              — {block.attribution}
            </cite>
          )}
        </blockquote>
      )
  }
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const related = getAllPosts().filter((p) => p.slug !== post.slug).slice(0, 3)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: post.title,
    description: post.excerpt,
    image: post.heroImage,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Organization', name: post.author },
    publisher: {
      '@type': 'Organization',
      name: 'Command 360',
      logo: { '@type': 'ImageObject', url: '/logo.png' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `/news/${post.slug}` },
    keywords: post.keywords.join(', '),
  }

  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero with the article image */}
      <header className="relative overflow-hidden bg-[#0F1216] text-white">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.heroImage} alt="" className="w-full h-full object-cover opacity-[0.28]" />
        </div>
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{ background: 'linear-gradient(180deg, rgba(15,18,22,0.55) 0%, rgba(15,18,22,0.82) 55%, #0F1216 100%)' }}
        />
        <div
          className="absolute bottom-[-200px] left-1/2 -translate-x-1/2 w-[1180px] h-[640px] pointer-events-none"
          aria-hidden="true"
          style={{ background: `radial-gradient(60% 80% at 50% 100%, ${post.accent}33, ${post.accent}10 48%, transparent 78%)`, filter: 'blur(40px)' }}
        />
        <div className="absolute inset-0 v5-grain opacity-[0.12] mix-blend-overlay pointer-events-none" aria-hidden="true" />

        <div className="relative max-w-[860px] mx-auto px-5 sm:px-[30px] pt-[clamp(124px,16vh,172px)] pb-[clamp(48px,7vh,80px)]">
          <Link
            href="/news"
            className="ff-mono inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.06em] text-[#9aa0a8] hover:text-white transition-colors mb-7"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> All news
          </Link>
          <div className="flex items-center gap-3 mb-5">
            <span
              className="ff-mono text-[10.5px] font-semibold tracking-[0.1em] uppercase text-white px-2.5 py-1.5"
              style={{ background: post.accent }}
            >
              {post.category}
            </span>
            <span className="ff-mono text-[11px] tracking-[0.08em] uppercase text-[#9aa0a8]">
              {formatNewsDate(post.date)} · {post.readingMinutes} min read
            </span>
          </div>
          <h1 className="ff-display font-extrabold text-white leading-[1.04] tracking-[-0.02em] text-[clamp(30px,4.4vw,52px)]">
            {post.title}
          </h1>
          <p className="text-[18px] leading-[1.6] text-[#aab0b8] max-w-[640px] mt-6">{post.excerpt}</p>
          <div className="ff-mono text-[12px] tracking-[0.06em] uppercase text-[#6f757c] mt-7">By {post.author}</div>
        </div>
      </header>

      {/* Article body */}
      <section className="bg-[#EFECE4] text-[#16191E] py-[72px]">
        <Container>
          <article className="max-w-[760px] mx-auto">
            {post.blocks.map((block, i) => (
              <Block key={i} block={block} />
            ))}

            {/* share / back */}
            <div className="mt-14 pt-7 border-t border-[rgba(20,25,30,0.16)] flex items-center justify-between flex-wrap gap-4">
              <Link
                href="/news"
                className="ff-mono inline-flex items-center gap-1.5 text-[12.5px] font-semibold uppercase tracking-[0.05em] text-[#16191E] hover:text-[#C9241A] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to news
              </Link>
              <div className="flex flex-wrap gap-2">
                {post.keywords.slice(0, 4).map((k) => (
                  <span key={k} className="ff-mono text-[10.5px] tracking-[0.06em] uppercase text-[#5a5f66] border border-[rgba(20,25,30,0.18)] px-2.5 py-1.5">
                    {k}
                  </span>
                ))}
              </div>
            </div>
          </article>
        </Container>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="relative overflow-hidden bg-[#0F1216] text-white py-[72px]">
          <Container className="relative">
            <div className="ff-mono text-[12px] font-semibold tracking-[0.12em] uppercase text-[#C9241A] mb-6">More from Command 360</div>
            <div className="grid sm:grid-cols-3 border-t border-l border-white/14">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/news/${p.slug}`}
                  className="group relative p-[26px_24px] border-r border-b border-white/14 hover:bg-white/[0.03] transition-colors"
                >
                  <div className="ff-mono text-[10.5px] tracking-[0.08em] uppercase mb-3" style={{ color: p.accent }}>
                    {p.category}
                  </div>
                  <h3 className="ff-display font-bold text-[18px] leading-[1.16] tracking-[-0.01em] text-white group-hover:text-[#C9241A] transition-colors mb-2.5">
                    {p.title}
                  </h3>
                  <p className="text-[13.5px] text-[#9aa0a8] leading-relaxed mb-4">{p.excerpt}</p>
                  <span className="ff-mono inline-flex items-center gap-1.5 text-[11.5px] font-semibold uppercase tracking-[0.05em] text-white">
                    Read <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Link>
              ))}
            </div>
          </Container>
          <HeroCornerLogo />
        </section>
      )}
    </SiteShell>
  )
}
