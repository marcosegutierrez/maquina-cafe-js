import { OrderModel } from "./models/order.model.js";

export default class OrderManagerMongo {

    async getAll() {
        try {
            return await OrderModel.find({});
        } catch (error) {
            throw new Error(error);
        }
    }

    async getById(id) {
        try {
            return await OrderModel.findById(id);
        } catch (error) {
            throw new Error(error);
        }
    }

    async getByUserId(userId, page, limit, sort) {
        try {
            page = Number(page);
            limit = Number(limit);
            const total = await OrderModel.countDocuments({ userId });
            
            const userOrders = await OrderModel.find({ userId })
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
        } catch (error) {
            throw new Error(error);
        }
    }

    async create(newOrder, userId) {
        try {
            const obj = {
                drink: newOrder.drink,
                sugar: newOrder.sugar,
                userId: userId
            }
            return await OrderModel.create(obj);
        } catch (error) {
            throw new Error(error);
        }
    }

    async update(id, obj) {
        try {
            return await OrderModel.findByIdAndUpdate(id, obj, { new: true });
        } catch (error) {
            throw new Error(error);
        }
    }

    async delete(id) {
        try {
            return await OrderModel.findByIdAndDelete(id);
        } catch (error) {
            throw new Error(error);
        }
    }

}