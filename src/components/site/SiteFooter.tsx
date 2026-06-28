import Link from 'next/link'
import { FooterWordmark } from '@/components/home/FooterWordmark'
import { BrandMark } from '@/components/site/BrandMark'

/**
 * Shared v5 site footer — identical to the home page footer, used across
 * every front-facing page via PublicLayout. Rigid sitemap, newsletter, and
 * the scroll-parallax C360 wordmark.
 */
const SOLUTIONS = [
  { slug: 'fire-rescue', label: 'Fire & Rescue' },
  { slug: 'police', label: 'Police' },
  { slug: 'ambulance', label: 'Ambulance' },
  { slug: 'armed-forces', label: 'Armed Forces' },
  { slug: 'coastguard', label: 'HM Coastguard' },
  { slug: 'search-rescue', label: 'Search & Rescue' },
  { slug: 'prison-probation', label: 'Prison & Probation' },
  { slug: 'local-authority', label: 'Local Authority' },
  { slug: 'civil-contingencies', label: 'Civil Contingencies' },
  { slug: 'nhs-emergency', label: 'NHS Emergency' },
  { slug: 'voluntary-sector', label: 'Voluntary Sector' },
]

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-[#0A0C0F] text-[#8a9098] pt-20 pb-[92px] md:pb-[188px]">
      <div aria-hidden="true" className="absolute left-1/2 top-[-120px] -translate-x-1/2 w-[1200px] h-[520px] pointer-events-none" style={{ background: 'radial-gradient(50% 60% at 50% 0%, rgba(201,36,26,0.10), rgba(201,36,26,0.03) 42%, transparent 74%)', filter: 'blur(36px)' }} />
      <FooterWordmark />
      <div className="relative max-w-[1280px] mx-auto px-5 sm:px-[30px]">
        <div className="grid md:grid-cols-2 gap-10 items-end pb-11 border-b border-white/10">
          <div>
            <h2 className="ff-display font-extrabold text-[clamp(24px,2.6vw,34px)] leading-[1.04] tracking-[-0.02em] text-white mb-2.5">Operational briefings, monthly</h2>
            <p className="text-[15px] text-[#9aa0a8] max-w-[420px]">Training tactics, product updates, and lessons from the UK blue-light community. No spam — unsubscribe anytime.</p>
          </div>
          <form className="flex items-stretch border border-white/20 max-w-[440px] w-full md:ml-auto">
            <input type="email" placeholder="name@service.gov.uk" aria-label="Email address" className="ff-mono flex-1 min-w-0 bg-transparent border-none text-white text-[13.5px] tracking-[0.02em] px-4 py-3.5 outline-none placeholder:text-white/35" />
            <button type="button" className="ff-mono bg-[#C9241A] text-white font-semibold text-[12px] tracking-[0.05em] uppercase px-6 hover:bg-[#a91d14] transition-colors">Subscribe</button>
          </form>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-12 gap-x-8 gap-y-10 py-12 border-b border-white/10">
          <div className="col-span-2 md:col-span-3">
            <div className="flex items-center gap-3 mb-4">
              <BrandMark size={30} />
              <span className="ff-wordmark text-[18px] text-white tracking-[0.01em]">COMMAND 360</span>
            </div>
            <p className="text-[14px] leading-[1.6] mb-5 max-w-[300px]">Interactive command training for UK emergency services. UK-hosted, GDPR ready, built for those who serve.</p>
            <div className="flex gap-2.5">
              {['in', 'X', '@'].map((s) => <span key={s} className="w-9 h-9 border border-white/15 flex items-center justify-center ff-mono text-[12px] text-[#9aa0a8] hover:border-white/45 hover:text-white transition-colors cursor-pointer">{s}</span>)}
            </div>
          </div>
          <div className="md:col-span-3">
            <div className="ff-mono text-[11px] font-semibold tracking-[0.1em] uppercase text-white mb-[18px]">Solutions</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-[13.5px]">
              {SOLUTIONS.map((uc) => <Link key={uc.slug} href={`/solutions/${uc.slug}`} className="hover:text-white transition-colors">{uc.label}</Link>)}
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="ff-mono text-[11px] font-semibold tracking-[0.1em] uppercase text-white mb-[18px]">Platform</div>
            <div className="flex flex-col gap-2.5 text-[13.5px]">
              <Link href="/#capabilities" className="hover:text-white transition-colors">How it works</Link>
              <Link href="/#services" className="hover:text-white transition-colors">Services</Link>
              <Link href="/#demo" className="hover:text-white transition-colors">Live demo</Link>
              <Link href="/command-studio" className="hover:text-white transition-colors">Command Studio</Link>
              <Link href="/#deploy" className="hover:text-white transition-colors">Deployment</Link>
              <Link href="/templates" className="hover:text-white transition-colors">Templates</Link>
              <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
              <Link href="/product" className="hover:text-white transition-colors">Product tour</Link>
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="ff-mono text-[11px] font-semibold tracking-[0.1em] uppercase text-white mb-[18px]">Company</div>
            <div className="flex flex-col gap-2.5 text-[13.5px]">
              <Link href="/about" className="hover:text-white transition-colors">About</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
              <Link href="/help" className="hover:text-white transition-colors">Help centre</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Book a demo</Link>
              <Link href="/join" className="hover:text-white transition-colors">Join a session</Link>
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="ff-mono text-[11px] font-semibold tracking-[0.1em] uppercase text-white mb-[18px]">Legal</div>
            <div className="flex flex-col gap-2.5 text-[13.5px]">
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
              <Link href="/accessibility" className="hover:text-white transition-colors">Accessibility</Link>
              <Link href="/dpa" className="hover:text-white transition-colors">DPA</Link>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-5 flex-wrap pt-6 ff-mono text-[12px] text-[#5f656c]">
          <span>© 2026 Command 360 · Registered in England &amp; Wales</span>
          <div className="flex gap-5 flex-wrap">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/accessibility" className="hover:text-white transition-colors">Accessibility</Link>
            <Link href="/dpa" className="hover:text-white transition-colors">DPA</Link>
            <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
