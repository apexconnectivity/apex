// ============================================
// Constantes centralizadas para localStorage
// ============================================

import type { Empresa } from '@/types/crm'
import type { Proyecto } from '@/types/proyectos'
import type { Tarea } from '@/types/tareas'
import type { Ticket, ContratoSoporte, ComentarioTicket } from '@/types/soporte'

// ============================================
// STORAGE KEYS - Claves para localStorage
// ============================================

export const STORAGE_KEYS = {
  // CRM
  empresas: 'apex_crm_datos',
  
  // Proyectos
  proyectos: 'apex_proyectos_datos',
  
  // Tareas
  tareas: 'apex_tareas_datos',
  
  // Soporte
  tickets: 'apex_soporte_datos',
  contratos: 'apex_contratos_soporte',
  comentarios: 'apex_soporte_comentarios',
  soporteVista: 'apex_soporte_vista',
} as const

// ============================================
// VALORES INICIALES - Datos demo por defecto
// ============================================

// Valores iniciales vacíos (para uso general)
export const INITIAL_DATA = {
  empresas: [] as Empresa[],
  proyectos: [] as Proyecto[],
  tareas: [] as Tarea[],
  tickets: [] as Ticket[],
  contratos: [] as ContratoSoporte[],
  comentarios: {} as Record<string, ComentarioTicket[]>,
} as const

// ============================================
// TIPOS EXPORTADOS
// ============================================

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS]
export type InitialData = typeof INITIAL_DATA
