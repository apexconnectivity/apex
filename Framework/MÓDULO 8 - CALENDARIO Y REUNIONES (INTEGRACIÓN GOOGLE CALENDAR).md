## MÓDULO 8: CALENDARIO Y REUNIONES 
### Especificación Detallada

---

## 1. PROPÓSITO DEL MÓDULO

Gestionar todas las reuniones relacionadas con proyectos y soporte, tanto las programadas internamente como las solicitadas por clientes a través del portal. La integración con Google Calendar permite sincronización automática, evitar doble agendamiento y dar una imagen profesional. Cada reunión queda asociada al contacto que la solicitó (si es cliente) o al organizador interno, y se respetan los permisos según los roles definidos.

---

## 2. ACTORES Y PERMISOS

| Actor | Puede ver | Puede crear | Puede editar/cancelar | Puede gestionar solicitudes |
|-------|-----------|-------------|-----------------------|-----------------------------|
| **Administrador** | Todas las reuniones de todos los proyectos | Sí | Sí | Sí |
| **Técnico** | Reuniones de proyectos en los que está asignado (como organizador o asistente) | Sí (propias) | Sí (propias) | Sí (solicitudes dirigidas a proyectos donde es responsable) |
| **Comercial** | Reuniones de proyectos en fases 1-3 donde sea organizador o asistente | Sí (propias) | Sí (propias) | Sí (solicitudes de sus proyectos) |
| **Compras** | Reuniones de proyectos con necesidades de compra (solo si asiste) | No | No | No |
| **Facturación** | Reuniones de facturación (solo si asiste) | No | No | No |
| **Marketing** | Ninguna | - | - | - |
| **Cliente** | Solo sus reuniones (las que solicitó o en las que participa) | Sí (solicitar) | No (solo cancelar con aviso) | No |

---

## 3. ESTRUCTURA DE DATOS

### 3.1 Entidad: REUNION

| Campo | Tipo | Descripción | Obligatorio |
|-------|------|-------------|-------------|
| id | UUID | Identificador único | Auto |
| proyecto_id | UUID | Proyecto asociado | Sí |
| **solicitado_por_contacto_id** | UUID | Contacto cliente que solicitó (si aplica) | No |
| titulo | string | Ej: "Reunión de diagnóstico" | Sí |
| descripcion | text | Orden del día, detalles | No |
| fecha_hora_inicio | timestamp | | Sí |
| fecha_hora_fin | timestamp | | Sí |
| duracion_minutos | integer | Calculado | Auto |
| tipo | enum | Diagnóstico / Seguimiento / Propuesta / Cierre / Soporte / Otro | Sí |
| organizador_id | UUID | Usuario interno que organiza | Sí |
| asistentes_internos | UUID[] | Técnicos/comerciales que deben asistir | No |
| **asistente_cliente_id** | UUID | Contacto del cliente que asistirá (si es reunión con cliente) | No |
| ubicacion | string | Física o link de Meet | No |
| google_event_id | string | ID del evento en Google Calendar | No |
| meet_link | string | Link de Google Meet (si aplica) | No |
| estado | enum | Programada / Confirmada / Cancelada / Completada | Sí |
| solicitada_por_cliente | boolean | True si la creó el cliente (a través de solicitud) | Sí |
| confirmada_por | UUID | Quién confirmó | No |
| google_sync_estado | enum | `pendiente` / `sincronizado` / `error` | Sí (default: pendiente) |
| google_sync_intentos | integer | Número de intentos fallidos | Sí (default: 0) |
| notificacion_enviada | boolean | | No |
| creado_en | timestamp | | Auto |

### 3.2 Entidad: SOLICITUD_REUNION (Pendiente de confirmación)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | |
| proyecto_id | UUID | |
| **contacto_solicitante_id** | UUID | Contacto que solicita (FK a contactos) |
| fecha_solicitada | date | |
| hora_solicitada | time | |
| duracion | integer | Minutos |
| motivo | string | |
| comentarios | text | |
| estado | enum | Pendiente / Aprobada / Rechazada / Reprogramada |
| fecha_solicitud | timestamp | |
| respondida_por | UUID | Usuario interno que respondió |
| respuesta_fecha | timestamp | |
| reunion_generada_id | UUID | Si se aprobó, ID de la reunión creada |

---

## 4. PANTALLAS (Wireframes Descriptivos)

### 4.1 Calendario General (Vista Interna)

(Similar al original, con filtros por proyecto y responsable)

### 4.2 Vista de Reuniones por Proyecto (Interno)

```
+----------------------------------------------------------+
|  REUNIONES - Implementación Firewall            [ + NUEVA ]
|  Cliente: Soluciones Tecnológicas SA                     |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  PRÓXIMAS (2)                                             |
|                                                           |
|  +------------------------------------------------------+ |
|  | 📅 15/06/2026 11:00 - 12:00                          | |
|  | Diagnóstico de seguimiento                            | |
|  | Organiza: Carlos · Asistentes: Juan, Laura            | |
|  | Cliente: Juan Pérez (solicitante)                     | |
|  | 📍 Google Meet: [link]                                | |
|  | [Editar] [Cancelar] [Ver en Calendar]                 | |
|  +------------------------------------------------------+ |
+----------------------------------------------------------+
```

### 4.3 Detalle de Reunión

(Similar al original, pero mostrando el contacto solicitante si aplica)

### 4.4 Crear/Editar Reunión (Interno)

(Similar, con campo para seleccionar contacto cliente si es con cliente)

### 4.5 Solicitud de Reunión (Cliente) - desde portal

(Similar al original, con selector de proyecto y motivo)

### 4.6 Gestión de Solicitudes (Interno)

```
+----------------------------------------------------------+
|  SOLICITUDES DE REUNIÓN                          [Pendientes]
+----------------------------------------------------------+

+----------------------------------------------------------+
|  PENDIENTES (3)                                           |
|  +------------------------------------------------------+ |
|  | Cliente: Soluciones Tecnológicas SA                  | |
|  | Proyecto: Implementación Firewall                    | |
|  | Solicitante: Juan Pérez (CTO)                        | |
|  | Fecha solicitada: 17/06/2026 11:00 (30 min)          | |
|  | Motivo: Seguimiento                                   | |
|  | Comentario: "Necesito confirmar detalles..."         | |
|  | [Aprobar y agendar] [Reprogramar] [Rechazar]         | |
|  +------------------------------------------------------+ |
+----------------------------------------------------------+
```

---

## 5. FLUJOS PRINCIPALES

### 5.1 Cliente solicita reunión (desde portal)

1. Cliente completa formulario de solicitud (proyecto, fecha, hora, duración, motivo, comentarios).
2. Sistema:
   - Guarda solicitud en estado "Pendiente", asociada al `contacto_solicitante_id`.
   - Notifica al responsable del proyecto (según rol: si proyecto en fase 1-3, notifica a comercial; si fase 4-5, notifica a técnico; por defecto, al organizador del proyecto o a un equipo designado).
   - Muestra mensaje al cliente: "Solicitud enviada. Te confirmaremos a la brevedad."

### 5.2 Interno gestiona solicitud

1. Desde listado de solicitudes (filtrado por proyectos donde tiene permisos), ve las pendientes.
2. Opciones:

| Opción | Acción |
|--------|--------|
| **Aprobar y agendar** | - Redirige a formulario de nueva reunión con datos precargados (proyecto, título sugerido "Reunión: [motivo]", fecha/hora propuesta, duración, cliente asistente = solicitante).<br>- El interno puede modificar fecha/hora si es necesario.<br>- Al guardar, se crea la reunión (con `solicitado_por_contacto_id` = solicitante, `asistente_cliente_id` = solicitante, `solicitada_por_cliente` = true).<br>- Se envía invitación al cliente (email con evento de Google Calendar).<br>- La solicitud pasa a "Aprobada". |
| **Reprogramar** | - Modal: "Sugerir nueva fecha/hora" (selector).<br>- Se envía email al cliente con la propuesta y un enlace para aceptar o rechazar (o simplemente se le informa y debe responder por otro medio). Por simplicidad, podemos hacer que el interno reprograme y se notifique al cliente, quien deberá confirmar si le va bien. Si el cliente acepta, se puede marcar como aprobada y crear la reunión. O podemos mantener la opción de "Reprogramar" como una contrapropuesta que el cliente debe confirmar (más complejo). Por ahora, lo haremos simple: el interno sugiere nueva fecha, se notifica al cliente, y se queda la solicitud en "Reprogramada" a la espera de que el cliente acepte (mediante un link o simplemente respondiendo). Para MVP, podemos omitir la aceptación explícita y asumir que el cliente confirma por otro medio; entonces el interno puede aprobar directamente con la nueva fecha. |
| **Rechazar** | - Modal: "Motivo del rechazo".<br>- Se envía email al cliente explicando el motivo.<br>- Solicitud pasa a "Rechazada". |

### 5.3 Creación manual de reunión (interno)

1. Usuario con permisos hace clic en "+ NUEVA REUNIÓN" desde el proyecto.
2. Completa formulario, pudiendo seleccionar un contacto cliente como asistente (si es con cliente). También puede invitar a otros internos.
3. Opción: "Enviar invitación al cliente" (si hay asistente cliente).
4. Al guardar:
   - Crea evento en Google Calendar (con los asistentes internos y el cliente si tiene email).
   - Guarda en BD.
   - Notifica a asistentes internos (Slack/email).
   - Si es con cliente, se le envía invitación por email.

### 5.4 Cancelación de reunión

1. Desde detalle de reunión, botón "Cancelar" (solo para usuarios con permiso: admin, organizador, o el cliente que la solicitó? El cliente puede cancelar solo las que él solicitó, con aviso).
2. Modal: "¿Cancelar reunión? Se notificará a los asistentes." Opcional: motivo.
3. Confirma:
   - Elimina evento de Google Calendar (o marca como cancelado).
   - Envía notificaciones de cancelación.
   - Cambia estado a "Cancelada".

### 5.5 Reprogramación

1. Desde detalle, botón "REPROGRAMAR" (solo para internos con permiso).
2. Modal con selector de nueva fecha/hora.
3. Guarda:
   - Actualiza evento en Google Calendar.
   - Envía notificaciones de cambio.
   - Registra en historial.

### 5.6 Recordatorio automático

- X horas antes de la reunión (configurable), sistema envía:
  - Email al cliente con link de Meet.
  - Notificación en Slack a asistentes internos.
  - Se marca `notificacion_enviada = true`.

### 5.7 Manejo al cerrar un proyecto

- Cuando un proyecto pasa a estado "cerrado", el sistema detecta reuniones futuras (fecha_hora_inicio > now) asociadas a ese proyecto.
- Envía una notificación al organizador de cada reunión: "El proyecto [nombre] ha sido cerrado. Tienes una reunión programada para el [fecha]. ¿Deseas cancelarla o reprogramarla?"
- El organizador puede cancelar o dejar la reunión (si aún tiene sentido, por ejemplo, para temas post-cierre). No se cancelan automáticamente.

---

## 6. REGLAS DE NEGOCIO ESPECÍFICAS (RN-CAL-xx) - ACTUALIZADAS

| ID | Regla |
|----|-------|
| RN-CAL-01 | Un cliente SOLO puede solicitar reuniones para proyectos activos. |
| RN-CAL-02 | No se pueden agendar dos reuniones para el mismo técnico en el mismo horario (validar disponibilidad contra BD). |
| RN-CAL-03 | Las solicitudes de reunión sin respuesta en 48h pasan a estado "Vencida" y se notifica al cliente. |
| RN-CAL-04 | Una reunión cancelada con menos de 2h de anticipación notifica URGENTE al organizador. |
| RN-CAL-05 | Las reuniones con cliente SIEMPRE generan un evento en Google Calendar (con invitación al cliente si tiene email). |
| RN-CAL-06 | Las reuniones internas pueden no generar invitación a cliente. |
| RN-CAL-07 | Al completar una reunión (estado "Completada"), se puede agregar un resumen o minuta (campo de texto en el detalle). |
| RN-CAL-08 | (Futuro) Las reuniones de soporte pueden descontar horas del contrato si se asocian a un contrato. |
| RN-CAL-09 | Una reunión puede existir con `google_sync_estado = error` si la sincronización falló; se muestra advertencia y botón "Reintentar". |
| **RN-CAL-10** | **Las solicitudes de reunión quedan asociadas al contacto que las realizó.** |
| **RN-CAL-11** | **Al cerrar un proyecto, se notifica al organizador de reuniones futuras para que decida su cancelación.** |

---

## 7. VALIDACIONES

| Situación | Validación | Mensaje |
|-----------|------------|---------|
| Nueva reunión (interno) | Fecha/hora no puede ser pasada | "No puedes agendar reuniones en el pasado" |
| Nueva reunión (interno) | Disponibilidad del organizador y asistentes internos | "El usuario [nombre] ya tiene una reunión en ese horario" |
| Solicitud cliente | Fecha/hora en horario laboral (opcional, configurable) | "Selecciona un horario dentro de nuestra disponibilidad (9-18hs)" |
| Cancelación con menos de 2h | Aviso | "¿Cancelar con tan poca anticipación? Se notificará como URGENTE." |

---

## 8. MENSAJES PARA EL USUARIO

| Situación | Mensaje |
|-----------|---------|
| Reunión creada (interno) | "Reunión agendada correctamente. Se han enviado las invitaciones." |
| Solicitud enviada (cliente) | "Solicitud enviada. Te confirmaremos a la brevedad." |
| Solicitud aprobada | "Tu solicitud de reunión ha sido aprobada. Revisa tu email." |
| Solicitud rechazada | "Tu solicitud de reunión no pudo ser agendada. Motivo: [motivo]" |
| Recordatorio | "Recordatorio: Tienes una reunión en 2 horas con [cliente/proyecto]" |

---

## 9. DEPENDENCIAS CON OTROS MÓDULOS

| Módulo | Dependencia |
|--------|-------------|
| **Proyectos (M3)** | Las reuniones se asocian a proyectos. |
| **CRM (M2)** | Los contactos de clientes se usan como asistentes y solicitantes. |
| **Autenticación (M1)** | Roles para permisos. |
| **Portal Cliente (M7)** | Los clientes solicitan reuniones desde el portal. |
| **Notificaciones (M9)** | Recordatorios, notificaciones de solicitudes. |

---

## 10. OPCIONES DE CONFIGURACIÓN (Para Admin)

- [ ] Horario laboral: [9:00] a [18:00]
- [ ] Días laborales: [Lunes a Viernes]
- [ ] Tiempo mínimo entre reuniones: [15] minutos
- [ ] Recordatorio automático: [2] horas antes
- [ ] Tiempo máximo para responder solicitudes: [48] horas

---

## 11. MÉTRICAS (Para dashboard interno)

- Reuniones por mes / por técnico / por comercial
- Solicitudes de reunión (aprobadas vs rechazadas)
- Tiempo promedio de respuesta a solicitudes
- Reuniones canceladas / reprogramadas

---