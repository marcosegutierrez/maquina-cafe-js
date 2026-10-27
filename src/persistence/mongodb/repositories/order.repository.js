import { OrderModel } from "../models/order.model.js"
import { AppError } from "../../../utils/errors.js"

export default class OrderRepository {

    async getAll(page, limit, sort, status) {
        page = Number(page);
        limit = Number(limit);

        const query = {};

        if (status) query.status = status;

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

    async getById(id, { session } = {}) {
        return await OrderModel.findById(id).session(session ?? null);
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

    async update(id, obj, { session } = {}) {
        return await OrderModel.findByIdAndUpdate(id, obj, { new: true, session });
    }

    async delete(id) {
        return await OrderModel.findByIdAndDelete(id);
    }

}