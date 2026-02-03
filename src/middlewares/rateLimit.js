import rateLimit from 'express-rate-limit';
const userRequests = new Map();

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

export const userRateLimiter = (req, res, next) => {
    if (!req.session?.userId) return next();

    const userId = req.session.userId;
    const now = Date.now();

    const limit = 100; // máximo 100 solicitudes por minuto
    const windowMs = 60 * 1000;

    const entry = userRequests.get(userId) || { count: 0, start: now };

    if (now - entry.start > windowMs) {
        entry.count = 0;
        entry.start = now;
    }

    entry.count++;

    userRequests.set(userId, entry);

    if (entry.count > limit) {
        return res.status(429).json({
            success: false, 
            message: 'Demasiadas solicitudes, intentá más tarde'
        });
    }

    next();
}