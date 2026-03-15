# Plan: Usar tokens CSS para colores de estado

## Objetivo
Reemplazar los colores hardcoded (emerald, amber, blue, red, etc.) por los tokens CSS ya definidos en `globals.css`.

## Tokens CSS Existentes

Los siguientes tokens están definidos en `src/app/globals.css` pero **NO se utilizan**:

```css
/* Estados */
--success: 142 76% 36%;   /* Emerald - estados exitosos */
--warning: 38 92% 50%;     /* Amber - advertencias */
--info: 199 89% 48%;       /* Blue - información */
--error: 0 84% 50%;        /* Red - errores */
```

## Análisis de Colores Hardcoded

Se encontraron **180+ instancias** de colores hardcoded en el proyecto.

### Por Categoría de Color

| Color | Instancias | token CSS建议 |
|-------|------------|--------------|
| `emerald-400/500` | ~45 | `--success` |
| `amber-400/500` | ~40 | `--warning` |
| `blue-400/500` | ~30 | `--info` |
| `red-400/500` | ~25 | `--error` |
| `slate-400/500` | ~40 | (mantener - no es estado) |

### Por Archivo (Priorizados)

#### PRIORIDAD ALTA - Componentes UI Core

| # | Archivo | Instancias | Acción |
|---|---------|------------|--------|
| 1 | `badge.tsx` | 4 | CRÍTICO - Sistema de badges |
| 2 | `mini-stat.tsx` | 10 | CRÍTICO - Stats components |
| 3 | `stat-card.tsx` | 4 | CRÍTICO - Cards de estadísticas |
| 4 | `StatusBadge.tsx` | 80+ | CRÍTICO - Badge de estados |

#### PRIORIDAD MEDIA - Componentes de Módulo

| # | Archivo | Instancias | Acción |
|---|---------|------------|--------|
| 5 | `CreateTicketModal.tsx` | 4 | Medio - Alertas |
| 6 | `welcome-header.tsx` | 6 | Medio - MiniStats |
| 7 | `dashboard-stats.tsx` | 4 | Medio - StatCards |
| 8 | `sidebar.tsx` | 8 | Medio - Estados activos |
| 9 | `pipeline.tsx` | 2 | Medio - Colors de fase |

#### PRIORIDAD BAJA - Páginas

| # | Archivo | Instancias | Acción |
|---|---------|------------|--------|
| 10 | `crm/page.tsx` | 8 | Bajo |
| 11 | `proyectos/page.tsx` | 12 | Bajo |
| 12 | `soporte/page.tsx` | 6 | Bajo |
| 13 | `login/page.tsx` | 4 | Bajo |
| 14 | `proyecto-detail-panel.tsx` | 10 | Bajo |
| 15 | `task-detail-panel.tsx` | 8 | Bajo |
| 16 | `ticket-detail-panel.tsx` | 6 | Bajo |

## Plan de Implementación

### Paso 1: Agregar utility functions en `lib/utils.ts`

```typescript
// Agregar funciones helper para colores de estado
export function getStateColor(token: 'success' | 'warning' | 'info' | 'error', variant: 'text' | 'bg' | 'border' = 'text') {
  const colors = {
    success: {
      text: 'text-[hsl(var(--success))]',
      bg: 'bg-[hsl(var(--success)_/_0.15)]', // necesito ajustar
      border: 'border-[hsl(var(--success)_/_0.3)]'
    },
    // ... etc
  }
  return colors[token][variant]
}
```

### Paso 2: Actualizar Badge y variantes (badge.tsx)

**Antes:**
```typescript
success: "border-transparent bg-green-500/15 text-green-700 dark:text-green-400",
warning: "border-transparent bg-yellow-500/15 text-yellow-700 dark:text-yellow-400",
info: "border-transparent bg-blue-500/15 text-blue-700 dark:text-blue-400",
```

**Después:**
```typescript
success: "border-transparent bg-[hsl(var(--success),0.15)] text-[hsl(var(--success))]",
warning: "border-transparent bg-[hsl(var(--warning),0.15)] text-[hsl(var(--warning))]",
info: "border-transparent bg-[hsl(var(--info),0.15)] text-[hsl(var(--info))]",
```

### Paso 3: Actualizar MiniStat (mini-stat.tsx)

**Antes:**
```typescript
success: {
  iconBg: 'bg-emerald-500/15',
  iconColor: 'text-emerald-400',
  valueColor: 'text-emerald-400',
  borderColor: 'border-emerald-500/20',
}
```

**Después:**
```typescript
success: {
  iconBg: 'bg-[hsl(var(--success),0.15)]',
  iconColor: 'text-[hsl(var(--success))]',
  valueColor: 'text-[hsl(var(--success))]',
  borderColor: 'border-[hsl(var(--success),0.2)]',
}
```

### Paso 4: Actualizar StatCard (stat-card.tsx)

**Antes:**
```typescript
changeType === "positive" && "text-emerald-600 dark:text-emerald-400"
changeType === "negative" && "text-red-600 dark:text-red-400"
```

**Después:**
```typescript
changeType === "positive" && "text-[hsl(var(--success))]"
changeType === "negative" && "text-[hsl(var(--error))]"
```

### Paso 5: Actualizar StatusBadge.tsx (80+ cambios)

Este archivo tiene muchos colores hardcoded para diferentes estados. Hay dos opciones:

**Opción A:** Mantener como está (usar valores hardcoded ya que son semánticos)
**Opción B:** Crear mapping a tokens CSS

Recomendación: **Opción A** - Los colores en StatusBadge son semánticos (verde=éxito, rojo=error) y ya funcionan bien. El cambio a tokens no aporta mucho.

### Paso 6: Actualizar resto de componentes

Los cambios en páginas son menores y pueden hacerse incrementalmente.

## Archivos a Modificar

```
src/
├── app/
│   └── globals.css                    ⚠️ AGREGAR tokens si faltan
├── lib/
│   └── utils.ts                       ✅ Agregar helpers
├── components/
│   └── ui/
│       ├── badge.tsx                  ✅ PRIORIDAD 1
│       ├── mini-stat.tsx              ✅ PRIORIDAD 2
│       ├── stat-card.tsx              ✅ PRIORIDAD 3
│       └── skeleton.tsx               ⚠️ revisar
│   └── module/
│       ├── StatusBadge.tsx            ⚠️ OPCIONAL
│       ├── welcome-header.tsx         ✅ PRIORIDAD 4
│       ├── dashboard-stats.tsx        ✅ PRIORIDAD 5
│       ├── sidebar.tsx                ✅ PRIORIDAD 6
│       ├── pipeline.tsx               ✅ PRIORIDAD 7
│       └── CreateTicketModal.tsx      ✅ PRIORIDAD 8
```

## Tiempo Estimado

| Fase | Tiempo |
|------|--------|
| Análisis | ✅ Completado |
| Crear helpers en utils.ts | 30 min |
| Actualizar Badge | 15 min |
| Actualizar MiniStat | 15 min |
| Actualizar StatCard | 15 min |
| Actualizar StatusBadge (opcional) | 1 hr |
| Actualizar resto componentes | 2 hr |
| **Total** | **~4 horas** |

## Notas

1. Los tokens CSS usan formato `hsl(var(--success))` pero Tailwind necesita valores numéricos para opacidad
2. La sintaxis correcta es: `bg-[hsl(var(--success),0.15)]` o usar la función `hsl()` de CSS
3. Algunos colores como `slate-400` son neutros y deben quedarse como están
4. El token `--primary` ya está en uso (cyan), no tocar

## Estado

- [x] Análisis completado
- [x] Tokens verificados en globals.css  
- [x] Hardcoded colors identificados (180+)
- [ ] Plan documentado (este archivo)
- [ ] Implementación

---

*Documento generado para FASE 1 - Tarea 1 del roadmap de diseño frontend*
