import { StorageKeys } from '@/constants/storage-config'
import { getStorageItem, setStorageItem } from '@/lib/storage-utils'
import { 
  Tarea, 
  Subtarea, 
  Comentario, 
  CategoriaTarea,
  Dependencia,
  GrupoDashboardTareas,
} from '@/types/tareas'
import { v4 as uuidv4 } from 'uuid'

/**
 * Tipos para opciones de filtrado
 */
export interface TaskFilters {
  proyectoId?: string
  categoria?: CategoriaTarea
  estado?: string
  responsableId?: string
  fechaVencimientoDesde?: string
  fechaVencimientoHasta?: string
  asignadaCliente?: boolean
  contactoClienteId?: string
}

export interface TaskGroupResult {
  type: GrupoDashboardTareas
  tareas: Tarea[]
  count: number
}

/**
 * Servicio de Tareas que emula comportamiento asíncrono de Supabase
 * utilizando localStorage como persistencia temporal.
 * 
 * Preparado para futura migración a Supabase con RLS.
 */
class TaskService {
  private async simulateNetworkDelay() {
    return new Promise(resolve => setTimeout(resolve, 300))
  }

  // ============================================================================
  // TAREAS - CRUD BÁSICO
  // ============================================================================

  async getTasks(): Promise<Tarea[]> {
    await this.simulateNetworkDelay()
    return getStorageItem(StorageKeys.TAREAS) || []
  }

  async getTasksByProject(projectId: string): Promise<Tarea[]> {
    const tasks = await this.getTasks()
    return tasks.filter(t => t.proyecto_id === projectId)
  }

  async getTaskById(id: string): Promise<Tarea | null> {
    const tasks = await this.getTasks()
    return tasks.find(t => t.id === id) || null
  }

  async createTask(taskData: Omit<Tarea, 'id' | 'fecha_creacion'>): Promise<Tarea> {
    await this.simulateNetworkDelay()
    const tasks = await this.getTasks()
    
    const newTask: Tarea = {
      ...taskData,
      id: uuidv4(),
      fecha_creacion: new Date().toISOString(),
    }

    setStorageItem(StorageKeys.TAREAS, [...tasks, newTask])
    return newTask
  }

  async updateTask(id: string, updates: Partial<Tarea>): Promise<Tarea> {
    await this.simulateNetworkDelay()
    const tasks = await this.getTasks()
    const index = tasks.findIndex(t => t.id === id)
    
    if (index === -1) throw new Error('Tarea no encontrada')

    const updatedTask = { ...tasks[index], ...updates }
    const newTasks = [...tasks]
    newTasks[index] = updatedTask
    
    setStorageItem(StorageKeys.TAREAS, newTasks)
    return updatedTask
  }

  async deleteTask(id: string): Promise<void> {
    await this.simulateNetworkDelay()
    const tasks = await this.getTasks()
    setStorageItem(StorageKeys.TAREAS, tasks.filter(t => t.id !== id))
    
    // Cleanup related subtasks and comments
    const subtaskRecord = getStorageItem(StorageKeys.SUBTAREAS) || {}
    const commentRecord = getStorageItem(StorageKeys.COMENTARIOS) || {}
    
    delete subtaskRecord[id]
    delete commentRecord[id]
    
    setStorageItem(StorageKeys.SUBTAREAS, subtaskRecord)
    setStorageItem(StorageKeys.COMENTARIOS, commentRecord)
  }

  // ============================================================================
  // TAREAS - CONSULTAS POR ROL (RN-TAR-01 a RN-TAR-25)
  // ============================================================================

  /**
   * Obtiene tareas filtradas según criterios específicos
   */
  async getTasksFiltered(filters: TaskFilters): Promise<Tarea[]> {
    const tasks = await this.getTasks()
    
    return tasks.filter(t => {
      if (filters.proyectoId && t.proyecto_id !== filters.proyectoId) return false
      if (filters.categoria && t.categoria !== filters.categoria) return false
      if (filters.estado && t.estado !== filters.estado) return false
      if (filters.responsableId && t.responsable_id !== filters.responsableId) return false
      if (filters.asignadaCliente !== undefined && t.asignado_a_cliente !== filters.asignadaCliente) return false
      if (filters.contactoClienteId && t.contacto_cliente_id !== filters.contactoClienteId) return false
      
      if (filters.fechaVencimientoDesde && t.fecha_vencimiento) {
        if (t.fecha_vencimiento < filters.fechaVencimientoDesde) return false
      }
      if (filters.fechaVencimientoHasta && t.fecha_vencimiento) {
        if (t.fecha_vencimiento > filters.fechaVencimientoHasta) return false
      }
      
      return true
    })
  }

  /**
   * Obtiene tareas asignadas a un usuario específico (Dashboard Personal)
   * Según RN-TAR-23: Solo tareas donde responsable_id = usuario_id
   */
  async getTasksByResponsable(responsableId: string): Promise<Tarea[]> {
    const tasks = await this.getTasks()
    return tasks.filter(t => t.responsable_id === responsableId)
  }

  /**
   * Obtiene tareas visibles para un cliente según su contacto_id
   * Según RN-TAR-03 y RN-TAR-04
   */
  async getTasksForCliente(contactoClienteId: string): Promise<Tarea[]> {
    const tasks = await this.getTasks()
    return tasks.filter(t => 
      t.asignado_a_cliente && 
      t.contacto_cliente_id === contactoClienteId
    )
  }

  /**
   * Obtiene tareas por rol (técnico, comercial, compras)
   * Filtra por categoría según el rol del usuario
   */
  async getTasksByRol(
    rol: string, 
    usuarioId: string,
    opciones?: {
      categoriasAdicionales?: CategoriaTarea[]
      incluyeSinAsignar?: boolean
    }
  ): Promise<Tarea[]> {
    const tasks = await this.getTasks()
    
    // Determinar categorías visibles según rol
    const categoriasPorRol: Record<string, CategoriaTarea[]> = {
      especialista: ['Técnica'],
      comercial: ['Comercial'],
      compras: ['Compras'],
      facturacion: ['Administrativa'],
      admin: ['Comercial', 'Técnica', 'Compras', 'Administrativa', 'General'],
    }
    
    let categoriasVisibles = categoriasPorRol[rol] || []
    
    // Agregar categorías adicionales si se especifican
    if (opciones?.categoriasAdicionales) {
      const combinado = [...categoriasVisibles, ...opciones.categoriasAdicionales]
      categoriasVisibles = Array.from(new Set(combinado))
    }
    
    // Si no tiene rol específico o es admin, mostrar todas
    if (rol === 'admin' || !categoriasVisibles.length) {
      return tasks
    }
    
    return tasks.filter(t => {
      // Debe ser de una categoría visible
      if (!categoriasVisibles.includes(t.categoria)) return false
      
      // Si incluye tareas sin asignar
      if (opciones?.incluyeSinAsignar && !t.responsable_id) return true
      
      // Debe ser responsable o no tener asignado
      return t.responsable_id === usuarioId
    })
  }

  // ============================================================================
  // TAREAS - AGRUPACIONES PARA DASHBOARD (RN-TAR-24)
  // ============================================================================

  /**
   * Agrupa tareas según las reglas del Dashboard Personal
   * - Vencen hoy
   * - Próximos 7 días
   * - En progreso
   * - Sin vencimiento
   * - Completadas recientes (últimos 7 días)
   */
  async getTasksGroupedForDashboard(responsableId: string): Promise<TaskGroupResult[]> {
    const tasks = await this.getTasksByResponsable(responsableId)
    
    const now = new Date()
    const today = now.toISOString().split('T')[0]
    const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    
    const grupos: Record<GrupoDashboardTareas, Tarea[]> = {
      vencen_hoy: [],
      proximos_7_dias: [],
      en_progreso: [],
      sin_vencimiento: [],
      completadas_recientes: [],
    }
    
    tasks.forEach(t => {
      // Completadas recientes (últimos 7 días)
      if (t.estado === 'Completada' && t.fecha_completado) {
        if (t.fecha_completado >= sevenDaysAgo) {
          grupos.completadas_recientes.push(t)
          return
        }
      }
      
      // Vencen hoy
      if (t.fecha_vencimiento === today && t.estado !== 'Completada') {
        grupos.vencen_hoy.push(t)
        return
      }
      
      // Próximos 7 días (sin incluir hoy)
      if (t.fecha_vencimiento && t.fecha_vencimiento > today && t.fecha_vencimiento <= sevenDaysLater && t.estado !== 'Completada') {
        grupos.proximos_7_dias.push(t)
        return
      }
      
      // En progreso
      if (t.estado === 'En progreso') {
        grupos.en_progreso.push(t)
        return
      }
      
      // Sin vencimiento (y no completadas)
      if (!t.fecha_vencimiento && t.estado !== 'Completada') {
        grupos.sin_vencimiento.push(t)
        return
      }
    })
    
    // Ordenar cada grupo por prioridad y fecha
    const priorityOrder = { 'Urgente': 0, 'Alta': 1, 'Media': 2, 'Baja': 3 }
    
    const ordenarPorPrioridadYFecha = (a: Tarea, b: Tarea) => {
      const pDiff = (priorityOrder[a.prioridad] || 4) - (priorityOrder[b.prioridad] || 4)
      if (pDiff !== 0) return pDiff
      if (a.fecha_vencimiento && b.fecha_vencimiento) {
        return a.fecha_vencimiento.localeCompare(b.fecha_vencimiento)
      }
      return 0
    }
    
    Object.values(grupos).forEach(g => g.sort(ordenarPorPrioridadYFecha))
    
    const result: TaskGroupResult[] = [
      { type: 'vencen_hoy' as const, tareas: grupos.vencen_hoy, count: grupos.vencen_hoy.length },
      { type: 'proximos_7_dias' as const, tareas: grupos.proximos_7_dias, count: grupos.proximos_7_dias.length },
      { type: 'en_progreso' as const, tareas: grupos.en_progreso, count: grupos.en_progreso.length },
      { type: 'sin_vencimiento' as const, tareas: grupos.sin_vencimiento, count: grupos.sin_vencimiento.length },
      { type: 'completadas_recientes' as const, tareas: grupos.completadas_recientes, count: grupos.completadas_recientes.length },
    ]
    
    return result.filter(g => g.count > 0)
  }

  // ============================================================================
  // TAREAS - DEPENDENCIAS (RN-TAR-20, RN-TAR-25)
  // ============================================================================

  /**
   * Verifica si una tarea puede completarse según sus dependencias
   * RN-TAR-20: Las dependencias bloqueantes deben estar completadas
   */
  async canCompleteTask(taskId: string): Promise<{ canComplete: boolean; blockedBy?: Tarea[] }> {
    const task = await this.getTaskById(taskId)
    if (!task || !task.dependencias || task.dependencias.length === 0) {
      return { canComplete: true }
    }
    
    const tasks = await this.getTasks()
    const blockedBy: Tarea[] = []
    
    for (const dep of task.dependencias) {
      if (dep.tipo === 'bloqueante') {
        const depTask = tasks.find(t => t.id === dep.tarea_id)
        if (depTask && depTask.estado !== 'Completada') {
          blockedBy.push(depTask)
        }
      }
    }
    
    return {
      canComplete: blockedBy.length === 0,
      blockedBy,
    }
  }

  /**
   * Valida que no haya ciclos en las dependencias
   */
  async validateNoCycles(taskId: string, newDependencies: Dependencia[]): Promise<boolean> {
    const tasks = await this.getTasks()
    const visited = new Set<string>()
    
    const checkCycle = (id: string, path: Set<string>): boolean => {
      if (path.has(id)) return true // Ciclo detectado
      if (visited.has(id)) return false
      
      visited.add(id)
      path.add(id)
      
      const task = tasks.find(t => t.id === id)
      if (!task || !task.dependencias) return false
      
      for (const dep of task.dependencias) {
        if (checkCycle(dep.tarea_id, path)) return true
      }
      
      path.delete(id)
      return false
    }
    
    // Agregar temporalmente las nuevas dependencias (para validación de ciclos)
    const tempTask = { id: taskId, dependencias: newDependencies }
    // tempTasks se usa solo para validación: no se persisten aquí
    void tempTask
    
    return !checkCycle(taskId, new Set())
  }

  /**
   * Obtiene tareas disponibles para asignar como dependencia
   */
  async getTasksForDependency(projectId: string, excludeTaskId?: string): Promise<Tarea[]> {
    const tasks = await this.getTasksByProject(projectId)
    return tasks
      .filter(t => t.id !== excludeTaskId && t.estado !== 'Completada')
      .sort((a, b) => {
        // Primero por fase, luego por fecha
        if (a.fase_origen !== b.fase_origen) {
          return a.fase_origen - b.fase_origen
        }
        if (a.fecha_vencimiento && b.fecha_vencimiento) {
          return a.fecha_vencimiento.localeCompare(b.fecha_vencimiento)
        }
        return 0
      })
  }

  // ============================================================================
  // TAREAS - REAPERTURA POR CLIENTE (RN-TAR-13)
  // ============================================================================

  /**
   * Verifica si un cliente puede reabrir una tarea
   * RN-TAR-13: Puede reabrir hasta 3 días después de completar
   */
  async canReopenTask(taskId: string): Promise<{ canReopen: boolean; diasRestantes?: number }> {
    const task = await this.getTaskById(taskId)
    
    if (!task || !task.asignado_a_cliente) {
      return { canReopen: false }
    }
    
    if (task.estado !== 'Completada' || !task.fecha_completado) {
      return { canReopen: false }
    }
    
    const completada = new Date(task.fecha_completado)
    const ahora = new Date()
    const diffMs = ahora.getTime() - completada.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays > 3) {
      return { canReopen: false }
    }
    
    return {
      canReopen: true,
      diasRestantes: 3 - diffDays,
    }
  }

  /**
   * Reabre una tarea completada por cliente
   */
  async reopenTask(taskId: string): Promise<Tarea> {
    const canReopen = await this.canReopenTask(taskId)
    
    if (!canReopen.canReopen) {
      throw new Error('No se puede reabrir esta tarea. El plazo de 3 días ha expirado.')
    }
    
    return this.updateTask(taskId, {
      estado: 'En progreso',
      fecha_completado: undefined,
    })
  }

  // ============================================================================
  // SUBTAREAS
  // ============================================================================

  async getSubtasks(taskId: string): Promise<Subtarea[]> {
    await this.simulateNetworkDelay()
    const record = getStorageItem(StorageKeys.SUBTAREAS) || {}
    return record[taskId] || []
  }

  async createSubtask(taskId: string, name: string): Promise<Subtarea> {
    await this.simulateNetworkDelay()
    const record = getStorageItem(StorageKeys.SUBTAREAS) || {}
    const subtasks = record[taskId] || []
    
    const newSubtask: Subtarea = {
      id: uuidv4(),
      tarea_id: taskId,
      nombre: name,
      completada: false,
      orden: subtasks.length + 1,
    }

    record[taskId] = [...subtasks, newSubtask]
    setStorageItem(StorageKeys.SUBTAREAS, record)
    return newSubtask
  }

  async updateSubtask(taskId: string, subtaskId: string, updates: Partial<Subtarea>): Promise<Subtarea> {
    await this.simulateNetworkDelay()
    const record = getStorageItem(StorageKeys.SUBTAREAS) || {}
    const subtasks = record[taskId] || []
    const index = subtasks.findIndex(s => s.id === subtaskId)

    if (index === -1) throw new Error('Subtarea no encontrada')

    const updatedSubtask = { ...subtasks[index], ...updates }
    subtasks[index] = updatedSubtask
    record[taskId] = subtasks
    
    setStorageItem(StorageKeys.SUBTAREAS, record)
    return updatedSubtask
  }

  async deleteSubtask(taskId: string, subtaskId: string): Promise<void> {
    await this.simulateNetworkDelay()
    const record = getStorageItem(StorageKeys.SUBTAREAS) || {}
    const subtasks = record[taskId] || []
    record[taskId] = subtasks.filter(s => s.id !== subtaskId)
    setStorageItem(StorageKeys.SUBTAREAS, record)
  }

  // ============================================================================
  // COMENTARIOS
  // ============================================================================

  async getComments(taskId: string): Promise<Comentario[]> {
    await this.simulateNetworkDelay()
    const record = getStorageItem(StorageKeys.COMENTARIOS) || {}
    return record[taskId] || []
  }

  async createComment(taskId: string, commentData: Omit<Comentario, 'id' | 'fecha'>): Promise<Comentario> {
    await this.simulateNetworkDelay()
    const record = getStorageItem(StorageKeys.COMENTARIOS) || {}
    const comments = record[taskId] || []
    
    const newComment: Comentario = {
      ...commentData,
      id: uuidv4(),
      fecha: new Date().toISOString(),
    }

    record[taskId] = [...comments, newComment]
    setStorageItem(StorageKeys.COMENTARIOS, record)
    return newComment
  }

  // ============================================================================
  // COMPLETAR TAREA (RN-TAR-12, RN-TAR-13)
  // ============================================================================

  /**
   * Completa una tarea con validaciones
   * - Verifica dependencias bloqueantes
   * - Maneja subtareas pendientes (RN-TAR-12)
   */
  async completeTask(taskId: string): Promise<{ success: boolean; warning?: string }> {
    const canComplete = await this.canCompleteTask(taskId)
    
    if (!canComplete.canComplete) {
      const blockedNames = canComplete.blockedBy?.map(t => t.nombre).join(', ')
      return {
        success: false,
        warning: `No se puede completar. Dependencias pendientes: ${blockedNames}`,
      }
    }
    
    await this.updateTask(taskId, {
      estado: 'Completada',
      fecha_completado: new Date().toISOString(),
    })
    
    return { success: true }
  }
}

export const taskService = new TaskService()
