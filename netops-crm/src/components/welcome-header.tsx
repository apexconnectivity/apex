"use client"

import { useAuth } from "@/contexts/auth-context"
import { useLocalStorage } from "@/lib/useLocalStorage"
import { STORAGE_KEYS, INITIAL_DATA } from "@/constants/storage"
import { MiniStat } from "@/components/ui/mini-stat"
import { Skeleton } from "@/components/ui/skeleton"
import { FolderKanban, CheckSquare, Headphones } from "lucide-react"
import type { Proyecto } from "@/types/proyectos"
import type { Tarea } from "@/types/tareas"
import type { Ticket } from "@/types/soporte"

export function WelcomeHeader() {
  const { user } = useAuth()

  // Cargar datos desde localStorage
  const [proyectosData] = useLocalStorage<Proyecto[]>(STORAGE_KEYS.proyectos, INITIAL_DATA.proyectos)
  const [tareasData] = useLocalStorage<Tarea[]>(STORAGE_KEYS.tareas, INITIAL_DATA.tareas)
  const [soporteData] = useLocalStorage<Ticket[]>(STORAGE_KEYS.tickets, INITIAL_DATA.tickets)

  // Contar proyectos activos (estado === 'activo')
  const proyectosActivos = proyectosData.filter(p => p.estado === 'activo').length

  // Contar tareas pendientes (estado !== 'Completada')
  const tareasPendientes = tareasData.filter(t => t.estado !== 'Completada').length

  // Contar tickets abiertos (estado !== 'Cerrado')
  const ticketsAbiertos = soporteData.filter(t => t.estado !== 'Cerrado').length

  const isLoading = proyectosData.length === 0 && tareasData.length === 0 && soporteData.length === 0

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Buenos días'
    if (hour < 18) return 'Buenas tardes'
    return 'Buenas noches'
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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {getGreeting()}, {user?.nombre?.split(' ')[0] || 'Usuario'}
          </h1>
          <p className="text-muted-foreground mt-1 capitalize">
            {getDateDisplay()}
          </p>
        </div>

        {/* Quick Stats - Solo para internos */}
        {user?.roles?.some(r => ['admin', 'comercial', 'tecnico'].includes(r)) && (
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
                  label="Proyectos"
                  icon={<FolderKanban className="h-4 w-4 text-cyan-400" />}
                  className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20"
                />
                <MiniStat
                  value={tareasPendientes}
                  label="Tareas"
                  valueColor="text-emerald-400"
                  icon={<CheckSquare className="h-4 w-4 text-emerald-400" />}
                  className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 border-emerald-500/20"
                />
                <MiniStat
                  value={ticketsAbiertos}
                  label="Tickets"
                  valueColor="text-amber-400"
                  icon={<Headphones className="h-4 w-4 text-amber-400" />}
                  className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20"
                />
              </>
            )}
          </div>
        )}
      </div>
    </>
  )
}
