## MÓDULO 3: PROYECTOS (PIPELINE 5 FASES)
### Especificación Detallada

---

## 1. PROPÓSITO DEL MÓDULO

Gestionar el ciclo de vida completo de los proyectos de Apex Connectivity, desde la prospección hasta el cierre y posterior archivado. El módulo distingue tres estados: **activo** (en pipeline), **cerrado** (fuera del pipeline pero aún en BD) y **archivado** (almacenado en Drive). Solo el administrador puede cerrar, reabrir y archivar proyectos, garantizando el control total. Además, se integra con los roles definidos en autenticación y con el CRM para asignar tareas inteligentemente.

---

## 2. ACTORES Y PERMISOS

| Actor | Puede ver | Puede crear | Puede editar | Puede mover fases | Puede cerrar | Puede reabrir | Puede archivar |
|-------|-----------|-------------|--------------|-------------------|--------------|---------------|----------------|
| **Administrador** | Todos los proyectos (activos, cerrados) | Sí | Sí (todo, con restricciones en cerrados) | Sí | Sí | Sí | Sí |
| **Comercial** | Proyectos activos en fases 1-3 | Sí | Sí (datos comerciales) | Sí (solo entre fases 1-3) | No | No | No |
| **Técnico** | Proyectos activos en fases 4-5 (todos, pero solo modifica los suyos) | No | Parcial (tareas, notas, archivos técnicos) | Sí (solo en sus proyectos asignados, entre fases 4-5) | No | No | No |
| **Compras** | Proyectos activos con necesidades de compra | No | Parcial (datos de compras) | No | No | No | No |
| **Facturación** | Todos los proyectos activos (solo datos económicos) | No | No | No | No | No | No |
| **Marketing** | No accede a proyectos | - | - | - | - | - | - |
| **Cliente** | Solo su proyecto activo (vía portal) | No | No | No | No | No | No |

---

## 3. ESTRUCTURA DE DATOS

### 3.1 Entidad: PROYECTO

| Campo | Tipo | Descripción | Obligatorio |
|-------|------|-------------|-------------|
| id | UUID | Identificador único | Auto |
| empresa_id | UUID | Cliente del proyecto (FK a empresas, tipo cliente) | Sí |
| nombre | string | Nombre identificativo | Sí |
| descripcion | text | Detalle del alcance | No |
| fase_actual | integer | 1-5 (o las que se configuren) | Sí (default: 1) |
| **estado** | enum | **activo / cerrado** | Sí (default: activo) |
| fecha_inicio | date | Cuándo empezó | No |
| fecha_estimada_fin | date | | No |
| fecha_real_fin | date | | No |
| **fecha_cierre** | timestamp | Cuándo se cerró (si estado = cerrado) | No |
| **motivo_cierre** | text | Motivo del cierre (especialmente si es cancelación) | No |
| fecha_inicio_negociacion | date | Inicio de la negociación | No |
| fecha_aceptacion_propuesta | date | Cuando el cliente acepta | No |
| fecha_inicio_implementacion | date | Inicio de implementación | No |
| moneda | enum | USD / MXN | Sí (default: USD) |
| monto_estimado | decimal | | No |
| monto_real | decimal | | No |
| probabilidad_cierre | integer | 0-100 | Sí (default según fase) |
| responsable_id | UUID | Técnico principal (interno) | Sí |
| equipo | UUID[] | Técnicos secundarios (internos) | No |
| contacto_tecnico_cliente_id | UUID | Contacto técnico del cliente (FK a contactos) | Sí |
| tags | text[] | Array de etiquetas | No |
| requiere_compras | boolean | Indica si necesita gestión de compras | No (default: false) |
| creado_en | timestamp | | Auto |
| creado_por | UUID | Usuario que creó | Auto |

### 3.2 Entidad: FASE (Configurable por Admin)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | integer | Orden (1,2,3,4,5...) |
| nombre | string | Ej: "Diagnóstico", "Implementación" |
| descripcion | string | Opcional |
| color | string | Para visualización en pipeline |
| activa | boolean | Si se usa actualmente |
| probabilidad_default | integer | Probabilidad de cierre por defecto para proyectos en esta fase |

### 3.3 Entidad: PLANTILLA_TAREA

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | |
| fase_id | integer | Fase a la que pertenece |
| nombre | string | "Solicitar diagrama de red" |
| descripcion | text | Opcional |
| asignacion_default | enum | Interno / Cliente |
| tipo_contacto_destino | enum | Técnico / Administrativo / Financiero / Compras / Comercial / Soporte / Otro / Principal |
| dias_estimados | integer | |
| orden | integer | Para ordenar dentro de la fase |
| activa | boolean | |

### 3.4 Entidad: HISTORIAL_PROYECTO

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | |
| proyecto_id | UUID | |
| usuario_id | UUID | Quién hizo la acción |
| accion | string | "Cambio de fase", "Tarea creada", "Cierre", "Reapertura", etc. |
| detalle | json | Información adicional (ej. motivo de cierre) |
| fecha | timestamp | |

### 3.5 Entidad: ETIQUETA (para tags)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | |
| nombre | string | "Migración", "Urgente", etc. |
| color | string | Opcional |
| creado_por | UUID | Solo admin puede crear |

---

## 4. CONFIGURACIÓN INICIAL DE FASES (Por Defecto)

| Fase | Nombre | Color | Probabilidad default | Tareas típicas (plantilla) |
|------|--------|-------|----------------------|---------------------------|
| **1** | Prospecto | #6b7280 (gris) | 20% | • Llamada inicial<br>• Enviar presentación<br>• Calificar interés |
| **2** | Diagnóstico | #3b82f6 (azul) | 40% | • Coordinar visita<br>• Auditoría in-situ<br>• Solicitar diagramas al cliente (tipo_contacto: Técnico)<br>• Redactar informe diagnóstico |
| **3** | Propuesta | #eab308 (amarillo) | 70% | • Elaborar propuesta<br>• Enviar a cliente (tipo_contacto: Principal)<br>• Negociar ajustes<br>• Obtener firma |
| **4** | Implementación | #10b981 (verde) | 90% | • Configurar equipos<br>• Migrar servicios<br>• Pruebas internas<br>• Documentar cambios |
| **5** | Cierre y Entrega | #8b5cf6 (púrpura) | 100% | • Capacitar usuario (tipo_contacto: Técnico)<br>• Entregar documentación (tipo_contacto: Principal)<br>• Facturar<br>• Activar soporte (opcional) |

---

## 5. PANTALLAS (Wireframes Descriptivos)

### 5.1 Pipeline de Proyectos Activos (Vista para Admin)

(Similar a la versión anterior, pero con filtro por estado activo)

### 5.2 Vista de Proyectos Cerrados (solo Admin)

```
+----------------------------------------------------------+
|  PROYECTOS CERRADOS                           [Volver]  |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  Filtros: [Todos] [Por cliente] [Por fecha cierre]       |
+----------------------------------------------------------+
|  +------------------------------------------------------+ |
|  | Implementación Firewall - Soluciones Tec            | |
|  | Cerrado: 15/06/2026 · Motivo: Proyecto completado   | |
|  | [Ver detalles] [Reabrir] [Archivar]                 | |
|  +------------------------------------------------------+ |
|  | Migración Servidores - Hospital Regional             | |
|  | Cerrado: 10/05/2026 · Motivo: Cancelado por cliente | |
|  | [Ver detalles] [Reabrir] [Archivar]                 | |
|  +------------------------------------------------------+ |
+----------------------------------------------------------+
```

### 5.3 Detalle de Proyecto Cerrado (solo Admin)

```
+----------------------------------------------------------+
|  PROYECTO CERRADO: Implementación Firewall       [Volver]|
+----------------------------------------------------------+

+----------------------------------------------------------+
|  Información General (solo lectura, excepto campos editables)
|  Estado: Cerrado · Cerrado el: 15/06/2026                |
|  Motivo: Proyecto completado                              |
|  Fase al cerrar: 5 - Cierre                              |
|  Cliente: Soluciones Tecnológicas SA                      |
|  Responsable interno: Carlos Rodríguez                    |
|  Contacto técnico cliente: Juan Pérez                     |
|  Monto real: $4,800                                       |
|                                                           |
|  Campos editables:                                        |
|  Notas internas: [_____________________________________]  |
|  Etiquetas: [migración] [urgente] [ + Agregar ]          |
|  Contacto técnico: [Juan Pérez ▼] (si cambió)            |
|                                                           |
|  [GUARDAR CAMBIOS]                                        |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  Tareas (solo lectura)                                   |
|  • Configurar firewall (completada 10/06)                |
|  • Pruebas de penetración (completada 12/06)             |
|  • Capacitar usuario (completada 14/06)                   |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  Acciones                                                 |
|  [REABRIR PROYECTO]  [ARCHIVAR]                          |
+----------------------------------------------------------+
```

---

## 6. FLUJOS PRINCIPALES

### 6.1 Cerrar un proyecto (solo admin)

1. Admin, desde cualquier proyecto activo, hace clic en "Cerrar proyecto".
2. Modal de confirmación:
   ```
   ¿Cerrar proyecto?

   El proyecto pasará a estado "Cerrado" y desaparecerá del pipeline.
   Podrá ser reabierto posteriormente si es necesario.

   Motivo del cierre*: [___________________________________]
   (Ej: Proyecto completado, Cancelado por cliente, etc.)

   Notas adicionales (opcional): [_________________________]

   [CERRAR PROYECTO] [Cancelar]
   ```
3. Validaciones: Motivo obligatorio.
4. Al guardar:
   - `estado` pasa a 'cerrado'.
   - `fecha_cierre` = now().
   - `motivo_cierre` = texto ingresado.
   - Se registra en historial.
   - El proyecto se mueve a la vista de proyectos cerrados.

### 6.2 Editar un proyecto cerrado (solo admin)

- Admin accede a la vista de cerrados, selecciona un proyecto.
- Puede editar los campos permitidos: notas internas, etiquetas, contacto técnico.
- Al guardar, se actualizan los datos sin cambiar el estado.
- No puede editar fase, fechas clave, ni otros campos críticos.

### 6.3 Reabrir un proyecto cerrado (solo admin)

1. Admin, desde la vista de cerrados, hace clic en "Reabrir".
2. Modal de confirmación:
   ```
   ¿Reabrir el proyecto?

   Volverá a estado "Activo" en la fase [fase_actual] (la que tenía al cerrarse).
   Podrá continuar trabajando en él.

   [REABRIR] [Cancelar]
   ```
3. Al confirmar:
   - `estado` pasa a 'activo'.
   - Se mantiene la misma fase.
   - Se registra en historial: "Proyecto reabierto por [admin]."
   - El proyecto vuelve al pipeline en su columna correspondiente.

### 6.4 Archivar un proyecto cerrado (solo admin)

1. Admin, desde la vista de cerrados, hace clic en "Archivar".
2. El sistema evalúa automáticamente:
   - Si el proyecto se cerró desde fase 5 **y** todas las tareas de fase 5 estaban completadas → clasifica como "completado".
   - En caso contrario → clasifica como "inconcluso".
3. Modal de confirmación:
   ```
   ¿Archivar proyecto?

   Se generará una copia en Drive y se eliminarán los datos operativos.
   Clasificación automática: [COMPLETADO] (puedes cambiarla)

   Destino en Drive:
   ○ Completado   ( /Archivo Histórico/Completados/... )
   ○ Inconcluso   ( /Archivo Histórico/Inconclusos/... )

   [ARCHIVAR] [Cancelar]
   ```
   Admin puede cambiar la clasificación manualmente si lo desea.
4. Al confirmar, se ejecuta el proceso del Módulo 10:
   - Se genera JSON con todos los datos (incluyendo motivo de cierre).
   - Se copian archivos a la carpeta correspondiente.
   - Se elimina el proyecto de la tabla `proyectos` y datos relacionados.
   - Se crea registro en `proyectos_archivados`.

---

## 7. REGLAS DE NEGOCIO ESPECÍFICAS (RN-PRO-xx) - ACTUALIZADAS

| ID | Regla |
|----|-------|
| RN-PRO-01 | Un proyecto SOLO puede estar en una fase a la vez. |
| RN-PRO-02 | Las fases son configurables por el administrador. |
| RN-PRO-03 | Al cambiar de fase, se crean tareas desde plantilla (si está activado). |
| RN-PRO-04 | Un proyecto no puede ser eliminado; solo se cierra o archiva. |
| RN-PRO-05 | El cliente SOLO ve su proyecto activo (estado = activo). |
| RN-PRO-06 | Un técnico puede ver todos los proyectos en fases 4-5, pero solo modificar los suyos. |
| RN-PRO-07 | Un comercial solo puede ver y mover proyectos en fases 1-3. |
| RN-PRO-08 | Al crear un proyecto, se debe asignar responsable interno y contacto técnico cliente. |
| RN-PRO-09 | Si un proyecto permanece más de 7 días sin actividad, se envía alerta (n8n). |
| RN-PRO-10 | Al llegar a fase 5 y completar todas las tareas, el sistema sugiere cerrar. |
| **RN-PRO-11** | **Solo el administrador puede cerrar un proyecto, independientemente de la fase o tareas pendientes.** |
| **RN-PRO-12** | **Al cerrar un proyecto, se debe registrar obligatoriamente un motivo de cierre.** |
| **RN-PRO-13** | **Un proyecto cerrado no es visible en el pipeline, solo en la sección "Proyectos cerrados" (accesible solo para admin).** |
| **RN-PRO-14** | **Solo el administrador puede reabrir un proyecto cerrado. Al reabrir, vuelve a estado activo en la misma fase.** |
| **RN-PRO-15** | **El administrador puede editar campos no críticos (notas, etiquetas, contacto técnico) de un proyecto cerrado sin reabrirlo. Para modificar fase, fechas clave o estado, debe reabrir.** |
| **RN-PRO-16** | **Al archivar un proyecto cerrado, el sistema clasifica automáticamente como "completado" si fue cerrado desde fase 5 con todas las tareas de fase 5 completadas; en caso contrario, como "inconcluso". El admin puede cambiar la clasificación manualmente.** |
| RN-PRO-17 | Las tareas generadas desde plantilla se asignan al contacto del tipo especificado, si existe; de lo contrario, al contacto principal. |
| RN-PRO-18 | La probabilidad de cierre se inicializa con el valor por defecto de la fase, pero puede ajustarse manualmente. |
| RN-PRO-19 | Las fechas clave se actualizan automáticamente al cambiar a las fases correspondientes. |

---

## 8. VALIDACIONES POR CAMPO

### Crear/Editar Proyecto
| Campo | Validación | Mensaje |
|-------|------------|---------|
| cliente | Debe existir y ser de tipo cliente o ambos | "El cliente debe ser una empresa de tipo Cliente" |
| nombre | Obligatorio, mínimo 5 caracteres | "El nombre del proyecto es obligatorio" |
| responsable | Debe ser un usuario interno activo con rol técnico o admin | "Selecciona un responsable válido" |
| contacto_tecnico_cliente | Debe ser un contacto activo de la empresa y de tipo técnico | "El contacto técnico debe ser un contacto válido de la empresa" |
| fecha_inicio | No puede ser futura (opcional) | "La fecha de inicio no puede ser mayor a hoy" |
| fecha_estimada_fin | Debe ser posterior a inicio | "La fecha estimada debe ser posterior al inicio" |
| monto | Número positivo | "Ingresa un monto válido" |

### Cierre de proyecto
| Campo | Validación | Mensaje |
|-------|------------|---------|
| motivo_cierre | Obligatorio, mínimo 5 caracteres | "Debes indicar un motivo para el cierre" |

---

## 9. MENSAJES PARA EL USUARIO

| Situación | Mensaje |
|-----------|---------|
| Proyecto cerrado | "Proyecto cerrado correctamente. Motivo: [motivo]" |
| Proyecto reabierto | "Proyecto reabierto correctamente. Ahora está activo en fase [fase]." |
| Proyecto archivado | "Proyecto archivado correctamente. Carpeta: [ruta]" |
| Intento de editar campo crítico en cerrado | "Este campo no puede editarse en un proyecto cerrado. Debes reabrir el proyecto." |

---

## 10. DEPENDENCIAS CON OTROS MÓDULOS

| Módulo | Dependencia |
|--------|-------------|
| **CRM (M2)** | Los proyectos se asocian a empresas cliente y contactos. |
| **Autenticación (M1)** | Roles y permisos. |
| **Tareas (M4)** | Las tareas de proyectos cerrados pasan a solo lectura. |
| **Archivos (M6)** | Los archivos de proyectos cerrados siguen accesibles. |
| **Soporte (M5)** | Al cerrar, se puede ofrecer activar soporte (opcional). |
| **Archivado (M10)** | Recibe proyectos cerrados para archivar. |
| **Notificaciones (M9)** | Alertas de inactividad, cierre, etc. |

---