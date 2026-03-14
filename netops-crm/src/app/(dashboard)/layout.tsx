"use client"

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { cn } from '@/lib/utils'
import { Sidebar } from '@/components/sidebar'
import { DashboardHeader } from '@/components/dashboard-header'
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
      { name: "Archivado", href: "/dashboard/archivados", icon: Archive, module: 'archivados' },
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
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    setIsTransitioning(true)
    const timer = setTimeout(() => setIsTransitioning(false), 50)
    return () => clearTimeout(timer)
  }, [pathname])

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  // Filter navigation based on permissions
  const filteredNavigation = navigation.map(section => ({
    ...section,
    items: section.items.filter(item => {
      if (item.adminOnly && user?.roles[0] !== 'admin') return false
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

  if (!user) {
    router.push('/login')
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
        <DashboardHeader />

        {/* Page content */}
        <main className="px-6 min-h-[calc(100vh-8rem)] w-full overflow-x-hidden overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
