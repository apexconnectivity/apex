import { type User, type Role } from '@/types/auth'

// Roles internos disponibles (excluye 'cliente')
export const ROLES_INTERNOS: Role[] = [
  'admin',
  'comercial',
  'especialista',
  'compras',
  'facturacion',
  'marketing'
]

// Interfaz para usuario transformado
export interface TransformedUser {
  id: string
  nombre: string
  rol: string
}

/**
 * Transforma usuarios para usar en selects/combos
 * Filtra solo usuarios internos activos
 */
export function transformUsuarios(users: User[]): TransformedUser[] {
  return users
    .filter(u => u.activo && u.roles?.some(r => ROLES_INTERNOS.includes(r)))
    .map(u => ({
      id: u.id,
      nombre: u.nombre,
      rol: u.roles?.[0] || 'cliente'
    }))
}

/**
 * Obtiene solo usuarios internos activos
 */
export function getInternalUsers(users: User[]): User[] {
  return users.filter(u => u.activo && u.roles?.some(r => ROLES_INTERNOS.includes(r)))
}

/**
 * Obtiene usuarios por rol específico
 */
export function getUsersByRole(users: User[], role: Role): User[] {
  return users.filter(u => u.roles?.includes(role))
}

/**
 * Verifica si un usuario es interno (no es cliente)
 */
export function isUserInternal(user: User): boolean {
  return user.roles?.some(r => ROLES_INTERNOS.includes(r)) ?? false
}
