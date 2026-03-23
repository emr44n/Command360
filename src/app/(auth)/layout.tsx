import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left brand panel — always-dark, matching public hero sections */}
      <div className="hidden lg:flex lg:w-[45%] bg-[#07070a] relative flex-col justify-between p-12 text-white overflow-hidden">
        {/* Radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(220,38,38,0.15),transparent)]" />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />

        <Link href="/" className="relative flex items-center gap-2.5 font-semibold text-lg">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          Command 360
        </Link>
        <div className="relative space-y-5">
          <h2 className="text-3xl font-bold leading-tight tracking-tight">
            Interactive training and briefings for{' '}
            <span className="bg-gradient-to-r from-red-400 via-red-500 to-orange-500 bg-clip-text" style={{ WebkitTextFillColor: 'transparent' }}>emergency services</span>.
          </h2>
          <p className="text-white/45 text-lg leading-relaxed">
            Live polls, quizzes, word clouds, Q&amp;A and AI insights — purpose-built for Fire, Police, Ambulance and Armed Forces teams.
          </p>
        </div>
        <p className="relative text-white/25 text-sm">&copy; 2026 Command 360</p>
      </div>

      {/* Right form panel — dark with subtle grid */}
      <div className="flex-1 flex flex-col bg-[#07070a] dark:bg-[#07070a] relative overflow-hidden">
        {/* Subtle red radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(220,38,38,0.06),transparent)] pointer-events-none" />
        {/* Fine grid texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(220,38,38,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,0.3) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* Mobile header */}
        <header className="lg:hidden p-5 border-b border-white/[0.06] relative z-10">
          <Link href="/" className="flex items-center gap-2 font-semibold text-white w-fit">
            <div className="w-7 h-7 bg-red-600 rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            Command 360
          </Link>
        </header>

        <main className="flex-1 flex items-center justify-center p-6 relative z-10">
          <div className="w-full max-w-sm">{children}</div>
        </main>
      </div>
    </div>
  )
}
