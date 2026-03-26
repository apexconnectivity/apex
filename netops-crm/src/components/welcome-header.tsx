"use client"

import { useAuth } from "@/contexts/auth-context"
import { useProyectos, useTareas, useTickets } from "@/hooks"
import { GREETINGS, QUICK_STATS } from "@/constants/dashboard"
import { MiniStat } from "@/components/ui/mini-stat"
import { Skeleton } from "@/components/ui/skeleton"
import { FolderKanban, CheckSquare, Headphones } from "lucide-react"
import { VARIANT_COLORS } from "@/lib/colors"
import { PageAnimation } from "@/components/ui/page-animation"

export function WelcomeHeader() {
  const { user } = useAuth()

  // Cargar datos desde hooks
  const [proyectosData] = useProyectos()
  const tareasHook = useTareas()
  const tareasData = tareasHook.tasks
  const [soporteData] = useTickets()

  // Contar proyectos activos (estado === 'activo')
  const proyectosActivos = proyectosData.filter(p => p.estado === 'activo').length

  // Contar tareas pendientes (estado !== 'Completada')
  const tareasPendientes = tareasData.filter(t => t.estado !== 'Completada').length

  // Contar tickets abiertos (estado !== 'Cerrado')
  const ticketsAbiertos = soporteData.filter(t => t.estado !== 'Cerrado').length

  const isLoading = proyectosData.length === 0 && tareasData.length === 0 && soporteData.length === 0

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return GREETINGS.morning
    if (hour < 18) return GREETINGS.afternoon
    return GREETINGS.evening
  }

  const getDateDisplay = () => {
    const now = new Date()
    return now.toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <PageAnimation delay={0}>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {getGreeting()}, {user?.nombre?.split(' ')[0] || 'Usuario'}
            </h1>
            <p className="text-muted-foreground mt-1 capitalize">
              {getDateDisplay()}
            </p>
          </div>
        </PageAnimation>

        {/* Quick Stats - Solo para internos */}
        {user?.roles?.some(r => ['admin', 'comercial', 'especialista'].includes(r)) && (
          <PageAnimation delay={100}>
            <div className="flex gap-3">
              {isLoading ? (
                <>
                  <Skeleton className="h-[76px] w-[120px] rounded-lg" />
                  <Skeleton className="h-[76px] w-[120px] rounded-lg" />
                  <Skeleton className="h-[76px] w-[120px] rounded-lg" />
                </>
              ) : (
                <>
                  <MiniStat
                    value={proyectosActivos}
                    label={QUICK_STATS.proyectos}
                    icon={<FolderKanban className={`h-4 w-4 ${VARIANT_COLORS.primary.iconColor}`} />}
                    className={`bg-gradient-to-br ${VARIANT_COLORS.primary.gradient} ${VARIANT_COLORS.primary.borderColor}`}
                  />
                  <MiniStat
                    value={tareasPendientes}
                    label={QUICK_STATS.tareas}
                    valueColor={VARIANT_COLORS.success.valueColor}
                    icon={<CheckSquare className={`h-4 w-4 ${VARIANT_COLORS.success.iconColor}`} />}
                    className={`bg-gradient-to-br ${VARIANT_COLORS.success.gradient} ${VARIANT_COLORS.success.borderColor}`}
                  />
                  <MiniStat
                    value={ticketsAbiertos}
                    label={QUICK_STATS.tickets}
                    valueColor={VARIANT_COLORS.warning.valueColor}
                    icon={<Headphones className={`h-4 w-4 ${VARIANT_COLORS.warning.iconColor}`} />}
                    className={`bg-gradient-to-br ${VARIANT_COLORS.warning.gradient} ${VARIANT_COLORS.warning.borderColor}`}
                  />
                </>
              )}
            </div>
          </PageAnimation>
        )}
      </div>
    </>
  )
}
