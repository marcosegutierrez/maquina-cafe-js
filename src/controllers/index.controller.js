import * as services from "../services/index.service.js";

export const orders = async (req, res) => {
    try {
        const orderData = await services.orders(req.body);
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
        res.render('register', user);
    } catch (error) {
        console.log(error);
    }
}

export const login = async (req, res) => {
    try {
        await services.login(req.body.email);
        res.render('login-code');
    } catch (error) {
        console.log(error);
    }
}

export const loginValidator = async (req, res) => {
    try {
        const { email , access_code } = req.body;
        const validation = await services.loginValidator(email, access_code);
        if (validation === true) {
            res.render('drinks');
        } else {
            res.render('login');
        }
    } catch (error) {
        console.log(error);
    }
}