'use client'

import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

interface SaveMessageProps {
  type: 'success' | 'error' | 'loading'
  message?: string
  className?: string
}

const DEFAULT_MESSAGES = {
  success: 'Guardado correctamente',
  error: 'Error al guardar',
  loading: 'Guardando...',
}

export function SaveMessage({
  type,
  message,
  className,
}: SaveMessageProps) {
  if (type === 'loading') {
    return (
      <div className={`flex items-center gap-2 text-sm text-muted-foreground ${className || ''}`}>
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>{message || DEFAULT_MESSAGES.loading}</span>
      </div>
    )
  }

  const isSuccess = type === 'success'
  return (
    <div
      className={`flex items-center gap-2 text-sm ${isSuccess ? 'text-emerald-500' : 'text-red-500'
        } ${className || ''}`}
    >
      {isSuccess ? (
        <CheckCircle2 className="h-4 w-4" />
      ) : (
        <AlertCircle className="h-4 w-4" />
      )}
      <span>{message || DEFAULT_MESSAGES[type]}</span>
    </div>
  )
}
