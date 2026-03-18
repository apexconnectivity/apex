# Plan de Mejora Visual - Paneles Laterales (SidePanels)

## Módulos: Proyectos, Tareas y Soporte

---

## 1. Arquitectura Actual

Los SidePanels utilizan una **arquitectura basada en componentes** que hereda de un componente base:

### Componente Base:
- **[`BaseSidePanel.tsx`](netops-crm/src/components/base/BaseSidePanel.tsx)** - Componente reutilizable que maneja:
  - Animaciones de abrir/cerrar (transiciones CSS)
  - Posición (left/right)
  - Header, contenido y footer
  - Ancho personalizable

### Subcomponentes (definidos en el mismo archivo BaseSidePanel.tsx):
- **`SidePanelHeader`** - Header con icon, title, subtitle, action
- **`SidePanelContent`** - Contenedor del contenido
- **`SidePanelSection`** - Secciones dentro del contenido
- **`SidePanelFooter`** - Footer persistente

### Paneles que heredan/utilizan BaseSidePanel:
| Panel | Módulo | Archivo |
|-------|--------|---------|
| ProjectDetailPanel | Proyectos | [`ProjectDetailPanel.tsx`](netops-crm/src/components/module/ProjectDetailPanel.tsx) |
| TaskDetailPanel | Tareas | [`TaskDetailPanel.tsx`](netops-crm/src/components/module/TaskDetailPanel.tsx) |
| TicketDetailPanel | Soporte | [`TicketDetailPanel.tsx`](netops-crm/src/components/module/TicketDetailPanel.tsx) |

### Estructura típica de uso:
```tsx
<BaseSidePanel
  isOpen={isOpen}
  onClose={onClose}
  title="Detalles"
>
  <SidePanelHeader title="..." icon={...} />
  <SidePanelContent>...</SidePanelContent>
  <SidePanelFooter>...</SidePanelFooter>
</BaseSidePanel>
```

---

## 2. Estado Visual Actual

### BaseSidePanel:
- Fondo: `bg-slate-900/50` (oscuro semi-transparente)
- Bordes: `border-border` estándar
- Header simple con título
- Sin variantes de color según el tipo de entidad
- Sin barra de acento visual

### Subcomponentes actuales:
- SidePanelHeader: solo title e icon opcionales
- Sin soporte para variantes de color
- Iconos genéricos

---

## 3. Propuesta de Sistema de Variantes

### Tipos de variante para SidePanels:

| Variante | Color Principal | Uso |
|----------|----------------|-----|
| `project` | Emerald (#10b981) | Detalles de proyecto |
| `task` | Blue (#3b82f6) | Detalles de tarea |
| `ticket` | Amber (#f59e0b) | Detalles de ticket |
| `empresa` | Cyan (#06b6d4) | Detalles de empresa |

---

## 4. Plan de Implementación

### Fase 1: Crear constantes de paneles
**Archivo:** [`src/constants/paneles.ts`](netops-crm/src/constants/paneles.ts) (nuevo)

```typescript
export type SidePanelVariant = 'project' | 'task' | 'ticket' | 'empresa' | 'default'

export interface SidePanelVariantColors {
  primary: string
  light: string
  text: string
  border: string
  iconBg: string
  gradient: string
}

export const SIDE_PANEL_VARIANT_COLORS: Record<SidePanelVariant, SidePanelVariantColors> = {
  project: {
    primary: '#10b981',
    light: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-l-emerald-500',
    iconBg: 'bg-emerald-500/20',
    gradient: 'from-emerald-500/20',
  },
  task: {
    primary: '#3b82f6',
    light: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-l-blue-500',
    iconBg: 'bg-blue-500/20',
    gradient: 'from-blue-500/20',
  },
  ticket: {
    primary: '#f59e0b',
    light: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-l-amber-500',
    iconBg: 'bg-amber-500/20',
    gradient: 'from-amber-500/20',
  },
  empresa: {
    primary: '#06b6d4',
    light: 'bg-cyan-500/10',
    text: 'text-cyan-400',
    border: 'border-l-cyan-500',
    iconBg: 'bg-cyan-500/20',
    gradient: 'from-cyan-500/20',
  },
  default: {
    primary: '#64748b',
    light: 'bg-slate-500/10',
    text: 'text-slate-400',
    border: 'border-l-slate-500',
    iconBg: 'bg-slate-500/20',
    gradient: 'from-slate-500/20',
  }
}

export function getSidePanelVariantColor(variant: SidePanelVariant): SidePanelVariantColors {
  return SIDE_PANEL_VARIANT_COLORS[variant] || SIDE_PANEL_VARIANT_COLORS.default
}
```

### Fase 2: Actualizar BaseSidePanel
**Archivo:** [`src/components/base/BaseSidePanel.tsx`](netops-crm/src/components/base/BaseSidePanel.tsx)

**Nuevas props:**
```typescript
import { SidePanelVariant, getSidePanelVariantColor } from '@/constants/paneles'

interface BaseSidePanelProps {
  // ... existentes
  variant?: SidePanelVariant
  showAccentBar?: boolean
}
```

**Cambios visuales:**
1. Agregar prop `variant` y `showAccentBar`
2. Barra de acento en el borde izquierdo según variante
3. Fondo con gradiente sutil según variante
4. Animaciones de entrada mejoradas

### Fase 3: Actualizar SidePanelHeader
**Archivo:** [`src/components/base/BaseSidePanel.tsx`](netops-crm/src/components/base/BaseSidePanel.tsx) (mismo archivo)

**Nuevas props:**
```typescript
interface SidePanelHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
  icon?: ReactNode
  variant?: SidePanelVariant
  showAccent?: boolean
  className?: string
}
```

**Cambios:**
1. Icono con fondo colorido según variante
2. Título con color según variante
3. Subtítulo en color muted
4. Barra de acento superior opcional

### Fase 4: Migrar ProjectDetailPanel
**Archivo:** [`src/components/module/ProjectDetailPanel.tsx`](netops-crm/src/components/module/ProjectDetailPanel.tsx)

```tsx
import { SidePanelVariant } from '@/constants/paneles'

// En el componente:
const variant: SidePanelVariant = 'project'

<BaseSidePanel
  isOpen={isOpen}
  onClose={onClose}
  variant={variant}
  showAccentBar
>
  <SidePanelHeader
    title={proyecto.nombre}
    subtitle={`${proyecto.fase_actual} • ${proyecto.estado}`}
    variant={variant}
    showAccent
  />
```

### Fase 5: Migrar TaskDetailPanel
**Archivo:** [`src/components/module/TaskDetailPanel.tsx`](netops-crm/src/components/module/TaskDetailPanel.tsx)

```tsx
const variant: SidePanelVariant = 'task'

<BaseSidePanel
  isOpen={isOpen}
  onClose={onClose}
  variant={variant}
  showAccentBar
>
  <SidePanelHeader
    title={tarea.nombre}
    subtitle={tarea.estado}
    variant={variant}
    showAccent
  />
```

### Fase 6: Migrar TicketDetailPanel
**Archivo:** [`src/components/module/TicketDetailPanel.tsx`](netops-crm/src/components/module/TicketDetailPanel.tsx)

```tsx
const variant: SidePanelVariant = 'ticket'

<BaseSidePanel
  isOpen={isOpen}
  onClose={onClose}
  variant={variant}
  showAccentBar
>
  <SidePanelHeader
    title={`#${ticket.numero_ticket}`}
    subtitle={ticket.asunto}
    variant={variant}
    showAccent
  />
```

---

## 5. Resumen de Archivos a Modificar

| # | Archivo | Acción |
|---|---------|--------|
| 1 | [`src/constants/paneles.ts`](netops-crm/src/constants/paneles.ts) | **Crear** - Constantes de colores |
| 2 | [`src/components/base/BaseSidePanel.tsx`](netops-crm/src/components/base/BaseSidePanel.tsx) | **Modificar** - Agregar variant, showAccentBar |
| 3 | [`src/components/module/ProjectDetailPanel.tsx`](netops-crm/src/components/module/ProjectDetailPanel.tsx) | **Migrar** - Usar variant="project" |
| 4 | [`src/components/module/TaskDetailPanel.tsx`](netops-crm/src/components/module/TaskDetailPanel.tsx) | **Migrar** - Usar variant="task" |
| 5 | [`src/components/module/TicketDetailPanel.tsx`](netops-crm/src/components/module/TicketDetailPanel.tsx) | **Migrar** - Usar variant="ticket" |

---

## 6. Ejemplo de Implementación Final

### Antes:
```tsx
<BaseSidePanel
  isOpen={isOpen}
  onClose={onClose}
  title="Detalles del Proyecto"
>
  <SidePanelHeader 
    title="Proyecto X" 
    icon={<Building2 className="h-5 w-5" />}
  />
```

### Después:
```tsx
<BaseSidePanel
  isOpen={isOpen}
  onClose={onClose}
  variant="project"
  showAccentBar
>
  <SidePanelHeader 
    title="Proyecto X" 
    subtitle="Fase: discovery • Activo"
    variant="project"
    showAccent
  />
```

---

## 7. Beneficios del Sistema

1. **Consistencia visual** - Colores coherentes con el sistema de modales
2. **Reconocimiento inmediato** - Identificación del tipo de entidad por color
3. **Jerarquía visual** - Mejor navegación entre paneles
4. **Escalabilidad** - Fácil agregar nuevas variantes
5. **Mantenimiento centralizado** - Cambios en BaseSidePanel afectan a todos

---

## 8. Siguiente Paso

Una vez aprobado este plan, podemos proceder a **Fase 1: Crear el archivo de constantes** [`src/constants/paneles.ts`](netops-crm/src/constants/paneles.ts)

---

*Documento actualizado para reflejar la arquitectura BaseSidePanel + subcomponentes.*
