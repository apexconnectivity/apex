import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface AccessDeniedCardProps {
  icon: LucideIcon
  title?: string
  description?: string
  className?: string
}

/**
 * Componente reutilizable para mostrar mensajes de acceso denegado.
 * Usa las variables CSS del theme para mantener consistencia con dark mode.
 */
export function AccessDeniedCard({
  icon: Icon,
  title = 'Acceso Restringido',
  description,
  className,
}: AccessDeniedCardProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className={cn('max-w-md', className)}>
        <CardContent className="p-8 text-center">
          <Icon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold">{title}</h2>
          {description && (
            <p className="text-muted-foreground mt-2">{description}</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
