'use client'

import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import {
  ChevronRight,
  Bell,
  Plus,
  Building2,
} from 'lucide-react'
import { STATUS_COLORS } from '@/lib/colors'
import { ManageCompanyModal } from '@/components/module/ManageCompanyModal'
import { STORAGE_KEYS } from '@/constants/storage'
import { useLocalStorage } from '@/lib/useLocalStorage'
import { Empresa } from '@/types/crm'
import { useState } from 'react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface DashboardHeaderProps {
  showSearch?: boolean
  showNewProject?: boolean
  onNewProjectClick?: () => void
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function DashboardHeader({ showSearch = true, showNewProject = true, onNewProjectClick }: DashboardHeaderProps) {
  const pathname = usePathname()
  const { user } = useAuth()
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false)
  const [empresas] = useLocalStorage<Empresa[]>(STORAGE_KEYS.empresas, [])

  const empresa = user?.empresa_id ? empresas.find(e => e.id === user.empresa_id) : null
  const isCliente = user?.roles.includes('cliente')

  // Generar breadcrumbs basados en la ruta
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = [{ label: 'Dashboard', href: '/dashboard' }]

    const routeLabels: Record<string, string> = {
      crm: 'CRM',
      proyectos: 'Proyectos',
      tareas: 'Tareas',
      soporte: 'Soporte',
      archivos: 'Archivos',
      calendario: 'Calendario',
      compras: 'Compras',
      notificaciones: 'Notificaciones',
      usuarios: 'Usuarios',
      perfil: 'Perfil',
      configuracion: 'Configuración',
      estadisticas: 'Estadísticas',
      archivados: 'Proyectos Archivados',
    }

    let currentPath = ''
    paths.forEach((path) => {
      currentPath += `/${path}`
      if (path !== 'dashboard' && routeLabels[path]) {
        breadcrumbs.push({
          label: routeLabels[path],
          href: currentPath
        })
      }
    })

    return breadcrumbs
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: 'Admin',
      comercial: 'Comercial',
      tecnico: 'Técnico',
      compras: 'Compras',
      facturacion: 'Facturación',
      marketing: 'Marketing',
      cliente: 'Cliente',
    }
    return labels[role] || role
  }

  const breadcrumbs = getBreadcrumbs()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-xl">
      <div className="container mx-auto px-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground py-3">
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.href || index} className="flex items-center gap-2">
              {index > 0 && <ChevronRight className="h-4 w-4" />}
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="hover:text-foreground transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-foreground font-medium">{crumb.label}</span>
              )}
            </div>
          ))}
        </nav>

        {/* Título y controls */}
        <div className="flex items-center justify-between pb-3">
          <div>
            <h1 className="text-2xl font-bold font-display text-foreground">
              {breadcrumbs[breadcrumbs.length - 1]?.label || 'Dashboard'}
            </h1>
            <p className="text-sm text-muted-foreground">
              Bienvenido{user?.nombre ? `, ${user.nombre}` : ''}
            </p>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-3">
            {showNewProject && (
              <Button
                variant="default"
                size="sm"
                className="gap-2"
                onClick={onNewProjectClick}
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Nuevo Proyecto</span>
              </Button>
            )}

            <div className="h-6 w-px bg-border mx-2" />

            <Button
              variant="ghost"
              size="icon"
              className="relative h-10 w-10"
            >
              <Bell className="h-5 w-5" />
              <span className={`absolute top-2 right-2 h-2 w-2 rounded-full ${STATUS_COLORS.error.bg.replace('/15', '')}`} />
            </Button>

            {user && (
              <div className="flex flex-col items-end gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 h-10 px-2 group overflow-hidden"
                  asChild
                >
                  <Link href="/dashboard/perfil">
                    <Avatar className="h-8 w-8 ring-2 ring-transparent group-hover:ring-primary/20 transition-all shadow-sm">
                      <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" />
                      <AvatarFallback className="text-xs bg-slate-800 text-slate-200">
                        {getInitials(user.nombre)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex flex-col items-start min-w-[80px]">
                      <span className="text-sm font-semibold truncate max-w-[120px]">{user.nombre.split(' ')[0]}</span>
                      <Badge variant="secondary" className="h-4 text-[9px] uppercase tracking-tighter px-1.5 bg-primary/10 text-primary border-primary/20">
                        {getRoleLabel(user.roles[0])}
                      </Badge>
                    </div>
                  </Link>
                </Button>
                
                {isCliente && empresa && (
                  <Button
                    variant="link"
                    size="sm"
                    className="h-6 px-2 text-[10px] text-cyan-400 hover:text-cyan-300 gap-1 opacity-80 hover:opacity-100 font-medium tracking-tight animate-in fade-in duration-500"
                    onClick={() => setIsCompanyModalOpen(true)}
                  >
                    <Building2 className="h-3 w-3" />
                    {empresa.nombre}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {isCliente && empresa && (
        <ManageCompanyModal 
          isOpen={isCompanyModalOpen} 
          onClose={() => setIsCompanyModalOpen(false)} 
          empresaId={empresa.id} 
        />
      )}
    </header>
  )
}
