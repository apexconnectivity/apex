"use client"

import * as React from "react"
import { X, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"

export type PanelPosition = "left" | "right"
export type PanelSize = "sm" | "md" | "lg" | "xl" | "full"

export interface BasePanelProps {
  // Estado
  open: boolean
  onClose: () => void
  
  // Contenido
  children: React.ReactNode
  
  // Configuración
  position?: PanelPosition
  size?: PanelSize
  title?: string
  showCloseButton?: boolean
  showBackButton?: boolean
  onBack?: () => void
  
  // Comportamiento
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
  disableClose?: boolean
  
  // Estilos
  className?: string
  overlayClassName?: string
  
  // Footer persistente
  footer?: React.ReactNode
  showFooterBorder?: boolean
}

// Mapeos de tamaño
const SIZE_CLASSES: Record<PanelSize, string> = {
  sm: "w-full max-w-sm",
  md: "w-full max-w-md", 
  lg: "w-full max-w-lg",
  xl: "w-full max-w-xl",
  full: "w-full max-w-[600px]"
}

// Animaciones según posición
const POSITION_ANIMATION = {
  left: {
    overlay: "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
    content: "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left"
  },
  right: {
    overlay: "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
    content: "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right"
  }
}

export function BasePanel({
  open,
  onClose,
  children,
  position = "right",
  size = "md",
  title,
  showCloseButton = true,
  showBackButton = false,
  onBack,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  disableClose = false,
  className,
  overlayClassName,
  footer,
  showFooterBorder = true
}: BasePanelProps) {
  // Manejo de escape key
  React.useEffect(() => {
    if (!closeOnEscape || disableClose) return
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose()
      }
    }
    
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [open, onClose, closeOnEscape, disableClose])
  
  // Bloquear scroll cuando está abierto
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  const anim = POSITION_ANIMATION[position]

  return (
    <>
      {/* Overlay */}
      <div 
        className={cn(
          "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
          anim.overlay,
          open ? "visible" : "invisible",
          overlayClassName
        )}
        onClick={closeOnOverlayClick && !disableClose ? onClose : undefined}
        style={{ pointerEvents: open ? "auto" : "none" }}
      />
      
      {/* Panel Content */}
      <div
        className={cn(
          "fixed top-0 bottom-0 z-50 flex flex-col bg-background shadow-2xl border-border/50",
          position === "left" ? "left-0 border-r" : "right-0 border-l",
          SIZE_CLASSES[size],
          anim.content,
          className
        )}
        style={{ 
          transform: open ? "translateX(0)" : undefined,
          transition: "transform 200ms ease-out"
        }}
      >
        {/* Header */}
        {(title || showCloseButton || showBackButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 shrink-0">
            <div className="flex items-center gap-3">
              {showBackButton && onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="p-1 rounded-md hover:bg-accent transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              )}
              {title && (
                <h2 className="text-lg font-semibold">{title}</h2>
              )}
            </div>
            
            {showCloseButton && !disableClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-md hover:bg-accent transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )}
        
        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
        
        {/* Footer */}
        {footer && (
          <div 
            className={cn(
              "px-6 py-4 shrink-0",
              showFooterBorder && "border-t border-border/50"
            )}
          >
            {footer}
          </div>
        )}
      </div>
    </>
  )
}

// ============================================================================
// SUB-COMPONENTES (reexportados desde BaseModal para consistencia)
// ============================================================================

export { ModalHeader as PanelHeader } from "./BaseModal"
export { ModalBody as PanelBody } from "./BaseModal"  
export { ModalFooter as PanelFooter } from "./BaseModal"
