# Plan de Corrección: Estilos de MiniStats en Módulo de Archivos

## Problema Identificado

Los **MiniStats** del módulo de archivos tienen bordes inconsistentes con los otros módulos de la aplicación.

### Análisis Comparativo

#### Módulo de Archivos (`constants/archivos.ts`)
```typescript
export const STAT_COLORS = {
  total: 'border-cyan-500/30',    // ❌ Formato clase Tailwind
  empresas: 'border-blue-500/30',  // ❌ Formato clase Tailwind
  proyectos: 'border-amber-500/30', // ❌ Formato clase Tailwind
  tickets: 'border-emerald-500/30',// ❌ Formato clase Tailwind
  espacio: 'border-violet-500/30', // ❌ Formato clase Tailwind
}
```

#### Otros Módulos (Soporte, Tareas, Calendario, etc.) (`lib/colors.ts`)
```typescript
const BASE_STATS_COLORS = {
  total: '#06b6d4',       // cyan-500 ✅ Formato hex
  info: '#3b82f6',        // blue-500 ✅ Formato hex
  success: '#10b981',     // emerald-500 ✅ Formato hex
  warning: '#f59e0b',     // amber-500 ✅ Formato hex
  danger: '#ef4444',      // red-500 ✅ Formato hex
  slate: '#64748b',       // slate-500 ✅ Formato hex
  violet: '#8b5cf6',      // violet-500 ✅ Formato hex
}
```

### Causa Raíz

1. El componente `MiniStat` espera un valor **hex** en la propiedad `accentColor`
2. En archivos se usa un **string de clase Tailwind** (`border-cyan-500/30`) que no es interpretado correctamente
3. Esto causa que los bordes de los MiniStats en archivos se vean diferentes

## Solución Propuesta

### Paso 1: Actualizar las constantes STAT_COLORS

En `src/constants/archivos.ts`, cambiar los valores de formato clase Tailwind a formato hex:

```typescript
export const STAT_COLORS = {
  total: '#06b6d4',       // cyan-500 (era border-cyan-500/30)
  empresas: '#3b82f6',    // blue-500 (era border-blue-500/30)
  proyectos: '#f59e0b',   // amber-500 (era border-amber-500/30)
  tickets: '#10b981',    // emerald-500 (era border-emerald-500/30)
  espacio: '#8b5cf6',    // violet-500 (era border-violet-500/30)
} as const
```

### Paso 2: Verificar uso en page.tsx

El uso actual en `src/app/(dashboard)/dashboard/archivos/page.tsx` es correcto:
```tsx
<MiniStat 
  value={stats.total} 
  label={STATS_LABELS.totalArchivos} 
  variant="primary" 
  showBorder 
  accentColor={STAT_COLORS.total}  // ✅ Pasa el valor hex
  icon={<Files className="h-5 w-5" />} 
/>
```

## Archivos a Modificar

| Archivo | Cambio |
|---------|--------|
| `netops-crm/src/constants/archivos.ts` | Actualizar valores de `STAT_COLORS` de formato clase Tailwind a hex |

## Equivalencias de Color

| Color | Clase Tailwind | Valor Hex |
|-------|----------------|-----------|
| cyan-500 | border-cyan-500/30 | #06b6d4 |
| blue-500 | border-blue-500/30 | #3b82f6 |
| amber-500 | border-amber-500/30 | #f59e0b |
| emerald-500 | border-emerald-500/30 | #10b981 |
| violet-500 | border-violet-500/30 | #8b5cf6 |

## Estado de Implementación

- [x] Análisis completado
- [ ] Implementación de cambios
- [ ] Verificación visual
