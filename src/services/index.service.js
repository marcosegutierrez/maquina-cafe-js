import OrderManagerMongo from "../persistence/mongodb/order.mng.js";
const OrderMng = new OrderManagerMongo();

export const orders = async (newOrder) => {
    try {
        const order = await OrderMng.create(newOrder);
        console.log('order:', order)

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