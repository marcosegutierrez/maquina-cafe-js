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
        return res.status(200).json({
            body: req.body
        })
    } catch (error) {
        
    }
})

export default router;