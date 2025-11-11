import { Router } from "express";
import ordersRoutes from './orders.route.js';
import drinksRoutes from './drinks.route.js';
import usersRoutes from './users.route.js';


const router = Router();

router.use('/orders', ordersRoutes);
router.use('/drinks', drinksRoutes);
router.use('/users', usersRoutes);

export default router;