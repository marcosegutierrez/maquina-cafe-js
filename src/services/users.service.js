import UserManagerMongo from "../persistence/mongodb/user.mng.js";
import { sendMail } from "./mailing.service.js";
import { generateCodeValidator } from "../utils.js";
import { AppError } from "../utils/errors.js";
import { LOGIN_SECURITY } from "../config.js";

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
        const expires = new Date(Date.now() + 5 * 60 * 1000);
        
        if ( userExist ) {
            const code = generateCodeValidator();
            await UserMng.update(userExist.id, {code, codeExpiresAt: expires});
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

        if ( userExist.lockUntil && userExist.lockUntil > Date.now()) {
            throw new AppError('Demasiados intentos fallidos. Intente más tarde.', 423);
        }

        if (Date.now() > userExist.codeExpiresAt) {
            throw new AppError('Código expirado', 401);
        }

        if ( !userExist ) {
            throw new AppError('El código o usuario no coincide', 401);
        } else if (userExist.code !== Number(access_code)) {
            UserMng.update(userExist._id, { loginAttempts: userExist.loginAttempts+1})
            
            if (userExist.loginAttempts >= LOGIN_SECURITY.MAX_ATTEMPTS) {
                UserMng.update(userExist._id, { lockUntil: Date.now() + LOGIN_SECURITY.BLOCK_TIME_MS })
            }

            throw new AppError('El código o usuario no coincide', 401);
        }

        await UserMng.update(userExist._id, { code: null, loginAttempts: 0});

        return userExist;
    } catch (error) {
        throw error;
    }
}