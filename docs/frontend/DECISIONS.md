# Frontend Architecture Decisions

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