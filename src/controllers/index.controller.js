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
        // if (userExist) res.cookie('usuario', email, { maxAge: 300000 }); // 5 min
        if (userExist) req.session.pendingEmail = email;
        if (!userExist) return res.render('login', { error: 'usuario inexistente' });
        res.render('login-code', { userExist });
    } catch (error) {
        console.log(error);
    }
}

export const loginValidator = async (req, res) => {
    try {
        const { access_code } = req.body;
        // const { usuario } = req.cookies;
        const { pendingEmail } = req.session;
        const user = await services.loginValidator(pendingEmail, access_code);
        if (user !== false) {
            req.session.userId = user._id;
            res.redirect('/drinks');
        } else {
            res.render('login');
        }
    } catch (error) {
        console.log(error);
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
            res.redirect('/login');
        });
    } catch (error) {
        console.log(error);
    }
}