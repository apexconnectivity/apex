export type Role = 
  | 'admin' 
  | 'comercial' 
  | 'tecnico' 
  | 'compras' 
  | 'facturacion' 
  | 'marketing' 
  | 'cliente'

export interface User {
  id: string
  email: string
  nombre: string
  telefono?: string
  activo: boolean
  creado_en: string
  ultimo_acceso?: string
  cambiar_password_proximo_login: boolean
  roles: Role[]
  empresa_id?: string // ID de la empresa a la que pertenece si es rol cliente
}

export interface RoleDefinition {
  name: Role
  label: string
  description: string
  es_interno: boolean
  modules: ModulePermission[]
}

export interface ModulePermission {
  module: string
  canView: boolean
  canCreate: boolean
  canEdit: boolean
  canDelete: boolean
}

export const ROLE_DEFINITIONS: Record<Role, RoleDefinition> = {
  admin: {
    name: 'admin',
    label: 'Administrador',
    description: 'Acceso total al sistema',
    es_interno: true,
    modules: [
      { module: 'dashboard', canView: true, canCreate: true, canEdit: true, canDelete: true },
      { module: 'crm', canView: true, canCreate: true, canEdit: true, canDelete: true },
      { module: 'proyectos', canView: true, canCreate: true, canEdit: true, canDelete: true },
      { module: 'tareas', canView: true, canCreate: true, canEdit: true, canDelete: true },
      { module: 'soporte', canView: true, canCreate: true, canEdit: true, canDelete: true },
      { module: 'archivos', canView: true, canCreate: true, canEdit: true, canDelete: true },
      { module: 'calendario', canView: true, canCreate: true, canEdit: true, canDelete: true },
      { module: 'compras', canView: true, canCreate: true, canEdit: true, canDelete: true },
      { module: 'notificaciones', canView: true, canCreate: true, canEdit: true, canDelete: true },
      { module: 'configuracion', canView: true, canCreate: true, canEdit: true, canDelete: true },
    ],
  },
  comercial: {
    name: 'comercial',
    label: 'Comercial',
    description: 'Gestión de ventas y CRM',
    es_interno: true,
    modules: [
      { module: 'dashboard', canView: true, canCreate: true, canEdit: false, canDelete: false },
      { module: 'crm', canView: true, canCreate: true, canEdit: true, canDelete: false },
      { module: 'proyectos', canView: true, canCreate: false, canEdit: false, canDelete: false },
      { module: 'tareas', canView: true, canCreate: false, canEdit: false, canDelete: false },
      { module: 'soporte', canView: false, canCreate: false, canEdit: false, canDelete: false },
      { module: 'archivos', canView: true, canCreate: false, canEdit: false, canDelete: false },
      { module: 'calendario', canView: true, canCreate: true, canEdit: true, canDelete: false },
      { module: 'compras', canView: false, canCreate: false, canEdit: false, canDelete: false },
      { module: 'notificaciones', canView: true, canCreate: false, canEdit: false, canDelete: false },
      { module: 'configuracion', canView: false, canCreate: false, canEdit: false, canDelete: false },
    ],
  },
  tecnico: {
    name: 'tecnico',
    label: 'Técnico',
    description: 'Implementación y soporte técnico',
    es_interno: true,
    modules: [
      { module: 'dashboard', canView: true, canCreate: true, canEdit: false, canDelete: false },
      { module: 'crm', canView: false, canCreate: false, canEdit: false, canDelete: false },
      { module: 'proyectos', canView: true, canCreate: false, canEdit: true, canDelete: false },
      { module: 'tareas', canView: true, canCreate: true, canEdit: true, canDelete: false },
      { module: 'soporte', canView: true, canCreate: true, canEdit: true, canDelete: false },
      { module: 'archivos', canView: true, canCreate: true, canEdit: false, canDelete: false },
      { module: 'calendario', canView: true, canCreate: true, canEdit: true, canDelete: false },
      { module: 'compras', canView: false, canCreate: false, canEdit: false, canDelete: false },
      { module: 'notificaciones', canView: true, canCreate: false, canEdit: false, canDelete: false },
      { module: 'configuracion', canView: false, canCreate: false, canEdit: false, canDelete: false },
    ],
  },
  compras: {
    name: 'compras',
    label: 'Compras',
    description: 'Gestión de proveedores y adquisiciones',
    es_interno: true,
    modules: [
      { module: 'dashboard', canView: true, canCreate: false, canEdit: false, canDelete: false },
      { module: 'crm', canView: true, canCreate: false, canEdit: false, canDelete: false },
      { module: 'proyectos', canView: true, canCreate: false, canEdit: false, canDelete: false },
      { module: 'tareas', canView: true, canCreate: false, canEdit: false, canDelete: false },
      { module: 'soporte', canView: false, canCreate: false, canEdit: false, canDelete: false },
      { module: 'archivos', canView: true, canCreate: false, canEdit: false, canDelete: false },
      { module: 'calendario', canView: true, canCreate: false, canEdit: false, canDelete: false },
      { module: 'compras', canView: true, canCreate: true, canEdit: true, canDelete: false },
      { module: 'notificaciones', canView: true, canCreate: false, canEdit: false, canDelete: false },
      { module: 'configuracion', canView: false, canCreate: false, canEdit: false, canDelete: false },
    ],
  },
  facturacion: {
    name: 'facturacion',
    label: 'Facturación',
    description: 'Gestión financiera',
    es_interno: true,
    modules: [
      { module: 'dashboard', canView: true, canCreate: false, canEdit: false, canDelete: false },
      { module: 'crm', canView: true, canCreate: false, canEdit: false, canDelete: false },
      { module: 'proyectos', canView: true, canCreate: false, canEdit: false, canDelete: false },
      { module: 'tareas', canView: false, canCreate: false, canEdit: false, canDelete: false },
      { module: 'soporte', canView: false, canCreate: false, canEdit: false, canDelete: false },
      { module: 'archivos', canView: true, canCreate: false, canEdit: false, canDelete: false },
      { module: 'calendario', canView: false, canCreate: false, canEdit: false, canDelete: false },
      { module: 'compras', canView: true, canCreate: false, canEdit: false, canDelete: false },
      { module: 'notificaciones', canView: true, canCreate: false, canEdit: false, canDelete: false },
      { module: 'configuracion', canView: false, canCreate: false, canEdit: false, canDelete: false },
    ],
  },
  marketing: {
    name: 'marketing',
    label: 'Marketing',
    description: 'Comunicación y campañas',
    es_interno: true,
    modules: [
      { module: 'dashboard', canView: true, canCreate: false, canEdit: false, canDelete: false },
      { module: 'crm', canView: true, canCreate: false, canEdit: false, canDelete: false },
      { module: 'proyectos', canView: false, canCreate: false, canEdit: false, canDelete: false },
      { module: 'tareas', canView: false, canCreate: false, canEdit: false, canDelete: false },
      { module: 'soporte', canView: false, canCreate: false, canEdit: false, canDelete: false },
      { module: 'archivos', canView: false, canCreate: false, canEdit: false, canDelete: false },
      { module: 'calendario', canView: false, canCreate: false, canEdit: false, canDelete: false },
      { module: 'compras', canView: false, canCreate: false, canEdit: false, canDelete: false },
      { module: 'notificaciones', canView: true, canCreate: false, canEdit: false, canDelete: false },
      { module: 'configuracion', canView: false, canCreate: false, canEdit: false, canDelete: false },
    ],
  },
  cliente: {
    name: 'cliente',
    label: 'Cliente',
    description: 'Portal del cliente con acceso restringido',
    es_interno: false,
    modules: [
      { module: 'dashboard', canView: true, canCreate: false, canEdit: false, canDelete: false },
      { module: 'proyectos', canView: true, canCreate: false, canEdit: false, canDelete: false },
      { module: 'tareas', canView: true, canCreate: false, canEdit: false, canDelete: false },
      { module: 'soporte', canView: true, canCreate: true, canEdit: true, canDelete: false },
      { module: 'calendario', canView: true, canCreate: true, canEdit: true, canDelete: false },
      { module: 'portal', canView: true, canCreate: true, canEdit: false, canDelete: false },
    ],
  },
}

export function hasPermission(user: User | null, module: string, action: 'canView' | 'canCreate' | 'canEdit' | 'canDelete'): boolean {
  if (!user) return false
  
  for (const roleName of user.roles) {
    const role = ROLE_DEFINITIONS[roleName]
    if (!role) continue
    
    if (roleName === 'admin') return true
    
    const modulePerm = role.modules.find(m => m.module === module)
    if (modulePerm && modulePerm[action]) return true
  }
  
  return false
}

export function canAccessModule(user: User | null, module: string): boolean {
  return hasPermission(user, module, 'canView')
}

export function isInternalUser(user: User | null): boolean {
  if (!user) return false
  return user.roles.some(role => ROLE_DEFINITIONS[role]?.es_interno)
}
