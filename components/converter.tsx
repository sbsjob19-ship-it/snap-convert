'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, CheckCircle2, Download, FileImage, FileText, Loader2, RotateCcw, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropZone } from '@/components/drop-zone'
import { AdSlot } from '@/components/ad-slot'
import {
  MAX_FILE_BYTES,
  TARGET_LABELS,
  convertFile,
  detectKind,
  formatBytes,
  revokeResult,
  targetsFor,
  type ConversionResult,
  type SourceKind,
  type TargetFormat,
} from '@/lib/convert'

type Status = 'idle' | 'converting' | 'done' | 'error'

interface Selected {
  file: File
  kind: SourceKind
  previewUrl: string | null
}

export function Converter() {
  const [selected, setSelected] = useState<Selected | null>(null)
  const [target, setTarget] = useState<TargetFormat | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [progress, setProgress] = useState(0)
  const [stage, setStage] = useState('')
  const [result, setResult] = useState<ConversionResult | null>(null)

  useEffect(() => {
    return () => {
      if (selected?.previewUrl) URL.revokeObjectURL(selected.previewUrl)
    }
  }, [selected])

  useEffect(() => {
    return () => {
      if (result) revokeResult(result)
    }
  }, [result])

  const handleFile = (file: File) => {
    const kind = detectKind(file)
    if (!kind) {
      toast.error('Unsupported file type', { description: 'Please upload a PNG, JPG, WebP, SVG, or PDF.' })
      return
    }
    if (file.size > MAX_FILE_BYTES) {
      toast.error('File too large', { description: 'Maximum file size is 50 MB.' })
      return
    }
    setSelected({ file, kind, previewUrl: kind === 'pdf' ? null : URL.createObjectURL(file) })
    setTarget(targetsFor(kind)[0])
    setStatus('idle')
    setProgress(0)
    setResult(null)
  }

  const reset = () => {
    setSelected(null)
    setTarget(null)
    setStatus('idle')
    setProgress(0)
    setResult(null)
  }

  const start = async () => {
    if (!selected || !target) return
    setStatus('converting')
    setResult(null)
    setProgress(0)
    try {
      const res = await convertFile(selected.file, selected.kind, target, (value, label) => {
        setProgress(value)
        setStage(label)
      })
      setResult(res)
      setStatus('done')
    } catch (err) {
      setStatus('error')
      toast.error('Conversion failed', {
        description: err instanceof Error ? err.message : 'Something went wrong.',
      })
    }
  }

  if (!selected) {
    return <DropZone onFile={handleFile} />
  }

  const options = targetsFor(selected.kind)
  const items = Object.fromEntries(options.map((o) => [o, TARGET_LABELS[o]]))
  const converting = status === 'converting'
  const SourceIcon = selected.kind === 'pdf' ? FileText : FileImage

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <SourceIcon className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <CardTitle className="truncate text-base">{selected.file.name}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Badge variant="secondary" className="font-mono uppercase">
                  {selected.kind}
                </Badge>
                {formatBytes(selected.file.size)}
              </CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={reset} disabled={converting} aria-label="Remove file">
            <X className="size-4" />
          </Button>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex flex-1 flex-col gap-1.5">
              <label htmlFor="target-format" className="text-sm font-medium">
                Target format
              </label>
              <Select
                items={items}
                value={target}
                onValueChange={(v) => {
                  setTarget(v as TargetFormat)
                  setStatus('idle')
                  setResult(null)
                  setProgress(0)
                }}
                disabled={converting}
              >
                <SelectTrigger id="target-format" className="h-10 w-full">
                  <SelectValue placeholder="Choose a format" />
                </SelectTrigger>
                <SelectContent>
                  {options.map((o) => (
                    <SelectItem key={o} value={o}>
                      {TARGET_LABELS[o]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button size="lg" className="h-10 px-5" onClick={start} disabled={converting || !target}>
              {converting ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <ArrowRight className="size-4" aria-hidden="true" />
              )}
              {converting ? 'Converting' : status === 'done' ? 'Convert again' : 'Convert'}
            </Button>
          </div>

          {status !== 'idle' && (
            <div className="flex flex-col gap-2" aria-live="polite">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {status === 'error' ? 'Conversion failed' : stage}
                </span>
                <span className="font-mono tabular-nums">{progress}%</span>
              </div>
              <Progress value={progress} aria-label="Conversion progress" className="[&_[data-slot=progress-track]]:h-2" />
            </div>
          )}

          <PreviewPanel selected={selected} result={result} status={status} />

          {status === 'done' && result && (
            <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-primary/30 bg-primary/5 p-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="size-5 shrink-0 text-primary" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium">{result.fileName}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatBytes(result.blob.size)}
                    {result.pageCount && result.pageCount > 1 ? ` · ${result.pageCount} pages in ZIP` : ''}
                  </p>
                </div>
              </div>
              <div className="flex w-full gap-2 sm:w-auto">
                <Button variant="outline" size="lg" className="h-10 flex-1 sm:flex-none" onClick={reset}>
                  <RotateCcw className="size-4" aria-hidden="true" />
                  New file
                </Button>
                <Button
                  size="lg"
                  className="h-10 flex-1 px-5 sm:flex-none"
                  nativeButton={false}
                  render={<a href={result.downloadUrl} download={result.fileName} />}
                >
                  <Download className="size-4" aria-hidden="true" />
                  Download
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-center lg:block">
        <AdSlot size="rectangle" className="lg:sticky lg:top-20" />
      </div>
    </div>
  )
}

function PreviewPanel({
  selected,
  result,
  status,
}: {
  selected: Selected
  result: ConversionResult | null
  status: Status
}) {
  const showResult = status === 'done' && result
  const images = showResult ? result.previews : selected.previewUrl ? [selected.previewUrl] : []

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium">{showResult ? 'Converted preview' : 'Original preview'}</p>
      <div className="flex min-h-48 items-center justify-center overflow-hidden rounded-xl border border-border bg-[repeating-conic-gradient(var(--muted)_0%_25%,transparent_0%_50%)] bg-[length:20px_20px] p-4">
        {images.length === 0 ? (
          <div className="flex flex-col items-center gap-2 text-center text-muted-foreground">
            <FileText className="size-10" aria-hidden="true" />
            <p className="text-sm">PDF pages will appear here after extraction</p>
          </div>
        ) : images.length === 1 ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={images[0]} alt={showResult ? 'Converted file preview' : 'Original file preview'} className="max-h-80 w-auto rounded-md object-contain shadow-sm" />
        ) : (
          <ul className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
            {images.map((src, i) => (
              <li key={src} className="flex flex-col items-center gap-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`Page ${i + 1}`} className="max-h-48 w-full rounded-md bg-white object-contain shadow-sm" />
                <span className="text-xs text-muted-foreground">Page {i + 1}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {showResult && result.pageCount && result.pageCount > 6 && (
        <p className="text-xs text-muted-foreground">Showing first 6 of {result.pageCount} pages.</p>
      )}
    </div>
  )
}
