'use client'

import { useState, useEffect, useCallback } from 'react'
import { type ProyectoArchivado, type ProyectoCerrado, type ConfigArchivado } from '@/types/archivado'

// ============================================================================
// Keys para localStorage - Valores originales para compatibilidad
// ============================================================================

const STORAGE_KEYS = {
  ARCHIVADOS: 'netops_proyectos_archivados',
  PROYECTOS_CERRADOS: 'netops_proyectos_cerrados',
  CONFIG_ARCHIVADO: 'netops_config_archivado',
} as const

// ============================================================================
// Datos demo para testing
// ============================================================================

const PROYECTOS_CERRADOS_DEMO: ProyectoCerrado[] = [
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
]

const PROYECTOS_ARCHIVADOS_DEMO: ProyectoArchivado[] = [
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
]

const CONFIG_VACIA: ConfigArchivado = {
  archivado_automatico: false,
  dias_antes_notificacion: 30,
  incluir_tickets: false,
  generar_pdf: true,
  eliminar_tareas: true,
  eliminar_reuniones: true,
  eliminar_archivos: true,
  carpeta_raiz: '/Archivo Histórico',
}

// ============================================================================
// Hook para gestionar proyectos archivados en localStorage
// ============================================================================

export interface UseArchivadoStorageReturn {
  proyectosCerrados: ProyectoCerrado[]
  proyectosArchivados: ProyectoArchivado[]
  config: ConfigArchivado
  loading: boolean
  addProyectoArchivado: (proyecto: ProyectoArchivado) => void
  removeProyectoArchivado: (id: string) => void
  restaurarProyecto: (id: string) => void
  updateConfig: (config: ConfigArchivado) => void
}

export function useArchivadoStorage(): UseArchivadoStorageReturn {
  const [proyectosCerrados, setProyectosCerrados] = useState<ProyectoCerrado[]>([])
  const [proyectosArchivados, setProyectosArchivados] = useState<ProyectoArchivado[]>([])
  const [config, setConfig] = useState<ConfigArchivado>(CONFIG_VACIA)
  const [loading, setLoading] = useState(true)

  // ==========================================================================
  // Cargar datos desde localStorage al inicializar
  // ==========================================================================
  useEffect(() => {
    if (typeof window === 'undefined') {
      setLoading(false)
      return
    }

    try {
      // Cargar proyectos archivados
      const storedArchivados = localStorage.getItem(STORAGE_KEYS.ARCHIVADOS)
      if (storedArchivados) {
        const parsed = JSON.parse(storedArchivados) as ProyectoArchivado[]
        setProyectosArchivados(parsed.length > 0 ? parsed : PROYECTOS_ARCHIVADOS_DEMO)
      } else {
        localStorage.setItem(STORAGE_KEYS.ARCHIVADOS, JSON.stringify(PROYECTOS_ARCHIVADOS_DEMO))
        setProyectosArchivados(PROYECTOS_ARCHIVADOS_DEMO)
      }

      // Cargar proyectos cerrados
      const storedCerrados = localStorage.getItem(STORAGE_KEYS.PROYECTOS_CERRADOS)
      if (storedCerrados) {
        const parsed = JSON.parse(storedCerrados) as ProyectoCerrado[]
        setProyectosCerrados(parsed.length > 0 ? parsed : PROYECTOS_CERRADOS_DEMO)
      } else {
        localStorage.setItem(STORAGE_KEYS.PROYECTOS_CERRADOS, JSON.stringify(PROYECTOS_CERRADOS_DEMO))
        setProyectosCerrados(PROYECTOS_CERRADOS_DEMO)
      }

      // Cargar configuración
      const storedConfig = localStorage.getItem(STORAGE_KEYS.CONFIG_ARCHIVADO)
      if (storedConfig) {
        setConfig(JSON.parse(storedConfig) as ConfigArchivado)
      } else {
        localStorage.setItem(STORAGE_KEYS.CONFIG_ARCHIVADO, JSON.stringify(CONFIG_VACIA))
        setConfig(CONFIG_VACIA)
      }
    } catch (error) {
      console.error('Error loading archivado data from localStorage:', error)
      setProyectosArchivados(PROYECTOS_ARCHIVADOS_DEMO)
      setProyectosCerrados(PROYECTOS_CERRADOS_DEMO)
      setConfig(CONFIG_VACIA)
    } finally {
      setLoading(false)
    }
  }, [])

  // ==========================================================================
  // Función para generar ID único
  // ==========================================================================
  const generateId = useCallback((): string => {
    return `arch_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  }, [])

  // ==========================================================================
  // Función para archivar un proyecto
  // ==========================================================================
  const addProyectoArchivado = useCallback((proyecto: ProyectoArchivado): void => {
    const proyectoConId: ProyectoArchivado = {
      ...proyecto,
      id: proyecto.id || generateId(),
    }

    setProyectosArchivados((prev) => {
      const updated = [...prev, proyectoConId]

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEYS.ARCHIVADOS, JSON.stringify(updated))
        } catch (error) {
          console.error('Error saving proyecto archivado to localStorage:', error)
        }
      }

      return updated
    })

    // Eliminar de proyectos cerrados si existe
    setProyectosCerrados((prev) => {
      const updated = prev.filter((p) => p.id !== proyecto.proyecto_original_id)

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEYS.PROYECTOS_CERRADOS, JSON.stringify(updated))
        } catch (error) {
          console.error('Error updating proyectos cerrados in localStorage:', error)
        }
      }

      return updated
    })
  }, [generateId])

  // ==========================================================================
  // Función para eliminar un proyecto archivado
  // ==========================================================================
  const removeProyectoArchivado = useCallback((id: string): void => {
    setProyectosArchivados((prev) => {
      const updated = prev.filter((proyecto) => proyecto.id !== id)

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEYS.ARCHIVADOS, JSON.stringify(updated))
        } catch (error) {
          console.error('Error removing proyecto archivado from localStorage:', error)
        }
      }

      return updated
    })
  }, [])

  // ==========================================================================
  // Función para restaurar un proyecto
  // ==========================================================================
  const restaurarProyecto = useCallback((id: string): void => {
    const proyecto = proyectosArchivados.find((p) => p.id === id)

    if (proyecto) {
      const proyectoRestaurado: ProyectoCerrado = {
        id: `rest_${proyecto.id}`,
        nombre: proyecto.nombre,
        empresa_nombre: proyecto.empresa_nombre,
        fase_actual: 5,
        fase_nombre: 'CIERRE',
        fecha_cierre: proyecto.fecha_cierre,
        dias_cerrado: 0,
        motivo_cierre: proyecto.motivo_cierre,
        tareas_fase5_completadas: proyecto.tareas_completadas,
        tareas_fase5_totales: proyecto.tareas_totales,
      }

      setProyectosCerrados((prev) => {
        const updated = [...prev, proyectoRestaurado]

        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(STORAGE_KEYS.PROYECTOS_CERRADOS, JSON.stringify(updated))
          } catch (error) {
            console.error('Error restoring proyecto to proyectos cerrados:', error)
          }
        }

        return updated
      })

      removeProyectoArchivado(id)
    }
  }, [proyectosArchivados, removeProyectoArchivado])

  // ==========================================================================
  // Función para actualizar la configuración
  // ==========================================================================
  const updateConfig = useCallback((newConfig: ConfigArchivado): void => {
    setConfig(newConfig)

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEYS.CONFIG_ARCHIVADO, JSON.stringify(newConfig))
      } catch (error) {
        console.error('Error saving config to localStorage:', error)
      }
    }
  }, [])

  return {
    proyectosCerrados,
    proyectosArchivados,
    config,
    loading,
    addProyectoArchivado,
    removeProyectoArchivado,
    restaurarProyecto,
    updateConfig,
  }
}

// ============================================================================
// Exportar keys para uso externo si es necesario
// ============================================================================

export { STORAGE_KEYS as ARCHIVADO_STORAGE_KEYS }
