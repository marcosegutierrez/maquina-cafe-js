import * as services from "../services/users.service.js";
import { validationResult } from "express-validator";
import { AppError } from "../utils/errors.js";
import { LOGIN_SECURITY } from "../config.js";

export const register = async (req, res, next) => {
    try {
        const user = await services.register(req.body);

        return res.status(201).json({
            success: true,
            message: `Usuario registrado correctamente`,
            user: user
        });

    } catch (error) {
        next(error);
    }
}

export const login = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            throw new AppError('Email inválido', 400);
        }

        const { email } = req.body;
        const userExist = await services.login(email);

        if (!userExist) {
            throw new AppError('Usuario no encontrado', 401);
        }

        req.session.pendingEmail = email;

        return res.status(200).json({
            success: true,
            message: 'Código de acceso enviado por mail'
        });

    } catch (error) {
        next(error);
    }
}

export const loginValidator = async (req, res, next) => {
    try {
        const { access_code } = req.body;
        const { pendingEmail } = req.session;

        if (!pendingEmail) {
            throw new AppError('Sesión de login expirada', 400);
        }

        const user = await services.loginValidator(pendingEmail, access_code);

        //Login Ok
        req.session.loginAttempts = 0;
        req.session.blockedUntil = null;

        req.session.userId = user._id;
        delete req.session.pendingEmail;

        return res.status(200).json({
            success: true,
            message: 'Login Ok'
        });

    } catch (error) {

        req.session.loginAttempts = (req.session.loginAttempts || 0) + 1;

        if (req.session.loginAttempts >= LOGIN_SECURITY.MAX_ATTEMPTS) {
            req.session.blockedUntil = Date.now() + LOGIN_SECURITY.BLOCK_TIME_MS;
        }

        next(error);
    }
}

export const profile = async (req, res, next) => {
    try {

        return res.status(200).json({
            success: true,
            message: `Perfil del usuario con el id: ${req.session.userId}`
        });

    } catch (error) {
        next(error);
    }
}

export const logout = async (req, res, next) => {
    try {

        if (!req.session) {
            return res.status(200).json({
                success: true,
                message: 'No había sesión activa'
            });
        }

        req.session.destroy( err => {
            if (err) return next(err);

            res.clearCookie('connect.sid');
            return res.status(200).json({
                success: true,
                message: 'Sesión cerrada correctamente'
            });
        });
    } catch (error) {
        next(error);
    }
}