import { useRef, useState } from 'react'
import { Upload, X, FileText, ImageIcon } from 'lucide-react'
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

  const maxKb = maxSizeKb ?? (accept === 'image' ? IMAGE_MAX_KB : PDF_MAX_KB)

  function handleFile(file: File) {
    setError(undefined)
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
    if (file) handleFile(file)
    e.target.value = ''
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const hasValue = Boolean(value)
  const isImage = accept === 'image'

  return (
    <div className={cn('space-y-2', className)}>
      {hasValue ? (
        <div className="relative inline-block">
          {isImage ? (
            <img
              src={value}
              alt="Aperçu"
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
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          disabled={disabled}
          className={cn(
            'flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors',
            isDragging
              ? 'border-primary-container bg-primary-container/10'
              : 'border-outline hover:border-primary-container hover:bg-primary-container/5',
            disabled && 'cursor-not-allowed opacity-50',
          )}
        >
          {isImage ? (
            <ImageIcon className="h-8 w-8 text-on-surface-variant/50" />
          ) : (
            <Upload className="h-8 w-8 text-on-surface-variant/50" />
          )}
          <div>
            <p className="text-label-sm font-semibold text-on-surface">
              {isImage ? 'Cliquer ou glisser une image' : 'Cliquer ou glisser un PDF'}
            </p>
            <p className="text-xs text-on-surface-variant">
              {isImage ? `JPG, PNG, WebP — max ${maxKb} Ko` : `PDF — max ${maxKb / 1024} Mo`}
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
        disabled={disabled}
      />
    </div>
  )
}
