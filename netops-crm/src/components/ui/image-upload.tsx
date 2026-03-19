'use client'

import Image from 'next/image'
import { Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  label: string
  value: string | null
  onUpload: () => void
  onRemove: () => void
  placeholder?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SIZES = {
  sm: { container: 'h-16 w-16', icon: 'h-6 w-6' },
  md: { container: 'h-20 w-20', icon: 'h-8 w-8' },
  lg: { container: 'h-24 w-24', icon: 'h-10 w-10' },
}

export function ImageUpload({
  label,
  value,
  onUpload,
  onRemove,
  placeholder,
  size = 'md',
  className,
}: ImageUploadProps) {
  const sizeClasses = SIZES[size]

  return (
    <div className={cn('flex items-center gap-4', className)}>
      {value ? (
        <div className="relative">
          <div
            className={cn(
              'rounded-lg border bg-background flex items-center justify-center overflow-hidden',
              sizeClasses.container
            )}
          >
            <Image
              src={value}
              alt={label}
              fill
              className="object-cover"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
            onClick={onRemove}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div
          className={cn(
            'rounded-lg border border-dashed bg-muted/30 flex items-center justify-center',
            sizeClasses.container
          )}
        >
          <Upload className={cn('text-muted-foreground', sizeClasses.icon)} />
        </div>
      )}
      <Button variant="outline" size="sm" onClick={onUpload}>
        {value ? 'Cambiar' : (placeholder || 'Subir')}
      </Button>
    </div>
  )
}
