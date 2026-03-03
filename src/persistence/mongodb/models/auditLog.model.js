import { Schema, model } from "mongoose";

const AuditLogSchema = new Schema({
    entity: {
        type: String,
        required: true,
        enum: ["order"], // Ampliación de audits
    },
    entityId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Order",
    },
    action: {
        type: String,
        required: true,
        enum: ["STATUS_CHANGE", "SOFT_DELETE", "RESTORE"],
    },
    from: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        required: true,
    },
    performedBy: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    reason: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
})