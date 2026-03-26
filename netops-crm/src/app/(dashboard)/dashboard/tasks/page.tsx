"use client"

import { useState, useMemo, useCallback } from 'react'
import { CheckSquare, Search, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { KanbanCard } from '@/components/module'
import { TaskGroup } from '@/components/ui/task-group'
import { useAuth } from '@/contexts/auth-context'
import { useTareas } from '@/hooks/useTareas'
import { useProyectos } from '@/hooks/useProyectos'
import { ModuleContainer } from '@/components/module/ModuleContainer'
import { AccessDeniedCard } from '@/components/ui/access-denied-card'
import { StaggeredList } from '@/components/ui/page-animation'
import { cn } from '@/lib/utils'
import { type Tarea, type GrupoDashboardTareas } from '@/types/tareas'
import { ESTADO_COLORS } from '@/lib/colors'
import { SEVEN_DAYS_MS } from '@/constants/timing'

// ============================================================================
// PROPS
// ============================================================================

interface TaskDashboardFilters {
  proyectoId?: string
  categoria?: string
  busqueda?: string
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function TasksDashboardPage() {
  const { user } = useAuth()
  const { tasks, isLoading, refresh } = useTareas()
  const [proyectos] = useProyectos()
  
  // Filtros
  const [filters, setFilters] = useState<TaskDashboardFilters>(() => ({
    proyectoId: undefined,
    categoria: undefined,
    busqueda: undefined
  }))
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Obtener categorías únicas de las tareas
  const categoriasDisponibles = Array.from(new Set(tasks.map(t => t.categoria)))

  // Obtener proyectos únicos de las tareas
  const proyectosDisponibles = Array.from(new Set(tasks.map(t => t.proyecto_id)))
    .map(id => proyectos.find(p => p.id === id))
    .filter(Boolean)

  // Filtrar tareas según el usuario y filtros
  const filteredTasks = useMemo(() => {
    if (!user || tasks.length === 0) return []

    let result = tasks

    // Filtrar por proyecto si hay uno seleccionado
    if (filters.proyectoId) {
      result = result.filter(t => t.proyecto_id === filters.proyectoId)
    }

    // Filtrar por categoría
    if (filters.categoria) {
      result = result.filter(t => t.categoria === filters.categoria)
    }

    // Filtrar por búsqueda
    if (filters.busqueda) {
      const query = filters.busqueda.toLowerCase()
      result = result.filter(t => 
        t.nombre.toLowerCase().includes(query) ||
        t.proyecto_nombre?.toLowerCase().includes(query) ||
        t.descripcion?.toLowerCase().includes(query)
      )
    }

    // Determinar categorías visibles según rol del usuario
    const isAdmin = user.roles.includes('admin')

    // Si no es admin, filtrar por responsable_id
    if (!isAdmin) {
      result = result.filter(t => 
        t.responsable_id === user.id || 
        (t.responsable_id === undefined && !t.asignado_a_cliente)
      )
    }

    return result
  }, [tasks, filters, user])

  // Agrupar tareas según las reglas del Dashboard Personal
  const groupedTasks = useCallback(() => {
    const now = new Date()
    const today = now.toISOString().split('T')[0]
    const sevenDaysLater = new Date(now.getTime() + SEVEN_DAYS_MS).toISOString().split('T')[0]
    const sevenDaysAgo = new Date(now.getTime() - SEVEN_DAYS_MS).toISOString().split('T')[0]

    const grupos: Record<GrupoDashboardTareas, Tarea[]> = {
      vencen_hoy: [],
      proximos_7_dias: [],
      en_progreso: [],
      sin_vencimiento: [],
      completadas_recientes: [],
    }

    filteredTasks.forEach(t => {
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

      // Próximos 7 días
      if (t.fecha_vencimiento && t.fecha_vencimiento > today && t.fecha_vencimiento <= sevenDaysLater && t.estado !== 'Completada') {
        grupos.proximos_7_dias.push(t)
        return
      }

      // En progreso
      if (t.estado === 'En progreso') {
        grupos.en_progreso.push(t)
        return
      }

      // Sin vencimiento
      if (!t.fecha_vencimiento && t.estado !== 'Completada') {
        grupos.sin_vencimiento.push(t)
        return
      }
    })

    // Ordenar por prioridad
    const priorityOrder = { 'Urgente': 0, 'Alta': 1, 'Media': 2, 'Baja': 3 }
    const ordenar = (a: Tarea, b: Tarea) => {
      const pDiff = (priorityOrder[a.prioridad] || 4) - (priorityOrder[b.prioridad] || 4)
      if (pDiff !== 0) return pDiff
      if (a.fecha_vencimiento && b.fecha_vencimiento) {
        return a.fecha_vencimiento.localeCompare(b.fecha_vencimiento)
      }
      return 0
    }

    Object.values(grupos).forEach(g => g.sort(ordenar))

    return grupos
  }, [filteredTasks])

  // Handlers
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    await refresh()
    setIsRefreshing(false)
  }, [refresh])

  const handleTaskClick = useCallback((tarea: Tarea) => {
    // Navegar a la página del proyecto con la tarea seleccionada
    // Por ahora solo logueamos
    console.log('Task clicked:', tarea.id)
  }, [])

  // Verificar acceso
  const canView = user?.roles.some(r => 
    ['admin', 'especialista', 'comercial', 'compras', 'facturacion'].includes(r)
  )

  if (!canView) {
    return (
      <ModuleContainer>
        <AccessDeniedCard 
          icon={CheckSquare} 
          title="Sin acceso al Dashboard de Tareas"
          description="No tienes permisos para ver esta sección."
        />
      </ModuleContainer>
    )
  }

  const grupos = groupedTasks()
  const totalPendientes = grupos.vencen_hoy.length + grupos.proximos_7_dias.length + grupos.en_progreso.length + grupos.sin_vencimiento.length

  return (
    <ModuleContainer>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/15">
            <CheckSquare className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Mis Tareas</h1>
            <p className="text-sm text-muted-foreground">
              Dashboard personal de tareas asignadas
            </p>
          </div>
        </div>

        <Button 
          variant="outline" 
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={cn('h-4 w-4 mr-2', isRefreshing && 'animate-spin')} />
          Actualizar
        </Button>
      </div>

      {/* Filtros */}
      <div className="bg-card rounded-xl border border-border/50 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Búsqueda */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar tareas..."
              value={filters.busqueda || ''}
              onChange={(e) => setFilters({ ...filters, busqueda: e.target.value })}
              className="pl-9"
            />
          </div>

          {/* Filtro de proyecto */}
          <select
            value={filters.proyectoId || ''}
            onChange={(e) => setFilters({ ...filters, proyectoId: e.target.value || undefined })}
            className="px-3 py-2 rounded-lg border border-input bg-background text-sm"
          >
            <option value="">Todos los proyectos</option>
            {proyectosDisponibles.map(p => (
              <option key={p?.id} value={p?.id}>
                {p?.nombre}
              </option>
            ))}
          </select>

          {/* Filtro de categoría */}
          <select
            value={filters.categoria || ''}
            onChange={(e) => setFilters({ ...filters, categoria: e.target.value || undefined })}
            className="px-3 py-2 rounded-lg border border-input bg-background text-sm"
          >
            <option value="">Todas las categorías</option>
            {categoriasDisponibles.map(c => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Resumen */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Badge variant="outline" className="px-3 py-1.5">
          <span className="font-semibold">{totalPendientes}</span> pendiente{totalPendientes !== 1 ? 's' : ''}
        </Badge>
        <Badge variant="outline" className="px-3 py-1.5 text-red-400 border-red-500/30">
          <span className="font-semibold">{grupos.vencen_hoy.length}</span> vencen hoy
        </Badge>
        <Badge variant="outline" className="px-3 py-1.5 text-amber-400 border-amber-500/30">
          <span className="font-semibold">{grupos.proximos_7_dias.length}</span> próximos 7 días
        </Badge>
        <Badge variant="outline" className="px-3 py-1.5 text-blue-400 border-blue-500/30">
          <span className="font-semibold">{grupos.en_progreso.length}</span> en progreso
        </Badge>
      </div>

      {/* Contenido */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed border-border">
          <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-30" />
          <h3 className="text-lg font-medium mb-2">No hay tareas</h3>
          <p className="text-sm text-muted-foreground">
            {filters.busqueda || filters.proyectoId || filters.categoria
              ? 'No se encontraron tareas con los filtros seleccionados.'
              : 'No tienes tareas asignadas.'}
          </p>
        </div>
      ) : (
        <StaggeredList stagger={50}>
          <div className="space-y-6">
          {/* Grupo: Vencen Hoy */}
          {grupos.vencen_hoy.length > 0 && (
            <TaskGroup type="vencen_hoy" count={grupos.vencen_hoy.length}>
              {grupos.vencen_hoy.map(tarea => (
                  <KanbanCard
                    key={tarea.id}
                    title={tarea.nombre}
                    subtitle={tarea.proyecto_nombre}
                    indicatorColor={ESTADO_COLORS[tarea.estado] || ESTADO_COLORS['Pendiente']}
                    badges={[{ label: tarea.prioridad }, { label: tarea.categoria }]}
                    dueDate={tarea.fecha_vencimiento ? new Date(tarea.fecha_vencimiento).toLocaleDateString('es-ES') : undefined}
                    assignee={tarea.responsable_nombre ? { name: tarea.responsable_nombre } : undefined}
                    onClick={() => handleTaskClick(tarea)}
                  />
              ))}
            </TaskGroup>
          )}

          {/* Grupo: Próximos 7 días */}
          {grupos.proximos_7_dias.length > 0 && (
            <TaskGroup type="proximos_7_dias" count={grupos.proximos_7_dias.length}>
              {grupos.proximos_7_dias.map(tarea => (
                  <KanbanCard
                    key={tarea.id}
                    title={tarea.nombre}
                    subtitle={tarea.proyecto_nombre}
                    indicatorColor={ESTADO_COLORS[tarea.estado] || ESTADO_COLORS['Pendiente']}
                    badges={[{ label: tarea.prioridad }, { label: tarea.categoria }]}
                    dueDate={tarea.fecha_vencimiento ? new Date(tarea.fecha_vencimiento).toLocaleDateString('es-ES') : undefined}
                    assignee={tarea.responsable_nombre ? { name: tarea.responsable_nombre } : undefined}
                    onClick={() => handleTaskClick(tarea)}
                  />
              ))}
            </TaskGroup>
          )}

          {/* Grupo: En Progreso */}
          {grupos.en_progreso.length > 0 && (
            <TaskGroup type="en_progreso" count={grupos.en_progreso.length}>
              {grupos.en_progreso.map(tarea => (
                  <KanbanCard
                    key={tarea.id}
                    title={tarea.nombre}
                    subtitle={tarea.proyecto_nombre}
                    indicatorColor={ESTADO_COLORS[tarea.estado] || ESTADO_COLORS['Pendiente']}
                    badges={[{ label: tarea.prioridad }, { label: tarea.categoria }]}
                    dueDate={tarea.fecha_vencimiento ? new Date(tarea.fecha_vencimiento).toLocaleDateString('es-ES') : undefined}
                    assignee={tarea.responsable_nombre ? { name: tarea.responsable_nombre } : undefined}
                    onClick={() => handleTaskClick(tarea)}
                  />
              ))}
            </TaskGroup>
          )}

          {/* Grupo: Sin Vencimiento */}
          {grupos.sin_vencimiento.length > 0 && (
            <TaskGroup type="sin_vencimiento" count={grupos.sin_vencimiento.length}>
              {grupos.sin_vencimiento.map(tarea => (
                  <KanbanCard
                    key={tarea.id}
                    title={tarea.nombre}
                    subtitle={tarea.proyecto_nombre}
                    indicatorColor={ESTADO_COLORS[tarea.estado] || ESTADO_COLORS['Pendiente']}
                    badges={[{ label: tarea.prioridad }, { label: tarea.categoria }]}
                    dueDate={tarea.fecha_vencimiento ? new Date(tarea.fecha_vencimiento).toLocaleDateString('es-ES') : undefined}
                    assignee={tarea.responsable_nombre ? { name: tarea.responsable_nombre } : undefined}
                    onClick={() => handleTaskClick(tarea)}
                  />
              ))}
            </TaskGroup>
          )}

          {/* Grupo: Completadas Recientes */}
          {grupos.completadas_recientes.length > 0 && (
            <TaskGroup type="completadas_recientes" count={grupos.completadas_recientes.length} defaultExpanded={false}>
              {grupos.completadas_recientes.map(tarea => (
                  <KanbanCard
                    key={tarea.id}
                    title={tarea.nombre}
                    subtitle={tarea.proyecto_nombre}
                    indicatorColor={ESTADO_COLORS[tarea.estado] || ESTADO_COLORS['Pendiente']}
                    badges={[{ label: tarea.prioridad }, { label: tarea.categoria }]}
                    dueDate={tarea.fecha_vencimiento ? new Date(tarea.fecha_vencimiento).toLocaleDateString('es-ES') : undefined}
                    assignee={tarea.responsable_nombre ? { name: tarea.responsable_nombre } : undefined}
                    onClick={() => handleTaskClick(tarea)}
                  />
              ))}
            </TaskGroup>
          )}
          </div>
        </StaggeredList>
      )}
    </ModuleContainer>
  )
}
