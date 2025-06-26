import { Router } from "express";
import OrderManagerMongo from "../persistence/mongodb/order.mng.js";

const OrderMng = new OrderManagerMongo();

const router = Router();

router.get('/drinks', (req, res) => {
    res.render('drinks'); // => hbs template
})

router.get('/search-order', (req, res) => {
    res.render('search-order'); // => hbs template
})

//POST
router.post('/orders', async (req, res) => {
    try {
        const order = await OrderMng.create(req.body);
        console.log('order:', order)

        const orderData = {
            drink: order.drink,
            sugar: `${order.sugar} cucharadas`,
            date: order.timestampFormatted,
            id: order.id
          };
          
          res.render('order', orderData);
    } catch (error) {
        console.log(error);
    }
})

router.post('/order-found', async (req, res) => {
    try {
        const order = await OrderMng.getById(req.body.search_order);
        const orderData = {
            drink: order.drink,
            sugar: `${order.sugar} cucharadas`,
            date: order.timestampFormatted,
            id: order.id
          };
          
          res.render('order-found', orderData);
    } catch (error) {
        console.log(error);
    }
})

export default router;