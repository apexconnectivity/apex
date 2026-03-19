# React Performance Optimization Plan - NetOps CRM

## Overview

Comprehensive optimization based on Vercel React Best Practices to fix 157+ inline function definitions causing unnecessary re-renders, plus additional performance improvements.

---

## Current State Analysis

| Metric | Count | Status |
|--------|-------|--------|
| Inline `onClick={() => ...}` | 157 | Needs optimization |
| Inline `onChange={() => ...}` | 2 | Minor |
| Existing `useCallback` usage | 43 | Good (mostly CRM page) |
| `React.memo` usage | 0 | **Missing** |
| Dynamic imports | 0 | **Missing** |
| Suspense boundaries | 0 | **Missing** |

---

## Phase 1: Extract Inline Handlers to useCallback

### Priority 1: Main Dashboard Pages

#### 1. `src/app/(dashboard)/dashboard/proyectos/page.tsx` (~35 handlers)
**Current:** Only ~5 useCallback, rest are inline
**Action:** Add ~30 useCallback handlers for:
- Modal open/close handlers
- Filter handlers
- Form state setters
- Click handlers for cards

**Pattern:**
```typescript
// BEFORE (creates new function on every render)
<Button onClick={() => setIsModalNuevo(true)}>

// AFTER (stable reference)
const handleOpenNuevo = useCallback(() => setIsModalNuevo(true), [])
<Button onClick={handleOpenNuevo}>
```

#### 2. `src/app/(dashboard)/dashboard/tareas/page.tsx` (~8 handlers)
**Current:** 0 useCallback
**Action:** Add handlers for:
- Task selection
- Status changes
- Modal toggles

#### 3. `src/app/(dashboard)/dashboard/soporte/page.tsx` (~5 handlers)
**Current:** 0 useCallback
**Action:** Add handlers for ticket/contract creation

#### 4. `src/app/(dashboard)/dashboard/compras/page.tsx` (~15 handlers)
**Current:** 0 useCallback
**Action:** Add handlers for:
- Order state changes
- Item management
- Status transitions

#### 5. `src/app/(dashboard)/dashboard/calendario/page.tsx` (~15 handlers)
**Current:** 0 useCallback
**Action:** Add handlers for:
- Meeting state changes
- Month navigation
- Assistant toggles

#### 6. `src/app/(dashboard)/dashboard/crm/page.tsx` (~15 handlers)
**Current:** ~40 useCallback (good coverage)
**Action:** Fill gaps for remaining inline handlers

#### 7. `src/app/(dashboard)/dashboard/page.tsx` (~15 handlers)
**Current:** 0 useCallback
**Action:** Add handlers for modal/dashboard state

#### 8. `src/app/(dashboard)/dashboard/archivados/page.tsx` (~5 handlers)
**Current:** 0 useCallback
**Action:** Add handlers for archive operations

#### 9. `src/app/(dashboard)/dashboard/usuarios/page.tsx` (~5 handlers)
**Current:** 0 useCallback
**Action:** Add handlers for user management

---

### Priority 2: Module Components

| File | Handlers | Type |
|------|----------|------|
| `CreateProjectModal.tsx` | 4 | Modal handlers |
| `CreateTaskModal.tsx` | 3 | Modal handlers |
| `CreateTicketModal.tsx` | 4 | Modal handlers |
| `CreateContractModal.tsx` | 2 | Modal handlers |
| `CreateUserModal.tsx` | 2 | Modal handlers |
| `EmpresaDetailModal.tsx` | 2 | Modal handlers |
| `ConfiguracionTab.tsx` | 8 | Settings toggles |
| `SettingsGeneral.tsx` | 3 | Settings handlers |
| `SettingsModulos.tsx` | 2 | Module toggles |
| `SettingsEmpresa.tsx` | 2 | Settings handlers |
| `ProyectoArchivadoCard.tsx` | 4 | Card actions |
| `ProjectDetailPanel.tsx` | 2 | Panel actions |
| `TicketDetailPanel.tsx` | 1 | Panel actions |
| `TaskDetailPanel.tsx` | 1 | Panel actions |

---

### Priority 3: UI Components

| File | Handlers | Type |
|------|----------|------|
| `date-picker.tsx` | 4 | Date selection |
| `date-range-picker.tsx` | 2 | Date range selection |
| `subtask-list.tsx` | 1 | Delete action |
| `ModuleSearch.tsx` | 1 | Clear search |
| `FolderSection.tsx` | 1 | Toggle folder |
| `ArchivoCard.tsx` | 1 | Copy link |

---

## Phase 2: Add React.memo to List Item Components

Memoize components that render in lists and receive handler props.

### Components to Memoize

```typescript
// src/app/(dashboard)/dashboard/tareas/page.tsx
const TaskCard = React.memo(({ tarea, onClick, onStatusChange }) => {
  // ...
})
```

| Component | Location | Props Passed |
|-----------|----------|--------------|
| `TaskCard` | `tareas/page.tsx` | onClick, onStatusChange |
| `ProjectCard` | `proyectos/page.tsx` | onClick |
| `EmpresaCard` | `crm/page.tsx` | onClick |
| `ItemCard` | `module/ItemCard.tsx` | onClick, onEdit, onDelete |
| `ModuleCard` | `module/ModuleCard.tsx` | onClick |
| `ArchivoCard` | `module/ArchivoCard.tsx` | onDelete, onPreview |
| `SortableTicketCard` | `soporte/page.tsx` | onClick |

---

## Phase 3: Add Dynamic Imports for Modals

Heavy modals should be loaded on-demand, not with the initial bundle.

### Implementation

```typescript
// In page files
import dynamic from 'next/dynamic'

const CreateProjectModal = dynamic(
  () => import('@/components/module/CreateProjectModal'),
  {
    loading: () => <div className="h-96 animate-pulse bg-muted rounded-lg" />,
    ssr: false
  }
)
```

### Modals to Dynamic Import

| Modal | Page | Bundle Size Savings |
|-------|------|---------------------|
| `CreateProjectModal` | proyectos, crm | ~50KB |
| `CreateTaskModal` | tareas | ~40KB |
| `CreateTicketModal` | soporte | ~45KB |
| `CreateEmpresaModal` | crm | ~35KB |
| `CreateContractModal` | soporte | ~40KB |
| `CreateUserModal` | usuarios | ~30KB |
| `EmpresaDetailModal` | crm | ~60KB |
| `DetalleArchivadoModal` | archivados | ~45KB |

**Estimated Total Savings:** ~300KB initial bundle

---

## Phase 4: Dashboard Layout Refactor (Higher Risk)

### Current Issue
`src/app/(dashboard)/layout.tsx` is entirely a client component due to localStorage access.

### Solution
Extract localStorage logic to a separate client component wrapper:

```typescript
// layout.tsx (Server Component)
import { DashboardProvider } from './DashboardProvider'

export default function DashboardLayout({ children }) {
  return (
    <DashboardProvider>
      {children}
    </DashboardProvider>
  )
}

// DashboardProvider.tsx (Client Component)
'use client'
export function DashboardProvider({ children }) {
  // localStorage logic here
  return <>{children}</>
}
```

### Benefits
- Better SSR/SEO
- Faster initial page load
- Smaller client bundle

---

## Implementation Order

```
1. crm/page.tsx          → Fill useCallback gaps (~15 handlers)
2. proyectos/page.tsx    → Add useCallback (~35 handlers)
3. tareas/page.tsx       → Add useCallback + memo (~8 handlers + TaskCard)
4. soporte/page.tsx     → Add useCallback + memo (~5 handlers)
5. compras/page.tsx     → Add useCallback (~15 handlers)
6. calendario/page.tsx  → Add useCallback (~15 handlers)
7. dashboard/page.tsx    → Add useCallback (~15 handlers)
8. archivados/page.tsx  → Add useCallback (~5 handlers)
9. usuarios/page.tsx    → Add useCallback (~5 handlers)
10. Module components    → Add useCallback (~50 handlers)
11. UI components        → Add useCallback (~10 handlers)
12. Add React.memo        → ~7 components
13. Dynamic imports       → ~8 modals
14. Dashboard layout      → Server component refactor
```

---

## Risk Assessment

| Phase | Risk | Mitigation |
|-------|------|------------|
| Phase 1 | Medium | PR per page, test thoroughly |
| Phase 2 | Low | Clear pattern, test list rendering |
| Phase 3 | Medium | Test SSR, loading states |
| Phase 4 | High | Verify auth flow, test all dashboard pages |

---

## Verification Steps

After each phase, verify:

1. **Run lint:** `npm run lint`
2. **Run build:** `npm run build`
3. **Test pages:** Navigate through all modified pages
4. **Check console:** No React key warnings
5. **Verify functionality:** All buttons, modals, forms work

---

## Files Summary

| Phase | Files Modified | Lines Changed |
|-------|----------------|---------------|
| Phase 1 | ~20 | ~600 |
| Phase 2 | ~7 | ~50 |
| Phase 3 | ~10 | ~100 |
| Phase 4 | ~2 | ~50 |

---

## Estimated Timeline

- Phase 1: 3-4 PRs (pages grouped by module)
- Phase 2: 1 PR
- Phase 3: 1 PR  
- Phase 4: 1 PR

**Total:** 5-7 PRs, approximately 800 lines changed
