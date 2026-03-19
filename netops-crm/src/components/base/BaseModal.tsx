"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  ModalVariant,
  getModalVariantColor,
  getModalVariantIcon,
  getOverlayClass,
} from "@/constants/modales"

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

  // Variante de color (nueva)
  variant?: ModalVariant
  showAccentBar?: boolean
  accentIcon?: React.ReactNode

  // Estados de carga (nueva)
  isLoading?: boolean
  loadingMessage?: string

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

// Animaciones mejoradas
const ANIMATION_CLASSES = {
  overlay: "fixed inset-0 z-50 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-200",
  content: "fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-0 bg-background shadow-2xl duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-2xl max-h-[90vh]"
}

export function BaseModal({
  open,
  onOpenChange,
  children,
  size = "md",
  showCloseButton = true,
  variant = "default",
  showAccentBar = false,
  accentIcon,
  isLoading = false,
  loadingMessage,
  closeOnOverlayClick = true,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  closeOnEscape = true,
  disableClose = false,
  description,
  className,
  overlayClassName,
  contentClassName,
  onClose,
  onOpen
}: BaseModalProps) {
  // Obtener colores de la variante
  const variantColors = getModalVariantColor(variant)
  const VariantIcon = getModalVariantIcon(variant)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _IconComponent = accentIcon || VariantIcon

  // Manejo del cambio de estado
  const handleOpenChange = (isOpen: boolean) => {
    if (disableClose && !isOpen) return
    if (!isOpen && onClose) onClose()
    if (isOpen && onOpen) onOpen()
    onOpenChange(isOpen)
  }

  // Clases de overlay según variante
  const overlayVariantClass = getOverlayClass(variant)

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            ANIMATION_CLASSES.overlay,
            overlayVariantClass,
            overlayClassName
          )}
          style={{ pointerEvents: closeOnOverlayClick ? "auto" : "none" }}
        />
        <DialogPrimitive.Content
          className={cn(
            ANIMATION_CLASSES.content,
            SIZE_CLASSES[size],
            // Borde izquierdo colorido si showAccentBar está activo
            showAccentBar && variantColors.border,
            // Bordes redondeados mejorados
            "rounded-2xl",
            contentClassName
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
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

          {/* Overlay de carga */}
          {isLoading && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-2xl">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className={cn("h-8 w-8 animate-spin", variantColors.text)} />
                {loadingMessage && (
                  <p className="text-sm text-muted-foreground">{loadingMessage}</p>
                )}
              </div>
            </div>
          )}

          <div className={cn("flex flex-col max-h-[90vh]", className)}>
            {/* Botón de cierre mejorado */}
            {showCloseButton && !disableClose && (
              <DialogPrimitive.Close
                className={cn(
                  "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-all hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-10",
                  "hover:bg-muted/50",
                  variantColors.text,
                  "hover:scale-110"
                )}
                aria-label="Cerrar modal"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Cerrar</span>
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

  // Nuevas props de variante
  variant?: ModalVariant
  showIcon?: boolean
  icon?: React.ReactNode
  showAccentBar?: boolean
}

export function ModalHeader({
  title,
  description,
  showBorder = true,
  className,
  variant = "default",
  showIcon = false,
  icon,
  showAccentBar = false
}: ModalHeaderProps) {
  // Obtener colores de la variante
  const variantColors = getModalVariantColor(variant)
  const DefaultIcon = getModalVariantIcon(variant)
  const IconComponent = icon || (showIcon ? DefaultIcon : null)

  return (
    <div
      id="modal-title"
      className={cn(
        "relative flex flex-col space-y-1.5 p-6 overflow-hidden",
        showBorder && "border-b border-border/50",
        // Fondo con gradiente sutil según variante
        variantColors.light,
        showAccentBar && "border-l-4",
        className
      )}
      style={showAccentBar ? { borderLeftColor: variantColors.primary } : undefined}
    >
      {/* Barra de acento superior */}
      {showAccentBar && (
        <div
          className="absolute top-0 left-0 right-0 h-1 opacity-50"
          style={{ background: `linear-gradient(90deg, ${variantColors.primary}, transparent)` }}
        />
      )}

      {IconComponent && React.isValidElement(IconComponent) && (
        <div className={cn("mb-2 p-2 rounded-lg w-fit", variantColors.iconBg)}>
          {React.cloneElement(IconComponent as React.ReactElement, {
            className: cn("h-5 w-5", variantColors.text)
          })}
        </div>
      )}

      <DialogPrimitive.Title className={cn(
        "text-lg font-semibold leading-none tracking-tight",
        variantColors.text
      )}>
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
  variant?: ModalVariant
}

export function ModalBody({
  scrollable = true,
  variant = "default",
  className,
  ...props
}: ModalBodyProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _variantColors = getModalVariantColor(variant)

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
  variant?: ModalVariant
  showAccent?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const LAYOUT_CLASSES: Record<NonNullable<ModalFooterProps["layout"]>, string> = {
  stack: "flex flex-col-reverse gap-2",
  inline: "flex flex-row gap-2",
  "inline-between": "flex flex-row justify-end gap-2"
}

export function ModalFooter({
  layout = "inline",
  variant = "default",
  showAccent = false,
  className,
  ...props
}: ModalFooterProps) {
  const variantColors = getModalVariantColor(variant)

  return (
    <div
      className={cn(
        "p-6 pt-4 border-t flex flex-row items-center gap-2",
        layout === "inline-between" && "justify-end",
        // Borde con color según variante si showAccent
        showAccent ? variantColors.border : "border-border/50",
        // Fondo sutil según variante
        showAccent && variantColors.light,
        className
      )}
      {...props}
    />
  )
}

// Alias para compatibilidad - ahora usamos los helpers de @/components/ui/modal-helpers
export { ModalBody as ModalSection, ModalFooter as ModalActions }
