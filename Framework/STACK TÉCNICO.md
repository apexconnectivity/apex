# STACK TÉCNICO - NetOps CRM

**Versión:** 1.3  
**Fecha:** 2026-03-07  
**Estado:** Migración a shadcn/ui completada

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
| **TypeScript** | 5.x | Tipado estático |
| **Tailwind CSS** | 4.x | Estilos utility-first |

### Supabase

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **@supabase/ssr** | ^0.5.2 | Autenticación y cookies (Next.js) |
| **@supabase/supabase-js** | ^2.45.4 | Client para browser |

### UI Components

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **shadcn/ui** | 4.x | Componentes accesibles |
| **@dnd-kit/core** | ^6.3.1 | Drag & Drop |
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

- **SSR (Server-Side Rendering):** Páginas que requieren datos dinámicos (dashboard, proyectos)
- **CSR (Client-Side Rendering):** Componentes interactivos (drag & drop, formularios)
- **ISR (Incremental Static Regeneration):** No utilizado por ahora

### 3.2 Estado

- **Server Components:** Datos de Supabase directamente en componentes servidor
- **Client Components:** Componentes interactivos con `use client`
- **Cookies:** Sesión administrada vía @supabase/ssr

### 3.3 Rutas

```
/                         → Landing / Redirect
/login                    → Login público
/recuperar-acceso         → Recuperar contraseña
/reset-password           → Token de recuperación

/dashboard                → Dashboard principal (admin/técnico)
/dashboard/crm            → CRM Empresas/Contactos
/dashboard/proyectos      → Pipeline de proyectos
/dashboard/tareas         → Mis tareas

/portal                   → Portal cliente (root redirect)
/portal/tareas            → Tareas del cliente
/portal/perfil            → Perfil del cliente
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
- Table ✅
- Select ✅
- Dropdown Menu ✅
- Separator ✅
- Badge ✅
- Avatar ✅
- Textarea ✅
- Tabs ✅
- Sheet ✅

**Cómo agregar más:**
```bash
npx shadcn@latest add [componente]
```

### 4.2 @dnd-kit

**Instalado:** ✅ Sí  
**Propósito:** Drag & Drop para pipeline de proyectos

**Uso previsto:**
- Mover proyectos entre fases
- Reordenar tareas dentro de fases

---

## 5. INTEGRACIONES EXTERNAS

| Servicio | API | Estado |
|----------|-----|--------|
| **Supabase** | Auth, Database, Storage | ✅ Configurado |
| **Google Drive** | Drive API | ⏳ Pendiente |
| **Google Calendar** | Calendar API | ⏳ Pendiente |
| **Slack** | Webhooks | ⏳ Pendiente |
| **n8n** | Webhooks | ⏳ Pendiente |

---

## 6. ESTRUCTURA DE CARPETAS

```
netops-crm/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── login/
│   │   ├── dashboard/
│   │   ├── portal/
│   │   ├── recuperar-acceso/
│   │   ├── reset-password/
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home
│   │   └── globals.css
│   │
│   ├── components/            # Componentes React
│   │   ├── ui/               # shadcn/ui components
│   │   └── ...
│   │
│   ├── lib/                   # Utilidades
│   │   ├── supabase/         # Clientes Supabase
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── middleware.ts
│   │   └── utils.ts
│   │
│   ├── types/                 # TypeScript types
│   │   └── database.ts
│   │
│   └── middleware.ts          # Next.js middleware
│
├── supabase/
│   └── migrations/           # SQL migrations
│
├── public/                   # Archivos estáticos
├── package.json
├── next.config.mjs           # Next.js config (debe ser .mjs)
├── tailwind.config.ts
├── tsconfig.json
└── components.json            # shadcn config
```

---

## 7. VARIABLES DE ENTORNO

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxx

# Auth
NEXT_PUBLIC_SUPABASE_URL=
```

---

## 8. SCRIPTS DISPONIBLES

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Iniciar servidor desarrollo |
| `npm run build` | Build producción |
| `npm run start` | Iniciar producción |
| `npm run lint` | Verificar código |

---

## 9. CONTROL DE CAMBIOS

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0 | 2026-03-07 | Stack inicial con Next.js 16 (NO recomendado) |
| 1.1 | 2026-03-07 | Downgrade a Next.js 14.x por estabilidad |
| 1.2 | 2026-03-07 | Instalado shadcn/ui + @dnd-kit. Rename next.config.ts → .mjs |
| 1.3 | 2026-03-07 | Migración completa de UI a shadcn/ui |

---

## 10. RECOMENDACIONES FUTURAS

### Prioridad alta
- [ ] Implementar React Query para estado compartido
- [ ] Agregar testing (Vitest + React Testing Library)
- [ ] Configurar CI/CD con GitHub Actions

### Prioridad media
- [ ] Implementar optimistic updates para mejor UX
- [ ] Agregar loading skeletons
- [ ] Implementar error boundaries

### Prioridad baja
- [ ] Migrar a App Router completo
- [ ] Agregar internacionalización (i18n)
- [ ] Implementar PWA

---

**Documento creado:** 2026-03-07  
**Última actualización:** 2026-03-07  
**Responsable:** Sistema
