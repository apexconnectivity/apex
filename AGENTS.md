# AGENTS.md - NetOps CRM Development Guide

## Project Overview

This is a **Next.js 14** CRM application built with **TypeScript**, **Tailwind CSS**, and **Supabase**. The project is located in the `netops-crm/` subdirectory.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode enabled)
- **Styling**: Tailwind CSS + tailwindcss-animate
- **Database**: Supabase (SSR)
- **UI Components**: Radix UI primitives + custom components
- **Utilities**: clsx, tailwind-merge, lucide-react

---

## Build & Development Commands

All commands must be run from the `netops-crm/` directory:

```bash
# Development
npm run dev          # Start development server (http://localhost:3000)

# Build
npm run build        # Production build
npm run start        # Start production server

# Linting
npm run lint         # Run ESLint (Next.js default config)
```

### Running a Single Test

Currently, **there are no tests** in this project. If tests are added later:

```bash
# Jest (if configured)
npm test                    # Run all tests
npm test -- --watch         # Watch mode
npm test -- --testNamePattern="pattern"  # Run specific test

# Vitest (alternative)
npm run test               # Run tests
npm run test -- --run      # Run once (non-watch)
```

---

## Code Style Guidelines

### File Organization

```
src/
├── app/           # Next.js App Router pages
├── components/    # React components
│   ├── ui/        # Reusable UI components (buttons, cards, dialogs, etc.)
│   └── module/    # Feature-specific components
├── contexts/      # React Context providers
├── lib/           # Utilities and helpers (utils.ts, colors.ts)
└── types/         # TypeScript type definitions
```

### Imports

- **Path aliases**: Use `@/*` for imports from `src/` (e.g., `@/components/ui/button`)
- **Group imports**: Order: external libs → internal modules → local files
- **Named imports**: Prefer named imports over default imports

```typescript
// Good
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { type User } from '@/types/user'

// Avoid
import React from 'react'
import Button from '@/components/ui/button'
```

### TypeScript

- **Strict mode**: Enabled in `tsconfig.json` - do not disable it
- **Explicit types**: Always provide types for function parameters and return values
- **Interfaces over types**: Use interfaces for object shapes, types for unions/primitives
- **No `any`**: Avoid `any`; use `unknown` when type is truly unknown

```typescript
// Good
interface User {
  id: string
  name: string
  email: string
}

function getUser(id: string): Promise<User | null> { ... }

// Avoid
function getUser(id: string): Promise<any> { ... }
```

### Naming Conventions

- **Components**: PascalCase (e.g., `DashboardHeader.tsx`, `UserCard.tsx`)
- **Hooks**: camelCase starting with `use` (e.g., `useAuth`, `useUsers`)
- **Utilities**: camelCase (e.g., `formatDate.ts`, `cn.ts`)
- **Types/Interfaces**: PascalCase (e.g., `UserProfile`, `ProjectStatus`)
- **Constants**: UPPER_SNAKE_CASE for true constants, camelCase for enum-like objects
- **Files**: kebab-case for non-component files (e.g., `utils.ts`, `colors.ts`)

### Component Patterns

- Use **functional components** with TypeScript
- Use **FC<Props>** or explicit parameter types (both acceptable)
- Keep components small and focused
- Extract reusable logic into custom hooks

```typescript
// Preferred pattern
interface ButtonProps {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function Button({ variant = 'default', size = 'md', children }: ButtonProps) {
  return <button className={cn(...)}>{children}</button>
}
```

### Tailwind CSS

- Use **`cn()`** utility from `@/lib/utils` for class merging
- Follow the design system defined in `tailwind.config.ts`
- Use CSS variables for colors (e.g., `hsl(var(--primary))`)
- Prefer semantic class names over arbitrary values

```typescript
// Good
<div className="flex items-center justify-between p-4">
  <span className="text-sm font-medium text-muted-foreground">
    {label}
  </span>
</div>

// Avoid
<div style={{ display: 'flex', padding: '16px' }}>
```

### Error Handling

- Use **try/catch** with async operations
- Provide user-friendly error messages
- Log errors appropriately for debugging
- Use TypeScript's type system to handle edge cases

```typescript
// Good
async function fetchUsers() {
  try {
    const { data, error } = await supabase.from('users').select('*')
    if (error) throw error
    return data
  } catch (err) {
    console.error('Failed to fetch users:', err)
    return []
  }
}
```

### Async/Await

- Always handle errors in async functions
- Use `await` with proper error boundaries
- Prefer explicit return types for async functions

---

## UI Component Library

The project uses a custom UI component library in `src/components/ui/`:

| Component | File | Description |
|-----------|------|-------------|
| Button | `button.tsx` | Primary action button with variants |
| Card | `card.tsx` | Container for content sections |
| Input | `input.tsx` | Text input field |
| Dialog | `dialog.tsx` | Modal dialog (Radix-based) |
| Select | `select.tsx` | Dropdown selection |
| Badge | `badge.tsx` | Status/category indicator |
| Tabs | `tabs.tsx` | Tabbed navigation |
| Avatar | `avatar.tsx` | User avatar display |
| MiniStat | `mini-stat.tsx` | Compact stat card with icon |
| StatGrid | `mini-stat.tsx` | Grid layout for stats |
| BarChart | `stats-chart.tsx` | Bar chart component |
| PieChart | `stats-chart.tsx` | Pie chart component |
| ProgressRing | `stats-chart.tsx` | Circular progress indicator |
| MetricCard | `stats-chart.tsx` | Card with metric display |
| ChartGrid | `stats-chart.tsx` | Grid layout for charts |

All UI components use **Radix UI** primitives and follow the same patterns.

---

## Statistics Module

The project includes a complete statistics module with reusable components:

### Constants
Located in `src/constants/estadisticas.ts`:

| Constant | Description |
|----------|-------------|
| `CHART_COLORS` | Centralized color palette for charts |
| `CHART_PALETTE` | Rotating color palette |
| `STATS_LABELS` | Centralized labels and text |
| `ENTITY_TYPE_COLORS` | Colors for CRM entity types |
| `PROJECT_STATUS_COLORS` | Colors for project states |
| `TASK_STATUS_COLORS_MAP` | Colors for task states |
| `PRIORITY_COLORS_MAP` | Colors for priorities |
| `TICKET_STATUS_COLORS_MAP` | Colors for ticket states |

### Helper Functions
- `getChartColorByIndex(index)`: Get color from palette by index
- `mapToChartData(data, colorMap)`: Convert data records to chart format
- `getVariantByStatus(status)`: Get MiniStat variant from status string

### Chart Components
Located in `src/components/ui/stats-chart.tsx`:

```typescript
// Bar Chart
<BarChart 
  data={[{ label: 'Label', value: 10, color: '#06b6d4' }]} 
  title="Chart Title" 
/>

// Pie Chart
<PieChart 
  data={[{ label: 'Label', value: 10, color: '#06b6d4' }]} 
  title="Chart Title" 
/>

// Progress Ring
<ProgressRing 
  value={75} 
  max={100} 
  color="#10b981" 
  label="Progress" 
/>

// Metric Card
<MetricCard 
  title="Metric Title" 
  value={100} 
  icon={<Icon />} 
/>

// Chart Grid
<ChartGrid cols={2}>
  <Chart1 />
  <Chart2 />
</ChartGrid>
```

---

## Supabase Integration

The project uses `@supabase/ssr` for Server-Side Rendering compatibility:

- Use `createBrowserClient` for client components
- Use `createServerClient` for server components and Route Handlers
- Environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Next.js App Router Conventions

- Use **Server Components** by default
- Mark client components with `'use client'` directive when needed
- Use `app/` directory for routes (e.g., `app/dashboard/page.tsx`)
- Follow Next.js 14 best practices for data fetching and caching

---

## Development Workflow

1. Create feature branches from `main`
2. Run `npm run lint` before committing
3. Run `npm run build` to verify production build works
4. Follow the existing code patterns in the project

---

## Common Tasks

### Adding a new UI component
1. Create file in `src/components/ui/component-name.tsx`
2. Use Radix primitives if needed
3. Export from `src/components/ui/index.ts` (if exists)
4. Use `cn()` for class merging

### Adding a new page
1. Create route in `src/app/` (e.g., `app/users/page.tsx`)
2. Use Server Components by default
3. Add `'use client'` only if interaction is needed

### Database operations
1. Use Supabase client from `@/lib/supabase`
2. Handle errors gracefully
3. Type the response data properly

---

## Notes

- No test framework is currently configured
- ESLint uses Next.js default configuration
- Prettier is not explicitly configured (uses editor defaults)

---
