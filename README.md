# Cloud Sentinel

Cloud Sentinel is an AI-powered predictive cloud and server monitoring system for engineering teams. It combines live infrastructure health, explainable forecasts, anomaly signals, and incident response in one monitoring console.

## Features

- Live system health and service overview
- Predictive insights for latency, memory pressure, and queue stability
- Incident filtering and acknowledgement workflow
- Service registry with CPU, memory, uptime, region, and request metrics
- Metric history chart for selected services
- Traffic-spike simulator for demonstrating predictive alerts

## Stack

- React + Vite + TypeScript
- Express 5 API
- OpenAPI-generated typed React Query hooks
- Tailwind CSS and Recharts
- Explainable in-memory demo telemetry engine

## Run locally

```bash
pnpm install
pnpm --filter @workspace/api-server run dev
# In a second terminal, provide PORT and BASE_PATH for the frontend workflow:
pnpm --filter @workspace/cloud-sentinel run dev
```

This project currently uses simulated telemetry so it can be demonstrated without connecting to a specific cloud provider.
