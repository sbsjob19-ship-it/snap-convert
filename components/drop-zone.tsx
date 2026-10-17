'use client'

import { useRef, useState, type DragEvent } from 'react'
import { UploadCloud } from 'lucide-react'
import { ACCEPT_ATTR } from '@/lib/convert'
import { cn } from '@/lib/utils'

const FORMATS = ['PNG', 'JPG', 'WebP', 'SVG', 'PDF']

export function DropZone({ onFile, compact = false }: { onFile: (file: File) => void; compact?: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleDrop = (e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) onFile(file)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={cn(
          'group flex w-full flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed bg-card text-center transition-all outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
          compact ? 'px-6 py-8' : 'px-6 py-16 sm:py-20',
          dragging
            ? 'scale-[1.01] border-primary bg-primary/5'
            : 'border-border hover:border-primary/60 hover:bg-accent/40',
        )}
      >
        <span
          className={cn(
            'flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform',
            dragging ? 'scale-110' : 'group-hover:-translate-y-0.5',
          )}
        >
          <UploadCloud className="size-7" aria-hidden="true" />
        </span>
        <span className="flex flex-col gap-1">
          <span className="text-lg font-semibold text-balance">
            {dragging ? 'Drop to upload' : 'Drag & drop a file here'}
          </span>
          <span className="text-sm text-muted-foreground">
            or <span className="font-medium text-primary underline-offset-4 group-hover:underline">browse your device</span>{' '}
            · up to 50 MB
          </span>
        </span>
        <span className="flex flex-wrap justify-center gap-1.5">
          {FORMATS.map((f) => (
            <span key={f} className="rounded-md border border-border bg-background px-2 py-0.5 font-mono text-xs text-muted-foreground">
              {f}
            </span>
          ))}
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_ATTR}
        className="sr-only"
        tabIndex={-1}
        aria-label="Upload file"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onFile(file)
          e.target.value = ''
        }}
      />
    </>
  )
}
