import { Building2, Phone, MapPin, Users, FolderKanban, MoreHorizontal, Globe } from 'lucide-react'
import { ModuleCard } from './ModuleCard'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { TipoEntidad } from '@/types/crm'

interface EmpresaCardProps {
  empresa: {
    id: string
    nombre: string
    industria?: string
    tipo_entidad: TipoEntidad
    sitio_web?: string
    telefono_principal?: string
    ciudad?: string
    pais?: string
  }
  stats?: {
    contactos: number
    proyectos: number
  }
  onClick?: () => void
  onMenuClick?: () => void
  className?: string
}

const TIPO_COLORS = {
  cliente: {
    bg: 'bg-cyan-500/20',
    text: 'text-cyan-400',
    badge: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  },
  proveedor: {
    bg: 'bg-amber-500/20',
    text: 'text-amber-400',
    badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  },
  ambos: {
    bg: 'bg-purple-500/20',
    text: 'text-purple-400',
    badge: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  },
}

const TIPO_LABELS = {
  cliente: 'Cliente',
  proveedor: 'Proveedor',
  ambos: 'Ambos',
}

export function EmpresaCard({
  empresa,
  stats,
  onClick,
  onMenuClick,
  className = ''
}: EmpresaCardProps) {
  const colors = TIPO_COLORS[empresa.tipo_entidad]

  return (
    <ModuleCard onClick={onClick} className={className}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0', colors.bg)}>
            <Building2 className={cn('h-5 w-5', colors.text)} />
          </div>
          <div className="min-w-0">
            <h4 className="font-semibold text-sm truncate text-foreground">
              {empresa.nombre}
            </h4>
            {empresa.industria && (
              <p className="text-xs text-muted-foreground truncate">
                {empresa.industria}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn(
            'text-xs px-2 py-0.5 rounded-full border font-medium',
            colors.badge
          )}>
            {TIPO_LABELS[empresa.tipo_entidad]}
          </span>
          {onMenuClick && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
              onClick={(e) => { e.stopPropagation(); onMenuClick?.() }}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-1.5 text-sm text-muted-foreground">
        {empresa.sitio_web && (
          <div className="flex items-center gap-2 min-w-0">
            <Globe className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate">{empresa.sitio_web}</span>
          </div>
        )}
        {empresa.telefono_principal && (
          <div className="flex items-center gap-2">
            <Phone className="h-3.5 w-3.5 flex-shrink-0" />
            <span>{empresa.telefono_principal}</span>
          </div>
        )}
        {(empresa.ciudad || empresa.pais) && (
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
            <span>
              {[empresa.ciudad, empresa.pais].filter(Boolean).join(', ')}
            </span>
          </div>
        )}
      </div>

      {stats && (
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border/50 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            <span>{stats.contactos} {stats.contactos === 1 ? 'contacto' : 'contactos'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FolderKanban className="h-3.5 w-3.5" />
            <span>{stats.proyectos} {stats.proyectos === 1 ? 'proyecto' : 'proyectos'}</span>
          </div>
        </div>
      )}
    </ModuleCard>
  )
}