"use client"

import { useAuth } from '@/contexts/auth-context'
import { useEmpresas, useProyectos, useTareas, useTickets, useContactos } from '@/hooks'
import { ModuleContainer } from '@/components/module/ModuleContainer'
import { DashboardStats, RecentActivity, UpcomingTasks } from "@/components/dashboard-stats"
import { ProjectPipeline } from "@/components/pipeline"
import { WelcomeHeader } from "@/components/welcome-header"
import { AccessDeniedCard } from "@/components/ui/access-denied-card"
import { MiniStat, StatGrid } from "@/components/ui/mini-stat"
import { Building2, FolderKanban, CheckSquare, Headphones, Shield } from "lucide-react"
import { DASHBOARD_STATS, ACCESS_MESSAGES } from '@/constants/dashboard'
import { STATS_LABELS } from '@/constants/estadisticas'
import { HEX_COLORS, VARIANT_COLORS } from '@/lib/colors'

export default function DashboardPage() {
  const { user, canAccessModule, isInternalUser } = useAuth()

  // Hooks centralizados para gestión de datos
  const [empresas] = useEmpresas()
  const [proyectos] = useProyectos()
  const [tareas] = useTareas()
  const [tickets] = useTickets()
  const [contactos] = useContactos()

  // Determinar qué mostrar según el rol
  const isAdmin = user?.roles.includes('admin')
  const isTecnico = user?.roles.includes('tecnico')
  const isComercial = user?.roles.includes('comercial')
  const isCliente = user?.roles.includes('cliente')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isCompras = user?.roles.includes('compras')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
            label={DASHBOARD_STATS.proyectoActivo}
            valueColor={VARIANT_COLORS.primary.valueColor}
            icon={<FolderKanban className="h-6 w-6" />}
            variant="primary"
            showBorder
            accentColor={HEX_COLORS.primary}
          />

          <MiniStat
            value={3}
            label={DASHBOARD_STATS.tareasPendientes}
            valueColor={VARIANT_COLORS.success.valueColor}
            icon={<CheckSquare className="h-6 w-6" />}
            variant="success"
            showBorder
            accentColor={HEX_COLORS.success}
          />

          <MiniStat
            value={2}
            label={DASHBOARD_STATS.ticketsAbiertos}
            valueColor={VARIANT_COLORS.warning.valueColor}
            icon={<Headphones className="h-6 w-6" />}
            variant="warning"
            showBorder
            accentColor={HEX_COLORS.warning}
          />

          <MiniStat
            value={5}
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
        description={ACCESS_MESSAGES.accesoDenegado}
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
