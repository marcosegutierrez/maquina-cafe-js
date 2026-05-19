export const serializeOrder = (order) => ({
    id: order._id,
    drink: order.drink,
    sugar: order.sugar,
    userId: order.userId,
    status: order.status,
    timestamp: order.timestampFormatted
});