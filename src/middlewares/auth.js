import { AppError } from "../utils/errors.js";
import UserRepository from "../persistence/mongodb/repositories/user.repository.js";
const UserMng = new UserRepository();

export const requireAuth = (req, res, next) => {
    const last = req.session.lastActivity;
    const MAX_IDLE = 1000 * 60 * 15; // 15 min

    if (!req.session.userId) {
        throw new AppError('No autenticado', 401);
    }

    if (last && Date.now() - last > MAX_IDLE) {
        req.session.destroy();
        throw new AppError('Sesión expirada', 401);
    }

    req.session.lastActivity = Date.now();

    next();
};

export const requireAdmin = async (req, res, next) => {
    try {
        if (!req.session?.userId) {
            return res.status(401).json({
                success: false,
                message: "No autenticado"
            });
        }

        const user = await UserMng.getById(req.session.userId);

        if (!user || user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "No autorizado"
            });
        }

        next();
    } catch (error) {
        next(error);
    }
}