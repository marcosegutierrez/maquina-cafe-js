import OrderManagerMongo from "../persistence/mongodb/order.mng.js";
import UserManagerMongo from "../persistence/mongodb/user.mng.js";
import AuditLogMongo from "../persistence/mongodb/auditLog.mng.js";
import { AppError } from "../utils/errors.js";

const OrderMng = new OrderManagerMongo();
const UserMng = new UserManagerMongo();
const AuditLogMng = new AuditLogMongo();

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
        if (!userId) {
            throw new AppError("Debe ingresar con usuario logeado", 400);
        }

        const order = await OrderMng.getById(orderId);
        const user = await UserMng.getById(userId);
        
        if (!order) return null;

        if (user.role !== "admin") {
            if ( order.userId?.toString() !== userId ) return null;
            if ( order.deletedAt !== null ) return null;
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

        if ( !order ) return null;
        
        if (user.role !== "admin") {
            if ( order.userId?.toString() !== userId ) return null;
            if ( order.deletedAt !== null ) return null;
        }
        
        if ( order.status !== 'pending' ) {
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

export const deleteOrder = async (orderId, userId) => {
    try {
        const order = await OrderMng.getById(orderId);
        const user = await UserMng.getById(userId);
        
        if ( !order ) return null;
        if (user.role !== "admin") {
            throw new AppError("Acción solo permitida para administrador", 403);
        }
        
        const log = {
            entity: 'order',
            entityId: order._id,
            action: "SOFT_DELETE",
            from: order.status,
            to: "SOFT_DELETE",
            reason: "Borrado por motivo x"
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

        if (order.status !== 'pending') {
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