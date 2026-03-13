# DOCUMENTO MAESTRO DE ESTRUCTURA
## NetOps CRM - Sistema de Gestión para Outsourcing de Redes y Seguridad

**Versión:** 1.0  
**Fecha:** 2026  
**Estado:** Fase de Estructura Completada

---

## 1. PROPÓSITO DEL SISTEMA

Aplicación web única que centraliza la gestión comercial, operativa y de soporte para un emprendimiento de outsourcing de redes y seguridad, permitiendo:

- Gestión de clientes (empresas y contactos)
- Ejecución de proyectos estructurados en 5 fases configurables
- Gestión de soporte mediante tickets con pipeline visual
- Colaboración activa con clientes a través de un portal
- Comunicación integrada con Slack (canal por proyecto)
- Archivado automático de proyectos finalizados

---

## 2. ACTORES DEL SISTEMA

| Actor | Descripción | Permisos Base |
|-------|-------------|---------------|
| **Administrador/Dueño** | Tú. Acceso total al sistema. | Crear/editar/eliminar todo. Gestionar usuarios internos. Ver métricas. Configurar fases y tareas tipo. |
| **Técnico/Colaborador** | Empleados o socios. | Ver proyectos asignados. Gestionar tareas. Subir archivos. Ver pipeline. Abrir tickets. |
| **Cliente** | El cliente final. | Acceso a su proyecto activo y tickets. Ver progreso. Subir archivos asignados. Solicitar reuniones. Todos los contactos del cliente comparten una misma cuenta. |

---

## 3. MÓDULOS PRINCIPALES

```
SISTEMA NETOPS CRM
├── Módulo de Autenticación y Perfiles
├── Módulo de CRM (Empresas y Contactos)
├── Módulo de Proyectos (Pipeline 5 Fases configurables)
├── Módulo de Tareas (Internas y de Cliente, con plantillas por fase)
├── Módulo de Soporte (Contratos + Tickets con pipeline propio)
├── Módulo de Archivos (Referencias a Google Drive)
├── Módulo de Portal del Cliente
├── Módulo de Calendario (Google Calendar)
├── Módulo de Comunicación (Slack + Email)
├── Módulo de Automatización (Webhooks a n8n)
└── Módulo de Archivado (Proyectos terminados)
```

---

## 4. MODELO DE DATOS CONCEPTUAL

```
EMPRESA (Cliente)
  ├── Tiene muchos CONTACTOS (personas, comparten cuenta)
  ├── Tiene muchos PROYECTOS
  └── Puede tener CONTRATO DE SOPORTE activo

CONTACTO
  ├── Pertenece a una EMPRESA
  ├── Datos: nombre, cargo, email, teléfono
  └── Todos los contactos de una empresa comparten la misma cuenta de acceso

PROYECTO
  ├── Pertenece a una EMPRESA
  ├── Tiene muchas TAREAS
  ├── Tiene muchos ARCHIVOS (referencias a Drive)
  ├── Tiene HISTORIAL DE ACTIVIDAD
  ├── Tiene FASE actual (1-5, configurables)
  ├── Puede tener TICKETS asociados
  ├── Moneda: USD o MXN
  ├── Monto estimado y real
  └── Estado: Activo / Cerrado (archivado)

TAREA
  ├── Pertenece a un PROYECTO
  ├── Responsable: Admin/Técnico/Cliente
  ├── Puede tener DEPENDENCIAS
  ├── Puede ser INTERNA o PARA CLIENTE
  ├── Título, descripción, fecha, prioridad, estado
  └── Las tareas tipo se definen en PLANTILLAS por fase

CONTRATO DE SOPORTE
  ├── Pertenece a una EMPRESA
  ├── Tiene muchos TICKETS
  ├── Puede tener TAREAS RECURRENTES
  ├── Moneda: USD o MXN
  ├── Monto
  └── Fecha inicio, fecha fin, tipo, estado

TICKET
  ├── Pertenece a un PROYECTO (implementación) o CONTRATO (soporte)
  ├── Creado por: Cliente o interno
  ├── Estado: Abierto / En progreso / Esperando cliente / Resuelto / Cerrado
  ├── Prioridad: Baja / Media / Alta / Urgente
  ├── Asunto, descripción, fechas
  ├── Comentarios (con autor visible)
  └── Puede tener ARCHIVOS adjuntos

ARCHIVO
  ├── Referencia a Google Drive (no almacena el archivo)
  ├── Contiene: file_id, URLs de vista/descarga
  ├── Pertenece a: PROYECTO, TICKET o TAREA
  ├── Metadatos: nombre, tipo, fecha, subido por
  └── Carpeta en Drive: según estructura definida

PLANTILLA DE TAREAS
  ├── Asociada a una FASE (1-5)
  ├── Nombre de la tarea
  ├── Asignación default (Cliente/Interno)
  └── Días estimados
```

---

## 5. LAS 5 FASES DE PROYECTO (Configurables por Admin)

| Fase | Nombre | Descripción | Involucra Cliente |
|------|--------|-------------|-------------------|
| **1** | Prospecto | Primer contacto, calificación | Sí |
| **2** | Diagnóstico | Relevamiento de información | Sí |
| **3** | Propuesta | Elaboración y negociación | Sí |
| **4** | Implementación | Ejecución técnica | Parcial |
| **5** | Cierre y Entrega | Finalización formal | Sí |

**Nota:** El administrador puede renombrar, agregar o eliminar fases. Las plantillas de tareas se ajustan automáticamente.

---

## 6. PIPELINES DEL SISTEMA

### Pipeline de Proyectos (5 columnas configurables)
Vista principal para seguimiento de implementaciones.

### Pipeline de Tickets (Soporte)
Columnas fijas:
- **Abierto**
- **En progreso**
- **Esperando cliente**
- **Resuelto**
- **Cerrado**

Ambos pipelines permiten arrastrar y soltar para cambiar de estado/fase.

---

## 7. PORTAL DEL CLIENTE

**Acceso:** Email + Contraseña (elegida por cliente). Todos los contactos de la empresa comparten la misma cuenta.

**Vista del cliente:**
- Dashboard con progreso de su proyecto activo (barra de fase)
- Lista de tareas pendientes (solo las asignadas a él)
- Acceso a archivos de su proyecto
- Pipeline de tickets (solo sus tickets)
- Botón para solicitar reunión (integra Google Calendar)
- Historial de actividad

**No ve:**
- Tareas internas
- Proyectos de otras empresas
- Tickets de otros clientes

---

## 8. ESTRUCTURA DE ARCHIVOS EN GOOGLE DRIVE

```
Drive Raíz
├── /Clientes Activos/
│   └── /[Nombre Empresa]/
│       └── /[Nombre Proyecto]/
│           ├── /Entregables Cliente/     (lo que sube el cliente)
│           ├── /Internos/                 (lo que sube el equipo)
│           └── /Facturas/                  (PDFs de facturación)
│
└── /Archivo Histórico/
    └── /[Año]/
        └── /[Empresa] - [Proyecto]/       (proyectos cerrados)
            ├── exportacion_datos.json
            ├── resumen_ejecutivo.pdf (opcional)
            └── /archivos/                   (copia de archivos relevantes)
```

---

## 9. COMUNICACIÓN Y NOTIFICACIONES

### Slack (por proyecto)
- **Estructura:** Un canal DEDICADO por proyecto: `#[cliente]-[proyecto]`
- **Creación:** Automática al iniciar proyecto (vía n8n)
- **Invitación:** Email de bienvenida al cliente con acceso al canal
- **Contenido del canal:** 
  - Responsable del cliente
  - Equipo interno asignado
  - Bots de n8n para notificaciones
- **Eventos notificados (con opción #notificar):**
  - Avance de fase
  - Subida de archivos (solo si el usuario marca "Notificar al cliente")
  - Tickets urgentes
- **Al finalizar:** Canal se archiva (no se elimina)

### Email
- Notificaciones automáticas de tareas
- Invitaciones al portal
- Recuperación de contraseña (envía clave actual a todos los contactos)

---

## 10. AUTOMATIZACIONES (n8n)

**Arquitectura:** La app envía webhooks a n8n (self-hosted en NAS) ante eventos clave. n8n ejecuta flujos.

**Flujos previstos:**
| Disparador | Acción |
|------------|--------|
| Nuevo proyecto creado | Crear canal en Slack, enviar invitaciones |
| Tarea asignada a cliente | Notificar en Slack + email |
| Cliente sube archivo (con #notificar) | Mensaje al canal del proyecto |
| Proyecto cambia de fase | Resumen en Slack |
| Ticket urgente creado | Alerta en canal #soportes |
| Proyecto inactivo +7 días | Recordatorio interno por Slack |
| Proyecto cerrado | Iniciar archivado |
| Cliente solicita reunión | Crear evento en Google Calendar + notificar en Slack |

---

## 11. ARCHIVADO DE PROYECTOS

**Disparador:** Automático cuando el proyecto pasa a estado "Cerrado" (al completar Fase 5 o arrastrarse manualmente a Cerrado).

**Proceso:**
1. Sistema genera archivo JSON con: datos del proyecto, tareas, fechas, metadatos, referencias a archivos.
2. Crea carpeta en Drive: `/Archivo/[Año]/[Empresa] - [Proyecto]/`
3. Guarda JSON y (opcional) resumen PDF.
4. Elimina de Supabase: tareas del proyecto (lo pesado).
5. Mantiene registro mínimo del proyecto con enlace a carpeta Drive.

**Restauración:** Función "Importar proyecto archivado" que lee JSON y recrea el proyecto en Supabase.

---

## 12. AUTENTICACIÓN

| Aspecto | Decisión |
|---------|----------|
| **Tipo** | Email + Contraseña (elegida por el cliente) |
| **Registro inicial** | Invitación por email, cliente elige su clave por primera vez |
| **Recuperación** | "Olvidé mi contraseña" reenvía la clave ACTUAL a TODOS los contactos del proyecto |
| **Cambio de clave** | OPCIONAL (el cliente puede cambiarla manualmente cuando quiera). Si alguien cambia la clave, todos los contactos reciben la nueva por email. |
| **Múltiples contactos** | Todos los contactos de una empresa comparten la MISMA cuenta y clave. |

---

## 13. REGLAS DE NEGOCIO (RN)

**RN-01:** Un proyecto solo puede estar en UNA fase a la vez.
**RN-02:** Al cambiar de fase, se pueden crear automáticamente tareas desde plantillas.
**RN-03:** Las tareas pueden ser internas o de cliente.
**RN-04:** El cliente ve en su portal SOLO su proyecto activo y sus tickets.
**RN-05:** Los archivos nunca se guardan en la base de datos, solo referencias a Drive. *(ver RN-FILE-01 en Módulo 6)*
**RN-06:** Un proyecto cerrado sin soporte se archiva automáticamente.
**RN-07:** El archivado exporta los datos a Drive y elimina tareas de la BD operativa. *(ver RN-ARCH-01 en Módulo 10)*
**RN-08:** El cliente NO puede ver tareas internas ni proyectos de otras empresas.
**RN-09:** Una empresa puede tener MÚLTIPLES proyectos activos en diferentes fases.
**RN-10:** Una empresa puede tener un CONTRATO DE SOPORTE activo y PROYECTOS activos simultáneamente.
**RN-11:** Los tickets pueden ser abiertos por cliente o por equipo interno.
**RN-12:** Eventos clave del sistema disparan webhooks a n8n.
**RN-13:** Todos los contactos de una empresa comparten la misma cuenta de acceso.
**RN-14:** Las fases de proyecto son configurables por el administrador.
**RN-15:** Las tareas tipo son configurables por el administrador (plantillas por fase).
**RN-16:** n8n ejecuta un ping a Supabase cada 3 días para evitar la pausa automática del free tier (consulta simple a la tabla de proyectos).

---

## 14. INTEGRACIONES EXTERNAS

| Servicio | Propósito | Uso |
|----------|-----------|-----|
| **Google Drive** | Almacenamiento de archivos | Subir, descargar, organizar carpetas |
| **Google Calendar** | Gestión de reuniones | Mostrar disponibilidad, crear eventos desde solicitudes |
| **Google Auth** | Autenticación (opcional) | Login con Google para usuarios internos |
| **Email (SMTP)** | Notificaciones al cliente | Tareas, recordatorios, bienvenidas, recuperación de clave |
| **Slack** | Notificaciones internas y con cliente | Canal por proyecto, vía n8n |
| **n8n (self-hosted en NAS)** | Orquestador de automatizaciones | Recibe webhooks, ejecuta flujos |

---

## 15. RESTRICCIONES TÉCNICAS (Para Free Tier)

- **Supabase:** 500 MB BD (solo texto y referencias), 1 GB Storage (solo referencias), 50,000 usuarios activos/mes
- **Google Drive:** 15 GB gratis para archivos reales
- **Vercel:** Gratis para frontend + API routes
- **n8n:** Self-hosted en NAS (costo cero)
- **Slack:** Plan gratuito para cliente (canales ilimitados)

---

## 16. PENDIENTE PARA FASE DE ESPECIFICACIÓN

- [ ] Diseño de pantallas (wireframes)
- [ ] Flujos de usuario detallados
- [ ] Especificación de API endpoints
- [ ] Definición de tablas y relaciones SQL
- [ ] Reglas de validación por campo
- [ ] Mensajes de error y notificaciones
- [ ] Permisos granulares (qué puede ver/editar cada rol)
- [ ] Diseño de emails automáticos (plantillas)

---

## 17. CONTROL DE CAMBIOS

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0 | 2026 | Versión inicial. Fase de estructura completada. |

---