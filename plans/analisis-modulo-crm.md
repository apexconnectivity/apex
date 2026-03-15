# Análisis del Módulo 2: CRM (Empresas y Contactos)

## 1. Resumen Ejecutivo

El **Módulo 2 de CRM** está parcialmente implementado según la especificación. El código cubre las funcionalidades core de gestión de empresas y contactos, pero existen brechas importantes respecto a la documentación, especialmente en permisos por roles, integración con el sistema de autenticación, y algunas reglas de negocio definidas.

---

## 2. Comparativa: Especificación vs Implementación

### 2.1 Estructura de Datos

| Campo/Entidad | En Spec | En Código | Estado |
|---------------|---------|-----------|--------|
| **Empresa** |
| id (UUID) | ✅ | ✅ string | ✅ Implementado |
| tipo_entidad | ✅ enum | ✅ tipo | ✅ Implementado |
| nombre | ✅ | ✅ | ✅ Implementado |
| industria | ✅ enum | ✅ | ✅ Implementado |
| tamaño | ✅ enum | ✅ | ✅ Implementado |
| origen | ✅ enum | ✅ | ✅ Implementado |
| tipo_relacion | ✅ enum | ✅ | ✅ Implementado |
| telefono_principal | ✅ | ✅ | ✅ Implementado |
| email_principal | ✅ | ✅ | ✅ Implementado |
| sitio_web | ✅ | ✅ | ✅ Implementado |
| direccion | ✅ | ✅ | ✅ Implementado |
| ciudad | ✅ | ✅ | ✅ Implementado |
| pais | ✅ | ✅ | ✅ Implementado |
| notas_internas | ✅ | ✅ | ✅ Implementado |
| razon_social | ✅ | ✅ | ✅ Implementado |
| rfc | ✅ | ✅ | ✅ Implementado |
| direccion_fiscal | ✅ | ❌ | ⚠️ Falta |
| regimen_fiscal | ✅ | ❌ | ⚠️ Falta |
| email_facturacion | ✅ | ✅ | ✅ Implementado |
| metodo_pago | ✅ | ❌ | ⚠️ Falta en UI |
| plazo_pago | ✅ | ✅ | ✅ Implementado |
| moneda_preferida | ✅ | ✅ | ✅ Implementado |
| **Contacto** |
| id | ✅ | ✅ | ✅ Implementado |
| empresa_id | ✅ | ✅ | ✅ Implementado |
| nombre | ✅ | ✅ | ✅ Implementado |
| cargo | ✅ | ✅ | ✅ Implementado |
| tipo_contacto | ✅ | ✅ | ✅ Implementado |
| email | ✅ | ✅ | ✅ Implementado |
| telefono | ✅ | ✅ | ✅ Implementado |
| es_principal | ✅ | ✅ | ✅ Implementado |
| recibe_facturas | ✅ | ✅ | ✅ Implementado |
| notas | ✅ | ❌ | ⚠️ Falta en UI |
| activo | ✅ | ❌ | ⚠️ Falta |
| usuario_id | ✅ | ❌ | ⚠️ Falta |
| **Documento** |
| id | ✅ | ✅ | ✅ Implementado |
| empresa_id | ✅ | ✅ | ✅ Implementado |
| archivo_id | ✅ | ✅ | ✅ Implementado |
| visibilidad | ✅ | ✅ | ✅ Implementado |
| descripcion | ✅ | ✅ | ✅ Implementado |
| subido_por | ✅ | ✅ | ✅ Implementado |
| fecha_subida | ✅ | ✅ | ✅ Implementado |
| nombre_archivo | ✅ | ✅ | ✅ Implementado |

### 2.2 Permisos y Roles

| Rol | Permisos Spec | Implementado | Estado |
|-----|---------------|--------------|--------|
| admin | Acceso total | ✅ `isAdmin` | ✅ |
| comercial | Solo clientes | ✅ `isComercial` | ✅ Parcial* |
| tecnico | Solo empresas de proyectos asignados | ✅ `isTecnico` | ✅ |
| compras | Solo proveedores | ✅ `isCompras` | ✅ Parcial* |
| facturacion | Solo datos de facturación | ✅ `isFacturacion` | ⚠️ No filtra campos |
| marketing | Solo lectura, campos no sensibles | ✅ `isMarketing` | ⚠️ No filtra campos |

*Los permisos están implementados pero hay detalles por ajustar.

### 2.3 Reglas de Negocio (RN-CRM)

| RN | Descripción | Estado |
|----|-------------|--------|
| RN-CRM-01 | Solo un contacto principal por empresa | ✅ Implementado |
| RN-CRM-02 | Email único en todo el sistema | ✅ Implementado |
| RN-CRM-03 | Contacto inactivo no puede ser responsable de tareas | ❌ No implementado |
| RN-CRM-04 | Eliminar empresa: bloquear si tiene proyectos activos | ⚠️ Solo confirmación simple |
| RN-CRM-05 | Técnicos solo ven empresas de proyectos asignados | ✅ Implementado |
| RN-CRM-06 | Cliente solo ve su empresa | ❌ No implementado (falta integración portal) |
| RN-CRM-07 | Tipo por defecto "Cliente" | ✅ Implementado |
| RN-CRM-08 | Contacto cliente debe tener usuario para portal | ❌ No implementado |
| RN-CRM-09 | No eliminar contacto con usuario activo | ❌ No implementado |
| RN-CRM-10 | Desactivar contacto desactiva usuario | ❌ No implementado |
| RN-CRM-11 | Solicitar nuevo principal si se desactiva el actual | ❌ No implementado |
| RN-CRM-12 | Email principal para invite a Slack | ❌ No implementado |
| RN-CRM-13 | tipo_contacto obligatorio | ✅ Implementado |
| RN-CRM-14 | Contacto con recibe_facturas recibe notificaciones | ❌ No implementado |
| RN-CRM-15 | Documentos públicos visibles en portal | ❌ No implementado |
| RN-CRM-16 | Alertas automáticas vía n8n | ✅ Implementado en UI* |
| RN-CRM-17 | Empresa puede ser cliente/proveedor/ambos | ✅ Implementado |
| RN-CRM-18 | Comercial solo crea clientes | ⚠️ No enforced en UI |
| RN-CRM-19 | Compras solo crea proveedores | ⚠️ No enforced en UI |
| RN-CRM-20 | Marketing acceso solo lectura | ✅ Implementado |
| RN-CRM-21 | Proveedores no tienen acceso al portal | ❌ No implementado |

*Las alertas se muestran en UI pero no hay integración real con n8n.

---

## 3. Funcionalidades Implementadas

### 3.1 Listado de Empresas
- ✅ Filtrado por tipo (cliente/proveedor/ambos)
- ✅ Filtrado por industria
- ✅ Búsqueda por nombre, email, ciudad
- ✅ Tarjetas con información resumida
- ✅ Stats (total, clientes, proveedores, contactos)

### 3.2 Gestión de Empresas
- ✅ Crear nueva empresa con formulario completo
- ✅ Editar empresa existente
- ✅ Eliminar empresa (con confirmación)
- ✅ Selector de tipo de entidad (cliente/proveedor/ambos)
- ✅ Datos de facturación parciales

### 3.3 Gestión de Contactos
- ✅ Crear nuevo contacto
- ✅ Editar contacto
- ✅ Eliminar contacto
- ✅ Validación de email único
- ✅ Contacto principal (solo uno por empresa)
- ✅ Flag recibe_facturas
- ✅ Tipo de contacto obligatorio

### 3.4 Documentos
- ✅ Subir documento (simulado)
- ✅ Visibilidad interno/público
- ✅ Listar documentos por empresa
- ✅ Eliminar documento

### 3.5 Notas Internas
- ✅ Agregar notas internas
- ✅ Editar notas
- ✅ Visualización en modal detalle

### 3.6 Alertas
- ✅ Empresa sin contacto principal
- ✅ Prospecto inactivo >60 días
- ✅ Proveedor sin contactos
- ✅ Integración con proyectos y tickets

---

## 4. Brechas y Mejoras Identificadas

### 4.1 Críticas ( deben implementarse)

1. **Campo `direccion_fiscal`** - Existe en tipos pero no en UI
2. **Campo `regimen_fiscal`** - Existe en tipos pero no en UI
3. **Campo `metodo_pago`** - No está en el select de facturación
4. **Campo `activo` en Contacto** - No hay manera de desactivar contactos
5. **Campo `notas` en Contacto** - No hay campo de notas para contactos
6. **Campo `usuario_id` en Contacto** - No hay vínculo con sistema de usuarios

### 4.2 Altas Prioridad

1. **Enforcement de permisos por rol en creación**
   - Comercial no debería poder crear proveedores puros
   - Compras no debería poder crear clientes puros

2. **Facturación: restricción de campos por rol**
   - Rol `facturación` solo debería ver campos de facturación

3. **Marketing: restricción de campos**
   - Solo debería ver campos no sensibles

4. **Validación de eliminación de empresa**
   - Bloquear si tiene proyectos activos
   - Advertencia si tiene proyectos finalizados

5. **Vínculo Contacto → Usuario**
   - Para clientes, el contacto debe vincularse a un usuario
   - No se puede eliminar contacto con usuario activo

### 4.3 Medias Prioridad

1. **Edición de contactos desde el modal detalle**
   - Solo permite eliminar, no editar

2. **Integración con portal del cliente**
   - Cliente solo ve su empresa

3. **Selección de proyectos en modal detalle**
   - Los proyectos se muestran pero no son navegables

4. **Integración real con Google Drive**
   - Los documentos son simulados

### 4.4 Bajas Prioridad

1. **Exportación de datos** para marketing
2. **Notificaciones automáticas reales** (n8n)
3. **Invitación a Slack** del contacto principal

---

## 5. Arquitectura de Componentes

```
src/app/(dashboard)/dashboard/crm/page.tsx
├── EmpresaCard.tsx                    (Tarjeta en grid)
├── EmpresaModal.tsx                   (Crear/Editar empresa)
├── EmpresaDetailModal.tsx             (Vista detallada con tabs)
│   ├── Tab: Información
│   ├── Tab: Contactos
│   ├── Tab: Proyectos
│   ├── Tab: Documentos
│   └── Tab: Notas
├── SelectWithAdd.tsx                  (Select con opción de agregar)
└── StatusBadge.tsx                   (Badges de estado)
```

---

## 6. Recomendaciones

### 6.1 Acciones Inmediatas

1. **Completar campos faltantes en UI de empresa:**
   - dirección_fiscal
   - regimen_fiscal
   - método de pago

2. **Agregar campo `activo` en contacto:**
   - En modal de contacto
   - En lista de contactos

3. **Enforcement de permisos:**
   - Filtrar opciones según rol al crear empresa

### 6.2 Próximas Iteraciones

1. **Integración con Módulo 1 (Autenticación):**
   - Vínculo Contacto → Usuario
   - Crear usuario al invitar contacto

2. **Restricciones de visualización por rol:**
   - Campos de facturación para facturación
   - Campos no sensibles para marketing

3. **Validaciones de eliminación:**
   - Proyectos activos
   - Contactos con usuario

### 6.3 Mejoras Visuales

1. **Hacer editables los contactos** desde el modal detalle
2. **Hacer navegables los proyectos** (clickable)
3. **Mejorar UX de documentos** (preview, download)

---

## 7. Métricas del Módulo

| Métrica | Valor Actual |
|---------|--------------|
| Archivos relacionados | 5 (page.tsx, 3 componentes, types) |
| Líneas de código (page.tsx) | ~866 |
| Tipos definidos | 3 (Empresa, Contacto, Documento) |
| Enums definidos | 9 |
| Funciones de utilidad | ~15 |

---

## 8. Conclusión

El módulo CRM tiene una **implementación del ~70%** respecto a la especificación. Las funcionalidades core están presentes, pero faltan detalles importantes relacionados con:

1. **Permisos granulares** por rol
2. **Vínculo con sistema de usuarios** (portal)
3. **Algunos campos** de facturación
4. **Estado activo/inactivo** de contactos
5. **Validaciones de eliminación** más robustas

El código es limpio y bien estructurado, siguiendo las convenciones del proyecto. La arquitectura de componentes es adecuada y permite extensibilidad.

**Recomendación:** Priorizar la implementación de las brechas críticas (sección 4.1) en la siguiente iteración de desarrollo.
