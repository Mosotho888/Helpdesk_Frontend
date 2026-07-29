# Frontend Architecture Decisions

## Comment edit/delete
Added PUT/DELETE /comments/{commentId} support — genuine gaps found while cross-checking the full OpenAPI spec after finishing the initial comment/reply work. canEditOrDelete mirrors the backend's own rule (author within 15 minutes, or admin anytime) client-side purely as a UX nicety to hide buttons that would otherwise just fail - actual enforcement stays server-side. Uses native confirm() for delete confirmation rather than a custom dialog, a reasonable simplification for a single destructive action; a shadcn AlertDialog would be the natural upgrade if more confirmation flows are needed later.

## Role-gated ticket detail sections
TicketDetail now hides SlaStatus, TicketActions, and AuditTrail entirely for USER-role viewers (computed once via isAuthorized, reused across all three) - these sections are Agent/Admin-only per the API and would otherwise show broken/silently-failing UI. AttachmentList and CommentList remain visible to all roles, since both are legitimately usable by a ticket's own requester.

## Comments: internal/type fields and threaded replies now fully wired
CommentList's top-level form now sends type (REPLY/NOTE/RESOLUTION) and internal - previously silently dropped despite existing in CreateCommentRequest/the API layer. internal checkbox only rendered for AGENT/ADMIN roles, with a defense-in-depth `canMarkInternal ? internal : false` ensuring a USER's submission is always non-internal regardless of any client-side tampering.

Replies now use the correct dedicated endpoint (POST /comments/{commentId}/replies) via a new useAddReply mutation, rather than incorrectly reusing the top-level addComment mutation - true threading now works, not just visual nesting of what was actually a flat list. Comment component threads ticketId through every recursive call so replies invalidate the correct cache key.

## Auth-retry exclusions: URL matching, refactor deferred
The Axios interceptor now excludes 5 URLs from refresh-retry behavior (/auth/login, /auth/refresh, /users/me/password, /auth/password-reset/request, /auth/password-reset/confirm). A cleaner per-request `skipAuthRetry` flag (via TypeScript module augmentation on AxiosRequestConfig) was scoped out as the next step once this pattern kept recurring, but deferred to a future version rather than refactoring mid-feature. TODO: implement the typed flag, remove the URL-matching list, before adding a 6th exclusion.

## Password reset: public OTP flow + admin override
ForgotPasswordPage is a two-step flow (request -> confirm) sharing one component with a step state, since the email needs to carry over between steps. onRequestSubmit's catch block deliberately always advances to the confirm step even on error - mirroring the backend's own documented behavior of always returning 200 to prevent user enumeration; the frontend intentionally doesn't leak whether an email exists either.

AdminResetPasswordDialog lets an admin reset any user's password without requiring their current one (for locked-out users) - inlined its Zod schema rather than extracting to a shared file, since it's small and single-use, unlike createUserSchema which serves a more reusable domain (ticket creation could plausibly need similar validation elsewhere later).

## Audit Reports: three parallel queries, one active
AuditReports runs useAuthLogs/useLogsByActor/useLogsByAction simultaneously via three separate useQuery hooks, but only the one matching the current reportType has enabled: true - the others sit idle. Simpler than dynamically constructing one conditional query; the small cost is two harmless idle hooks. formatAction extracted from AuditTrail into a shared util once needed in a second place, avoiding duplicated logic.

Fourth occurrence of the Base UI Select string | null onValueChange signature in this codebase (after TicketActions x2, UserManagement/AgentManagement roles). Consistent fix applied: guard with `if (!value) return` before using the value.

## Agent Management
AgentManagement table reuses the inline-Select-mutation pattern from TicketActions/UserManagement. Department field uses an uncontrolled input (defaultValue + onBlur) rather than controlled value + onChange, since saving on every keystroke would be wasteful - only commits on blur, and skips the mutation entirely if the value didn't actually change.

AgentStatsDialog only fetches stats once opened (enabled: open passed into useAgentStats), not on table row mount - avoids N wasted API calls just from rendering the agent list.

CreateAgentDialog cross-references useUsers + useAgentsList client-side (no dedicated "users who aren't agents" endpoint) to filter the eligible-user dropdown to non-agents only.

## Bug: AgentStatsResponse.avgResolutionHours can be null despite spec typing it as non-nullable number
An agent with zero resolved tickets returns avgResolutionHours: null from the backend, but the OpenAPI spec has no nullable marker on this field - a spec/reality mismatch, not a frontend bug. Calling .toFixed() on null crashed the whole app with a blank white screen (no error boundary existed yet). Fixed the type to `number | null`, added a graceful "N/A" fallback in the display, AND added a global ErrorBoundary component wrapping the app in main.tsx - so any future uncaught error shows a contained message instead of unmounting the entire React tree.

## Profile settings: two forms, one page
ProfileInfoForm pre-fills via useEffect + reset() once the async profile query resolves (can't pass defaultValues synchronously since the data doesn't exist on first render). isDirty gates the Save button so users can't submit an unchanged form.

ChangePasswordForm uses Zod's .refine() for cross-field validation (newPassword must match confirmPassword) - a validation rule that spans two fields, which per-field rules can't express.

## Bug: wrong-password 401 triggered refresh-retry cascade
PATCH /users/me/password returning 401 for a genuinely wrong current password was being caught by the Axios interceptor's generic "401 = expired token, try refreshing" logic - since only /auth/login and /auth/refresh were excluded from that behavior. This caused a slow cascade (refresh succeeds since the session IS valid, retry fails again with 401, repeat) ending in an unexpected logout/redirect, instead of a clean, immediate error message. Fixed by adding /users/me/password to the interceptor's exclusion list.

This is the second endpoint requiring this exclusion (after /auth/login) - if a third one comes up, consider replacing URL-string-matching with an explicit per-request opt-out flag (e.g. { skipAuthRetry: true }) rather than growing a list of hardcoded substrings.

## User Administration
New AdminRoute wrapper (checks user.role === 'ADMIN' in addition to auth) protects /admin/users, redirecting non-admins to the ticket table rather than showing a broken 403-riddled page. UserManagement reuses the same TanStack Table + Select-mutation pattern from TicketActions; CreateUserDialog uses shadcn's Dialog with the Base UI render prop for the trigger button (same pattern as Header's Link button).

Note: changeRole's `role` is a query parameter per the OpenAPI spec, not a JSON body field - unlike nearly every other mutation in this app. Axios call passes null as body, role in `params`, easy to miss if assuming all POST/PATCH bodies are JSON.

## Login page and Create Ticket form: consistent Card/Input/Label/Button styling
Both restyled with the same shadcn primitives used throughout the app. CreateTicketForm's priority Select required wrapping in React Hook Form's Controller, since shadcn's Select is a fully controlled component (value/onValueChange) with no raw DOM input for register() to attach to - Controller bridges React Hook Form's internal state to any controlled component.

## Base UI composition: render prop, not asChild
Base UI components use a `render` prop for polymorphic rendering (e.g. making a Button render
as a React Router Link), unlike Radix's `asChild` + child-element pattern. Usage: `<Button render={<Link to="/path" />}>Text</Button>` — the element passed to `render` receives the Button's merged props/styling; `children` stays as the visible content. Third Base UI API difference encountered so far (after Select's string|null value and this) - worth checking Base UI's actual API before assuming Radix conventions carry over when something breaks.

## Ticket detail page: one Card per domain concern
Each section (ticket info, SLA, actions, attachments, comments, audit trail) is its own Card, mirroring the feature-based folder structure visually - one bounded unit per concern rather
than a single long unstyled page. Uses cn() from shadcn's generated utils for conditional classes (e.g. red border/background on SLA breach). Attachment file input styled via Tailwind's file: variant to target the browser's native ::file-selector-button independently from the "no file chosen" text.

## Base UI Select: onValueChange accepts string | null
Unlike Radix's Select (string-only), Base UI's Select passes `string | null` to onValueChange
(null likely on cleared selection). Handlers now guard with `if (!value) return` before using
the value, rather than unsafely casting. Worth remembering when migrating other native <select>
elements to shadcn's Select going forward - check Base UI's actual type signature rather than assuming Radix's shape carries over.

## Badge colors: semantic classes over generic variants
shadcn's default Badge variants (default/secondary/destructive/outline) are designed for generic UI actions, not domain-specific status meaning - reusing them for 5 statuses + 4 priorities caused near-identical, low-contrast colors (e.g. outline on white for both "Low priority" and "Resolved" status). Replaced with explicit semantic Tailwind classes per status/priority value (distinct hue per state, -100 background / -800 text for accessible contrast), following the standard pattern used by Jira/Linear/Zendesk for ticket status coloring.

## shadcn Select gotcha
Base UI's Select (used by shadcn's Select component) doesn't allow an empty string as an item value - using '' for "no filter selected" silently breaks. Used the string 'ALL' as a sentinel value instead, translated to `undefined` before passing to the API call.

## shadcn/ui setup: Base UI + Nova preset
Chose Base UI over Radix as the primitive layer — as of mid-2026, shadcn/ui defaults to Base UI for new projects since Radix's development has slowed following its acquisition by WorkOS, while Base UI is actively maintained by the MUI team. Chose the Nova visual preset (tighter spacing, higher density) over softer alternatives (Maia, Luma) since the app is data-heavy (ticket tables, stacked detail-page sections) and benefits from showing more content per screen.

Gotcha: shadcn's CLI validated the tsconfig.app.json path alias correctly, but its own file-writer only reads the root tsconfig.json directly — resulting in generated files landing in a literal "./@/..." folder instead of "./src/...". Fixed by duplicating the baseUrl/paths config into the root tsconfig.json as well, satisfying both the CLI's file-writer and the actual TypeScript compiler (which correctly uses tsconfig.app.json).

## Styling: Tailwind CSS via Vite plugin
Using @tailwindcss/vite (not the older PostCSS-config approach) for simpler setup. Tailwind import lives in src/index.css, which must be imported in main.tsx — this import was initially missing after main.tsx was rewritten for QueryClientProvider setup, causing Tailwind classes to have zero effect despite correct plugin/config. Confirmed working via a visible color/weight test
before proceeding to real component styling.

## Audit trail display
AuditTrail fetches GET /audit/tickets/{id} and renders a chronological list of actions (formatted from raw enum values like STATUS_CHANGED -> "Status Changed"). Fails silently for non-Admin/Agent viewers, consistent with the SLA component's approach - a 403 on a correctly-restricted endpoint shouldn't look like a broken feature.

## Attachments: multipart upload, blob download
Uploads use FormData (multiple files appended under the 'file' field) rather than JSON, matching the backend's multipart/form-data contract. Client-side validation mirrors backend limits (max 5 files, 20MB each) for instant feedback before hitting the network.

Downloads use responseType: 'blob' since the endpoint returns raw binary, then trigger a save via
a programmatically-clicked hidden <a> tag with a download attribute and object URL - the standard browser pattern for saving API-returned binary data, since JS can't directly write files.

## SLA display
SlaStatus fetches GET /tickets/{id}/sla and renders due dates + breach flags. Fails silentl (returns null) rather than showing an error, since this endpoint is Agent/Admin-only per the API spec - a USER-role 403 shouldn't look like a broken feature.

Note: seeded demo tickets (inserted directly into Postgres) don't have SLA records, since they bypassed the actual ticket-creation service logic that generates them. Confirmed working correctly on tickets created through the real POST /tickets flow. Demo data seeding should be revisited to go through the API/service layer for full fidelity.

## Ticket assignment: agent id vs user id mismatch
TicketResponse.assignee is a UserResponse (the user's own id), but UpdateTicketRequest.assigneeId expects the Agent entity's id - confirmed via a 404 "Agent not found with id: X" when sending a user id. Two places needed fixing, not just one: the dropdown's onChange/option value (submission) AND the dropdown's `value` prop (display) both need to map through agent.id, not agent.user.id. Fixing only the first left the select showing the wrong agent as "selected" even though saves worked - a reminder that a mutation succeeding doesn't mean the surrounding UI is correct. Flag to backend team as a candidate for cleanup (e.g. exposing agentId directly on TicketResponse).

## Ticket updates: inline, save-on-change
Status/priority editing uses dropdowns that mutate immediately on change, rather than an explicit Edit/Save mode - matches real ticketing tool UX (Zendesk, Jira) where an agent working through a queue needs single-click updates, not a multi-step edit flow. Backend's UpdateTicketRequest supports partial updates, so each field mutates independently.

useMutation's onSuccess uses setQueryData to write the fresh response directly into the ['tickets', id] cache entry (instant UI update, no refetch delay), plus invalidateQueries on the broader ['tickets'] key so the table reflects the change next time it's viewed.

## Comments: recursive rendering + mutation invalidation
CommentResponse is self-referential (replies: CommentResponse[]), so a single Comment component renders itself recursively for arbitrary reply depth - no special-casing per level. useAddComment uses TanStack Query's useMutation; onSuccess invalidates the ['comments', ticketId] query key, triggering an automatic refetch so new comments appear without manual state management. Verified persistence with a hard page refresh, not just cache-driven UI update.

## npm audit: react-router CSRF advisory (GHSA-qwww-vcr4-c8h2) - not applicable
Advisory concerns React Router's RSC/Framework Mode server actions. This app uses Declarative Mode (BrowserRouter, Routes/Route) with no server-side actions or RSC - vulnerability class doesn't apply to this architecture. Not upgrading to avoid an unnecessary breaking change; revisit if SSR/RSC is ever adopted.

## Auth: React Context + silent session restore
AuthContext wraps login state (user, isAuthenticated, isLoading) and exposes login/logout. On app load, if a refresh token exists in localStorage, the app silently calls /auth/refresh to restore the session before rendering protected routes - avoids forcing a fresh login on every page reload. isLoading gates ProtectedRoute so a logged-in user never flashes through /login while the restore check is in progress.

## Routing: React Router v6/v7
ProtectedRoute wrapper checks isAuthenticated and redirects to /login (with `replace`) if not authenticated. AuthProvider wraps BrowserRouter since ProtectedRoute depends on useAuth().

## Logout
logout() calls /auth/logout to revoke the refresh token server-side, then always clears local state (access token, refresh token, user) regardless of whether the server call succeeds - a failed network request shouldn't trap the user in a half-logged-in state on their own device.

## State management: TanStack Query over Redux
Chosen because the app's state is overwhelmingly server state (tickets, users, comments) rather than complex client-only state. TanStack Query handles caching, invalidation, and loading/error states with far less boilerplate than Redux + createAsyncThunk for this use case.

## Axios array param serialization
Axios's default array serialization uses bracket notation (sort[]=x), which Spring's Pageable does not parse - requests succeeded (200) but the backend silently ignored the sort parameter, returning default-ordered results despite the UI showing an active sort indicator. Fixed via paramsSerializer: { indexes: null } on the Axios instance, producing repeated-key style (sort=x&sort=y) that Pageable correctly parses. Caught by comparing actual row order against the sort indicator, not just checking the request succeeded.

## Folder structure: feature-based
Organised by domain (features/tickets, features/users, etc.) rather than by type (components/, hooks/, services/). Mirrors the backend's package structure and keeps everything related to one domain in one place as the app grows.

## Token storage
- Access token: in-memory only (JS variable), never localStorage - reduces XSS exposure, acceptable tradeoff since it's short-lived and refreshable.
- Refresh token: currently in localStorage. Known limitation - ideal long-term solution is an httpOnly cookie set by the backend, which would require Spring Security changes (Set-Cookie on /auth/login and /auth/refresh, CORS credentials config). Flagged as a planned hardening step, not yet implemented.

## CORS: Spring Security requires its own CORS wiring
Adding CORS via WebMvcConfigurer alone is insufficient when Spring Security's filter chain rejects a request (e.g. 401) before Spring MVC processes it - the rejection response bypasses MVC-level CORS config entirely, causing the browser to report a CORS error that masks the real 401. Fixed by wiring a shared CorsConfigurationSource bean directly into SecurityFilterChain via .cors(cors -> cors.configurationSource(...)). Old WebConfig.java (WebMvcConfigurer-based) removed to avoid two diverging CORS sources of truth.

## Linting: ESLint (not Oxlint)
Oxlint doesn't yet support type-aware TypeScript rules (e.g. no-floating-promises), which matter given the app's heavy use of async API calls. ESLint's plugin ecosystem (react-hooks, jsx-a11y-x) also better supports the accessibility and correctness bar
this project aims for.