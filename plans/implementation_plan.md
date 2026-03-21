# Módulo 4: Tareas - Plan de Implementación

Este documento detalla los pasos para reemplazar e implementar el módulo de tareas en el CRM basándose en `MÓDULO 4 - TAREAS (VERSIÓN ACTUALIZADA COMPLETA).md`.

## User Review Required

> [!CAUTION]
> **Migración de Datos Existentes**: Las tareas actuales deberán migrarse al nuevo esquema en `localStorage`. Se debe confirmar si las tareas existentes adoptan una categoría "General" por defecto y a qué fase se asignan si no lo tenían especificado.
> **Preparación para Supabase**: Aunque se use `localStorage`, la estructura de datos y los hooks deben usar llamadas asíncronas e interfaces TypeScript idénticas a las que generaría Supabase.

## Proposed Changes

### 1. Capa de Servicios (LocalStorage) y Tipos

Dado que actualmente se usa `localStorage`, se creará una capa de acceso a datos (`src/services/taskService.ts` o similar) que emule llamadas asíncronas para facilitar la futura transición a Supabase.

#### [NEW] `src/services/taskService.ts`
- Implementar funciones asíncronas (`getTasks`, `createTask`, `updateTask`, `deleteTask`) que guarden/lean los datos de `localStorage`.
- Estructurar el almacenamiento simulando tablas relacionales (separar tareas, subtareas, comentarios en arrays distintos).

#### [MODIFY] `src/types/database.ts` (o archivo central de tipos)
Se actualizarán los interfaces de TypeScript para reflejar la base de datos:
- `Tarea`: añadir `categoria` (Comercial, Técnica, Compras, Administrativa, General), `fase_origen`, `asignado_a_cliente` (boolean), `contacto_cliente_id` (UUID), `dependencias` (JSONB), `es_plantilla`.
- Nuevos tipos: `Subtarea`, `ComentarioTarea`, `TareaRecurrente`.

### 2. Actualización de Componentes de UI

#### [MODIFY] `src/components/module/CreateTaskModal.tsx`
Se rediseñará el formulario de creación:
- **Radio groups / Selects** para categoría de tarea (`Técnica`, `Comercial`, etc.).
- **Toggle/Switch**: "Interno" vs "Cliente". Si es cliente, mostrar combo de contactos disponibles en el proyecto.
- **Sección Dependencias**: UI para seleccionar otra tarea existente y definir si es Bloqueante, Inicio-después o Fin-después.

#### [MODIFY] `src/components/module/TaskDetailPanel.tsx`
- Reflejar visualmente la categoría mediante *Badges* de colores.
- Renderizar la sección de comentarios utilizando el nuevo modelo `ComentarioTarea`.
- Mostrar subtareas integradas utilizando [subtask-list.tsx](file:///X:/Documents/Apex/netops-crm/src/components/ui/subtask-list.tsx).

#### [MODIFY] `src/components/ui/subtask-list.tsx`
- Adaptarlo para integrarse correctamente a la estructura de la base de datos `subtareas`, permitiendo marcar completadas y ordenarlas.

### 3. Vistas y Dashboards

#### [NEW] `src/app/dashboard/tasks/page.tsx` (Dashboard de Tareas por Rol)
- Panel centralizado donde un usuario puede visualizar tareas filtradas por su rol (Técnico, Comercial, Compras).
- Contendrá divisiones visuales ("Vencen Hoy", "Próximos 7 días").

#### [MODIFY] `src/app/projects/[id]/tasks/page.tsx` (o tab similar)
- Vista de tareas dentro de un proyecto, agrupadas por fase (1 a 5).
- Soporte para expandir/colapsar fases anteriores y filtros avanzados.

#### [NEW] `src/app/portal/tasks/page.tsx` (Vista de Tareas de Cliente)
- Dashboard exclusivo para el cliente donde solo puede ver tareas con `asignado_a_cliente = true` con su respectivo `contacto_cliente_id`.
- Botones para completar tarea o subir un archivo requerido, más el botón para "Reabrir" (solo en tareas completadas hace menos de 3 días).

#### [NEW] `src/app/settings/task-templates/page.tsx` (Configuración de Plantillas)
- Pantalla para el Administrador donde puede configurar las tareas por defecto (plantillas) que se generarán automáticamente al cambiar un proyecto de fase.

## Verification Plan

### Automated / Manual Verification
1. **Verificación de la Capa de Servicios**:
   - Validar que las funciones de `localStorage` trabajan asíncronamente (Retornan Promises).
   - Iniciar sesión como Cliente y verificar la invisibilidad absoluta de tareas internas basándonos en chequeos simulados a nivel de datos y UI.
2. **Validación de Reglas de Negocio**:
   - Completar una tarea con subtareas pendientes debería mandar un aviso (RN-TAR-12).
   - Completar una tarea como cliente y revisar cuenta regresiva de 3 días para su reapertura (RN-TAR-13).
3. **Flujos Secundarios**:
   - Crear una tarea dependiente de otra. Intentar completarla antes que su predecesora y verificar que el UI bloquea la acción.
