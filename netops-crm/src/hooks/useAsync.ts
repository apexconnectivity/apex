'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { type AsyncStatus, type AsyncState as AsyncStateType } from '@/types/async'

/**
 * Estado para el hook useAsync
 * Incluye isLoading para compatibilidad hacia atrás
 */
export interface AsyncState<T> extends AsyncStateType<T> {
  isLoading: boolean
}

/**
 * Resultado del hook useAsync
 */
export interface UseAsyncReturn<T> extends AsyncState<T> {
  /** Estado status para uso con AsyncStatus */
  status: AsyncStatus
  /** Función para ejecutar la operación async */
  execute: () => Promise<void>
  /** Función para cancelar la operación en curso */
  abort: () => void
  /** Función para resetear el estado */
  reset: () => void
  /** Función para establecer data manualmente */
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
 *   const { data, isLoading, error, execute, reset, abort } = useAsync({
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
 *
 * @example Con AbortController (para cancelación manual)
 * ```tsx
 * const { data, abort } = useAsync({
 *   asyncFunction: async () => {
 *     const res = await fetch(`/api/users/${id}`)
 *     return res.json()
 *   }
 * })
 * 
 * // Para cancelar manualmente
 * abort()
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
    status: 'idle',
    data: null,
    isLoading: immediate,
    error: null,
  })

  // Ref para rastrear si el componente está montado
  const isMountedRef = useRef(true)
  // Ref para el AbortController
  const abortControllerRef = useRef<AbortController | null>(null)

  // Cleanup al desmontar el componente
  useEffect(() => {
    isMountedRef.current = true

    return () => {
      isMountedRef.current = false
      // Cancelar cualquier operación en curso
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
        abortControllerRef.current = null
      }
    }
  }, [])

  const execute = useCallback(async () => {
    // Cancelar cualquier operación anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Crear nuevo AbortController
    const controller = new AbortController()
    abortControllerRef.current = controller

    // Resetear error
    setState(prev => ({ ...prev, status: 'loading', error: null }))

    // Indicar que empezamos
    setState(prev => ({ ...prev, isLoading: true }))
    onStart?.()

    try {
      // Verificar si está montado antes de actualizar estado
      if (!isMountedRef.current) {
        return
      }

      const result = await asyncFunction()

      // Verificar nuevamente después de await
      if (!isMountedRef.current) {
        return
      }

      // Ignorar si fue abortado
      if (controller.signal.aborted) {
        return
      }

      setState({ status: 'success', data: result, isLoading: false, error: null })
      onSuccess?.(result)
    } catch (error) {
      // Ignorar errores de AbortError
      if (error instanceof Error && error.name === 'AbortError') {
        return
      }

      // Verificar si está montado antes de actualizar
      if (!isMountedRef.current) {
        return
      }

      const err = error instanceof Error ? error : new Error(String(error))
      setState({ status: 'error', data: null, isLoading: false, error: err })
      onError?.(err)
    } finally {
      // Limpiar referencia del controller solo si es el mismo
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null
      }
    }
  }, [asyncFunction, onStart, onSuccess, onError])

  // Función para cancelar manualmente
  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    // Actualizar estado para reflejar que ya no está cargando
    setState(prev => ({ ...prev, isLoading: false }))
  }, [])

  const reset = useCallback(() => {
    // Cancelar cualquier operación en curso
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setState({ status: 'idle', data: null, isLoading: false, error: null })
  }, [])

  const setData = useCallback((data: T) => {
    setState({ status: 'success', data, isLoading: false, error: null })
  }, [])

  // Ejecutar inmediatamente si está configurado
  useEffect(() => {
    if (immediate) {
      const timer = setTimeout(() => {
        execute()
      }, 0)
      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [immediate])

  return {
    ...state,
    execute,
    abort,
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
