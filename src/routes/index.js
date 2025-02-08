import { Router } from "express";

const router = Router();

router.get('/drinks', (req, res) => {
    res.render('drinks'); // => hbs template
})

router.post('/orders', (req, res) => {
    return res.status(200).json({
        body: req.body
    })
})

export default router;