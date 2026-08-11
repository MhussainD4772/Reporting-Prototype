# Assumptions and tradeoffs

What we assumed, what we chose, and what we rejected. Only decisions that exist in the code.

## Persistence: H2, not Postgres

**Assumed:** report data is mock, read-mostly, and does not need to survive a restart.

**Chose:** H2 in-memory inside the Spring Boot process, JPA entities, seed at startup.

**Rejected:** in-memory Java lists (skips schema, repositories, and SQL). PostgreSQL as a Compose service (image, credentials, readiness, extra network hop) without changing the JPA design we need to show.

**Tradeoff:** H2 is not a production datastore. Entities, repositories, and DTOs stay portable; swapping the datasource later is a config change, not a rewrite. Restarts wipe the database. That is intentional.

## Report metadata: catalog + `getReport(id)`

**Assumed:** three reports now, a fourth should not copy-paste a service method.

**Chose:** one in-code catalog (id, name, description, columns). `listReports()` and `getReport(id)` both read it.

**Rejected:** a method per report. A plugin/registry framework for three items.

**Tradeoff:** the assessment requires the three URLs. The controller still maps each path to `getReport("users")` (and the same for departments and projects). A path variable would make a fourth report catalog-only; we have not done that yet. See also Report ids below.

## Associations, not copied names

**Assumed:** Manager, Department, and Owner in the table are people/orgs that already exist as rows.

**Chose:** `Department.manager` → User, `Project.department` → Department, `Project.owner` → User. Lazy `@ManyToOne`. Report JSON still returns flat name strings, loaded with join fetch.

**Rejected:** denormalized `managerName` / `departmentName` strings on the child table.

**Tradeoff:** naive `findAll()` plus lazy associations is N+1. Loaders use join fetch so each report is one query.

## Delivery: two containers, one origin

**Assumed:** Docker is the only prerequisite; the reviewer opens one URL.

**Chose:** Compose runs the API and nginx. nginx serves the React build and proxies `/api` to Spring. Local Vite uses the same `/api` shape via a dev proxy.

**Rejected:** Spring serving `dist/` from the jar (Java becomes a static file server). Browser calling the API on a second origin (CORS + two URLs).

**Tradeoff:** one extra image and a small nginx config. `try_files` is what makes `/reports/:id` refresh work.

## UI: one table, not three pages

**Assumed:** column shape differs per report; the page should not.

**Chose:** metadata-driven `DataTable` (`columns` + `rows`). Tailwind v4 with tokens in CSS. Dark UI, no theme toggle. React Router for `/` and `/reports/:id`.

**Rejected:** a table component per report. MUI/Ant/shadcn. View switching with `useState` (no URL, back button breaks).

**Tradeoff:** utility classes in JSX are noisier than CSS modules. Two screens do not need a data router.

## Fetch: no client cache

**Assumed:** a reporting portal should show the current response, not a leftover table.

**Chose:** hooks start in `loading` and return to `loading` on every fetch (retry and id change included).

**Rejected:** stale-while-revalidate. React Query for three endpoints.

**Tradeoff:** navigating back to a report flashes skeletons. Fine on a local API; visible on a slow network.

## `lastUpdated` is a mock

**Assumed:** there is no real “report refreshed at” event. Rows appear when the process starts.

**Chose:** `Instant.now()` at class load, minus offsets (users 1 day, projects 6 days, departments 20 days). The UI still turns the ISO timestamp into relative copy.

**Rejected:** one timestamp for all three cards. Frozen calendar dates that look stale in a later demo. Three identical `now()` values (“Updated today” on every card).

**Tradeoff:** the offsets imply different refresh times the seed does not have. Labels stay distinct on every boot.

## Report ids: frontend allowlist

The table is generic. The list of which reports exist is not: the UI allowlists `users | departments | projects`. An unknown route never hits the API.

Adding a fourth report is a backend change **and** a frontend change. Close it with `GET /api/reports/{id}`, HTTP 404 for unknown ids, and fetch the id from the URL.

## Auth and pagination

No authentication. Out of scope. A real portal would filter `GET /api/reports` by the caller’s permissions.

No pagination API. Out of scope. Tables are small; sort and search are client-side.

## Narrow viewports

Landing stacks. The table keeps a real `<table>` and scrolls horizontally with a sticky first column. We did not build a card-per-row layout. Sort and column alignment stay one component.
