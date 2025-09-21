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

router.get('/profile', (req, res) => {
    if(!req.session.userId) return res.status(401).send('No autorizado');
    res.send(`Perfil del usuario con el id: ${req.session.userId}`);
})

//POST
router.post('/orders', controllers.orders);

router.post('/order-found', controllers.orderFound);

router.post('/register', controllers.register);

router.post('/login', controllers.login);

router.post('/login-validator', controllers.loginValidator);

router.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.send('Sesión cerrada');
    });
})

export default router;