import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

import * as controllers from "../controllers/index.controller.js";

router.get('/search-order', (req, res) => {
    res.render('search-order'); // => hbs template
})

router.get('/', requireAuth, controllers.orders);

// POST

router.post('/order', controllers.order);

router.post('/order-found', controllers.orderFound);

router.post('/order/:id/cancel', controllers.cancelOrder);

export default router;