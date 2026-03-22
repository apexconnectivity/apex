"use client"

import { Suspense } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useEmpresas, useProyectos, useTareas, useTickets, useContactos } from '@/hooks'
import { ModuleContainer } from '@/components/module/ModuleContainer'
import { DashboardStats, RecentActivity, UpcomingTasks, DashboardStatsSkeleton, ActivitySkeleton, TasksSkeleton } from "@/components/dashboard-stats"
import { ProjectPipeline } from "@/components/pipeline"
import { WelcomeHeader } from "@/components/welcome-header"
import { AccessDeniedCard } from "@/components/ui/access-denied-card"
import { MiniStat, StatGrid } from "@/components/ui/mini-stat"
import { Skeleton } from "@/components/ui/skeleton"
import { Building2, FolderKanban, CheckSquare, Headphones, Shield } from "lucide-react"
import { DASHBOARD_STATS, ACCESS_MESSAGES } from '@/constants/dashboard'
import { STATS_LABELS } from '@/constants/estadisticas'
import { HEX_COLORS, VARIANT_COLORS } from '@/lib/colors'

export default function DashboardPage() {
  const { user, canAccessModule, isInternalUser } = useAuth()

  // Hooks centralizados para gestión de datos
  const [empresas] = useEmpresas()
  const [proyectos] = useProyectos()
  const tareasHook = useTareas()
  const tareas = tareasHook.tasks
  const [tickets] = useTickets()
  const [contactos] = useContactos()

  // Determinar qué mostrar según el rol
  const isAdmin = user?.roles.includes('admin')
  const isTecnico = user?.roles.includes('especialista')
  const isComercial = user?.roles.includes('comercial')
  const isCliente = user?.roles.includes('cliente')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isCompras = user?.roles.includes('compras')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isFacturacion = user?.roles.includes('facturacion')

  // Si es cliente, mostrar portal del cliente
  if (isCliente) {
    const misProyectos = proyectos.filter(p => p.empresa_id === user?.empresa_id)
    const misTareas = tareas.filter(t => misProyectos.some(p => p.id === t.proyecto_id))
    const misTickets = tickets.filter(t => t.empresa_id === user?.empresa_id)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const misDocumentos = [] // Pendiente conectar con hook de documentos si existe

    const tareasPendientes = misTareas.filter(t => t.estado !== 'Completada')
    const ticketsAbiertos = misTickets.filter(t => t.estado !== 'Cerrado' && t.estado !== 'Resuelto')

    return (
      <ModuleContainer>
        <WelcomeHeader />

        {/* Portal del Cliente - Vista real filtrada */}
        <StatGrid cols={4}>
          <MiniStat
            value={misProyectos.length}
            label={DASHBOARD_STATS.proyectoActivo}
            valueColor={VARIANT_COLORS.primary.valueColor}
            icon={<FolderKanban className="h-6 w-6" />}
            variant="primary"
            showBorder
            accentColor={HEX_COLORS.primary}
          />

          <MiniStat
            value={tareasPendientes.length}
            label={DASHBOARD_STATS.tareasPendientes}
            valueColor={VARIANT_COLORS.success.valueColor}
            icon={<CheckSquare className="h-6 w-6" />}
            variant="success"
            showBorder
            accentColor={HEX_COLORS.success}
          />

          <MiniStat
            value={ticketsAbiertos.length}
            label={DASHBOARD_STATS.ticketsAbiertos}
            valueColor={VARIANT_COLORS.warning.valueColor}
            icon={<Headphones className="h-6 w-6" />}
            variant="warning"
            showBorder
            accentColor={HEX_COLORS.warning}
          />

          <MiniStat
            value={0} // Placeholder para documentos
            label={DASHBOARD_STATS.documentos}
            valueColor={VARIANT_COLORS.purple.valueColor}
            icon={<Building2 className="h-6 w-6" />}
            variant="info"
            showBorder
            accentColor={HEX_COLORS.purple}
          />
        </StatGrid>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivity
            empresas={empresas.filter(e => e.id === user?.empresa_id)}
            proyectos={misProyectos}
            tareas={misTareas}
            tickets={misTickets}
          />
          <UpcomingTasks
            tareas={tareasPendientes}
            proyectos={misProyectos}
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
        description={ACCESS_MESSAGES.accesoDenegado}
      />
    )
  }

  // Dashboard para usuarios internos
  return (
    <ModuleContainer>
      <WelcomeHeader />

      {/* Stats Section con Suspense */}
      <Suspense fallback={<DashboardStatsSkeleton />}>
        <DashboardStats />
      </Suspense>

      {/* Pipeline Section con Suspense */}
      {canAccessModule('proyectos') && (
        <Suspense fallback={<Skeleton className="h-64" />}>
          <ProjectPipeline
            showAllPhases={isAdmin}
            showCommercialPhases={isComercial}
            showAssignedOnly={isTecnico}
          />
        </Suspense>
      )}

      {/* CRM Stats - solo comerciales y admin */}
      {isAdmin && (
        <StatGrid cols={2}>
          <MiniStat
            value={empresas.length}
            label={DASHBOARD_STATS.empresasActivas}
            icon={<Building2 className="h-6 w-6" />}
            variant="primary"
            showBorder
            accentColor={HEX_COLORS.primary}
          />
          <MiniStat
            value={contactos.length}
            label={STATS_LABELS.contactos}
            icon={<Headphones className="h-6 w-6" />}
            variant="info"
            showBorder
            accentColor={HEX_COLORS.info}
          />
        </StatGrid>
      )}

      {/* Bottom section - filtered by role con Suspense */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<ActivitySkeleton />}>
          <RecentActivity
            empresas={empresas}
            proyectos={proyectos}
            tareas={tareas}
            tickets={tickets}
          />
        </Suspense>
        {(isAdmin || isTecnico) && (
          <Suspense fallback={<TasksSkeleton />}>
            <UpcomingTasks
              tareas={tareas}
              proyectos={proyectos}
            />
          </Suspense>
        )}
      </div>
    </ModuleContainer>
  )
}
