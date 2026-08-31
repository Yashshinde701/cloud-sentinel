import { Router, type IRouter } from "express";
import {
  TriggerTrafficSpikeBody,
  TriggerTrafficSpikeResponse,
} from "@workspace/api-zod";
import { triggerSpike } from "../lib/monitoring-data";

const router: IRouter = Router();

router.post("/simulations/spike", (req, res) => {
  const body = TriggerTrafficSpikeBody.parse(req.body);
  res.json(TriggerTrafficSpikeResponse.parse(triggerSpike(body.service, body.intensity)));
});

export default router;