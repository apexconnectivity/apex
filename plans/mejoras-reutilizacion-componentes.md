# Plan de Mejoras de Reutilización de Componentes

## Análisis del Estado Actual

El proyecto ya cuenta con una buena arquitectura base:
- **Base Components**: BaseModal, BaseCard, BasePanel, BaseForm, BaseSidePanel
- **Patrón consistente**: Los DetailPanels ya usan BaseSidePanel
- **Constantes centralizadas**: colors.ts, common_text.ts

## Oportunidades de Mejora Identificadas

### 1. Consolidar Componentes de Badge
**Problema**: Existen múltiples componentes de badge con funcionalidad similar
- `badge.tsx` (UI)
- `role-badge.tsx` (UI)
- `StatusBadge.tsx` (Module)

**Solución**: Crear un sistema de badges unificado con variantes configurables

### 2. Extraer Componente de Comments/Actividad
**Problema**: Cada DetailPanel implementa su propia lógica de comentarios
- TaskDetailPanel: tiene comentarios
- TicketDetailPanel: tiene comentarios

**Solución**: Crear `ActivityFeed` o `CommentsList` reutilizable

### 3. Crear Hooks Personalizados para Datos
**Problema**: Lógica de negocio duplicada en pages

**Solución**: Crear hooks como:
- `useEntityDetail(entityType, id)` 
- `useEntityActions(entityType)`

### 4. Componente de Timeline/Historial Reutilizable
**Problema**: ProjectDetailPanel tiene lógica de historial que podría reutilizarse

**Solución**: Crear `Timeline` o `HistoryFeed` component

### 5. Unificar SelectWithAdd con otros patrones de select
**Problema**: SelectWithAdd es muy específico

**Solución**: Generalizar a `CreatableSelect` o `AsyncSelect`

---

## Propuesta de Implementación (Priorizada)

| # | Mejora | Prioridad | Complejidad |
|---|--------|----------|-------------|
| 1 | Sistema unificado de Badges | Alta | Baja |
| 2 | Componente ActivityFeed | Alta | Media |
| 3 | Timeline component | Media | Media |
| 4 | Hooks de datos | Media | Alta |

---

## Próximos Pasos

1. **Confirmar** qué mejoras son de mayor prioridad
2. **Seleccionar** la primera mejora a implementar
3. **Ejecutar** en modo Code
