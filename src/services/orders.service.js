import OrderManagerMongo from "../persistence/mongodb/order.mng.js";

const OrderMng = new OrderManagerMongo();

export const order = async (newOrder, userId = null) => {
    try {
        const order = await OrderMng.create(newOrder, userId);
        console.log('New order:', order)

        const orderData = {
            drink: order.drink,
            sugar: `${order.sugar} cucharadas`,
            date: order.timestampFormatted,
            id: order.id,
            user: String(order.userId)
        };

        return orderData;

    } catch (error) {
        console.log(error);
    }
}

export const orderFound = async (orderToSearch) => {
    try {
        const order = await OrderMng.getById(orderToSearch);
        const orderData = {
            drink: order.drink,
            sugar: `${order.sugar} cucharadas`,
            date: order.timestampFormatted,
            id: order.id
        };
        return orderData;
    } catch (error) {
        console.log(error);
    }
}

export const orders = async (userId) => {
    try {
        const userOrders = await OrderMng.getByUserId(userId);

        const userOrdersFormatted = userOrders.map(order => ({
            drink: order.drink,
            sugar: order.sugar,
            date: order.timestampFormatted,
            id: order.id,
            user: String(order.userId),
            status: order.status
        }));

        return userOrdersFormatted;
    } catch (error) {
        console.log(error);
    }
}

export const cancelOrder = async (orderId, userId) => {
    try {
        const order = await OrderMng.cancelOrder(orderId,userId);
        if (!order) return false;
        order.status = 'cancelled';
        await order.save();
        return order;
    } catch (error) {
        
    }
}