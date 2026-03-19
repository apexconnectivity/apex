'use client'

import { useRef, useCallback, useEffect } from 'react'

/**
 * Hook para callbacks seguros que evitan actualizaciones de estado
 * en componentes desmontados
 * 
 * Útil cuando:
 * - Se hacen fetch en useEffect
 * - Se usan timeouts en componentes que pueden desmontarse
 * - Se manejan suscripciones/observables
 * 
 * @returns Objeto con métodos para crear callbacks seguros
 * 
 * @example
 * ```tsx
 * function Component({ id }: { id: string }) {
 *   const { isMounted, safeCallback } = useSafeCallback()
 * 
 *   useEffect(() => {
 *     async function fetchData() {
 *       const data = await api.getData(id)
 *       if (isMounted()) {
 *         setData(data) // ✅ Seguro, componente sigue montado
 *       }
 *     }
 *     safeCallback(fetchData)()
 *   }, [id])
 * 
 *   // O más simple:
 *   useEffect(() => {
 *     safeCallback(async () => {
 *       const data = await api.getData(id)
 *       setData(data) // ✅ Solo se ejecuta si está montado
 *     })()
 *   }, [id])
 * }
 * ```
 */
export function useSafeCallback() {
  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true

    return () => {
      isMountedRef.current = false
    }
  }, [])

  /**
   * Verifica si el componente sigue montado
   */
  const isMounted = useCallback(() => {
    return isMountedRef.current
  }, [])

  /**
   * Envuelve una función para que solo se ejecute si el componente está montado
   * 
   * @param callback - Función a ejecutar de forma segura
   * @returns Función wrapper que verifica isMounted antes de ejecutar
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const safeCallback = useCallback(<T extends (...args: any[]) => any>(
    callback: T,
  ): ((...args: Parameters<T>) => ReturnType<T> | undefined) => {
    return (...args: Parameters<T>): ReturnType<T> | undefined => {
      if (!isMountedRef.current) {
        console.warn('[useSafeCallback] Callback ignorado: componente desmontado')
        return undefined
      }
      return callback(...args)
    }
  }, [])

  /**
   * Versión async del safeCallback
   * Retorna una promesa que se resuelve solo si está montado
   * 
   * @param callback - Función async a ejecutar
   * @returns Promise que se rechaza si el componente se desmonta
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const safeAsync = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <T extends (...args: any[]) => Promise<any>>(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      callback: T,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): ((...args: Parameters<T>) => Promise<any>) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return async (...args: Parameters<T>): Promise<any> => {
        if (!isMountedRef.current) {
          console.warn('[useSafeCallback] Async callback ignorado: componente desmontado')
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return undefined as any
        }
        return callback(...args)
      }
    }, [])

  return {
    isMounted,
    safeCallback,
    safeAsync,
  }
}
