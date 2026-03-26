"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useEmpresas, useProyectos, useTareas, useTickets } from "@/lib/data"
import { MiniStat, StatGrid } from "@/components/ui/mini-stat"
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
import { DASHBOARD_STATS, SECTION_TITLES, ACTIVITY_TITLES, PRIORITY_LABELS, EMPTY_MESSAGES, DATE_RELATIVE, DUE_DATE } from "@/constants/dashboard"
import { ACTIVITY_COLORS, HEX_COLORS, VARIANT_COLORS, getSectionIndicatorColor } from "@/lib/colors"
import { MS_PER_DAY, MS_PER_HOUR, MS_PER_MINUTE } from "@/constants/timing"

function StatsSkeleton() {
  return (
    <StatGrid cols={4}>
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-24" />
      ))}
    </StatGrid>
  )
}

// Dashboard stats skeleton (full component with proper structure)
export function DashboardStatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4 rounded-full" />
          </div>
          <Skeleton className="h-8 w-16 mt-2" />
          <Skeleton className="h-3 w-20 mt-2" />
        </div>
      ))}
    </div>
  )
}

// Activity list skeleton
export function ActivitySkeleton() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-start gap-3 p-3">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Tasks list skeleton
export function TasksSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <Skeleton className="h-6 w-40" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-14" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function DashboardStats() {
  // Hooks centralizados para gestión de datos
  const [empresas] = useEmpresas()
  const [proyectos] = useProyectos()
  const tareasHook = useTareas()
  const tareas = tareasHook.tasks
  const [tickets] = useTickets()

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

  // Si no hay datos cargados (longitudes son 0), mostrar skeleton
  // Esto solo muestra skeleton en el caso inicial cuando no hay datos
  const isEmpty = empresas.length === 0 && proyectos.length === 0 && tareas.length === 0 && tickets.length === 0

  if (isEmpty) {
    return <StatsSkeleton />
  }

  return (
    <StatGrid cols={4}>
      <MiniStat
        value={clientesActivos}
        label={DASHBOARD_STATS.clientesActivos}
        icon={<Building2 className="h-5 w-5" />}
        variant="primary"
        showBorder
        accentColor={HEX_COLORS.primary}
      />
      <MiniStat
        value={proyectosActivos}
        label={DASHBOARD_STATS.proyectosActivos}
        icon={<FolderKanban className="h-5 w-5" />}
        variant="info"
        showBorder
        accentColor={HEX_COLORS.info}
      />
      <MiniStat
        value={tareasPendientes}
        label={DASHBOARD_STATS.tareasPendientes}
        icon={<CheckSquare className="h-5 w-5" />}
        variant="warning"
        showBorder
        accentColor={HEX_COLORS.warning}
      />
      <MiniStat
        value={ticketsAbiertos}
        label={DASHBOARD_STATS.ticketsAbiertos}
        icon={<Headphones className="h-5 w-5" />}
        variant="danger"
        showBorder
        accentColor={HEX_COLORS.danger}
      />
    </StatGrid>
  )
}

// Función para formatear tiempo relativo
function getRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInMinutes = Math.floor(diffInMs / MS_PER_MINUTE)
  const diffInHours = Math.floor(diffInMs / MS_PER_HOUR)
  const diffInDays = Math.floor(diffInMs / MS_PER_DAY)

  if (diffInMinutes < 1) return DATE_RELATIVE.ahora
  if (diffInMinutes < 60) return DATE_RELATIVE.minutos(diffInMinutes)
  if (diffInHours < 24) return DATE_RELATIVE.hora(diffInHours)
  if (diffInDays === 1) return DATE_RELATIVE.ayer
  if (diffInDays < 7) return DATE_RELATIVE.dias(diffInDays)
  if (diffInDays < 30) return DATE_RELATIVE.semanas(Math.floor(diffInDays / 7))
  return DATE_RELATIVE.meses(Math.floor(diffInDays / 30))
}

// Función para formatear fecha de vencimiento
function formatDueDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const diffInDays = Math.floor((targetDate.getTime() - today.getTime()) / MS_PER_DAY)

  if (diffInDays < 0) return DUE_DATE.vencida(Math.abs(diffInDays))
  if (diffInDays === 0) return DUE_DATE.hoy
  if (diffInDays === 1) return DUE_DATE.manana
  if (diffInDays < 7) return DUE_DATE.dias(diffInDays)
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
        title: ACTIVITY_TITLES.proyectoActualizado,
        description: `${proyecto.nombre} - Fase ${proyecto.fase_actual}`,
        time: proyecto.creado_en,
        icon: FolderKanban,
        iconColor: ACTIVITY_COLORS.project,
      })
    })

    // Tareas completadas recientemente
    tareas
      .filter((tarea) => tarea.estado === 'Completada' && tarea.fecha_completado)
      .forEach((tarea) => {
        allActivities.push({
          id: `tarea-${tarea.id}`,
          type: 'task',
          title: ACTIVITY_TITLES.tareaCompletada,
          description: `${tarea.nombre} - ${tarea.proyecto_nombre}`,
          time: tarea.fecha_completado!,
          icon: CheckSquare,
          iconColor: ACTIVITY_COLORS.task,
        })
      })

    // Tickets recientes (por fecha de apertura)
    tickets.forEach((ticket) => {
      allActivities.push({
        id: `ticket-${ticket.id}`,
        type: 'ticket',
        title: ACTIVITY_TITLES.nuevoTicket,
        description: `${ticket.empresa_nombre || 'Sin empresa'}: ${ticket.titulo}`,
        time: ticket.fecha_apertura,
        icon: Headphones,
        iconColor: ACTIVITY_COLORS.ticket,
      })
    })

    // Empresas agregadas recientemente
    empresas.forEach((empresa) => {
      allActivities.push({
        id: `empresa-${empresa.id}`,
        type: 'client',
        title: empresa.tipo_entidad === 'cliente' ? ACTIVITY_TITLES.nuevoCliente : ACTIVITY_TITLES.empresaAgregada,
        description: `${empresa.nombre} - ${empresa.tipo_relacion || 'Sin relación'}`,
        time: empresa.creado_en,
        icon: Building2,
        iconColor: ACTIVITY_COLORS.empresa,
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
          <div className={`w-1 h-5 rounded-full ${getSectionIndicatorColor('actividadReciente')}`} />
          {SECTION_TITLES.actividadReciente}
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
            <p className="text-sm text-muted-foreground">{EMPTY_MESSAGES.noActividadReciente}</p>
            <p className="text-xs text-muted-foreground/70">{EMPTY_MESSAGES.noActividadRecienteDesc}</p>
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
          <div className={`w-1 h-5 rounded-full ${getSectionIndicatorColor('proximasTareas')}`} />
          {SECTION_TITLES.proximasTareas}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasTasks ? (
          <div className="space-y-2">
            {upcomingTasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center justify-between p-3 rounded-lg border border-border/50 hover:${VARIANT_COLORS.primary.borderColor} hover:${VARIANT_COLORS.primary.iconBg} transition-all duration-200 group`}
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
                    {task.priority === "high" ? PRIORITY_LABELS.alta : task.priority === "medium" ? PRIORITY_LABELS.media : PRIORITY_LABELS.baja}
                  </Badge>
                  <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">{formatDueDate(task.dueDate)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckSquare className="h-10 w-10 text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">{EMPTY_MESSAGES.noTareasProximas}</p>
            <p className="text-xs text-muted-foreground/70">{EMPTY_MESSAGES.noTareasProximasDesc}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
