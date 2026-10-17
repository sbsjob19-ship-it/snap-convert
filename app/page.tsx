import { Lock, Gauge, Layers, Zap } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { AdSlot } from '@/components/ad-slot'
import { Converter } from '@/components/converter'

const FEATURES = [
  { icon: Lock, title: 'Private by design', text: 'Files never leave your device. Everything is processed locally in your browser.' },
  { icon: Gauge, title: 'Instant results', text: 'No uploads, no queues. Conversions finish in seconds, even for large files.' },
  { icon: Layers, title: 'Multi-page PDFs', text: 'Extract every page of a PDF as high-resolution PNG or JPG, bundled in a ZIP.' },
]

export default function Page() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-4 py-8 sm:px-6">
        <section aria-labelledby="hero-title" className="flex flex-col items-center gap-4 pt-4 text-center sm:pt-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-sm font-medium">
            <Zap className="size-3.5 text-primary" aria-hidden="true" />
            SnapConvert
          </span>
          <h1
            id="hero-title"
            className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl"
          >
            Instant &amp; Private <span className="text-primary">Online File Converter</span>
          </h1>
          <p className="max-w-xl text-pretty text-muted-foreground sm:text-lg">
            Turn PNG, JPG, WebP, and SVG into the format you need, or extract pages from any PDF. Fast, free, and fully
            private.
          </p>
        </section>

        <AdSlot size="leaderboard" />

        <section aria-label="File converter">
          <Converter />
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex flex-col gap-2 rounded-xl border border-border p-5">
              <Icon className="size-5 text-primary" aria-hidden="true" />
              <h2 className="font-medium">{title}</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-8 sm:px-6">
          <AdSlot size="leaderboard" />
          <p className="text-sm text-muted-foreground">
            {'© '}
            {new Date().getFullYear()} SnapConvert. All conversions happen on your device.
          </p>
        </div>
      </footer>
    </div>
  )
}
