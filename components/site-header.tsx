import { Zap } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Zap className="size-4" aria-hidden="true" />
          </span>
          SnapConvert
        </a>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-muted-foreground sm:inline">100% private · runs in your browser</span>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
