import { Router, type IRouter } from "express";
import healthRouter from "./health";
import monitoringRouter from "./monitoring";
import incidentsRouter from "./incidents";
import simulationsRouter from "./simulations";

const router: IRouter = Router();

router.use(healthRouter);
router.use(monitoringRouter);
router.use(incidentsRouter);
router.use(simulationsRouter);

export default router;
