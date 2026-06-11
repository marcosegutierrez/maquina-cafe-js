export const serializeOrder = (order) => {

    const serialized = {
        id: order._id,
        drink: order.drink,
        sugar: order.sugar,
        userId: order.userId,
        status: order.status,
        timestamp: order.timestampFormatted
    }

    if (order.deletedAt) {
        serialized.deletedAt = order.deletedAt;
    }

    return serialized;

};