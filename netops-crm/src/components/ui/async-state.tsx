'use client'

import { Loader2 } from 'lucide-react'
import { type AsyncStatus } from '@/types/async'
import { cn } from '@/lib/utils'

/**
 * Props para el componente AsyncStateDisplay
 */
interface AsyncStateDisplayProps {
  /** Estado actual de la operación */
  status: AsyncStatus
  /** Contenido a mostrar cuando está cargando */
  isLoading?: React.ReactNode
  /** Contenido a mostrar cuando hay error */
  isError?: React.ReactNode
  /** Contenido a mostrar cuando está idle/vacío */
  isEmpty?: React.ReactNode
  /** Contenido a mostrar cuando tiene éxito */
  isSuccess?: React.ReactNode
  /** Fallback personalizado para cuando está cargando */
  loadingFallback?: React.ReactNode
  /** Clases CSS adicionales */
  className?: string
}

/**
 * Spinner por defecto para estados de carga
 */
function DefaultSpinner({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center p-4", className)}>
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  )
}

/**
 * Componente para mostrar estados de carga de forma consistente
 * 
 * Permite renderizar diferentes contenidos según el estado de la operación async
 * 
 * @example
 * ```tsx
 * <AsyncStateDisplay
 *   status={state.status}
 *   isLoading={<Skeleton className="h-32" />}
 *   isError={<ErrorMessage error={state.error} />}
 *   isSuccess={<DataList data={state.data} />}
 * />
 * ```
 * 
 * @example Con loadingFallback
 * ```tsx
 * <AsyncStateDisplay
 *   status={status}
 *   loadingFallback={<CustomLoader />}
 *   isSuccess={<Content />}
 * />
 * ```
 */
export function AsyncStateDisplay({
  status,
  isLoading,
  isError,
  isEmpty,
  isSuccess,
  loadingFallback,
  className,
}: AsyncStateDisplayProps) {
  if (status === 'loading') {
    return (
      <div className={cn("", className)}>
        {loadingFallback || isLoading || <DefaultSpinner />}
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className={cn("", className)}>
        {isError}
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className={cn("", className)}>
        {isSuccess}
      </div>
    )
  }

  // idle state
  return (
    <div className={cn("", className)}>
      {isEmpty || loadingFallback}
    </div>
  )
}

/**
 * Props para el componente AsyncStateSwitch
 */
interface AsyncStateSwitchProps {
  /** Estado actual de la operación */
  status: AsyncStatus
  /** Función que retorna el contenido según el estado */
  children: (status: AsyncStatus) => React.ReactNode
  /** Fallback para cuando está cargando */
  loadingFallback?: React.ReactNode
  /** Clases CSS adicionales */
  className?: string
}

/**
 * Componente alternativo que usa render props para mayor flexibilidad
 * 
 * @example
 * ```tsx
 * <AsyncStateSwitch status={state.status}>
 *   {(status) => {
 *     switch (status) {
 *       case 'loading': return <Skeleton />
 *       case 'error': return <Error error={state.error} />
 *       case 'success': return <Data data={state.data} />
 *       default: return <Empty />
 *     }
 *   }}
 * </AsyncStateSwitch>
 * ```
 */
export function AsyncStateSwitch({
  status,
  children,
  loadingFallback,
  className,
}: AsyncStateSwitchProps) {
  if (status === 'loading' && loadingFallback) {
    return (
      <div className={cn("", className)}>
        {loadingFallback}
      </div>
    )
  }

  return (
    <div className={cn("", className)}>
      {children(status)}
    </div>
  )
}

/**
 * Tipo de variant para el componente ErrorDisplay
 */
type ErrorDisplayVariant = 'default' | 'card' | 'inline'

/**
 * Props para ErrorDisplay
 */
interface ErrorDisplayProps {
  /** Error a mostrar */
  error: Error | null
  /** Mensaje personalizado (sobrescribe el mensaje del error) */
  message?: string
  /** Variant del componente */
  variant?: ErrorDisplayVariant
  /** Callback para reintentar */
  onRetry?: () => void
  /** Clases CSS adicionales */
  className?: string
}

/**
 * Componente para mostrar errores de forma consistente
 * 
 * @example Variante default
 * ```tsx
 * <ErrorDisplay error={error} />
 * ```
 * 
 * @example Variante card con retry
 * ```tsx
 * <ErrorDisplay 
 *   error={error} 
 *   variant="card"
 *   onRetry={() => refetch()}
 * />
 * ```
 */
export function ErrorDisplay({
  error,
  message,
  variant = 'default',
  onRetry,
  className,
}: ErrorDisplayProps) {
  const displayMessage = message || error?.message || 'Ha ocurrido un error'

  if (variant === 'inline') {
    return (
      <p className={cn("text-sm text-destructive", className)}>
        {displayMessage}
      </p>
    )
  }

  if (variant === 'card') {
    return (
      <div className={cn(
        "rounded-lg border border-destructive/50 bg-destructive/10 p-4",
        className
      )}>
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <p className="text-sm font-medium text-destructive">
              {displayMessage}
            </p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="mt-2 text-sm text-destructive underline hover:text-destructive/80"
              >
                Reintentar
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // default variant
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-8 text-center",
      className
    )}>
      <div className="rounded-full bg-destructive/10 p-3 mb-4">
        <Loader2 className="h-6 w-6 text-destructive" />
      </div>
      <p className="text-sm text-muted-foreground">
        {displayMessage}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 text-sm font-medium text-primary hover:underline"
        >
          Reintentar
        </button>
      )}
    </div>
  )
}

/**
 * Props para EmptyDisplay
 */
interface EmptyDisplayProps {
  /** Mensaje a mostrar */
  message?: string
  /** Icono personalizado */
  icon?: React.ReactNode
  /** Acción opcional */
  action?: React.ReactNode
  /** Clases CSS adicionales */
  className?: string
}

/**
 * Componente para mostrar estados vacíos de forma consistente
 * 
 * @example
 * ```tsx
 * <EmptyDisplay 
 *   message="No se encontraron resultados"
 *   action={<Button onClick={clearFilters}>Limpiar filtros</Button>}
 * />
 * ```
 */
export function EmptyDisplay({
  message = 'No hay datos disponibles',
  icon,
  action,
  className,
}: EmptyDisplayProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-8 text-center",
      className
    )}>
      {icon && <div className="mb-4">{icon}</div>}
      <p className="text-sm text-muted-foreground">
        {message}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
