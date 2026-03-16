"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"

// ============================================================================
// TIPOS
// ============================================================================

export type FormStatus = "idle" | "submitting" | "success" | "error"

export interface FormFieldProps {
  name: string
  label?: string
  required?: boolean
  error?: string
  helperText?: string
  disabled?: boolean
  showCharCount?: boolean
  maxLength?: number
  className?: string
}

export interface BaseFormProps<T extends Record<string, any>> {
  children: React.ReactNode
  defaultValues?: Partial<T>
  values?: Partial<T>
  errors?: Partial<Record<keyof T, string>>
  onSubmit: (data: T) => Promise<void> | void
  onChange?: (data: Partial<T>) => void
  status?: FormStatus
  submitText?: string
  loadingText?: string
  showSubmitButton?: boolean
  showCancelButton?: boolean
  onCancel?: () => void
  cancelText?: string
  title?: string
  description?: string
  globalError?: string
  globalSuccess?: string
  className?: string
  layout?: "vertical" | "horizontal"
  columns?: 1 | 2 | 3 | 4
  submitButtonVariant?: "default" | "primary" | "destructive"
  submitButtonSize?: "sm" | "md" | "lg"
  buttonsAlign?: "start" | "center" | "end" | "between"
}

// ============================================================================
// COMPONENTES
// ============================================================================

/**
 * FormHeader - Título, descripción y errores globales
 */
interface FormHeaderComponentProps {
  title?: string
  description?: string
  globalError?: string
  globalSuccess?: string
  className?: string
}

export function FormHeader({
  title,
  description,
  globalError,
  globalSuccess,
  className
}: FormHeaderComponentProps) {
  if (!title && !globalError && !globalSuccess) return null
  
  return (
    <div className={cn("space-y-1 mb-6", className)}>
      {title && (
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      )}
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      
      {globalError && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {globalError}
        </div>
      )}
      
      {globalSuccess && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {globalSuccess}
        </div>
      )}
    </div>
  )
}

/**
 * FormField - Envuelve un input con label, error y helper text
 */
export const FormField = React.forwardRef<
  HTMLDivElement,
  FormFieldProps & React.HTMLAttributes<HTMLDivElement>
>(({ 
  name, 
  label, 
  required, 
  error, 
  helperText,
  disabled,
  showCharCount,
  maxLength,
  className,
  children,
  ...props 
}, ref) => {
  const child = React.Children.only(children) as React.ReactElement
  
  // Obtener valor para char count
  const value = child.props?.value as string | undefined
  const defaultValue = child.props?.defaultValue as string | undefined
  const currentValue = value !== undefined ? value : defaultValue || ""
  const charCount = String(currentValue).length
  
  const childWithProps = React.cloneElement(child, {
    id: child.props.id || name,
    name: child.props.name || name,
    disabled: child.props.disabled ?? disabled,
    "aria-invalid": !!error,
    "aria-describedby": error ? `${name}-error` : helperText ? `${name}-helper` : undefined,
  })
  
  return (
    <div ref={ref} className={cn("space-y-1.5", className)} {...props}>
      {label && (
        <label 
          htmlFor={name}
          className={cn(
            "text-sm font-medium text-foreground",
            required && "after:content-['*'] after:ml-0.5 after:text-red-500"
          )}
        >
          {label}
        </label>
      )}
      
      {childWithProps}
      
      {error && (
        <p id={`${name}-error`} className="text-xs text-red-400 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
      
      {(helperText || (showCharCount && maxLength)) && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          {helperText && <span>{helperText}</span>}
          {showCharCount && maxLength && (
            <span className={cn(charCount > maxLength && "text-red-400")}>
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      )}
    </div>
  )
})
FormField.displayName = "FormField"

/**
 * FormRow - Fila de campos (para layout horizontal)
 */
interface FormRowProps {
  children: React.ReactNode
  columns?: 1 | 2 | 3 | 4
  className?: string
}

export function FormRow({ children, columns = 2, className }: FormRowProps) {
  const gridClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4"
  }
  
  return (
    <div className={cn("grid gap-4", gridClasses[columns], className)}>
      {children}
    </div>
  )
}

/**
 * FormGroup - Grupo de campos relacionados
 */
interface FormGroupProps {
  title?: string
  description?: string
  children: React.ReactNode
  collapsible?: boolean
  defaultOpen?: boolean
  className?: string
}

export function FormGroup({
  title,
  description,
  children,
  collapsible = false,
  defaultOpen = true,
  className
}: FormGroupProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)
  
  return (
    <div className={cn("space-y-4", className)}>
      {title && (
        <div 
          className={cn(
            "flex items-center gap-2 cursor-pointer",
            collapsible && "select-none"
          )}
          onClick={() => collapsible && setIsOpen(!isOpen)}
        >
          {collapsible && (
            <span className={cn("text-xs transition-transform", isOpen ? "rotate-90" : "")}>
              ▶
            </span>
          )}
          <div>
            <h4 className="text-sm font-medium">{title}</h4>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
      )}
      
      {(!collapsible || isOpen) && (
        <div className="space-y-4 pl-4 border-l-2 border-border/50">
          {children}
        </div>
      )}
    </div>
  )
}

/**
 * FormFooter - Botones de acción
 */
interface FormFooterProps {
  children?: React.ReactNode
  submitText?: string
  loadingText?: string
  status?: FormStatus
  showSubmitButton?: boolean
  showCancelButton?: boolean
  onCancel?: () => void
  cancelText?: string
  align?: "start" | "center" | "end" | "between"
  submitButtonVariant?: "default" | "primary" | "destructive"
  submitButtonSize?: "sm" | "md" | "lg"
  className?: string
}

export function FormFooter({
  children,
  submitText = "Guardar",
  loadingText = "Guardando...",
  status = "idle",
  showSubmitButton = true,
  showCancelButton = true,
  onCancel,
  cancelText = "Cancelar",
  align = "end",
  submitButtonVariant = "primary",
  submitButtonSize = "md",
  className
}: FormFooterProps) {
  const alignClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between"
  }
  
  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    primary: "bg-cyan-500 text-white hover:bg-cyan-600",
    destructive: "bg-red-500 text-white hover:bg-red-600"
  }
  
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  }
  
  const isLoading = status === "submitting"
  
  return (
    <div className={cn("flex items-center gap-3 pt-4 mt-4 border-t border-border/50", alignClasses[align], className)}>
      {children}
      
      {showCancelButton && onCancel && (
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50"
        >
          {cancelText}
        </button>
      )}
      
      {showSubmitButton && (
        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2",
            variantClasses[submitButtonVariant],
            sizeClasses[submitButtonSize]
          )}
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {isLoading ? loadingText : submitText}
        </button>
      )}
    </div>
  )
}

/**
 * BaseForm - Componente principal
 */
export function BaseForm<T extends Record<string, any>>({
  children,
  defaultValues,
  values,
  errors,
  onSubmit,
  onChange,
  status = "idle",
  submitText = "Guardar",
  loadingText = "Guardando...",
  showSubmitButton = true,
  showCancelButton = false,
  onCancel,
  cancelText = "Cancelar",
  title,
  description,
  globalError,
  globalSuccess,
  className,
  layout = "vertical",
  columns = 1,
  submitButtonVariant = "primary",
  submitButtonSize = "md",
  buttonsAlign = "end",
}: BaseFormProps<T>) {
  const [formData, setFormData] = React.useState<Partial<T>>(values || defaultValues || {})
  const [localErrors, setLocalErrors] = React.useState<Record<string, string>>({})
  
  // Actualizar cuando cambian los valores externos
  React.useEffect(() => {
    if (values) {
      setFormData(values)
    }
  }, [values])
  
  // Manejar cambio de campo
  const handleChange = (field: string, value: any) => {
    const newData = { ...formData, [field]: value }
    setFormData(newData)
    
    if (localErrors[field]) {
      setLocalErrors(prev => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
    
    onChange?.(newData)
  }
  
  // Proporcionar contexto
  const contextValue = React.useMemo(() => ({
    values: formData,
    errors: { ...errors, ...localErrors } as any,
    onChange: handleChange,
    status,
    layout,
    columns
  }), [formData, errors, localErrors, status, layout, columns])
  
  // Manejar submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await onSubmit(formData as T)
    } catch (error) {
      console.error("Form submission error:", error)
    }
  }
  
  // Grid classes para layout horizontal
  const horizontalGridClasses: Record<2 | 3 | 4, string> = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4"
  }
  
  const gridClass = layout === "horizontal" && columns > 1 
    ? horizontalGridClasses[columns as 2 | 3 | 4]
    : ""
  
  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
      <FormHeader 
        title={title}
        description={description}
        globalError={globalError}
        globalSuccess={globalSuccess}
      />
      
      <div className={cn(
        layout === "horizontal" && columns > 1 && "grid gap-4",
        gridClass
      )}>
        {children}
      </div>
      
      {(showSubmitButton || showCancelButton) && (
        <FormFooter
          status={status}
          submitText={submitText}
          loadingText={loadingText}
          showSubmitButton={showSubmitButton}
          showCancelButton={showCancelButton}
          onCancel={onCancel}
          cancelText={cancelText}
          align={buttonsAlign}
          submitButtonVariant={submitButtonVariant}
          submitButtonSize={submitButtonSize}
        />
      )}
    </form>
  )
}

// ============================================================================
// EXPORTS - Ya exportados en las declaraciones acima
// ============================================================================
