import { Badge, BadgeProps } from '@/components/ui/badge'

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
  urgente: { color: 'text-red-400', bg: 'bg-red-500/15', label: 'Urgente' },
  alta: { color: 'text-red-400', bg: 'bg-red-500/15', label: 'Alta Prioridad' },
  media: { color: 'text-amber-400', bg: 'bg-amber-500/15', label: 'Media Prioridad' },
  baja: { color: 'text-green-400', bg: 'bg-green-500/15', label: 'Baja Prioridad' },

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

// Colores legacy para backwards compatibility
const LEGACY_COLORS: Record<string, string> = {
  'Activo': 'bg-emerald-500/15 text-emerald-400',
  'Inactivo': 'bg-slate-500/15 text-slate-400',
  'Pendiente': 'bg-amber-500/15 text-amber-400',
  'En progreso': 'bg-blue-500/15 text-blue-400',
  'Completado': 'bg-emerald-500/15 text-emerald-400',
  'Completada': 'bg-emerald-500/15 text-emerald-400',
  'Resuelto': 'bg-emerald-500/15 text-emerald-400',
  'Cerrado': 'bg-slate-500/15 text-slate-400',
  'Cancelado': 'bg-red-500/15 text-red-400',
  'Cancelada': 'bg-red-500/15 text-red-400',
  'Abierto': 'bg-cyan-500/15 text-cyan-400',
  'Bloqueada': 'bg-[hsl(var(--error))/0.15] text-[hsl(var(--error))]',
  'Esperando cliente': 'bg-amber-500/15 text-amber-400',
  'Borrador': 'bg-slate-500/15 text-slate-400',
  'Pendiente aprobación': 'bg-amber-500/15 text-amber-400',
  'Pendiente de aprobación': 'bg-amber-500/15 text-amber-400',
  'Aprobada': 'bg-blue-500/15 text-blue-400',
  'Enviada': 'bg-violet-500/15 text-violet-400',
  'Recibida parcial': 'bg-orange-500/15 text-orange-400',
  'Recibida completa': 'bg-emerald-500/15 text-emerald-400',
  'Confirmada': 'bg-emerald-500/15 text-emerald-400',
  'Tentativa': 'bg-amber-500/15 text-amber-400',
  // Prioridades legacy
  'Urgente': 'bg-red-500/15 text-red-400',
  'Alta': 'bg-red-500/15 text-red-400',
  'Media': 'bg-amber-500/15 text-amber-400',
  'Baja': 'bg-green-500/15 text-green-400',
  // Categorías legacy
  'Técnica': 'bg-purple-500/15 text-purple-400',
  'Comercial': 'bg-violet-500/15 text-violet-400',
  'Administrativa': 'bg-amber-500/15 text-amber-400',
  'General': 'bg-slate-500/15 text-slate-400',
  'Compras': 'bg-emerald-500/15 text-emerald-400',
  'Soporte técnico': 'bg-purple-500/15 text-purple-400',
  'Facturación': 'bg-amber-500/15 text-amber-400',
  'Consulta comercial': 'bg-violet-500/15 text-violet-400',
  'Consulta': 'bg-slate-500/15 text-slate-400',
  'seguridad': 'bg-red-500/15 text-red-400',
  'cloud': 'bg-blue-500/15 text-blue-400',
  'infra': 'bg-amber-500/15 text-amber-400',
  'auditoría': 'bg-violet-500/15 text-violet-400',
  // Tipos legacy
  'Cliente': 'bg-green-500/15 text-green-400',
  'Proveedor': 'bg-blue-500/15 text-blue-400',
  'Prospecto': 'bg-amber-500/15 text-amber-400',
  'Socio': 'bg-purple-500/15 text-purple-400',
  'Premium': 'bg-amber-500/15 text-amber-400',
  'Básico': 'bg-slate-500/15 text-slate-400',
  '24x7': 'bg-red-500/15 text-red-400',
  'soporte': 'bg-cyan-500/15 text-cyan-400',
  'portal': 'bg-violet-500/15 text-violet-400',
  'email': 'bg-blue-500/15 text-blue-400',
  'telefono': 'bg-emerald-500/15 text-emerald-400',
}

export function StatusBadge({
  status,
  type = 'estado',
  customColor,
  className = '',
  ...props
}: StatusBadgeProps) {

  const getColorConfig = (): { color: string; bg: string; label: string; useOriginal: boolean } => {
    if (customColor) {
      return {
        color: customColor.replace('bg-', 'text-'),
        bg: customColor,
        label: status,
        useOriginal: true
      }
    }

    // Primero intentar con el status normalizado
    const normalizedKey = normalizeStatus(status)
    const config = statusConfig[normalizedKey]

    if (config) {
      return { ...config, useOriginal: false }
    }

    // Backwards compatibility: buscar en colores legacy
    const legacyColor = LEGACY_COLORS[status]
    if (legacyColor) {
      return {
        color: legacyColor.split(' ')[1],
        bg: legacyColor.split(' ')[0],
        label: status,
        useOriginal: true
      }
    }

    // Fallback para estados no reconocidos
    return {
      color: 'text-slate-400',
      bg: 'bg-slate-500/15',
      label: status,
      useOriginal: true
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
