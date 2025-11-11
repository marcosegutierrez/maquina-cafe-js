import { Router } from "express";
import * as controllers from "../controllers/index.controller.js";

const router = Router();

router.get('/', (req, res) => {
    res.render('drinks'); // => hbs template
});

export default router;