import { useState, useEffect, useCallback } from 'react'
import { taskService, type TaskFilters, type TaskGroupResult } from '@/services/taskService'
import { type Tarea, type CategoriaTarea, type Dependencia } from '@/types/tareas'

/**
 * Hook para gestionar tareas utilizando el TaskService (LocalStorage con asincronía)
 * Preparado para la futura migración a Supabase.
 * 
 * Extendido con funcionalidades del spec TAREAS v2:
 * - Filtrado por rol
 * - Agrupaciones para dashboard personal
 * - Validación de dependencias
 * - Reapertura de tareas por cliente
 */
export function useTareas(projectId?: string) {
  const [tasks, setTasks] = useState<Tarea[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchTasks = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = projectId 
        ? await taskService.getTasksByProject(projectId)
        : await taskService.getTasks()
      setTasks(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error al cargar tareas'))
    } finally {
      setIsLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  // ============================================================================
  // CRUD BÁSICO
  // ============================================================================

  const createTask = async (taskData: Omit<Tarea, 'id' | 'fecha_creacion'>) => {
    try {
      const newTask = await taskService.createTask(taskData)
      setTasks(prev => [...prev, newTask])
      return newTask
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error al crear tarea'))
      throw err
    }
  }

  const updateTask = async (id: string, updates: Partial<Tarea>) => {
    try {
      const updatedTask = await taskService.updateTask(id, updates)
      setTasks(prev => prev.map(t => t.id === id ? updatedTask : t))
      return updatedTask
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error al actualizar tarea'))
      throw err
    }
  }

  const deleteTask = async (id: string) => {
    try {
      await taskService.deleteTask(id)
      setTasks(prev => prev.filter(t => t.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error al eliminar tarea'))
      throw err
    }
  }

  // ============================================================================
  // FILTRADO Y CONSULTAS (TAREAS v2)
  // ============================================================================

  /**
   * Obtiene tareas filtradas por criterios específicos
   */
  const getTasksFiltered = useCallback(async (filters: TaskFilters): Promise<Tarea[]> => {
    try {
      return await taskService.getTasksFiltered(filters)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error al filtrar tareas'))
      return []
    }
  }, [])

  /**
   * Obtiene tareas asignadas a un usuario específico
   */
  const getTasksByResponsable = useCallback(async (responsableId: string): Promise<Tarea[]> => {
    try {
      return await taskService.getTasksByResponsable(responsableId)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error al obtener tareas'))
      return []
    }
  }, [])

  /**
   * Obtiene tareas visibles para un cliente
   */
  const getTasksForCliente = useCallback(async (contactoClienteId: string): Promise<Tarea[]> => {
    try {
      return await taskService.getTasksForCliente(contactoClienteId)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error al obtener tareas del cliente'))
      return []
    }
  }, [])

  /**
   * Obtiene tareas por rol (técnico, comercial, compras)
   */
  const getTasksByRol = useCallback(async (
    rol: string,
    usuarioId: string,
    opciones?: { categoriasAdicionales?: CategoriaTarea[]; incluyeSinAsignar?: boolean }
  ): Promise<Tarea[]> => {
    try {
      return await taskService.getTasksByRol(rol, usuarioId, opciones)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error al obtener tareas por rol'))
      return []
    }
  }, [])

  // ============================================================================
  // AGRUPACIONES PARA DASHBOARD (RN-TAR-24)
  // ============================================================================

  /**
   * Obtiene tareas agrupadas para el Dashboard Personal
   */
  const getTasksGroupedForDashboard = useCallback(async (responsableId: string): Promise<TaskGroupResult[]> => {
    try {
      return await taskService.getTasksGroupedForDashboard(responsableId)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error al agrupar tareas'))
      return []
    }
  }, [])

  // ============================================================================
  // DEPENDENCIAS (RN-TAR-20, RN-TAR-25)
  // ============================================================================

  /**
   * Verifica si una tarea puede completarse
   */
  const canCompleteTask = useCallback(async (taskId: string) => {
    try {
      return await taskService.canCompleteTask(taskId)
    } catch {
      return { canComplete: false, blockedBy: [] }
    }
  }, [])

  /**
   * Valida que no haya ciclos en las dependencias
   */
  const validateNoCycles = useCallback(async (taskId: string, newDependencies: Dependencia[]) => {
    try {
      return await taskService.validateNoCycles(taskId, newDependencies)
    } catch {
      return false
    }
  }, [])

  /**
   * Obtiene tareas disponibles para asignar como dependencia
   */
  const getTasksForDependency = useCallback(async (projectId: string, excludeTaskId?: string) => {
    try {
      return await taskService.getTasksForDependency(projectId, excludeTaskId)
    } catch {
      return []
    }
  }, [])

  // ============================================================================
  // REAPERTURA POR CLIENTE (RN-TAR-13)
  // ============================================================================

  /**
   * Verifica si un cliente puede reabrir una tarea
   */
  const canReopenTask = useCallback(async (taskId: string) => {
    try {
      return await taskService.canReopenTask(taskId)
    } catch {
      return { canReopen: false }
    }
  }, [])

  /**
   * Reabre una tarea completada por cliente
   */
  const reopenTask = useCallback(async (taskId: string) => {
    try {
      const updatedTask = await taskService.reopenTask(taskId)
      setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t))
      return updatedTask
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error al reabrir tarea'))
      throw err
    }
  }, [])

  // ============================================================================
  // COMPLETAR TAREA (RN-TAR-12)
  // ============================================================================

  /**
   * Completa una tarea con validaciones de dependencias
   */
  const completeTask = useCallback(async (taskId: string) => {
    try {
      const result = await taskService.completeTask(taskId)
      if (result.success) {
        const updatedTask = await taskService.getTaskById(taskId)
        if (updatedTask) {
          setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t))
        }
      }
      return result
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error al completar tarea'))
      return { success: false, warning: 'Error al completar tarea' }
    }
  }, [])

  return {
    // Estado base
    tasks,
    isLoading,
    error,
    refresh: fetchTasks,
    
    // CRUD básico
    createTask,
    updateTask,
    deleteTask,
    
    // Filtrado y consultas
    getTasksFiltered,
    getTasksByResponsable,
    getTasksForCliente,
    getTasksByRol,
    
    // Dashboard
    getTasksGroupedForDashboard,
    
    // Dependencias
    canCompleteTask,
    validateNoCycles,
    getTasksForDependency,
    
    // Reapertura
    canReopenTask,
    reopenTask,
    
    // Completar con validación
    completeTask,
  }
}
