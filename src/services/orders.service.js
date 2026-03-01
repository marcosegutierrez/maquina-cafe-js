import OrderManagerMongo from "../persistence/mongodb/order.mng.js";
import UserManagerMongo from "../persistence/mongodb/user.mng.js";
import { AppError } from "../utils/errors.js";

const OrderMng = new OrderManagerMongo();
const UserMng = new UserManagerMongo();

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

export const getOrders = async (userId) => {
    try {
        const orders = await OrderMng.getByUserId(userId);
        return orders;
    } catch (error) {
        console.error('[OrderService]', error);
        throw error;
    }
}

export const cancelOrder = async (orderId, userId) => {
    try {
        const order = await OrderMng.getById(orderId);

        if ( !order ) return null;
        if ( order.userId?.toString() !== userId ) return null;
        
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

export const deleteOrder = async (orderId) => {
    try {
        const order = await OrderMng.getById(orderId);

        if ( !order ) return null;
        
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