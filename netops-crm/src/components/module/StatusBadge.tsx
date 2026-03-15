import { Badge, BadgeProps } from '@/components/ui/badge'
import { normalizeKey, getTaskStatusColor, getPriorityColor, getCategoryColor } from '@/lib/colors'

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

// Configuración de estados unificada - todos en español
const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
  // Estados activos/en progreso
  activo: { color: 'text-emerald-400', bg: 'bg-emerald-500/15', label: 'Activo' },
  en_progreso: { color: 'text-blue-400', bg: 'bg-blue-500/15', label: 'En progreso' },

  // Estados de espera
  pendiente: { color: 'text-amber-400', bg: 'bg-amber-500/15', label: 'Pendiente' },
  en_espera: { color: 'text-amber-400', bg: 'bg-amber-500/15', label: 'En Espera' },
  esperando_cliente: { color: 'text-amber-400', bg: 'bg-amber-500/15', label: 'Esperando Cliente' },

  // Estados completados
  completado: { color: 'text-emerald-400', bg: 'bg-emerald-500/15', label: 'Completado' },
  completada: { color: 'text-emerald-400', bg: 'bg-emerald-500/15', label: 'Completado' },
  resuelto: { color: 'text-emerald-400', bg: 'bg-emerald-500/15', label: 'Resuelto' },
  cerrado: { color: 'text-slate-400', bg: 'bg-slate-500/15', label: 'Cerrado' },

  // Estados de cancelación
  cancelado: { color: 'text-red-400', bg: 'bg-red-500/15', label: 'Cancelado' },
  cancelada: { color: 'text-red-400', bg: 'bg-red-500/15', label: 'Cancelado' },
  rechazado: { color: 'text-red-400', bg: 'bg-red-500/15', label: 'Rechazado' },

  // Estados de tickets
  abierto: { color: 'text-cyan-400', bg: 'bg-cyan-500/15', label: 'Abierto' },
  bloqueada: { color: 'text-[hsl(var(--error))]', bg: 'bg-[hsl(var(--error))/0.15]', label: 'Bloqueada' },
  nuevo: { color: 'text-cyan-400', bg: 'bg-cyan-500/15', label: 'Nuevo' },

  // Estados inactivos
  inactivo: { color: 'text-slate-400', bg: 'bg-slate-500/15', label: 'Inactivo' },
  borrador: { color: 'text-slate-400', bg: 'bg-slate-500/15', label: 'Borrador' },

  // Estados de aprobación
  pendiente_aprobacion: { color: 'text-amber-400', bg: 'bg-amber-500/15', label: 'Pendiente de Aprobación' },
  aprobada: { color: 'text-blue-400', bg: 'bg-blue-500/15', label: 'Aprobada' },
  enviada: { color: 'text-violet-400', bg: 'bg-violet-500/15', label: 'Enviada' },

  // Estados de recepción
  recibida_parcial: { color: 'text-orange-400', bg: 'bg-orange-500/15', label: 'Recibida Parcial' },
  recibida_completa: { color: 'text-emerald-400', bg: 'bg-emerald-500/15', label: 'Recibida Completa' },
  confirmada: { color: 'text-emerald-400', bg: 'bg-emerald-500/15', label: 'Confirmada' },
  tentativa: { color: 'text-amber-400', bg: 'bg-amber-500/15', label: 'Tentativa' },

  // Estados técnicos
  soporte_tecnico: { color: 'text-purple-400', bg: 'bg-purple-500/15', label: 'Soporte Técnico' },
  tecnica: { color: 'text-purple-400', bg: 'bg-purple-500/15', label: 'Técnica' },

  // Estados de prioridad
  urgente: { color: 'text-[hsl(var(--error))]', bg: 'bg-[hsl(var(--error))/0.15]', label: 'Urgente' },
  alta: { color: 'text-orange-400', bg: 'bg-orange-500/15', label: 'Alta Prioridad' },
  media: { color: 'text-[hsl(var(--warning))]', bg: 'bg-[hsl(var(--warning))/0.15]', label: 'Media Prioridad' },
  baja: { color: 'text-[hsl(var(--info))]', bg: 'bg-[hsl(var(--info))/0.15]', label: 'Baja Prioridad' },

  // Categorías
  comercial: { color: 'text-violet-400', bg: 'bg-violet-500/15', label: 'Comercial' },
  administrativa: { color: 'text-amber-400', bg: 'bg-amber-500/15', label: 'Administrativa' },
  general: { color: 'text-slate-400', bg: 'bg-slate-500/15', label: 'General' },
  compras: { color: 'text-emerald-400', bg: 'bg-emerald-500/15', label: 'Compras' },
  facturacion: { color: 'text-amber-400', bg: 'bg-amber-500/15', label: 'Facturación' },
  consulta_comercial: { color: 'text-violet-400', bg: 'bg-violet-500/15', label: 'Consulta Comercial' },
  consulta: { color: 'text-slate-400', bg: 'bg-slate-500/15', label: 'Consulta' },
  seguridad: { color: 'text-red-400', bg: 'bg-red-500/15', label: 'Seguridad' },
  cloud: { color: 'text-blue-400', bg: 'bg-blue-500/15', label: 'Cloud' },
  infra: { color: 'text-amber-400', bg: 'bg-amber-500/15', label: 'Infraestructura' },
  auditoria: { color: 'text-violet-400', bg: 'bg-violet-500/15', label: 'Auditoría' },

  // Tipos de entidad
  cliente: { color: 'text-green-400', bg: 'bg-green-500/15', label: 'Cliente' },
  proveedor: { color: 'text-blue-400', bg: 'bg-blue-500/15', label: 'Proveedor' },
  prospecto: { color: 'text-amber-400', bg: 'bg-amber-500/15', label: 'Prospecto' },
  socio: { color: 'text-purple-400', bg: 'bg-purple-500/15', label: 'Socio' },
  premium: { color: 'text-amber-400', bg: 'bg-amber-500/15', label: 'Premium' },
  basico: { color: 'text-slate-400', bg: 'bg-slate-500/15', label: 'Básico' },

  // Tipos de soporte
  soporte_24x7: { color: 'text-red-400', bg: 'bg-red-500/15', label: 'Soporte 24x7' },
  _24x7: { color: 'text-red-400', bg: 'bg-red-500/15', label: 'Soporte 24x7' },
  soporte: { color: 'text-cyan-400', bg: 'bg-cyan-500/15', label: 'Soporte' },
  portal: { color: 'text-violet-400', bg: 'bg-violet-500/15', label: 'Portal' },
  email: { color: 'text-blue-400', bg: 'bg-blue-500/15', label: 'Email' },
  telefono: { color: 'text-emerald-400', bg: 'bg-emerald-500/15', label: 'Teléfono' },

  // Fases de proyecto
  descubrimiento: { color: 'text-purple-400', bg: 'bg-purple-500/15', label: 'Descubrimiento' },
  diseno: { color: 'text-cyan-400', bg: 'bg-cyan-500/15', label: 'Diseño' },
  desarrollo: { color: 'text-blue-400', bg: 'bg-blue-500/15', label: 'Desarrollo' },
  pruebas: { color: 'text-amber-400', bg: 'bg-amber-500/15', label: 'Pruebas' },
  despliegue: { color: 'text-emerald-400', bg: 'bg-emerald-500/15', label: 'Despliegue' },
}

// Normalizar el status para buscar en config
const normalizeStatus = (status: string): string => {
  return status
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '_')
}

export function StatusBadge({
  status,
  type = 'estado',
  customColor,
  className = '',
  ...props
}: StatusBadgeProps) {

  const getColorConfig = (): { color: string; bg: string; label: string } => {
    if (customColor) {
      return {
        color: customColor.replace('bg-', 'text-'),
        bg: customColor,
        label: status,
      }
    }

    // Usar funciones centralizadas para tipos específicos de tareas
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

    // Buscar en el config existente
    const normalizedKey = normalizeStatus(status)
    const config = statusConfig[normalizedKey]

    if (config) {
      return config
    }

    // Fallback para estados no reconocidos
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
