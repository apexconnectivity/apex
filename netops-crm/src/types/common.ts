// Tipos comunes reutilizables en todo el proyecto

// ============================================================================
// TIPOS PRIMITIVOS Y UTILIDADES
// ============================================================================

// ID genérico para entidades
export type EntityId = string | number

// Timestamps estándar para entidades
export interface Timestamps {
  creado_en: string
  actualizado_en?: string
  eliminado_en?: string
}

// Campos opcionales de timestamps
export type OptionalTimestamps = Partial<Timestamps>

// Estado genérico para operaciones
export type OperationStatus = 'idle' | 'loading' | 'success' | 'error'

// Resultado de operaciones con estado
export interface OperationResult<T> {
  data: T | null
  status: OperationStatus
  error: string | null
}

// ============================================================================
// COMPONENTES UI - HELPERS
// ============================================================================

// Opción de select genérica
export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

// Callback para handlers de select
export type SelectChangeHandler = (option: SelectOption | null) => void

// Función helper para crear SelectOption
export function createSelectOption(
  value: string,
  label: string,
  disabled = false
): SelectOption {
  return { value, label, disabled }
}

// ============================================================================
// FORMULARIOS
// ============================================================================

// Cambio de campo en formulario
export interface FormFieldChange {
  name: string
  value: unknown
}

// Errores de formulario
export type FormErrors = Record<string, string | undefined>

// Estado de formulario
export type FormStatus = 'idle' | 'submitting' | 'success' | 'error'
