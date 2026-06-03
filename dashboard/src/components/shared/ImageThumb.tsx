import { ImageOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageThumbProps {
  src?: string
  alt?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const SIZE_MAP = {
  sm: 'h-10 w-10',
  md: 'h-16 w-16',
  lg: 'h-24 w-24',
}

export function ImageThumb({ src, alt = '', className, size = 'md' }: ImageThumbProps) {
  if (!src) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-lg bg-surface-container text-on-surface-variant/40',
          SIZE_MAP[size],
          className,
        )}
      >
        <ImageOff className="h-4 w-4" />
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={alt}
      className={cn('rounded-lg object-cover', SIZE_MAP[size], className)}
    />
  )
}
