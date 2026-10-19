import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'
import Script from 'next/script'
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' })

export const metadata: Metadata = {
  title: 'SnapConvert — Instant & Private Online File Converter',
  description:
    'Convert PNG, JPG, WebP, and SVG images or extract PDF pages instantly. All conversions run privately in your browser.',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
  verification: {
    google: '_h3KBmPBxEvj2ldMFg4OLxWKGhJLqCLND8ttmR571n8',
  },
  other: {
    monetag: 'fd65a67ff2c590c249599fa4560ba290',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0b0d12' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${mono.variable}`}>
      <head>
       <Script src="https://quge5.com/88/tag.min.js" strategy="afterInteractive" />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster richColors position="bottom-right" />
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
        <Script src="https://bauval.org/14/2cfce3a7dcb3d96d99fd46b7e91f90a2" strategy="lazyOnload" />
      </body>
    </html>
  )
}
