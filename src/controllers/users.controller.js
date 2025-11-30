import * as services from "../services/users.service.js";
import { validationResult } from "express-validator";
import { AppError } from "../utils/errors.js";

export const register = async (req, res) => {
    try {
        const user = await services.register(req.body);
        res.render('register', { user });
    } catch (error) {
        console.log(error);
    }
}

export const login = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        const { email } = req.body;
        const userExist = await services.login(email);
        if (userExist) req.session.pendingEmail = email;
        if (!userExist) {
            throw new AppError('Usuario no encontrado', 401);
        }
        res.render('login-code', { userExist });
    } catch (error) {
        next(error);
    }
}

export const loginValidator = async (req, res, next) => {
    try {
        const { access_code } = req.body;
        const { pendingEmail } = req.session;
        const user = await services.loginValidator(pendingEmail, access_code);
        if (user !== false) {
            req.session.userId = user._id;
            res.redirect('/drinks');
        } else {
            throw new AppError('El codigo o usuario no coincide', 401);
        }
    } catch (error) {
        next(error);
    }
}

export const profile = async (req, res) => {
    try {
        if (!req.session.userId) return res.status(401).send('No autorizado');
        const userId = req.session.userId;
        res.render('profile', { userId });
    } catch (error) {
        console.log(error);
    }
}

export const logout = async (req, res) => {
    try {
        req.session.destroy(() => {
            res.clearCookie('connect.sid');
            res.redirect('/users/login');
        });
    } catch (error) {
        console.log(error);
    }
}