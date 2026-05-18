# AGENTS.md

Guardrails for AI agents working in this repository. Follow the current codebase first, and treat `PLAN.md` as a future migration plan unless the user explicitly asks to execute that migration.

## Repository Reality Check

This repo is currently a Vite React admin dashboard written in JavaScript/JSX with plain CSS. It is not currently a Next.js, TypeScript, Tailwind, shadcn/ui, Zustand, TanStack Query, MSW, or Playwright project.

`PLAN.md` describes a target/future Reflection AI dashboard architecture. Do not introduce that stack incrementally into the current app unless the task is explicitly a migration task or the user approves a migration plan.

## Stack & Technologies

Use the exact installed stack from `package-lock.json` unless the task explicitly requires a dependency change:

- React `19.2.4`
- React DOM `19.2.4`
- Vite `6.4.1`
- `@vitejs/plugin-react` `4.7.0`
- `react-router-dom` `7.13.1`
- `@mui/material` `7.3.8`
- `@mui/icons-material` `7.3.8`
- `@mui/x-data-grid` `8.27.3`
- `@emotion/react` `11.14.0`
- `@emotion/styled` `11.14.1`
- Recharts `3.7.0`
- Testing libraries are installed but no test runner/script is configured:
  - `@testing-library/react` `16.3.2`
  - `@testing-library/jest-dom` `6.9.1`
  - `@testing-library/user-event` `14.6.1`

Current app entry/config files:

- `index.html`
- `vite.config.js`
- `src/index.jsx`
- `src/App.jsx`

## Current Architecture

- `src/App.jsx` owns the application shell and routes.
- `src/components/*` contains reusable visual components, each with a paired `.css` file.
- `src/pages/*` contains routed pages, each with a paired `.css` file.
- `src/DummyData.jsx` contains static sample data for charts and tables.
- There is no backend, API client, persistence layer, auth layer, or form submission pipeline.

Current routes:

- `/`
- `/users`
- `/users/:userId`
- `/users/newUser`
- `/products`
- `/products/:productId`
- `/products/newProduct`

## ALWAYS Policies

- Always inspect existing files before editing; preserve the current component/page/CSS pairing convention.
- Always use functional React components and JSX, matching the existing style.
- Always colocate page/component styling in the matching CSS file, for example `Product.jsx` with `Product.css`.
- Always keep changes narrowly scoped to the requested feature or bug.
- Always use existing libraries before adding new ones:
  - Use MUI DataGrid for tabular admin lists.
  - Use MUI icons for iconography.
  - Use Recharts for charts.
  - Use React Router for navigation.
- Always update `src/DummyData.jsx` or introduce a clearly named mock data module when adding static demo data.
- Always make UI-only behavior explicit in docs or comments when forms/buttons do not persist data.
- Always check route casing and paths carefully. Existing routes include `/products/newProduct`, while one current link points to `/products/newproduct`; fix path mismatches when touching related code.
- Always prefer accessible JSX attributes:
  - Use `htmlFor` instead of `for` on labels.
  - Add meaningful `alt` text for informative images.
  - Use buttons for actions and links for navigation.
- Always keep `package-lock.json` in sync when changing dependencies.
- Always note when a requested change belongs to the future `PLAN.md` architecture rather than the current app.

## NEVER Policies

- Never assume this is already a Next.js/TypeScript/Tailwind project because of `PLAN.md`.
- Never add Next.js `app/`, Tailwind config, shadcn/ui, Zustand, TanStack Query, MSW, or TypeScript scaffolding without explicit user approval for a migration.
- Never replace the current Vite app structure as part of a small feature request.
- Never introduce a new UI library when MUI/Recharts/plain CSS can satisfy the requirement.
- Never add real backend/API assumptions unless the task includes backend work.
- Never claim data is persisted; current deletes are local React state only and reset on refresh.
- Never leave broken imports or route links after moving files.
- Never use destructive git commands or revert unrelated user changes.
- Never edit generated dependency artifacts manually except through package manager changes.
- Never rely on the default CRA README as authoritative; this project runs with Vite scripts.

## Verification & Testing

Required before completing code changes:

```bash
npm run build
```

Useful local commands:

```bash
npm run dev
npm run preview
```

Current limitations:

- There is no `npm test` script.
- There is no `npm run lint` script.
- There is no configured Vitest/Jest/Playwright runner.

If a task adds or substantially changes behavior, prefer adding a real test setup as part of that work, but ask before introducing new tooling. If test/lint scripts are added, update this file and run the new verification commands before finishing.

## Planning & Execution

Execute directly for small, local changes such as:

- Fixing JSX warnings or broken route paths.
- Updating copy, static data, or presentational UI.
- Adding a page/component that follows the existing Vite React + CSS pattern.
- Improving accessibility within existing components.

Ask for user approval before:

- Migrating to the `PLAN.md` target stack.
- Adding dependencies.
- Creating a backend/API/mock-service architecture.
- Replacing MUI DataGrid, Recharts, React Router, or the CSS styling approach.
- Renaming major directories or changing route conventions.
- Adding authentication, persistence, or state-management libraries.

For complex features:

- First identify whether the feature belongs to the current Vite dashboard or the future Reflection AI dashboard plan.
- Break the work into small route/component/data/style changes.
- Preserve a working build after each major step.
- Keep mock data realistic but clearly fake.
- Document any UI-only behavior or missing backend integration.

## Code Style Notes

- Existing files use `.jsx` and `.css`; keep that unless performing an approved migration.
- Current import style is mixed but generally uses relative imports. Prefer clear relative imports within the current structure.
- `react-router-dom` is installed, but some files currently import from `react-router`. When editing routing code, prefer consistency with React Router v7 and verify the build.
- Keep CSS class naming aligned with existing component prefixes such as `userList*`, `product*`, `widgetLg*`, and `sidebar*`.
- Avoid broad refactors while implementing feature work; this project is small and benefits from simple, readable components.

## Known Friction Points

- `PLAN.md` and the actual repository describe different architectures.
- `README.md` still contains default Create React App content even though this app uses Vite.
- Forms are presentational and do not submit data.
- Detail pages display static records rather than fetching by route parameter.
- Delete actions only mutate local component state.
- Some sidebar items are visual labels only and do not link to routes.
- Some JSX uses `for` instead of `htmlFor`; fix when touching those files.
- The new product route/link casing should be checked when editing product pages.
