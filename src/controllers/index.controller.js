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
        res.render('register', { user });
    } catch (error) {
        console.log(error);
    }
}

export const login = async (req, res) => {
    try {
        const { email } = req.body;
        const userExist = await services.login(email);
        if (userExist) res.cookie('usuario', email , { maxAge: 300000 }); // 5 min
        res.render('login-code', { userExist });
    } catch (error) {
        console.log(error);
    }
}

export const loginValidator = async (req, res) => {
    try {
        const { access_code } = req.body;
        const { usuario } = req.cookies;
        const validation = await services.loginValidator(usuario, access_code);
        if (validation === true) {
            res.render('drinks');
        } else {
            res.render('login');
        }
    } catch (error) {
        console.log(error);
    }
}