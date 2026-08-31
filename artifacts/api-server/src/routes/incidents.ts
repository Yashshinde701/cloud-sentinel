import { Router, type IRouter } from "express";
import {
  AcknowledgeIncidentParams,
  AcknowledgeIncidentResponse,
  ListIncidentsQueryParams,
  ListIncidentsResponse,
} from "@workspace/api-zod";
import { incidents } from "../lib/monitoring-data";

const router: IRouter = Router();

router.get("/incidents", (req, res) => {
  const { status } = ListIncidentsQueryParams.parse(req.query);
  const result = status === "all" ? incidents : incidents.filter((incident) => incident.status === status);
  res.json(ListIncidentsResponse.parse(result));
});

router.post("/incidents/:id/acknowledge", (req, res) => {
  const { id } = AcknowledgeIncidentParams.parse(req.params);
  const incident = incidents.find((item) => item.id === id);
  if (!incident) {
    res.status(404).json({ error: "Incident not found" });
    return;
  }

  incident.status = "acknowledged";
  res.json(AcknowledgeIncidentResponse.parse(incident));
});

export default router;