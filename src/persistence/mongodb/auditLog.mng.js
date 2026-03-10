import { AuditLogModel } from "./models/auditLog.model.js";

export default class AuditLogMongo {

    async create(log, userId) {
        try {
            const obj = {
                entity: log.entity,
                entityId: log.entityId,
                action: log.action,
                from: log.from,
                to: log.to,
                performedBy: userId,
                reason: log.reason
            }
            return await AuditLogModel.create(obj);
        } catch (error) {
            throw new Error(error);
        }
    }

    async getAll() {
        try {
            return await AuditLogModel.find({});
        } catch (error) {
            throw new Error(error);
        }
    }

}