"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatCard } from "@/components/ui/stat-card"
import { Skeleton } from "@/components/ui/skeleton"
import { useLocalStorage } from "@/lib/useLocalStorage"
import type { Empresa } from "@/types/crm"
import type { Proyecto } from "@/types/proyectos"
import type { Tarea } from "@/types/tareas"
import type { Ticket } from "@/types/soporte"
import {
  Building2,
  FolderKanban,
  CheckSquare,
  Headphones,
} from "lucide-react"

// Keys de localStorage
const STORAGE_KEYS = {
  empresas: 'apex_crm_datos',
  proyectos: 'apex_proyectos_datos',
  tareas: 'apex_tareas_datos',
  tickets: 'apex_soporte_datos',
} as const

// Valores iniciales vacíos para cada tipo
const inicialEmpresas: Empresa[] = []
const inicialProyectos: Proyecto[] = []
const inicialTareas: Tarea[] = []
const inicialTickets: Ticket[] = []

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-10 rounded-xl" />
          </div>
          <Skeleton className="h-8 w-16 mt-2" />
          <Skeleton className="h-3 w-20 mt-2" />
        </div>
      ))}
    </div>
  )
}

export function DashboardStats() {
  // Cargar datos desde localStorage
  const [empresas] = useLocalStorage<Empresa[]>(STORAGE_KEYS.empresas, inicialEmpresas)
  const [proyectos] = useLocalStorage<Proyecto[]>(STORAGE_KEYS.proyectos, inicialProyectos)
  const [tareas] = useLocalStorage<Tarea[]>(STORAGE_KEYS.tareas, inicialTareas)
  const [tickets] = useLocalStorage<Ticket[]>(STORAGE_KEYS.tickets, inicialTickets)

  // Contar clientes activos: empresas donde tipo_entidad === 'cliente'
  const clientesActivos = React.useMemo(() => {
    return empresas.filter(e => e.tipo_entidad === 'cliente').length
  }, [empresas])

  // Contar proyectos activos: proyectos donde estado === 'activo'
  const proyectosActivos = React.useMemo(() => {
    return proyectos.filter(p => p.estado === 'activo').length
  }, [proyectos])

  // Contar tareas pendientes: tareas donde estado !== 'Completada'
  const tareasPendientes = React.useMemo(() => {
    return tareas.filter(t => t.estado !== 'Completada').length
  }, [tareas])

  // Contar tickets abiertos: tickets donde estado !== 'Cerrado'
  const ticketsAbiertos = React.useMemo(() => {
    return tickets.filter(t => t.estado !== 'Cerrado').length
  }, [tickets])

  // Si no hay datos cargados, mostrar skeleton
  // Nota: useLocalStorage siempre devuelve datos (el valor inicial), 
  // así que verificamos si hay datos reales o está vacío
  const hasData = empresas.length > 0 || proyectos.length > 0 || tareas.length > 0 || tickets.length > 0

  if (!hasData) {
    return <StatsSkeleton />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Clientes Activos"
        value={clientesActivos.toString()}
        change={`${empresas.length} empresas`}
        changeType="neutral"
        icon={<Building2 className="h-5 w-5 text-white" />}
        iconBg="bg-gradient-to-br from-blue-500 to-blue-600"
      />
      <StatCard
        title="Proyectos Activos"
        value={proyectosActivos.toString()}
        change={`${proyectos.length} total`}
        changeType="neutral"
        icon={<FolderKanban className="h-5 w-5 text-white" />}
        iconBg="bg-gradient-to-br from-cyan-500 to-cyan-600"
      />
      <StatCard
        title="Tareas Pendientes"
        value={tareasPendientes.toString()}
        change={`${tareas.length} total`}
        changeType="neutral"
        icon={<CheckSquare className="h-5 w-5 text-white" />}
        iconBg="bg-gradient-to-br from-amber-500 to-orange-500"
      />
      <StatCard
        title="Tickets Abiertos"
        value={ticketsAbiertos.toString()}
        change={`${tickets.length} total`}
        changeType="neutral"
        icon={<Headphones className="h-5 w-5 text-white" />}
        iconBg="bg-gradient-to-br from-purple-500 to-purple-600"
      />
    </div>
  )
}

// Función para formatear tiempo relativo
function getRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInMinutes < 1) return 'Hace un momento'
  if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`
  if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`
  if (diffInDays === 1) return 'Ayer'
  if (diffInDays < 7) return `Hace ${diffInDays} días`
  if (diffInDays < 30) return `Hace ${Math.floor(diffInDays / 7)} semana${Math.floor(diffInDays / 7) > 1 ? 's' : ''}`
  return `Hace ${Math.floor(diffInDays / 30)} mes${Math.floor(diffInDays / 30) > 1 ? 'es' : ''}`
}

// Función para formatear fecha de vencimiento
function formatDueDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const diffInDays = Math.floor((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (diffInDays < 0) return `Vencida (${Math.abs(diffInDays)} día${Math.abs(diffInDays) > 1 ? 's' : ''})`
  if (diffInDays === 0) return 'Hoy'
  if (diffInDays === 1) return 'Mañana'
  if (diffInDays < 7) return `${diffInDays} días`
  return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })
}

interface ActivityItem {
  id: string
  type: "project" | "task" | "ticket" | "client"
  title: string
  description: string
  time: string
  icon: React.ElementType
  iconColor: string
}

export function RecentActivity({
  empresas,
  proyectos,
  tareas,
  tickets,
}: {
  empresas: Empresa[]
  proyectos: Proyecto[]
  tareas: Tarea[]
  tickets: Ticket[]
}) {
  // Generar actividades desde los datos de localStorage
  const activities = React.useMemo<ActivityItem[]>(() => {
    const allActivities: ActivityItem[] = []

    // Proyectos recientes (por fecha de creación)
    proyectos.forEach((proyecto) => {
      allActivities.push({
        id: `proyecto-${proyecto.id}`,
        type: 'project',
        title: 'Proyecto actualizado',
        description: `${proyecto.nombre} - Fase ${proyecto.fase_actual}`,
        time: proyecto.creado_en,
        icon: FolderKanban,
        iconColor: 'bg-blue-500',
      })
    })

    // Tareas completadas recientemente
    tareas
      .filter((tarea) => tarea.estado === 'Completada' && tarea.fecha_completado)
      .forEach((tarea) => {
        allActivities.push({
          id: `tarea-${tarea.id}`,
          type: 'task',
          title: 'Tarea completada',
          description: `${tarea.nombre} - ${tarea.proyecto_nombre}`,
          time: tarea.fecha_completado!,
          icon: CheckSquare,
          iconColor: 'bg-green-500',
        })
      })

    // Tickets recientes (por fecha de apertura)
    tickets.forEach((ticket) => {
      allActivities.push({
        id: `ticket-${ticket.id}`,
        type: 'ticket',
        title: 'Nuevo ticket',
        description: `${ticket.empresa_nombre || 'Sin empresa'}: ${ticket.titulo}`,
        time: ticket.fecha_apertura,
        icon: Headphones,
        iconColor: 'bg-red-500',
      })
    })

    // Empresas agregadas recientemente
    empresas.forEach((empresa) => {
      allActivities.push({
        id: `empresa-${empresa.id}`,
        type: 'client',
        title: empresa.tipo_entidad === 'cliente' ? 'Nuevo cliente' : 'Empresa agregada',
        description: `${empresa.nombre} - ${empresa.tipo_relacion || 'Sin relación'}`,
        time: empresa.creado_en,
        icon: Building2,
        iconColor: 'bg-purple-500',
      })
    })

    // Ordenar por fecha descendente y tomar los primeros 5
    return allActivities
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 5)
  }, [empresas, proyectos, tareas, tickets])

  const hasActivities = activities.length > 0

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="w-1 h-5 bg-cyan-500 rounded-full" />
          Actividad Reciente
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasActivities ? (
          <div className="space-y-1">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors -mx-2"
              >
                <div className={`p-2 rounded-lg shrink-0 shadow-sm ${activity.iconColor}`}>
                  <activity.icon className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {activity.description}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  {getRelativeTime(activity.time)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FolderKanban className="h-10 w-10 text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">No hay actividad reciente</p>
            <p className="text-xs text-muted-foreground/70">Los proyectos, tareas, tickets y empresas aparecerán aquí</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface TaskItem {
  id: string
  title: string
  project: string
  priority: "high" | "medium" | "low"
  dueDate: string
}

export function UpcomingTasks({
  tareas,
  proyectos,
}: {
  tareas: Tarea[]
  proyectos: Proyecto[]
}) {
  // Crear mapa de proyectos para buscar nombres rápidamente
  const proyectosMap = React.useMemo(() => {
    const map = new Map<string, string>()
    proyectos.forEach((p) => map.set(p.id, p.nombre))
    return map
  }, [proyectos])

  // Generar tareas próximas desde los datos de localStorage
  const upcomingTasks = React.useMemo((): TaskItem[] => {
    // Filtrar tareas no completadas y que tengan fecha de vencimiento
    const pendingTasks = tareas.filter(
      (tarea) =>
        tarea.estado !== 'Completada' &&
        tarea.fecha_vencimiento
    )

    // Mapear a TaskItem y ordenar por fecha de vencimiento
    return pendingTasks
      .map((tarea): TaskItem => ({
        id: tarea.id,
        title: tarea.nombre,
        project: tarea.proyecto_nombre || proyectosMap.get(tarea.proyecto_id) || 'Sin proyecto',
        priority: (tarea.prioridad === 'Alta' || tarea.prioridad === 'Urgente'
          ? 'high'
          : tarea.prioridad === 'Media'
            ? 'medium'
            : 'low') as TaskItem['priority'],
        dueDate: tarea.fecha_vencimiento!,
      }))
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5) // Máximo 5 tareas
  }, [tareas, proyectosMap])

  const hasTasks = upcomingTasks.length > 0

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="w-1 h-5 bg-amber-500 rounded-full" />
          Próximas Tareas
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasTasks ? (
          <div className="space-y-2">
            {upcomingTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all duration-200 group"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{task.title}</p>
                  <p className="text-xs text-muted-foreground">{task.project}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge
                    variant={
                      task.priority === "high"
                        ? "destructive"
                        : task.priority === "medium"
                          ? "warning"
                          : "secondary"
                    }
                    className="text-xs"
                  >
                    {task.priority === "high" ? "Alta" : task.priority === "medium" ? "Media" : "Baja"}
                  </Badge>
                  <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">{formatDueDate(task.dueDate)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckSquare className="h-10 w-10 text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">No hay tareas próximas</p>
            <p className="text-xs text-muted-foreground/70">Las tareas pendientes aparecerán aquí</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
