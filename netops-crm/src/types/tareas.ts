export type CategoriaTarea = 'Comercial' | 'Técnica' | 'Compras' | 'Administrativa' | 'General'

export type PrioridadTarea = 'Baja' | 'Media' | 'Alta' | 'Urgente'

export type EstadoTarea = 'Pendiente' | 'En progreso' | 'Completada' | 'Bloqueada'

export type TipoDependencia = 'bloqueante' | 'inicio_despues' | 'fin_despues'

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

export const getPrioridadColor = (prioridad: PrioridadTarea) => {
  const colors = {
    Baja: 'bg-slate-500/20 text-slate-400',
    Media: 'bg-blue-500/20 text-blue-400',
    Alta: 'bg-amber-500/20 text-amber-400',
    Urgente: 'bg-red-500/20 text-red-400',
  }
  return colors[prioridad]
}

export const getCategoriaColor = (categoria: CategoriaTarea) => {
  const colors = {
    Comercial: 'bg-purple-500/20 text-purple-400',
    Técnica: 'bg-green-500/20 text-green-400',
    Compras: 'bg-amber-500/20 text-amber-400',
    Administrativa: 'bg-cyan-500/20 text-cyan-400',
    General: 'bg-slate-500/20 text-slate-400',
  }
  return colors[categoria]
}

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
