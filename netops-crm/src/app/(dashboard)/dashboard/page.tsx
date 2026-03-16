"use client"

import { useAuth } from '@/contexts/auth-context'
import { useEmpresas, useProyectos, useTareas, useTickets } from '@/lib/data'
import { ModuleContainer } from '@/components/module/ModuleContainer'
import { DashboardStats, RecentActivity, UpcomingTasks } from "@/components/dashboard-stats"
import { ProjectPipeline } from "@/components/pipeline"
import { WelcomeHeader } from "@/components/welcome-header"
import { AccessDeniedCard } from "@/components/ui/access-denied-card"
import { MiniStat, StatGrid } from "@/components/ui/mini-stat"
import { Building2, FolderKanban, CheckSquare, Headphones, Shield } from "lucide-react"

export default function DashboardPage() {
  const { user, canAccessModule, isInternalUser } = useAuth()

  // Hooks centralizados para gestión de datos
  const [empresas] = useEmpresas()
  const [proyectos] = useProyectos()
  const [tareas] = useTareas()
  const [tickets] = useTickets()

  // Determinar qué mostrar según el rol
  const isAdmin = user?.roles.includes('admin')
  const isTecnico = user?.roles.includes('tecnico')
  const isComercial = user?.roles.includes('comercial')
  const isCliente = user?.roles.includes('cliente')
  const isCompras = user?.roles.includes('compras')
  const isFacturacion = user?.roles.includes('facturacion')

  // Si es cliente, mostrar portal del cliente
  if (isCliente) {
    return (
      <ModuleContainer>
        <WelcomeHeader />

        {/* Portal del Cliente - Vista simplificada */}
        <StatGrid cols={4}>
          <MiniStat
            value={1}
            label="Proyecto Activo"
            valueColor="text-cyan-400"
            icon={<FolderKanban className="h-6 w-6" />}
            variant="primary"
            showBorder
            accentColor="#06b6d4"
          />

          <MiniStat
            value={3}
            label="Tareas Pendientes"
            valueColor="text-emerald-400"
            icon={<CheckSquare className="h-6 w-6" />}
            variant="success"
            showBorder
            accentColor="#10b981"
          />

          <MiniStat
            value={2}
            label="Tickets Abiertos"
            valueColor="text-amber-400"
            icon={<Headphones className="h-6 w-6" />}
            variant="warning"
            showBorder
            accentColor="#f59e0b"
          />

          <MiniStat
            value={5}
            label="Documentos"
            valueColor="text-violet-400"
            icon={<Building2 className="h-6 w-6" />}
            variant="info"
            showBorder
            accentColor="#8b5cf6"
          />
        </StatGrid>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivity
            empresas={empresas}
            proyectos={proyectos}
            tareas={tareas}
            tickets={tickets}
          />
          <UpcomingTasks
            tareas={tareas}
            proyectos={proyectos}
          />
        </div>
      </ModuleContainer>
    )
  }

  // Si no es interno (algo extraño), mostrar mensaje
  if (!isInternalUser()) {
    return (
      <AccessDeniedCard
        icon={Shield}
        description="No tienes permisos para acceder al dashboard."
      />
    )
  }

  // Dashboard para usuarios internos
  return (
    <ModuleContainer>
      <WelcomeHeader />

      {/* Stats - varies by role */}
      <DashboardStats />

      {/* Pipeline - solo admin y tecnico ven proyectos */}
      {canAccessModule('proyectos') && (
        <ProjectPipeline
          showAllPhases={isAdmin}
          showCommercialPhases={isComercial}
          showAssignedOnly={isTecnico}
        />
      )}

      {/* CRM - solo comerciales y admin */}
      {isAdmin && (
        <StatGrid cols={2}>
          <MiniStat
            value={24}
            label="Empresas Activas"
            icon={<Building2 className="h-6 w-6" />}
            variant="primary"
            showBorder
            accentColor="#06b6d4"
          />
          <MiniStat
            value={58}
            label="Contactos"
            icon={<Headphones className="h-6 w-6" />}
            variant="info"
            showBorder
            accentColor="#3b82f6"
          />
        </StatGrid>
      )}

      {/* Bottom section - filtered by role */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity
          empresas={empresas}
          proyectos={proyectos}
          tareas={tareas}
          tickets={tickets}
        />
        {(isAdmin || isTecnico) && (
          <UpcomingTasks
            tareas={tareas}
            proyectos={proyectos}
          />
        )}
      </div>
    </ModuleContainer>
  )
}
