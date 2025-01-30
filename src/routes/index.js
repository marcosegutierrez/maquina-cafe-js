import { Router } from "express";

const router = Router();

router.get('/bebidas', (req, res) => {
    res.render('bebidas') // => hbs template
})

router.get('/azucar', (req, res) => {
    res.render('azucar') // => hbs template
})

export default router;