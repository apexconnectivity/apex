"use client"

import * as React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CreateProjectModal } from "@/components/module/CreateProjectModal"
import {
  Search,
  Bell,
  Plus,
  ChevronDown,
  Menu,
} from "lucide-react"
import { useProyectos, useEmpresas } from "@/hooks"
import { useLocalStorage } from "@/lib/useLocalStorage"
import { STORAGE_KEYS } from "@/constants/storage"
import { User } from "@/types/auth"

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const [showNewProject, setShowNewProject] = useState(false)
  const [proyectos, setProyectos] = useProyectos()
  const [empresas] = useEmpresas()
  const [usuarios] = useLocalStorage<User[]>(STORAGE_KEYS.usuarios, [])

  const handleSaveProject = async (proyecto: Record<string, unknown>, _isNew: boolean) => {
    const now = new Date().toISOString()
    const newProject = { 
      ...proyecto, 
      id: String(Date.now()),
      creado_en: now,
      estado: 'activo',
    }
    setProyectos(prev => [...prev, newProject as never])
    setShowNewProject(false)
  }

  return (
    <>
      <header className="sticky top-0 z-30 h-20 border-b border-border/50 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-full items-center justify-between px-6">
          {/* Left side */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuClick}
              className="lg:hidden h-10 w-10"
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar proyectos, clientes, tareas..."
                className="w-80 pl-10 bg-background/50"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Button
              variant="default"
              size="sm"
              className="gap-2"
              onClick={() => setShowNewProject(true)}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Nuevo Proyecto</span>
            </Button>

            <div className="h-6 w-px bg-border mx-2" />

            <Button
              variant="ghost"
              size="icon"
              className="relative h-10 w-10"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="gap-2 h-10 px-2"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" />
                <AvatarFallback className="text-xs">CA</AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium">Carlos</span>
                <Badge variant="secondary" className="h-5 text-[10px] px-1.5">
                  Admin
                </Badge>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </header>

      <CreateProjectModal
        open={showNewProject}
        onOpenChange={setShowNewProject}
        onSave={handleSaveProject}
        empresas={empresas}
        usuarios={usuarios}
        proyectos={proyectos}
      />
    </>
  )
}
