"use client"

import { useState } from 'react'
import { CheckSquare, Plus, Trash2, Edit2, ChevronDown, ChevronRight, Save, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/toggle'
import { ModuleContainer } from '@/components/module/ModuleContainer'
import { AccessDeniedCard } from '@/components/ui/access-denied-card'
import { useAuth } from '@/contexts/auth-context'
import { cn } from '@/lib/utils'
import { type PlantillaTarea, type CategoriaTarea, type PrioridadTarea, CATEGORIAS, PRIORIDADES, PLANTILLAS_POR_FASE } from '@/types/tareas'
import { StatusBadge } from '@/components/module/StatusBadge'

// ============================================================================
// PROPS
// ============================================================================

interface PlantillaEditada extends Omit<PlantillaTarea, 'fase_id'> {
  fase_id: number
}

// ============================================================================
// CONFIGURACIÓN DE FASES
// ============================================================================

const FASES = [
  { id: 1, nombre: 'Prospecto', icono: '📋', color: 'text-slate-400', bgColor: 'bg-slate-500/15' },
  { id: 2, nombre: 'Diagnóstico', icono: '🔍', color: 'text-blue-400', bgColor: 'bg-blue-500/15' },
  { id: 3, nombre: 'Propuesta', icono: '📝', color: 'text-amber-400', bgColor: 'bg-amber-500/15' },
  { id: 4, nombre: 'Implementación', icono: '⚙️', color: 'text-emerald-400', bgColor: 'bg-emerald-500/15' },
  { id: 5, nombre: 'Cierre', icono: '🎯', color: 'text-violet-400', bgColor: 'bg-violet-500/15' },
]

// ============================================================================
// COMPONENTE: PLANTILLA ROW
// ============================================================================

interface PlantillaRowProps {
  plantilla: PlantillaTarea
  isEditing: boolean
  editedData: PlantillaEditada
  onEdit: () => void
  onCancel: () => void
  onSave: () => void
  onChange: (data: Partial<PlantillaEditada>) => void
  onDelete: () => void
}

function PlantillaRow({
  plantilla,
  isEditing,
  editedData,
  onEdit,
  onCancel,
  onSave,
  onChange,
  onDelete,
}: PlantillaRowProps) {
  if (!isEditing) {
    // Vista de solo lectura
    return (
      <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors">
        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-medium truncate">{plantilla.nombre}</h4>
            <Badge variant="outline" className={cn(
              'text-[10px] shrink-0',
              plantilla.categoria === 'Técnica' && 'border-purple-500/50 text-purple-400',
              plantilla.categoria === 'Comercial' && 'border-violet-500/50 text-violet-400',
              plantilla.categoria === 'Compras' && 'border-emerald-500/50 text-emerald-400',
              plantilla.categoria === 'Administrativa' && 'border-amber-500/50 text-amber-400'
            )}>
              {plantilla.categoria}
            </Badge>
            <StatusBadge status={plantilla.prioridad} type="prioridad" />
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Vence: {plantilla.dias_vencimiento}d</span>
            {plantilla.requiere_cliente && (
              <Badge variant="outline" className="text-[10px] border-cyan-500/50 text-cyan-400">
                Requiere Cliente
              </Badge>
            )}
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-1 shrink-0">
          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={onEdit}>
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8 text-red-400 hover:text-red-500" onClick={onDelete}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    )
  }

  // Vista de edición
  return (
    <div className="p-4 rounded-lg bg-card border border-primary/30 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs">Nombre</Label>
          <Input
            value={editedData.nombre}
            onChange={(e) => onChange({ nombre: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-xs">Categoría</Label>
          <Select value={editedData.categoria} onValueChange={(v) => onChange({ categoria: v as CategoriaTarea })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIAS.map(c => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Prioridad</Label>
          <Select value={editedData.prioridad} onValueChange={(v) => onChange({ prioridad: v as PrioridadTarea })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRIORIDADES.map(p => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Días para vencer</Label>
          <Input
            type="number"
            min="1"
            value={editedData.dias_vencimiento}
            onChange={(e) => onChange({ dias_vencimiento: parseInt(e.target.value, 10) || 1 })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs">Descripción</Label>
        <Textarea
          value={editedData.descripcion || ''}
          onChange={(e) => onChange({ descripcion: e.target.value })}
          rows={2}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">Requiere cliente</span>
          <Switch
            checked={editedData.requiere_cliente}
            onCheckedChange={(checked) => onChange({ requiere_cliente: checked })}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
          <Button size="sm" onClick={onSave}>
            <Save className="h-3.5 w-3.5 mr-1" />
            Guardar
          </Button>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// COMPONENTE: SECCIÓN DE FASE
// ============================================================================

interface FaseSectionProps {
  faseId: number
  nombre: string
  plantillas: PlantillaTarea[]
  plantillasEditando: Set<string>
  plantillaEditData: Record<string, PlantillaEditada>
  onStartEdit: (plantilla: PlantillaTarea) => void
  onCancelEdit: (id: string) => void
  onSaveEdit: (id: string) => void
  onChangeEdit: (id: string, data: Partial<PlantillaEditada>) => void
  onDelete: (id: string) => void
  onAddNew: (faseId: number) => void
}

function FaseSection({
  faseId,
  nombre,
  plantillas,
  plantillasEditando,
  plantillaEditData,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onChangeEdit,
  onDelete,
  onAddNew,
}: FaseSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const faseConfig = FASES.find(f => f.id === faseId)
  const config = faseConfig || FASES[0]

  return (
    <div className="rounded-lg border overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'w-full flex items-center justify-between px-4 py-3 transition-colors',
          config.bgColor
        )}
      >
        <div className="flex items-center gap-3">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="text-lg">{config.icono}</span>
          <div className="text-left">
            <h3 className={cn('text-sm font-semibold', config.color)}>
              FASE {faseId}: {nombre.toUpperCase()}
            </h3>
            <p className="text-xs text-muted-foreground">
              {plantillas.length} plantilla{plantillas.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </button>

      {/* Contenido */}
      {isExpanded && (
        <div className="p-4 space-y-3">
          {/* Lista de plantillas */}
          {plantillas.map(p => (
            <PlantillaRow
              key={p.id}
              plantilla={p}
              isEditing={plantillasEditando.has(p.id)}
              editedData={plantillaEditData[p.id]}
              onEdit={() => onStartEdit(p)}
              onCancel={() => onCancelEdit(p.id)}
              onSave={() => onSaveEdit(p.id)}
              onChange={(data) => onChangeEdit(p.id, data)}
              onDelete={() => onDelete(p.id)}
            />
          ))}

          {/* Botón agregar */}
          {plantillasEditando.size === 0 && (
            <Button
              variant="outline"
              size="sm"
              className="w-full border-dashed"
              onClick={() => onAddNew(faseId)}
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Agregar plantilla
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function TaskTemplatesPage() {
  const { user } = useAuth()
  
  // Estado de plantillas
  const [plantillas, setPlantillas] = useState<PlantillaTarea[]>(PLANTILLAS_POR_FASE)
  const [plantillasEditando, setPlantillasEditando] = useState<Set<string>>(new Set())
  const [plantillaEditData, setPlantillaEditData] = useState<Record<string, PlantillaEditada>>({})
  const [nuevasPlantillas, setNuevasPlantillas] = useState<Record<number, Partial<PlantillaEditada>>>({})
  const [isSaving, setIsSaving] = useState(false)

  // Verificar si es admin
  const isAdmin = user?.roles.includes('admin')

  // Agrupar plantillas por fase
  const plantillasPorFase = FASES.reduce((acc, fase) => {
    acc[fase.id] = plantillas.filter(p => p.fase_id === fase.id)
    return acc
  }, {} as Record<number, PlantillaTarea[]>)

  // Handlers
  const handleStartEdit = (plantilla: PlantillaTarea) => {
    setPlantillasEditando(prev => new Set(prev).add(plantilla.id))
    setPlantillaEditData(prev => ({
      ...prev,
      [plantilla.id]: {
        ...plantilla,
        fase_id: plantilla.fase_id,
      },
    }))
  }

  const handleCancelEdit = (id: string) => {
    setPlantillasEditando(prev => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
    setPlantillaEditData(prev => {
      const { [id]: _, ...rest } = prev
      return rest
    })
  }

  const handleSaveEdit = (id: string) => {
    const data = plantillaEditData[id]
    if (!data) return

    setPlantillas(prev => prev.map(p => 
      p.id === id 
        ? { ...p, ...data }
        : p
    ))
    handleCancelEdit(id)
  }

  const handleChangeEdit = (id: string, data: Partial<PlantillaEditada>) => {
    setPlantillaEditData(prev => ({
      ...prev,
      [id]: { ...prev[id], ...data },
    }))
  }

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta plantilla?')) {
      setPlantillas(prev => prev.filter(p => p.id !== id))
      handleCancelEdit(id)
    }
  }

  const handleAddNew = (faseId: number) => {
    const newId = `new-${Date.now()}`
    const newPlantilla: Partial<PlantillaEditada> = {
      id: newId,
      fase_id: faseId,
      nombre: 'Nueva tarea',
      categoria: 'General',
      prioridad: 'Media',
      dias_vencimiento: 7,
      requiere_cliente: false,
      subtareas: [],
    }
    setNuevasPlantillas(prev => ({ ...prev, [faseId]: newPlantilla }))
  }

  const _handleSaveNew = (faseId: number) => {
    const newData = nuevasPlantillas[faseId]
    if (!newData) return

    const fullPlantilla: PlantillaTarea = {
      id: `p${Date.now()}`,
      fase_id: faseId,
      nombre: newData.nombre || 'Nueva tarea',
      descripcion: newData.descripcion,
      categoria: newData.categoria || 'General',
      prioridad: newData.prioridad || 'Media',
      dias_vencimiento: newData.dias_vencimiento || 7,
      requiere_cliente: newData.requiere_cliente || false,
      subtareas: [],
    }

    setPlantillas(prev => [...prev, fullPlantilla])
    setNuevasPlantillas(prev => {
      const { [faseId]: _, ...rest } = prev
      return rest
    })
  }

  const _handleCancelNew = (faseId: number) => {
    setNuevasPlantillas(prev => {
      const { [faseId]: _, ...rest } = prev
      return rest
    })
  }

  // Guardar cambios (simulado)
  const handleSaveAll = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      alert('Plantillas guardadas correctamente')
    }, 1000)
  }

  // Restaurar valores originales
  const handleReset = () => {
    if (confirm('¿Restaurar las plantillas originales?')) {
      setPlantillas(PLANTILLAS_POR_FASE)
      setPlantillasEditando(new Set())
      setPlantillaEditData({})
      setNuevasPlantillas({})
    }
  }

  if (!isAdmin) {
    return (
      <ModuleContainer>
        <AccessDeniedCard 
          icon={CheckSquare} 
          title="Acceso Restringido"
          description="Solo los administradores pueden configurar las plantillas de tareas."
        />
      </ModuleContainer>
    )
  }

  return (
    <ModuleContainer>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-violet-500/15">
            <CheckSquare className="h-6 w-6 text-violet-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Plantillas de Tareas</h1>
            <p className="text-sm text-muted-foreground">
              Configura las tareas automáticas que se crean al entrar en cada fase
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Restaurar
          </Button>
          <Button size="sm" onClick={handleSaveAll} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </div>

      {/* Info */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-6">
        <p className="text-sm text-amber-400">
          <strong>Importante:</strong> Las plantillas de tareas se crean automáticamente cuando un proyecto avanza a cada fase. Puedes personalizar el nombre, categoría, prioridad y días de vencimiento de cada una.
        </p>
      </div>

      {/* Secciones por fase */}
      <div className="space-y-4">
        {FASES.map(fase => (
          <FaseSection
            key={fase.id}
            faseId={fase.id}
            nombre={fase.nombre}
            plantillas={plantillasPorFase[fase.id] || []}
            plantillasEditando={plantillasEditando}
            plantillaEditData={plantillaEditData}
            onStartEdit={handleStartEdit}
            onCancelEdit={handleCancelEdit}
            onSaveEdit={handleSaveEdit}
            onChangeEdit={handleChangeEdit}
            onDelete={handleDelete}
            onAddNew={handleAddNew}
          />
        ))}
      </div>
    </ModuleContainer>
  )
}
