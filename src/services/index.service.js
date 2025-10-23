import OrderManagerMongo from "../persistence/mongodb/order.mng.js";
import UserManagerMongo from "../persistence/mongodb/user.mng.js";
import { sendMail } from "./mailing.service.js";
import { generateCodeValidator } from "../utils.js";

const OrderMng = new OrderManagerMongo();
const UserMng = new UserManagerMongo();

export const order = async (newOrder, userId = null) => {
    try {
        const order = await OrderMng.create(newOrder, userId);
        console.log('New order:', order)

        // console.log('user idddd: ', order.userId.toString())
        const orderData = {
            drink: order.drink,
            sugar: `${order.sugar} cucharadas`,
            date: order.timestampFormatted,
            id: order.id,
            user: String(order.userId)
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

export const register = async (data) => {
    try {
        const { email } = data;
        const userExist = await UserMng.getByEmail(email);
        if (userExist) {
            return false;
        }

        const user = await UserMng.create(data);
        
        const userData = {
            name: user.name,
            nickname: user.nickname,
            email: user.email,
            id: user.id
        }

        await sendMail(user, 'register');

        return userData;

    } catch (error) {
        console.log(error)
    }
}

export const login = async (email) => {
    try {
        const userExist = await UserMng.getByEmail(email);
        if (userExist) {
            const code = generateCodeValidator();
            await UserMng.update(userExist.id, {code: code});
            await sendMail(userExist, 'login', code);
            return userExist;
        }
        return false
    } catch (error) {
        console.log(error);
    }
}

export const loginValidator = async (email, access_code) => {
    try {
        const userExist = await UserMng.getByEmail(email);
        if (userExist) {
            if (userExist.code === Number(access_code)) {
                await UserMng.update(userExist._id, { code: null});
                return userExist;
            }
        }
        return false;
    } catch (error) {
        console.log(error);
    }
}

export const orders = async (userId) => {
    try {
        const userOrders = await OrderMng.getByUserId(userId);
        return userOrders;
    } catch (error) {
        console.log(error);
    }
}