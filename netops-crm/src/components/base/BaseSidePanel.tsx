"use client"

import * as React from "react"
import { X, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { getSidePanelVariantColor, type SidePanelVariant } from "@/constants/paneles"
import { motion, AnimatePresence } from "framer-motion"

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

  // Variante de color
  variant?: SidePanelVariant
  showAccentBar?: boolean

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
  variant = "default",
  showAccentBar = true,
  className,
  headerClassName,
  contentClassName,
  footer,
  showFooterBorder = true
}: BaseSidePanelProps) {
  const variantColors = getSidePanelVariantColor(variant)

  const positionClasses = {
    left: {
      container: "rounded-l-xl",
      button: "ml-auto",
    },
    right: {
      container: "rounded-r-xl",
      button: "ml-auto",
    }
  }

  const actualWidth = width.includes('[') ? width.match(/\[(.*?)\]/)?.[1] || '25vw' : '25vw'

  return (
    <AnimatePresence mode="sync">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className={cn(
            "fixed inset-0 z-50 bg-black/30 backdrop-blur-sm",
            className
          )}
          onClick={onClose}
        >
          <motion.div
            initial={{ x: position === "right" ? "100%" : "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: position === "right" ? "100%" : "-100%" }}
            transition={{
              type: "spring",
              damping: 40,
              stiffness: 200,
              mass: 1.2,
              restDelta: 1,
              restSpeed: 1
            }}
            className={cn(
              "absolute top-0 bottom-0 flex flex-col",
              position === "right" ? "right-0" : "left-0",
              "bg-slate-900/95 backdrop-blur-xl border-l border-border/50 shadow-2xl",
              positionClasses[position].container,
              variantColors.border,
              showAccentBar && (position === "right" ? "border-l-4" : "border-r-4")
            )}
            style={{ width: actualWidth }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            {(title || showCloseButton || showBackButton) && (
              <div className={cn(
                "flex items-center justify-between px-6 py-4 border-b border-white/5 shrink-0",
                headerClassName
              )}>
                <div className="flex items-center gap-3 min-w-0">
                  {showBackButton && onBack && (
                    <button
                      type="button"
                      onClick={onBack}
                      className="p-1.5 rounded-lg hover:bg-white/5 transition-colors shrink-0"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                  )}
                  {title && (
                    <h2 className="text-lg font-semibold truncate tracking-tight">{title}</h2>
                  )}
                </div>

                {showCloseButton && (
                  <button
                    type="button"
                    onClick={onClose}
                    className={cn(
                      "p-2 rounded-lg hover:bg-white/10 transition-all active:scale-90 shrink-0",
                      positionClasses[position].button
                    )}
                  >
                    <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                  </button>
                )}
              </div>
            )}

            {/* Body */}
            <div className={cn(
              "flex-1 overflow-y-auto custom-scrollbar",
              contentClassName
            )}>
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div
                className={cn(
                  "px-6 py-4 shrink-0 bg-slate-900/70 backdrop-blur-md",
                  showFooterBorder && "border-t border-white/5"
                )}
              >
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
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
  variant?: SidePanelVariant
  className?: string
}

export function SidePanelHeader({
  title,
  subtitle,
  action,
  icon,
  variant = "default",
  className
}: SidePanelHeaderProps) {
  const variantColors = getSidePanelVariantColor(variant)

  return (
    <div className={cn("flex items-start justify-between", className)}>
      <div className="flex items-center gap-3 min-w-0">
        {icon && (
          <div className={cn("p-2 rounded-lg shrink-0", variantColors.iconBg, variantColors.text)}>
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
