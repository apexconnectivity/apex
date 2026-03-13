## MÓDULO 9: NOTIFICACIONES Y AUTOMATIZACIONES (N8N)
### Especificación Detallada

---

## 1. PROPÓSITO DEL MÓDULO

Centralizar todas las notificaciones del sistema (internas y hacia clientes) y orquestar automatizaciones mediante n8n self-hosted en NAS. Este módulo actúa como el "sistema nervioso" de NetOps CRM, asegurando que la información correcta llegue a la persona correcta en el momento correcto, según los roles, asignaciones y preferencias de cada usuario. Se integra con todos los módulos para reaccionar a eventos clave y ejecutar flujos automatizados (Slack, email, Google Calendar, etc.), manteniendo la lógica de negocio fuera de la aplicación principal.

---

## 2. ARQUITECTURA CONCEPTUAL

```
[EVENTO EN LA APP] 
    ↓ (Webhook HTTP)
[n8n EN NAS]
    ↓ (Según flujo configurado)
├──→ Slack (mensajes a canales, DMs, menciones por rol)
├──→ Email (vía SMTP - cliente o interno, con plantillas)
├──→ Google Calendar (crear/modificar eventos)
├──→ Webhook a otros servicios (futuro)
└──→ (Opcional) WhatsApp/Telegram (futuro)
```

**Ventaja:** Toda la lógica "ruidosa" está fuera del código principal. Si mañana cambias Slack por Teams, solo ajustas flujos en n8n, no la app.

**Cron jobs en n8n:** Los procesos programados (recordatorios, alertas de SLA, resúmenes diarios) viven en n8n, que consulta directamente la API REST de Supabase con una service key.

---

## 3. ACTORES Y DESTINOS DE NOTIFICACIONES

### 3.1 Destinos

| Destino | Recibe | Propósito |
|---------|--------|-----------|
| **Slack (canales por proyecto)** | Técnicos, comerciales (segun fase) | Notificaciones operativas, cambios, tareas |
| **Slack (canales temáticos)** | Equipos (soporte, compras, facturación) | Alertas específicas (ej. #alertas-compras, #sla-tickets) |
| **Slack (DM)** | Usuario individual | Tareas asignadas, menciones, notificaciones personales |
| **Email** | Cliente | Tareas, tickets, recordatorios, bienvenidas, facturación |
| **Email** | Interno (según rol) | Alertas, reportes, excepciones |
| **Google Calendar** | Cliente/Interno | Invitaciones a reuniones |

### 3.2 Preferencias de notificación

- **Internos:** Cada usuario puede configurar en su perfil qué eventos desea recibir y por qué canal (email, Slack, ambos o ninguno). También puede activar/desactivar el resumen diario.
- **Clientes:** Desde el portal, pueden configurar qué notificaciones por email desean recibir (tareas, tickets, recordatorios, etc.).

---

## 4. EVENTOS QUE DISPARAN NOTIFICACIONES (TABLA COMPLETA)

### 4.1 Eventos de Proyectos (M3)

| Evento | Destino | Momento | Canal por defecto |
|--------|---------|---------|-------------------|
| Proyecto creado | Slack (canal nuevo) + Email cliente (bienvenida) | Inmediato | Slack canal, email cliente |
| Proyecto cambia de fase | Slack (canal) + Email cliente (opcional) | Inmediato | Slack canal |
| Proyecto próximo a vencer (X días) | Slack (responsable) + Email | Configurable | Slack DM, email |
| Proyecto vencido | Slack (canal) + Email admin | Inmediato | Slack canal, email |
| Proyecto cerrado | Slack (canal) + Email (facturación, comercial) | Inmediato | Slack canal, email |
| Proyecto reabierto | Slack (canal) + Email responsable | Inmediato | Slack canal, email |
| Proyecto archivado | Slack admin (confirmación) | Inmediato | Slack DM admin |
| Proyecto con necesidades de compra sin procesar | Slack (canal #compras) + email compras | Diario | Slack canal, email |

### 4.2 Eventos de Tareas (M4)

| Evento | Destino | Momento | Canal por defecto |
|--------|---------|---------|-------------------|
| Tarea asignada a interno (según categoría) | Slack (DM al responsable) + email | Inmediato | Slack DM, email |
| Tarea asignada a cliente | Email al cliente + Slack (equipo del proyecto) | Inmediato | Email cliente, Slack canal |
| Tarea de compras asignada | Slack (DM a compras) + email | Inmediato | Slack DM, email |
| Tarea próxima a vencer (2 días) | Slack (responsable) + Email cliente (si aplica) | Diario | Slack DM, email |
| Tarea vencida | Slack (canal) + Email responsable | Inmediato | Slack canal, email |
| Tarea completada (por interno) | Slack (canal) | Inmediato | Slack canal |
| Tarea completada (por cliente) | Slack (canal) + Email responsable | Inmediato | Slack canal, email |
| Tarea reabierta (por cliente) | Slack (canal) + Email responsable | Inmediato | Slack canal, email |
| Tarea recurrente pendiente de generar | Slack (responsable) + Email | Fecha programada | Slack DM, email |

### 4.3 Eventos de Tickets (M5)

| Evento | Destino | Momento | Canal por defecto |
|--------|---------|---------|-------------------|
| Ticket nuevo (urgente) | Slack @channel en #soportes-urgentes + email admin | Inmediato | Slack, email |
| Ticket nuevo (normal) | Slack (canal según categoría) | Inmediato | Slack canal |
| Ticket asignado automáticamente | Slack (DM al asignado) + email | Inmediato | Slack DM, email |
| Cliente comenta en ticket | Slack (responsable) + Email | Inmediato | Slack DM, email |
| Técnico comenta en ticket (público) | Email al cliente | Inmediato | Email |
| Ticket resuelto | Email al cliente + Slack (canal) | Inmediato | Email, Slack |
| Ticket cerrado | (opcional) | - | - |
| Ticket sin asignar +24h | Slack admin | Diario | Slack DM |
| Ticket con SLA próximo a vencer | Slack (responsable) + email | Según umbral | Slack DM, email |
| Ticket con SLA incumplido | Slack admin + responsable | Inmediato | Slack DM, email |
| Horas de soporte excedidas | Slack (facturación, admin) + email | Inmediato | Slack, email |

### 4.4 Eventos de Reuniones (M8)

| Evento | Destino | Momento | Canal por defecto |
|--------|---------|---------|-------------------|
| Nueva reunión creada (con cliente) | Email invitación cliente + Slack internos | Inmediato | Email, Slack |
| Reunión cancelada | Email + Slack | Inmediato | Email, Slack |
| Reunión reprogramada | Email + Slack | Inmediato | Email, Slack |
| Recordatorio de reunión (2h antes) | Email + Slack | 2h antes | Email, Slack |
| Solicitud de reunión de cliente | Slack responsable + Email | Inmediato | Slack DM, email |

### 4.5 Eventos de Archivos (M6)

| Evento | Destino | Momento | Canal por defecto |
|--------|---------|---------|-------------------|
| Cliente sube archivo (en tarea/ticket) | Slack canal + email responsable | Inmediato | Slack, email |
| Documento corporativo subido (público) | Notificar a contactos de la empresa (opcional) | Inmediato | Email (si configurado) |
| Espacio en Drive próximo a llenarse | Slack admin | Alerta | Slack DM |

### 4.6 Eventos de Clientes/Contratos (M2, M5)

| Evento | Destino | Momento | Canal por defecto |
|--------|---------|---------|-------------------|
| Contrato próximo a vencer (30 días) | Slack (comercial, facturación) + email cliente | Diario | Slack, email |
| Contrato vencido | Slack (comercial, facturación) + email cliente | Inmediato | Slack, email |
| Nuevo contacto agregado a empresa | Slack (comercial asignado) | Inmediato | Slack DM |
| Empresa sin contacto principal | Slack admin | Diario | Slack DM |
| Prospecto inactivo (>60 días) | Slack (comercial) | Semanal | Slack DM |

### 4.7 Alertas Internas

| Evento | Destino | Momento | Canal por defecto |
|--------|---------|---------|-------------------|
| Error en webhook/integración | Slack admin | Inmediato | Slack DM |
| Intento de acceso fallido (varios) | Slack admin | Inmediato | Slack DM |
| Tarea recurrente pausada por falta respuesta | Slack admin | Inmediato | Slack DM |
| Nuevo usuario interno creado | Slack admin | Inmediato | Slack DM |

---

## 5. FLUJOS EN N8N (EJEMPLOS)

### 5.1 Flujo: Notificar nueva tarea a interno (según categoría)

```
[Webhook] Recibe evento "tarea_creada" con categoría (técnica, comercial, compras, etc.)
    ↓
[Buscar en BD] Obtener usuario responsable (según categoría y asignación)
    ↓
[IF] El usuario tiene preferencia de Slack activada para este evento?
  ├→ Sí → [Slack] Enviar DM:
  │     "📋 Nueva tarea [categoría] asignada: [nombre]
  │      Proyecto: [proyecto]
  │      Vence: [fecha]"
  │
  └→ No → [Email] Enviar correo
    ↓
[Fin]
```

### 5.2 Flujo: Cliente completa tarea

```
[Webhook] Recibe "tarea_completada_cliente" con datos
    ↓
[Buscar] Responsable interno del proyecto y canal de Slack
    ↓
[Slack] Enviar a canal:
  "✅ El cliente [nombre] completó la tarea: [tarea]"
    ↓
[Email] Enviar al responsable interno
    ↓
[IF] La tarea era la última de la fase?
  ├→ Sí → [Slack] Sugerir avanzar de fase
  └→ No → [Fin]
```

### 5.3 Flujo: Tarea de compras asignada

```
[Webhook] Recibe "tarea_creada" con categoria = 'Compras'
    ↓
[Buscar] Usuarios con rol 'compras' (o el asignado específico)
    ↓
[Slack] Enviar DM a cada uno (o al asignado):
  "📦 Nueva tarea de compras: [nombre]
   Proyecto: [proyecto]"
    ↓
[Email] Opcional según preferencias
```

### 5.4 Flujo: Recordatorio de tareas próximas a vencer

```
[Cron] Cada día a las 8:00
    ↓
[Buscar en BD] Tareas con estado ≠ completada y fecha_vencimiento = hoy + 2 días
    ↓
[Por cada tarea]
  [IF] Responsable es interno?
    ├→ [Slack] DM: "⏰ Recordatorio: Tarea [nombre] vence en 2 días"
    └→ [Email] a cliente (si aplica)
```

### 5.5 Flujo: Alerta de SLA próximo a vencer

```
[Cron] Cada hora
    ↓
[Buscar en BD] Tickets con estado ≠ Resuelto/Cerrado y fecha_limite_respuesta entre ahora y ahora+[umbral] (según prioridad)
    ↓
[Por cada ticket]
  [Slack] DM al responsable: "⚠️ Ticket [número] tiene SLA de respuesta próximo a vencer (límite: [fecha])"
    ↓
[Si no hay responsable] Slack admin
```

### 5.6 Flujo: Resumen diario para internos

```
[Cron] Cada día a las 9:00
    ↓
[Por cada usuario interno con resumen activado]
  [Consultar] Tareas pendientes, tickets abiertos, proyectos en curso (según su rol)
  [Generar] Mensaje personalizado
  [Enviar] Slack DM o email (según preferencia)
```

### 5.7 Flujo: Contrato próximo a vencer

```
[Cron] Cada día
    ↓
[Buscar] Contratos activos con fecha_fin entre hoy y hoy+30
    ↓
[Por cada contrato]
  [Buscar] Comercial asignado, contactos de facturación, contacto principal
  [Slack] DM a comercial y facturación
  [Email] a comercial, facturación y cliente (si acepta)
```

---

## 6. ESTRUCTURA DE WEBHOOKS (DESDE LA APP A N8N)

La app enviará POST a `https://n8n.apexconnectivity.com/webhook/[evento]` con JSON como:

```json
{
  "evento": "tarea_asignada",
  "timestamp": "2026-06-10T10:30:00Z",
  "data": {
    "tarea_id": "uuid",
    "tarea_nombre": "Configurar firewall",
    "categoria": "Técnica",
    "responsable_id": "uuid",
    "responsable_email": "carlos@apex.com",
    "responsable_slack": "U123456",
    "proyecto_id": "uuid",
    "proyecto_nombre": "Implementación Firewall",
    "cliente_nombre": "Soluciones Tecnológicas SA",
    "fecha_vencimiento": "2026-06-15",
    "link": "https://app.apexconnectivity.com/tareas/uuid"
  }
}
```

**Eventos definidos (lista completa):** Incluye todos los de la tabla de la sección 4.

---

## 7. REGLAS DE NEGOCIO ESPECÍFICAS (RN-NOT-xx) - ACTUALIZADAS

| ID | Regla |
|----|-------|
| RN-NOT-01 | Ninguna notificación debe enviarse más de 3 veces sobre el mismo evento (control de duplicados). |
| RN-NOT-02 | El cliente puede configurar qué notificaciones por email desea recibir desde su perfil en el portal. |
| RN-NOT-03 | Los usuarios internos pueden configurar sus preferencias de notificación (email, Slack, ambos) desde su perfil. |
| RN-NOT-04 | Las notificaciones URGENTES (prioridad alta/urgente, SLA crítico) SIEMPRE se envían por Slack y email, independientemente de las preferencias. |
| RN-NOT-05 | Los recordatorios de tareas solo se envían si la tarea sigue pendiente. |
| RN-NOT-06 | Si un flujo en n8n falla, se reintenta 3 veces con backoff exponencial. |
| RN-NOT-07 | Todos los eventos importantes quedan registrados en el historial del proyecto/ticket, independientemente de la notificación. |
| RN-NOT-08 | Las alertas de SLA se envían según umbrales: Urgente: 1h antes, Alta: 2h antes, Media: 4h antes, Baja: 8h antes. |
| RN-NOT-09 | El resumen diario para internos se envía a las 9:00 AM (hora configurable por admin). |
| RN-NOT-10 | Las notificaciones de tareas de compras se dirigen a usuarios con rol 'compras' (o al asignado específico). |
| RN-NOT-11 | Cuando un proyecto se cierra, se notifica a facturación y comercial; el cliente deja de recibir notificaciones operativas (salvo que tenga contrato de soporte activo). |
| RN-NOT-12 | Las preferencias de notificación se almacenan en una tabla `preferencias_notificacion` vinculada a cada usuario. |

---

## 8. CONFIGURACIÓN DESDE LA APP

### 8.1 Panel de configuración de notificaciones (Admin)

```
+----------------------------------------------------------+
|  CONFIGURACIÓN DE NOTIFICACIONES                [Guardar]|
+----------------------------------------------------------+

+----------------------------------------------------------+
|  CANALES ACTIVOS                                          |
|  [✔] Slack                                               |
|  [✔] Email (clientes)                                    |
|  [✔] Email (internos)                                     |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  EVENTOS A NOTIFICAR EN SLACK (por canal)                |
|  (Lista de eventos con checkboxes, similar al original)  |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  UMBRALES DE SLA                                          |
|  Urgente: [1] hora(s) antes                              |
|  Alta:    [2] horas antes                                |
|  Media:   [4] horas antes                                |
|  Baja:    [8] horas antes                                |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  RESUMEN DIARIO                                           |
|  [✔] Activar resumen diario para internos                |
|  Hora de envío: [09:00]                                  |
+----------------------------------------------------------+
```

### 8.2 Preferencias del usuario interno (desde su perfil)

```
+----------------------------------------------------------+
|  MIS NOTIFICACIONES                              [Guardar]|
+----------------------------------------------------------+

+----------------------------------------------------------+
|  CANALES PREFERIDOS                                       |
|  ( ) Solo email                                           |
|  ( ) Solo Slack                                           |
|  (●) Ambos                                                |
|  ( ) Ninguno (solo urgentes)                              |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  EVENTOS (mostrar lista con checkboxes)                   |
|  [✔] Tareas asignadas                                     |
|  [✔] Recordatorio de tareas próximas                      |
|  [✔] Tickets nuevos (de mis proyectos)                    |
|  [✔] Comentarios en tickets                               |
|  [✔] Cambios de fase en proyectos                         |
|  [✔] Alertas de SLA                                       |
|  [✔] Resumen diario                                       |
+----------------------------------------------------------+
```

### 8.3 Preferencias del cliente (desde portal)

(Similar al original, con opciones para tareas, tickets, recordatorios, etc.)

---

## 9. DEPENDENCIAS CON OTROS MÓDULOS

| Módulo | Dependencia |
|--------|-------------|
| **Todos los módulos** | Generan eventos que disparan notificaciones |
| **n8n** | Orquestador externo (self-hosted) |
| **Slack** | Destino de notificaciones internas |
| **Email (SMTP)** | Destino de notificaciones a clientes e internos |
| **Google Calendar** | Integración para reuniones |

---

## 10. MÉTRICAS (Para dashboard interno)

- Volumen de notificaciones enviadas (por tipo y canal)
- Tasa de apertura de emails (si se rastrea)
- Tiempo de respuesta a tickets (relacionado con SLA)
- Flujos de n8n con mayor uso
- Fallos en envío de notificaciones

---