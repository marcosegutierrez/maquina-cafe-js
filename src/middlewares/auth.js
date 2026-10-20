import { AppError } from "../utils/errors.js";
import UserRepository from "../persistence/mongodb/repositories/user.repository.js";
import { destroySession } from "../utils/session.js"

const UserMng = new UserRepository();

export const requireAuth = async (req, res, next) => {
    try {
        if (!req.session.userId) {
            throw new AppError('No autenticado', 401);
        }

        const last = req.session.lastActivity;
        const MAX_IDLE = 1000 * 60 * 15; // 15 min

        if (last && Date.now() - last > MAX_IDLE) {
            await destroySession(req);
            res.clearCookie("connect.sid");
            throw new AppError('Sesión expirada', 401);
        }

        const user = await UserMng.getById(req.session.userId);

        if (!user) {
            await destroySession(req);
            res.clearCookie("connect.sid");
            throw new AppError('Sesión inválida', 401);
        }

        req.session.lastActivity = Date.now();

        return next();
    } catch (error) {
        return next(error);
    }
};

export const requireAdmin = async (req, res, next) => {
    try {
        const user = await UserMng.getById(req.session.userId);

        if (!user) {
            throw new AppError("Usuario no encontrado", 401);
        }

        if (user.role !== "admin") {
            throw new AppError('No autorizado', 403);
        }

        next();
    } catch (error) {
        next(error);
    }
}