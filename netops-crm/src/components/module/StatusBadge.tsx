"use client"

import { Badge, BadgeProps } from '@/components/ui/badge'
import { normalizeKey, getTaskStatusColor, getPriorityColor, getCategoryColor, getStatusColor, STATUS_COLORS } from '@/lib/colors'

type StatusType =
  | 'estado'
  | 'prioridad'
  | 'categoria'
  | 'tipo'
  | 'clasificacion'
  | 'estadoNotificacion'

interface StatusBadgeProps extends Omit<BadgeProps, 'variant'> {
  status: string
  type?: StatusType
  customColor?: string
}

// Configuración extendida para estados no cubiertos por funciones centralizadas
// Solo estados adicionales que no están en lib/colors.ts
const extendedStatusConfig: Record<string, { color: string; bg: string; label: string }> = {
  // Estados de recepción (compras)
  recibida_parcial: { color: 'text-orange-400', bg: 'bg-orange-500/15', label: 'Recibida Parcial' },
  recibida_completa: { color: 'text-emerald-400', bg: 'bg-emerald-500/15', label: 'Recibida Completa' },
  confirmada: { color: 'text-emerald-400', bg: 'bg-emerald-500/15', label: 'Confirmada' },
  tentativa: { color: 'text-amber-400', bg: 'bg-amber-500/15', label: 'Tentativa' },

  // Estados técnicos
  soporte_tecnico: { color: 'text-purple-400', bg: 'bg-purple-500/15', label: 'Soporte Técnico' },
  tecnica: { color: 'text-purple-400', bg: 'bg-purple-500/15', label: 'Técnica' },

  // Tipos de soporte
  soporte_24x7: { color: 'text-red-400', bg: 'bg-red-500/15', label: 'Soporte 24x7' },
  _24x7: { color: 'text-red-400', bg: 'bg-red-500/15', label: 'Soporte 24x7' },
  soporte: { color: 'text-cyan-400', bg: 'bg-cyan-500/15', label: 'Soporte' },
  portal: { color: 'text-violet-400', bg: 'bg-violet-500/15', label: 'Portal' },
  email: { color: 'text-blue-400', bg: 'bg-blue-500/15', label: 'Email' },
  telefono: { color: 'text-emerald-400', bg: 'bg-emerald-500/15', label: 'Teléfono' },

  // Tipos de entidad
  prospecto: { color: 'text-amber-400', bg: 'bg-amber-500/15', label: 'Prospecto' },
  socio: { color: 'text-purple-400', bg: 'bg-purple-500/15', label: 'Socio' },
  premium: { color: 'text-amber-400', bg: 'bg-amber-500/15', label: 'Premium' },
  basico: { color: 'text-slate-400', bg: 'bg-slate-500/15', label: 'Básico' },
  ambos: { color: 'text-cyan-400', bg: 'bg-cyan-500/15', label: 'Ambos' },

  // Fases de proyecto
  descubrimiento: { color: 'text-purple-400', bg: 'bg-purple-500/15', label: 'Descubrimiento' },
  diseno: { color: 'text-cyan-400', bg: 'bg-cyan-500/15', label: 'Diseño' },
  desarrollo: { color: 'text-blue-400', bg: 'bg-blue-500/15', label: 'Desarrollo' },
  pruebas: { color: 'text-amber-400', bg: 'bg-amber-500/15', label: 'Pruebas' },
  despliegue: { color: 'text-emerald-400', bg: 'bg-emerald-500/15', label: 'Despliegue' },

  // Estados adicionales
  pendiente_aprobacion: { color: 'text-amber-400', bg: 'bg-amber-500/15', label: 'Pendiente de Aprobación' },
  aprobada: { color: 'text-blue-400', bg: 'bg-blue-500/15', label: 'Aprobada' },
  enviada: { color: 'text-violet-400', bg: 'bg-violet-500/15', label: 'Enviada' },
  consulta_comercial: { color: 'text-violet-400', bg: 'bg-violet-500/15', label: 'Consulta Comercial' },
  consulta: { color: 'text-slate-400', bg: 'bg-slate-500/15', label: 'Consulta' },
  seguridad: { color: 'text-red-400', bg: 'bg-red-500/15', label: 'Seguridad' },
  cloud: { color: 'text-blue-400', bg: 'bg-blue-500/15', label: 'Cloud' },
  infra: { color: 'text-amber-400', bg: 'bg-amber-500/15', label: 'Infraestructura' },
  auditoria: { color: 'text-violet-400', bg: 'bg-violet-500/15', label: 'Auditoría' },
}

export function StatusBadge({
  status,
  type = 'estado',
  customColor,
  className = '',
  ...props
}: StatusBadgeProps) {

  const getColorConfig = (): { color: string; bg: string; label: string } => {
    // 1. Si hay color custom, usarlo
    if (customColor) {
      return {
        color: customColor.replace('bg-', 'text-'),
        bg: customColor,
        label: status,
      }
    }

    // 2. Usar funciones centralizadas según el tipo
    if (type === 'estado') {
      const taskColor = getTaskStatusColor(status)
      if (taskColor.color !== 'text-slate-400') {
        return taskColor
      }
    }

    if (type === 'prioridad') {
      const priorityColor = getPriorityColor(status)
      if (priorityColor.color !== 'text-slate-400') {
        return priorityColor
      }
    }

    if (type === 'categoria') {
      const categoryColor = getCategoryColor(status)
      if (categoryColor.color !== 'text-slate-400') {
        return categoryColor
      }
    }

    // 3. Buscar en config extendido
    const normalizedKey = normalizeKey(status)
    const extendedConfig = extendedStatusConfig[normalizedKey]
    if (extendedConfig) {
      return extendedConfig
    }

    // 4. Intentar usar colores de estado genéricos
    const statusColor = getStatusColor(normalizedKey)
    if (statusColor.text !== STATUS_COLORS.neutral.text) {
      return {
        color: statusColor.text,
        bg: statusColor.bg,
        label: status,
      }
    }

    // 5. Fallback para estados no reconocidos
    return {
      color: 'text-muted-foreground',
      bg: 'bg-muted',
      label: status,
    }
  }

  const config = getColorConfig()

  return (
    <Badge
      className={`text-xs font-medium ${config.bg} ${config.color} ${className}`}
      {...props}
    >
      {config.label}
    </Badge>
  )
}
