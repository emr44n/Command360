import { PublicLayout } from '@/components/layout/PublicLayout'
import { ContactForm } from '@/components/contact/ContactForm'
import { Mail, MapPin, Clock, ArrowRight } from 'lucide-react'
import { JoinCodeInput } from '@/components/join/JoinCodeInput'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact — Command 360',
  description: 'Get in touch with the Command 360 team.',
}

export default function ContactPage() {
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
            Contact
          </span>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
            Get in touch
          </h1>
          <p className="text-lg text-white/45 leading-relaxed max-w-lg mx-auto">
            Questions, feedback, or partnership enquiries — we&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact content */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Contact info */}
            <div className="space-y-4">
              {[
                { icon: Mail, title: 'Email', desc: 'hello@command360.co.uk' },
                { icon: MapPin, title: 'Location', desc: 'United Kingdom' },
                { icon: Clock, title: 'Response time', desc: 'Within 24 hours on business days' },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4 p-5 rounded-2xl border border-border bg-card">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{item.title}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}

              {/* Quick join */}
              <div className="p-5 rounded-2xl border border-border bg-card">
                <p className="font-semibold text-foreground mb-2">Join a session?</p>
                <p className="text-xs text-muted-foreground mb-3">Enter your room code to join a live presentation.</p>
                <JoinCodeInput variant="compact" />
              </div>
            </div>

            {/* Form */}
            <div className="md:col-span-2">
              <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA — Dark */}
      <section className="relative bg-[#07070a] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(220,38,38,0.12),transparent)]" />
        </div>
        <div className="relative max-w-3xl mx-auto px-5 py-24 text-center">
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white mb-4">
            Ready to transform your training?
          </h2>
          <p className="text-white/40 text-lg mb-8">Free to get started. No credit card required.</p>
          <Link href="/register" className="group inline-flex items-center gap-2 px-8 h-12 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-500 transition-all hover:shadow-lg hover:shadow-red-500/25 cursor-pointer">
            Get started free <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </section>
    </PublicLayout>
  )
}
