import { Router, type IRouter } from "express";
import {
  GetMetricHistoryQueryParams,
  GetMetricHistoryResponse,
  GetMonitoringOverviewResponse,
  ListServicesResponse,
} from "@workspace/api-zod";
import { getMetricHistory, getOverview, services } from "../lib/monitoring-data";

const router: IRouter = Router();

router.get("/monitoring/overview", (_req, res) => {
  res.json(GetMonitoringOverviewResponse.parse(getOverview()));
});

router.get("/monitoring/metrics", (req, res) => {
  const query = GetMetricHistoryQueryParams.parse(req.query);
  res.json(GetMetricHistoryResponse.parse(getMetricHistory(query.service, query.window)));
});

router.get("/services", (_req, res) => {
  res.json(ListServicesResponse.parse(services));
});

export default router;