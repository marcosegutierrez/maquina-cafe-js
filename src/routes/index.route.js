import { Router } from "express";
import ordersRoutes from './orders.route.js';
import usersRoutes from './users.route.js';
import auditsRoutes from './audits.route.js';


const router = Router();

router.use('/orders', ordersRoutes);
router.use('/users', usersRoutes);
router.use('/audits', auditsRoutes);

export default router;