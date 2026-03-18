"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, X, CheckSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

// Generic subtask type that can be used across different entity types
export interface Subtask {
  id: string
  nombre: string
  completada: boolean
}

// For cases where ID might not exist yet (e.g., during creation)
export interface SubtaskWithOptionalId {
  id?: string
  nombre: string
  completada?: boolean
}

interface SubtaskListProps {
  subtareas: Subtask[] | SubtaskWithOptionalId[]
  onAdd: (nombre: string) => void
  onToggle: (id: string | number) => void
  onDelete?: (id: string | number) => void
  placeholder?: string
  submitLabel?: string
  emptyMessage?: string
  title?: string
  showProgress?: boolean
  maxHeight?: string
  className?: string
}

/**
 * SubtaskList - Componente reutilizable para gestionar listas de subtareas
 * 
 * Características:
 * - Input para agregar nuevas subtareas
 * - Toggle para completar/incompletar
 * - Botón de eliminar opcional
 * - Indicador de progreso (completadas/total)
 * - Scroll si hay muchas subtareas
 * - Soporta tanto IDs como índices
 */
export function SubtaskList({
  subtareas,
  onAdd,
  onToggle,
  onDelete,
  placeholder = 'Nueva subtarea...',
  submitLabel = 'Agregar',
  emptyMessage = 'No hay subtareas',
  title = 'Subtareas',
  showProgress = true,
  maxHeight = 'max-h-[200px]',
  className,
}: SubtaskListProps) {
  const [newSubtarea, setNewSubtarea] = useState('')

  const completedCount = subtareas.filter(s => s.completada).length

  const handleAdd = () => {
    if (newSubtarea.trim()) {
      onAdd(newSubtarea.trim())
      setNewSubtarea('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAdd()
    }
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckSquare className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">{title}</h3>
        </div>
        {showProgress && subtareas.length > 0 && (
          <span className="text-xs text-muted-foreground">
            {completedCount}/{subtareas.length}
          </span>
        )}
      </div>

      {/* Input para agregar */}
      <div className="flex gap-2">
        <Input
          placeholder={placeholder}
          value={newSubtarea}
          onChange={(e) => setNewSubtarea(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1"
        />
        <Button
          size="icon"
          variant="outline"
          onClick={handleAdd}
          disabled={!newSubtarea.trim()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Lista de subtareas */}
      {subtareas.length > 0 ? (
        <div className={cn('space-y-1 overflow-y-auto', maxHeight)}>
          {subtareas.map((subtarea, index) => {
            // Use ID if available, otherwise fall back to index
            const itemId = subtarea.id ?? String(index)

            return (
              <div
                key={itemId}
                className={cn(
                  'flex items-center gap-2 p-2 rounded-md text-sm transition-colors',
                  'hover:bg-muted/50 group'
                )}
              >
                <Checkbox
                  checked={subtarea.completada || false}
                  onCheckedChange={() => onToggle(itemId)}
                />
                <span
                  className={cn(
                    'flex-1 transition-all',
                    subtarea.completada && 'line-through text-muted-foreground'
                  )}
                >
                  {subtarea.nombre}
                </span>
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onDelete(itemId)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-4">
          {emptyMessage}
        </p>
      )}
    </div>
  )
}
