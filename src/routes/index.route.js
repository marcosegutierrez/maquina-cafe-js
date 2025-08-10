import { Router } from "express";
import * as controllers from "../controllers/index.controller.js";

const router = Router();

router.get('/drinks', (req, res) => {
    res.render('drinks'); // => hbs template
})

router.get('/search-order', (req, res) => {
    res.render('search-order'); // => hbs template
})

router.get('/login', (req, res) => {
    res.render('login');
})

router.get('/register', (req, res) => {
    res.render('register-data');
})

//POST
router.post('/orders', controllers.orders);

router.post('/order-found', controllers.orderFound);

router.post('/register', controllers.register);

router.post('/login', controllers.login);

router.post('/login-validator', controllers.loginValidator);

export default router;