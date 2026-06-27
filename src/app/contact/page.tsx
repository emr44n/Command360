'use client'

import { useState, useRef } from 'react'
import { SiteShell } from '@/components/site/SiteShell'
import { PageHero, Eyebrow, DarkSection, Container } from '@/components/site/primitives'
import {
  Mail,
  MapPin,
  Phone,
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
/*  Styles for form elements (v5 — rigid, straight corners)            */
/* ------------------------------------------------------------------ */

const inputBase =
  'w-full border border-white/15 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-colors duration-200 focus:border-[#C9241A]'

const selectBase =
  'w-full border border-white/15 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition-colors duration-200 focus:border-[#C9241A] appearance-none cursor-pointer'

const labelBase = 'block ff-mono text-[12px] font-semibold uppercase tracking-[0.12em] text-[#7c828a] mb-2.5'

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

const CONTACT_CARDS = [
  { icon: Mail, title: 'Email', desc: 'hello@command360.co.uk' },
  { icon: Phone, title: 'Phone', desc: '+44 121 000 0000' },
  { icon: MapPin, title: 'Location', desc: 'Birmingham, West Midlands, UK' },
]

export default function ContactPage() {
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
    return errors[field] ? 'border-[#C9241A]' : ''
  }

  return (
    <SiteShell>
      <PageHero
        eyebrow={<Eyebrow>Contact Us</Eyebrow>}
        title={<>Let&apos;s <span className="text-[#C9241A]">Talk</span></>}
        lede="Questions, feedback, or partnership enquiries — we'd love to hear from you."
      />

      {/* ── Form + Map two-column section ── */}
      <DarkSection>
        <div className="absolute top-[-140px] right-[-100px] w-[780px] h-[560px] pointer-events-none" aria-hidden="true" style={{ background: 'radial-gradient(55% 65% at 70% 30%,rgba(201,36,26,.14),transparent 76%)', filter: 'blur(46px)' }} />
        <div className="absolute inset-0 v5-grain opacity-[0.1] mix-blend-overlay pointer-events-none" aria-hidden="true" />
        <Container className="relative">
          <div className="max-w-[620px] mb-9">
            <Eyebrow n="01">Send a Message</Eyebrow>
            <h2 className="ff-display font-extrabold text-[clamp(28px,3.6vw,44px)] leading-[1.02] tracking-[-0.02em] mt-4 text-white">We&apos;re here to help</h2>
          </div>
          <div className="h-0.5 bg-white/20 origin-left mb-10" data-rule />

          <div className="grid lg:grid-cols-[1fr_420px] gap-8 items-start">
            {/* ── Left: Form ── */}
            <div data-reveal className="border border-white/14 bg-white/[0.02] p-6 md:p-10">
              {sent ? (
                /* ── Thank-you state ── */
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 flex items-center justify-center mb-6 bg-[#2E9E63]/12 border border-[#2E9E63]/30">
                    <CheckCircle2 className="w-8 h-8 text-[#2E9E63]" />
                  </div>
                  <h3 className="ff-display font-bold text-2xl text-white mb-2">Thank you!</h3>
                  <p className="text-white/45 max-w-sm leading-relaxed">
                    Your message has been received. We&apos;ll get back to you within 24 hours on business days.
                  </p>
                  <button
                    onClick={() => {
                      setSent(false)
                      setErrors({})
                    }}
                    className="mt-8 ff-mono text-[12px] font-semibold uppercase tracking-[0.12em] text-[#C9241A] hover:text-[#a91d14] transition-colors cursor-pointer"
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
                        Name <span className="text-[#C9241A]">*</span>
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
                        <p className="mt-1.5 text-xs text-[#C9241A]">Please enter your name</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="contact-email" className={labelBase}>
                        Email <span className="text-[#C9241A]">*</span>
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
                        <p className="mt-1.5 text-xs text-[#C9241A]">Please enter a valid email</p>
                      )}
                    </div>
                  </div>

                  {/* Organisation dropdown */}
                  <div>
                    <label htmlFor="contact-organisation" className={labelBase}>
                      Organisation <span className="text-[#C9241A]">*</span>
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
                      <p className="mt-1.5 text-xs text-[#C9241A]">Please select your organisation</p>
                    )}
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="contact-subject" className={labelBase}>
                      Subject <span className="text-[#C9241A]">*</span>
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
                      <p className="mt-1.5 text-xs text-[#C9241A]">Please choose a subject</p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="contact-message" className={labelBase}>
                      Message <span className="text-[#C9241A]">*</span>
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
                      <p className="mt-1.5 text-xs text-[#C9241A]">Please enter a message</p>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={sending}
                    className="v5-glow group inline-flex items-center gap-2.5 px-7 h-12 ff-mono text-[13px] font-semibold uppercase tracking-[0.05em] bg-[#C9241A] text-white hover:bg-[#a91d14] transition-colors duration-200 disabled:opacity-60 disabled:pointer-events-none cursor-pointer"
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

            {/* ── Right: Map ── */}
            <div data-reveal className="border border-white/14 bg-white/[0.02] overflow-hidden sticky top-28">
              <iframe
                title="Command 360 HQ — Birmingham, UK"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-1.9204%2C52.4662%2C-1.8604%2C52.5062&layer=mapnik&marker=52.4862%2C-1.8904"
                className="w-full h-[320px] lg:h-[380px] border-0 grayscale-[0.3] contrast-[1.1]"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="px-5 py-4 border-t border-white/14">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 bg-[#C9241A]/12 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-[#C9241A]" />
                  </div>
                  <div>
                    <p className="ff-display text-sm font-bold text-white">Command 360 HQ</p>
                    <p className="text-xs text-white/40">Birmingham City Centre, UK</p>
                  </div>
                </div>
                <a
                  href="https://www.openstreetmap.org/?mlat=52.4862&mlon=-1.8904#map=14/52.4862/-1.8904"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 ff-mono text-[11px] uppercase tracking-[0.1em] text-white/40 hover:text-white/60 transition-colors"
                >
                  View larger map <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </Container>
      </DarkSection>

      {/* ── How to reach us ── */}
      <DarkSection>
        <Container className="relative">
          <div className="max-w-[620px] mb-9">
            <Eyebrow n="02">Reach Out</Eyebrow>
            <h2 className="ff-display font-extrabold text-[clamp(28px,3.6vw,44px)] leading-[1.02] tracking-[-0.02em] mt-4 text-white">How to reach us</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-white/14">
            {CONTACT_CARDS.map((item) => (
              <div key={item.title} data-reveal className="group v5-pop cursor-default relative p-[28px_26px] border-r border-b border-white/14">
                <div className="w-[42px] h-[42px] flex items-center justify-center mb-5 bg-[#C9241A]/12">
                  <item.icon className="w-5 h-5 text-[#C9241A]" />
                </div>
                <h3 className="ff-display font-bold text-[18px] tracking-[-0.01em] mb-2 text-white">{item.title}</h3>
                <p className="text-[14px] text-[#9aa0a8] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </DarkSection>
    </SiteShell>
  )
}
