import { RevealManager } from '@/components/home/RevealManager'
import { ScrollProgress } from '@/components/home/ScrollProgress'
import { TopBar } from '@/components/home/TopBar'
import { FloatingJoinDock } from '@/components/join/FloatingJoinDock'
import { SiteHeader } from './SiteHeader'
import { SiteFaqCta } from './SiteFaqCta'
import { SiteFooter } from './SiteFooter'

/**
 * v5 page shell for every front-facing page (the home page composes the same
 * pieces inline). Provides the fixed dark backdrop, the utility top bar, the
 * shared header, scroll-reveal + progress, and — below the page content — the
 * shared FAQ + CTA block and footer.
 *
 * Pages supply only their own (dark, v5-styled) hero + body sections. Set
 * `faqCta={false}` to suppress the shared FAQ/CTA on pages where it doesn't
 * fit (e.g. legal pages can keep it; utility flows may not).
 */
export function SiteShell({
  children,
  faqCta = true,
}: {
  children: React.ReactNode
  faqCta?: boolean
}) {
  return (
    <div className="v5 relative min-h-screen" id="top">
      <div className="fixed inset-0 -z-10 bg-[#0F1216]" aria-hidden="true" />
      <RevealManager />
      <ScrollProgress />
      <TopBar />
      <SiteHeader />
      <main>{children}</main>
      {faqCta && <SiteFaqCta />}
      <SiteFooter />
      <FloatingJoinDock />
    </div>
  )
}
