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