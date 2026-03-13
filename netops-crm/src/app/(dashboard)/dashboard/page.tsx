"use client"

import { useAuth } from '@/contexts/auth-context'
import { DashboardStats, RecentActivity, UpcomingTasks } from "@/components/dashboard-stats"
import { ProjectPipeline } from "@/components/pipeline"
import { WelcomeHeader } from "@/components/welcome-header"
import { Card, CardContent } from "@/components/ui/card"
import { MiniStat } from "@/components/ui/mini-stat"
import { Building2, FolderKanban, CheckSquare, Headphones, Shield } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user, canAccessModule, isInternalUser } = useAuth()

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
      <div className="space-y-8 w-full overflow-x-hidden">
        <WelcomeHeader />

        {/* Portal del Cliente - Vista simplificada */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
          <MiniStat 
            value={1} 
            label="Proyecto Activo"
            valueColor="text-cyan-400"
            icon={<FolderKanban className="h-6 w-6 text-cyan-400" />}
            className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20"
            size="md"
          />

          <MiniStat 
            value={3} 
            label="Tareas Pendientes"
            valueColor="text-emerald-400"
            icon={<CheckSquare className="h-6 w-6 text-emerald-400" />}
            size="md"
          />

          <MiniStat 
            value={2} 
            label="Tickets Abiertos"
            valueColor="text-amber-400"
            icon={<Headphones className="h-6 w-6 text-amber-400" />}
            size="md"
          />

          <MiniStat 
            value={5} 
            label="Documentos"
            valueColor="text-violet-400"
            icon={<Building2 className="h-6 w-6 text-violet-400" />}
            size="md"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivity />
          <UpcomingTasks />
        </div>
      </div>
    )
  }

  // Si no es interno (algo extraño), mostrar mensaje
  if (!isInternalUser()) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Shield className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Acceso Restringido</h2>
            <p className="text-muted-foreground">No tienes permisos para acceder al dashboard.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Dashboard para usuarios internos
  return (
    <div className="space-y-8 w-full overflow-x-hidden">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          <Card className="w-full max-w-sm overflow-hidden hover:shadow-lg transition-all duration-200 border border-border/50 rounded-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground">Empresas Activas</p>
                  <p className="text-3xl font-bold">24</p>
                </div>
                <Building2 className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card className="w-full max-w-sm overflow-hidden hover:shadow-lg transition-all duration-200 border border-border/50 rounded-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground">Contactos</p>
                  <p className="text-3xl font-bold">58</p>
                </div>
                <Headphones className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bottom section - filtered by role */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        {(isAdmin || isTecnico) && <UpcomingTasks />}
      </div>
    </div>
  )
}
