/**
 * Constantes y tipos para el sistema de modales
 * Proporciona colores, iconos y configuraciones reutilizables
 * 
 * Uso:
 * import { MODAL_VARIANT_COLORS, getModalVariantColor, type ModalVariant } from '@/constants/modales'
 */

import { LucideIcon } from 'lucide-react'
import { APP_COLORS } from '@/lib/colors'
import { COMMON_BUTTONS, COMMON_MESSAGES } from './common_text'
import {
  Plus,
  Edit3,
  Eye,
  AlertTriangle,
  AlertCircle,
  Info,
  Upload,
  Building2,
  User,
  Ticket,
  CheckSquare,
  FolderOpen,
  Trash2,
  FileText,
  Users,
  Briefcase,
  Calendar,
  ShoppingCart,
  Bell,
  Settings,
  X
} from 'lucide-react'

// ============================================================================
// TIPOS
// ============================================================================

/**
 * Variantes de color para los modales
 * Cada variante tiene un color distintivo que indica el tipo de operación
 */
export type ModalVariant =
  | 'default'   // Cian - propósito general
  | 'create'   // Esmeralda - crear nuevos registros
  | 'edit'      // Azul - editar registros existentes
  | 'view'      // Cian - ver detalles
  | 'danger'    // Rojo - eliminar/peligro
  | 'warning'   // Ámbar - advertencias
  | 'info'      // Violeta - información

/**
 * Tamaños disponibles para los modales
 */
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'

/**
 * Layout del footer del modal
 */
export type ModalFooterLayout = 'stack' | 'inline' | 'inline-between'

/**
 * Configuración de color para una variante
 */
export interface ModalVariantColors {
  primary: string      // Color principal (hex)
  light: string        // Clase para fondo claro
  border: string       // Clase para bordes
  text: string        // Clase para texto
  iconBg: string       // Clase para fondo del icono
  gradient: string     // Clase para gradiente
  ring: string         // Clase para ring de focus
}

// ============================================================================
// CONFIGURACIÓN DE COLORES POR VARIANTE
// ============================================================================

/**
 * Paleta de colores para cada variante de modal
 * Usa colores consistentes con el sistema de diseño existente
 */
export const MODAL_VARIANT_COLORS: Record<ModalVariant, ModalVariantColors> = {
  default: {
    primary: APP_COLORS.primary,
    light: 'bg-cyan-500/[0.08]',
    border: 'border-cyan-500/30',
    text: 'text-cyan-400',
    iconBg: 'bg-cyan-500/10',
    gradient: 'from-cyan-500/20 to-transparent',
    ring: 'focus:ring-cyan-500',
  },
  create: {
    primary: APP_COLORS.success,
    light: 'bg-emerald-500/[0.08]',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    iconBg: 'bg-emerald-500/10',
    gradient: 'from-emerald-500/20 to-transparent',
    ring: 'focus:ring-emerald-500',
  },
  edit: {
    primary: APP_COLORS.info,
    light: 'bg-blue-500/[0.08]',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    iconBg: 'bg-blue-500/10',
    gradient: 'from-blue-500/20 to-transparent',
    ring: 'focus:ring-blue-500',
  },
  view: {
    primary: APP_COLORS.primary,
    light: 'bg-cyan-500/[0.08]',
    border: 'border-cyan-500/30',
    text: 'text-cyan-400',
    iconBg: 'bg-cyan-500/10',
    gradient: 'from-cyan-500/20 to-transparent',
    ring: 'focus:ring-cyan-500',
  },
  danger: {
    primary: APP_COLORS.danger,
    light: 'bg-red-500/[0.08]',
    border: 'border-red-500/30',
    text: 'text-red-400',
    iconBg: 'bg-red-500/10',
    gradient: 'from-red-500/20 to-transparent',
    ring: 'focus:ring-red-500',
  },
  warning: {
    primary: APP_COLORS.warning,
    light: 'bg-amber-500/[0.08]',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    iconBg: 'bg-amber-500/10',
    gradient: 'from-amber-500/20 to-transparent',
    ring: 'focus:ring-amber-500',
  },
  info: {
    primary: APP_COLORS.purple,
    light: 'bg-violet-500/[0.08]',
    border: 'border-violet-500/30',
    text: 'text-violet-400',
    iconBg: 'bg-violet-500/10',
    gradient: 'from-violet-500/20 to-transparent',
    ring: 'focus:ring-violet-500',
  },
}

// ============================================================================
// ICONOS POR VARIANTE
// ============================================================================

/**
 * Iconos predeterminados para cada variante
 */
export const MODAL_VARIANT_ICONS: Record<ModalVariant, LucideIcon> = {
  default: Info,
  create: Plus,
  edit: Edit3,
  view: Eye,
  danger: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

// ============================================================================
// ICONOS POR MÓDULO/CONTEXTO
// ============================================================================

/**
 * Iconos para diferentes tipos de entidad/contexto
 */
export const MODAL_MODULE_ICONS: Record<string, LucideIcon> = {
  // CRM
  empresa: Building2,
  empresas: Building2,
  contacto: User,
  contactos: Users,

  // Proyectos
  proyecto: Briefcase,
  proyectos: Briefcase,
  pipeline: CheckSquare,

  // Tareas
  tarea: CheckSquare,
  tareas: CheckSquare,
  subtarea: CheckSquare,

  // Tickets/Soporte
  ticket: Ticket,
  tickets: Ticket,
  soporte: AlertCircle,

  // Archivos
  archivo: FileText,
  archivos: FolderOpen,
  upload: Upload,
  descargar: Upload,

  // Otros módulos
  usuario: User,
  usuarios: Users,
  calendario: Calendar,
  reuniones: Calendar,
  compras: ShoppingCart,
  proveedores: Building2,
  notificaciones: Bell,
  configuracion: Settings,

  // Acciones
  eliminar: Trash2,
  cerrar: X,
}

// ============================================================================
// MAPA DE TAMAÑOS
// ============================================================================

/**
 * Clases de tamaño para el modal
 */
export const MODAL_SIZE_CLASSES: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  '2xl': 'max-w-5xl',
  '3xl': 'max-w-6xl',
  full: 'max-w-[95vw] max-h-[95vh]',
}

// ============================================================================
// MAPA DE LAYOUTS DE FOOTER
// ============================================================================

/**
 * Clases de layout para el footer
 */
export const MODAL_FOOTER_LAYOUTS: Record<ModalFooterLayout, string> = {
  stack: 'flex flex-col-reverse gap-2',
  inline: 'flex flex-row gap-2',
  'inline-between': 'flex flex-row justify-end gap-2',
}

// ============================================================================
// ETIQUETAS ESTÁNDAR
// ============================================================================

/**
 * Etiquetas estándar para modales
 */
export const MODAL_LABELS = {
  // Acciones - usar constantes comunes
  guardar: COMMON_BUTTONS.guardar,
  cancelar: COMMON_BUTTONS.cancelar,
  cerrar: COMMON_BUTTONS.cerrar,
  crear: COMMON_BUTTONS.crear,
  editar: COMMON_BUTTONS.editar,
  eliminar: COMMON_BUTTONS.eliminar,
  actualizar: COMMON_BUTTONS.actualizar,

  // Estados
  guardando: COMMON_MESSAGES.guardando,
  cargando: COMMON_MESSAGES.cargando,
  procesando: 'Procesando...',

  // Campos obligatorios
  requerido: 'Campo obligatorio',
  opcional: 'Opcional',

  // Confirmaciones
  confirmar: COMMON_BUTTONS.confirmar,
  estasSeguro: COMMON_MESSAGES.confirmEliminar,
  accionNoReversible: COMMON_MESSAGES.accionNoReversible,

  // Éxito/Error
  exitoso: COMMON_MESSAGES.guardadoExito,
  error: COMMON_MESSAGES.errorGuardar,
  errorGuardar: COMMON_MESSAGES.errorGuardar,
  errorCargar: 'Error al cargar los datos',
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Obtiene la configuración de color para una variante
 */
export function getModalVariantColor(variant: ModalVariant): ModalVariantColors {
  return MODAL_VARIANT_COLORS[variant] || MODAL_VARIANT_COLORS.default
}

/**
 * Obtiene el icono para una variante
 */
export function getModalVariantIcon(variant: ModalVariant): LucideIcon {
  return MODAL_VARIANT_ICONS[variant] || MODAL_VARIANT_ICONS.default
}

/**
 * Obtiene el icono para un módulo/contexto específico
 */
export function getModuleIcon(module: string): LucideIcon {
  const key = module.toLowerCase()
  return MODAL_MODULE_ICONS[key] || Info
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

/**
 * Obtiene las clases de tamaño para un modal
 */
export function getModalSizeClass(size: ModalSize): string {
  return MODAL_SIZE_CLASSES[size] || MODAL_SIZE_CLASSES.md
}

/**
 * Obtiene las clases de layout para el footer
 */
export function getModalFooterLayoutClass(layout: ModalFooterLayout): string {
  return MODAL_FOOTER_LAYOUTS[layout] || MODAL_FOOTER_LAYOUTS.inline
}

/**
 * Determina si una variante es de \"peligro\"
 */
export function isDangerVariant(variant: ModalVariant): boolean {
  return variant === 'danger'
}

/**
 * Obtiene el color de overlay según la variante
 */
export function getOverlayClass(variant: ModalVariant): string {
  const base = 'fixed inset-0 z-50 backdrop-blur-md'

  switch (variant) {
    case 'danger':
      return `${base} bg-red-950/60`
    case 'warning':
      return `${base} bg-amber-950/60`
    case 'create':
      return `${base} bg-emerald-950/60`
    case 'edit':
      return `${base} bg-blue-950/60`
    default:
      return `${base} bg-black/60`
  }
}

// ============================================================================
// CLASES DE ANIMACIÓN
// ============================================================================

/**
 * Clases de animación para el modal
 */
export const MODAL_ANIMATIONS = {
  overlay: {
    open: 'animate-in fade-in duration-200',
    closed: 'animate-out fade-out duration-200',
  },
  content: {
    open: 'animate-in zoom-in-95 duration-300 fade-in',
    closed: 'animate-out zoom-out-95 duration-200 fade-out',
    slide: {
      open: 'slide-in-from-bottom-4',
      closed: 'slide-out-to-bottom-4',
    },
  },
}

/**
 * Obtiene las clases de animación para el overlay
 */
export function getOverlayAnimation(open: boolean): string {
  return open ? MODAL_ANIMATIONS.overlay.open : MODAL_ANIMATIONS.overlay.closed
}

/**
 * Obtiene las clases de animación para el contenido
 */
export function getContentAnimation(open: boolean): string {
  return open ? MODAL_ANIMATIONS.content.open : MODAL_ANIMATIONS.content.closed
}
