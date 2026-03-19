# 📋 Plan de Optimización - NetOps CRM

## 📅 Fecha: 18/03/2026
## 🎯 Objetivo: Eliminar 57 problemas identificados, mejorar mantenibilidad y performance

---

## 📊 Resumen del Estado Actual

| Severidad | Cantidad | Estado |
|-----------|----------|--------|
| 🔴 Críticos | 3 | ❌ Requieren acción inmediata |
| 🟠 Altos | 12 | ⚠️ Requieren atención esta semana |
| 🟡 Medios | 24 | 📝 Requieren atención proxima semana |
| 🟢 Bajos | 18 | ✅ Limpieza gradual |

---

## 🔄 Fases de Ejecución

---

### FASE 1: Correcciones Críticas ⚡
**Tiempo estimado:** 30 minutos
**Archivos afectados:** 2

#### 1.1 Mover credenciales demo a variables de entorno
```
Archivo: src/contexts/auth-context.tsx
Problema: BOOTSTRAP_USER con email hardcodeado (línea 21-30)

Cambios:
1. Crear archivo .env.local.example con:
   NEXT_PUBLIC_DEMO_EMAIL=admin@apex.com
   NEXT_PUBLIC_DEMO_PASSWORD=admin123
   
2. Modificar auth-context.tsx:
   - Eliminar BOOTSTRAP_USER del código
   - Usar process.env.NEXT_PUBLIC_DEMO_EMAIL
   - Usar process.env.NEXT_PUBLIC_DEMO_PASSWORD

Resultado esperado:
- Credenciales no visibles en código
- Fácil configuración por ambiente
```

#### 1.2 Mover imports al inicio del archivo
```
Archivo: src/lib/storage-utils.ts
Problema: Import statement en línea 392 (al final del archivo)

Cambios:
1. Mover línea 392 → arriba del archivo después de 'use client'
2. Imports deben estar lógicamente agrupados:
   - React hooks
   - Dependencias externas (@/constants/*)
```

#### 1.3 Eliminar 'use client' incorrecto
```
Archivo: src/constants/storage-config.ts
Problema: Tiene 'use client' pero solo exporta constantes

Cambios:
1. Eliminar 'use client' de storage-config.ts
2. storage-utils.ts ya tiene 'use client' para hooks
```

---

### FASE 2: Hooks de Utilidad 🪝
**Tiempo estimado:** 1 hora
**Archivos nuevos:** 3

#### 2.1 Crear `useDebounce.ts`
```typescript
// src/hooks/useDebounce.ts
// Uso: reemplaza todos los setTimeout sin cleanup

Ejemplos de reemplazo:
- configuracion/page.tsx: 6+ setTimeout
- SettingsIntegraciones.tsx: 1 setTimeout
- SettingsEmpresa.tsx: 1 setTimeout
```

#### 2.2 Crear `useAsync.ts`
```typescript
// src/hooks/useAsync.ts
// Uso: envuelve operaciones async con estado y error

Patrón actual (problemático):
  await new Promise(resolve => setTimeout(resolve, 1000))
  
Patrón nuevo:
  const { execute, isLoading, error } = useAsync(async () => {
    await delay(1000)
  })
```

#### 2.3 Crear `useSafeCallback.ts`
```typescript
// src/hooks/useSafeCallback.ts
// Uso: evita actualizaciones de estado en componentes desmontados

Patrón actual:
  useEffect(() => {
    async function fetch() { ... }
    fetch()
  }, [])

Patrón nuevo:
  const safeCallback = useSafeCallback()
  useEffect(() => {
    safeCallback(async () => { ... })
  }, [])
```

#### 2.4 Actualizar `hooks/index.ts`
```typescript
// Agregar exports:
export { useDebounce } from './useDebounce'
export { useAsync } from './useAsync'
export { useSafeCallback } from './useSafeCallback'
```

---

### FASE 3: Sistema de Tipado 📝
**Tiempo estimado:** 2 horas
**Archivos afectados:** 8

#### 3.1 Eliminar `as any` - BaseForm
```
Archivo: src/components/base/BaseForm.tsx

Problemas en líneas 378, 396:
- value: any
- errors: ... as any

Solución: Crear interfaces específicas:
```typescript
interface FormFieldChange {
  name: string
  value: unknown
}

interface FormErrors {
  [key: string]: string | undefined
}
```

#### 3.2 Eliminar `as any` - CreateEmpresaModal
```
Archivo: src/components/module/CreateEmpresaModal.tsx

Problemas en líneas 269, 278, 290, 299, 421:
- SelectWithAdd callbacks con type assertions

Solución: Definir tipos para callbacks:
```typescript
type SelectOption = { value: string; label: string }
type OptionSelectCallback = (option: SelectOption | null) => void
```

#### 3.3 Eliminar `as any` - Portal
```
Archivo: src/app/portal/page.tsx (línea 164)

Solución: Crear tipo TicketInput
```

#### 3.4 Crear archivo de tipos compartidos
```
Archivo: src/types/common.ts (nuevo)

Exportar:
- EntityId: string | number
- Timestamps: { creado_en: string; actualizado_en?: string }
- OptionalFields: Partial<Timestamps>
```

---

### FASE 4: Manejo de Errores 🛡️
**Tiempo estimado:** 2 horas
**Archivos afectados:** 12

#### 4.1 Patrón de error consistente
```typescript
// Todo archivo async debe seguir este patrón:

async function fetchData() {
  try {
    // operación async
  } catch (error) {
    console.error('[ModuleName] Error fetching data:', error)
    // Mostrar toast/notification al usuario
    // Retornar fallback o null
  }
}
```

#### 4.2 Archivos a corregir

| Archivo | Errores a agregar |
|---------|-------------------|
| `usuarios/page.tsx` | 1 try/catch en línea 130 |
| `crm/page.tsx` | 3 try/catch (líneas 233, 359, 388) |
| `proyectos/page.tsx` | 1 try/catch (línea 453) |
| `configuracion/page.tsx` | 5+ try/catch |
| `auth-context.tsx` | 1 try/catch (línea 53) |
| `portal/page.tsx` | Múltiples en handlers |

---

### FASE 5: Consolidación de Constantes 🔧
**Tiempo estimado:** 1.5 horas
**Archivos:** 4

#### 5.1 Unificar sistema de colores
```
Problema: src/constants/colors.ts Y src/lib/colors.ts tienen duplicados

Solución:
1. Mantener src/lib/colors.ts (ya tiene más definiciones)
2. Crear src/constants/colors.ts que re-exporta desde lib
3. Actualizar imports en todo el proyecto

O mejor (si lib es más completo):
1. Mover todo a src/lib/colors.ts
2. Crear barrel export en src/constants/colors.ts
3. Eliminar duplicados
```

#### 5.2 Unificar storage utils
```
Problema: Lógica duplicada entre:
- src/lib/storage-utils.ts
- src/constants/storage-config.ts

Solución:
1. Mantener storage-config.ts como archivo de constantes puro
2. Mover lógica de mapeo a storage-utils.ts
3. Eliminar duplicación
```

#### 5.3 Magic numbers → constantes
```typescript
// En crm/page.tsx (línea 441)
const DIAS_INACTIVIDAD = 60

// En compras/page.tsx (línea 381)
const ORDEN_COMPRA_PREFIX = 'OC-2026-'

// En storage-utils.ts (línea 157)
const MAX_LOCAL_STORAGE_SIZE = 5 * 1024 * 1024 // 5MB
```

---

### FASE 6: Performance ⚡
**Tiempo estimado:** 2 horas
**Archivos:** 4

#### 6.1 Memoización en CRM Page
```
Archivo: src/app/(dashboard)/dashboard/crm/page.tsx

Problemas:
- Líneas 181-199: Filtrado en cada render
- Líneas 201-209: Getters sin memoización

Solución:
```typescript
const filteredContactos = useMemo(() => {
  return contactos.filter(c => {
    if (searchTerm && !c.nombre.includes(searchTerm)) return false
    if (filtroTipo && c.tipo !== filtroTipo) return false
    return true
  })
}, [contactos, searchTerm, filtroTipo])

const contactStats = useMemo(() => getContactStats(filteredContactos), [filteredContactos])
```

#### 6.2 Reducir estados locales
```
Archivo: src/app/(dashboard)/dashboard/crm/page.tsx
Problema: 12+ estados locales en un componente

Solución: Extraer a hooks o context:
- Estado de búsqueda → useSearch
- Estado de filtros → useFilters
- Estado de paginación → usePagination
```

#### 6.3 useEffect dependencies
```
Archivo: src/components/base/BaseForm.tsx (línea 375)

Problema: useEffect con dependencia values pero no defaultValues

Solución:
useEffect(() => {
  setValues(defaultValues)
}, [defaultValues, resetKey])
```

---

### FASE 7: Limpieza y Estructura 🧹
**Tiempo estimado:** 1 hora
**Archivos:** 15

#### 7.1 Imports inconsistentes
```typescript
// PROBLEMA: Imports default en algunos lugares
import RoleBadge from '@/components/ui/role-badge'

// SOLUCIÓN: Usar siempre named imports
import { RoleBadge } from '@/components/ui/role-badge'

// Archivos a corregir:
- usuarios/page.tsx
- FolderSection.tsx
- CreateEmpresaModal.tsx
```

#### 7.2 React.useState vs useState
```typescript
// PROBLEMA: Mezcla de estilos
import React, { useState } from 'react'
const [state, setState] = useState() // ✅
React.useState() // ❌

// SOLUCIÓN: Estandarizar a:
import { useState } from 'react'
const [state, setState] = useState()

// Archivos a corregir:
- date-picker.tsx
- date-range-picker.tsx
- BaseCard.tsx
- BaseForm.tsx
```

#### 7.3 Extensiones incorrectas
```typescript
// PROBLEMA: Archivo con extensión .tsx sin JSX
src/types/archivos.tsx

// SOLUCIÓN: Renombrar a .ts
src/types/archivos.ts → .ts
```

#### 7.4 Limpiar comentarios
```typescript
// Buscar y eliminar comentarios deprecados:
- // TODO: esto ya debería estar hecho
- // FIXME: esto no funciona
- // HACK: solución temporal
- Código comentado por más de 30 días
```

---

## ✅ Validación Final

### 8.1 Ejecutar build
```bash
cd netops-crm
npm run build
```

### 8.2 Ejecutar lint
```bash
npm run lint
```

### 8.3 Checklist de verificación
```
□ No hay credenciales hardcodeadas
□ No hay imports al final de archivos
□ No hay 'as any' en el código
□ No hay setTimeout sin cleanup
□ No hay promesas sin try/catch
□ No hay magic numbers hardcodeados
□ No hay código duplicado identificado
□ Build completa sin errores
□ Lint pasa sin warnings (o con errores mínimos)
```

---

## 📅 Cronograma Sugerido

| Día | Fase | Entregable |
|-----|------|------------|
| Día 1 | FASE 1 | Credenciales en env, imports corregidos |
| Día 2 | FASE 2 | 3 hooks nuevos creados y documentados |
| Día 3-4 | FASE 3 | Sistema de tipado unificado |
| Día 5-6 | FASE 4 | Manejo de errores consistente |
| Día 7 | FASE 5 | Constantes consolidadas |
| Día 8-9 | FASE 6 | Optimizaciones de performance |
| Día 10 | FASE 7 | Limpieza final |
| Día 11 | FASE 8 | Build + Lint + PR |

---

## 📈 Métricas de Éxito

| Métrica | Antes | Objetivo |
|---------|-------|----------|
| Uso de `any` | 8+ | 0 |
| setTimeout sin cleanup | 10+ | 0 |
| Promesas sin try/catch | 8+ | 0 |
| Magic numbers | 5+ | 0 |
| Warnings de lint | ? | < 5 |
| Errores de build | ? | 0 |

---

## 🚀 Comandos de Verificación

```bash
# Buscar uso de 'any'
grep -r "as any" netops-crm/src --include="*.ts" --include="*.tsx"

# Buscar setTimeout
grep -r "setTimeout" netops-crm/src --include="*.ts" --include="*.tsx" | grep -v "cleanup\|useEffect"

# Buscar imports al final
grep -r "^import" netops-crm/src --include="*.ts" --include="*.tsx" | tail -20
```

---

*Documento generado: 18/03/2026*
*Total de tareas: 47*
*Tiempo total estimado: 12 horas*
