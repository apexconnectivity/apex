"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatCard } from "@/components/ui/stat-card"
import {
  Building2,
  FolderKanban,
  CheckSquare,
  Headphones,
} from "lucide-react"

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Clientes Activos"
        value="24"
        change="+3 este mes"
        changeType="positive"
        icon={<Building2 className="h-5 w-5 text-white" />}
        iconBg="bg-gradient-to-br from-blue-500 to-blue-600"
      />
      <StatCard
        title="Proyectos Activos"
        value="12"
        change="+2 esta semana"
        changeType="positive"
        icon={<FolderKanban className="h-5 w-5 text-white" />}
        iconBg="bg-gradient-to-br from-cyan-500 to-cyan-600"
      />
      <StatCard
        title="Tareas Pendientes"
        value="47"
        change="-5 hoy"
        changeType="positive"
        icon={<CheckSquare className="h-5 w-5 text-white" />}
        iconBg="bg-gradient-to-br from-amber-500 to-orange-500"
      />
      <StatCard
        title="Tickets Abiertos"
        value="8"
        change="+2 urgente"
        changeType="negative"
        icon={<Headphones className="h-5 w-5 text-white" />}
        iconBg="bg-gradient-to-br from-purple-500 to-purple-600"
      />
    </div>
  )
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

const activities: ActivityItem[] = [
  {
    id: "1",
    type: "project",
    title: "Proyecto actualizado",
    description: "Migración Cloud Tech cambió a fase Diagnóstico",
    time: "Hace 2 horas",
    icon: FolderKanban,
    iconColor: "bg-blue-500",
  },
  {
    id: "2",
    type: "task",
    title: "Tarea completada",
    description: "Carlos completó: Configurar firewall",
    time: "Hace 3 horas",
    icon: CheckSquare,
    iconColor: "bg-green-500",
  },
  {
    id: "3",
    type: "ticket",
    title: "Nuevo ticket",
    description: "Hospital Central: Fallo de conexión",
    time: "Hace 4 horas",
    icon: Headphones,
    iconColor: "bg-red-500",
  },
  {
    id: "4",
    type: "client",
    title: "Nuevo cliente",
    description: "RetailMax se agregó como cliente",
    time: "Ayer",
    icon: Building2,
    iconColor: "bg-purple-500",
  },
]

export function RecentActivity() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="w-1 h-5 bg-cyan-500 rounded-full" />
          Actividad Reciente
        </CardTitle>
      </CardHeader>
      <CardContent>
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
                {activity.time}
              </span>
            </div>
          ))}
        </div>
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

const upcomingTasks: TaskItem[] = [
  {
    id: "1",
    title: "Revisar propuesta técnica",
    project: "Corporativo Norte",
    priority: "high",
    dueDate: "Hoy",
  },
  {
    id: "2",
    title: "Configurar VLANs",
    project: "RetailMax",
    priority: "high",
    dueDate: "Hoy",
  },
  {
    id: "3",
    title: "Enviar diagrama de red",
    project: "Cloud Tech",
    priority: "medium",
    dueDate: "Mañana",
  },
  {
    id: "4",
    title: "Coordinar visita técnica",
    project: "Hospital Central",
    priority: "medium",
    dueDate: "Mañana",
  },
]

export function UpcomingTasks() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="w-1 h-5 bg-amber-500 rounded-full" />
          Próximas Tareas
        </CardTitle>
      </CardHeader>
      <CardContent>
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
                <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">{task.dueDate}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
