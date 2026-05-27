import * as services from "../services/audits.service.js"

export const getAuditsLogs = async (req, res, next) => {
    try {
        const {page, limit, sort} = req.query;
        const logs = await services.getAuditsLogs(page, limit, sort);

        // Devuelve recurso existente vacío o con logs
        return res.status(200).json({
            success: true,
            logs: logs
        });

    } catch (error) {
        next(error);
    }
}