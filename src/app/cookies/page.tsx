import type { Metadata } from 'next'
import { SiteShell } from '@/components/site/SiteShell'
import { PageHero, Eyebrow, DarkSection, Container } from '@/components/site/primitives'

export const metadata: Metadata = {
  title: 'Cookie Policy — Command 360',
}

export default function CookiesPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow={<Eyebrow>Legal</Eyebrow>}
        title={<>Cookie <span className="text-[#C9241A]">Policy</span></>}
        lede="Last updated: February 2026"
      />

      <DarkSection>
        <Container>
          <article className="max-w-[820px]">
            <h2 className="ff-display font-bold text-[22px] tracking-[-0.01em] mt-10 mb-3 text-white">What Are Cookies</h2>
            <p className="text-[15px] leading-relaxed text-[#aab0b8]">Cookies are small text files stored on your device when you visit a website. They help us provide a better experience by remembering your preferences and understanding how you use our platform.</p>

            <h2 className="ff-display font-bold text-[22px] tracking-[-0.01em] mt-10 mb-3 text-white">Essential Cookies</h2>
            <p className="text-[15px] leading-relaxed text-[#aab0b8]">These cookies are necessary for Command 360 to function. They include authentication tokens, session identifiers, and security cookies. You cannot opt out of essential cookies as the platform requires them to operate.</p>

            <h2 className="ff-display font-bold text-[22px] tracking-[-0.01em] mt-10 mb-3 text-white">Analytics Cookies</h2>
            <p className="text-[15px] leading-relaxed text-[#aab0b8]">We use analytics cookies to understand how visitors interact with our platform. This helps us improve the user experience. Analytics data is aggregated and anonymised.</p>

            <h2 className="ff-display font-bold text-[22px] tracking-[-0.01em] mt-10 mb-3 text-white">Preference Cookies</h2>
            <p className="text-[15px] leading-relaxed text-[#aab0b8]">These cookies remember your settings and preferences, such as your chosen theme (light or dark mode) and language preferences.</p>

            <h2 className="ff-display font-bold text-[22px] tracking-[-0.01em] mt-10 mb-3 text-white">Managing Cookies</h2>
            <p className="text-[15px] leading-relaxed text-[#aab0b8]">You can control cookies through your browser settings. Most browsers allow you to block or delete cookies. However, blocking essential cookies may prevent Command 360 from functioning correctly.</p>

            <h2 className="ff-display font-bold text-[22px] tracking-[-0.01em] mt-10 mb-3 text-white">Third-Party Cookies</h2>
            <p className="text-[15px] leading-relaxed text-[#aab0b8]">We minimise the use of third-party cookies. Our authentication provider (Supabase) may set cookies necessary for secure sign-in.</p>

            <h2 className="ff-display font-bold text-[22px] tracking-[-0.01em] mt-10 mb-3 text-white">Contact</h2>
            <p className="text-[15px] leading-relaxed text-[#aab0b8]">For questions about our cookie policy, please contact us at hello@command360.co.uk.</p>
          </article>
        </Container>
      </DarkSection>
    </SiteShell>
  )
}
