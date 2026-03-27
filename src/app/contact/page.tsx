import { PublicLayout } from '@/components/layout/PublicLayout'
import { ContactForm } from '@/components/contact/ContactForm'
import { ScrollReveal } from '@/components/home/ScrollReveal'
import { AuthCTAButton } from '@/components/home/AuthCTAButton'
import { Mail, MapPin, Clock, Headset, Phone, MessageCircle } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact — Command 360',
  description: 'Get in touch with the Command 360 team.',
}

export default function ContactPage() {
  return (
    <PublicLayout>
      {/* ── Hero ── */}
      <section className="relative bg-[#07070a] overflow-hidden">
        {/* Radial red glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(220,38,38,0.15),transparent)]" />
        </div>
        {/* Grid texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.10]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(220,38,38,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,0.35) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
        <div className="relative max-w-3xl mx-auto px-5 pt-36 pb-28 text-center">
          <ScrollReveal>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-[10px] uppercase tracking-[0.15em] text-white/60 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 pulse-dot" />
              Contact Us
            </span>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
              Let&apos;s{' '}
              <span className="bg-gradient-to-r from-red-400 via-red-500 to-orange-400 bg-clip-text text-transparent">
                talk
              </span>
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={160}>
            <p className="text-lg md:text-xl text-white/45 leading-relaxed max-w-lg mx-auto">
              Questions, feedback, or partnership enquiries — we&apos;d love to hear from you.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Contact Info Cards ── */}
      <section className="relative bg-[#07070a] overflow-hidden border-t border-border/50">
        {/* Subtle blur orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-red-500/[0.04] blur-[120px] pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-5 py-24">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-[10px] uppercase tracking-[0.15em] text-white/60 mb-6">
                Reach Out
              </span>
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white">
                How to{' '}
                <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                  reach us
                </span>
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal stagger>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  icon: Mail,
                  title: 'Email',
                  desc: 'hello@command360.co.uk',
                  color: 'red',
                },
                {
                  icon: Phone,
                  title: 'Phone',
                  desc: '+44 121 000 0000',
                  color: 'emerald',
                },
                {
                  icon: MapPin,
                  title: 'Location',
                  desc: 'Birmingham, West Midlands, UK',
                  color: 'blue',
                },
                {
                  icon: Clock,
                  title: 'Response time',
                  desc: 'Within 24 hours on business days',
                  color: 'amber',
                },
                {
                  icon: MessageCircle,
                  title: 'Live Chat',
                  desc: 'Available Mon–Fri, 9am–5pm GMT',
                  color: 'purple',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04] [box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.03)_inset]"
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 shrink-0 ${
                      item.color === 'red'
                        ? 'bg-red-500/10 text-red-400'
                        : item.color === 'blue'
                          ? 'bg-blue-500/10 text-blue-400'
                          : item.color === 'amber'
                            ? 'bg-amber-500/10 text-amber-400'
                            : item.color === 'emerald'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-purple-500/10 text-purple-400'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                  </div>
                  <p className="font-semibold text-white mb-1">{item.title}</p>
                  <p className="text-sm text-white/45 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Map Section ── */}
      <section className="relative bg-[#07070a] overflow-hidden border-t border-border/50">
        {/* Blur orb */}
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[350px] rounded-full bg-red-500/[0.04] blur-[120px] pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-5 py-24">
          <ScrollReveal>
            <div className="text-center mb-14">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-[10px] uppercase tracking-[0.15em] text-white/60 mb-6">
                <MapPin className="w-3.5 h-3.5" />
                Our Location
              </span>
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white">
                How to{' '}
                <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                  find us
                </span>
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden [box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.03)_inset]">
              <iframe
                title="Command 360 — Birmingham, UK"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-1.9204%2C52.4662%2C-1.8604%2C52.5062&layer=mapnik&marker=52.4862%2C-1.8904"
                className="w-full h-[350px] md:h-[420px] border-0 grayscale-[0.3] contrast-[1.1]"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="px-6 py-4 flex items-center justify-between border-t border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Birmingham City Centre</p>
                    <p className="text-xs text-white/40">West Midlands, United Kingdom</p>
                  </div>
                </div>
                <a
                  href="https://www.openstreetmap.org/?mlat=52.4862&mlon=-1.8904#map=14/52.4862/-1.8904"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-white/40 hover:text-white/60 transition-colors"
                >
                  View larger map &rarr;
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Contact Form ── */}
      <section className="relative bg-[#07070a] overflow-hidden border-t border-border/50">
        {/* Blur orb */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-red-500/[0.03] blur-[150px] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-5 py-24">
          <ScrollReveal>
            <div className="text-center mb-14">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-[10px] uppercase tracking-[0.15em] text-white/60 mb-6">
                <Headset className="w-3.5 h-3.5" />
                Send a Message
              </span>
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white">
                We&apos;re here to{' '}
                <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                  help
                </span>
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 md:p-10 [box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.03)_inset]">
              <ContactForm />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative bg-[#07070a] overflow-hidden border-t border-border/50">
        {/* Grid texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.10]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(220,38,38,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,0.35) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
        {/* Radial glow from bottom */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(220,38,38,0.15),transparent)]" />
        </div>
        <div className="relative max-w-3xl mx-auto px-5 py-28 text-center">
          <ScrollReveal>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-[10px] uppercase tracking-[0.15em] text-white/60 mb-8">
              Get Started
            </span>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-5">
              Ready to transform your{' '}
              <span className="bg-gradient-to-r from-red-400 via-red-500 to-orange-400 bg-clip-text text-transparent">
                training
              </span>
              ?
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={140}>
            <p className="text-white/40 text-lg mb-10">
              Free to get started. No credit card required.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <AuthCTAButton label="Get started free" />
          </ScrollReveal>
        </div>
      </section>
    </PublicLayout>
  )
}
