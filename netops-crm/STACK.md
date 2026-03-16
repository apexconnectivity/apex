# STACK TÉCNICO - NetOps CRM

**Versión:** 1.10  
**Fecha:** 2026-03-15  
**Estado:** En desarrollo - Coherencia de UI: ModuleContainer, ModuleCard, StatGrid, hooks centralizados

---

## 1. ELECCIÓN DE TECNOLOGÍA

### Criterios de selección

| Criterio | Prioridad |
|----------|-----------|
| Estabilidad | Crítica |
| Fluidez/UX | Alta |
| Ecosistema de librerías | Alta |
| Integración con Supabase | Crítica |
| Curva de aprendizaje | Media |

### Decisión: Next.js + TypeScript

**Justificación:**
- Next.js ofrece el mejor balance entre estabilidad y modernidad
- Mayor ecosistema de componentes UI (shadcn/ui, Radix)
- Integración nativa con Supabase (@supabase/ssr)
- Renderizado híbrido (SSR + Client) para mejor rendimiento
- Deploy automático en Vercel (gratis)

---

## 2. STACK ACTUAL

### Core

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Next.js** | 14.2.21 | Framework React estable |
| **React** | 18.3.1 | UI Library |
| **TypeScript** | 5.7.2 | Tipado estático |
| **Tailwind CSS** | 3.4.0 | Estilos utility-first |

### Supabase (pendiente de implementación)

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **@supabase/ssr** | ^0.5.2 | Autenticación y cookies (Next.js) - Pendiente |
| **@supabase/supabase-js** | ^2.45.4 | Client para browser - Pendiente |

**Estado:** Paquetes instalados pero no configurados. Actualmente se usa localStorage para persistencia.

### UI Components

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **shadcn/ui** | 4.x | Componentes accesibles |
| **@dnd-kit/core** | ^6.3.1 | Drag & Drop |
| **@dnd-kit/sortable** | ^10.0.0 | Drag & Drop ordenable |
| **lucide-react** | ^0.468.0 | Iconos |

### Desarrollo

| Tecnología | Propósito |
|------------|-----------|
| **eslint** | Linting de código |
| **postcss** | Procesamiento CSS |
| **typescript** | Compilación de tipos |

---

## 3. DECISIONES DE ARQUITECTURA

### 3.1 Renderizado

- **SSR (Server-Side Rendering):** No implementado actualmente
- **CSR (Client-Side Rendering):** Toda la aplicación usa `use client`
- **ISR (Incremental Static Regeneration):** No utilizado

### 3.2 Estado

- **localStorage:** Persistencia actual de datos (tickets, contratos, proyectos, tareas, empresas)
- **Client Components:** Toda la aplicación con `use client`
- **useState/useLocalStorage:** Gestión de estado local

### 3.3 Rutas

```
/                         → Landing / Redirect
/login                    → Login público
/recuperar-password       → Recuperar contraseña

/dashboard                → Dashboard principal
/dashboard/crm            → CRM Empresas/Contactos
/dashboard/proyectos      → Pipeline de proyectos
/dashboard/tareas         → Mis tareas
/dashboard/calendario     → Calendario
/dashboard/compras       → Órdenes de compra
/dashboard/soporte       → Tickets y contratos de soporte
/dashboard/usuarios      → Gestión de usuarios
/dashboard/archivos      → Archivos
/dashboard/archivados    → Elementos archivados
/dashboard/notificaciones → Notificaciones
/dashboard/perfil        → Perfil de usuario

/portal                   → Portal cliente (vista simplificada)
/portal/proyectos         → Proyectos del cliente
```

---

## 4. COMPONENTES UI

### 4.1 shadcn/ui

**Instalado:** ✅ Sí  
**Versión:** 4.x  
**Propósito:** Componentes accesibles y personalizables

**Componentes instalados:**
- Button ✅
- Input ✅
- Label ✅
- Card ✅
- Dialog ✅
- Select ✅
- Dropdown Menu ✅
- Badge ✅
- Avatar ✅
- Textarea ✅
- Tabs ✅
- Checkbox ✅
- Tooltip ✅

**Componentes NO instalados:**
- Table ⏳
- Separator ⏳
- Sheet ⏳

**Componentes personalizados adicionales:**
- Modal (custom)
- Skeleton
- StatCard
- MiniStat
- InfoCard
- AccessDeniedCard
- RoleBadge

### 4.2 @dnd-kit

**Instalado:** ✅ Sí  
**Propósito:** Drag & Drop para pipeline

**Uso implementado:**
- Mover tickets entre estados (soporte)
- Mover proyectos entre fases (proyectos)
- Mover tareas entre estados (tareas)

---

## 5. PERSISTENCIA DE DATOS

### Sistema Actual (localStorage)

| Entidad | Key localStorage | Estado |
|---------|------------------|--------|
| Empresas | `apex_crm_datos` | ✅ Implementado |
| Proyectos | `apex_proyectos_datos` | ✅ Implementado |
| Tareas | `apex_tareas_datos` | ✅ Implementado |
| Tickets | `apex_soporte_datos` | ✅ Implementado |
| Contratos Soporte | `apex_contratos_soporte` | ✅ Implementado |
| Comentarios | `apex_soporte_comentarios` | ✅ Implementado |
| Vista Soporte | `apex_soporte_vista` | ✅ Implementado |
| Órdenes Compra | `apex_compras_datos` | ✅ Implementado |
| Proveedores | `apex_proveedores_datos` | ✅ Implementado |
| Cotizaciones | `apex_cotizaciones_datos` | ✅ Implementado |
| Vista Compras | `apex_compras_vista` | ✅ Implementado |
| Config Notificaciones | `apex_notificaciones_config` | ✅ Implementado |
| Preferencia Notificaciones | `apex_notificaciones_preferencia` | ✅ Implementado |
| Eventos Notificaciones | `apex_notificaciones_eventos` | ✅ Implementado |
| Vista Notificaciones | `apex_notificaciones_vista` | ✅ Implementado |
| Usuario sesión | `apex_user` | ✅ Implementado |
| Archivos | `netops_archivos` | ✅ Implementado |
| Proyectos Archivados | `netops_proyectos_archivados` | ✅ Implementado |
| Proyectos Cerrados | `netops_proyectos_cerrados` | ✅ Implementado |
| Config Archivado | `netops_config_archivado` | ✅ Implementado |

**Constantes centralizadas:** Todas las keys están definidas en `src/constants/storage.ts`

### Pendiente: Supabase

| Servicio | Estado |
|----------|--------|
| Auth | ⏳ Pendiente implementación |
| Database | ⏳ Pendiente implementación |
| Storage | ⏳ Pendiente implementación |

---

## 6. INTEGRACIONES EXTERNAS

| Servicio | API | Estado |
|----------|-----|--------|
| **Supabase** | Auth, Database, Storage | ⏳ Pendiente implementación |
| **Google Drive** | Drive API | ⏳ Pendiente |
| **Google Calendar** | Calendar API | ⏳ Pendiente |
| **Slack** | Webhooks | ⏳ Pendiente |
| **n8n** | Webhooks | ⏳ Pendiente |

---

## 7. ESTRUCTURA DE CARPETAS

```
netops-crm/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Rutas autenticación
│   │   │   ├── login/
│   │   │   └── recuperar-password/
│   │   ├── (dashboard)/       # Rutas dashboard
│   │   │   └── dashboard/
│   │   │       ├── crm/
│   │   │       ├── proyectos/
│   │   │       ├── tareas/
│   │   │       ├── calendario/
│   │   │       ├── compras/
│   │   │       ├── soporte/
│   │   │       ├── usuarios/
│   │   │       ├── archivos/
│   │   │       ├── archivados/
│   │   │       ├── notificaciones/
│   │   │       └── perfil/
│   │   ├── portal/            # Portal cliente
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home
│   │   └── globals.css
│   │
│   ├── components/            # Componentes React
│   │   ├── ui/               # shadcn/ui + personalizados
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── ...
│   │   │   ├── access-denied-card.tsx
│   │   │   ├── info-card.tsx
│   │   │   ├── mini-stat.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── stat-card.tsx
│   │   │   └── role-badge.tsx
│   │   │
│   │   ├── module/           # Componentes de módulo
│   │   │   ├── TicketDetailPanel.tsx
│   │   │   ├── TaskDetailPanel.tsx
│   │   │   ├── ProjectDetailPanel.tsx
│   │   │   ├── CreateTicketModal.tsx
│   │   │   ├── CreateContractModal.tsx
│   │   │   ├── CreateTaskModal.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   ├── ModuleContainer.tsx
│   │   │   ├── ModuleHeader.tsx
│   │   │   ├── ModuleCard.tsx
│   │   │   ├── ArchivoCard.tsx
│   │   │   ├── FolderSection.tsx
│   │   │   ├── UploadModal.tsx
│   │   │   ├── ProyectoCerradoCard.tsx
│   │   │   ├── ProyectoArchivadoCard.tsx
│   │   │   ├── DetalleArchivadoModal.tsx
│   │   │   ├── ConfirmArchiveModal.tsx
│   │   │   ├── ConfirmDeleteModal.tsx
│   │   │   ├── ConfiguracionTab.tsx
│   │   │   └── ...
│   │   │
│   │   ├── dashboard-stats.tsx
│   │   ├── pipeline.tsx
│   │   ├── welcome-header.tsx
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   └── auth-guard.tsx
│   │
│   ├── contexts/              # React Context
│   │   ├── auth-context.tsx
│   │   └── portal-auth-context.tsx
│   │
│   ├── hooks/                 # Custom hooks
│   │   ├── useArchivosStorage.ts    # Hook para archivos (localStorage)
│   │   ├── useArchivadoStorage.ts   # Hook para archivados (localStorage)
│   │   └── index.ts           # Export centralizado
│   │
│   ├── lib/                   # Utilidades
│   │   ├── utils.ts           # cn() y cnHoverLift helpers
│   │   ├── colors.ts          # Colores centralizados (ROLE_COLORS)
│   │   ├── date-utils.ts      # Utilidades de fecha
│   │   ├── useLocalStorage.ts # Hook localStorage
│   │   └── data/              # Datos iniciales
│   │       ├── store.ts
│   │       ├── initial-data.ts
│   │       └── index.ts
│   │
│   ├── data/                   # Datos demo separados por módulo
│   │   └── compras-demo.ts    # Datos demo compras
│   │
│   ├── types/                 # TypeScript types
│   │   ├── soporte.ts
│   │   ├── proyectos.ts
│   │   ├── tareas.ts
│   │   ├── crm.ts
│   │   ├── compras.ts
│   │   ├── calendario.ts
│   │   ├── portal.ts
│   │   ├── auth.ts
│   │   ├── archivado.ts
│   │   ├── archivos.tsx      # Tipos y funciones para archivos (soporta JSX)
│   │   ├── notificaciones.ts
│   │   └── compartidos.ts
│   │
│   └── constants/             # Constantes
│       ├── soporte.ts         # Textos y keys localStorage (módulo soporte)
│       ├── storage.ts         # Keys y valores iniciales centralizados (localStorage)
│       ├── archivos.ts        # Textos, labels y configuraciones (módulo archivos)
│       ├── archivado.ts       # Textos, labels y configuraciones (módulo archivados)
│       ├── compras.ts         # Textos, labels, impuestos (módulo compras)
│       └── notificaciones.ts  # Textos, labels y configuraciones (módulo notificaciones)
│
├── public/                   # Archivos estáticos
├── package.json
├── next.config.mjs           # Next.js config
├── tailwind.config.ts
├── tsconfig.json
├── components.json            # shadcn config
└── STACK.md                  # Este archivo
```

---

## 8. VARIABLES DE ENTORNO

```env
# Supabase - Pendiente configurar
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

**Estado:** Variables no configuradas. Proyecto funciona con datos demo y localStorage.

---

## 9. SCRIPTS DISPONIBLES

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Iniciar servidor desarrollo (localhost:3000) |
| `npm run build` | Build producción |
| `npm run start` | Iniciar producción |
| `npm run lint` | Verificar código |

---

## 10. CARACTERÍSTICAS IMPLEMENTADAS

### Módulos del Dashboard

| Módulo | Estado | Notas |
|--------|--------|-------|
| Dashboard principal | ✅ | Stats, actividad reciente, próximas tareas |
| CRM | ✅ | Empresas, contactos, pipeline |
| Proyectos | ✅ | Pipeline con drag & drop |
| Tareas | ✅ | Kanban por estado |
| Calendario | ✅ | Reuniones y solicitudes |
| Compras | ✅ | Órdenes de compra, cotizaciones |
| Soporte | ✅ | Tickets, contratos, pipeline |
| Usuarios | ✅ | Gestión de usuarios |
| Archivos | ✅ | Gestión documental |
| Archivados | ✅ | Elementos eliminados |
| Notificaciones | ✅ | Centro de notificaciones |
| Perfil | ✅ | Perfil de usuario |

### Portal del Cliente

| Módulo | Estado | Notas |
|--------|--------|-------|
| Portal principal | ✅ | Vista simplificada |
| Proyectos cliente | ✅ | Solo proyectos propios |
| Tickets cliente | ✅ | Solo tickets propios |

---

## 11. CONTROL DE CAMBIOS

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0 | 2026-03-07 | Stack inicial con Next.js 16 (NO recomendado) |
| 1.1 | 2026-03-07 | Downgrade a Next.js 14.x por estabilidad |
| 1.2 | 2026-03-07 | Instalado shadcn/ui + @dnd-kit. Rename next.config.ts → .mjs |
| 1.3 | 2026-03-07 | Migración completa de UI a shadcn/ui |
| 1.4 | 2026-03-15 | Módulo soporte implementado, localStorage, corrección de estilos |
| 1.5 | 2026-03-15 | Constantes centralizadas para archivos y storage, mejoras de consistencia UI |
| 1.6 | 2026-03-15 | Módulo compras: localStorage, constantes centralizadas, estilos consistentes, datos demo extraídos |
| 1.7 | 2026-03-15 | Módulo notificaciones: localStorage, constantes centralizadas, ModuleContainer corregido, StatCards consistentes |
| 1.8 | 2026-03-15 | Módulo archivos y archivados: localStorage, componentes extraídos, constantes centralizadas, hooks personalizados |
| 1.9 | 2026-03-15 | Módulo usuarios: RoleBadge componente, getRoleColor en colors, filtros consistentes, modal confirmación |
| 1.10 | 2026-03-15 | Coherencia UI: Dashboard y CRM usan ModuleContainer, Pipeline usa ModuleCard, Stats usan StatGrid+MiniStat, hooks centralizados |

---

## 12. PRÓXIMOS PASOS

### Prioridad alta
- [ ] Implementar Supabase (Auth, Database, Storage)
- [ ] Migrar datos de localStorage a Supabase
- [ ] Agregar testing (Vitest + React Testing Library)
- [ ] Configurar CI/CD con GitHub Actions

### Prioridad media
- [ ] Implementar Server Components donde sea posible
- [ ] Agregar loading skeletons a todas las páginas
- [ ] Implementar error boundaries
- [ ] Agregar componentes faltantes de shadcn (Table, Sheet, Separator)

### Prioridad baja
- [ ] Implementar React Query para estado compartido
- [ ] Agregar internacionalización (i18n)
- [ ] Implementar PWA
- [ ] Integraciones externas (Google Drive, Calendar, Slack, n8n)

---

**Documento creado:** 2026-03-07  
**Última actualización:** 2026-03-15 (v1.10)  
**Responsable:** Sistema
