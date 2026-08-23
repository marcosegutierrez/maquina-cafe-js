import { UserModel } from "../models/user.model.js";

export default class UserRepository {

    async create(obj) {
        return await UserModel.create(obj);
    }

    async getById(id) {
        return await UserModel.findById(id);
    }

    async getByEmail(email) {
        return await UserModel.findOne({ email: email })
    }

    async update(id, obj) {
        return await UserModel.findByIdAndUpdate(id, obj, { new: true });
    }

}