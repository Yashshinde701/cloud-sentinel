# Cloud Sentinel

Cloud Sentinel is an AI-powered cloud and server monitoring console that surfaces live infrastructure health, predictive capacity signals, and actionable incidents.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/cloud-sentinel/src/pages/` — overview, incidents, and services screens
- `artifacts/cloud-sentinel/src/components/sentinel-shell.tsx` — shared monitoring console shell
- `artifacts/api-server/src/lib/monitoring-data.ts` — demo telemetry, predictions, and incident state
- `artifacts/api-server/src/routes/` — monitoring, incident, simulation, and health endpoints
- `lib/api-spec/openapi.yaml` — source of truth for the typed API contract

## Architecture decisions

- Monitoring telemetry is represented as a deterministic in-memory demo stream so the project can be presented without connecting to a specific cloud provider.
- OpenAPI is the source of truth for the frontend hooks and server validation.
- The traffic spike simulator intentionally mutates the demo state so predictive warnings can be demonstrated live during a presentation.

## Product

- Live overview of system health, monitored services, active incidents, and model accuracy
- Predictive insights for latency, memory pressure, and queue stability
- Incident queue with filtering and acknowledgement
- Service registry with resource utilization and metric history
- Demo traffic-spike control for showing anomaly detection and forecast changes

## User preferences

No project-specific preferences recorded.

## Gotchas

- Regenerate the typed API client after changing `lib/api-spec/openapi.yaml`.
- The demo monitoring state resets when the API workflow restarts.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
