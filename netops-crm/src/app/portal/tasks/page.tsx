"use client"

import { useState, useEffect } from 'react'
import { CheckCircle2, Circle, AlertTriangle, Eye, RotateCcw, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { usePortalAuth } from '@/contexts/portal-auth-context'
import { taskService } from '@/services/taskService'
import { cn } from '@/lib/utils'
import { type Tarea } from '@/types/tareas'
import { StatusBadge } from '@/components/module/StatusBadge'

// ============================================================================
// PROPS
// ============================================================================

interface TaskClienteFiltros {
  proyectoId?: string
  estado?: 'pendientes' | 'completadas'
}

// ============================================================================
// COMPONENTE: TAREA CLIENTE
// ============================================================================

interface TareaClienteCardProps {
  tarea: Tarea
  puedeReabrir?: boolean
  diasRestantesReapertura?: number
  onCompletar?: () => void
  onReabrir?: () => void
  onVerDetalle?: () => void
}

function TareaClienteCard({
  tarea,
  puedeReabrir = false,
  diasRestantesReapertura = 0,
  onCompletar,
  onReabrir,
  onVerDetalle,
}: TareaClienteCardProps) {
  const isCompleted = tarea.estado === 'Completada'
  const isOverdue = tarea.fecha_vencimiento && 
    new Date(tarea.fecha_vencimiento) < new Date() && 
    !isCompleted

  return (
    <Card className={cn(
      'p-4 border',
      isCompleted && 'bg-emerald-500/5 border-emerald-500/20',
      isOverdue && 'bg-red-500/5 border-red-500/30'
    )}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          {isCompleted ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          ) : (
            <Circle className="h-5 w-5 text-slate-400" />
          )}
          <h3 className={cn(
            'font-medium text-sm',
            isCompleted && 'line-through text-muted-foreground'
          )}>
            {tarea.nombre}
          </h3>
        </div>
        
        {isOverdue && (
          <Badge variant="destructive" className="text-[10px]">
            Vencida
          </Badge>
        )}
      </div>

      {/* Descripción */}
      {tarea.descripcion && (
        <p className="text-xs text-muted-foreground mb-3">
          {tarea.descripcion}
        </p>
      )}

      {/* Meta info */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-3">
        <StatusBadge status={tarea.categoria} type="categoria" />
        
        {tarea.fecha_vencimiento && (
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>Vence: {new Date(tarea.fecha_vencimiento).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'short',
            })}</span>
          </div>
        )}
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-2">
        {/* Completar tarea (solo pendientes) */}
        {!isCompleted && onCompletar && (
          <Button
            size="sm"
            variant="default"
            className="flex-1 bg-emerald-500 hover:bg-emerald-600"
            onClick={onCompletar}
          >
            <CheckCircle2 className="h-4 w-4 mr-1" />
            Completar
          </Button>
        )}

        {/* Reabrir tarea (solo completadas con permiso) */}
        {isCompleted && puedeReabrir && onReabrir && (
          <Button
            size="sm"
            variant="outline"
            className="flex-1 border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
            onClick={onReabrir}
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reabrir ({diasRestantesReapertura}d)
          </Button>
        )}

        {/* Sin permiso de reabrir */}
        {isCompleted && !puedeReabrir && (
          <Badge variant="outline" className="flex-1 justify-center text-muted-foreground">
            {diasRestantesReapertura === 0 ? 'Completada' : `Reabrir (${diasRestantesReapertura}d)`}
          </Badge>
        )}

        {/* Ver detalle */}
        {onVerDetalle && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onVerDetalle}
          >
            <Eye className="h-4 w-4" />
          </Button>
        )}
      </div>
    </Card>
  )
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function PortalTasksPage() {
  const { user } = usePortalAuth()
  
  const [tareas, setTareas] = useState<Tarea[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<TaskClienteFiltros>({ estado: 'pendientes' })
  const [, setCompletingId] = useState<string | null>(null)

  // Cargar tareas del cliente
  useEffect(() => {
    const loadTasks = async () => {
      if (!user?.contactoId) return
      
      setIsLoading(true)
      try {
        const clientTasks = await taskService.getTasksForCliente(user.contactoId)
        setTareas(clientTasks)
      } catch (error) {
        console.error('Error cargando tareas:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTasks()
  }, [user?.contactoId])

  // Filtrar tareas
  const tareasFiltradas = tareas.filter(t => {
    if (filters.estado === 'pendientes') {
      return t.estado !== 'Completada'
    }
    return t.estado === 'Completada'
  })

  // Completar tarea
  const handleCompletar = async (tarea: Tarea) => {
    if (!user?.contactoId) return
    try {
      await taskService.updateTask(tarea.id, {
        estado: 'Completada',
        fecha_completado: new Date().toISOString(),
      })
      
      // Actualizar estado local
      setTareas(prev => prev.map(t => 
        t.id === tarea.id 
          ? { ...t, estado: 'Completada', fecha_completado: new Date().toISOString() }
          : t
      ))
    } catch (error) {
      console.error('Error completando tarea:', error)
    } finally {
      setCompletingId(null)
    }
  }

  // Reabrir tarea
  const handleReabrir = async (tarea: Tarea) => {
    setCompletingId(tarea.id)
    try {
      await taskService.reopenTask(tarea.id)
      
      // Actualizar estado local
      setTareas(prev => prev.map(t => 
        t.id === tarea.id 
          ? { ...t, estado: 'En progreso', fecha_completado: undefined }
          : t
      ))
    } catch (error) {
      console.error('Error reopen task:', error)
    } finally {
      setCompletingId(null)
    }
  }

  // Ver detalle
  const handleVerDetalle = (tarea: Tarea) => {
    console.log('Ver detalle:', tarea.id)
    // Por ahora logueamos
  }

  // Contadores
  const pendientesCount = tareas.filter(t => t.estado !== 'Completada').length
  const completadasCount = tareas.filter(t => t.estado === 'Completada').length

  // Si no hay usuario
  if (!user) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-2xl mx-auto text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Portal del Cliente</h1>
          <p className="text-muted-foreground">
            Debes iniciar sesión para ver tus tareas.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border/50 px-6 py-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            Mis Tareas
          </h1>
          <p className="text-sm text-muted-foreground">
            Bienvenido, {user.nombre}
          </p>
        </div>
      </header>

      {/* Contenido */}
      <main className="max-w-2xl mx-auto px-6 py-6">
        {/* Contadores */}
        <div className="flex gap-4 mb-6">
          <button
            type="button"
            onClick={() => setFilters({ ...filters, estado: 'pendientes' })}
            className={cn(
              'flex-1 p-4 rounded-xl border text-center transition-all',
              filters.estado === 'pendientes'
                ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                : 'bg-muted/50 border-transparent hover:bg-muted'
            )}
          >
            <div className="text-2xl font-bold">{pendientesCount}</div>
            <div className="text-xs">Pendientes</div>
          </button>
          
          <button
            type="button"
            onClick={() => setFilters({ ...filters, estado: 'completadas' })}
            className={cn(
              'flex-1 p-4 rounded-xl border text-center transition-all',
              filters.estado === 'completadas'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-muted/50 border-transparent hover:bg-muted'
            )}
          >
            <div className="text-2xl font-bold">{completadasCount}</div>
            <div className="text-xs">Completadas</div>
          </button>
        </div>

        {/* Info sobre reabrir */}
        {filters.estado === 'completadas' && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 mb-6">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-400">
                Puedes reabrir una tarea completada hasta <strong>3 días después</strong> de haberla marcado como completada. Pasado ese plazo, contacta a tu ejecutivo de cuenta.
              </p>
            </div>
          </div>
        )}

        {/* Lista de tareas */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : tareasFiltradas.length === 0 ? (
          <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed border-border">
            <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-30" />
            <h3 className="font-medium mb-1">
              {filters.estado === 'pendientes' ? '¡Todo al día!' : 'Sin tareas completadas'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {filters.estado === 'pendientes' 
                ? 'No tienes tareas pendientes. ¡Buen trabajo!' 
                : 'Aún no has completado ninguna tarea.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {tareasFiltradas.map(tarea => (
              <TareaClienteCard
                key={tarea.id}
                tarea={tarea}
                onCompletar={() => handleCompletar(tarea)}
                onReabrir={() => handleReabrir(tarea)}
                onVerDetalle={() => handleVerDetalle(tarea)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
