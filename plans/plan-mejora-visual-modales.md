# Plan de Mejora Visual del Sistema de Componentes Modales

## 1. Análisis del Estado Actual

### 1.1 Componentes Modales Identificados

| Componente | Ubicación | Uso |
|------------|-----------|-----|
| [`BaseModal`](/netops-crm/src/components/base/BaseModal.tsx) | `src/components/base/` | Componente base principal |
| [`ModalHeader`](/netops-crm/src/components/base/BaseModal.tsx:124) | Subcomponente | Header con título y descripción |
| [`ModalBody`](/netops-crm/src/components/base/BaseModal.tsx:161) | Subcomponente | Contenido principal |
| [`ModalFooter`](/netops-crm/src/components/base/BaseModal.tsx:189) | Subcomponente | Acciones del modal |
| [`Dialog`](/netops-crm/src/components/ui/dialog.tsx) | `src/components/ui/` | Componente UI básico |

### 1.2 Modales de Módulo

| Modal | Archivo | Propósito |
|-------|--------|-----------|
| ProjectModal | `src/components/module/ProjectModal.tsx` | Crear/editar proyectos |
| CreateTicketModal | `src/components/module/CreateTicketModal.tsx` | Crear/editar tickets |
| CreateTaskModal | `src/components/module/CreateTaskModal.tsx` | Crear/editar tareas |
| EmpresaModal | `src/components/module/EmpresaModal.tsx` | Crear/editar empresas |
| CreateContactoModal | `src/components/module/CreateContactoModal.tsx` | Crear/editar contactos |
| UploadModal | `src/components/module/UploadModal.tsx` | Subir archivos |
| ConfirmDeleteModal | `src/components/module/ConfirmDeleteModal.tsx` | Confirmar eliminación |
| DetalleArchivadoModal | `src/components/module/DetalleArchivadoModal.tsx` | Ver detalles de archivado |

### 1.3 Problemas Visuales Identificados

1. **Monocromático**: Los modales son visualmente neutros, sin identidad por tipo
2. **Sin diferenciación**: No hay distinción visual entre crear/editar/ver detalles
3. **Footer estándar**: Sin variación según el contexto
4. **Overlay básico**: Solo `bg-black/50` sin gradiente ni efectos
5. **Header genérico**: Solo texto sin iconos ni colores distintivos

---

## 2. Propuesta de Paleta de Colores para Modales

### 2.1 Sistema de Colores por Tipo de Modal

```typescript
// Tipos de modal con su color distintivo
const MODAL_TYPE_COLORS = {
  // CRUD - Crear (verde esmeralda)
  create: {
    primary: '#10b981',     // emerald-500
    light: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    icon: 'text-emerald-400',
  },
  
  // CRUD - Editar (azul)
  edit: {
    primary: '#3b82f6',     // blue-500
    light: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    icon: 'text-blue-400',
  },
  
  // CRUD - Ver/Detalle (cyan)
  view: {
    primary: '#06b6d4',     // cyan-500
    light: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    text: 'text-cyan-400',
    icon: 'text-cyan-400',
  },
  
  // Peligro/Eliminar (rojo)
  danger: {
    primary: '#ef4444',     // red-500
    light: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-400',
    icon: 'text-red-400',
  },
  
  // Advertencia (ámbar)
  warning: {
    primary: '#f59e0b',     // amber-500
    light: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    icon: 'text-amber-400',
  },
  
  // Información (violeta)
  info: {
    primary: '#8b5cf6',     // violet-500
    light: 'bg-violet-500/10',
    border: 'border-violet-500/30',
    text: 'text-violet-400',
    icon: 'text-violet-400',
  },
  
  // Neutral (por defecto)
  default: {
    primary: '#06b6d4',     // cyan-500
    light: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    text: 'text-cyan-400',
    icon: 'text-cyan-400',
  },
}
```

### 2.2 Mapeo de Modales a Colores

| Modal | Tipo | Color Propuesto |
|-------|------|-----------------|
| ProjectModal (nuevo) | create | emerald |
| ProjectModal (editar) | edit | blue |
| CreateTicketModal | create | emerald |
| CreateTaskModal | create | emerald |
| EmpresaModal (nuevo) | create | emerald |
| EmpresaModal (editar) | edit | blue |
| CreateContactoModal | create | emerald |
| UploadModal | create | blue |
| ConfirmDeleteModal | danger | red |
| DetalleArchivadoModal | view | cyan |

---

## 3. Mejoras de Estilos Propuestas

### 3.1 Overlay Mejorado

```typescript
// En BaseModal.tsx - Animación de overlay mejorada
const OVERLAY_STYLES = {
  default: "bg-black/60 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
  gradient: "bg-gradient-to-b from-black/70 via-black/50 to-black/70 backdrop-blur-sm",
  subtle: "bg-black/40 backdrop-blur-sm",
}

// Usar por defecto el gradient para más profundidad
overlayClassName = "bg-gradient-to-b from-black/70 via-black/50 to-black/70 backdrop-blur-md"
```

### 3.2 Contenido del Modal con Borde Colorido

```typescript
// Borde izquierdo colorido para identificar el tipo
const CONTENT_STYLES = {
  create: "border-l-4 border-l-emerald-500",
  edit: "border-l-4 border-l-blue-500", 
  view: "border-l-4 border-l-cyan-500",
  danger: "border-l-4 border-l-red-500",
  warning: "border-l-4 border-l-amber-500",
}

// Applied to DialogPrimitive.Content
className={cn(
  "rounded-xl border border-border/50 shadow-2xl",
  CONTENT_STYLES[variant], // nueva prop
  SIZE_CLASSES[size]
)}
```

### 3.3 ModalHeader con Icono y Color

```tsx
// Nueva interfaz para ModalHeader
interface ModalHeaderProps {
  title: React.ReactNode
  description?: string
  showBorder?: boolean
  className?: string
  icon?: React.ReactNode          // NUEVO: icono opcional
  variant?: 'default' | 'create' | 'edit' | 'view' | 'danger' | 'warning' | 'info'
  showAccentBar?: boolean         // NUEVO: barra lateral de color
}

// Renderizado mejorado
<div className={cn(
  "flex flex-col space-y-1.5 p-6",
  showBorder && "border-b border-border/50",
  // Barra de acento lateral
  showAccentBar && variantStyles[variant].accentBar,
  className
)}>
  {icon && (
    <div className={cn("mb-2", variantStyles[variant].iconColor)}>
      {icon}
    </div>
  )}
  <DialogPrimitive.Title className={cn(
    "text-lg font-semibold leading-none tracking-tight",
    variantStyles[variant].titleColor
  )}>
    {title}
  </DialogPrimitive.Title>
  {description && (
    <DialogPrimitive.Description className="text-sm text-muted-foreground">
      {description}
    </DialogPrimitive.Description>
  )}
</div>
```

### 3.4 ModalFooter con Estilos Variables

```tsx
interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  layout?: "stack" | "inline" | "inline-between"
  variant?: 'default' | 'create' | 'edit' | 'view' | 'danger'  // NUEVO
  showAccent?: boolean                                          // NUEVO
}

// Estilos según variante
const FOOTER_VARIANTS = {
  default: "border-t border-border/50",
  create: "border-t border-emerald-500/30 bg-emerald-500/5",
  edit: "border-t border-blue-500/30 bg-blue-500/5",
  view: "border-t border-cyan-500/30 bg-cyan-500/5",
  danger: "border-t border-red-500/30 bg-red-500/5",
}
```

---

## 4. Estados Visuales (Abierto, Cerrado, Cargando)

### 4.1 Estado Cargando con Spinner y Overlay

```tsx
// Mejora en BaseModal para estado de carga
interface BaseModalProps {
  // ... existing props
  isLoading?: boolean              // NUEVO
  loadingMessage?: string         // NUEVO
}

// Overlay de carga
{isLoading && (
  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-xl">
    <div className="flex flex-col items-center gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      {loadingMessage && (
        <p className="text-sm text-muted-foreground">{loadingMessage}</p>
      )}
    </div>
  </div>
)}
```

### 4.2 Estado "Guardando" en Footer

```tsx
// En ModalFooter
{isSaving && (
  <div className="absolute inset-x-0 bottom-0 h-1 bg-primary/20 overflow-hidden">
    <div className="h-full bg-primary animate-[loading_1.5s_ease-in-out_infinite]" />
  </div>
)}

// En globals.css
@keyframes loading {
  0% { transform: translateX(-100%) }
  50% { transform: translateX(0%) }
  100% { transform: translateX(100%) }
}
```

### 4.3 Transiciones Mejoradas

```typescript
// Animaciones más suaves
const ANIMATION_CLASSES = {
  overlay: "fixed inset-0 z-50 bg-black/60 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-200",
  content: "fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-0 border bg-background shadow-2xl duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-2xl max-h-[90vh]"
}
```

---

## 5. Consideraciones de Accesibilidad

### 5.1 Mejoras Propuestas

| Aspecto | Mejora | Implementación |
|---------|--------|----------------|
| Focus trap | Mantener foco dentro del modal | Radix ya lo hace por defecto |
| Focus visible | Anillo de enfoque visible | `focus-visible:ring-2 focus-visible:ring-primary` |
| Escape key | Cerrar con Escape | Radix ya lo hace (configurable) |
| Click outside | Cerrar al hacer click fuera | Configurable via `closeOnOverlayClick` |
| Screen readers | Descripción ARIA | Ya implementado |
| Reduced motion | Respetar prefers-reduced-motion | Añadir media query |

### 5.2 Código de Accesibilidad

```tsx
// En DialogPrimitive.Content
<DialogPrimitive.Content
  // Mantener foco
  trapFocus
  // Evitar scroll fuera
  disableOutsideScroll
  // Props de aria
  aria-describedby={descriptionId}
  aria-labelledby={titleId}
>
  {/* Título con ID para aria-labelledby */}
  <DialogPrimitive.Title id={titleId} className="sr-only">
    {typeof title === 'string' ? title : 'Modal'}
  </DialogPrimitive.Title>
  
  {/* Descripción con ID para aria-describedby */}
  {description && (
    <DialogPrimitive.Description id={descriptionId} className="sr-only">
      {description}
    </DialogPrimitive.Description>
  )}
  
  {/* Contenido principal */}
  {children}
</DialogPrimitive.Content>
```

### 5.3 Soporte para Reduced Motion

```css
/* En globals.css */
@media (prefers-reduced-motion: reduce) {
  .modal-overlay,
  .modal-content {
    animation: none !important;
    transition: none !important;
  }
}
```

---

## 6. Archivos a Modificar

### 6.1 Archivos Principales

| Archivo | Cambios |
|---------|---------|
| `src/components/base/BaseModal.tsx` | Añadir props de variante, overlay mejorado, estados de carga |
| `src/constants/modales.ts` (NUEVO) | Definir constantes de colores y tipos de modal |

### 6.2 Actualización de Modales Existentes

| Archivo | Cambios |
|---------|---------|
| `src/components/module/ProjectModal.tsx` | Añadir variant="create\|edit" a ModalHeader |
| `src/components/module/CreateTicketModal.tsx` | Añadir variant="create" a ModalHeader |
| `src/components/module/CreateTaskModal.tsx` | Añadir variant="create" a ModalHeader |
| `src/components/module/EmpresaModal.tsx` | Añadir variant="create\|edit" según modo |
| `src/components/module/CreateContactoModal.tsx` | Añadir variant="create" a ModalHeader |
| `src/components/module/UploadModal.tsx` | Añadir variant="create" e icono |
| `src/components/module/ConfirmDeleteModal.tsx` | Añadir variant="danger" |

### 6.3 Nuevos Componentes (Opcional)

| Archivo | Propósito |
|---------|-----------|
| `src/components/ui/ModalTypes.ts` | Tipos y constantes de variantes |
| `src/components/ui/LoadingOverlay.tsx` | Componente de overlay de carga |

---

## 7. Ejemplos de Código para Implementar

### 7.1 constants/modales.ts (NUEVO)

```typescript
/**
 * Constantes y tipos para el sistema de modales
 * Proporciona colores, iconos y configuraciones reutilizables
 */

import { LucideIcon } from 'lucide-react'
import { 
  Plus, Edit3, Eye, AlertTriangle, AlertCircle, 
  Info, Upload, Building2, User, Ticket, CheckSquare,
  FolderOpen, Trash2
} from 'lucide-react'

// ============================================================================
// TIPOS
// ============================================================================

export type ModalVariant = 'default' | 'create' | 'edit' | 'view' | 'danger' | 'warning' | 'info'

// ============================================================================
// CONFIGURACIÓN DE COLORES POR VARIANTE
// ============================================================================

export const MODAL_VARIANT_COLORS: Record<ModalVariant, {
  primary: string
  light: string
  border: string
  text: string
  iconBg: string
  gradient: string
}> = {
  default: {
    primary: '#06b6d4',     // cyan-500
    light: 'bg-cyan-500/[0.08]',
    border: 'border-cyan-500/30',
    text: 'text-cyan-400',
    iconBg: 'bg-cyan-500/10',
    gradient: 'from-cyan-500/20 to-transparent',
  },
  create: {
    primary: '#10b981',     // emerald-500
    light: 'bg-emerald-500/[0.08]',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    iconBg: 'bg-emerald-500/10',
    gradient: 'from-emerald-500/20 to-transparent',
  },
  edit: {
    primary: '#3b82f6',    // blue-500
    light: 'bg-blue-500/[0.08]',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    iconBg: 'bg-blue-500/10',
    gradient: 'from-blue-500/20 to-transparent',
  },
  view: {
    primary: '#06b6d4',    // cyan-500
    light: 'bg-cyan-500/[0.08]',
    border: 'border-cyan-500/30',
    text: 'text-cyan-400',
    iconBg: 'bg-cyan-500/10',
    gradient: 'from-cyan-500/20 to-transparent',
  },
  danger: {
    primary: '#ef4444',    // red-500
    light: 'bg-red-500/[0.08]',
    border: 'border-red-500/30',
    text: 'text-red-400',
    iconBg: 'bg-red-500/10',
    gradient: 'from-red-500/20 to-transparent',
  },
  warning: {
    primary: '#f59e0b',    // amber-500
    light: 'bg-amber-500/[0.08]',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    iconBg: 'bg-amber-500/10',
    gradient: 'from-amber-500/20 to-transparent',
  },
  info: {
    primary: '#8b5cf6',    // violet-500
    light: 'bg-violet-500/[0.08]',
    border: 'border-violet-500/30',
    text: 'text-violet-400',
    iconBg: 'bg-violet-500/10',
    gradient: 'from-violet-500/20 to-transparent',
  },
}

// ============================================================================
// ICONOS POR TIPO DE MODAL
// ============================================================================

export const MODAL_TYPE_ICONS: Record<ModalVariant, LucideIcon> = {
  default: Info,
  create: Plus,
  edit: Edit3,
  view: Eye,
  danger: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

// ============================================================================
// ICONOS POR CONTEXTO DE MÓDULO
// ============================================================================

export const MODULE_ICONS: Record<string, LucideIcon> = {
  proyecto: CheckSquare,
  empresa: Building2,
  usuario: User,
  ticket: Ticket,
  tarea: CheckSquare,
  contacto: User,
  archivo: Upload,
  archivado: FolderOpen,
  eliminar: Trash2,
  upload: Upload,
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Obtiene la configuración de color para una variante
 */
export function getModalVariantColor(variant: ModalVariant) {
  return MODAL_VARIANT_COLORS[variant] || MODAL_VARIANT_COLORS.default
}

/**
 * Obtiene el icono para una variante
 */
export function getModalVariantIcon(variant: ModalVariant) {
  return MODAL_TYPE_ICONS[variant] || MODAL_TYPE_ICONS.default
}

/**
 * Determina la variante según el tipo de operación
 */
export function getVariantByOperation(operation: 'create' | 'edit' | 'view' | 'delete'): ModalVariant {
  switch (operation) {
    case 'create': return 'create'
    case 'edit': return 'edit'
    case 'view': return 'view'
    case 'delete': return 'danger'
    default: return 'default'
  }
}
```

### 7.2 BaseModal.tsx Mejorado

```tsx
"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { 
  ModalVariant, 
  getModalVariantColor,
  MODAL_TYPE_ICONS 
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
  variant?: ModalVariant              // NUEVO: variante de color
  showAccentBar?: boolean            // NUEVO: mostrar barra lateral
  accentIcon?: React.ReactNode        // NUEVO: icono personalizado

  // Estados
  isLoading?: boolean                // NUEVO: estado de carga
  loadingMessage?: string            // NUEVO: mensaje de carga

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
  overlay: "fixed inset-0 z-50 bg-black/60 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-200",
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
  closeOnEscape = true,
  disableClose = false,
  description,
  className,
  overlayClassName,
  contentClassName,
  onClose,
  onOpen
}: BaseModalProps) {
  const variantColors = getModalVariantColor(variant)
  const VariantIcon = MODAL_TYPE_ICONS[variant]

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
            // Borde izquierdo colorido
            showAccentBar && variantColors.border,
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
              <DialogPrimitive.Close className={cn(
                "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-all hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-10",
                "hover:bg-muted/50",
                variantColors.text,
                "hover:scale-110"
              )}>
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

// Subcomponentes igual que antes...
```

### 7.3 ModalHeader Mejorado

```tsx
interface ModalHeaderProps {
  title: React.ReactNode
  description?: string
  showBorder?: boolean
  className?: string
  
  // Nuevas props
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
  const variantColors = getModalVariantColor(variant)
  const DefaultIcon = MODAL_TYPE_ICONS[variant]
  const IconComponent = icon || (showIcon ? DefaultIcon : null)

  return (
    <div
      className={cn(
        "relative flex flex-col space-y-1.5 p-6 overflow-hidden",
        showBorder && "border-b border-border/50",
        // Fondo con gradiente sutil
        variantColors.light,
        showAccentBar && "border-l-4 border-l-current",
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
      
      {IconComponent && (
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
```

---

## 9. Estructura Consistente de Modales (Homologación)

### 9.1 Análisis de Estructura Actual

Al igual que los módulos del dashboard, los modales tienen inconsistencias en su estructura interna. Esta sección establece una guía de estilo uniforme para todos los modales de la aplicación.

| Modal | Archivo | Header | Footer | Separator | Icono |
|-------|---------|--------|--------|-----------|-------|
| ProjectModal | `module/ProjectModal.tsx` | Simple | Actions | border-b | No |
| CreateTicketModal | `module/CreateTicketModal.tsx` | Simple | Actions | border-b | No |
| CreateTaskModal | `module/CreateTaskModal.tsx` | Simple | Actions | border-b | No |
| EmpresaModal | `module/EmpresaModal.tsx` | Simple | Actions | border-b | No |
| CreateContactoModal | `module/CreateContactoModal.tsx` | Simple | Actions | border-b | No |
| UploadModal | `module/UploadModal.tsx` | Con icono | Actions | border-b | Sí |
| ConfirmDeleteModal | `module/ConfirmDeleteModal.tsx` | Con icono | Actions | No | Sí |

### 9.2 Problemas Identificados

1. **Header inconsistente**: Algunos tienen icono, otros no
2. **Footer sin variantes**: Todos usan el mismo estilo
3. **Separadores variables**: Algunos tienen border, otros no
4. **Sin sección de metadata**: No hay espacio uniforme para información adicional
5. **Acciones desalineadas**: Posición不一致 de botones

### 9.3 Estructura Estándar Propuesta

```
┌─────────────────────────────────────────────────────────────────┐
│ [Icono]  [Título]                            [Cerrar X]         │
│          [Descripción opcional]                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [Form Fields]                                                  │
│  - Input groups con labels                                      │
│  - Selects con opciones                                        │
│  - Textareas para descripciones                                 │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│ [Metadata Section - opcional]                                   │
│ Información adicional: fechas, estados, etiquetas               │
├─────────────────────────────────────────────────────────────────┤
│ [Información adicional]              [Cancelar]  [Guardar]      │
└─────────────────────────────────────────────────────────────────┘
```

### 9.4 Especificaciones de Estructura

| Sección | Posición | Especificaciones |
|---------|----------|------------------|
| Header | Superior | Icono 32x32, Título, Descripción, Botón cerrar |
| Body | Centro | Form fields, Grid, Metadata opcional |
| Footer | Inferior | Acciones, Loading state |

### 9.5 Patrón de Props Uniforme

```typescript
interface ModalProps<T> {
  open: boolean
  onOpenChange: (open: boolean) => void
  data?: T | null           // Datos para editar (null = crear)
  onSave: (data: T) => void
  isSaving?: boolean
  errors?: Record<string, string>
  variant?: ModalVariant
  size?: ModalSize
}
```

### 9.6 Guía por Tipo de Modal

| Tipo | variant | Título | Icono |
|------|---------|--------|-------|
| Crear | `create` | "Nuevo {Entidad}" | Plus |
| Editar | `edit` | "Editar {Entidad}" | Edit3 |
| Ver | `view` | "Detalle {Entidad}" | Eye |
| Eliminar | `danger` | "Confirmar Eliminación" | AlertTriangle |

### 9.7 Componentes a Crear/Actualizar

| Componente | Acción |
|------------|--------|
| BaseModal | Añadir props de variante, loading |
| ModalHeader | Soporte icono, variante, barra acento |
| ModalBody | Soporte sección metadata |
| ModalFooter | Soporte acciones loading |
| ModalSection | NUEVO - Helper para secciones |
| ModalActions | NUEVO - Grupo de acciones |
| ModalField | NUEVO - Label + Input agrupados |

---

## 10. Resumen de Cambios

| Prioridad | Cambio | Impacto |
|-----------|--------|---------|
| Alta | Añadir prop `variant` a BaseModal | Personalización visual |
| Alta | Crear `constants/modales.ts` | Centraliza configuración |
| Alta | Definir estructura consistente | Homologación visual |
| Media | Mejorar overlay con backdrop-blur | UX mejorada |
| Media | Añadir estado `isLoading` | Feedback de carga |
| Media | Actualizar todos los modales | Consistencia visual |

---

## 11. Próximos Pasos para Implementación

1. **Crear archivo de constantes** - `src/constants/modales.ts`
2. **Actualizar BaseModal.tsx** - Añadir props de variante y estados
3. **Actualizar ModalHeader** - Soporte para iconos y colores
4. **Actualizar ModalFooter** - Variante de estilos
5. **Crear helpers** - ModalSection, ModalActions, ModalField
6. **Migrar modales existentes** - Aplicar variantes según tipo
7. **Probar y validar** - Verificar funcionamiento y accesibilidad
