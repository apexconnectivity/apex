/**
 * Componentes helper para estructurar contenido dentro de modales
 * Proporciona componentes reutilizables para forms, secciones y acciones
 */

import * as React from "react"
import { cn } from "@/lib/utils"
import { ModalVariant, getModalVariantColor } from "@/constants/modales"
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  Info,
  AlertTriangle
} from "lucide-react"

// ============================================================================
// ModalField - Campo de formulario con Label
// ============================================================================

interface ModalFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Si el campo es requerido */
  required?: boolean
  /** Label del campo */
  label?: string
  /** Texto de ayuda debajo del campo */
  hint?: string
  /** Mensaje de error */
  error?: string
  /** Variant de color para el campo */
  variant?: ModalVariant
  /** Si el campo está deshabilitado */
  disabled?: boolean
}

/**
 * Componente para agrupar Label + Input/Select/etc con estilos consistentes
 */
export function ModalField({
  required = false,
  label,
  hint,
  error,
  variant = "default",
  disabled = false,
  className,
  children,
  ...props
}: ModalFieldProps) {
  const variantColors = getModalVariantColor(variant)

  return (
    <div className={cn("space-y-2", className)} {...props}>
      {label && (
        <label className={cn(
          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          error && "text-destructive"
        )}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<any>, {
            disabled,
            ...(error && { className: cn((child as React.ReactElement<any>).props.className, "border-destructive") })
          })
          : child
      )}
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  )
}

// ============================================================================
// ModalSection - Sección dentro del body
// ============================================================================

interface ModalSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Título de la sección */
  title?: string
  /** Descripción de la sección */
  description?: string
  /** Variant de color */
  variant?: ModalVariant
  /** Si muestra divisor superior */
  showDivider?: boolean
}

/**
 * Componente para crear secciones dentro del modal body
 */
export function ModalSection({
  title,
  description,
  variant = "default",
  showDivider = false,
  className,
  children,
  ...props
}: ModalSectionProps) {
  const variantColors = getModalVariantColor(variant)

  return (
    <div
      className={cn(
        "space-y-3",
        showDivider && "border-t border-border/50 pt-4",
        className
      )}
      {...props}
    >
      {title && (
        <div className="space-y-1">
          <h3 className={cn("text-sm font-semibold", variantColors.text)}>
            {title}
          </h3>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  )
}

// ============================================================================
// ModalActions - Grupo de botones de acción
// ============================================================================

interface ModalActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Layout de los botones */
  layout?: "stack" | "inline" | "inline-between"
  /** Variant de color para el grupo */
  variant?: ModalVariant
  /** Si muestra divisor superior */
  showDivider?: boolean
}

const ACTIONS_LAYOUTS: Record<NonNullable<ModalActionsProps["layout"]>, string> = {
  stack: "flex flex-col-reverse gap-2",
  inline: "flex flex-row gap-2",
  "inline-between": "flex flex-row justify-end gap-2"
}

/**
 * Componente para agrupar botones de acción en el footer
 */
export function ModalActions({
  layout = "inline",
  variant = "default",
  showDivider = true,
  className,
  children,
  ...props
}: ModalActionsProps) {
  const variantColors = getModalVariantColor(variant)

  return (
    <div
      className={cn(
        "flex items-center",
        ACTIONS_LAYOUTS[layout],
        showDivider && "border-t border-border/50 pt-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// ============================================================================
// ModalInfoRow - Fila de información
// ============================================================================

interface ModalInfoRowProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  value?: React.ReactNode
  /** Variant de color para el label */
  variant?: ModalVariant
}

export function ModalInfoRow({
  label,
  value,
  variant = "default",
  className,
  ...props
}: ModalInfoRowProps) {
  const variantColors = getModalVariantColor(variant)

  return (
    <div
      className={cn("flex justify-between items-center py-2", className)}
      {...props}
    >
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={cn("text-sm font-medium", variantColors.text)}>{value || "—"}</span>
    </div>
  )
}

// ============================================================================
// ModalAlert - Alerta informativa
// ============================================================================

interface ModalAlertProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Tipo de alerta */
  type?: "info" | "success" | "warning" | "error"
  /** Título de la alerta */
  title?: string
  /** Variant de color */
  variant?: ModalVariant
}

const ALERT_CONFIGS = {
  info: {
    icon: Info,
    className: "bg-blue-500/10 border-blue-500/30 text-blue-400",
  },
  success: {
    icon: CheckCircle2,
    className: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
  },
  warning: {
    icon: AlertTriangle,
    className: "bg-amber-500/10 border-amber-500/30 text-amber-400",
  },
  error: {
    icon: AlertCircle,
    className: "bg-red-500/10 border-red-500/30 text-red-400",
  },
}

/**
 * Componente de alerta para usar dentro del modal
 */
export function ModalAlert({
  type = "info",
  title,
  className,
  children,
  ...props
}: ModalAlertProps) {
  const config = ALERT_CONFIGS[type]
  const Icon = config.icon

  return (
    <div
      className={cn(
        "flex gap-3 p-3 rounded-lg border",
        config.className,
        className
      )}
      {...props}
    >
      <Icon className="h-5 w-5 shrink-0 mt-0.5" />
      <div className="flex-1 space-y-1">
        {title && (
          <p className="text-sm font-medium">{title}</p>
        )}
        <div className="text-xs opacity-90">
          {children}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ModalGrid - Grid de campos
// ============================================================================

interface ModalGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Número de columnas */
  cols?: 1 | 2 | 3 | 4
  /** Gap entre columnas */
  gap?: 2 | 3 | 4 | 6
}

/**
 * Grid para distribuir campos uniformemente
 */
export function ModalGrid({
  cols = 2,
  gap = 4,
  className,
  children,
  ...props
}: ModalGridProps) {
  return (
    <div
      className={cn(
        `grid grid-cols-${cols} gap-${gap}`,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// ============================================================================
// ModalLoadingState - Estado de carga
// ============================================================================

interface ModalLoadingStateProps {
  message?: string
  variant?: ModalVariant
}

/**
 * Estado de carga para usar dentro del modal
 */
export function ModalLoadingState({
  message = "Cargando...",
  variant = "default"
}: ModalLoadingStateProps) {
  const variantColors = getModalVariantColor(variant)

  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <Loader2 className={cn("h-8 w-8 animate-spin", variantColors.text)} />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}

// ============================================================================
// ModalEmptyState - Estado vacío
// ============================================================================

interface ModalEmptyStateProps {
  title: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
  variant?: ModalVariant
}

/**
 * Estado vacío para usar dentro del modal
 */
export function ModalEmptyState({
  title,
  description,
  icon,
  action,
  variant = "default"
}: ModalEmptyStateProps) {
  const variantColors = getModalVariantColor(variant)

  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
      {icon && (
        <div className={cn("p-3 rounded-full", variantColors.iconBg)}>
          {icon}
        </div>
      )}
      <div className="space-y-1">
        <p className={cn("font-medium", variantColors.text)}>{title}</p>
        {description && (
          <p className="text-sm text-muted-foreground max-w-sm">
            {description}
          </p>
        )}
      </div>
      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </div>
  )
}
