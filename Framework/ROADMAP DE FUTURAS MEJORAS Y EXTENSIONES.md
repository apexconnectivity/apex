## ROADMAP DE FUTURAS MEJORAS Y EXTENSIONES
### NetOps CRM - Sistema de Gestión para Outsourcing de Redes y Seguridad

**Versión:** 1.0  
**Fecha:** 2026  
**Estado:** Propuestas para fases posteriores al MVP

---

## 1. PROPÓSITO DE ESTE DOCUMENTO

Este documento recopila las ideas, mejoras y posibles nuevos módulos que han surgido durante el diseño y especificación de NetOps CRM. No forman parte del MVP actual, pero se consideran valiosos para el crecimiento y la evolución del sistema. Se presentan como una hoja de ruta para futuras iteraciones, con una priorización sugerida.

---

## 2. MÓDULOS Y FUNCIONALIDADES PROPUESTAS

### 2.1 Módulo de Facturación y Pagos

**Descripción:**  
Gestión completa del ciclo de facturación, desde la generación de facturas (a partir de proyectos, contratos de soporte o ventas puntuales) hasta el seguimiento de pagos, vencimientos y cobranza. Incluiría:

- Generación de facturas en formato PDF (y opcionalmente facturación electrónica según normativa local).
- Registro de pagos (parciales o totales) y conciliación.
- Estados de cuenta de clientes.
- Notificaciones de facturas por vencer y vencidas.
- Integración con el módulo de contratos y proyectos para facturación automática (ej. factura mensual de soporte).

**Integración con otros módulos:**  
- **CRM (M2):** Datos fiscales de la empresa, contactos de facturación.
- **Proyectos (M3):** Montos reales para facturar.
- **Soporte (M5):** Facturación de contratos de soporte.
- **Compras (M11):** Facturas de proveedores (cuentas por pagar).

**Prioridad sugerida:** Alta (si la facturación es un proceso crítico y manual).

---

### 2.2 Módulo de Inventario / Stock

**Descripción:**  
Control de stock de equipos, materiales y consumibles utilizados en proyectos. Permitiría:

- Registrar entradas (compras recibidas) y salidas (asignadas a proyectos o almacén).
- Consultar stock disponible por ubicación (almacén central, obra, etc.).
- Alertas de stock mínimo.
- Trazabilidad de equipos (número de serie, garantía).
- Vinculación con órdenes de compra para actualizar automáticamente el inventario al recibir.

**Integración con otros módulos:**  
- **Compras (M11):** Recepción de mercancía actualiza inventario.
- **Proyectos (M3):** Asignación de equipos a proyectos.
- **Tareas (M4):** Posibilidad de reservar materiales para una tarea.

**Prioridad sugerida:** Media (útil si se maneja un volumen significativo de equipos).

---

### 2.3 Módulo de RRHH / Gestión de Personal

**Descripción:**  
Gestión de los recursos humanos internos, más allá de la simple asignación a proyectos. Incluiría:

- Registro de empleados (datos personales, contacto, fecha de ingreso).
- Gestión de vacaciones, permisos y ausencias.
- Control horario (partes de horas trabajadas por proyecto/tarea).
- Evaluaciones de desempeño.
- Asignación de carga de trabajo y disponibilidad.
- Integración con calendario para ver disponibilidad.

**Integración con otros módulos:**  
- **Autenticación (M1):** Usuarios internos serían empleados.
- **Proyectos (M3):** Asignación de técnicos a proyectos.
- **Tareas (M4):** Registro de tiempo en tareas.
- **Calendario (M8):** Vacaciones y ausencias reflejadas en disponibilidad.

**Prioridad sugerida:** Media (a medida que el equipo crece).

---

### 2.4 Módulo de Informes y Dashboards Avanzados

**Descripción:**  
Unificará las métricas dispersas en los módulos actuales en un panel de control personalizable con gráficos, indicadores clave (KPI) y exportación de informes. Incluiría:

- Dashboards por rol (comercial, técnico, facturación, admin).
- Gráficos interactivos (ventas por mes, proyectos por fase, rentabilidad, etc.).
- Informes programados (ej. resumen semanal por email).
- Exportación a PDF, Excel, CSV.
- Posibilidad de crear informes personalizados (arrastrar y soltar campos).

**Integración con otros módulos:**  
- Todos los módulos aportan métricas.

**Prioridad sugerida:** Media (puede construirse progresivamente).

---

### 2.5 Módulo de Presupuestos y Cotizaciones

**Descripción:**  
Herramienta específica para la creación de presupuestos detallados (propuestas comerciales) que luego puedan convertirse en proyectos al ser aceptados. Incluiría:

- Plantillas de presupuestos con items (productos, servicios, horas).
- Cálculo automático de impuestos, descuentos, totales.
- Generación de PDF profesional.
- Seguimiento del estado del presupuesto (enviado, aceptado, rechazado).
- Conversión a proyecto (con todos los items y tareas predefinidas).

**Integración con otros módulos:**  
- **CRM (M2):** Cliente, contactos.
- **Proyectos (M3):** Al aceptar, se crea el proyecto con fases y tareas.
- **Compras (M11):** Si el presupuesto incluye equipos, puede generar necesidades de compra.

**Prioridad sugerida:** Alta (si se quiere profesionalizar el proceso de ventas).

---

### 2.6 Gestión de Contratos Legales y NDAs

**Descripción:**  
Ampliación del módulo de documentos corporativos para incluir un flujo específico para contratos con clientes y proveedores:

- Fechas de firma, vigencia, renovación automática.
- Alertas de renovación.
- Versionado de documentos.
- Campos personalizados según tipo de contrato.
- Integración con el CRM para ver todos los contratos de una empresa.

**Integración con otros módulos:**  
- **CRM (M2):** Asociado a empresa.
- **Proyectos (M3):** Contrato marco puede asociarse a proyectos.

**Prioridad sugerida:** Baja (ya se pueden subir documentos, pero sin gestión de ciclo).

---

### 2.7 Módulo de Marketing y Leads

**Descripción:**  
Gestión de leads (prospectos) y campañas de marketing. Incluiría:

- Captura de leads desde formularios web.
- Segmentación de contactos para campañas.
- Envío de emails masivos (integración con Mailchimp, SendGrid, etc.).
- Seguimiento de campañas (aperturas, clics).
- Conversión de lead a oportunidad (proyecto).

**Integración con otros módulos:**  
- **CRM (M2):** Leads se convierten en empresas/contactos.

**Prioridad sugerida:** Baja (si el marketing no es una prioridad inicial).

---

### 2.8 Portal de Proveedores

**Descripción:**  
Extensión del portal para proveedores, similar al portal del cliente pero con funcionalidades específicas:

- Consultar órdenes de compra enviadas.
- Subir facturas de proveedor.
- Ver historial de compras.
- Comunicación con el área de compras.

**Integración con otros módulos:**  
- **Compras (M11):** Órdenes de compra, facturas de proveedor.

**Prioridad sugerida:** Baja (puede ser útil si hay muchos proveedores).

---

### 2.9 Integración con WhatsApp / SMS

**Descripción:**  
Canal adicional de notificaciones y comunicación con clientes para eventos urgentes o recordatorios rápidos. Requeriría integración con APIs de WhatsApp Business o servicios de SMS.

**Integración con otros módulos:**  
- **Notificaciones (M9):** Nuevo canal de salida.

**Prioridad sugerida:** Baja (puede ser un plus).

---

### 2.10 Módulo de Presupuestos y Control de Costos por Proyecto

**Descripción:**  
Gestión más fina de costos y rentabilidad por proyecto, con desglose de:

- Costos de personal (horas * tarifa).
- Costos de materiales/equipos (según compras).
- Costos indirectos.
- Margen proyectado vs real.
- Alertas de desviación presupuestaria.

**Integración con otros módulos:**  
- **Proyectos (M3):** Costos reales.
- **Tareas (M4):** Horas trabajadas.
- **Compras (M11):** Costos de materiales.
- **RRHH (futuro):** Costos de personal.

**Prioridad sugerida:** Media (para análisis de rentabilidad).

---

## 3. PRIORIZACIÓN RESUMIDA

| Módulo / Funcionalidad | Prioridad | Complejidad estimada |
|------------------------|-----------|----------------------|
| Facturación y Pagos | Alta | Alta |
| Presupuestos y Cotizaciones | Alta | Media |
| Informes y Dashboards Avanzados | Media | Media |
| Inventario / Stock | Media | Media |
| RRHH / Gestión de Personal | Media | Alta |
| Control de Costos por Proyecto | Media | Alta |
| Gestión de Contratos Legales | Baja | Baja |
| Marketing y Leads | Baja | Media |
| Portal de Proveedores | Baja | Media |
| WhatsApp / SMS | Baja | Baja |

---

## 4. NOTAS ADICIONALES

- Este roadmap es dinámico y puede ajustarse según las necesidades del negocio.
- Se recomienda abordar las funcionalidades de mayor prioridad una vez que el MVP esté estable y en producción.
- Cada nuevo módulo debe planificarse con su propio ciclo de análisis, especificación, desarrollo y pruebas.
- La integración entre módulos debe mantenerse como principio fundamental para evitar silos de información.

---