import { Router } from "express";
import * as controllers from "../controllers/index.controller.js";
import { requireAuth } from "../middlewares/auth.js";
import { loginEmailValidator } from "../validators/login.validators.js";
import { loginRateLimiter } from "../middlewares/rateLimit.js";

const router = Router();

router.get('/login', (req, res) => {
    res.render('login');
})

router.get('/register', (req, res) => {
    res.render('register-data');
})

router.get('/profile', requireAuth, controllers.profile);

//POST

router.post('/register', controllers.register);

router.post('/login', loginRateLimiter, loginEmailValidator, controllers.login);

router.post('/login-validator', controllers.loginValidator);

router.post('/logout', controllers.logout);

export default router;