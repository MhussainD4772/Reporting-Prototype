# Reporting Portal

Internal portal: list reports, open one, read the table.

## Prerequisites

[Docker](https://docs.docker.com/get-docker/) with Compose v2 (`docker compose`). That is the only install.

## Run

```bash
docker compose up --build
```

Open http://localhost

If port 80 is already in use, change the mapping in `docker-compose.yml`.

**Build time:** the first `docker compose up --build` downloads base images and Maven/npm dependencies — often **5–10 minutes** on a laptop, depending on network and CPU. Rebuilds reuse Docker layer and BuildKit caches and are usually much faster. On a low-RAM machine, build one service at a time: `docker compose build api && docker compose build web`.

## What you can do

- See the three reports on the landing page
- Filter that list by name
- Open a report and read the rows in a table
- Search inside a report (reaches the empty state if nothing matches)
- See loading and error states while data is fetched
- Go back to the landing page

## API

- `GET /api/reports` — list: `id`, `name`, `description`, `lastUpdated`
- `GET /api/reports/users` — users table: columns + rows
- `GET /api/reports/departments` — departments table: columns + rows
- `GET /api/reports/projects` — projects table: columns + rows

JSON is camelCase. Dates are ISO-8601 UTC.

## Architecture

Browser → nginx (`/` static React app, `/api` proxied) → Spring Boot → H2 (in-process) → JSON.

The UI is metadata-driven: one table component renders whatever `columns` and `rows` the API returns. Adding a report should not mean a new page. Today that is only half-true; see Known limitations. More detail: [ARCHITECTURE.md](ARCHITECTURE.md). Assumptions and tradeoffs: [ASSUMPTIONS.md](ASSUMPTIONS.md).

## Known limitations

The frontend allowlists report ids (`users` | `departments` | `projects`). An unknown route never calls the API; it shows a not-found screen locally. Adding a fourth report means a backend catalog change **and** a frontend allowlist change. Close it with `GET /api/reports/{id}`, HTTP 404 for unknown ids, and fetch whatever id is in the URL.

H2 is in-memory. Every process start reseeds mock data. Restarts wipe it. That is intentional for a read-only demo.

There is no authentication; it was out of scope for this assessment. In a real internal portal, reports would be access-controlled per user, and `GET /api/reports` would return only the catalog the caller is allowed to see.

## Without Docker

Needs Java 21 and Node 22. Run both:

```bash
cd backend && ./mvnw spring-boot:run
```

```bash
cd frontend && npm install && npm run dev
```

Open http://localhost:5173 — Vite proxies `/api` to http://localhost:8080.
