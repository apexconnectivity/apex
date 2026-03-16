"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useProyectos } from "@/lib/data"
import type { Proyecto } from "@/types/proyectos"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ModuleCard } from "@/components/module/ModuleCard"
import {
  FolderKanban,
  MoreHorizontal,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  Target,
  Clock,
} from "lucide-react"

// Tipos locales para el componente
interface Project {
  id: string
  name: string
  client: string
  phase: number
  progress: number
  dueDate: string
  value: string
  assignee: {
    name: string
    avatar?: string
  }
  tags: string[]
}

interface Phase {
  id: number
  name: string
  color: string
  projects: Project[]
  totalValue: number
  projectCount: number
}

// Funciones helper para las fases
function getFaseName(faseId: number): string {
  const faseNames: Record<number, string> = {
    1: "Prospecto",
    2: "Diagnóstico",
    3: "Propuesta",
    4: "Implementación",
    5: "Cierre",
  }
  return faseNames[faseId] || "Desconocido"
}

function getFaseColor(faseId: number): string {
  const faseColors: Record<number, string> = {
    1: "#6b7280",
    2: "#3b82f6",
    3: "#eab308",
    4: "#10b981",
    5: "#8b5cf6",
  }
  return faseColors[faseId] || "#6b7280"
}

// Función para convertir Proyecto a Project (formato interno del componente)
function mapProyectoToProject(proyecto: Proyecto): Project {
  // Formatear fecha
  const fechaFormateada = proyecto.fecha_estimada_fin
    ? new Date(proyecto.fecha_estimada_fin).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    })
    : "Sin fecha"

  // Formatear monto
  const montoFormateado = proyecto.monto_estimado
    ? new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: proyecto.moneda || "MXN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(proyecto.monto_estimado)
    : "Sin monto"

  return {
    id: proyecto.id,
    name: proyecto.nombre,
    client: proyecto.cliente_nombre || "Sin cliente",
    phase: proyecto.fase_actual,
    progress: proyecto.probabilidad_cierre || 0,
    dueDate: fechaFormateada,
    value: montoFormateado,
    assignee: {
      name: proyecto.responsable_nombre || "Sin asignar",
    },
    tags: proyecto.tags || [],
  }
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <ModuleCard className="group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm truncate text-foreground">
            {project.name}
          </h4>
          <p className="text-xs text-muted-foreground truncate">
            {project.client}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-muted-foreground">Progreso</span>
          <span className="font-medium">{project.progress}%</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {/* Tags */}
      {project.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {project.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-[10px] px-1.5 py-0 h-5"
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-border/50">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>{project.dueDate}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-green-600 dark:text-green-400">
            {project.value}
          </span>
          <Avatar className="h-6 w-6 border border-border">
            <AvatarImage src={project.assignee.avatar} />
            <AvatarFallback className="text-[10px]">
              {project.assignee.name.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </ModuleCard>
  )
}

interface ProjectPipelineProps {
  showAllPhases?: boolean
  showCommercialPhases?: boolean
  showAssignedOnly?: boolean
}

export function ProjectPipeline({
  showAllPhases = true,
  showCommercialPhases = false,
  showAssignedOnly = false
}: ProjectPipelineProps) {
  // Usar hook centralizado para obtener los proyectos
  const [proyectos] = useProyectos()
  const isLoaded = true

  // Mapear proyectos al formato interno
  const mappedProjects: Project[] = React.useMemo(() => {
    return proyectos.map(mapProyectoToProject)
  }, [proyectos])

  // Crear estructura de fases basada en los proyectos
  const phases: Phase[] = React.useMemo(() => {
    return [1, 2, 3, 4, 5].map(faseId => {
      const phaseProjects = mappedProjects.filter(p => p.phase === faseId)
      const totalValue = phaseProjects.reduce((sum, p) => {
        // Extraer valor numérico del string formateado
        const numericValue = p.value.replace(/[^0-9.-]/g, '')
        return sum + (parseFloat(numericValue) || 0)
      }, 0)
      
      return {
        id: faseId,
        name: getFaseName(faseId),
        color: getFaseColor(faseId),
        projects: phaseProjects,
        totalValue,
        projectCount: phaseProjects.length
      }
    })
  }, [mappedProjects])

  // Filtrar fases según permisos
  const getVisiblePhases = () => {
    if (showAllPhases) return phases

    if (showCommercialPhases) {
      // Solo fases 1-3 para comerciales
      return phases.filter(p => p.id <= 3)
    }

    // Para técnicos: solo fases 4-5 y solo proyectos asignados
    return phases.filter(p => p.id >= 4)
  }

  const visiblePhases = getVisiblePhases()

  const getTitle = () => {
    if (showAssignedOnly) return "Mis Proyectos"
    if (showCommercialPhases) return "Proyectos Comerciales"
    return "Proyectos"
  }

  // Estado de carga
  if (!isLoaded) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-72" />
          </div>
          {showAllPhases && <Skeleton className="h-10 w-40" />}
        </div>

        <div className="grid gap-4 overflow-x-auto pb-4">
          {[1, 2, 3, 4, 5].map((faseId) => (
            <div key={faseId} className="min-w-[280px]">
              <div className="flex items-center gap-2 mb-4 px-1">
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-8 ml-auto" />
              </div>
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-40 w-full" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{getTitle()}</h2>
          <p className="text-muted-foreground">
            {showAssignedOnly
              ? "Proyectos donde participas"
              : showCommercialPhases
                ? "Fases comerciales (Prospecto - Propuesta)"
                : "Pipeline de proyectos en las 5 fases"
            }
          </p>
        </div>
      </div>

      <div className={`grid gap-4 overflow-x-auto pb-4 ${showCommercialPhases || showAssignedOnly ? 'grid-cols-3' : 'grid-cols-5'
        }`}>
        {visiblePhases.map((phase) => (
          <div key={phase.id} className="min-w-[280px]">
            {/* Phase header */}
            <div className="flex items-center gap-2 mb-4 px-1">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: phase.color }}
              />
              <h3 className="font-semibold text-sm">{phase.name}</h3>
              <Badge variant="secondary" className="ml-auto text-xs">
                {phase.projects.length}
              </Badge>
            </div>

            {/* Phase Summary Card */}
            {phase.projects.length > 0 && (
              <ModuleCard hover={false} className="mb-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      Proyectos
                    </span>
                    <span className="font-semibold">{phase.projectCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      Valor total
                    </span>
                    <span className="font-semibold text-emerald-400">
                      {phase.totalValue > 0 
                        ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(phase.totalValue)
                        : '-'
                      }
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Prob. promedio
                    </span>
                    <span className="font-semibold">
                      {Math.round(phase.projects.reduce((sum, p) => sum + p.progress, 0) / phase.projects.length)}%
                    </span>
                  </div>
                </div>
              </ModuleCard>
            )}

            {/* Projects */}
            <div className="space-y-3">
              {phase.projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
