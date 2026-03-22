"use client"

import { useState, useEffect } from 'react'
import { Link2, X, AlertTriangle, CheckCircle2, Clock, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { taskService } from '@/services/taskService'
import { type Tarea, type Dependencia, type TipoDependencia, TIPO_DEPENDENCIA_LABELS } from '@/types/tareas'
import { StatusBadge } from '@/components/module/StatusBadge'

// ============================================================================
// PROPS
// ============================================================================

export interface DependenciesSelectorProps {
  /** Proyecto al que pertenece la tarea */
  proyectoId: string
  /** Tarea que se está editando (para excluir de dependencias) */
  tareaActualId?: string
  /** Dependencias actuales */
  dependencies: Dependencia[]
  /** Callback cuando cambian las dependencias */
  onChange: (dependencies: Dependencia[]) => void
  /** Deshabilitar el selector */
  disabled?: boolean
  /** Clase CSS adicional */
  className?: string
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

/**
 * DependenciesSelector - Selector de dependencias entre tareas
 * 
 * Características:
 * - Lista tareas disponibles del proyecto
 * - Permite agregar dependencias con tipo (bloqueante, inicio-después, fin-después)
 * - Muestra días de desplazamiento opcionalmente
 * - Lista dependencias agregadas con opción de eliminar
 * - Valida que no haya ciclos
 */
export function DependenciesSelector({
  proyectoId,
  tareaActualId,
  dependencies,
  onChange,
  disabled = false,
  className,
}: DependenciesSelectorProps) {
  const [availableTasks, setAvailableTasks] = useState<Tarea[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Estado para agregar nueva dependencia
  const [selectedTaskId, setSelectedTaskId] = useState('')
  const [selectedType, setSelectedType] = useState<TipoDependencia>('bloqueante')
  const [daysOffset, setDaysOffset] = useState('')

  // Cargar tareas disponibles
  useEffect(() => {
    const loadTasks = async () => {
      setIsLoading(true)
      try {
        const tasks = await taskService.getTasksForDependency(proyectoId, tareaActualId)
        setAvailableTasks(tasks)
      } catch (error) {
        console.error('Error cargando tareas para dependencias:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    if (proyectoId) {
      loadTasks()
    }
  }, [proyectoId, tareaActualId])

  // Agregar dependencia
  const handleAddDependency = () => {
    if (!selectedTaskId) return
    
    const newDep: Dependencia = {
      tarea_id: selectedTaskId,
      tipo: selectedType,
    }
    
    if (daysOffset && selectedType !== 'bloqueante') {
      newDep.dias_desplazamiento = parseInt(daysOffset, 10) || 0
    }
    
    // Verificar que no exista ya
    if (dependencies.some(d => d.tarea_id === selectedTaskId)) {
      return
    }
    
    onChange([...dependencies, newDep])
    setSelectedTaskId('')
    setDaysOffset('')
  }

  // Eliminar dependencia
  const handleRemoveDependency = (tareaId: string) => {
    onChange(dependencies.filter(d => d.tarea_id !== tareaId))
  }

  // Cambiar días de desplazamiento
  const handleChangeDays = (tareaId: string, days: string) => {
    onChange(dependencies.map(d => 
      d.tarea_id === tareaId 
        ? { ...d, dias_desplazamiento: parseInt(days, 10) || 0 }
        : d
    ))
  }

  // Obtener nombre de tarea por ID (de las disponibles)
  const getTaskName = (tareaId: string): string => {
    const task = availableTasks.find(t => t.id === tareaId)
    return task?.nombre || 'Tarea'
  }

  // ========================================================================
  // RENDER
  // ========================================================================
  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link2 className="h-4 w-4 text-amber-400" />
          <Label className="text-sm font-medium">Dependencias</Label>
        </div>
        <Badge variant="outline" className="text-xs">
          {dependencies.length} {dependencies.length === 1 ? 'dependencia' : 'dependencias'}
        </Badge>
      </div>

      {/* Lista de dependencias actuales */}
      {dependencies.length > 0 && (
        <div className="space-y-2">
          {dependencies.map((dep) => {
            const typeConfig = TIPO_DEPENDENCIA_LABELS[dep.tipo]
            
            return (
              <div
                key={dep.tarea_id}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/50"
              >
                {/* Indicador de tipo */}
                <div className={cn(
                  'shrink-0 p-1.5 rounded-md',
                  dep.tipo === 'bloqueante' && 'bg-red-500/15 text-red-400',
                  dep.tipo === 'inicio_despues' && 'bg-amber-500/15 text-amber-400',
                  dep.tipo === 'fin_despues' && 'bg-emerald-500/15 text-emerald-400',
                )}>
                  {dep.tipo === 'bloqueante' ? (
                    <AlertTriangle className="h-3.5 w-3.5" />
                  ) : dep.tipo === 'inicio_despues' ? (
                    <Clock className="h-3.5 w-3.5" />
                  ) : (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  )}
                </div>
                
                {/* Info de la tarea */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{getTaskName(dep.tarea_id)}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge 
                      className={cn(
                        'text-[10px] px-1.5 py-0',
                        dep.tipo === 'bloqueante' && 'bg-red-500/15 text-red-400',
                        dep.tipo === 'inicio_despues' && 'bg-amber-500/15 text-amber-400',
                        dep.tipo === 'fin_despues' && 'bg-emerald-500/15 text-emerald-400',
                      )}
                    >
                      {typeConfig.label}
                    </Badge>
                    {dep.dias_desplazamiento !== undefined && dep.dias_desplazamiento > 0 && (
                      <span className="text-[10px] text-muted-foreground">
                        +{dep.dias_desplazamiento}d
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Selector de tipo (si no es bloqueante) */}
                {dep.tipo !== 'bloqueante' && (
                  <Input
                    type="number"
                    min="0"
                    placeholder="+días"
                    value={dep.dias_desplazamiento || ''}
                    onChange={(e) => handleChangeDays(dep.tarea_id, e.target.value)}
                    className="w-16 h-7 text-xs"
                    disabled={disabled}
                  />
                )}
                
                {/* Botón eliminar */}
                {!disabled && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 shrink-0"
                    onClick={() => handleRemoveDependency(dep.tarea_id)}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Selector para agregar nueva dependencia */}
      {!disabled && availableTasks.length > 0 && (
        <div className="space-y-3 p-3 rounded-lg border border-dashed border-border bg-muted/20">
          <p className="text-xs text-muted-foreground">
            Agregar dependencia: esta tarea dependerá de otra tarea
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* Selector de tarea */}
            <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Seleccionar tarea..." />
              </SelectTrigger>
              <SelectContent>
                {availableTasks.map((task) => (
                  <SelectItem key={task.id} value={task.id}>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={task.categoria} type="categoria" />
                      <span className="truncate max-w-[150px]">{task.nombre}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Selector de tipo */}
            <Select value={selectedType} onValueChange={(v) => setSelectedType(v as TipoDependencia)}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bloqueante">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-3 w-3 text-red-400" />
                    <span>Bloqueante</span>
                  </div>
                </SelectItem>
                <SelectItem value="inicio_despues">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-amber-400" />
                    <span>Inicio después</span>
                  </div>
                </SelectItem>
                <SelectItem value="fin_despues">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                    <span>Fin después</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            
            {/* Botón agregar */}
            <Button
              size="sm"
              variant="outline"
              className="h-8"
              onClick={handleAddDependency}
              disabled={!selectedTaskId}
            >
              <Plus className="h-3 w-3 mr-1" />
              Agregar
            </Button>
          </div>
          
          {/* Info del tipo seleccionado */}
          <p className="text-[10px] text-muted-foreground">
            {TIPO_DEPENDENCIA_LABELS[selectedType].description}
          </p>
        </div>
      )}

      {/* Estado vacío */}
      {dependencies.length === 0 && availableTasks.length === 0 && !isLoading && (
        <p className="text-xs text-muted-foreground text-center py-4">
          No hay tareas disponibles para crear dependencias
        </p>
      )}

      {/* Loading */}
      {isLoading && (
        <p className="text-xs text-muted-foreground text-center py-4">
          Cargando tareas...
        </p>
      )}
    </div>
  )
}

// ============================================================================
// COMPONENTE COMPACTO PARA VER DEPENDENCIAS (LECTURA)
// ============================================================================

export interface DependencyBadgeProps {
  dependency: Dependencia
  taskName?: string
  className?: string
}

/**
 * DependencyBadge - Muestra una dependencia en formato compacto
 */
export function DependencyBadge({ dependency, taskName, className }: DependencyBadgeProps) {
  const typeConfig = TIPO_DEPENDENCIA_LABELS[dependency.tipo]
  
  return (
    <div className={cn(
      'inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs',
      dependency.tipo === 'bloqueante' && 'bg-red-500/15 text-red-400',
      dependency.tipo === 'inicio_despues' && 'bg-amber-500/15 text-amber-400',
      dependency.tipo === 'fin_despues' && 'bg-emerald-500/15 text-emerald-400',
      className
    )}>
      {dependency.tipo === 'bloqueante' ? (
        <AlertTriangle className="h-3 w-3" />
      ) : dependency.tipo === 'inicio_despues' ? (
        <Clock className="h-3 w-3" />
      ) : (
        <CheckCircle2 className="h-3 w-3" />
      )}
      <span className="font-medium">{typeConfig.label}</span>
      {dependency.dias_desplazamiento !== undefined && dependency.dias_desplazamiento > 0 && (
        <span>(+{dependency.dias_desplazamiento}d)</span>
      )}
      {taskName && (
        <span className="text-muted-foreground truncate max-w-[100px]">
          {taskName}
        </span>
      )}
    </div>
  )
}
