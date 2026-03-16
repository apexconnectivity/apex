/**
 * Constantes centralizadas para el módulo de Soporte
 * Todos los textos hardcodeados deben estar aquí para facilitar mantenimiento e internacionalización
 */

// ============================================
// TÍTULOS Y DESCRIPCIONES
// ============================================

export const SOPORTE_TITULOS = {
  titulo: 'Soporte',
  descripcion: 'Tickets y contratos de soporte',
  accesoRestringido: 'Acceso Restringido',
} as const

// ============================================
// TABS
// ============================================

export const SOPORTE_TABS = {
  tickets: 'Tickets',
  contratos: 'Contratos',
} as const

// ============================================
// ESTADÍSTICAS
// ============================================

export const SOPORTE_STATS = {
  total: 'Total',
  abiertos: 'Abiertos',
  enProgreso: 'En Progreso',
  resueltos: 'Resueltos',
  cerrados: 'Cerrados',
  urgentes: 'Urgentes',
} as const

// ============================================
// FILTROS
// ============================================

export const SOPORTE_FILTROS = {
  cliente: 'Cliente:',
  responsable: 'Responsable:',
  estado: 'Estado:',
  categoria: 'Categoría:',
  prioridad: 'Prioridad:',
  desde: 'Desde:',
  hasta: 'Hasta:',
  todos: 'Todos',
  todas: 'Todas',
  limpiar: 'Limpiar',
} as const

// ============================================
// OPCIONES DE SELECTORES
// ============================================

export const SOPORTE_SELECTORES = {
  todos: 'Todos',
  todas: 'Todas',
} as const

// ============================================
// BOTONES
// ============================================

export const SOPORTE_BOTONES = {
  nuevoTicket: 'Nuevo Ticket',
  nuevoContrato: 'Nuevo Contrato',
} as const

// ============================================
// ESTADOS VACÍOS
// ============================================

export const SOPORTE_EMPTY = {
  noHayTickets: 'No hay tickets',
} as const

// ============================================
// CONTRATOS
// ============================================

export const SOPORTE_CONTRATOS = {
  inicio: 'Inicio',
  fin: 'Fin',
  tecnico: 'Técnico',
  horas: 'Horas',
  horasConsumidasMes: 'Horas consumidas este mes',
  sinAsignar: 'Sin asignar',
} as const

// ============================================
// DETALLE DEL TICKET - LABELS
// ============================================

export const TICKET_DETALLE = {
  titulo: 'Detalles del Ticket',
  contrato: 'Contrato',
  abiertoPor: 'Abierto por',
  responsable: 'Responsable',
  apertura: 'Apertura',
  tiempo: 'Tiempo',
  cerrado: 'Cerrado',
  slaIncumplido: 'SLA de respuesta INCUMPLIDO',
} as const

// ============================================
// DETALLE DEL TICKET - BOTONES DE ACCIÓN
// ============================================

export const TICKET_ACCIONES = {
  iniciarTrabajo: 'Iniciar trabajo',
  esperarCliente: 'Esperar cliente',
  marcarResuelto: 'Marcar resuelto',
  cerrarTicket: 'Cerrar ticket',
} as const

// ============================================
// COMENTARIOS
// ============================================

export const TICKET_COMENTARIOS = {
  titulo: 'Comentarios',
  noHayComentarios: 'No hay comentarios aún',
  placeholder: 'Escribir comentario...',
  interno: 'Comentario interno',
  agregar: 'Agregar',
} as const

// ============================================
// LABELS DEL DETALLE DEL TICKET
// ============================================

export const TICKET_LABELS = {
  contrato: 'Contrato',
  estado: 'Estado',
  prioridad: 'Prioridad',
  creado: 'Creado',
  responsable: 'Responsable',
  sla: 'SLA',
  noEspecificada: 'No especificada',
  sinAsignar: 'Sin asignar',
} as const

// ============================================
// ESTADO VACÍO DEL PANEL
// ============================================

export const TICKET_PANEL_EMPTY = {
  seleccionarTicket: 'Selecciona un ticket para ver detalles',
} as const

// ============================================
// CREATE TICKET MODAL
// ============================================

export const CREATE_TICKET_MODAL = {
  tituloCrear: 'Nuevo Ticket',
  tituloEditar: 'Editar Ticket',
  tituloCliente: 'Nuevo Ticket de Soporte',
  labels: {
    cliente: 'Cliente *',
    tipoTicket: 'Tipo de ticket',
    contrato: 'Contrato *',
    proyecto: 'Proyecto',
    categoria: 'Categoría *',
    prioridad: 'Prioridad',
    estado: 'Estado',
    responsable: 'Responsable',
    titulo: 'Título *',
    descripcion: 'Descripción *',
    fechaEjecucion: 'Fecha de ejecución programada',
  },
  placeholders: {
    seleccionarCliente: 'Seleccionar cliente...',
    seleccionarContrato: 'Seleccionar contrato...',
    seleccionarProyecto: 'Seleccionar proyecto...',
    seleccionarResponsable: 'Seleccionar responsable...',
    resumenProblema: 'Resumen del problema',
    descripcionProblema: 'Descripción detallada del problema',
  },
  opciones: {
    contratoSoporte: 'Contrato de Soporte',
    proyecto: 'Proyecto',
  },
  botones: {
    crear: 'Crear',
    guardar: 'Guardar',
    enviar: 'Enviar',
    eliminar: 'Eliminar',
    cancelar: 'Cancelar',
  },
  alertas: {
    sinContratos: 'No hay contratos de soporte activos.',
    crearContratoPrimero: 'Crea un contrato primero.',
    sinEmpresas: 'No hay empresas clientes disponibles.',
    crearEmpresaPrimero: 'Crea una empresa primero.',
    sinContratosAlerta: 'El cliente no tiene contratos de soporte activos',
  },
  sugerencias: {
    seAsignara: 'Se asignará automáticamente a:',
  },
  ayuda: {
    fechaEjecucion: 'Opcional. Define la ventana de trabajo para ejecutar el ticket.',
  },
} as const

// ============================================
// CREATE CONTRACT MODAL
// ============================================

export const CREATE_CONTRACT_MODAL = {
  tituloCrear: 'Nuevo Contrato de Soporte',
  tituloEditar: 'Editar Contrato',
  labels: {
    empresa: 'Empresa *',
    nombre: 'Nombre del contrato *',
    tipo: 'Tipo',
    estado: 'Estado',
    fechaInicio: 'Fecha inicio *',
    fechaFin: 'Fecha fin *',
    montoMensual: 'Monto mensual',
    horasIncluidas: 'Horas incluidas/mes',
    moneda: 'Moneda',
    tecnicoAsignado: 'Técnico asignado',
    notas: 'Notas',
    renovacionAutomatica: 'Renovación automática',
  },
  placeholders: {
    seleccionarEmpresa: 'Seleccionar empresa...',
    ejemploNombre: 'Ej: Soporte Premium 2026',
    seleccionarTecnico: 'Seleccionar técnico...',
    notasAdicionales: 'Notas adicionales',
  },
  botones: {
    crear: 'Crear',
    guardar: 'Guardar',
    eliminar: 'Eliminar',
    cancelar: 'Cancelar',
  },
  alertas: {
    sinEmpresas: 'No hay empresas clientes disponibles.',
    crearEmpresaPrimero: 'Crea una empresa primero.',
  },
  opciones: {
    moneda: {
      usd: 'USD',
      mxn: 'MXN',
    },
  },
} as const

// ============================================
// STORAGE KEYS - localStorage
// ============================================

export const SOPORTE_STORAGE_KEYS = {
  tickets: 'apex_soporte_datos',
  contratos: 'apex_contratos_soporte',
  comentarios: 'apex_soporte_comentarios',
  vista: 'apex_soporte_vista',
} as const

// ============================================
// EXPORT AGRUPADO
// ============================================

export const SOPORTE_TEXTS = {
  titulos: SOPORTE_TITULOS,
  tabs: SOPORTE_TABS,
  stats: SOPORTE_STATS,
  filtros: SOPORTE_FILTROS,
  selectores: SOPORTE_SELECTORES,
  botones: SOPORTE_BOTONES,
  empty: SOPORTE_EMPTY,
  contratos: SOPORTE_CONTRATOS,
  ticketDetalle: TICKET_DETALLE,
  ticketLabels: TICKET_LABELS,
  ticketAcciones: TICKET_ACCIONES,
  ticketComentarios: TICKET_COMENTARIOS,
  ticketPanelEmpty: TICKET_PANEL_EMPTY,
  createTicket: CREATE_TICKET_MODAL,
  createContract: CREATE_CONTRACT_MODAL,
} as const
