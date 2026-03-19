# Plan de Implementación - Vercel React Best Practices

Este documento presenta el plan detallado para implementar las prácticas adicionales del skill de Vercel.

---

## 📋 Resumen del Plan

| Fase | Práctica | Prioridad | Impacto | Esfuerzo |
|------|----------|-----------|---------|----------|
| 1 | async-parallel (Promise.all) | CRITICAL | Alto | Bajo |
| 2 | startTransition | MEDIUM | Medio | Bajo |
| 3 | useDeferredValue | MEDIUM | Medio | Medio |
| 4 | Suspense Boundaries | CRITICAL | Alto | Medio |
| 5 | bundle-preload | CRITICAL | Medio | Bajo |
| 6 | Optimizaciones JS adicionales | LOW | Bajo | Bajo |

---

## 🎯 FASE 1: Eliminating Waterfalls - async-parallel

### Objetivo
Reemplazar fetch secuenciales con `Promise.all()` para reducir tiempo de carga.

### Áreas a Modificar

#### 1.1 CRM Page (`src/app/(dashboard)/dashboard/crm/page.tsx`)

**Actual:**
```typescript
const empresas = useEmpresas()
const contactos = useContactos()
const documentos = useDocumentos()
const proyectos = useProyectos()
const tickets = useTickets()
```

**Mejora:**
```typescript
import { useEffect, useState } from 'react'

export default function CRMPage() {
  const [data, setData] = useState({
    empresas: [],
    contactos: [],
    documentos: [],
    proyectos: [],
    tickets: []
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadAll() {
      const [
        empresas,
        contactos, 
        documentos,
        proyectos,
        tickets
      ] = await Promise.all([
        fetchEmpresas(),
        fetchContactos(),
        fetchDocumentos(),
        fetchProyectos(),
        fetchTickets()
      ])
      setData({ empresas, contactos, documentos, proyectos, tickets })
      setIsLoading(false)
    }
    loadAll()
  }, [])

  if (isLoading) return <Skeleton />
  // ...
}
```

### Tareas:
- [ ] `F1.1` - Modificar CRM page para usar Promise.all
- [ ] `F1.2` - Modificar Proyectos page
- [ ] `F1.3` - Modificar Dashboard page
- [ ] `F1.4` - Modificar Soporte page

---

## 🎯 FASE 2: startTransition

### Objetivo
Mantener la UI responsive durante actualizaciones costosas.

### Áreas a Modificar

#### 2.1 Búsquedas y Filtros

**Actual:**
```typescript
function handleSearch(query: string) {
  setSearchQuery(query)
  const filtered = expensiveFilter(data, query)
  setFilteredData(filtered)
}
```

**Mejora:**
```typescript
import { startTransition } from 'react'

function handleSearch(query: string) {
  setSearchQuery(query)
  startTransition(() => {
    const filtered = expensiveFilter(data, query)
    setFilteredData(filtered)
  })
}
```

### Tareas:
- [ ] `F2.1` - Agregar startTransition en filtros de CRM
- [ ] `F2.2` - Agregar startTransition en filtros de Proyectos
- [ ] `F2.3` - Agregar startTransition en filtros de Tareas

---

## 🎯 FASE 3: useDeferredValue

### Objetivo
Diferir renders costosos manteniendo el input responsive.

### Áreas a Modificar

#### 3.1 Listas Grandes

**Actual:**
```typescript
function ListaResultados({ query }: { query: string }) {
  const results = expensiveFilter(data, query)
  return <ul>{results.map(r => <li key={r.id}>{r.name}</li>)}</ul>
}
```

**Mejora:**
```typescript
import { useDeferredValue } from 'react'

function ListaResultados({ query }: { query: string }) {
  const deferredQuery = useDeferredValue(query)
  const results = expensiveFilter(data, deferredQuery)
  const isStale = query !== deferredQuery
  
  return (
    <ul style={{ opacity: isStale ? 0.7 : 1 }}>
      {results.map(r => <li key={r.id}>{r.name}</li>)}
    </ul>
  )
}
```

### Tareas:
- [ ] `F3.1` - Implementar useDeferredValue en búsqueda de empresas
- [ ] `F3.2` - Implementar useDeferredValue en búsqueda de proyectos
- [ ] `F3.3` - Implementar useDeferredValue en listado de tickets

---

## 🎯 FASE 4: Suspense Boundaries

### Objetivo
Carga incremental de componentes pesados.

### Áreas a Modificar

#### 4.1 Dashboard Principal

**Actual:**
```typescript
export default function DashboardPage() {
  return (
    <div>
      <Stats />
      <ProyectosList />
      <TareasList />
      <TicketsList />
    </div>
  )
}
```

**Mejora:**
```typescript
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardPage() {
  return (
    <div>
      <Suspense fallback={<StatsSkeleton />}>
        <Stats />
      </Suspense>
      
      <Suspense fallback={<ProyectosSkeleton />}>
        <ProyectosList />
      </Suspense>
      
      <Suspense fallback={<TareasSkeleton />}>
        <TareasList />
      </Suspense>
      
      <Suspense fallback={<TicketsSkeleton />}>
        <TicketsList />
      </Suspense>
    </div>
  )
}
```

### Tareas:
- [ ] `F4.1` - Agregar Suspense al Dashboard
- [ ] `F4.2` - Agregar Suspense a CRM page
- [ ] `F4.3` - Agregar Suspense a Proyectos page
- [ ] `F4.4` - Crear componentes Skeleton necesarios

---

## 🎯 FASE 5: bundle-preload

### Objetivo
Precargar componentes antes de que el usuario haga click.

### Áreas a Modificar

#### 5.1 Modales

**Mejora:**
```typescript
import dynamic from 'next/dynamic'

const CreateEmpresaModal = dynamic(
  () => import('@/components/module/CreateEmpresaModal'),
  { ssr: false }
)

// En el componente padre:
<Button
  onMouseEnter={() => CreateEmpresaModal.preload()}
  onClick={() => setOpen(true)}
>
  Nueva Empresa
</Button>
```

### Tareas:
- [ ] `F5.1` - Agregar preload a botones de modales en CRM
- [ ] `F5.2` - Agregar preload a botones de modales en Proyectos

---

## 🎯 FASE 6: Optimizaciones JS Adicionales

### 6.1 js-hoist-regexp: Regex fuera de loops

**Actual:**
```typescript
empresas.forEach(emp => {
  const match = emp.email.match(/@(\w+)\./)
  // ...
})
```

**Mejora:**
```typescript
const domainRegex = /@(\w+)\./
empresas.forEach(emp => {
  const match = emp.email.match(domainRegex)
  // ...
})
```

### 6.2 js-combine-iterations: Un solo loop

**Actual:**
```typescript
const activos = empresas.filter(e => e.activo)
const nombres = activos.map(e => e.nombre)
```

**Mejora:**
```typescript
const nombres = empresas
  .filter(e => e.activo)
  .map(e => e.nombre)
```

### Tareas:
- [ ] `F6.1` - Buscar y mover regex fuera de loops
- [ ] `F6.2` - Combinar filter/map en una iteración

---

## 📊 Roadmap de Implementación

### Sprint 1 (3 días)
- [ ] F1.1 - Promise.all en CRM
- [ ] F1.2 - Promise.all en Proyectos

### Sprint 2 (2 días)
- [ ] F2.1 - startTransition en filtros
- [ ] F2.2 - startTransition en búsquedas

### Sprint 3 (3 días)
- [ ] F3.1 - useDeferredValue en listas
- [ ] F3.2 - useDeferredValue en búsquedas

### Sprint 4 (3 días)
- [ ] F4.1 - Suspense en Dashboard
- [ ] F4.2 - Suspense en páginas principales
- [ ] F4.4 - Skeletons

### Sprint 5 (1 día)
- [ ] F5.1 - preload en modales
- [ ] F6.1 - Optimizaciones JS menores

---

## ✅ Checklist de Seguimiento

- [ ] **FASE 1:** 
- [ ] **FASE 2:** 
- [ ] **FASE 3:** 
- [ ] **FASE 4:** 
- [ ] **FASE 5:** 
- [ ] **FASE 6:** 

---

## 📝 Notas

- Las Fases 1-3 tienen mayor impacto con esfuerzo moderado-bajo
- Suspense boundaries requieren React 18+ (ya disponible en Next.js 14)
- Usar los skeletons existentes en `src/components/ui/skeleton.tsx`
- Preferir `Promise.all()` sobre `Promise.allSettled()` para datos críticos
