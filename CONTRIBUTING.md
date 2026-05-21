# Contributing

This project is a portfolio-style enterprise dashboard, so contributions should keep the UI realistic, typed, and testable.

## Local Workflow

Install and run:

```bash
npm install
npm run dev
```

Before handing off changes, run:

```bash
npm run lint
npm run test
npm run build
```

Run E2E tests for route or workflow changes:

```bash
npm run test:e2e
```

## Adding a Dashboard Route

1. Add the route under `app/(dashboard)/your-route/page.tsx`.
2. Add navigation metadata in `components/layout/dashboard-shell.tsx`.
3. Gate navigation by role or permission when the route should not be universal.
4. Add loading and error coverage if the route has expensive or failure-prone data.
5. Add an E2E smoke test when it is a primary workflow.

## Adding Mock API Features

1. Add or extend domain types in `types/api.ts`.
2. Add deterministic mock data in `mocks/data/`.
3. Add endpoint behavior in `mocks/handlers.ts`.
4. Add typed client methods in `lib/api-client.ts`.
5. Add query hooks and cache keys in `hooks/`.
6. Cover business logic with Vitest.

## Adding UI Components

- Prefer existing `components/ui` primitives.
- Keep feature components close to their domain unless they are clearly reusable.
- Use icons for compact actions and include accessible labels on icon-only controls.
- Use semantic table markup for data grids.
- Preserve keyboard navigation and visible focus states.

## Forms and Validation

- Define reusable schemas in `lib/validators.ts`.
- Use React Hook Form for complex forms.
- Surface validation errors next to the relevant field.
- Add component tests for important validation flows.

## RBAC Changes

- Update `lib/permissions.ts` first.
- Keep `stores/auth-store.ts` consuming shared permission definitions.
- Use `PermissionGuard` for conditional UI.
- Add unit tests when role behavior changes.

## Testing Guidelines

- Unit tests belong in `tests/unit`.
- Component tests belong in `tests/components`.
- E2E tests belong in `tests/e2e`.
- Keep Playwright tests focused on user-visible workflows.
- Avoid testing implementation details that would make refactors painful.

## Documentation

When adding a major feature, update:

- `README.md` for setup, screenshots, and top-level capability changes.
- `ARCHITECTURE.md` for data-flow or system design changes.
- this file when the development workflow changes.
