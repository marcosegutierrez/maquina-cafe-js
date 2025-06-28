import { Router } from "express";
import * as controllers from "../controllers/index.controller.js";

const router = Router();

router.get('/drinks', (req, res) => {
    res.render('drinks'); // => hbs template
})

router.get('/search-order', (req, res) => {
    res.render('search-order'); // => hbs template
})

//POST
router.post('/orders', controllers.orders);

router.post('/order-found', controllers.orderFound);

export default router;