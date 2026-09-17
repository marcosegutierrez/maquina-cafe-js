import { Router } from "express";
import * as controllers from "../controllers/users.controller.js";
import { requireAuth } from "../middlewares/auth.js";
import { loginEmailValidator } from "../validators/login.validators.js";
import { registerValidator } from "../validators/register.validators.js";
import { loginRateLimiter, userRateLimiter } from "../middlewares/rateLimit.js";
import { protectLoginCode } from "../middlewares/loginBruteForce.js";

const router = Router();

router.get('/profile', requireAuth, userRateLimiter, controllers.profile);

//POST

router.post('/register', registerValidator, controllers.register);

router.post('/login', loginRateLimiter, loginEmailValidator, controllers.login);

router.post('/login-validator', protectLoginCode, controllers.loginValidator);

router.post('/logout', controllers.logout);

export default router;