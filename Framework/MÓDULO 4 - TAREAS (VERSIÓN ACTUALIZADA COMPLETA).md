## MÓDULO 4: TAREAS 
### Especificación Detallada

---

## 1. PROPÓSITO DEL MÓDULO

Gestionar la ejecución operativa de los proyectos, permitiendo la asignación de actividades tanto al equipo interno de Apex Connectivity (según sus roles: comercial, técnico, compras, etc.) como a los contactos específicos de los clientes. Las tareas se organizan por categorías (Comercial, Técnica, Compras, Administrativa, General) y se integran con las fases del proyecto mediante plantillas configurables por el administrador para permitir la mejora continua de los procesos. Se soportan dependencias avanzadas (bloqueantes, inicio-después, fin-después), subtareas, comentarios y recurrencias.

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

**Nota:** Un usuario con múltiples roles (ej. técnico+compras) tendrá acceso a las tareas de todas sus categorías en los proyectos que le correspondan.

---

## 3. ESTRUCTURA DE DATOS

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

### 4.1 Por categoría

| Categoría | Descripción | Responsable típico |
|-----------|-------------|---------------------|
| **Comercial** | Actividades de venta, prospección, propuestas | Comercial |
| **Técnica** | Configuración, implementación, pruebas | Técnico |
| **Compras** | Cotizaciones, órdenes de compra, gestión de proveedores | Compras |
| **Administrativa** | Facturación, contratos, documentación legal | Facturación / Admin |
| **General** | Otras tareas no clasificadas | Cualquier rol |

### 4.2 Por asignación

| Tipo | Responsable | Visible para cliente | Puede completar cliente |
|------|-------------|----------------------|------------------------|
| **Interna** | Usuario interno (según categoría) | No | No |
| **De cliente** | Contacto específico del cliente | Sí (en su portal) | Sí (y reabrir en 3 días) |

### 4.3 Por origen

| Origen | Descripción |
|--------|-------------|
| **Desde plantilla** | Creada automáticamente al entrar a una fase, según plantilla configurada por admin |
| **Manual** | Creada ad-hoc por un usuario interno con permisos |
| **Recurrente** | Generada a partir de una configuración recurrente |

---

## 5. PANTALLAS (Wireframes Descriptivos)

### 5.1 Vista de Tareas dentro de Proyecto (con categorías y filtros)

```
+----------------------------------------------------------+
|  TAREAS DEL PROYECTO                           [ + NUEVA TAREA ]
|  Proyecto: Implementación Firewall - Soluciones Tec      |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  Filtros: [Todas las categorías ▼] [Responsable ▼] [Estado ▼]
+----------------------------------------------------------+

+----------------------------------------------------------+
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

### 5.2 Detalle de Tarea (con categoría y asignación a contacto)

```
+----------------------------------------------------------+
|  TAREA: Configurar firewall                               [✖ Cerrar]
+----------------------------------------------------------+

+----------------------------------------------------------+
|  Proyecto: Implementación Firewall - Soluciones Tec       |
|  Fase: 4 - Implementación                                 |
|  Categoría: ● Técnica                                      |
|                                                           |
|  Responsable: Carlos Rodríguez (interno)                  |
|  Estado: ● En progreso                                     |
|  Prioridad: 🔴 Alta                                        |
|  Vence: 10/06/2026 (en 5 días)                            |
|                                                           |
|  Dependencias:                                            |
|  • [Bloqueante] Migrar reglas actuales (completada 05/06) |
|  • [Inicio después] Pruebas de conectividad (debe iniciar |
|    2 días después de completar esta)                      |
|                                                           |
|  Descripción:                                             |
|  Configurar firewall Fortinet con las siguientes VLANs:   |
|  - VLAN 10: Administración                                |
|  - VLAN 20: Datos                                         |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  SUBTAREAS                                      [ + Agregar]|
|  [✔] Crear VLAN 10                                        |
|  [✔] Crear VLAN 20                                        |
|  [ ] Aplicar políticas de acceso                          |
|  [ ] Probar conectividad                                  |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  COMENTARIOS                                              |
|  Carlos - Hoy 10:15                                       |
|  > Ya tengo las VLANs creadas. ¿Confirmamos IPs?         |
|  [Escribe un comentario...]                      [Enviar] |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  ACCIONES                                                 |
|  [COMPLETAR]  [REASIGNAR]  [DUPLICAR]  [ELIMINAR]        |
+----------------------------------------------------------+
```

### 5.3 Nueva Tarea (con categoría y asignación a contacto)

```
+----------------------------------------------------------+
|  NUEVA TAREA                                   [Guardar]  |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  Proyecto: Implementación Firewall                        |
|  Fase: [Fase 4: Implementación______________________]    |
|  Categoría*: (●) Técnica  ( ) Comercial  ( ) Compras     |
|             ( ) Administrativa  ( ) General               |
|                                                           |
|  Nombre de la tarea*: [________________________________] |
|  Descripción: [______________________________________]   |
|                                                           |
|  Asignar a: (●) Interno  ( ) Cliente                      |
|                                                           |
|  Responsable (si interno): [Carlos Rodríguez_________]   |
|  Contacto cliente (si cliente): [Juan Pérez (Técnico) ▼] |
|                                                           |
|  Prioridad: ( ) Baja  (●) Media  ( ) Alta  ( ) Urgente    |
|  Fecha de vencimiento: [10/06/2026_________________]     |
|                                                           |
|  Dependencias:                                            |
|  [ ] Migrar reglas actuales (Bloqueante)                  |
|  [ ] Pruebas de conectividad (Inicio después, +2 días)   |
|  [ + Agregar dependencia ]                                |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  SUBTAREAS (opcional)                                     |
|  [✔] Tiene checklist                                     |
|  [________________________________________] [➕]          |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  NOTIFICACIONES                                           |
|  [✔] Notificar al responsable por email                   |
|  [✔] Notificar en Slack (según categoría)                 |
+----------------------------------------------------------+
```

### 5.4 Dashboard de Tareas por Rol

**Ejemplo para Técnico:**

```
+----------------------------------------------------------+
|  MIS TAREAS TÉCNICAS                            [Hoy: 3] |
+----------------------------------------------------------+
|  ⏰ VENCEN HOY (1)                                        |
|  • [Implementación] Pruebas de penetración - Alta        |
|    Proyecto: Cliente A · Vence: Hoy 18:00                |
|    [Ver] [Completar]                                      |
+----------------------------------------------------------+
|  ⚠ PRÓXIMOS 7 DÍAS (4)                                    |
|  • [Implementación] Configurar firewall - Alta           |
|    Proyecto: Cliente A · Vence: 10/06                     |
+----------------------------------------------------------+
```

**Ejemplo para Compras:**

```
+----------------------------------------------------------+
|  MIS TAREAS DE COMPRAS                          [Hoy: 0] |
+----------------------------------------------------------+
|  ⚠ PENDIENTES (2)                                         |
|  • [Proyecto X] Cotizar switch - Vence: 12/06            |
|  • [Proyecto Y] Generar orden de compra - Vence: 15/06   |
+----------------------------------------------------------+
```

### 5.5 Vista de Tareas del Cliente (en su portal)

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

### 5.6 Configuración de Plantillas por Fase (solo admin)

```
+----------------------------------------------------------+
|  PLANTILLAS DE TAREAS - FASE 2: DIAGNÓSTICO     [Guardar]|
+----------------------------------------------------------+

+----------------------------------------------------------+
|  Orden | Tarea | Categoría | Asignación | Tipo contacto | Activa |
|-------|-------|-----------|------------|----------------|--------|
| 1 | Coordinar visita | Comercial | Interno | - | Sí |
| 2 | Auditoría in-situ | Técnica | Interno | - | Sí |
| 3 | Solicitar diagramas | Cliente | Técnico | Técnico | Sí |
| 4 | Redactar informe | Técnica | Interno | - | Sí |

[ + AGREGAR TAREA A ESTA FASE ]
```

---

## 6. FLUJOS PRINCIPALES

### 6.1 Creación automática de tareas desde plantilla

**Disparador:** Proyecto cambia a una nueva fase.

1. Sistema identifica la fase destino.
2. Consulta plantillas activas para esa fase.
3. Para cada plantilla:
   - Crea una tarea con los datos de la plantilla (categoría, nombre, descripción, etc.).
   - Si `asignacion_default = Interno`:
     - Asigna al responsable del proyecto (o al rol correspondiente según categoría, si se especifica).
   - Si `asignacion_default = Cliente` y hay `tipo_contacto_destino`:
     - Busca en los contactos activos de la empresa cliente el primer contacto con ese tipo.
     - Si existe, asigna a ese contacto (`contacto_cliente_id`).
     - Si no, asigna al contacto principal (y registra advertencia en historial).
   - Establece fecha de vencimiento según `dias_estimados`.
   - Guarda orden.
4. Registra en historial y dispara notificaciones.

### 6.2 Creación manual de tarea

1. Usuario con permisos (según rol y proyecto) hace clic en "+ NUEVA TAREA".
2. Completa formulario, seleccionando categoría según su rol (solo las permitidas).
3. Si asigna a cliente, debe elegir un contacto específico de la empresa.
4. Puede añadir dependencias con tipos (bloqueante, inicio después, fin después) y opcionalmente días de desplazamiento.
5. Al guardar, se crea la tarea con estado "Pendiente". Se validan dependencias (sin ciclos).

### 6.3 Gestión de dependencias avanzadas

- **Bloqueante:** La tarea no puede iniciarse (estado "Bloqueada") hasta que la tarea de la que depende esté completada.
- **Inicio después:** La tarea no puede iniciarse hasta que hayan pasado X días desde el inicio de la tarea de la que depende (o desde su finalización, según configuración). Se puede especificar un desplazamiento en días.
- **Fin después:** La tarea no puede finalizarse hasta que hayan pasado X días desde la finalización de la otra tarea.

El sistema verificará automáticamente estas condiciones al intentar cambiar el estado de una tarea.

### 6.4 Cliente completa una tarea

1. Cliente accede a su portal, ve tarea asignada.
2. Hace clic en "Completar" o sube archivo si es requerido.
3. Sistema:
   - Cambia estado a "Completada".
   - Registra fecha.
   - Notifica al equipo interno (según categoría).
   - Si la tarea era la última de la fase, sugiere avanzar de fase.

### 6.5 Cliente reabre una tarea (dentro de 3 días)

1. Cliente ve tarea completada, hace clic en "[¿Reabrir?]".
2. Modal: "¿Reabrir esta tarea? Se notificará al equipo. Tienes hasta 3 días después de completada para reabrirla."
3. Si confirma:
   - Tarea vuelve a "Pendiente".
   - Notifica al equipo.
   - Se registra en historial.

Si han pasado más de 3 días, la opción no aparece.

### 6.6 Tareas recurrentes

(Similar al original, pero ahora con categoría y tipo de contacto destino para las de cliente). n8n ejecuta un cron diario que consulta las tareas recurrentes con `proxima_generacion = hoy` y `activa = true`. Para cada una:

- Si es interna, asigna al responsable según la configuración.
- Si es de cliente, asigna al contacto del tipo especificado (o principal).
- Crea la tarea con la categoría correspondiente.
- Actualiza `proxima_generacion` según intervalo.
- Notifica al responsable (si es interna) o al equipo (si es de cliente).

Si la tarea recurrente tiene `proyecto_id` null, se considera global y se asigna a todos los proyectos que cumplan cierta condición (por definir). Por simplicidad inicial, las recurrentes estarán asociadas a un proyecto específico.

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
| **RN-TAR-13** | **Un cliente puede REABRIR una tarea que él mismo completó, hasta 3 días después. Pasado ese plazo, debe contactar al equipo.** |
| RN-TAR-14 | Las tareas recurrentes NOTIFICAN al responsable en la fecha programada, quien decide generar, reprogramar o detener. |
| RN-TAR-15 | Si una tarea recurrente no recibe respuesta tras 3 recordatorios, se PAUSA automáticamente. |
| RN-TAR-16 | Por defecto, en la vista de proyecto solo se muestra la fase actual. El usuario puede expandir para ver fases anteriores. |
| RN-TAR-17 | Una tarea no puede tener `asignado_a_cliente = true` y `responsable_id` definido simultáneamente. |
| **RN-TAR-18** | **La categoría de la tarea es obligatoria y determina qué roles pueden verla/gestionarla.** |
| **RN-TAR-19** | **Los usuarios con rol Compras tienen un dashboard específico que muestra solo tareas de categoría Compras.** |
| **RN-TAR-20** | **Las dependencias pueden ser de tipo bloqueante, inicio-después o fin-después, con posible desplazamiento en días. El sistema valida que no haya ciclos.** |
| **RN-TAR-21** | **Cuando un proyecto pasa a estado "cerrado", todas sus tareas pasan a ser solo lectura. Si el proyecto se reabre, las tareas vuelven a su estado anterior (las pendientes siguen pendientes).** |
| **RN-TAR-22** | **Las plantillas de tareas por fase solo pueden ser modificadas por el administrador, para garantizar la mejora continua del proceso.** |

---

## 8. VALIDACIONES POR CAMPO

### Crear/Editar Tarea
| Campo | Validación | Mensaje |
|-------|------------|---------|
| nombre | Obligatorio, mínimo 5 caracteres | "El nombre de la tarea es obligatorio" |
| categoria | Obligatorio | "Debe seleccionar una categoría" |
| proyecto_id | Debe existir y estar activo (no cerrado) | "El proyecto no está activo" |
| responsable_id | Si es interna, debe ser un usuario con rol acorde a la categoría | "El responsable no tiene permisos para esta categoría" |
| contacto_cliente_id | Si es de cliente, debe ser un contacto activo de la empresa | "El contacto seleccionado no es válido" |
| fecha_vencimiento | No puede ser anterior a hoy (opcional) | "La fecha de vencimiento no puede ser en el pasado" |
| dependencias | No pueden crear ciclos | "Las dependencias no pueden ser circulares" |

---

## 9. MENSAJES PARA EL USUARIO

| Situación | Mensaje |
|-----------|---------|
| Tarea creada | "Tarea creada correctamente" |
| Tarea completada | "¡Tarea completada! Bien hecho." |
| Cliente reabre tarea | (Notificación interna) "El cliente reabrió la tarea [nombre]" |
| Intento de editar tarea en proyecto cerrado | "No se puede modificar una tarea de un proyecto cerrado" |
| Dependencia no satisfecha | "No se puede completar esta tarea porque tiene dependencias pendientes" |

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

---

## 11. OPCIONES DE CONFIGURACIÓN (Para Admin)

- [ ] Días para reabrir tareas de cliente: [3] días
- [ ] Recordatorios automáticos de vencimiento: [2] días antes
- [ ] Permitir a técnicos ver tareas de otros técnicos en el mismo proyecto: [✔] Sí (solo lectura)
- [ ] Categorías activas: [✔] Comercial, Técnica, Compras, Administrativa, General

---

## 12. MÉTRICAS (Para dashboard interno)

- Tareas por categoría
- Tareas completadas vs pendientes por rol
- Tiempo promedio de resolución por categoría
- Tareas reabiertas por clientes (índice de corrección)
- Tareas recurrentes activas por categoría

---