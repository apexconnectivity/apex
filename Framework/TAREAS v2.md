
## MÓDULO 4: TAREAS 
### Especificación Detallada (Versión actualizada)

---

## 1. PROPÓSITO DEL MÓDULO

Gestionar la ejecución operativa de los proyectos, permitiendo la asignación de actividades tanto al equipo interno de Apex Connectivity (según sus roles: comercial, técnico, compras, etc.) como a los contactos específicos de los clientes. Las tareas se organizan por categorías (Comercial, Técnica, Compras, Administrativa, General) y se integran con las fases del proyecto mediante plantillas configurables por el administrador para permitir la mejora continua de los procesos. Se soportan dependencias avanzadas (bloqueantes, inicio-después, fin-después), subtareas, comentarios y recurrencias.

**Novedad:** Se introduce un **Dashboard Personal Transversal** que permite a cada usuario visualizar y gestionar sus tareas asignadas en todos los proyectos de forma unificada, mejorando la priorización y evitando la saturación de información.

---

## 2. ACTORES Y PERMISOS

| Actor | Puede ver | Puede crear | Puede editar | Puede completar | Puede eliminar |
|-------|-----------|-------------|--------------|-----------------|----------------|
| **Administrador** | Todas las tareas de todos los proyectos | Sí | Sí | Sí | Sí |
| **Comercial** | Solo tareas de categoría **Comercial** en proyectos de fases 1-3 | Sí (en proyectos de fases 1-3, solo categoría Comercial) | Sí (solo las propias o de su equipo) | Sí (solo las que le corresponden) | No |
| **Técnico** | Tareas de categoría **Técnica** en proyectos donde está asignado (responsable o equipo) | Sí (en sus proyectos, solo categoría Técnica) | Sí (tareas técnicas propias o de su equipo) | Sí | No (solo si es creador) |
| **Compras** | Tareas de categoría **Compras** en proyectos con necesidades de compra | Sí (en proyectos que requieran compras, solo categoría Compras) | Sí (tareas de compras) | Sí | No |
| **Facturación** | No ve tareas (solo datos de proyecto) | - | - | - | - |
| **Marketing** | No ve tareas | - | - | - | - |
| **Cliente** | Solo tareas asignadas a su contacto específico (vía portal) | No | No (solo comentar) | Sí (completar y reabrir, con límite de 3 días) | No |

**Nota:** Un usuario con múltiples roles (ej. técnico+compras) tendrá acceso a las tareas de todas sus categorías en los proyectos que le correspondan. En su **Dashboard Personal**, verá todas esas tareas unificadas.

---

## 3. ESTRUCTURA DE DATOS

*(Se mantiene igual que en la versión original)*

### 3.1 Entidad: TAREA

| Campo | Tipo | Descripción | Obligatorio |
|-------|------|-------------|-------------|
| id | UUID | Identificador único | Auto |
| proyecto_id | UUID | Proyecto al que pertenece | Sí |
| fase_origen | integer | Fase en la que fue creada (1-5) | Sí |
| **categoria** | enum | **Comercial / Técnica / Compras / Administrativa / General** | Sí (default: General) |
| nombre | string | Título de la tarea | Sí |
| descripcion | text | Detalle de lo que hay que hacer | No |
| responsable_id | UUID | UUID del técnico/comercial/compras interno responsable. NULL si `asignado_a_cliente = true` | Sí, excepto cuando `asignado_a_cliente = true` |
| asignado_a_cliente | boolean | True si la tarea es para un cliente | Sí (default: false) |
| **contacto_cliente_id** | UUID | FK a contactos. Obligatorio si `asignado_a_cliente = true`. Indica qué contacto específico debe realizar la tarea. | No (sí si asignado a cliente) |
| fecha_creacion | timestamp | | Auto |
| fecha_vencimiento | date | | No |
| fecha_completado | timestamp | | Null si no completada |
| prioridad | enum | Baja / Media / Alta / Urgente | Sí (default: Media) |
| estado | enum | Pendiente / En progreso / Completada / Bloqueada | Sí (default: Pendiente) |
| orden | integer | Para ordenar dentro de la fase | Sí (auto) |
| **dependencias** | jsonb | Lista de objetos con `tarea_id` y `tipo_dependencia` (bloqueante, inicio_despues, fin_despues) y opcional `dias_desplazamiento` | No |
| creado_por | UUID | Usuario que creó la tarea | Auto |
| es_plantilla | boolean | Si pertenece a una plantilla (para tracking) | No |

**Nota sobre dependencias:** Se almacena en JSONB para flexibilidad, pero se validará que las tareas referenciadas existan y no haya ciclos.

### 3.2 Entidad: SUBTAREA

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | |
| tarea_id | UUID | Tarea padre |
| nombre | string | Descripción de la subtarea |
| completada | boolean | |
| orden | integer | |
| fecha_completado | timestamp | |

### 3.3 Entidad: COMENTARIO_TAREA

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | |
| tarea_id | UUID | |
| usuario_id | UUID | Quién comenta (puede ser cliente) |
| comentario | text | |
| fecha | timestamp | |
| adjuntos | UUID[] | Archivos asociados al comentario |

### 3.4 Entidad: TAREA_RECURRENTE (Configuración)

| Campo | Tipo | Descripción | Obligatorio |
|-------|------|-------------|-------------|
| id | UUID | | Auto |
| proyecto_id | UUID | Proyecto al que pertenece (o null si es global) | No |
| **categoria** | enum | Comercial / Técnica / Compras / Administrativa / General | Sí |
| nombre | string | Nombre de la tarea a generar | Sí |
| descripcion | text | | No |
| responsable_default | UUID | Técnico/comercial/compras por defecto (o null = responsable del proyecto) | No |
| asignar_a_cliente | boolean | Si la tarea es para el cliente | Sí (default: false) |
| **tipo_contacto_destino** | enum | Técnico / Administrativo / Financiero / Compras / Comercial / Soporte / Otro / Principal (solo si `asignar_a_cliente = true`) | No |
| intervalo | enum | Diario / Semanal / Mensual / Personalizado | Sí |
| intervalo_dias | integer | Si es personalizado, cada cuántos días | No |
| dia_especifico | json | Día del mes / día de semana / etc. | No |
| proxima_generacion | date | Próxima fecha en que debe notificarse | Sí |
| generar_con_vencimiento_dias | integer | +N días desde generación | No |
| activa | boolean | | Sí (default: true) |
| ultima_generacion | date | | No |
| veces_generada | integer | Contador | No |

### 3.5 Entidad: ARCHIVO_TAREA (relación con Módulo 6)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | |
| tarea_id | UUID | |
| archivo_id | UUID | Referencia al archivo en Drive |
| subido_por | UUID | |
| fecha | timestamp | |

---

## 4. TIPOS DE TAREAS

*(Sin cambios)*

| Categoría | Descripción | Responsable típico |
|-----------|-------------|---------------------|
| **Comercial** | Actividades de venta, prospección, propuestas | Comercial |
| **Técnica** | Configuración, implementación, pruebas | Técnico |
| **Compras** | Cotizaciones, órdenes de compra, gestión de proveedores | Compras |
| **Administrativa** | Facturación, contratos, documentación legal | Facturación / Admin |
| **General** | Otras tareas no clasificadas | Cualquier rol |

| Tipo | Responsable | Visible para cliente | Puede completar cliente |
|------|-------------|----------------------|------------------------|
| **Interna** | Usuario interno (según categoría) | No | No |
| **De cliente** | Contacto específico del cliente | Sí (en su portal) | Sí (y reabrir en 3 días) |

| Origen | Descripción |
|--------|-------------|
| **Desde plantilla** | Creada automáticamente al entrar a una fase, según plantilla configurada por admin |
| **Manual** | Creada ad-hoc por un usuario interno con permisos |
| **Recurrente** | Generada a partir de una configuración recurrente |

---

## 5. PANTALLAS (Wireframes Descriptivos)

### 5.1 Dashboard Personal: "Mis Tareas" (Vista transversal)

Esta es la pantalla principal para usuarios internos (técnicos, comerciales, compras). Muestra todas las tareas asignadas al usuario en todos los proyectos, agrupadas por urgencia y estado para facilitar la priorización.

```
+--------------------------------------------------------------------------------+
|  MIS TAREAS                                            [Proyecto: Todos ▼] [Buscar] |
|  Rol: Técnico                                    [Filtrar por categoría ▼]      |
+--------------------------------------------------------------------------------+
|  ⏰ VENCEN HOY (2)                                                              |
|  • [Proyecto A] Configurar firewall - Alta          [Cliente X]  [Completar]   |
|  • [Proyecto B] Pruebas de penetración - Urgente    [Cliente Y]  [Completar]   |
+--------------------------------------------------------------------------------+
|  ⚠ PRÓXIMOS 7 DÍAS (5)                                                        |
|  • [Proyecto A] Generar informe - Media             [Cliente X]  Vence: 12/06  |
|  • [Proyecto C] Revisar diagramas - Baja            [Cliente Z]  Vence: 14/06  |
|  • [Proyecto D] Coordinar visita técnica - Alta     [Cliente W]  Vence: 15/06  |
|  ...                                                                           |
+--------------------------------------------------------------------------------+
|  🔄 EN PROGRESO (3)                                                            |
|  • [Proyecto B] Documentar configuración - Media    [Cliente Y]  Iniciada: 08/06|
|  • [Proyecto D] Actualizar inventario - Baja        [Cliente W]  Iniciada: 09/06|
|  ...                                                                           |
+--------------------------------------------------------------------------------+
|  ⏳ SIN VENCIMIENTO (2)                                                        |
|  • [Proyecto E] Documentación interna - Baja        [Cliente V]                |
|  ...                                                                           |
+--------------------------------------------------------------------------------+
|  ✅ COMPLETADAS (últimos 7 días)                          [Ver más]             |
|  • [Proyecto A] Enviar contrato - Completada 05/06                             |
|  ...                                                                           |
+--------------------------------------------------------------------------------+
```

**Elementos clave:**
- Filtros por proyecto, categoría, estado.
- Cada tarea muestra: nombre, prioridad, proyecto, empresa cliente (si aplica), fecha de vencimiento.
- Acciones rápidas: completar, comentar, ver detalle.
- Al hacer clic en el nombre de la tarea o en "Ver detalle", se abre el detalle de la tarea.
- Desde aquí se puede navegar al proyecto específico para ver más contexto.

### 5.2 Vista de Tareas dentro de Proyecto (con selector de vistas)

Al acceder a un proyecto desde el dashboard o desde el listado de proyectos, se presenta la vista de tareas del proyecto. Incluye un selector para elegir entre tres modos de visualización.

```
+----------------------------------------------------------+
|  TAREAS DEL PROYECTO                           [ + NUEVA TAREA ]
|  Proyecto: Implementación Firewall - Soluciones Tec      |
|  [Vista: Kanban ▼]  [Filtros]                            |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  Vista Kanban (por estado)                               |
|  +------------+  +------------+  +------------+  +------------+
|  | Pendiente  |  | En progreso|  | Bloqueada  |  | Completada |
|  | (3)        |  | (2)        |  | (1)        |  | (4)        |
|  +------------+  +------------+  +------------+  +------------+
|  | [Técnica]  |  | [Técnica]  |  | [Compras]  |  | [Técnica]  |
|  | Configurar |  | Probar     |  | Cotizar    |  | Configurar |
|  | firewall   |  | conectividad|  | switch     |  | VLANs      |
|  | Vence:10/06|  | Vence:12/06|  | Vence:15/06|  | Completada |
|  +------------+  +------------+  +------------+  +------------+
```

```
+----------------------------------------------------------+
|  Vista por fases expandible (alternativa)                |
|  [>] FASE 4: IMPLEMENTACIÓN (En progreso)  [Ocultar completadas]
|      [ ] [Técnica] Configurar firewall (Carlos, vence 10/06)
|          [✔] Crear VLAN 10                                |
|          [✔] Crear VLAN 20                                |
|          [ ] Aplicar políticas de acceso                  |
|          [ ] Probar conectividad                          |
|          📎 2 comentarios · 1 archivo                     |
|                                                           |
|      [ ] [Compras] Cotizar switch adicional (Laura, vence 12/06)
|                                                           |
|  [🔽] FASES ANTERIORES (mostrar)                          |
|      [✔] FASE 3: PROPUESTA (Completada)                  |
|          ✔ [Comercial] Elaborar propuesta (Juan, 01/05)  |
|          ✔ [Comercial] Enviar a cliente (Carlos, 02/05)  |
+----------------------------------------------------------+
```

```
+----------------------------------------------------------+
|  Vista Gantt simple (para dependencias)                  |
|  Tarea                    | 05/06 | 10/06 | 15/06 | 20/06 |
|  -------------------------|-------|-------|-------|-------|
|  Configurar firewall      | ██████|       |       |       |
|    Dependencia: Migrar... |   ░░░░|       |       |       |
|  Probar conectividad      |       | ██████|       |       |
|  Cotizar switch           |       |       | ██████|       |
+----------------------------------------------------------+
```

**Nota:** Las vistas Kanban y Gantt solo están disponibles para usuarios internos. Los clientes solo ven la vista de lista simple (como en 5.5).

### 5.3 Detalle de Tarea (sin cambios en estructura, solo referencia)

*(Se mantiene igual que en la versión original)*

### 5.4 Nueva Tarea (sin cambios)

*(Se mantiene igual que en la versión original)*

### 5.5 Vista de Tareas del Cliente (en su portal)

Sigue siendo una lista simple, sin dashboard transversal ni vistas complejas.

```
+----------------------------------------------------------+
|  MIS TAREAS PENDIENTES                                    |
+----------------------------------------------------------+
|  Proyecto: Implementación Firewall                        |
|                                                           |
|  +------------------------------------------------------+ |
|  | 🔴 Subir diagrama de red actual (vence 12/06)        | |
|  | Categoría: Técnica · Asignada a: Juan Pérez          | |
|  | [Subir archivo] [Ver detalles]                       | |
|  +------------------------------------------------------+ |
|                                                           |
|  ✅ COMPLETADAS (puedes reabrir hasta 3 días después)     |
|  • Enviar contrato firmado (01/06) [¿Reabrir?]           |
+----------------------------------------------------------+
```

### 5.6 Configuración de Plantillas por Fase (solo admin) - sin cambios

*(Se mantiene igual que en la versión original)*

---

## 6. FLUJOS PRINCIPALES

### 6.1 Acceso al módulo

- **Usuario interno (técnico, comercial, compras):** Al ingresar al módulo Tareas, se muestra por defecto el **Dashboard Personal "Mis Tareas"** con todas sus tareas asignadas en todos los proyectos.
- **Administrador:** Por defecto puede ver el dashboard con todas las tareas de la plataforma (o elegir una vista global).
- **Cliente:** Ingresa al portal y ve sus tareas pendientes en lista simple.

### 6.2 Navegación entre vistas

- Desde el Dashboard Personal, el usuario puede:
  - Hacer clic en una tarea para ver su detalle.
  - Hacer clic en el nombre del proyecto para ir a la **vista de tareas del proyecto**.
- En la vista de proyecto, puede:
  - Cambiar entre vistas Kanban, fases expandibles o Gantt.
  - Volver al Dashboard Personal mediante un enlace en el header.

### 6.3 Gestión de tareas desde el Dashboard Personal

- El usuario puede completar tareas directamente desde el dashboard (acción rápida).
- Puede filtrar por proyecto, categoría o estado.
- Puede ver tareas agrupadas automáticamente (vencen hoy, próximos 7 días, en progreso, sin vencimiento, completadas recientes).

### 6.4 Gestión de dependencias avanzadas (sin cambios)

*(Se mantiene igual que en la versión original)*

### 6.5 Cliente completa una tarea (sin cambios)

*(Se mantiene igual que en la versión original)*

### 6.6 Cliente reabre una tarea (sin cambios)

*(Se mantiene igual que en la versión original)*

### 6.7 Tareas recurrentes (sin cambios)

*(Se mantiene igual que en la versión original)*

### 6.8 Creación automática de tareas desde plantilla (sin cambios)

*(Se mantiene igual que en la versión original)*

---

## 7. REGLAS DE NEGOCIO ESPECÍFICAS (RN-TAR-xx) - ACTUALIZADAS

| ID | Regla |
|----|-------|
| RN-TAR-01 | Una tarea SOLO puede pertenecer a un proyecto. |
| RN-TAR-02 | Una tarea asignada a cliente debe tener un `contacto_cliente_id` válido y activo. |
| RN-TAR-03 | Las tareas de cliente SOLO son visibles para ese contacto en su portal. |
| RN-TAR-04 | Un cliente NO puede ver tareas internas, ni siquiera que existen. |
| RN-TAR-05 | Al completar una tarea de cliente, se NOTIFICA automáticamente al responsable interno según la categoría. |
| RN-TAR-06 | Las tareas creadas desde plantilla heredan la fase de origen y no pueden cambiar de fase. |
| RN-TAR-07 | Si una tarea vence y no se completa, se envía recordatorio cada 2 días al responsable (vía n8n). |
| RN-TAR-08 | Un usuario NO puede eliminar una tarea que no haya creado él (excepto admin). |
| RN-TAR-09 | Al eliminar un proyecto, se eliminan TODAS sus tareas (en cascada). |
| RN-TAR-10 | Las tareas completadas NO pueden editarse (solo comentarios y reabrir por cliente si aplica). |
| RN-TAR-11 | Si todas las tareas de una fase están completadas, el sistema SUGIERE avanzar a la siguiente fase. |
| RN-TAR-12 | Una tarea puede tener N subtareas. Cuando todas las subtareas se completan, el sistema muestra un prompt: "¿Marcar tarea como completada?" El usuario puede confirmar o dejarla en "En progreso". |
| RN-TAR-13 | Un cliente puede REABRIR una tarea que él mismo completó, hasta 3 días después. Pasado ese plazo, debe contactar al equipo. |
| RN-TAR-14 | Las tareas recurrentes NOTIFICAN al responsable en la fecha programada, quien decide generar, reprogramar o detener. |
| RN-TAR-15 | Si una tarea recurrente no recibe respuesta tras 3 recordatorios, se PAUSA automáticamente. |
| RN-TAR-16 | Por defecto, en la vista de proyecto solo se muestra la fase actual. El usuario puede expandir para ver fases anteriores. |
| RN-TAR-17 | Una tarea no puede tener `asignado_a_cliente = true` y `responsable_id` definido simultáneamente. |
| RN-TAR-18 | La categoría de la tarea es obligatoria y determina qué roles pueden verla/gestionarla. |
| RN-TAR-19 | Los usuarios con rol Compras tienen un dashboard específico que muestra solo tareas de categoría Compras (o todas si tienen múltiples roles). |
| RN-TAR-20 | Las dependencias pueden ser de tipo bloqueante, inicio-después o fin-después, con posible desplazamiento en días. El sistema valida que no haya ciclos. |
| RN-TAR-21 | Cuando un proyecto pasa a estado "cerrado", todas sus tareas pasan a ser solo lectura. Si el proyecto se reabre, las tareas vuelven a su estado anterior (las pendientes siguen pendientes). |
| RN-TAR-22 | Las plantillas de tareas por fase solo pueden ser modificadas por el administrador, para garantizar la mejora continua del proceso. |
| **RN-TAR-23** | **El Dashboard Personal "Mis Tareas" muestra únicamente las tareas asignadas directamente al usuario (responsable_id = usuario_id). No incluye tareas de otros miembros del equipo, salvo que el usuario tenga rol de administrador.** |
| **RN-TAR-24** | **La agrupación en el Dashboard Personal se realiza automáticamente según reglas: "Vencen hoy", "Próximos 7 días", "En progreso", "Sin vencimiento", "Completadas recientes". El orden dentro de cada grupo es por prioridad y fecha de vencimiento.** |
| **RN-TAR-25** | **En la vista Kanban por proyecto, el arrastre de tareas entre columnas solo cambia el estado si se cumplen las dependencias. En caso contrario, se muestra un mensaje de error.** |

---

## 8. VALIDACIONES POR CAMPO

*(Sin cambios respecto a la versión original)*

---

## 9. MENSAJES PARA EL USUARIO

| Situación | Mensaje |
|-----------|---------|
| Tarea creada | "Tarea creada correctamente" |
| Tarea completada | "¡Tarea completada! Bien hecho." |
| Cliente reabre tarea | (Notificación interna) "El cliente reabrió la tarea [nombre]" |
| Intento de editar tarea en proyecto cerrado | "No se puede modificar una tarea de un proyecto cerrado" |
| Dependencia no satisfecha | "No se puede completar esta tarea porque tiene dependencias pendientes" |
| **Acceso desde Dashboard** | (Al hacer clic en proyecto) "Mostrando tareas del proyecto [nombre]" |

---

## 10. DEPENDENCIAS CON OTROS MÓDULOS

| Módulo | Dependencia |
|--------|-------------|
| **Proyectos (M3)** | Las tareas pertenecen a proyectos y se ven afectadas por el estado del proyecto (activo/cerrado). |
| **CRM (M2)** | Los contactos cliente se usan para asignar tareas. |
| **Autenticación (M1)** | Roles y permisos para acceso a tareas por categoría. |
| **Portal Cliente (M7)** | Las tareas de cliente se muestran en el portal. |
| **Archivos (M6)** | Adjuntos a tareas. |
| **Notificaciones (M9)** | Alertas de vencimiento, asignación, etc. vía n8n. |
| **Compras (nuevo)** | Dashboard de tareas de compras. |
| **Dashboard/Home (posible módulo)** | El módulo de Tareas puede integrar su propio dashboard transversal como vista principal. |

---

## 11. OPCIONES DE CONFIGURACIÓN (Para Admin)

- [ ] Días para reabrir tareas de cliente: [3] días
- [ ] Recordatorios automáticos de vencimiento: [2] días antes
- [ ] Permitir a técnicos ver tareas de otros técnicos en el mismo proyecto: [✔] Sí (solo lectura)
- [ ] Categorías activas: [✔] Comercial, Técnica, Compras, Administrativa, General
- [ ] **Vista por defecto al ingresar al módulo:** [ ] Dashboard Personal  [ ] Vista de proyecto específico
- [ ] **Agrupaciones en Dashboard Personal:** [✔] Vencen hoy, [✔] Próximos 7 días, [✔] En progreso, [✔] Sin vencimiento, [✔] Completadas recientes

---

## 12. MÉTRICAS (Para dashboard interno)

- Tareas por categoría
- Tareas completadas vs pendientes por rol
- Tiempo promedio de resolución por categoría
- Tareas reabiertas por clientes (índice de corrección)
- Tareas recurrentes activas por categoría
- **Tareas por usuario (responsable) en el Dashboard Personal**
- **Tiempo medio de respuesta desde asignación**

---
```