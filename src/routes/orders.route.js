import { Router } from "express";
import { requireAdmin, requireAuth } from "../middlewares/auth.js";
import * as controllers from "../controllers/orders.controller.js";
import { userRateLimiter } from "../middlewares/rateLimit.js";

const router = Router();

//Crea una orden
router.post('/', userRateLimiter, controllers.createOrder);

//Trae las ordenes de usuario logeado
router.get('/', requireAuth, userRateLimiter, controllers.getOrders);

//Trae orden por id
router.get('/:id', userRateLimiter, controllers.getOrderById);

//Cancela orden
router.patch('/:id/cancel', requireAuth, userRateLimiter, controllers.cancelOrder);

//Eliminado lógico de orden
router.delete('/:id', requireAdmin, userRateLimiter, controllers.deleteOrder);

export default router;