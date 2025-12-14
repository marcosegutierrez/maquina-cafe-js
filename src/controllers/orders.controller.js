import * as services from "../services/orders.service.js";

export const createOrder = async (req, res) => {
    try {
        let orderData;
        if ( req.session.userId ) {
            orderData = await services.createOrder(req.body, req.session.userId);
        } else {
            orderData = await services.createOrder(req.body); // Invitado
        }
        return res.status(201).json({
            success: true,
            message: "Orden creada exitosamente",
            order: orderData
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error al crear la orden"
        });
    }
}

//Revisar vista renderizada

// export const orderFound = async (req, res) => {
//     try {
//         const orderData = await services.orderFound(req.body.search_order);
//         res.render('order-found', orderData);
//     } catch (error) {
//         console.log(error);
//     }
// }

export const getOrders = async (req, res) => {
    try {
        const userId = req.session.userId;
        const userOrders = await services.getOrders(userId);
        if ( !userOrders || userOrders.length === 0 ) {
            return res.status(404).json({
                success: false,
                message: "No se encontraron órdenes"
            });
        }
        return res.status(200).json({
            success: true,
            orders: userOrders
        });        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error al obtener las órdenes"
        });
    }
}

export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await services.getOrderById(id);
        if ( !order ) {
            return res.status(404).json({
                status: false,
                message: "Orden no encontrada"
            });
        } 
        return res.status(200).json({
            success: true,
            message: "Error al obtener la orden"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error al obtener la orden"
        });
    }
}

export const cancelOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const userId = req.session.userId;
        const order = await services.cancelOrder(orderId, userId);
        if ( order === false ) {
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
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error al cancelar la orden"
        });
    }
}