import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import * as controllers from "../controllers/orders.controller.js";
import { userRateLimiter } from "../middlewares/rateLimit.js";

const router = Router();

//Crea una orden
router.post('/', userRateLimiter, controllers.createOrder);

//Trae las ordenes de usuario logado
router.get('/', requireAuth, userRateLimiter, controllers.getOrders);

//Trae orden por id
router.get('/:id', userRateLimiter, controllers.getOrderById);

//Cancela orden
router.patch('/:id/cancel', requireAuth, userRateLimiter, controllers.cancelOrder);

export default router;