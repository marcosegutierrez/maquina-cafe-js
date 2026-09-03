import UserRepository from "../persistence/mongodb/repositories/user.repository.js";
import { sendMail } from "./mailing.service.js";
import { generateCodeValidator } from "../utils.js";
import { AppError } from "../utils/errors.js";
import { LOGIN_SECURITY } from "../config.js";
import { resetAttemptsIfExpired } from "./helpers/authAttempts.helper.js";

const UserMng = new UserRepository();

export const register = async (data) => {
    const { email } = data;
    const userExist = await UserMng.getByEmail(email);

    if (userExist) {
        throw new AppError('Este usuario ya se encuentra registrado', 409);
    }

    const user = await UserMng.create(data);

    await sendMail(user, 'register');

    return user;
}

export const login = async (email) => {
    const userExist = await UserMng.getByEmail(email);

    if (userExist) {
        if (userExist.lockUntil && userExist.lockUntil > Date.now()) {
            throw new AppError('Su cuenta está bloqueada debido a múltiples intentos fallidos. Intente nuevamente más tarde.', 423);
        }
        if (userExist.mailAttempts >= LOGIN_SECURITY.MAIL_ATTEMPTS) {
            await UserMng.update(userExist.id, { lockUntil: Date.now() + LOGIN_SECURITY.BLOCK_TIME_MS, mailAttempts: 0 });
            throw new AppError('Demasiados intentos de envío de código. Su cuenta ha sido bloqueada temporalmente.', 423);
        }

        resetAttemptsIfExpired(userExist);
        await userExist.save();

        if (!userExist.mailAttemptsAt) {
            await UserMng.update(userExist.id, { mailAttemptsAt: new Date() });
        }

        const code = generateCodeValidator();
        const expires = new Date(Date.now() + 5 * 60 * 1000);

        await userExist.registerMailAttempt();
        await UserMng.update(userExist.id, { code, codeExpiresAt: expires });
        await sendMail(userExist, 'login', code);
    }

    return userExist;
}

export const loginValidator = async (email, access_code) => {
    const userExist = await UserMng.getByEmail(email);

    if (!userExist) throw new AppError('El código o usuario no coincide', 401);

    resetAttemptsIfExpired(userExist);
    await userExist.save();

    if (!userExist.codeAttemptsAt) {
        await UserMng.update(userExist.id, { codeAttemptsAt: new Date() });
    }

    if (userExist.lockUntil) {
        if (userExist.lockUntil > Date.now()) {
            throw new AppError('Demasiados intentos fallidos. Intente más tarde.', 423);
        } else if (userExist.lockUntil <= Date.now()) {
            await UserMng.update(userExist._id, { codeAttempts: 0, lockUntil: null });
        }
    }

    if (Date.now() > userExist.codeExpiresAt) {
        await userExist.registerCodeAttempt();
        throw new AppError('Código expirado', 401);
    }

    if (userExist.code !== Number(access_code)) {
        await userExist.registerCodeAttempt();
        throw new AppError('El código o usuario no coincide', 401);
    }

    await UserMng.update(userExist._id, { code: null, codeAttempts: 0, mailAttempts: 0, lockUntil: null });

    return userExist;
}

export const profile = async (userId) => {
    const user = await UserMng.getById(userId);
    return user;
}