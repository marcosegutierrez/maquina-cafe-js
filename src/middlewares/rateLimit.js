import rateLimit from 'express-rate-limit';

export const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 5, // 5 intentos cada 15 min
    message: { error: 'Demasiados intentos de login, intenta más tarde.' },
    standardHeaders: true,
    legacyHeaders: false
});

export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    message: { sucess: false, msg: "Demasiadas solicitudes, inténtelo de nuevo más tarde."}
});