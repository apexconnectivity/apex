'use client'

import { useState, useCallback } from 'react'

/**
 * Estado resultante de una operación async
 */
export interface AsyncState<T> {
  data: T | null
  isLoading: boolean
  error: Error | null
}

/**
 * Resultado del hook useAsync
 */
export interface UseAsyncReturn<T> extends AsyncState<T> {
  execute: () => Promise<void>
  reset: () => void
  setData: (data: T) => void
}

/**
 * Opciones de configuración para useAsync
 */
export interface UseAsyncOptions<T> {
  /** Función async a ejecutar */
  asyncFunction: () => Promise<T>
  /** Ejecutar inmediatamente al montar (default: false) */
  immediate?: boolean
  /** Callback al iniciar */
  onStart?: () => void
  /** Callback al completar exitosamente */
  onSuccess?: (data: T) => void
  /** Callback al fallar */
  onError?: (error: Error) => void
}

/**
 * Hook para manejar operaciones async de forma consistente
 * 
 * Proporciona estado de loading, error y data con manejo robusto
 * de errores y callbacks configurables.
 * 
 * @param options - Configuración del hook
 * @returns Estado y funciones para controlar la operación
 * 
 * @example
 * ```tsx
 * function MiComponente({ userId }: { userId: string }) {
 *   const { data, isLoading, error, execute, reset } = useAsync({
 *     asyncFunction: async () => {
 *       const res = await fetch(`/api/users/${userId}`)
 *       return res.json()
 *     },
 *     onSuccess: (data) => {
 *       console.log('Usuario cargado:', data.nombre)
 *     },
 *     onError: (error) => {
 *       toast.error('Error al cargar usuario')
 *     }
 *   })
 * 
 *   if (isLoading) return <Skeleton />
 *   if (error) return <ErrorMessage error={error} />
 * 
 *   return <UserProfile user={data} />
 * }
 * ```
 * 
 * @example Con ejecución inmediata
 * ```tsx
 * const { data } = useAsync({
 *   asyncFunction: () => fetchUsers(),
 *   immediate: true // Se ejecuta al montar
 * })
 * ```
 */
export function useAsync<T>({
  asyncFunction,
  immediate = false,
  onStart,
  onSuccess,
  onError,
}: UseAsyncOptions<T>): UseAsyncReturn<T> {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    isLoading: immediate, // Si immediate es true, ya está cargando
    error: null,
  })

  const execute = useCallback(async () => {
    // Resetear error
    setState(prev => ({ ...prev, error: null }))

    // Indicar que empezamos
    setState(prev => ({ ...prev, isLoading: true }))
    onStart?.()

    try {
      const result = await asyncFunction()
      setState({ data: result, isLoading: false, error: null })
      onSuccess?.(result)
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      setState({ data: null, isLoading: false, error: err })
      onError?.(err)
    }
  }, [asyncFunction, onStart, onSuccess, onError])

  const reset = useCallback(() => {
    setState({ data: null, isLoading: false, error: null })
  }, [])

  const setData = useCallback((data: T) => {
    setState({ data, isLoading: false, error: null })
  }, [])

  // Ejecutar inmediatamente si está configurado
  // Esto se hace fuera del render inicial
  const [hasExecuted, setHasExecuted] = useState(false)
  
  if (immediate && !hasExecuted) {
    setHasExecuted(true)
    // Usar setTimeout para evitar updating while rendering
    setTimeout(() => execute(), 0)
  }

  return {
    ...state,
    execute,
    reset,
    setData,
  }
}

/**
 * Helper para delays en async functions
 * Útil para simular API calls en desarrollo
 * 
 * @param ms - Milisegundos de delay
 * @returns Promise que se resuelve después del delay
 * 
 * @example
 * ```typescript
 * await delay(1000) // Espera 1 segundo
 * ```
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Hook para retry de operaciones async
 * 
 * @param fn - Función async a ejecutar
 * @param options - Configuración de retry
 * @returns Estado y execute con retry automático
 */
export function useAsyncRetry<T>(
  fn: () => Promise<T>,
  options: {
    retries?: number
    delay?: number
    onRetry?: (attempt: number) => void
  } = {}
): UseAsyncReturn<T> & { retryCount: number } {
  const { retries = 3, delay: retryDelay = 1000, onRetry } = options
  const [retryCount, setRetryCount] = useState(0)

  const asyncFunctionWithRetry = useCallback(async () => {
    let lastError: Error | null = null

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        setRetryCount(attempt)
        return await fn()
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error))
        
        if (attempt < retries) {
          onRetry?.(attempt + 1)
          await delay(retryDelay * (attempt + 1)) // Backoff exponencial
        }
      }
    }

    throw lastError
  }, [fn, retries, retryDelay, onRetry])

  return {
    ...useAsync({ asyncFunction: asyncFunctionWithRetry }),
    retryCount,
  }
}
