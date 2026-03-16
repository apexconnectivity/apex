'use client'

import { useState, useEffect, useCallback } from 'react'
import { type ProyectoArchivado, type ProyectoCerrado, type ConfigArchivado } from '@/types/archivado'

// ============================================================================
// Keys para localStorage
// ============================================================================
const STORAGE_KEYS = {
  ARCHIVADOS: 'netops_proyectos_archivados',
  PROYECTOS_CERRADOS: 'netops_proyectos_cerrados',
  CONFIG_ARCHIVADO: 'netops_config_archivado',
} as const

// ============================================================================
// Seed de datos iniciales para desarrollo
// ============================================================================
const DEMO_CONFIG_SEED: ConfigArchivado = {
  archivado_automatico: false,
  dias_antes_notificacion: 30,
  incluir_tickets: false,
  generar_pdf: true,
  eliminar_tareas: true,
  eliminar_reuniones: true,
  eliminar_archivos: true,
  carpeta_raiz: '/Archivo Histórico',
}

const DEMO_PROYECTOS_CERRADOS_SEED: ProyectoCerrado[] = [
  {
    id: 'c1',
    nombre: 'Implementación WiFi Corporativo',
    empresa_nombre: 'RetailMax',
    fase_actual: 5,
    fase_nombre: 'CIERRE',
    fecha_cierre: '2026-02-15',
    dias_cerrado: 28,
    motivo_cierre: 'Proyecto completado exitosamente',
    tareas_fase5_completadas: 5,
    tareas_fase5_totales: 5,
  },
  {
    id: 'c2',
    nombre: 'Actualización Servidores',
    empresa_nombre: 'Hospital Regional Norte',
    fase_actual: 4,
    fase_nombre: 'IMPLEMENTACIÓN',
    fecha_cierre: '2026-01-20',
    dias_cerrado: 54,
    motivo_cierre: 'Cancelado por el cliente',
    tareas_fase5_completadas: 2,
    tareas_fase5_totales: 8,
  },
]

const DEMO_PROYECTOS_ARCHIVADOS_SEED: ProyectoArchivado[] = [
  {
    id: 'a1',
    proyecto_original_id: 'p1',
    empresa_id: '1',
    empresa_nombre: 'Soluciones Tecnológicas SA',
    nombre: 'Auditoría de Seguridad 2025',
    clasificacion: 'completado',
    fecha_cierre: '2025-12-15',
    fecha_archivado: '2026-01-15',
    motivo_cierre: 'Proyecto completado exitosamente',
    drive_carpeta_id: 'drive123',
    drive_carpeta_link: '#',
    archivo_json_link: '#',
    archivo_pdf_link: '#',
    tamaño_archivo_mb: 45,
    archivado_por: 'Carlos Admin',
    duracion_dias: 90,
    tareas_completadas: 24,
    tareas_totales: 24,
    tickets_count: 5,
    reuniones_count: 8,
    archivos_count: 15,
  },
  {
    id: 'a2',
    proyecto_original_id: 'p2',
    empresa_id: '2',
    empresa_nombre: 'TechCorp International',
    nombre: 'Migración a Cloud',
    clasificacion: 'inconcluso',
    fecha_cierre: '2025-11-10',
    fecha_archivado: '2025-12-10',
    motivo_cierre: 'Cancelado por el cliente',
    drive_carpeta_id: 'drive456',
    drive_carpeta_link: '#',
    archivo_json_link: '#',
    archivo_pdf_link: undefined,
    tamaño_archivo_mb: 120,
    archivado_por: 'Carlos Admin',
    duracion_dias: 60,
    tareas_completadas: 15,
    tareas_totales: 28,
    tickets_count: 12,
    reuniones_count: 4,
    archivos_count: 8,
  },
  {
    id: 'a3',
    proyecto_original_id: 'p3',
    empresa_id: '3',
    empresa_nombre: 'Banco Nacional',
    nombre: 'Implementación VPN',
    clasificacion: 'completado',
    fecha_cierre: '2025-10-20',
    fecha_archivado: '2025-11-20',
    motivo_cierre: 'Proyecto completado exitosamente',
    drive_carpeta_id: 'drive789',
    drive_carpeta_link: '#',
    archivo_json_link: '#',
    archivo_pdf_link: '#',
    tamaño_archivo_mb: 85,
    archivado_por: 'Carlos Admin',
    duracion_dias: 120,
    tareas_completadas: 32,
    tareas_totales: 32,
    tickets_count: 8,
    reuniones_count: 15,
    archivos_count: 22,
  },
]

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
  const [config, setConfig] = useState<ConfigArchivado>(DEMO_CONFIG_SEED)
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
        setProyectosArchivados(JSON.parse(storedArchivados) as ProyectoArchivado[])
      } else {
        localStorage.setItem(STORAGE_KEYS.ARCHIVADOS, JSON.stringify(DEMO_PROYECTOS_ARCHIVADOS_SEED))
        setProyectosArchivados(DEMO_PROYECTOS_ARCHIVADOS_SEED)
      }

      // Cargar proyectos cerrados
      const storedCerrados = localStorage.getItem(STORAGE_KEYS.PROYECTOS_CERRADOS)
      if (storedCerrados) {
        setProyectosCerrados(JSON.parse(storedCerrados) as ProyectoCerrado[])
      } else {
        localStorage.setItem(STORAGE_KEYS.PROYECTOS_CERRADOS, JSON.stringify(DEMO_PROYECTOS_CERRADOS_SEED))
        setProyectosCerrados(DEMO_PROYECTOS_CERRADOS_SEED)
      }

      // Cargar configuración
      const storedConfig = localStorage.getItem(STORAGE_KEYS.CONFIG_ARCHIVADO)
      if (storedConfig) {
        setConfig(JSON.parse(storedConfig) as ConfigArchivado)
      } else {
        localStorage.setItem(STORAGE_KEYS.CONFIG_ARCHIVADO, JSON.stringify(DEMO_CONFIG_SEED))
        setConfig(DEMO_CONFIG_SEED)
      }
    } catch (error) {
      console.error('Error loading archivado data from localStorage:', error)
      // En caso de error, usar datos por defecto
      setProyectosArchivados([])
      setProyectosCerrados([])
      setConfig(DEMO_CONFIG_SEED)
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
  // Función para restaurar un proyecto (solo actualiza estado local)
  // ==========================================================================
  const restaurarProyecto = useCallback((id: string): void => {
    // Buscar el proyecto archivado
    const proyecto = proyectosArchivados.find((p) => p.id === id)
    
    if (proyecto) {
      // Crear un proyecto cerrado a partir del archivado
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

      // Agregar a proyectos cerrados
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

      // Eliminar de proyectos archivados
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
