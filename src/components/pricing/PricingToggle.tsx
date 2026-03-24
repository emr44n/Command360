'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Check } from 'lucide-react'

const PLANS = [
  {
    name: 'Starter',
    description: 'For individual trainers',
    monthly: 0,
    annual: 0,
    features: [
      'Up to 50 participants per session',
      '3 presentations',
      'All 6 slide types',
      'Real-time results',
      'CSV export',
    ],
    cta: 'Get started free',
    href: '/register',
    popular: false,
  },
  {
    name: 'Team',
    description: 'For training departments',
    monthly: 29,
    annual: 24,
    features: [
      'Unlimited participants',
      'Unlimited presentations',
      'All slide types + AI insights',
      'Team collaboration (5 members)',
      'Priority support',
      'Custom branding',
      'Advanced analytics',
    ],
    cta: 'Start 14-day trial',
    href: '/register',
    popular: true,
  },
  {
    name: 'Enterprise',
    description: 'For large organisations',
    monthly: null,
    annual: null,
    features: [
      'Everything in Team',
      'Unlimited team members',
      'SSO / SAML authentication',
      'Dedicated account manager',
      'Custom integrations',
      'SLA guarantee',
      'Data residency options',
      'Invoice billing',
    ],
    cta: 'Contact sales',
    href: '/contact',
    popular: false,
  },
]

export function PricingToggle() {
  const [annual, setAnnual] = useState(true)

  return (
    <div>
      {/* Toggle */}
      <div className="flex items-center justify-center gap-3 mb-10">
        <span className={`text-sm ${!annual ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>Monthly</span>
        <button
          onClick={() => setAnnual(!annual)}
          className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${annual ? 'bg-primary' : 'bg-muted-foreground/30'}`}
        >
          <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${annual ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
        <span className={`text-sm ${annual ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
          Annual
          <span className="ml-1.5 text-xs text-primary font-medium">Save 17%</span>
        </span>
      </div>

      {/* Plans */}
      <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`relative bg-card border rounded-xl p-6 ${
              plan.popular ? 'border-primary ring-1 ring-primary/10' : 'border-border'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-primary text-primary-foreground text-[11px] font-medium rounded-full">
                Most popular
              </div>
            )}
            <h3 className="font-semibold text-foreground">{plan.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{plan.description}</p>
            <div className="mt-4 mb-5">
              {plan.monthly !== null ? (
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-foreground">
                    &pound;{annual ? plan.annual : plan.monthly}
                  </span>
                  <span className="text-sm text-muted-foreground">/mo</span>
                </div>
              ) : (
                <div className="text-3xl font-bold text-foreground">Custom</div>
              )}
            </div>
            <ul className="space-y-2 mb-6">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href={plan.href}
              className={`block text-center py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                plan.popular
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'bg-muted text-foreground hover:bg-muted/80'
              }`}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
