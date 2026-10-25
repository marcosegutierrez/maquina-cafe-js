import { AuditLogModel } from "../models/auditLog.model.js";

export default class AuditLogRepository {

    async create(log, userId, { session } = {}) {
        const obj = {
            entity: log.entity,
            entityId: log.entityId,
            action: log.action,
            from: log.from,
            to: log.to,
            performedBy: userId,
            reason: log.reason
        }

        const auditLog = new AuditLogModel(obj);

        return await auditLog.save({ session });
    }

    async getAll(page, limit, sort) {
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
    }

}