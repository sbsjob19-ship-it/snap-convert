export type SourceKind = 'png' | 'jpg' | 'webp' | 'svg' | 'pdf'
export type TargetFormat = 'png' | 'jpg' | 'webp' | 'pdf-png' | 'pdf-jpg'

export const ACCEPTED_MIME: Record<string, SourceKind> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
  'application/pdf': 'pdf',
}

export const ACCEPT_ATTR = '.png,.jpg,.jpeg,.webp,.svg,.pdf,image/png,image/jpeg,image/webp,image/svg+xml,application/pdf'

export const MAX_FILE_BYTES = 50 * 1024 * 1024

export const TARGET_LABELS: Record<TargetFormat, string> = {
  png: 'Convert to PNG',
  jpg: 'Convert to JPG',
  webp: 'Convert to WebP',
  'pdf-png': 'Extract PDF pages as PNG',
  'pdf-jpg': 'Extract PDF pages as JPG',
}

const MIME_FOR: Record<'png' | 'jpg' | 'webp', string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  webp: 'image/webp',
}

export function detectKind(file: File): SourceKind | null {
  if (ACCEPTED_MIME[file.type]) return ACCEPTED_MIME[file.type]
  const ext = file.name.split('.').pop()?.toLowerCase()
  if (ext === 'jpeg' || ext === 'jpg') return 'jpg'
  if (ext === 'png' || ext === 'webp' || ext === 'svg' || ext === 'pdf') return ext
  return null
}

export function targetsFor(kind: SourceKind): TargetFormat[] {
  if (kind === 'pdf') return ['pdf-png', 'pdf-jpg']
  const all: TargetFormat[] = ['png', 'jpg', 'webp']
  return all.filter((t) => t !== kind)
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export function baseName(name: string) {
  const i = name.lastIndexOf('.')
  return i > 0 ? name.slice(0, i) : name
}

export interface ConversionResult {
  blob: Blob
  fileName: string
  downloadUrl: string
  previews: string[]
  pageCount?: number
}

export function revokeResult(result: ConversionResult) {
  URL.revokeObjectURL(result.downloadUrl)
  result.previews.forEach((u) => URL.revokeObjectURL(u))
}

type ProgressFn = (value: number, label: string) => void

function canvasToBlob(canvas: HTMLCanvasElement, mime: string, quality = 0.92) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        // Browsers silently fall back to PNG when they cannot encode the requested type.
        if (!blob || blob.type !== mime) {
          reject(new Error(`Your browser cannot encode ${mime.split('/')[1].toUpperCase()} images.`))
          return
        }
        resolve(blob)
      },
      mime,
      quality,
    )
  })
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Could not read this image.'))
    img.src = src
  })
}

const tick = () => new Promise((r) => setTimeout(r, 120))

async function convertImage(
  file: File,
  kind: SourceKind,
  target: 'png' | 'jpg' | 'webp',
  onProgress: ProgressFn,
): Promise<ConversionResult> {
  onProgress(10, 'Reading file')
  const url = URL.createObjectURL(file)
  try {
    const img = await loadImage(url)
    onProgress(40, 'Decoding image')
    await tick()

    let width = img.naturalWidth
    let height = img.naturalHeight
    if (kind === 'svg') {
      if (!width || !height) {
        width = 1024
        height = 1024
      }
      const scale = Math.min(2, 4096 / Math.max(width, height))
      width = Math.round(width * scale)
      height = Math.round(height * scale)
    }

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas is not supported in this browser.')
    if (target === 'jpg') {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, width, height)
    }
    ctx.drawImage(img, 0, 0, width, height)
    onProgress(70, `Encoding ${target.toUpperCase()}`)
    await tick()

    const blob = await canvasToBlob(canvas, MIME_FOR[target])
    onProgress(100, 'Done')
    return {
      blob,
      fileName: `${baseName(file.name)}.${target}`,
      downloadUrl: URL.createObjectURL(blob),
      previews: [URL.createObjectURL(blob)],
    }
  } finally {
    URL.revokeObjectURL(url)
  }
}

async function extractPdf(file: File, target: 'png' | 'jpg', onProgress: ProgressFn): Promise<ConversionResult> {
  onProgress(5, 'Loading PDF engine')
  const pdfjs = await import('pdfjs-dist')
  pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

  onProgress(12, 'Parsing document')
  const data = new Uint8Array(await file.arrayBuffer())
  const loadingTask = pdfjs.getDocument({ data })
  const doc = await loadingTask.promise
  const total = doc.numPages
  const mime = MIME_FOR[target]
  const pages: Blob[] = []

  try {
    for (let i = 1; i <= total; i++) {
      const page = await doc.getPage(i)
      const viewport = page.getViewport({ scale: 2 })
      const canvas = document.createElement('canvas')
      canvas.width = Math.floor(viewport.width)
      canvas.height = Math.floor(viewport.height)
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Canvas is not supported in this browser.')
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      await page.render({ canvas, canvasContext: ctx, viewport }).promise
      pages.push(await canvasToBlob(canvas, mime))
      page.cleanup()
      onProgress(12 + Math.round((i / total) * 78), `Rendering page ${i} of ${total}`)
    }
  } finally {
    await loadingTask.destroy()
  }

  const name = baseName(file.name)
  const previews = pages.slice(0, 6).map((b) => URL.createObjectURL(b))

  if (pages.length === 1) {
    onProgress(100, 'Done')
    return {
      blob: pages[0],
      fileName: `${name}.${target}`,
      downloadUrl: URL.createObjectURL(pages[0]),
      previews,
      pageCount: 1,
    }
  }

  onProgress(94, 'Packaging ZIP archive')
  const { default: JSZip } = await import('jszip')
  const zip = new JSZip()
  const pad = String(total).length
  pages.forEach((b, idx) => zip.file(`${name}-page-${String(idx + 1).padStart(pad, '0')}.${target}`, b))
  const blob = await zip.generateAsync({ type: 'blob' })
  onProgress(100, 'Done')
  return { blob, fileName: `${name}-pages.zip`, downloadUrl: URL.createObjectURL(blob), previews, pageCount: total }
}

export function convertFile(file: File, kind: SourceKind, target: TargetFormat, onProgress: ProgressFn) {
  if (target === 'pdf-png' || target === 'pdf-jpg') {
    return extractPdf(file, target === 'pdf-png' ? 'png' : 'jpg', onProgress)
  }
  return convertImage(file, kind, target, onProgress)
}
