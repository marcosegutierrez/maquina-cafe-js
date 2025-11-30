import { Router } from "express";

const router = Router();

router.get('/', (req, res) => {
    res.render('drinks'); // => hbs template
});

export default router;