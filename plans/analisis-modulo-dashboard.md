# Análisis del Módulo Dashboard (Actualizado)

## Descripción General

El módulo Dashboard es el punto de entrada principal de la aplicación NetOps CRM. Es un componente central que proporciona una vista consolidada de las métricas clave, proyectos activos, actividad reciente y tareas pendientes del sistema.

---

## Estructura de Archivos

### Archivos Principales

| Archivo | Propósito |
|---------|-----------|
| [`dashboard/page.tsx`](netops-crm/src/app/(dashboard)/dashboard/page.tsx) | Página principal del dashboard |
| [`dashboard-header.tsx`](netops-crm/src/components/dashboard-header.tsx) | Header con breadcrumbs y controles de usuario |
| [`dashboard-stats.tsx`](netops-crm/src/components/dashboard-stats.tsx) | Componentes de estadísticas y actividad |
| [`pipeline.tsx`](netops-crm/src/components/pipeline.tsx) | Pipeline visual de proyectos en 5 fases |
| [`welcome-header.tsx`](netops-crm/src/components/welcome-header.tsx) | Saludo personalizado según hora del día |
| [`layout.tsx`](netops-crm/src/app/(dashboard)/layout.tsx) | Layout del dashboard con sidebar |
| [`sidebar.tsx`](netops-crm/src/components/sidebar.tsx) | Navegación lateral colapsable |

---

## Situación Actual

### Datos Estáticos
Todos los módulos utilizan datos de demostración hardcodeados como constantes `DEMO_*`:

```typescript
// proyectos/page.tsx - línea 43
const DEMO_PROYECTOS: Proyecto[] = [...]

// crm/page.tsx - línea 71
const DEMO_EMPRESAS_INICIAL: Empresa[] = [...]

// soporte/page.tsx - línea 43
const DEMO_CONTRATOS: ContratoSoporte[] = [...]
```

### Keys de LocalStorage Existentes
| Key | Uso |
|-----|-----|
| `apex_user` | Sesión de usuario |
| `apex_crm_opciones` | Opciones de select (solo CRM) |

### Componentes UI Reutilizables Disponibles
- `StatCard` - Tarjetas de estadísticas con icono y cambio
- `MiniStat` - Versión mini de estadísticas
- `Card`, `CardContent`, `CardHeader`, `CardTitle`
- `Badge` - Insignias de estado/prioridad
- `Avatar`, `AvatarFallback`, `AvatarImage`
- `Button` - Botones con variantes
- `Skeleton` - Estados de carga

---

## Roles y Permisos

El dashboard implementa un sistema de **control de acceso basado en roles (RBAC)**:

| Rol | Acceso |
|-----|--------|
| **admin** | Dashboard completo, todas las fases del pipeline, sección CRM |
| **comercial** | Pipeline fases 1-3 (Prospecto, Diagnóstico, Propuesta) |
| **tecnico** | Solo fases 4-5 (Implementación, Cierre) y proyectos asignados |
| **cliente** | Portal simplificado con proyectos, tareas y tickets propios |
| **compras** | Acceso a módulo de compras |
| **facturacion** | Acceso a módulo de facturación |

---

## Problemas Identificados

### 1. Datos Hardcodeados en Dashboard
El dashboard NO lee datos de los módulos existentes, usa sus propios valores hardcodeados:
```typescript
// dashboard-stats.tsx - líneas 17-48
value="24"   // Clientes activos hardcodeado
value="12"   // Proyectos activos hardcodeado
value="47"   // Tareas pendientes hardcodeado
value="8"    // Tickets abiertos hardcodeado
```

### 2. Inconsistencia de Datos
- [`welcome-header.tsx`](netops-crm/src/components/welcome-header.tsx) muestra: 5 proyectos, 12 tareas, 3 tickets
- [`dashboard-stats.tsx`](netops-crm/src/components/dashboard-stats.tsx) muestra: 24 clientes, 12 proyectos, 47 tareas, 8 tickets
- No hay sincronización entre componentes

### 3. Pipeline con Datos Duplicados
El pipeline ([`pipeline.tsx`](netops-crm/src/components/pipeline.tsx)) tiene sus propios datos de ejemplo independientes de los proyectos reales.

### 4. Sin Persistencia
Los módulos (CRM, Proyectos, Tareas, Soporte) guardan datos solo en estado React, no en localStorage.

---

## Plan de Mejora

### Fase 1: Crear Utilidad de LocalStorage

Crear un hook/componente para gestionar datos en localStorage:

```typescript
// src/lib/useLocalStorage.ts (nuevo)
'use client'
import { useState, useEffect } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const item = localStorage.getItem(key)
    if (item) {
      try {
        setStoredValue(JSON.parse(item))
      } catch {
        setStoredValue(initialValue)
      }
    }
    setIsLoaded(true)
  }, [key, initialValue])

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }

  return [storedValue, setValue, isLoaded] as const
}
```

### Fase 2: Keys de LocalStorage por Módulo

| Módulo | Key propuesta |
|--------|---------------|
| Empresas/Contactos | `apex_crm_datos` |
| Proyectos | `apex_proyectos_datos` |
| Tareas | `apex_tareas_datos` |
| Tickets/Contratos | `apex_soporte_datos` |
| Dashboard | `apex_dashboard_cache` |

### Fase 3: Actualizar Dashboard para Usar Componentes Reutilizables

Reemplazar datos hardcodeados con datos de localStorage:

```typescript
// Ejemplo de integración
import { useLocalStorage } from '@/lib/useLocalStorage'
import { StatCard } from '@/components/ui/stat-card'

export function DashboardStats() {
  const [proyectos] = useLocalStorage<Proyecto[]>('apex_proyectos_datos', [])
  const [tareas] = useLocalStorage<Tarea[]>('apex_tareas_datos', [])
  const [tickets] = useLocalStorage<Ticket[]>('apex_soporte_datos', [])
  const [empresas] = useLocalStorage<Empresa[]>('apex_crm_datos', [])

  const clientesActivos = empresas.filter(e => e.tipo_entidad === 'cliente').length
  const proyectosActivos = proyectos.filter(p => p.estado === 'activo').length
  const tareasPendientes = tareas.filter(t => t.estado !== 'Completada').length
  const ticketsAbiertos = tickets.filter(t => t.estado !== 'Cerrado').length

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Clientes Activos" value={String(clientesActivos)} ... />
      <StatCard title="Proyectos Activos" value={String(proyectosActivos)} ... />
      <StatCard title="Tareas Pendientes" value={String(tareasPendientes)} ... />
      <StatCard title="Tickets Abiertos" value={String(ticketsAbiertos)} ... />
    </div>
  )
}
```

### Fase 4: Actualizar Componentes del Dashboard

#### 3.1 WelcomeHeader
- Ya usa `MiniStat` ✅
- Necesita leer de localStorage

#### 3.2 DashboardStats
- Ya usa `StatCard` ✅
- Necesita leer de localStorage

#### 3.3 RecentActivity
- Usa componentes custom
- Debería migrar a `Card` + `Badge` de UI

#### 3.4 UpcomingTasks
- Usa componentes custom
- Debería migrar a `Card` + `Badge` de UI

#### 3.5 ProjectPipeline
- Usa `Card`, `CardContent`, `Badge`, `Avatar` ✅
- Necesita leer proyectos de localStorage

---

## Lista de Tareas

- [ ] 1. Crear hook `useLocalStorage` en `/src/lib/`
- [ ] 2. Definir estructura de datos para cada módulo en localStorage
- [ ] 3. Actualizar módulos existentes para guardar datos en localStorage
- [ ] 4. Actualizar `DashboardStats` para usar `StatCard` + localStorage
- [ ] 5. Actualizar `WelcomeHeader` para usar `MiniStat` + localStorage
- [ ] 6. Actualizar `RecentActivity` para usar componentes UI
- [ ] 7. Actualizar `UpcomingTasks` para usar componentes UI
- [ ] 8. Actualizar `ProjectPipeline` para leer de localStorage
- [ ] 9. Agregar estados de carga con `Skeleton`
- [ ] 10. Sincronizar datos entre componentes del dashboard

---

## Dependencias UI Reutilizables a Utilizar

| Componente | Archivo | Uso en Dashboard |
|------------|--------|------------------|
| `StatCard` | `ui/stat-card.tsx` | Stats principales |
| `MiniStat` | `ui/mini-stat.tsx` | Welcome header |
| `Card` | `ui/card.tsx` | Contenedores |
| `Badge` | `ui/badge.tsx` | Prioridades, estados |
| `Avatar` | `ui/avatar.tsx` | Avatares de usuarios |
| `Skeleton` | `ui/skeleton.tsx` | Loading states |
| `Button` | `ui/button.tsx` | Acciones |

---

## Conclusión

El dashboard actual es una **interfaz de demostración** con datos hardcodeados. Para hacerlo funcional:

1. **Necesita integración con localStorage** para leer datos de los módulos existentes
2. **Los componentes UI ya son reutilizables** en su mayoría (StatCard, MiniStat, Card, etc.)
3. **Se requiere modificar los módulos** (CRM, Proyectos, Tareas, Soporte) para persistir datos en localStorage
4. **El dashboard debe unificar** los datos de todos los módulos para mostrar estadísticas coherentes
