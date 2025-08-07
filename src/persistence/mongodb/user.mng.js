import { UserModel } from "./models/user.model.js";

export default class UserManagerMongo {

    async create(obj) {
        try {
            return await UserModel.create(obj);
        } catch (error) {
            throw new Error(error);
        }
    }

    async getById(id) {
        try {
            return await UserModel.findById(id);
        } catch (error) {
            throw new Error(error);
        }
    }

    async getByEmail(email) {
        try {
            return await UserModel.findOne({ email: email })
        } catch (error) {
            throw new Error(error);
        }
    }

}