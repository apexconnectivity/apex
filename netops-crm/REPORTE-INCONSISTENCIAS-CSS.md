# Reporte de Inconsistencias de Estilos CSS entre Módulos

## Módulo de Referencia: Proyectos

Este documento analiza exhaustivamente las inconsistencias de estilos CSS entre el módulo de Proyectos (referencia) y los demás módulos de la aplicación.

---

## 1. Contenedor Principal del Módulo

### ✅ PROYECTOS (Referencia)
```tsx
<div className="space-y-6 w-full overflow-x-hidden">
```

### Inconsistencias Encontradas:

| Módulo | Estilo Actual | Diferencia | Recomendación |
|--------|---------------|------------|---------------|
| **Dashboard** | `space-y-8 w-full overflow-x-hidden` | `space-y-8` vs `space-y-6` | Unificar a `space-y-6` |
| **CRM** | `space-y-6` | **FALTA** `overflow-x-hidden` | Agregar `overflow-x-hidden` |
| **Tareas** | No especifica overflow | **FALTA** `overflow-x-hidden` y `w-full` | Agregar `overflow-x-hidden w-full` |
| **Soporte** | No especifica | **FALTA** `space-y-6 w-full overflow-x-hidden` | Agregar contenedor completo |

---

## 2. Efectos Hover en Cards

### ✅ PROYECTOS (ModuleCard - Línea 23)
```tsx
className={cn(
  'bg-card border-border/50 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/10 hover:border-cyan-500/30',
  hover && 'hover:shadow-xl hover:shadow-black/5 hover:-translate-y-0.5',
  onClick && 'cursor-pointer',
  className
)}
```

### Inconsistencias Encontradas:

| Módulo | Componente | Estilo Actual | Diferencia |
|--------|------------|---------------|------------|
| **Tareas** | TaskCard (línea 65) | `hover:shadow-xl hover:shadow-black/5 transition-all duration-200 hover:-translate-y-0.5` | **FALTA** `hover:scale-[1.02]` y efectos cyan |
| **Soporte** | SortableTicketCard (línea 71) | `hover:shadow-xl hover:shadow-black/5 transition-all duration-200 hover:-translate-y-0.5 border-border/50` | **FALTA** efectos de escala y cyan |
| **Soporte** | TicketCard (línea 112) | `hover:shadow-xl hover:shadow-black/5 transition-all duration-200 hover:-translate-y-0.5 border-border/50` | **FALTA** efectos de escala y cyan |
| **CRM** | Card empresa (línea 475) | `hover:shadow-xl hover:shadow-black/5 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer` | **FALTA** efectos de escala y cyan |
| **Dashboard** | Cards stats (línea 30, 130, 141) | `hover:shadow-lg transition-all duration-200 border border-border/50 rounded-lg` | **FALTA** efectos completos, solo tiene hover básico |

### Recomendación:
Unificar todos los cards para usar los mismos efectos hover:
```tsx
// Estandarizar en ModuleCard
hover:scale-[1.02] hover:shadow-xl hover:shadow-black/5 hover:-translate-y-0.5 hover:shadow-cyan-500/10 hover:border-cyan-500/30
```

---

## 3. Animaciones de Entrada y Transiciones

### ✅ PROYECTOS
- Usa `transition-all duration-200` consistentemente
- Usa `duration-300` en Card base para transición de entrada

### Inconsistencias:

| Módulo | Componente | Observación |
|--------|-----------|-------------|
| **Todos** | Button | `transition-all duration-200` ✅ (consistente) |
| **Proyectos** | Card base | `transition-all duration-300` |
| **Tareas/Soporte/CRM** | Cards | `transition-all duration-200` |
| **Dashboard** | Cards | `transition-all duration-200` |

### Recomendación:
Unificar a `transition-all duration-200` para consistencia.

---

## 4. Spacing y Padding en Cards

### ✅ PROYECTOS (ModuleCard)
```tsx
<CardContent className={cn(noPadding ? 'p-0' : 'p-4')}>
```

### Inconsistencias:

| Módulo | Componente | Padding | Diferencia |
|--------|-----------|---------|------------|
| **Proyectos** | ModuleCard | `p-4` | Referencia |
| **Tareas** | TaskCard (línea 66) | `p-4 space-y-3` | Similar ✅ |
| **Soporte** | TicketCard (línea 113) | `p-4 space-y-2` | Similar ✅ |
| **CRM** | Card empresa (línea 476) | `p-6` | **Diferente** - más padding |
| **Dashboard** | Card stats | `p-6` | **Diferente** - más padding |

### Recomendación:
Unificar padding a `p-4` para cards de列表 y `p-6` para cards de estadísticas.

---

## 5. Tipografía

### ✅ PROYECTOS - Títulos de Cards
```tsx
<h4 className="font-semibold text-sm truncate">{title}</h4>
<p className="text-xs text-muted-foreground truncate">{subtitle}</p>
```

### Inconsistencias:

| Módulo | Elemento | Estilo | Diferencia |
|--------|----------|--------|------------|
| **CRM** | Título empresa (línea 484) | `font-semibold text-lg` | **Más grande** |
| **Tareas** | Título tarea (línea 69) | `font-semibold text-sm` | ✅ Igual |
| **Soporte** | Título ticket (línea 85, 119) | `font-semibold text-sm` | ✅ Igual |
| **CRM** | Subtítulo | `text-sm text-muted-foreground` | **Más grande** |

### Recomendación:
Mantener `text-sm` para títulos de items y `text-xs` para subtítulos (como en Proyectos).

---

## 6. Colores y Badges

### ✅ PROYECTOS - Usa StatusBadge component
```tsx
<StatusBadge status="Cerrado" />
<StatusBadge status={selected.estado === 'activo' ? 'Activo' : 'Cerrado'} />
```

### Inconsistencias:

| Módulo | Práctica | Diferencia |
|--------|----------|------------|
| **Tareas** | Usa `getCategoriaColor()` y `getPrioridadColor()` del types (línea 76-77) | **No usa** StatusBadge |
| **Soporte** | Usa `getCategoriaColor()`, `getPrioridadColor()`, `getEstadoColor()` | **No usa** StatusBadge |
| **CRM** | Define sus propios estilos inline (línea 118-126) | **No usa** StatusBadge |
| **Proyectos** | Usa StatusBadge component | ✅ Correcto |

### Recomendación:
Reemplazar todas las llamadas a funciones de color en Tareas, Soporte y CRM con el componente unificado `StatusBadge`.

---

## 7. Overflow Horizontal

### ✅ PROYECTOS
```tsx
<div className="space-y-6 w-full overflow-x-hidden">
```

### Inconsistencias:

| Módulo | overflow-x-hidden | Problema |
|--------|-------------------|----------|
| **Proyectos** | ✅ Presente | Ninguno |
| **Dashboard** | ✅ Presente | Ninguno |
| **CRM** | ❌ Faltante | Puede causar scroll horizontal |
| **Tareas** | ❌ Faltante | Puede causar scroll horizontal |
| **Soporte** | ❌ Faltante | Puede causar scroll horizontal |

### Recomendación:
Agregar `overflow-x-hidden` a todos los contenedores principales de módulo.

---

## 8. Bordes y Bordes de Tarjetas

### ✅ PROYECTOS (ModuleCard)
```tsx
border-border/50 // Borde sutil por defecto
hover:border-cyan-500/30 // Borde cyan al hover
```

### Inconsistencias:

| Módulo | Borde por defecto | Borde al hover |
|--------|-------------------|----------------|
| **Proyectos** | `border-border/50` | `hover:border-cyan-500/30` |
| **Tareas** | No especifica | No especifica |
| **Soporte** | `border-border/50` | No especifica |
| **CRM** | No especifica | No especifica |
| **Dashboard** | `border border-border/50 rounded-lg` | No especifica |

### Recomendación:
Unificar bordes usando `border-border/50` por defecto y `hover:border-cyan-500/30` al hover.

---

## 9. Inputs y Formularios

### ✅ Componente Input Base (Línea 14)
```tsx
className="flex h-10 w-full rounded-lg border-2 border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-all duration-200"
```

### Inconsistencias en Uso:

| Módulo | Input Usage | Observación |
|--------|-------------|-------------|
| **Proyectos** | Usa con `className` para errores | ✅ Correcto |
| **Tareas** | Usa `className="bg-background"` en SelectTrigger | ✅ Correcto |
| **Soporte** | Usa `className="bg-background"` | ✅ Correcto |
| **CRM** | Usa `className="pl-9 pr-8 bg-background/80 border-border/50"` | Tiene estilo adicional |

### Recomendación:
El componente Input está bien estandarizado. Mantener consistencia no agregando clases adicionales a menos que sea necesario.

---

## 10. Gradientes y Efectos Especiales

### ✅ PROYECTOS
- No usa gradientes en cards básicos
- Usa gradientes solo en ProgressBar: `bg-gradient-to-r from-cyan-500 to-blue-500`

### Inconsistencias:

| Módulo | Uso de Gradientes | Observación |
|--------|-------------------|-------------|
| **Proyectos** | Solo en progress bar | ✅ Correcto |
| **Dashboard** | Usa gradientes en cards (línea 30: `bg-gradient-to-br from-cyan-500/20 to-blue-500/20`) | Diferente |
| **CRM** | No usa | ✅ |
| **Tareas** | No usa | ✅ |
| **Soporte** | No usa | ✅ |

---

## Resumen de Acciones Recomendadas

### Prioridad ALTA:

1. **Agregar `overflow-x-hidden`** a contenedores de:
   - CRM
   - Tareas
   - Soporte

2. **Unificar efectos hover** en todos los cards:
   ```tsx
   // Estandarizar
   hover:scale-[1.02] hover:shadow-xl hover:shadow-black/5 hover:-translate-y-0.5
   ```

3. **Reemplazar funciones de color** con StatusBadge en:
   - Tareas
   - Soporte
   - CRM

### Prioridad MEDIA:

4. **Unificar spacing**:
   - Contenedores: `space-y-6`
   - Padding cards: `p-4` para items, `p-6` para stats

5. **Unificar tipografía**:
   - Títulos: `font-semibold text-sm`
   - Subtítulos: `text-xs text-muted-foreground`

6. **Unificar bordes**:
   - Default: `border-border/50`
   - Hover: `hover:border-cyan-500/30`

### Prioridad BAJA:

7. **Unificar duración de transiciones**: `duration-200`
8. **Eliminar gradientes decorativos** en Dashboard (opcional)

---

## Conclusión

El módulo de **Proyectos** tiene la implementación más completa y consistente de estilos. Las principales inconsistencias se encuentran en:

1. Overflow horizontal (faltante en CRM, Tareas, Soporte)
2. Efectos hover (incompletos en la mayoría de módulos)
3. Uso de StatusBadge (no se utiliza en Tareas, Soporte, CRM)

Se recomienda realizar las correcciones en orden de prioridad para mantener una experiencia de usuario consistente en toda la aplicación.
