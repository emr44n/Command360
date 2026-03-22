import type { Metadata } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://command360.co.uk'),
  title: {
    default: 'Command 360 — Interactive Training for Emergency Services',
    template: '%s | Command 360',
  },
  description:
    'Interactive training platform for emergency services. Live polls, quizzes, word clouds and AI insights — purpose-built for Fire, Police, Ambulance and Armed Forces teams.',
  keywords: [
    'interactive presentation',
    'live polling',
    'word cloud',
    'quiz maker',
    'audience engagement',
    'mentimeter alternative',
    'AI presentations',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'Command 360',
    title: 'Command 360 — AI-Powered Interactive Presentations',
    description:
      'Live polls, word clouds, quizzes and Q&A with real-time AI insights.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Command 360' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Command 360 — AI-Powered Interactive Presentations',
    description: 'Live polls, word clouds, quizzes and Q&A with real-time AI insights.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#141414" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var m=localStorage.getItem('theme');if(m==='dark'||(!m&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body className={`${inter.variable} ${geistMono.variable} antialiased overflow-x-hidden`}>
        <TooltipProvider>
          {children}
          <Toaster richColors position="top-right" />
        </TooltipProvider>
      </body>
    </html>
  )
}
