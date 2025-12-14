import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import * as controllers from "../controllers/orders.controller.js";

const router = Router();

// //Ingresar id de orden a buscar
// router.get('/search-order', (req, res) => {
//     res.render('search-order'); // => hbs template
// })

//Trae las ordenes de usuario logado
router.get('/', requireAuth, controllers.getOrders);

//Trae orden por id
router.get('/:id', requireAuth, controllers.getOrderById);

// POST

//Crea una orden
router.post('/', controllers.createOrder);

//Trae orden encontrada
// router.post('/order-found', controllers.orderFound);

//Cancela orden
router.patch('/order/:id/cancel', requireAuth, controllers.cancelOrder);

export default router;