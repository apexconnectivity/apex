"use client"

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  LogOut,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react'
import { User } from '@/types/auth'

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  module?: string
  adminOnly?: boolean
}

interface NavSection {
  title: string
  items: NavItem[]
}

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  user: User | null
  onLogout: () => void
  navigation: NavSection[]
}

export function Sidebar({
  collapsed,
  onToggle,
  user,
  onLogout,
  navigation
}: SidebarProps) {
  const pathname = usePathname()

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

  if (!user) return null

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-r border-slate-800/50 transition-all duration-500 ease-out",
        collapsed ? "w-20" : "w-72"
      )}
    >
      {/* Logo */}
      <div className={cn(
        "flex h-20 items-center justify-between px-4 border-b border-slate-800/50 transition-all duration-500 ease-out",
        collapsed && "px-2 justify-center"
      )}>
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25">
            <Zap className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white tracking-tight">
                APEX Connectivity
              </span>
              <span className="text-[10px] text-slate-400 italic">
                &quot;La seguridad no es un error&quot;
              </span>
            </div>
          )}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col flex-1 overflow-y-auto px-3 py-4">
        {navigation.map((section, sectionIdx) => (
          <div key={section.title} className={cn(sectionIdx !== 0 && "mt-6")}>
            {!collapsed && (
              <h3 className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {section.title}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300 ease-out group overflow-hidden",
                      isActive
                        ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border-l-3 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.15)]"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/60 hover:translate-x-1"
                    )}
                  >
                    {/* Background glow effect on hover */}
                    {!isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-700/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    )}
                    <div className="relative">
                      <item.icon
                        className={cn(
                          "h-5 w-5 shrink-0 transition-all duration-300",
                          isActive ? "text-cyan-400 scale-110" : "text-slate-500 group-hover:text-slate-300 group-hover:scale-105"
                        )}
                      />
                      {isActive && (
                        <div className="absolute -top-1 -right-1 w-2 h-2">
                          <div className="absolute inset-0 bg-cyan-400 rounded-full animate-ping opacity-75" />
                          <div className="absolute inset-0 bg-cyan-400 rounded-full" />
                        </div>
                      )}
                    </div>
                    {!collapsed && <span className="relative z-10">{item.name}</span>}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User section */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-slate-800/50 p-4">
        <div
          className={cn(
            "flex items-center gap-3",
            collapsed && "justify-center"
          )}
        >
          <Avatar className="h-10 w-10 border-2 border-slate-700">
            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" />
            <AvatarFallback className="bg-slate-800 text-slate-300">
              {getInitials(user.nombre)}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex flex-1 flex-col min-w-0">
              <span className="text-sm font-medium text-white truncate">
                {user.nombre}
              </span>
              <div className="flex items-center gap-1 flex-wrap">
                {user.roles.slice(0, 2).map(role => (
                  <Badge
                    key={role}
                    variant="secondary"
                    className="h-5 text-[10px] px-1.5 bg-slate-800"
                  >
                    {getRoleLabel(role)}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {!collapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onLogout}
              className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
              title="Cerrar sesión"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </aside>
  )
}
