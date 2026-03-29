import Link from 'next/link'

const FOOTER_LINKS = {
  Platform: [
    { href: '/#features', label: 'Platform Features' },
    { href: '/command-studio', label: 'Command Studio' },
    { href: '/#how-it-works', label: 'How It Works' },
    { href: '/contact', label: 'Book a Demo' },
  ],
  Services: [
    { href: '/solutions/fire-rescue', label: 'Fire & Rescue' },
    { href: '/solutions/police', label: 'Police' },
    { href: '/solutions/ambulance', label: 'Ambulance' },
    { href: '/solutions/armed-forces', label: 'Armed Forces' },
    { href: '/solutions/coastguard', label: 'HM Coastguard' },
    { href: '/solutions/search-rescue', label: 'Search & Rescue' },
    { href: '/solutions/prison-probation', label: 'Prison & Probation' },
    { href: '/solutions/local-authority', label: 'Local Authority' },
    { href: '/solutions/civil-contingencies', label: 'Civil Contingencies' },
    { href: '/solutions/nhs-emergency', label: 'NHS Emergency' },
    { href: '/solutions/voluntary-sector', label: 'Voluntary Sector' },
  ],
  Company: [
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/help', label: 'Help Centre' },
    { href: '/join', label: 'Join a Session' },
  ],
  Legal: [
    { href: '/terms', label: 'Terms' },
    { href: '/privacy', label: 'Privacy' },
    { href: '/cookies', label: 'Cookies' },
    { href: '/accessibility', label: 'Accessibility' },
    { href: '/dpa', label: 'DPA' },
  ],
}

export function PublicFooter() {
  return (
    <footer className="border-t border-border">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-semibold text-sm text-foreground mb-3">
              <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-3 h-3 text-primary-foreground" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              Command 360
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-[200px]">
              Interactive training platform for UK emergency services. Based in Birmingham, West Midlands.
            </p>
          </div>

          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <p className="text-xs font-medium text-foreground mb-3">{title}</p>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/[0.06]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-red-600/80 rounded-md flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              </div>
              <span className="text-[11px] text-muted-foreground/60">&copy; 2026 Command 360. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-muted-foreground/30 font-mono tracking-wide">command360.co.uk</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
