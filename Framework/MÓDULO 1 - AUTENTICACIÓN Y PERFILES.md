## MÓDULO 1: AUTENTICACIÓN Y PERFILES
### Especificación Detallada

---

## 1. PROPÓSITO DEL MÓDULO

Gestionar el acceso al sistema para todos los actores, tanto internos (personal de Apex Connectivity) como externos (clientes). Se implementa un sistema de roles y permisos que permite asignar múltiples roles a un usuario, con paquetes de permisos predefinidos para cada rol. El administrador tiene acceso total. Los clientes tienen un único rol "cliente" que les permite acceder al portal.

---

## 2. ACTORES Y ROLES

### 2.1 Roles internos (personal de Apex)

| Rol | Descripción | Permisos generales (paquetes) |
|-----|-------------|--------------------------------|
| **admin** | Dueño del sistema | Acceso total a todos los módulos y configuraciones. |
| **comercial** | Ventas y prospección | Gestión de CRM (empresas y contactos), proyectos en fases comerciales (1-3), informes comerciales. No accede a tareas técnicas ni tickets de soporte. Puede ver montos de proyectos pero no costos internos. |
| **tecnico** | Implementación y soporte | Gestión de proyectos asignados (fases 4-5), tareas técnicas, tickets de soporte, archivos técnicos. Solo ve empresas de sus proyectos. No accede a datos de facturación ni a CRM completo. |
| **compras** | Adquisiciones y proveedores | Acceso al módulo de compras (proveedores, órdenes de compra), visualización de costos de proyectos. Puede ver proyectos pero no modificar aspectos técnicos. |
| **facturacion** | Finanzas | Acceso a datos de facturación de empresas, contratos, facturas, montos de proyectos, informes financieros. No accede a tareas técnicas ni tickets. |
| **marketing** | Comunicaciones | Acceso a datos de contacto de empresas y contactos (nombre, email, industria, tamaño) para segmentación y campañas. No accede a datos sensibles (RFC, direcciones fiscales, costos). |

### 2.2 Roles externos (clientes)

| Rol | Descripción | Permisos |
|-----|-------------|----------|
| **cliente** | Contacto de empresa cliente | Acceso al portal del cliente: ver su empresa, proyectos activos, tareas asignadas, tickets, archivos públicos, solicitar reuniones. No ve otros clientes ni datos internos. |

### 2.3 Asignación de roles

- Un usuario interno puede tener **uno o varios roles** (ej. un técnico que también realiza compras).
- Un usuario cliente tiene únicamente el rol `cliente`.
- El administrador puede tener el rol `admin` (que ya le da acceso total) o se puede considerar que el rol `admin` es único y no se combina con otros (aunque técnicamente podría). Para simplificar, asumiremos que el usuario con rol `admin` no necesita otros roles.

---

## 3. ESTRUCTURA DE DATOS

### 3.1 Tabla: usuarios (base)

| Campo | Tipo | Descripción | Obligatorio |
|-------|------|-------------|-------------|
| id | UUID | Identificador único | Auto |
| email | string | Único en el sistema | Sí |
| password_hash | string | Hash de la contraseña | Sí |
| activo | boolean | Si puede o no acceder | Sí (default: true) |
| creado_en | timestamp | | Auto |
| ultimo_acceso | timestamp | | Null |
| cambiar_password_proximo_login | boolean | Para forzar cambio | No |

### 3.2 Tabla: roles

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| nombre | string | admin, comercial, tecnico, compras, facturacion, marketing, cliente |
| descripcion | text | |
| es_interno | boolean | True para roles internos, false para cliente |

### 3.3 Tabla: usuario_roles (asignación)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| usuario_id | UUID | FK a usuarios |
| rol_id | UUID | FK a roles |
| PRIMARY KEY (usuario_id, rol_id) | | |

### 3.4 Tabla: permisos (opcional para granularidad futura)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | |
| nombre | string | Ej: "proyectos:ver", "proyectos:crear" |
| modulo | string | crm, proyectos, tareas, soporte, compras, etc. |
| accion | string | ver, crear, editar, eliminar |

### 3.5 Tabla: rol_permisos (opcional)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| rol_id | UUID | |
| permiso_id | UUID | |

**Nota:** Para la versión inicial, definiremos los permisos de cada rol de manera fija en el código (paquetes de permisos), pero dejamos la estructura para futura expansión si se requiere granularidad.

---

## 4. FLUJO DE REGISTRO (CREACIÓN DE CUENTAS)

### 4.1 Usuarios Internos (con roles)

**Flujo: Admin crea un usuario interno**
1. Admin entra a "Configuración > Usuarios internos"
2. Hace clic en "Nuevo usuario"
3. Completa: nombre (se almacena en una tabla de perfiles, ver más abajo), email, y selecciona uno o varios roles de la lista (checkboxes).
4. Sistema genera contraseña aleatoria (visible UNA VEZ)
5. Sistema envía email al usuario con:
   - Link de acceso
   - Su contraseña generada
   - Instrucción de cambiarla en primer ingreso (opcional)
6. El usuario, al primer ingreso, debe cambiar la contraseña.

**Datos adicionales de perfil (nombre, teléfono, etc.):** Se pueden almacenar en una tabla `perfiles_usuarios` o directamente en `usuarios`. Por simplicidad, añadimos campos en `usuarios`:

```sql
ALTER TABLE usuarios ADD COLUMN nombre text;
ALTER TABLE usuarios ADD COLUMN telefono text;
```

### 4.2 Usuarios Clientes

**Flujo: Invitación desde CRM (Módulo 2)**
1. Al crear un contacto en el CRM y marcar "Enviar invitación al portal", se crea un usuario con:
   - email = email del contacto
   - rol = 'cliente' (asignado en usuario_roles)
   - activo = true
   - cambiar_password_proximo_login = true (para que establezca su contraseña)
2. Se envía email de bienvenida con enlace para establecer contraseña.

---

## 5. FLUJO DE LOGIN

### 5.1 Pantalla de Login

```
+------------------------------------------------+
|                   NETOPS CRM                   |
|                                                 |
|   Email:    [__________________________]       |
|                                                 |
|   Contraseña: [__________________________]     |
|                                                 |
|          [ INICIAR SESIÓN ]                     |
|                                                 |
|          ¿Olvidaste tu contraseña?              |
+------------------------------------------------+
```

### 5.2 Validaciones

| Campo | Regla | Mensaje Error |
|-------|-------|---------------|
| Email | Obligatorio, formato email | "Ingresa un email válido" |
| Contraseña | Obligatorio | "Ingresa tu contraseña" |
| Credenciales | Deben coincidir | "Email o contraseña incorrectos" |
| Usuario activo | El usuario debe tener estado 'activo' | "Tu cuenta no está activa. Contacta al administrador." |

### 5.3 Post-Login

- El sistema obtiene los roles del usuario.
- Según los roles, se determina el dashboard inicial y el menú de navegación.
  - Si tiene rol `admin`: redirige a Dashboard General con acceso a todos los módulos.
  - Si tiene roles combinados (ej. comercial + marketing), se muestra un dashboard unificado con acceso a los módulos permitidos.
  - Si es `cliente`: redirige al Portal del Cliente.

### 5.4 Sesión

- Duración: 30 días (configurable)
- Al cerrar browser, la sesión persiste (cookie)
- "Cerrar sesión" elimina la cookie

---

## 6. FLUJO DE RECUPERACIÓN DE CONTRASEÑA (INDIVIDUAL)

**Premisa:** Cada usuario (interno o cliente) puede recuperar su propia contraseña mediante un enlace de restablecimiento enviado a su email.

### Paso a paso:

1. Usuario hace clic en "¿Olvidaste tu contraseña?"
2. Ingresa su email
3. Sistema verifica:
   - Si el email NO existe → mensaje genérico "Si el email existe, recibirás instrucciones"
   - Si el email SÍ existe:
     - Genera un token UUID aleatorio y lo guarda en `password_reset_tokens` con expiración de 2 horas, asociado al `usuario_id`
     - Envía un email con el link de restablecimiento a esa dirección
4. Mensaje en pantalla: "Hemos enviado un enlace de restablecimiento a tu correo electrónico."
5. Al hacer clic en el link, el usuario ve un formulario:
   ```
   Nueva contraseña:  [__________]
   Confirmar nueva:   [__________]

   [ ESTABLECER NUEVA CONTRASEÑA ]
   ```
6. Al guardar: token se marca como `usado = true`, contraseña se hashea y guarda.

> **Nota:** Un token caducado o ya usado muestra: "Este enlace ya no es válido. Solicita uno nuevo."

---

## 7. FLUJO DE CAMBIO DE CONTRASEÑA (INDIVIDUAL)

1. Usuario autenticado va a "Mi perfil" > "Cambiar contraseña"
2. Ve formulario:
   ```
   Contraseña actual: [__________]
   Nueva contraseña:  [__________]
   Confirmar nueva:   [__________]
   
   [ CAMBIAR CONTRASEÑA ]
   ```
3. Validaciones:
   - Contraseña actual debe coincidir
   - Nueva ≥ 6 caracteres
   - Nueva y confirmar iguales
4. Al guardar: actualiza la contraseña en BD.
5. Mensaje: "Contraseña actualizada correctamente."

---

## 8. GESTIÓN DE ROLES Y PERMISOS (ADMIN)

### 8.1 Pantalla de administración de usuarios internos

```
+----------------------------------------------------------+
|  USUARIOS INTERNOS                           [+ NUEVO]   |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  Carlos Rodríguez (carlos@apex.com)                      |
|  Roles: técnico, compras                                  |
|  [Editar roles] [Desactivar] [Restablecer contraseña]    |
+----------------------------------------------------------+
|  Laura Pérez (laura@apex.com)                            |
|  Roles: comercial                                         |
|  [Editar roles] [Desactivar] [Restablecer contraseña]    |
+----------------------------------------------------------+
|  Juan Gómez (juan@apex.com)                              |
|  Roles: facturación, marketing                            |
|  [Editar roles] [Desactivar] [Restablecer contraseña]    |
+----------------------------------------------------------+
```

### 8.2 Editar roles de un usuario (modal)

```
+----------------------------------------------------------+
|  EDITAR ROLES - Carlos Rodríguez                [Guardar]|
+----------------------------------------------------------+

+----------------------------------------------------------+
|  [✔] Técnico                                              |
|  [✔] Compras                                              |
|  [ ] Comercial                                            |
|  [ ] Facturación                                          |
|  [ ] Marketing                                            |
|  [ ] Admin (solo si aplica)                               |
+----------------------------------------------------------+

* Al guardar, los permisos del usuario se actualizan según los roles seleccionados.
```

---

## 9. REGLAS DE NEGOCIO ESPECÍFICAS (RN-AUT-xx)

| ID | Regla |
|----|-------|
| RN-AUT-01 | Un email solo puede tener UNA cuenta activa en el sistema. |
| RN-AUT-02 | Cada contacto de una empresa cliente tiene su propia cuenta de usuario con rol 'cliente'. |
| RN-AUT-03 | Una empresa debe tener al menos un contacto, y entre sus contactos, uno y solo uno debe ser el **principal**. |
| RN-AUT-04 | Al crear una empresa, el primer contacto agregado se marca automáticamente como principal. El admin puede cambiar el principal posteriormente. |
| RN-AUT-05 | El contacto principal recibe la invitación al canal de Slack del proyecto al crear el proyecto. |
| RN-AUT-06 | La recuperación de contraseña es individual: se envía un enlace de restablecimiento al email del usuario que lo solicita. |
| RN-AUT-07 | Al cambiar la contraseña, solo se actualiza la cuenta del usuario; no se notifica a otros contactos. |
| RN-AUT-08 | Un cliente inactivo (sin proyectos activos ni contrato de soporte activo) no puede acceder al portal. |
| RN-AUT-09 | Un usuario interno puede tener uno o múltiples roles. |
| RN-AUT-10 | Los permisos de un usuario son la unión de los permisos de todos sus roles. |
| RN-AUT-11 | El administrador tiene todos los permisos, independientemente de los roles asignados. |
| RN-AUT-12 | Los técnicos solo ven proyectos en los que están asignados. |
| RN-AUT-13 | Los comerciales pueden ver todos los proyectos en fases 1-3, pero no tienen acceso a fases 4-5 a menos que estén asignados. |
| RN-AUT-14 | La asignación de roles a usuarios internos solo puede ser realizada por el administrador. |
| RN-AUT-15 | Un usuario no puede tener el rol 'admin' junto con otros roles (simplificación). |
| RN-AUT-16 | Los roles 'cliente' no pueden combinarse con roles internos. |

---

## 10. VALIDACIONES POR CAMPO

### Registro/Invitar Cliente (desde CRM)
| Campo | Validación |
|-------|------------|
| Email | Formato email. No debe existir ya como usuario activo (si existe, se puede asociar el contacto a ese usuario, pero con cuidado). |

### Creación de usuario interno
| Campo | Validación |
|-------|------------|
| Email | Formato email, único |
| Roles | Al menos uno seleccionado (excepto si es admin, puede ser solo admin) |

---

## 11. MENSAJES PARA EL USUARIO

| Situación | Mensaje |
|-----------|---------|
| Login exitoso | (Redirige) |
| Credenciales incorrectas | "Email o contraseña incorrectos" |
| Cuenta inactiva (cliente sin proyecto/soporte) | "No tienes servicios activos en este momento. Contacta a tu proveedor." |
| Recuperación exitosa | "Hemos enviado un enlace de restablecimiento a tu correo electrónico." |
| Cambio de contraseña exitoso | "Contraseña actualizada correctamente." |
| Usuario creado (interno) | "Usuario creado correctamente. Se ha enviado un email con las credenciales." |
| Roles actualizados | "Roles actualizados correctamente." |

---

## 12. DEPENDENCIAS CON OTROS MÓDULOS

| Módulo | Dependencia |
|--------|-------------|
| **CRM (M2)** | Los usuarios clientes se crean a partir de contactos. Los roles determinan qué datos de CRM puede ver cada usuario interno. |
| **Proyectos (M3)** | Los permisos de proyecto se basan en roles y asignaciones. |
| **Tareas (M4)** | Similar a proyectos. |
| **Soporte (M5)** | Técnicos y admin gestionan tickets; clientes solo los suyos. |
| **Archivos (M6)** | Permisos según contexto y rol. |
| **Compras (nuevo módulo)** | El rol compras tendrá acceso a este módulo. |
| **Portal Cliente (M7)** | Solo accesible para rol cliente. |
| **Notificaciones (M9)** | Las notificaciones se envían según el rol y preferencias. |

---

## 13. MÉTRICAS (Para dashboard interno)

- Total usuarios internos por rol
- Usuarios con múltiples roles
- Clientes activos vs inactivos
- Intentos de login fallidos
- Recuperaciones de contraseña solicitadas

---

## 14. INTEGRACIÓN CON SLACK (Contacto Principal)

- **Evento:** Creación de un nuevo proyecto.
- **Acción:** n8n recibe el webhook, crea canal e invita al contacto principal (email) de la empresa cliente.
- Si el contacto principal cambia durante el proyecto, se puede reasignar manualmente.

---