# Plan de Mejoras - NetOps CRM

## 📋 Resumen del Plan

Este documento presenta un plan de acción estructurado para implementar las mejoras identificadas en el análisis de código.

---

## 🎯 FASE 1: Fundamentos (Semana 1)

### 1.1 Sistema de Logging

| Tarea | Descripción | Archivo(s) | Prioridad |
|-------|-------------|------------|-----------|
| `F1.1.1` | Crear módulo de logging estructurado | `src/lib/logger.ts` | Alta |
| `F1.1.2` | Reemplazar console.log/error por logger | Todo el proyecto | Alta |
| `F1.1.3` | Agregar niveles de log configurables | `src/lib/logger.ts` | Media |

```typescript
// src/lib/logger.ts
export const logger = {
  info: (module: string, message: string, data?: unknown) => 
    console.log(`[${new Date().toISOString()}] [${module}] INFO: ${message}`, data),
  
  error: (module: string, message: string, error?: unknown) => 
    console.error(`[${new Date().toISOString()}] [${module}] ERROR: ${message}`, error),
  
  warn: (module: string, message: string) => 
    console.warn(`[${new Date().toISOString()}] [${module}] WARN: ${message}`),
  
  debug: (module: string, message: string, data?: unknown) => 
    process.env.NODE_ENV === 'development' && console.log(`[${module}] DEBUG: ${message}`, data),
}
```

### 1.2 Validación de Esquemas (Zod)

| Tarea | Descripción | Archivo(s) | Prioridad |
|-------|-------------|------------|-----------|
| `F1.2.1` | Instalar Zod | `package.json` | Alta |
| `F1.2.2` | Crear esquemas base | `src/lib/schemas/index.ts` | Alta |
| `F1.2.3` | Agregar validación a hooks de storage | `src/hooks/*.ts` | Alta |
| `F1.2.4` | Validar datos al cargar localStorage | `src/lib/useLocalStorage.ts` | Alta |

---

## 🎯 FASE 2: Performance (Semana 2)

### 2.1 Memoización

| Tarea | Descripción | Archivo(s) | Prioridad |
|-------|-------------|------------|-----------|
| `F2.1.1` | Agregar useMemo en páginas principales | `src/app/(dashboard)/**/page.tsx` | Alta |
| `F2.1.2` | Agregar useCallback en handlers | Componentes modal | Alta |
| `F2.1.3` | Memoizar filtros y búsquedas | `src/app/(dashboard)/dashboard/crm/page.tsx` | Alta |

### 2.2 Lazy Loading

| Tarea | Descripción | Archivo(s) | Prioridad |
|-------|-------------|------------|-----------|
| `F2.2.1` | Implementar dynamic imports | `src/components/module/Create*Modal.tsx` | Media |
| `F2.2.2` | Agregar skeletons de carga | `src/components/ui/skeleton.tsx` | Media |
| `F2.2.3` | Configurar next/dynamic | `src/app/layout.tsx` | Media |

```typescript
// Ejemplo de lazy loading
const CreateEmpresaModal = dynamic(
  () => import('@/components/module/CreateEmpresaModal'),
  { 
    loading: () => <DialogSkeleton />,
    ssr: false 
  }
)
```

---

## 🎯 FASE 3: Arquitectura (Semana 3)

### 3.1 Extraer Sub-Componentes

| Tarea | Descripción | Nuevo Archivo | Prioridad |
|-------|-------------|---------------|-----------|
| `F3.1.1` | Extraer campos de empresa | `CreateEmpresaForm.tsx` | Media |
| `F3.1.2` | Extraer sección facturación | `FacturacionFields.tsx` | Media |
| `F3.1.3` | Crear hook de formulario | `useEmpresaForm.ts` | Media |

### 3.2 Estandarizar Nomenclatura

| Tarea | Descripción | Archivo(s) | Prioridad |
|-------|-------------|------------|-----------|
| `F3.2.1` | Crear guía de convenciones | `docs/CONVENTIONS.md` | Baja |
| `F3.2.2` | Renombrar inconsistencias | Todo el proyecto | Baja |

### 3.3 Estados de Carga Estandarizados

| Tarea | Descripción | Archivo(s) | Prioridad |
|-------|-------------|------------|-----------|
| `F3.3.1` | Crear tipo AsyncStatus | `src/types/async.ts` | Media |
| `F3.3.2` | Actualizar useAsync | `src/hooks/useAsync.ts` | Media |
| `F3.3.3` | Aplicar en componentes | Todo el proyecto | Media |

---

## 🎯 FASE 4: Calidad (Semana 4)

### 4.1 Tests Unitarios

| Tarea | Descripción | Archivo(s) | Prioridad |
|-------|-------------|------------|-----------|
| `F4.1.1` | Configurar Vitest | `vitest.config.ts` | Alta |
| `F4.1.2` | Agregar Testing Library | `package.json` | Alta |
| `F4.1.3` | Tests de validación | `src/lib/validation-utils.test.ts` | Alta |
| `F4.1.4` | Tests de hooks | `src/hooks/*.test.ts` | Media |
| `F4.1.5` | Tests de componentes UI | `src/components/ui/*.test.tsx` | Media |

### 4.2 Accesibilidad

| Tarea | Descripción | Archivo(s) | Prioridad |
|-------|-------------|------------|-----------|
| `F4.2.1` | Agregar aria-labels faltantes | Componentes | Media |
| `F4.2.2` | Agregar keyboard navigation | `src/components/base/BaseModal.tsx` | Media |
| `F4.2.3` | Validar con axe-core | `src/app/layout.tsx` | Baja |

---

## 🎯 FASE 5: Estabilidad (Semana 5)

### 5.1 Memory Leaks

| Tarea | Descripción | Archivo(s) | Prioridad |
|-------|-------------|------------|-----------|
| `F5.1.1` | Agregar cleanup a useEffect | Todo el proyecto | Alta |
| `F5.1.2` | Verificar event listeners | `src/components/module/*.tsx` | Alta |
| `F5.1.3` | Implementar AbortController | `src/hooks/useAsync.ts` | Media |

---

## 📊 Matriz de Prioridades

```
              | Impacto Alto | Impacto Medio | Impacto Bajo |
--------------|--------------|---------------|---------------|
Esfuerzo Bajo | F1.1, F1.2   | F2.1.2        | F3.2          |
Esfuerzo Medio | F2.1.1       | F2.2, F3.1    | F4.2          |
Esfuerzo Alto | F4.1         | F5.1          |               |
```

---

## 🚀 Roadmap de Implementación

### Sprint 1 (Fundamentos)
- [ ] F1.1 Sistema de logging
- [ ] F1.2 Validación Zod
- [ ] F4.1.1 Configurar Vitest

### Sprint 2 (Performance)
- [ ] F2.1.1 Memoización en CRM
- [ ] F2.1.2 useCallback en modales
- [ ] F2.2 Lazy loading

### Sprint 3 (Arquitectura)
- [ ] F3.1 Extraer sub-componentes
- [ ] F3.3 Estados estandarizados

### Sprint 4 (Calidad)
- [ ] F4.1 Tests unitarios
- [ ] F4.2 Accesibilidad

### Sprint 5 (Estabilidad)
- [ ] F5.1 Memory leaks

---

## 📝 Notas

1. **Dependencies:** Este plan asume que el proyecto ya tiene configurado npm/yarn
2. **Testing:** Vitest es preferido sobre Jest por compatibilidad con Vite
3. **Zod:** Seleccionado por mejor integración con TypeScript
4. **Lazy Loading:** Solo aplicar en modales mayores a 300 líneas

---

## ✅ Checklist de Completado

Para marcar una tarea como completada, actualizar el estado en este documento:

- [ ] **FASE 1:** 
- [ ] **FASE 2:** 
- [ ] **FASE 3:** 
- [ ] **FASE 4:** 
- [ ] **FASE 5:** 
