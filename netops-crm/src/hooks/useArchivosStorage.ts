'use client'

import { useState, useEffect, useCallback } from 'react'
import { type Archivo, type EntidadTipo, type Visibilidad } from '@/types/archivos'

// ============================================================================
// Keys para localStorage
// ============================================================================
const STORAGE_KEYS = {
  ARCHIVOS: 'netops_archivos',
} as const

// ============================================================================
// Seed de datos iniciales para desarrollo
// ============================================================================
const DEMO_ARCHIVOS_SEED: Archivo[] = [
  {
    id: '1',
    drive_file_id: 'abc123',
    nombre_original: 'contrato_marco.pdf',
    nombre_guardado: '2026-01-15_contrato_marco.pdf',
    mime_type: 'application/pdf',
    tamaño_bytes: 2450000,
    drive_view_link: '#',
    drive_download_link: '#',
    drive_embed_link: undefined,
    ruta_completa: '/Clientes Activos/Soluciones Tecnológicas SA/Corporativo/Interno/',
    entidad_tipo: 'empresa' as EntidadTipo,
    entidad_id: '1',
    visibilidad: 'interno' as Visibilidad,
    subido_por: '1',
    subido_por_nombre: 'Carlos Admin',
    fecha_subida: '2026-01-15T10:30:00',
  },
  {
    id: '2',
    drive_file_id: 'def456',
    nombre_original: 'diagrama_red.pdf',
    nombre_guardado: '2026-02-01_diagrama_red.pdf',
    mime_type: 'application/pdf',
    tamaño_bytes: 850000,
    drive_view_link: '#',
    drive_download_link: '#',
    drive_embed_link: undefined,
    ruta_completa: '/Clientes Activos/Soluciones Tecnológicas SA/Implementación Firewall Corp/Entregables Cliente/',
    entidad_tipo: 'proyecto' as EntidadTipo,
    entidad_id: '1',
    visibilidad: 'interno' as Visibilidad,
    subido_por: '2',
    subido_por_nombre: 'Laura Pérez',
    fecha_subida: '2026-02-01T14:20:00',
  },
  {
    id: '3',
    drive_file_id: 'ghi789',
    nombre_original: 'config_firewall.conf',
    nombre_guardado: '2026-02-10_config_firewall.conf',
    mime_type: 'application/octet-stream',
    tamaño_bytes: 15000,
    drive_view_link: '#',
    drive_download_link: '#',
    drive_embed_link: undefined,
    ruta_completa: '/Clientes Activos/Soluciones Tecnológicas SA/Implementación Firewall Corp/Internos/',
    entidad_tipo: 'proyecto' as EntidadTipo,
    entidad_id: '1',
    visibilidad: 'interno' as Visibilidad,
    subido_por: '3',
    subido_por_nombre: 'Juan Técnico',
    fecha_subida: '2026-02-10T09:15:00',
  },
  {
    id: '4',
    drive_file_id: 'jkl012',
    nombre_original: 'factura_2026-02.pdf',
    nombre_guardado: '2026-02-28_factura_2026-02.pdf',
    mime_type: 'application/pdf',
    tamaño_bytes: 125000,
    drive_view_link: '#',
    drive_download_link: '#',
    drive_embed_link: undefined,
    ruta_completa: '/Clientes Activos/Soluciones Tecnológicas SA/Implementación Firewall Corp/Facturas/',
    entidad_tipo: 'proyecto' as EntidadTipo,
    entidad_id: '1',
    visibilidad: 'interno' as Visibilidad,
    subido_por: '1',
    subido_por_nombre: 'Carlos Admin',
    fecha_subida: '2026-02-28T16:00:00',
  },
  {
    id: '5',
    drive_file_id: 'mno345',
    nombre_original: 'catalogo_equipos.pdf',
    nombre_guardado: '2026-01-20_catalogo_equipos.pdf',
    mime_type: 'application/pdf',
    tamaño_bytes: 5600000,
    drive_view_link: '#',
    drive_download_link: '#',
    drive_embed_link: undefined,
    ruta_completa: '/Proveedores/Distribuidor Mayorista SA/Corporativo/Interno/',
    entidad_tipo: 'empresa' as EntidadTipo,
    entidad_id: '4',
    visibilidad: 'interno' as Visibilidad,
    subido_por: '4',
    subido_por_nombre: 'María Compras',
    fecha_subida: '2026-01-20T11:00:00',
  },
  {
    id: '6',
    drive_file_id: 'pqr678',
    nombre_original: 'requisitos_usuarios.docx',
    nombre_guardado: '2026-03-01_requisitos_usuarios.docx',
    mime_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    tamaño_bytes: 45000,
    drive_view_link: '#',
    drive_download_link: '#',
    drive_embed_link: undefined,
    ruta_completa: '/Clientes Activos/Soluciones Tecnológicas SA/Implementación Firewall Corp/Entregables Cliente/',
    entidad_tipo: 'proyecto' as EntidadTipo,
    entidad_id: '1',
    visibilidad: 'publico' as Visibilidad,
    subido_por: '2',
    subido_por_nombre: 'Laura Pérez',
    fecha_subida: '2026-03-01T08:30:00',
  },
]

// ============================================================================
// Tipo para datos de archivo sin ID generado (ruta_completa es opcional)
// ============================================================================
export type ArchivoInput = Omit<Archivo, 'id' | 'drive_file_id' | 'nombre_guardado' | 'drive_view_link' | 'drive_download_link' | 'drive_embed_link' | 'fecha_subida'> & { ruta_completa?: string }

// ============================================================================
// Hook para gestionar archivos en localStorage
// ============================================================================
export interface UseArchivosStorageReturn {
  archivos: Archivo[]
  loading: boolean
  addArchivo: (archivo: ArchivoInput) => void
  removeArchivo: (id: string) => void
  clearArchivos: () => void
}

export function useArchivosStorage(): UseArchivosStorageReturn {
  const [archivos, setArchivos] = useState<Archivo[]>([])
  const [loading, setLoading] = useState(true)

  // ==========================================================================
  // Cargar archivos desde localStorage al inicializar
  // ==========================================================================
  useEffect(() => {
    if (typeof window === 'undefined') {
      setLoading(false)
      return
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ARCHIVOS)
      
      if (stored) {
        const parsed = JSON.parse(stored) as Archivo[]
        setArchivos(parsed)
      } else {
        // Inicializar con datos demo si no hay datos
        localStorage.setItem(STORAGE_KEYS.ARCHIVOS, JSON.stringify(DEMO_ARCHIVOS_SEED))
        setArchivos(DEMO_ARCHIVOS_SEED)
      }
    } catch (error) {
      console.error('Error loading archivos from localStorage:', error)
      setArchivos([])
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
  // Función para agregar un archivo
  // ==========================================================================
  const addArchivo = useCallback((archivo: ArchivoInput): void => {
    const now = new Date().toISOString()
    const newArchivo: Archivo = {
      ...archivo,
      id: generateId(),
      drive_file_id: `drive_${generateId()}`,
      nombre_guardado: `${now.split('T')[0]}_${archivo.nombre_original}`,
      drive_view_link: '#',
      drive_download_link: '#',
      // Usar la ruta proporcionada o valor por defecto
      ruta_completa: archivo.ruta_completa || '/Sin asignar/',
      fecha_subida: now,
    }

    setArchivos((prev) => {
      const updated = [...prev, newArchivo]
      
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEYS.ARCHIVOS, JSON.stringify(updated))
        } catch (error) {
          console.error('Error saving archivo to localStorage:', error)
        }
      }
      
      return updated
    })
  }, [generateId])

  // ==========================================================================
  // Función para eliminar un archivo
  // ==========================================================================
  const removeArchivo = useCallback((id: string): void => {
    setArchivos((prev) => {
      const updated = prev.filter((archivo) => archivo.id !== id)
      
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEYS.ARCHIVOS, JSON.stringify(updated))
        } catch (error) {
          console.error('Error removing archivo from localStorage:', error)
        }
      }
      
      return updated
    })
  }, [])

  // ==========================================================================
  // Función para limpiar todos los archivos (para testing)
  // ==========================================================================
  const clearArchivos = useCallback((): void => {
    setArchivos([])
    
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEYS.ARCHIVOS)
      } catch (error) {
        console.error('Error clearing archivos from localStorage:', error)
      }
    }
  }, [])

  return {
    archivos,
    loading,
    addArchivo,
    removeArchivo,
    clearArchivos,
  }
}

// ============================================================================
// Exportar keys para uso externo si es necesario
// ============================================================================
export { STORAGE_KEYS as ARCHIVOS_STORAGE_KEYS }
