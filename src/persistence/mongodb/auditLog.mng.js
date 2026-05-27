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

    async getAll(page, limit, sort) {
        try {
            page = Number(page);
            limit = Number(limit);
            const total = await AuditLogModel.countDocuments({});

            const data = await AuditLogModel.find({})
                .sort(sort)
                .skip((page - 1) * limit)
                .limit(limit);

            const totalPages = Math.ceil(total / limit);

            const audits = {
                page,
                limit,
                total,
                totalPages,
                data
            };

            return audits;
            
        } catch (error) {
            throw new Error(error);
        }
    }

}