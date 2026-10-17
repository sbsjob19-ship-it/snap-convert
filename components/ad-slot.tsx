import { cn } from '@/lib/utils'

const SIZES = {
  leaderboard: { width: 728, height: 90, className: 'h-[90px] w-full max-w-[728px]' },
  rectangle: { width: 300, height: 250, className: 'h-[250px] w-full max-w-[300px]' },
} as const

export function AdSlot({ size, className }: { size: keyof typeof SIZES; className?: string }) {
  const s = SIZES[size]
  return (
    <aside
      aria-label="Advertisement"
      className={cn(
        'mx-auto flex flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border bg-muted/30 text-muted-foreground',
        s.className,
        className,
      )}
    >
      <span className="text-[11px] font-medium uppercase tracking-[0.18em]">Advertisement</span>
      <span className="font-mono text-[10px] opacity-60">
        {s.width}
        {' × '}
        {s.height}
      </span>
    </aside>
  )
}
