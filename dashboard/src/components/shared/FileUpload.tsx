import { useRef, useState } from 'react'
import { Upload, X, FileText, ImageIcon, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileUploadProps {
  accept: 'image' | 'pdf'
  maxSizeKb?: number
  value?: string
  onChange?: (dataUrl: string) => void
  onClear?: () => void
  className?: string
  disabled?: boolean
}

const IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp'
const PDF_ACCEPT = 'application/pdf'
const IMAGE_MAX_KB = 300
const PDF_MAX_KB = 10 * 1024
// Resize to fit within this box before encoding
const IMAGE_MAX_DIM = 1200
// WebP quality — 0.82 gives ~60-70% smaller than raw JPEG at similar visual quality
const IMAGE_QUALITY = 0.82

/**
 * Resize + encode to WebP (falls back to JPEG if browser lacks WebP canvas support).
 * Uses createObjectURL to avoid doubling memory with a FileReader data URL.
 */
async function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(objectUrl)

      let w = img.naturalWidth
      let h = img.naturalHeight

      if (w > IMAGE_MAX_DIM || h > IMAGE_MAX_DIM) {
        if (w >= h) {
          h = Math.round((h * IMAGE_MAX_DIM) / w)
          w = IMAGE_MAX_DIM
        } else {
          w = Math.round((w * IMAGE_MAX_DIM) / h)
          h = IMAGE_MAX_DIM
        }
      }

      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('canvas-ctx'))
        return
      }

      ctx.drawImage(img, 0, 0, w, h)

      const webp = canvas.toDataURL('image/webp', IMAGE_QUALITY)
      // Some older browsers silently ignore 'image/webp' and return a PNG.
      // If the result is not WebP, fall back to JPEG.
      resolve(
        webp.startsWith('data:image/webp')
          ? webp
          : canvas.toDataURL('image/jpeg', IMAGE_QUALITY),
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('img-load'))
    }

    img.src = objectUrl
  })
}

/** Returns the decoded byte size of a base64 data URL in KB. */
function dataUrlSizeKb(dataUrl: string): number {
  const base64 = dataUrl.slice(dataUrl.indexOf(',') + 1)
  return Math.ceil((base64.length * 3) / 4 / 1024)
}

export function FileUpload({
  accept,
  maxSizeKb,
  value,
  onChange,
  onClear,
  className,
  disabled,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string>()
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const maxKb = maxSizeKb ?? (accept === 'image' ? IMAGE_MAX_KB : PDF_MAX_KB)
  const isImage = accept === 'image'

  async function handleFile(file: File) {
    setError(undefined)

    if (isImage) {
      setIsProcessing(true)
      try {
        const compressed = await compressImage(file)
        const sizeKb = dataUrlSizeKb(compressed)
        if (sizeKb > maxKb) {
          setError(`Image trop volumineuse après compression (${sizeKb} Ko, max ${maxKb} Ko)`)
          return
        }
        onChange?.(compressed)
      } catch {
        setError('Impossible de traiter cette image')
      } finally {
        setIsProcessing(false)
      }
      return
    }

    // PDF — no compression, just size guard then pass through as data URL
    const sizeKb = file.size / 1024
    if (sizeKb > maxKb) {
      setError(`Fichier trop volumineux (max ${maxKb >= 1024 ? `${maxKb / 1024} Mo` : `${maxKb} Ko`})`)
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => onChange?.(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) void handleFile(file)
    e.target.value = ''
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) void handleFile(file)
  }

  const busy = disabled || isProcessing

  return (
    <div className={cn('space-y-2', className)}>
      {value ? (
        <div className="relative inline-block">
          {isImage ? (
            <img
              src={value}
              alt="Aperçu"
              loading="lazy"
              decoding="async"
              className="h-32 w-48 rounded-xl object-cover border border-outline"
            />
          ) : (
            <div className="flex items-center gap-3 rounded-xl border border-outline bg-surface-container px-4 py-3">
              <FileText className="h-5 w-5 shrink-0 text-on-surface-variant" />
              <span className="text-label-sm text-on-surface">Fichier PDF sélectionné</span>
            </div>
          )}
          {!disabled && (
            <button
              type="button"
              onClick={() => { onClear?.(); onChange?.('') }}
              className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-error text-white shadow-sm hover:bg-error/90"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => { if (!busy) inputRef.current?.click() }}
          onDragOver={(e) => { e.preventDefault(); if (!busy) setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          disabled={busy}
          className={cn(
            'flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors',
            isDragging
              ? 'border-primary-container bg-primary-container/10'
              : 'border-outline hover:border-primary-container hover:bg-primary-container/5',
            busy && 'cursor-not-allowed opacity-60',
          )}
        >
          {isProcessing ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          ) : isImage ? (
            <ImageIcon className="h-8 w-8 text-on-surface-variant/50" />
          ) : (
            <Upload className="h-8 w-8 text-on-surface-variant/50" />
          )}
          <div>
            <p className="text-label-sm font-semibold text-on-surface">
              {isProcessing
                ? 'Compression WebP en cours…'
                : isImage
                  ? 'Cliquer ou glisser une image'
                  : 'Cliquer ou glisser un PDF'}
            </p>
            <p className="text-xs text-on-surface-variant">
              {isImage
                ? `JPG · PNG · WebP — compression automatique WebP, max ${maxKb} Ko`
                : `PDF — max ${maxKb / 1024} Mo`}
            </p>
          </div>
        </button>
      )}
      {error && <p className="text-xs text-error">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept={isImage ? IMAGE_ACCEPT : PDF_ACCEPT}
        className="sr-only"
        onChange={handleInput}
        disabled={busy}
      />
    </div>
  )
}
