import { Router } from "express";
import { requireAdmin, requireAuth } from "../middlewares/auth.js";
import * as controllers from "../controllers/orders.controller.js";
import { userRateLimiter } from "../middlewares/rateLimit.js";
import { validateObjectId } from "../middlewares/validateObjectId.js";
import { createOrderValidator, deleteOrderValidator, paginationValidator, sortValidator, statusValidator } from "../validators/order.validators.js";
import { validateRequest } from "../middlewares/validateRequest.js";

const router = Router();

//Crea una orden
router.post('/', userRateLimiter, createOrderValidator, validateRequest, controllers.createOrder);

//Trae las ordenes de usuario logeado
router.get('/', requireAuth, userRateLimiter, paginationValidator, sortValidator, validateRequest, controllers.getOrders);

//Traer todas las ordenes (Admin)
router.get('/all', requireAuth, requireAdmin, paginationValidator, sortValidator, statusValidator,
    validateRequest, controllers.getAllOrders);

//Confirmación de orden
router.patch('/:id/confirm', validateObjectId(), requireAuth, requireAdmin, controllers.confirmOrder);

//Cancela orden
router.patch('/:id/cancel', validateObjectId(), requireAuth, userRateLimiter, controllers.cancelOrder);

//Eliminado lógico de orden
router.delete('/:id', validateObjectId(), requireAuth, requireAdmin, userRateLimiter,
    deleteOrderValidator, validateRequest, controllers.deleteOrder);

//Trae orden por id
router.get('/:id', validateObjectId(), requireAuth, userRateLimiter, controllers.getOrderById);

export default router;