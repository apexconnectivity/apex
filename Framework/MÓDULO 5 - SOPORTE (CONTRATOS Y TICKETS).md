## MÓDULO 5: SOPORTE (CONTRATOS Y TICKETS)
### Especificación Detallada

---

## 1. PROPÓSITO DEL MÓDULO

Gestionar la relación de soporte continuo con los clientes, ya sea como servicio independiente o como continuación de un proyecto de implementación. Este módulo maneja contratos de soporte, tickets de incidencia con categorías (técnico, comercial, facturación, compras), asignación automática basada en reglas, control de horas consumidas, acuerdos de nivel de servicio (SLA) y un pipeline visual para seguimiento. Se integra con los roles definidos en autenticación y con la información de clientes y proyectos del CRM.

---

## 2. ACTORES Y PERMISOS

| Actor | Puede ver | Puede crear | Puede editar | Puede mover tickets | Puede cerrar |
|-------|-----------|-------------|--------------|---------------------|--------------|
| **Administrador** | Todos los contratos y tickets | Sí | Sí | Sí | Sí |
| **Técnico** | Tickets de categoría **Soporte técnico** asignados a él o a proyectos/contratos donde participa | Sí (tickets de soporte técnico) | Sí (los propios) | Sí (los propios) | Sí (los propios) |
| **Comercial** | Tickets de categoría **Consulta comercial** y también puede ver (solo lectura) los tickets de soporte de sus clientes asignados | Sí (tickets comerciales) | No (solo comentar) | No | No |
| **Compras** | Tickets de categoría **Compras** | Sí (tickets de compras) | Sí (los propios) | Sí (los propios) | Sí (los propios) |
| **Facturación** | Tickets de categoría **Facturación** | Sí (tickets de facturación) | Sí (los propios) | Sí (los propios) | Sí (los propios) |
| **Marketing** | Ninguno | - | - | - | - |
| **Cliente** | Solo sus tickets (de cualquier categoría) | Sí | No (solo comentar) | No | No |

**Nota:** Un usuario con múltiples roles tendrá acceso a los tickets de todas las categorías que le correspondan.

---

## 3. ESTRUCTURA DE DATOS

### 3.1 Entidad: CONTRATO_SOPORTE

| Campo | Tipo | Descripción | Obligatorio |
|-------|------|-------------|-------------|
| id | UUID | Identificador único | Auto |
| empresa_id | UUID | Cliente asociado (FK a empresas) | Sí |
| proyecto_origen_id | UUID | Proyecto que dio origen (opcional) | No |
| nombre | string | Identificación del contrato | Sí |
| tipo | enum | Soporte básico / Premium / 24x7 / Monitoreo | Sí |
| fecha_inicio | date | | Sí |
| fecha_fin | date | | Sí |
| renovacion_automatica | boolean | | Sí (default: true) |
| estado | enum | Activo / En renovación / Vencido / Cancelado | Sí |
| moneda | enum | USD / MXN | Sí |
| monto_mensual | decimal | | Sí |
| **horas_incluidas_mes** | integer | Horas de soporte incluidas por mes | No |
| **horas_consumidas_mes** | integer | Horas consumidas en el mes actual (se reinicia mensualmente) | No (default: 0) |
| contacto_principal_id | UUID | Contacto del cliente para temas administrativos | Sí |
| contacto_tecnico_id | UUID | Contacto para incidencias | Sí |
| **tecnico_asignado_id** | UUID | Técnico interno responsable del contrato (FK a usuarios) | Sí |
| notas | text | | No |
| creado_en | timestamp | | Auto |

### 3.2 Entidad: TICKET (Pipeline de Soporte)

| Campo | Tipo | Descripción | Obligatorio |
|-------|------|-------------|-------------|
| id | UUID | Identificador único | Auto |
| numero_ticket | string | Formato: TK-{año}-{número correlativo} | Auto |
| contrato_id | UUID | Contrato al que pertenece (si es ticket de soporte) | Solo si `tipo_origen = soporte` |
| proyecto_id | UUID | Proyecto relacionado (si es ticket de proyecto) | Solo si `tipo_origen = proyecto` |
| tipo_origen | enum | `soporte` / `proyecto` | Sí |
| **categoria** | enum | **Soporte técnico / Consulta comercial / Facturación / Compras / Otro** | Sí |
| titulo | string | Resumen de la incidencia | Sí |
| descripcion | text | Detalle del problema | Sí |
| creado_por | UUID | Usuario (cliente o interno) | Auto |
| creado_por_cliente | boolean | True si lo abrió el cliente | Sí |
| fecha_apertura | timestamp | | Auto |
| fecha_cierre | timestamp | | Null |
| estado | enum | Abierto / En progreso / Esperando cliente / Resuelto / Cerrado | Sí |
| prioridad | enum | Baja / Media / Alta / Urgente | Sí |
| **fecha_limite_respuesta** | timestamp | Calculado según SLA al crear el ticket | No |
| **fecha_limite_resolucion** | timestamp | Calculado según SLA | No |
| **fecha_primera_respuesta** | timestamp | Cuando un interno comenta o asigna | No |
| **tiempo_respuesta_minutos** | integer | Minutos desde apertura hasta primera respuesta | No |
| **tiempo_resolucion_minutos** | integer | Minutos desde apertura hasta cierre | No |
| responsable_id | UUID | Técnico/comercial/compras/facturación asignado según categoría | No (se asigna automáticamente) |
| **tiempo_invertido_minutos** | integer | Tiempo total dedicado al ticket (sumado por los técnicos) | No (default: 0) |
| satisfaccion_cliente | integer | 1-5 (encuesta post cierre) | No |

### 3.3 Entidad: COMENTARIO_TICKET

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | |
| ticket_id | UUID | |
| usuario_id | UUID | Quién comenta |
| es_interno | boolean | True = solo visible para equipo, False = visible para cliente |
| comentario | text | |
| fecha | timestamp | |
| adjuntos | UUID[] | Archivos asociados |

### 3.4 Entidad: ARCHIVO_TICKET (relación con Módulo 6)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | |
| ticket_id | UUID | |
| archivo_id | UUID | Referencia al archivo en Drive |
| subido_por | UUID | |
| fecha | timestamp | |

### 3.5 Entidad: REGLA_SLA (Configuración global)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | |
| prioridad | enum | Baja / Media / Alta / Urgente |
| tiempo_respuesta_horas | integer | Horas máximas para primera respuesta |
| tiempo_resolucion_horas | integer | Horas máximas para resolución |
| activo | boolean | |

*Por defecto, se cargarán valores iniciales (ej. Baja: 48h/120h, Media: 24h/72h, Alta: 8h/24h, Urgente: 2h/8h). El admin puede modificarlos.*

---

## 4. PIPELINE DE TICKETS (Columnas Fijas)

(Similar al original, pero las tarjetas muestran la categoría y un indicador de SLA (ej. ⚠ si está próximo a vencer))

---

## 5. PANTALLAS (Wireframes Descriptivos)

### 5.1 Listado de Contratos de Soporte (con filtros por estado y técnico asignado)

(Similar al original, añadiendo columna "Técnico asignado" y "Horas consumidas/mes")

### 5.2 Detalle de Contrato de Soporte (con control de horas)

```
+----------------------------------------------------------+
|  CONTRATO: Soporte Premium - Soluciones Tec      [Editar] |
+----------------------------------------------------------+

+------------------------+----------------------------------+
| INFORMACIÓN GENERAL    |  CONTACTOS                       |
| Cliente: Soluciones    |  Administrativo: Juan Pérez      |
|   Tecnológicas SA      |  Técnico: María García           |
| Tipo: Premium          |                                   |
| Estado: ● Activo        |  Técnico asignado interno:        |
| Inicio: 01/03/2026     |  Carlos Rodríguez                 |
| Fin: 01/03/2027        |                                   |
+------------------------+----------------------------------+

+------------------------+----------------------------------+
| HORAS DE SOPORTE       |  TICKETS DEL CONTRATO             |
| Incluidas por mes: 10h |  Abiertos: 2                      |
| Consumidas este mes: 3.5h | En progreso: 1                  |
| Restantes: 6.5h        |  Esperando cliente: 1              |
| [Registrar horas]      |  Resueltos este mes: 5            |
| (Al cerrar un ticket,   |  [Ver todos]                      |
|  se suman las horas)    |                                   |
+------------------------+----------------------------------+

+----------------------------------------------------------+
|  NOTAS                                                    |
|  Cliente con horario crítico: 8-20 hs.                   |
+----------------------------------------------------------+
```

### 5.3 Pipeline de Tickets (con categorías y colores de SLA)

```
+----------------------------------------------------------+
|  TICKETS - Soluciones Tecnológicas SA          [ + NUEVO TICKET ]
|  Contrato: Soporte Premium                               |
+----------------------------------------------------------+

+-----------------+-----------------+-----------------+-----------------+
|   ABIERTO       |  EN PROGRESO    | ESPERANDO       |   RESUELTO      |
|                 |                 | CLIENTE         |                 |
+=================+=================+=================+=================+
| +-------------+ | +-------------+ | +-------------+ | +-------------+ |
| | TK-2026-023 | | | TK-2026-018 | | | TK-2026-015 | | | TK-2026-010 | |
| | "No hay     | | | "Firewall   | | | "Lentitud   | | | "Actualizar  | |
| | conexión"   | | | caído"      | | | en acceso"  | | | certificado" | |
| | 🔴 Urgente   | | | 🟡 Media     | | | 🟢 Baja      | | | 🟢 Baja      | |
| | Categoría:  | | | Categoría:  | | | Categoría:  | | | Categoría:  | |
| | Soporte téc | | | Soporte téc | | | Consulta    | | | Facturación | |
| | SLA: ⚠ (2h) | | | SLA: ✅      | | | SLA: ✅      | | |             | |
| | Resp: Carlos| | | Resp: Laura | | | Resp: (comercial)| | |             | |
| +-------------+ | +-------------+ | +-------------+ | +-------------+ |
+-----------------+-----------------+-----------------+-----------------+
```

### 5.4 Detalle de Ticket (con campos de SLA y horas)

```
+----------------------------------------------------------+
|  TICKET: TK-2026-023 - No hay conexión desde sede norte   [✖ Cerrar]
+----------------------------------------------------------+

+----------------------------------------------------------+
|  Información General                                      |
|  Abierto: 10/06/2026 10:30 por María García (cliente)    |
|  Categoría: Soporte técnico                               |
|  Estado: ● Abierto                                         |
|  Prioridad: 🔴 URGENTE                                     |
|  Responsable: Carlos Rodríguez (asignado automáticamente) |
|                                                           |
|  SLA:                                                      |
|  - Límite de respuesta: 10/06 12:30 (hace 2h) ⚠ EXCEDIDO |
|  - Límite de resolución: 10/06 18:30                      |
|  - Primera respuesta: (pendiente)                          |
|                                                           |
|  Descripción:                                             |
|  Desde esta mañana, la sede norte no tiene conexión...    |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  TIEMPO INVERTIDO (horas consumidas)                      |
|  [Registrar tiempo]  Total: 0h (se actualizará al cerrar) |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  COMENTARIOS                                              |
|  Sistema - 10/06 10:31                                    |
|  > Ticket asignado a Carlos automáticamente.              |
|  [Escribe un comentario...]                      [Enviar] |
|  [✔] Comentario interno                                   |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  ACCIONES                                                 |
|  [ASIGNAR A...]  [CAMBIAR ESTADO]  [CAMBIAR PRIORIDAD]   |
|  [RESOLVER] [CERRAR] [REGISTRAR HORAS]                    |
+----------------------------------------------------------+
```

### 5.5 Nuevo Ticket (Cliente - Portal) con categorías

```
+----------------------------------------------------------+
|  NUEVO TICKET DE SOPORTE                       [Enviar]  |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  Contrato: Soporte Premium (válido hasta 01/03/2027)     |
|  Horas consumidas este mes: 3.5 / 10                      |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  Categoría*:                                              |
|  (●) Soporte técnico                                      |
|  ( ) Consulta comercial                                   |
|  ( ) Facturación                                          |
|  ( ) Otro                                                 |
|                                                           |
|  Prioridad*: ( ) Baja  (●) Media  ( ) Alta  ( ) Urgente  |
|  Título*: [_____________________________________________] |
|  Descripción*: [______________________________________]   |
|  Archivos adjuntos: [Seleccionar archivos]               |
+----------------------------------------------------------+
```

### 5.6 Nuevo Ticket (Interno) con asignación automática

```
+----------------------------------------------------------+
|  NUEVO TICKET (INTERNO)                         [Guardar]|
+----------------------------------------------------------+

+----------------------------------------------------------+
|  Cliente*: [Soluciones Tecnológicas SA____________]      |
|  Contrato*: [Soporte Premium______________________]      |
|  Proyecto relacionado (opcional): [Implementación...]    |
|                                                           |
|  Abierto por: (●) A nombre del cliente                    |
|              ( ) Interno (seguimiento propio)             |
|                                                           |
|  Categoría*: [Soporte técnico ▼]                          |
|  (Al seleccionar categoría, se asignará automáticamente   |
|   al responsable según reglas)                            |
|                                                           |
|  Prioridad*: ( ) Baja  (●) Media  ( ) Alta  ( ) Urgente  |
|  Título*: [_____________________________________________] |
|  Descripción*: [______________________________________]   |
|  Archivos adjuntos: [Seleccionar archivos]               |
+----------------------------------------------------------+
```

---

## 6. FLUJOS PRINCIPALES

### 6.1 Creación de contrato de soporte

(Similar al original, pero ahora con campo `tecnico_asignado_id` obligatorio)

### 6.2 Cliente abre un ticket (desde portal)

1. Cliente selecciona categoría (Soporte técnico, Consulta comercial, Facturación, Otro).
2. Completa título, descripción, prioridad y adjuntos.
3. Al enviar:
   - Se genera número de ticket.
   - Se asigna automáticamente según reglas (ver 6.4).
   - Se calculan fechas límite de SLA según prioridad.
   - Queda en estado "Abierto".
   - Se notifica al responsable asignado.

### 6.3 Interno abre un ticket (a nombre del cliente o interno)

1. Usuario interno selecciona cliente y contrato (si aplica).
2. Elige categoría. Según la categoría, el sistema sugiere un responsable (basado en reglas), pero puede cambiarlo manualmente.
3. Completa datos.
4. Al guardar, similar al anterior.

### 6.4 Reglas de asignación automática por categoría

| Categoría | Criterio de asignación |
|-----------|------------------------|
| **Soporte técnico** | Si es ticket de proyecto: al `responsable_id` del proyecto (técnico). Si es de contrato: al `tecnico_asignado_id` del contrato. Si no hay, queda sin asignar (alerta a admin). |
| **Consulta comercial** | Al `comercial_asignado_id` de la empresa (campo en EMPRESA). Si no existe, al responsable comercial del proyecto (si es de proyecto) o queda sin asignar. |
| **Facturación** | Al primer usuario con rol `facturacion` (ordenado por fecha de creación, o un grupo). Por simplicidad, se puede asignar a un usuario específico configurable. |
| **Compras** | Al primer usuario con rol `compras`. |
| **Otro** | Queda sin asignar, notifica a admin. |

**Nota:** Se necesita añadir en EMPRESA el campo `comercial_asignado_id` (UUID, FK a usuarios). En CONTRATO_SOPORTE ya tenemos `tecnico_asignado_id`.

### 6.5 Gestión de horas de contrato

- Cada ticket tiene un campo `tiempo_invertido_minutos` que el técnico puede ir registrando (por ejemplo, añadiendo tiempo parcialmente o al cerrar).
- Al cerrar el ticket, se suma el tiempo invertido al contrato del mes actual (campo `horas_consumidas_mes`). Si se excede el límite, se notifica al admin y al área de facturación.
- Las horas se reinician mensualmente (mediante un cron en n8n que actualiza `horas_consumidas_mes = 0` el primer día de cada mes).

### 6.6 SLA y alertas

- Al crear un ticket, se calculan `fecha_limite_respuesta` y `fecha_limite_resolucion` según la prioridad y la configuración global de SLA (regla_sla).
- Cuando un interno realiza la primera acción (comenta, asigna, cambia estado a "En progreso"), se registra `fecha_primera_respuesta` y se calcula `tiempo_respuesta_minutos`.
- Si se acerca el límite (ej. 1 hora antes), n8n envía una alerta al responsable.
- Si se excede el límite, se marca como "SLA incumplido" (campo opcional) y se notifica a admin.
- Al cerrar el ticket, se calcula `tiempo_resolucion_minutos`.

### 6.7 Cierre de tickets por vencimiento de contrato

- Cuando un contrato pasa a estado "Vencido" (por fecha_fin o por acción admin), se ejecuta un proceso:
  - Todos los tickets abiertos asociados a ese contrato pasan a estado "Cerrado" automáticamente, con motivo "Contrato vencido".
  - Se notifica al cliente y al equipo interno.

### 6.8 Tickets recurrentes (futuro)

- Se podrán crear plantillas de tickets recurrentes (similar a tareas recurrentes) asociadas a un contrato. Por ejemplo, "Revisión mensual de firewall" que se genere automáticamente cada mes. Esto se implementaría en una versión posterior, utilizando la misma lógica que tareas recurrentes pero en el contexto de soporte.

---

## 7. REGLAS DE NEGOCIO ESPECÍFICAS (RN-SOP-xx) - ACTUALIZADAS

| ID | Regla |
|----|-------|
| RN-SOP-01 | Un contrato de soporte SOLO puede estar activo para UNA empresa. |
| RN-SOP-02 | Una empresa puede tener MÚLTIPLES contratos de soporte, pero no del mismo tipo simultáneamente. |
| RN-SOP-03 | Los tickets de tipo `soporte` solo pueden crearse si existe un contrato ACTIVO para esa empresa. Los tickets de tipo `proyecto` pueden crearse mientras el proyecto esté activo, sin requerir contrato. |
| RN-SOP-04 | Al abrir un ticket, se asigna automáticamente según la categoría y las reglas definidas. |
| RN-SOP-05 | Cada ticket debe tener una categoría válida. |
| RN-SOP-06 | Al cerrar un ticket, el tiempo invertido se suma al contador mensual del contrato (si aplica). Si se superan las horas incluidas, se notifica a admin y facturación. |
| RN-SOP-07 | Los SLA se calculan al crear el ticket según la prioridad y la configuración global. |
| RN-SOP-08 | Si un cliente comenta en un ticket en estado "Resuelto", el ticket se REABRE automáticamente a "En progreso". |
| RN-SOP-09 | Los tickets en "Esperando cliente" sin respuesta por más de 5 días pasan automáticamente a estado "Resuelto" con motivo "Inactividad del cliente". |
| RN-SOP-10 | Al vencer un contrato, todos sus tickets abiertos se cierran automáticamente con motivo "Contrato vencido". |
| RN-SOP-11 | Los tickets URGENTES notifican por Slack inmediatamente y por email. |
| RN-SOP-12 | Un contrato próximo a vencer (30 días antes) notifica al admin y al comercial asignado. |

---

## 8. VALIDACIONES POR CAMPO

### Contrato de Soporte
| Campo | Validación | Mensaje |
|-------|------------|---------|
| empresa_id | Debe existir y ser de tipo cliente o ambos | "Selecciona un cliente válido" |
| fecha_fin | Posterior a inicio | "La fecha de fin debe ser posterior al inicio" |
| monto_mensual | Número positivo | "Ingresa un monto válido" |
| tecnico_asignado_id | Debe ser un usuario activo con rol técnico | "Selecciona un técnico válido" |

### Ticket
| Campo | Validación | Mensaje |
|-------|------------|---------|
| titulo | Obligatorio, mínimo 10 caracteres | "El título debe describir el problema" |
| descripcion | Obligatorio, mínimo 20 caracteres | "Describe el problema con detalle" |
| categoria | Obligatorio | "Selecciona una categoría" |
| prioridad | Obligatorio | "Selecciona una prioridad" |
| contrato_id | Obligatorio si `tipo_origen = soporte` y debe estar activo | "No hay un contrato activo para esta empresa" |

---

## 9. MENSAJES PARA EL USUARIO

| Situación | Mensaje |
|-----------|---------|
| Contrato creado | "Contrato de soporte activado correctamente" |
| Ticket abierto (cliente) | "Ticket creado. Te contactaremos a la brevedad." |
| Ticket asignado automáticamente | "Ticket asignado a [nombre] según categoría" |
| Ticket resuelto | "Ticket marcado como resuelto. Cliente notificado." |
| Ticket cerrado por vencimiento de contrato | "El contrato ha vencido. El ticket se ha cerrado automáticamente." |
| Horas excedidas | "El ticket ha superado las horas incluidas. Se notificará a facturación." |
| SLA próximo a vencer | "El ticket [número] tiene el SLA de respuesta próximo a vencer." |

---

## 10. DEPENDENCIAS CON OTROS MÓDULOS

| Módulo | Dependencia |
|--------|-------------|
| **CRM (M2)** | Los contratos se asocian a empresas. Se necesita el campo `comercial_asignado_id` en empresa para asignación de tickets comerciales. |
| **Proyectos (M3)** | Un contrato puede originarse de un proyecto. Los tickets de proyecto usan datos del proyecto. |
| **Autenticación (M1)** | Roles para determinar permisos y asignación automática. |
| **Portal Cliente (M7)** | El cliente ve sus tickets y puede abrir nuevos. |
| **Archivos (M6)** | Adjuntos a tickets. |
| **Notificaciones (M9)** | Alertas de SLA, vencimientos, etc. vía n8n. |
| **Tareas (M4)** | Para futuros tickets recurrentes (se podría integrar). |

---

## 11. OPCIONES DE CONFIGURACIÓN (Para Admin)

### Configuración General de Tickets
- [ ] Tiempo máximo en "Esperando cliente" antes de cierre automático: [5] días
- [ ] Notificar a admin cuando un ticket lleva más de [24] horas sin asignar
- [ ] Enviar encuesta de satisfacción al cerrar ticket: [✔] Sí

### Configuración de SLA
- [ ] Editar tiempos de respuesta y resolución por prioridad (tabla Regla SLA)

### Configuración de Asignación Automática
- [ ] Usuario por defecto para tickets de facturación: [seleccionar]
- [ ] Usuario por defecto para tickets de compras: [seleccionar]

### Configuración de Contratos
- [ ] Días antes del vencimiento para notificar: [30] días
- [ ] Renovación automática por defecto: [✔] Sí

---

## 12. MÉTRICAS (Para dashboard interno)

- Tickets abiertos por categoría y prioridad
- Tiempo promedio de respuesta y resolución por prioridad (SLA cumplido vs incumplido)
- Tickets por técnico/comercial/compras
- Horas de soporte consumidas vs facturadas
- Contratos por vencer
- Satisfacción del cliente (promedio)

---

## 13. INTEGRACIÓN CON SLACK (Tickets)

| Evento | Acción en Slack |
|--------|-----------------|
| Nuevo ticket (urgente) | @channel en #soportes-urgentes |
| Nuevo ticket (normal) | Mensaje en canal #tickets según categoría (ej. #tickets-tecnicos, #tickets-comerciales) |
| Ticket asignado | Mensaje directo al responsable |
| Cliente comenta | Notificación al responsable |
| Ticket próximo a vencer SLA | Alerta en canal del equipo |
| Contrato por vencer | Recordatorio en #administracion |

---