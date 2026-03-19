/**
 * Sistema de logging estructurado para NetOps CRM
 * Proporciona logs con timestamp ISO, nivel, módulo y datos adicionales
 */

export type LogLevel = 'info' | 'error' | 'warn' | 'debug'

interface LogEntry {
  timestamp: string
  level: LogLevel
  module: string
  message: string
  data?: unknown
}

interface Logger {
  info: (module: string, message: string, data?: unknown) => void
  error: (module: string, message: string, error?: unknown) => void
  warn: (module: string, message: string, data?: unknown) => void
  debug: (module: string, message: string, data?: unknown) => void
}

/**
 * Verifica si estamos en entorno de desarrollo
 */
function isDevelopment(): boolean {
  return process.env.NODE_ENV !== 'production'
}

/**
 * Formatea el timestamp en formato ISO
 */
function formatTimestamp(): string {
  return new Date().toISOString()
}

/**
 * Serializa los datos para mostrar en el log
 */
function serializeData(data: unknown): string {
  if (data === undefined) return ''
  if (data === null) return ' null'

  try {
    const serialized = JSON.stringify(data, null, 2)
    return `\n${serialized}`
  } catch {
    return ` ${String(data)}`
  }
}

/**
 * Crea el mensaje de log formateado
 */
function formatMessage(entry: LogEntry): string {
  const { timestamp, level, module, message, data } = entry
  const levelPadded = level.toUpperCase().padEnd(5, ' ')
  const dataStr = serializeData(data)

  return `[${timestamp}] [${module}] ${levelPadded}: ${message}${dataStr}`
}

/**
 * Imprime el log a la consola
 */
function printLog(entry: LogEntry): void {
  const message = formatMessage(entry)

  switch (entry.level) {
    case 'error':
      console.error(message)
      break
    case 'warn':
      console.warn(message)
      break
    case 'debug':
      console.debug(message)
      break
    case 'info':
    default:
      console.log(message)
      break
  }
}

/**
 * Crea una entrada de log
 */
function createLogEntry(
  level: LogLevel,
  module: string,
  message: string,
  data?: unknown
): LogEntry {
  return {
    timestamp: formatTimestamp(),
    level,
    module,
    message,
    data,
  }
}

/**
 * Implementación del Logger
 */
const logger: Logger = {
  info: (module: string, message: string, data?: unknown): void => {
    const entry = createLogEntry('info', module, message, data)
    printLog(entry)
  },

  error: (module: string, message: string, error?: unknown): void => {
    // Extraer información útil del error
    let errorData: unknown = error

    if (error instanceof Error) {
      errorData = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      }
    }

    const entry = createLogEntry('error', module, message, errorData)
    printLog(entry)
  },

  warn: (module: string, message: string, data?: unknown): void => {
    const entry = createLogEntry('warn', module, message, data)
    printLog(entry)
  },

  debug: (module: string, message: string, data?: unknown): void => {
    // Solo mostrar logs de debug en desarrollo
    if (!isDevelopment()) return

    const entry = createLogEntry('debug', module, message, data)
    printLog(entry)
  },
}

export { logger }
