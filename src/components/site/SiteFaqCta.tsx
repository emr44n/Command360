import Link from 'next/link'
import { FaqAccordion } from '@/components/home/FaqAccordion'
import { V5AuthButton } from '@/components/home/V5Chrome'

/**
 * Shared FAQ + final CTA block, rendered at the foot of every front-facing
 * page (above the footer) for consistency. Same markup/treatment as home.
 */
const FAQ_ITEMS = [
  { q: 'Is Command 360 free to use?', a: 'Yes. Command 360 is completely free to get started with no credit card required. Simply create an account and start building sessions right away.' },
  { q: 'Do participants need to create an account?', a: 'No. Participants simply enter a 6-digit join code on any device with a web browser. No app download or account creation needed.' },
  { q: 'Can I export session data for training records?', a: 'Yes. All session results, quiz scores, and AI summaries can be exported as CSV or PDF for your training records and compliance documentation.' },
  { q: 'Is Command 360 suitable for multi-agency exercises?', a: 'Absolutely. Command 360 is regularly used for multi-agency exercises involving fire, police, ambulance, and local authority teams working together.' },
  { q: 'What about data security and GDPR?', a: 'Command 360 is hosted in the UK, fully GDPR compliant, and we offer a Data Processing Agreement (DPA) for all organisations. Contact us for data residency options.' },
]

export function SiteFaqCta() {
  return (
    <>
      {/* FAQ */}
      <section className="relative overflow-hidden bg-[#0F1216] text-white py-[90px]">
        <div className="absolute left-1/2 top-[-260px] -translate-x-1/2 w-[1100px] h-[520px] pointer-events-none" aria-hidden="true" style={{ background: 'radial-gradient(50% 60% at 50% 100%, rgba(0,0,0,0.85), rgba(0,0,0,0.4) 45%, transparent 72%)', filter: 'blur(40px)' }} />
        <div className="absolute inset-0 v5-grain opacity-[0.1] mix-blend-overlay pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-[820px] mx-auto px-5 sm:px-[30px]">
          <div className="text-center mb-10" data-reveal>
            <div className="ff-mono text-[12px] font-semibold tracking-[0.12em] uppercase text-[#C9241A] mb-4">Briefing notes</div>
            <h2 className="ff-display font-extrabold text-[clamp(28px,3.4vw,42px)] leading-[1.02] tracking-[-0.02em]">Frequently asked questions</h2>
          </div>
          <div data-reveal><FaqAccordion items={FAQ_ITEMS} /></div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-[#0F1216] text-white py-[104px]">
        <div className="absolute bottom-[-220px] left-1/2 -translate-x-1/2 w-[1240px] h-[720px] pointer-events-none" aria-hidden="true" style={{ background: 'radial-gradient(55% 70% at 50% 100%,rgba(201,36,26,.24),rgba(201,36,26,.07) 48%,transparent 78%)', filter: 'blur(42px)' }} />
        <div className="absolute inset-0 v5-grain opacity-[0.14] mix-blend-overlay pointer-events-none" aria-hidden="true" />
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px)', backgroundSize: '74px 74px', maskImage: 'radial-gradient(700px 420px at 50% 40%,#000,transparent 80%)', WebkitMaskImage: 'radial-gradient(700px 420px at 50% 40%,#000,transparent 80%)' }} />
        <div className="relative max-w-[1280px] mx-auto px-5 sm:px-[30px] text-center" data-reveal>
          <div className="ff-mono text-[12px] font-semibold tracking-[0.14em] uppercase text-[#C9241A] mb-6">Begin deployment</div>
          <h2 className="ff-display font-extrabold text-[clamp(34px,5vw,64px)] leading-[0.98] tracking-[-0.025em] mb-5">Ready to transform<br />your training?</h2>
          <p className="text-[18px] text-[#aab0b8] mb-9">Free for 30 days. No credit card. Built for those who serve.</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <V5AuthButton tab="register" label="Start free trial" variant="solid" />
            <Link href="/contact" className="ff-mono text-[13px] font-semibold uppercase tracking-[0.05em] text-white border border-white/24 hover:bg-white/[0.06] px-7 py-4 transition-colors">Book a demo</Link>
          </div>
        </div>
      </section>
    </>
  )
}
