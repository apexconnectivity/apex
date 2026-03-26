/**
 * ============================================
 * Centralized Hooks for Data Management
 * ============================================
 * 
 * Todos los hooks usan localStorage para persistencia local.
 * Preparado para futura migración a Supabase.
 * 
 * Import from '@/hooks' instead of '@/lib/data'
 */

// ============================================================================
// DATA HOOKS - Hooks de datos por entidad
// ============================================================================

export { useEmpresas } from './useEmpresas'
export { useContactos } from './useContactos'
export { useProyectos } from './useProyectos'
export { useTareas } from './useTareas'
export { useTickets } from './useTickets'
export { useArchivos } from './useArchivos'
export { useReuniones } from './useReuniones'
export { useContratos } from './useContratos'
export { useSubtareas } from './useSubtareas'
export { useComentarios } from './useComentarios'
export { useDocumentos } from './useDocumentos'
export { useHistorialProyectos } from './useHistorialProyectos'

// ============================================================================
// STORAGE HOOKS - Hooks específicos de storage
// ============================================================================

export { useArchivosStorage } from './useArchivosStorage'
export { useArchivadoStorage } from './useArchivadoStorage'

// ============================================================================
// DATA SOURCE HOOKS - Abstracción de fuente de datos
// ============================================================================

export { useDataSource, useLocalStorageData } from './useDataSource'
export type { DataSource, UseDataSourceOptions, UseDataSourceReturn } from './useDataSource'

// ============================================================================
// SWR HOOKS - Client-side caching
// ============================================================================

export { useFetcher } from './useFetcher'

// ============================================================================
// UTILITY HOOKS - Hooks de utilidad general
// ============================================================================

export { useDebounce, useDebouncedCallback } from './useDebounce'
export { useSafeCallback } from './useSafeCallback'
export { useAsync, useAsyncRetry, delay } from './useAsync'
export type { AsyncState, UseAsyncReturn, UseAsyncOptions, UseAsyncOptions as AsyncOptions, UseAsyncReturn as UseAsyncResult } from './useAsync'

// ============================================================================
// TYPES
// ============================================================================

export type { UseArchivosStorageReturn, ArchivoInput } from './useArchivosStorage'
export type { UseArchivadoStorageReturn } from './useArchivadoStorage'
