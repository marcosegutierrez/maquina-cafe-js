import * as services from "../services/index.service.js";
import { validationResult } from "express-validator";
import { AppError } from "../utils/errors.js";

export const order = async (req, res) => {
    try {
        let orderData;
        if ( req.session.userId ) {
            orderData = await services.order(req.body, req.session.userId);
        } else {
            orderData = await services.order(req.body);
        }
        res.render('order', orderData);
    } catch (error) {
        console.log(error);
    }
}

export const orderFound = async (req, res) => {
    try {
        const orderData = await services.orderFound(req.body.search_order);
        res.render('order-found', orderData);
    } catch (error) {
        console.log(error);
    }
}

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
        // if (userExist) res.cookie('usuario', email, { maxAge: 300000 }); // 5 min
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
        // const { usuario } = req.cookies;
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

export const orders = async (req, res) => {
    try {
        const userId = req.session.userId;
        const userOrders = await services.orders(userId);
        res.render('orders', {userOrders});
        // res.status(200).json(userOrders);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error al obtener las órdenes" });
    }
}

export const cancelOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const userId = req.session.userId;
        const order = await services.cancelOrder(orderId, userId);
        if (order === false) {
            return res.status(404).send('Orden no pertenece al usuario');
        }
        res.redirect('/orders/search-order');
    } catch (error) {
        console.log(error);
    }
}