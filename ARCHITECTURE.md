# InsurePortal — Architecture Reference

> Full audit performed 2026-07-24. Every source file under `src/` was read in full. No file was skipped or sampled.

---

## 1. Executive Summary

**InsurePortal** is a white-label, multi-tenant Progressive Web App (PWA) that lets insurance clients view and manage their entire family's insurance portfolio in a browser, including policies, claims, endorsements, requirements, vehicles, documents, and support tickets.

| Attribute | Value |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite 8 + `@vitejs/plugin-react` |
| UI library | Material UI (MUI) v9 with Emotion |
| Icons | Lucide-React |
| Routing | React Router v7 (`createBrowserRouter`) |
| State management | React Context API (three contexts; no Redux, Zustand, etc.) |
| API transport | Native `fetch` wrapped in a hand-rolled `apiClient` |
| PWA | `vite-plugin-pwa` with Workbox for service-worker caching |
| Deployment | Vercel (SPA rewrites + API proxy rewrite) |
| Architecture pattern | **Feature-folder component tree** with a centralized service layer |
| Auth | JWT stored in `localStorage`; 401 responses trigger automatic logout + redirect |
| Multi-tenancy | `orgCode` resolved from URL query param, subdomain, or `localStorage`; sent as `X-Org-Code` HTTP header |

There is **no backend code in this repository**. The app talks exclusively to an external REST API at `https://portal.leadcrm.in:82/customer-beta/...`. All data mutations happen through that API; the front-end holds no database.

---

## 2. Annotated Directory Tree

```
insure-portal/
|-- index.html                  # HTML shell with inline loading spinner; mounts #root
|-- package.json                # npm scripts, runtime & dev dependencies
|-- vite.config.ts              # Vite build + PWA manifest + dev-server proxy
|-- vercel.json                 # Vercel SPA fallback + /customer-beta API proxy
|-- tsconfig.json               # TypeScript project references (app + node)
|-- tsconfig.app.json           # Strict TS config for src/
|-- tsconfig.node.json          # TS config for Vite config file itself
|-- eslint.config.js            # ESLint flat config (TS + React Hooks + React Refresh)
|-- .env / .env.example         # VITE_API_URL -- the only environment variable
|-- public/
|   |-- favicon.svg             # Default SVG favicon (replaced at runtime for white-label)
|   |-- icons.svg               # Sprite sheet (not referenced in code -- may be unused)
|   |-- manifest.json           # Static PWA manifest (overridden dynamically by BrandingContext)
|   `-- icons/
|       |-- icon-192.png        # PWA app icon 192x192
|       `-- icon-512.png        # PWA app icon 512x512
`-- src/
    |-- main.tsx                # React root mount; wraps app in ThemeProvider + CssBaseline
    |-- App.tsx                 # Provider tree root; assembles all contexts + router
    |-- index.css               # Global CSS resets (box-sizing, font-size iOS fix, nav-link)
    |-- App.css                 # Vite scaffold leftover -- NOT imported anywhere meaningful
    |-- app/
    |   |-- router.tsx          # All routes; ProtectedRoute / PublicRoute guards
    |   `-- theme.ts            # MUI theme (palette, typography, component overrides)
    |-- contexts/
    |   |-- BrandingContext.tsx # Org branding, favicon, dynamic PWA manifest
    |   |-- MemberContext.tsx   # Member list, selectedMemberId, localStorage persistence
    |   `-- InsuranceContext.tsx# All insurance data (policies, claims...) + refresh functions
    |-- hooks/
    |   `-- useInstallPrompt.ts # PWA install prompt state machine
    |-- layouts/
    |   `-- AppLayout.tsx       # Authenticated shell: Header + Sidebar + BottomNav + children
    |-- pages/                  # One file per route; thin orchestration layer
    |   |-- Login.tsx
    |   |-- Dashboard.tsx
    |   |-- Policies.tsx
    |   |-- Claims.tsx
    |   |-- Endorsements.tsx
    |   |-- Requirements.tsx
    |   |-- Tickets.tsx
    |   |-- Members.tsx
    |   |-- Vehicles.tsx
    |   |-- Documents.tsx
    |   |-- Alerts.tsx
    |   |-- Profile.tsx
    |   |-- Upload.tsx
    |   `-- NotFound.tsx
    |-- components/
    |   |-- Header.tsx          # Fixed top app bar (logo, member switcher, bell, profile menu)
    |   |-- Sidebar.tsx         # Left nav (desktop sticky + mobile Drawer)
    |   |-- BottomNav.tsx       # Mobile bottom tab bar (4 tabs + "More" hamburger)
    |   |-- Welcome.tsx         # Page header with title, subtitle, member-filter pill row
    |   |-- AlertBanner.tsx     # Coloured inline banner for dashboard alerts
    |   |-- InstallBanner.tsx   # PWA install bottom sheet (iOS/Android/native flow)
    |   |-- PopoverMenu.tsx     # MUI Popover wrapper for dropdown menus
    |   |-- dashboard/
    |   |   |-- DashboardStats.tsx
    |   |   |-- QuickActions.tsx
    |   |   |-- CoverageSummary.tsx
    |   |   `-- RecentActivity.tsx
    |   |-- policies/
    |   |   |-- PolicyGrid.tsx
    |   |   |-- PolicyCard.tsx
    |   |   `-- PolicyDetailModal.tsx
    |   |-- claims/
    |   |   |-- ClaimsTable.tsx
    |   |   |-- ClaimForm.tsx
    |   |   `-- ClaimDetailModal.tsx
    |   |-- endorsements/
    |   |   |-- EndorsementsTable.tsx
    |   |   |-- EndorsementForm.tsx
    |   |   `-- EndorsementDetailModal.tsx
    |   |-- requirements/
    |   |   |-- RequirementList.tsx
    |   |   |-- RequirementForm.tsx
    |   |   `-- QuoteModal.tsx
    |   |-- tickets/
    |   |   |-- TicketsList.tsx
    |   |   |-- TicketForm.tsx
    |   |   |-- TicketChatModal.tsx
    |   |   `-- FaqSection.tsx
    |   |-- members/
    |   |   |-- MembersList.tsx
    |   |   `-- MemberForm.tsx
    |   |-- vehicles/
    |   |   |-- VehiclesList.tsx
    |   |   |-- VehicleForm.tsx
    |   |   `-- VehicleDetailModal.tsx
    |   |-- profile/
    |   |   |-- ProfileCard.tsx
    |   |   |-- KycCard.tsx
    |   |   `-- PreferencesCard.tsx
    |   |-- upload/
    |   |   |-- UploadForm.tsx
    |   |   `-- UploadedList.tsx
    |   `-- shared/
    |       |-- UiCard.tsx
    |       |-- GridSkeleton.tsx
    |       |-- TableSkeleton.tsx
    |       `-- OfflineAlert.tsx
    |-- services/
    |   |-- apiClient.ts        # fetch wrapper, auth headers, 401 handler, file download
    |   |-- api.tsx             # Domain API methods (one per REST resource)
    |   `-- iconUtils.tsx       # Policy-category -> Lucide icon + colour mapping
    |-- types/
    |   `-- models.ts           # All TypeScript types (Member, PolicyData, ClaimData...)
    `-- utils/
        `-- orgUtils.ts         # orgCode resolution from URL / subdomain / localStorage
```

---

## 3. File-by-File Reference

### 3.1 Root Config Files

#### `index.html`
**Purpose:** HTML shell that Vite serves. Mounts the React app into `#root`.
**Key exports:** none (HTML file).
**Imports:** `src/main.tsx` via `<script type="module">`.
**Side effects:** Renders an inline blue spinner inside `#root` that disappears the moment React hydrates.
**Notes:** Apple PWA meta tags are present (`apple-mobile-web-app-capable`, `apple-mobile-web-app-title`). The manifest link points to `/manifest.json` but `BrandingContext` replaces it dynamically at runtime with a `blob:` URL.

#### `package.json`
**Purpose:** Defines project metadata, scripts, and dependencies.
**Key scripts:** `dev` (Vite dev server), `build` (TypeScript check + Vite build), `lint` (ESLint), `preview` (serve production build locally).
**Notable dependencies:** React 19, MUI v9, React Router v7, `vite-plugin-pwa` v1, `lucide-react`, `sharp` (dev-only, for image processing in PWA icon generation).

#### `vite.config.ts`
**Purpose:** Controls the Vite build pipeline, dev-server proxy, and PWA generation.
**Key behaviour:**
- Dev server proxies all `/customer-beta/...` requests to `VITE_API_URL` (default `https://portal.leadcrm.in:82`). This avoids CORS in development.
- `VitePWA` plugin generates a service worker with `autoUpdate` registration, caches all JS/CSS/HTML/images via Workbox, and bakes the PWA manifest into the build (though `BrandingContext` overrides the manifest dynamically at runtime).

**Flag:** The same icon (`icon-192.png`) is listed twice (for `"any"` and `"maskable"` purpose). A maskable icon should have safe-zone padding baked in.

#### `vercel.json`
**Purpose:** Vercel deployment configuration.
**Rules:**
1. `/customer-beta/:path*` proxied to `https://portal.leadcrm.in:82/customer-beta/:path*` (production API proxy, mirrors the dev-server proxy).
2. Everything else (except `/assets`, `/favicon.svg`, `/icons`) redirects to `/index.html` (SPA fallback so React Router handles all client-side routes).

#### `tsconfig.json` / `tsconfig.app.json` / `tsconfig.node.json`
**Purpose:** TypeScript project references split so `vite.config.ts` (Node environment) and `src/` (browser/DOM environment) have different lib targets. `tsconfig.app.json` enables strict mode: `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`.

#### `eslint.config.js`
**Purpose:** Flat ESLint config: TypeScript + React Hooks rules + React Refresh rules (warns if a module exports non-components, which breaks HMR).

#### `.env.example`
**Purpose:** Documents the single environment variable: `VITE_API_URL`. Default is `https://portal.leadcrm.in:82`. In production (Vercel), the proxy is handled in `vercel.json`; `VITE_API_URL` is not needed unless a different backend is targeted.

---

### 3.2 `src/` -- Entry Points

#### `src/main.tsx`
**Purpose:** React DOM root. The application's true entry point.
**Key exports:** none (side-effect only).
**What it does:** Calls `ReactDOM.createRoot` on `#root`, wraps `<App>` in `React.StrictMode`, `ThemeProvider`, and `CssBaseline`.
**Imports:** `App`, `index.css`, `theme`, `ThemeProvider`, `CssBaseline`.
**[!WARNING] Flag:** `ThemeProvider` is used both in `main.tsx` and in `App.tsx`. The one in `App.tsx` is an unnecessary duplicate wrap.

#### `src/App.tsx`
**Purpose:** Assembles the global provider tree and connects the router.
**Key exports:** `App` (default).
**Provider order (outermost to innermost):**
1. `ThemeProvider` (duplicate -- see flag above)
2. `BrandingProvider` -- must be outermost so `Login` can access it before auth
3. `MemberProvider` -- loads member list after login
4. `InsuranceProvider` -- depends on `MemberContext` for `selectedMemberId`
5. `OfflineAlert` -- always rendered, shows/hides based on `navigator.onLine`
6. `InstallBanner` -- always rendered, shows/hides based on PWA state
7. `RouterProvider` -- renders the actual pages

#### `src/index.css`
**Purpose:** Global CSS resets.
**What it sets:** Box-sizing reset, `-webkit-tap-highlight-color: transparent` (removes tap flash on mobile), iOS font-size fix (`font-size: 16px` on inputs to prevent auto-zoom), MUI Dialog outline removal, `body` background colour (`#F7F6F3`), `.nav-link` style reset.

#### `src/App.css`
**Purpose:** Vite scaffold boilerplate styles.
**[!WARNING] Flag:** This file is **never imported** by any source file. It is dead code left over from the Vite project template and can be safely deleted.

---

### 3.3 `src/app/` -- App-Wide Configuration

#### `src/app/router.tsx`
**Purpose:** Declares all client-side routes and enforces authentication guards.
**Key exports:** `router` (a `createBrowserRouter` instance).
**Route guards:**
- `ProtectedRoute` -- checks `hasValidToken()`; if no token, redirects to `/`.
- `PublicRoute` -- checks `hasValidToken()`; if token exists, redirects to `/dashboard` (prevents logged-in users from seeing the login page).

**Routes defined:**

| Path | Component | Guard |
|---|---|---|
| `/` | `LoginPage` | Public |
| `/dashboard` | `DashboardPage` | Protected |
| `/policies` | `PoliciesPage` | Protected |
| `/claims` | `ClaimsPage` | Protected |
| `/endorsements` | `EndorsementsPage` | Protected |
| `/requirements` | `RequirementsPage` | Protected |
| `/upload` | `UploadPage` | Protected |
| `/tickets` | `TicketsPage` | Protected |
| `/members` | `MembersPage` | Protected |
| `/vehicles` | `VehiclesPage` | Protected |
| `/documents` | `DocumentsPage` | Protected |
| `/alerts` | `AlertsPage` | Protected |
| `/profile` | `ProfilePage` | Protected |
| `*` | `NotFoundPage` | None |

**[!WARNING] Flag:** Route guards are evaluated at render time by checking `localStorage`. If the token is removed by another tab, the guard won't react until the next navigation -- there is no reactive session listener.

#### `src/app/theme.ts`
**Purpose:** Defines the MUI theme -- the visual foundation for the entire app.
**Key exports:** `theme` (a `createTheme` result).
**Palette highlights:**
- Primary: `#1456A0` (brand blue)
- Background default: `#F7F6F3` (warm off-white)
- Custom `border` and `surface` palette tokens (declared via module augmentation so TypeScript accepts them in `sx` props).

**Component overrides:** Button (no text-transform, no shadow), Chip (compact 22px height), Card/Dialog (rounded 12-16px corners), OutlinedInput (custom border colours on focus), Drawer (rounded top corners for bottom-sheet effect).
**Typography:** DM Sans font family, body1 = 14px, body2 = 12px, caption = 11px.

---

### 3.4 `src/contexts/` -- Global State

#### `src/contexts/BrandingContext.tsx`
**Purpose:** Fetches and stores the broker's white-label branding (name, logo URLs); also dynamically updates the document `<title>`, favicon, and PWA manifest to match the broker.
**Key exports:** `BrandingProvider`, `useBranding()`.
**State:** `orgCode: string`, `branding: BrandingData | null`, `loading: boolean`.
**How `orgCode` is resolved:** On mount, calls `getOrgCodeFromLocation()` which tries (in order): URL query param `?orgcode=`, subdomain, `localStorage`. Listens to `popstate` for changes.
**Side effects:**
- `api.getBranding(orgCode)` fetches from `/api/branding/{orgCode}` (falls back to `/api/branding/unknown` on error).
- Calls `document.title = ...` when branding loads.
- Calls `updateFavicon()` -- replaces the `<link rel="icon">` in the document head.
- Calls `updateDynamicManifest()` -- creates a `Blob` URL for a dynamically generated JSON manifest and replaces the `<link rel="manifest">` in the document head. This is how the PWA install prompt picks up the broker's name and icon at install time.

**Provides:** `{ orgCode, setOrgCode, branding, loading, getLogoUrl }`.
`getLogoUrl(path)` calls `getAssetUrl(path)` to prepend the API base URL to relative asset paths.

#### `src/contexts/MemberContext.tsx`
**Purpose:** Manages the list of family members and which one the user has selected as their active filter.
**Key exports:** `MemberProvider`, `useMember()`.
**State:** `members: Member[]`, `loading: boolean`, `selectedMemberId: string` (persisted to `localStorage`).
**Special value:** `selectedMemberId === "all"` means "show all members' data". This is a front-end-only concept -- no member with id "all" exists in the API.
**Side effects:**
- `api.getMembers()` on mount (only if token is valid).
- `setCachedMembers(data)` -- populates the module-level cache in `api.tsx` so that `getMemberDisplayText()` can resolve member names without a React dependency.
- `localStorage.setItem("selectedMemberId", id)` on every `setSelectedMemberId` call.

**Provides:** `{ members, loading, selectedMemberId, setSelectedMemberId, activeMember, getProfileForMember, getMemberName, refreshMembers }`.
`activeMember`: when "all" is selected, returns `members[0]` (the primary member). When a specific id is selected, returns that member, falling back to `members[0]` if not found.

#### `src/contexts/InsuranceContext.tsx`
**Purpose:** The app's central data store. Holds all insurance entities (policies, claims, endorsements, requirements, tickets, vehicles, alerts) and provides refresh functions, computed counts, and optimistic update helpers.
**Key exports:** `InsuranceProvider`, `useInsurance()`, and six domain-specific sub-hooks: `usePolicy()`, `useClaim()`, `useEndorsement()`, `useRequirement()`, `useTicket()`, `useAlert()`, `useVehicle()`.
**State:** Seven `useState` arrays (one per entity type) + `loading` + `error`.
**Data loading:** `refreshAll()` fires all seven refresh functions in parallel via `Promise.all`. It is called once on mount (via `useEffect`) and re-called whenever `selectedMemberId` changes. Each individual refresher passes filter params to the API when `selectedMemberId !== "all"`.
**Status maps exported (used by multiple components):**
- `claimStatusMap`, `endorsementStatusMap`, `requirementStatusMap`, `ticketStatusMap` -- each maps a string status key to `{ label, color, bg }`.

**Optimistic update pattern:**
- `markAlertReadOptimistic(id)` -- immediately mutates state, calls the API, refreshes on success, rolls back on failure.
- `markAllAlertsReadOptimistic()` -- same pattern for all alerts.
- `selectQuoteOptimistic(reqId, quoteId)` -- immediately marks the quote as selected, calls the API, refreshes on success, rolls back on failure.

**[!WARNING] Flag:** `searchQuery` state is initialised but never set (no setter exposed), making it permanently an empty string. `globalSearch()` uses `JSON.stringify(e).toLowerCase().includes(query)` -- a broad, potentially slow string-match over all entity objects. This is not currently called by any component.
**[!WARNING] Flag:** `getTicketsByMember()` ignores `memberId` and always returns all tickets. Tickets are not filtered by member at the API level.

---

### 3.5 `src/hooks/`

#### `src/hooks/useInstallPrompt.ts`
**Purpose:** Encapsulates PWA install prompt logic for Android (native `beforeinstallprompt`) and iOS (manual Add to Home Screen instructions).
**Key exports:** `useInstallPrompt()`.
**Returns:** `{ showBanner, triggerInstall, dismiss, resetDismissed, isInstalled, isIOS, canNativeInstall, platform }`.
**Platform detection:** `detectPlatform()` uses `navigator.userAgent` to distinguish `"ios"` / `"android"` / `"desktop"` / `"unknown"`.
**Dismiss persistence:** Dismissal timestamp stored in `localStorage["pwa-install-dismissed"]`. Banner is suppressed for 3 days after dismissal.
**Custom event:** Listens to `"show-pwa-install-banner"` on `window` -- `Header.tsx` dispatches this event when the user clicks "Download App" in the profile menu, resetting the dismissed state.

---

### 3.6 `src/layouts/`

#### `src/layouts/AppLayout.tsx`
**Purpose:** The authenticated page shell. Every protected page wraps its content in `<AppLayout>`.
**Key exports:** `AppLayout` (default).
**Structure:**
```
<Box>                        <- full-page container, bg colour, pb for BottomNav
  <Header />                 <- fixed top bar (z-index > Sidebar)
  <Box display="flex">
    <Sidebar />              <- sticky left drawer (hidden on mobile)
    <Box component="main">   <- page content area
      {error && <ErrorBanner with Retry>}
      {children}
    </Box>
  </Box>
  <BottomNav />              <- fixed bottom bar (mobile only)
</Box>
```
**Side effect on mount:** If `members` or `policies` are empty (e.g., first navigation to a protected page), triggers `refreshMembers()` and `refreshAll()` as a safety net. `MemberContext` and `InsuranceContext` also load on their own mounts.

---

### 3.7 `src/services/`

#### `src/services/apiClient.ts`
**Purpose:** Low-level HTTP transport layer. The only file that touches `fetch` directly.
**Key exports:** `apiClient`, `hasValidToken()`, `getAssetUrl()`, `buildUrl()`, `downloadFile()`, `resetRedirectGuard()`, `ApiError`.
**Base URL logic:** `VITE_API_URL` from env is checked. All API calls go through the `/customer-beta` path prefix, either via the Vite dev proxy or the Vercel production proxy.
**Auth headers:** `getAuthHeaders()` reads `localStorage["token"]` into `Authorization: Bearer ...` and `localStorage["portal_org_code"]` into `X-Org-Code: ...`.
**401 handling:** `handleResponse()` detects a 401, clears `token`, `user`, and `selectedMemberId` from `localStorage`, and performs a hard redirect to `/` using `window.location.href`. A `isRedirectingToLogin` guard prevents duplicate redirects within the same event loop tick.
**Pagination:** `handleResponse()` reads `X-Total-Count`, `X-Page`, `X-Page-Size`, `X-Total-Pages` headers and attaches them to the `ApiResponse<T>.pagination` field. However, no page component currently uses pagination -- they all load full lists.
**`downloadFile(path, fallbackFileName)`:** Makes a `fetch` GET with auth headers, streams the blob, creates an `<a>` element with `download` attribute, clicks it programmatically, and revokes the object URL after 1 second.
**[!WARNING] Flag:** Auth token is stored in `localStorage`, which is accessible to any JavaScript on the page. A more secure approach would use `HttpOnly` cookies.

#### `src/services/api.tsx`
**Purpose:** Domain-level API methods -- one async function per API operation, grouped by resource.
**Key exports:** `api` (object of async functions), `setCachedMembers()`, `getMemberDisplayText()`, `getMemberListText()`.
**`cachedMembers`:** A module-level `let` array populated by `setCachedMembers()` (called by `MemberContext` after a successful `getMembers()`). Used by `getMemberDisplayText()` and `getMemberListText()` to resolve member IDs to names without needing React context (useful in non-component code like `PolicyCard`).
**Resources covered:** branding, auth (login/logout/me/change-password), members (CRUD + preferences + KYC), policies (CRUD + certificate download), claims (CRUD + patch), endorsements (CRUD + patch), requirements (CRUD + select-quote), tickets (CRUD + reply), documents (CRUD + download), vehicles (CRUD + policy lookup), alerts (get + mark-read + mark-all-read), dashboard summary, advisor, FAQs.
**`api.getBranding(orgCode)`:** Has a try/catch fallback -- if the brand-specific endpoint fails, it falls back to `/api/branding/unknown`.
**[!WARNING] Flag:** `api.getInsuranceEntities()` is defined but **not called anywhere in the codebase**. It is dead code.

#### `src/services/iconUtils.tsx`
**Purpose:** Maps policy category strings and status strings to Lucide icon components and colour values.
**Key exports:** `getIconForCategory(category, status): IconConfig`, `formatSumInsuredShort(sum): string`, `getCoverageText(category, sumInsured): string`.
**Category to icon mapping:** `"health"` -> Heart, `"motor"` -> Car, `"life"` -> Shield, `"home"` -> Home, `"travel"` -> Plane, `"external"` (status, not category) -> FileText, default -> Shield.
**Motor/due special case:** When `status === "due"`, returns an amber `borderColor` and `renewDateColor` to visually flag expiring motor policies.
**`formatSumInsuredShort`:** Converts Indian-style large numbers: >=1Cr -> "Rs.1Cr", >=1L -> "Rs.25L", else `toLocaleString("en-IN")`.
**`getCoverageText`:** Returns "IDV: Rs.X" for motor, "SA: Rs.X" for life, plain "Rs.X" otherwise.

---

### 3.8 `src/types/`

#### `src/types/models.ts`
**Purpose:** The single source of truth for all TypeScript types used across the app.
**Key exports (types):**

| Type | Description |
|---|---|
| `BrandingData` | Broker branding: orgCode, name, logo URLs |
| `Member` | Family member with profile, KYC, and preferences |
| `MemberProfile` | Contact details (mobile, email, DOB, PAN, Aadhaar, address) |
| `PolicyData` | Insurance policy; has `entityType: "policy"` discriminant |
| `ClaimData` | Filed claim; has `entityType: "claim"` |
| `EndorsementData` | Policy endorsement request; has `entityType: "endorsement"` |
| `RequirementData` | New insurance requirement; has `entityType: "requirement"` |
| `Quote` | A quote attached to a requirement |
| `TicketData` | Support ticket with thread messages |
| `VehicleData` | Registered vehicle linked to a member |
| `DocumentData` | Uploaded document (policy doc, claim doc, receipt, tax doc) |
| `AlertData` | Notification with severity, read status, and optional action |
| `DashboardSummary` | Aggregate data for the dashboard (stats, coverage, activity) |
| `InsuranceEntity` | Discriminated union of PolicyData or ClaimData or EndorsementData or RequirementData |
| `LoginResponse` | Auth response: token + user object |
| `Preferences` / `PrefChannels` / `PrefCategories` | Notification preferences |

No file imports types from anywhere except `models.ts`. All types are `export type` (erased at compile time, never present at runtime).

---

### 3.9 `src/utils/`

#### `src/utils/orgUtils.ts`
**Purpose:** Resolves the `orgCode` (broker identifier) from the current browser context, in priority order.
**Key exports:** `getOrgCodeFromLocation(): string`, `setStoredOrgCode(orgCode): void`.
**Resolution chain:**
1. URL query params: `?orgcode=`, `?orgCode=`, `?org=`, or `?=` (bare value).
2. First query param key if it looks like an org code (no `/` or `=` in it).
3. Raw first segment of the query string (after stripping `?`).
4. Subdomain (if not in `RESERVED_SUBDOMAINS` set and not numeric).
5. `localStorage["portal_org_code"]`.
6. Hardcoded fallback: `"marsh"`.

**Side effect:** Sets `localStorage["portal_org_code"]` whenever an org code is found from the URL.
**[!WARNING] Flag:** The hardcoded default `"marsh"` will show Marsh Brokers' branding on any unrecognized URL. This is intentional as a demo default but should be noted for white-label deployments.

---

### 3.10 `src/pages/`

All page files follow the same pattern:
1. Wrap content in `<AppLayout>` (for protected pages) or a bare `<Box>` (Login, NotFound).
2. Read data from contexts or local `useState` + `useEffect`.
3. Render a `<Welcome>` header + feature-specific components.
4. Show `<GridSkeleton>` or `<TableSkeleton>` while `loading` is true.

#### `Login.tsx`
Reads `orgCode` and `branding` from `useBranding()`. On submit, calls `api.login(orgCode, username, password)`, stores `token` and `user` in `localStorage`, calls `resetRedirectGuard()`, and navigates to `/dashboard`.

#### `Dashboard.tsx`
Fetches `api.getDashboardSummary(memberId)` and `api.getAlerts()` locally (not from `InsuranceContext`) on mount and whenever `selectedMemberId` changes. Displays stats, top urgent unread alert as a banner, quick actions grid, and a 2-column grid of `CoverageSummary` + `RecentActivity`.

#### `Policies.tsx`
Reads `getPoliciesByMember(selectedMemberId)` from `usePolicy()`. Renders `PolicyGrid` (which internally manages the `PolicyDetailModal`). Has an "Upload External" button linking to `/upload`.

#### `Claims.tsx`
Reads `getClaimsByMember(selectedMemberId)` from `useClaim()`. Checks `?new=true` URL param to auto-open the `ClaimForm`. Shows `ClaimsTable` or an empty state.

#### `Endorsements.tsx`
Identical pattern to Claims but using `useEndorsement()`, `EndorsementsTable`, `EndorsementForm`.

#### `Requirements.tsx`
Uses `useRequirement()`. Opens `RequirementForm` in-page. `RequirementList` self-reads from context.

#### `Tickets.tsx`
Uses `useTicket()`. Has a `selectedTicket` state to drive `TicketChatModal`. Renders `TicketsList`, `FaqSection`, and `TicketChatModal`.

#### `Members.tsx`
Does not use `InsuranceContext`. Renders `MembersList` and `MemberForm`.
**[!WARNING] Flag:** The subtitle "Members under the Sharma Family Group" is hardcoded. The actual group name should come from the API or branding context.

#### `Vehicles.tsx`
Uses `useVehicle()`. Has a `selectedVehicle` state to drive `VehicleDetailModal`.

#### `Documents.tsx`
Fetches documents locally (not from `InsuranceContext`) via `api.getDocuments(params)` in a `useEffect` that re-runs when `selectedMemberId` or `selectedDocType` changes. Has a local doc-type filter dropdown. Renders a responsive table (desktop) or card list (mobile), with a download button per row.

#### `Alerts.tsx`
Uses `useAlert()`. Calls `refreshAlerts()` on mount. Splits alerts into "New" (unread) and "Earlier" (read) sections. Supports `markAlertReadOptimistic` and `markAllAlertsReadOptimistic`. Navigates to `alert.actionTarget` when an action button is clicked.

#### `Profile.tsx`
Uses `useMember()`. Returns `null` if `activeMember` is undefined (before members load). Renders `ProfileCard`, `KycCard`, and `PreferencesCard` in a 2-column grid.

#### `Upload.tsx`
Thin wrapper: renders `UploadForm` + `UploadedList` inside `AppLayout`.

#### `NotFound.tsx`
Pure UI, no context or data. Renders a 404 message with a "Back to Dashboard" button.

---

### 3.11 `src/components/` -- Top-Level Layout Components

#### `Header.tsx`
**Purpose:** Fixed top app bar.
**Reads:** `useMember()` (members list, selectedMemberId), `useAlert()` (unread count for bell badge), `useBranding()` (logo, name).
**Reads `localStorage["user"]` directly** to get name and client ID (not through context).
**Features:** Member switcher popover (desktop; hidden on mobile), notification bell with badge count, avatar that opens profile popover (profile settings, help, download app, logout).
**"Download App"** menu item dispatches `window.dispatchEvent(new Event("show-pwa-install-banner"))` -- `useInstallPrompt` listens for this event to re-show the install banner.
**Logout:** Clears `localStorage` (token, user, selectedMemberId) and navigates to `/`.

#### `Sidebar.tsx`
**Purpose:** Left navigation drawer.
**Reads:** `useMember()`, `useAlert()` (badge on Alerts link), `api.getAdvisor()` (fetches advisor data on mount, shown in a card at the bottom of the sidebar).
**Behaviour:** On desktop (>=md breakpoint), renders as a sticky `Box`. On mobile, renders as an MUI `Drawer` controlled by `mobileOpen` prop from `AppLayout`.
**Navigation groups:** Portfolio (Dashboard, Policies, Claims, Endorsements), Self Service (Requirements, Upload Policy, Tickets), My Account (Members, Vehicles, Documents, Alerts, Profile).
**Member switcher (desktop only):** "Switch Member" item toggles an inline list of member names.

#### `BottomNav.tsx`
**Purpose:** Mobile-only fixed bottom tab bar (hidden at >=md breakpoint).
**Reads:** `useAlert()` (unread count for badge on Alerts tab).
**Tabs:** Home, Policies, Claims, Alerts, More (hamburger that calls `onOpenDrawer` -> opens the Sidebar Drawer).
**Active detection:** `location.pathname.startsWith(item.path)`.

#### `Welcome.tsx`
**Purpose:** Standard page header with title, subtitle, and an optional member-filter pill row.
**Reads:** `useMember()`.
**Props:** `title`, `content`, `hideMemberSelector?: boolean` (Tickets, Members, Upload pass `hideMemberSelector`).
**[!WARNING] Flag:** The member count and total coverage text ("4 members . Rs.1.5 Cr") are hardcoded strings, not derived from actual data.

#### `AlertBanner.tsx`
**Purpose:** A coloured inline banner for the dashboard's top-priority alert.
**Props:** `type` ("info" | "warn" | "success" | "danger"), `icon`, `title`, `subtitle`, `actionLabel?`, `onAction?`. Pure UI component with no context reads.

#### `InstallBanner.tsx`
**Purpose:** Bottom-sheet PWA install prompt.
**Reads:** `useInstallPrompt()` (state machine), `useBranding()` (app name and logo for the sheet).
**Logic:** If `canNativeInstall` (Android Chrome), triggers the browser native install prompt. If iOS (detected by `useInstallPrompt`), shows step-by-step Share -> "Add to Home Screen" instructions. If neither and the user clicks install, shows Android manual instructions as fallback.

#### `PopoverMenu.tsx`
**Purpose:** Thin wrapper around MUI `Popover` + `MenuList`. Used by `Header` for member-switcher and profile dropdowns. No logic, purely structural.

---

### 3.12 `src/components/shared/`

#### `UiCard.tsx`
A `Box` with `bgcolor: "background.paper"`, `border: "1px solid"`, `borderColor: "border.main"`, `borderRadius: 3`. Used as a consistent card container across all feature areas.

#### `GridSkeleton.tsx`
Renders four `Skeleton` rectangles in a 2-column grid at 160px height each. Used on Policies and Requirements pages while loading.

#### `TableSkeleton.tsx`
Renders one header skeleton (52px) and three row skeletons (72px) in a column. Used on Claims, Endorsements, Tickets, Vehicles, Documents pages.

#### `OfflineAlert.tsx`
Listens to `window` `"online"` / `"offline"` events via `useEffect`. Renders a red fixed banner at the top of the viewport when `navigator.onLine` is false. Rendered unconditionally inside `App.tsx`, above the router, so it appears on every page.

---

### 3.13 `src/components/dashboard/`

#### `DashboardStats.tsx`
Displays four `StatCard` tiles (Policies, Coverage, Claims, Alerts) using data from a `StatBlock` prop. Cards for Policies, Claims, Alerts are clickable and navigate to their respective routes. Uses `useMember()` to compute the subtitle text.

#### `QuickActions.tsx`
A 2x2 (mobile) / 1x4 (desktop) grid of action tiles: Raise Claim (`/claims?new=true`), Upload Policy (`/upload`), New Requirement (`/requirements?new=true`), Support Ticket (`/tickets?new=true`). Uses `useNavigate`. No context reads.

#### `CoverageSummary.tsx`
Renders a coverage card with a `LinearProgress` bar per insurance category. Accepts `coverageSummary: CoverageRow[]` and `annualPremiumOutgoDisplay`. Maps category strings to MUI colour names via `categoryColorMap`.

#### `RecentActivity.tsx`
Renders a vertical timeline of `ActivityItem` entries. Maps `item.kind` to dot colours via `kindColorMap`. Draws connector lines between timeline items using absolute-positioned `Box` dividers.

---

### 3.14 `src/components/policies/`

#### `PolicyCard.tsx`
Renders a single policy as a card. Reads `getMemberDisplayText()` from `api.tsx` (uses module-level member cache, not context). Reads `getIconForCategory()` from `iconUtils`. Shows "Renew Now" / "Get Renewal Quote" / "Certificate" / "Details" buttons conditionally based on policy status and `isExternal`. Clicking "Details" calls the `onClick` prop (which opens `PolicyDetailModal` from `PolicyGrid`). Clicking "Certificate" calls `api.downloadCertificate(policy.id)`.

#### `PolicyGrid.tsx`
Holds `selectedPolicy` state, renders a grid of `PolicyCard` components, and manages `PolicyDetailModal` visibility.

#### `PolicyDetailModal.tsx`
Modal (Dialog on desktop, bottom-sheet Drawer on mobile) showing full policy details. Has a `useEffect` to preserve `activePolicy` state so the modal content doesn't vanish during close animation. Calls `api.downloadCertificate()` from the modal footer.

---

### 3.15 `src/components/claims/`

#### `ClaimsTable.tsx`
Renders a table (desktop) / card list (mobile) of claims. Each row shows a custom `QontoStepper` for the claim's step progression. Clicking a row opens `ClaimDetailModal`. Imports `claimStatusMap` from `InsuranceContext`.

#### `ClaimForm.tsx`
An inline form (not a modal) for raising a new claim. Uses `usePolicy()` to get `getClaimablePolicies()` for the policy dropdown. Uses `useMember()` for the member dropdown. Calls `api.createClaim()` on submit, then `refreshClaims()` and calls `onSubmit()` prop.

#### `ClaimDetailModal.tsx`
Modal (Dialog/Drawer responsive) showing full claim details including a `QontoStepper` for the claim workflow steps.
**[!WARNING] Flag:** `QontoConnector` and `QontoStepIconRoot` are defined identically in both `ClaimsTable.tsx` and `ClaimDetailModal.tsx`. They should be extracted into a shared component in `src/components/shared/`.

---

### 3.16 `src/components/endorsements/`

#### `EndorsementsTable.tsx`
Same pattern as `ClaimsTable`. Renders endorsements in a table/card list. Clicking a row opens `EndorsementDetailModal`. Imports `endorsementStatusMap` from `InsuranceContext`.

#### `EndorsementForm.tsx`
Inline form for requesting an endorsement. Uses `usePolicy()` for the policy dropdown, `useMember()` for the member dropdown. Calls `api.createEndorsement()` on submit, then `refreshEndorsements()`.

#### `EndorsementDetailModal.tsx`
Modal showing full endorsement details including a timeline of `TimelineStep` items from `EndorsementData.timeline`.

---

### 3.17 `src/components/requirements/`

#### `RequirementList.tsx`
Reads `requirements` directly from `useRequirement()`. Renders a table (desktop) / card list (mobile). Each requirement row has a "View Quotes" button that opens `QuoteModal`.

#### `RequirementForm.tsx`
Inline form for creating a new insurance requirement. Uses `useMember()` for member selection. Calls `api.createRequirement()` on submit, then `refreshRequirements()`.

#### `QuoteModal.tsx`
Modal (Dialog/Drawer responsive) showing quotes attached to a requirement. Allows the user to select a quote via `selectQuoteOptimistic(reqId, quoteId)` from `useRequirement()`. Displays the issued policy details if status is `"policy-issued"`.

---

### 3.18 `src/components/tickets/`

#### `TicketsList.tsx`
Reads `tickets` from `useTicket()`. Renders a list of ticket rows with status chips and priority indicators. Clicking "View" calls the `onViewClick` prop, which drives `TicketChatModal` from `Tickets.tsx`.

#### `TicketForm.tsx`
Inline form for creating a support ticket. Uses `usePolicy()` for the related-policy dropdown. Calls `api.createTicket()` on submit, then `refreshTickets()`.

#### `TicketChatModal.tsx`
Responsive modal that shows a ticket's thread messages and allows the user to reply. Calls `api.replyToTicket(id, message)` on send, then `refreshTickets()`. Auto-scrolls the chat area to the bottom using a `ref` and `useEffect`.
**[!WARNING] Flag:** The attachment (Paperclip) button triggers a raw browser `alert()` for the "not yet supported" message instead of a proper UI notification.

#### `FaqSection.tsx`
Renders a list of FAQ items fetched from `api.getFaqs()` on mount (local state, not context). Each FAQ item is an expandable accordion-style section (toggle on click). Loaded once, no polling.

---

### 3.19 `src/components/members/`

#### `MembersList.tsx`
Reads `members` from `useMember()`. Renders an expandable accordion-style list. Each expanded member shows profile details (DOB, PAN, email, phone), KYC status chips, and portfolio summary. Has an "Edit" button that calls `api.updateMember()` inline.

#### `MemberForm.tsx`
Inline form for adding a new member. Calls `api.createMember()` on submit, then `refreshMembers()`.

---

### 3.20 `src/components/vehicles/`

#### `VehiclesList.tsx`
Reads `vehicles` from `useVehicle()`. Renders a table (desktop) / card list (mobile). Each row shows the registration number, make/model, IDV, renewal date, and "View" button.

#### `VehicleForm.tsx`
Inline form for adding a vehicle. Uses `useMember()` for the owner dropdown. Calls `api.createVehicle()` on submit, then `refreshVehicles()`.

#### `VehicleDetailModal.tsx`
Modal (Dialog/Drawer responsive) showing vehicle details including the linked policy.

---

### 3.21 `src/components/profile/`

#### `ProfileCard.tsx`
Displays and allows editing of a member's personal details (mobile, email, address). Calls `api.updateMember()` on save. Also contains an inline "Change Password" dialog that calls `api.changePassword()`.

#### `KycCard.tsx`
Displays KYC verification items as coloured status chips. Has an "Update KYC" button that calls `api.updateMemberKyc()`.

#### `PreferencesCard.tsx`
Loads member preferences via `api.getMemberPreferences(memberId)` on mount. Renders toggles for channel preferences (email, SMS, WhatsApp, push) and category preferences (renewal reminders, claim updates, etc.). Saves via `api.updateMemberPreferences()`.

---

### 3.22 `src/components/upload/`

#### `UploadForm.tsx`
Multi-step form for uploading an external policy. Uses `useMember()` for member selection, `usePolicy()` to get `refreshPolicies()` for post-submit refresh. Maps policy type text to a `category` string locally. Calls `api.createPolicy()` with `isExternal: true` and `status: "external"`.

#### `UploadedList.tsx`
Reads `policies` from `usePolicy()`, filters to those where `isExternal === true || status === "external"`. Renders a table of uploaded policies with a "Delete" button per row that calls `api.updatePolicy(id, { status: "deleted" })` (soft delete via status change, not the DELETE endpoint).
**[!WARNING] Flag:** "Deleting" an uploaded policy sets its status to `"deleted"` via PUT, which relies on the API ignoring that policy on future GET /api/policies calls. This soft-delete convention is not immediately obvious from the code.

---

## 4. Core User Flow Traces

### Flow 1: Login

```
Browser -> index.html
  |  (loads /src/main.tsx)
main.tsx -> renders <App>
  |
App.tsx -> BrandingProvider mounts
  |  api.getBranding(orgCode) called with orgCode from orgUtils.getOrgCodeFromLocation()
BrandingContext -> GET /api/branding/{orgCode}
  |  sets branding state, updates document.title, favicon, PWA manifest
router.tsx -> PublicRoute checks hasValidToken() -> false -> renders <LoginPage>
  |
Login.tsx -> reads orgCode + branding from useBranding(), renders login form
  |  user submits (handleLogin)
Login.tsx -> api.login(orgCode, username, password)
  |  POST /customer-beta/api/auth/login
apiClient.ts -> returns { token, user }
  |
Login.tsx -> localStorage.setItem("token", result.token)
           localStorage.setItem("user", JSON.stringify(result.user))
           localStorage.setItem("portal_org_code", orgCode)
           navigate("/dashboard")
  |
router.tsx -> ProtectedRoute checks hasValidToken() -> true -> renders <DashboardPage>
  |
DashboardPage -> renders (triggers MemberContext + InsuranceContext data loads in parallel)
```

### Flow 2: Viewing Policies (with member filter)

```
User clicks "Policies" in Sidebar
  |  NavLink to /policies
router.tsx -> ProtectedRoute -> <PoliciesPage>
  |
PoliciesPage -> const { selectedMemberId } = useMember()
              const { getPoliciesByMember, loading } = usePolicy()
              const policies = getPoliciesByMember(selectedMemberId)
              |  (data already in InsuranceContext from initial refreshAll())
PolicyGrid -> maps policies -> <PolicyCard> for each
  |
User clicks a PolicyCard (not a button inside it)
  |  onClick -> setSelectedPolicy(policy) in PolicyGrid
PolicyGrid -> <PolicyDetailModal open={true} policy={selectedPolicy}>
  |
PolicyDetailModal -> Dialog (desktop) or Drawer (mobile)
  |  User clicks "Download Certificate"
PolicyDetailModal -> api.downloadCertificate(policy.id)
  |  GET /customer-beta/api/policies/{id}/certificate
apiClient.downloadFile() -> streams blob -> creates <a download> -> clicks it
```

### Flow 3: Raising a Claim

```
User clicks "Raise New Claim" button on Claims page (or Quick Actions on Dashboard)
  |  setShowForm(true) or navigate("/claims?new=true")
ClaimsPage -> shows <ClaimForm onCancel onSubmit>
  |
ClaimForm -> reads useMember() for member list
           reads usePolicy().getClaimablePolicies(selectedMemberId) for policy dropdown
           (only active/due policies appear)
  |  User fills form, clicks "Submit Claim"
ClaimForm.handleFormSubmit -> api.createClaim({ policyId, memberId, claimType, amount, ... })
  |  POST /customer-beta/api/claims
api.tsx -> apiClient.post("/api/claims", data) -> returns new ClaimData
  |
ClaimForm -> refreshClaims() (re-fetches GET /customer-beta/api/claims from InsuranceContext)
           onSubmit() -> setShowForm(false) in ClaimsPage
  |
ClaimsPage -> re-renders, ClaimsTable now includes the new claim
```

### Flow 4: Marking an Alert as Read (Optimistic Update)

```
User navigates to /alerts
  |
AlertsPage -> useAlert() reads alerts, loading from InsuranceContext
            useEffect -> refreshAlerts() (re-fetches GET /customer-beta/api/alerts)
  |
renderAlertItem() -> unread alert rendered with "Mark as read" button
  |  User clicks "Mark as read"
AlertsPage.handleMarkRead(id) -> markAlertReadOptimistic(id) from useAlert()
  |
InsuranceContext.markAlertReadOptimistic(id):
  1. Saves originalAlerts = [...alerts]
  2. setAlerts(prev => prev.map(a => a.id === id ? {...a, read: true} : a))
     -> UI immediately shows alert as read (no spinner, no delay)
  3. await api.markAlertRead(id)
     -> PATCH /customer-beta/api/alerts/{id} with { read: true }
  4. On success: refreshAlerts() (re-syncs from server)
  5. On failure: setAlerts(originalAlerts) (rolls back the optimistic update)
```

---

## 5. Five-Minute Onboarding Summary

### The Big Picture

InsurePortal is a **read-heavy, form-light client portal**. Most of the time a user is browsing data fetched from a REST API (not stored locally). The app is a thin front-end: no backend code lives here. The heavy lifting -- policy management, claim processing, advisor assignment -- all happens in the LeadCRM system at `portal.leadcrm.in`.

### 3 Core Concepts to Understand First

**1. The Three Contexts = The Entire App State**

The app has no Redux, no Zustand. All state lives in three React Contexts nested inside `App.tsx`:
- **`BrandingContext`** -- who is this portal for? (the broker). Runs before login.
- **`MemberContext`** -- whose data are we looking at? A logged-in client has multiple family members. `selectedMemberId` (or `"all"`) drives every list filter everywhere.
- **`InsuranceContext`** -- the data lake. All policies, claims, endorsements, etc. live here. It fetches everything on mount, caches it, and provides typed refresh functions and computed counts. Contexts are loaded in this exact order because each one depends on the one above it.

**2. `apiClient.ts` is the Only Place that Touches `fetch`**

All HTTP traffic goes through `apiClient.ts`. It injects `Authorization: Bearer {token}` and `X-Org-Code: {orgCode}` headers automatically. It handles 401s globally (clears auth, redirects to `/`). Every other file uses `api.tsx`, which is a catalog of named async functions that call `apiClient`.

**3. Page Files are Thin Orchestrators**

Pages do not do much. A typical page: (a) wraps content in `<AppLayout>`, (b) reads a filtered list from a context hook, (c) renders `<FeatureTable>` or `<FeatureGrid>` or `<GridSkeleton>` depending on `loading`. The real UI is in the feature components under `src/components/{feature}/`.

### Recommended File Reading Order for a New Developer

1. `src/types/models.ts` -- understand all the data shapes first.
2. `src/services/apiClient.ts` -- understand how HTTP works in this app.
3. `src/services/api.tsx` -- understand what API operations are available.
4. `src/app/theme.ts` -- understand the colour palette (you'll see these colour codes everywhere).
5. `src/contexts/MemberContext.tsx` then `src/contexts/InsuranceContext.tsx` -- understand how state works.
6. `src/app/router.tsx` then `src/layouts/AppLayout.tsx` -- understand how pages are composed.
7. One complete page + its components, e.g.: `src/pages/Policies.tsx` -> `src/components/policies/PolicyGrid.tsx` -> `src/components/policies/PolicyCard.tsx` -> `src/components/policies/PolicyDetailModal.tsx`.
8. `src/pages/Login.tsx` -> `src/contexts/BrandingContext.tsx` -> `src/utils/orgUtils.ts` -- understand the auth and multi-tenancy flow.

---

## 6. Glossary

| Term | Definition |
|---|---|
| `orgCode` | Short string identifying the broker/tenant (e.g. `"marsh"`). Resolved from URL, subdomain, or localStorage. Sent as `X-Org-Code` header on every API request. |
| `selectedMemberId` | The currently active family member filter. The special value `"all"` means "show all members' data". Persisted to `localStorage`. |
| `activeMember` | The `Member` object for the currently selected member. When `selectedMemberId === "all"`, `activeMember` falls back to `members[0]`. |
| `InsuranceEntity` | Discriminated union type (PolicyData or ClaimData or EndorsementData or RequirementData). Used by `globalSearch`. Each type has an `entityType` field as its discriminant. |
| `entityType` | String literal field on each insurance data type (`"policy"`, `"claim"`, `"endorsement"`, `"requirement"`). Used as a TypeScript discriminant. |
| `cachedMembers` | Module-level array in `api.tsx` populated by `setCachedMembers()` (called by `MemberContext`). Lets `getMemberDisplayText()` resolve member names in non-React code (e.g., inside `PolicyCard`). |
| Optimistic update | Pattern used for alert read/unread and quote selection: state is mutated immediately for instant UI feedback, then the API call is made. On API failure, the original state is restored. See `markAlertReadOptimistic`. |
| `ProtectedRoute` / `PublicRoute` | Simple wrapper components in `router.tsx` that check `hasValidToken()` and redirect. Not React Router's nested layout pattern -- just conditional renders. |
| `AppLayout` | The authenticated page shell (Header + Sidebar + BottomNav + content area). Every protected page renders its children inside `<AppLayout>`. |
| `UiCard` | Reusable `Box` with a consistent white card style (border, borderRadius: 3, bgcolor: paper). Used as the base container for most content blocks. |
| `QontoStepper` | Custom-styled MUI Stepper used in `ClaimsTable` and `ClaimDetailModal` to show the claim's progress through steps. Styled connector and step icon are defined inline (duplicated across both files). |
| `hasValidToken()` | Function in `apiClient.ts` that checks `localStorage["token"]` for a non-empty, non-"undefined", non-"null" string. Used by route guards and context providers to decide whether to fetch data. |
| `refreshAll()` | Method on `InsuranceContext` that fires all seven entity refresh calls in parallel via `Promise.all`. Called on mount and when `selectedMemberId` changes. |
| `getAssetUrl(path)` | Function in `apiClient.ts` that prepends the API base URL to a relative asset path (e.g., a logo URL from the branding API). |
| `isExternal` / `"external"` status | A policy uploaded by the user from outside the broker's system. Displayed with a dashed border, a FileText icon, and a "Get Renewal Quote" button instead of "Certificate". |
| `statusMap` | Local `Record<string, {label, color, bg}>` objects defined per feature component. Maps API status strings to display labels and colours. Note: Status maps are also exported from `InsuranceContext` -- some components import from context, some define their own locally. |
| `portal_org_code` | The `localStorage` key where the active `orgCode` is persisted. Read by `orgUtils.ts` and written by `setStoredOrgCode()`. Also written directly by `Login.tsx` on successful login. |

---

## 7. Known Issues and Technical Debt

| # | Location | Issue |
|---|---|---|
| 1 | `src/App.tsx` + `src/main.tsx` | `ThemeProvider` is applied twice. The one in `App.tsx` is redundant. |
| 2 | `src/App.css` | Never imported anywhere. Dead file from Vite scaffold. Can be deleted. |
| 3 | `src/services/api.tsx` | `api.getInsuranceEntities()` is defined but never called. Dead code. |
| 4 | `src/contexts/InsuranceContext.tsx` | `searchQuery` state has no setter exposed; `globalSearch()` is never called by any component. |
| 5 | `src/contexts/InsuranceContext.tsx` | `getTicketsByMember()` ignores the `memberId` argument and always returns all tickets. |
| 6 | `src/components/claims/ClaimDetailModal.tsx` + `ClaimsTable.tsx` | `QontoConnector` and `QontoStepIconRoot` are defined identically in both files. Should be extracted to `src/components/shared/`. |
| 7 | `src/pages/Members.tsx` | "Sharma Family Group" is a hardcoded string. |
| 8 | `src/components/shared/Welcome.tsx` | "4 members . Rs.1.5 Cr" is a hardcoded string. |
| 9 | `src/components/tickets/TicketChatModal.tsx` | Attachment button triggers `alert()` (browser native dialog) instead of a proper UI message. |
| 10 | `src/components/upload/UploadedList.tsx` | "Delete" sets policy status to `"deleted"` via PUT rather than calling the DELETE endpoint. This soft-delete convention is non-obvious. |
| 11 | `src/services/apiClient.ts` | JWT stored in `localStorage` (XSS-accessible). A production hardening pass should consider `HttpOnly` cookies. |
| 12 | `src/app/router.tsx` | Route guards use a one-time `hasValidToken()` check. There is no reactive listener for cross-tab logout. |
| 13 | `vite.config.ts` | The same `icon-192.png` is listed twice in the PWA manifest (for `"any"` and `"maskable"` purpose). A dedicated maskable icon with safe-zone padding should be created. |
| 14 | `src/utils/orgUtils.ts` | Fallback org code is hardcoded to `"marsh"`. May surprise developers setting up a new white-label deployment. |
| 15 | `src/services/apiClient.ts` | Pagination headers (`X-Total-Count`, etc.) are parsed and attached to `ApiResponse.pagination` but no component reads or uses them. All lists load without pagination. |
