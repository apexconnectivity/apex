import { z } from 'zod'

/**
 * Resultado de la validación
 */
export interface ValidationResult<T> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Valida y parsea datos usando un esquema de Zod
 * @param schema - Esquema Zod a utilizar para la validación
 * @param data - Datos a validar
 * @returns Objeto con success, data (si es válido) o error (si falla)
 */
export function validateAndParse<T>(schema: z.ZodSchema<T>, data: unknown): ValidationResult<T> {
  try {
    const parsed = schema.parse(data)
    return {
      success: true,
      data: parsed,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map((err) => {
        const path = err.path.join('.')
        return path ? `${path}: ${err.message}` : err.message
      })
      return {
        success: false,
        error: errorMessages.join('; '),
      }
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error de validación desconocido',
    }
  }
}

/**
 * Valida datos de forma segura (sin lanzar excepciones)
 * @param schema - Esquema Zod a utilizar para la validación
 * @param data - Datos a validar
 * @returns Tupla [esValido, datosValidados | null, error | null]
 */
export function safeValidate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): [success: true, data: T, error: null] | [success: false, data: null, error: string] {
  const result = schema.safeParse(data)

  if (result.success) {
    return [true, result.data, null]
  }

  const errorMessages = result.error.issues.map((err) => {
    const path = err.path.join('.')
    return path ? `${path}: ${err.message}` : err.message
  })

  return [false, null, errorMessages.join('; ')]
}

/**
 * Valida datos desde localStorage
 * @param schema - Esquema Zod a utilizar para la validación
 * @param key - Clave en localStorage
 * @returns Resultado de la validación
 */
export function validateFromLocalStorage<T>(
  schema: z.ZodSchema<T>,
  key: string
): ValidationResult<T> {
  try {
    const stored = localStorage.getItem(key)

    if (!stored) {
      return {
        success: false,
        error: `No se encontró ningún dato en localStorage con la clave: ${key}`,
      }
    }

    const parsed = JSON.parse(stored)
    return validateAndParse(schema, parsed)
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al leer localStorage',
    }
  }
}

/**
 * Obtiene datos de localStorage y los valida, retornando valor por defecto si falla
 * @param schema - Esquema Zod a utilizar para la validación
 * @param key - Clave en localStorage
 * @param defaultValue - Valor por defecto si la validación falla o no hay datos
 * @returns Datos validados o valor por defecto
 */
export function getFromLocalStorage<T>(
  schema: z.ZodSchema<T>,
  key: string,
  defaultValue: T
): T {
  const result = validateFromLocalStorage(schema, key)
  if (result.success && result.data !== undefined) {
    return result.data
  }
  return defaultValue
}

/**
 * Intenta guardar en localStorage, validando primero los datos
 * @param schema - Esquema Zod a utilizar para la validación
 * @param key - Clave en localStorage
 * @param data - Datos a guardar
 * @returns true si se guardó correctamente, false si la validación falló
 */
export function saveToLocalStorage<T>(
  schema: z.ZodSchema<T>,
  key: string,
  data: unknown
): boolean {
  const result = validateAndParse(schema, data)

  if (!result.success || result.data === undefined) {
    return false
  }

  try {
    localStorage.setItem(key, JSON.stringify(result.data))
    return true
  } catch {
    return false
  }
}
