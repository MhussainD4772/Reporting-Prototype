# Architecture

How a request moves through the app, and why the folders look like this. Only what exists. Tradeoffs live in [ASSUMPTIONS.md](ASSUMPTIONS.md).

## Request flow

Compose (`docker compose up --build`):

```
Browser  http://localhost/
  → nginx (web)
       /           React SPA (React Router)
       /api/...    proxy → api:8080
  → ReportsController
  → ReportsService
       catalog (report metadata + column definitions)
       + JPA repositories (rows from H2)
  → JSON  →  cards or DataTable
```

Local dev: Vite on `:5173` proxies `/api` to `localhost:8080`. Same browser path, no nginx.

Startup of the API process:

```
ReportingApplication
  → Hibernate creates tables from @Entity classes
  → DataSeeder inserts mock users, departments, projects
```

H2 is in-memory (`jdbc:h2:mem:reporting`). Process exit wipes it; the next start seeds again.

## Why this shape

Three reports, four GET endpoints. Layers exist only where they earn a grade area.

| Layer | Owns | Does not |
|---|---|---|
| `web` | HTTP, response records | JPA |
| `service` | catalog + entity → row maps | HTTP types in persistence |
| `persistence` | entities, repositories, seeder | API DTOs |
| `pages` | screens | fetch |
| `hooks` | loading / error / ok | rendering tables |
| `components` | card, table, pill, search, error | API calls |
| `api` | TypeScript contract + `fetch` | UI state |

`web` never talks to JPA. `persistence` never returns `ReportDetail`. The service is the seam.

The table is generic: it renders `columns` + `rows`. It does not know “users” vs “projects”. The catalog of *which* reports exist is still duplicated on the frontend (`isReportId`). That gap is in Known limitations in the README.

## Backend

Base package: `com.enfos.reporting`. Report code lives under `report/`.

**HTTP** (`report/web`)

- `ReportsController` — four mappings only: `GET /api/reports`, `/api/reports/users|departments|projects`
- `ReportSummary` — landing list: `id`, `name`, `description`, `lastUpdated`
- `ColumnDefinition` — `key`, `label`, `type` (`string` | `number` | `date` | `datetime`)
- `ReportDetail` — summary + `columns` + `rows` (`List<Map<String, Object>>`). One JSON shape for every report

**Service** (`ReportsService`)

- In-code catalog is the source of truth for metadata and columns
- `listReports()` maps the catalog to summaries
- `getReport(id)` attaches rows, flattening associations to names (`manager`, `department`, `owner`)
- Unknown ids throw `IllegalArgumentException`. That path is not reachable over HTTP today: the controller never takes a path variable

**Persistence**

- `User` — string ids (`U-1001`). No associations. Users report uses `findAll()`
- `Department.manager` → `User` (lazy). `findAllWithManager()` join-fetches so manager names are not N+1
- `Project.department` → `Department`, `Project.owner` → `User`. `findAllWithDepartmentAndOwner()` join-fetches both. `endDate` is nullable
- `DataSeeder` (`ApplicationRunner`) — if `users` is empty: 25 users, 8 departments, 8 projects
- `open-in-view=false` — the HTTP request does not keep a Hibernate session; associations must be loaded in the query

**Build:** Java 21, Spring Boot 4.1.0, `webmvc` + `data-jpa` + H2. Context smoke test only; no payload assertions.

## Frontend

**Shell:** `App.tsx` — sticky header, `/` landing, `/reports/:id` table.

**Data**

- `api/types.ts` — mirrors the JSON. `isReportId()` allowlists `users | departments | projects`
- `api/client.ts` — `fetchReports` / `fetchReport`. Non-OK → `ApiError`. `AbortSignal` on unmount
- `useReports` / `useReport` — `loading` | `error` | `ok`. `retry` re-runs the fetch. No client cache: every visit starts loading

**Screens**

- `LandingPage` — client-side name filter, skeleton cards, error + Retry, empty search copy, card grid
- `ReportPage` — back link, title, row count, in-report search. Unknown allowlist id → not-found (no fetch). Empty dataset vs filter-empty (Clear search). Otherwise `DataTable`

**UI**

- `DataTable` — metadata-driven. Formats dates, status pills, `—` for nulls. Client-side column sort. Sticky header and sticky first column; horizontal scroll when the table is wider than the viewport
- `ReportCard`, `SearchField`, `StatusPill`, `ErrorPanel` — shared; no fetch inside

**Dev:** Vite proxies `/api` → `http://localhost:8080`. Theme tokens in `index.css`.

## Delivery

| File | Role |
|---|---|
| `docker-compose.yml` | `api` (internal 8080) + `web` (host port 80) |
| `backend/Dockerfile` | Maven package on JDK 21, run the jar on JRE 21 |
| `frontend/Dockerfile` | `npm ci` + `vite build`, nginx serves `dist` |
| `frontend/nginx.conf` | `/` → SPA (`try_files` so `/reports/:id` refresh works). `/api/` → `http://api:8080` |
