'use client'

import { useState, useRef } from 'react'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { ScrollReveal } from '@/components/home/ScrollReveal'
import { useAuthSlideOver } from '@/components/auth/AuthSlideOverProvider'
import {
  Mail,
  MapPin,
  Phone,
  Headset,
  Send,
  Loader2,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Organisation options                                               */
/* ------------------------------------------------------------------ */

const fireServices = [
  'West Midlands Fire Service',
  'London Fire Brigade',
  'Greater Manchester Fire & Rescue Service',
  'West Yorkshire Fire & Rescue Service',
  'South Yorkshire Fire & Rescue',
  'Merseyside Fire & Rescue Service',
  'Tyne and Wear Fire & Rescue Service',
  'Hampshire & Isle of Wight Fire & Rescue Service',
  'Kent Fire & Rescue Service',
  'Devon & Somerset Fire & Rescue Service',
  'Avon Fire & Rescue Service',
]

const policeServices = [
  'West Midlands Police',
  'Metropolitan Police Service',
  'Greater Manchester Police',
  'West Yorkshire Police',
  'Thames Valley Police',
  'Hampshire Constabulary',
  'Kent Police',
  'Essex Police',
]

const ambulanceServices = [
  'West Midlands Ambulance Service',
  'London Ambulance Service',
  'North West Ambulance Service',
  'Yorkshire Ambulance Service',
  'South East Coast Ambulance Service',
  'East Midlands Ambulance Service',
]

const subjectOptions = [
  'General Inquiry',
  'Book a Demo',
  'Pricing & Plans',
  'Technical Support',
  'Partnership Inquiry',
]

/* ------------------------------------------------------------------ */
/*  Styles for form elements                                           */
/* ------------------------------------------------------------------ */

const inputBase =
  'w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-all duration-200 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 focus:bg-white/[0.06] hover:border-white/[0.14]'

const selectBase =
  'w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition-all duration-200 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 focus:bg-white/[0.06] hover:border-white/[0.14] appearance-none cursor-pointer'

const labelBase = 'block text-sm font-medium text-white/70 mb-2'

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ContactPage() {
  const { openAuth } = useAuthSlideOver()

  const formRef = useRef<HTMLFormElement>(null)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  function validate(): boolean {
    const form = formRef.current
    if (!form) return false

    const name = (form.elements.namedItem('name') as HTMLInputElement)?.value.trim()
    const email = (form.elements.namedItem('email') as HTMLInputElement)?.value.trim()
    const organisation = (form.elements.namedItem('organisation') as HTMLSelectElement)?.value
    const subject = (form.elements.namedItem('subject') as HTMLSelectElement)?.value
    const message = (form.elements.namedItem('message') as HTMLTextAreaElement)?.value.trim()

    const newErrors: Record<string, boolean> = {}
    if (!name) newErrors.name = true
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = true
    if (!organisation) newErrors.organisation = true
    if (!subject) newErrors.subject = true
    if (!message) newErrors.message = true

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!validate()) return

    setSending(true)
    // Simulate sending -- in production this would hit an API endpoint
    await new Promise((r) => setTimeout(r, 1500))
    setSending(false)
    setSent(true)
  }

  function fieldClass(field: string) {
    return errors[field] ? 'ring-2 ring-red-500/60 border-red-500/50' : ''
  }

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
                Talk
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

      {/* ── Form + Map two-column section ── */}
      <section className="relative bg-[#07070a] overflow-hidden border-t border-border/50">
        {/* Subtle blur orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-red-500/[0.03] blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-red-500/[0.04] blur-[120px] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-5 py-24">
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

          <div className="grid lg:grid-cols-[1fr_420px] gap-8 items-start">
            {/* ── Left: Form ── */}
            <ScrollReveal delay={100}>
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 md:p-10 [box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.03)_inset]">
                {sent ? (
                  /* ── Thank-you state ── */
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="relative mb-6">
                      <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center animate-[scale-in_0.4s_ease-out]">
                        <CheckCircle2 className="w-10 h-10 text-emerald-400 animate-[fade-in-up_0.5s_ease-out_0.2s_both]" />
                      </div>
                      {/* Pulse ring */}
                      <div className="absolute inset-0 rounded-full border-2 border-emerald-400/30 animate-ping" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Thank you!</h3>
                    <p className="text-white/45 max-w-sm leading-relaxed">
                      Your message has been received. We&apos;ll get back to you within 24 hours on business days.
                    </p>
                    <button
                      onClick={() => {
                        setSent(false)
                        setErrors({})
                      }}
                      className="mt-8 text-sm text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  /* ── Form ── */
                  <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-5">
                    {/* Name + Email row */}
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="contact-name" className={labelBase}>
                          Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          id="contact-name"
                          name="name"
                          type="text"
                          required
                          placeholder="Your full name"
                          className={`${inputBase} ${fieldClass('name')}`}
                          onChange={() => setErrors((e) => ({ ...e, name: false }))}
                        />
                        {errors.name && (
                          <p className="mt-1.5 text-xs text-red-400">Please enter your name</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="contact-email" className={labelBase}>
                          Email <span className="text-red-400">*</span>
                        </label>
                        <input
                          id="contact-email"
                          name="email"
                          type="email"
                          required
                          placeholder="you@example.com"
                          className={`${inputBase} ${fieldClass('email')}`}
                          onChange={() => setErrors((e) => ({ ...e, email: false }))}
                        />
                        {errors.email && (
                          <p className="mt-1.5 text-xs text-red-400">Please enter a valid email</p>
                        )}
                      </div>
                    </div>

                    {/* Organisation dropdown */}
                    <div>
                      <label htmlFor="contact-organisation" className={labelBase}>
                        Organisation <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <select
                          id="contact-organisation"
                          name="organisation"
                          required
                          defaultValue=""
                          className={`${selectBase} ${fieldClass('organisation')}`}
                          onChange={() => setErrors((e) => ({ ...e, organisation: false }))}
                        >
                          <option value="" disabled>
                            Select your organisation
                          </option>
                          <optgroup label="UK Fire & Rescue Services">
                            {fireServices.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </optgroup>
                          <optgroup label="UK Police Services">
                            {policeServices.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </optgroup>
                          <optgroup label="UK Ambulance Services">
                            {ambulanceServices.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </optgroup>
                          <optgroup label="Other">
                            <option value="other">Other organisation</option>
                          </optgroup>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                      </div>
                      {errors.organisation && (
                        <p className="mt-1.5 text-xs text-red-400">Please select your organisation</p>
                      )}
                    </div>

                    {/* Subject */}
                    <div>
                      <label htmlFor="contact-subject" className={labelBase}>
                        Subject <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <select
                          id="contact-subject"
                          name="subject"
                          required
                          defaultValue=""
                          className={`${selectBase} ${fieldClass('subject')}`}
                          onChange={() => setErrors((e) => ({ ...e, subject: false }))}
                        >
                          <option value="" disabled>
                            What can we help with?
                          </option>
                          {subjectOptions.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                      </div>
                      {errors.subject && (
                        <p className="mt-1.5 text-xs text-red-400">Please choose a subject</p>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="contact-message" className={labelBase}>
                        Message <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        id="contact-message"
                        name="message"
                        required
                        rows={5}
                        placeholder="Tell us how we can help..."
                        className={`${inputBase} resize-none ${fieldClass('message')}`}
                        onChange={() => setErrors((e) => ({ ...e, message: false }))}
                      />
                      {errors.message && (
                        <p className="mt-1.5 text-xs text-red-400">Please enter a message</p>
                      )}
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={sending}
                      className="group inline-flex items-center gap-2.5 px-7 h-12 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-500 transition-all duration-200 hover:shadow-lg hover:shadow-red-500/25 disabled:opacity-60 disabled:pointer-events-none cursor-pointer"
                    >
                      {sending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </ScrollReveal>

            {/* ── Right: Map ── */}
            <ScrollReveal delay={200}>
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden [box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.03)_inset] sticky top-28">
                <iframe
                  title="Command 360 HQ — Birmingham, UK"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-1.9204%2C52.4662%2C-1.8604%2C52.5062&layer=mapnik&marker=52.4862%2C-1.8904"
                  className="w-full h-[320px] lg:h-[380px] border-0 grayscale-[0.3] contrast-[1.1]"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="px-5 py-4 border-t border-white/[0.06]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-red-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Command 360 HQ</p>
                      <p className="text-xs text-white/40">Birmingham City Centre, UK</p>
                    </div>
                  </div>
                  <a
                    href="https://www.openstreetmap.org/?mlat=52.4862&mlon=-1.8904#map=14/52.4862/-1.8904"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-white/40 hover:text-white/60 transition-colors"
                  >
                    View larger map <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── How to reach us ── */}
      <section className="relative bg-[#07070a] overflow-hidden border-t border-border/50">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-red-500/[0.04] blur-[120px] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-5 py-24">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-3xl mx-auto">
              {[
                {
                  icon: Mail,
                  title: 'Email',
                  desc: 'hello@command360.co.uk',
                  color: 'red' as const,
                },
                {
                  icon: Phone,
                  title: 'Phone',
                  desc: '+44 121 000 0000',
                  color: 'emerald' as const,
                },
                {
                  icon: MapPin,
                  title: 'Location',
                  desc: 'Birmingham, West Midlands, UK',
                  color: 'blue' as const,
                },
              ].map((item) => {
                const colorMap = {
                  red: 'bg-red-500/10 text-red-400',
                  blue: 'bg-blue-500/10 text-blue-400',
                  emerald: 'bg-emerald-500/10 text-emerald-400',
                }
                return (
                  <div
                    key={item.title}
                    className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04] [box-shadow:0_-20px_80px_-20px_rgba(255,255,255,0.03)_inset] text-center"
                  >
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 mx-auto ${colorMap[item.color]}`}
                    >
                      <item.icon className="w-5 h-5" />
                    </div>
                    <p className="font-semibold text-white mb-1">{item.title}</p>
                    <p className="text-sm text-white/45 leading-relaxed">{item.desc}</p>
                  </div>
                )
              })}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative bg-[#07070a] overflow-hidden border-t border-border/50">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.10]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(220,38,38,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,0.35) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
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
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-white mb-5">
              Ready to transform your{' '}
              <span className="bg-gradient-to-r from-red-400 via-red-500 to-orange-400 bg-clip-text text-transparent">
                training
              </span>
              ?
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={140}>
            <p className="text-white/40 text-base sm:text-lg mb-10">
              Free to get started. No credit card required.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <button
              onClick={() => openAuth('register')}
              className="group inline-flex items-center gap-2 px-7 h-12 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-500 transition-all duration-200 hover:shadow-lg hover:shadow-red-500/25 cursor-pointer"
            >
              Start free trial{' '}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </ScrollReveal>
        </div>
      </section>

      {/* Keyframe animations for thank-you state */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <style>{`
        @keyframes scale-in {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fade-in-up {
          0% { transform: translateY(8px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </PublicLayout>
  )
}
