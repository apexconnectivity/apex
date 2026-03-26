/**
 * ============================================
 * Hook Genérico para Estadísticas de Módulo
 * ============================================
 * 
 * Hook centralizado que calcula estadísticas para cualquier entidad del CRM.
 * Elimina la lógica duplicada en múltiples páginas.
 */

import { useMemo } from 'react'

import type { Tarea } from '@/types/tareas'
import type { Proyecto } from '@/types/proyectos'
import type { Ticket } from '@/types/soporte'
import type { Empresa } from '@/types/crm'

// Tipo genérico base para cualquier entidad (sin index signature)
type Entity = Tarea | Proyecto | Ticket | Empresa | Record<string, unknown>

// Configuración de qué métricas calcular
interface StatsConfig {
  countByEstado?: boolean
  countByPrioridad?: boolean
  countByCategoria?: boolean
  countByFase?: boolean
  countOverdue?: boolean
  total?: boolean
}

// Métricas calculadas
interface ModuleStats {
  total: number
  // Por estado
  pendientes?: number
  enProgreso?: number
  completadas?: number
  bloqueadas?: number
  // Por prioridad
  alta?: number
  media?: number
  baja?: number
  // Por categoría (mapa)
  porCategoria?: Record<string, number>
  // Por fase (mapa)
  porFase?: Record<number, number>
  // Vencidas
  overdue?: number
  // Raw counts
  counts?: Record<string, number>
}

/**
 * Hook genérico para calcular estadísticas de cualquier módulo
 * @param data - Array de entidades
 * @param config - Configuración de qué métricas calcular
 * @returns Objeto con estadísticas calculadas
 */
export function useModuleStats<T extends Entity>(
  data: T[],
  config: StatsConfig = {}
): ModuleStats {
  const {
    countByEstado = true,
    countByPrioridad = false,
    countByCategoria = false,
    countByFase = false,
    countOverdue = true,
    total = true
  } = config

  // Helper para obtener valor de cualquier objeto de forma segura
  const getValue = (obj: T, key: string): unknown => {
    return (obj as Record<string, unknown>)[key]
  }

  return useMemo(() => {
    const result: ModuleStats = {
      total: total ? data.length : 0
    }

    const now = new Date()

    // Contar por estado (soporta ambos formatos: estado/estado_tarea)
    if (countByEstado) {
      const counts: Record<string, number> = {}
      
      data.forEach(item => {
        const estado = String(getValue(item, 'estado') || getValue(item, 'estado_tarea') || 'Desconocido')
        counts[estado] = (counts[estado] || 0) + 1
      })
      
      result.counts = counts
      result.pendientes = counts['Pendiente'] || counts['Abierto'] || 0
      result.enProgreso = counts['En progreso'] || 0
      result.completadas = counts['Completada'] || counts['Resuelto'] || counts['Cerrado'] || 0
      result.bloqueadas = counts['Bloqueada'] || 0
    }

    // Contar por prioridad
    if (countByPrioridad) {
      const priorities: Record<string, number> = {}
      
      data.forEach(item => {
        const prioridad = String(getValue(item, 'prioridad') || 'Media')
        priorities[prioridad] = (priorities[prioridad] || 0) + 1
      })
      
      result.alta = priorities['alta'] || priorities['Alta'] || 0
      result.media = priorities['media'] || priorities['Media'] || 0
      result.baja = priorities['baja'] || priorities['Baja'] || 0
    }

    // Contar por categoría
    if (countByCategoria) {
      const categorias: Record<string, number> = {}
      
      data.forEach(item => {
        const categoria = String(getValue(item, 'categoria') || 'Sin categoría')
        categorias[categoria] = (categorias[categoria] || 0) + 1
      })
      
      result.porCategoria = categorias
    }

    // Contar por fase
    if (countByFase) {
      const fases: Record<number, number> = {}
      
      data.forEach(item => {
        const fase = Number(getValue(item, 'fase_actual')) || 1
        fases[fase] = (fases[fase] || 0) + 1
      })
      
      result.porFase = fases
    }

    // Contar vencidas
    if (countOverdue) {
      result.overdue = data.filter(item => {
        const fechaVencimiento = getValue(item, 'fecha_vencimiento')
        if (!fechaVencimiento) return false
        const vencimiento = new Date(String(fechaVencimiento))
        const estado = String(getValue(item, 'estado') || getValue(item, 'estado_tarea'))
        return vencimiento < now && estado !== 'Completada' && estado !== 'Resuelto' && estado !== 'Cerrado'
      }).length
    }

    return result
  }, [data, countByEstado, countByPrioridad, countByCategoria, countByFase, countOverdue, total])
}

// ============================================================================
// Hooks específicos por tipo de entidad
// ============================================================================

/**
 * Hook específico para estadísticas de tareas
 * Configuración optimizada para el tipo Tarea
 */
export function useTareasStats(tareas: Tarea[]) {
  return useModuleStats(tareas, {
    countByEstado: true,
    countByPrioridad: true,
    countByCategoria: true,
    countOverdue: true,
    total: true
  })
}

/**
 * Hook específico para estadísticas de proyectos
 * Configuración optimizada para el tipo Proyecto
 */
export function useProyectosStats(proyectos: Proyecto[]) {
  return useModuleStats(proyectos, {
    countByFase: true,
    total: true
  })
}

/**
 * Hook específico para estadísticas de tickets
 * Configuración optimizada para el tipo Ticket
 * Usa fecha_limite_resolucion para overdue
 */
export function useTicketsStats(tickets: Ticket[]) {
  // Transformar tickets para que usen fecha_vencimiento
  const transformedTickets = useMemo(() => {
    return tickets.map(ticket => ({
      ...ticket,
      fecha_vencimiento: ticket.fecha_limite_resolucion
    }))
  }, [tickets])

  return useModuleStats(transformedTickets, {
    countByEstado: true,
    countOverdue: true,
    total: true
  })
}

/**
 * Hook específico para estadísticas de empresas
 * Configuración básica solo para total
 */
export function useEmpresasStats(empresas: Empresa[]) {
  return useModuleStats(empresas, {
    total: true
  })
}
