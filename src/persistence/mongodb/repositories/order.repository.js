import { OrderModel } from "../models/order.model.js"
import { AppError } from "../../../utils/errors.js"

export default class OrderRepository {

    async getAll(page, limit, sort, status) {
        const allowedStatus = ["pending", "confirmed", "cancelled"]

        page = Number(page);
        limit = Number(limit);

        const query = {};

        if (status) {
            if (!allowedStatus.includes(status)) {
                throw new AppError("Estado inválido", 400);
            }

            query.status = status;
        }

        if (limit < 1) limit = 10;

        const total = await OrderModel.countDocuments(query);
        const search = await OrderModel.find(query)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit);

        const totalPages = Math.ceil(total / limit);

        const orders = {
            page,
            limit,
            total,
            totalPages,
            data: search
        };

        return orders;
    }

    async getById(id) {
        return await OrderModel.findById(id);
    }

    async getByUserId(userId, page, limit, sort) {
        page = Number(page);
        limit = Number(limit);
        const query = {
            userId,
            deletedAt: null
        }

        const total = await OrderModel.countDocuments(query);

        const userOrders = await OrderModel.find(query)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit);

        const totalPages = Math.ceil(total / limit);

        const orders = {
            page,
            limit,
            total,
            totalPages,
            data: userOrders
        };

        return orders;
    }

    async create(newOrder, userId) {
        const obj = {
            drink: newOrder.drink,
            sugar: newOrder.sugar,
            userId: userId
        }
        return await OrderModel.create(obj);
    }

    async update(id, obj) {
        return await OrderModel.findByIdAndUpdate(id, obj, { new: true });
    }

    async delete(id) {
        return await OrderModel.findByIdAndDelete(id);
    }

}