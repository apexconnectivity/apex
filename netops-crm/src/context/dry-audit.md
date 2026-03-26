# Auditoría DRY - NetOps CRM

## Resumen Ejecutivo

Se realizó un análisis completo del codebase del proyecto NetOps CRM (Next.js 14 + TypeScript + Tailwind CSS). Se identificaron múltiples oportunidades para eliminar código duplicado, componentes inline repetidos y lógica duplicada.

**Estadísticas del análisis:**
- 495 ocurrencias de `flex items-center`
- 259 ocurrencias de `space-y-`
- 163 ocurrencias de `rounded-lg`
- 477 ocurrencias de `text-muted-foreground`
- 108 ocurrencias de `gap-4`
- 42 usages de estilos inline `style={{}}`
- 107 archivos con useState
- 68 archivos con useMemo

---

## Problemas Encontrados

### 1. Componentes Inline Repetidos

#### 1.1 Estructuras de layout repetidas en páginas

| Patrón | Frecuencia | Ubicaciones |
|--------|------------|--------------|
| `<div className="flex items-center justify-between">` | ~150+ | Múltiples páginas |
| `<div className="flex items-center gap-4">` | ~120+ | Múltiples páginas |
| `<div className="space-y-4">` | ~100+ | Múltiples páginas |
| `<div className="grid grid-cols-X gap-4">` | ~80+ | Múltiples páginas |

#### 1.2 Skeleton Loaders duplicados

Cada página tiene su propio componente de Loading con estructura similar:

```
tareas/page.tsx: TareasLoading (líneas 150-173)
soporte/page.tsx: SoporteLoading (líneas 104-127)
proyectos/page.tsx: ProyectosLoading (similar)
crm/page.tsx: CRMLoading (similar)
```

**Estructura repetida:**
```tsx
<div className="space-y-4">
  <Skeleton className="h-20 w-full" />
  <div className="grid grid-cols-X gap-4">
    {[1,2,3,4].map(i => <Skeleton key={i} className="h-24" />)}
  </div>
  <div className="grid grid-cols-X gap-6 min-w-[XXXpx] pb-6">
    {ESTADOS.map(estado => (
      <div key={estado} className="space-y-3">
        <div className="flex items-center justify-between px-2">
          <Skeleton className="h-4 w-20" />
        </div>
        {[1,2,3].map(j => <Skeleton key={j} className="h-32" />)}
      </div>
    ))}
  </div>
</div>
```

**Recomendación:** Crear componente `ModuleLoadingSkeleton` reutilizable.

#### 1.3 Kanban Board Columns repetidas

Las columnas de Kanban se replican en múltiples páginas:
- `tareas/page.tsx` - Kanban de tareas
- `soporte/page.tsx` - Kanban de tickets
- `proyectos/page.tsx` - Pipeline de proyectos

Cada una tiene su propia implementación en lugar de usar el `TaskKanbanBoard` existente en `src/components/ui/task-kanban-board.tsx`.

#### 1.4 Empty States duplicados

```
tareas/page.tsx: líneas 444-449
soporte/page.tsx: líneas 558-560
proyectos/page.tsx: línea 602
archivos/page.tsx: líneas 150-151
```

Estructura repetida:
```tsx
<Icon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
<p className="text-lg font-medium text-muted-foreground">Mensaje</p>
```

**Recomendación:** Crear componente `EmptyState` con variants (ya existe parcialmente en `src/components/module/EmptyState.tsx`).

---

### 2. Código Duplicado

#### 2.1 Transformaciones de datos repetidas

**transformUsuarios** - aparece en múltiples páginas con lógica idéntica:

```tsx
// En tareas/page.tsx (líneas 39-48)
const transformUsuarios = (users: User[]): { id: string; nombre: string; rol: string }[] => {
  const ROLES_INTERNOS = ['admin', 'comercial', 'especialista', 'compras', 'facturacion', 'marketing']
  return users
    .filter(u => u.activo && u.roles.some(r => ROLES_INTERNOS.includes(r)))
    .map(u => ({ id: u.id, nombre: u.nombre, rol: u.roles[0] || 'cliente' }))
}
```

Esta función debería estar en un hook o utilidad compartida.

#### 2.2 Lógica de filtros duplicada

Cada página tiene su propia implementación de filtros con patrones similares:

- `tareas/page.tsx` - usa FilterBar con múltiples options
- `soporte/page.tsx` - usa FilterBar con similar estructura
- `compras/page.tsx` - filtros de proveedor
- `calendario/page.tsx` - filtros de reuniones

**Patrón repetido:**
```tsx
options: [
  { value: 'todos', label: 'Todos' },
  ...items.map(p => ({ value: p.id, label: p.nombre }))
]
```

#### 2.3 useMemo de estadísticas duplicado

Cada página calcula sus propias estadísticas de manera similar:

```
tareas/page.tsx: líneas 264-275
soporte/page.tsx: líneas 267-277
compras/page.tsx: líneas 379-389
calendario/page.tsx: líneas 496-505
```

**Patrón repetido:**
```tsx
const stats = useMemo(() => ({
  total: data.length,
  estadoX: data.filter(d => d.estado === 'X').length,
  // ...más métricas
}), [data])
```

**Recomendación:** Crear hook genérico `useModuleStats(data, config)`.

#### 2.4 useState de modales repetidos

Múltiples páginas declaran estados similares:

```tsx
const [showCreate, setShowCreate] = useState(false)
const [showEdit, setShowEdit] = useState(false)
const [selectedId, setSelectedId] = useState<string | null>(null)
const [searchQuery, setSearchQuery] = useState('')
```

Esto aparece en ~12 páginas con variaciones mínimas.

#### 2.5 Handlers de drag-and-drop duplicados

La lógica de DnD para Kanban está duplicada en:
- `tareas/page.tsx`
- `soporte/page.tsx`

con código casi idéntico (handleDragStart, handleDragEnd).

---

### 3. Constantes Faltantes

#### 3.1 Magic Numbers

| Ubicación | Valor | Debe ser |
|-----------|-------|----------|
| varios | `[1,2,3,4,5,6]` | `ARRAY_1_AL_6` |
| varios | `[1,2,3,4]` | `ARRAY_1_AL_4` |
| varios | `[1,2,3,4,5]` | `ARRAY_1_AL_5` |
| varios | `min-w-[1000px]` | MIN_WIDTH_KANBAN |
| varios | `min-w-[1200px]` | MIN_WIDTH_LARGE |
| varios | `min-w-[1400px]` | MIN_WIDTH_PIPELINE |

#### 3.2 Strings hardcodeados

| Ubicación | Valor | Debe ser |
|-----------|-------|----------|
| tareas | `'todos'`, `'todas'` | FILTER_OPTIONS |
| soporte | `'todos'`, `'todas'` | FILTER_OPTIONS |
| crm | `'todos'`, `'todas'` | FILTER_OPTIONS |
| varios | `'es-ES'` | LOCALE_ES |
| varios | `'YYYY-MM-DD'` | DATE_FORMAT |
| varios | `{ day: '2-digit', month: '2-digit' }` | DATE_SHORT_FORMAT |

#### 3.3 Colores inline repetidos

Algunos colores se usan directamente en lugar de las constantes de `colors.ts`:

```tsx
// En lugar de: getPriorityColor(prioridad).color
// Se usa inline:
className="text-red-400"
className="text-orange-400"
className="text-amber-400"
```

---

### 4. Componentes Existentes que NO se Usan

#### 4.1 Componentes UI disponibles pero infrautilizados

| Componente | Ubicación | Uso actual | Oportunidad |
|------------|------------|-------------|-------------|
| `ModuleLoadingSkeleton` | NO EXISTE (crear) | Manual en cada página | Todas las páginas |
| `EmptyState` | `src/components/module/EmptyState.tsx` | Solo en archivos/page.tsx | tareas, soporte, proyectos, crm |
| `PageAnimation` | `src/components/ui/page-animation.tsx` | Solo en algunas páginas | Usar en todas |
| `FilterBar` | `src/components/ui/filter-bar.tsx` | En varias páginas | Estandarizar uso |
| `StatGrid` | `src/components/ui/mini-stat.tsx` | En varias páginas | Hacer obligatorio |
| `TaskKanbanBoard` | `src/components/ui/task-kanban-board.tsx` | NO se usa en páginas | Reemplazar implementaciones manuales |
| `BaseCard` | `src/components/base/BaseCard.tsx` | Uso parcial | Usar consistentemente |

#### 4.2 Hooks disponibles que podrían centralizar lógica

| Hook | Ubicación | Oportunidad |
|------|------------|--------------|
| `useTareas` | `src/hooks/` | Ya existe, usar más |
| `useProyectos` | `src/hooks/` | Ya existe, usar más |
| `useEmpresas` | `src/hooks/useEmpresas.ts` | Ya existe, usar más |
| `useContactos` | `src/hooks/` | Ya existe |

#### 4.3 Utilidades disponibles pero no usadas consistentemente

| Utilidad | Ubicación | Problema |
|----------|------------|----------|
| `cn()` | `src/lib/utils.ts` | Se usa bien |
| `cnHoverLift()` | `src/lib/utils.ts` | Apenas se usa |
| `getStatusColor()` | `src/lib/colors.ts` | Se usa parcialmente |
| `getPriorityColor()` | `src/lib/colors.ts` | Se usa parcialmente |
| `getTaskStatusColor()` | `src/lib/colors.ts` | Se usa parcialmente |

---

### 5. JSX Inline Repetido por Categoría

#### 5.1 Grid layouts

```tsx
// Repetido ~80 veces
<div className="grid grid-cols-4 gap-4">
<div className="grid grid-cols-5 gap-4">
<div className="grid md:grid-cols-2 gap-4">
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
```

**Recomendación:** Componentes `Grid4`, `Grid5`, `Grid2Col`, `GridResponsive`

#### 5.2 Badges de estado repetidos

```tsx
// Cada página implementa su propio badge de estado
// Ejemplo en soporte/page.tsx línea 71-74
badges={[
  { label: ticket.categoria },
  { label: ticket.prioridad },
]}
```

El componente `StatusBadge` existe en `src/components/module/StatusBadge.tsx` pero cada página lo usa diferente.

#### 5.3 Iconos con texto repetidos

```tsx
// ~50+ ocurrencias
<Calendar className="h-3 w-3" />
<User className="h-3 w-3" />
<Clock className="h-3 w-3" />
<AlertCircle className="h-3 w-3" />
```

**Recomendación:** Componentes `IconLabel`, `IconDate`, `IconUser`

#### 5.4 Contenedores de-card重复

```tsx
// ~30+ ocurrencias
<div className="p-4 border rounded-lg bg-card">
<div className="p-3 border rounded-lg hover:bg-muted/50">
<div className="p-2 rounded-lg border bg-muted/30">
```

**Recomendación:** Componentes `CardContainer`, `CardItem`, `CardHover`

---

## Recomendaciones

### Prioridad ALTA (Implementar inmediatamente)

1. **Crear `ModuleLoadingSkeleton` component**
   - Ruta sugerida: `src/components/ui/module-loading-skeleton.tsx`
   - Props: `columns`, `rows`, `minWidth`, `estados[]`

2. **Crear hook `useModuleStats`**
   - Ruta sugerida: `src/hooks/useModuleStats.ts`
   - Input: data[], config de métricas
   - Output: objeto stats calculados

3. **Estandarizar `FilterBar` usage**
   - Asegurar que todas las páginas usen el mismo formato de options
   - Crear utilidad `createFilterOptions(items, labelField, valueField)`

4. **Migrar a `TaskKanbanBoard` existente**
   - Reemplazar implementaciones manuales en páginas
   - Usar el componente de `src/components/ui/task-kanban-board.tsx`

### Prioridad MEDIA (Implementar en siguientes sprints)

5. **Crear utilidad de transformación de usuarios**
   - Mover `transformUsuarios` a `src/lib/user-utils.ts`
   - O crear hook `useUsuariosInternos()`

6. **Crear constantes de grid layouts**
   - `src/constants/ui.ts` con grid patterns
   - `GRID_4_COLS`, `GRID_5_COLS`, `GRID_RESPONSIVE`

7. **Crear componentes de iconos con labels**
   - `IconLabel`, `IconDate`, `IconUser`, `IconStatus`
   - Reducirá 50+ ocurrencias de código repetido

8. **Completar componente `EmptyState`**
   - Asegurar que soporte todos los tipos de empty states
   - Usar consistentemente en todas las páginas

### Prioridad BAJA (Mejoras incrementales)

9. **Estandarizar locale y date formats**
   - Crear constants en `src/constants/timing.ts`
   - Usar consistentemente en lugar de hardcoded strings

10. **Revisar uso de colores de `colors.ts`**
    - Asegurar que todo use las funciones helper
    - Eliminar colores inline donde sea posible

11. **Crear `CardContainer` component**
    - Estandarizar los múltiples patrones de card containers
    - Reducirá ~30 ocurrencias duplicadas

---

## Resumen de Métricas DRY

| Categoría | Actual | Objetivo |
|-----------|--------|----------|
| Patrones className duplicados | ~1500 ocurrencias | ~200 (con componentes) |
| useState repetidos | ~107 archivos | ~20 (hooks centralizados) |
| useMemo duplicados | ~68 archivos | ~15 (hooks reutilizables) |
| Componentes Loading | 12+ manual | 1 reutilizable |
| Magic numbers | ~50 hardcoded | ~5 constantes |
| Empty states | 8+ manual | 1 reutilizable |

---

## Archivos con Mayor Problema DRY

1. `src/app/(dashboard)/dashboard/tareas/page.tsx` - 754 líneas con múltiples duplicados
2. `src/app/(dashboard)/dashboard/soporte/page.tsx` - 690 líneas con lógica duplicada
3. `src/app/(dashboard)/dashboard/proyectos/page.tsx` - ~650 líneas
4. `src/app/(dashboard)/dashboard/crm/page.tsx` - ~800 líneas
5. `src/app/(dashboard)/dashboard/estadisticas/page.tsx` - ~1000 líneas

---

*Auditoría completada: 2026-03-26*
*Herramientas: grep, glob, read - Análisis de 21 páginas + ~90 componentes*