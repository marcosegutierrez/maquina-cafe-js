import OrderManagerMongo from "../persistence/mongodb/order.mng.js";

const OrderMng = new OrderManagerMongo();

export const createOrder = async (newOrder, userId = null) => {
    try {
        const order = await OrderMng.create(newOrder, userId);
        return order; // devolver entidad, no formateo
    } catch (error) {
        console.error('[OrderService]', error);
        throw error;
    }
}

export const getOrderById = async (orderId) => {
    try {
        const order = await OrderMng.getById(orderId);
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
        if ( order.status === 'cancelled' ) return null;
        
        order.status = 'cancelled';
        await order.save();
        return order;
    } catch (error) {
        console.error('[OrderService]', error);
        throw error;
    }
}