# Architecture

This document explains the frontend's structure and the reasoning behind its major technical decisions. For a chronological log of specific decisions, tradeoffs, and bugs encountered during development, see [docs/frontend/DECISIONS.md](./docs/frontend/DECISIONS.md).

## Folder Structure: Feature-Based

```bash
src/
features/
tickets/ api/ components/ hooks/ schemas/ types.ts utils/
categories/ api/ components/ hooks/ utils/ types.ts
comments/
auth/
users/
agents/
sla/
attachments/
audit/
shared/
components/ cross-cutting UI (Header, ErrorBoundary)
lib/ axiosClient.ts
routes/ ProtectedRoute, AdminRoute
components/ui/ shadcn/ui primitives (generated, not hand-maintained)
```

Organised by domain rather than by type (`components/`, `hooks/`, `services/`). Everything related to one feature - its API calls, types, hooks, and components - lives in one place, mirroring the backend's own package-per-domain structure. A feature only gets subfolders (`hooks/`, `schemas/`, `utils/`) once it actually needs one, rather than scaffolding empty folders speculatively.

## State Management: TanStack Query, Not Redux

The app's state is overwhelmingly **server state** - tickets, users, comments, SLA data - not complex client-only state. TanStack Query handles caching, background refetching, and loading/error states with far less boilerplate than Redux + `createAsyncThunk`, and cleanly separates server state (Query) from the small amount of genuine client-only state (`useState`/`useContext` - auth session, form inputs, UI toggles).

Mutations follow a consistent pattern: call the mutation, then either `invalidateQueries` (triggers a refetch) or `setQueryData` (writes the response directly into cache for an instant UI update with no round-trip delay) depending on whether immediacy matters more than guaranteed freshness.

## Authentication

- **Access token:** held in memory only (a module-level variable in `axiosClient.ts`), never `localStorage` - reduces exposure to XSS, since a short-lived token that isn't persisted is a smaller attack surface.
- **Refresh token:** currently in `localStorage`. This is a known, documented tradeoff - the backend's `/auth/login` returns both tokens in the JSON body rather than setting the refresh token as an `httpOnly` cookie, which would be the more secure long-term approach. Migrating to that would require backend changes (cookie-based `Set-Cookie` on login/refresh, CORS credentials config) that are out of scope for this iteration but tracked as a planned hardening step.
- **Silent session restore:** on app load, if a refresh token exists in storage, the app attempts a silent `/auth/refresh` call before rendering protected routes, so a page reload doesn't force a fresh login.
- **Automatic 401 handling:** an Axios response interceptor detects expired-session 401s (distinguished from legitimate credential-rejection 401s via a `skipAuthRetry`-style exclusion list - see DECISIONS.md), transparently refreshes the token, and retries the original request. Concurrent requests hitting 401 simultaneously share a single in-flight refresh call rather than each triggering their own.
- **Role-based routing:** `ProtectedRoute` checks authentication; `AdminRoute` additionally checks `role === 'ADMIN'`. Ticket detail sections that are Agent/Admin-only per the API (SLA, ticket actions, audit trail) are conditionally rendered based on role, rather than shown broken/failing for USER-role viewers.

## Form Validation: React Hook Form + Zod

Every form (login, create ticket, create user, profile edits, password changes) uses a Zod schema as the single source of truth for validation, with the TypeScript type derived from the schema (`z.infer`) rather than hand-written separately - guaranteeing the two never drift out of sync. Validation rules deliberately mirror the backend's own Bean Validation constraints, so users get instant client-side feedback rather than a round-trip to discover a field was too long or a password too weak.

## Styling: Tailwind CSS + shadcn/ui (Base UI, Nova preset)

Chose Base UI over shadcn's Radix option since Radix's development has slowed following its acquisition, while Base UI is actively maintained with full-time engineering backing. The Nova preset (tighter spacing, higher density) fits a data-heavy admin tool better than shadcn's softer presets.

Status/priority/availability badges use explicit semantic Tailwind classes rather than shadcn's generic `default/secondary/destructive/outline` variants, since the generic set produces near-identical, low-contrast colors when mapped onto 5+ domain-specific states.

## Category Picker: Flattened Select Over a New Tree Widget

`CategorySelect` renders the category hierarchy as an indented, flat list inside the existing shadcn `Select` primitive, rather than introducing a dedicated tree/combobox component. The category tree is shallow (max 3 levels) and small (a few dozen nodes), so the added complexity and bundle weight of a new Popover/Command-based combobox wasn't justified for the actual data shape - the flattened `Select` reads just as clearly and reuses a component the app already ships.

## Error Handling

A global `ErrorBoundary` wraps the app, catching any uncaught rendering error and showing a contained message rather than a blank white screen - added after a real production-shape bug (a spec-vs-reality nullability mismatch causing a `.toFixed()` crash on `null`) revealed the app had no safety net for unexpected runtime errors.

## Known Limitations / Deferred Work

- **No automated test suite yet.** All verification during development was manual (documented in DECISIONS.md). Adding unit/integration tests (Vitest + React Testing Library) is the most valuable next investment.
- **Refresh token in `localStorage`**, pending backend `httpOnly` cookie support (see Authentication section above).
- **Auth-retry exclusions use URL string matching** rather than a typed per-request flag - works correctly at the current scale (5 exclusions), but was intentionally scoped for a future refactor to a `skipAuthRetry` config flag via TypeScript module augmentation, rather than implemented mid-feature.
- **Seeded demo data** (tickets inserted directly into Postgres rather than through the real API) lack SLA records, since they bypass the service-layer logic that generates them - a data-seeding gap, not an application bug.
- **Category filter can't be explicitly cleared back to "Uncategorised"** from `TicketActions` - the backend's `UpdateTicketRequest.categoryId` only triggers a change when a value is provided, so `null` and "not provided" are indistinguishable in JSON today. Setting a new category works; un-setting one requires a small backend change (e.g. an explicit `clearCategory` flag) tracked as follow-up work.

## Deployment

Containerised via a multi-stage Docker build (Node build stage -> Nginx serving static output). Deployed to the same OCI ARM VM as the backend, routed via Nginx hostname-based reverse proxy and Cloudflare DNS/TLS, with GitHub Actions handling CI (lint, type-check, build on every push) and CD (build + push multi-arch image, deploy via SSH on merge to `main`).