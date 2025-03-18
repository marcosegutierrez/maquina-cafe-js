import { Router } from "express";
import OrderManagerMongo from "../persistence/mongodb/order.mng.js";

const OrderMng = new OrderManagerMongo();

const router = Router();

router.get('/drinks', (req, res) => {
    res.render('drinks'); // => hbs template
})

//POST
router.post('/orders', async (req, res) => {
    try {
        const order = await OrderMng.create(req.body);
        console.log('order:', order)

        const orderData = {
            drink: order.drink,
            sugar: `${order.sugar} cucharadas`,
            date: order.timestampFormatted
          };
          
          res.render('order', orderData);
    } catch (error) {
        
    }
})

export default router;