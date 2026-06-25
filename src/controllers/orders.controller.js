import * as services from "../services/orders.service.js";
import { serializeOrder } from "../serializers/order.serializer.js";

export const createOrder = async (req, res, next) => {
    try {
        let order;
        if ( req.session.userId ) {
            order = await services.createOrder(req.body, req.session.userId);
        } else {
            order = await services.createOrder(req.body); // Invitado
        }
        return res.status(201).json({
            success: true,
            message: "Orden creada exitosamente",
            order: serializeOrder(order)
        });
    } catch (error) {
        next(error);
    }
}

export const getOrders = async (req, res, next) => {
    try {
        const userId = req.session.userId;
        const {page, limit, sort} = req.query;
        const userOrders = await services.getOrders(userId, page, limit, sort);

        const serializedOrders = {
            ...userOrders,
            data: userOrders.data.map(order => serializeOrder(order))
        };
        
        return res.status(200).json({
            success: true,
            orders: serializedOrders
        });        
    } catch (error) {
        next(error);
    }
}

export const getAllOrders = async (req, res, next) => {
    try {
        const {page, limit, sort, status} = req.query;
        const orders = await services.getAllOrders(page, limit, sort, status);

        const serializedOrders = {
            ...orders,
            data: orders.data.map(order => serializeOrder(order))
        };

        return res.status(200).json({
            success: true,
            orders: serializedOrders
        }); 

    } catch (error) {
        next(error);
    }
}

export const getOrderById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { userId } = req.session;
        const order = await services.getOrderById(id, userId);
        if ( !order ) {
            return res.status(404).json({
                status: false,
                message: "Orden no encontrada o no disponible"
            });
        } 
        return res.status(200).json({
            success: true,
            order: serializeOrder(order)
        });
    } catch (error) {
        next(error);
    }
}

export const cancelOrder = async (req, res, next) => {
    try {
        const orderId = req.params.id;
        const userId = req.session.userId;
        const order = await services.cancelOrder(orderId, userId);
        if ( order === null ) {
            return res.status(404).json({
                success: false,
                message: "Orden no encontrada o no disponible"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Orden cancelada exitosamente"
        });
    } catch (error) {
        next(error);
    }
}

export const deleteOrder = async (req, res, next) => {
    try {
        const orderId = req.params.id;
        const userId = req.session.userId;
        const order = await services.deleteOrder(orderId, userId, req.body.reason);
        
        if ( order === null ) {
            return res.status(404).json({
                success: false,
                message: "Orden no encontrada o no disponible"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Orden eliminada exitosamente"
        });

    } catch (error) {
        next(error);
    }
}

export const confirmOrder = async (req, res, next) => {
    try {
        const orderId = req.params.id;
        const order = await services.confirmOrder(orderId);
        
        if ( order === null ) {
            return res.status(404).json({
                success: false,
                message: "Orden no encontrada o no disponible"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Orden confirmada exitosamente",
            order: serializeOrder(order)
        });
    } catch (error) {
        next(error);
    }
}