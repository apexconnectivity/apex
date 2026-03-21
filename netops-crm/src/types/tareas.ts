export type CategoriaTarea = 'Comercial' | 'Técnica' | 'Compras' | 'Administrativa' | 'General'

export type PrioridadTarea = 'Baja' | 'Media' | 'Alta' | 'Urgente'

export type EstadoTarea = 'Pendiente' | 'En progreso' | 'Completada' | 'Bloqueada'

export type TipoDependencia = 'bloqueante' | 'inicio_despues' | 'fin_despues'

/**
 * Etiquetas amigables para tipos de dependencia
 */
export const TIPO_DEPENDENCIA_LABELS: Record<TipoDependencia, { label: string; description: string }> = {
  bloqueante: { 
    label: 'Bloqueante', 
    description: 'La tarea dependiente no puede iniciar hasta que esta tarea esté completada' 
  },
  inicio_despues: { 
    label: 'Inicio después', 
    description: 'La tarea dependiente inicia N días después de que esta tarea inicie' 
  },
  fin_despues: { 
    label: 'Fin después', 
    description: 'La tarea dependiente inicia N días después de que esta tarea finalice' 
  },
}

export interface Dependencia {
  tarea_id: string
  tipo: TipoDependencia
  dias_desplazamiento?: number
}

export interface Tarea {
  id: string
  proyecto_id: string
  proyecto_nombre: string
  fase_origen: number
  fase_nombre: string
  categoria: CategoriaTarea
  nombre: string
  descripcion?: string
  responsable_id?: string
  responsable_nombre?: string
  asignado_a_cliente: boolean
  contacto_cliente_id?: string
  contacto_cliente_nombre?: string
  fecha_creacion: string
  fecha_vencimiento?: string
  fecha_completado?: string
  prioridad: PrioridadTarea
  estado: EstadoTarea
  orden: number
  dependencias?: Dependencia[]
  creado_por: string
  es_plantilla?: boolean
  subtareas?: Subtarea[]
}

export interface Subtarea {
  id: string
  tarea_id: string
  nombre: string
  completada: boolean
  orden: number
  fecha_completado?: string
}

export interface Comentario {
  id: string
  tarea_id: string
  usuario_id: string
  usuario_nombre: string
  es_cliente: boolean
  comentario: string
  fecha: string
}

export const CATEGORIAS: CategoriaTarea[] = ['Comercial', 'Técnica', 'Compras', 'Administrativa', 'General']

export const PRIORIDADES: PrioridadTarea[] = ['Baja', 'Media', 'Alta', 'Urgente']

export const ESTADOS: EstadoTarea[] = ['Pendiente', 'En progreso', 'Completada', 'Bloqueada']

// ============================================================================
// TIPOS DE CONTACTO DE CLIENTE
// ============================================================================

/**
 * Tipos de contacto de cliente según el spec de TAREAS v2
 * Se usa cuando una tarea está asignada a cliente
 */
export type TipoContactoCliente = 
  | 'Técnico' 
  | 'Administrativo' 
  | 'Financiero' 
  | 'Compras' 
  | 'Comercial' 
  | 'Soporte' 
  | 'Otro' 
  | 'Principal'

export const TIPOS_CONTACTO_CLIENTE: TipoContactoCliente[] = [
  'Principal',
  'Técnico',
  'Administrativo',
  'Financiero',
  'Compras',
  'Comercial',
  'Soporte',
  'Otro',
]

// ============================================================================
// TIPOS DE ORIGEN DE TAREA
// ============================================================================

export type OrigenTarea = 'plantilla' | 'manual' | 'recurrente'

// ============================================================================
// INTERVALOS DE RECURRENCIA
// ============================================================================

export type IntervaloRecurrencia = 'Diario' | 'Semanal' | 'Mensual' | 'Personalizado'

export const INTERVALOS_RECURRENCIA: IntervaloRecurrencia[] = ['Diario', 'Semanal', 'Mensual', 'Personalizado']

// ============================================================================
// TAREA RECURRENTE (Configuración)
// ============================================================================

/**
 * Configuración para generar tareas recurrentes automáticamente
 */
export interface TareaRecurrente {
  id: string
  proyecto_id: string | null // null si es global
  categoria: CategoriaTarea
  nombre: string
  descripcion?: string
  responsable_default?: string // UUID del usuario por defecto
  asignar_a_cliente: boolean
  tipo_contacto?: TipoContactoCliente // obligatorio si asignar_a_cliente = true
  intervalo: IntervaloRecurrencia
  intervalo_dias?: number // si es personalizado, cada cuántos días
  dia_especifico?: {
    tipo: 'dia_mes' | 'dia_semana'
    valor: number | string
  }
  proxima_generacion: string // ISO date
  generar_con_vencimiento_dias?: number // +N días desde generación
  activa: boolean
  ultima_generacion?: string // ISO date
  veces_generada: number
  creada_por: string
  fecha_creacion: string
}

// ============================================================================
// ARCHIVO TAREA (relación con Módulo 6)
// ============================================================================

/**
 * Relación entre tarea y archivos adjuntos
 */
export interface ArchivoTarea {
  id: string
  tarea_id: string
  archivo_id: string // Referencia al archivo en Drive
  subido_por: string // UUID del usuario
  fecha: string // ISO timestamp
}

// ============================================================================
// AGRUPACIONES DEL DASHBOARD PERSONAL
// ============================================================================

/**
 * Agrupaciones automáticas para el Dashboard Personal "Mis Tareas"
 * Según RN-TAR-24
 */
export type GrupoDashboardTareas = 
  | 'vencen_hoy' 
  | 'proximos_7_dias' 
  | 'en_progreso' 
  | 'sin_vencimiento' 
  | 'completadas_recientes'

export const GRUPOS_DASHBOARD: { key: GrupoDashboardTareas; label: string; orden: number }[] = [
  { key: 'vencen_hoy', label: 'Vencen Hoy', orden: 1 },
  { key: 'proximos_7_dias', label: 'Próximos 7 días', orden: 2 },
  { key: 'en_progreso', label: 'En Progreso', orden: 3 },
  { key: 'sin_vencimiento', label: 'Sin Vencimiento', orden: 4 },
  { key: 'completadas_recientes', label: 'Completadas Recientes', orden: 5 },
]

// ============================================================================
// TIPO DE VISUALIZACIÓN DE TAREAS
// ============================================================================

export type VistaTareas = 'kanban' | 'fases' | 'gantt' | 'lista'

export const VISTAS_TAREAS: { key: VistaTareas; label: string }[] = [
  { key: 'kanban', label: 'Kanban' },
  { key: 'fases', label: 'Por Fases' },
  { key: 'gantt', label: 'Gantt' },
  { key: 'lista', label: 'Lista' },
]

// Plantillas de tareas por fase
export interface SubtareaPlantilla {
  nombre: string
}

export interface PlantillaTarea {
  id: string
  fase_id: number
  nombre: string
  descripcion?: string
  categoria: CategoriaTarea
  prioridad: PrioridadTarea
  dias_vencimiento: number // días desde que entra en la fase
  requiere_cliente: boolean // si requiere participación del cliente
  tipo_contacto?: 'comercial' | 'tecnico' // tipo de contacto del cliente
  subtareas: SubtareaPlantilla[] // subtareas a crear
}

export const PLANTILLAS_POR_FASE: PlantillaTarea[] = [
  // ===== FASE 1: PROSPECTO (20%) =====
  {
    id: 'p1-1',
    fase_id: 1,
    nombre: 'Llamada inicial',
    descripcion: 'Contacto inicial con el prospecto para presentar servicios',
    categoria: 'Comercial',
    prioridad: 'Alta',
    dias_vencimiento: 3,
    requiere_cliente: true,
    tipo_contacto: 'comercial',
    subtareas: [
      { nombre: 'Preparar guión de llamada' },
      { nombre: 'Realizar llamada de descubrimiento' },
      { nombre: 'Documentar interés inicial' },
    ],
  },
  {
    id: 'p1-2',
    fase_id: 1,
    nombre: 'Enviar presentación',
    descripcion: 'Enviar presentación corporativa al prospecto',
    categoria: 'Comercial',
    prioridad: 'Alta',
    dias_vencimiento: 5,
    requiere_cliente: true,
    tipo_contacto: 'comercial',
    subtareas: [
      { nombre: 'Personalizar presentación' },
      { nombre: 'Enviar por email' },
      { nombre: 'Solicitar acuse de recibo' },
    ],
  },
  {
    id: 'p1-3',
    fase_id: 1,
    nombre: 'Calificar interés',
    descripcion: 'Evaluar si el prospecto es viable',
    categoria: 'Comercial',
    prioridad: 'Alta',
    dias_vencimiento: 7,
    requiere_cliente: true,
    tipo_contacto: 'comercial',
    subtareas: [
      { nombre: 'Evaluar presupuesto' },
      { nombre: 'Identificar timeline' },
      { nombre: 'Confirmar fit con servicios' },
    ],
  },

  // ===== FASE 2: DIAGNÓSTICO (40%) =====
  {
    id: 'p2-1',
    fase_id: 2,
    nombre: 'Coordinar visita',
    descripcion: 'Programar y confirmar visita técnica',
    categoria: 'Técnica',
    prioridad: 'Alta',
    dias_vencimiento: 3,
    requiere_cliente: true,
    tipo_contacto: 'tecnico',
    subtareas: [
      { nombre: 'Agendar fecha/hora' },
      { nombre: 'Enviar confirmación' },
      { nombre: 'Preparar logística' },
    ],
  },
  {
    id: 'p2-2',
    fase_id: 2,
    nombre: 'Auditoría in-situ',
    descripcion: 'Análisis de infraestructura existente',
    categoria: 'Técnica',
    prioridad: 'Alta',
    dias_vencimiento: 7,
    requiere_cliente: true,
    tipo_contacto: 'tecnico',
    subtareas: [
      { nombre: 'Revisar infraestructura actual' },
      { nombre: 'Entrevistar personal técnico' },
      { nombre: 'Documentar hallazgos' },
    ],
  },
  {
    id: 'p2-3',
    fase_id: 2,
    nombre: 'Solicitar diagramas',
    descripcion: 'Obtener documentación técnica del cliente',
    categoria: 'Técnica',
    prioridad: 'Media',
    dias_vencimiento: 10,
    requiere_cliente: true,
    tipo_contacto: 'tecnico',
    subtareas: [
      { nombre: 'Enviar solicitud formal' },
      { nombre: 'Dar plazo de entrega' },
      { nombre: 'Seguimiento' },
    ],
  },
  {
    id: 'p2-4',
    fase_id: 2,
    nombre: 'Redactar informe',
    descripcion: 'Elaborar informe de diagnóstico técnico',
    categoria: 'Técnica',
    prioridad: 'Alta',
    dias_vencimiento: 14,
    requiere_cliente: false,
    subtareas: [
      { nombre: 'Compilar hallazgos' },
      { nombre: 'Elaborar recomendaciones' },
      { nombre: 'Presentar al cliente' },
    ],
  },

  // ===== FASE 3: PROPUESTA (70%) =====
  {
    id: 'p3-1',
    fase_id: 3,
    nombre: 'Elaborar propuesta',
    descripcion: 'Crear propuesta comercial y técnica',
    categoria: 'Comercial',
    prioridad: 'Alta',
    dias_vencimiento: 5,
    requiere_cliente: false,
    subtareas: [
      { nombre: 'Definir alcance' },
      { nombre: 'Calcular costos' },
      { nombre: 'Redactar documento' },
    ],
  },
  {
    id: 'p3-2',
    fase_id: 3,
    nombre: 'Enviar a cliente',
    descripcion: 'Presentar propuesta al cliente',
    categoria: 'Comercial',
    prioridad: 'Alta',
    dias_vencimiento: 7,
    requiere_cliente: true,
    tipo_contacto: 'comercial',
    subtareas: [
      { nombre: 'Enviar propuesta' },
      { nombre: 'Agendar reunión de presentación' },
    ],
  },
  {
    id: 'p3-3',
    fase_id: 3,
    nombre: 'Negociar ajustes',
    descripcion: 'Gestionar comentarios y ajustes a la propuesta',
    categoria: 'Comercial',
    prioridad: 'Alta',
    dias_vencimiento: 12,
    requiere_cliente: true,
    tipo_contacto: 'comercial',
    subtareas: [
      { nombre: 'Recibir comentarios' },
      { nombre: 'Ajustar alcance/precio' },
      { nombre: 'Reenviar propuesta' },
    ],
  },
  {
    id: 'p3-4',
    fase_id: 3,
    nombre: 'Obtener firma',
    descripcion: 'Conseguir aprobación formal del cliente',
    categoria: 'Comercial',
    prioridad: 'Alta',
    dias_vencimiento: 15,
    requiere_cliente: true,
    tipo_contacto: 'comercial',
    subtareas: [
      { nombre: 'Enviar contrato' },
      { nombre: 'Seguimiento' },
      { nombre: 'Obtener firma' },
    ],
  },

  // ===== FASE 4: IMPLEMENTACIÓN (90%) =====
  {
    id: 'p4-1',
    fase_id: 4,
    nombre: 'Configurar equipos',
    descripcion: 'Preparación e instalación de equipos',
    categoria: 'Técnica',
    prioridad: 'Alta',
    dias_vencimiento: 10,
    requiere_cliente: false,
    subtareas: [
      { nombre: 'Preparar configuraciones' },
      { nombre: 'Instalar equipos' },
      { nombre: 'Verificar conectividad' },
    ],
  },
  {
    id: 'p4-2',
    fase_id: 4,
    nombre: 'Migrar servicios',
    descripcion: 'Transición de servicios existentes',
    categoria: 'Técnica',
    prioridad: 'Alta',
    dias_vencimiento: 18,
    requiere_cliente: true,
    tipo_contacto: 'tecnico',
    subtareas: [
      { nombre: 'Planificar ventana de migración' },
      { nombre: 'Ejecutar migración' },
      { nombre: 'Verificar funcionamiento' },
    ],
  },
  {
    id: 'p4-3',
    fase_id: 4,
    nombre: 'Pruebas internas',
    descripcion: 'Validación de servicios implementados',
    categoria: 'Técnica',
    prioridad: 'Alta',
    dias_vencimiento: 22,
    requiere_cliente: false,
    subtareas: [
      { nombre: 'Pruebas de funcionalidad' },
      { nombre: 'Pruebas de rendimiento' },
      { nombre: 'Documentar resultados' },
    ],
  },
  {
    id: 'p4-4',
    fase_id: 4,
    nombre: 'Documentar cambios',
    descripcion: 'Actualizar documentación técnica',
    categoria: 'Técnica',
    prioridad: 'Media',
    dias_vencimiento: 25,
    requiere_cliente: false,
    subtareas: [
      { nombre: 'Actualizar diagramas' },
      { nombre: 'Documentar configuraciones' },
      { nombre: 'Crear manual de operaciones' },
    ],
  },

  // ===== FASE 5: CIERRE Y ENTREGA (100%) =====
  {
    id: 'p5-1',
    fase_id: 5,
    nombre: 'Capacitar usuario',
    descripcion: 'Capacitación al cliente sobre servicios entregados',
    categoria: 'Técnica',
    prioridad: 'Media',
    dias_vencimiento: 5,
    requiere_cliente: true,
    tipo_contacto: 'tecnico',
    subtareas: [
      { nombre: 'Preparar material' },
      { nombre: 'Realizar capacitación' },
      { nombre: 'Absolver dudas' },
    ],
  },
  {
    id: 'p5-2',
    fase_id: 5,
    nombre: 'Entregar documentación',
    descripcion: 'Entregar documentación final al cliente',
    categoria: 'Técnica',
    prioridad: 'Alta',
    dias_vencimiento: 7,
    requiere_cliente: true,
    tipo_contacto: 'comercial',
    subtareas: [
      { nombre: 'Compilar documentación' },
      { nombre: 'Entregar credenciales' },
      { nombre: 'Firmar acta de entrega' },
    ],
  },
  {
    id: 'p5-3',
    fase_id: 5,
    nombre: 'Facturar',
    descripcion: 'Generar y enviar factura final',
    categoria: 'Administrativa',
    prioridad: 'Alta',
    dias_vencimiento: 10,
    requiere_cliente: false,
    subtareas: [
      { nombre: 'Generar factura final' },
      { nombre: 'Enviar al cliente' },
      { nombre: 'Seguimiento de pago' },
    ],
  },
  {
    id: 'p5-4',
    fase_id: 5,
    nombre: 'Activar soporte',
    descripcion: 'Configurar soporte post-venta',
    categoria: 'Técnica',
    prioridad: 'Baja',
    dias_vencimiento: 14,
    requiere_cliente: true,
    tipo_contacto: 'tecnico',
    subtareas: [
      { nombre: 'Crear cuenta en portal' },
      { nombre: 'Configurar monitoreo' },
      { nombre: 'Asignar equipo de soporte' },
    ],
  },
]
