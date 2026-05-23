# Architecture

Infrastructure Management Dashboard is a client-heavy Next.js 16 App Router app backed by a local mock API. The goal is to model realistic enterprise AI operations while keeping the project runnable on a laptop.

## Runtime Flow

1. `app/layout.tsx` mounts global styles and `components/providers.tsx`.
2. Providers create the TanStack Query client, theme provider, tooltip provider, MSW provider, and toast host.
3. In development, `components/msw-provider.tsx` starts the browser service worker from `mocks/browser.ts`.
4. Dashboard pages call domain hooks from `hooks/`.
5. Hooks call `lib/api-client.ts`, which performs typed `fetch` requests.
6. MSW intercepts `/api/*` requests and resolves them with `mocks/handlers.ts`.
7. Mock handlers read and mutate faker-generated in-memory data from `mocks/data/*`.
8. TanStack Query caches responses and invalidates affected query keys after mutations.

## Route Structure

- `/` is the demo login page.
- `/dashboard` is the operations overview.
- `/models` and `/models/[modelId]` cover model registry workflows.
- `/deployments` covers pipeline status and logs.
- `/teams` covers RBAC and invitations.
- `/integrations` covers SSO, API keys, and webhooks.
- `/settings/security`, `/settings/billing`, and `/settings/audit` cover enterprise controls.
- `/monitoring` covers alerts, rules, drift, and anomalies.
- `/playground` covers prompt testing and optional Hugging Face inference.

The dashboard routes share `app/(dashboard)/layout.tsx`, which renders `DashboardShell` with the sidebar, topbar, role switcher, and responsive mobile navigation.

## State Model

Zustand owns local UI state:

- `stores/auth-store.ts`: authenticated user, active role, permissions, login/logout actions.
- `stores/ui-store.ts`: sidebar state, modal state, and queued toasts.
- `stores/theme-store.ts`: theme preference synchronized with `next-themes`.

Server-like state lives in TanStack Query:

- Each `hooks/use-*.ts` file owns query and mutation calls for one domain.
- `hooks/query-keys.ts` centralizes cache keys.
- Mutations invalidate their domain cache after writes.

## Permissions

RBAC is defined in `lib/permissions.ts`. Admins can manage integrations, settings, teams, models, and deployments. Engineers can operate models and deployments. Viewers can read dashboards, models, deployments, and monitoring.

UI-level access control uses:

- role-aware navigation in `components/layout/dashboard-shell.tsx`
- reusable rendering guard in `components/guards/permission-guard.tsx`
- store selectors from `stores/auth-store.ts`

## Mock API Design

The mock API mirrors a REST backend:

- `types/api.ts` defines request and response shapes.
- `lib/api-client.ts` wraps `fetch`, error formatting, and response parsing.
- `mocks/handlers.ts` implements endpoint behavior.
- `mocks/data/*` generates deterministic domain data with faker.

The API uses mutable in-memory arrays for flows like inviting members, deploying models, generating API keys, revoking keys, and creating webhooks. This keeps demos interactive while staying easy to reset by refreshing the dev server.

## Playground Providers

The playground first attempts the Next.js route handler at `app/api/playground/huggingface/route.ts` when `HF_TOKEN` is configured. That route calls the Hugging Face Inference API and returns a normalized completion payload. If the token is missing, the provider is rate limited, or the request fails, the client falls back to MSW mock completions.

## Testing Strategy

Vitest covers fast feedback:

- utility formatters
- RBAC helpers
- Zustand auth actions
- Zod schemas
- React component behavior with Testing Library

Playwright covers key user journeys:

- login
- dashboard data render
- model registry navigation
- team invitation
- playground prompt submission

`npm run test:e2e` starts an isolated Next.js dev server on `127.0.0.1:3100` so it does not collide with the normal `localhost:3000` dev server.

## Performance Notes

Static shell pieces are split from client state where practical, route loading and error boundaries are present, heavy chart imports are dynamically loaded through `components/charts/dynamic-recharts.tsx`, and route links prefetch from the sidebar.
