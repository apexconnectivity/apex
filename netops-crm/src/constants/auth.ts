/**
 * Constantes centralizadas para Autenticación y Usuarios
 * Contains all labels, roles, permissions, and configuration for auth module
 */

// ==========================================
// PAGE LABELS
// ==========================================

export const PAGE_TITLE_LOGIN = 'Iniciar Sesión'
export const PAGE_TITLE_RECOVERY = 'Recuperar Contraseña'

// ==========================================
// ROLES DE USUARIO
// ==========================================

export const ROLES = {
  admin: {
    label: 'Administrador',
    color: 'text-red-400',
    bg: 'bg-red-500/20',
    border: 'border-red-500/30',
    nivel: 1
  },
  comercial: {
    label: 'Comercial',
    color: 'text-blue-400',
    bg: 'bg-blue-500/20',
    border: 'border-blue-500/30',
    nivel: 2
  },
  especialista: {
    label: 'Especialista',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/20',
    border: 'border-emerald-500/30',
    nivel: 3
  },
  compras: {
    label: 'Compras',
    color: 'text-amber-400',
    bg: 'bg-amber-500/20',
    border: 'border-amber-500/30',
    nivel: 4
  },
  facturacion: {
    label: 'Facturación',
    color: 'text-purple-400',
    bg: 'bg-purple-500/20',
    border: 'border-purple-500/30',
    nivel: 5
  },
  marketing: {
    label: 'Marketing',
    color: 'text-pink-400',
    bg: 'bg-pink-500/20',
    border: 'border-pink-500/30',
    nivel: 6
  },
  cliente: {
    label: 'Cliente',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/20',
    border: 'border-cyan-500/30',
    nivel: 7
  },
} as const

export type RoleKey = keyof typeof ROLES

// ==========================================
// PERMISOS
// ==========================================

export const PERMISOS = {
  // Módulos
  modulo_crm: { label: 'Acceso CRM', roles: ['admin', 'comercial'] },
  modulo_proyectos: { label: 'Acceso Proyectos', roles: ['admin', 'comercial', 'especialista'] },
  modulo_tareas: { label: 'Acceso Tareas', roles: ['admin', 'comercial', 'especialista', 'compras', 'facturacion', 'marketing'] },
  modulo_soporte: { label: 'Acceso Soporte', roles: ['admin', 'especialista', 'compras'] },
  modulo_compras: { label: 'Acceso Compras', roles: ['admin', 'compras'] },
  modulo_archivos: { label: 'Acceso Archivos', roles: ['admin', 'comercial', 'especialista', 'compras', 'facturacion', 'marketing'] },
  modulo_usuarios: { label: 'Gestión Usuarios', roles: ['admin'] },
  modulo_estadisticas: { label: 'Estadísticas', roles: ['admin', 'comercial'] },

  // Acciones específicas
  crear_empresa: { label: 'Crear Empresas', roles: ['admin', 'comercial'] },
  editar_empresa: { label: 'Editar Empresas', roles: ['admin', 'comercial'] },
  eliminar_empresa: { label: 'Eliminar Empresas', roles: ['admin'] },

  crear_proyecto: { label: 'Crear Proyectos', roles: ['admin', 'comercial'] },
  editar_proyecto: { label: 'Editar Proyectos', roles: ['admin', 'comercial', 'especialista'] },
  cerrar_proyecto: { label: 'Cerrar Proyectos', roles: ['admin', 'comercial'] },

  crear_tarea: { label: 'Crear Tareas', roles: ['admin', 'comercial', 'especialista', 'compras', 'facturacion', 'marketing'] },
  editar_tarea: { label: 'Editar Tareas', roles: ['admin', 'comercial', 'especialista', 'compras', 'facturacion', 'marketing'] },
  completar_tarea: { label: 'Completar Tareas', roles: ['admin', 'comercial', 'especialista', 'compras', 'facturacion', 'marketing'] },

  crear_ticket: { label: 'Crear Tickets', roles: ['admin', 'especialista', 'cliente'] },
  resolver_ticket: { label: 'Resolver Tickets', roles: ['admin', 'especialista'] },

  aprobar_orden: { label: 'Aprobar Órdenes de Compra', roles: ['admin', 'compras'] },

  gest_usuarios: { label: 'Gestionar Usuarios', roles: ['admin'] },
} as const

// ==========================================
// USER STATUS
// ==========================================

export const USER_STATUS = {
  activo: { label: 'Activo', color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
  inactivo: { label: 'Inactivo', color: 'text-slate-400', bg: 'bg-slate-500/15' },
  pendiente: { label: 'Pendiente', color: 'text-amber-400', bg: 'bg-amber-500/15' },
} as const

// ==========================================
// FORM LABELS
// ==========================================

export const FORM_LABELS = {
  nombre: 'Nombre',
  email: 'Email',
  password: 'Contraseña',
  confirmarPassword: 'Confirmar Contraseña',
  rol: 'Rol',
  cargo: 'Cargo',
  departamento: 'Departamento',
  telefono: 'Teléfono',
  avatar: 'Avatar',
  estado: 'Estado',
  notas: 'Notas',
} as const

// ==========================================
// BUTTON LABELS
// ==========================================

export const BUTTON_LABELS = {
  login: 'Iniciar Sesión',
  logout: 'Cerrar Sesión',
  recovery: 'Recuperar Contraseña',
  cambiarPassword: 'Cambiar Contraseña',
  crearUsuario: 'Crear Usuario',
  editarUsuario: 'Editar Usuario',
  eliminarUsuario: 'Eliminar Usuario',
  activarUsuario: 'Activar Usuario',
  desactivarUsuario: 'Desactivar Usuario',
  guardar: 'Guardar',
  cancelar: 'Cancelar',
} as const

// ==========================================
// MESSAGES
// ==========================================

export const MESSAGES = {
  loginExito: 'Sesión iniciada correctamente',
  loginError: 'Email o contraseña incorrectos',
  logoutExito: 'Sesión cerrada correctamente',
  recoveryEnviado: 'Se ha enviado un correo para recuperar tu contraseña',
  recoveryError: 'No se encontró una cuenta con ese email',
  passwordNoCoincide: 'Las contraseñas no coinciden',
  passwordMuyCorta: 'La contraseña debe tener al menos 8 caracteres',
  usuarioCreado: 'Usuario creado correctamente',
  usuarioActualizado: 'Usuario actualizado correctamente',
  usuarioEliminado: 'Usuario eliminado correctamente',
  accesoDenegado: 'No tienes permisos para realizar esta acción',
  sesionExpirada: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
} as const

// ==========================================
// VALIDATION
// ==========================================

export const VALIDATION = {
  minPasswordLength: 8,
  emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  passwordRequirements: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
  }
} as const

// ==========================================
// STORAGE KEYS
// ==========================================

export const STORAGE_KEYS = {
  user: 'apex_user',
  session: 'apex_session',
} as const

// ==========================================
// USUARIOS PAGE LABELS (Módulo de Gestión de Usuarios)
// ==========================================

export const USUARIOS_PAGE = {
  titulo: 'Usuarios',
  descripcion: 'Gestiona los usuarios internos del sistema',
  nuevoUsuario: 'Nuevo Colaborador',
  buscarPlaceholder: 'Buscar usuarios...',
  filtros: 'Filtros:',
  estado: 'Estado:',
  rol: 'Rol:',
  limpiar: 'Limpiar',
  todos: 'Todos',
  activos: 'Activos',
  inactivos: 'Inactivos',
  usuarioSingular: 'usuario',
  usuarioPlural: 'usuarios',
  inactivo: 'Inactivo',
  // Modal
  editarUsuario: 'Editar Usuario',
  nombreCompleto: 'Nombre completo',
  email: 'Email',
  telefono: 'Teléfono',
  roles: 'Roles',
  // Placeholders
  nombrePlaceholder: 'Juan Pérez',
  emailPlaceholder: 'juan@apex.com',
  telefonoPlaceholder: '+54 9 11 1234-5678',
  // Botones
  guardarCambios: 'Guardar Cambios',
  crearUsuario: 'Crear Usuario',
  // Confirmación
  desactivarUsuario: 'Desactivar Usuario',
  reactivarUsuario: 'Reactivar Usuario',
  msgDesactivar: '¿Estás seguro de que deseas desactivar este usuario? Ya no podrá acceder al sistema.',
  msgReactivar: '¿Estás seguro de que deseas reactivar este usuario? Volverá a tener acceso al sistema.',
  // Access denied
  soloAdmin: 'Solo los administradores pueden gestionar usuarios.',
} as const
