# Frontend Architecture Decisions

## State management: TanStack Query over Redux
Chosen because the app's state is overwhelmingly server state (tickets, users, comments)
rather than complex client-only state. TanStack Query handles caching, invalidation, and
loading/error states with far less boilerplate than Redux + createAsyncThunk for this use case.

## Folder structure: feature-based
Organised by domain (features/tickets, features/users, etc.) rather than by type
(components/, hooks/, services/). Mirrors the backend's package structure and keeps
everything related to one domain in one place as the app grows.

## Token storage
- Access token: in-memory only (JS variable), never localStorage - reduces XSS exposure,
  acceptable tradeoff since it's short-lived and refreshable.
- Refresh token: currently in localStorage. Known limitation - ideal long-term solution is
  an httpOnly cookie set by the backend, which would require Spring Security changes
  (Set-Cookie on /auth/login and /auth/refresh, CORS credentials config). Flagged as a
  planned hardening step, not yet implemented.

## CORS: Spring Security requires its own CORS wiring
Adding CORS via WebMvcConfigurer alone is insufficient when Spring Security's filter chain
rejects a request (e.g. 401) before Spring MVC processes it - the rejection response bypasses MVC-level CORS config entirely, causing the browser to report a CORS error that masks the real 401. Fixed by wiring a shared CorsConfigurationSource bean directly into SecurityFilterChain via .cors(cors -> cors.configurationSource(...)). Old WebConfig.java (WebMvcConfigurer-based) removed to avoid two diverging CORS sources of truth.

## Linting: ESLint (not Oxlint)
Oxlint doesn't yet support type-aware TypeScript rules (e.g. no-floating-promises), which
matter given the app's heavy use of async API calls. ESLint's plugin ecosystem
(react-hooks, jsx-a11y-x) also better supports the accessibility and correctness bar
this project aims for.