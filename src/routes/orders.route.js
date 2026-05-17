import { Router } from "express";
import { requireAdmin, requireAuth } from "../middlewares/auth.js";
import * as controllers from "../controllers/orders.controller.js";
import { userRateLimiter } from "../middlewares/rateLimit.js";
import { validateObjectId } from "../middlewares/validateObjectId.js";

const router = Router();

//Crea una orden
router.post('/', userRateLimiter, controllers.createOrder);

//Trae las ordenes de usuario logeado
router.get('/', requireAuth, userRateLimiter, controllers.getOrders);

//Traer todas las ordenes (Admin)
router.get('/all', requireAdmin, controllers.getAllOrders);

//Confirmación de orden
router.patch('/:id/confirm', validateObjectId(), requireAdmin, controllers.confirmOrder);

//Cancela orden
router.patch('/:id/cancel', validateObjectId(), requireAuth, userRateLimiter, controllers.cancelOrder);

//Eliminado lógico de orden
router.delete('/:id', validateObjectId(), requireAdmin, userRateLimiter, controllers.deleteOrder);

//Trae orden por id
router.get('/:id', validateObjectId(), requireAuth, userRateLimiter, controllers.getOrderById);

export default router;