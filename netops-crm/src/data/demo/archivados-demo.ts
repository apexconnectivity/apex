/**
 * ============================================
 * Datos Demo para Pruebas Locales
 * ============================================
 * Estos datos se usan para poblar la app cuando
 * no hay datos en localStorage.
 * 
 * PARA USO EN DESARROLLO/PRUEBAS LOCALES ÚNICAMENTE
 * 
 * Para producción: estos datos deben estar vacíos o
 * cargarse desde Supabase
 */

import type { ProyectoArchivado, ProyectoCerrado } from '@/types/archivado'

/**
 * Proyectos cerrados demo
 * Para testing del módulo de archivado
 */
export const PROYECTOS_CERRADOS_DEMO: ProyectoCerrado[] = [
  {
    id: 'proj_001',
    nombre: 'Sistema de Gestión ERP',
    empresa_nombre: 'TechCorp Solutions',
    fase_actual: 5,
    fase_nombre: 'CIERRE',
    fecha_cierre: '2024-12-15',
    dias_cerrado: 45,
    motivo_cierre: 'Proyecto completado exitosamente',
    tareas_fase5_completadas: 8,
    tareas_fase5_totales: 8,
  },
  {
    id: 'proj_002',
    nombre: 'App Mobile Cliente',
    empresa_nombre: 'Retail Plus',
    fase_actual: 5,
    fase_nombre: 'CIERRE',
    fecha_cierre: '2025-01-20',
    dias_cerrado: 25,
    motivo_cierre: 'Entrega parcial - fase 1 completada',
    tareas_fase5_completadas: 5,
    tareas_fase5_totales: 10,
  },
  {
    id: 'proj_003',
    nombre: 'Migración Cloud AWS',
    empresa_nombre: 'DataSystems SA',
    fase_actual: 5,
    fase_nombre: 'CIERRE',
    fecha_cierre: '2025-02-10',
    dias_cerrado: 5,
    motivo_cierre: 'Proyecto cancelado por cliente',
    tareas_fase5_completadas: 3,
    tareas_fase5_totales: 12,
  },
  {
    id: 'proj_004',
    nombre: 'Portal Corporativo',
    empresa_nombre: 'Grupo Financiero',
    fase_actual: 5,
    fase_nombre: 'CIERRE',
    fecha_cierre: '2024-11-30',
    dias_cerrado: 60,
    motivo_cierre: 'Proyecto completado exitosamente',
    tareas_fase5_completadas: 15,
    tareas_fase5_totales: 15,
  },
]

/**
 * Proyectos archivados demo
 * Para testing del módulo de archivado
 */
export const PROYECTOS_ARCHIVADOS_DEMO: ProyectoArchivado[] = [
  {
    id: 'arch_001',
    proyecto_original_id: 'old_proj_001',
    empresa_id: '1',
    empresa_nombre: 'TechCorp Solutions',
    nombre: 'Sistema de Gestión ERP - Fase 1',
    clasificacion: 'completado',
    fecha_cierre: '2024-12-15',
    fecha_archivado: '2024-12-20T10:00:00Z',
    motivo_cierre: 'Proyecto completado exitosamente',
    drive_carpeta_id: 'drive_001',
    drive_carpeta_link: '#',
    archivo_json_link: '#',
    tamaño_archivo_mb: 256,
    archivado_por: 'Admin',
    duracion_dias: 120,
    tareas_completadas: 45,
    tareas_totales: 45,
    tickets_count: 23,
    reuniones_count: 15,
    archivos_count: 89,
  },
  {
    id: 'arch_002',
    proyecto_original_id: 'old_proj_002',
    empresa_id: '2',
    empresa_nombre: 'DataSystems SA',
    nombre: 'Migración Cloud AWS',
    clasificacion: 'inconcluso',
    fecha_cierre: '2025-02-10',
    fecha_archivado: '2025-02-15T14:30:00Z',
    motivo_cierre: 'Proyecto cancelado por cliente',
    drive_carpeta_id: 'drive_002',
    drive_carpeta_link: '#',
    archivo_json_link: '#',
    tamaño_archivo_mb: 45,
    archivado_por: 'Admin',
    duracion_dias: 60,
    tareas_completadas: 18,
    tareas_totales: 40,
    tickets_count: 8,
    reuniones_count: 12,
    archivos_count: 34,
  },
]

/**
 * Función para verificar si estamos en modo demo
 * En producción, esto debería retornar false
 */
export function isDemoMode(): boolean {
  // Por defecto, retornar false para producción
  // Esto puede configurarse mediante variable de entorno
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
}

/**
 * Función para obtener datos demo si está habilitado
 * Útil para testing sin datos reales
 */
export function getDemoData<T>(key: string): T[] | null {
  if (!isDemoMode()) return null

  switch (key) {
    case 'proyectos_cerrados':
      return PROYECTOS_CERRADOS_DEMO as unknown as T[]
    case 'proyectos_archivados':
      return PROYECTOS_ARCHIVADOS_DEMO as unknown as T[]
    default:
      return null
  }
}
