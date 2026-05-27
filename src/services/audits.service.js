import AuditLogMongo from '../persistence/mongodb/auditLog.mng.js';

const AuditLogMng = new AuditLogMongo();

export const getAuditsLogs = async (page = 1, limit = 10, sort = "-createdAt") => {
    try {
        const auditsLogs = await AuditLogMng.getAll(page, limit, sort);
        return auditsLogs;
    } catch (error) {
        console.error('[AuditsService]', error);
        throw error;
    }
}