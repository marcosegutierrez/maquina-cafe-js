import { Router } from "express";
import { requireAdmin, requireAuth } from "../middlewares/auth.js";
import * as controllers from '../controllers/audits.controller.js'

const router = Router();

router.get('/', requireAuth, requireAdmin, controllers.getAuditsLogs);

export default router;
