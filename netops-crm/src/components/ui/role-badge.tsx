import { Badge } from '@/components/ui/badge'
import { getRoleColor } from '@/lib/colors'
import { ROLE_DEFINITIONS, type Role } from '@/types/auth'

interface RoleBadgeProps {
  role: Role
  className?: string
}

// Named export
export function RoleBadge({ role, className }: RoleBadgeProps) {
  const roleConfig = getRoleColor(role)
  const roleLabel = ROLE_DEFINITIONS[role]?.label || role

  return (
    <Badge
      className={`
        ${roleConfig.bg} 
        ${roleConfig.color} 
        ${roleConfig.border}
        border rounded-lg
        ${className || ''}
      `}
    >
      {roleLabel}
    </Badge>
  )
}

// Default export for backwards compatibility
export default RoleBadge
