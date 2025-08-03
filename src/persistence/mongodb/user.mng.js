import { UserModel } from "./models/user.model.js";

export default class UserManagerMongo {

    async create(obj) {
        try {
            return await UserModel.create(obj);
        } catch (error) {
            throw new Error(error);
        }
    }

}