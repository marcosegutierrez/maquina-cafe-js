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

    async create(obj) {
        try {
            return await OrderModel.create(obj);
        } catch (error) {
            throw new Error(error);
        }
    }

    async update(id, obj) {
        try {
            return await OrderModel.findByIdAndUpdate(id, obj, {new: true});
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