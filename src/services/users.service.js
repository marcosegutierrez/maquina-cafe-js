import UserManagerMongo from "../persistence/mongodb/user.mng.js";
import { sendMail } from "./mailing.service.js";
import { generateCodeValidator } from "../utils.js";
import { AppError } from "../utils/errors.js";

const UserMng = new UserManagerMongo();

export const register = async (data) => {
    try {
        const { email } = data;
        const userExist = await UserMng.getByEmail(email);

        if (userExist) {
            throw new AppError('Este usuario ya se encuentra registrado', 409);
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
        console.error('[UserService]', error);
        throw error;
    }
}

export const login = async (email) => {
    try {
        const userExist = await UserMng.getByEmail(email);
        
        if ( userExist ) {
            const code = generateCodeValidator();
            await UserMng.update(userExist.id, {code: code});
            await sendMail(userExist, 'login', code);
        }

        return userExist;
    } catch (error) {
        console.error('[UserService]', error);
        throw error;
    }
}

export const loginValidator = async (email, access_code) => {
    try {
        const userExist = await UserMng.getByEmail(email);

        if ( !userExist || userExist.code !== Number(access_code) ) {
            throw new AppError('Código inválido', 401);
        }

        await UserMng.update(userExist._id, { code: null});

        return userExist;
    } catch (error) {
        console.error('[UserService]', error);
        throw error;
    }
}