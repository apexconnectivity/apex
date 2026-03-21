'use client'

import { BaseModal, ModalHeader, ModalBody, ModalFooter } from '@/components/base'
import { Button } from '@/components/ui/button'
import { ModalVariant } from '@/constants/modales'
import { PlusCircle, FolderOpen, AlertCircle, Inbox, FileQuestion } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

// ============================================================================
// Types
// ============================================================================

export type EmptyStateIcon = 'folder' | 'alert' | 'inbox' | 'question' | 'plus'

export interface EmptyStateAction {
  label: string
  onClick: () => void
  variant?: 'default' | 'secondary' | 'destructive' | 'ghost' | 'outline'
  icon?: ReactNode
}

export interface EmptyStateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  icon?: EmptyStateIcon
  actions: EmptyStateAction[]
  variant?: ModalVariant
}

// ============================================================================
// Icon Mapping
// ============================================================================

const ICON_MAP: Record<EmptyStateIcon, typeof PlusCircle> = {
  folder: FolderOpen,
  alert: AlertCircle,
  inbox: Inbox,
  question: FileQuestion,
  plus: PlusCircle,
}

// ============================================================================
// Component
// ============================================================================

export function EmptyStateModal({
  open,
  onOpenChange,
  title = 'Nada aquí todavía',
  description = '完成以下操作以开始:',
  icon = 'folder',
  actions,
  variant = 'default',
}: EmptyStateModalProps) {
  const IconComponent = ICON_MAP[icon]

  return (
    <BaseModal
      open={open}
      onOpenChange={onOpenChange}
      size="sm"
      variant={variant}
      showAccentBar
      showCloseButton={false}
      closeOnOverlayClick={false}
      disableClose
    >
      <ModalHeader 
        title={title} 
        variant={variant}
        showIcon
      />
      
      <ModalBody>
        <div className="text-center py-8">
          <div className={cn(
            'w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6',
            'bg-muted/50 border-2 border-dashed border-muted-foreground/20'
          )}>
            <IconComponent className="w-10 h-10 text-muted-foreground/40" />
          </div>
          
          <p className="text-muted-foreground mb-2">{description}</p>
        </div>
      </ModalBody>
      
      <ModalFooter>
        <div className="flex flex-col gap-3 w-full">
          {actions.map((action, index) => (
            <Button
              key={index}
              onClick={action.onClick}
              variant={action.variant || 'default'}
              className={cn(
                'w-full justify-center',
                index === 0 && 'bg-primary hover:bg-primary/90'
              )}
            >
              {action.icon}
              {action.label}
            </Button>
          ))}
        </div>
      </ModalFooter>
    </BaseModal>
  )
}

// ============================================================================
// Preset Configurations
// ============================================================================

export const EMPTY_STATE_CONFIGS = {
  noProyectos: {
    title: 'No hay proyectos',
    description: 'Debes crear al menos un proyecto antes de continuar.',
    icon: 'folder' as EmptyStateIcon,
    variant: 'warning' as ModalVariant,
  },
  noEmpresas: {
    title: 'No hay empresas',
    description: 'Debes crear al menos una empresa antes de continuar.',
    icon: 'folder' as EmptyStateIcon,
    variant: 'warning' as ModalVariant,
  },
  noEmpresasNiProyectos: {
    title: 'Configuración requerida',
    description: 'Para comenzar, necesitas crear empresas y proyectos.',
    icon: 'folder' as EmptyStateIcon,
    variant: 'info' as ModalVariant,
  },
  noTareas: {
    title: 'Sin tareas',
    description: 'No hay tareas para mostrar en este momento.',
    icon: 'inbox' as EmptyStateIcon,
    variant: 'default' as ModalVariant,
  },
}
