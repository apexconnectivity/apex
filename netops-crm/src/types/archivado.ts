export type Clasificacion = 'completado' | 'inconcluso'

export interface ProyectoArchivado {
  id: string
  proyecto_original_id: string
  empresa_id: string
  empresa_nombre: string
  nombre: string
  clasificacion: Clasificacion
  fecha_cierre: string
  fecha_archivado: string
  motivo_cierre: string
  drive_carpeta_id: string
  drive_carpeta_link: string
  archivo_json_link: string
  archivo_pdf_link?: string
  tamaño_archivo_mb: number
  archivado_por: string
  duracion_dias: number
  tareas_completadas: number
  tareas_totales: number
  tickets_count: number
  reuniones_count: number
  archivos_count: number
}

export interface ConfigArchivado {
  archivado_automatico: boolean
  dias_antes_notificacion: number
  incluir_tickets: boolean
  generar_pdf: boolean
  eliminar_tareas: boolean
  eliminar_reuniones: boolean
  eliminar_archivos: boolean
  carpeta_raiz: string
}

export interface ProyectoCerrado {
  id: string
  nombre: string
  empresa_nombre: string
  fase_actual: number
  fase_nombre: string
  fecha_cierre: string
  dias_cerrado: number
  motivo_cierre: string
  tareas_fase5_completadas: number
  tareas_fase5_totales: number
}

export const getClasificacionColor = (clasificacion: Clasificacion): string => {
  return clasificacion === 'completado' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'
}
