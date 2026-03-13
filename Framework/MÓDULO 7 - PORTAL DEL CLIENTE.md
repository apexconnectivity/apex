## MÓDULO 7: PORTAL DEL CLIENTE
### Especificación Detallada

---

## 1. PROPÓSITO DEL MÓDULO

Proporcionar a los contactos de las empresas clientes de Apex Connectivity una interfaz unificada, profesional y útil para dar seguimiento a sus proyectos, gestionar tareas asignadas, comunicarse con el equipo a través de tickets, acceder a documentación y solicitar reuniones. El portal está diseñado para que cada contacto tenga su propia experiencia, viendo solo la información relevante para su rol dentro de la empresa, pero manteniendo la transparencia necesaria para la colaboración en equipo.

---

## 2. ACTORES Y PERMISOS

| Actor | Descripción | Permisos en el portal |
|-------|-------------|------------------------|
| **Cliente (contacto)** | Persona que trabaja en la empresa cliente y tiene una cuenta individual. | Acceso a su empresa: ver proyectos activos, tareas asignadas a él, todos los tickets de la empresa (con posibilidad futura de tickets confidenciales), documentos públicos de la empresa, archivos de sus proyectos y tickets, solicitar reuniones. Puede editar su teléfono y cargo, y cambiar su contraseña. |

**Nota:** Todos los contactos de una misma empresa ven la misma información general (proyectos, tickets, documentos públicos), pero las tareas son personales (solo ven las asignadas a ellos). Los tickets pueden tener un campo de confidencialidad en el futuro para restringir visibilidad a ciertos contactos; por ahora, todos los tickets son visibles para todos los contactos de la empresa.

---

## 3. ESTRUCTURA DE DATOS (Referencias a otros módulos)

El portal no tiene tablas propias; consume datos de:

| Módulo | Entidades utilizadas |
|--------|----------------------|
| **Autenticación (M1)** | Usuario (email, roles), contacto asociado |
| **CRM (M2)** | Empresa, Contacto (incluyendo tipo, es_principal, recibe_facturas) |
| **Proyectos (M3)** | Proyecto (activos, fases, fechas, responsable, contacto técnico) |
| **Tareas (M4)** | Tarea (asignadas al contacto, con estado, fechas, categoría, subtareas) |
| **Soporte (M5)** | Ticket (de la empresa, con estado, prioridad, categoría, comentarios) |
| **Archivos (M6)** | Archivo (asociados a proyecto, ticket, tarea, empresa con visibilidad pública) |
| **Calendario (M8)** | Reunión (asociadas al proyecto, con estado) |

---

## 4. PANTALLAS (Wireframes Descriptivos)

### 4.1 Login

(Idéntico al Módulo 1, con email y contraseña individual)

### 4.2 Dashboard Principal (cuando hay un solo proyecto activo)

```
+----------------------------------------------------------+
|  ⚡ PORTAL APEX CONNECTIVITY                   [Perfil] [Salir]
|  Bienvenido, Juan Pérez - Soluciones Tecnológicas SA     |
|  (Contacto técnico)                                       |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  📊 MI PROYECTO ACTIVO                                    |
|  Implementación Firewall Fortinet                         |
|  +------------------------------------------------------+ |
|  | Progreso general: [███████--------] 45%              | |
|  | Fase actual: 4 de 5 - IMPLEMENTACIÓN                  | |
|  | Próximo hito: Pruebas de penetración (vence 15/06)   | |
|  | Responsable interno: Carlos Rodríguez                 | |
|  | Contacto técnico: Tú (Juan Pérez)                     | |
|  +------------------------------------------------------+ |
|                                                           |
|  [VER DETALLE DEL PROYECTO]                               |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  ⚠ MIS TAREAS PENDIENTES (2)                    [Ver todas]
|                                                           |
|  +------------------------------------------------------+ |
|  | 🔴 Subir diagrama de red actual                       | |
|  | Vence: 12/06/2026 · Hace 2 días                       | |
|  | [Subir archivo] [Ver detalles]                        | |
|  +------------------------------------------------------+ |
|  | 🟡 Confirmar horarios para capacitación               | |
|  | Vence: 15/06/2026 · En 3 días                          | |
|  | [Seleccionar horarios] [Ver detalles]                 | |
|  +------------------------------------------------------+ |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  🎫 TICKETS DE MI EMPRESA (3)                    [Nuevo ticket]
|  (2 abiertos · 1 en espera)                               |
|  +------------------------------------------------------+ |
|  | TK-2026-023 - No hay conexión sede norte · 🔴 URGENTE | |
|  | Abierto por: María García · Estado: Abierto           | |
|  | [Ver ticket]                                           | |
|  +------------------------------------------------------+ |
|  | TK-2026-018 - Consulta sobre factura · 🟡 MEDIA       | |
|  | Abierto por: Tú · Estado: En progreso                 | |
|  | [Ver ticket]                                           | |
|  +------------------------------------------------------+ |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  📁 DOCUMENTOS DE MI EMPRESA                     [Ver todos]
|  • condiciones_generales.pdf (público)                   |
|  • manual_de_usuario.pdf (público)                        |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  📅 PRÓXIMA REUNIÓN                                       |
|  Diagnóstico de seguimiento - 15/06/2026 11:00           |
|  [Ver en calendario] [Reprogramar] (solicitar cambio)    |
+----------------------------------------------------------+
```

### 4.2 Dashboard con múltiples proyectos activos

```
+----------------------------------------------------------+
|  ⚡ PORTAL APEX CONNECTIVITY                   [Perfil] [Salir]
|  Bienvenido, Juan Pérez - Soluciones Tecnológicas SA     |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  📊 MIS PROYECTOS ACTIVOS (2)                             |
|                                                           |
|  +------------------------------------------------------+ |
|  | 🔹 Implementación Firewall (Fase 4/5) · 45%          | |
|  |   Vence: 15/06/2026                                   | |
|  |   [Ver proyecto]                                      | |
|  +------------------------------------------------------+ |
|  | 🔹 Migración Servidores (Fase 2/5) · 20%             | |
|  |   Vence: 30/06/2026                                   | |
|  |   [Ver proyecto]                                      | |
|  +------------------------------------------------------+ |
+----------------------------------------------------------+

... (resto similar, con tareas y tickets agrupados por proyecto o globales)
```

### 4.3 Detalle de Proyecto (Vista Cliente)

```
+----------------------------------------------------------+
|  PROYECTO: Implementación Firewall              [Volver] |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  Progreso por fases:                                     |
|  FASE 1: PROSPECTO  [✔] Completada                       |
|  FASE 2: DIAGNÓSTICO [✔] Completada                      |
|  FASE 3: PROPUESTA   [✔] Completada                      |
|  FASE 4: IMPLEMENTACIÓN [████────] 50%                   |
|  FASE 5: CIERRE       [ ] Pendiente                       |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  TAREAS DEL PROYECTO (solo las asignadas a ti)           |
|  [>] PENDIENTES                                           |
|      [ ] Subir diagrama de red actual (vence 12/06)      |
|      [ ] Confirmar horarios capacitación (vence 15/06)   |
|  [🔽] COMPLETADAS (puedes reabrir hasta 3 días después)  |
|      ✔ Enviar contrato firmado (01/06) [¿Reabrir?]       |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  ARCHIVOS DEL PROYECTO                                    |
|  [📁 Entregables Cliente]                                 |
|  • diagrama_red_actual.pdf (tú, 02/06)                   |
|  • requisitos_usuarios.docx (tú, 05/06)                  |
|  [📁 Documentos de Apex]                                  |
|  • informe_diagnostico.pdf (Apex, 03/06)                 |
|  • propuesta_firmada.pdf (Apex, 05/06)                   |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  SOLICITAR REUNIÓN SOBRE ESTE PROYECTO                   |
|  [Seleccionar fecha] [Hora] [Motivo]            [ENVIAR] |
+----------------------------------------------------------+
```

### 4.4 Detalle de Tarea (Vista Cliente)

(Similar al original, con opción de subir archivo y comentar, y botón "Reabrir" si está completada y dentro de 3 días)

### 4.5 Listado de Tickets (Vista Cliente)

```
+----------------------------------------------------------+
|  TICKETS DE MI EMPRESA                          [Nuevo ticket]
+----------------------------------------------------------+

+----------------------------------------------------------+
|  FILTROS: [Todos] [Abiertos] [Resueltos] [Cerrados]      |
|  [ ] Mostrar solo mis tickets (opcional)                  |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  ABIERTOS (2)                                             |
|  +------------------------------------------------------+ |
|  | TK-2026-023 · No hay conexión sede norte             | |
|  | Abierto por: María García · 🔴 URGENTE               | |
|  | Categoría: Soporte técnico · Estado: Abierto         | |
|  | [Ver ticket]                                          | |
|  +------------------------------------------------------+ |
|  | TK-2026-018 · Consulta sobre factura                 | |
|  | Abierto por: Tú · 🟡 MEDIA                           | |
|  | Categoría: Facturación · Estado: En progreso         | |
|  | [Ver ticket]                                          | |
|  +------------------------------------------------------+ |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  RESUELTOS (1)                                            |
|  +------------------------------------------------------+ |
|  | TK-2026-015 · Lentitud en acceso                     | |
|  | Resuelto: 08/06 · Esperando confirmación             | |
|  | [Ver ticket] [Confirmar resolución]                  | |
|  +------------------------------------------------------+ |
+----------------------------------------------------------+
```

### 4.6 Detalle de Ticket (Vista Cliente)

(Similar al original, pero mostrando quién abrió el ticket. Los comentarios internos no se muestran. Si el ticket es de categoría "Facturación" y el contacto no es de facturación, igual se muestra (por ahora todos visibles). En futuro podría ocultarse con campo confidencial.)

### 4.7 Perfil del Cliente (Vista en Portal)

```
+----------------------------------------------------------+
|  MI PERFIL                                       [Volver] |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  MIS DATOS                                               |
|  Nombre: Juan Pérez                                      |
|  Cargo: CTO                                               |
|  Email: juan@soluciones.com (no editable)                |
|  Teléfono: [+54 9 11 5678-1234]                    [Editar]
|  [GUARDAR CAMBIOS] (solo teléfono y cargo)               |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  SEGURIDAD                                                |
|  [CAMBIAR CONTRASEÑA]                                     |
|  (Al cambiar, solo tu cuenta se actualiza)                |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  OTROS CONTACTOS DE MI EMPRESA                            |
|  • María García (Jefe Compras) - maria@soluciones.com    |
|  • Pedro López (Técnico) - pedro@soluciones.com          |
|  (Todos comparten la misma información de proyectos y     |
|   tickets, pero cada uno tiene sus propias tareas)       |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  NOTIFICACIONES                                           |
|  [✔] Recibir notificaciones por email                     |
|  (Estas preferencias afectan a tu cuenta)                |
+----------------------------------------------------------+
```

### 4.8 Solicitar Reunión (Modal)

(Similar al original, con un solo horario a elegir)

---

## 5. FLUJOS PRINCIPALES

### 5.1 Acceso al portal

1. Contacto recibe email de bienvenida con enlace para establecer contraseña (primer acceso) o accede directamente con su email y contraseña.
2. Sistema identifica al usuario y obtiene su `contacto_id` y `empresa_id`.
3. Redirige al dashboard. Si la empresa tiene múltiples proyectos activos, se muestra el selector o lista; si solo uno, se muestra el dashboard de ese proyecto.

### 5.2 Visualización de proyectos

- El cliente ve solo proyectos en estado "activo". Los proyectos cerrados no aparecen.
- Si hay varios, puede navegar entre ellos o ver un resumen de cada uno.

### 5.3 Gestión de tareas

- Solo se muestran tareas donde `contacto_cliente_id` coincide con el ID del contacto logueado.
- Puede ver detalles, comentar, subir archivos (si la tarea lo permite).
- Al completar una tarea, se marca como completada y aparece en la sección "Completadas" con opción de reabrir durante 3 días.

### 5.4 Reapertura de tarea

- Si la tarea fue completada hace menos de 3 días, el botón "¿Reabrir?" está disponible.
- Al hacer clic, se muestra confirmación y la tarea vuelve a "Pendiente". Se notifica al equipo interno.

### 5.5 Tickets

- El cliente ve todos los tickets de la empresa, independientemente de quién los abrió.
- Puede filtrar por estado y por "Mis tickets" (opcional).
- Puede abrir un nuevo ticket seleccionando categoría (Soporte técnico, Consulta comercial, Facturación, Otro). La prioridad la elige.
- Al enviar, se crea el ticket con estado "Abierto" y se asigna automáticamente según reglas (Módulo 5).
- Puede comentar en tickets existentes (los comentarios son públicos para el equipo).

### 5.6 Documentos

- El cliente ve los documentos de su empresa marcados como "Público" en la carpeta Corporativo/Publico.
- También ve los archivos de sus proyectos en "Entregables Cliente" y de sus tickets en la carpeta "Cliente" (estos son específicos de cada proyecto/ticket, no globales).

### 5.7 Solicitud de reunión

1. Desde el dashboard o dentro de un proyecto, hace clic en "Solicitar reunión".
2. Completa formulario con fecha, hora, duración estimada, motivo y comentarios.
3. Al enviar, se crea una solicitud de reunión (Módulo 8) en estado "Pendiente". Se notifica al responsable del proyecto.
4. El equipo confirma o sugiere otra fecha; el cliente recibe notificación por email.

### 5.8 Perfil

- El cliente puede editar su teléfono y cargo. Al guardar, se actualiza en la tabla `contactos`.
- Puede cambiar su contraseña (individualmente). Se sigue el flujo estándar de cambio de contraseña.
- Ve la lista de otros contactos de su empresa (solo lectura).

---

## 6. REGLAS DE NEGOCIO ESPECÍFICAS (RN-POR-xx) - ACTUALIZADAS

| ID | Regla |
|----|-------|
| RN-POR-01 | El cliente SOLO ve proyectos en estado "Activo". Proyectos cerrados o archivados no son visibles. |
| RN-POR-02 | Si un cliente tiene MÚLTIPLES proyectos activos, el dashboard muestra una lista o selector de proyectos. |
| RN-POR-03 | El cliente SOLO ve tareas asignadas a él (contacto_cliente_id = su ID). |
| RN-POR-04 | El cliente PUEDE reabrir una tarea que él mismo completó, hasta 3 días después. Pasado ese plazo, la opción desaparece. |
| RN-POR-05 | El cliente NO ve comentarios internos en tickets (solo los públicos). |
| RN-POR-06 | El cliente PUEDE ver todos los contactos de su empresa en el perfil (solo lectura). |
| RN-POR-07 | Al cambiar la contraseña, solo se actualiza su cuenta; no se notifica a otros contactos. |
| RN-POR-08 | Si el cliente no tiene proyectos activos ni contrato de soporte activo, el portal muestra mensaje: "No tienes servicios activos en este momento. Contacta a Apex Connectivity." |
| RN-POR-09 | Las solicitudes de reunión quedan registradas en el historial del proyecto, asociadas al contacto que las solicitó. |
| RN-POR-10 | El cliente NO puede eliminar archivos, solo subirlos (en tareas y tickets). |
| RN-POR-11 | El cliente puede editar su propio teléfono y cargo desde el perfil. El email no es editable. |
| RN-POR-12 | El cliente puede ver todos los tickets de su empresa, independientemente de quién los haya abierto. (En el futuro, se podrá implementar un campo "confidencial" para restringir visibilidad a ciertos contactos.) |
| RN-POR-13 | Al abrir un nuevo ticket, el cliente debe seleccionar una categoría (Soporte técnico, Consulta comercial, Facturación, Otro). |

---

## 7. VALIDACIONES

| Situación | Validación | Mensaje |
|-----------|------------|---------|
| Subir archivo | Tamaño ≤ 25 MB, tipo permitido | "Archivo no válido" |
| Completar tarea | Si requiere archivo, debe subirlo | "Debes subir un archivo para completar esta tarea" |
| Reabrir tarea | ≤ 3 días desde completada | "Ya no puedes reabrir esta tarea. Contacta al equipo." |
| Solicitar reunión | Fecha no puede ser pasada | "La fecha debe ser futura" |
| Editar perfil | Teléfono: formato válido (opcional) | "Teléfono no válido" |

---

## 8. MENSAJES PARA EL USUARIO (CLIENTE)

| Situación | Mensaje |
|-----------|---------|
| Bienvenida | "Bienvenido a tu portal de Apex Connectivity" |
| Tarea completada | "¡Tarea completada! Gracias por tu colaboración." |
| Tarea reabierta | "La tarea ha sido reabierta. El equipo será notificado." |
| Ticket creado | "Ticket creado correctamente. Te contactaremos a la brevedad." |
| Reunión solicitada | "Solicitud enviada. Te confirmaremos por email." |
| Contraseña cambiada | "Contraseña actualizada correctamente." |
| Perfil actualizado | "Datos actualizados correctamente." |

---

## 9. DEPENDENCIAS CON OTROS MÓDULOS

| Módulo | Dependencia |
|--------|-------------|
| **Autenticación (M1)** | Acceso al portal (email + contraseña individual). |
| **CRM (M2)** | Datos de empresa y contactos. |
| **Proyectos (M3)** | Información de proyectos activos, fases, responsables. |
| **Tareas (M4)** | Tareas asignadas al contacto. |
| **Soporte (M5)** | Tickets de la empresa. |
| **Archivos (M6)** | Documentos públicos y archivos de proyectos/tickets. |
| **Calendario (M8)** | Solicitudes de reunión. |
| **Notificaciones (M9)** | Emails de notificaciones al cliente. |

---

## 10. OPCIONES DE CONFIGURACIÓN (Para Admin)

- [ ] Días para reabrir tareas: [3] días
- [ ] Permitir a clientes editar su teléfono/cargo: [✔] Sí
- [ ] Mostrar "Próximos vencimientos" en dashboard: [✔] Sí
- [ ] Activar filtro "Mis tickets" en listado: [✔] Sí (opcional)

---

## 11. MÉTRICAS (Para dashboard interno)

- Clientes que han accedido al portal (últimos 30 días)
- Tareas completadas por clientes vs total
- Tickets abiertos por clientes vs internos
- Tiempo promedio de respuesta a tickets
- Satisfacción del cliente (encuestas post cierre)
- Contactos sin acceso reciente (+30 días)

---