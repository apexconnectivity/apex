"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export type ModalSize = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full"

export interface BaseModalProps {
  // Estado
  open: boolean
  onOpenChange: (open: boolean) => void

  // Contenido
  children: React.ReactNode

  // Configuración visual
  size?: ModalSize
  showCloseButton?: boolean

  // Comportamiento
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
  disableClose?: boolean

  // Accesibilidad
  description?: string

  // Estilos
  className?: string
  overlayClassName?: string
  contentClassName?: string

  // Callbacks
  onClose?: () => void
  onOpen?: () => void
}

// Mapeo de tamaños
const SIZE_CLASSES: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  "2xl": "max-w-5xl",
  "3xl": "max-w-6xl",
  full: "max-w-[95vw] max-h-[95vh]"
}

// Animaciones
const ANIMATION_CLASSES = {
  overlay: "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
  content: "fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-0 border bg-background shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-xl max-h-[90vh]"
}

export function BaseModal({
  open,
  onOpenChange,
  children,
  size = "md",
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  disableClose = false,
  description,
  className,
  overlayClassName,
  contentClassName,
  onClose,
  onOpen
}: BaseModalProps) {
  const handleOpenChange = (isOpen: boolean) => {
    if (disableClose && !isOpen) return
    if (!isOpen && onClose) onClose()
    if (isOpen && onOpen) onOpen()
    onOpenChange(isOpen)
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(ANIMATION_CLASSES.overlay, overlayClassName)}
          style={{ pointerEvents: closeOnOverlayClick ? "auto" : "none" }}
        />
        <DialogPrimitive.Content
          className={cn(
            ANIMATION_CLASSES.content,
            SIZE_CLASSES[size],
            contentClassName
          )}
          aria-describedby="modal-description"
          onPointerDownOutside={(e) => {
            if (!closeOnOverlayClick) {
              e.preventDefault()
            }
          }}
        >
          <DialogPrimitive.Description id="modal-description" className="sr-only">
            {description || 'Dialog modal'}
          </DialogPrimitive.Description>
          <div className={cn("flex flex-col max-h-[90vh]", className)}>
            {/* Botón de cierre */}
            {showCloseButton && !disableClose && (
              <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-10">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>
            )}

            {children}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

// ============================================================================
// SUB-COMPONENTES PARA EL CONTENIDO DEL MODAL
// ============================================================================

interface ModalHeaderProps {
  title: React.ReactNode
  description?: string
  showBorder?: boolean
  className?: string
}

export function ModalHeader({
  title,
  description,
  showBorder = true,
  className
}: ModalHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-1.5 p-6",
        showBorder && "border-b border-border/50",
        className
      )}
    >
      <DialogPrimitive.Title className="text-lg font-semibold leading-none tracking-tight">
        {title}
      </DialogPrimitive.Title>
      {description && (
        <DialogPrimitive.Description className="text-sm text-muted-foreground">
          {description}
        </DialogPrimitive.Description>
      )}
    </div>
  )
}

interface ModalBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  scrollable?: boolean
}

export function ModalBody({
  scrollable = true,
  className,
  ...props
}: ModalBodyProps) {
  return (
    <div
      className={cn(
        "p-6",
        scrollable && "overflow-y-auto flex-1 min-h-0",
        !scrollable && "flex-1",
        className
      )}
      {...props}
    />
  )
}

interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  layout?: "stack" | "inline" | "inline-between"
}

const LAYOUT_CLASSES: Record<NonNullable<ModalFooterProps["layout"]>, string> = {
  stack: "flex flex-col-reverse gap-2",
  inline: "flex flex-row gap-2",
  "inline-between": "flex flex-row justify-end gap-2"
}

export function ModalFooter({
  layout = "inline",
  className,
  ...props
}: ModalFooterProps) {
  return (
    <div
      className={cn(
        "p-6 pt-0 border-t border-border/50",
        LAYOUT_CLASSES[layout],
        className
      )}
      {...props}
    />
  )
}

// Alias para compatibilidad
export const ModalSection = ModalBody
export const ModalActions = ModalFooter
