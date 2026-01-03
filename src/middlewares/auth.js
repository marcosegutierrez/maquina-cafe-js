import { AppError } from "../utils/errors.js";

export const requireAuth = (req, res, next) => {
    const last = req.session.lastActivity;
    const MAX_IDLE = 1000 * 60 * 15; // 15 min

    if (!req.session.userId) {
        return res.status(401).json({
            success: false,
            message: "No autenticado"
        });
    }

    if (last && Date.now() - last > MAX_IDLE) {
        req.session.destroy();
        throw new AppError('Sesión expirada', 401);
    }

    req.session.lastActivity = Date.now();

    next();
};