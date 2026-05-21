# Reflection AI Dashboard — Build Plan

## Project Overview

A Next.js 16 enterprise admin dashboard for AI infrastructure management, designed as a portfolio project targeting Reflection AI's "Member of Technical Staff — Applications" role. The dashboard simulates a developer-friendly AI platform for engineering teams, featuring GPU monitoring, model registry, deployment pipelines, team management, and enterprise integrations.

---

## Tech Stack

| Layer          | Technology                                  | Version |
| -------------- | ------------------------------------------- | ------- |
| Framework      | Next.js (App Router)                        | 16.x    |
| Language       | TypeScript                                  | 5.x     |
| Styling        | Tailwind CSS                                | 4.x     |
| UI Components  | shadcn/ui                                   | latest  |
| Icons          | Lucide React                                | latest  |
| Charts         | Recharts + Tremor                           | latest  |
| Tables         | TanStack Table                              | 8.x     |
| State (Client) | Zustand                                     | 5.x     |
| State (Server) | TanStack Query (React Query)                | 5.x     |
| Forms          | React Hook Form + Zod                       | latest  |
| Mock API       | MSW (Mock Service Worker)                   | 2.x     |
| Fake Data      | @faker-js/faker                             | latest  |
| Testing        | Vitest + React Testing Library + Playwright | latest  |
| Date Utils     | date-fns                                    | latest  |

---

## Architecture

```
reflection-dashboard/
├── app/                          # Next.js App Router
│   ├── (dashboard)/              # Dashboard layout group
│   │   ├── layout.tsx            # Sidebar + Topbar shell
│   │   ├── dashboard/            # Main dashboard page
│   │   ├── models/               # Model registry
│   │   ├── deployments/          # CI/CD pipeline status
│   │   ├── teams/                # Team & role management
│   │   ├── monitoring/           # Real-time alerts & metrics
│   │   ├── playground/           # AI prompt testing
│   │   ├── integrations/         # SSO/API config
│   │   └── settings/             # Billing, security, audit
│   ├── api/                      # Next.js API routes (for MSW fallback)
│   ├── login/                    # Auth page
│   ├── layout.tsx                # Root layout with providers
│   └── page.tsx                  # Landing / redirect
├── components/
│   ├── ui/                       # shadcn/ui primitives
│   ├── layout/                   # Sidebar, Topbar, Breadcrumbs
│   ├── charts/                   # Recharts wrappers
│   ├── tables/                   # TanStack Table wrappers
│   ├── forms/                    # Reusable form components
│   └── guards/                   # RBAC route guards
├── hooks/
│   ├── useAuth.ts                # Auth + permission checks
│   ├── useGpuMetrics.ts          # GPU monitoring data
│   ├── useModelRegistry.ts       # Model list/detail
│   ├── useDeployments.ts         # Deployment pipeline data
│   ├── useTeams.ts               # Team/user data
│   ├── useAuditLogs.ts           # Audit trail data
│   ├── useBilling.ts             # Usage & cost data
│   └── usePlayground.ts          # Prompt testing state
├── stores/
│   ├── authStore.ts              # Zustand: user, roles, tokens
│   ├── uiStore.ts                # Zustand: sidebar, modals, toasts
│   └── themeStore.ts             # Zustand: dark/light mode
├── lib/
│   ├── api-client.ts             # Typed fetch/axios wrapper
│   ├── permissions.ts            # RBAC logic
│   ├── validators.ts             # Zod schemas
│   └── utils.ts                  # cn(), formatters, etc.
├── mocks/
│   ├── browser.ts                # MSW browser setup
│   ├── server.ts                 # MSW server setup (for tests)
│   ├── handlers.ts               # All API route handlers
│   └── data/
│       ├── gpu-metrics.ts        # Time-series GPU data generator
│       ├── model-registry.ts     # Model catalog data
│       ├── deployments.ts        # CI/CD pipeline data
│       ├── teams.ts              # User/role data
│       ├── audit-logs.ts         # Compliance trail data
│       ├── billing.ts            # Usage/cost data
│       └── playground.ts         # Prompt response data
├── types/
│   ├── api.ts                    # API request/response types
│   ├── models.ts                 # Domain model types
│   └── auth.ts                   # Auth & RBAC types
├── tests/
│   ├── unit/                     # Vitest tests
│   └── e2e/                      # Playwright tests
└── public/                       # Static assets
```

---

## Phase 1: Foundation & Migration (Week 1)

### 1.1 Initialize Next.js 16 Project

- [x] Run `npx create-next-app@latest` with TypeScript, Tailwind, App Router
- [x] Configure `tsconfig.json` with strict mode and path aliases (`@/*`)
- [x] Set up ESLint + Prettier with consistent rules
- [x] Configure `next.config.js` for static export (for Vercel deployment)

### 1.2 Install Core Dependencies

- [x] shadcn/ui: `npx shadcn@latest init`
- [x] State: `zustand`, `@tanstack/react-query`
- [x] Tables: `@tanstack/react-table`
- [x] Charts: `recharts`, `@tremor/react`
- [x] Forms: `react-hook-form`, `zod`, `@hookform/resolvers`
- [x] Mock: `msw`, `@faker-js/faker`
- [x] Utils: `date-fns`, `lucide-react`
- [x] Testing: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `playwright`

### 1.3 Set Up shadcn/ui Components

Install the following shadcn/ui primitives:

- [x] Button, Card, Badge, Avatar, Separator, Skeleton
- [x] Dialog, Sheet, DropdownMenu, Popover, Tooltip
- [x] Table, DataTable (custom wrapper)
- [x] Form, Input, Textarea, Select, Switch, Checkbox
- [x] Tabs, Accordion, Breadcrumb, Command (for CMD+K)
- [x] Chart (if available) or custom Tremor wrappers
- [x] Sonner (toast notifications)

### 1.4 Configure Theme & Layout

- [x] Set up `next-themes` for dark/light mode
- [x] Create enterprise color palette (slate/blue/emerald/amber/rose)
- [x] Build root layout with font (Inter), metadata, providers
- [x] Build dashboard layout: collapsible sidebar, topbar, main content area
- [x] Add responsive breakpoints (mobile sidebar drawer)

### 1.5 Set Up Zustand Stores

- [x] `authStore`: user object, roles, permissions, login/logout actions
- [x] `uiStore`: sidebar open/closed, active modal, toast queue
- [x] `themeStore`: theme preference (sync with next-themes)

### 1.6 Set Up TanStack Query

- [x] Create `QueryClient` with default options (staleTime, refetchInterval)
- [x] Wrap app in `QueryClientProvider`
- [x] Configure devtools (show in development only)

### 1.7 Set Up MSW (Mock Service Worker)

- [x] Initialize MSW: `npx msw init public/`
- [x] Create `mocks/browser.ts` and `mocks/server.ts`
- [x] Create `mocks/handlers.ts` with placeholder routes
- [x] Conditionally start MSW in development mode
- [x] Verify API calls are intercepted in Network tab

### 1.8 Migrate Existing Assets

- [x] Port `DummyData.jsx` data into typed mock generators
- [x] Port existing page concepts into new route structure
- [x] Ensure all old routes redirect or are replaced

**Deliverable**: Running Next.js 16 app with shadcn/ui theme, sidebar layout, and MSW intercepting requests.

---

## Phase 2: Mock Data Layer (Week 1-2)

### 2.1 Define API Types

Create `types/api.ts` with interfaces for all endpoints:

- [x] `ApiResponse<T>` wrapper with data, meta, error fields
- [x] `PaginatedResponse<T>` with page, limit, total, hasMore
- [x] `GpuMetric`, `GpuMetricSeries` for time-series data
- [x] `Model`, `ModelVersion`, `ModelDeployment` for registry
- [x] `Deployment`, `DeploymentStage`, `DeploymentLog` for CI/CD
- [x] `TeamMember`, `Role`, `Permission` for RBAC
- [x] `AuditLogEntry` for compliance
- [x] `BillingUsage`, `BillingInvoice` for cost tracking
- [x] `PlaygroundMessage`, `PlaygroundSession` for prompt testing

### 2.2 Build Data Generators

Create faker-powered generators in `mocks/data/`:

- [x] `gpu-metrics.ts`: Generate 24h of 5-minute interval GPU data (utilization, memory, temp, power)
- [x] `model-registry.ts`: Generate 10-20 AI models with versions, statuses, metadata
- [x] `deployments.ts`: Generate 15-30 deployment pipelines with stages
- [x] `teams.ts`: Generate 8-15 team members with roles (admin, engineer, viewer)
- [x] `audit-logs.ts`: Generate 50+ audit entries (login, permission change, deployment)
- [x] `billing.ts`: Generate monthly usage data with cost breakdowns
- [x] `playground.ts`: Generate mock LLM responses for prompt testing

### 2.3 Build MSW Handlers

Create full REST API in `mocks/handlers.ts`:

- [x] `GET /api/metrics/gpu` — GPU time-series metrics
- [x] `GET /api/metrics/gpu/summary` — Current cluster summary
- [x] `GET /api/metrics/inference` — Inference latency & throughput
- [x] `GET /api/models` — List models (paginated, filterable)
- [x] `GET /api/models/:id` — Model detail
- [x] `POST /api/models/:id/deploy` — Trigger deployment
- [x] `GET /api/deployments` — List deployments
- [x] `GET /api/deployments/:id` — Deployment detail with logs
- [x] `GET /api/deployments/:id/logs` — Streaming logs (SSE mock)
- [x] `GET /api/teams` — List team members
- [x] `POST /api/teams/invite` — Invite new member
- [x] `PATCH /api/teams/:id/role` — Update role
- [x] `GET /api/audit-logs` — Audit trail (paginated)
- [x] `GET /api/billing/usage` — Current period usage
- [x] `GET /api/billing/invoices` — Invoice history
- [x] `POST /api/playground/completion` — Mock LLM completion
- [x] `POST /api/auth/login` — Mock login
- [x] `POST /api/auth/logout` — Mock logout
- [x] `GET /api/auth/me` — Current user

### 2.4 Build API Client

Create `lib/api-client.ts`:

- [x] Typed fetch wrapper with base URL, headers, error handling
- [x] Request/response interceptors for auth tokens
- [x] Standardized error formatting
- [x] Support for query params, pagination, filtering

### 2.5 Build TanStack Query Hooks

Create hooks in `hooks/`:

- [x] `useGpuMetrics(timeRange)` — Returns time-series data, auto-refetch
- [x] `useGpuSummary()` — Returns current cluster snapshot
- [x] `useInferenceMetrics()` — Returns latency/throughput data
- [x] `useModelRegistry(filters)` — Returns paginated model list
- [x] `useModelDetail(id)` — Returns single model with versions
- [x] `useDeployments()` — Returns deployment list
- [x] `useDeploymentDetail(id)` — Returns deployment with stages
- [x] `useTeams()` — Returns team members
- [x] `useAuditLogs(pagination)` — Returns audit trail
- [x] `useBillingUsage()` — Returns current usage
- [x] `usePlayground()` — Returns prompt testing state + mutation

**Deliverable**: All API endpoints returning realistic fake data, consumed by typed hooks with loading/error states.

---

## Phase 3: Dashboard Core (Week 2)

### 3.1 Main Dashboard Page (`/dashboard`)

Build the landing dashboard with these sections:

#### Metric Cards (FeaturedInfo replacement)

- [x] **GPU Utilization** — Current average % with trend indicator
- [x] **Active Models** — Count of deployed models with status
- [x] **Inference Latency (p95)** — Current latency with sparkline
- [x] **Monthly Compute Cost** — Current spend vs. budget

#### Charts

- [x] **GPU Utilization Over Time** — Line chart (24h, 7d, 30d toggle)
- [x] **Inference Latency Distribution** — Area chart with p50/p95/p99 bands
- [x] **Model Deployment Activity** — Bar chart of deployments per day
- [x] **Cost Breakdown** — Pie/donut chart by service (training, inference, storage)

#### Widgets

- [x] **Active Training Jobs** — List of running jobs with progress bars
- [x] **Recent Deployments** — Table of last 5 deployments with status badges
- [x] **System Alerts** — Alert cards (critical, warning, info) with dismiss action

### 3.2 Model Registry Page (`/models`)

- [x] Data table with columns: Name, Version, Status, Type, Latency, Last Deployed, Actions
- [x] Filters: Status (deployed/training/archived), Type (LLM/Vision/Embedding)
- [x] Search by name
- [x] Row actions: View details, Deploy, Archive
- [x] Bulk actions: Multi-select deploy, delete
- [x] "Deploy New Model" button → opens wizard

### 3.3 Model Detail Page (`/models/:id`)

- [x] Header: Model name, version badge, status indicator, action buttons
- [x] **Performance Chart** — Inference latency over time
- [x] **Version History** — Table of versions with changelog
- [x] **Deployment Config** — Environment, scaling settings, endpoint URL
- [x] **Metrics Cards** — Total requests, avg latency, error rate, uptime

### 3.4 Deployments Page (`/deployments`)

- [x] Pipeline view: Cards showing stages (Build → Test → Deploy → Verify)
- [x] List view: Table with commit SHA, branch, environment, status, duration
- [x] Filter by environment (staging, production)
- [x] Deployment detail slide-out with logs

**Deliverable**: Fully functional dashboard with realistic data, charts, and tables.

---

## Phase 4: Enterprise Features (Week 3)

### 4.1 RBAC & Team Management (`/teams`)

- [x] Team table: Name, Email, Role, Status, Last Active, Actions
- [x] Role badges: Admin (red), Engineer (blue), Viewer (gray)
- [x] Invite member modal: Email, role selection, workspace assignment
- [x] Edit member drawer: Change role, deactivate account
- [x] Permission matrix view (read-only): What each role can access

### 4.2 Role-Based Sidebar

- [x] Admin sees: Dashboard, Models, Deployments, Teams, Monitoring, Integrations, Settings
- [x] Engineer sees: Dashboard, Models, Deployments, Monitoring, Playground
- [x] Viewer sees: Dashboard, Models (read-only), Monitoring
- [x] Hide unauthorized routes from navigation
- [x] Redirect unauthorized direct URL access to dashboard

### 4.3 Integrations Page (`/integrations`)

- [x] **Manual Authentication Configuration**:
  - Email/password login screen
  - Role selection for demo users
  - Session and password policy settings
  - OAuth credential fields removed
- [x] **API Keys**:
  - List of keys with name, prefix, last used, created date
  - Generate new key flow
  - Revoke key action
- [ ] **Webhooks**:
  - URL input, event selection, secret key
  - Delivery history table

### 4.4 Settings Pages

- [x] `/settings/security`:
  - SOC2 compliance badge
  - GDPR data processing toggle
  - Session management (active sessions, revoke)
  - 2FA enrollment mock
- [x] `/settings/billing`:
  - Current plan card with usage bar
  - Token consumption chart
  - Compute hours by service
  - Invoice history table
  - Usage alerts configuration
- [x] `/settings/audit`:
  - Full audit log table with filters (actor, action, date range)
  - Export to CSV button

### 4.5 Monitoring & Alerts (`/monitoring`)

- [x] Alert feed: Real-time alert cards with severity, timestamp, description
- [x] Alert rules table: Condition, threshold, notification channel, status
- [x] Model drift chart: Accuracy degradation over time
- [x] Anomaly detection events list

**Deliverable**: Full RBAC system, enterprise integrations UI, audit trails, and monitoring.

---

## Phase 5: AI Playground (Week 3-4)

### 5.1 Playground Page (`/playground`)

- [x] Split-pane layout: Left config, right chat
- [x] **Model Selection**: Dropdown of available models
- [x] **Parameters**: Temperature, max tokens, top-p sliders
- [x] **System Prompt**: Editable textarea
- [x] **Chat Interface**:
  - User message input
  - AI response with typing indicator
  - Message history with clear button
  - Copy/regenerate actions per message
- [x] **Metrics Panel**: Tokens used, latency, cost per request
- [x] **Compare Mode**: Side-by-side two models (bonus)

### 5.2 Hugging Face Integration (Optional)

- [x] Integrate Hugging Face Inference API for real responses
- [x] Fallback to MSW mock if rate limited
- [x] Show "Powered by Hugging Face" badge

**Deliverable**: Interactive prompt testing interface demonstrating AI/ML product surface skills.

---

## Phase 6: Polish & Performance (Week 4)

### 6.1 Performance Optimizations

- [x] Use React Server Components for static layout parts
- [x] Dynamic imports for heavy chart components
- [x] Image optimization with `next/image`
- [x] Route prefetching for sidebar links
- [x] Add `loading.tsx` skeletons for all routes
- [x] Add `error.tsx` error boundaries
- [x] Implement `not-found.tsx` for 404s

### 6.2 Accessibility

- [x] Keyboard navigation for sidebar, tables, modals
- [x] ARIA labels on all interactive elements
- [x] Focus visible states
- [x] Screen reader friendly data tables
- [x] Reduced motion support
- [x] Color contrast compliance (WCAG 2.1 AA)

### 6.3 Testing

- [x] **Unit Tests** (Vitest):
  - Utility functions (formatters, permissions)
  - Zustand store actions
  - Zod validation schemas
- [x] **Component Tests** (React Testing Library):
  - Metric cards render correctly
  - Table sorting/filtering works
  - Form validation shows errors
  - RBAC guards hide/show elements
- [x] **E2E Tests** (Playwright):
  - Login flow
  - Dashboard loads with data
  - Model registry navigation
  - Team invitation flow
  - Playground prompt submission

### 6.4 Documentation

- [x] Update README with:
  - Project description (enterprise AI platform dashboard)
  - Tech stack and architecture
  - Setup instructions
  - Mock API documentation
  - Screenshots/GIFs of key features
- [x] Add `ARCHITECTURE.md` explaining data flow
- [x] Add `CONTRIBUTING.md` for future extension

### 6.5 Deployment

- [ ] Configure Vercel deployment
- [ ] Set environment variables
- [ ] Verify MSW works in production build (or use API routes fallback)
- [ ] Add custom domain (optional)
- [ ] Performance audit with Lighthouse (target: 90+ all categories)

**Deliverable**: Production-ready dashboard deployed to Vercel with tests passing.

---

## Phase 7: Interview Preparation (Ongoing)

### 7.1 Talking Points

Prepare explanations for:

- [ ] Why Next.js 16 App Router over Vite + React Router
- [ ] How MSW enables backend-parallel development
- [ ] RBAC implementation strategy (Zustand + route guards)
- [ ] Performance optimizations (RSC, dynamic imports, caching)
- [ ] How you'd swap MSW for a real Python/Go backend

### 7.2 Live Demo Script

- [ ] 30-second elevator pitch
- [ ] 2-minute feature walkthrough (dashboard → models → teams → playground)
- [ ] 1-minute architecture deep-dive
- [ ] Q&A preparation (be ready to discuss trade-offs)

### 7.3 Resume Update

Update resume/portfolio to highlight:

- [ ] "Enterprise AI Infrastructure Dashboard — Next.js 16, TypeScript, TanStack Query"
- [ ] "Implemented RBAC with role-based UI rendering and API authorization"
- [ ] "Built real-time monitoring with simulated streaming data and WebSocket patterns"
- [ ] "Designed API contracts for GPU metrics, model registry, and deployment pipelines"

---

## File Checklist

### Config Files

- [ ] `next.config.js` — Static export, image config
- [ ] `tsconfig.json` — Strict mode, path aliases
- [ ] `tailwind.config.js` — Custom colors, fonts
- [ ] `components.json` — shadcn/ui config
- [ ] `vitest.config.ts` — Test setup
- [ ] `playwright.config.ts` — E2E config
- [ ] `.env.local` — Environment variables
- [ ] `.env.example` — Template for others

### Core App Files

- [ ] `app/layout.tsx` — Root layout
- [ ] `app/(dashboard)/layout.tsx` — Dashboard shell
- [ ] `app/(dashboard)/dashboard/page.tsx` — Main dashboard
- [ ] `app/(dashboard)/models/page.tsx` — Model registry
- [ ] `app/(dashboard)/models/[id]/page.tsx` — Model detail
- [ ] `app/(dashboard)/deployments/page.tsx` — Deployments
- [ ] `app/(dashboard)/teams/page.tsx` — Team management
- [ ] `app/(dashboard)/monitoring/page.tsx` — Monitoring
- [ ] `app/(dashboard)/playground/page.tsx` — AI playground
- [ ] `app/(dashboard)/integrations/page.tsx` — Integrations
- [ ] `app/(dashboard)/settings/security/page.tsx` — Security settings
- [ ] `app/(dashboard)/settings/billing/page.tsx` — Billing settings
- [ ] `app/(dashboard)/settings/audit/page.tsx` — Audit logs
- [ ] `app/login/page.tsx` — Login page

### Components

- [ ] `components/layout/Sidebar.tsx`
- [ ] `components/layout/Topbar.tsx`
- [ ] `components/layout/Breadcrumbs.tsx`
- [ ] `components/layout/MobileNav.tsx`
- [ ] `components/charts/LineChart.tsx`
- [ ] `components/charts/AreaChart.tsx`
- [ ] `components/charts/BarChart.tsx`
- [ ] `components/charts/PieChart.tsx`
- [ ] `components/charts/Sparkline.tsx`
- [ ] `components/tables/DataTable.tsx`
- [ ] `components/tables/Columns.tsx`
- [ ] `components/forms/FormInput.tsx`
- [ ] `components/forms/FormSelect.tsx`
- [ ] `components/forms/FormSwitch.tsx`
- [ ] `components/guards/RoleGuard.tsx`
- [ ] `components/guards/PermissionGuard.tsx`

### Hooks

- [ ] `hooks/useAuth.ts`
- [ ] `hooks/useGpuMetrics.ts`
- [ ] `hooks/useGpuSummary.ts`
- [ ] `hooks/useInferenceMetrics.ts`
- [ ] `hooks/useModelRegistry.ts`
- [ ] `hooks/useModelDetail.ts`
- [ ] `hooks/useDeployments.ts`
- [ ] `hooks/useDeploymentDetail.ts`
- [ ] `hooks/useTeams.ts`
- [ ] `hooks/useAuditLogs.ts`
- [ ] `hooks/useBillingUsage.ts`
- [ ] `hooks/useBillingInvoices.ts`
- [ ] `hooks/usePlayground.ts`

### Stores

- [ ] `stores/authStore.ts`
- [ ] `stores/uiStore.ts`
- [ ] `stores/themeStore.ts`

### Lib

- [ ] `lib/api-client.ts`
- [ ] `lib/permissions.ts`
- [ ] `lib/validators.ts`
- [ ] `lib/utils.ts`

### Mocks

- [ ] `mocks/browser.ts`
- [ ] `mocks/server.ts`
- [ ] `mocks/handlers.ts`
- [ ] `mocks/data/gpu-metrics.ts`
- [ ] `mocks/data/model-registry.ts`
- [ ] `mocks/data/deployments.ts`
- [ ] `mocks/data/teams.ts`
- [ ] `mocks/data/audit-logs.ts`
- [ ] `mocks/data/billing.ts`
- [ ] `mocks/data/playground.ts`

### Types

- [ ] `types/api.ts`
- [ ] `types/models.ts`
- [ ] `types/auth.ts`

### Tests

- [ ] `tests/unit/utils.test.ts`
- [ ] `tests/unit/permissions.test.ts`
- [ ] `tests/unit/validators.test.ts`
- [ ] `tests/e2e/login.spec.ts`
- [ ] `tests/e2e/dashboard.spec.ts`
- [ ] `tests/e2e/models.spec.ts`
- [ ] `tests/e2e/teams.spec.ts`
- [ ] `tests/e2e/playground.spec.ts`

### Documentation

- [ ] `README.md`
- [ ] `ARCHITECTURE.md`
- [ ] `CONTRIBUTING.md`

---

## Timeline Summary

| Phase                  | Duration | Key Deliverable                          |
| ---------------------- | -------- | ---------------------------------------- |
| 1. Foundation          | Week 1   | Next.js 16 app with theme, layout, MSW   |
| 2. Mock Data           | Week 1-2 | Full fake API with realistic data        |
| 3. Dashboard Core      | Week 2   | Main dashboard, models, deployments      |
| 4. Enterprise Features | Week 3   | RBAC, integrations, settings, monitoring |
| 5. AI Playground       | Week 3-4 | Interactive prompt testing               |
| 6. Polish & Deploy     | Week 4   | Tests, performance, Vercel deployment    |
| 7. Interview Prep      | Ongoing  | Talking points, demo script, resume      |

---

## Success Criteria

- [ ] Dashboard loads in under 2 seconds (Lighthouse performance 90+)
- [ ] All routes have loading skeletons and error boundaries
- [ ] RBAC correctly hides/shows UI based on role
- [ ] MSW intercepts all API calls with realistic data
- [ ] Charts are interactive (tooltips, zoom, time range toggle)
- [ ] Tables support sorting, filtering, pagination
- [ ] Forms have validation and error states
- [ ] Dark/light mode toggle works across all pages
- [ ] Mobile responsive (sidebar collapses, tables scroll)
- [ ] All tests pass (unit + E2E)
- [ ] README clearly explains the project and how to run it
- [ ] Deployed to Vercel with custom URL

---

## Notes

- **MSW in Production**: For Vercel deployment, MSW may not work in the browser. Have a fallback plan: either use Next.js API routes (`app/api/*`) that return the same mock data, or conditionally disable MSW and use the API routes.
- **Type Safety**: Be strict with TypeScript. Every API response, every form value, every store state should be typed. This is a key signal for enterprise roles.
- **Component Reusability**: Build generic table and chart components that accept data and config props. Don't hardcode specific data shapes into UI components.
- **Accessibility First**: Don't bolt on a11y later. Build keyboard navigation and ARIA labels into components from the start.
- **Git Commits**: Make meaningful commits as you build. A clean git history shows professional development practices.
