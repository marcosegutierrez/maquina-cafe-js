import { Router } from "express";
import { requireAdmin, requireAuth } from "../middlewares/auth.js";
import AuditLogMongo from "../persistence/mongodb/auditLog.mng.js";

const router = Router();
const AuditLogMng = new AuditLogMongo();

router.get('/', requireAuth, requireAdmin, async (req, res, next) => {
    try {
        const logs = await AuditLogMng.getAll();

        if (!logs || logs.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No se encontraron logs"
            });
        }
        return res.status(200).json({
            success: true,
            logs: logs
        });

    } catch (error) {
        next(error);
    }
});

export default router;
