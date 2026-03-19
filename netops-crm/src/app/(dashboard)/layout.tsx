"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { cn } from '@/lib/utils'
import { Sidebar } from '@/components/sidebar'
import { DashboardHeader } from '@/components/dashboard-header'
import { CreateProjectModal } from '@/components/module/CreateProjectModal'
import { useEmpresas, useContactos, useProyectos } from '@/hooks'
import { Proyecto } from '@/types/proyectos'
import { User } from '@/types/auth'
import {
  LayoutDashboard,
  Building2,
  FolderKanban,
  CheckSquare,
  Headphones,
  FileText,
  Calendar,
  Bell,
  Archive,
  ShoppingCart,
  Settings,
  Zap,
  UserCog,
} from 'lucide-react'

const navigation = [
  {
    title: "Principal",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, module: 'dashboard' },
      { name: "Estadísticas", href: "/dashboard/estadisticas", icon: Zap, module: 'dashboard' },
    ],
  },
  {
    title: "Gestión",
    items: [
      { name: "CRM", href: "/dashboard/crm", icon: Building2, module: 'crm' },
      { name: "Proyectos", href: "/dashboard/proyectos", icon: FolderKanban, module: 'proyectos' },
      { name: "Tareas", href: "/dashboard/tareas", icon: CheckSquare, module: 'tareas' },
      { name: "Soporte", href: "/dashboard/soporte", icon: Headphones, module: 'soporte' },
    ],
  },
  {
    title: "Recursos",
    items: [
      { name: "Archivos", href: "/dashboard/archivos", icon: FileText, module: 'archivos' },
      { name: "Calendario", href: "/dashboard/calendario", icon: Calendar, module: 'calendario' },
      { name: "Compras", href: "/dashboard/compras", icon: ShoppingCart, module: 'compras' },
    ],
  },
  {
    title: "Sistema",
    items: [
      { name: "Notificaciones", href: "/dashboard/notificaciones", icon: Bell, module: 'notificaciones' },
      { name: "Proyectos Archivados", href: "/dashboard/archivados", icon: Archive, module: 'archivados' },
      { name: "Usuarios", href: "/dashboard/usuarios", icon: UserCog, module: 'configuracion', adminOnly: true },
      { name: "Configuración", href: "/dashboard/configuracion", icon: Settings, module: 'configuracion' },
    ],
  },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, logout, canAccessModule, isLoading } = useAuth()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)

  // Estado para el modal de nuevo proyecto
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false)

  // Hooks para obtener datos necesarios para el modal de proyectos
  const [empresas] = useEmpresas()
  const [contactos] = useContactos()
  const [_proyectos, setProyectos] = useProyectos()

  // Cargar usuarios desde localStorage
  const [usuarios, setUsuarios] = useState<User[]>([])
  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = localStorage.getItem('netops_usuarios')
    if (stored) {
      try {
        setUsuarios(JSON.parse(stored))
      } catch {
        // Error al cargar usuarios
      }
    }
  }, [])

  // Función para manejar la creación de un nuevo proyecto
  const handleNewProject = async (proyecto: Partial<Proyecto>, isNew: boolean) => {
    if (!isNew || !proyecto.nombre) return

    const newProyecto: Proyecto = {
      id: crypto.randomUUID(),
      nombre: proyecto.nombre || '',
      descripcion: proyecto.descripcion || '',
      empresa_id: proyecto.empresa_id || '',
      cliente_nombre: proyecto.cliente_nombre || '',
      responsable_id: proyecto.responsable_id || '',
      responsable_nombre: proyecto.responsable_nombre || '',
      contacto_tecnico_id: proyecto.contacto_tecnico_id || '',
      contacto_tecnico_nombre: proyecto.contacto_tecnico_nombre || '',
      fase_actual: proyecto.fase_actual || 1,
      estado: 'activo',
      moneda: proyecto.moneda || 'USD',
      monto_estimado: proyecto.monto_estimado || 0,
      probabilidad_cierre: proyecto.probabilidad_cierre || 20,
      requiere_compras: proyecto.requiere_compras || false,
      fecha_estimada_fin: proyecto.fecha_estimada_fin || '',
      tags: proyecto.tags || [],
      creado_en: new Date().toISOString(),
    }

    // Agregar a la lista de proyectos
    setProyectos((prev: Proyecto[]) => [...prev, newProyecto])
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  // Filter navigation based on permissions
  const filteredNavigation = navigation.map(section => ({
    ...section,
    items: section.items.filter(item => {
      if (item.adminOnly && !user?.roles.includes('admin')) return false
      // No mostrar estadísticas a clientes
      if (item.name === "Estadísticas" && user?.roles.includes('cliente')) return false
      return canAccessModule(item.module)
    })
  })).filter(section => section.items.length > 0)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <Zap className="h-12 w-12 text-cyan-500 animate-pulse mx-auto mb-4" />
          <p className="text-slate-400">Cargando...</p>
        </div>
      </div>
    )
  }

  // Si no hay usuario después de cargar, no renderizar nada
  // (el login redirect ya se maneja en el contexto)
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen dark overflow-x-hidden">
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        user={user}
        onLogout={handleLogout}
        navigation={filteredNavigation}
      />

      {/* Main content */}
      <div className={cn(
        "transition-all duration-300",
        collapsed ? "lg:ml-20" : "lg:ml-72"
      )}>
        {/* Header */}
        <DashboardHeader
          onNewProjectClick={() => setIsNewProjectModalOpen(true)}
          showNewProject={user?.roles.includes('admin')}
        />

        {/* Page content */}
        <main className="px-6 min-h-[calc(100vh-8rem)] w-full overflow-x-hidden overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Modal para nuevo proyecto desde el header */}
      <CreateProjectModal
        open={isNewProjectModalOpen}
        onOpenChange={setIsNewProjectModalOpen}
        onSave={handleNewProject}
        proyecto={null}
        empresas={empresas}
        usuarios={usuarios}
        contactos={contactos}
      />
    </div>
  )
}
