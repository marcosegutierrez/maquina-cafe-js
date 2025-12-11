import * as services from "../services/orders.service.js";

export const createOrder = async (req, res) => {
    try {
        let orderData;
        if ( req.session.userId ) {
            orderData = await services.createOrder(req.body, req.session.userId);
        } else {
            orderData = await services.createOrder(req.body);
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

export const getOrders = async (req, res) => {
    try {
        const userId = req.session.userId;
        const userOrders = await services.getOrders(userId);
        res.render('orders', {userOrders});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error al obtener las órdenes" });
    }
}

export const getOrderById = async (req, res) => {
    try {
        const order = await services.getOrderById(req.body.search_order);
        return order;
    } catch (error) {
        console.log(error);
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