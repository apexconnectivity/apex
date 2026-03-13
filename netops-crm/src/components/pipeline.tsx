"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  FolderKanban,
  MoreHorizontal,
  Calendar,
  DollarSign,
  Users,
  Plus,
  GripVertical,
} from "lucide-react"

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
}

const phases: Phase[] = [
  {
    id: 1,
    name: "Prospecto",
    color: "#6b7280",
    projects: [
      {
        id: "1",
        name: "Evaluación Redes Hospital Central",
        client: "Hospital Central",
        phase: 1,
        progress: 20,
        dueDate: "15/04/2026",
        value: "$8,500",
        assignee: { name: "Juan Pérez", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" },
        tags: ["Nuevo", "Urgente"],
      },
    ],
  },
  {
    id: 2,
    name: "Diagnóstico",
    color: "#3b82f6",
    projects: [
      {
        id: "2",
        name: "Migración Cloud Tech",
        client: "Cloud Tech Solutions",
        phase: 2,
        progress: 45,
        dueDate: "20/04/2026",
        value: "$15,000",
        assignee: { name: "María García", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" },
        tags: ["En revisión"],
      },
    ],
  },
  {
    id: 3,
    name: "Propuesta",
    color: "#eab308",
    projects: [
      {
        id: "3",
        name: "Implementación Firewall Corp",
        client: "Corporativo Norte",
        phase: 3,
        progress: 70,
        dueDate: "25/04/2026",
        value: "$22,000",
        assignee: { name: "Carlos Rodríguez", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" },
        tags: ["Pendiente firma"],
      },
    ],
  },
  {
    id: 4,
    name: "Implementación",
    color: "#10b981",
    projects: [
      {
        id: "4",
        name: "Upgrade Switches Retail",
        client: "RetailMax",
        phase: 4,
        progress: 55,
        dueDate: "10/05/2026",
        value: "$12,500",
        assignee: { name: "Laura Martínez", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" },
        tags: ["En curso"],
      },
      {
        id: "5",
        name: "Configuración VPN Filial",
        client: "Grupo Industrial",
        phase: 4,
        progress: 30,
        dueDate: "15/05/2026",
        value: "$6,800",
        assignee: { name: "Juan Pérez", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" },
        tags: [],
      },
    ],
  },
  {
    id: 5,
    name: "Cierre",
    color: "#8b5cf6",
    projects: [
      {
        id: "6",
        name: "Auditoría Seguridad Tech",
        client: "TechCorp",
        phase: 5,
        progress: 90,
        dueDate: "05/04/2026",
        value: "$9,200",
        assignee: { name: "Carlos Rodríguez", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" },
        tags: ["Por entregar"],
      },
    ],
  },
]

function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="group cursor-grab active:cursor-grabbing card-hover border-border/50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm truncate text-foreground">
              {project.name}
            </h4>
            <p className="text-xs text-muted-foreground truncate">
              {project.client}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
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
      </CardContent>
    </Card>
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
        {showAllPhases && (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Proyecto
          </Button>
        )}
      </div>

      <div className={`grid gap-4 overflow-x-auto pb-4 ${
        showCommercialPhases || showAssignedOnly ? 'grid-cols-3' : 'grid-cols-5'
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

            {/* Projects */}
            <div className="space-y-3">
              {phase.projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground hover:text-foreground h-auto py-3"
              >
                <Plus className="h-4 w-4 mr-2" />
                <span className="text-sm">Agregar proyecto</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
