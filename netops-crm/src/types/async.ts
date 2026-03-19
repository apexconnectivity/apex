/**
 * Tipos para estados de carga estandarizados
 * Proporciona un sistema consistente para manejar estados async en toda la aplicación
 */

/**
 * Estados posibles de una operación asíncrona
 */
export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error'

/**
 * Estado genérico para operaciones asíncronas
 * 
 * @example
 * ```typescript
 * interface UserData {
 *   id: string
 *   name: string
 * }
 * 
 * const state: AsyncState<UserData> = {
 *   status: 'loading',
 *   data: null,
 *   error: null
 * }
 * ```
 */
export interface AsyncState<T> {
  status: AsyncStatus
  data: T | null
  error: Error | null
}

/**
 * Crea el estado inicial para una operación async
 * 
 * @returns Estado inicial con status 'idle'
 * 
 * @example
 * ```typescript
 * const initialState = createInitialState<User[]>()
 * // { status: 'idle', data: null, error: null }
 * ```
 */
export function createInitialState<T>(): AsyncState<T> {
  return {
    status: 'idle',
    data: null,
    error: null,
  }
}

/**
 * Verifica si el estado actual está en carga
 * 
 * @param state - Estado a verificar
 * @returns true si el status es 'loading'
 * 
 * @example
 * ```typescript
 * if (isLoading(state)) {
 *   return <Skeleton />
 * }
 * ```
 */
export function isLoading(state: AsyncState<unknown>): boolean {
  return state.status === 'loading'
}

/**
 * Verifica si el estado actual es de éxito
 * 
 * @param state - Estado a verificar
 * @returns true si el status es 'success'
 * 
 * @example
 * ```typescript
 * if (isSuccess(state) && state.data) {
 *   return <DataList items={state.data} />
 * }
 * ```
 */
export function isSuccess(state: AsyncState<unknown>): boolean {
  return state.status === 'success'
}

/**
 * Verifica si el estado actual es de error
 * 
 * @param state - Estado a verificar
 * @returns true si el status es 'error'
 * 
 * @example
 * ```typescript
 * if (isError(state)) {
 *   return <ErrorMessage error={state.error} />
 * }
 * ```
 */
export function isError(state: AsyncState<unknown>): boolean {
  return state.status === 'error'
}

/**
 * Verifica si el estado está inactivo (no se ha iniciado la operación)
 * 
 * @param state - Estado a verificar
 * @returns true si el status es 'idle'
 */
export function isIdle(state: AsyncState<unknown>): boolean {
  return state.status === 'idle'
}

/**
 * Crea un estado de carga
 * 
 * @param data - Datos previos (opcional) para mantenerlos durante la carga
 * @returns Estado con status 'loading'
 * 
 * @example
 * ```typescript
 * const loadingState = createLoadingState(existingData)
 * ```
 */
export function createLoadingState<T>(data?: T | null): AsyncState<T> {
  return {
    status: 'loading',
    data: data ?? null,
    error: null,
  }
}

/**
 * Crea un estado de éxito
 * 
 * @param data - Datos resultantes
 * @returns Estado con status 'success'
 * 
 * @example
 * ```typescript
 * const successState = createSuccessState(users)
 * ```
 */
export function createSuccessState<T>(data: T): AsyncState<T> {
  return {
    status: 'success',
    data,
    error: null,
  }
}

/**
 * Crea un estado de error
 * 
 * @param error - Error ocurrido
 * @returns Estado con status 'error'
 * 
 * @example
 * ```typescript
 * const errorState = createErrorState(new Error('Failed to fetch'))
 * ```
 */
export function createErrorState<T>(error: Error): AsyncState<T> {
  return {
    status: 'error',
    data: null,
    error,
  }
}

/**
 * Obtiene el estado booleano isLoading a partir del status
 * Mantiene compatibilidad con el sistema existente
 * 
 * @param status - Estado AsyncStatus
 * @returns true si el status es 'loading'
 */
export function getIsLoadingFromStatus(status: AsyncStatus): boolean {
  return status === 'loading'
}
