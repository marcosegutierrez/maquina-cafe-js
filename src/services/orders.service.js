import OrderRepository from "../persistence/mongodb/repositories/order.repository.js";
import UserRepository from "../persistence/mongodb/repositories/user.repository.js";
import AuditLogRepository from "../persistence/mongodb/repositories/auditLog.repository.js";
import { AppError } from "../utils/errors.js";

const OrderMng = new OrderRepository();
const UserMng = new UserRepository();
const AuditLogMng = new AuditLogRepository();

export const createOrder = async (newOrder, userId = null) => {
    try {
        const order = await OrderMng.create(newOrder, userId);
        return order; // devolver entidad, no formateo
    } catch (error) {
        console.error('[OrderService]', error);
        throw error;
    }
}

export const getOrderById = async (orderId, userId) => {
    try {
        const order = await OrderMng.getById(orderId);
        if (!order) return null;

        const user = await UserMng.getById(userId);

        if (user.role !== "admin") {
            if (order.userId?.toString() !== userId) return null;
            if (order.deletedAt !== null) return null;
        }
        return order;
    } catch (error) {
        console.error('[OrderService]', error);
        throw error;
    }
}

export const getOrders = async (userId, page = 1, limit = 10, sort = "-timestamp") => {
    try {
        const orders = await OrderMng.getByUserId(userId, page, limit, sort);
        return orders;
    } catch (error) {
        console.error('[OrderService]', error);
        throw error;
    }
}

export const getAllOrders = async (page = 1, limit = 10, sort = "-timestamp", status) => {
    try {
        const orders = await OrderMng.getAll(page, limit, sort, status);
        return orders;
    } catch (error) {
        console.error('[OrderService]', error);
        throw error;
    }
}

export const cancelOrder = async (orderId, userId) => {
    try {
        const order = await OrderMng.getById(orderId);
        const user = await UserMng.getById(userId);

        if (!order) return null;

        if (user.role !== "admin") {
            if (order.userId?.toString() !== userId) return null;
            if (order.deletedAt !== null) return null;
        }

        if (order.status !== 'pending') {
            if (order.status === 'cancelled') {
                return order;
            }
            throw new AppError("Solo se pueden cancelar órdenes pendientes", 400);
        }

        order.status = 'cancelled';
        await order.save();
        return order;
    } catch (error) {
        console.error('[OrderService]', error);
        throw error;
    }
}

export const deleteOrder = async (orderId, userId, reason) => {
    try {
        const order = await OrderMng.getById(orderId);
        const user = await UserMng.getById(userId);

        if (!order) return null;
        if (user.role !== "admin") {
            throw new AppError("Acción solo permitida para administrador", 403);
        }

        if (order.deletedAt) {
            return order;
        }

        const log = {
            entity: 'order',
            entityId: order._id,
            action: "SOFT_DELETE",
            from: order.status,
            to: "SOFT_DELETE",
            reason
        }

        await AuditLogMng.create(log, userId);

        order.deletedAt = Date.now();
        await order.save();
        return order;

    } catch (error) {
        console.error('[OrderService]', error);
        throw error;
    }
}

export const confirmOrder = async (orderId) => {
    try {
        const order = await OrderMng.getById(orderId);

        if (!order) return null;
        if (order.deletedAt) return null;

        if (order.status !== 'pending') {
            if (order.status === 'confirmed') return order;
            throw new AppError("Solo se pueden confirmar órdenes pendientes", 400);
        }

        order.status = 'confirmed';
        await order.save();
        return order;

    } catch (error) {
        console.error('[OrderService]', error);
        throw error;
    }
}