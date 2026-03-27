import { PublicLayout } from '@/components/layout/PublicLayout'
import { PricingToggle } from '@/components/pricing/PricingToggle'
import { AuthCTAButton } from '@/components/home/AuthCTAButton'
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
        {/* Gradient layers */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(220,38,38,0.15),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_20%,rgba(251,146,60,0.06),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_20%_60%,rgba(220,38,38,0.05),transparent)]" />
        </div>
        {/* Grid texture with mask fade */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(220,38,38,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,0.12) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse 70% 50% at 50% 0%, black, transparent)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 50% at 50% 0%, black, transparent)',
          }}
        />
        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#07070a] to-transparent pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-5 pt-36 pb-28 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-[10px] uppercase tracking-[0.15em] text-white/50 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 pulse-dot" />
            Pricing
          </span>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
            Simple, <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">transparent</span> pricing
          </h1>
          <p className="text-lg text-white/45 max-w-lg mx-auto mb-6">
            Start free. Upgrade when your team grows. No hidden fees.
          </p>
          <p className="text-[13px] text-white/30 flex items-center justify-center gap-2">
            <span>No credit card required</span>
            <span className="text-white/15">&bull;</span>
            <span>Cancel anytime</span>
            <span className="text-white/15">&bull;</span>
            <span>Free plan available</span>
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
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <AuthCTAButton label="Contact us" tab="register" />
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
