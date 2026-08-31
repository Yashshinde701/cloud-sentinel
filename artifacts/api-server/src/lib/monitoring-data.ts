export type ServiceStatus = "healthy" | "warning" | "critical";
export type IncidentStatus = "open" | "acknowledged" | "resolved";
export type IncidentSeverity = "low" | "medium" | "high" | "critical";

export type Service = {
  id: string;
  name: string;
  environment: string;
  status: ServiceStatus;
  region: string;
  uptime: number;
  cpu: number;
  memory: number;
  requests: number;
};

export type Incident = {
  id: string;
  title: string;
  service: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  detectedAt: string;
  probability: number;
  impact: string;
  recommendedAction: string;
};

type MetricPoint = {
  time: string;
  cpu: number;
  memory: number;
  requests: number;
  latency: number;
};

const initialServices: Service[] = [
  {
    id: "svc-api",
    name: "api-gateway",
    environment: "production",
    status: "healthy",
    region: "ap-south-1",
    uptime: 99.98,
    cpu: 41,
    memory: 58,
    requests: 1240,
  },
  {
    id: "svc-checkout",
    name: "checkout-service",
    environment: "production",
    status: "warning",
    region: "us-east-1",
    uptime: 99.91,
    cpu: 68,
    memory: 72,
    requests: 842,
  },
  {
    id: "svc-worker",
    name: "event-worker",
    environment: "production",
    status: "healthy",
    region: "eu-west-1",
    uptime: 99.96,
    cpu: 34,
    memory: 49,
    requests: 620,
  },
  {
    id: "svc-search",
    name: "search-indexer",
    environment: "staging",
    status: "healthy",
    region: "ap-south-1",
    uptime: 99.87,
    cpu: 29,
    memory: 43,
    requests: 310,
  },
];

export const services = structuredClone(initialServices);

export const incidents: Incident[] = [
  {
    id: "inc-1042",
    title: "Checkout latency trending above SLO",
    service: "checkout-service",
    severity: "high",
    status: "open",
    detectedAt: "12 min ago",
    probability: 87,
    impact: "Elevated checkout failures in us-east-1",
    recommendedAction: "Scale checkout-service from 4 to 6 replicas",
  },
  {
    id: "inc-1041",
    title: "Memory pressure predicted on api-gateway",
    service: "api-gateway",
    severity: "medium",
    status: "acknowledged",
    detectedAt: "38 min ago",
    probability: 64,
    impact: "Potential increased GC pauses within 2 hours",
    recommendedAction: "Review the latest release allocation profile",
  },
  {
    id: "inc-1039",
    title: "Event worker recovered after queue burst",
    service: "event-worker",
    severity: "low",
    status: "resolved",
    detectedAt: "2 hr ago",
    probability: 92,
    impact: "Queue depth returned to normal",
    recommendedAction: "No action required",
  },
];

const activity = [
  {
    id: "act-1",
    type: "prediction" as const,
    title: "Forecast model updated",
    detail: "Checkout latency risk moved to 87% confidence",
    time: "4 min ago",
  },
  {
    id: "act-2",
    type: "incident" as const,
    title: "Incident opened",
    detail: "Checkout-service crossed predictive threshold",
    time: "12 min ago",
  },
  {
    id: "act-3",
    type: "deployment" as const,
    title: "Deployment completed",
    detail: "api-gateway v2.8.4 rolled out to production",
    time: "46 min ago",
  },
  {
    id: "act-4",
    type: "recovery" as const,
    title: "Service recovered",
    detail: "Event-worker queue depth is back within SLO",
    time: "2 hr ago",
  },
];

const metricCache = new Map<string, MetricPoint[]>();

function buildMetricPoints(service: Service, window: string): MetricPoint[] {
  const key = `${service.id}:${window}`;
  const cached = metricCache.get(key);
  if (cached) return cached;

  const count = window === "1h" ? 12 : window === "24h" ? 48 : 24;
  const points = Array.from({ length: count }, (_, index) => {
    const progress = index / Math.max(count - 1, 1);
    const wave = Math.sin(index * 0.7) * 4;
    const ramp = progress * (service.status === "warning" ? 17 : 4);
    const hour = new Date(Date.now() - (count - index) * (window === "24h" ? 30 : 10) * 60_000);
    return {
      time: hour.toISOString(),
      cpu: Math.max(8, Math.round(service.cpu - 12 + wave + ramp)),
      memory: Math.max(12, Math.round(service.memory - 10 + wave * 0.35 + ramp * 0.4)),
      requests: Math.max(80, Math.round(service.requests - 260 + index * 11 + wave * 13)),
      latency: Math.max(18, Math.round(72 + service.cpu * 0.3 + ramp * 1.8 + wave * 1.5)),
    };
  });
  metricCache.set(key, points);
  return points;
}

export function getMetricHistory(serviceId: string, window: string) {
  const service = services.find((item) => item.id === serviceId || item.name === serviceId) ?? services[0];
  return {
    service: service.name,
    window,
    points: buildMetricPoints(service, window),
  };
}

export function getOverview() {
  const warningCount = services.filter((service) => service.status !== "healthy").length;
  const predictions = [
    {
      metric: "checkout-service latency",
      value: warningCount ? 420 : 180,
      unit: "ms",
      horizon: "next 30 min",
      confidence: warningCount ? 87 : 78,
      direction: "up" as const,
      explanation: "Load pattern and queue depth indicate a sustained upward trend",
    },
    {
      metric: "api-gateway memory",
      value: services[0].memory + 11,
      unit: "%",
      horizon: "next 2 hours",
      confidence: 64,
      direction: "up" as const,
      explanation: "The model sees gradual allocation growth after the latest deployment",
    },
    {
      metric: "event-worker queue",
      value: 18,
      unit: "msgs",
      horizon: "next 60 min",
      confidence: 91,
      direction: "stable" as const,
      explanation: "Queue depth is oscillating inside its normal operating range",
    },
  ];

  return {
    systemStatus: warningCount > 1 ? ("critical" as const) : warningCount === 1 ? ("warning" as const) : ("healthy" as const),
    statusLabel: warningCount ? "Attention recommended" : "All systems operational",
    services: services.length,
    activeIncidents: incidents.filter((incident) => incident.status !== "resolved").length,
    predictionAccuracy: 94.2,
    predictions,
    activity,
    updatedAt: new Date().toISOString(),
  };
}

export function triggerSpike(serviceId: string, intensity: number) {
  const service = services.find((item) => item.id === serviceId || item.name === serviceId) ?? services[1];
  service.cpu = Math.min(99, service.cpu + Math.round(intensity * 0.3));
  service.memory = Math.min(99, service.memory + Math.round(intensity * 0.18));
  service.requests = service.requests + Math.round(intensity * 12);
  service.status = intensity > 65 ? "critical" : "warning";
  metricCache.clear();

  const existing = incidents.find(
    (incident) => incident.service === service.name && incident.status !== "resolved",
  );
  if (existing) {
    existing.probability = Math.min(99, existing.probability + 5);
  } else {
    incidents.unshift({
      id: `inc-${1043 + incidents.length}`,
      title: `${service.name} load spike detected`,
      service: service.name,
      severity: intensity > 65 ? "critical" : "high",
      status: "open",
      detectedAt: "just now",
      probability: Math.min(99, 70 + Math.round(intensity * 0.25)),
      impact: "Predicted saturation if the current traffic pattern continues",
      recommendedAction: `Scale ${service.name} before the next traffic window`,
    });
  }
  return getOverview();
}