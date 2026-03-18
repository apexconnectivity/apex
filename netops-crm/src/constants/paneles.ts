/**
 * Constantes y tipos para el sistema de paneles laterales (SidePanels)
 * Proporciona colores y configuraciones reutilizables para los paneles de
 * Proyectos, Tareas, Soporte y CRM
 * 
 * Uso:
 * import { SIDE_PANEL_VARIANT_COLORS, getSidePanelVariantColor, type SidePanelVariant } from '@/constants/paneles'
 */

import { APP_COLORS } from './colors'

// ============================================================================
// TIPOS
// ============================================================================

/**
 * Variantes de color para los SidePanels
 * Cada variante tiene un color distintivo que indica el tipo de módulo
 */
export type SidePanelVariant =
  | 'project'   // Esmeralda - Proyectos
  | 'task'      // Azul - Tareas
  | 'ticket'    // Ámbar - Tickets/Soporte
  | 'empresa'   // Cian - Empresas/CRM
  | 'default'   // Gris - Propósito general

/**
 * Configuración de color para una variante de SidePanel
 */
export interface SidePanelVariantColors {
  primary: string      // Color principal (hex)
  light: string        // Clase para fondo claro
  text: string         // Clase para texto
  border: string       // Clase para borde izquierdo
  iconBg: string       // Clase para fondo del icono
  gradient: string     // Clase para gradiente
}

// ============================================================================
// CONFIGURACIÓN DE COLORES POR VARIANTE
// ============================================================================

/**
 * Paleta de colores para cada variante de SidePanel
 * Usa colores consistentes con el sistema de diseño existente
 */
export const SIDE_PANEL_VARIANT_COLORS: Record<SidePanelVariant, SidePanelVariantColors> = {
  project: {
    primary: APP_COLORS.success,
    light: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-l-emerald-500',
    iconBg: 'bg-emerald-500/20',
    gradient: 'from-emerald-500/20',
  },
  task: {
    primary: APP_COLORS.info,
    light: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-l-blue-500',
    iconBg: 'bg-blue-500/20',
    gradient: 'from-blue-500/20',
  },
  ticket: {
    primary: APP_COLORS.warning,
    light: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-l-amber-500',
    iconBg: 'bg-amber-500/20',
    gradient: 'from-amber-500/20',
  },
  empresa: {
    primary: APP_COLORS.primary,
    light: 'bg-cyan-500/10',
    text: 'text-cyan-400',
    border: 'border-l-cyan-500',
    iconBg: 'bg-cyan-500/20',
    gradient: 'from-cyan-500/20',
  },
  default: {
    primary: APP_COLORS.neutral,
    light: 'bg-slate-500/10',
    text: 'text-slate-400',
    border: 'border-l-slate-500',
    iconBg: 'bg-slate-500/20',
    gradient: 'from-slate-500/20',
  }
}

// ============================================================================
// FUNCIONES HELPER
// ============================================================================

/**
 * Obtiene la configuración de colores para una variante específica de SidePanel
 * Si la variante no existe, retorna la variante default
 * 
 * @param variant - Variante del SidePanel
 * @returns Configuración de colores para la variante
 */
export function getSidePanelVariantColor(variant: SidePanelVariant): SidePanelVariantColors {
  return SIDE_PANEL_VARIANT_COLORS[variant] || SIDE_PANEL_VARIANT_COLORS.default
}
