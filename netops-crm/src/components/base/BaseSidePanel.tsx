"use client"

import * as React from "react"
import { X, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"

export type SidePanelPosition = "left" | "right"

export interface BaseSidePanelProps {
  // Estado
  isOpen: boolean
  
  // Contenido
  children: React.ReactNode
  
  // Configuración
  position?: SidePanelPosition
  title?: string
  showCloseButton?: boolean
  showBackButton?: boolean
  onBack?: () => void
  onClose: () => void
  
  // Tamaño
  width?: string // ej: "w-1/5", "w-80", "400px"
  
  // Estilos
  className?: string
  headerClassName?: string
  contentClassName?: string
  
  // Footer persistente
  footer?: React.ReactNode
  showFooterBorder?: boolean
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export function BaseSidePanel({
  isOpen,
  children,
  position = "right",
  title,
  showCloseButton = true,
  showBackButton = false,
  onBack,
  onClose,
  width = "w-1/5",
  className,
  headerClassName,
  contentClassName,
  footer,
  showFooterBorder = true
}: BaseSidePanelProps) {
  const positionClasses = {
    left: {
      container: "rounded-l-xl border-l",
      button: "ml-auto",
    },
    right: {
      container: "rounded-r-xl border-r",
      button: "ml-auto",
    }
  }

  return (
    <div 
      className={cn(
        "flex flex-col h-full overflow-hidden",
        "bg-slate-900/50 border-border",
        positionClasses[position].container,
        width,
        !isOpen && "w-0 overflow-hidden",
        isOpen && "transition-all duration-300 ease-in-out",
        className
      )}
    >
      {/* Header */}
      {(title || showCloseButton || showBackButton) && (
        <div className={cn(
          "flex items-center justify-between px-4 py-3 border-b border-border/50 shrink-0",
          headerClassName
        )}>
          <div className="flex items-center gap-2 min-w-0">
            {showBackButton && onBack && (
              <button
                type="button"
                onClick={onBack}
                className="p-1 rounded-md hover:bg-accent transition-colors shrink-0"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            {title && (
              <h2 className="font-semibold truncate">{title}</h2>
            )}
          </div>
          
          {showCloseButton && (
            <button
              type="button"
              onClick={onClose}
              className={cn(
                "p-1.5 rounded-md hover:bg-accent transition-colors shrink-0",
                positionClasses[position].button
              )}
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      )}
      
      {/* Body */}
      <div className={cn(
        "flex-1 overflow-y-auto",
        contentClassName
      )}>
        {children}
      </div>
      
      {/* Footer */}
      {footer && (
        <div 
          className={cn(
            "px-4 py-3 shrink-0",
            showFooterBorder && "border-t border-border/50"
          )}
        >
          {footer}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// SUB-COMPONENTES
// ============================================================================

interface SidePanelHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
  icon?: React.ReactNode
  className?: string
}

export function SidePanelHeader({
  title,
  subtitle,
  action,
  icon,
  className
}: SidePanelHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between", className)}>
      <div className="flex items-center gap-3 min-w-0">
        {icon && (
          <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <h3 className="font-semibold truncate">{title}</h3>
          {subtitle && (
            <p className="text-sm text-muted-foreground truncate">{subtitle}</p>
          )}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

interface SidePanelContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function SidePanelContent({ children, className, ...props }: SidePanelContentProps) {
  return (
    <div className={cn("p-4 space-y-4", className)} {...props}>
      {children}
    </div>
  )
}

interface SidePanelSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  children: React.ReactNode
}

export function SidePanelSection({ 
  title, 
  description, 
  children, 
  className, 
  ...props 
}: SidePanelSectionProps) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      {title && (
        <div>
          <h4 className="text-sm font-medium">{title}</h4>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  )
}

interface SidePanelFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function SidePanelFooter({ children, className, ...props }: SidePanelFooterProps) {
  return (
    <div 
      className={cn(
        "flex items-center gap-2 pt-4 mt-4 border-t border-border/50",
        className
      )} 
      {...props}
    >
      {children}
    </div>
  )
}

// ============================================================================
// EXPORTS - Ya exportados en las declaraciones acima
// ============================================================================
