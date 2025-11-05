import rateLimit from 'express-rate-limit';

export const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 5, // 5 intentos cada 15 min
    message: { error: 'Demasiados intentos de login, intenta más tarde.' },
    standardHeaders: true,
    legacyHeaders: false
})