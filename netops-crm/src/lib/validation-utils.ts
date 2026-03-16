/**
 * ============================================
 * Utilidades de Validación Unificadas
 * ============================================
 * Funciones de validación reutilizables para
 * todos los componentes del CRM.
 * 
 * Incluye validaciones específicas para México.
 */

// ============================================================================
// TIPOS
// ============================================================================

export interface ValidationResult {
  isValid: boolean
  error?: string
}

export interface ValidationRules {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: string) => boolean
  customMessage?: string
}

// ============================================================================
// VALIDADORES COMUNES
// ============================================================================

/**
 * Validar que un campo no esté vacío
 */
export function validateRequired(value: string | undefined | null): ValidationResult {
  if (!value || value.trim().length === 0) {
    return { isValid: false, error: 'Este campo es obligatorio' }
  }
  return { isValid: true }
}

/**
 * Validar longitud mínima
 */
export function validateMinLength(min: number): (value: string) => ValidationResult {
  return (value: string) => {
    if (!value || value.trim().length < min) {
      return { isValid: false, error: `Mínimo ${min} caracteres` }
    }
    return { isValid: true }
  }
}

/**
 * Validar longitud máxima
 */
export function validateMaxLength(max: number): (value: string) => ValidationResult {
  return (value: string) => {
    if (value && value.trim().length > max) {
      return { isValid: false, error: `Máximo ${max} caracteres` }
    }
    return { isValid: true }
  }
}

/**
 * Validar rango de longitud
 */
export function validateLength(min: number, max: number): (value: string) => ValidationResult {
  return (value: string) => {
    if (!value || value.trim().length === 0) {
      return { isValid: true } // No validar si está vacío (usar required por separado)
    }
    if (value.trim().length < min || value.trim().length > max) {
      return { isValid: false, error: `Debe tener entre ${min} y ${max} caracteres` }
    }
    return { isValid: true }
  }
}

// ============================================================================
// VALIDACIONES DE EMAIL
// ============================================================================

/**
 * Validar formato de email (RFC 5322 simplificado)
 */
export function validateEmail(value: string | undefined): ValidationResult {
  if (!value || value.trim().length === 0) {
    return { isValid: true } // Opcional por defecto
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(value)) {
    return { isValid: false, error: 'Ingresa un email válido' }
  }

  return { isValid: true }
}

/**
 * Validar email requerido
 */
export function validateEmailRequired(value: string | undefined): ValidationResult {
  const required = validateRequired(value)
  if (!required.isValid) {
    return required
  }

  return validateEmail(value)
}

// ============================================================================
// VALIDACIONES DE TELÉFONO (MÉXICO)
// ============================================================================

/**
 * Validar teléfono mexicano
 * Acepta formatos:
 * - 10 dígitos: 55 1234 5678
 * - Con prefijo: +52 55 1234 5678
 * - Con paréntesis: (55) 1234 5678
 */
export function validatePhoneMexican(value: string | undefined): ValidationResult {
  if (!value || value.trim().length === 0) {
    return { isValid: true } // Opcional
  }

  // Eliminar espacios, paréntesis, guiones y el +
  const cleaned = value.replace(/[\s\-\(\)\+]/g, '')

  // Verificar que solo tenga dígitos
  if (!/^\d+$/.test(cleaned)) {
    return { isValid: false, error: 'El teléfono solo debe contener dígitos' }
  }

  // Teléfono fijo o móvil mexicano (10 dígitos)
  if (cleaned.length !== 10) {
    return { isValid: false, error: 'El teléfono debe tener 10 dígitos' }
  }

  // Validar que no empezar con 0
  if (cleaned.startsWith('0')) {
    return { isValid: false, error: 'El teléfono no puede empezar con 0' }
  }

  return { isValid: true }
}

/**
 * Validar teléfono requerido
 */
export function validatePhoneRequired(value: string | undefined): ValidationResult {
  const required = validateRequired(value)
  if (!required.isValid) {
    return required
  }

  return validatePhoneMexican(value)
}

/**
 * Validar teléfono internacional
 */
export function validatePhoneInternational(value: string | undefined): ValidationResult {
  if (!value || value.trim().length === 0) {
    return { isValid: true }
  }

  // Formato: +[código país][número]
  const phoneRegex = /^\+?[\d\s\-\(\)]{7,20}$/
  if (!phoneRegex.test(value)) {
    return { isValid: false, error: 'Ingresa un teléfono válido' }
  }

  // Eliminar caracteres no dígitos
  const digits = value.replace(/\D/g, '')

  if (digits.length < 7 || digits.length > 15) {
    return { isValid: false, error: 'El teléfono debe tener entre 7 y 15 dígitos' }
  }

  return { isValid: true }
}

// ============================================================================
// VALIDACIONES DE RFC (MÉXICO)
// ============================================================================

/**
 * Validar RFC mexicano (Persona Moral o Física)
 * - Persona Moral: 12 caracteres (3 letras + fecha + 3 chars)
 * - Persona Física con homoclave: 13 caracteres
 * - Persona Física sin homoclave: 10 caracteres
 */
export function validateRFC(value: string | undefined): ValidationResult {
  if (!value || value.trim().length === 0) {
    return { isValid: true } // Opcional
  }

  const rfc = value.toUpperCase().trim()

  // Verificar longitud (10, 12 o 13 caracteres)
  if (rfc.length !== 10 && rfc.length !== 12 && rfc.length !== 13) {
    return { isValid: false, error: 'El RFC debe tener 10, 12 o 13 caracteres' }
  }

  // Verificar que solo tenga caracteres válidos
  // 3-4 letras (nombre), 6 dígitos (fecha), 1-3 caracteres (homoclave)
  const validCharsRegex = /^[A-Z&Ñ]{3,4}[0-9]{6}[A-Z0-9]{1,3}$/
  if (!validCharsRegex.test(rfc)) {
    return { isValid: false, error: 'El RFC tiene un formato inválido' }
  }

  // Validar fecha (MM y DD)
  // Para RFC de 12 caracteres: posición 3-8 (ej: CIC070723G78)
  // Para RFC de 10 y 13 caracteres: posición 4-9
  const fechaStart = rfc.length === 12 ? 3 : 4
  const monthStr = rfc.substring(fechaStart, fechaStart + 2)
  const dayStr = rfc.substring(fechaStart + 2, fechaStart + 4)

  const month = parseInt(monthStr)
  const day = parseInt(dayStr)

  if (month < 1 || month > 12) {
    return { isValid: false, error: 'El RFC tiene un mes inválido' }
  }

  if (day < 1 || day > 31) {
    return { isValid: false, error: 'El RFC tiene un día inválido' }
  }

  return { isValid: true }
}

/**
 * Validar RFC requerido
 */
export function validateRFCRequired(value: string | undefined): ValidationResult {
  const required = validateRequired(value)
  if (!required.isValid) {
    return required
  }

  return validateRFC(value)
}

// ============================================================================
// VALIDACIONES DE URL
// ============================================================================

/**
 * Validar URL
 */
export function validateURL(value: string | undefined): ValidationResult {
  if (!value || value.trim().length === 0) {
    return { isValid: true } // Opcional
  }

  try {
    // Agregar https si no tiene protocolo
    let url = value.trim()
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url
    }

    new URL(url)
    return { isValid: true }
  } catch {
    return { isValid: false, error: 'Ingresa una URL válida' }
  }
}

// ============================================================================
// VALIDACIONES NUMÉRICAS
// ============================================================================

/**
 * Validar número positivo
 */
export function validatePositiveNumber(value: number | undefined | null): ValidationResult {
  if (value === undefined || value === null || isNaN(value)) {
    return { isValid: true }
  }

  if (value < 0) {
    return { isValid: false, error: 'El valor debe ser positivo' }
  }

  return { isValid: true }
}

/**
 * Validar número en rango
 */
export function validateNumberRange(min: number, max: number): (value: number | undefined | null) => ValidationResult {
  return (value: number | undefined | null) => {
    if (value === undefined || value === null || isNaN(value)) {
      return { isValid: true }
    }

    if (value < min || value > max) {
      return { isValid: false, error: `El valor debe estar entre ${min} y ${max}` }
    }

    return { isValid: true }
  }
}

/**
 * Validar número entero
 */
export function validateInteger(value: number | undefined | null): ValidationResult {
  if (value === undefined || value === null || isNaN(value)) {
    return { isValid: true }
  }

  if (!Number.isInteger(value)) {
    return { isValid: false, error: 'Debe ser un número entero' }
  }

  return { isValid: true }
}

// ============================================================================
// VALIDACIONES DE PLANEACIÓN (CUMPLEAÑOS, etc)
// ============================================================================

/**
 * Validar fecha de nacimiento (no puede ser futura, no puede ser muy antigua)
 */
export function validateBirthDate(value: string | undefined): ValidationResult {
  if (!value || value.trim().length === 0) {
    return { isValid: true }
  }

  const date = new Date(value)
  const now = new Date()

  if (isNaN(date.getTime())) {
    return { isValid: false, error: 'Fecha inválida' }
  }

  if (date > now) {
    return { isValid: false, error: 'La fecha no puede ser futura' }
  }

  // No mayor a 150 años
  const minDate = new Date()
  minDate.setFullYear(minDate.getFullYear() - 150)

  if (date < minDate) {
    return { isValid: false, error: 'La fecha no puede ser tan antigua' }
  }

  return { isValid: true }
}

// ============================================================================
// VALIDADOR GENÉRICO
// ============================================================================

/**
 * Validar campo con múltiples reglas
 */
export function validateField(
  value: string | number | undefined | null,
  rules: ValidationRules
): ValidationResult {
  const stringValue = String(value ?? '')

  // Required
  if (rules.required && !stringValue.trim()) {
    return { isValid: false, error: 'Este campo es obligatorio' }
  }

  // Si no es requerido y está vacío, pasar otras validaciones
  if (!stringValue.trim()) {
    return { isValid: true }
  }

  // Min length
  if (rules.minLength && stringValue.trim().length < rules.minLength) {
    return { isValid: false, error: `Mínimo ${rules.minLength} caracteres` }
  }

  // Max length
  if (rules.maxLength && stringValue.trim().length > rules.maxLength) {
    return { isValid: false, error: `Máximo ${rules.maxLength} caracteres` }
  }

  // Pattern
  if (rules.pattern && !rules.pattern.test(stringValue)) {
    return { isValid: false, error: rules.customMessage || 'Formato inválido' }
  }

  // Custom
  if (rules.custom && !rules.custom(stringValue)) {
    return { isValid: false, error: rules.customMessage || 'Valor inválido' }
  }

  return { isValid: true }
}

// ============================================================================
// MENSAJES DE ERROR PERSONALIZADOS (para constants)
// ============================================================================

export const VALIDATION_MESSAGES = {
  required: 'Este campo es obligatorio',
  email: 'Ingresa un email válido',
  emailRequired: 'El email es obligatorio',
  phone: 'Ingresa un teléfono válido',
  phoneMexican: 'El teléfono debe tener 10 dígitos (México)',
  rfc: 'El RFC tiene un formato inválido',
  rfcRequired: 'El RFC es obligatorio',
  url: 'Ingresa una URL válida',
  minLength: (min: number) => `Mínimo ${min} caracteres`,
  maxLength: (max: number) => `Máximo ${max} caracteres`,
  numberRange: (min: number, max: number) => `El valor debe estar entre ${min} y ${max}`,
  positiveNumber: 'El valor debe ser positivo',
  integer: 'Debe ser un número entero',
} as const
