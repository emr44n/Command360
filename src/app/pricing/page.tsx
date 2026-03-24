import { PublicLayout } from '@/components/layout/PublicLayout'
import { PricingToggle } from '@/components/pricing/PricingToggle'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { JoinCodeInput } from '@/components/join/JoinCodeInput'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing — Command 360',
  description: 'Simple, transparent pricing for emergency services teams of all sizes.',
}

export default function PricingPage() {
  return (
    <PublicLayout>
      {/* Hero — Dark */}
      <section className="relative bg-[#07070a] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(220,38,38,0.12),transparent)]" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
        </div>
        <div className="relative max-w-3xl mx-auto px-5 pt-32 pb-24 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-[13px] text-white/60 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 pulse-dot" />
            Pricing
          </span>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-white/45 max-w-lg mx-auto">
            Start free. Upgrade when your team grows. No hidden fees.
          </p>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="py-24 md:py-32 px-6 bg-background">
        <div className="max-w-5xl mx-auto">
          <PricingToggle />

          {/* FAQ */}
          <div className="mt-24 max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <span className="feature-badge bg-primary/10 text-primary">FAQ</span>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mt-4">Frequently asked questions</h2>
            </div>
            <div className="space-y-4">
              {[
                { q: 'Can I try Command 360 for free?', a: 'Yes. The Starter plan is completely free with up to 50 participants per session and 3 presentations.' },
                { q: 'Do I need a credit card to sign up?', a: 'No. You can create an account and start using Command 360 immediately with no payment information required.' },
                { q: 'Can I switch plans at any time?', a: 'Yes. You can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing period.' },
                { q: 'Is there a discount for emergency services?', a: 'Command 360 is purpose-built for emergency services. Contact us for special pricing for large organisations.' },
                { q: 'What payment methods do you accept?', a: 'We accept all major credit and debit cards via our secure payment processor. Enterprise plans can pay by invoice.' },
              ].map((faq) => (
                <div key={faq.q} className="p-5 rounded-2xl border border-border bg-card">
                  <h3 className="font-semibold text-foreground">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise CTA — Dark */}
      <section className="relative bg-[#07070a] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(220,38,38,0.12),transparent)]" />
        </div>
        <div className="relative max-w-3xl mx-auto px-5 py-24 text-center">
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white mb-4">
            Need a custom plan for your organisation?
          </h2>
          <p className="text-white/40 text-lg mb-8 max-w-lg mx-auto">
            We offer bespoke plans for large emergency services organisations with dedicated support and custom integrations.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <Link href="/contact" className="group inline-flex items-center gap-2 px-8 h-12 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-500 transition-all hover:shadow-lg hover:shadow-red-500/25 cursor-pointer">
              Contact us <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <div className="flex items-center justify-center gap-3">
            <span className="text-xs text-white/30">Got a room code?</span>
            <JoinCodeInput variant="hero" />
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
